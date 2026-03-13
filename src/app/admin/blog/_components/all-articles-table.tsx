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
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import type { BlogPost } from '@/lib/types';
import { Input } from '@/components/ui/input';

const placeholderPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Як читати карти Таро: Посібник для початківців',
    slug: 'yak-chitati-karti-taro',
    excerpt: 'Відкрийте для себе світ Таро та навчіться...',
    status: 'published',
    author: { name: 'Олена П.' },
    category: { id: '1', name: 'таро' },
    featured: true,
    publishedAt: '2024-07-15',
    updatedAt: '2024-07-16',
    coverImageUrl: 'https://picsum.photos/seed/taro1/80/45',
  },
  {
    id: '2',
    title: 'Астрологічний прогноз на серпень 2024',
    slug: 'astrologichniy-prognoz-serpen-2024',
    excerpt: 'Що зірки готують для вашого знаку зодіаку...',
    status: 'published',
    author: { name: 'Максим К.' },
    category: { id: '2', name: 'астрологія' },
    featured: false,
    publishedAt: '2024-07-14',
    updatedAt: '2024-07-14',
    coverImageUrl: 'https://picsum.photos/seed/astro1/80/45',
  },
  {
    id: '3',
    title: 'Сила шаманських практик',
    slug: 'sila-shamanskih-praktik',
    excerpt: 'Подорож до витоків давніх знань...',
    status: 'draft',
    author: { name: 'Анонім' },
    category: { id: '3', name: 'шаман' },
    featured: false,
    publishedAt: '',
    updatedAt: '2024-07-12',
    coverImageUrl: 'https://picsum.photos/seed/shaman1/80/45',
  },
   {
    id: '4',
    title: 'Цифрова нумерологія: значення чисел',
    slug: 'cifrova-numerologiya',
    excerpt: 'Як дата народження та ім\'я впливають на вашу долю...',
    status: 'scheduled',
    author: { name: 'Ірина В.' },
    category: { id: '4', name: 'нумерологія' },
    featured: false,
    publishedAt: '2024-08-01',
    updatedAt: '2024-07-10',
    coverImageUrl: 'https://picsum.photos/seed/numero1/80/45',
  },
];

const statusColors: Record<BlogPost['status'], string> = {
    published: 'bg-green-500',
    draft: 'bg-yellow-500',
    scheduled: 'bg-blue-500',
    archived: 'bg-gray-500',
}

export function AllArticlesTable({ showFilters = true }: { showFilters?: boolean }) {
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
              <TableHead padding="checkbox">
                <Checkbox aria-label="Select all" />
              </TableHead>
              <TableHead>Cover</TableHead>
              <TableHead>
                Title
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>
                Published
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placeholderPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell padding="checkbox">
                  <Checkbox aria-label={`Select row ${post.id}`} />
                </TableCell>
                <TableCell>
                    <Image src={post.coverImageUrl} alt={post.title} width={80} height={45} className="rounded-md object-cover" />
                </TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusColors[post.status]}`} />
                        <span className="capitalize">{post.status}</span>
                    </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{post.category.name}</Badge>
                </TableCell>
                <TableCell>
                  {post.featured ? (
                    <Badge variant="secondary">Yes</Badge>
                  ) : (
                    'No'
                  )}
                </TableCell>
                <TableCell>
                  {post.status === 'published' || post.status === 'scheduled' ? post.publishedAt : '-'}
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
