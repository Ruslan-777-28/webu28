'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { db } from "@/lib/firebase/client";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const settingsSchema = z.object({
    blogPageTitle: z.string().min(1, "Title is required"),
    blogPageSubtitle: z.string().optional(),
    articlesPerPage: z.coerce.number().min(1).max(50),
    defaultSort: z.enum(['latest', 'popular']),
    showFeaturedSection: z.boolean(),
    showPopularSection: z.boolean(),
    showCategoriesSection: z.boolean(),
    showAuthorsSection: z.boolean(),
    showSubscribeBlock: z.boolean(),
    categories: z.string().refine((val) => {
        try {
            JSON.parse(val);
            return true;
        } catch (e) {
            return false;
        }
    }, { message: "Invalid JSON format for categories." }),
    tags: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function BlogSettingsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            categories: '[]'
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const settingsRef = doc(db, 'blogSettings', 'main');
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.reset({
                    ...data,
                    categories: JSON.stringify(data.categories || [], null, 2),
                    tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
                });
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, [form]);

    async function onSubmit(data: SettingsFormValues) {
        try {
            const settingsRef = doc(db, 'blogSettings', 'main');
            const settingsData = {
                ...data,
                categories: JSON.parse(data.categories),
                tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean),
            };
            await setDoc(settingsRef, settingsData, { merge: true });
            toast({ title: "Settings saved successfully!" });
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast({ variant: "destructive", title: "Error saving settings", description: error.message });
        }
    }

    if (isLoading) {
        return (
             <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
                    </div>
                 </div>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Blog Settings</h1>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Blog Page Content</CardTitle>
                                <CardDescription>Settings for the main block on the blog page.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="blogPageTitle" render={({ field }) => (
                                    <FormItem><FormLabel>Blog Page Title (H1)</FormLabel><FormControl><Input placeholder="Blog Title" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="blogPageSubtitle" render={({ field }) => (
                                    <FormItem><FormLabel>Blog Page Subtitle</FormLabel><FormControl><Textarea placeholder="A short, powerful description..." {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                                <CardDescription>SEO settings for the main blog page.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="seoTitle" render={({ field }) => (
                                    <FormItem><FormLabel>SEO Title</FormLabel><FormControl><Input placeholder="SEO Title" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="seoDescription" render={({ field }) => (
                                    <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea placeholder="Meta Description" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Taxonomy</CardTitle>
                                <CardDescription>Manage categories and tags for blog posts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="categories" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categories (JSON format)</FormLabel>
                                        <FormControl><Textarea placeholder="Enter categories as a JSON array" {...field} className="min-h-64 font-mono text-xs" /></FormControl>
                                        <FormDescription>
                                            Use JSON format: `[{ "id": "cat1", "name": "Category 1", "subcategories": [{ "id": "sub1", "name": "Sub 1" }] }]`
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="tags" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl><Textarea placeholder="self-discovery, relationships, career" {...field} /></FormControl>
                                         <FormDescription>Comma-separated list of tags.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                         <Card>
                            <CardHeader>
                                <CardTitle>Display Options</CardTitle>
                                <CardDescription>Manage general display settings for the blog.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="articlesPerPage" render={({ field }) => (
                                    <FormItem><FormLabel>Articles Per Page</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="defaultSort" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Default Sort Order</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select order" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="latest">Latest</SelectItem>
                                                <SelectItem value="popular">Popular</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="showFeaturedSection" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Show Featured Section</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                )}/>
                                <FormField control={form.control} name="showPopularSection" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Show Popular Section</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                )}/>
                                 <FormField control={form.control} name="showCategoriesSection" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Show Categories Section</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                )}/>
                                 <FormField control={form.control} name="showAuthorsSection" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Show Authors Section</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                )}/>
                                <FormField control={form.control} name="showSubscribeBlock" render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Show Subscribe Block</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
