'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export default function HomePage() {
  const [status, setStatus] = useState('Checking Firestore...');
  const [details, setDetails] = useState('');

  useEffect(() => {
    async function run() {
      try {
        const ref = doc(db, 'blogSettings', 'main');
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setStatus('Firestore connected. blogSettings/main exists.');
          setDetails(JSON.stringify(snap.data(), null, 2));
        } else {
          setStatus('Firestore connected, but blogSettings/main does not exist yet.');
          setDetails('');
        }
      } catch (error: any) {
        console.error('Firestore read error:', error);
        setStatus('Firestore read failed.');
        setDetails(`code: ${error?.code ?? 'unknown'} | message: ${error?.message ?? 'no message'}`);
      }
    }

    run();
  }, []);

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Firestore connection test</h1>
      <p className="mb-4">{status}</p>
      <pre className="whitespace-pre-wrap rounded border p-4 text-sm">{details}</pre>
    </main>
  );
}
