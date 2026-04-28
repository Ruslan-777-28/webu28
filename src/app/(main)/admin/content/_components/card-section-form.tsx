'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import type { CardSectionData, CardSectionSlide } from '@/lib/types';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Trash2, PlusCircle, ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const slideSchema = z.object({
  id: z.string(),
  imageUrl: z.string().url().or(z.literal('')),
  imageAlt: z.string().optional(),
  order: z.coerce.number().default(0),
  enabled: z.boolean().default(true),
  label: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

const formSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().min(1, 'Заголовок обов’язковий'),
  subtitle: z.string().min(1, 'Підзаголовок обов’язковий'),
  carouselImages: z.array(slideSchema).max(3, 'Максимум 3 слайди'),
});

type FormValues = z.infer<typeof formSchema>;

interface CardSectionFormProps {
  docId: string; // 'pro' | 'forCommunity'
}

export function CardSectionForm({ docId }: CardSectionFormProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [isUploading, setIsUploading] = useState<Record<number, boolean>>({});

  const docRef = doc(db, 'sitePages', docId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: true,
      title: '',
      subtitle: '',
      carouselImages: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'carouselImages',
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const docReference = doc(db, 'sitePages', docId);
        const docSnap = await getDoc(docReference);
        if (docSnap.exists() && isMounted) {
          const data = docSnap.data();
          if (data.cardSection) {
            form.reset(data.cardSection as FormValues);
          }
        }
      } catch (error) {
        console.error("Error fetching cardSection:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [form, docId]);

  const handleImageUpload = (file: File, index: number) => {
    if (!user) return toast({ variant: 'destructive', title: 'Помилка авторизації' });
    
    setIsUploading(prev => ({ ...prev, [index]: true }));
    setUploadProgress(prev => ({ ...prev, [index]: 0 }));
    
    const storagePath = `site-content/${docId}/card-section/slide-${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prev => ({ ...prev, [index]: progress }));
      },
      (error) => {
        console.error("Upload error:", error);
        toast({ variant: 'destructive', title: 'Помилка завантаження', description: 'Спробуйте ще раз.' });
        setIsUploading(prev => ({ ...prev, [index]: false }));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const oldUrl = form.getValues(`carouselImages.${index}.imageUrl`);
          if (oldUrl) {
            try { deleteObject(ref(storage, oldUrl)).catch(console.warn); } catch (e) { console.error(e) }
          }
          form.setValue(`carouselImages.${index}.imageUrl`, url, { shouldValidate: true });
          setIsUploading(prev => ({ ...prev, [index]: false }));
          toast({ title: 'Зображення завантажено!' });
        });
      }
    );
  };

  async function onSubmit(values: FormValues) {
    if (!user) return toast({ variant: 'destructive', title: 'Помилка авторизації' });

    try {
      // Create a deep sanitized payload to prevent Firestore "undefined" errors
      const cleanCarouselImages = values.carouselImages.map((slide, index) => ({
        id: slide.id || `slide-${Date.now()}-${index}`,
        imageUrl: slide.imageUrl || '',
        imageAlt: slide.imageAlt || '',
        order: Number(slide.order) || 0,
        enabled: Boolean(slide.enabled),
        label: slide.label || '',
        title: slide.title || '',
        description: slide.description || '',
      }));

      const cleanValues = {
        enabled: Boolean(values.enabled),
        title: values.title || '',
        subtitle: values.subtitle || '',
        carouselImages: cleanCarouselImages,
      };

      await setDoc(docRef, {
        cardSection: cleanValues,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      }, { merge: true });
      
      toast({ title: 'Секцію збережено успішно!' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Помилка збереження', description: error.message });
    }
  }

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="enabled" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
            <div className="space-y-0.5">
              <FormLabel>Відображати секцію</FormLabel>
              <FormDescription>Увімкнути чи вимкнути секцію "Картка" на сторінці.</FormDescription>
            </div>
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Текстова частина</h3>
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Заголовок</FormLabel>
              <FormControl><Input {...field} placeholder="Наприклад: Жива стрічка: місце, де експертність стає видимою" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="subtitle" render={({ field }) => (
            <FormItem>
              <FormLabel>Підзаголовок</FormLabel>
              <FormControl><Textarea {...field} className="min-h-[100px]" placeholder="Ваша активність не залишається тільки в профілі..." /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">Карусель зображень</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => append({ id: Date.now().toString(), imageUrl: '', order: fields.length, enabled: true, label: '', title: '', description: '' })}
              disabled={fields.length >= 3}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Додати слайд
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative pt-6">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-md z-10"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="space-y-4 pt-2">
                  <div className="aspect-[9/16] bg-muted/30 rounded-md border flex flex-col items-center justify-center overflow-hidden relative">
                    {form.watch(`carouselImages.${index}.imageUrl`) ? (
                      <img 
                        src={form.watch(`carouselImages.${index}.imageUrl`)} 
                        alt="Slide preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">Немає зображення</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel>Завантажити зображення</FormLabel>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], index)} 
                      disabled={isUploading[index]} 
                    />
                    {isUploading[index] && <Progress value={uploadProgress[index]} className="mt-2 h-2" />}
                    <FormField control={form.control} name={`carouselImages.${index}.imageUrl`} render={({ field }) => (
                      <FormItem className="hidden"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name={`carouselImages.${index}.imageAlt`} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt текст</FormLabel>
                      <FormControl><Input {...field} placeholder="Опис для SEO" /></FormControl>
                    </FormItem>
                  )} />

                  <div className="space-y-4 pt-2 border-t mt-4">
                    <FormField control={form.control} name={`carouselImages.${index}.label`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label / Тип</FormLabel>
                        <FormControl><Input {...field} value={field.value || ''} placeholder="ПУБЛІКАЦІЯ" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name={`carouselImages.${index}.title`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Small Title</FormLabel>
                        <FormControl><Input {...field} value={field.value || ''} placeholder="Короткий заголовок слайда" /></FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name={`carouselImages.${index}.description`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea {...field} value={field.value || ''} placeholder="Короткий опис цього слайда" className="min-h-[80px]" /></FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name={`carouselImages.${index}.order`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Порядок</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`carouselImages.${index}.enabled`} render={({ field }) => (
                      <FormItem className="flex flex-col items-start justify-center pt-2">
                        <FormLabel className="mb-2">Увімкнено</FormLabel>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {fields.length === 0 && (
              <div className="col-span-full py-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                Немає слайдів. Додайте перший слайд для каруселі.
              </div>
            )}
          </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting || Object.values(isUploading).some(v => v)} className="w-full md:w-auto">
          {form.formState.isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
        </Button>
      </form>
    </Form>
  );
}
