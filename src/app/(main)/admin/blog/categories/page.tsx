'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogSettings, BlogCategory } from "@/lib/types";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const settingsRef = doc(db, 'blogSettings', 'main');
        const unsubscribe = onSnapshot(settingsRef, (doc) => {
            if (doc.exists()) {
                const settings = doc.data() as BlogSettings;
                setCategories(settings.categories || []);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching categories:", error);
            setIsLoading(false);
        });
        
        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Link href="/admin/blog/settings">
                  <Button variant="outline">
                    Manage Categories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        This is a read-only list of blog categories. To add, edit, or remove categories, please go to the <Link href="/admin/blog/settings" className="underline">Blog Settings</Link> page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Subcategories</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={`skel-${i}`}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    </TableRow>
                                ))
                            ) : categories.length > 0 ? (
                                categories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium capitalize">{cat.name}</TableCell>
                                        <TableCell><code>{cat.id}</code></TableCell>
                                        <TableCell>{cat.subcategories?.map(s => s.name).join(', ') || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                         <div className="flex flex-col items-center gap-2">
                                            <Folder className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">No categories found.</p>
                                            <Link href="/admin/blog/settings">
                                                <Button variant="outline" size="sm">Add Categories</Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
