'use client';

import { useEffect, useState } from 'react';
import { subscribeToAdminQuestions, updateQuestionStatus } from '@/lib/forum/forum-service';
import { ForumQuestion } from '@/lib/forum/forum-types';
import { useUser } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ForumModerationPage() {
  const { user } = useUser();
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('pending');

  useEffect(() => {
    const unsubscribe = subscribeToAdminQuestions((data) => {
      setQuestions(data);
    });
    return () => unsubscribe();
  }, []);

  const filteredQuestions = questions.filter(q => 
    statusFilter === 'all' || q.status === statusFilter
  );

  const handleAction = async (q: ForumQuestion, newStatus: ForumQuestion['status'], action: string) => {
    try {
      await updateQuestionStatus(q.id, newStatus, {
        moderation: {
          moderatedBy: user?.uid || '',
          moderatedByName: user?.displayName || user?.email || 'Admin',
          moderatedByRole: 'admin',
          moderationAction: action,
        }
      });
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Forum Moderation</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="open">Open (Published)</SelectItem>
            <SelectItem value="answered">Answered</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredQuestions.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No questions found.</p>
        ) : (
          filteredQuestions.map((q) => (
            <Card key={q.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{q.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Topic: {q.topicLabel} | By: {q.authorName || q.authorId} | Answers: {q.answerCount} | Likes: {q.likeCount}
                  </p>
                </div>
                <Badge variant={q.status === 'pending' ? 'secondary' : q.status === 'rejected' ? 'destructive' : 'default'}>
                  {q.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap mt-2 text-sm">{q.body}</p>
                
                {(q as any).moderatedBy && (
                  <p className="text-xs text-muted-foreground mt-3 border-t pt-2">
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
                    <Button size="sm" variant="outline" onClick={() => handleAction(q, 'open', 'restored')}>Unfeature</Button>
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
  );
}
