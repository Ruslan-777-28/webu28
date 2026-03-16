'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, BookMarked, Users, PenSquare } from "lucide-react";
import { AllArticlesTable } from "./_components/all-articles-table";
import { useEffect, useState } from "react";
import type { BlogPost, UserProfile } from "@/lib/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogAdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const postsQuery = query(collection(db, "posts"), where("contentType", "==", "blog"));
    const authorsQuery = query(collection(db, "users"), where("roles.author", "==", true));

    const unsubPosts = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
      setPosts(fetchedPosts);
      // We set loading to false here, even if authors are not loaded yet,
      // to show post data as soon as it's available.
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    });

    const unsubAuthors = onSnapshot(authorsQuery, (snapshot) => {
      const fetchedAuthors = snapshot.docs.map(doc => doc.data() as UserProfile);
      setAuthors(fetchedAuthors);
    }, (error) => {
      console.error("Error fetching authors:", error);
    });

    return () => {
      unsubPosts();
      unsubAuthors();
    };
  }, []);

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    authors: authors.length,
  };

  const statCards = [
    { title: "Total Articles", value: stats.total, icon: Newspaper },
    { title: "Published", value: stats.published, icon: BookMarked },
    { title: "Drafts", value: stats.drafts, icon: PenSquare },
    { title: "Registered Authors", value: stats.authors, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
            <AllArticlesTable posts={posts.slice(0, 5)} isLoading={isLoading} showFilters={false} />
        </CardContent>
      </Card>
    </div>
  );
}
