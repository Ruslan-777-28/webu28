import { NextResponse, type NextRequest } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyCouncilAccess } from '@/lib/council/access';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

/**
 * Toggles a vote on a thread.
 * Uses a deterministic vote ID: {threadId}_{uid} for idempotency.
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { uid } = await verifyCouncilAccess(req);
        const adminDb = getAdminDb();
        const threadId = params.id;
        const voteId = `${threadId}_${uid}`;

        const threadRef = adminDb.collection('architectCouncilThreads').doc(threadId);
        const voteRef = adminDb.collection('architectCouncilVotes').doc(voteId);

        const result = await adminDb.runTransaction(async (transaction) => {
            const threadDoc = await transaction.get(threadRef);
            if (!threadDoc.exists) {
                throw new Error('Thread not found');
            }

            const voteDoc = await transaction.get(voteRef);
            const isRemoving = voteDoc.exists;

            if (isRemoving) {
                transaction.delete(voteRef);
                transaction.update(threadRef, {
                    voteCount: FieldValue.increment(-1)
                });
            } else {
                transaction.set(voteRef, {
                    threadId,
                    uid,
                    createdAt: FieldValue.serverTimestamp()
                });
                transaction.update(threadRef, {
                    voteCount: FieldValue.increment(1)
                });
            }

            return { isRemoving };
        });

        return NextResponse.json({ 
            success: true, 
            action: result.isRemoving ? 'removed' : 'added' 
        });
    } catch (error: any) {
        console.error('API architect-council/threads/[id]/vote POST error:', error);
        const status = error.message === 'Thread not found' ? 404 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
