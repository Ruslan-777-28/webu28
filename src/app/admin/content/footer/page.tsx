
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { db } from "@/lib/firebase/client";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-auth";
import { Facebook, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";

const socialLinkSchema = z.object({
  url: z.string().url().or(z.literal('')),
  isActive: z.boolean(),
});

const settingsSchema = z.object({
  socialLinks: z.object({
    youtube: socialLinkSchema,
    facebook: socialLinkSchema,
    tiktok: socialLinkSchema,
    instagram: socialLinkSchema,
    linkedin: socialLinkSchema,
    twitter: socialLinkSchema,
  })
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const socialPlatforms = {
  youtube: { label: 'YouTube', icon: Youtube },
  facebook: { label: 'Facebook', icon: Facebook },
  tiktok: { label: 'TikTok', icon: () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-5 w-5"><path fill="currentColor" d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.25V349.38A162.6 162.6 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 122.77 122.77z" /></svg> },
  instagram: { label: 'Instagram', icon: Instagram },
  linkedin: { label: 'LinkedIn', icon: Linkedin },
  twitter: { label: 'Twitter (X)', icon: Twitter },
};

export default function FooterSettingsPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    const docRef = doc(db, 'siteSettings', 'footer');

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            socialLinks: {
                youtube: { url: '', isActive: false },
                facebook: { url: '', isActive: false },
                tiktok: { url: '', isActive: false },
                instagram: { url: '', isActive: false },
                linkedin: { url: '', isActive: false },
                twitter: { url: '', isActive: false },
            }
        },
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                form.reset(docSnap.data() as SettingsFormValues);
            }
            setIsLoading(false);
        };
        fetchSettings();
    }, [form]);

    async function onSubmit(data: SettingsFormValues) {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not Authenticated' });
            return;
        }
        try {
            await setDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
                updatedBy: user.uid,
            }, { merge: true });
            toast({ title: "Footer settings saved successfully!" });
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast({ variant: "destructive", title: "Error saving settings", description: error.message });
        }
    }

    if (isLoading) {
        return (
             <div className="space-y-8">
                 <Skeleton className="h-10 w-64" />
                 <Card><CardContent className="p-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Footer Settings</h1>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
                
                 <Card>
                    <CardHeader>
                        <CardTitle>Social Media Links</CardTitle>
                        <CardDescription>Manage the social media links displayed in the website footer. URLs must be valid.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(socialPlatforms).map(([key, platform]) => (
                            <div key={key} className="flex items-center gap-4 p-4 border rounded-lg">
                                <platform.icon />
                                <div className="flex-grow space-y-2">
                                     <FormField
                                        control={form.control}
                                        name={`socialLinks.${key as keyof typeof socialPlatforms}.url`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="sr-only">{platform.label} URL</FormLabel>
                                                <FormControl><Input placeholder={`${platform.label} URL`} {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`socialLinks.${key as keyof typeof socialPlatforms}.isActive`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel>Show</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
