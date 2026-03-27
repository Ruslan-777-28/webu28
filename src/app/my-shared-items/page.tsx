'use client';

import { useShares } from "@/hooks/use-shares";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/layout/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
    Send, 
    ExternalLink, 
    Clock, 
    CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function MySharedItemsPage() {
    const { user, loading: authLoading } = useUser();
    const { shares, loading: sharesLoading, markAsRead } = useShares();

    if (authLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
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
                    <Send className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <h1 className="text-2xl font-bold mb-2">Мені поділилися</h1>
                    <p className="text-muted-foreground mb-6">Будь ласка, увійдіть, щоб переглянути отримані матеріали</p>
                    <Link href="/">
                        <Button>На головну</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground tracking-tight">
            <Navigation />
            <main className="flex-grow container max-w-4xl mx-auto px-4 py-8 md:py-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Send className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tighter">Мені поділилися</h1>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Архів вхідних матеріалів</p>
                        </div>
                    </div>
                    <div className="bg-muted px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground self-start md:self-auto">
                        Всього: {shares.length}
                    </div>
                </header>

                {sharesLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl border border-border/30" />)}
                    </div>
                ) : shares.length > 0 ? (
                    <div className="space-y-4">
                        {shares.map((share) => (
                            <Card 
                                key={share.id} 
                                className={cn(
                                    "overflow-hidden border-border/40 transition-all group shadow-sm bg-card/40 backdrop-blur-md rounded-2xl",
                                    !share.read && "border-primary/20 bg-primary/5 ring-1 ring-primary/10"
                                )}
                            >
                                <CardContent className="p-5">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                        <div className="relative group/avatar">
                                            <Avatar className="h-14 w-14 border-2 border-background shadow-md transition-transform group-hover/avatar:scale-105">
                                                <AvatarImage src={share.senderAvatarUrl} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xl font-black">
                                                    {share.senderName?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {!share.read && (
                                                <div className="absolute -top-1 -right-1 h-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse shadow-sm" />
                                            )}
                                        </div>

                                        <div className="flex-grow min-w-0 space-y-2">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <span className="font-black text-sm tracking-tight text-foreground">
                                                    {share.senderName} 
                                                    <span className="font-light text-muted-foreground ml-1 font-sans">поділився матеріалом:</span>
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="p-1 px-2 bg-muted rounded text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                    {share.itemType === 'post' ? 'Стаття' : 'Профіль'}
                                                </div>
                                                <h3 className="font-bold text-base truncate pr-4 group-hover:text-primary transition-colors leading-tight">
                                                    {share.itemTitle || (share.itemType === 'post' ? 'Без назви' : `Користувач ${share.itemId}`)}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-tighter">
                                                <span className="flex items-center gap-1.5 opacity-60">
                                                    <Clock className="h-3 w-3" />
                                                    {share.createdAt?.toDate?.()?.toLocaleString('uk-UA', { 
                                                        day: 'numeric', 
                                                        month: 'short', 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </span>
                                                {!share.read && (
                                                    <span className="text-primary tracking-widest font-black uppercase">Нове</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                                            <Link 
                                                href={share.itemUrl} 
                                                className="flex-grow sm:flex-grow-0"
                                                onClick={() => !share.read && markAsRead(share.id)}
                                            >
                                                <Button className="w-full sm:w-auto rounded-full text-[10px] font-black uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all h-10 shadow-lg shadow-foreground/10 active:scale-95">
                                                    Відкрити <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </Link>
                                            
                                            {share.read ? (
                                                <div className="h-10 w-10 flex items-center justify-center text-green-500/40">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                            ) : (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-colors"
                                                    onClick={() => markAsRead(share.id)}
                                                    title="Позначити як прочитане"
                                                >
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border-2 border-dashed rounded-[2.5rem] bg-muted/5 border-muted/20">
                        <Send className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-5" />
                        <h3 className="text-xl font-black tracking-tight text-muted-foreground/80 mb-2">Ваша поштова скринька порожня</h3>
                        <p className="text-xs text-muted-foreground/50 max-w-sm mx-auto font-bold uppercase tracking-widest leading-loose">
                            Тут з'являться матеріали, якими з вами поділяться друзі в мережі LECTOR.
                        </p>
                        <Link href="/blog" className="mt-8 inline-block">
                            <Button variant="outline" className="rounded-full px-10 py-6 border-2 font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                                Відкрити Editorial
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
