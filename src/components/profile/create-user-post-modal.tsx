'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import type { BlogSettings, UserProfile } from '@/lib/types';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react';

interface CreateUserPostModalProps {
  profile: UserProfile;
  setOpen: (open: boolean) => void;
  onPostCreated?: () => void;
}

const MAX_IMAGE_SIZE_MB = 10;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export function CreateUserPostModal({ profile, setOpen, onPostCreated }: CreateUserPostModalProps) {
  const { user } = useUser();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Taxonomy
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Load taxonomy from blogSettings/main
  useEffect(() => {
    const settingsRef = doc(db, 'blogSettings', 'main');
    const unsub = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as BlogSettings);
      }
      setSettingsLoading(false);
    }, () => {
      setSettingsLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    return settings?.categories?.filter(c => c.id && c.name) || [];
  }, [settings]);

  const subcategories = useMemo(() => {
    if (!categoryId || !settings) return [];
    const cat = settings.categories.find(c => c.id === categoryId);
    return cat?.subcategories?.filter(s => s.id && s.name) || [];
  }, [categoryId, settings]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategoryId('');
  }, [categoryId]);

  // Validation
  const isValid = useMemo(() => {
    return title.trim().length >= 3 && content.trim().length >= 10 && categoryId.length > 0;
  }, [title, content, categoryId]);

  // Image upload handler
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Непідтримуваний формат', description: 'Оберіть зображення.' });
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast({ variant: 'destructive', title: 'Файл завеликий', description: `Максимум ${MAX_IMAGE_SIZE_MB}MB.` });
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `posts/${user.uid}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        toast({ variant: 'destructive', title: 'Помилка завантаження', description: 'Спробуйте ще раз.' });
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageUrl(url);
          setIsUploading(false);
        });
      }
    );

    e.target.value = '';
  }, [user, toast]);

  const handleImageRemove = useCallback(() => {
    setImageUrl('');
  }, []);

  // Submit handler
  const handleSubmit = async () => {
    if (!user || !profile || !isValid) return;

    setIsSubmitting(true);

    const payload = {
      // Author
      authorId: user.uid,
      authorName: profile.name || user.displayName || 'Користувач',
      authorAvatarUrl: profile.avatarUrl || user.photoURL || '',

      // Content
      title: title.trim(),
      content: content.trim(),
      excerpt: content.trim().substring(0, 160),

      // Taxonomy
      categoryId,
      subcategoryId: subcategoryId || '',

      // Media
      imageUrl: imageUrl || '',

      // Metrics
      viewCount: 0,

      // Platform identity
      contentType: 'post' as const,
      sourcePlatform: 'site' as const,

      // Publication control — NOT a blog article, NOT going to moderation
      allowSitePublication: false,
      editorialStatus: 'draft' as const,
      sitePublished: false,

      // Visibility
      showInAuthorProfile: true,
      featured: false,
      pinned: false,

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'posts'), payload);

      toast({
        title: 'Публікацію створено!',
        description: "Ваш пост з\u2019явиться у вашому профілі.",
      });

      setOpen(false);
      onPostCreated?.();
    } catch (error: any) {
      console.error('Error creating user post:', error);
      toast({
        variant: 'destructive',
        title: 'Помилка створення',
        description: error.message || 'Не вдалося створити публікацію. Спробуйте ще раз.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[560px] bg-card">
      <DialogHeader>
        <DialogTitle className="text-lg font-black uppercase tracking-wide">
          Нова публікація
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {"Створіть публікацію для вашого профілю. Вона з\u2019явиться у вашій стрічці."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 py-3">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="user-post-title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Назва публікації
          </Label>
          <Input
            id="user-post-title"
            placeholder="Введіть назву..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="h-10"
          />
          {title.trim().length > 0 && title.trim().length < 3 && (
            <p className="text-[11px] text-destructive">Мінімум 3 символи</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <Label htmlFor="user-post-content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Текст публікації
          </Label>
          <Textarea
            id="user-post-content"
            placeholder="Напишіть текст вашої публікації..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          {content.trim().length > 0 && content.trim().length < 10 && (
            <p className="text-[11px] text-destructive">Мінімум 10 символів</p>
          )}
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Категорія
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={settingsLoading}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Оберіть..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Підкатегорія
            </Label>
            <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={subcategories.length === 0}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Оберіть..." />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Зображення <span className="font-normal normal-case tracking-normal text-muted-foreground/60">{"(необов\u2019язково)"}</span>
          </Label>

          {imageUrl ? (
            <div className="relative group rounded-lg overflow-hidden border border-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7"
                  onClick={handleImageRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : isUploading ? (
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted/40 rounded-lg p-5 text-center hover:border-accent/30 transition-colors">
              <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <label htmlFor="user-post-image-upload" className="cursor-pointer inline-block">
                <Button asChild variant="outline" size="sm" className="h-8 text-xs font-bold">
                  <span><Upload className="mr-1.5 h-3 w-3" /> Завантажити</span>
                </Button>
              </label>
              <p className="text-[10px] text-muted-foreground/50 mt-1.5">JPG, PNG, WEBP · до {MAX_IMAGE_SIZE_MB}MB</p>
            </div>
          )}
          <input
            id="user-post-image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
      </div>

      <DialogFooter className="pt-3 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isSubmitting}
          className="font-bold text-xs uppercase tracking-wider"
        >
          Скасувати
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting || isUploading}
          className="font-bold text-xs uppercase tracking-wider gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Створення...
            </>
          ) : (
            'Опублікувати'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
