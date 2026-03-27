'use client';

import { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    Share2, 
    Copy, 
    Check, 
    ExternalLink, 
    Users, 
    Send, 
    Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFriends } from "@/hooks/use-friends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@/hooks/use-auth";
import Link from "next/link";

interface ShareModalProps {
    title: string;
    text?: string;
    url: string;
    itemType: 'post' | 'profile';
    itemId: string;
    trigger?: React.ReactNode;
}

export function ShareModal({ 
    title, 
    text, 
    url, 
    itemType, 
    itemId,
    trigger 
}: ShareModalProps) {
    const { toast } = useToast();
    const { user, profile } = useUser();
    const { friends, loading: friendsLoading } = useFriends();
    const [copied, setCopied] = useState(false);
    const [sendingTo, setSendingTo] = useState<string | null>(null);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast({ title: "Посилання скопійовано" });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNativeShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({ title, text, url }).catch(() => {});
        }
    };

    const handleSendToFriend = async (e: React.MouseEvent, friendUid: string, friendName: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user || !profile) {
             toast({
                title: "Потрібна авторизація",
                description: "Будь ласка, увійдіть, щоб ділитися з друзями",
                variant: "destructive"
            });
            return;
        }
        
        setSendingTo(friendUid);
        try {
            await addDoc(collection(db, 'shares'), {
                senderUid: user.uid,
                senderName: profile.displayName || profile.name,
                senderAvatarUrl: profile.avatarUrl || '',
                targetUid: friendUid,
                itemType,
                itemId,
                itemTitle: title,
                itemUrl: url,
                read: false,
                createdAt: serverTimestamp()
            });

            toast({
                title: "Надіслано",
                description: `Ви поділилися контентом з ${friendName}`,
            });
        } catch (err) {
            console.error('Error sharing with friend:', err);
            toast({
                title: "Помилка",
                description: "Не вдалося надіслати другу",
                variant: "destructive"
            });
        } finally {
            setSendingTo(null);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black transition-colors">
                        <Share2 className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-muted/20 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase tracking-tight text-foreground">Поділитися</DialogTitle>
                    <DialogDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 line-clamp-1">
                        {title}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-wider transition-all hover:bg-primary/5 hover:border-primary/20" 
                            onClick={handleCopy}
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Скопійовано' : 'Копіювати'}
                        </Button>
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-wider transition-all hover:bg-primary/5 hover:border-primary/20" 
                            onClick={handleNativeShare}
                            disabled={typeof navigator !== 'undefined' && !navigator.share}
                        >
                            <ExternalLink className="h-4 w-4" />
                            Системне
                        </Button>
                    </div>

                    {/* Friends List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Надіслати другу</span>
                            <Users className="h-3 w-3 text-muted-foreground opacity-40" />
                        </div>
                        
                        <div className="max-h-[240px] overflow-y-auto pr-1 space-y-2 no-scrollbar">
                            {friendsLoading ? (
                                [1, 2].map(i => <div key={i} className="h-14 w-full bg-muted/10 animate-pulse rounded-xl" />)
                            ) : friends.length > 0 ? (
                                friends.map((friend) => (
                                    <div 
                                        key={friend.id}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/30 transition-colors group border border-transparent hover:border-muted/40"
                                    >
                                        <Avatar className="h-10 w-10 border border-background shadow-sm">
                                            <AvatarImage src={friend.friendAvatarUrl} />
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs">
                                                {friend.friendDisplayName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="flex-grow font-bold text-sm truncate text-foreground">
                                            {friend.friendDisplayName}
                                        </span>
                                        <Button 
                                            size="sm" 
                                            variant="ghost"
                                            className="h-8 rounded-lg gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90"
                                            onClick={(e) => handleSendToFriend(e, friend.friendUid, friend.friendDisplayName || '')}
                                            disabled={sendingTo === friend.friendUid}
                                        >
                                            {sendingTo === friend.friendUid ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="h-3 w-3" />
                                                    Надіслати
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 px-4 bg-muted/5 border border-dashed rounded-xl border-muted/30">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">У вас поки немає друзів</p>
                                    <Link href="/my-friends">
                                        <Button variant="link" className="text-[10px] h-auto p-0 uppercase font-black tracking-widest text-primary">Додати друзів</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
