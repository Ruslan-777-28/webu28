
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-auth';
import { db } from '@/lib/firebase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import React, { useEffect, useState } from 'react';

const pageSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    content: z.string().min(1, "Content is required"),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

export type PageFormValues = z.infer<typeof pageSchema>;

interface PageEditFormProps {
    initialData?: PageFormValues & { id: string } | null;
}

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 70);


export function PageEditForm({ initialData }: PageEditFormProps) {
    const router = useRouter();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);
    const isEditing = !!initialData;
    
    const form = useForm<PageFormValues>({
        resolver: zodResolver(pageSchema),
        defaultValues: initialData || {
            title: '',
            slug: '',
            content: '',
            seoTitle: '',
            seoDescription: '',
        },
        mode: "onChange",
    });

    const watchedTitle = useWatch({ control: form.control, name: 'title' });

    useEffect(() => {
        if (!isEditing && !isSlugManuallyEdited && watchedTitle) {
            form.setValue('slug', generateSlug(watchedTitle), { shouldValidate: true });
        }
    }, [watchedTitle, isEditing, isSlugManuallyEdited, form]);


     async function onSubmit(data: PageFormValues) {
        if (!user) {
            toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to perform this action." });
            return;
        }

        const pageRef = doc(db, 'siteInfoPages', data.slug);

        const pagePayload = {
            ...data,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid,
        };

        try {
            await setDoc(pageRef, pagePayload, { merge: isEditing });
            toast({ title: `Page ${isEditing ? 'updated' : 'created'} successfully!` });
            if (!isEditing) {
                router.push(`/admin/content/pages/edit/${data.slug}`);
            }
        } catch (error: any) {
            console.error("Form submission error:", error);
            toast({ variant: "destructive", title: "An error occurred", description: error.message });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                 <div className="flex items-center justify-end gap-4 mb-8">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Page Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input placeholder="Page Title" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                            <FormField control={form.control} name="slug" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl><Input placeholder="page-slug" {...field} onChange={(e) => {
                                    field.onChange(e);
                                    setIsSlugManuallyEdited(true);
                                }} disabled={isEditing} /></FormControl>
                                <FormDescription>The unique URL part of the address. Cannot be changed after creation.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="content" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl><Textarea className="min-h-64" placeholder="Write page content here. Use line breaks for paragraphs." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
                 <Card className="mt-8">
                    <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
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
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}

