'use client';

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/client";
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import type { BlogSettings } from "@/lib/types";
import React, { useEffect, useState, useMemo } from "react";

const postSchema = z.object({
  title: z.string().min(5, { message: "Заголовок має містити щонайменше 5 символів." }),
  content: z.string().min(20, { message: "Вміст має містити щонайменше 20 символів." }),
  categoryId: z.string({ required_error: "Будь ласка, оберіть категорію." }),
  subcategoryId: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export function CreatePostModal({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { user, profile } = useUser();
  const { toast } = useToast();
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const settingsRef = doc(db, 'blogSettings', 'main');
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as BlogSettings);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching blog settings:", error);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      subcategoryId: "",
    },
  });

  const watchedCategoryId = useWatch({
      control: form.control,
      name: 'categoryId',
  });

  const availableSubcategories = useMemo(() => {
      if (!watchedCategoryId || !settings) return [];
      const selectedCategory = settings.categories.find(c => c.id === watchedCategoryId);
      return selectedCategory?.subcategories || [];
  }, [watchedCategoryId, settings]);

  async function onSubmit(values: PostFormValues) {
    if (!user || !profile) {
      toast({ variant: "destructive", title: "Помилка автентифікації", description: "Ви повинні увійти, щоб створити пост." });
      return;
    }

    const newPostPayload = {
      // Core content
      title: values.title,
      content: values.content,
      slug: values.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 70),
      contentType: 'post' as const,

      // Author
      authorId: user.uid,
      authorName: profile.name || user.email || '',
      authorAvatarUrl: profile.avatarUrl || '',

      // Taxonomy
      categoryId: values.categoryId,
      subcategoryId: values.subcategoryId || '',

      // Platform fields
      sourcePlatform: 'site' as const,
      showInAuthorProfile: true,
      allowSitePublication: true,

      // Moderation fields
      editorialStatus: 'submitted' as const,
      sitePublished: false,

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Default blog status
      status: 'draft' as const,
    };

    try {
      await addDoc(collection(db, "posts"), newPostPayload);
      toast({
        title: "Матеріал надіслано!",
        description: "Ваш пост було надіслано на розгляд і скоро з'явиться у вашому профілі.",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Помилка створення поста",
        description: error.message || "Не вдалося зберегти ваш пост. Спробуйте ще раз.",
      });
    }
  }

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Створити нову публікацію</DialogTitle>
        <DialogDescription>
          Заповніть форму нижче, щоб додати новий матеріал. Після перевірки модератором він може з'явитися на сайті.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок</FormLabel>
                <FormControl>
                  <Input placeholder="Як читати карти Таро..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Повний текст статті</FormLabel>
                <FormControl>
                  <Textarea placeholder="Почніть писати свою статтю тут..." className="min-h-[150px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Категорія</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Оберіть категорію" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {settings?.categories?.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="subcategoryId"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Підкатегорія</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={availableSubcategories.length === 0}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Оберіть підкатегорію" /></SelectTrigger></FormControl>
                  <SelectContent>
                      {availableSubcategories.map(sub => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                      ))}
                  </SelectContent>
                  </Select>
                  <FormMessage />
              </FormItem>
              )}/>
           </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Скасувати</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Надсилання...' : 'Надіслати на розгляд'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
