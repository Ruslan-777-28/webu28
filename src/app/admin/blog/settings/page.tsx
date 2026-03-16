'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { db } from "@/lib/firebase/client";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const subcategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Назва підкатегорії обов'язкова"),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Назва категорії обов'язкова"),
  subcategories: z.array(subcategorySchema),
});

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
    categories: z.array(categorySchema).default([]),
    tags: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    ogImageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const generateSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');


export default function BlogSettingsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            blogPageTitle: "",
            blogPageSubtitle: "",
            articlesPerPage: 9,
            defaultSort: "latest",
            showFeaturedSection: true,
            showPopularSection: true,
            showCategoriesSection: true,
            showAuthorsSection: false,
            showSubscribeBlock: true,
            categories: [],
            tags: "",
            seoTitle: "",
            seoDescription: "",
            canonicalUrl: "",
            ogImageUrl: "",
        },
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "categories"
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
                    categories: data.categories || [],
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
                categories: data.categories.map(cat => ({
                    ...cat,
                    id: generateSlug(cat.name) || cat.id,
                    subcategories: cat.subcategories.map(sub => ({
                        ...sub,
                        id: generateSlug(sub.name) || sub.id
                    }))
                })),
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
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle>Taxonomy</CardTitle>
                                <CardDescription>Manage categories and tags for blog posts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <FormLabel>Categories</FormLabel>
                                    <div className="space-y-4 pt-2">
                                        {fields.map((field, index) => (
                                            <CategoryItem key={field.id} form={form} categoryIndex={index} removeCategory={remove} />
                                        ))}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={() => append({ id: '', name: '', subcategories: [] })}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Category
                                    </Button>
                                </div>
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

function CategoryItem({ form, categoryIndex, removeCategory }: { form: any, categoryIndex: number, removeCategory: (index: number) => void }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `categories.${categoryIndex}.subcategories`
    });
    
    const categoryName = useWatch({
        control: form.control,
        name: `categories.${categoryIndex}.name`
    });

    useEffect(() => {
        if (categoryName) {
            form.setValue(`categories.${categoryIndex}.id`, generateSlug(categoryName));
        }
    }, [categoryName, categoryIndex, form]);

    return (
        <div className="p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center gap-2">
                <FormField
                    control={form.control}
                    name={`categories.${categoryIndex}.name`}
                    render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl>
                                <Input placeholder="Category Name" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name={`categories.${categoryIndex}.id`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input readOnly disabled placeholder="category-id" {...field} className="w-32 bg-muted text-muted-foreground" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeCategory(categoryIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
            <div className="pl-8 mt-4 space-y-2">
                <FormLabel className="text-xs text-muted-foreground">Subcategories</FormLabel>
                {fields.map((field, subIndex) => (
                    <SubcategoryItem 
                        key={field.id}
                        form={form} 
                        categoryIndex={categoryIndex} 
                        subcategoryIndex={subIndex} 
                        removeSubcategory={remove} 
                    />
                ))}
                <Button 
                    type="button" 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto"
                    onClick={() => append({ id: '', name: ''})}
                >
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Add Subcategory
                </Button>
            </div>
        </div>
    )
}

function SubcategoryItem({ form, categoryIndex, subcategoryIndex, removeSubcategory }: { form: any, categoryIndex: number, subcategoryIndex: number, removeSubcategory: (index: number) => void }) {
    
    const subcategoryName = useWatch({
        control: form.control,
        name: `categories.${categoryIndex}.subcategories.${subcategoryIndex}.name`
    });

    useEffect(() => {
        if (subcategoryName) {
            form.setValue(`categories.${categoryIndex}.subcategories.${subcategoryIndex}.id`, generateSlug(subcategoryName));
        }
    }, [subcategoryName, categoryIndex, subcategoryIndex, form]);
    
    return (
        <div className="flex items-center gap-2">
             <FormField
                control={form.control}
                name={`categories.${categoryIndex}.subcategories.${subcategoryIndex}.name`}
                render={({ field }) => (
                    <FormItem className="flex-grow">
                        <FormControl>
                            <Input placeholder="Subcategory Name" {...field} className="h-8" />
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`categories.${categoryIndex}.subcategories.${subcategoryIndex}.id`}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input readOnly disabled placeholder="subcategory-id" {...field} className="w-32 h-8 bg-muted text-muted-foreground" />
                        </FormControl>
                    </FormItem>
                )}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeSubcategory(subcategoryIndex)} className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive/70" />
            </Button>
        </div>
    )
}


