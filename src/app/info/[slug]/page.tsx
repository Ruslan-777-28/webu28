
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface PageData {
    title: string;
    content: string;
    seoTitle?: string;
    seoDescription?: string;
}

export default function InfoPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!slug) return;
        
        const docRef = doc(db, 'siteInfoPages', slug);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setPageData(docSnap.data() as PageData);
                setError(null);
            } else {
                setError('Page not found.');
            }
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching page data:", err);
            setError('Failed to load page content.');
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [slug]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <Card className="max-w-4xl mx-auto">
                    <CardContent className="p-6 md:p-10">
                        {isLoading ? (
                            <div className="space-y-6">
                                <Skeleton className="h-12 w-3/4" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-2/3" />
                                <Skeleton className="h-48 w-full" />
                            </div>
                        ) : error ? (
                             <div className="text-center py-16 text-destructive">
                                <h1 className="text-2xl font-bold">{error}</h1>
                            </div>
                        ) : pageData ? (
                            <>
                                <h1 className="text-4xl md:text-5xl font-bold mb-8">
                                    {pageData.title}
                                </h1>
                                <div className="prose prose-stone dark:prose-invert max-w-none">
                                    {pageData.content.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
