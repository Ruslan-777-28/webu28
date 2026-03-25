'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase/client';
import { collection, doc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useFavorites } from '@/hooks/use-favorites';
import { AuthModal } from '@/components/auth-modal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { FavoriteType } from '@/lib/types';

interface FavoriteButtonProps {
    targetId: string;
    type: FavoriteType;
    className?: string;
    showCount?: boolean;
}

export function FavoriteButton({ targetId, type, className, showCount = true }: FavoriteButtonProps) {
    const { user } = useUser();
    const { isFavorited, count, loading, favorites } = useFavorites(targetId, type);
    const [isBusy, setIsBusy] = useState(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setAuthModalOpen(true);
            return;
        }

        if (isBusy) return;

        setIsBusy(true);
        try {
            if (isFavorited) {
                const userFav = favorites.find(f => f.uid === user.uid);
                if (userFav) {
                    await deleteDoc(doc(db, 'favorites', userFav.id));
                }
            } else {
                await addDoc(collection(db, 'favorites'), {
                    uid: user.uid,
                    targetId,
                    type,
                    createdAt: serverTimestamp(),
                });
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className={cn(
                    "h-8 px-2 flex items-center gap-1.5 transition-all duration-200 group/fav",
                    isFavorited ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-primary",
                    className
                )}
                onClick={toggleFavorite}
                disabled={loading || isBusy}
            >
                {isBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : isFavorited ? (
                    <BookmarkCheck className="h-4 w-4 fill-current transition-transform group-hover/fav:scale-110" />
                ) : (
                    <Bookmark className="h-4 w-4 transition-transform group-hover/fav:scale-110" />
                )}
                
                {showCount && count > 0 && (
                    <span className="text-xs font-medium tabular-nums">
                        {count}
                    </span>
                )}
            </Button>

            <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
                <DialogContent>
                    <AuthModal setOpen={setAuthModalOpen} />
                </DialogContent>
            </Dialog>
        </>
    );
}
