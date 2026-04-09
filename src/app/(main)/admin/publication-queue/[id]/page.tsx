'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Post, BlogSettings } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SubmissionReviewForm } from './_components/submission-review-form';

export default function ReviewSubmissionPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError("Submission ID is missing.");
      return;
    };

    const unsubPost = onSnapshot(doc(db, "posts", id), (docSnap) => {
        if (docSnap.exists()) {
            setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
            setError("Submission not found.");
        }
        setIsLoading(false);
    }, (err) => {
        console.error("Error fetching submission:", err);
        setError(err.message);
        setIsLoading(false);
    });

    const settingsRef = doc(db, 'blogSettings', 'main');
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
        if(docSnap.exists()){
            setSettings(docSnap.data() as BlogSettings);
        }
    });
    
    return () => {
        unsubPost();
        unsubSettings();
    };
  }, [id]);
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-1/4" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card><CardHeader><Skeleton className="h-8 w-32" /></CardHeader><CardContent className="p-6 space-y-4"><Skeleton className="h-64 w-full" /></CardContent></Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <Card><CardHeader><Skeleton className="h-8 w-32" /></CardHeader><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
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
            <div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/publication-queue">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Queue
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold mt-4">Review Submission</h1>
            </div>
      </div>
      {post ? (
        <SubmissionReviewForm 
            post={post as Post & { id: string }} 
            categories={settings?.categories || []} 
        />
      ) : (
        <p>Submission data is not available.</p>
      )}
    </div>
  );
}
