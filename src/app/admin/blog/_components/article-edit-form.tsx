'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase/client';
import type { Post, BlogCategory } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, Upload, X } from 'lucide-react';

const articleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    
    coverImageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    coverAlt: z.string().optional(),

    categoryId: z.string().min(1, "Category is required"),
    subcategoryId: z.string().optional(),
    tags: z.string().optional(),

    status: z.enum(['draft', 'published', 'scheduled', 'archived']),
    featured: z.boolean().default(false),
    pinned: z.boolean().default(false),

    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    ogImageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
    noindex: z.boolean().default(false),
    nofollow: z.boolean().default(false),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleEditFormProps {
    initialData?: Partial<Post> & { id: string };
    categories: BlogCategory[];
}

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 70);


export function ArticleEditForm({ initialData, categories = [] }: ArticleEditFormProps) {
    const router = useRouter();
    const { user, profile } = useUser();
    const { toast } = useToast();
    
    const [postId] = useState<string>(initialData?.id || doc(collection(db, 'posts')).id);
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const isEditing = !!initialData;
    
    const form = useForm<ArticleFormValues>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: initialData?.title || '',
            slug: initialData?.slug || '',
            excerpt: initialData?.excerpt || '',
            content: initialData?.content || '',
            coverImageUrl: initialData?.coverImageUrl || '',
            coverAlt: initialData?.coverAlt || '',
            categoryId: initialData?.categoryId || '',
            subcategoryId: initialData?.subcategoryId || '',
            tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : '',
            status: initialData?.status || 'draft',
            featured: initialData?.featured || false,
            pinned: initialData?.pinned || false,
            seoTitle: initialData?.seoTitle || '',
            seoDescription: initialData?.seoDescription || '',
            canonicalUrl: initialData?.canonicalUrl || '',
            ogImageUrl: initialData?.ogImageUrl || '',
            noindex: initialData?.noindex || false,
            nofollow: initialData?.nofollow || false,
        },
        mode: "onChange",
    });

    const watchedTitle = useWatch({ control: form.control, name: 'title' });
    const watchedCategoryId = useWatch({ control: form.control, name: 'categoryId' });
    const watchedCoverImageUrl = useWatch({ control: form.control, name: 'coverImageUrl' });

    useEffect(() => {
        if (!isEditing && !isSlugManuallyEdited && watchedTitle) {
            form.setValue('slug', generateSlug(watchedTitle), { shouldValidate: true });
        }
    }, [watchedTitle, isEditing, isSlugManuallyEdited, form]);

    const availableSubcategories = React.useMemo(() => {
        if (!watchedCategoryId) return [];
        const selectedCategory = categories.find(c => c.id === watchedCategoryId);
        return selectedCategory?.subcategories || [];
    }, [watchedCategoryId, categories]);

    useEffect(() => {
        const currentSubcategoryId = form.getValues('subcategoryId');
        const isSubcategoryValid = availableSubcategories.some(s => s.id === currentSubcategoryId);
        if (!isSubcategoryValid) {
             form.setValue('subcategoryId', '');
        }
    }, [watchedCategoryId, availableSubcategories, form]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast({ variant: 'destructive', title: 'Непідтримуваний формат файлу', description: 'Завантажте JPG, PNG або WEBP.' });
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast({ variant: 'destructive', title: 'Файл завеликий', description: 'Оберіть менше зображення.' });
            return;
        }

        handleImageUpload(file);
        e.target.value = '';
    };

    const handleImageUpload = (file: File) => {
        setIsUploading(true);
        const storageRef = ref(storage, `posts/${postId}/cover-${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
                toast({ variant: 'destructive', title: 'Не вдалося завантажити зображення', description: 'Спробуйте ще раз.' });
                setIsUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const oldUrl = form.getValues('coverImageUrl');
                    if (oldUrl) {
                        try {
                           const oldImageRef = ref(storage, oldUrl);
                           deleteObject(oldImageRef).catch(err => console.warn("Could not delete old image:", err));
                        } catch(e) { console.error(e) }
                    }
                    form.setValue('coverImageUrl', downloadURL, { shouldValidate: true });
                    setIsUploading(false);
                });
            }
        );
    };

     const handleImageRemove = async () => {
        const imageUrl = form.getValues('coverImageUrl');
        if (!imageUrl) return;

        try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
            form.setValue('coverImageUrl', '', { shouldValidate: true });
            toast({ title: 'Зображення видалено.' });
        } catch (error: any) {
            console.error("Error removing image:", error);
            if (error.code === 'storage/object-not-found') {
                form.setValue('coverImageUrl', '', { shouldValidate: true });
            } else {
                toast({ variant: 'destructive', title: 'Помилка видалення', description: error.message });
            }
        }
    };

     async function onSubmit(data: ArticleFormValues) {
        if (!user || !profile) {
            toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to perform this action." });
            return;
        }

        const tagsArray = data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
        
        let publishedAtValue = initialData?.publishedAt || null;
        if (data.status === 'published' && initialData?.status !== 'published') {
            publishedAtValue = serverTimestamp();
        } else if (data.status !== 'published') {
            publishedAtValue = null;
        }

        const postPayload = {
            ...data,
            tags: tagsArray,
            subcategoryId: data.subcategoryId || '',
            updatedAt: serverTimestamp(),
            publishedAt: publishedAtValue,
        };

        try {
            if (isEditing) {
                const postRef = doc(db, 'posts', initialData.id);
                await updateDoc(postRef, postPayload);
                toast({ title: "Article updated successfully!" });
            } else {
                const postRef = doc(db, 'posts', postId);
                const newPostPayload = {
                    ...postPayload,
                    contentType: 'blog' as const,
                    authorId: user.uid,
                    authorName: profile.name || user.email,
                    authorAvatarUrl: profile.avatarUrl || '',
                    createdAt: serverTimestamp(),
                    views: 0,
                };
                await setDoc(postRef, newPostPayload);
                toast({ title: "Article created successfully!" });
                router.push(`/admin/blog/articles/${postId}`);
            }
        } catch (error: any) {
            console.error("Form submission error:", error);
            toast({ variant: "destructive", title: "An error occurred", description: error.message });
        }
    }

    const handleAction = async (status: 'draft' | 'published' | 'scheduled' | 'archived') => {
        form.setValue('status', status);
        await form.handleSubmit(onSubmit)();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                 <div className="flex items-center justify-end gap-4 mb-8">
                    <Button variant="outline" type="button" onClick={() => handleAction('draft')} disabled={form.formState.isSubmitting || isUploading}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save & Publish'}
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                         <Card>
                            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl><Input placeholder="Article Title" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="slug" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl><Input placeholder="article-slug" {...field} onChange={(e) => {
                                            field.onChange(e);
                                            setIsSlugManuallyEdited(true);
                                        }} /></FormControl>
                                        <FormDescription>The unique URL-friendly part of the address.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="excerpt" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt</FormLabel>
                                        <FormControl><Textarea placeholder="Short summary of the article..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="content" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Main Content (Markdown supported)</FormLabel>
                                        <FormControl><Textarea className="min-h-64" placeholder="Write your article here..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>SEO & Social</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                 <FormField control={form.control} name="seoTitle" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SEO Title</FormLabel>
                                        <FormControl><Input placeholder="SEO-friendly Title" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="seoDescription" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Description</FormLabel>
                                        <FormControl><Textarea placeholder="SEO-friendly description for search engines" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="canonicalUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Canonical URL</FormLabel>
                                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                         <FormDescription>The original source URL for this content.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="ogImageUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Open Graph Image URL</FormLabel>
                                        <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                        <FormDescription>Image for social media sharing (e.g., 1200x630px).</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <div className="flex gap-8">
                                    <FormField control={form.control} name="noindex" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel>No Index</FormLabel>
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="nofollow" render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel>No Follow</FormLabel>
                                        </FormItem>
                                    )}/>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="status" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="featured" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <FormLabel>Featured Article</FormLabel>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="pinned" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <FormLabel>Pinned Article</FormLabel>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Taxonomy</CardTitle></CardHeader>
                             <CardContent className="space-y-4">
                                <FormField control={form.control} name="categoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {categories.length > 0 ? categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        )) : <SelectItem value="-" disabled>No categories found</SelectItem>}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}/>
                                <FormField control={form.control} name="subcategoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subcategory</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ''} disabled={availableSubcategories.length === 0}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a subcategory" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {availableSubcategories.map(sub => (
                                            <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}/>
                                <FormField control={form.control} name="tags" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl><Input placeholder="tag1, tag2, tag3" {...field} /></FormControl>
                                        <FormDescription>Comma-separated values.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                             </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Обкладинка статті</CardTitle>
                                <CardDescription>Завантажте основне зображення, яке буде використовуватися в картці статті та на сторінці публікації.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {watchedCoverImageUrl ? (
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium">Поточна обкладинка</p>
                                        <div className="relative group">
                                            <Image src={watchedCoverImageUrl} alt={form.getValues('coverAlt') || 'Поточна обкладинка'} width={400} height={225} className="rounded-md object-cover w-full aspect-video" />
                                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <label htmlFor="cover-image-upload-edit">
                                                    <Button asChild size="icon" variant="secondary" className="h-7 w-7 cursor-pointer">
                                                        <span><Upload className="h-4 w-4" /></span>
                                                    </Button>
                                                </label>
                                                <Button size="icon" variant="destructive" className="h-7 w-7" onClick={handleImageRemove}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                                        {isUploading ? (
                                            <>
                                                <p className="text-sm text-muted-foreground mb-2">Завантажуємо обкладинку...</p>
                                                <Progress value={uploadProgress} className="w-full" />
                                                <p className="text-sm mt-2 text-muted-foreground">{Math.round(uploadProgress)}%</p>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <label htmlFor="cover-image-upload-edit" className="mt-4 inline-block cursor-pointer">
                                                    <Button asChild variant="outline">
                                                        <span><Upload className="mr-2 h-4 w-4" /> Завантажити зображення</span>
                                                    </Button>
                                                </label>
                                                <p className="text-xs text-muted-foreground mt-2">Підтримуються JPG, PNG, WEBP. Рекомендовано горизонтальне зображення хорошої якості.</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                <input id="cover-image-upload-edit" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileSelect} disabled={isUploading} />
                                 <FormField
                                    control={form.control}
                                    name="coverImageUrl"
                                    render={({ field }) => ( <FormItem className="hidden"><FormControl><Input {...field} /></FormControl></FormItem> )}
                                />
                                <FormField control={form.control} name="coverAlt" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Опис зображення</FormLabel>
                                        <FormControl><Input placeholder="Коротко опишіть, що зображено на обкладинці статті" {...field} /></FormControl>
                                        <FormDescription>Це поле використовується для доступності та кращого опису зображення.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
