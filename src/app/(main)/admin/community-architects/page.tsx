'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { CommunityArchitectAssignment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Landmark, Plus, MapPin, Calendar, RefreshCcw } from 'lucide-react';

type AssignmentWithUser = CommunityArchitectAssignment & {
  userDisplayName?: string;
  userAvatarUrl?: string;
};

const safeFormatDate = (timestamp: any): string => {
  if (!timestamp) return '—';
  try {
    if (typeof timestamp.toDate === 'function') return timestamp.toDate().toLocaleDateString('uk-UA');
    if (timestamp instanceof Date) return timestamp.toLocaleDateString('uk-UA');
    if (typeof timestamp === 'string' || typeof timestamp === 'number') return new Date(timestamp).toLocaleDateString('uk-UA');
  } catch { /* */ }
  return '—';
};

export default function AdminCommunityArchitectsPage() {
  const [assignments, setAssignments] = useState<AssignmentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const assignmentsRef = collection(db, 'communityArchitectAssignments');
    const q = query(assignmentsRef);

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const raw = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CommunityArchitectAssignment));

      // Batch fetch users
      const userIds = [...new Set(raw.map(a => a.userId))];
      const userMap: Record<string, { displayName?: string; avatarUrl?: string }> = {};

      await Promise.all(
        userIds.map(async (uid) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              userMap[uid] = {
                displayName: data.displayName || data.name,
                avatarUrl: data.avatarUrl,
              };
            }
          } catch { /* */ }
        })
      );

      const enriched: AssignmentWithUser[] = raw.map(a => ({
        ...a,
        userDisplayName: userMap[a.userId]?.displayName || a.userId,
        userAvatarUrl: userMap[a.userId]?.avatarUrl,
      }));

      // Sort: active first, then by updatedAt desc
      enriched.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return 0;
      });

      setAssignments(enriched);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching assignments:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (a: CommunityArchitectAssignment) => {
    if (a.isBlocked) return <Badge variant="destructive" className="text-[9px] font-black uppercase tracking-widest h-5">Blocked</Badge>;
    if (a.isActive) return <Badge className="text-[9px] font-black uppercase tracking-widest h-5 bg-emerald-600">Active</Badge>;
    return <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest h-5">Inactive</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 text-foreground/90">
            <Landmark className="w-8 h-8 text-accent" />
            Community Architects
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Governance assignments for subcategory representatives.
          </p>
        </div>
        <Link href="/admin/community-architects/new">
          <Button className="rounded-xl bg-accent hover:bg-accent/90 font-bold uppercase text-[10px] tracking-widest gap-2 h-10 px-6 shadow-md transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-5 border border-muted/30 rounded-2xl flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-muted/40 rounded-2xl">
          <Landmark className="h-8 w-8 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">No assignments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <Link key={a.id} href={`/admin/community-architects/${a.id}`}>
              <div className="p-5 border border-muted/30 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent/30 hover:shadow-sm transition-all cursor-pointer bg-background group">
                {/* User */}
                <div className="flex items-center gap-3 sm:w-[220px] shrink-0">
                  <Avatar className="h-10 w-10 border border-muted/30">
                    <AvatarImage src={a.userAvatarUrl} />
                    <AvatarFallback className="text-[10px] font-bold bg-muted/20">
                      {(a.userDisplayName || '?').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{a.userDisplayName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">{a.userId.slice(0, 12)}…</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-1">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                    <MapPin className="h-3 w-3" />
                    {a.countryName}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 font-medium">
                    {a.subcategoryName}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                    <Calendar className="h-3 w-3" />
                    {safeFormatDate(a.termStartAt)} → {safeFormatDate(a.termEndAt)}
                  </span>
                  {a.renewalCount > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-accent font-bold">
                      <RefreshCcw className="h-3 w-3" />
                      ×{a.renewalCount}
                    </span>
                  )}
                </div>

                {/* Status */}
                <div className="sm:w-[80px] shrink-0 flex sm:justify-end">
                  {getStatusBadge(a)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
