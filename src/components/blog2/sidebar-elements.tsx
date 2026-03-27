'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Users, Star, ArrowRight, Sparkles, Wind, Compass, Heart, RefreshCcw, Coins, Eye } from 'lucide-react';
import { CommentButton } from '@/components/social/comment-button';
import type { UserProfile, Post } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EMOTIONAL_NAV_ITEMS, BLOG_IMAGE_FALLBACK } from '@/lib/blog2/demo-blog2-data';
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: any } = {
    Sparkles, Wind, Compass, Heart, RefreshCcw, Coins
};

export function VoiceOfTheDay({ author, posts }: { author: UserProfile | null, posts: Post[] }) {
    if (!author) return null;

    return (
        <section className="bg-black rounded-3xl p-8 md:p-12 text-white overflow-hidden relative group border border-white/10 shadow-2xl">
            <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white/10 ring-8 ring-white/5">
                        <AvatarImage src={author.avatarUrl} alt={author.displayName || author.name} />
                        <AvatarFallback className="bg-zinc-800 text-3xl font-black">{author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-full shadow-lg border-2 border-black">
                        <Star className="w-5 h-5 text-black fill-black" />
                    </div>
                </div>
                
                <div className="flex-grow space-y-6 text-center md:text-left">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Голос Дня</span>
                        <h3 className="text-3xl md:text-5xl font-black tracking-tight">{author.displayName || author.name}</h3>
                    </div>
                    
                    <p className="text-sm md:text-lg text-white/70 italic font-light leading-relaxed max-w-2xl">
                        "{author.shortBio || author.bio || "Експерт, що допомагає знайти відповіді у найскладніших питаннях буття та розвитку."}"
                    </p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-8 py-2">
                        <div className="space-y-1">
                            <div className="text-2xl font-black leading-none tracking-tighter">12+</div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40">Матеріалів</div>
                        </div>
                        <div className="h-10 w-px bg-white/10 hidden md:block" />
                        <div className="space-y-1">
                            <div className="text-2xl font-black leading-none tracking-tighter">4.9</div>
                            <div className="text-[9px] uppercase tracking-widest text-white/40">Рейтинг</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-4 w-full md:w-auto self-center md:self-end">
                    <Link href={`/profile/${author.uid}`} className="w-full">
                        <Button className="w-full bg-white text-black hover:bg-white/90 rounded-full py-7 px-10 font-black uppercase tracking-widest text-[10px] group/btn shadow-xl">
                            Всі статті <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Author's Latest Posts Section */}
            {posts && posts.length > 0 && (
                <div className="mt-12 pt-10 border-t border-white/10 group-hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 italic">Останні думки автора</span>
                        <div className="h-px flex-grow mx-4 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {posts.slice(0, 3).map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group/post flex gap-4 items-center sm:block sm:space-y-3">
                                <div className="relative w-16 h-16 sm:w-full sm:aspect-[16/9] rounded-lg overflow-hidden border border-white/10 group-hover/post:border-primary/40 transition-colors flex-shrink-0">
                                    <Image 
                                        src={post.coverImageUrl || BLOG_IMAGE_FALLBACK.THUMB} 
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover/post:scale-110"
                                    />
                                </div>
                                <h4 className="text-xs font-bold leading-tight line-clamp-2 group-hover/post:text-primary transition-colors italic">
                                    {post.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export function EmotionalNavigation() {
    return (
        <section className="space-y-10 py-12">
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Навігація Станів</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Що вас турбує сьогодні?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EMOTIONAL_NAV_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon];
                    return (
                        <Link 
                            key={item.id} 
                            href={`/blog?query=${item.title}`} 
                            className="group relative overflow-hidden rounded-2xl p-8 h-48 flex flex-col justify-end border border-border/50 hover:border-primary/30 transition-all hover:shadow-2xl hover:bg-muted/30"
                        >
                            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all duration-500 scale-150 group-hover:scale-100">
                                {Icon && <Icon className="w-12 h-12" />}
                            </div>
                            
                            <div className="space-y-2 relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h4 className="text-xl font-black tracking-tight">{item.title}</h4>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                                    {item.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export function SidebarPosts({ title, posts }: { title: string, posts: any[] }) {
    return (
        <div className="space-y-8 p-8 bg-zinc-50 rounded-3xl border border-zinc-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-l-4 border-primary pl-4 mb-6">
                {title}
            </h3>
            <div className="space-y-10">
                {posts.map((post, idx) => (
                    <div key={post.id} className="flex gap-6 group">
                        <div className="text-3xl font-black text-zinc-200 group-hover:text-primary/10 transition-colors leading-none pt-1 tabular-nums">
                            {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-grow space-y-2">
                            <Link href={`/blog/${post.slug}`}>
                                <h4 className="font-bold text-base leading-tight hover:text-primary transition-all line-clamp-2">
                                    {post.title}
                                </h4>
                            </Link>
                            <div className="flex items-center gap-3 text-[9px] text-zinc-400 font-mono uppercase tracking-widest pt-1">
                                <Link href={post.authorId ? `/profile/${post.authorId}` : '#'} className="flex items-center gap-2 group/author">
                                    <Avatar className="h-4 w-4 border border-zinc-200 transition-transform group-hover/author:scale-110">
                                        <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                                        <AvatarFallback className="bg-zinc-100 text-[6px] font-bold">{post.authorName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-zinc-500 font-bold hover:text-primary transition-colors">{post.authorName}</span>
                                </Link>
                                <div className="h-1 w-1 bg-zinc-300 rounded-full" />
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {post.views || 0}
                                    </span>
                                    <CommentButton postId={post.id} className="h-4 px-0 hover:bg-transparent" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-200 group-hover:border-primary/20 transition-colors">
                            <Image
                                src={post.coverImageUrl || BLOG_IMAGE_FALLBACK.THUMB}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
