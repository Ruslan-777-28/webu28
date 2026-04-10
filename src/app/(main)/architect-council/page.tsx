'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { useUser } from '@/hooks/use-auth';
import { 
    Landmark, 
    Crown, 
    ShieldCheck, 
    MessageSquare, 
    Lightbulb, 
    Rocket, 
    MapPin, 
    Flag, 
    Info, 
    ArrowRight, 
    Plus, 
    Pin, 
    Lock, 
    Users,
    TrendingUp,
    TrendingUp as trendingUp,
    Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import type { CouncilThread, CouncilThreadType, CouncilMember } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';

type CouncilStatusResponse = {
    success: boolean;
    status: 'admin' | 'member' | 'not-eligible' | 'not-authenticated';
    memberData?: any;
    stats?: {
        activeThreadsCount: number;
        openIdeasCount: number;
        membersCount: number;
    };
};

export default function ArchitectCouncilPage() {
    const { user, loading: authLoading } = useUser();
    const [status, setStatus] = useState<CouncilStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [threads, setThreads] = useState<CouncilThread[]>([]);
    const [filterType, setFilterType] = useState<string>('all');
    const { toast } = useToast();

    useEffect(() => {
        const checkAccess = async () => {
            if (authLoading) return;
            
            try {
                const token = user ? await user.getIdToken() : null;
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch('/api/architect-council/me', { headers });
                const json = await res.json();
                setStatus(json);

                if (json.status === 'admin' || json.status === 'member') {
                    fetchThreads(token);
                }
            } catch (error) {
                console.error('Error checking council access:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAccess();
    }, [authLoading, user]);

    const fetchThreads = async (token: string | null) => {
        try {
            const res = await fetch(`/api/architect-council/threads?type=${filterType}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            const json = await res.json();
            if (json.success) {
                setThreads(json.data);
            }
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/30 flex flex-col">
                <Navigation subtitle="Architect Council" />
                <div className="flex-grow container mx-auto py-20 px-4">
                    <Skeleton className="h-40 w-full mb-8 rounded-3xl" />
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3 space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // GATED STATE: Not Authenticated / Regular User
    if (status?.status === 'not-authenticated' || (status?.status === 'not-eligible' && !status.memberData)) {
        return <GatedAccessView type="guest" />;
    }

    // GATED STATE: Architect but not eligible yet
    if (status?.status === 'not-eligible' && status.memberData) {
        return <GatedAccessView type="architect" memberData={status.memberData} />;
    }

    // FULL ACCESS: Admin or Eligible Member
    return (
        <div className="min-h-screen bg-slate-50/30 flex flex-col">
            <Navigation subtitle="Architect Council" />
            
            <main className="flex-grow pb-20">
                {/* Hero Section */}
                <section className="bg-white border-b border-border/40 py-12 mb-8">
                    <div className="container mx-auto px-4 max-w-6xl text-center md:text-left">
                         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 text-accent text-[10px] uppercase tracking-[0.2em] font-black mb-4">
                                    <ShieldCheck className="h-3 w-3" />
                                    Private Governance Workspace
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 flex items-center justify-center md:justify-start gap-4">
                                    {status?.status === 'admin' && <Crown className="h-8 w-8 text-black" />}
                                    Architect Council
                                </h1>
                                <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
                                    Закритий простір для Community Architects та platform admin, де формуються ініціативи, 
                                    обговорюються запуски й подається зворотний зв’язок щодо розвитку платформи.
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-center md:text-right">
                                <SummaryBadge label="Active Threads" value={status?.stats?.activeThreadsCount || 0} icon={MessageSquare} />
                                <SummaryBadge label="Open Ideas" value={status?.stats?.openIdeasCount || 0} icon={Lightbulb} />
                                <SummaryBadge label="Council Members" value={status?.stats?.membersCount || 0} icon={Users} />
                            </div>
                         </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Feed */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Dashboard Tabs & Actions */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-20 bg-slate-50/90 backdrop-blur-sm py-3 -mx-2 px-2 rounded-xl">
                                <Tabs defaultValue="all" className="w-full" onValueChange={setFilterType}>
                                    <TabsList className="bg-muted/40 p-1 rounded-xl w-full md:w-auto h-auto min-h-11 overflow-x-auto justify-start no-scrollbar">
                                        <TabsTrigger value="all" className="rounded-lg text-[10px] uppercase tracking-widest font-bold">All</TabsTrigger>
                                        <TabsTrigger value="announcement" className="rounded-lg text-[10px] uppercase tracking-widest font-bold">Announcements</TabsTrigger>
                                        <TabsTrigger value="idea" className="rounded-lg text-[10px] uppercase tracking-widest font-bold">Ideas</TabsTrigger>
                                        <TabsTrigger value="launch_discussion" className="rounded-lg text-[10px] uppercase tracking-widest font-bold">Launches</TabsTrigger>
                                        <TabsTrigger value="local_initiative" className="rounded-lg text-[10px] uppercase tracking-widest font-bold">Local</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="rounded-xl shadow-lg shadow-black/5 gap-2 h-11 px-6 text-xs uppercase tracking-widest font-black shrink-0">
                                            <Plus className="h-4 w-4" />
                                            New Thread
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 border-none overflow-hidden shadow-2xl">
                                        <div className="bg-black p-8 text-white">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] uppercase tracking-[0.2em] font-black mb-4">
                                                <Plus className="h-3 w-3" />
                                                Influence the Future
                                            </div>
                                            <DialogTitle className="text-2xl font-black tracking-tight">Propose a Council Thread</DialogTitle>
                                            <DialogDescription className="text-white/40 text-xs mt-2">
                                                Share an idea, discuss a launch, or initiate a local movement within the Council.
                                            </DialogDescription>
                                        </div>
                                        
                                        <CreateThreadForm onFlush={() => { 
                                            const token = user ? user.getIdToken() : null;
                                            token.then(t => fetchThreads(t));
                                        }} isAdmin={status?.status === 'admin'} />
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Pinned / Priority area */}
                            {threads.some(t => t.isPinned) && (
                                <div className="space-y-4">
                                     <div className="flex items-center gap-2 mb-2">
                                        <Pin className="h-3 w-3 text-black opacity-40 rotate-45" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Pinned & Piorities</span>
                                     </div>
                                     <div className="grid grid-cols-1 gap-4">
                                        {threads.filter(t => t.isPinned).map(thread => (
                                            <ThreadCard key={thread.id} thread={thread} isPinnedUI />
                                        ))}
                                     </div>
                                </div>
                            )}

                            {/* Main List */}
                            <div className="space-y-4">
                                {threads.some(t => !t.isPinned) ? (
                                    threads.filter(t => !t.isPinned).map(thread => (
                                        <ThreadCard key={thread.id} thread={thread} />
                                    ))
                                ) : !threads.some(t => t.isPinned) && (
                                    <div className="text-center py-20 border-2 border-dashed border-muted/40 rounded-3xl">
                                        <Landmark className="h-10 w-10 text-muted/20 mx-auto mb-4" />
                                        <p className="text-sm font-medium text-muted-foreground">The Council is waiting for its first direction.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Member Identity Strip */}
                            <Card className="rounded-3xl border-muted/50 overflow-hidden">
                                <div className="h-16 bg-muted/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3">
                                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-bold border-muted/40 bg-white/50">{status?.status}</Badge>
                                    </div>
                                </div>
                                <CardContent className="pt-0 relative px-6">
                                    <div className="-mt-8 mb-4 border-4 border-white rounded-full inline-block shadow-sm">
                                         <Avatar className="h-16 w-16">
                                            <AvatarImage src={status?.memberData?.authorAvatarUrl || user?.photoURL} />
                                            <AvatarFallback className="text-lg font-black bg-muted/20">{(status?.memberData?.authorName || user?.displayName || '?').slice(0, 1)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="space-y-1 mb-6">
                                        <h3 className="font-black text-sm">{status?.memberData?.authorName || user?.displayName}</h3>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                            {status?.memberData?.subcategoryId ? `${status.memberData.subcategoryName} · ${status.memberData.countryName}` : 'Platform Administrator'}
                                        </p>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-muted/10 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Mandate Ends</span>
                                            <span className="text-[10px] font-black">{status?.memberData?.termEndAt ? new Date(status.memberData.termEndAt).toLocaleDateString() : 'Infinite'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Principles Block */}
                            <Card className="rounded-3xl border-muted/50 bg-black text-white p-6">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Principles</span>
                                    </div>
                                    <div className="space-y-4">
                                        <PrincipleItem text="Responsibility" desc="Ваші слова формують вектор розвитку." />
                                        <PrincipleItem text="Quality over Noise" desc="Цінуємо глибину аналізу та ідей." />
                                        <PrincipleItem text="Confidentiality" desc="Те, що в Council, залишається в Council." />
                                    </div>
                                </div>
                            </Card>
                        </aside>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

function CreateThreadForm({ onFlush, isAdmin }: { onFlush: () => void, isAdmin: boolean }) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [type, setType] = useState<CouncilThreadType>('idea');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim() || isSubmitting || !user) return;

        setIsSubmitting(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/architect-council/threads', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, body, type })
            });
            const json = await res.json();
            if (json.success) {
                toast({ title: 'Thread created successfully' });
                onFlush();
                // Close modal via click (hacky but simple for shadcn default Dialog)
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            } else {
                toast({ title: 'Error', description: json.message, variant: 'destructive' });
            }
        } catch (error) {
            console.error('Create thread error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Thread Title</Label>
                <Input 
                    placeholder="Clear and strategic title..." 
                    className="h-12 rounded-xl bg-slate-50 border-muted/20 focus-visible:ring-accent/20 font-bold"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Focus Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as CouncilThreadType)}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-muted/20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="idea">Idea / Proposal</SelectItem>
                            <SelectItem value="launch_discussion">Launch Discussion</SelectItem>
                            <SelectItem value="local_initiative">Local Initiative</SelectItem>
                            <SelectItem value="product_feedback">Product Feedback</SelectItem>
                            {isAdmin && <SelectItem value="announcement">Official Announcement</SelectItem>}
                            <SelectItem value="internal_note">Internal Note</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Scope</Label>
                    <div className="h-12 rounded-xl bg-slate-50 border border-muted/10 flex items-center px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Council Only
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Body / Rationale</Label>
                <Textarea 
                    placeholder="Explain the context, goal and expected impact..." 
                    className="min-h-[160px] rounded-2xl bg-slate-50 border-muted/20 focus-visible:ring-accent/20 resize-none font-medium leading-relaxed"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    required
                />
            </div>

            <DialogFooter className="pt-4">
                <Button 
                    type="submit" 
                    disabled={isSubmitting || !title.trim() || !body.trim()}
                    className="w-full h-14 rounded-2xl text-xs uppercase tracking-widest font-black gap-2 shadow-xl shadow-accent/20"
                >
                    {isSubmitting ? 'Creating...' : 'Establish Thread'}
                    <Send className="h-4 w-4" />
                </Button>
            </DialogFooter>
        </form>
    );
}

function SummaryBadge({ label, value, icon: Icon }: { label: string, value: number, icon: any }) {
    return (
        <div className="p-3 px-4 rounded-2xl bg-white border border-border/40 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
            <p className="text-lg font-black tracking-tight leading-none">{value}</p>
        </div>
    );
}

function PrincipleItem({ text, desc }: { text: string, desc: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/90">{text}</p>
            <p className="text-[10px] text-white/40 leading-relaxed font-light">{desc}</p>
        </div>
    );
}

function ThreadCard({ thread, isPinnedUI }: { thread: CouncilThread, isPinnedUI?: boolean }) {
    const typeMetadata: Record<CouncilThreadType, { icon: any, label: string, color: string }> = {
        announcement: { icon: Flag, label: 'Announcement', color: 'bg-black text-white' },
        idea: { icon: Lightbulb, label: 'Idea', color: 'bg-amber-500/10 text-amber-600' },
        launch_discussion: { icon: Rocket, label: 'Launch', color: 'bg-blue-500/10 text-blue-600' },
        local_initiative: { icon: MapPin, label: 'Local', color: 'bg-emerald-500/10 text-emerald-600' },
        shortlist_nomination: { icon: trendingUp, label: 'Nomination', color: 'bg-accent/10 text-accent' },
        product_feedback: { icon: MessageSquare, label: 'Feedback', color: 'bg-slate-500/10 text-slate-600' },
        internal_note: { icon: Info, label: 'Internal', color: 'bg-muted text-muted-foreground' },
    };

    const meta = typeMetadata[thread.type];
    const statusLabels: Record<string, { label: string, color: string }> = {
        open: { label: 'Open', color: 'border-green-500/30 text-green-600 bg-green-500/5' },
        in_review: { label: 'In review', color: 'border-amber-500/30 text-amber-600 bg-amber-500/5' },
        planned: { label: 'Planned', color: 'border-blue-500/30 text-blue-600 bg-blue-500/5' },
        done: { label: 'Done', color: 'border-muted text-muted-foreground bg-muted/20' },
    };

    return (
        <Link href={`/architect-council/${thread.id}`}>
            <Card className={`rounded-2xl border-muted/50 hover:border-muted-foreground/30 transition-all cursor-pointer overflow-hidden ${isPinnedUI ? 'bg-white shadow-md border-muted' : 'bg-white/50'}`}>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={thread.authorAvatarUrl || ''} />
                                <AvatarFallback className="text-[10px] font-black">{thread.authorName.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[11px] font-bold truncate">{thread.authorName}</span>
                                    <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${meta.color}`}>
                                        {meta.label}
                                    </div>
                                </div>
                                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                                    {thread.authorSubcategoryId ? `${thread.authorSubcategoryName} · ${thread.authorCountryName}` : 'Administrator'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {thread.isLocked && <Lock className="h-3 w-3 text-muted-foreground/40" />}
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusLabels[thread.status]?.color}`}>
                                {statusLabels[thread.status]?.label}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-base font-black tracking-tight mb-2 group-hover:text-accent transition-colors leading-tight">{thread.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-6 font-medium opacity-80">{thread.body}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-muted/5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                                <TrendingUp className="h-3.5 w-3.5 text-accent" />
                                <span>{thread.voteCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60">
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span>{thread.commentCount}</span>
                            </div>
                        </div>
                        <div className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                            {new Date(thread.lastActivityAt).toLocaleDateString()}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function GatedAccessView({ type, memberData }: { type: 'guest' | 'architect', memberData?: any }) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
             <div className="max-w-2xl w-full text-center space-y-12">
                <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-8 bg-white/5">
                        <Crown className="h-8 w-8 text-white" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] uppercase tracking-[0.2em] font-black">
                        {type === 'guest' ? 'Inner Circle' : 'Elevation Required'}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Architect Council
                    </h1>
                </div>

                <div className="space-y-8 bg-white/5 p-8 md:p-12 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                    {type === 'guest' ? (
                        <>
                            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                                Закрите коло стратегічного впливу та управління платформою. 
                                Цей простір призначений виключно для офіційних Community Architects та адміністрації.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <GatedInfoItem title="Influence" desc="Вибір та обговорення ключових продуктів." />
                                <GatedInfoItem title="Governance" desc="Формування принципів роботи спільнот." />
                            </div>
                        </>
                    ) : (
                        <>
                             <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                                Вітаємо, Community Architect. Ви на порозі входу до Council.
                            </p>
                            <p className="text-sm text-white/40 leading-relaxed max-w-lg mx-auto">
                                Доступ до Ради надається платформою індивідуально на основі внеску, досвіду та зрілості взаємодії. Це наступний рівень відповідальності та впливу.
                            </p>
                        </>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                    <Link href="/community-architects">
                        <Button variant="outline" className="rounded-2xl border-white/20 hover:bg-white/10 px-8 h-14 uppercase tracking-widest text-xs font-black">
                            <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
                            Return to Directory
                        </Button>
                    </Link>
                    {type === 'guest' ? (
                        <div className="text-[10px] uppercase tracking-[0.3em] text-white/30">Lector Governance Layer</div>
                    ) : (
                        <Badge variant="outline" className="border-accent/40 text-accent h-14 px-8 rounded-2xl uppercase tracking-widest text-[10px] font-black bg-accent/5">Eligibility Pending Review</Badge>
                    )}
                </div>
             </div>
        </div>
    );
}

function GatedInfoItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/90">{title}</h4>
            <p className="text-[10px] text-white/40 leading-relaxed">{desc}</p>
        </div>
    );
}
