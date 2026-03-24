'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { doc, onSnapshot, collection, query, where, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import type { UserProfile, Post, BlogSettings, CommunicationOffer } from '@/lib/types';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Bookmark, Star, Users, Briefcase, Award, MapPin, Globe, Clock, MessageCircle, LayoutGrid, Zap, X, Calendar, Video, FileText, HelpCircle, MessageSquare, Trophy, CheckCircle, Megaphone, Paperclip, Phone, BookOpen, BookmarkPlus, Flag, Play } from 'lucide-react';
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

const getCountryFlag = (country?: string) => {
    if (!country) return null;
    const c = country.toLowerCase();
    if (c.includes('україна') || c.includes('ukraine')) return '🇺🇦';
    if (c.includes('польща') || c.includes('poland')) return '🇵🇱';
    if (c.includes('німеччина') || c.includes('germany')) return '🇩🇪';
    if (c.includes('сша') || c.includes('usa')) return '🇺🇸';
    if (c.includes('франція') || c.includes('france')) return '🇫🇷';
    if (c.includes('іспанія') || c.includes('spain')) return '🇪🇸';
    if (c.includes('італія') || c.includes('italy')) return '🇮🇹';
    if (c.includes('велика британія') || c.includes('uk')) return '🇬🇧';
    if (c.includes('канада') || c.includes('canada')) return '🇨🇦';
    if (c.includes('австралія') || c.includes('australia')) return '🇦🇺';
    if (c.includes('бразилія') || c.includes('brazil')) return '🇧🇷';
    if (c.includes('японія') || c.includes('japan')) return '🇯🇵';
    return null;
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
    if (isRank) return `№${val}`;
    return String(val);
};

function RoleMetricsCard({ title, icon: Icon, metrics }: { title: string, icon: React.ElementType, metrics?: { ratingAvg?: number, ratingCount?: number, platformRank?: number | null, completedCount?: number } }) {
    return (
        <Card className="bg-muted/5 shadow-none border-muted/20">
            <CardHeader className="flex-row items-center justify-between p-4 pb-2 space-y-0">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-accent" />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                             <MessageSquare className="h-3 w-3" /> Відгуки
                        </span>
                        <span className="text-base font-bold">{formatZeroMetric(metrics?.ratingCount)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Завершені
                        </span>
                        <span className="text-base font-bold">{formatZeroMetric(metrics?.completedCount)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Місце</span>
                        <span className="text-base font-bold">{formatZeroMetric(metrics?.platformRank, false, true)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                             <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> Рейтинг
                        </span>
                        <span className="text-base font-bold">{formatZeroMetric(metrics?.ratingAvg, true)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function CommunicationOfferCard({ offer, onAction }: { offer: CommunicationOffer; onAction: (offerId: string) => void }) {
    const isVideo = offer.type === 'video';
    const isFile = offer.type === 'file';
    const isText = offer.type === 'text';

    const getButtonStyle = () => {
        return "bg-background hover:bg-muted text-foreground border-muted-foreground/20";
    };

    const getIcon = () => {
        if (isVideo) return <Video className="h-4 w-4" />;
        if (isText) return <Edit className="h-4 w-4" />;
        if (isFile) return <Paperclip className="h-4 w-4" />;
        return null;
    };

    const getIconBg = () => {
        if (isVideo) return "bg-green-100 text-green-600";
        if (isFile) return "bg-blue-100 text-blue-600";
        if (isText) return "bg-yellow-100 text-yellow-600";
        return "bg-muted text-muted-foreground";
    };

    const getLabel = () => {
        if (isVideo) return 'Відеочат';
        if (isText) return 'Запитати';
        if (isFile) return 'Файлообмін';
        return '';
    };

    const getPriceLabel = () => {
        if (isVideo) return `${offer.pricing.ratePerMinute} ${offer.pricing.currency} / 1 хв`;
        if (isText) return `${offer.pricing.ratePerQuestion} ${offer.pricing.currency} / Q&A`;
        if (isFile) return `${offer.pricing.ratePerFile} ${offer.pricing.currency} / 1 файл`;
        return '';
    };

    return (
        <div className="flex-1 flex flex-col gap-1.5 min-w-[150px]">
            <div className="flex flex-col items-center text-center px-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">{getLabel()}</span>
                <span className="text-[11px] font-bold text-foreground leading-tight truncate w-full">{getPriceLabel()}</span>
            </div>
            <Button 
                onClick={() => onAction(offer.id)} 
                variant="outline"
                className={`w-full h-10 rounded-xl text-xs font-bold gap-2 shadow-sm transition-transform active:scale-95 ${getButtonStyle()}`}
            >
                <div className={`p-1 rounded-full ${getIconBg()}`}>
                    {getIcon()}
                </div>
                {isVideo ? 'Виклик' : isText ? 'Запитати' : 'Замовити'}
            </Button>
        </div>
    );
}

function OffersRow({ offers, onAction, onCalendarClick }: { offers: CommunicationOffer[], onAction: (id: string) => void, onCalendarClick: () => void }) {
    return (
        <div className="flex items-end justify-between gap-3 flex-wrap md:flex-nowrap">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3">
                {offers.length > 0 ? (
                    offers.slice(0, 3).map(offer => (
                        <CommunicationOfferCard key={offer.id} offer={offer} onAction={onAction} />
                    ))
                ) : (
                    <div className="col-span-3 py-4 text-center border border-dashed rounded-xl bg-muted/5">
                        <span className="text-xs text-muted-foreground italic">
                            Автор ще не додав пропозицій
                        </span>
                    </div>
                )}
            </div>
            
            <div className="shrink-0 flex items-end">
                <Button 
                    variant="outline" 
                    className="text-foreground gap-2 font-bold text-xs h-10 px-5 rounded-xl bg-background hover:bg-muted border-muted-foreground/20 flex items-center justify-center min-w-[120px] relative" 
                    onClick={onCalendarClick}
                >
                    <Calendar className="h-4 w-4 text-violet-600" />
                    <span>Календар</span>
                    {offers.length > 0 && (
                        <div className="absolute -top-1 -right-1 bg-muted-foreground/10 text-muted-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-background font-bold">
                            {offers.length}
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}

function UnifiedStatsArea({ customer, professional }: { customer?: any, professional?: any }) {
    const rows = [
        { label: 'на платформі', icon: Trophy, getValue: (m: any) => formatZeroMetric(m?.platformRank, false, true) },
        { label: 'завершених комунікацій', icon: CheckCircle, getValue: (m: any) => formatZeroMetric(m?.completedCount) },
        { label: 'рейтинг', icon: Star, getValue: (m: any) => formatZeroMetric(m?.ratingAvg, true), iconColor: 'text-muted-foreground/60' },
        { label: 'відгуки', icon: Megaphone, getValue: (m: any) => formatZeroMetric(m?.ratingCount), iconColor: 'text-muted-foreground/60' },
    ];

    return (
        <div className="w-full space-y-3 pt-2">
            <div className="grid grid-cols-3 items-center px-2">
                <div className="text-center font-bold text-sm uppercase tracking-wider text-muted-foreground">Замовник</div>
                <div />
                <div className="text-center font-bold text-sm uppercase tracking-wider text-muted-foreground">Професіонал</div>
            </div>

            <div className="space-y-0">
                {rows.map((row, idx) => {
                    const custVal = row.getValue(customer);
                    const profVal = row.getValue(professional);
                    return (
                        <div key={idx} className={`grid grid-cols-3 items-center hover:bg-muted/5 transition-colors pt-3 pb-3.5 px-4 ${idx < 3 ? 'border-b border-foreground/10' : ''}`}>
                            <div className={`text-center text-base ${custVal === '00' ? 'font-medium opacity-60' : 'font-extrabold'}`}>
                                {custVal}
                            </div>
                            <div className="flex flex-col items-center gap-1.5 px-1">
                                <row.icon className={`h-4 w-4 ${row.iconColor || 'text-accent'}`} />
                                <span className="text-[9px] uppercase font-bold text-muted-foreground text-center leading-none">{row.label}</span>
                            </div>
                            <div className={`text-center text-base ${profVal === '00' ? 'font-medium opacity-60' : 'font-extrabold'}`}>
                                {profVal}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
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
    const [offers, setOffers] = useState<CommunicationOffer[]>([]);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [favoritesCount, setFavoritesCount] = useState<number>(0);
    
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState<string | null>(null);
    const [isActionModalOpen, setActionModalOpen] = useState(false);
    const [isPlayingIntro, setIsPlayingIntro] = useState(false);

    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');

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

        const offersQuery = query(
            collection(db, 'communicationOffers'), 
            where('ownerId', '==', profileId), 
            where('status', '==', 'active')
        );
        const unsubOffers = onSnapshot(offersQuery, (snapshot) => {
            setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunicationOffer)));
        });

        const productsQuery = query(
            collection(db, 'products'),
            where('authorId', '==', profileId)
        );
        const unsubProducts = onSnapshot(productsQuery, (snapshot) => {
            setProductsCount(snapshot.size);
        });

        const allFavsQuery = query(
            collection(db, 'favorites'),
            where('favoritedUserId', '==', profileId)
        );
        const unsubAllFavs = onSnapshot(allFavsQuery, (snapshot) => {
            setFavoritesCount(snapshot.size);
        });

        return () => {
            unsubProfile();
            unsubPosts();
            unsubSettings();
            unsubOffers();
            unsubProducts();
            unsubAllFavs();
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
        const list = mainCategory?.subcategories || [];
        // Only show subcategories where the author has at least one active offer
        return list.filter(sub => offers.some(o => o.subcategoryId === sub.id));
    }, [mainCategory, offers]);

    // Auto-select first subcategory when loaded
    useEffect(() => {
        if (subcategories.length > 0 && !selectedSubcategoryId) {
            setSelectedSubcategoryId(subcategories[0].id);
        }
    }, [subcategories, selectedSubcategoryId]);

    const customerMetrics = profile?.profileMetrics?.customer?.[selectedSubcategoryId];
    const professionalMetrics = profile?.profileMetrics?.professional?.[selectedSubcategoryId];
    
    const filteredOffers = useMemo(() => {
        return offers.filter(o => o.subcategoryId === selectedSubcategoryId);
    }, [offers, selectedSubcategoryId]);

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
                <main className="flex-grow pt-2 md:pt-4 pb-12 relative">
                    <div className="absolute top-2 right-4 md:right-8 lg:right-12 z-50">
                        <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-background/30 backdrop-blur hover:bg-background/60 shadow-sm border border-muted/20" onClick={handleClose}>
                            <X className="h-4 w-4 md:h-5 md:w-5 text-foreground/70" />
                        </Button>
                    </div>

                    <div className="container max-w-[1200px] mx-auto px-4 md:px-6 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 items-start relative z-10 w-full xl:max-w-[1300px]">
                        
                        {/* LEFT COLUMN: Block A */}
                        <div className="lg:col-span-4 xl:col-span-3 w-full shrink-0 lg:sticky lg:top-24">
                            {/* Block A: Identity Card - Rectangular redesign */}
                            <Card className="shadow-md border-muted/40 bg-background/80 backdrop-blur-md overflow-hidden relative mt-1 md:mt-2 lg:mt-0 w-full flex flex-col">
                                {/* Avatar Block - Rectangular top block */}
                                <div className="w-full h-40 md:h-48 lg:h-52 shrink-0 relative overflow-hidden bg-muted/20 group">
                                    {isPlayingIntro && profile.introVideoUrl ? (
                                        <div className="absolute inset-0 z-20 bg-black">
                                            <video 
                                                src={profile.introVideoUrl} 
                                                poster={profile.introVideoPosterUrl || profile.avatarUrl || undefined}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                muted
                                                playsInline
                                                onEnded={() => setIsPlayingIntro(false)}
                                            />
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white z-30"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsPlayingIntro(false);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Image 
                                            src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || profile.name || '')}&background=random&size=512`} 
                                            alt={profile.displayName || profile.name} 
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-transform duration-500 hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                                    
                                    {profile.introVideoUrl && !isPlayingIntro && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-12 w-12 rounded-full bg-background/40 backdrop-blur-sm hover:bg-background/60 shadow-lg border border-white/20 text-white group-hover:scale-110 transition-all"
                                                onClick={() => setIsPlayingIntro(true)}
                                            >
                                                <Play className="h-6 w-6 fill-current" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-4 md:p-5 flex flex-col items-center text-center relative z-10 bg-background pt-5 gap-4">
                                    {/* Order 1: Credo (Bio) */}
                                    <div className="w-[95%] mx-auto">
                                        <p className="text-[12px] lg:text-[13px] italic font-medium text-foreground/80 leading-relaxed text-center">
                                            “{profile.shortBio || profile.bio || 'Користувач ще не додав інформацію про себе.'}”
                                        </p>
                                    </div>

                                    {/* Order 2: Nickname / display name */}
                                    <div className="w-full flex flex-col items-center gap-1">
                                        <h1 className="text-xl lg:text-2xl font-bold leading-tight line-clamp-2 w-full" title={profile.displayName || profile.name}>
                                            {profile.displayName || profile.name}
                                        </h1>
                                    </div>

                                    {/* Order 3: Favorites control row */}
                                    <div className="flex items-center gap-2">
                                        {isOwnProfile ? (
                                            <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-8 font-bold px-4 rounded-full border-muted/60 bg-background hover:bg-muted shadow-sm text-xs"><Edit className="mr-2 h-3.5 w-3.5" />Редагувати</Button>
                                                </DialogTrigger>
                                                <EditProfileModal profile={profile} setOpen={setEditModalOpen} />
                                            </Dialog>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={handleFavoriteToggle} 
                                                    className={`h-9 font-bold px-4 rounded-full border transition-all shadow-sm text-xs gap-2.5 ${isFavorite ? 'text-accent border-accent/40 bg-accent/5' : 'text-muted-foreground border-muted/30 hover:border-muted/60 hover:text-foreground'}`}
                                                >
                                                    <BookmarkPlus className="h-4.5 w-4.5" />
                                                    {isFavorite ? 'В улюблених' : 'В улюблені'}
                                                </Button>
                                                
                                                <div className="flex flex-col items-center justify-center px-2 py-0.5 rounded-lg bg-muted/5 border border-muted/10 min-w-[32px]">
                                                    <span className={`text-[13px] font-bold leading-none ${favoritesCount > 0 ? 'text-accent' : 'text-muted-foreground opacity-60'}`}>
                                                        {formatZeroMetric(favoritesCount)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order 4: country / location with flag */}
                                    <div className="flex flex-col items-center gap-2 w-full pt-1">
                                        {profile.country && (
                                            <span className="flex items-center justify-center gap-2 text-[13px] font-medium text-foreground/80">
                                                <span className="text-base leading-none">{getCountryFlag(profile.country)}</span>
                                                {profile.country}
                                            </span>
                                        )}
                                        
                                        {/* Order 5: language */}
                                        {profile.preferredLanguage && (
                                            <span className="flex items-center justify-center gap-2 text-[13px] text-muted-foreground/80">
                                                <Globe className="h-3.5 w-3.5 opacity-60" /> 
                                                {getLanguageLabel(profile.preferredLanguage)}
                                            </span>
                                        )}

                                        {/* Order 6: reg date */}
                                        {profile.createdAt && (
                                            <span className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/60 mt-1">
                                                <Calendar className="h-3 w-3 opacity-50" />
                                                <span>Приєднано: {safeFormatDate(profile.createdAt)}</span>
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Spacer to align Block A with Block C bottom */}
                                    <div className="h-12 md:h-16 lg:h-20" />
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: Block B & C */}
                        <div className="lg:col-span-8 xl:col-span-9 w-full flex flex-col gap-4 lg:gap-5 mt-2 lg:mt-0">

                            {/* Block B: Competencies Card */}
                            <Card className="shadow-sm border-muted/60">
                                <CardHeader className="p-3 sm:p-4 border-b border-muted/40 bg-muted/5">
                                    <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
                                        <span className="font-bold text-xs md:text-sm text-foreground shrink-0 pr-3 sm:pr-4 border-r border-muted uppercase tracking-wider">
                                            {esotericsCategoryName}
                                        </span>
                                        <div className="flex items-center gap-1 sm:gap-4 flex-nowrap shrink-0">
                                            {subcategories.filter(sub => sub.id && sub.name).map(sub => {
                                                const subOffers = offers.filter(o => o.subcategoryId === sub.id);
                                                const hasVideo = subOffers.some(o => o.type === 'video');
                                                const hasFile = subOffers.some(o => o.type === 'file');
                                                const hasText = subOffers.some(o => o.type === 'text');
                                                const hasScheduled = subOffers.some(o => o.schedulingType === 'scheduled');

                                                return (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => setSelectedSubcategoryId(sub.id)}
                                                        className={`text-[13px] tracking-wide transition-all px-3 py-1 whitespace-nowrap rounded-md flex flex-col items-center gap-1 group ${
                                                            selectedSubcategoryId === sub.id
                                                                ? 'font-bold text-foreground bg-accent/10'
                                                                : 'font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-0.5 h-1">
                                                            {hasVideo && <div className="w-1 h-1 rounded-full bg-green-500" />}
                                                            {hasFile && <div className="w-1 h-1 rounded-full bg-blue-500" />}
                                                            {hasText && <div className="w-1 h-1 rounded-full bg-yellow-500" />}
                                                            {hasScheduled && <div className="w-1 h-1 rounded-full bg-violet-500" />}
                                                        </div>
                                                        <span>{sub.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-5 space-y-5">
                                    <OffersRow 
                                        offers={filteredOffers} 
                                        onAction={handleActionClick}
                                        onCalendarClick={handleActionClick} 
                                    />
                                    
                                    <UnifiedStatsArea customer={customerMetrics} professional={professionalMetrics} />
                                </CardContent>
                            </Card>

                            {/* Block C: Navigation Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-0">
                                <Link href={`/blog?author=${profile.uid}`}>
                                    <Card className="hover:shadow-md hover:border-accent/40 transition-all cursor-pointer h-full group bg-card shadow-sm border-muted/60">
                                        <CardContent className="p-3 sm:p-4 flex items-center gap-3 min-h-[60px] lg:min-h-[70px]">
                                            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <BookOpen className="h-4 w-4 lg:h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-xs leading-tight">Мій світ</h3>
                                                <p className="text-[10px] text-muted-foreground mt-0.5 truncate uppercase tracking-tight font-bold">
                                                    Публікації: {formatZeroMetric(posts?.length)}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>

                                <Link href={`/profile/${profile.uid}/store`}>
                                    <Card className="hover:shadow-md hover:border-accent/40 transition-all cursor-pointer h-full group bg-card shadow-sm border-muted/60">
                                        <CardContent className="p-3 sm:p-4 flex items-center gap-3 min-h-[60px] lg:min-h-[70px]">
                                            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <LayoutGrid className="h-4 w-4 lg:h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-xs leading-tight">Мій store</h3>
                                                <p className="text-[10px] text-muted-foreground mt-0.5 truncate uppercase tracking-tight font-bold">
                                                    Товари: {formatZeroMetric(productsCount)}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>

                                <Link href={`/profile/${profile.uid}/achievements`}>
                                    <Card className="hover:shadow-md hover:border-accent/40 transition-all cursor-pointer h-full group bg-card shadow-sm border-muted/60">
                                        <CardContent className="p-3 sm:p-4 flex items-center gap-3 min-h-[60px] lg:min-h-[70px]">
                                            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <Trophy className="h-4 w-4 lg:h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-xs leading-tight uppercase font-bold">Досягнення</h3>
                                                <p className="text-[10px] text-muted-foreground mt-0.5 truncate uppercase tracking-tight font-bold">Відзнаки, біографія</p>
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
