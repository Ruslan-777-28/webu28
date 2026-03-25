'use client';

import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase/client';
import { collection, doc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { usePostSocial } from '@/hooks/use-post-social';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AuthModal } from '@/components/auth-modal';

interface LikeButtonProps {
    postId: string;
    className?: string;
}

export function LikeButton({ postId, className }: LikeButtonProps) {
    const { user } = useUser();
    const { likesCount, isLiked, userLike } = usePostSocial(postId);
    const [isBusy, setIsBusy] = useState(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const toggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        if (isBusy) return;

        setIsBusy(true);
        try {
            if (isLiked && userLike) {
                await deleteDoc(doc(db, 'likes', userLike.id));
            } else {
                await addDoc(collection(db, 'likes'), {
                    uid: user.uid,
                    targetId: postId,
                    type: 'post',
                    createdAt: serverTimestamp(),
                });
            }
        } catch (err) {
            console.error('Error toggling like:', err);
        } finally {
            setIsBusy(false);
        }
    };

    const buttonContent = (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "h-8 px-2 flex items-center gap-1.5 transition-all duration-200 group/like",
                isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500",
                className
            )}
            onClick={toggleLike}
            disabled={isBusy}
        >
            {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Heart className={cn("h-4 w-4 transition-transform group-hover/like:scale-110", isLiked && "fill-current")} />
            )}
            <span className="text-xs font-medium tabular-nums">
                {likesCount}
            </span>
        </Button>
    );

    if (!user) {
        return (
            <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
                <DialogTrigger asChild>
                    {buttonContent}
                </DialogTrigger>
                <DialogContent>
                    <AuthModal setOpen={setAuthModalOpen} />
                </DialogContent>
            </Dialog>
        );
    }

    return buttonContent;
}
