'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { FaqItem } from "@/lib/types";
import { FaqTable } from "./_components/faq-table";

export default function FaqAdminPage() {
    const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "faqItems"), orderBy("sortOrder", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as FaqItem));
            setFaqItems(fetchedItems);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching FAQ items:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">FAQ Management</h1>
                    <p className="text-muted-foreground">Create, edit, and manage all FAQ items.</p>
                </div>
            </div>
            <FaqTable items={faqItems} isLoading={isLoading} />
        </div>
    );
}
