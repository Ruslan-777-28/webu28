
'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";
import { PagesTable } from "./_components/pages-table";

type PageItem = {
    id: string;
    title: string;
    slug: string;
    updatedAt: any;
}

export default function InfoPagesAdminPage() {
    const [pages, setPages] = useState<PageItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "siteInfoPages"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedItems = snapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                slug: doc.data().slug,
                updatedAt: doc.data().updatedAt,
            } as PageItem));
            setPages(fetchedItems);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching pages:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Information Pages</h1>
                    <p className="text-muted-foreground">Create and manage content for static pages like "Terms" or "Privacy".</p>
                </div>
                <Link href="/admin/content/pages/edit/new">
                    <Button><PlusCircle className="mr-2 h-4 w-4" />Create New Page</Button>
                </Link>
            </div>
            <PagesTable items={pages} isLoading={isLoading} />
        </div>
    );
}
