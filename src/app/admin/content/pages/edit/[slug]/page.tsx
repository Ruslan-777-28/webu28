
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PageEditForm } from '../../_components/page-edit-form';

type PageData = {
    id: string;
    title: string;
    slug: string;
    content: string;
    seoTitle?: string;
    seoDescription?: string;
}

export default function EditInfoPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isCreating = slug === 'new';

  useEffect(() => {
    if (isCreating) {
      setIsLoading(false);
      return;
    }

    if (!slug) {
      setIsLoading(false);
      setError("Page slug is missing.");
      return;
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const pageRef = doc(db, "siteInfoPages", slug);
            const pageSnap = await getDoc(pageRef);

            if (pageSnap.exists()) {
                setPage({ id: pageSnap.id, ...pageSnap.data() } as PageData);
            } else {
                setError("Page not found.");
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);
            setError(err.message || "Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData();
  }, [slug, isCreating]);
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-1/4" />
            <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-96 w-full" /></CardContent></Card>
        </div>
    );
  }
  
  if (error) {
      return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{isCreating ? 'Create New Page' : 'Edit Page'}</h1>
      </div>
      <PageEditForm initialData={page} />
    </div>
  );
}

