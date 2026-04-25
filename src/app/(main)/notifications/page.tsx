'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/hooks/use-notifications";
import { useShares } from "@/hooks/use-shares";
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { 
    Bell, 
    User, 
    CheckCircle2, 
    Clock, 
    ExternalLink, 
    Check, 
    UserPlus, 
    Share2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function NotificationsPage() {
    const { notifications, unreadCount: unreadNotifs, markAsRead, markAllAsRead, loading: loadingNotifs } = useNotifications();
    const { shares, unreadCount: unreadShares, markAsRead: markShareRead, loading: loadingShares } = useShares();
    const [activeTab, setActiveTab] = useState('system');

    const systemNotifications = notifications.filter(n => n.channel === 'system');
    const userNotifications = notifications.filter(n => n.channel === 'user');
    
    // Combine user notifications and shares for the "Users" tab
    const userTabItems = [
        ...userNotifications.map(n => ({ ...n, itemKind: 'notification' as const })),
        ...shares.map(s => ({ ...s, itemKind: 'share' as const }))
    ].sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
    });

    const loading = loadingNotifs || loadingShares;

    const handleMarkAllRead = () => {
        markAllAsRead();
        // Also mark shares as read if they are in the active tab
        if (activeTab === 'users') {
            shares.filter(s => !s.read).forEach(s => markShareRead(s.id));
        }
    };

    return (
        <div className="container max-w-4xl py-10 px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Сповіщення</h1>
                    <p className="text-muted-foreground mt-1">
                        Керуйте своїми оновленнями та активністю в екосистемі.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {(unreadNotifs > 0 || unreadShares > 0) && (
                        <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="h-9">
                            <Check className="mr-2 h-4 w-4" />
                            Прочитати все
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="system" className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-2 h-11 p-1 bg-muted/50">
                        <TabsTrigger value="system" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all h-full">
                            Системні
                            {unreadNotifs > 0 && systemNotifications.some(n => !n.readAt) && (
                                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                    {systemNotifications.filter(n => !n.readAt).length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all h-full">
                            Користувачі
                            {(userNotifications.some(n => !n.readAt) || unreadShares > 0) && (
                                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                    {userNotifications.filter(n => !n.readAt).length + unreadShares}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="system" className="mt-0 outline-none space-y-4">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => <NotificationSkeleton key={i} />)
                    ) : systemNotifications.length > 0 ? (
                        systemNotifications.map((notification) => (
                            <NotificationItem 
                                key={(notification as any).id} 
                                notification={notification} 
                                onMarkRead={() => markAsRead((notification as any).id)} 
                            />
                        ))
                    ) : (
                        <EmptyState 
                            icon={<Bell className="h-10 w-10 text-muted-foreground/40" />} 
                            title="Немає системних сповіщень" 
                            description="Тут з'являтимуться важливі повідомлення від платформи." 
                        />
                    )}
                </TabsContent>

                <TabsContent value="users" className="mt-0 outline-none space-y-4">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => <NotificationSkeleton key={i} />)
                    ) : userTabItems.length > 0 ? (
                        userTabItems.map((item, idx) => (
                            item.itemKind === 'notification' ? (
                                <NotificationItem 
                                    key={(item as any).id} 
                                    notification={item as any} 
                                    onMarkRead={() => markAsRead((item as any).id)} 
                                />
                            ) : (
                                <ShareItem 
                                    key={(item as any).id} 
                                    share={item as any} 
                                    onMarkRead={() => markShareRead((item as any).id)} 
                                />
                            )
                        ))
                    ) : (
                        <EmptyState 
                            icon={<User className="h-10 w-10 text-muted-foreground/40" />} 
                            title="Немає сповіщень від користувачів" 
                            description="Тут з'являтимуться дії ваших друзів та партнерів." 
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function NotificationItem({ notification, onMarkRead }: { notification: any, onMarkRead: () => void }) {
    const isUnread = !notification.readAt;
    const isReferral = notification.kind === 'referral_signup';
    
    // In LECTOR, notifications often link to profiles or posts
    const link = notification.data?.siteRoute || '#';

    return (
        <Card className={`overflow-hidden border-none shadow-sm transition-all hover:shadow-md ${isUnread ? 'bg-primary/[0.03] ring-1 ring-primary/10' : 'bg-card'}`}>
            <CardContent className="p-4 md:p-6">
                <div className="flex gap-4 md:gap-6">
                    <div className="relative flex-shrink-0">
                        {isReferral ? (
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <UserPlus className="h-6 w-6" />
                            </div>
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                <Bell className="h-6 w-6" />
                            </div>
                        )}
                        {isUnread && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                        )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                            <h3 className="font-semibold text-base leading-tight truncate">
                                {notification.title}
                            </h3>
                            <span className="text-[11px] text-muted-foreground flex items-center whitespace-nowrap">
                                <Clock className="mr-1 h-3 w-3" />
                                {notification.createdAt ? formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true, locale: uk }) : 'щойно'}
                            </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                            {notification.body}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            {link !== '#' && (
                                <Link href={link} onClick={() => isUnread && onMarkRead()}>
                                    <Button size="sm" variant="secondary" className="h-8 text-xs font-semibold px-4 group">
                                        {notification.data?.actionLabel || 'Переглянути'}
                                        <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </Button>
                                </Link>
                            )}
                            
                            {isUnread && (
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={onMarkRead}
                                    className="h-8 text-[11px] text-muted-foreground hover:text-foreground"
                                >
                                    Позначити як прочитане
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ShareItem({ share, onMarkRead }: { share: any, onMarkRead: () => void }) {
    const isUnread = !share.read;
    
    return (
        <Card className={`overflow-hidden border-none shadow-sm transition-all hover:shadow-md ${isUnread ? 'bg-primary/[0.03] ring-1 ring-primary/10' : 'bg-card'}`}>
            <CardContent className="p-4 md:p-6">
                <div className="flex gap-4 md:gap-6">
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={share.senderAvatarUrl || ''} />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                                {share.senderName?.charAt(0) || <User className="h-5 w-5" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white ring-2 ring-background">
                            <Share2 className="h-3 w-3" />
                        </div>
                        {isUnread && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                        )}
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                            <h3 className="font-semibold text-base leading-tight">
                                {share.senderName} <span className="font-normal text-muted-foreground">поділився з вами</span> {share.itemType === 'post' ? 'публікацією' : 'профілем'}
                            </h3>
                            <span className="text-[11px] text-muted-foreground flex items-center whitespace-nowrap">
                                <Clock className="mr-1 h-3 w-3" />
                                {share.createdAt ? formatDistanceToNow(share.createdAt.toDate(), { addSuffix: true, locale: uk }) : 'щойно'}
                            </span>
                        </div>

                        {share.itemTitle && (
                            <div className="bg-muted/40 rounded-lg p-3 my-3 text-sm border border-muted/20 italic">
                                "{share.itemTitle}"
                            </div>
                        )}

                        {share.message && (
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 md:line-clamp-none italic">
                                "{share.message}"
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3">
                            <Link href={share.itemUrl} onClick={() => isUnread && onMarkRead()}>
                                <Button size="sm" variant="secondary" className="h-8 text-xs font-semibold px-4 group">
                                    Відкрити {share.itemType === 'post' ? 'пост' : 'профіль'}
                                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Button>
                            </Link>

                            {isUnread && (
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={onMarkRead}
                                    className="h-8 text-[11px] text-muted-foreground hover:text-foreground"
                                >
                                    Позначити як прочитане
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function NotificationSkeleton() {
    return (
        <Card className="border-none shadow-sm">
            <CardContent className="p-6">
                <div className="flex gap-6">
                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                    <div className="flex-grow space-y-3">
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-3 pt-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-muted/20 rounded-3xl border border-dashed border-muted">
            <div className="mb-4 text-muted-foreground/20">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-[300px] text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
}
