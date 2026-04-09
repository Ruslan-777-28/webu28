import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const isBrowser = typeof window !== 'undefined';

/**
 * Global state for client-side Firebase app
 */
let app: FirebaseApp | null = null;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

/**
 * Early Synchronous Initialization for the Browser.
 * This reads the configuration injected by the Root Layout via window.__FIREBASE_CONFIG__.
 * This ensures that 'db' and 'auth' are REAL initialized instances at the moment of import.
 */
if (isBrowser) {
  try {
    const config = (window as any).__FIREBASE_CONFIG__ as FirebaseOptions;
    
    if (getApps().length > 0) {
      app = getApp();
    } else if (config && config.apiKey) {
      app = initializeApp(config);
    }

    if (app) {
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    }
  } catch (error) {
    console.error('Firebase Client Early Initialization Error:', error);
  }
}

/**
 * Fallback for SSR / Prerendering context.
 * We export "dummy" objects that prevent crashes during build/prerender 
 * but are replaced by real instances in the browser.
 */
if (!app) {
  // @ts-ignore
  auth = isBrowser ? {} : ({} as Auth);
  // @ts-ignore
  db = isBrowser ? {} : ({} as Firestore);
  // @ts-ignore
  storage = isBrowser ? {} : ({} as FirebaseStorage);
}

// Re-export as constants
export { app, auth, db, storage };

/**
 * Helper to ensure initialization (used for dynamic updates if needed)
 */
export function setFirebaseConfig(config: FirebaseOptions) {
  if (!isBrowser || app) return;
  try {
    app = initializeApp(config);
    // @ts-ignore
    auth = getAuth(app);
    // @ts-ignore
    db = getFirestore(app);
    // @ts-ignore
    storage = getStorage(app);
  } catch (e) {
    console.error('Manual Firebase re-init failed', e);
  }
}
