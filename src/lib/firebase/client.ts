import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const isBrowser = typeof window !== 'undefined';

/**
 * Global state for client-side Firebase app
 */
let app: FirebaseApp | null = null;
let _auth: Auth;
let _db: Firestore;
let _storage: FirebaseStorage;

/**
 * Dynamic initialization for the browser runtime.
 * This is called by the FirebaseClientInitializer component with config passed from the server.
 */
export function setFirebaseConfig(config: FirebaseOptions) {
  if (!isBrowser) return;
  if (app) return; // Already initialized

  try {
    if (getApps().length > 0) {
      app = getApp();
    } else if (config.apiKey) {
      app = initializeApp(config);
    }
  } catch (error) {
    console.error('Firebase Client Initialization Error:', error);
  }
}

/**
 * Fallback config resolution for build-time / SSR if NEXT_PUBLIC vars are present.
 */
function getStaticConfig(): FirebaseOptions {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

// Initial attempt for environment where NEXT_PUBLIC vars are baked in
if (isBrowser && !app) {
    const staticConfig = getStaticConfig();
    if (staticConfig.apiKey) {
        setFirebaseConfig(staticConfig);
    }
}

/**
 * These proxies provide lazy access to Firebase services.
 * In the browser, they will use 'app' once it is initialized via setFirebaseConfig.
 * In SSR/Prerender context, they return a harmless empty object.
 */
export const auth = isBrowser 
  ? new Proxy({} as Auth, {
      get: (target, prop: keyof Auth) => {
        if (!app) {
           // We don't throw here immediately as it might be a race condition during load.
           // But if someone calls a function, we need the real auth.
           console.warn('Firebase Client Warning: Auth accessed before initialization.');
           return undefined;
        }
        if (!_auth) _auth = getAuth(app);
        const value = (_auth as any)[prop];
        return typeof value === 'function' ? value.bind(_auth) : value;
      }
    })
  : ({} as Auth);

export const db = isBrowser
  ? new Proxy({} as Firestore, {
      get: (target, prop: keyof Firestore) => {
        if (!app) return undefined;
        if (!_db) _db = getFirestore(app);
        const value = (_db as any)[prop];
        return typeof value === 'function' ? value.bind(_db) : value;
      }
    })
  : ({} as Firestore);

export const storage = isBrowser
  ? new Proxy({} as FirebaseStorage, {
      get: (target, prop: keyof FirebaseStorage) => {
        if (!app) return undefined;
        if (!_storage) _storage = getStorage(app);
        const value = (_storage as any)[prop];
        return typeof value === 'function' ? value.bind(_storage) : value;
      }
    })
  : ({} as FirebaseStorage);

export { app };
