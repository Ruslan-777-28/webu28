'use client';
import { Navigation } from '@/components/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Clock, Calendar, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreatePostModal } from '@/components/create-post-modal';
import Footer from '@/components/layout/footer';
import type { Post, BlogSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const ArticleCard = ({ post, categoryName, subcategoryName, className, isFeatured = false }: { post: Post, categoryName: string, subcategoryName: string, className?: string, isFeatured?: boolean }) => (
  <Card className={cn("overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300 group relative", className)}>
    <Link href={`/blog/post/${post.slug ?? '#'}`} className="absolute inset-0 z-10" aria-label={post.title} />
    <div className="relative w-full">
      <Image 
        src={post.coverImageUrl || "https://picsum.photos/seed/placeholder/800/450"} 
        alt={post.title} 
        width={isFeatured ? 800 : 400} 
        height={isFeatured ? 450 : 225} 
        className="w-full object-cover aspect-video" 
      />
    </div>
    <CardContent className="p-4 flex flex-col flex-grow">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{subcategoryName ? `${categoryName} / ${subcategoryName}`: categoryName}</Badge>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishedAt?.toDate().toLocaleDateString() || post.createdAt?.toDate().toLocaleDateString()}</span>
      </div>
      <h3 className={cn("font-bold mb-2 text-card-foreground leading-tight group-hover:underline", isFeatured ? "text-2xl" : "text-xl")}>{post.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <Link href={`/profile/${post.authorId}`} className="relative z-20 flex items-center gap-2 group/author">
            <Avatar className="h-6 w-6">
                <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="group-hover/author:underline">{post.authorName}</span>
        </Link>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.ceil((post.content?.split(' ').length || 0) / 200)} хв</span>
      </div>
    </CardContent>
  </Card>
);

const SmallArticleCard = ({ post, categoryName }: { post: Post, categoryName: string }) => (
    <Card className="overflow-hidden flex items-center h-full shadow-md hover:shadow-xl transition-shadow duration-300 relative group">
        <Link href={`/blog/post/${post.slug ?? '#'}`} className="absolute inset-0 z-10" aria-label={post.title} />
        <div className="relative w-1/3">
            <Image src={post.coverImageUrl || "https://picsum.photos/seed/placeholder/150/100"} alt={post.title} width={150} height={100} className="w-full h-full object-cover aspect-video"/>
        </div>
        <CardContent className="p-3 w-2/3">
            <Badge variant="outline" className="text-xs mb-1">{categoryName}</Badge>
            <h4 className="font-bold text-sm mb-1 leading-tight line-clamp-2 group-hover:underline">{post.title}</h4>
            <Link href={`/profile/${post.authorId}`} className="relative z-20 flex items-center gap-2 text-xs text-muted-foreground mt-2 group/author">
                <Avatar className="h-5 w-5">
                    <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                    <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="group-hover/author:underline">{post.authorName}</span>
            </Link>
        </CardContent>
    </Card>
);

export default function BlogPage() {
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostModalOpen, setPostModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const settingsRef = doc(db, 'blogSettings', 'main');
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
        if(docSnap.exists()){
            setSettings(docSnap.data() as BlogSettings);
        }
    });

    let blogPosts: Post[] = [];
    let userPosts: Post[] = [];
    let blogLoaded = false;
    let userLoaded = false;

    const combineAndSetPosts = () => {
        if (!blogLoaded || !userLoaded) return;

        const allPosts = [...blogPosts, ...userPosts];
        const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());
        
        uniquePosts.sort((a, b) => {
            const dateA = (a.sitePublishedAt || a.publishedAt || a.createdAt)?.toDate() || new Date(0);
            const dateB = (b.sitePublishedAt || b.publishedAt || b.createdAt)?.toDate() || new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

        setPosts(uniquePosts);
        setIsLoading(false);
    };

    const blogPostsQuery = query(
        collection(db, "posts"), 
        where("contentType", "==", "blog"),
        where("status", "==", "published")
    );
    
    const unsubBlogPosts = onSnapshot(blogPostsQuery, (snapshot) => {
        blogPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        blogLoaded = true;
        combineAndSetPosts();
    }, (error) => {
        console.error("Error fetching blog posts:", error);
        blogLoaded = true;
        combineAndSetPosts();
    });

    const userPostsQuery = query(
        collection(db, "posts"), 
        where("contentType", "==", "post"),
        where("sitePublished", "==", true)
    );

    const unsubUserPosts = onSnapshot(userPostsQuery, (snapshot) => {
        userPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        userLoaded = true;
        combineAndSetPosts();
    }, (error) => {
        console.error("Error fetching user posts:", error);
        userLoaded = true;
        combineAndSetPosts();
    });

    return () => {
      unsubSettings();
      unsubBlogPosts();
      unsubUserPosts();
    };
  }, []);
  
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all' || !settings) return [];
    const category = settings.categories.find(c => c.id === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory, settings]);

  useEffect(() => {
    setSelectedSubcategory('all');
  }, [selectedCategory]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
        const categoryMatch = selectedCategory === 'all' || post.categoryId === selectedCategory;
        const subcategoryMatch = selectedCategory === 'all' || selectedSubcategory === 'all' || post.subcategoryId === selectedSubcategory;
        const searchMatch = searchTerm === '' || post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && subcategoryMatch && searchMatch;
    });
  }, [posts, selectedCategory, selectedSubcategory, searchTerm]);

  const getCategoryName = (categoryId: string) => settings?.categories.find(c => c.id === categoryId)?.name || categoryId;
  const getSubcategoryName = (categoryId: string, subcategoryId: string) => {
      const category = settings?.categories.find(c => c.id === categoryId);
      return category?.subcategories?.find(s => s.id === subcategoryId)?.name || subcategoryId;
  }

  if (isLoading) {
    return (
        <div className="flex flex-col w-full min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 md:px-6 py-6 flex-grow">
                <Skeleton className="h-48 w-full mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
            </div>
            <Footer />
        </div>
    );
  }

  const featuredPost = posts[0];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 md:px-6 py-6 flex-grow">

        <section className="text-center py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">{settings?.blogPageTitle || 'Блог'}</h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                    {settings?.blogPageSubtitle}
                </p>
            </div>
        </section>

        {settings?.showFeaturedSection && featuredPost && (
             <section className="my-12">
                <h2 className="text-3xl font-bold mb-6 text-center md:text-left">{settings.featuredSectionTitle || 'Рекомендоване'}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <ArticleCard 
                        post={featuredPost} 
                        categoryName={getCategoryName(featuredPost.categoryId)}
                        subcategoryName={featuredPost.subcategoryId ? getSubcategoryName(featuredPost.categoryId, featuredPost.subcategoryId) : ''}
                        isFeatured={true} 
                    />
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        {posts.slice(1, 4).map(post => (
                           <SmallArticleCard 
                                key={post.id}
                                post={post}
                                categoryName={getCategoryName(post.categoryId)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        )}

        <section className="my-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b pb-4 sticky top-16 bg-background/95 backdrop-blur-sm z-10 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="relative w-full md:w-auto md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Пошук по статтях..." 
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Категорія" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Всі категорії</SelectItem>
                            {settings?.categories.filter(cat => cat.id && cat.name).map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory} disabled={availableSubcategories.length === 0}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Підкатегорія" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Всі підкатегорії</SelectItem>
                             {availableSubcategories.filter(sub => sub.id && sub.name).map(sub => (
                                <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {filteredPosts.map(post => (
                        <ArticleCard 
                            key={post.id} 
                            post={post} 
                            categoryName={getCategoryName(post.categoryId)}
                            subcategoryName={post.subcategoryId ? getSubcategoryName(post.categoryId, post.subcategoryId) : ''}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <XCircle className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold">Статей не знайдено</h3>
                    <p>Спробуйте змінити фільтри або пошуковий запит.</p>
                </div>
            )}
            
            {/* Pagination could go here */}
        </section>

        <section className="my-20 text-center">
            <Dialog open={isPostModalOpen} onOpenChange={setPostModalOpen}>
                <DialogTrigger asChild>
                    <Button size="lg">хочу опублікувати контент</Button>
                </DialogTrigger>
                <CreatePostModal setOpen={setPostModalOpen} />
            </Dialog>
        </section>

        {settings?.showSubscribeBlock && (
            <section className="my-20 bg-muted/50 rounded-lg p-8 md:p-12">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-2">{settings.subscribeTitle || 'Отримуйте нові матеріали першими'}</h2>
                    <p className="text-muted-foreground mb-6">{settings.subscribeDescription || 'Практичні статті, корисні добірки та нові ідеї без зайвого шуму.'}</p>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                        <Input type="email" placeholder="Ваш email" className="bg-background" />
                        <Button>Підписатися</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Ми поважаємо вашу приватність і не надсилаємо спам.</p>
                </div>
            </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
