'use client';

import { useEffect, useState } from 'react';
import { app, auth, db, storage } from '@/lib/firebase/client';

export default function HomePage() {
  const [status, setStatus] = useState('Checking Firebase...');

  useEffect(() => {
    try {
      const ok =
        !!app &&
        !!auth &&
        !!db &&
        !!storage &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

      setStatus(
        ok
          ? `Firebase connected: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`
          : 'Firebase init failed'
      );
    } catch (error) {
      console.error(error);
      setStatus('Firebase init failed');
    }
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase connection test</h1>
      <p>{status}</p>
    </main>
  );
}
