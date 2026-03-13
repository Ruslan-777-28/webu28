'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [status, setStatus] = useState('Checking Firestore...');
  const [details, setDetails] = useState('');
  const [seedStatus, setSeedStatus] = useState('');

  async function checkFirestore() {
    setStatus('Checking Firestore...');
    setDetails('');
    try {
      const ref = doc(db, 'blogSettings', 'main');
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setStatus('Firestore connected. blogSettings/main exists.');
        setDetails(JSON.stringify(snap.data(), null, 2));
      } else {
        setStatus(
          'Firestore connected, but blogSettings/main does not exist yet.'
        );
        setDetails('');
      }
    } catch (error: any) {
      console.error('Firestore read error:', error);
      setStatus('Firestore read failed.');
      setDetails(
        `code: ${error?.code ?? 'unknown'} | message: ${
          error?.message ?? 'no message'
        }`
      );
    }
  }

  useEffect(() => {
    checkFirestore();
  }, []);

  async function handleSeedDatabase() {
    setSeedStatus('Seeding...');
    try {
      const response = await fetch('/api/seed-blog-settings', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to seed database.');
      }
      
      setSeedStatus(result.message);
      // Re-check firestore to show the new data
      await checkFirestore();
    } catch (error: any) {
      console.error('API seed error:', error);
      setSeedStatus('Error seeding database.');
      setDetails(
        `message: ${
          error?.message ?? 'no message'
        }`
      );
    }
  }

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Firestore connection test</h1>
      <p className="mb-4">{status}</p>
      <pre className="whitespace-pre-wrap rounded border p-4 text-sm mb-4">
        {details}
      </pre>

      <div className="border-t pt-8 mt-8">
        <h2 className="text-xl font-bold mb-4">Seed Database</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Click the button below to create the initial `blogSettings/main`
          document in your Firestore database. This only needs to be done once.
          This now uses a secure server-side API route.
        </p>
        <Button
          onClick={handleSeedDatabase}
          disabled={seedStatus === 'Seeding...'}
        >
          {seedStatus === 'Seeding...'
            ? 'Seeding...'
            : 'Seed blogSettings Document'}
        </Button>
        {seedStatus && <p className="mt-4 text-sm">{seedStatus}</p>}
      </div>
    </main>
  );
}
