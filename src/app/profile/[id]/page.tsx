'use client';

import { useParams, useRouter } from 'next/navigation';
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
import { Edit, Bookmark, Star, Users, Briefcase, Award, MapPin, Globe, Clock, MessageCircle, LayoutGrid, Zap, X, Calendar } from 'lucide-react';
import { EditProfileModal } from '@/components/edit-profile-modal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const LANGUAGE_MAP: Record<string, string> = {
    'uk-UA': 'Українська',
    'uk': 'Українська',
    'en-US': 'Англійська',
    'en': 'Англійська',
    'pl-PL': 'Польська',
    'pl': 'Польська',
    'de-DE': 'Німецька',
    'de': 'Німецька',
    'fr-FR': 'Французька',
    'fr': 'Французька',
    'es-ES': 'Іспанська',
    'es': 'Іспанська'
};

const getLanguageLabel = (code?: string) => {
    if (!code) return '';
    return LANGUAGE_MAP[code] || code;
};

const safeFormatDate = (timestamp: any) => {
    if (!timestamp) return 'Невідомо';
    try {
        if (typeof timestamp.toDate === 'function') {
            return timestamp.toDate().toLocaleDateString('uk-UA');
        }
        if (timestamp instanceof Date) {
            return timestamp.toLocaleDateString('uk-UA');
        }
        if (typeof timestamp === 'string' || typeof timestamp === 'number') {
            return new Date(timestamp).toLocaleDateString('uk-UA');
        }
    } catch (e) {
        return 'Невідомо';
    }
    return 'Невідомо';
};

function ProfileLoadingSkeleton() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
                <div className="h-20 md:h-24 bg-muted animate-pulse" />
                <div className="container mx-auto px-4 -mt-10 md:-mt-8">
                    <div className="flex items-end gap-3">
                        <Skeleton className="h-20 w-20 md:h-16 md:w-16 rounded-full border-4 border-background" />
                        <div className="pb-2 space-y-1.5">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-3 md:py-4">
                    <div className="grid grid-cols-1 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </main>
        </div>
    );
}

const formatZeroMetric = (val: number | null | undefined, isRating = false, isRank = false): string => {
    if (val === undefined || val === null || val === 0) return '00';
    if (isRating) return val.toFixed(1);
    if (isRank) return `#${val}`;
    return String(val);
};

function RoleMetricsCard({ title, icon: Icon, metrics, subcategoryName, onActionClick, actionLabel }: { title: string, icon: React.ElementType, metrics?: { ratingAvg?: number, ratingCount?: number, platformRank?: number | null, completedCount?: number }, subcategoryName: string, onActionClick: () => void, actionLabel: string }) {
    return (
        <Card className="bg-background/50 shadow-none flex flex-col h-full border-muted-foreground/10">
            <CardHeader className="flex-row items-center justify-between p-3 pb-1 space-y-0">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-accent" />
                    <CardTitle className="text-sm font-bold">{title}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-xs">{formatZeroMetric(metrics?.ratingAvg, true)}</span>
                    <span className="text-[10px] text-muted-foreground">({formatZeroMetric(metrics?.ratingCount)})</span>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-1 flex-grow flex flex-col">
                <div className="flex-grow flex flex-col justify-center">
                    <div className="flex justify-between items-center text-center pt-2 mt-1 border-t border-muted/50">
                        <div>
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground leading-tight">Місце</p>
                            <p className="text-[13px] font-bold leading-none mt-0.5">{formatZeroMetric(metrics?.platformRank, false, true)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground leading-tight">Сесій</p>
                            <p className="text-[13px] font-bold leading-none mt-0.5">{formatZeroMetric(metrics?.completedCount)}</p>
                        </div>
                    </div>
                </div>
                <div className="pt-3 mt-auto">
                    <Button variant="outline" className="w-full text-xs h-7 px-2" onClick={onActionClick}>
                        {actionLabel}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function CommunicationTypesBlock({ onActionClick }: { onActionClick: () => void }) {
    return (
        <div className="mt-4 flex flex-col md:flex-row gap-3">
            <div className="flex-grow rounded-xl border border-muted-foreground/10 bg-background/50 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Канали</span>
                <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[10px] bg-muted/80 px-2 py-1 rounded font-medium">Текст</span>
                    <span className="text-[10px] bg-muted/80 px-2 py-1 rounded font-medium">Аудіо</span>
                    <span className="text-[10px] bg-muted/80 px-2 py-1 rounded font-medium">Відео</span>
                </div>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 md:min-w-[200px] flex items-center justify-center p-3 cursor-pointer hover:bg-accent/10 transition-colors" onClick={onActionClick}>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="text-xs font-bold text-accent">Календар доступності</span>
                </div>
            </div>
        </div>
    )
}

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
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
    const [isActionModalOpen, setActionModalOpen] = useState(false);

    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('taro'); // Default value

    const handleActionClick = () => {
        setActionModalOpen(true);
    };

    const handleClose = () => {
        if (window.history.length > 2) {
            router.back();
        } else {
            router.push('/blog');
        }
    };

    const handleRedirectToApp = () => {
        const fallbackTimer = setTimeout(() => {
            window.location.href = '/download-app'; // Landing fallback 
        }, 1500);

        window.location.href = `connectu://profile/${profileId}`;

        window.addEventListener('pagehide', () => clearTimeout(fallbackTimer), { once: true });
    };

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

    const mainCategory = useMemo(() => {
        return settings?.categories?.find(c => c.name.toLowerCase() === 'езотерика') || settings?.categories?.[0];
    }, [settings]);

    const esotericsCategoryName = mainCategory?.name || "Езотерика";

    const subcategories = useMemo(() => {
        return mainCategory?.subcategories || [];
    }, [mainCategory]);

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
        <div className="flex flex-col min-h-screen bg-background relative">
            {profile.coverUrl && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <Image src={profile.coverUrl} alt="Background" layout="fill" objectFit="cover" className="opacity-[0.25] blur-xl md:blur-2xl" />
                </div>
            )}
            
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow pt-6 md:pt-10 pb-12 relative">
                    <div className="absolute top-2 right-4 md:right-8 lg:right-12 z-50">
                        <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/30 backdrop-blur hover:bg-background/60 shadow-sm border border-muted/20" onClick={handleClose}>
                            <X className="h-5 w-5 md:h-6 md:w-6 text-foreground/70" />
                        </Button>
                    </div>

                    <div className="container max-w-[1200px] mx-auto px-4 md:px-6 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 items-start relative z-10 w-full xl:max-w-[1300px]">
                        
                        {/* LEFT COLUMN: Block A */}
                        <div className="lg:col-span-4 xl:col-span-3 w-full shrink-0 lg:sticky lg:top-24">
                            {/* Block A: Identity Card */}
                            <Card className="shadow-md border-muted/40 bg-background/80 backdrop-blur-md overflow-hidden relative mt-8 md:mt-12 lg:mt-0 w-full">
                                <CardContent className="p-4 md:p-5 lg:p-6 flex flex-col items-center text-center">
                                    
                                    <div className="w-full flex flex-col items-center gap-4 relative">
                                        
                                        {/* Avatar - strict containment */}
                                        <div className="shrink-0 flex flex-col items-center justify-center z-10 relative mb-1">
                                            <Avatar className="h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 rounded-full border-[4px] border-muted/20 bg-background shadow-sm">
                                                <AvatarImage src={profile.avatarUrl} alt={profile.displayName || profile.name} className="object-cover" />
                                                <AvatarFallback className="text-4xl text-muted-foreground">{(profile.displayName || profile.name)?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>

                                        {/* Name & Actions */}
                                        <div className="w-full flex flex-col items-center text-center gap-3">
                                            <div className="flex flex-col items-center gap-1 w-full relative group">
                                                <h1 className="text-2xl lg:text-3xl font-bold leading-tight line-clamp-2 w-full" title={profile.displayName || profile.name}>{profile.displayName || profile.name}</h1>
                                                {profile.country && (
                                                    <span className="flex items-center justify-center gap-1.5 text-xs lg:text-[13px] text-muted-foreground mt-0.5">
                                                        <MapPin className="h-3.5 w-3.5" /> {profile.country}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex justify-center w-full">
                                                {isOwnProfile ? (
                                                    <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-9 font-medium px-5 rounded-full border-muted/60 bg-background hover:bg-muted shadow-sm w-full max-w-[200px]"><Edit className="mr-2 h-4 w-4" />Редагувати профіль</Button>
                                                        </DialogTrigger>
                                                        <EditProfileModal profile={profile} setOpen={setEditModalOpen} />
                                                    </Dialog>
                                                ) : (
                                                    <Button variant={isFavorite ? "secondary" : "outline"} size="sm" onClick={handleFavoriteToggle} className="h-9 font-medium px-5 rounded-full border-muted/60 bg-background hover:bg-muted transition-colors shadow-sm w-full max-w-[200px]">
                                                        <Bookmark className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current text-accent' : ''}`} />
                                                        {isFavorite ? 'В улюблених' : 'В улюблені'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Meta Data */}
                                        <div className="w-full flex flex-col items-start gap-2 pt-3 mt-1 border-t border-muted/30 w-[85%] mx-auto">
                                            {profile.createdAt && (
                                                <span className="flex items-center justify-start gap-2.5 text-[13px] text-muted-foreground/90 w-full text-left">
                                                    <Calendar className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                                                    <span className="font-medium text-foreground/80 truncate">Приєднано: {safeFormatDate(profile.createdAt)}</span>
                                                </span>
                                            )}
                                            {profile.preferredLanguage && (
                                                <span className="flex items-center justify-start gap-2.5 text-[13px] text-muted-foreground/90 w-full text-left">
                                                    <Globe className="h-4 w-4 text-muted-foreground/70 shrink-0" /> 
                                                    <span className="font-medium text-foreground/80 truncate">{getLanguageLabel(profile.preferredLanguage)}</span>
                                                </span>
                                            )}
                                            {profile.timezone && (
                                                <span className="flex items-center justify-start gap-2.5 text-[13px] text-muted-foreground/90 w-full text-left">
                                                    <Clock className="h-4 w-4 text-muted-foreground/70 shrink-0" /> 
                                                    <span className="font-medium text-foreground/80 truncate">{profile.timezone}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Credo (Short Bio) */}
                                    <div className="mt-4 lg:mt-5 pt-4 w-[85%] mx-auto border-t border-accent/20">
                                        <p className="text-[13px] lg:text-[14px] italic font-medium text-foreground/80 leading-relaxed text-center">
                                            “{profile.shortBio || profile.bio || 'Користувач ще не додав інформацію про себе.'}”
                                        </p>
                                    </div>
                                    
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: Block B & C */}
                        <div className="lg:col-span-8 xl:col-span-9 w-full flex flex-col gap-5 lg:gap-6 mt-6 lg:mt-0">

                    {/* Block B: Competencies Card */}
                    <Card className="shadow-sm border-muted/60">
                        <CardHeader className="p-4 sm:p-5 border-b border-muted/40 bg-muted/5">
                            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
                                <span className="font-semibold text-sm md:text-base text-foreground shrink-0 pr-3 sm:pr-4 border-r border-muted">
                                    {esotericsCategoryName}
                                </span>
                                <div className="flex items-center gap-1 sm:gap-2 flex-nowrap shrink-0">
                                    {subcategories.filter(sub => sub.id && sub.name).map(sub => (
                                        <button
                                            key={sub.id}
                                            onClick={() => setSelectedSubcategoryId(sub.id)}
                                            className={`text-sm tracking-wide transition-all px-3 py-1.5 whitespace-nowrap rounded-sm ${
                                                selectedSubcategoryId === sub.id
                                                    ? 'font-semibold text-foreground border-b-[2px] border-accent bg-accent/5'
                                                    : 'font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                            }`}
                                        >
                                            {sub.name}
                                        </button>
                                    ))}
                                    {subcategories.length === 0 && (
                                        <span className="text-sm text-muted-foreground italic px-2">Підкатегорії відсутні</span>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <RoleMetricsCard title="Замовник" icon={Users} metrics={customerMetrics} subcategoryName={selectedSubcategoryName} onActionClick={handleActionClick} actionLabel="Запропонувати комунікацію" />
                                <RoleMetricsCard title="Професіонал" icon={Award} metrics={professionalMetrics} subcategoryName={selectedSubcategoryName} onActionClick={handleActionClick} actionLabel="Переглянути відгуки" />
                            </div>
                            
                            <CommunicationTypesBlock onActionClick={handleActionClick} />
                        </CardContent>
                    </Card>

                    {/* Block C: Navigation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <Link href={`/blog?author=${profile.uid}`}>
                            <Card className="hover:shadow-md hover:border-accent/40 transition-all cursor-pointer h-full group bg-card shadow-sm border-muted/60">
                                <CardContent className="p-4 sm:p-5 lg:p-6 flex items-center gap-4 lg:gap-5 min-h-[100px] lg:min-h-[110px]">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm leading-none">Мій світ</h3>
                                        <p className="text-[11px] text-muted-foreground mt-1.5 truncate">
                                            Публікації <span className="font-medium text-foreground">{formatZeroMetric(posts?.length)}</span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <div onClick={handleActionClick}>
                            <Card className="hover:shadow-md hover:border-accent/40 transition-all cursor-pointer h-full group bg-card shadow-sm border-muted/60">
                                <CardContent className="p-4 sm:p-5 lg:p-6 flex items-center gap-4 lg:gap-5 min-h-[100px] lg:min-h-[110px]">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <LayoutGrid className="h-5 w-5 lg:h-6 lg:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm leading-none">Мій store</h3>
                                        <p className="text-[11px] text-muted-foreground mt-1.5 truncate">Товари та послуги</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Link href={`/profile/${profile.uid}/achievements`}>
                            <Card className="hover:shadow-md hover:border-accent/40 transition-all cursor-pointer h-full group bg-card shadow-sm border-muted/60">
                                <CardContent className="p-4 sm:p-5 lg:p-6 flex items-center gap-4 lg:gap-5 min-h-[100px] lg:min-h-[110px]">
                                    <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Zap className="h-5 w-5 lg:h-6 lg:w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm leading-none">Досягнення</h3>
                                        <p className="text-[11px] text-muted-foreground mt-1.5 truncate">Відзнаки, біографія</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div> {/* End Block C */}

                        </div> {/* End Right Column Wrapper */}

                </div> {/* End General Container */}
                
                <Dialog open={isActionModalOpen} onOpenChange={setActionModalOpen}>
                    <DialogContent className="sm:max-w-md bg-card">
                        <DialogHeader>
                            <DialogTitle className="text-xl pb-2">Дія доступна у додатку</DialogTitle>
                            <DialogDescription className="text-sm">
                                Ця комерційна дія або функція комунікації доступна у повній версії додатку ConnectU. Бажаєте перейти до додатку, щоб продовжити?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setActionModalOpen(false)}>
                                Скасувати
                            </Button>
                            <Button className="w-full sm:w-auto" onClick={handleRedirectToApp}>
                                Перейти в app
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </main>
            </div>
        </div>
    );
}
