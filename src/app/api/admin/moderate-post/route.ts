import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { EditorialStatus, Post } from '@/lib/types';

interface ModeratePostRequestBody {
    postId: string;
    action: 'MARK_AS_UNDER_REVIEW' | 'REQUEST_CHANGES' | 'REJECT' | 'APPROVE_FOR_PUBLICATION';
    payload?: {
        revisionMessage?: string;
        moderationNotes?: string;
    };
}

export async function POST(req: NextRequest) {
    try {
        const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ success: false, message: 'Unauthorized: No token provided.' }, { status: 401 });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const isAdminOrModeratorOrEditor = decodedToken.admin === true || decodedToken.moderator === true || decodedToken.editor === true;

        if (!isAdminOrModeratorOrEditor) {
            return NextResponse.json({ success: false, message: 'Unauthorized: Caller does not have sufficient privileges.' }, { status: 403 });
        }

        const adminUid = decodedToken.uid;
        const adminName = decodedToken.name || decodedToken.email || adminUid;

        const { postId, action, payload } = (await req.json()) as ModeratePostRequestBody;
        if (!postId || !action) {
            return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
        }

        const postRef = adminDb.collection('posts').doc(postId);
        let updateData: any = {
            moderationUpdatedAt: FieldValue.serverTimestamp(),
            moderationUpdatedBy: adminUid,
        };
        let logAction = '';
        let logPayload: any = payload || {};

        switch (action) {
            case 'MARK_AS_UNDER_REVIEW':
                updateData.editorialStatus = 'under_review' as EditorialStatus;
                logAction = 'markAsUnderReview';
                break;
            
            case 'REQUEST_CHANGES':
                if (!payload?.revisionMessage) {
                    return NextResponse.json({ success: false, message: 'Revision message is required.' }, { status: 400 });
                }
                updateData.editorialStatus = 'changes_requested' as EditorialStatus;
                updateData.revisionRequested = true;
                updateData.revisionMessage = payload.revisionMessage;
                logAction = 'requestChanges';
                logPayload.message = payload.revisionMessage;
                break;

            case 'REJECT':
                 if (!payload?.moderationNotes) {
                    return NextResponse.json({ success: false, message: 'Rejection reason is required.' }, { status: 400 });
                }
                updateData.editorialStatus = 'rejected' as EditorialStatus;
                updateData.sitePublished = false;
                updateData.moderationNotes = payload.moderationNotes;
                logAction = 'rejectPost';
                logPayload.reason = payload.moderationNotes;
                break;

            case 'APPROVE_FOR_PUBLICATION':
                updateData.editorialStatus = 'published' as EditorialStatus;
                updateData.sitePublished = true;
                updateData.sitePublishedAt = FieldValue.serverTimestamp();
                updateData.publishedBy = adminUid;
                logAction = 'approvePost';
                break;

            default:
                return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
        }

        await postRef.update(updateData);

        const logRef = adminDb.collection('adminActions').doc();
        await logRef.set({
            targetType: 'post',
            targetId: postId,
            action: logAction,
            payload: logPayload,
            createdAt: FieldValue.serverTimestamp(),
            createdBy: adminUid,
            createdByName: adminName,
        });

        return NextResponse.json({ success: true, message: `Successfully performed action '${logAction}' on post ${postId}.` });

    } catch (error: any) {
        console.error('API moderate-post error:', error);
        return NextResponse.json({ success: false, message: 'Error moderating post.', error: error.message }, { status: 500 });
    }
}
