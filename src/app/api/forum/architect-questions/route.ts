import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import type { ForumQuestion } from '@/lib/forum/forum-types';
import type { CommunityArchitectAssignment } from '@/lib/types';

export const dynamic = 'force-dynamic';

import { getCanonicalTopic, normalizeTopicKey } from '@/lib/forum/topic-normalization';

type ArchitectAssignmentData = {
  id?: string;
  userId?: string;
  architectUid?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  subcategoryId?: string;
  subcategoryKey?: string;
  subcategoryName?: string;
  subcategoryLabel?: string;
  topicKey?: string;
  topicLabel?: string;
  categoryLabel?: string;
  [key: string]: unknown;
};

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await getAdminAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') || 'all';

    const db = getAdminDb();

    // 2. Get Architect Assignments
    const assignmentsSnap = await db.collection('communityArchitectAssignments')
      .where('userId', '==', uid)
      .get();

    const rawAssignments = assignmentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as ArchitectAssignmentData));
    const assignments = rawAssignments.filter(a => a.isActive !== false && a.isBlocked !== true);

    if (assignments.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [], 
        debug: { uid, topicKeys: [], message: 'No active assignments found', rawAssignments } 
      });
    }

    // 3. Collect and normalize topic keys
    const rawTopicKeys: string[] = [];
    const canonicalKeys = new Set<string>();
    
    assignments.forEach(a => {
      const candidates = [
        a.subcategoryId,
        a.subcategoryKey,
        a.topicKey,
        a.subcategoryLabel,
        a.categoryLabel
      ].filter((c): c is string => typeof c === 'string');

      candidates.forEach(c => {
        rawTopicKeys.push(c);
        canonicalKeys.add(getCanonicalTopic(c));
      });
    });

    const architectCanonicalKeys = Array.from(canonicalKeys);

    // 4. Fetch Questions
    const questionsSnap = await db.collection('forumQuestions').get();

    const allQuestions: ForumQuestion[] = questionsSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as ForumQuestion));

    // 5. JS Filtering & Sorting
    const debugItems: any[] = [];
    
    const filtered = allQuestions.filter(q => {
      const qCandidates = [
        q.topicKey,
        q.topicLabel,
        normalizeTopicKey(q.topicKey),
        normalizeTopicKey(q.topicLabel)
      ].filter(Boolean);

      const qCanonicalKeys = qCandidates.map(c => getCanonicalTopic(c));
      const isMyTopic = qCanonicalKeys.some(ck => architectCanonicalKeys.includes(ck));
      
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      
      const match = isMyTopic && matchesStatus;

      // Log details for each question if no matches or in dev
      debugItems.push({
        id: q.id,
        title: q.title,
        status: q.status,
        topicKey: q.topicKey,
        topicLabel: q.topicLabel,
        qCanonicalKeys,
        isMyTopic,
        matchesStatus,
        match
      });

      return match;
    });

    // Sort by createdAtMs (desc) or lastActivityAt
    filtered.sort((a, b) => {
      const timeA = a.createdAtMs || (a.createdAt as any)?.toMillis?.() || 0;
      const timeB = b.createdAtMs || (b.createdAt as any)?.toMillis?.() || 0;
      return timeB - timeA;
    });

    return NextResponse.json({
      success: true,
      data: filtered,
      debug: {
        uid,
        architectCanonicalKeys,
        rawTopicKeys,
        assignments: assignments.map(a => ({ 
          id: a.id, 
          subcategoryId: a.subcategoryId, 
          subcategoryName: a.subcategoryName,
          subcategoryKey: a.subcategoryKey 
        })),
        allQuestionsSummary: debugItems.slice(0, 50), // Sample for brevity
        matchingTopicCount: filtered.length,
        returnedCount: filtered.length,
        reason: filtered.length === 0 ? 'No questions matched the architect topics and status filter' : undefined
      }
    });

  } catch (error: any) {
    console.error('API architect-questions error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
