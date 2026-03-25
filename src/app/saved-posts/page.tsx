'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/client';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useUser } from '@/hooks/use-auth';
import { useFavorites } from '@/hooks/use-favorites';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { ArticleCard } from '@/components/blog/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Post, BlogSettings } from '@/lib/types';
import { Bookmark, FileText, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SavedPostsPage() {
    const { user, loading: authLoading } = useUser();
    const { userFavorites, loading: favsLoading } = useFavorites(undefined, 'post');
    const [settings, setSettings] = useState<BlogSettings | null>(null);
    const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [loadingFavPosts, setLoadingFavPosts] = useState(true);
    const [loadingMyPosts, setLoadingMyPosts] = useState(true);

    // Fetch settings
    useEffect(() => {
        const settingsRef = doc(db, 'blogSettings', 'main');
        const unsub = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data() as BlogSettings);
            }
        });
        return () => unsub();
    }, []);

    // Fetch favorited posts
    useEffect(() => {
        const fetchFavoritePosts = async () => {
            if (userFavorites.length === 0) {
                setFavoritePosts([]);
                setLoadingFavPosts(false);
                return;
            }

            try {
                const fetched = await Promise.all(
                    userFavorites.map(async (fav) => {
                        const docRef = doc(db, 'posts', fav.targetId);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            return { id: docSnap.id, ...docSnap.data() } as Post;
                        }
                        return null;
                    })
                );
                setFavoritePosts(fetched.filter((p): p is Post => p !== null));
            } catch (err) {
                console.error('Error fetching saved posts:', err);
            } finally {
                setLoadingFavPosts(false);
            }
        };

        if (!favsLoading) {
            fetchFavoritePosts();
        }
    }, [userFavorites, favsLoading]);

    // Fetch authored posts
    useEffect(() => {
        if (!user) {
            setMyPosts([]);
            setLoadingMyPosts(false);
            return;
        }

        const q = query(
            collection(db, 'posts'),
            where('authorId', '==', user.uid),
            where('status', '==', 'published')
        );

        const unsub = onSnapshot(q, (snapshot) => {
            setMyPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
            setLoadingMyPosts(false);
        }, (err) => {
            console.error('Error fetching my posts:', err);
            setLoadingMyPosts(false);
        });

        return () => unsub();
    }, [user?.uid]);

    const getCategoryNames = (post: Post) => {
        const category = settings?.categories?.find(c => c.id === post.categoryId);
        const subcategory = category?.subcategories?.find(s => s.id === post.subcategoryId);
        return {
            categoryName: category?.name || '...',
            subcategoryName: subcategory?.name || '...'
        };
    };

    const isLoading = authLoading || (favsLoading && loadingFavPosts) || loadingMyPosts;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navigation />
            <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Публікації</h1>
                        <p className="text-muted-foreground mt-1">Керуйте своїми постами та збереженим контентом.</p>
                    </div>
                </div>

                {!user && !authLoading ? (
                    <div className="text-center py-20 bg-muted/5 rounded-2xl border border-dashed border-muted/40">
                        <User className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h2 className="text-xl font-semibold">Увійдіть, щоб переглянути публікації</h2>
                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Ваш особистий кабінет доступний лише після авторизації.</p>
                    </div>
                ) : (
                    <Tabs defaultValue="my-posts" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
                            <TabsTrigger value="my-posts" className="font-bold">Мої публікації</TabsTrigger>
                            <TabsTrigger value="saved" className="font-bold">Збережені</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="my-posts" className="mt-0">
                            {loadingMyPosts ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-[400px] rounded-xl" />
                                    ))}
                                </div>
                            ) : myPosts.length === 0 ? (
                                <div className="text-center py-20 bg-muted/5 rounded-2xl border border-dashed border-muted/40 font-medium">
                                    Ви ще не опублікували жодної статті.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myPosts.map((post) => {
                                        const { categoryName, subcategoryName } = getCategoryNames(post);
                                        return (
                                            <ArticleCard 
                                                key={post.id} 
                                                post={post} 
                                                categoryName={categoryName}
                                                subcategoryName={subcategoryName}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                        
                        <TabsContent value="saved" className="mt-0">
                            {loadingFavPosts ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-[400px] rounded-xl" />
                                    ))}
                                </div>
                            ) : favoritePosts.length === 0 ? (
                                <div className="text-center py-20 bg-muted/5 rounded-2xl border border-dashed border-muted/40 font-medium">
                                    У вас немає збережених публікацій.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favoritePosts.map((post) => {
                                        const { categoryName, subcategoryName } = getCategoryNames(post);
                                        return (
                                            <ArticleCard 
                                                key={post.id} 
                                                post={post} 
                                                categoryName={categoryName}
                                                subcategoryName={subcategoryName}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </main>
            <Footer />
        </div>
    );
}
