'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function ForumPendingIndicator() {
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    try {
      const q = query(
        collection(db, 'forumQuestions'),
        where('status', '==', 'pending'),
        limit(1)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setHasPending(!snapshot.empty);
        },
        (error) => {
          // Fail silently as requested
          console.error('[ForumPendingIndicator] Subscription error:', error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('[ForumPendingIndicator] Setup error:', err);
    }
  }, []);

  if (!hasPending) return null;

  return (
    <span className="ml-auto flex h-2 w-2 relative">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
  );
}
