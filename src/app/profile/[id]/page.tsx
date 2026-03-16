'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { doc, onSnapshot, collection, query, where, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import type { UserProfile, Post, BlogSettings } from '@/lib/types';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Bookmark, Star, Users, Briefcase, Award } from 'lucide-react';
import { EditProfileModal } from '@/components/edit-profile-modal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

function ProfileLoadingSkeleton() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
                <div className="h-64 bg-muted animate-pulse" />
                <div className="container mx-auto px-4 -mt-16">
                    <div className="flex items-end gap-4">
                        <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
                        <div className="pb-4 space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                        <div className="md:col-span-2 space-y-8">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function RoleMetricsCard({ title, icon: Icon, metrics, subcategoryName }: { title: string, icon: React.ElementType, metrics?: { ratingAvg?: number, ratingCount?: number, platformRank?: number | null, completedCount?: number }, subcategoryName: string }) {
    return (
        <Card className="bg-card/50">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
                <Icon className="h-8 w-8 text-accent" />
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {metrics ? (
                    <>
                        <div>
                            <p className="text-xs text-muted-foreground">Рейтинг у категорії "{subcategoryName}"</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-5 w-5 ${i < Math.round(metrics.ratingAvg || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                                    ))}
                                </div>
                                <span className="font-bold text-lg">{metrics.ratingAvg?.toFixed(1) || 'N/A'}</span>
                                <span className="text-sm text-muted-foreground">({metrics.ratingCount || 0})</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="rounded-lg p-2">
                                <p className="text-xs text-muted-foreground">Місце</p>
                                <p className="text-2xl font-bold">{metrics.platformRank ? `#${metrics.platformRank}` : 'N/A'}</p>
                            </div>
                            <div className="rounded-lg p-2">
                                <p className="text-xs text-muted-foreground">Сесій</p>
                                <p className="text-2xl font-bold">{metrics.completedCount || 0}</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Ще немає статистики для цієї категорії.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function PublicProfilePage() {
    const params = useParams();
    const profileId = params?.id as string;
    const { user: currentUser } = useUser();
    const { toast } = useToast();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [settings, setSettings] = useState<BlogSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState<string | null>(null);

    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('taro'); // Default value

    useEffect(() => {
        if (!profileId) return;
        setIsLoading(true);

        const unsubProfile = onSnapshot(doc(db, 'users', profileId), (doc) => {
            if (doc.exists()) {
                setProfile({ uid: doc.id, ...doc.data() } as UserProfile);
            }
            setIsLoading(false);
        });
        
        const postsQuery = query(collection(db, 'posts'), where('authorId', '==', profileId), where('status', '==', 'published'));
        const unsubPosts = onSnapshot(postsQuery, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
        });

        const settingsRef = doc(db, 'blogSettings', 'main');
        const unsubSettings = onSnapshot(settingsRef, (doc) => {
            if (doc.exists()) {
                setSettings(doc.data() as BlogSettings);
            }
        });

        return () => {
            unsubProfile();
            unsubPosts();
            unsubSettings();
        };
    }, [profileId]);
    
    useEffect(() => {
        if (!currentUser || !profileId || currentUser.uid === profileId) return;

        const favQuery = query(
            collection(db, 'favorites'),
            where('uid', '==', currentUser.uid),
            where('favoritedUserId', '==', profileId)
        );

        const unsubFavorites = onSnapshot(favQuery, (snapshot) => {
            if (!snapshot.empty) {
                setIsFavorite(true);
                setFavoriteId(snapshot.docs[0].id);
            } else {
                setIsFavorite(false);
                setFavoriteId(null);
            }
        });

        return () => unsubFavorites();

    }, [currentUser, profileId]);

    const handleFavoriteToggle = async () => {
        if (!currentUser || currentUser.uid === profileId) return;

        if (isFavorite && favoriteId) {
            await deleteDoc(doc(db, 'favorites', favoriteId));
            toast({ title: 'Видалено з улюблених.' });
        } else {
            await addDoc(collection(db, 'favorites'), {
                uid: currentUser.uid,
                favoritedUserId: profileId,
                createdAt: new Date(),
            });
            toast({ title: 'Додано до улюблених!' });
        }
    };
    
    const isOwnProfile = currentUser?.uid === profileId;

    const subcategories = useMemo(() => {
        return settings?.categories.flatMap(c => c.subcategories.length > 0 ? c.subcategories : [{ id: c.id, name: c.name }]) || [];
    }, [settings]);

    const customerMetrics = profile?.profileMetrics?.customer?.[selectedSubcategoryId];
    const professionalMetrics = profile?.profileMetrics?.professional?.[selectedSubcategoryId];
    const selectedSubcategoryName = subcategories.find(s => s.id === selectedSubcategoryId)?.name || selectedSubcategoryId;

    if (isLoading) {
        return <ProfileLoadingSkeleton />;
    }

    if (!profile) {
        return <div>Профіль не знайдено.</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navigation />
            <main className="flex-grow">
                <div className="relative h-48 md:h-64 w-full">
                    {profile.coverUrl ? (
                        <Image src={profile.coverUrl} alt={`${profile.name}'s cover image`} layout="fill" objectFit="cover" className="bg-muted" />
                    ) : (
                        <div className="h-full w-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>

                <div className="container mx-auto px-4 -mt-16 md:-mt-20">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background bg-background shadow-lg">
                            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                            <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="py-4 flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h1 className="text-3xl md:text-4xl font-bold">{profile.name}</h1>
                                {isOwnProfile ? (
                                    <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline"><Edit className="mr-2 h-4 w-4" />Редагувати</Button>
                                        </DialogTrigger>
                                        <EditProfileModal profile={profile} setOpen={setEditModalOpen} />
                                    </Dialog>
                                ) : (
                                    <Button variant={isFavorite ? "secondary" : "outline"} onClick={handleFavoriteToggle}>
                                        <Bookmark className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                                        {isFavorite ? 'В улюблених' : 'В улюблені'}
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Учасник з {profile.createdAt?.toDate().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                     <p className="max-w-3xl text-muted-foreground mb-12">{profile.bio || 'Користувач ще не додав інформацію про себе.'}</p>
                     
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-sm font-medium">Статистика по категорії:</span>
                        <Select value={selectedSubcategoryId} onValueChange={setSelectedSubcategoryId}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Оберіть категорію" />
                            </SelectTrigger>
                            <SelectContent>
                                {subcategories.map(sub => (
                                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <RoleMetricsCard title="Замовник" icon={Users} metrics={customerMetrics} subcategoryName={selectedSubcategoryName} />
                        <RoleMetricsCard title="Професіонал" icon={Award} metrics={professionalMetrics} subcategoryName={selectedSubcategoryName} />
                    </div>

                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Публікації автора</h2>
                        {posts.length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map(post => (
                                    <Link key={post.id} href={`/blog/post/${post.slug}`}>
                                        <Card className="overflow-hidden h-full group">
                                            <div className="relative aspect-video">
                                                <Image src={post.coverImageUrl || '/placeholder.png'} alt={post.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-lg line-clamp-2">{post.title}</h3>
                                                <p className="text-sm text-muted-foreground line-clamp-3 mt-2">{post.excerpt}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">Автор ще не має публікацій.</p>
                            </div>
                        )}
                    </div>

                </div>

            </main>
            <Footer />
        </div>
    );
}
