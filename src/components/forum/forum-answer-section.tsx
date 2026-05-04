'use client';

import React, { useState, useEffect } from 'react';
import { ForumAnswer } from '@/lib/forum/forum-types';
import { subscribeToAnswers, addAnswer, toggleLike, checkIfLiked } from '@/lib/forum/forum-service';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Send, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ForumAnswerSection({ questionId }: { questionId: string }) {
    const { user, profile } = useUser();
    const { toast } = useToast();
    const [answers, setAnswers] = useState<ForumAnswer[]>([]);
    const [newAnswer, setNewAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToAnswers(questionId, setAnswers);
        return () => unsubscribe();
    }, [questionId]);

    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !profile) {
            toast({
                title: "Потрібна авторизація",
                description: "Увійдіть, щоб надати відповідь.",
                variant: "destructive"
            });
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            console.debug("[ForumAnswerSection] Submission context:", {
                uid: user.uid,
                trustLevel: profile.verification?.trustLevel || 0,
                questionId
            });
        }

        if (!newAnswer.trim()) return;

        setIsSubmitting(true);
        try {
            const userRole = profile.roles?.admin ? 'admin' : profile.roles?.expert ? 'expert' : profile.roles?.author ? 'author' : 'user';
            
            await addAnswer(questionId, {
                body: newAnswer.trim(),
                authorId: user.uid,
                authorName: profile.displayName || profile.name || 'Anonymous',
                authorAvatarUrl: profile.avatarUrl || null,
                authorRole: userRole,
                authorTrustLevel: profile.verification?.trustLevel || 0,
            });
            setNewAnswer('');
            toast({
                title: "Відповідь опублікована",
                description: "Вашу думку додано до обговорення.",
            });
        } catch (error) {
            console.error("Error adding answer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-5 sm:p-6 space-y-6">
            {/* List of Answers */}
            <div className="space-y-6">
                {answers.map((answer) => (
                    <AnswerItem key={answer.id} answer={answer} questionId={questionId} />
                ))}
            </div>

            {/* Answer Input */}
            {user ? (
                <div className="flex gap-4 pt-4 border-t border-border/20">
                    <Avatar className="h-8 w-8 border border-border/20 shrink-0">
                        <AvatarImage src={profile?.avatarUrl || ''} />
                        <AvatarFallback className="bg-muted text-[10px] font-bold">
                            {profile?.name?.[0] || '?'}
                        </AvatarFallback>
                    </Avatar>
                    <form onSubmit={handleSubmitAnswer} className="flex-grow flex gap-2">
                        <input 
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Ваша відповідь або коментар..."
                            className="flex-grow bg-white border border-border/40 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 ring-primary/40 placeholder:text-muted-foreground/30 font-light"
                        />
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || !newAnswer.trim()}
                            size="icon"
                            className="rounded-xl shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="text-center py-4 bg-muted/20 rounded-2xl border border-dashed border-border/30">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                        Увійдіть, щоб взяти участь у дискусії
                    </p>
                </div>
            )}
        </div>
    );
}

function AnswerItem({ answer, questionId }: { answer: ForumAnswer, questionId: string }) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(answer.likeCount);

    useEffect(() => {
        if (user) {
            checkIfLiked(user.uid, answer.id).then(setIsLiked);
        }
    }, [user, answer.id]);

    const handleLike = async () => {
        if (!user) {
            toast({
                title: "Потрібна авторизація",
                variant: "destructive"
            });
            return;
        }
        const newLikedState = await toggleLike(user.uid, answer.id, 'answer', questionId);
        setIsLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    };

    return (
        <div className="flex gap-4 group/answer">
            <Avatar className="h-8 w-8 border border-border/20 shrink-0">
                <AvatarImage src={answer.authorAvatarUrl || ''} />
                <AvatarFallback className="bg-muted text-[10px] font-bold">
                    {answer.authorName[0]}
                </AvatarFallback>
            </Avatar>
            <div className="flex-grow space-y-1.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                            {answer.authorName}
                        </span>
                        {answer.isAccepted && (
                            <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Краща відповідь
                            </span>
                        )}
                        <span className="text-[8px] text-muted-foreground/40 font-medium">
                            {answer.createdAt ? formatDistanceToNow(answer.createdAt.toDate(), { addSuffix: true, locale: uk }) : 'щойно'}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-foreground/80 font-light leading-relaxed">
                    {answer.body}
                </p>
                <div className="flex items-center gap-4 pt-1">
                    <button 
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-all",
                            isLiked ? "text-red-500" : "text-muted-foreground/40 hover:text-red-500"
                        )}
                    >
                        <Heart className={cn("w-3 h-3", isLiked && "fill-current")} />
                        {likeCount}
                    </button>
                    <button className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors">
                        Відповісти
                    </button>
                </div>
            </div>
        </div>
    );
}
