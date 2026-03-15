'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { BlogPost } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


const articleSchema = z.object({
    // Core Content
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    
    // Media
    coverImageUrl: z.string().url().optional().or(z.literal('')),
    coverAlt: z.string().optional(),

    // Taxonomy
    category: z.string().min(1, "Category is required"),
    tags: z.string().optional(), // Comma-separated tags

    // Status & Visibility
    status: z.enum(['draft', 'published', 'scheduled', 'archived']),
    featured: z.boolean(),
    pinned: z.boolean(),

    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    noindex: z.boolean(),
    nofollow: z.boolean(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

const defaultValues: Partial<ArticleFormValues> = {
    title: '',
    slug: '',
    status: 'draft',
    featured: false,
    pinned: false,
    noindex: false,
    nofollow: false,
};

export function ArticleEditForm({ initialData }: { initialData?: Partial<ArticleFormValues>}) {
    const form = useForm<ArticleFormValues>({
        resolver: zodResolver(articleSchema),
        defaultValues: initialData || defaultValues,
        mode: "onChange",
    });

     function onSubmit(data: ArticleFormValues) {
        // In a real app, you would add authorId, authorName, contentType
        // and handle timestamps before saving to Firestore.
        const postData = {
            ...data,
            tags: data.tags?.split(',').map(tag => tag.trim()).filter(Boolean),
            contentType: 'blog',
        };
        console.log(postData);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                 <div className="flex items-center justify-end gap-4 mb-8">
                    <Button variant="outline" type="button">Save Draft</Button>
                    <Button type="submit">Publish Article</Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                         <Card>
                            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl><Input placeholder="Article Title" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl><Input placeholder="article-slug" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Excerpt</FormLabel>
                                            <FormControl><Textarea placeholder="Short summary of the article..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Main Content</FormLabel>
                                            <FormControl><Textarea className="min-h-64" placeholder="Write your article here..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>SEO & Social</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                 <FormField
                                    control={form.control}
                                    name="seoTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SEO Title</FormLabel>
                                            <FormControl><Input placeholder="SEO-friendly Title" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="seoDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Description</FormLabel>
                                            <FormControl><Textarea placeholder="SEO-friendly description for search engines" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-8">
                                    <FormField
                                        control={form.control}
                                        name="noindex"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>No Index</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nofollow"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>No Follow</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="featured"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Featured Article</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pinned"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Pinned Article</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Taxonomy</CardTitle></CardHeader>
                             <CardContent className="space-y-4">
                                 <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* In a real app, these would be fetched from blogSettings/main */}
                                            <SelectItem value="таро">таро</SelectItem>
                                            <SelectItem value="астрологія">астрологія</SelectItem>
                                            <SelectItem value="шаман">шаман</SelectItem>
                                            <SelectItem value="ретрит">ретрит</SelectItem>
                                            <SelectItem value="гадання">гадання</SelectItem>
                                            <SelectItem value="нумерологія">нумерологія</SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl><Input placeholder="tag1, tag2, tag3" {...field} /></FormControl>
                                            <FormDescription>Comma-separated values.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Media</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="coverImageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Image URL</FormLabel>
                                            <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="coverAlt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cover Image Alt Text</FormLabel>
                                            <FormControl><Input placeholder="A description of the image" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
