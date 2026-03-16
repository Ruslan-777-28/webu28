'use client';

import { Button } from "@/components/ui/button";
import { AllArticlesTable } from "../_components/all-articles-table";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AllArticlesPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("contentType", "==", "blog"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as BlogPost));
            setPosts(fetchedPosts);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching posts:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
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
            <AllArticlesTable posts={posts} isLoading={isLoading} />
        </div>
    );
}
