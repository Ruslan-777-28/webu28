'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { FaqItem } from '@/lib/types';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqPage() {
    const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const faqQuery = query(
            collection(db, 'faqItems'),
            where('isActive', '==', true),
            orderBy('sortOrder', 'asc')
        );

        const unsubscribe = onSnapshot(faqQuery, (snapshot) => {
            const fetchedFaqs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FaqItem));
            setFaqItems(fetchedFaqs);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching FAQ items: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                        Поширені запитання
                    </h1>

                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqItems.map((faq) => (
                                <AccordionItem key={faq.id} value={`item-${faq.id}`} className="bg-card/50 p-4 rounded-lg border">
                                    <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline py-2">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-base text-muted-foreground pt-4">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
