'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const requiredEmailSchema = z.string().email({ message: "Invalid email address" }).optional().or(z.literal(''));
const optionalStringSchema = z.string().optional();

const settingsSchema = z.object({
  generalEmail: requiredEmailSchema,
  partnershipsEmail: requiredEmailSchema,
  architectsEmail: requiredEmailSchema,
  showDirectEmails: z.boolean().default(false),
  contactIntro: optionalStringSchema,
  partnershipsIntro: optionalStringSchema,
  architectsIntro: optionalStringSchema,
  supportEmail: requiredEmailSchema,
  supportIntro: optionalStringSchema,
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function ContactSettingsPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    const docRef = doc(db, 'siteSettings', 'contact');

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            generalEmail: '',
            partnershipsEmail: '',
            architectsEmail: '',
            showDirectEmails: false,
            contactIntro: '',
            partnershipsIntro: '',
            architectsIntro: '',
            supportEmail: '',
            supportIntro: '',
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
            toast({ title: "Contact settings saved successfully!" });
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold">Contact Settings</h1>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Forms Architecture</CardTitle>
                        <CardDescription>Manage destination emails and intro texts for the contact hub and internal forms.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground">Global Settings</h3>
                            <FormField
                                control={form.control}
                                name="showDirectEmails"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Show Direct Emails</FormLabel>
                                            <CardDescription>
                                                If enabled, the configured emails will be shown below the forms on public pages.
                                            </CardDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-6 pt-4 border-t">
                            <h3 className="text-lg font-medium text-foreground">/contact (Hub & General Inquiries)</h3>
                            <FormField
                                control={form.control}
                                name="generalEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>General Contact Email</FormLabel>
                                        <FormControl><Input placeholder="hello@lector.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactIntro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Hub Intro Text</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Залиште своє повідомлення, і ми повернемося..." className="resize-y" rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-6 pt-4 border-t">
                            <h3 className="text-lg font-medium text-foreground">/partnerships (Partnership Forms)</h3>
                            <FormField
                                control={form.control}
                                name="partnershipsEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Partnerships Email</FormLabel>
                                        <FormControl><Input placeholder="partners@lector.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="partnershipsIntro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Partnerships Intro Text</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Ми відкриті до синергії..." className="resize-y" rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-6 pt-4 border-t">
                            <h3 className="text-lg font-medium text-foreground">/architects/apply (Status Apply)</h3>
                            <FormField
                                control={form.control}
                                name="architectsEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Architects Apply Email</FormLabel>
                                        <FormControl><Input placeholder="architects@lector.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="architectsIntro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Architects Apply Intro Text</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Офіційна процедура верифікації експертів..." className="resize-y" rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-6 pt-4 border-t">
                            <h3 className="text-lg font-medium text-foreground">/support (Support & Technical Issues)</h3>
                            <FormField
                                control={form.control}
                                name="supportEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Support Email</FormLabel>
                                        <FormControl><Input placeholder="support@lector.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="supportIntro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Support Intro Text</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Питання підтримки та технічні нюанси..." className="resize-y" rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
