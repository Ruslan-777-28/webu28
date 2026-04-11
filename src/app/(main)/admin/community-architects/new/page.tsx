'use client';

import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Landmark, ArrowLeft, Save, User, Mail, Hash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';

export default function NewCommunityArchitectPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledUserId = searchParams?.get('userId');
  const { toast } = useToast();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isCtxLoading, setIsCtxLoading] = useState(!!prefilledUserId);
  const [userCtx, setUserCtx] = useState<Partial<UserProfile> | null>(null);

  // Form state
  const [userId, setUserId] = useState(prefilledUserId || '');
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [publicTitle, setPublicTitle] = useState('Community Architect');
  const [publicStatement, setPublicStatement] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [profileThemeEnabled, setProfileThemeEnabled] = useState(false);
  const [profileThemeMode, setProfileThemeMode] = useState<'custom' | 'curated'>('curated');
  const [profileThemeUrl, setProfileThemeUrl] = useState('');
  const [councilEligible, setCouncilEligible] = useState(false);
  const [futureEditorialScopeEnabled, setFutureEditorialScopeEnabled] = useState(false);
  const [notesInternal, setNotesInternal] = useState('');

  React.useEffect(() => {
    if (!prefilledUserId) return;
    
    const fetchCtx = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', prefilledUserId));
        if (userDoc.exists()) {
          setUserCtx({ uid: userDoc.id, ...userDoc.data() } as UserProfile);
        }
      } catch (err) {
        console.error('Error fetching user context:', err);
      } finally {
        setIsCtxLoading(false);
      }
    };
    fetchCtx();
  }, [prefilledUserId]);

  const handleCreate = async () => {
    if (!user || !userId.trim()) {
      toast({ variant: 'destructive', title: 'User ID is required' });
      return;
    }

    if (!countryName.trim() || !categoryName.trim() || !subcategoryName.trim()) {
      toast({ variant: 'destructive', title: 'Country, Category and Subcategory are required' });
      return;
    }

    setIsSaving(true);
    try {
      const now = Timestamp.now();
      const termEnd = new Date();
      termEnd.setMonth(termEnd.getMonth() + 6);

      await addDoc(collection(db, 'communityArchitectAssignments'), {
        userId: userId.trim(),
        countryCode: countryCode.trim() || countryName.trim().slice(0, 2).toUpperCase(),
        countryName: countryName.trim(),
        categoryId: categoryId.trim() || categoryName.trim().toLowerCase().replace(/\s+/g, '-'),
        categoryName: categoryName.trim(),
        subcategoryId: subcategoryId.trim() || subcategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
        subcategoryName: subcategoryName.trim(),
        publicTitle: publicTitle.trim() || 'Community Architect',
        publicStatement: publicStatement.trim(),
        isActive,
        isBlocked: false,
        blockReason: null,
        termStartAt: now,
        termEndAt: Timestamp.fromDate(termEnd),
        renewalCount: 0,
        isFeatured: false,
        profileThemeEnabled,
        profileThemeMode,
        profileThemeUrl: profileThemeUrl.trim() || null,
        councilEligible,
        futureEditorialScopeEnabled,
        assignedBy: user.uid,
        assignedAt: now,
        updatedAt: now,
        blockedAt: null,
        blockedBy: null,
        notesInternal: notesInternal.trim() || null,
      });

      toast({ title: 'Assignment created successfully' });
      router.push('/admin/community-architects');
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      toast({ variant: 'destructive', title: 'Failed to create assignment', description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/community-architects">
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Landmark className="w-6 h-6 text-accent" />
            New Assignment
          </h1>
          <p className="text-sm text-muted-foreground">Assign a new Community Architect role.</p>
        </div>
      </div>

      {/* User Context Shortcut */}
      {(prefilledUserId || userCtx) && (
        <Card className="border-accent/20 bg-accent/5 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <CardHeader className="py-3 px-5 border-b border-accent/10 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
               <User className="w-3.5 h-3.5 text-accent" />
               <span className="text-[10px] uppercase font-black tracking-widest text-accent">Target User Identity</span>
            </div>
            {isCtxLoading && <Skeleton className="h-3 w-16" />}
          </CardHeader>
          <CardContent className="p-5">
            {isCtxLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ) : userCtx ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage src={userCtx.avatarUrl} />
                    <AvatarFallback className="font-bold bg-accent/10 text-accent">
                      {(userCtx.displayName || userCtx.name || '?').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <h3 className="font-black text-lg tracking-tight leading-none">{userCtx.displayName || userCtx.name}</h3>
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
                   <Badge variant="outline" className="border-accent/30 text-accent text-[8px] font-black uppercase px-2 py-0.5 tracking-tighter">Verified Context</Badge>
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

      {/* Identity Section */}
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/5 border-b border-muted/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Identity</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">User ID (UID)</Label>
            <Input 
              placeholder="Firebase UID..." 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)} 
              disabled={!!prefilledUserId}
              readOnly={!!prefilledUserId}
              className={`rounded-xl font-mono text-sm ${prefilledUserId ? 'bg-muted/50 border-accent/20 cursor-not-allowed text-accent/70' : ''}`} 
            />
            {prefilledUserId && <p className="text-[9px] font-bold text-accent/60 italic">UID locked by shortcut flow</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Country Name</Label>
              <Input placeholder="e.g. Ukraine" value={countryName} onChange={(e) => setCountryName(e.target.value)} className="rounded-xl text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Country Code</Label>
              <Input placeholder="e.g. UA" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="rounded-xl text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Category Name</Label>
              <Input placeholder="e.g. Езотерика" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="rounded-xl text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Category ID</Label>
              <Input placeholder="Auto-derived if empty" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded-xl text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Subcategory Name</Label>
              <Input placeholder="e.g. Tarot" value={subcategoryName} onChange={(e) => setSubcategoryName(e.target.value)} className="rounded-xl text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Subcategory ID</Label>
              <Input placeholder="Auto-derived if empty" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="rounded-xl text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Info Section */}
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
            <Textarea value={publicStatement} onChange={(e) => setPublicStatement(e.target.value)} placeholder="Short public statement about this architect..." className="rounded-xl text-sm min-h-[80px]" />
          </div>
        </CardContent>
      </Card>

      {/* Status & Theme */}
      <Card className="border-muted/40 shadow-sm">
        <CardHeader className="bg-muted/5 border-b border-muted/10">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">Status & Theme</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl">
            <div>
              <Label className="text-sm font-bold">Active</Label>
              <p className="text-[10px] text-muted-foreground">Make this assignment publicly visible.</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl">
            <div>
              <Label className="text-sm font-bold">Profile Theme</Label>
              <p className="text-[10px] text-muted-foreground">Enable custom profile background privilege.</p>
            </div>
            <Switch checked={profileThemeEnabled} onCheckedChange={setProfileThemeEnabled} />
          </div>

          {profileThemeEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-accent/20">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Theme Mode</Label>
                <Select value={profileThemeMode} onValueChange={(v: 'custom' | 'curated') => setProfileThemeMode(v)}>
                  <SelectTrigger className="rounded-xl text-sm w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
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

      {/* Governance (future-ready) */}
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

      {/* Internal Notes */}
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

      {/* Submit */}
      <div className="flex justify-end pb-8">
        <Button
          onClick={handleCreate}
          disabled={isSaving || !userId.trim()}
          className="rounded-xl bg-accent hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest gap-2 h-12 px-8 shadow-md transition-all active:scale-95"
        >
          {isSaving ? 'Saving...' : (
            <>
              <Save className="w-4 h-4" />
              Create Assignment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
