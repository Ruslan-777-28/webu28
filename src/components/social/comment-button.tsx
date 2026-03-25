'use client';

import { useState } from 'react';
import { MessageSquare, Send, Loader2, Trash2 } from 'lucide-react';
import { useUser } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase/client';
import { collection, doc, addDoc, deleteDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { usePostSocial } from '@/hooks/use-post-social';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Comment, UserProfile } from '@/lib/types';
import { useEffect } from 'react';
import { AuthModal } from '@/components/auth-modal';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface CommentButtonProps {
    postId: string;
    className?: string;
    showText?: boolean;
}

export function CommentButton({ postId, className, showText = false }: CommentButtonProps) {
    const { commentsCount } = usePostSocial(postId);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-2 flex items-center gap-1.5 transition-all duration-200 text-muted-foreground hover:text-primary group/comment",
                        className
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <MessageSquare className="h-4 w-4 transition-transform group-hover/comment:scale-110" />
                    <span className="text-xs font-medium tabular-nums">
                        {commentsCount}
                    </span>
                    {showText && <span className="ml-0.5">Коментарі</span>}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
                <PostCommentsContent postId={postId} />
            </SheetContent>
        </Sheet>
    );
}

function PostCommentsContent({ postId }: { postId: string }) {
    const { user } = useUser();
    const { comments, loading } = usePostSocial(postId);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const handleSend = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'posts', postId, 'comments'), {
                uid: user.uid,
                text: newComment.trim(),
                createdAt: serverTimestamp(),
            });
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <SheetHeader className="p-6 border-b">
                <SheetTitle>Коментарі</SheetTitle>
                <SheetDescription>
                    Поділіться своєю думкою про цю публікацію.
                </SheetDescription>
            </SheetHeader>

            <ScrollArea className="flex-1 p-6">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                postId={postId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        Ще немає жодного коментаря. Будьте першим!
                    </div>
                )}
            </ScrollArea>

            <div className="p-6 border-t bg-background/95 backdrop-blur-sm sticky bottom-0">
                <div className="flex gap-2 items-start">
                    <Textarea
                        placeholder={user ? "Ваш коментар..." : "Увійдіть, щоб залишати коментарі..."}
                        className="min-h-[80px] resize-none text-[13px]"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button
                        size="icon"
                        className="shrink-0 h-[80px]"
                        disabled={!newComment.trim() || isSubmitting}
                        onClick={handleSend}
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
                <DialogContent>
                    <AuthModal setOpen={setAuthModalOpen} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

function CommentItem({ comment, postId }: { comment: Comment, postId: string }) {
    const { user } = useUser();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!comment.uid) return;
        const unsub = onSnapshot(doc(db, 'users', comment.uid), (snap) => {
            if (snap.exists()) {
                setProfile(snap.data() as UserProfile);
            }
        });
        return () => unsub();
    }, [comment.uid]);

    const isOwner = user?.uid === comment.uid;

    const handleDelete = async () => {
        if (!isOwner) return;
        try {
            await deleteDoc(doc(db, 'posts', postId, 'comments', comment.id));
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    return (
        <div className="flex gap-3 group">
            <Avatar className="h-8 w-8 shrink-0 border border-muted">
                <AvatarImage src={profile?.avatarUrl} alt={profile?.name} />
                <AvatarFallback>{profile?.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground/90">{profile?.name || 'Завантаження...'}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                        {comment.createdAt?.toDate?.()?.toLocaleDateString()}
                    </span>
                </div>
                <div className="text-[13px] text-foreground/80 leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-transparent hover:border-muted/30 transition-colors">
                    {comment.text}
                </div>
                {isOwner && (
                    <button
                        onClick={handleDelete}
                        className="text-[10px] text-destructive/70 hover:text-destructive hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    >
                        <Trash2 className="h-3 w-3" /> Видалити
                    </button>
                )}
            </div>
        </div>
    );
}
