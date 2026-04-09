import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { FirebaseClientInitializer } from '@/components/firebase-client-initializer';
import type { FirebaseOptions } from 'firebase/app';

/**
 * Main Layout for (main) route group.
 * This is a Server Component that resolves the Firebase configuration
 * and passes it to the client initialization layer.
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // 1. Resolve Firebase Web Config on the Server
  // We use both NEXT_PUBLIC vars and the server-side FIREBASE_WEBAPP_CONFIG secret
  const config: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Fallback to server-side JSON config if API key is missing
  if (!config.apiKey && process.env.FIREBASE_WEBAPP_CONFIG) {
    try {
      const webappConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
      config.apiKey = webappConfig.apiKey;
      config.authDomain = webappConfig.authDomain;
      config.projectId = webappConfig.projectId;
      config.storageBucket = webappConfig.storageBucket;
      config.messagingSenderId = webappConfig.messagingSenderId;
      config.appId = webappConfig.appId;
      config.measurementId = webappConfig.measurementId;
    } catch (e) {
      console.error('Failed to parse FIREBASE_WEBAPP_CONFIG on the server', e);
    }
  }

  return (
    <>
      {/* Initialize Firebase before any other Client Component mounts */}
      <FirebaseClientInitializer config={config} />
      
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster />
    </>
  );
}
