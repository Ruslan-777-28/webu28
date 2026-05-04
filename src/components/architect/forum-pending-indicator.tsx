'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useArchitectForumAccess } from '@/hooks/use-architect-forum-access';

/**
 * Lightweight pending indicator for architect forum.
 * Shows a pulsing red dot if there are pending forum questions
 * in any of the architect's assigned subcategories.
 * 
 * Uses the shared useArchitectForumAccess hook for topic scope.
 */
export function ArchitectForumPendingIndicator() {
  const { hasAccess, topicKeys } = useArchitectForumAccess();
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    if (!hasAccess || topicKeys.length === 0) {
      setHasPending(false);
      return;
    }

    // Chunk topicKeys by 10 for Firestore 'in' limit
    const chunks: string[][] = [];
    for (let i = 0; i < topicKeys.length; i += 10) {
      chunks.push(topicKeys.slice(i, i + 10));
    }

    const chunkResults = new Map<number, boolean>();
    const unsubs: (() => void)[] = [];

    chunks.forEach((chunk, idx) => {
      const q = query(
        collection(db, 'forumQuestions'),
        where('status', '==', 'pending'),
        where('topicKey', 'in', chunk),
        limit(1)
      );

      const unsub = onSnapshot(
        q,
        (snap) => {
          chunkResults.set(idx, !snap.empty);
          setHasPending(Array.from(chunkResults.values()).some(Boolean));
        },
        () => {
          chunkResults.set(idx, false);
        }
      );
      unsubs.push(unsub);
    });

    return () => unsubs.forEach(u => u());
  }, [hasAccess, topicKeys.join(',')]); // join to create stable dep

  if (!hasPending) return null;

  return (
    <span className="ml-auto flex h-2 w-2 relative">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
  );
}
