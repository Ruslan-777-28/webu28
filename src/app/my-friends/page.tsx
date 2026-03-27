'use client';

import { useFriends } from "@/hooks/use-friends";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/layout/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserMinus, User, ExternalLink, Users } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/client";
import { doc, deleteDoc } from "firebase/firestore";

export default function MyFriendsPage() {
    const { user, loading: authLoading } = useUser();
    const { friends, loading: friendsLoading } = useFriends();
    const { toast } = useToast();

    const removeFriend = async (friendshipId: string, name: string) => {
        try {
            await deleteDoc(doc(db, 'friendships', friendshipId));
            toast({
                title: "Видалено з друзів",
                description: `${name} більше не у вашому списку друзів`,
            });
        } catch (err) {
            console.error('Error removing friend:', err);
            toast({
                title: "Помилка",
                description: "Не вдалося видалити друга",
                variant: "destructive"
            });
        }
    };

    if (authLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <h1 className="text-2xl font-bold mb-2">Мої друзі</h1>
                    <p className="text-muted-foreground mb-6">Будь ласка, увійдіть, щоб переглянути список друзів</p>
                    <Link href="/">
                        <Button>На головну</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navigation />
            <main className="flex-grow container max-w-5xl mx-auto px-4 py-8 md:py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Мої друзі</h1>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                        Всього: {friends.length}
                    </div>
                </div>

                {friendsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                    </div>
                ) : friends.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friends.map((friend) => (
                            <Card key={friend.id} className="overflow-hidden border-muted/40 hover:border-primary/20 transition-all group shadow-sm bg-card/40 backdrop-blur-sm">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                                        <AvatarImage src={friend.friendAvatarUrl} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-xl">
                                            {friend.friendDisplayName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                                            {friend.friendDisplayName}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Link 
                                                href={`/profile/${friend.friendUid}`}
                                                className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary flex items-center gap-1"
                                            >
                                                Переглянути профіль <ExternalLink className="h-2.5 w-2.5" />
                                            </Link>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                                        onClick={() => removeFriend(friend.id, friend.friendDisplayName || '')}
                                        title="Видалити з друзів"
                                    >
                                        <UserMinus className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/5">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-10" />
                        <h3 className="text-lg font-bold text-muted-foreground mb-1">У вас поки немає друзів</h3>
                        <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto">
                            Додавайте авторів та інших учасників у список друзів для швидкого доступу та обміну контентом.
                        </p>
                        <Link href="/blog" className="mt-6 inline-block">
                            <Button variant="outline" className="rounded-full px-6">Перейти до блогу</Button>
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
