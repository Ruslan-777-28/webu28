import { NextResponse, type NextRequest } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

/**
 * Public API for Community Architect assignments.
 * Returns ONLY safe public fields — strips notesInternal, assignedBy, blockedAt, blockedBy, blockReason.
 * 
 * Query params:
 *   ?userId=xxx — filter by specific user (for profile integration)
 */

const PUBLIC_SAFE_FIELDS = [
  'userId',
  'countryCode',
  'countryName',
  'categoryId',
  'categoryName',
  'subcategoryId',
  'subcategoryName',
  'publicTitle',
  'publicStatement',
  'isActive',
  'termStartAt',
  'termEndAt',
  'renewalCount',
  'isFeatured',
  'profileThemeEnabled',
  'profileThemeMode',
  'profileThemeUrl',
] as const;

function sanitizeAssignment(id: string, data: Record<string, any>) {
  const safe: Record<string, any> = { id };
  for (const field of PUBLIC_SAFE_FIELDS) {
    if (data[field] !== undefined) {
      // Convert Firestore Timestamps to ISO strings for JSON serialization
      const val = data[field];
      if (val && typeof val.toDate === 'function') {
        safe[field] = val.toDate().toISOString();
      } else {
        safe[field] = val;
      }
    }
  }
  return safe;
}

export async function GET(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let queryRef = adminDb
      .collection('communityArchitectAssignments')
      .where('isActive', '==', true)
      .where('isBlocked', '==', false);

    if (userId) {
      queryRef = queryRef.where('userId', '==', userId);
    }

    const snapshot = await queryRef.get();

    const assignments = snapshot.docs.map(doc => sanitizeAssignment(doc.id, doc.data()));

    // Enrich with user display data
    const userIds = [...new Set(assignments.map(a => a.userId as string))];
    const userMap: Record<string, { displayName?: string; avatarUrl?: string }> = {};

    await Promise.all(
      userIds.map(async (uid) => {
        try {
          const userDoc = await adminDb.collection('users').doc(uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            userMap[uid] = {
              displayName: userData?.displayName || userData?.name,
              avatarUrl: userData?.avatarUrl,
            };
          }
        } catch { /* skip */ }
      })
    );

    const enriched = assignments.map(a => ({
      ...a,
      userDisplayName: userMap[a.userId as string]?.displayName || 'Unknown',
      userAvatarUrl: userMap[a.userId as string]?.avatarUrl || null,
    }));

    return NextResponse.json({ success: true, data: enriched });
  } catch (error: any) {
    console.error('API community-architects error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch community architects.', error: error.message },
      { status: 500 }
    );
  }
}
