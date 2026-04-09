import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';
import { recomputeUserTrust } from '@/lib/trust/recompute-user-trust';

export const dynamic = 'force-dynamic';

/**
 * Protected Admin API route to trigger a trust recomputation for a specific user.
 * POST /api/admin/recompute-trust
 * Body: { uid: string }
 */
export async function POST(req: NextRequest) {
  try {
    const adminAuth = getAdminAuth();
    
    // 1. Verify Administrative Privileges
    const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No token provided.' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Rationale for isAdminOrModerator:
    // Moderators are permitted to recompute trust for individual users to support profile reviews
    // and manual verification flows. Mass backfill is restricted to Admins only.
    const isAdminOrModerator = decodedToken.admin === true || decodedToken.moderator === true;
    
    if (!isAdminOrModerator) {
      return NextResponse.json({ success: false, message: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    // 2. Parse and Validate Body
    const body = await req.json();
    const { uid } = body;
    
    if (!uid) {
      return NextResponse.json({ success: false, message: 'Missing required field: uid' }, { status: 400 });
    }

    // 3. Execute Core Trust Engine
    const verification = await recomputeUserTrust(uid);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully recomputed trust for user ${uid}`,
      verification 
    });

  } catch (error: any) {
    console.error('[API] recompute-trust error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to recompute trust.',
      error: error.message 
    }, { status: 500 });
  }
}
