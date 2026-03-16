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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Inbox } from 'lucide-react';
import Image from 'next/image';
import type { Post, BlogCategory, EditorialStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const statusColors: Record<EditorialStatus, string> = {
    submitted: 'bg-blue-500',
    under_review: 'bg-yellow-500',
    revision: 'bg-orange-500',
    rejected: 'bg-red-500',
    published: 'bg-green-500',
}

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
            post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.authorName?.toLowerCase().includes(searchTerm.toLowerCase());

        const statusMatch = statusFilter === 'all' || post.editorialStatus === statusFilter;
        
        const sourceMatch = sourceFilter === 'all' || post.sourcePlatform === sourceFilter;

        return searchMatch && statusMatch && sourceMatch;
    });
  }, [posts, searchTerm, statusFilter, sourceFilter]);

  const renderSkeleton = () => (
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
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={8} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2">
            <Inbox className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No new submissions to review.</p>
        </div>
      </TableCell>
    </TableRow>
  );

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
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="revision">Changes Requested</SelectItem>
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
              renderSkeleton()
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
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
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusColors[post.editorialStatus!]}`} />
                        <span className="capitalize">{post.editorialStatus?.replace('_', ' ')}</span>
                    </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getCategoryPath(post.categoryId, post.subcategoryId)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={post.sourcePlatform === 'app' ? 'secondary' : 'default'} className="capitalize">{post.sourcePlatform}</Badge>
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
            ))
            ) : (
              renderEmptyState()
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
