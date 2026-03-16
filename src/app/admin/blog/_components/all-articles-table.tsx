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
import { MoreHorizontal, Newspaper } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import type { Post, BlogCategory } from '@/lib/types';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<Post['status'], string> = {
    published: 'bg-green-500',
    draft: 'bg-yellow-500',
    scheduled: 'bg-blue-500',
    archived: 'bg-gray-500',
}

export function AllArticlesTable({ 
  posts,
  categories,
  isLoading,
  showFilters = true 
}: { 
  posts: Post[],
  categories: BlogCategory[],
  isLoading: boolean,
  showFilters?: boolean 
}) {

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

  const renderSkeleton = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell className="px-2 py-1 h-auto"><Skeleton className="h-4 w-4" /></TableCell>
        <TableCell><Skeleton className="h-[45px] w-[80px] rounded-md" /></TableCell>
        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-6 w-12" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2">
            <Newspaper className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No articles found.</p>
            <Link href="/admin/blog/articles/new">
                <Button variant="outline" size="sm">Create First Article</Button>
            </Link>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
        {showFilters && (
            <div className="flex items-center gap-4">
                <Input placeholder="Search articles..." className="max-w-sm" />
                {/* Filters would go here */}
            </div>
        )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 py-1 h-auto">
                <Checkbox aria-label="Select all" />
              </TableHead>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeleton()
            ) : posts.length > 0 ? (
              posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="px-2 py-1 h-auto">
                  <Checkbox aria-label={`Select row ${post.id}`} />
                </TableCell>
                <TableCell>
                    {post.coverImageUrl ? (
                      <Image src={post.coverImageUrl} alt={post.title} width={80} height={45} className="rounded-md object-cover" />
                    ) : (
                      <div className="w-20 h-[45px] bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                        <Newspaper className="w-4 h-4"/>
                      </div>
                    )}
                </TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusColors[post.status]}`} />
                        <span className="capitalize">{post.status}</span>
                    </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getCategoryPath(post.categoryId, post.subcategoryId)}</Badge>
                </TableCell>
                <TableCell>{post.authorName}</TableCell>
                <TableCell>
                  {post.featured ? (
                    <Badge variant="secondary">Yes</Badge>
                  ) : (
                    'No'
                  )}
                </TableCell>
                <TableCell>
                  {post.updatedAt?.toDate().toLocaleDateString() || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <Link href={`/admin/blog/articles/${post.id}`} passHref>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
