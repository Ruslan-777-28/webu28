'use client';

import React, { Suspense, useEffect, useState, useMemo, useCallback } from 'react';
import { Navigation } from '@/components/navigation';
import { useSearchParams, useRouter } from 'next/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { getBlog2Data, Blog2Data } from '@/lib/blog2/get-blog-data';
import { EditorialHeader, PremiumPostCard, CuratedFeaturedBlock } from '@/components/blog2/editorial-elements';
import { SidebarPosts, VoiceOfTheDay, EmotionalNavigation } from '@/components/blog2/sidebar-elements';
import { InterestSelector, SubcategoryChip, LECTOR_EDITORIAL_ID } from '@/components/blog2/interest-selector';
import { ArrowRight, BookOpen, Sparkles, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Post } from '@/lib/types';
import type { DemoPost } from '@/lib/blog2/demo-blog2-data';
import { BlogSearchSheet } from '@/components/blog2/blog-search-sheet';

// LECTOR Editorial post IDs — posts from sites published = blog content type
// When LECTOR _editorial_ chip is selected, show only contentType="blog" posts
function isLectorEditorial(post: Post | DemoPost): boolean {
    if ('isDemo' in post && post.isDemo) return false;
    return (post as Post).contentType === 'blog';
}

function matchesSubcategory(post: Post | DemoPost, subId: string): boolean {
    return (post as Post).subcategoryId === subId;
}

function BlogPageInner() {
    const [data, setData] = useState<Blog2Data | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const searchParams = useSearchParams();
    const router = useRouter();

    // Read author filter from URL
    const authorId = searchParams.get('author') || null;

    useEffect(() => {
        async function fetchData() {
            const result = await getBlog2Data();
            setData(result);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const getCategoryName = (categoryId: string) =>
        data?.settings?.categories.find(c => c.id === categoryId)?.name || 'Прогрес';

    const getSubcategoryName = (categoryId: string, subcategoryId: string) => {
        const category = data?.settings?.categories.find(c => c.id === categoryId);
        return category?.subcategories?.find(s => s.id === subcategoryId)?.name || '';
    };

    // Build flat subcategory list from all categories (dedup by id)
    const availableSubcategories = useMemo<SubcategoryChip[]>(() => {
        if (!data?.settings?.categories) return [];
        const seen = new Set<string>();
        const chips: SubcategoryChip[] = [];
        for (const cat of data.settings.categories) {
            for (const sub of cat.subcategories || []) {
                if (sub.isActive !== false && !seen.has(sub.id)) {
                    seen.add(sub.id);
                    chips.push({ id: sub.id, name: sub.name, categoryId: cat.id });
                }
            }
        }
        return chips;
    }, [data?.settings?.categories]);

    const handleToggle = useCallback((id: string) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) return prev.filter(x => x !== id);
            // LECTOR is outside the slot limit — only subcategory IDs are counted
            const isLector = id === LECTOR_EDITORIAL_ID;
            const userSubCount = prev.filter(x => x !== LECTOR_EDITORIAL_ID).length;
            if (!isLector && userSubCount >= 3) return prev;
            return [...prev, id];
        });
    }, []);

    const handleClear = useCallback(() => setSelectedIds([]), []);

    const handleClearAuthor = useCallback(() => {
        router.push('/blog', { scroll: false });
    }, [router]);

    // ─── Author-filtered data ───
    // When authorId is present, build a completely separate set of posts
    // from the full allPosts array, filtered to only this author.
    const authorPosts = useMemo(() => {
        if (!authorId || !data) return null;
        return data.allPosts.filter(p => p.authorId === authorId);
    }, [authorId, data]);

    const activeAuthorName = useMemo(() => {
        if (!authorPosts || authorPosts.length === 0) return null;
        return authorPosts[0]?.authorName || 'Автор';
    }, [authorPosts]);

    // ─── Subcategory/interest filtering (applies to both normal and author-filtered) ───
    const filterByInterest = useCallback((posts: (Post | DemoPost)[]): (Post | DemoPost)[] => {
        if (selectedIds.length === 0) return posts;

        const wantsLector = selectedIds.includes(LECTOR_EDITORIAL_ID);
        const subIds = selectedIds.filter(id => id !== LECTOR_EDITORIAL_ID);

        return posts.filter(post => {
            if (wantsLector && isLectorEditorial(post)) return true;
            if (subIds.length > 0 && subIds.some(sid => matchesSubcategory(post, sid))) return true;
            return false;
        });
    }, [selectedIds]);

    // ─── Derive display data ───
    // When author filter is active: hero, secondary, latest, popular all come from authorPosts
    // When no author filter: use the original editorial slices from data

    const displayHero = useMemo(() => {
        if (authorPosts) {
            const source = filterByInterest(authorPosts);
            return source[0] || authorPosts[0] || null;
        }
        return data?.heroPost || null;
    }, [authorPosts, data?.heroPost, filterByInterest]);

    const displaySecondary = useMemo(() => {
        if (authorPosts) {
            const source = filterByInterest(authorPosts);
            // Skip hero post
            return source.filter(p => p.id !== displayHero?.id).slice(0, 3);
        }
        const base = data?.secondaryPosts || [];
        return selectedIds.length > 0 ? filterByInterest(base) : base;
    }, [authorPosts, data?.secondaryPosts, selectedIds, filterByInterest, displayHero]);

    const displayLatest = useMemo(() => {
        if (authorPosts) {
            const source = filterByInterest(authorPosts);
            const usedIds = new Set([displayHero?.id, ...displaySecondary.map(p => p.id)]);
            return source.filter(p => !usedIds.has(p.id)).slice(0, 8);
        }
        const base = data?.latestPosts || [];
        return selectedIds.length > 0 ? filterByInterest(base) : base;
    }, [authorPosts, data?.latestPosts, selectedIds, filterByInterest, displayHero, displaySecondary]);

    const displayPopular = useMemo(() => {
        if (authorPosts) {
            const source = filterByInterest(authorPosts);
            return source
                .filter(p => p.id !== displayHero?.id)
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5);
        }
        const base = data?.popularPosts || [];
        return selectedIds.length > 0 ? filterByInterest(base) : base;
    }, [authorPosts, data?.popularPosts, selectedIds, filterByInterest, displayHero]);

    const isFiltered = selectedIds.length > 0 || !!authorId;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-4 py-12 space-y-12">
                    <Skeleton className="w-full h-24 max-w-2xl" />
                    <Skeleton className="w-full aspect-[21/9] rounded-2xl" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-12">
                            <Skeleton className="h-64 rounded-2xl" />
                            <div className="grid grid-cols-2 gap-8">
                                <Skeleton className="h-80 rounded-xl" />
                                <Skeleton className="h-80 rounded-xl" />
                            </div>
                        </div>
                        <div className="lg:col-span-4">
                            <Skeleton className="h-[500px] rounded-2xl" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans tracking-tight">
            <Navigation />

            <main className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-32">

                {/* 1. Header Section */}
                {displayHero && (
                    <EditorialHeader
                        post={displayHero}
                        categoryName={getCategoryName(displayHero.categoryId)}
                    />
                )}

                {/* 2. Interest Selector — between hero and featured block */}
                {availableSubcategories.length > 0 && (
                    <InterestSelector
                        subcategories={availableSubcategories}
                        selectedIds={selectedIds}
                        onToggle={handleToggle}
                        onClear={handleClear}
                    />
                )}

                {/* 2.5 Author Filter Context */}
                {authorId && activeAuthorName && (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8 border-y border-primary/10 animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Матеріали автора</span>
                            <div className="h-px w-12 bg-primary/20" />
                        </div>
                        <div className="flex flex-col items-center gap-6">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center italic">
                                {activeAuthorName}
                            </h2>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleClearAuthor}
                                className="rounded-full text-[9px] font-black uppercase tracking-widest px-6 h-8 hover:bg-primary hover:text-white transition-all border border-primary/20"
                            >
                                <X className="w-3 h-3 mr-2" /> Скинути фільтр
                            </Button>
                        </div>
                    </div>
                )}

                {/* 3. Curated Featured Block — filtered when selection active */}
                {displayHero && displaySecondary.length > 0 && (
                    <CuratedFeaturedBlock
                        mainPost={displaySecondary[0]}
                        sidePosts={displaySecondary.slice(1, 4)}
                        getCategoryName={getCategoryName}
                        getSubcategoryName={getSubcategoryName}
                    />
                )}

                {/* 4. Emotional Navigation — hidden when author filter active */}
                {!authorId && <EmotionalNavigation />}

                {/* 5. Voice of the Day — hidden when author filter active */}
                {!authorId && (
                    <VoiceOfTheDay
                        author={data?.spotlightAuthor || null}
                        posts={data?.spotlightAuthorPosts || []}
                    />
                )}

                {/* 6. Main Feed & Sidebar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">

                    {/* Latest Feed (Left) */}
                    <div className="lg:col-span-8 space-y-16">
                        <section>
                            <div className="flex items-center justify-between mb-12 border-b border-muted pb-6">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black tracking-tighter">
                                        {authorId
                                            ? `Публікації`
                                            : isFiltered ? 'Вибрані теми' : 'Останні Дослідження'}
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
                                        {authorId
                                            ? `${(authorPosts?.length || 0)} матеріал${(authorPosts?.length || 0) !== 1 ? 'ів' : ''} від автора`
                                            : isFiltered
                                                ? `${displayLatest.length} матеріал${displayLatest.length !== 1 ? 'ів' : ''} по вашому фокусу`
                                                : 'Актуальні ідеї та практики'}
                                    </p>
                                </div>
                                {!authorId && (
                                    <Link href="/blog" className="hidden sm:flex items-center gap-2 group text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                                        Весь список <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>

                            {displayLatest.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                                    {displayLatest.map(post => (
                                        <PremiumPostCard
                                            key={post.id}
                                            post={post}
                                            categoryName={getCategoryName(post.categoryId)}
                                            subcategoryName={post.subcategoryId ? getSubcategoryName(post.categoryId, post.subcategoryId) : ''}
                                        />
                                    ))}
                                </div>
                            ) : isFiltered ? (
                                <div className="py-16 text-center space-y-4 border border-border/20 rounded-2xl">
                                    <p className="text-muted-foreground text-sm font-light">
                                        {authorId ? 'У цього автора поки немає опублікованих матеріалів.' : 'По обраних темах поки немає матеріалів.'}
                                    </p>
                                    <button
                                        onClick={authorId ? handleClearAuthor : handleClear}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                    >
                                        Показати весь контент
                                    </button>
                                </div>
                            ) : null}

                            {!authorId && (
                                <div className="mt-20 text-center">
                                    <Link href="/blog">
                                        <Button variant="outline" className="rounded-full px-16 py-8 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white border-2 transition-all shadow-xl">
                                            Відкрити Повний Архів
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="lg:col-span-4 space-y-20">
                        {/* Popular Sidebar — filtered or full */}
                        <SidebarPosts
                            title={authorId ? 'Популярне автора' : isFiltered ? 'Популярне у фокусі' : 'Найбільш Читане'}
                            posts={isFiltered && displayPopular.length > 0 ? displayPopular : (data?.popularPosts || [])}
                        />

                        {/* Newsletter */}
                        <div className="bg-black rounded-3xl p-10 text-white space-y-8 relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen className="w-24 h-24" />
                            </div>
                            <div className="space-y-4 relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Клуб LECTOR</span>
                                <h4 className="text-3xl font-black leading-tight">Глибше, ніж просто текст</h4>
                                <p className="text-sm text-white/50 leading-relaxed font-light">
                                    Підпишіться на щотижневу розсилку сенсів. Тільки те, що дійсно має значення.
                                </p>
                            </div>
                            <div className="pt-4 flex flex-col gap-4 relative z-10">
                                <input
                                    type="email"
                                    placeholder="Ваша електронна пошта"
                                    className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm w-full outline-none focus:ring-1 ring-primary/50 text-white placeholder:text-white/20"
                                />
                                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-7 font-black uppercase tracking-widest text-[10px]">
                                    Приєднатися
                                </Button>
                            </div>
                        </div>

                        {/* Topics Recirculation */}
                        <div className="space-y-8 p-1">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-l-4 border-primary pl-6">
                                Подорож по Темах
                            </h3>
                            <div className="flex flex-col gap-2">
                                {data?.settings?.categories.slice(0, 8).map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/blog?category=${cat.id}`}
                                        className="group flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border/50"
                                    >
                                        <span className="text-sm font-bold group-hover:translate-x-1 transition-transform">#{cat.name}</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Bottom Recirculation */}
                <section className="text-center py-20 border-t border-muted max-w-3xl mx-auto space-y-8">
                    <Sparkles className="w-12 h-12 text-primary/20 mx-auto" />
                    <h2 className="text-4xl font-black tracking-tighter">Це лише початок шляху</h2>
                    <p className="text-muted-foreground font-light text-lg">
                        LECTOR — це не просто блог. Це простір для тих, хто шукає відповіді та цінує автентичні голоси. Продовжуйте дослідження.
                    </p>
                    
                    <div className="pt-12 flex flex-col items-center gap-8">

                        <Link href="/">
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.5em] hover:bg-transparent hover:text-primary transition-colors">
                                Повернутися на головну
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <BlogSearchSheet categories={data?.settings?.categories || []} />
            <Footer />
        </div>
    );
}

export default function BlogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-4 py-12 space-y-12">
                    <Skeleton className="w-full h-24 max-w-2xl" />
                    <Skeleton className="w-full aspect-[21/9] rounded-2xl" />
                </div>
                <Footer />
            </div>
        }>
            <BlogPageInner />
        </Suspense>
    );
}
