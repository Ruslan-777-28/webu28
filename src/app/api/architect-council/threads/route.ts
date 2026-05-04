import { NextResponse, type NextRequest } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifyCouncilAccess } from '@/lib/council/access';
import { FieldValue } from 'firebase-admin/firestore';
import type { CouncilThread, CouncilThreadType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { uid, isAdmin, member } = await verifyCouncilAccess(req);
    const adminDb = getAdminDb();
    const { searchParams } = new URL(req.url);
    
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let queryRef = adminDb.collection('architectCouncilThreads')
        .where('visibility', '==', 'council');

    if (type && type !== 'all') {
      queryRef = queryRef.where('type', '==', type);
    }
    
    if (status && status !== 'all') {
      queryRef = queryRef.where('status', '==', status);
    }

    // Pinned first, then by last activity
    const snapshot = await queryRef
        .orderBy('isPinned', 'desc')
        .orderBy('lastActivityAt', 'desc')
        .limit(50)
        .get();

    const threads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Format timestamps for serialization
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
      lastActivityAt: doc.data().lastActivityAt?.toDate()?.toISOString(),
      lastCommentAt: doc.data().lastCommentAt?.toDate()?.toISOString(),
    }));

    return NextResponse.json({ success: true, data: threads });
  } catch (error: any) {
    console.error('API architect-council/threads GET error:', error);
    
    // Handle missing index error specifically
    if (error.message?.includes('requires an index')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing Firestore index. Please check server logs for the creation link.',
        errorType: 'INDEX_MISSING'
      }, { status: 412 }); // Precondition Failed
    }

    const status = error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { uid, isAdmin, member } = await verifyCouncilAccess(req);
    const adminDb = getAdminDb();
    const body = await req.json();

    const { title, body: content, type, tags, councilContextCountryCode, councilContextSubcategoryId } = body;

    if (!title || !content || !type) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Get author data from Firestore users collection
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();

    const threadData: Omit<CouncilThread, 'id'> = {
      authorUid: uid,
      authorName: userData?.displayName || userData?.name || 'Unknown',
      authorAvatarUrl: userData?.avatarUrl || null,
      authorCountryCode: member?.countryCode || null,
      authorCountryName: member?.countryName || null,
      authorSubcategoryId: member?.subcategoryId || null,
      authorSubcategoryName: member?.subcategoryName || null,
      title,
      body: content,
      type: type as CouncilThreadType,
      tags: tags || [],
      status: 'open',
      isPinned: false,
      isLocked: false,
      isAnnouncement: type === 'announcement' && isAdmin, // Only admins can make initial announcements
      visibility: 'council',
      voteCount: 0,
      commentCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastActivityAt: FieldValue.serverTimestamp(),
      councilContextCountryCode: councilContextCountryCode || null,
      councilContextSubcategoryId: councilContextSubcategoryId || null,
      createdByRole: isAdmin ? 'admin' : 'architect',
    };

    const newThreadRef = await adminDb.collection('architectCouncilThreads').add(threadData);

    return NextResponse.json({ success: true, id: newThreadRef.id });
  } catch (error: any) {
    console.error('API architect-council/threads POST error:', error);
    const status = error.message.includes('Unauthorized') ? 401 : error.message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ success: false, message: error.message }, { status });
  }
}
