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
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/lib/types";
import { db, storage } from "@/lib/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from 'react';
import Image from "next/image";
import { Progress } from "./ui/progress";
import { ImageIcon, Upload, X } from "lucide-react";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Ім'я має містити щонайменше 2 символи." }),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  introVideoUrl: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileModal({ profile, setOpen }: { profile: UserProfile, setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || "",
      bio: profile.bio || "",
      avatarUrl: profile.avatarUrl || "",
      coverUrl: profile.coverUrl || "",
      introVideoUrl: profile.introVideoUrl || "",
    },
  });

  const watchedAvatarUrl = useWatch({ control: form.control, name: 'avatarUrl' });
  const watchedCoverUrl = useWatch({ control: form.control, name: 'coverUrl' });

  const handleFileUpload = (file: File, type: 'avatar' | 'cover') => {
      const isAvatar = type === 'avatar';
      const path = isAvatar ? `avatars/${profile.uid}/avatar-${Date.now()}-${file.name}` : `users/${profile.uid}/cover-${Date.now()}-${file.name}`;
      
      isAvatar ? setIsUploadingAvatar(true) : setIsUploadingCover(true);

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
          (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              isAvatar ? setAvatarUploadProgress(progress) : setCoverUploadProgress(progress);
          },
          (error) => {
              console.error("Upload error:", error);
              toast({ variant: 'destructive', title: 'Не вдалося завантажити зображення', description: 'Спробуйте ще раз.' });
              isAvatar ? setIsUploadingAvatar(false) : setIsUploadingCover(false);
          },
          () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  const oldUrl = form.getValues(isAvatar ? 'avatarUrl' : 'coverUrl');
                  if (oldUrl) {
                      try {
                          const oldImageRef = ref(storage, oldUrl);
                          deleteObject(oldImageRef).catch(err => console.warn("Could not delete old image:", err));
                      } catch(e) { console.error(e) }
                  }
                  form.setValue(isAvatar ? 'avatarUrl' : 'coverUrl', downloadURL, { shouldValidate: true });
                  isAvatar ? setIsUploadingAvatar(false) : setIsUploadingCover(false);
              });
          }
      );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
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

    handleFileUpload(file, type);
    e.target.value = '';
  };

  const handleImageRemove = async (type: 'avatar' | 'cover') => {
    const isAvatar = type === 'avatar';
    const imageUrl = form.getValues(isAvatar ? 'avatarUrl' : 'coverUrl');
    if (!imageUrl) return;

    try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        form.setValue(isAvatar ? 'avatarUrl' : 'coverUrl', '', { shouldValidate: true });
        toast({ title: 'Зображення видалено.' });
    } catch (error: any) {
        console.error("Error removing image:", error);
        if (error.code === 'storage/object-not-found') {
            form.setValue(isAvatar ? 'avatarUrl' : 'coverUrl', '', { shouldValidate: true });
        } else {
            toast({ variant: 'destructive', title: 'Помилка видалення', description: error.message });
        }
    }
  };


  async function onSubmit(values: ProfileFormValues) {
    if (!profile.uid) return;
    
    try {
      const userDocRef = doc(db, 'users', profile.uid);
      await updateDoc(userDocRef, {
        name: values.name,
        bio: values.bio,
        avatarUrl: values.avatarUrl,
        coverUrl: values.coverUrl,
        introVideoUrl: values.introVideoUrl,
      });
      toast({
        title: "Профіль оновлено!",
        description: "Ваші зміни було успішно збережено.",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Помилка оновлення",
        description: "Не вдалося зберегти зміни. Спробуйте ще раз.",
      });
    }
  }

  const isUploading = isUploadingAvatar || isUploadingCover;

  return (
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Редагувати профіль</DialogTitle>
        <DialogDescription>
          Внесіть зміни у свій профіль. Натисніть "Зберегти", коли закінчите.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-6">
            <FormItem>
                <FormLabel>Аватар</FormLabel>
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={watchedAvatarUrl || undefined} alt={profile.name} />
                        <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isUploadingAvatar ? (
                        <div className="w-full">
                            <p className="text-sm text-muted-foreground mb-2">Завантажуємо аватар...</p>
                            <Progress value={avatarUploadProgress} className="w-full" />
                            <p className="text-sm mt-2 text-muted-foreground">{Math.round(avatarUploadProgress)}%</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <label htmlFor="avatar-upload-edit">
                                <Button asChild variant="outline">
                                    <span><Upload className="mr-2 h-4 w-4" /> Завантажити</span>
                                </Button>
                            </label>
                            {watchedAvatarUrl && (
                                <Button variant="ghost" size="icon" onClick={() => handleImageRemove('avatar')}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                <input id="avatar-upload-edit" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileSelect(e, 'avatar')} disabled={isUploading} />
                <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => ( <FormItem className="hidden"><FormControl><Input {...field} /></FormControl></FormItem> )}
                />
            </FormItem>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ім'я</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваше ім'я" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Про себе</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Розкажіть трохи про себе..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Фон профілю</FormLabel>
              <FormDescription>Завантажте фонове зображення для вашого публічного профілю.</FormDescription>
              {watchedCoverUrl ? (
                  <div className="relative group">
                      <Image src={watchedCoverUrl} alt="Попередній перегляд фону" width={400} height={225} className="rounded-md object-cover w-full aspect-video" />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <label htmlFor="cover-url-upload-edit">
                              <Button asChild size="icon" variant="secondary" className="h-7 w-7 cursor-pointer">
                                  <span><Upload className="h-4 w-4" /></span>
                              </Button>
                          </label>
                          <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleImageRemove('cover')}>
                              <X className="h-4 w-4" />
                          </Button>
                      </div>
                  </div>
              ) : (
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      {isUploadingCover ? (
                          <>
                              <p className="text-sm text-muted-foreground mb-2">Завантажуємо зображення...</p>
                              <Progress value={coverUploadProgress} className="w-full" />
                              <p className="text-sm mt-2 text-muted-foreground">{Math.round(coverUploadProgress)}%</p>
                          </>
                      ) : (
                          <>
                              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                              <label htmlFor="cover-url-upload-edit" className="mt-4 inline-block cursor-pointer">
                                  <Button asChild variant="outline">
                                      <span><Upload className="mr-2 h-4 w-4" /> Завантажити фон</span>
                                  </Button>
                              </label>
                              <p className="text-xs text-muted-foreground mt-2">Підтримуються JPG, PNG, WEBP. Макс. розмір 5MB.</p>
                          </>
                      )}
                  </div>
              )}
              <input id="cover-url-upload-edit" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleFileSelect(e, 'cover')} disabled={isUploading} />
              <FormField
                  control={form.control}
                  name="coverUrl"
                  render={({ field }) => ( <FormItem className="hidden"><FormControl><Input {...field} /></FormControl></FormItem> )}
              />
            </div>
            
            {/* Intro Video Section (Placeholder/Future Integration) */}
            <div className="space-y-3 pt-2 border-t border-muted/30">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-bold">Intro-Video (Презентація)</FormLabel>
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Coming Soon</span>
              </div>
              <FormDescription className="text-xs">
                Коротке відео (до 15 сек) для знайомства з клієнтами. Наразі підтримується тільки пряме посилання.
              </FormDescription>
              
              <FormField
                control={form.control}
                name="introVideoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="https://example.com/video.mp4" {...field} className="text-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="p-3 border border-dashed border-muted rounded-md bg-muted/5 flex flex-col items-center justify-center gap-2 opacity-60">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Завантаження відео буде доступне згодом</p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Скасувати</Button>
            <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Завантаження...' : 'Зберегти зміни'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
