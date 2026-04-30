'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { doc, onSnapshot, collection, query, where, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import type { UserProfile, Post, BlogSettings, CommunicationOffer, Product, CommunityArchitectAssignment } from '@/lib/types';
import { ProfileStatusShelf } from '@/components/profile/profile-status-shelf';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Bookmark, Star, Users, Briefcase, Award, MapPin, Globe, Clock, MessageCircle, LayoutGrid, Zap, X, Calendar, Video, FileText, HelpCircle, MessageSquare, Trophy, CheckCircle, Megaphone, Paperclip, Phone, BookOpen, BookmarkPlus, Flag, Play, Copy, Check, Landmark, ArrowRight, Crown } from 'lucide-react';
import { FavoriteButton } from '@/components/social/favorite-button';
import { FriendButton } from '@/components/friend-button';
import { EditProfileModal } from '@/components/edit-profile-modal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { calculateProfileCompletion } from '@/lib/utils/profile-completion';
import { TrustStrip } from '@/components/profile/trust-strip';
import { Badge } from '@/components/ui/badge';
import { WelcomeIntentSection } from '@/components/welcome-intent-section';
import { cn } from '@/lib/utils';

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
        <div className="flex flex-col min-h-screen bg-background">
            <div className="relative z-50 w-full sticky top-0">
                <Navigation />
            </div>
            <main className="flex-grow pt-8 md:pt-10">
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
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> Відгуки
                        </span>
                        <span className="text-base font-bold">{formatZeroMetric(metrics?.ratingCount)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Завершені
                        </span>
                        <span className="text-base font-bold">{formatZeroMetric(metrics?.completedCount)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Місце</span>
                        <span className="text-base font-bold">{formatZeroMetric(metrics?.platformRank, false, true)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
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
                <span className="text-[11px] uppercase font-bold text-muted-foreground leading-tight">{getLabel()}</span>
                <span className="text-xs font-bold text-foreground leading-tight truncate w-full">{getPriceLabel()}</span>
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
        <div className="flex items-end justify-between gap-3 flex-wrap md:flex-nowrap min-h-[86px]">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3 h-full">
                {offers.length > 0 ? (
                    offers.slice(0, 3).map(offer => (
                        <CommunicationOfferCard key={offer.id} offer={offer} onAction={onAction} />
                    ))
                ) : (
                    <div className="col-span-3 h-[86px] flex items-center justify-center border border-dashed rounded-xl bg-muted/5">
                        <span className="text-[11px] uppercase font-bold text-muted-foreground/40 tracking-widest">
                            Автор ще не додав пропозицій
                        </span>
                    </div>
                )}
            </div>

            <div className="shrink-0 flex items-end h-full">
                <Button
                    variant="outline"
                    className="text-foreground gap-2 font-bold text-xs h-10 px-5 rounded-xl bg-background hover:bg-muted border-muted-foreground/20 flex items-center justify-center min-w-[120px] relative mt-auto"
                    onClick={onCalendarClick}
                >
                    <Calendar className="h-4 w-4 text-violet-600" />
                    <span>Календар</span>
                    {offers.length > 0 && (
                        <div className="absolute -top-1 -right-1 bg-muted-foreground/10 text-muted-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-background font-bold">
                            {offers.length}
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}

function UnifiedStatsArea({ customer, professional, onReviewsClick }: { customer?: any, professional?: any, onReviewsClick?: () => void }) {
    const hasAnyReviews = (customer?.ratingCount || 0) > 0 || (professional?.ratingCount || 0) > 0;

    const rows = [
        { label: 'на платформі', icon: Trophy, getValue: (m: any) => formatZeroMetric(m?.platformRank, false, true) },
        { label: 'комунікацій', icon: CheckCircle, getValue: (m: any) => formatZeroMetric(m?.completedCount) },
        { label: 'рейтинг', icon: Star, getValue: (m: any) => formatZeroMetric(m?.ratingAvg, true), iconColor: 'text-muted-foreground/60' },
        { label: 'відгуки', icon: Megaphone, getValue: (m: any) => formatZeroMetric(m?.ratingCount), iconColor: 'text-muted-foreground/60' },
    ];

    return (
        <div className="w-full max-w-[340px] mx-auto space-y-2 pt-3 border-t border-muted/30 mt-0 min-h-[190px]">
            <div className="grid grid-cols-3 items-center px-1 py-1 h-6">
                <div className="text-center font-bold text-[11px] uppercase tracking-wider text-muted-foreground opacity-70">Замовник</div>
                <div />
                <div className="text-center font-bold text-[11px] uppercase tracking-wider text-muted-foreground opacity-70">Професіонал</div>
            </div>

            <div className="space-y-2">
                {rows.map((row, idx) => {
                    const custVal = row.getValue(customer);
                    const profVal = row.getValue(professional);
                    return (
                        <div key={idx} className="grid grid-cols-3 items-center hover:bg-muted/5 transition-colors py-1.5 px-1">
                            <div className={`text-center text-sm ${custVal === '00' ? 'font-medium opacity-40' : 'font-extrabold text-foreground/80'}`}>
                                {custVal}
                            </div>
                            <div
                                className={cn(
                                    "flex flex-col items-center gap-0 px-2 -mt-2.5 rounded-lg border transition-all h-[42px] justify-center",
                                    row.label === 'відгуки' && hasAnyReviews && onReviewsClick
                                        ? "border-accent/40 bg-accent/5 cursor-pointer hover:bg-accent/10 hover:border-accent/60 shadow-sm"
                                        : row.label === 'відгуки'
                                            ? "border-accent/10 opacity-40 grayscale cursor-not-allowed"
                                            : "border-transparent"
                                )}
                                onClick={() => row.label === 'відгуки' && hasAnyReviews && onReviewsClick && onReviewsClick()}
                            >
                                <row.icon className={`h-[18px] w-[18px] ${row.iconColor || 'text-accent/60'}`} />
                                <span className="text-[10px] uppercase font-bold text-muted-foreground/70 text-center leading-none">{row.label}</span>
                            </div>
                            <div className={`text-center text-sm ${profVal === '00' ? 'font-medium opacity-40' : 'font-extrabold text-foreground/80'}`}>
                                {profVal}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CircularProgress({ percentage, size = 48 }: { percentage: number, size?: number }) {
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-muted/20"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset: offset }}
                    strokeLinecap="round"
                    className="text-accent transition-all duration-700 ease-in-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-extrabold text-foreground leading-none">{percentage}%</span>
            </div>
        </div>
    );
}

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const profileId = params?.id as string;
    const { user: currentUser } = useUser();
    const { toast } = useToast();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [settings, setSettings] = useState<BlogSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [offers, setOffers] = useState<CommunicationOffer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isActionModalOpen, setActionModalOpen] = useState(false);
    const [isPlayingIntro, setIsPlayingIntro] = useState(false);

    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
    const [copiedCode, setCopiedCode] = useState(false);
    const [architectAssignment, setArchitectAssignment] = useState<CommunityArchitectAssignment | null>(null);

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

    const handleCopyPromoCode = (code: string, isOwner: boolean) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        toast({
            title: "Код скопійовано",
            description: isOwner
                ? "Ви можете поділитися цим кодом із запрошеними користувачами."
                : "Використайте цей код під час реєстрації."
        });
        setTimeout(() => setCopiedCode(false), 2000);
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
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        });

        // Fetch Community Architect assignment via server-side API (sanitized, no notesInternal)
        const fetchArchitect = async () => {
            try {
                const res = await fetch(`/api/community-architects?userId=${profileId}`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                    setArchitectAssignment(json.data[0]);
                } else {
                    setArchitectAssignment(null);
                }
            } catch {
                setArchitectAssignment(null);
            }
        };
        fetchArchitect();

        return () => {
            unsubProfile();
            unsubPosts();
            unsubSettings();
            unsubOffers();
            unsubProducts();
        };
    }, [profileId]);

    // Handle auto-edit mode from welcome flow
    useEffect(() => {
        if (searchParams.get('edit') === 'true' && currentUser?.uid === profileId) {
            setEditModalOpen(true);
        }
    }, [searchParams, currentUser, profileId]);

    const isOwnProfile = currentUser?.uid === profileId;

    const mainCategory = useMemo(() => {
        return settings?.categories?.find(c => c.name.toLowerCase() === 'езотерика') || settings?.categories?.[0];
    }, [settings]);

    const esotericsCategoryName = mainCategory?.name || "Езотерика";

    const subcategories = useMemo(() => {
        const list = mainCategory?.subcategories || [];
        // Show subcategories that have active offers OR existing metrics (activity)
        return list.filter(sub => {
            const hasActiveOffer = offers.some(o => o.subcategoryId === sub.id);
            const hasProfessionalMetrics = !!profile?.profileMetrics?.professional?.[sub.id];
            const hasCustomerMetrics = !!profile?.profileMetrics?.customer?.[sub.id];
            return hasActiveOffer || hasProfessionalMetrics || hasCustomerMetrics;
        });
    }, [mainCategory, offers, profile?.profileMetrics]);

    // Auto-select first subcategory when loaded
    useEffect(() => {
        if (subcategories.length > 0 && !selectedSubcategoryId) {
            setSelectedSubcategoryId(subcategories[0].id);
        }
    }, [subcategories, selectedSubcategoryId]);

    const activeSubcategoryName = useMemo(() => {
        return subcategories.find(s => s.id === selectedSubcategoryId)?.name;
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

    const referralCode = profile?.referralCode?.trim();

    return (
        <div className="flex flex-col min-h-screen bg-background relative w-full">
            {/* Background: Architect custom theme takes priority, then coverUrl */}
            {architectAssignment?.profileThemeEnabled && architectAssignment?.profileThemeUrl ? (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <Image src={architectAssignment.profileThemeUrl} alt="Background" layout="fill" objectFit="cover" className="opacity-[0.18] blur-xl md:blur-2xl" />
                </div>
            ) : profile.coverUrl ? (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <Image src={profile.coverUrl} alt="Background" layout="fill" objectFit="cover" className="opacity-[0.25] blur-xl md:blur-2xl" />
                </div>
            ) : null}

            <div className="relative z-50 w-full sticky top-0">
                <Navigation />
            </div>
            <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden">
                <main className="flex-grow pt-8 md:pt-10 pb-12 relative lg:pt-12 w-full">
                    <div className="container max-w-[1400px] mx-auto px-3 md:px-4">
                        <WelcomeIntentSection />
                    </div>
                    <div className="container max-w-[1400px] mx-auto px-3 md:px-4 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-[3fr_6.5fr_2.5fr] lg:gap-4 lg:items-stretch items-start relative z-10 w-full mb-10">
                        <div className="absolute top-[-24px] right-2 md:top-[-28px] md:right-4 lg:top-[-36px] lg:right-4 z-50">
                            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-background/50 backdrop-blur hover:bg-background/80 shadow-sm border border-muted/30" onClick={handleClose}>
                                <X className="h-3.5 w-3.5 md:h-4 md:w-4 text-foreground/70" />
                            </Button>
                        </div>

                        {/* LEFT COLUMN: Block A */}
                        <div className="w-full shrink-0 flex flex-col gap-4 h-full">
                            {/* Block A: Identity Card - Rectangular redesign */}
                            <Card className="shadow-md border-muted/40 bg-background/80 backdrop-blur-md overflow-hidden relative mt-1 md:mt-2 lg:mt-0 w-full flex flex-col h-full">
                                <TrustStrip profile={profile} />
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

                                <CardContent className="p-4 flex-grow flex flex-col items-center text-center relative z-10 bg-background pt-3 gap-1.5">
                                    {/* Community Architect Status Line - Moved from bottom to just below avatar */}
                                    {architectAssignment && (
                                        <Link href="/community-architects" className="flex items-center justify-center gap-2 mb-0 w-full overflow-hidden shrink-0 group/arch hover:opacity-80 transition-opacity cursor-pointer">
                                            <Landmark className="h-3 w-3 text-accent/60 shrink-0 group-hover/arch:text-accent transition-colors" />
                                            <div className="flex items-center gap-1.5 whitespace-nowrap truncate min-w-0">
                                                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-accent/70 shrink-0">Community Architect</span>
                                                {architectAssignment.subcategoryName && (
                                                    <>
                                                        <span className="text-accent/30 font-bold opacity-60">·</span>
                                                        <div className="flex items-center gap-1.5 truncate">
                                                            <span className="text-[10px] font-bold text-foreground/70 truncate uppercase tracking-tight">
                                                                {architectAssignment.subcategoryName}
                                                            </span>
                                                            {architectAssignment.countryCode && (
                                                                <span className={cn("fi", `fi-${architectAssignment.countryCode.toLowerCase()}`, "text-[11px] rounded-sm shadow-sm shrink-0")} />
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Link>
                                    )}

                                    {/* Identity info */}
                                    <div className="w-full flex flex-col items-center gap-1 mt-0 shrink-0">
                                        <h1 className="text-xl lg:text-2xl font-black leading-tight tracking-tight text-foreground/90 uppercase flex items-center justify-center gap-2" title={profile.displayName || profile.name}>
                                            {profile.displayName || profile.name}

                                        </h1>
                                        {profile.profileMetrics?.professional?.[selectedSubcategoryId] && (
                                            <span className="text-[10px] font-black text-accent uppercase tracking-[0.1em] opacity-80">
                                                {subcategories.find(s => s.id === selectedSubcategoryId)?.name || 'Професіонал'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Metadata: country / language */}
                                    <div className="flex flex-col items-center gap-1.5 w-full shrink-0">


                                        <div className="flex items-center gap-3">
                                            {profile.preferredLanguage && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                                                    укр
                                                </span>
                                            )}
                                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                                                <Globe className="h-3 w-3 opacity-60 mr-1" />
                                                {getLanguageLabel(profile.preferredLanguage)}
                                            </span>
                                        </div>

                                        {/* Referral Code */}

                                    </div>

                                    <div className="flex flex-col items-center gap-3 pt-2">
                                        {isOwnProfile ? (
                                            <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-8 font-black px-4 rounded-xl border-muted/50 bg-background hover:bg-muted shadow-sm text-[10px] uppercase tracking-wider"><Edit className="mr-1.5 h-3 w-3" />Редагувати</Button>
                                                </DialogTrigger>
                                                <EditProfileModal profile={profile} setOpen={setEditModalOpen} />
                                            </Dialog>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FavoriteButton
                                                    targetId={profileId}
                                                    type="user"
                                                    className="h-8 px-3 rounded-xl border border-muted/40 hover:border-muted/60"
                                                />
                                                <FriendButton
                                                    targetProfile={profile}
                                                    className="h-8 rounded-xl"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-[90%] mx-auto pt-3 border-t border-muted/10">
                                        <p className="text-sm font-medium text-foreground/60 leading-relaxed text-center">
                                            {profile.shortBio || profile.bio || 'Користувач ще не додав інформацію про себе.'}
                                        </p>
                                    </div>

                                    {/* Community Architect Public Role Block */}
                                    {architectAssignment && (
                                        <div className="w-[90%] mx-auto pt-3 border-t border-muted/10">


                                            <div className="space-y-1">

                                                {/* Architect Council Entry CTA: Only for eligible member viewing own profile */}
                                                {isOwnProfile && architectAssignment && architectAssignment.councilEligible && (
                                                    <div className="mt-3 pt-3 border-t border-muted/5 flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/80">Privileged Access</span>
                                                        </div>
                                                        <Link
                                                            href="/architect-council"
                                                            className="flex items-center justify-between group/council p-2 px-3 rounded-lg border border-accent/10 bg-accent/5 hover:bg-accent/10 transition-all"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Crown className="h-3 w-3 text-accent" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-accent group-hover/council:text-accent/80">Enter Architect Council</span>
                                                            </div>
                                                            <ArrowRight className="h-3 w-3 text-accent/40 group-hover/council:translate-x-0.5 transition-transform" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto w-full">
                                        {/* Registration Date - Above the badge */}
                                        {profile.createdAt && (
                                            <div className="w-full pt-0.5 pb-0.5 flex justify-center opacity-40">
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.12em]">
                                                    на платформі з {safeFormatDate(profile.createdAt)}
                                                </span>
                                            </div>
                                        )}

                                        {/* SPRINT-ID Badge - Absolute Bottom, Single Line */}
                                        {referralCode && (
                                            <div className="w-full pb-0">
                                                <div 
                                                    className="w-full h-[72px] flex items-center justify-between px-4 bg-accent/5 border border-accent/10 rounded-xl group/sprint cursor-pointer hover:bg-accent/10 transition-all duration-300 shadow-sm"
                                                    onClick={() => handleCopyPromoCode(referralCode, isOwnProfile)}
                                                >
                                                    <div className="flex items-center gap-2 truncate min-w-0">
                                                        <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.1em] shrink-0">
                                                            {isOwnProfile ? 'ВЛАСНИЙ SPRINT-ID' : 'SPRINT-ID ЕКСПЕРТА'}
                                                        </span>
                                                        <span className="text-muted-foreground/30 font-bold shrink-0">·</span>
                                                        <div className="flex items-center gap-1.5 truncate">
                                                            <Zap className="h-3.5 w-3.5 text-accent fill-accent/20 shrink-0" />
                                                            <span className="text-sm font-black text-accent uppercase tracking-widest truncate">{referralCode}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg bg-background/50 text-accent group-hover/sprint:bg-accent group-hover/sprint:text-white transition-all shadow-sm shrink-0 ml-2">
                                                        {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-1" />
                                </CardContent>
                            </Card>
                        </div>

                        {/* CENTER COLUMN: Block B (Main block) */}
                        <div className="w-full flex flex-col gap-4 h-full relative">
                            <Card className="shadow-sm border-muted/50 h-full flex flex-col bg-background/60 backdrop-blur-sm overflow-hidden min-h-[580px]">
                                <CardHeader className="px-4 py-1.5 border-b border-muted/30 bg-muted/5 min-h-[44px] shrink-0">
                                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth">
                                        <span className="font-black text-[11px] text-foreground shrink-0 pr-4 border-r border-muted/40 uppercase tracking-[0.15em] opacity-80">
                                            {esotericsCategoryName}
                                        </span>
                                        <div className="flex items-center gap-2.5 flex-nowrap shrink-0">
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
                                                        className={`text-[11px] tracking-[0.1em] transition-all px-2.5 py-1.5 whitespace-nowrap rounded-md flex flex-col items-center gap-1 group uppercase min-w-[60px] ${selectedSubcategoryId === sub.id
                                                            ? 'font-black text-accent bg-accent/5'
                                                            : 'font-bold text-muted-foreground/60 hover:text-foreground hover:bg-muted/30'
                                                            }`}
                                                    >
                                                        <span>{sub.name}</span>
                                                        <div className="flex items-center justify-center gap-1.5 h-2">
                                                            {hasVideo && (
                                                                <div
                                                                    className={`w-1.5 h-1.5 rounded-sm shadow-[0_0_4px_rgba(34,197,94,0.4)] ${selectedSubcategoryId === sub.id ? 'bg-accent' : 'bg-green-500/60'
                                                                        }`}
                                                                    title="Відеочат"
                                                                />
                                                            )}
                                                            {hasFile && (
                                                                <div
                                                                    className={`w-1.5 h-1.5 rounded-sm shadow-[0_0_4px_rgba(59,130,246,0.4)] ${selectedSubcategoryId === sub.id ? 'bg-accent' : 'bg-blue-500/60'
                                                                        }`}
                                                                    title="Файлообмін"
                                                                />
                                                            )}
                                                            {hasText && (
                                                                <div
                                                                    className={`w-1.5 h-1.5 rounded-sm shadow-[0_0_4px_rgba(234,179,8,0.4)] ${selectedSubcategoryId === sub.id ? 'bg-accent' : 'bg-yellow-500/60'
                                                                        }`}
                                                                    title="Запитати"
                                                                />
                                                            )}
                                                            {hasScheduled && (
                                                                <div
                                                                    className={`w-1.5 h-1.5 rounded-sm shadow-[0_0_4px_rgba(139,92,246,0.4)] ${selectedSubcategoryId === sub.id ? 'bg-accent' : 'bg-violet-500/60'
                                                                        }`}
                                                                    title="Заплановано"
                                                                />
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 sm:px-6 py-2 sm:py-3 pt-1.5 sm:pt-2 flex-grow flex flex-col justify-start">
                                    <div className="space-y-3">
                                        <OffersRow
                                            offers={filteredOffers}
                                            onAction={handleActionClick}
                                            onCalendarClick={handleActionClick}
                                        />
                                    </div>

                                    <div className="mt-3 flex flex-col min-h-[280px]">
                                        <UnifiedStatsArea
                                            customer={customerMetrics}
                                            professional={professionalMetrics}
                                            onReviewsClick={() => router.push(`/profile/${profile.uid}/reviews?sub=${selectedSubcategoryId}`)}
                                        />
                                        <div className="mt-2 h-[80px] shrink-0">
                                            <ProfileStatusShelf subcategoryName={activeSubcategoryName} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN: 3-Card Stack */}
                        <div className="w-full flex flex-col gap-4 relative h-full">
                            {/* Card 1: Publications */}
                            <Link href={`/blog?author=${profile.uid}`} className="w-full flex-1 flex flex-col group">
                                <Card className="hover:shadow-md hover:border-accent/40 transition-all cursor-pointer bg-card/80 backdrop-blur-sm border-muted/40 overflow-hidden flex-1 flex flex-col">
                                    <CardContent className="p-4 xl:p-5 flex-1 flex flex-col items-start relative">
                                        <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mb-3">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex flex-col">
                                            <h3 className="font-black text-[11px] uppercase tracking-wider text-muted-foreground leading-tight">Публікації</h3>
                                            <span className="text-[10px] font-bold text-foreground truncate mt-0.5">{profile.displayName || profile.name}</span>
                                        </div>
                                        <div className="mt-auto w-full flex justify-end">
                                            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted/20 text-[11px] font-black text-muted-foreground/80 group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                                                {posts.length || 0}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Card 2: Store */}
                            <Link href={`/profile/${profile.uid}/store`} className="w-full flex-1 flex flex-col group">
                                <Card className="hover:shadow-md hover:border-accent/40 transition-all cursor-pointer bg-card/80 backdrop-blur-sm border-muted/40 overflow-hidden flex-1 flex flex-col">
                                    <CardContent className="p-4 xl:p-5 flex-1 flex flex-col items-start relative">
                                        <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mb-3">
                                            <LayoutGrid className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex flex-col">
                                            <h3 className="font-black text-[11px] uppercase tracking-wider text-muted-foreground leading-tight">Артефакти</h3>
                                            <span className="text-[10px] font-bold text-foreground truncate mt-0.5">{profile.displayName || profile.name}</span>
                                        </div>
                                        <div className="mt-auto w-full flex justify-end">
                                            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted/20 text-[11px] font-black text-muted-foreground/80 group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                                                {products.length || 0}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            {/* Card 3: Biography & Completion */}
                            <Link href={`/profile/${profile.uid}/achievements`} className="w-full flex-1 flex flex-col group">
                                <Card className="hover:shadow-md hover:border-accent/50 transition-all cursor-pointer bg-card/90 backdrop-blur-sm border-muted/50 overflow-hidden flex-1 flex flex-col">
                                    <CardContent className="p-4 xl:p-5 flex-1 flex flex-col items-start relative">
                                        <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform mb-3">
                                            <Trophy className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0 flex flex-col">
                                            <h3 className="font-black text-[11px] uppercase tracking-wider text-muted-foreground leading-tight">Біографія, досягнення,</h3>
                                            <h3 className="font-black text-[11px] uppercase tracking-wider text-muted-foreground leading-tight mt-0.5">подробиці</h3>
                                        </div>

                                        <div className="mt-auto w-full flex justify-end">
                                            {(() => {
                                                const completion = calculateProfileCompletion(profile, offers);
                                                return (
                                                    <div className="flex flex-col items-center shrink-0 min-w-[42px]">
                                                        <CircularProgress percentage={completion.percentage} size={38} />
                                                        <span className="text-[7px] font-black uppercase text-accent mt-1 tracking-tighter leading-none text-center">
                                                            {completion.statusLabel}
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div> {/* End Grid Row */}
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
