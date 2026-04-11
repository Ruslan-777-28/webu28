'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import type { CommunityArchitectAssignment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Landmark,
  ArrowLeft,
  Save,
  Ban,
  ShieldOff,
  Power,
  PowerOff,
  RefreshCcw,
  AlertTriangle,
  User,
  Mail,
  Hash,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

const safeFormatDate = (timestamp: any): string => {
  if (!timestamp) return '—';
  try {
    if (typeof timestamp.toDate === 'function') return timestamp.toDate().toLocaleDateString('uk-UA');
    if (timestamp instanceof Date) return timestamp.toLocaleDateString('uk-UA');
    if (typeof timestamp === 'string' || typeof timestamp === 'number') return new Date(timestamp).toLocaleDateString('uk-UA');
  } catch { /* */ }
  return '—';
};

export default function EditCommunityArchitectPage() {
  const params = useParams();
  const assignmentId = params?.id as string;
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const [assignment, setAssignment] = useState<CommunityArchitectAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userCtx, setUserCtx] = useState<Partial<UserProfile> | null>(null);
  const [isCtxLoading, setIsCtxLoading] = useState(false);

  // Editable form state
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [publicTitle, setPublicTitle] = useState('');
  const [publicStatement, setPublicStatement] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [profileThemeEnabled, setProfileThemeEnabled] = useState(false);
  const [profileThemeMode, setProfileThemeMode] = useState<'custom' | 'curated'>('curated');
  const [profileThemeUrl, setProfileThemeUrl] = useState('');
  const [councilEligible, setCouncilEligible] = useState(false);
  const [futureEditorialScopeEnabled, setFutureEditorialScopeEnabled] = useState(false);
  const [notesInternal, setNotesInternal] = useState('');

  // Confirmation dialogs
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchAssignment = async () => {
      try {
        const docRef = doc(db, 'communityArchitectAssignments', assignmentId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as CommunityArchitectAssignment;
          setAssignment(data);
          // Populate form state
          setCountryCode(data.countryCode || '');
          setCountryName(data.countryName || '');
          setCategoryId(data.categoryId || '');
          setCategoryName(data.categoryName || '');
          setSubcategoryId(data.subcategoryId || '');
          setSubcategoryName(data.subcategoryName || '');
          setPublicTitle(data.publicTitle || '');
          setPublicStatement(data.publicStatement || '');
          setBlockReason(data.blockReason || '');
          setProfileThemeEnabled(data.profileThemeEnabled || false);
          setProfileThemeMode(data.profileThemeMode || 'curated');
          setProfileThemeUrl(data.profileThemeUrl || '');
          setCouncilEligible(data.councilEligible || false);
          setFutureEditorialScopeEnabled(data.futureEditorialScopeEnabled || false);
          setNotesInternal(data.notesInternal || '');
        }
      } catch (error) {
        console.error('Error fetching assignment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    if (!assignment?.userId) return;

    const fetchUserCtx = async () => {
      setIsCtxLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', assignment.userId));
        if (userDoc.exists()) {
          setUserCtx({ uid: userDoc.id, ...userDoc.data() } as UserProfile);
        }
      } catch (err) {
        console.error('Error fetching user context:', err);
      } finally {
        setIsCtxLoading(false);
      }
    };

    fetchUserCtx();
  }, [assignment?.userId]);

  const docRef = doc(db, 'communityArchitectAssignments', assignmentId);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(docRef, {
        countryCode: countryCode.trim(),
        countryName: countryName.trim(),
        categoryId: categoryId.trim(),
        categoryName: categoryName.trim(),
        subcategoryId: subcategoryId.trim(),
        subcategoryName: subcategoryName.trim(),
        publicTitle: publicTitle.trim(),
        publicStatement: publicStatement.trim(),
        blockReason: blockReason.trim() || null,
        profileThemeEnabled,
        profileThemeMode,
        profileThemeUrl: profileThemeUrl.trim() || null,
        councilEligible,
        futureEditorialScopeEnabled,
        notesInternal: notesInternal.trim() || null,
        updatedAt: Timestamp.now(),
      });
      toast({ title: 'Assignment saved' });
      // Refresh local state
      const snap = await getDoc(docRef);
      if (snap.exists()) setAssignment({ id: snap.id, ...snap.data() } as CommunityArchitectAssignment);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Save failed', description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!user) return;
    try {
      await updateDoc(docRef, { isActive: true, isBlocked: false, updatedAt: Timestamp.now() });
      toast({ title: 'Assignment activated' });
      const snap = await getDoc(docRef);
      if (snap.exists()) setAssignment({ id: snap.id, ...snap.data() } as CommunityArchitectAssignment);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Activation failed', description: error.message });
    }
  };

  const handleDeactivate = async () => {
    if (!user) return;
    setShowDeactivateConfirm(false);
    try {
      await updateDoc(docRef, { isActive: false, updatedAt: Timestamp.now() });
      toast({ title: 'Assignment deactivated' });
      const snap = await getDoc(docRef);
      if (snap.exists()) setAssignment({ id: snap.id, ...snap.data() } as CommunityArchitectAssignment);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Deactivation failed', description: error.message });
    }
  };

  const handleBlock = async () => {
    if (!user) return;
    setShowBlockConfirm(false);
    try {
      await updateDoc(docRef, {
        isBlocked: true,
        isActive: false,
        blockedAt: Timestamp.now(),
        blockedBy: user.uid,
        blockReason: blockReason.trim() || null,
        updatedAt: Timestamp.now(),
      });
      toast({ title: 'Assignment blocked' });
      const snap = await getDoc(docRef);
      if (snap.exists()) setAssignment({ id: snap.id, ...snap.data() } as CommunityArchitectAssignment);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Block failed', description: error.message });
    }
  };

  const handleUnblock = async () => {
    if (!user) return;
    try {
      await updateDoc(docRef, { isBlocked: false, updatedAt: Timestamp.now() });
      toast({ title: 'Assignment unblocked' });
      const snap = await getDoc(docRef);
      if (snap.exists()) setAssignment({ id: snap.id, ...snap.data() } as CommunityArchitectAssignment);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Unblock failed', description: error.message });
    }
  };

  const handleRenew = async () => {
    if (!user || !assignment) return;
    try {
      let currentEnd: Date;
      if (assignment.termEndAt?.toDate) {
        currentEnd = assignment.termEndAt.toDate();
      } else {
        currentEnd = new Date();
      }
      const newEnd = new Date(currentEnd);
      newEnd.setMonth(newEnd.getMonth() + 6);

      await updateDoc(docRef, {
        termEndAt: Timestamp.fromDate(newEnd),
        renewalCount: (assignment.renewalCount || 0) + 1,
        updatedAt: Timestamp.now(),
      });
      toast({ title: 'Term renewed for 6 months' });
      const snap = await getDoc(docRef);
      if (snap.exists()) setAssignment({ id: snap.id, ...snap.data() } as CommunityArchitectAssignment);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Renewal failed', description: error.message });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Assignment not found.</p>
        <Link href="/admin/community-architects">
          <Button variant="outline" className="mt-4 rounded-xl">Back to list</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/community-architects">
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Landmark className="w-6 h-6 text-accent" />
            Edit Assignment
          </h1>
          <p className="text-sm text-muted-foreground font-mono">{assignment.userId}</p>
        </div>
        <div className="flex items-center gap-2">
          {assignment.isBlocked && <Badge variant="destructive" className="text-[9px] font-black uppercase tracking-widest h-5">Blocked</Badge>}
          {assignment.isActive && !assignment.isBlocked && <Badge className="text-[9px] font-black uppercase tracking-widest h-5 bg-emerald-600">Active</Badge>}
          {!assignment.isActive && !assignment.isBlocked && <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest h-5">Inactive</Badge>}
        </div>
      </div>

      {/* User Context Shortcut (Persistent in Edit) */}
      {(userCtx || isCtxLoading) && (
        <Card className="border-muted/30 bg-muted/5 shadow-sm overflow-hidden">
          <CardHeader className="py-3 px-5 border-b border-muted/10 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
               <User className="w-3.5 h-3.5 text-muted-foreground/60" />
               <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Assigned Profile Identity</span>
            </div>
            {isCtxLoading && <Skeleton className="h-3 w-16" />}
          </CardHeader>
          <CardContent className="p-5">
            {isCtxLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ) : userCtx ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-muted/20 shadow-sm">
                    <AvatarImage src={userCtx.avatarUrl} />
                    <AvatarFallback className="font-bold bg-muted/20 text-foreground/70">
                      {(userCtx.displayName || userCtx.name || '?').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <h3 className="font-black text-lg tracking-tight leading-none text-foreground/90">{userCtx.displayName || userCtx.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                        <Mail className="w-3 h-3" />
                        {userCtx.email}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                        <Hash className="w-3 h-3" />
                        {userCtx.uid}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                   <Badge variant="outline" className="border-muted/30 text-muted-foreground text-[8px] font-black uppercase px-2 py-0.5 tracking-tighter">Verified Context</Badge>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <ShieldOff className="w-4 h-4" />
                User identity data could not be verified for this UID.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/5 border-b border-muted/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            {/* Activate */}
            {(!assignment.isActive || assignment.isBlocked) && (
              <Button onClick={handleActivate} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold uppercase text-[10px] tracking-widest gap-2 h-10 shadow-md">
                <Power className="w-3.5 h-3.5" />
                Activate
              </Button>
            )}

            {/* Deactivate */}
            {assignment.isActive && !assignment.isBlocked && (
              <Button onClick={() => setShowDeactivateConfirm(true)} variant="outline" className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 h-10 border-muted/50">
                <PowerOff className="w-3.5 h-3.5" />
                Deactivate
              </Button>
            )}

            {/* Block */}
            {!assignment.isBlocked && (
              <Button onClick={() => setShowBlockConfirm(true)} variant="destructive" className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 h-10 shadow-md">
                <Ban className="w-3.5 h-3.5" />
                Block
              </Button>
            )}

            {/* Unblock */}
            {assignment.isBlocked && (
              <Button onClick={handleUnblock} variant="outline" className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 h-10 border-orange-300 text-orange-700 hover:bg-orange-50">
                <ShieldOff className="w-3.5 h-3.5" />
                Unblock
              </Button>
            )}

            {/* Renew */}
            <Button onClick={handleRenew} variant="outline" className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 h-10 border-accent/30 text-accent hover:bg-accent/5">
              <RefreshCcw className="w-3.5 h-3.5" />
              Renew +6 months
            </Button>
          </div>

          {/* Status info */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/10 rounded-xl">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-0.5">Term Start</p>
              <p className="text-xs font-bold">{safeFormatDate(assignment.termStartAt)}</p>
            </div>
            <div className="p-3 bg-muted/10 rounded-xl">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-0.5">Term End</p>
              <p className="text-xs font-bold">{safeFormatDate(assignment.termEndAt)}</p>
            </div>
            <div className="p-3 bg-muted/10 rounded-xl">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-0.5">Renewals</p>
              <p className="text-xs font-bold">{assignment.renewalCount || 0}</p>
            </div>
            <div className="p-3 bg-muted/10 rounded-xl">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-0.5">Assigned By</p>
              <p className="text-xs font-bold font-mono truncate">{assignment.assignedBy?.slice(0, 12) || '—'}…</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity */}
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/5 border-b border-muted/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Identity</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Country Name</Label>
              <Input value={countryName} onChange={(e) => setCountryName(e.target.value)} className="rounded-xl text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Country Code</Label>
              <Input value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="rounded-xl text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Category Name</Label>
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="rounded-xl text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Category ID</Label>
              <Input value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded-xl text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Subcategory Name</Label>
              <Input value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} className="rounded-xl text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Subcategory ID</Label>
              <Input value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="rounded-xl text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Info */}
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/5 border-b border-muted/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Public Info</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Public Title</Label>
            <Input value={publicTitle} onChange={(e) => setPublicTitle(e.target.value)} className="rounded-xl text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Public Statement</Label>
            <Textarea value={publicStatement} onChange={(e) => setPublicStatement(e.target.value)} className="rounded-xl text-sm min-h-[80px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Block Reason</Label>
            <Input value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Reason for blocking (if applicable)" className="rounded-xl text-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/5 border-b border-muted/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Profile Theme</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl">
            <div>
              <Label className="text-sm font-bold">Theme Enabled</Label>
              <p className="text-[10px] text-muted-foreground">Custom profile background privilege.</p>
            </div>
            <Switch checked={profileThemeEnabled} onCheckedChange={setProfileThemeEnabled} />
          </div>
          {profileThemeEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-accent/20">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Theme Mode</Label>
                <Select value={profileThemeMode} onValueChange={(v: 'custom' | 'curated') => setProfileThemeMode(v)}>
                  <SelectTrigger className="rounded-xl text-sm w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curated">Curated</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Theme URL</Label>
                <Input value={profileThemeUrl} onChange={(e) => setProfileThemeUrl(e.target.value)} placeholder="https://..." className="rounded-xl text-sm" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Governance */}
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/5 border-b border-muted/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Governance (Future-Ready)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl">
            <div>
              <Label className="text-sm font-bold">Council Eligible</Label>
              <p className="text-[10px] text-muted-foreground">May participate in future Architect Council.</p>
            </div>
            <Switch checked={councilEligible} onCheckedChange={setCouncilEligible} />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl">
            <div>
              <Label className="text-sm font-bold">Editorial Scope</Label>
              <p className="text-[10px] text-muted-foreground">Future scoped editorial permissions.</p>
            </div>
            <Switch checked={futureEditorialScopeEnabled} onCheckedChange={setFutureEditorialScopeEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Internal */}
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/5 border-b border-muted/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Internal</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Internal Notes</Label>
            <Textarea value={notesInternal} onChange={(e) => setNotesInternal(e.target.value)} placeholder="Admin-only notes..." className="rounded-xl text-sm min-h-[80px]" />
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end pb-8">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-accent hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest gap-2 h-12 px-8 shadow-md transition-all active:scale-95"
        >
          {isSaving ? 'Saving...' : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Block Confirmation */}
      <AlertDialog open={showBlockConfirm} onOpenChange={setShowBlockConfirm}>
        <AlertDialogContent className="rounded-3xl border-destructive/20 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Block Assignment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              This will deactivate and block this Community Architect assignment.
              The architect will be removed from the public directory and lose profile privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-3">
            <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock} className="rounded-xl bg-destructive hover:bg-destructive/90 font-black uppercase text-[10px] tracking-widest shadow-md">
              Confirm Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation */}
      <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
        <AlertDialogContent className="rounded-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <PowerOff className="w-5 h-5 text-muted-foreground" />
              Deactivate Assignment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              This will remove this architect from the public directory and profile display.
              The assignment data will be preserved and can be reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-3">
            <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate} className="rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md">
              Confirm Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
