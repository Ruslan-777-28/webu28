import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { CouncilMember } from '@/lib/types';

export interface CouncilContext {
  uid: string;
  isAdmin: boolean;
  member: CouncilMember | null;
}

/**
 * Verifies if the user has access to the Architect Council.
 * Used in server-side API routes.
 */
export async function verifyCouncilAccess(req: Request): Promise<CouncilContext> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided');
  }

  const token = authHeader.split('Bearer ')[1];
  const adminAuth = getAdminAuth();
  const adminDb = getAdminDb();

  try {
    const decodedToken = await adminAuth.verifyIdToken(token!);
    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;

    // 1. Admin always has access (platform authority)
    if (isAdmin) {
      return { uid, isAdmin, member: null };
    }

    // 2. Authoritative Source of Truth: communityArchitectAssignments
    const assignmentsSnap = await adminDb.collection('communityArchitectAssignments')
        .where('userId', '==', uid)
        .where('isActive', '==', true)
        .where('isBlocked', '==', false)
        .where('councilEligible', '==', true)
        .limit(1)
        .get();
    
    if (assignmentsSnap.empty) {
        throw new Error('Forbidden: Not a council member or eligibility denied');
    }

    const assignmentData = assignmentsSnap.docs[0].data();
    
    // We construct the member context from the assignment data
    const member: CouncilMember = {
        uid,
        isActive: assignmentData.isActive,
        isBlocked: assignmentData.isBlocked,
        councilEligible: assignmentData.councilEligible,
        roleTitle: assignmentData.publicTitle,
        countryCode: assignmentData.countryCode,
        countryName: assignmentData.countryName,
        subcategoryId: assignmentData.subcategoryId,
        subcategoryName: assignmentData.subcategoryName,
        termEndAt: assignmentData.termEndAt,
        updatedAt: assignmentData.updatedAt
    };

    return { uid, isAdmin, member };
  } catch (error: any) {
    if (error.message.includes('Forbidden')) throw error;
    throw new Error('Unauthorized: Invalid token');
  }
}
