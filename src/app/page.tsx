'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export default function HomePage() {
  const [status, setStatus] = useState('Checking Firestore...');

  useEffect(() => {
    async function run() {
      try {
        const ref = doc(db, 'blogSettings', 'main');
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setStatus('Firestore connected. blogSettings/main exists.');
        } else {
          setStatus('Firestore connected, but blogSettings/main does not exist yet.');
        }
      } catch (error) {
        console.error(error);
        setStatus('Firestore read failed. Check config or rules.');
      }
    }

    run();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firestore connection test</h1>
      <p>{status}</p>
    </main>
  );
}
