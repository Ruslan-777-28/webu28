import 'dotenv/config';
import { adminAuth, adminDb } from '../lib/firebase/admin';
import type { UserProfile } from '@/lib/types';

// This script grants a user full administrative privileges.
// It sets their custom claims in Firebase Auth and updates their profile in Firestore.

async function setAdmin() {
  const uid = process.argv[2];

  if (!uid) {
    console.error('Error: Please provide a UID as a command-line argument.');
    console.log('Usage: npm run set-admin <user_uid>');
    process.exit(1);
  }

  console.log(`Attempting to grant admin privileges to user with UID: ${uid}`);

  try {
    // 1. Set custom claims in Firebase Auth
    const staffClaims = {
      admin: true,
      editor: true,
      author: true,
      moderator: true,
    };
    await adminAuth.setCustomUserClaims(uid, staffClaims);
    console.log('✅ Successfully set custom claims in Firebase Auth.');

    // 2. Update the user document in Firestore
    const userRef = adminDb.collection('users').doc(uid);
    
    // Check if the user document exists before trying to update it
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        console.error(`❌ Error: User document with UID ${uid} not found in Firestore.`);
        console.log('A user document should be created automatically upon registration.');
        process.exit(1);
    }
    
    const rolesUpdate: UserProfile['roles'] = {
        ...(userDoc.data()?.roles || {}), // Preserve existing product roles like 'user' and 'expert'
        author: true,
        editor: true,
        moderator: true,
        admin: true,
    };

    const adminAccessUpdate: UserProfile['adminAccess'] = {
        isStaff: true,
        panelEnabled: true,
    };

    await userRef.update({
        roles: rolesUpdate,
        adminAccess: adminAccessUpdate,
    });

    console.log('✅ Successfully updated user document in Firestore.');

    // 3. Invalidate existing sessions to force token refresh
    await adminAuth.revokeRefreshTokens(uid);
    console.log('✅ Successfully revoked refresh tokens. User may need to log in again.');

    console.log('\n🎉 Success! The user is now a full administrator.');
    console.log('Please ask the user to log out and log back in to apply the new permissions.');

  } catch (error: any) {
    console.error('❌ An error occurred:');
    if (error.code === 'auth/user-not-found') {
        console.error(`No user found with the UID: ${uid}. Please double-check the UID in Firebase Authentication.`);
    } else {
        console.error(error.message);
    }
    process.exit(1);
  }
}

setAdmin();
