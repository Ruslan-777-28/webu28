'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import type { CommunityArchitectAssignment } from '@/lib/types';

export type ArchitectForumAccess = {
  loading: boolean;
  hasAccess: boolean;
  topicKeys: string[];
  assignments: CommunityArchitectAssignment[];
};

/**
 * Shared hook for determining architect forum access.
 * Single source of truth used by:
 * - user-nav.tsx (show/hide Forum menu item)
 * - forum-pending-indicator.tsx (scope pending query)
 * - architect-council/forum/page.tsx (access gate + topic filter)
 *
 * Queries communityArchitectAssignments by userId only (no composite index needed),
 * then filters isActive/isBlocked client-side.
 */
export function useArchitectForumAccess(): ArchitectForumAccess {
  const { user, loading: authLoading } = useUser();
  const [assignments, setAssignments] = useState<CommunityArchitectAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'communityArchitectAssignments'),
      where('userId', '==', user.uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const active = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as CommunityArchitectAssignment))
          .filter(a => {
            // Treat assignment as active if isActive is true (or undefined in old docs)
            // and isBlocked is not true
            const isActive = a.isActive !== false;
            const isNotBlocked = a.isBlocked !== true;
            return isActive && isNotBlocked;
          });

        if (process.env.NODE_ENV === 'development') {
          console.debug('[useArchitectForumAccess] uid:', user.uid);
          console.debug('[useArchitectForumAccess] total docs:', snap.size);
          console.debug('[useArchitectForumAccess] active assignments:', active.length, active.map(a => ({
            subcategoryId: a.subcategoryId,
            subcategoryName: a.subcategoryName,
            isActive: a.isActive,
            isBlocked: a.isBlocked,
          })));
        }

        setAssignments(active);
        setLoading(false);
      },
      (err) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('[useArchitectForumAccess] query error:', err.message);
        }
        setAssignments([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [authLoading, user?.uid]);

  const topicKeys = assignments.map(a => a.subcategoryId).filter(Boolean);

  return {
    loading,
    hasAccess: assignments.length > 0,
    topicKeys,
    assignments,
  };
}
