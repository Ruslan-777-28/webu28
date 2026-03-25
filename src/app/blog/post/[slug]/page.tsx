'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Post, BlogSettings } from '@/lib/types';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { LikeButton } from '@/components/social/like-button';
import { CommentButton } from '@/components/social/comment-button';
import { FavoriteButton } from '@/components/social/favorite-button';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setError("Post slug is missing.");
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const postsRef = collection(db, "posts");
        
        // First, try to find a blog post ('blog' contentType)
        const blogQuery = query(postsRef, where("slug", "==", slug), where("status", "==", "published"));
        const blogSnapshot = await getDocs(blogQuery);

        if (!blogSnapshot.empty) {
          const postDoc = blogSnapshot.docs[0];
          setPost({ id: postDoc.id, ...postDoc.data() } as Post);
        } else {
           // If not found, try to find a user post ('post' contentType)
           const userPostQuery = query(postsRef, where("slug", "==", slug), where("sitePublished", "==", true));
           const userPostSnapshot = await getDocs(userPostQuery);

           if(!userPostSnapshot.empty) {
                const postDoc = userPostSnapshot.docs[0];
                setPost({ id: postDoc.id, ...postDoc.data() } as Post);
           } else {
               setError("Post not found or not published.");
           }
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to fetch post.");
      }
    };
    
    const settingsRef = doc(db, 'blogSettings', 'main');
    const unsubSettings = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as BlogSettings);
      }
    });

    fetchPost().finally(() => setIsLoading(false));

    return () => {
        unsubSettings();
    }
  }, [slug]);

  const getCategoryPath = (categoryId?: string, subcategoryId?: string) => {
    if (!categoryId || !settings) return 'N/A';
    const category = settings.categories.find(c => c.id === categoryId);
    if (!category) return categoryId;
    if (subcategoryId) {
      const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
      return subcategory ? `${category.name} / ${subcategory.name}` : `${category.name} / ${subcategoryId}`;
    }
    return category.name;
  };
  
   const readingTime = useMemo(() => {
    if (!post?.content) return 0;
    const wordsPerMinute = 200;
    const wordCount = post.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }, [post?.content]);


  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="w-full aspect-video rounded-lg mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 text-center">
            <h1 className="text-2xl font-bold text-destructive">{error}</h1>
            <p className="text-muted-foreground mt-2">The requested post could not be found.</p>
            <Link href="/blog" className="mt-6 inline-block">
                <Button variant="outline">Back to Blog</Button>
            </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-12 md:py-20">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="mb-4">
              <Badge variant="outline">{getCategoryPath(post.categoryId, post.subcategoryId)}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <Link href={`/profile/${post.authorId}`} className="flex items-center gap-3 group">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                        <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground group-hover:underline">{post.authorName}</p>
                        <p>Author</p>
                    </div>
                </Link>
                 <div className="flex items-center gap-2 md:gap-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {(post.publishedAt || post.sitePublishedAt || post.createdAt)?.toDate().toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {readingTime} min read</span>
                    <div className="h-4 w-px bg-muted mx-1" />
                    <div className="flex items-center gap-1">
                        <LikeButton postId={post.id} />
                        <CommentButton postId={post.id} showText />
                        <FavoriteButton targetId={post.id} type="post" />
                    </div>
                 </div>
            </div>
          </header>
          
          {post.coverImageUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
              <Image src={post.coverImageUrl} alt={post.coverAlt || post.title} layout="fill" objectFit="cover" />
            </div>
          )}

          <div className="prose prose-stone dark:prose-invert max-w-none prose-lg">
             {post.content?.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </div>

        </article>
      </main>
      <Footer />
    </div>
  );
}
