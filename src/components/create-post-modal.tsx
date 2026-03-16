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
import { db, storage } from "@/lib/firebase/client";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import type { BlogSettings } from "@/lib/types";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { Progress } from "./ui/progress";

const postSchema = z.object({
  title: z.string().min(5, { message: "Заголовок має містити щонайменше 5 символів." }),
  content: z.string().min(20, { message: "Вміст має містити щонайменше 20 символів." }),
  coverImageUrl: z.string().url({ message: "Будь ласка, введіть дійсну URL-адресу." }).optional().or(z.literal('')),
  categoryId: z.string({ required_error: "Будь ласка, оберіть категорію." }),
  subcategoryId: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export function CreatePostModal({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { user, profile } = useUser();
  const { toast } = useToast();
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [newPostId, setNewPostId] = useState<string | null>(null);

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
      coverImageUrl: "",
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please select a PNG, JPG, or WEBP image.' });
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast({ variant: 'destructive', title: 'File too large', description: 'Image size should not exceed 5MB.' });
            return;
        }

        handleImageUpload(file);
        e.target.value = '';
    };

    const handleImageUpload = (file: File) => {
        let postId = newPostId;
        if (!postId) {
            postId = doc(collection(db, "posts")).id;
            setNewPostId(postId);
        }

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
                toast({ variant: 'destructive', title: 'Upload failed', description: error.message });
                setIsUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    if (coverImageUrl) {
                        const oldImageRef = ref(storage, coverImageUrl);
                        deleteObject(oldImageRef).catch(err => console.warn("Could not delete old image:", err));
                    }
                    setCoverImageUrl(downloadURL);
                    setIsUploading(false);
                    toast({ title: 'Image uploaded!' });
                });
            }
        );
    };

    const handleImageRemove = async () => {
        if (!coverImageUrl) return;
        const imageRef = ref(storage, coverImageUrl);
        try {
            await deleteObject(imageRef);
            setCoverImageUrl(null);
            toast({ title: 'Image removed.' });
        } catch (error: any) {
            console.error("Error removing image:", error);
            if (error.code === 'storage/object-not-found') {
                setCoverImageUrl(null);
            } else {
                toast({ variant: 'destructive', title: 'Error removing image', description: error.message });
            }
        }
    };

  async function onSubmit(values: PostFormValues) {
    if (!user || !profile) {
      toast({ variant: "destructive", title: "Помилка автентифікації", description: "Ви повинні увійти, щоб створити пост." });
      return;
    }
    
    const docRef = newPostId ? doc(db, "posts", newPostId) : doc(collection(db, "posts"));

    const newPostPayload = {
      // Core content
      title: values.title,
      content: values.content,
      coverImageUrl: coverImageUrl || '',
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
      await setDoc(docRef, newPostPayload);
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

          <div className="space-y-2">
            <FormLabel>Зображення обкладинки</FormLabel>
            {coverImageUrl ? (
                <div className="relative group">
                    <Image src={coverImageUrl} alt="Cover image preview" width={400} height={225} className="rounded-md object-cover w-full aspect-video" />
                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleImageRemove}>
                        <X className="h-4 w-4" />
                    </Button>
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
                            <label htmlFor="cover-image-upload-create" className="mt-4 inline-block cursor-pointer">
                                <Button asChild variant="outline">
                                    <span><Upload className="mr-2 h-4 w-4" /> Завантажити</span>
                                </Button>
                            </label>
                            <input id="cover-image-upload-create" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileSelect} />
                            <p className="text-xs text-muted-foreground mt-2">PNG, JPG, WEBP до 5MB.</p>
                          </>
                    )}
                </div>
            )}
             <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                    <FormItem className="hidden">
                        <FormControl><Input {...field} value={coverImageUrl || ''} /></FormControl>
                    </FormItem>
                )}
            />
          </div>
          
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
            <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                {form.formState.isSubmitting ? 'Надсилання...' : 'Надіслати на розгляд'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
