
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

type PageItem = {
    id: string;
    title: string;
    slug: string;
    updatedAt: any;
}

export function PagesTable({ items, isLoading }: { items: PageItem[], isLoading: boolean }) {
  
  return (
    <div className="space-y-4">
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={`skeleton-${i}`}>
                            <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                    ))
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell><code>/info/{item.slug}</code></TableCell>
                            <TableCell>{item.updatedAt?.toDate().toLocaleString() || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                <Link href={`/admin/content/pages/edit/${item.slug}`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">No pages found.</p>
                                <Link href="/admin/content/pages/edit/new">
                                    <Button variant="outline" size="sm">Create First Page</Button>
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
    </div>
  );
}
