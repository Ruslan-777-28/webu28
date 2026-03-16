'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { UserAdminView } from './_components/user-admin-view';

export default function EditUserPage() {
  const params = useParams();
  const uid = params?.uid as string;
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      setError("User ID is missing.");
      return;
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUserProfile({ uid: userSnap.id, ...userSnap.data() } as UserProfile);
            } else {
                setError("User not found.");
            }
        } catch (err: any) {
            console.error("Error fetching user data:", err);
            setError(err.message || "Failed to fetch user data.");
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData();
  }, [uid]);
  
  if (isLoading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-1/4" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card><CardHeader><Skeleton className="h-8 w-32" /></CardHeader><CardContent className="p-6 space-y-4"><Skeleton className="h-32 w-full" /></CardContent></Card>
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
                    <Link href="/admin/users">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold mt-4">Manage User</h1>
                <p className="text-muted-foreground">{userProfile?.name || userProfile?.email}</p>
            </div>
      </div>
      {userProfile ? (
        <UserAdminView userProfile={userProfile} />
      ) : (
        <p>User data is not available.</p>
      )}
    </div>
  );
}
