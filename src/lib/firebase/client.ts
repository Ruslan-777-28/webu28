import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const isBrowser = typeof window !== 'undefined';

/**
 * Fallback chain for Web Firebase Config as requested for App Hosting compatibility:
 * 1. NEXT_PUBLIC_FIREBASE_* variables
 * 2. FIREBASE_WEBAPP_CONFIG (JSON string)
 */
function getFirebaseWebConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  if (!config.apiKey && process.env.FIREBASE_WEBAPP_CONFIG) {
    try {
      const webappConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
      return {
        apiKey: webappConfig.apiKey,
        authDomain: webappConfig.authDomain,
        projectId: webappConfig.projectId,
        storageBucket: webappConfig.storageBucket,
        messagingSenderId: webappConfig.messagingSenderId,
        appId: webappConfig.appId,
        measurementId: webappConfig.measurementId,
      };
    } catch (e) {
      if (isBrowser) console.error('Failed to parse FIREBASE_WEBAPP_CONFIG', e);
    }
  }

  return config;
}

// 1. Resolve config
const firebaseConfig = getFirebaseWebConfig();

// 2. Initialize App strictly browser-only to prevent build-time crashes (auth/invalid-api-key)
// during prerendering on the server.
const app = isBrowser && firebaseConfig.apiKey
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

// 3. Lazy/Safe initialization of services
let _auth: Auth;
let _db: Firestore;
let _storage: FirebaseStorage;

/**
 * These proxies provide lazy access to Firebase services.
 * IMPORTANT: In SSR/Prerender context (isBrowser === false), they return a harmless 
 * empty object. This prevents calling getAuth(app) on the server, which avoids the
 * "invalid-api-key" crash during 'next build'.
 */
export const auth = isBrowser 
  ? new Proxy({} as Auth, {
      get: (target, prop: keyof Auth) => {
        if (!app) throw new Error('Firebase Client Error: App not initialized. Check your environment variables.');
        if (!_auth) _auth = getAuth(app);
        const value = _auth[prop];
        return typeof value === 'function' ? value.bind(_auth) : value;
      }
    })
  : ({} as Auth);

export const db = isBrowser
  ? new Proxy({} as Firestore, {
      get: (target, prop: keyof Firestore) => {
        if (!app) throw new Error('Firebase Client Error: App not initialized. Check your environment variables.');
        if (!_db) _db = getFirestore(app);
        const value = _db[prop];
        return typeof value === 'function' ? value.bind(_db) : value;
      }
    })
  : ({} as Firestore);

export const storage = isBrowser
  ? new Proxy({} as FirebaseStorage, {
      get: (target, prop: keyof FirebaseStorage) => {
        if (!app) throw new Error('Firebase Client Error: App not initialized. Check your environment variables.');
        if (!_storage) _storage = getStorage(app);
        const value = _storage[prop];
        return typeof value === 'function' ? value.bind(_storage) : value;
      }
    })
  : ({} as FirebaseStorage);

export { app };
