'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Product, UserProfile } from '@/lib/types';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ShoppingBag, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthorStorePage() {
    const params = useParams();
    const router = useRouter();
    const authorId = params?.id as string;
    
    const [products, setProducts] = useState<Product[]>([]);
    const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authorId) return;

        const authorRef = doc(db, 'users', authorId);
        getDoc(authorRef).then(docSnap => {
            if (docSnap.exists()) {
                setAuthorProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
            }
        });

        const q = query(
            collection(db, 'products'),
            where('authorId', '==', authorId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching products: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [authorId]);

    const handleBack = () => {
        router.push(`/profile/${authorId}`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Skeleton className="h-10 w-64 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/10">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Button variant="ghost" className="mb-2 -ml-2 text-muted-foreground gap-2" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                            Назад до профілю
                        </Button>
                        <h1 className="text-3xl font-bold">{authorProfile?.displayName || authorProfile?.name || 'Автор'} — Store</h1>
                    </div>
                </div>

                {products.length === 0 ? (
                    <Card className="text-center py-16 border-dashed bg-background/50">
                        <CardContent>
                            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                            <h2 className="text-xl font-semibold mb-2">Наразі товарів немає</h2>
                            <p className="text-muted-foreground">Автор ще не додав жодних товарів або послуг до свого магазину.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <Card key={product.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-all border-muted/40 bg-background/80 backdrop-blur-sm group">
                                {product.imageUrl && (
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image 
                                            src={product.imageUrl} 
                                            alt={product.title} 
                                            layout="fill" 
                                            objectFit="cover" 
                                            className="group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <CardHeader className="p-5">
                                    <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                                    <CardDescription className="font-bold text-accent">
                                        {product.price} {product.currency}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-5 pt-0 flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                        {product.description}
                                    </p>
                                </CardContent>
                                <div className="p-5 pt-0 mt-auto">
                                    <Button className="w-full gap-2 rounded-xl" variant="outline" disabled>
                                        <ExternalLink className="h-4 w-4" />
                                        Купити в ConnectU App
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground mt-2 uppercase tracking-tight">
                                        Купівля товарів тимчасово доступна тільки через додаток
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
