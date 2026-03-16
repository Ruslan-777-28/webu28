'use client';

import { ArticleEditForm } from "../../_components/article-edit-form";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { BlogSettings } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function NewArticlePage() {
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const settingsRef = doc(db, 'blogSettings', 'main');
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as BlogSettings);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching blog settings:", error);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Article</h1>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></CardContent></Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
            </div>
        </div>
      ) : (
        <ArticleEditForm categories={settings?.categories || []} />
      )}
    </div>
  );
}
