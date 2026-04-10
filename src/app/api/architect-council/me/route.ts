import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import type { CouncilMember } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Checks the current user's Architect Council status and returns summary stats.
 * This is the primary "gatekeeper" for the frontend to decide which UI state to show.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: true, 
        status: 'not-authenticated' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const adminAuth = getAdminAuth();
    const adminDb = getAdminDb();

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token!);
    } catch {
      return NextResponse.json({ 
        success: true, 
        status: 'not-authenticated' 
      });
    }

    const uid = decodedToken.uid;
    const isAdmin = decodedToken.admin === true;

    // 1. Check if Admin
    if (isAdmin) {
      const stats = await getCouncilStats(adminDb);
      return NextResponse.json({ 
        success: true, 
        status: 'admin',
        stats 
      });
    }

    // 2. Check if Architect + Eligibility (Real Source of Truth)
    const assignmentsSnap = await adminDb.collection('communityArchitectAssignments')
        .where('userId', '==', uid)
        .limit(1)
        .get();
    
    if (assignmentsSnap.empty) {
        // Not even an architect = regular user / guest
        return NextResponse.json({ 
            success: true, 
            status: 'not-eligible' 
        });
    }

    const assignmentData = assignmentsSnap.docs[0].data();
    const isEligibleMember = assignmentData.isActive && !assignmentData.isBlocked && assignmentData.councilEligible;

    if (!isEligibleMember) {
        // Is an architect, but access conditions not met (inactive, blocked, or not councilEligible)
        return NextResponse.json({ 
            success: true, 
            status: 'not-eligible',
            memberData: {
                isActive: assignmentData.isActive,
                isBlocked: assignmentData.isBlocked,
                councilEligible: assignmentData.councilEligible
            }
        });
    }

    // 3. Full Member (Active, Non-blocked, Eligible)
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

    const stats = await getCouncilStats(adminDb);
    return NextResponse.json({ 
        success: true, 
        status: 'member',
        memberData: member,
        stats
    });

  } catch (error: any) {
    console.error('API architect-council/me error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getCouncilStats(db: any) {
    try {
        const threadsSnap = await db.collection('architectCouncilThreads')
            .where('status', 'in', ['open', 'in_review', 'planned'])
            .count()
            .get();
        
        const ideasSnap = await db.collection('architectCouncilThreads')
            .where('type', '==', 'idea')
            .where('status', '==', 'open')
            .count()
            .get();

        const membersSnap = await db.collection('architectCouncilMembers')
            .where('isActive', '==', true)
            .where('isBlocked', '==', false)
            .count()
            .get();

        return {
            activeThreadsCount: threadsSnap.data().count,
            openIdeasCount: ideasSnap.data().count,
            membersCount: membersSnap.data().count
        };
    } catch {
        return { activeThreadsCount: 0, openIdeasCount: 0, membersCount: 0 };
    }
}
