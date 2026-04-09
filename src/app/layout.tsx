import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

/**
 * Root Metadata
 */
export const metadata: Metadata = {
  title: 'LECTOR',
  description: 'LECTOR - Екосистема обміну живою енергією, сенсами та знаннями.',
};

/**
 * Fundamental Root Layout.
 * Contains only the HTML/Body shell, fonts, and global CSS.
 * Is NOT dependent on Firebase runtime, making standalone routes (like /gate) safe.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Resolve Firebase Web Config on the Server for early client-side injection.
  // This allows synchronous module-level initialization in the browser.
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Fallback to server-side secret JSON if API key is missing during render
  if (!firebaseConfig.apiKey && process.env.FIREBASE_WEBAPP_CONFIG) {
    try {
      const webappConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
      Object.assign(firebaseConfig, webappConfig);
    } catch (e) {
      console.error('Failed to parse FIREBASE_WEBAPP_CONFIG in RootLayout', e);
    }
  }

  const configScript = `window.__FIREBASE_CONFIG__ = ${JSON.stringify(firebaseConfig)};`;

  return (
    <html lang="uk" className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: configScript }} />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
