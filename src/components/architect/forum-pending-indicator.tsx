'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import type { CommunityArchitectAssignment } from '@/lib/types';

/**
 * Lightweight pending indicator for architect forum sidebar.
 * Shows a pulsing red dot if there are pending forum questions
 * in any of the architect's assigned subcategories.
 */
export function ArchitectForumPendingIndicator() {
  const { user } = useUser();
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    let questionUnsubs: (() => void)[] = [];

    // Step 1: Get active assignments for this architect
    const assignmentsQuery = query(
      collection(db, 'communityArchitectAssignments'),
      where('userId', '==', user.uid),
      where('isActive', '==', true)
    );

    const assignmentUnsub = onSnapshot(
      assignmentsQuery,
      (assignmentSnap) => {
        // Clean up previous question listeners
        questionUnsubs.forEach(u => u());
        questionUnsubs = [];

        const topicKeys = assignmentSnap.docs
          .map(d => (d.data() as CommunityArchitectAssignment).subcategoryId)
          .filter(Boolean);

        if (topicKeys.length === 0) {
          setHasPending(false);
          return;
        }

        // Step 2: Listen for pending questions in architect's topics (chunked by 10)
        const chunks: string[][] = [];
        for (let i = 0; i < topicKeys.length; i += 10) {
          chunks.push(topicKeys.slice(i, i + 10));
        }

        const chunkResults = new Map<number, boolean>();

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
              // If any chunk has pending, show dot
              setHasPending(Array.from(chunkResults.values()).some(Boolean));
            },
            () => {
              // Fail silently on permission errors
              chunkResults.set(idx, false);
            }
          );
          questionUnsubs.push(unsub);
        });
      },
      () => {
        // Fail silently
      }
    );

    return () => {
      assignmentUnsub();
      questionUnsubs.forEach(u => u());
    };
  }, [user?.uid]);

  if (!hasPending) return null;

  return (
    <span className="ml-auto flex h-2 w-2 relative">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
  );
}
