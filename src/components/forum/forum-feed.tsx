'use client';

import React, { useState, useEffect } from 'react';
import { ForumQuestion } from '@/lib/forum/forum-types';
import { subscribeToQuestions } from '@/lib/forum/forum-service';
import { QuestionCard } from './question-card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Sparkles } from 'lucide-react';

export function ForumFeed({ topicKey }: { topicKey: string }) {
    const [questions, setQuestions] = useState<ForumQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = subscribeToQuestions(topicKey, (newQuestions) => {
            setQuestions(newQuestions);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [topicKey]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <Skeleton key={i} className="w-full h-32 rounded-[24px]" />
                ))}
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 rounded-[28px] border border-dashed border-border/40 bg-muted/5">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <MessageSquare className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground/60 tracking-tight">Будьте першим!</p>
                    <p className="text-[11px] text-muted-foreground/50 font-light max-w-[200px]">
                        У цій темі поки немає питань. Поставте своє перше питання спільноті.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
            ))}
            
            {/* Editorial Footer for the feed */}
            <div className="pt-4 flex items-center justify-center gap-2">
                <div className="h-px flex-grow bg-gradient-to-r from-transparent to-border/40" />
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
                    <Sparkles className="w-3 h-3" />
                    Кінець стрічки питань
                </div>
                <div className="h-px flex-grow bg-gradient-to-l from-transparent to-border/40" />
            </div>
        </div>
    );
}
