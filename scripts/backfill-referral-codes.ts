import 'dotenv/config';
import { getAdminDb } from '../src/lib/firebase/admin';

/**
 * Backfill script for missing referralCode in user documents.
 * Generates code from UID: uid.slice(-6).toUpperCase()
 * 
 * Usage:
 * npx tsx scripts/backfill-referral-codes.ts --dry-run
 * npx tsx scripts/backfill-referral-codes.ts
 */

async function backfillReferralCodes() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  
  const db = getAdminDb();

  console.log(`--- ReferralCode Backfill ---`);
  console.log(`Dry Run: ${isDryRun ? 'ENABLED (No changes will be written)' : 'DISABLED (Writing to Firestore!)'}`);
  console.log('-----------------------------');

  try {
    console.log('Fetching users from Firestore...');
    const usersSnap = await db.collection('users').get();
    const users = usersSnap.docs;
    console.log(`Found ${users.length} user documents.`);

    let skipCount = 0;
    let toUpdateCount = 0;
    let collisionCount = 0;

    // 1. Map existing codes to detect collisions
    const existingCodes = new Set<string>();
    users.forEach(doc => {
      const data = doc.data();
      if (data.referralCode && typeof data.referralCode === 'string' && data.referralCode.trim()) {
        existingCodes.add(data.referralCode.trim().toUpperCase());
      }
    });

    console.log(`Current unique referralCodes in DB: ${existingCodes.size}`);
    console.log('Starting processing...\n');

    for (const doc of users) {
      const data = doc.data();
      const uid = doc.id;
      const currentCode = data.referralCode;

      // Check if code is missing, not a string, or empty
      if (!currentCode || typeof currentCode !== 'string' || !currentCode.trim()) {
        let code = uid.slice(-6).toUpperCase();

        // 2. Collision detection & resolution
        if (existingCodes.has(code)) {
          console.log(`[Collision] ${code} for UID ${uid} already taken. Trying -8 chars...`);
          code = uid.slice(-8).toUpperCase();
          
          if (existingCodes.has(code)) {
            console.log(`[Collision] ${code} for UID ${uid} already taken. Trying -10 chars...`);
            code = uid.slice(-10).toUpperCase();
            
            if (existingCodes.has(code)) {
              console.log(`[ERROR] Could not resolve collision for UID ${uid} after 3 attempts. Skipping.`);
              collisionCount++;
              continue;
            }
          }
        }

        existingCodes.add(code);
        toUpdateCount++;

        if (isDryRun) {
          console.log(`[Dry Run] Would update ${uid} -> ${code}`);
        } else {
          await doc.ref.update({ 
            referralCode: code,
            updatedAt: new Date() // Trace when we did this backfill
          });
          console.log(`[Updated] ${uid} -> ${code}`);
        }
      } else {
        skipCount++;
      }
    }

    console.log('\n--- Final Summary ---');
    console.log(`Total users checked: ${users.length}`);
    console.log(`Existing codes (skipped): ${skipCount}`);
    console.log(`Codes generated/updated: ${toUpdateCount}`);
    console.log(`Failures (collisions): ${collisionCount}`);
    
    if (isDryRun) {
      console.log('\nNOTE: This was a DRY RUN. No data was actually changed in Firestore.');
    } else {
      console.log('\nSUCCESS: All missing referral codes have been populated.');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('\n[CRITICAL ERROR] during backfill:');
    console.error(error.message);
    process.exit(1);
  }
}

backfillReferralCodes();
