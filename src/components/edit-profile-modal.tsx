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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { db, storage, functions } from "@/lib/firebase/client";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import React, { useState } from 'react';
import Image from "next/image";
import { Progress } from "./ui/progress";
import { ImageIcon, Upload, X } from "lucide-react";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/hooks/use-auth";

import { COUNTRIES } from "@/lib/countries";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Ім'я має містити щонайменше 2 символи." }),
  shortBio: z.string().max(140, { message: "Максимум 140 символів." }).optional().or(z.literal('')),
  bio: z.string().max(1200, { message: "Максимум 1200 символів." }).optional().or(z.literal('')),
  preferredLanguage: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  timezone: z.string().optional().or(z.literal('')),
  extraDetails: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  introVideoUrl: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileModal({ profile, setOpen }: { profile: UserProfile, setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const { user } = useUser();
  
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || "",
      shortBio: profile.shortBio || "",
      bio: profile.bio || "",
      preferredLanguage: profile.preferredLanguage || "",
      country: profile.country || "",
      timezone: profile.timezone || "",
      extraDetails: profile.extraDetails || "",
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
      
      const updateData: any = {
        name: values.name,
        shortBio: values.shortBio || "",
        bio: values.bio || "",
        preferredLanguage: values.preferredLanguage || "",
        country: values.country || "",
        timezone: values.timezone || "",
        extraDetails: values.extraDetails || "",
        avatarUrl: values.avatarUrl || "",
        coverUrl: values.coverUrl || "",
        introVideoUrl: values.introVideoUrl || "",
        updatedAt: serverTimestamp(),
      };

      // Filter out undefined just in case, though they should be strings from defaultValues
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) delete updateData[key];
      });

      await updateDoc(userDocRef, updateData);
      toast({
        title: "Профіль оновлено!",
        description: "Ваші зміни було успішно збережено.",
      });

      // Check for points milestones via shared Cloud Function
      if (user) {
        const checkMilestones = httpsCallable(functions, 'checkProfileBonusMilestones');
        checkMilestones()
          .then((result) => {
            console.log("Milestones check result:", result.data);
          })
          .catch((err) => {
            console.warn("Milestone check failed:", err);
          });
      }

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
    <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>Редагувати профіль</DialogTitle>
        <DialogDescription>
          Внесіть зміни у свій профіль. Натисніть "Зберегти", коли закінчите.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Section 1: Main */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Основне</h3>
              </div>

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
                    <FormLabel>Публічне ім'я</FormLabel>
                    <FormControl>
                      <Input placeholder="Ваше ім'я" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Короткий статус</FormLabel>
                    <FormControl>
                      <Input placeholder="Ваше кредо або короткий опис" {...field} />
                    </FormControl>
                    <FormDescription>Максимум 140 символів.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferredLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Мова спілкування</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть мову" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="uk-UA">Українська</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                          <SelectItem value="pl-PL">Polski</SelectItem>
                          <SelectItem value="de-DE">Deutsch</SelectItem>
                          <SelectItem value="fr-FR">Français</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Країна</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Оберіть країну" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.nameUk}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Часовий пояс</FormLabel>
                    <FormControl>
                      <Input placeholder="Наприклад: UTC+2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 2: About Me */}
            <div className="space-y-6 pt-4 border-t border-muted/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Про себе</h3>
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Біографія</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Розкажіть трохи про себе..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="extraDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цінності, підхід, додаткові подробиці</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Опишіть ваш підхід, принципи роботи, цінності або важливі деталі для клієнтів" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 3: Media */}
            <div className="space-y-6 pt-4 border-t border-muted/30 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Медіа</h3>
              </div>

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
          </div>

          <DialogFooter className="p-6 border-t bg-muted/5">
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
