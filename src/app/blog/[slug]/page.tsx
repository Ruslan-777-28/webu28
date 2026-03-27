'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar, Eye, ArrowLeft, ArrowRight, BookOpen
} from 'lucide-react';
import { LikeButton } from '@/components/social/like-button';
import { CommentButton } from '@/components/social/comment-button';
import { FavoriteButton } from '@/components/social/favorite-button';
import { FriendButton } from '@/components/friend-button';
import { ShareModal } from '@/components/share-modal';
import { Share2 } from 'lucide-react';
import { getBlog2ArticleData, ArticleData } from '@/lib/blog2/get-article-data';
import { BLOG_IMAGE_FALLBACK } from '@/lib/blog2/demo-blog2-data';

function formatDate(ts: any): string {
    if (!ts) return '';
    try {
        const d = ts?.toDate?.() ?? new Date(ts);
        return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return '';
    }
}

function readingTime(content?: string): number {
    return Math.max(1, Math.ceil((content?.split(' ').length || 0) / 200));
}

export default function BlogArticlePage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [data, setData] = useState<ArticleData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) { setIsLoading(false); setNotFound(true); return; }
        getBlog2ArticleData(slug).then(result => {
            setData(result);
            setIsLoading(false);
            if (!result.post) setNotFound(true);
        });
    }, [slug]);

    // Increment view count via existing API
    useEffect(() => {
        if (!data?.post?.id) return;
        const key = `blog2_viewed_${data.post.id}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
        fetch('/api/blog/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: data.post.id }),
        }).catch(() => {});
    }, [data?.post?.id]);

    // ── Loading state ──────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-4 py-20 max-w-3xl space-y-8">
                    <Skeleton className="h-12 w-2/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="w-full aspect-[21/9] rounded-2xl" />
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ── Not found ──────────────────────────────────────────────────────────────
    if (notFound || !data?.post) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-4 py-40 text-center space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Матеріал не знайдено</p>
                    <h1 className="text-4xl font-black tracking-tighter">404</h1>
                    <Link href="/blog">
                        <Button variant="outline" className="rounded-full px-10 font-black uppercase tracking-widest text-[10px]">
                            Назад до LECTOR
                        </Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const { post, author, relatedPosts, moreFromAuthor, settings } = data;

    const categoryName = settings?.categories?.find(c => c.id === post.categoryId)?.name ?? '';
    const subcategoryName = (() => {
        const cat = settings?.categories?.find(c => c.id === post.categoryId);
        return cat?.subcategories?.find(s => s.id === post.subcategoryId)?.name ?? '';
    })();
    const pubDate = formatDate(post.sitePublishedAt || post.publishedAt || post.createdAt);
    const mins = readingTime(post.content);

    // ── Article page ───────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-background text-foreground font-sans tracking-tight">
            <Navigation />

            {/* Back link */}
            <div className="container mx-auto px-4 md:px-6 pt-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" /> LECTOR Editorial
                </Link>
            </div>

            <article>

                {/* ── HERO HEADER ───────────────────────────────────────────── */}
                <header className="container mx-auto px-4 md:px-6 pt-12 pb-16 max-w-4xl space-y-10">

                    {/* Taxonomy line */}
                    <div className="flex items-center gap-3">
                        {categoryName && (
                            <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-md">
                                {categoryName}
                            </Badge>
                        )}
                        {subcategoryName && (
                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                {subcategoryName}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter">
                        {post.title}
                    </h1>

                    {/* Excerpt / dek */}
                    {(post.excerpt || post.content) && (
                        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl italic border-l-2 border-primary/20 pl-6 py-2">
                            {post.excerpt || post.content!.substring(0, 200) + '…'}
                        </p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border/40">
                        {/* Author */}
                        <Link
                            href={author?.uid ? `/profile/${author.uid}` : '#'}
                            className="flex items-center gap-3 group"
                        >
                            <Avatar className="h-10 w-10 border border-primary/10 transition-transform group-hover:scale-110">
                                <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                                <AvatarFallback className="bg-primary/5 text-[10px] font-bold">
                                    {post.authorName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs font-black group-hover:text-primary transition-colors">{post.authorName}</p>
                                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Автор</p>
                            </div>
                        </Link>

                        <div className="h-6 w-px bg-border/40" />

                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                            {pubDate && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" /> {pubDate}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3 h-3" /> {mins} хв
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Eye className="w-3 h-3" /> {post.views || 0}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 ml-auto">
                            <LikeButton postId={post.id} className="h-7 px-2" />
                            <CommentButton postId={post.id} className="h-7 px-2 hover:bg-transparent" />
                            <FavoriteButton targetId={post.id} type="post" className="h-7 w-7" />
                            <ShareModal 
                                title={post.title}
                                text={post.excerpt}
                                url={typeof window !== 'undefined' ? window.location.href : ''}
                                itemType="post"
                                itemId={post.slug}
                                trigger={
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                }
                            />
                        </div>

                    </div>
                </header>

                {/* ── COVER IMAGE ───────────────────────────────────────────── */}
                {post.coverImageUrl && (
                    <div className="container mx-auto px-4 md:px-6 pb-16 max-w-5xl">
                        <div className="relative w-full aspect-[21/9] overflow-hidden rounded-2xl border border-border/30 shadow-2xl">
                            <Image
                                src={post.coverImageUrl}
                                alt={post.coverAlt || post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* ── READING BODY ──────────────────────────────────────────── */}
                <div className="container mx-auto px-4 md:px-6 pb-24">
                    <div className="max-w-2xl mx-auto">
                        {post.content ? (
                            <div
                                className="prose prose-lg prose-zinc dark:prose-invert max-w-none
                                    prose-headings:font-black prose-headings:tracking-tighter
                                    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                                    prose-p:leading-relaxed prose-p:text-base prose-p:text-foreground/90
                                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                    prose-strong:font-black prose-blockquote:border-l-primary
                                    prose-blockquote:not-italic prose-blockquote:font-light prose-blockquote:text-muted-foreground
                                    prose-img:rounded-xl prose-img:shadow-lg"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        ) : (
                            <p className="text-muted-foreground italic text-center py-12 text-sm">
                                Повний текст матеріалу недоступний у цьому перегляді.
                            </p>
                        )}
                    </div>
                </div>

            </article>

            {/* ── AUTHOR BLOCK ──────────────────────────────────────────────── */}
            <section className="border-t border-border/30 bg-muted/20">
                <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
                    <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                        <Link href={author?.uid ? `/profile/${author.uid}` : '#'} className="group flex-shrink-0">
                            <Avatar className="h-20 w-20 border-2 border-border/30 group-hover:border-primary/30 transition-colors ring-4 ring-border/10">
                                <AvatarImage src={author?.avatarUrl || post.authorAvatarUrl || BLOG_IMAGE_FALLBACK.AVATAR} alt={post.authorName} />
                                <AvatarFallback className="bg-primary/5 text-2xl font-black">
                                    {post.authorName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className="flex-grow space-y-4">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-primary mb-1">Автор матеріалу</p>
                                <Link href={author?.uid ? `/profile/${author.uid}` : '#'}>
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter hover:text-primary transition-colors">
                                        {author?.displayName || author?.name || post.authorName}
                                    </h3>
                                </Link>
                            </div>
                            {(author?.shortBio || author?.bio) && (
                                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-lg italic">
                                    {author.shortBio || author.bio}
                                </p>
                            )}
                            <div className="flex items-center gap-3 pt-2">
                                {author?.uid && (
                                    <Link href={`/profile/${author.uid}`}>
                                        <Button variant="outline" size="sm" className="rounded-full text-[9px] font-black uppercase tracking-widest px-6 hover:bg-foreground hover:text-background border-foreground/20 transition-all">
                                            Профіль автора <ArrowRight className="ml-1.5 w-3 h-3" />
                                        </Button>
                                    </Link>
                                )}
                                {author?.uid && (
                                    <FriendButton 
                                        targetProfile={author}
                                        className="h-8 rounded-full px-6 text-[9px] font-black uppercase tracking-widest"
                                    />
                                )}
                                {moreFromAuthor.length > 0 && (
                                    <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
                                        {moreFromAuthor.length} матеріалів ще
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MORE FROM AUTHOR ──────────────────────────────────────────── */}
            {moreFromAuthor.length > 0 && (
                <section className="border-t border-border/20">
                    <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-1">Голос Автора</p>
                                <h2 className="text-2xl font-black tracking-tighter">
                                    Ще від {author?.displayName || author?.name || post.authorName}
                                </h2>
                            </div>
                            {author?.uid && (
                                <Link href={`/profile/${author.uid}`} className="hidden sm:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                                    Всі матеріали <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {moreFromAuthor.map(p => (
                                <Link key={p.id} href={`/blog/${p.slug}`} className="group space-y-4">
                                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border/30 group-hover:border-primary/20 transition-colors">
                                        <Image
                                            src={p.coverImageUrl || BLOG_IMAGE_FALLBACK.THUMB}
                                            alt={p.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <h4 className="text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {p.title}
                                    </h4>
                                    {p.excerpt && (
                                        <p className="text-[11px] text-muted-foreground line-clamp-2 font-light">{p.excerpt}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── RELATED ARTICLES ──────────────────────────────────────────── */}
            {relatedPosts.length > 0 && (
                <section className="border-t border-border/20 bg-muted/10">
                    <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl">
                        <div className="mb-10">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-1">
                                {subcategoryName || categoryName}
                            </p>
                            <h2 className="text-2xl font-black tracking-tighter">Суміжні матеріали</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedPosts.map(p => (
                                <Link key={p.id} href={`/blog/${p.slug}`} className="group space-y-3">
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/30 group-hover:border-primary/20 transition-colors">
                                        <Image
                                            src={p.coverImageUrl || BLOG_IMAGE_FALLBACK.THUMB}
                                            alt={p.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                            {p.authorName}
                                        </p>
                                        <h4 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {p.title}
                                        </h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── SOFT CTA LAYER ────────────────────────────────────────────── */}
            <section className="border-t border-border/30">
                <div className="container mx-auto px-4 md:px-6 py-20 max-w-3xl text-center space-y-8">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-primary mb-4">Продовжити</p>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Куди далі?</h2>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link href="/blog">
                            <Button variant="outline" className="rounded-full px-8 py-6 font-black uppercase tracking-widest text-[9px] hover:bg-foreground hover:text-background border-2 transition-all">
                                Вся стрічка LECTOR
                            </Button>
                        </Link>
                        {author?.uid && (
                            <Link href={`/profile/${author.uid}`}>
                                <Button variant="ghost" className="rounded-full px-8 py-6 font-black uppercase tracking-widest text-[9px] hover:text-primary transition-colors">
                                    Профіль {author.displayName || author.name || post.authorName}
                                </Button>
                            </Link>
                        )}
                        {relatedPosts[0] && (
                            <Link href={`/blog/${relatedPosts[0].slug}`}>
                                <Button variant="ghost" className="rounded-full px-8 py-6 font-black uppercase tracking-widest text-[9px] hover:text-primary transition-colors flex items-center gap-2">
                                    Наступний матеріал <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
