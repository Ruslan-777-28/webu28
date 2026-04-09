'use client';

import { Button } from "@/components/ui/button";
import { AllArticlesTable } from "../_components/all-articles-table";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Post, BlogSettings } from "@/lib/types";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AllArticlesPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [settings, setSettings] = useState<BlogSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const settingsRef = doc(db, 'blogSettings', 'main');
            const settingsSnap = await getDoc(settingsRef);
            if (settingsSnap.exists()) {
                setSettings(settingsSnap.data() as BlogSettings);
            }

            const postsRef = collection(db, "posts");
            const q = query(postsRef, where("contentType", "==", "blog"));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedPosts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Post));
                setPosts(fetchedPosts);
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching posts:", error);
                setIsLoading(false);
            });
            
            return () => unsubscribe();
        };
        
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">All Articles</h1>
                <Link href="/admin/blog/articles/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Article
                    </Button>
                </Link>
            </div>
            <AllArticlesTable 
                posts={posts} 
                categories={settings?.categories || []}
                isLoading={isLoading} 
            />
        </div>
    );
}
