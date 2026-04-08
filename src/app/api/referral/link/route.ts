import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const adminAuth = getAdminAuth();
        const adminDb = getAdminDb();

        // 1. Verify the caller is authenticated via Firebase ID token
        const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ success: false, message: 'Unauthorized: No token provided.' }, { status: 401 });
        }

        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(idToken);
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Unauthorized: Invalid token.' }, { status: 401 });
        }

        const referredUid = decodedToken.uid;

        // 2. Parse request body
        const { promoCode } = await req.json();
        if (!promoCode || typeof promoCode !== 'string') {
            return NextResponse.json({ success: false, message: 'Invalid request: promoCode is required.' }, { status: 400 });
        }

        const normalizedCode = promoCode.trim().toUpperCase();
        if (!normalizedCode) {
            return NextResponse.json({ success: false, message: 'Invalid request: promoCode is empty.' }, { status: 400 });
        }

        // 3. Check for self-referral (prevents using own code)
        const referredUserDoc = await adminDb.collection('users').doc(referredUid).get();
        if (!referredUserDoc.exists) {
             return NextResponse.json({ success: false, message: 'Referred user not found.' }, { status: 404 });
        }
        
        const referredUserData = referredUserDoc.data();
        if (referredUserData?.referralCode === normalizedCode || referredUid.slice(-6).toUpperCase() === normalizedCode) {
            return NextResponse.json({ success: false, message: 'Self-referral is not allowed.' }, { status: 400 });
        }

        // 4. Check if already linked and rewarded (idempotency check)
        const referralLinkRef = adminDb.collection('referrals').doc(referredUid);
        const existingLink = await referralLinkRef.get();
        if (existingLink.exists && existingLink.data()?.signupBonusAwarded) {
            return NextResponse.json({ 
                success: true, 
                message: 'Referral linkage already exists and bonus already awarded.',
                isDuplicate: true 
            });
        }

        // 5. Find referrer by referralCode
        const referrerQuery = await adminDb.collection('users').where('referralCode', '==', normalizedCode).limit(1).get();
        if (referrerQuery.empty) {
            return NextResponse.json({ success: false, message: 'Invalid promo code: referrer not found.' }, { status: 400 });
        }

        const referrerDocId = referrerQuery.docs[0].id;
        const referrerUid = referrerDocId;

        // 6. Perform atomic update using a transaction
        await adminDb.runTransaction(async (transaction) => {
            const referralLinkDoc = await transaction.get(referralLinkRef);
            
            // Re-check linkage within transaction to prevent race conditions
            if (referralLinkDoc.exists && referralLinkDoc.data()?.signupBonusAwarded) {
                return;
            }

            // Get referrer doc to update balances
            const referrerRef = adminDb.collection('users').doc(referrerUid);
            const referrerDoc = await transaction.get(referrerRef);
            const referrerData = referrerDoc.data() || {};
            
            // Handle missing balance fields (default to 0)
            const currentBonusBalance = referrerData.bonusBalance || 0;
            const currentReferralCredits = referrerData.referralCreditsEarned || 0;

            // 1. Create/Update referral linkage document
            transaction.set(referralLinkRef, {
                referredUid: referredUid,
                referrerUid: referrerUid,
                codeUsed: normalizedCode,
                status: 'linked',
                source: 'site_signup',
                signupBonusAwarded: true,
                activationBonusAwarded: false,
                createdAt: FieldValue.serverTimestamp(),
            }, { merge: true });

            // 2. Update referrer's balances (+3)
            transaction.update(referrerRef, {
                bonusBalance: currentBonusBalance + 3,
                referralCreditsEarned: currentReferralCredits + 3
            });

            // 3. Create deterministic bonus ledger entry
            // This ensures we can never create the same reward twice even if the transaction is retried
            const ledgerRef = adminDb.collection('bonusLedger').doc(`signup_${referredUid}`);
            transaction.set(ledgerRef, {
                uid: referrerUid,
                kind: 'referral_signup_bonus',
                amount: 3,
                source: 'referral_program',
                referralId: referredUid,
                createdAt: FieldValue.serverTimestamp(),
            });

            // 4. Create notification for referrer using corrected shared contract
            const notificationRef = adminDb.collection('notifications').doc();
            transaction.set(notificationRef, {
                uid: referrerUid,
                channel: 'user',
                kind: 'referral_signup_bonus',
                title: 'Новий бонус!',
                body: `Ваш промокод використано! Нараховано +3 бонусних кредити.`,
                readAt: null,
                createdAt: FieldValue.serverTimestamp(),
                data: {
                    referredUid: referredUid,
                    kind: 'signup'
                }
            });

            // 5. Update referred user's usedReferralCode record
            transaction.update(adminDb.collection('users').doc(referredUid), {
                usedReferralCode: normalizedCode
            });
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Referral linkage and signup bonus successful.',
            data: {
                referredUid,
                referrerUid,
                codeUsed: normalizedCode,
                reward: 3
            }
        });

    } catch (error: any) {
        console.error('API referral-link error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Internal server error during referral linkage.',
            error: error.message 
        }, { status: 500 });
    }
}
