'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, ArrowRight, Share2 } from 'lucide-react';
import type { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LikeButton } from '@/components/social/like-button';
import { CommentButton } from '@/components/social/comment-button';
import { FavoriteButton } from '@/components/social/favorite-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { DemoPost, BLOG_IMAGE_FALLBACK } from '@/lib/blog2/demo-blog2-data';
import { ShareModal } from '@/components/share-modal';
import { usePostSocial } from '@/hooks/use-post-social';
import { useFavorites } from '@/hooks/use-favorites';

// ─── Internal routing constant ─────────────────────────────────────────────────
// All blog-2 article links must use this base path.
// Old /blog/post/ routes are preserved and untouched.
const BLOG2_ARTICLE_BASE = '/blog';

// ─── Shared helpers ────────────────────────────────────────────────────────────
export function DemoBadge() {
    return (
        <Badge className="bg-primary/90 text-primary-foreground text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border-none shadow-lg">
            DEMO
        </Badge>
    );
}

// ─── EditorialHeader ──────────────────────────────────────────────────────────
export function EditorialHeader({ post, categoryName }: { post: Post | DemoPost, categoryName?: string }) {
    const isDemo = 'isDemo' in post && post.isDemo;
    const { likesCount, commentsCount } = usePostSocial(post.id);
    const { count: favoritesCount } = useFavorites(post.id, 'post');

    return (
        <section className="space-y-12 mb-32 animate-in fade-in slide-in-from-bottom-6 duration-[1200ms]">
            
            {/* ── TOP: Title & Branding ── */}
            <div className="space-y-8 max-w-7xl">
                <div className="flex items-center gap-4">
                    <div className="h-px w-16 bg-primary/30" />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground whitespace-nowrap">
                        Сьогоднішній Акцент
                    </span>
                    {categoryName && (
                        <>
                            <div className="h-1.5 w-1.5 bg-primary/30 rounded-full" />
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">{categoryName}</span>
                        </>
                    )}
                    {isDemo && <DemoBadge />}
                </div>

                <Link href={`${BLOG2_ARTICLE_BASE}/${post.slug}`} className="block group">
                    <h1 className="max-w-6xl text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[0.95] text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                    </h1>
                </Link>

                {/* ── METADATA ROW ── */}
                <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-border/40">
                    <Link href={post.authorId ? `/profile/${post.authorId}` : '#'} className="flex items-center gap-4 group/author">
                        <Avatar className="h-12 w-12 border-2 border-primary/10 transition-transform group-hover/author:scale-110">
                            <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                            <AvatarFallback className="bg-primary/5 text-xs font-bold">{post.authorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tight group-hover/author:text-primary transition-colors">{post.authorName}</span>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-60">Автор Редакції LECTOR</span>
                        </div>
                    </Link>

                    <div className="hidden sm:block h-10 w-px bg-border/40" />

                    <div className="flex items-center gap-8 text-[11px] text-muted-foreground font-mono uppercase tracking-[0.15em]">
                        <span className="flex items-center gap-2 font-black text-foreground/80">
                            <Eye className="w-4 h-4 text-primary/40" /> {post.views || 0}
                        </span>
                        
                        <div className="flex items-center hover:text-primary transition-colors cursor-pointer group/stat translate-y-[1px]">
                            <LikeButton postId={post.id} className="h-auto p-0 hover:bg-transparent text-inherit font-black text-[11px]" />
                        </div>

                        <div className="flex items-center hover:text-primary transition-colors cursor-pointer group/stat translate-y-[1px]">
                            <CommentButton postId={post.id} className="h-auto p-0 hover:bg-transparent text-inherit font-black text-[11px]" />
                        </div>

                        <div className="flex items-center group/stat translate-y-[1px]">
                            <FavoriteButton targetId={post.id} type="post" className="h-auto p-0 bg-transparent border-none text-muted-foreground hover:text-primary font-black text-[11px]" />
                        </div>

                        <div className="h-1 w-1 bg-muted-foreground/30 rounded-full mx-1" />
                        
                        <span className="flex items-center gap-2 font-medium italic lowercase opacity-70 text-[11px]">
                            <Calendar className="w-4 h-4 ml-1" />
                            {(post.sitePublishedAt || post.publishedAt || post.createdAt)?.toDate?.()?.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
                        </span>
                    </div>

                    <div className="ml-auto">
                        <ShareModal 
                            title={post.title}
                            text={post.excerpt}
                            url={`${typeof window !== 'undefined' ? window.location.origin : ''}${BLOG2_ARTICLE_BASE}/${post.slug}`}
                            itemType="post"
                            itemId={post.slug}
                            trigger={
                                <button className="h-10 w-10 flex items-center justify-center rounded-full border border-border/60 hover:border-primary hover:text-primary transition-all">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* ── LOWER SPLIT: Image (2/3) + Context (1/3) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Image Area (Left ~2/3) */}
                <div className="lg:col-span-8 relative aspect-[21/10] overflow-hidden rounded-3xl group shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-border/50">
                    <Image
                        src={post.coverImageUrl || BLOG_IMAGE_FALLBACK.COVER}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Context Area (Right ~1/3) */}
                <div className="lg:col-span-4 space-y-6 lg:pt-4 border-l border-primary/5 pl-8">
                    <div className="space-y-4">
                        <p className="text-lg md:text-xl text-foreground font-light leading-relaxed italic line-clamp-[6]">
                            {post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 280) + '...' : '')}
                        </p>
                        <div className="flex flex-col gap-4 pt-4">
                            <Link href={`${BLOG2_ARTICLE_BASE}/${post.slug}`} className="group/link flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors">
                            Переглянути матеріал 
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-2" />
                            </Link>
                            <p className="text-[12px] text-muted-foreground/60 font-mono leading-none font-bold">
                                Час читання: {Math.max(1, Math.ceil((post.content?.split(' ').length || 0) / 200))} хв
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

// ─── PremiumPostCard ──────────────────────────────────────────────────────────
export function PremiumPostCard({
    post,
    categoryName,
    subcategoryName,
    variant = 'default'
}: {
    post: Post | DemoPost,
    categoryName?: string,
    subcategoryName?: string,
    variant?: 'default' | 'compact' | 'minimal'
}) {
    const isDemo = 'isDemo' in post && post.isDemo;

    // ── Minimal variant (side column cards) ──────────────────────────────────
    if (variant === 'minimal') {
        return (
            <div className="group py-6 border-b border-border/50 last:border-none">
                <div className="flex gap-6 items-start">
                    <div className="flex-grow space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-primary/70">
                                {subcategoryName ? `${categoryName} / ${subcategoryName}` : categoryName}
                            </span>
                            {isDemo && <DemoBadge />}
                        </div>
                        <Link href={`${BLOG2_ARTICLE_BASE}/${post.slug}`}>
                            <h4 className="text-lg font-bold leading-tight group-hover:text-primary transition-all line-clamp-2 italic">
                                {post.title}
                            </h4>
                        </Link>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 font-light leading-relaxed mb-2 uppercase tracking-tighter opacity-80">
                            {post.excerpt || (post.content ? post.content.substring(0, 80) + '...' : '')}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-4 w-4 border border-primary/10">
                                    <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                                    <AvatarFallback className="bg-primary/5 text-[6px] font-bold">{post.authorName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold">{post.authorName}</span>
                            </div>
                            <div className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views || 0}</span>
                            <CommentButton postId={post.id} className="h-4 px-0 hover:bg-transparent" />
                            <div className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
                            <span className="flex items-center gap-1.5 italic lowercase text-[10px] font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                {(post.sitePublishedAt || post.publishedAt || post.createdAt)?.toDate?.()?.toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border border-border/40 group-hover:border-primary/20 transition-colors">
                        <Image
                            src={post.coverImageUrl || BLOG_IMAGE_FALLBACK.THUMB}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // ── Default / compact variant ─────────────────────────────────────────────
    return (
        <Card className={cn(
            "overflow-hidden border-none shadow-none group transition-all bg-transparent",
            variant === 'default' ? "hover:bg-muted/30 p-4 rounded-2xl" : "p-0"
        )}>
            <div className={cn(
                "relative overflow-hidden rounded-xl mb-5 border border-border/50",
                variant === 'default' ? "aspect-[16/10]" : "aspect-[21/10]"
            )}>
                <Image
                    src={post.coverImageUrl || BLOG_IMAGE_FALLBACK.COVER}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    {categoryName && (
                        <Badge className="bg-black/40 backdrop-blur-md border border-white/10 text-[9px] uppercase font-bold tracking-[0.2em] rounded-md px-2 py-1">
                            {subcategoryName ? `${categoryName} / ${subcategoryName}` : categoryName}
                        </Badge>
                    )}
                    {isDemo && <DemoBadge />}
                </div>

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link href={`${BLOG2_ARTICLE_BASE}/${post.slug}`}>
                        <button className="bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
                            Читати <ArrowRight className="w-3 h-3" />
                        </button>
                    </Link>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <ShareModal 
                        title={post.title}
                        text={post.excerpt}
                        url={`${typeof window !== 'undefined' ? window.location.origin : ''}${BLOG2_ARTICLE_BASE}/${post.slug}`}
                        itemType="post"
                        itemId={post.slug}
                        trigger={
                            <button
                                className="h-8 w-8 bg-white/10 backdrop-blur-md rounded-md flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                            </button>
                        }
                    />
                </div>
            </div>

            <div className="space-y-3 px-1">
                <Link href={`${BLOG2_ARTICLE_BASE}/${post.slug}`}>
                    <h3 className={cn(
                        "font-black leading-[1.2] hover:text-primary transition-colors tracking-tight",
                        variant === 'default' ? "text-2xl" : "text-xl"
                    )}>
                        {post.title}
                    </h3>
                </Link>

                <p className="text-xs text-muted-foreground line-clamp-2 font-light leading-relaxed">
                    {post.excerpt || (post.content ? post.content.substring(0, 120) + '...' : '')}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-muted/50 mt-4">
                    <div className="flex items-center gap-4">
                        <Link href={post.authorId ? `/profile/${post.authorId}` : '#'} className="flex items-center gap-2 group/author">
                            <Avatar className="h-6 w-6 border border-primary/10 transition-transform group-hover/author:scale-110">
                                <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                                <AvatarFallback className="bg-primary/5 text-[8px] font-bold">{post.authorName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-[10px] font-bold tracking-tight text-foreground/80 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] group-hover/author:text-primary transition-colors">
                                {post.authorName}
                            </span>
                        </Link>

                        <div className="h-3 w-px bg-muted/30" />

                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono tracking-tighter uppercase whitespace-nowrap">
                            <span className="flex items-center gap-1 font-bold">
                                <Eye className="w-3.5 h-3.5" />{post.views || 0}
                            </span>
                            <CommentButton postId={post.id} className="h-5 px-0 hover:bg-transparent" />
                            <div className="h-1 w-1 bg-muted/30 rounded-full" />
                            <span className="flex items-center gap-1.5 italic lowercase font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                {(post.sitePublishedAt || post.publishedAt || post.createdAt)?.toDate?.()?.toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                        <FavoriteButton targetId={post.id} type="post" className="h-7 w-7" />
                        <LikeButton postId={post.id} className="h-7 px-1.5" />
                    </div>
                </div>
            </div>
        </Card>
    );
}

// ─── CuratedFeaturedBlock ─────────────────────────────────────────────────────
export function CuratedFeaturedBlock({
    mainPost,
    sidePosts,
    getCategoryName,
    getSubcategoryName
}: {
    mainPost: Post | DemoPost,
    sidePosts: (Post | DemoPost)[],
    getCategoryName: (id: string) => string,
    getSubcategoryName: (catId: string, subId: string) => string
}) {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-muted pt-12">
            <div className="lg:col-span-12 mb-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Редакційний Вибір</h2>
            </div>

            <div className="lg:col-span-7">
                <PremiumPostCard
                    post={mainPost}
                    categoryName={getCategoryName(mainPost.categoryId)}
                    subcategoryName={mainPost.subcategoryId ? getSubcategoryName(mainPost.categoryId, mainPost.subcategoryId) : ''}
                />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-0 divide-y divide-border/50">
                {sidePosts.map(post => (
                    <PremiumPostCard
                        key={post.id}
                        post={post}
                        categoryName={getCategoryName(post.categoryId)}
                        subcategoryName={post.subcategoryId ? getSubcategoryName(post.categoryId, post.subcategoryId) : ''}
                        variant="minimal"
                    />
                ))}

                <Link href="/blog-2" className="pt-8 group">
                    <div className="bg-primary/5 hover:bg-primary/10 transition-colors rounded-xl p-8 flex items-center justify-between border border-primary/10">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Переглянути ще</span>
                            <h5 className="text-lg font-bold">Весь архів LECTOR</h5>
                        </div>
                        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </div>
                </Link>
            </div>
        </section>
    );
}
