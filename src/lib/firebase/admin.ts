import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local for scripts
dotenv.config({ path: '.env.local' });

// This prevents us from initializing the app more than once.
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId) {
      throw new Error('Firebase Admin Error: Missing FIREBASE_PROJECT_ID in environment variables.');
    }
    if (!clientEmail) {
      throw new Error('Firebase Admin Error: Missing FIREBASE_CLIENT_EMAIL in environment variables.');
    }
    if (!privateKey) {
      throw new Error('Firebase Admin Error: Missing FIREBASE_PRIVATE_KEY in environment variables.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        // When using environment variables, the private key must be formatted correctly.
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
