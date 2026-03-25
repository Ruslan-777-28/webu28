'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Post } from '@/lib/types';
import { LikeButton } from '@/components/social/like-button';
import { CommentButton } from '@/components/social/comment-button';
import { FavoriteButton } from '@/components/social/favorite-button';

interface SmallArticleCardProps {
    post: Post;
    categoryName: string;
}

export const SmallArticleCard = ({ post, categoryName }: SmallArticleCardProps) => (
    <Card className="overflow-hidden flex items-stretch h-full shadow-sm hover:shadow-md transition-all duration-300 relative group bg-card/40 border-muted/10">
        <Link href={`/blog/post/${post.slug ?? '#'}`} className="absolute inset-0 z-10" aria-label={post.title} />
        <div className="relative w-1/3 overflow-hidden shrink-0">
            <Image 
                src={post.coverImageUrl || "https://picsum.photos/seed/placeholder/150/100"} 
                alt={post.title} 
                width={150} 
                height={100} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square sm:aspect-video lg:aspect-square"
            />
        </div>
        <CardContent className="p-3.5 w-2/3 flex flex-col justify-between">
            <div className="space-y-1.5">
                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-4 px-1 opacity-70">{categoryName}</Badge>
                <h4 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                </h4>
                <p className="text-[11px] text-muted-foreground/70 line-clamp-2 leading-snug mt-1">
                    {post.excerpt || (post.content ? post.content.replace(/\n+/g, ' ').substring(0, 80).trim() + (post.content.length > 80 ? '...' : '') : '')}
                </p>
            </div>
            
            <div className="flex items-center justify-between mt-3">
                <Link href={`/profile/${post.authorId}`} className="relative z-20 flex items-center gap-1.5 text-xs text-muted-foreground group/author">
                    <Avatar className="h-5 w-5 border border-muted/50">
                        <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                        <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-medium group-hover/author:underline opacity-70 truncate max-w-[80px]">
                        {post.authorName}
                    </span>
                </Link>
                
                <div className="flex items-center gap-0.5 relative z-20">
                    <LikeButton postId={post.id} className="h-6 px-1" />
                    <CommentButton postId={post.id} className="h-6 px-1" />
                    <FavoriteButton targetId={post.id} type="post" className="h-6 px-1" />
                </div>
            </div>
        </CardContent>
    </Card>
);
