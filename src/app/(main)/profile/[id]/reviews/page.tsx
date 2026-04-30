'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { collection, query, where, orderBy, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Review, UserProfile, BlogSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Star, Megaphone, User, Clock, MessageSquare, Video, FileText, LayoutGrid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileReviewsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = params.id as string;
    const initialSubId = searchParams.get('sub');
    
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(initialSubId);
    const [selectedRole, setSelectedRole] = useState<'customer' | 'professional'>('professional');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [allReviews, setAllReviews] = useState<Review[]>([]);
    const [blogSettings, setBlogSettings] = useState<BlogSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReviewsLoading, setIsReviewsLoading] = useState(true);

    // Load profile and blog settings
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [profileSnap, settingsSnap] = await Promise.all([
                    getDoc(doc(db, 'users', id)),
                    getDoc(doc(db, 'blogSettings', 'main'))
                ]);
                
                if (profileSnap.exists()) {
                    setProfile({ uid: profileSnap.id, ...profileSnap.data() } as UserProfile);
                }
                if (settingsSnap.exists()) {
                    setBlogSettings(settingsSnap.data() as BlogSettings);
                }
            } catch (err) {
                console.error('Error loading initial data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [id]);

    // Load reviews
    useEffect(() => {
        const loadReviews = async () => {
            setIsReviewsLoading(true);
            try {
                const q = query(
                    collection(db, 'reviews'),
                    where('targetId', '==', id),
                    orderBy('createdAt', 'desc')
                );
                const snap = await getDocs(q);
                const reviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
                setAllReviews(reviews);
            } catch (err) {
                console.error('Error loading reviews:', err);
            } finally {
                setIsReviewsLoading(false);
            }
        };
        loadReviews();
    }, [id]);

    const activeSubcategories = useMemo(() => {
        if (!allReviews.length || !blogSettings?.categories) return [];
        const usedSubIds = new Set(allReviews.map(r => r.subcategoryId));
        const active: { id: string, name: string }[] = [];
        blogSettings.categories.forEach(cat => {
            cat.subcategories?.forEach(sub => {
                if (usedSubIds.has(sub.id)) {
                    active.push({ id: sub.id, name: sub.name });
                }
            });
        });
        return active;
    }, [allReviews, blogSettings]);

    useEffect(() => {
        if (activeSubcategories.length > 0 && (!selectedSubcategoryId || !activeSubcategories.some(s => s.id === selectedSubcategoryId))) {
            setSelectedSubcategoryId(activeSubcategories[0].id);
        }
    }, [activeSubcategories, selectedSubcategoryId]);

    const filteredReviews = useMemo(() => {
        return allReviews.filter(r => 
            r.subcategoryId === selectedSubcategoryId && 
            r.targetRole === selectedRole
        );
    }, [allReviews, selectedSubcategoryId, selectedRole]);

    const getCommIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('відео') || t.includes('video')) return <Video className="w-3.5 h-3.5" />;
        if (t.includes('чат') || t.includes('chat') || t.includes('текст')) return <MessageSquare className="w-3.5 h-3.5" />;
        if (t.includes('файл') || t.includes('file')) return <FileText className="w-3.5 h-3.5" />;
        return <Megaphone className="w-3.5 h-3.5" />;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
                    <Skeleton className="h-10 w-32 rounded-full" />
                    <Skeleton className="h-64 w-full rounded-3xl" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-accent/10 selection:text-accent">
            <Navigation />
            
            <main className="container mx-auto max-w-4xl px-4 pt-12 pb-24 space-y-10">
                {/* Back Button */}
                <Button 
                    variant="ghost" 
                    className="group -ml-4 text-muted-foreground hover:text-accent transition-all rounded-full h-10 px-4"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                    <span>Назад до профілю</span>
                </Button>

                {/* Profile Header Block */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-muted/30">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <Avatar className="h-20 w-20 border-2 border-background ring-4 ring-muted/5 shadow-xl">
                                <AvatarImage src={profile?.avatarUrl} className="object-cover" />
                                <AvatarFallback className="bg-muted/10 text-muted-foreground/30 font-black">
                                    {profile?.displayName?.[0] || profile?.name?.[0] || <User className="h-10 w-10" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-full shadow-md border border-border/10">
                                <Megaphone className="h-4 w-4 text-accent" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black tracking-tight text-foreground">Відгуки</h1>
                                <span className="text-xs font-bold text-muted-foreground/40 bg-muted/10 px-2 py-0.5 rounded uppercase tracking-widest">
                                    {allReviews.length} всього
                                </span>
                            </div>
                            <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">
                                {profile?.displayName || profile?.name}
                            </p>
                        </div>
                    </div>
                </div>

                {allReviews.length === 0 && !isReviewsLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-muted/5 rounded-[40px] border border-dashed border-muted/30">
                        <div className="h-16 w-16 rounded-3xl bg-muted/10 flex items-center justify-center mb-6">
                            <Megaphone className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                        <h3 className="text-xl font-black text-foreground/80 mb-2">Відгуків ще немає</h3>
                        <p className="text-muted-foreground text-sm max-w-xs text-center">Користувач ще не отримав жодної публічної оцінки в системі.</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-1000">
                        {/* Filters Container */}
                        <div className="flex flex-col gap-6 p-6 md:p-8 bg-muted/5 rounded-[32px] border border-muted/20">
                            {/* Subcategory Filter */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1">Підкатегорії з відгуками</label>
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                                    {activeSubcategories.map((sub) => {
                                        const isActive = selectedSubcategoryId === sub.id;
                                        return (
                                            <button
                                                key={sub.id}
                                                onClick={() => setSelectedSubcategoryId(sub.id)}
                                                className={cn(
                                                    "text-[10px] font-extrabold uppercase tracking-widest transition-all px-5 py-3 whitespace-nowrap rounded-2xl border",
                                                    isActive
                                                        ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20 scale-[1.02]"
                                                        : "bg-background text-muted-foreground border-muted/30 hover:text-foreground hover:bg-muted/10 hover:border-muted/50"
                                                )}
                                            >
                                                {sub.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Role Filter */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1">Роль у взаємодії</label>
                                <Tabs 
                                    value={selectedRole} 
                                    onValueChange={(v) => setSelectedRole(v as 'customer' | 'professional')} 
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-background border border-muted/20 rounded-2xl">
                                        <TabsTrigger value="professional" className="rounded-xl font-black text-[11px] uppercase tracking-wider">Як професіонал</TabsTrigger>
                                        <TabsTrigger value="customer" className="rounded-xl font-black text-[11px] uppercase tracking-wider">Як замовник</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="space-y-4">
                            {isReviewsLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-40 w-full rounded-3xl" />
                                    <Skeleton className="h-40 w-full rounded-3xl" />
                                </div>
                            ) : filteredReviews.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-muted/5 border border-muted/10 rounded-[32px]">
                                    <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Немає відгуків для цієї категорії та ролі</p>
                                </div>
                            ) : (
                                filteredReviews.map((review) => (
                                    <article key={review.id} className="group p-6 md:p-8 rounded-[32px] bg-card border border-muted/30 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500 space-y-5">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-1.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star 
                                                        key={star} 
                                                        className={cn(
                                                            "h-4 w-4 transition-transform group-hover:scale-110", 
                                                            star <= review.rating ? "fill-accent text-accent" : "fill-muted/40 text-muted/40"
                                                        )} 
                                                        style={{ transitionDelay: `${star * 50}ms` }}
                                                    />
                                                ))}
                                            </div>
                                            {review.createdAt && (
                                                <div className="flex items-center gap-2 text-muted-foreground/40">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                                        {formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true, locale: uk })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-[15px] leading-relaxed font-medium text-foreground/90 italic">
                                            «{review.text || <span className="text-muted-foreground/40 italic">Без текстового коментаря</span>}»
                                        </p>

                                        <div className="pt-5 border-t border-muted/20 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/10 border border-muted/20">
                                                    {getCommIcon(review.communicationType)}
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{review.communicationType}</span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10">
                                                    <LayoutGrid className="h-3 w-3 text-accent/60" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-accent/80">
                                                        {selectedSubcategoryId ? activeSubcategories.find(s => s.id === selectedSubcategoryId)?.name : 'Усі категорії'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 opacity-30 grayscale group-hover:opacity-60 group-hover:grayscale-0 transition-all">
                                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">ID: {review.reviewerId.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
