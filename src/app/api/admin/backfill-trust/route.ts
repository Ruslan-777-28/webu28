import { NextResponse, type NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { recomputeUserTrust } from '@/lib/trust/recompute-user-trust';

export const dynamic = 'force-dynamic';

/**
 * Protected Admin API route to batch recompute trust for all users.
 * Use with caution as it iterates through the entire users collection.
 * POST /api/admin/backfill-trust
 */
export async function POST(req: NextRequest) {
  try {
    const adminAuth = getAdminAuth();
    const db = getAdminDb();
    
    // 1. Strict Authorization (Admin Only)
    const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ success: false, message: 'Unauthorized: No token provided.' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return NextResponse.json({ success: false, message: 'Forbidden: Admin privileges required for backfill.' }, { status: 403 });
    }

    // 2. Parse Options
    const searchParams = req.nextUrl.searchParams;
    const isDryRun = searchParams.get('dryRun') === 'true';

    // 3. Batch Fetch User UIDs
    const usersSnap = await db.collection('users').select().get();
    const uids = usersSnap.docs.map(d => d.id);

    if (uids.length === 0) {
      return NextResponse.json({ success: true, message: 'No users found to backfill.' });
    }

    const results = {
      total: uids.length,
      processed: 0,
      success: 0,
      failed: 0,
      isDryRun,
      errors: [] as { uid: string; error: string }[]
    };

    console.log(`[Backfill] Starting ${isDryRun ? 'DRY RUN' : 'REAL'} operation for ${uids.length} users.`);

    // 4. Core Backfill Loop
    for (const uid of uids) {
      try {
        if (isDryRun) {
          // Log only, no write
          results.success++;
        } else {
          await recomputeUserTrust(uid);
          results.success++;
        }
      } catch (err: any) {
        console.error(`[Backfill] Failed for UID ${uid}:`, err.message);
        results.failed++;
        results.errors.push({ uid, error: err.message });
      }
      results.processed++;
      
      // Basic progress logging for long operations
      if (results.processed % 50 === 0) {
        console.log(`[Backfill] Progress: ${results.processed}/${results.total}`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Backfill ${isDryRun ? 'dry run ' : ''}completed. Processed ${results.total} users.`,
      results: {
        total: results.total,
        success: results.success,
        failed: results.failed,
        processed: results.processed,
        isDryRun: results.isDryRun,
        errorCount: results.errors.length,
        errors: results.errors.slice(0, 10)
      }
    });

  } catch (error: any) {
    console.error('[API] backfill-trust error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Critical error during backfill operation.', 
      error: error.message 
    }, { status: 500 });
  }
}
