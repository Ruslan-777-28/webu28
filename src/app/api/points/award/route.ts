import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { calculateProfileCompletion } from '@/lib/utils/profile-completion';
/**
 * @deprecated This route is part of the legacy manual bonus awarding system.
 * New implementations should use shared Cloud Functions (e.g., checkProfileBonusMilestones)
 * or rely on backend Firestore triggers (e.g., onPostCreatedBonus).
 */

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const adminAuth = getAdminAuth();
        const adminDb = getAdminDb();
        
        console.warn(`[DEPRECATED] API /api/points/award called. UID verification follows.`);

        // 1. Verify Authentication
        const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(idToken);
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }

        const uid = decodedToken.uid;
        const { kind } = await req.json();
        console.warn(`[DEPRECATED] API /api/points/award called. Kind: ${kind}. UID verification follows.`);
        
        if (!kind) {
            return NextResponse.json({ success: false, message: 'Kind is required' }, { status: 400 });
        }

        const results: any[] = [];

        await adminDb.runTransaction(async (transaction) => {
            const userRef = adminDb.collection('users').doc(uid);
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw new Error('User not found');
            const userData = userDoc.data() || {};

            if (kind === 'check_milestones') {
                // 1. Load offers for completion calculation
                const offersSnap = await adminDb.collection('communicationOffers')
                    .where('ownerId', '==', uid)
                    .where('status', '==', 'active')
                    .get();
                const offers = offersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

                // 2. Calculate completion
                const { percentage } = calculateProfileCompletion(userData as any, offers);

                const milestones = [
                    { threshold: 50, id: 'profile_50', amount: 10, label: '50% профілю' },
                    { threshold: 75, id: 'profile_75', amount: 15, label: '75% профілю' },
                    { threshold: 90, id: 'profile_90', amount: 20, label: '90% профілю' },
                ];

                let totalNewBonus = 0;

                for (const m of milestones) {
                    if (percentage >= m.threshold) {
                        const ledgerId = `${m.id}_${uid}`;
                        const ledgerRef = adminDb.collection('bonusLedger').doc(ledgerId);
                        const ledgerDoc = await transaction.get(ledgerRef);

                        if (!ledgerDoc.exists) {
                            // Award milestone
                            transaction.set(ledgerRef, {
                                uid: uid,
                                kind: m.id,
                                amount: m.amount,
                                source: 'profile_completion',
                                createdAt: FieldValue.serverTimestamp(),
                            });
                            totalNewBonus += m.amount;
                            results.push({ kind: m.id, amount: m.amount });

                            // Create notification
                            const notifRef = adminDb.collection('notifications').doc();
                            transaction.set(notifRef, {
                                uid: uid,
                                channel: 'user',
                                kind: 'bonus_milestone',
                                title: 'Нове досягнення!',
                                body: `Ваш профіль наповнено на ${m.threshold}%. Нараховано +${m.amount} бонусних балів.`,
                                readAt: null,
                                createdAt: FieldValue.serverTimestamp(),
                                data: { milestone: m.threshold }
                            });
                        }
                    }
                }

                // 3. Handle Referral Activation Bonus (Referrer gets +5 if referred user reaches 50%)
                if (percentage >= 50) {
                    const referralRef = adminDb.collection('referrals').doc(uid);
                    const referralDoc = await transaction.get(referralRef);

                    if (referralDoc.exists) {
                        const refData = referralDoc.data();
                        if (refData && !refData.activationBonusAwarded) {
                            const referrerUid = refData.referrerUid;
                            const activationLedgerId = `activation_${uid}`;
                            const activationLedgerRef = adminDb.collection('bonusLedger').doc(activationLedgerId);
                            const actLedgerDoc = await transaction.get(activationLedgerRef);

                            if (!actLedgerDoc.exists) {
                                // 1. Award +5 to referrer
                                const referrerRef = adminDb.collection('users').doc(referrerUid);
                                const referrerDoc = await transaction.get(referrerRef);
                                if (referrerDoc.exists) {
                                    const rData = referrerDoc.data() || {};
                                    transaction.update(referrerRef, {
                                        bonusBalance: (rData.bonusBalance || 0) + 5,
                                        referralCreditsEarned: (rData.referralCreditsEarned || 0) + 5
                                    });

                                    // 2. Ledger for referrer
                                    transaction.set(activationLedgerRef, {
                                        uid: referrerUid,
                                        kind: 'referral_activation_bonus',
                                        amount: 5,
                                        source: 'referral_program',
                                        referralId: uid,
                                        createdAt: FieldValue.serverTimestamp(),
                                    });

                                    // 3. Mark activation awarded on referral link
                                    transaction.update(referralRef, {
                                        activationBonusAwarded: true
                                    });

                                    // 4. Notification for referrer
                                    const refNotifRef = adminDb.collection('notifications').doc();
                                    transaction.set(refNotifRef, {
                                        uid: referrerUid,
                                        channel: 'user',
                                        kind: 'referral_activation_bonus',
                                        title: 'Партнерська активація',
                                        body: `Ваш партнер успішно активувався в екосистемі. Вам нараховано +5 балів.`,
                                        readAt: null,
                                        createdAt: FieldValue.serverTimestamp(),
                                        data: { activatedUid: uid }
                                    });
                                }
                            }
                        }
                    }
                }

                if (totalNewBonus > 0) {
                    transaction.update(userRef, {
                        bonusBalance: (userData.bonusBalance || 0) + totalNewBonus
                    });
                }

            } else if (kind === 'first_post_bonus') {
                const ledgerId = `first_post_${uid}`;
                const ledgerRef = adminDb.collection('bonusLedger').doc(ledgerId);
                const ledgerDoc = await transaction.get(ledgerRef);

                if (!ledgerDoc.exists) {
                    const amount = 10;
                    transaction.set(ledgerRef, {
                        uid: uid,
                        kind: 'first_post_bonus',
                        amount: amount,
                        source: 'content_creation',
                        createdAt: FieldValue.serverTimestamp(),
                    });

                    transaction.update(userRef, {
                        bonusBalance: (userData.bonusBalance || 0) + amount
                    });

                    results.push({ kind: 'first_post_bonus', amount });

                    // Notification
                    const notifRef = adminDb.collection('notifications').doc();
                    transaction.set(notifRef, {
                        uid: uid,
                        channel: 'user',
                        kind: 'bonus_first_post',
                        title: 'Перший внесок',
                        body: `Вітаємо з першою публікацією у блозі! Нараховано +${amount} балів.`,
                        readAt: null,
                        createdAt: FieldValue.serverTimestamp(),
                    });
                }
            }
        });

        return NextResponse.json({
            success: true,
            awarded: results
        });

    } catch (error: any) {
        console.error('Points award error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
