'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { useUser } from '@/hooks/use-auth';
import { useArchitectForumAccess } from '@/hooks/use-architect-forum-access';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { updateQuestionStatus } from '@/lib/forum/forum-service';
import type { ForumQuestion } from '@/lib/forum/forum-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, MessageSquare, Heart, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ArchitectForumPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { loading: accessLoading, hasAccess, topicKeys, assignments } = useArchitectForumAccess();
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  const loadQuestions = async () => {
    if (!hasAccess) return;
    
    setQuestionsLoading(true);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) return;

      const url = `/api/forum/architect-questions?status=${statusFilter}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      const json = await res.json();
      if (json.success) {
        setQuestions(json.data);
        setDebugData(json.debug);
        if (process.env.NODE_ENV === 'development') {
          console.debug('[ArchitectForum] Loaded questions:', json.data.length, json.debug);
        }
      } else {
        throw new Error(json.message);
      }
    } catch (error: any) {
      console.error('[ArchitectForum] Failed to load questions:', error);
      toast({
        title: "Помилка завантаження",
        description: error.message || "Не вдалося отримати список питань",
        variant: "destructive"
      });
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Step 2: Fetch forum questions scoped to architect's topics via API
  useEffect(() => {
    loadQuestions();
  }, [hasAccess, user?.uid, statusFilter]);

  const architectTopicKeys = assignments.map(a => a.subcategoryId);

  const filteredQuestions = questions.filter(q => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (topicFilter !== 'all' && q.topicKey !== topicFilter) return false;
    return true;
  });

  const handleAction = async (q: ForumQuestion, newStatus: ForumQuestion['status'], action: string) => {
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) throw new Error("No id token available. Please refresh and try again.");

      const res = await fetch('/api/forum/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          questionId: q.id,
          newStatus,
          action
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Moderation failed');
      }

      toast({
        title: "Успішно",
        description: `Статус змінено на: ${newStatus}`,
      });

      // Refresh list after action
      loadQuestions();
    } catch (error: any) {
      console.error('[ArchitectForum] Action failed:', error);
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося оновити статус",
        variant: "destructive"
      });
    }
  };

  if (accessLoading) {
    return (
      <div className="min-h-screen bg-slate-50/30 flex flex-col">
        <Navigation subtitle="Architect Council" />
        <div className="flex-grow container mx-auto py-20 px-4 max-w-5xl space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50/30 flex flex-col">
        <Navigation subtitle="Architect Council" />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md px-4">
            <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <h2 className="text-xl font-black">Доступ обмежений</h2>
            <p className="text-sm text-muted-foreground">
              Цей розділ доступний тільки для Community Architects з активним призначенням.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col">
      <Navigation subtitle="Architect Council" />

      <main className="flex-grow pb-20">
        <section className="bg-white border-b border-border/40 py-8 mb-6">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 text-accent text-[10px] uppercase tracking-[0.2em] font-black mb-3">
              <ShieldCheck className="h-3 w-3" />
              Architect Moderation
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Forum Moderation</h1>
            <p className="text-sm text-muted-foreground">
              Питання спільноти у підкатегоріях, де ви є архітектором: {assignments.map(a => a.subcategoryName).join(', ')}.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {assignments.map(a => (
                  <SelectItem key={a.subcategoryId} value={a.subcategoryId}>{a.subcategoryName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Debug Info (Dev only) */}
          {process.env.NODE_ENV === 'development' && debugData && (
            <div className="p-4 bg-slate-900 text-slate-50 text-[10px] font-mono rounded-xl overflow-x-auto">
              <p className="text-amber-400 font-bold mb-2">DEBUG: Architect visibility diagnostic</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="opacity-50">Architect Canonical Keys:</p>
                  <pre>{JSON.stringify(debugData.architectCanonicalKeys, null, 2)}</pre>
                </div>
                <div>
                  <p className="opacity-50">Raw Source Keys:</p>
                  <pre>{JSON.stringify(debugData.rawTopicKeys, null, 2)}</pre>
                </div>
              </div>
              <p className="mt-2 opacity-50">Reason for count {debugData.returnedCount}:</p>
              <p className="text-amber-200">{debugData.reason || 'Questions matched successfully'}</p>
            </div>
          )}

          {/* Questions */}
          <div className="grid gap-4">
            {questionsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            ) : topicKeys.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-amber-200 bg-amber-50/30 rounded-2xl">
                <ShieldCheck className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-amber-900">Увага: Немає призначених підкатегорій</p>
                <p className="text-xs text-amber-700 mt-1 max-w-xs mx-auto">
                  Хоча ви маєте статус архітектора, у ваших призначеннях не вказано Subcategory ID. 
                  Будь ласка, зверніться до адміністратора.
                </p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-muted/30 rounded-2xl">
                <MessageSquare className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Немає питань для статусу: <span className="font-bold">{statusFilter}</span> у вибраних темах.</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => { setStatusFilter('all'); setTopicFilter('all'); }}
                  className="text-xs mt-2"
                >
                  Скинути всі фільтри
                </Button>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <Card key={q.id} className="rounded-2xl border-muted/50">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base font-black tracking-tight">{q.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold">{q.topicLabel}</Badge>
                        <span className="text-xs text-muted-foreground">{q.authorName || q.authorId}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />{q.answerCount}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3" />{q.likeCount}
                        </span>
                      </div>
                    </div>
                    <Badge variant={q.status === 'pending' ? 'secondary' : q.status === 'rejected' ? 'destructive' : 'default'}>
                      {q.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm text-foreground/80 line-clamp-3">{q.body}</p>
                    
                    {(q as any).moderatedBy && (
                      <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-muted/10">
                        Moderated by: {(q as any).moderatedByName} ({(q as any).moderatedByRole}) — {(q as any).moderationAction}
                      </p>
                    )}
                    
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {q.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => handleAction(q, 'open', 'approved')}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(q, 'rejected', 'rejected')}>Reject</Button>
                        </>
                      )}
                      {q.status === 'open' && (
                        <>
                          <Button size="sm" variant="secondary" onClick={() => handleAction(q, 'hidden', 'hidden')}>Hide</Button>
                          <Button size="sm" variant="outline" onClick={() => handleAction(q, 'featured', 'featured')}>Feature</Button>
                        </>
                      )}
                      {q.status === 'featured' && (
                        <Button size="sm" variant="outline" onClick={() => handleAction(q, q.answerCount > 0 ? 'answered' : 'open', 'restored')}>Unfeature</Button>
                      )}
                      {(q.status === 'hidden' || q.status === 'rejected') && (
                        <Button size="sm" variant="outline" onClick={() => handleAction(q, 'open', 'restored')}>Restore</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
