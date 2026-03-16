'use client';

import { ArticleEditForm } from "../../_components/article-edit-form";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { BlogPost, BlogSettings } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError("Article ID is missing.");
      return;
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const articleRef = doc(db, "posts", id);
            const settingsRef = doc(db, 'blogSettings', 'main');

            const [articleSnap, settingsSnap] = await Promise.all([
                getDoc(articleRef),
                getDoc(settingsRef)
            ]);

            if (articleSnap.exists()) {
                setArticle({ id: articleSnap.id, ...articleSnap.data() } as BlogPost);
            } else {
                setError("Article not found.");
            }

            if (settingsSnap.exists()) {
                setSettings(settingsSnap.data() as BlogSettings);
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);
            setError(err.message || "Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData();
  }, [id]);
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-1/4" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                    <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    );
  }
  
  if (error) {
      return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Article</h1>
      </div>
      {article ? (
        <ArticleEditForm 
            initialData={article as BlogPost & { id: string }} 
            categories={settings?.categories || []}
        />
      ) : (
        <p>Article data is not available.</p>
      )}
    </div>
  );
}
