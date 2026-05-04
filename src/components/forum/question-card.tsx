'use client';

import React, { useState, useEffect } from 'react';
import { ForumQuestion } from '@/lib/forum/forum-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Eye, MoreHorizontal, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { toggleLike, checkIfLiked } from '@/lib/forum/forum-service';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ForumAnswerSection } from '@/components/forum/forum-answer-section';

export function QuestionCard({ question }: { question: ForumQuestion }) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(question.likeCount);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (user) {
            checkIfLiked(user.uid, question.id).then(setIsLiked);
        }
    }, [user, question.id]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            toast({
                title: "Потрібна авторизація",
                description: "Увійдіть, щоб ставити лайки.",
                variant: "destructive"
            });
            return;
        }

        const newLikedState = await toggleLike(user.uid, question.id, 'question');
        setIsLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    };

    return (
        <div className={cn(
            "group rounded-[24px] border border-border/40 bg-white transition-all hover:border-border/80 hover:shadow-sm overflow-hidden",
            isExpanded ? "border-primary/20 shadow-md" : ""
        )}>
            <div className="p-5 sm:p-6" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-border/20">
                            <AvatarImage src={question.authorAvatarUrl || ''} />
                            <AvatarFallback className="bg-muted text-[10px] font-bold">
                                {question.authorName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase tracking-wider text-foreground">
                                {question.authorName}
                            </span>
                            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest font-medium">
                                {question.createdAt ? formatDistanceToNow(question.createdAt.toDate(), { addSuffix: true, locale: uk }) : 'щойно'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {question.pinned && (
                            <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">Pinned</div>
                        )}
                        <button className="text-muted-foreground/40 hover:text-foreground transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 cursor-pointer">
                    <h4 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                        {question.title}
                    </h4>
                    <p className={cn(
                        "text-sm text-muted-foreground font-light leading-relaxed",
                        !isExpanded && "line-clamp-2"
                    )}>
                        {question.body}
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                isLiked ? "text-red-500 scale-105" : "text-muted-foreground/60 hover:text-red-500"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                            {likeCount}
                        </button>
                        
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            <MessageCircle className="w-4 h-4" />
                            {question.answerCount}
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            <Eye className="w-4 h-4" />
                            {question.viewCount}
                        </div>
                    </div>

                    <button 
                        className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.15em] text-primary/70 hover:text-primary transition-colors"
                    >
                        {isExpanded ? (
                            <>Згорнути <ChevronUp className="w-3 h-3" /></>
                        ) : (
                            <>Дивитись відповіді <ChevronDown className="w-3 h-3" /></>
                        )}
                    </button>
                </div>
            </div>

            {/* Answer Section (Expanded) */}
            {isExpanded && (
                <div className="bg-muted/5 border-t border-border/30">
                    <ForumAnswerSection questionId={question.id} />
                </div>
            )}
        </div>
    );
}
