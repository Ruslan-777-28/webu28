import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { UserAccountStatus, UserProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface UpdateRequestBody {
    uid: string;
    action: 'SET_STATUS' | 'UPDATE_NOTES' | 'UPDATE_TRUST_OVERRIDE';
    payload: any;
}

export async function POST(req: NextRequest) {
    try {
        const adminAuth = getAdminAuth();
        const adminDb = getAdminDb();

        // 1. Verify the caller is an admin or moderator by checking their ID token.
        const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ success: false, message: 'Unauthorized: No token provided.' }, { status: 401 });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const isAdminOrModerator = decodedToken.admin === true || decodedToken.moderator === true;
        if (!isAdminOrModerator) {
            return NextResponse.json({ success: false, message: 'Unauthorized: Caller does not have sufficient privileges.' }, { status: 403 });
        }

        const adminUid = decodedToken.uid;
        const adminName = decodedToken.name || decodedToken.email || adminUid;

        // 2. Parse request body
        const { uid, action, payload } = (await req.json()) as UpdateRequestBody;
        if (!uid || !action || payload === undefined) {
            return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
        }

        const userRef = adminDb.collection('users').doc(uid);
        let updateData: any = {};
        let logAction = '';
        let logPayload: any = payload;

        // 3. Switch on action to prepare Firestore update and log data
        switch (action) {
            case 'SET_STATUS': {
                const status = payload.status as UserAccountStatus;
                if (!['active', 'limited', 'suspended', 'banned'].includes(status)) {
                    return NextResponse.json({ success: false, message: 'Invalid status value.' }, { status: 400 });
                }

                updateData.accountStatus = status;
                logAction = 'setStatus';
                logPayload = { status, reason: payload.reason };

                if (status === 'suspended') {
                    if (!payload.until) return NextResponse.json({ success: false, message: 'Suspension requires an `until` date.' }, { status: 400 });
                    updateData.suspension = {
                        isSuspended: true,
                        reason: payload.reason || 'No reason provided.',
                        until: new Date(payload.until),
                        setAt: FieldValue.serverTimestamp(),
                        setBy: adminUid,
                    };
                } else if (status === 'banned') {
                     updateData.suspension = {
                        isSuspended: true,
                        reason: payload.reason || 'User banned.',
                        until: null,
                        setAt: FieldValue.serverTimestamp(),
                        setBy: adminUid,
                    };
                } else if (status === 'active') {
                    // When unsuspending/unbanning, clear the suspension details
                    updateData.suspension = FieldValue.delete();
                }
                break;
            }

            case 'UPDATE_NOTES': {
                if (typeof payload.notes !== 'string') {
                    return NextResponse.json({ success: false, message: 'Invalid notes payload.' }, { status: 400 });
                }
                updateData['adminMeta.notes'] = payload.notes;
                updateData['adminMeta.lastReviewedAt'] = FieldValue.serverTimestamp();
                updateData['adminMeta.lastReviewedBy'] = adminUid;
                logAction = 'updateNotes';
                logPayload = { notes: payload.notes.substring(0, 100) + '...' }; // Log a snippet
                break;
            }

            case 'UPDATE_TRUST_OVERRIDE': {
                if (payload.enabled === undefined) {
                     return NextResponse.json({ success: false, message: 'Invalid override payload.' }, { status: 400 });
                }
                
                updateData['verification.manualOverride'] = {
                    enabled: payload.enabled,
                    trustLevel: payload.enabled ? (payload.trustLevel ?? 0) : null,
                    reason: payload.enabled ? (payload.reason ?? '') : null,
                    setBy: adminName,
                    setAt: FieldValue.serverTimestamp()
                };
                
                // If enabling override, we also update the effective trustLevel and internal publicState
                if (payload.enabled) {
                    const level = payload.trustLevel ?? 0;
                    updateData['verification.trustLevel'] = level;
                    
                    const states: Record<number, string> = {
                        0: 'none', 
                        1: 'confirmed_account', 
                        2: 'verified_identity', 
                        3: 'active_professional', 
                        4: 'platform_verified'
                    };
                    updateData['verification.publicTrustState'] = states[level] || 'none';
                }
                
                updateData['verification.verificationSyncedAt'] = FieldValue.serverTimestamp();
                
                logAction = 'updateTrustOverride';
                logPayload = {
                    enabled: payload.enabled,
                    trustLevel: payload.enabled ? (payload.trustLevel ?? 0) : null,
                    reason: payload.enabled ? (payload.reason ?? '') : null
                };
                break;
            }

            default:
                return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
        }

        // 4. Perform Firestore update
        await userRef.update(updateData);

        // 5. Create adminActions log entry
        const logRef = adminDb.collection('adminActions').doc();
        const logEntry: Record<string, any> = {
            targetType: 'user',
            targetId: uid,
            action: logAction,
            payload: logPayload,
            createdAt: FieldValue.serverTimestamp(),
            createdBy: adminUid,
            createdByName: adminName,
        };
        // Only include reason if it's actually present in the payload
        if (payload.reason !== undefined) {
            logEntry.reason = payload.reason;
        }
        await logRef.set(logEntry);

        // 6. Return success
        return NextResponse.json({ success: true, message: `Successfully performed action '${logAction}' on user ${uid}.` });

    } catch (error: any) {
        console.error('API update-user error:', error);
        return NextResponse.json({ success: false, message: 'Error updating user.', error: error.message }, { status: 500 });
    }
}
