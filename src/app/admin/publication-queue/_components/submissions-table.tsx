'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Inbox,
    FileText,
    Send,
    Search,
    FilePen,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import Image from 'next/image';
import type { Post, BlogCategory, EditorialStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const statusInfo: Record<EditorialStatus, { label: string; className: string; icon: React.ElementType }> = {
  draft: {
    label: 'Чернетка',
    className: 'bg-[#F1F1EE] text-[#5E5E5A] border-[#D9D9D3]',
    icon: FileText
  },
  submitted: {
    label: 'Нове звернення',
    className: 'bg-[#F3F2F7] text-[#4F4B5C] border-[#D7D2E2]',
    icon: Send
  },
  under_review: {
    label: 'У роботі',
    className: 'bg-[#ECECEC] text-[#2F2F32] border-[#CFCFCF]',
    icon: Search
  },
  changes_requested: {
    label: 'Очікує правок',
    className: 'bg-[#F5F1EC] text-[#6A5848] border-[#DDD2C6]',
    icon: FilePen
  },
  published: {
    label: 'Опубліковано',
    className: 'bg-[#EEF2EE] text-[#415043] border-[#CDD8CE]',
    icon: CheckCircle2
  },
  rejected: {
    label: 'Відхилено',
    className: 'bg-[#F3EEEE] text-[#6B5252] border-[#DCCACA]',
    icon: XCircle
  },
};

export function SubmissionsTable({ 
  posts,
  categories,
  isLoading,
}: { 
  posts: Post[],
  categories: BlogCategory[],
  isLoading: boolean,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const getCategoryPath = (categoryId?: string, subcategoryId?: string) => {
    if (!categoryId || !categories) return 'N/A';
    const category = categories.find(c => c.id === categoryId);
    if (!category) return categoryId;
    
    if (subcategoryId) {
        const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
        return subcategory ? `${category.name} / ${subcategory.name}` : `${category.name} / ${subcategoryId}`;
    }
    return category.name;
  };

  const filteredPosts = useMemo(() => {
     return posts.filter(post => {
        const searchMatch = !searchTerm || 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.authorName && post.authorName.toLowerCase().includes(searchTerm.toLowerCase()));

        const statusMatch = statusFilter === 'all' || post.editorialStatus === statusFilter;
        
        const sourceMatch = sourceFilter === 'all' || post.sourcePlatform === sourceFilter;

        return searchMatch && statusMatch && sourceMatch;
    });
  }, [posts, searchTerm, statusFilter, sourceFilter]);

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <Input 
                placeholder="Search by title or author..." 
                className="max-w-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="submitted">{statusInfo.submitted.label}</SelectItem>
                    <SelectItem value="under_review">{statusInfo.under_review.label}</SelectItem>
                    <SelectItem value="changes_requested">{statusInfo.changes_requested.label}</SelectItem>
                </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="app">App</SelectItem>
                </SelectContent>
            </Select>
        </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-[45px] w-[80px] rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const status = post.editorialStatus && statusInfo[post.editorialStatus] ? statusInfo[post.editorialStatus] : null;

                return (
                  <TableRow key={post.id}>
                    <TableCell>
                        {post.coverImageUrl ? (
                          <Image src={post.coverImageUrl} alt={post.title} width={80} height={45} className="rounded-md object-cover" />
                        ) : (
                          <div className="w-20 h-[45px] bg-muted rounded-md" />
                        )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                                <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{post.authorName}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                      {status && (
                        <Badge 
                          variant="outline"
                          className={cn(
                            "font-normal normal-case hover:bg-inherit flex items-center gap-1.5",
                            status.className
                          )}
                        >
                          <status.icon className="w-3.5 h-3.5" />
                          {status.label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryPath(post.categoryId, post.subcategoryId)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.sourcePlatform === 'app' ? 'secondary' : 'default'} className="capitalize">{post.sourcePlatform || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      {post.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                        <Link href={`/admin/publication-queue/${post.id}`} passHref>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No new submissions to review.</p>
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
