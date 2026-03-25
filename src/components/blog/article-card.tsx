'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Post } from '@/lib/types';
import { LikeButton } from '@/components/social/like-button';
import { CommentButton } from '@/components/social/comment-button';
import { FavoriteButton } from '@/components/social/favorite-button';

interface ArticleCardProps {
    post: Post;
    categoryName: string;
    subcategoryName: string;
    className?: string;
    isFeatured?: boolean;
}

export const ArticleCard = ({ post, categoryName, subcategoryName, className, isFeatured = false }: ArticleCardProps) => (
    <Card className={cn("overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 group relative bg-card/40 backdrop-blur-sm border-muted/20", className)}>
        <Link href={`/blog/post/${post.slug ?? '#'}`} className="absolute inset-0 z-10" aria-label={post.title} />
        <div className="relative w-full overflow-hidden">
            <Image 
                src={post.coverImageUrl || "https://picsum.photos/seed/placeholder/800/450"} 
                alt={post.title} 
                width={isFeatured ? 800 : 400} 
                height={isFeatured ? 450 : 225} 
                className="w-full object-cover aspect-video transition-transform duration-500 group-hover:scale-105" 
            />
        </div>
        <CardContent className="p-5 flex flex-col flex-grow">
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground/80 font-medium">
                <Badge variant="secondary" className="bg-muted/50 text-[10px] h-5 rounded-sm">
                    {subcategoryName ? `${categoryName} / ${subcategoryName}`: categoryName}
                </Badge>
                <span className="flex items-center gap-1.5 opacity-60">
                    <Calendar className="w-3 h-3" />
                    {(post.sitePublishedAt || post.publishedAt || post.createdAt)?.toDate().toLocaleDateString()}
                </span>
            </div>
            
            <h3 className={cn(
                "font-bold mb-3 text-card-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2", 
                isFeatured ? "text-2xl md:text-3xl" : "text-xl"
            )}>
                {post.title}
            </h3>
            
            <p className="text-sm text-muted-foreground/80 mb-6 flex-grow line-clamp-3 leading-relaxed">
                {post.excerpt || (post.content ? post.content.replace(/\n+/g, ' ').substring(0, 160).trim() + (post.content.length > 160 ? '...' : '') : '')}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-muted/10">
                <div className="flex items-center gap-4">
                    <Link href={`/profile/${post.authorId}`} className="relative z-20 flex items-center gap-2.5 group/author">
                        <Avatar className="h-6 w-6 border border-muted/50">
                            <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                            <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold group-hover/author:underline opacity-80">{post.authorName}</span>
                    </Link>
                    <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-mono">
                        <Clock className="w-3 h-3" />
                        {Math.ceil((post.content?.split(' ').length || 0) / 200)} хв
                    </span>
                </div>
                
                <div className="flex items-center gap-1 relative z-20">
                    <LikeButton postId={post.id} />
                    <CommentButton postId={post.id} />
                    <FavoriteButton targetId={post.id} type="post" />
                </div>
            </div>
        </CardContent>
    </Card>
);
