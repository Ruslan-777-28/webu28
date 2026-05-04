import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

/**
 * POST /api/forum/moderate
 * Server-side forum moderation endpoint.
 * Allows admins and community architects to update question status.
 * Architects can only moderate questions in their assigned subcategories.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token!);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;

    const body = await req.json();
    const { questionId, newStatus, action, role } = body;

    if (!questionId || !newStatus || !action) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const validStatuses = ['pending', 'open', 'answered', 'featured', 'hidden', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    // Get the question to validate
    const questionRef = adminDb.collection('forumQuestions').doc(questionId);
    const questionSnap = await questionRef.get();

    if (!questionSnap.exists) {
      return NextResponse.json({ success: false, message: 'Question not found' }, { status: 404 });
    }

    const questionData = questionSnap.data()!;

    // Authorization check
    if (!isAdmin) {
      const { getCanonicalTopic, isTopicMatch } = await import('@/lib/forum/topic-normalization');
      
      // Must be an architect with an active assignment for this question's topic
      const assignmentsSnap = await adminDb.collection('communityArchitectAssignments')
        .where('userId', '==', uid)
        .get();

      const architectAllowedTopics: string[] = [];
      assignmentsSnap.docs.forEach(d => {
        const data = d.data();
        if (data.isActive !== false && data.isBlocked !== true) {
          if (data.subcategoryId) architectAllowedTopics.push(data.subcategoryId);
          if (data.subcategoryKey) architectAllowedTopics.push(data.subcategoryKey);
          if (data.topicKey) architectAllowedTopics.push(data.topicKey);
          if (data.subcategoryLabel) architectAllowedTopics.push(data.subcategoryLabel);
        }
      });

      const hasMatch = isTopicMatch(
        questionData.topicKey,
        questionData.topicLabel,
        architectAllowedTopics
      );

      if (!hasMatch) {
        return NextResponse.json({
          success: false,
          message: 'No active architect assignment for this topic',
          debug: {
            questionTopic: questionData.topicKey,
            questionLabel: questionData.topicLabel,
            architectTopics: architectAllowedTopics
          }
        }, { status: 403 });
      }
    }

    // Get moderator display name
    const userSnap = await adminDb.collection('users').doc(uid).get();
    const userName = userSnap.exists
      ? (userSnap.data()?.displayName || userSnap.data()?.name || decodedToken.email || 'Unknown')
      : (decodedToken.email || 'Unknown');

    // Perform the update
    const updateData: any = {
      status: newStatus,
      updatedAt: FieldValue.serverTimestamp(),
      moderatedAt: FieldValue.serverTimestamp(),
      moderatedBy: uid,
      moderatedByName: userName,
      moderatedByRole: isAdmin ? 'admin' : 'architect',
      moderationAction: action,
    };

    // Add architect-specific metadata
    if (!isAdmin) {
      updateData.moderatedByArchitectTopicKey = questionData.topicKey;
      updateData.moderatedByArchitectTopicLabel = questionData.topicLabel || '';
    }

    // Handle featured/pinned status
    if (newStatus === 'featured') {
      updateData.featured = true;
    } else {
      updateData.featured = false;
    }

    await questionRef.update(updateData);

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error: any) {
    console.error('Forum moderation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
