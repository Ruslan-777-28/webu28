'use client';

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/client";
import { doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import type { BlogSettings, Post } from "@/lib/types";

const postSchema = z.object({
  title: z.string().min(5, { message: "Заголовок має містити щонайменше 5 символів." }),
  content: z.string().min(20, { message: "Вміст має містити щонайменше 20 символів." }),
  coverImageUrl: z.string().url({ message: "Будь ласка, введіть дійсну URL-адресу." }).optional().or(z.literal('')),
  categoryId: z.string({ required_error: "Будь ласка, оберіть категорію." }),
  subcategoryId: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface EditPostModalProps {
  post: Post & { id: string };
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export function EditPostModal({ post, isOpen, setOpen }: EditPostModalProps) {
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
      title: post.title,
      content: post.content || '',
      coverImageUrl: post.coverImageUrl || '',
      categoryId: post.categoryId,
      subcategoryId: post.subcategoryId,
    },
  });

   useEffect(() => {
    form.reset({
      title: post.title,
      content: post.content || '',
      coverImageUrl: post.coverImageUrl || '',
      categoryId: post.categoryId,
      subcategoryId: post.subcategoryId,
    });
  }, [post, form]);

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
    const postRef = doc(db, 'posts', post.id);
    try {
      await updateDoc(postRef, {
        ...values,
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Зміни збережено!" });
      setOpen(false);
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        variant: "destructive",
        title: "Помилка збереження",
        description: error.message || "Не вдалося зберегти зміни.",
      });
    }
  }

  const handleResubmit = async () => {
    const values = form.getValues();
    const postRef = doc(db, 'posts', post.id);
     try {
      await updateDoc(postRef, {
        ...values,
        editorialStatus: 'submitted',
        revisionRequested: false,
        revisionSubmittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Матеріал надіслано повторно!", description: "Ваші зміни відправлено на розгляд." });
      setOpen(false);
    } catch (error: any) {
       toast({ variant: 'destructive', title: "Помилка", description: "Не вдалося надіслати матеріал. " + error.message });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Редагувати публікацію</DialogTitle>
          <DialogDescription>
            Внесіть зміни та збережіть їх, або надішліть на повторний розгляд, якщо це необхідно.
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
            <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>URL-адреса зображення обкладинки</FormLabel>
                    <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value || ""} disabled={availableSubcategories.length === 0}>
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
              {post.editorialStatus === 'changes_requested' && (
                  <Button type="button" variant="secondary" onClick={handleResubmit} disabled={form.formState.isSubmitting}>
                      Надіслати повторно
                  </Button>
              )}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
