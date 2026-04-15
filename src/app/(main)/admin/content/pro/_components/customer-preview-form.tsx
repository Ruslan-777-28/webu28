'use client';

import { useForm, useFieldArray, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProKnowYourCustomerBlock } from '@/lib/types';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, PlusCircle, Upload, X, ImageIcon, Star, Globe, ShieldCheck, Repeat, Video, Phone, PhoneOff, History, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const formSchema = z.object({
  isActive: z.boolean().default(true),
  sectionTitle: z.string().min(1, 'Required'),
  sectionDescription: z.string().min(1, 'Required'),
  bullets: z.array(z.string()),
  cardTitle: z.string().min(1, 'Required'),
  imageUrl: z.string().url().or(z.literal('')),
  imageAlt: z.string(),
  cardPersonName: z.string().min(1, 'Required'),
  cardMetaText: z.string().min(1, 'Required'),
  cardRatingValue: z.coerce.number().min(0).max(5),
  cardCompletedSessions: z.coerce.number().min(0),
  cardReviewsCount: z.coerce.number().min(0).default(0),
  cardTags: z.array(z.string()),
  reservedMinutes: z.coerce.number().min(0).default(4),
  reservedReward: z.coerce.number().min(0).default(80),
  rewardCurrencyLabel: z.string().default('кредитів'),
  translationEnabled: z.boolean().default(true),
  languagePair: z.string().default('англійська / іспанська'),
  countryCode: z.string().default('gb'),
});

type FormValues = z.infer<typeof formSchema>;

export function CustomerPreviewForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const docRef = doc(db, 'sitePages', 'pro', 'contentBlocks', 'know-your-customer');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
      sectionTitle: '',
      sectionDescription: '',
      bullets: [''],
      cardTitle: '',
      imageUrl: '',
      imageAlt: '',
      cardPersonName: '',
      cardMetaText: '',
      cardRatingValue: 0,
      cardCompletedSessions: 0,
      cardReviewsCount: 0,
      cardTags: [''],
      reservedMinutes: 4,
      reservedReward: 80,
      rewardCurrencyLabel: 'кредитів',
      translationEnabled: true,
      languagePair: 'англійська / іспанська',
      countryCode: 'gb',
    },
  });

  const { fields: bulletFields, append: appendBullet, remove: removeBullet } = useFieldArray({ 
    control: form.control as Control<any>, 
    name: 'bullets' 
  });
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ 
    control: form.control as Control<any>, 
    name: 'cardTags'
  });

  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        form.reset(docSnap.data() as FormValues);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [form]);

  const handleImageUpload = (file: File) => {
    if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });
    setIsUploading(true);
    const storagePath = `site-content/pro/know-your-customer/image-${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => {
        console.error("Upload error:", error);
        toast({ variant: 'destructive', title: 'Image upload failed', description: 'Please try again.' });
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const oldUrl = form.getValues('imageUrl');
          if (oldUrl) {
            try { deleteObject(ref(storage, oldUrl)).catch(console.warn); } catch (e) { console.error(e) }
          }
          form.setValue('imageUrl', url, { shouldValidate: true });
          setIsUploading(false);
          toast({ title: 'Image uploaded!' });
        });
      }
    );
  };
  
  async function onSubmit(values: FormValues) {
    if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });

    const payload: Omit<ProKnowYourCustomerBlock, 'updatedAt' | 'updatedBy'> = {
        ...values,
        cardTags: values.cardTags.filter(Boolean),
        bullets: values.bullets.filter(Boolean)
    };

    try {
      await setDoc(docRef, {
        ...payload,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      toast({ title: 'Content updated successfully!' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error saving content', description: error.message });
    }
  }

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Section is Active</FormLabel><FormDescription>Turn this section on or off on the public site.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
        )} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className='space-y-4'>
                <h3 className='font-semibold'>Left Side (Text Content)</h3>
                 <FormField control={form.control} name="sectionTitle" render={({ field }) => (
                    <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sectionDescription" render={({ field }) => (
                    <FormItem><FormLabel>Section Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div>
                    <FormLabel>Bullet Points</FormLabel>
                    {bulletFields.map((field, index) => (
                        <FormField key={field.id} control={form.control} name={`bullets.${index}`} render={({ field }) => (
                            <FormItem><div className='flex items-center gap-2'><FormControl><Input {...field} /></FormControl><Button type="button" variant="ghost" size="icon" onClick={() => removeBullet(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div><FormMessage /></FormItem>
                        )}/>
                    ))}
                    <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => appendBullet('')}><PlusCircle className="mr-2 h-4 w-4" /> Add Bullet</Button>
                </div>
            </div>
            <div className='space-y-4'>
                <h3 className='font-semibold'>Right Side (Preview Card)</h3>
                <FormField control={form.control} name="cardTitle" render={({ field }) => (
                    <FormItem><FormLabel>Card Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cardPersonName" render={({ field }) => (
                    <FormItem><FormLabel>Person's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormItem>
                    <FormLabel>Person's Image</FormLabel>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16"><AvatarImage src={form.getValues('imageUrl')} /><AvatarFallback><ImageIcon/></AvatarFallback></Avatar>
                        <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} disabled={isUploading} className='w-auto' />
                    </div>
                    {isUploading && <Progress value={uploadProgress} className="mt-2" />}
                </FormItem>
                <FormField control={form.control} name="cardMetaText" render={({ field }) => (
                    <FormItem><FormLabel>Meta Text (e.g. "Учасник з 2024")</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className='flex gap-4'>
                    <FormField control={form.control} name="cardRatingValue" render={({ field }) => (
                        <FormItem><FormLabel>Rating</FormLabel><FormControl><Input type='number' step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="cardCompletedSessions" render={({ field }) => (
                        <FormItem><FormLabel>Sessions</FormLabel><FormControl><Input type='number' {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="cardReviewsCount" render={({ field }) => (
                        <FormItem><FormLabel>Reviews</FormLabel><FormControl><Input type='number' {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <FormField control={form.control} name="reservedMinutes" render={({ field }) => (
                        <FormItem><FormLabel>Reserved Minutes</FormLabel><FormControl><Input type='number' {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="reservedReward" render={({ field }) => (
                        <FormItem><FormLabel>Reserved Reward</FormLabel><FormControl><Input type='number' {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <FormField control={form.control} name="rewardCurrencyLabel" render={({ field }) => (
                        <FormItem><FormLabel>Reward Currency Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="countryCode" render={({ field }) => (
                        <FormItem><FormLabel>Country Code (Flag)</FormLabel><FormControl><Input {...field} placeholder="gb, ua, us..." /></FormControl><FormDescription>Use ISO 2-letter codes.</FormDescription><FormMessage /></FormItem>
                    )} />
                </div>

                <div className="space-y-4 pt-2 border-t border-border/40">
                    <FormField control={form.control} name="translationEnabled" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <FormLabel className="text-sm">Translation Enabled</FormLabel>
                                <FormDescription className="text-xs">Show translation block on card.</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="languagePair" render={({ field }) => (
                        <FormItem><FormLabel>Language Pair</FormLabel><FormControl><Input {...field} placeholder="англійська / іспанська" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div>
                    <FormLabel>Tags</FormLabel>
                    {tagFields.map((field, index) => (
                        <FormField key={field.id} control={form.control} name={`cardTags.${index}`} render={({ field }) => (
                            <FormItem><div className='flex items-center gap-2'><FormControl><Input {...field} /></FormControl><Button type="button" variant="ghost" size="icon" onClick={() => removeTag(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div><FormMessage /></FormItem>
                        )}/>
                    ))}
                    <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => appendTag('')}><PlusCircle className="mr-2 h-4 w-4" /> Add Tag</Button>
                </div>
                <div className="pt-6 border-t border-border/60">
                    <h3 className="font-semibold mb-6">Visual Preview</h3>
                    <div className="max-w-[340px] mx-auto lg:mx-0">
                        <div className="bg-background py-4 px-5 rounded-xl shadow-md border border-border/80 flex flex-col h-full">
                            <div className="flex flex-col space-y-1.5">
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
                                        Замовник
                                    </span>
                                </div>

                                <div className="relative w-full aspect-[2.2/1] overflow-hidden rounded-lg border border-border/40 shadow-inner group">
                                    <img
                                        src={form.watch('imageUrl') || "https://picsum.photos/seed/client1/400/200"}
                                        alt={form.watch('imageAlt')}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="pt-0.5 flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-base leading-none text-foreground truncate">{form.watch('cardPersonName') || 'Full Name'}</h4>
                                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{form.watch('cardMetaText') || 'Client Headline'}</p>
                                    </div>
                                    {form.watch('countryCode') && (
                                        <span className={`fi fi-${form.watch('countryCode').toLowerCase()} w-5 h-3.5 shadow-sm rounded-[1px] shrink-0`} />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-3.5">
                                <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                                    <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Рейтинг</p>
                                    <div className="flex items-center gap-1 font-bold text-sm">
                                        <Star className="w-3 h-3 text-accent fill-accent" />
                                        {form.watch('cardRatingValue')}
                                    </div>
                                </div>
                                <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                                    <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Сесії</p>
                                    <div className="flex items-center gap-1 font-bold text-sm">
                                        <History className="w-3 h-3 text-muted-foreground/60" />
                                        {form.watch('cardCompletedSessions')}
                                    </div>
                                </div>
                                <div className="bg-muted/30 p-2 rounded-lg border border-border/20 flex flex-col justify-center">
                                    <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-0.5 leading-none">Відгуки</p>
                                    <div className="flex items-center gap-1 font-bold text-sm">
                                        <MessageCircle className="w-3 h-3 text-muted-foreground/60" />
                                        {form.watch('cardReviewsCount')}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 space-y-1 min-h-[40px]">
                                <div className="text-[11px] text-muted-foreground/80 leading-snug">
                                    заброньовано <span className="font-bold text-foreground">{form.watch('reservedMinutes')} хв.</span> професіонала
                                </div>
                                <div className="text-[11px] text-muted-foreground/80 leading-snug">
                                    заброньовано винагорода <span className="font-bold text-foreground">{form.watch('reservedReward')} {form.watch('rewardCurrencyLabel')}</span>
                                </div>
                            </div>

                            {form.watch('translationEnabled') && (
                                <div className="mt-3 p-2.5 rounded-lg border border-dashed border-border/60 bg-accent/2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-3.5 h-3.5 border border-foreground/30 rounded-[2px] bg-background flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-[1px]" />
                                        </div>
                                        <Globe className="w-3.5 h-3.5 text-accent/60" />
                                        <span className="text-[11px] font-medium text-foreground/80 uppercase tracking-tight">застосувати перекладач</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground/60 leading-none pl-[22px]">
                                        мовна пара {form.watch('languagePair')}
                                    </div>
                                </div>
                            )}

                            <div className="mt-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-[10px] uppercase tracking-wide text-muted-foreground/80 shrink-0">Інтереси:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {form.watch('cardTags').slice(0, 2).map((tag, i) => tag && (
                                            <Badge key={i} variant="outline" className="text-[9px] font-medium py-0 px-1.5 bg-muted/20 border-border/40">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
                                <Button size="sm" variant="outline" className="h-8 text-[10px] text-muted-foreground border-border/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center gap-1.5 pointer-events-none">
                                    <PhoneOff className="w-3 h-3 text-red-500/60" />
                                    Відхилити
                                </Button>
                                <Button size="sm" className="h-8 text-[10px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 border shadow-none flex items-center gap-1.5 pointer-events-none">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <Phone className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    Прийняти
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
