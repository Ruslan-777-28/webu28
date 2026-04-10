import { NextResponse, type NextRequest } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyCouncilAccess } from '@/lib/council/access';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await verifyCouncilAccess(req);
        const adminDb = getAdminDb();
        const threadId = params.id;

        const snapshot = await adminDb.collection('architectCouncilThreads')
            .doc(threadId)
            .collection('comments')
            .where('isDeleted', '==', false)
            .orderBy('createdAt', 'asc')
            .get();

        const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()?.toISOString(),
            updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
        }));

        return NextResponse.json({ success: true, data: comments });
    } catch (error: any) {
        console.error('API architect-council/threads/[id]/comments GET error:', error);
        const status = error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { uid } = await verifyCouncilAccess(req);
        const adminDb = getAdminDb();
        const threadId = params.id;
        const { body } = await req.json();

        if (!body) {
            return NextResponse.json({ success: false, message: 'Comment body required' }, { status: 400 });
        }

        const threadRef = adminDb.collection('architectCouncilThreads').doc(threadId);
        const threadDoc = await threadRef.get();

        if (!threadDoc.exists) {
             return NextResponse.json({ success: false, message: 'Thread not found' }, { status: 404 });
        }

        if (threadDoc.data()?.isLocked) {
             return NextResponse.json({ success: false, message: 'Thread is locked' }, { status: 403 });
        }

        // Get author data
        const userDoc = await adminDb.collection('users').doc(uid).get();
        const userData = userDoc.data();

        const commentData = {
            threadId,
            authorUid: uid,
            authorName: userData?.displayName || userData?.name || 'Unknown',
            authorAvatarUrl: userData?.avatarUrl || null,
            body,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            isDeleted: false,
        };

        const batch = adminDb.batch();
        const newCommentRef = threadRef.collection('comments').doc();
        batch.set(newCommentRef, commentData);
        batch.update(threadRef, {
            commentCount: FieldValue.increment(1),
            lastActivityAt: FieldValue.serverTimestamp(),
            lastCommentAt: FieldValue.serverTimestamp(),
            lastCommentBy: uid
        });

        await batch.commit();

        return NextResponse.json({ success: true, id: newCommentRef.id });
    } catch (error: any) {
        console.error('API architect-council/threads/[id]/comments POST error:', error);
        const status = error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
