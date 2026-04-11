import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local for scripts
dotenv.config({ path: '.env.local' });

/**
 * Fallback chain for Project ID as requested for App Hosting compatibility:
 * 1. FIREBASE_PROJECT_ID
 * 2. GCLOUD_PROJECT
 * 3. projectId from FIREBASE_CONFIG
 */
function getProjectId(): string | undefined {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;
  if (process.env.GCLOUD_PROJECT) return process.env.GCLOUD_PROJECT;
  
  if (process.env.FIREBASE_CONFIG) {
    try {
      const config = JSON.parse(process.env.FIREBASE_CONFIG);
      return config.projectId;
    } catch (e) {
      console.warn('Failed to parse FIREBASE_CONFIG for projectId');
    }
  }
  
  return undefined;
}

function initAdmin(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = getProjectId();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  const isPlaceholderProject = projectId === 'your-project-id';
  const isPlaceholderEmail = clientEmail === 'your-service-account-email';

  // 1. Try explicit Service Account credentials if ALL are provided and REAL
  if (projectId && !isPlaceholderProject && clientEmail && !isPlaceholderEmail && privateKey) {
    console.log('[Firebase Admin] Initializing using service account env (cert)');
    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (e: any) {
      console.error('[Firebase Admin] Cert initialization failed, falling back to ADC:', e.message);
      // Fall through to ADC
    }
  }

  // 2. Fallback to Application Default Credentials (ADC) for Google Cloud / App Hosting runtimes
  console.log('[Firebase Admin] Initializing using Application Default Credentials (ADC)');
  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: projectId, // Pass projectId if we have it from other sources
  });
}

// Lazy getters to prevent top-level initialization crash during build
export const getAdminDb = () => {
  initAdmin();
  return admin.firestore();
};

export const getAdminAuth = () => {
  initAdmin();
  return admin.auth();
};

// Legacy exports (Note: these will now crash ONLY if accessed, which is what we want)
export const adminDb = {} as admin.firestore.Firestore;
export const adminAuth = {} as admin.auth.Auth;
