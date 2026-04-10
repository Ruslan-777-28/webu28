'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { useUser } from '@/hooks/use-auth';
import { 
    ChevronLeft, 
    Share2, 
    MoreHorizontal, 
    MessageSquare, 
    TrendingUp, 
    Pin, 
    Lock, 
    Crown, 
    ShieldCheck, 
    ArrowRight,
    Send,
    AlertCircle,
    CheckCircle2,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Skeleton } from '@/skeleton';
import { useToast } from '@/components/ui/use-toast';
import type { CouncilThread, CouncilComment, CouncilThreadStatus } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function CouncilThreadDetailPage({ params }: { params: { id: string } }) {
    const { user, loading: authLoading } = useUser();
    const [thread, setThread] = useState<CouncilThread | null>(null);
    const [comments, setComments] = useState<CouncilComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVoting, setIsVoting] = useState(false);
    const [commentBody, setCommentBody] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { toast } = useToast();

    const fetchThreadData = async () => {
        try {
            const token = user ? await user.getIdToken() : null;
            if (!token) return;

            const [threadRes, commentsRes, meRes] = await Promise.all([
                fetch(`/api/architect-council/threads/${params.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`/api/architect-council/threads/${params.id}/comments`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/architect-council/me', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const threadJson = await threadRes.json();
            const commentsJson = await commentsRes.json();
            const meJson = await meRes.json();

            if (threadJson.success) setThread(threadJson.data);
            if (commentsJson.success) setComments(commentsJson.data);
            setIsAdmin(meJson.status === 'admin');

        } catch (error) {
            console.error('Error fetching thread detail:', error);
            toast({ title: 'Error', description: 'Failed to load thread.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchThreadData();
        }
    }, [authLoading, user, params.id]);

    const handleVote = async () => {
        if (isVoting || !user) return;
        setIsVoting(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`/api/architect-council/threads/${params.id}/vote`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                setThread(prev => prev ? { 
                    ...prev, 
                    voteCount: json.action === 'added' ? prev.voteCount + 1 : prev.voteCount - 1 
                } : null);
            }
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentBody.trim() || isSubmittingComment || !user) return;
        setIsSubmittingComment(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch(`/api/architect-council/threads/${params.id}/comments`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ body: commentBody })
            });
            const json = await res.json();
            if (json.success) {
                setCommentBody('');
                fetchThreadData(); // Refresh list
                toast({ title: 'Comment added' });
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleAdminAction = async (updates: any) => {
        if (!user || !isAdmin) return;
        try {
            const token = await user.getIdToken();
            const res = await fetch(`/api/architect-council/threads/${params.id}`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            const json = await res.json();
            if (json.success) {
                setThread(prev => prev ? { ...prev, ...updates } : null);
                toast({ title: 'Action completed' });
            }
        } catch (error) {
            console.error('Admin action error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/30 flex flex-col">
                <Navigation subtitle="Architect Council" />
                <div className="flex-grow container mx-auto py-12 px-4 max-w-4xl">
                    <Skeleton className="h-10 w-32 mb-8 rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-3xl" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!thread) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/30 p-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h1 className="text-xl font-black mb-4">Thread not found</h1>
                <Link href="/architect-council">
                    <Button variant="outline" className="rounded-xl">Back to Council</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/30 flex flex-col">
            <Navigation subtitle="Council Workspace" />
            
            <main className="flex-grow pb-20 pt-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header: Back & Actions */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/architect-council">
                            <Button variant="ghost" className="rounded-xl gap-2 text-xs uppercase tracking-widest font-black -ml-4">
                                <ChevronLeft className="h-4 w-4" />
                                Back to Council
                            </Button>
                        </Link>
                        
                        <div className="flex items-center gap-2">
                             {isAdmin && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-muted/50">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-muted/30">
                                        <DropdownMenuItem className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest py-3" onClick={() => handleAdminAction({ isPinned: !thread.isPinned })}>
                                            <Pin className={`h-4 w-4 ${thread.isPinned ? 'text-accent fill-accent' : ''}`} />
                                            {thread.isPinned ? 'Unpin Thread' : 'Pin Thread'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest py-3" onClick={() => handleAdminAction({ isLocked: !thread.isLocked })}>
                                            <Lock className={`h-4 w-4 ${thread.isLocked ? 'text-accent fill-accent' : ''}`} />
                                            {thread.isLocked ? 'Unlock Thread' : 'Lock Thread'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <div className="px-2 py-2">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Set Status</p>
                                            <div className="grid grid-cols-2 gap-1">
                                                {(['open', 'in_review', 'planned', 'done', 'archived'] as CouncilThreadStatus[]).map(s => (
                                                    <Button 
                                                        key={s} 
                                                        variant={thread.status === s ? 'default' : 'outline'} 
                                                        size="sm" 
                                                        className="h-7 text-[8px] uppercase tracking-widest font-bold rounded-md"
                                                        onClick={() => handleAdminAction({ status: s })}
                                                    >
                                                        {s.replace('_', ' ')}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-muted/50 text-muted-foreground">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Thread Main Content */}
                    <div className="space-y-6 mb-12">
                        {/* Meta Row */}
                        <div className="flex flex-wrap items-center gap-4">
                             <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={thread.authorAvatarUrl || ''} />
                                    <AvatarFallback className="text-sm font-black">{thread.authorName.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-black leading-none mb-1">{thread.authorName}</p>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                         {thread.createdByRole === 'admin' ? 'Platform Administrator' : `${thread.authorSubcategoryName} · ${thread.authorCountryName}`}
                                    </p>
                                </div>
                             </div>
                             <div className="h-4 w-[1px] bg-muted/30 ml-auto hidden md:block" />
                             <div className="flex items-center gap-3 ml-auto md:ml-0 overflow-x-auto no-scrollbar">
                                <Badge variant="outline" className="rounded-lg uppercase tracking-widest text-[8px] font-bold h-6 border-muted/50">
                                    {thread.type.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className={`rounded-lg uppercase tracking-widest text-[8px] font-bold h-6 border-muted/50 ${thread.status === 'open' ? 'bg-green-500/5 text-green-600 border-green-500/20' : ''}`}>
                                    {thread.status.replace('_', ' ')}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                                    {new Date(thread.createdAt).toLocaleDateString()}
                                </span>
                             </div>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">{thread.title}</h1>

                        <Card className="rounded-3xl border-muted/40 shadow-sm overflow-hidden bg-white">
                            <CardContent className="p-8 md:p-12">
                                <div className="prose prose-slate max-w-none prose-sm leading-relaxed text-foreground/80 font-medium">
                                    {thread.body.split('\n').map((para, i) => (
                                        <p key={i} className="mb-4">{para}</p>
                                    ))}
                                </div>

                                <div className="mt-12 flex items-center justify-between pt-8 border-t border-muted/10">
                                    <div className="flex items-center gap-6">
                                        <Button 
                                            onClick={handleVote}
                                            disabled={isVoting}
                                            variant="outline" 
                                            className={`rounded-2xl h-12 px-6 gap-3 transition-all ${isVoting ? 'opacity-50' : ''}`}
                                        >
                                            <TrendingUp className="h-4 w-4 text-accent" />
                                            <span className="text-sm font-black">{thread.voteCount}</span>
                                            <span className="text-[9px] uppercase tracking-widest font-black text-muted-foreground ml-1">Upvotes</span>
                                        </Button>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="text-sm font-black">{thread.commentCount}</span>
                                        </div>
                                    </div>

                                    {thread.isLocked && (
                                        <Badge variant="outline" className="rounded-xl py-2 px-4 gap-2 border-muted/50 text-muted-foreground/60">
                                            <Lock className="h-3 w-3" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Discussion Locked</span>
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                             <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <MessageSquare className="h-4 w-4" />
                                Feedback & Deliberation
                             </h2>
                        </div>

                        {/* Comment Form */}
                        {!thread.isLocked ? (
                            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-muted/50 to-muted/10 border border-muted/30">
                                <div className="bg-white rounded-[1.9rem] p-6 shadow-sm">
                                    <Textarea 
                                        placeholder="Add your strategic feedback or initiative insight..."
                                        className="min-h-[120px] bg-slate-50 border-none rounded-2xl p-4 text-sm focus-visible:ring-accent/20 resize-none font-medium mb-4"
                                        value={commentBody}
                                        onChange={(e) => setCommentBody(e.target.value)}
                                        disabled={isSubmittingComment}
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic flex items-center gap-2">
                                            <ShieldCheck className="h-3 w-3 opacity-40" />
                                            Comments are visible to Council members & admins only
                                        </p>
                                        <Button 
                                            onClick={handleAddComment}
                                            disabled={isSubmittingComment || !commentBody.trim()}
                                            className="rounded-xl px-8 h-12 gap-2 text-xs uppercase tracking-widest font-black"
                                        >
                                            Submit Opinion
                                            <Send className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Card className="rounded-3xl border-dashed border-muted/60 bg-muted/5 p-12 text-center">
                                <Lock className="h-8 w-8 text-muted/30 mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">The discussion has concluded.</p>
                            </Card>
                        )}

                        {/* Comments List */}
                        <div className="space-y-6">
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment.id} className="flex gap-4 group">
                                         <Avatar className="h-10 w-10 shrink-0">
                                            <AvatarImage src={comment.authorAvatarUrl || ''} />
                                            <AvatarFallback className="font-black text-xs">{comment.authorName.slice(0, 1)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black">{comment.authorName}</span>
                                                    <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-foreground/70 leading-relaxed font-medium bg-white/40 p-5 rounded-2xl rounded-tl-none border border-muted/30">
                                                {comment.body}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-40 italic">No formal feedback yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
