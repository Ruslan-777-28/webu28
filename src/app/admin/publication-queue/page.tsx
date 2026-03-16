'use client';

import { Button } from "@/components/ui/button";
import { SubmissionsTable } from "./_components/submissions-table";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Post, BlogSettings } from "@/lib/types";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function PublicationQueuePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [settings, setSettings] = useState<BlogSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const settingsRef = doc(db, 'blogSettings', 'main');
            
            try {
                const settingsSnap = await getDoc(settingsRef);
                if (settingsSnap.exists()) {
                    setSettings(settingsSnap.data() as BlogSettings);
                }

                const postsRef = collection(db, "posts");
                const q = query(postsRef,
                    where("contentType", "==", "post"),
                    where("allowSitePublication", "==", true),
                    where("editorialStatus", "in", ["submitted", "under_review", "revision"])
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedPosts = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as Post));
                    setPosts(fetchedPosts);
                    setIsLoading(false);
                }, (error) => {
                    console.error("Error fetching publication queue:", error);
                    setIsLoading(false);
                });
                
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching initial data:", error);
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Publication Queue</h1>
                {/* Future actions could go here */}
            </div>
            <SubmissionsTable 
                posts={posts} 
                categories={settings?.categories || []}
                isLoading={isLoading} 
            />
        </div>
    );
}
