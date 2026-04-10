import { NextResponse, type NextRequest } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyCouncilAccess } from '@/lib/council/access';
import { FieldValue } from 'firebase-admin/firestore';
import type { CouncilThreadStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { uid, isAdmin } = await verifyCouncilAccess(req);
        const adminDb = getAdminDb();
        const threadId = params.id;

        const doc = await adminDb.collection('architectCouncilThreads').doc(threadId).get();
        if (!doc.exists) {
            return NextResponse.json({ success: false, message: 'Thread not found' }, { status: 404 });
        }

        const data = doc.data();
        const thread = {
            id: doc.id,
            ...data,
            createdAt: data?.createdAt?.toDate()?.toISOString(),
            updatedAt: data?.updatedAt?.toDate()?.toISOString(),
            lastActivityAt: data?.lastActivityAt?.toDate()?.toISOString(),
            lastCommentAt: data?.lastCommentAt?.toDate()?.toISOString(),
        };

        return NextResponse.json({ success: true, data: thread });
    } catch (error: any) {
        console.error('API architect-council/threads/[id] GET error:', error);
        const status = error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { uid, isAdmin } = await verifyCouncilAccess(req);
        const adminDb = getAdminDb();
        const threadId = params.id;
        const body = await req.json();

        // Admin-only controls check
        if (!isAdmin) {
             return NextResponse.json({ success: false, message: 'Forbidden: Admin access required for modification' }, { status: 403 });
        }

        const allowedFields = ['isPinned', 'isLocked', 'status', 'type', 'isAnnouncement'];
        const updateData: any = {
            updatedAt: FieldValue.serverTimestamp()
        };

        let hasUpdates = false;
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
                hasUpdates = true;
            }
        }

        if (!hasUpdates) {
            return NextResponse.json({ success: false, message: 'No valid update fields provided' }, { status: 400 });
        }

        await adminDb.collection('architectCouncilThreads').doc(threadId).update(updateData);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API architect-council/threads/[id] PATCH error:', error);
        const status = error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ success: false, message: error.message }, { status });
    }
}
