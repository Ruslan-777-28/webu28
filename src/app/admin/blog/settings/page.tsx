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
    categories: z.string().optional(),
    tags: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultValues: Partial<SettingsFormValues> = {
    blogPageTitle: "Блог про духовні практики",
    blogPageSubtitle: "Ідеї, практики, аналітика, поради та матеріали, які допомагають краще зрозуміти себе, знайти фахівця, інструмент або рішення.",
    articlesPerPage: 9,
    defaultSort: "latest",
    showFeaturedSection: true,
    showPopularSection: true,
    showCategoriesSection: true,
    showAuthorsSection: false,
    showSubscribeBlock: true,
    categories: "таро, астрологія, шаман, ретрит, гадання, нумерологія",
    tags: "самопізнання, стосунки, кар'єра, енергія, медитація",
    seoTitle: "Блог про духовні практики | AWE28",
    seoDescription: "Все про таро, астрологію, нумерологію та інші духовні практики.",
};

export default function BlogSettingsPage() {
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues,
        mode: "onChange",
    });

    function onSubmit(data: SettingsFormValues) {
        const settingsData = {
            ...data,
            categories: data.categories?.split(',').map(c => c.trim()).filter(Boolean),
            tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean),
        };
        console.log(settingsData);
        // Here you would save the settings to Firestore doc 'blogSettings/main'
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Blog Settings</h1>
                    <Button type="submit">Save Changes</Button>
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
                                        <FormLabel>Categories</FormLabel>
                                        <FormControl><Textarea placeholder="taro, astrology, numerology" {...field} /></FormControl>
                                        <FormDescription>Comma-separated list of categories.</FormDescription>
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
