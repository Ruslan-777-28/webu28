'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-auth';
import { createQuestion } from '@/lib/forum/forum-service';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    topicKey: string;
    topicLabel: string;
}

export function CreateQuestionModal({ isOpen, onClose, topicKey, topicLabel }: CreateQuestionModalProps) {
    const { user, profile } = useUser();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !profile) {
            toast({
                title: "Потрібна авторизація",
                description: "Будь ласка, увійдіть у систему, щоб поставити питання.",
                variant: "destructive",
            });
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            console.debug("[CreateQuestionModal] Submission context:", {
                uid: user.uid,
                trustLevel: profile.verification?.trustLevel || 0,
                topicKey,
                topicLabel
            });
        }

        if (!title.trim() || !body.trim()) {
            toast({
                title: "Поля не заповнені",
                description: "Будь ласка, введіть заголовок та текст питання.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const userRole = profile.roles?.admin ? 'admin' : profile.roles?.expert ? 'expert' : profile.roles?.author ? 'author' : 'user';

            await createQuestion({
                title: title.trim(),
                body: body.trim(),
                topicKey,
                topicLabel,
                authorId: user.uid,
                authorName: profile.displayName || profile.name || 'Anonymous',
                authorAvatarUrl: profile.avatarUrl || null,
                authorRole: userRole,
                authorTrustLevel: profile.verification?.trustLevel || 0,
            });

            toast({
                title: "Питання опубліковано",
                description: `Ваше питання в темі ${topicLabel} успішно створене.`,
            });
            
            setTitle('');
            setBody('');
            onClose();
        } catch (error) {
            console.error("Error creating question:", error);
            toast({
                title: "Помилка",
                description: "Не вдалося опублікувати питання. Спробуйте пізніше.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[28px] border-none shadow-2xl">
                <div className="bg-primary/5 p-8 border-b border-primary/10">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Forum v1</span>
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight">Нове питання у темі {topicLabel}</DialogTitle>
                        <DialogDescription className="text-muted-foreground font-light text-sm">
                            Ваше питання буде доступне спільноті. Експерти та архітектори LECTOR зможуть надати відповідь.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Суть питання (Заголовок)</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Наприклад: Як знайти баланс у період ретроградного Меркурія?"
                            className="w-full bg-muted/30 border border-border/40 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 ring-primary/20 transition-all placeholder:text-muted-foreground/40 font-medium"
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Детальний опис</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Опишіть вашу ситуацію детальніше..."
                            className="w-full bg-muted/30 border border-border/40 rounded-2xl px-5 py-4 text-sm min-h-[150px] focus:outline-none focus:ring-2 ring-primary/20 transition-all placeholder:text-muted-foreground/40 font-light leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-1 text-[10px] text-muted-foreground/60 italic font-medium">
                        <Sparkles className="w-3 h-3 text-primary/40" />
                        Ваше питання пройде модерацію архітекторами LECTOR
                    </div>

                    <DialogFooter className="pt-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px]"
                        >
                            Скасувати
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="rounded-full px-10 py-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            {isSubmitting ? 'Опублікуємо...' : 'Опублікувати питання'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
