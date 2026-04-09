'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from '@/hooks/use-auth';
import { useFavorites } from '@/hooks/use-favorites';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { ProfileCard } from '@/components/social/profile-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import { User, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FavoritesProfilesPage() {
    const { user, loading: authLoading } = useUser();
    const { userFavorites, loading: favsLoading } = useFavorites(undefined, 'user');
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            if (userFavorites.length === 0) {
                setProfiles([]);
                setLoadingProfiles(false);
                return;
            }

            try {
                const fetched = await Promise.all(
                    userFavorites.map(async (fav) => {
                        const docRef = doc(db, 'users', fav.targetId);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
                        }
                        return null;
                    })
                );
                setProfiles(fetched.filter((p): p is UserProfile => p !== null));
            } catch (err) {
                console.error('Error fetching favorite profiles:', err);
            } finally {
                setLoadingProfiles(false);
            }
        };

        if (!favsLoading) {
            fetchProfiles();
        }
    }, [userFavorites, favsLoading]);

    const isLoading = authLoading || favsLoading || loadingProfiles;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navigation />
            <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Bookmark className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Мої фаворити</h1>
                        <p className="text-muted-foreground mt-1">Експерти та профілі, які ви зберегли.</p>
                    </div>
                </div>

                {!user && !authLoading ? (
                    <div className="text-center py-20 bg-muted/5 rounded-2xl border border-dashed border-muted/40">
                        <User className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h2 className="text-xl font-semibold">Увійдіть, щоб переглянути обране</h2>
                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Ваш список фаворитів доступний лише після авторизації.</p>
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-[320px] rounded-xl" />
                        ))}
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="text-center py-20 bg-muted/5 rounded-2xl border border-dashed border-muted/40">
                        <Bookmark className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h2 className="text-xl font-semibold">Список порожній</h2>
                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Ви ще не додали жодного профілю до фаворитів.</p>
                        <Button className="mt-6 rounded-full px-8 font-bold" asChild>
                            <Link href="/blog">Перейти до блогу</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {profiles.map((profile) => (
                            <ProfileCard key={profile.uid} profile={profile} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
