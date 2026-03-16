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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase/client";
import { doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import type { BlogSettings, Post } from "@/lib/types";
import Image from "next/image";
import { ImageIcon, Upload, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const postSchema = z.object({
  title: z.string().min(5, { message: "Заголовок має містити щонайменше 5 символів." }),
  content: z.string().min(20, { message: "Вміст має містити щонайменше 20 символів." }),
  coverImageUrl: z.string().url({ message: "Будь ласка, введіть дійсну URL-адресу." }).optional().or(z.literal('')),
  coverAlt: z.string().optional(),
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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      coverAlt: post.coverAlt || '',
      categoryId: post.categoryId,
      subcategoryId: post.subcategoryId,
    },
  });

   useEffect(() => {
    form.reset({
      title: post.title,
      content: post.content || '',
      coverImageUrl: post.coverImageUrl || '',
      coverAlt: post.coverAlt || '',
      categoryId: post.categoryId,
      subcategoryId: post.subcategoryId,
    });
  }, [post, form]);

  const watchedCategoryId = useWatch({
      control: form.control,
      name: 'categoryId',
  });
  const watchedCoverImageUrl = useWatch({ control: form.control, name: 'coverImageUrl' });

  const availableSubcategories = useMemo(() => {
      if (!watchedCategoryId || !settings) return [];
      const selectedCategory = settings.categories.find(c => c.id === watchedCategoryId);
      return selectedCategory?.subcategories || [];
  }, [watchedCategoryId, settings]);

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
        if (!post.id) return;

        setIsUploading(true);
        const storageRef = ref(storage, `posts/${post.id}/cover-${Date.now()}-${file.name}`);
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
                        const oldImageRef = ref(storage, oldUrl);
                        deleteObject(oldImageRef).catch(err => console.warn("Could not delete old image:", err));
                    }
                    form.setValue('coverImageUrl', downloadURL, { shouldValidate: true });
                    setIsUploading(false);
                    toast({ title: 'Image uploaded!' });
                });
            }
        );
    };

    const handleImageRemove = async () => {
        const imageUrl = form.getValues('coverImageUrl');
        if (!imageUrl) return;

        const imageRef = ref(storage, imageUrl);

        try {
            await deleteObject(imageRef);
            form.setValue('coverImageUrl', '', { shouldValidate: true });
            toast({ title: 'Image removed.' });
        } catch (error: any) {
            console.error("Error removing image:", error);
            if (error.code === 'storage/object-not-found') {
                 form.setValue('coverImageUrl', '', { shouldValidate: true });
            } else {
                toast({ variant: 'destructive', title: 'Error removing image', description: error.message });
            }
        }
    };

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
            
            <div className="space-y-2">
                <FormLabel>Зображення обкладинки</FormLabel>
                <FormDescription>Додайте зображення, яке буде відображатися як обкладинка вашого поста.</FormDescription>
                {watchedCoverImageUrl ? (
                    <div className="relative group">
                        <Image src={watchedCoverImageUrl} alt="Cover image preview" width={400} height={225} className="rounded-md object-cover w-full aspect-video" />
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
                ) : (
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                        {isUploading ? (
                            <>
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
            </div>
             <FormField
                control={form.control}
                name="coverAlt"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Опис зображення</FormLabel>
                    <FormControl>
                        <Input placeholder="Коротко опишіть, що зображено на обкладинці" {...field} />
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
                  <Button type="button" variant="secondary" onClick={handleResubmit} disabled={form.formState.isSubmitting || isUploading}>
                      Надіслати повторно
                  </Button>
              )}
              <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                  {form.formState.isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
