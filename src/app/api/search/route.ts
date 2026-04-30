import { NextResponse, type NextRequest } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const RESULTS_LIMIT = 30;
const MIN_QUERY_LENGTH = 2;

/**
 * Public Search API — V1 MVP
 * 
 * Supports two scopes:
 *   ?scope=profiles — search users collection
 *   ?scope=posts    — search posts collection (public content only)
 * 
 * Uses existing Firestore collections. No new collections created.
 * Text matching is server-side (Firestore doesn't support full-text search).
 */

// ─── Profile Search ─────────────────────────────────────────────────────────

interface ProfileResult {
  uid: string;
  name: string;
  displayName?: string;
  avatarUrl?: string;
  shortBio?: string;
  bio?: string;
  country?: string;
  preferredLanguage?: string;
  hasActiveOffers?: boolean;
}

async function searchProfiles(params: URLSearchParams): Promise<{ results: ProfileResult[]; total: number }> {
  const adminDb = getAdminDb();
  const q = (params.get('q') || '').toLowerCase().trim();
  const category = params.get('category') || '';
  const subcategory = params.get('subcategory') || '';
  const language = params.get('language') || '';
  const country = params.get('country') || '';
  const hasOffers = params.get('hasOffers') === 'true';

  if (q.length < MIN_QUERY_LENGTH) {
    return { results: [], total: 0 };
  }

  // Fetch users — limit to a reasonable batch for V1
  const usersSnap = await adminDb.collection('users').limit(500).get();

  // Build active-offer user set if needed
  let activeOfferUserIds: Set<string> | null = null;
  if (hasOffers) {
    const offersSnap = await adminDb.collection('communicationOffers')
      .where('status', '==', 'active')
      .select('ownerId')
      .get();
    activeOfferUserIds = new Set(offersSnap.docs.map(d => d.data().ownerId as string));
  }

  const results: ProfileResult[] = [];

  for (const doc of usersSnap.docs) {
    const data = doc.data();

    // Skip service/empty accounts
    if (!data.name && !data.displayName) continue;
    if (data.accountStatus === 'banned' || data.accountStatus === 'suspended') continue;
    if (data.suspension?.isSuspended) continue;

    // Text match
    const searchable = [
      data.name || '',
      data.displayName || '',
      data.shortBio || '',
      data.bio || '',
      data.country || '',
    ].join(' ').toLowerCase();

    if (!searchable.includes(q)) continue;

    // Category/subcategory filter via profileMetrics.professional
    if (subcategory && data.profileMetrics?.professional) {
      if (!data.profileMetrics.professional[subcategory]) continue;
    } else if (category && data.profileMetrics?.professional) {
      // For category-level filter, we'd need category->subcategory mapping
      // For V1, skip this advanced filter if only category is provided
    }

    // Language filter
    if (language && data.preferredLanguage !== language) continue;

    // Country filter
    if (country && data.country !== country) continue;

    // Active offers filter
    if (hasOffers && activeOfferUserIds && !activeOfferUserIds.has(doc.id)) continue;

    results.push({
      uid: doc.id,
      name: data.name || '',
      displayName: data.displayName || undefined,
      avatarUrl: data.avatarUrl || undefined,
      shortBio: data.shortBio || data.bio || undefined,
      country: data.country || undefined,
      preferredLanguage: data.preferredLanguage || undefined,
      hasActiveOffers: activeOfferUserIds ? activeOfferUserIds.has(doc.id) : undefined,
    });

    if (results.length >= RESULTS_LIMIT) break;
  }

  return { results, total: results.length };
}

// ─── Post Search ─────────────────────────────────────────────────────────────

interface PostResult {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  categoryId: string;
  subcategoryId?: string;
  contentType: string;
  views?: number;
  publishedAt?: string;
  tags?: string[];
}

async function searchPosts(params: URLSearchParams): Promise<{ results: PostResult[]; total: number }> {
  const adminDb = getAdminDb();
  const q = (params.get('q') || '').toLowerCase().trim();
  const category = params.get('category') || '';
  const subcategory = params.get('subcategory') || '';
  const type = params.get('type') || 'all'; // 'all' | 'blog' | 'post'
  const author = (params.get('author') || '').toLowerCase().trim();
  const sort = params.get('sort') || 'relevance'; // 'relevance' | 'newest' | 'popular'

  if (q.length < MIN_QUERY_LENGTH) {
    return { results: [], total: 0 };
  }

  // Fetch published blog posts
  const queries: Promise<FirebaseFirestore.QuerySnapshot>[] = [];

  if (type === 'all' || type === 'blog') {
    queries.push(
      adminDb.collection('posts')
        .where('contentType', '==', 'blog')
        .where('status', '==', 'published')
        .limit(300)
        .get()
    );
  }

  if (type === 'all' || type === 'post') {
    queries.push(
      adminDb.collection('posts')
        .where('contentType', '==', 'post')
        .where('sitePublished', '==', true)
        .limit(300)
        .get()
    );
  }

  const snapshots = await Promise.all(queries);
  const allDocs = snapshots.flatMap(s => s.docs);

  // Deduplicate by ID
  const seen = new Set<string>();
  const uniqueDocs = allDocs.filter(doc => {
    if (seen.has(doc.id)) return false;
    seen.add(doc.id);
    return true;
  });

  let results: PostResult[] = [];

  for (const doc of uniqueDocs) {
    const data = doc.data();

    // Skip non-public content safety check
    if (data.editorialStatus && !['published'].includes(data.editorialStatus)) {
      if (data.contentType === 'blog') continue;
    }

    // Text match
    const searchable = [
      data.title || '',
      data.excerpt || '',
      data.authorName || '',
      ...(data.tags || []),
    ].join(' ').toLowerCase();

    if (!searchable.includes(q)) continue;

    // Category/subcategory filter
    if (category && data.categoryId !== category) continue;
    if (subcategory && data.subcategoryId !== subcategory) continue;

    // Author filter
    if (author && !(data.authorName || '').toLowerCase().includes(author)) continue;

    // Extract date for sorting
    const dateVal = data.sitePublishedAt || data.publishedAt || data.createdAt;
    let dateStr: string | undefined;
    if (dateVal && typeof dateVal.toDate === 'function') {
      dateStr = dateVal.toDate().toISOString();
    }

    results.push({
      id: doc.id,
      title: data.title || '',
      slug: data.slug || doc.id,
      excerpt: data.excerpt || undefined,
      coverImageUrl: data.coverImageUrl || undefined,
      authorId: data.authorId || '',
      authorName: data.authorName || '',
      authorAvatarUrl: data.authorAvatarUrl || undefined,
      categoryId: data.categoryId || '',
      subcategoryId: data.subcategoryId || undefined,
      contentType: data.contentType || 'blog',
      views: data.views || 0,
      publishedAt: dateStr,
      tags: data.tags || undefined,
    });
  }

  // Sort
  if (sort === 'newest') {
    results.sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db2 = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db2 - da;
    });
  } else if (sort === 'popular') {
    results.sort((a, b) => (b.views || 0) - (a.views || 0));
  }
  // 'relevance' keeps natural order (first-match)

  // Limit
  results = results.slice(0, RESULTS_LIMIT);

  return { results, total: results.length };
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope');

    if (scope === 'profiles') {
      const data = await searchProfiles(searchParams);
      return NextResponse.json({ success: true, scope: 'profiles', ...data });
    }

    if (scope === 'posts') {
      const data = await searchPosts(searchParams);
      return NextResponse.json({ success: true, scope: 'posts', ...data });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid scope. Use ?scope=profiles or ?scope=posts' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API /api/search] Error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        success: false,
        message: 'Search failed.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
