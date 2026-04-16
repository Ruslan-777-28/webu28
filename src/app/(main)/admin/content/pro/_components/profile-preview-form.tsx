'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProHowUsersSeeYouBlock, ProInteractionType } from '@/lib/types';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, PlusCircle, ImageIcon, MessageSquare, Video, Paperclip, BookOpen, Package, User, Loader2, X, Calendar } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const interactionSchema = z.object({
  type: z.enum(['text', 'video', 'file', 'calendar']),
  topText: z.string().default(''),
  label: z.string().min(1, 'Required'),
  subLabel: z.string().min(1, 'Required'),
  isVisible: z.boolean().default(true),
});

const moduleSchema = z.object({
  title: z.string().min(1, 'Required'),
  subtitle: z.string().min(1, 'Required'),
  hint: z.string().min(1, 'Required'),
  isVisible: z.boolean().default(true),
});

const formSchema = z.object({
  isActive: z.boolean().default(true),
  sectionTitle: z.string().min(1, 'Required'),
  sectionDescription: z.string().min(1, 'Required'),

  identity: z.object({
    avatarImageUrl: z.string().url().or(z.literal('')),
    displayName: z.string().min(1, 'Required'),
    statusLabel: z.string(),
    headline: z.string().min(1, 'Required'),
    languages: z.string().min(1, 'Required'),
    metaLine: z.string().min(1, 'Required'),
    countryCode: z.string().optional().default(''),
  }),

  specializations: z.array(z.string().min(1, 'Cannot be empty')).max(4),

  interactions: z.array(interactionSchema).length(4),

  rightModules: z.object({
    publications: moduleSchema,
    artifacts: moduleSchema,
    biography: moduleSchema,
  }),
});

type FormValues = z.infer<typeof formSchema>;

const normalizeInteractionType = (type: string): ProInteractionType => {
  if (['text', 'video', 'file', 'calendar'].includes(type)) return type as ProInteractionType;
  return 'text';
};

export function ProfilePreviewForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const docRef = doc(db, 'sitePages', 'pro', 'contentBlocks', 'how-users-see-you');

  const defaultInteraction = (type: ProInteractionType): z.infer<typeof interactionSchema> => ({
    type,
    topText: '',
    label: 
      type === 'text' ? 'Чат сесія' : 
      type === 'video' ? 'Відео виклик' : 
      type === 'file' ? 'Аналіз файлу' : 'Календар',
    subLabel: type === 'calendar' ? 'Оберіть зручний час' : 'Отримайте відповідь',
    isVisible: true,
  });

  const defaultModule = (title: string): z.infer<typeof moduleSchema> => ({
    title,
    subtitle: 'Переглянути деталі',
    hint: 'Натисніть для переходу',
    isVisible: true,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
      sectionTitle: '',
      sectionDescription: '',
      identity: {
        avatarImageUrl: '',
        displayName: '',
        statusLabel: 'Online',
        headline: '',
        languages: '',
        metaLine: '',
        countryCode: '',
      },
      specializations: [''],
      interactions: [
        defaultInteraction('text'),
        defaultInteraction('video'),
        defaultInteraction('file'),
        defaultInteraction('calendar'),
      ],
      rightModules: {
        publications: defaultModule('Публікації'),
        artifacts: defaultModule('Артефакти'),
        biography: defaultModule('Біографія'),
      },
    },
  });

  const watchSpecializations = form.watch('specializations');
  const watchInteractions = form.watch('interactions');

  const addSpecialization = () => {
    const current = form.getValues('specializations');
    if (current.length < 4) {
      form.setValue('specializations', [...current, ''], { shouldDirty: true });
    }
  };

  const removeSpecialization = (index: number) => {
    const current = form.getValues('specializations');
    form.setValue('specializations', current.filter((_, i) => i !== index), { shouldDirty: true });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ProHowUsersSeeYouBlock;
          
          // --- Manual Migration for Backward Compatibility ---
          const initialValues: FormValues = {
            isActive: data.isActive ?? true,
            sectionTitle: data.sectionTitle || '',
            sectionDescription: data.sectionDescription || '',
            identity: {
              avatarImageUrl: data.identity?.avatarImageUrl || data.imageUrl || '',
              displayName: data.identity?.displayName || data.cardPersonName || '',
              statusLabel: data.identity?.statusLabel || data.cardStatusLabel || 'Online',
              headline: data.identity?.headline || data.cardHeadline || '',
              languages: data.identity?.languages || data.cardLanguages || '',
              metaLine: data.identity?.metaLine || 'В екосистемі з 2024',
              countryCode: data.identity?.countryCode || '',
            },
            specializations: data.specializations || (data as any).cardDirections || [''],
            interactions: [
                ...(data.interactions || [
                    defaultInteraction('text'),
                    defaultInteraction('video'),
                    defaultInteraction('file'),
                ]),
                ...( (data.interactions?.length || 0) < 4 ? [defaultInteraction('calendar')] : [] )
            ].slice(0, 4).map(i => ({ 
                ...i, 
                type: normalizeInteractionType(i.type),
                topText: i.topText || '' 
            })),
            rightModules: data.rightModules || {
                publications: defaultModule('Публікації'),
                artifacts: defaultModule('Артефакти'),
                biography: defaultModule('Біографія'),
            },
          };

          form.reset(initialValues);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [form]);
  
  const handleImageUpload = (file: File) => {
    if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });
    setIsUploading(true);
    const storagePath = `site-content/pro/how-users-see-you/avatar-${Date.now()}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => {
        console.error("Upload error:", error);
        toast({ variant: 'destructive', title: 'Image upload failed' });
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const oldUrl = form.getValues('identity.avatarImageUrl');
          if (oldUrl) {
            try { deleteObject(ref(storage, oldUrl)).catch(console.warn); } catch(e) { console.error(e) }
          }
          form.setValue('identity.avatarImageUrl', url, { shouldValidate: true });
          setIsUploading(false);
          toast({ title: 'Image uploaded!' });
        });
      }
    );
  };

  const removeAvatar = () => {
    const oldUrl = form.getValues('identity.avatarImageUrl');
    if (oldUrl) {
        try { deleteObject(ref(storage, oldUrl)).catch(console.warn); } catch(e) { console.error(e) }
    }
    form.setValue('identity.avatarImageUrl', '', { shouldValidate: true });
  };

  async function onSubmit(values: FormValues) {
    if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });

    try {
      await setDoc(docRef, {
        ...values,
        specializations: values.specializations.filter(Boolean).slice(0, 4),
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      toast({ title: 'Showcase content updated!' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error saving content', description: error.message });
    }
  }

  if (isLoading) return <Skeleton className="h-[600px] w-full" />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl">
        {/* Section A: Global Meta */}
        <Card>
            <CardHeader><CardTitle>A. Section Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="isActive" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Section is Active</FormLabel>
                            <FormDescription>Show or hide the showcase block on the /pro page.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="sectionTitle" render={({ field }) => (
                    <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sectionDescription" render={({ field }) => (
                    <FormItem><FormLabel>Section Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
        </Card>

        {/* Section B: Identity Block (Left Zone) */}
        <Card>
            <CardHeader><CardTitle>B. Identity Block (Left Zone)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormItem>
                    <FormLabel>Avatar Image</FormLabel>
                    <div className="flex items-center gap-6 p-4 rounded-xl border border-dashed">
                        <div className="relative group">
                            <Avatar className="h-28 w-28 border-2 border-background shadow-md">
                                <AvatarImage src={form.getValues('identity.avatarImageUrl')} />
                                <AvatarFallback className="bg-muted"><ImageIcon className="h-10 w-10 text-muted-foreground/40" /></AvatarFallback>
                            </Avatar>
                            {form.getValues('identity.avatarImageUrl') && (
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
                                    onClick={removeAvatar}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="sm" className="relative cursor-pointer" disabled={isUploading}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                                    {form.getValues('identity.avatarImageUrl') ? 'Replace Image' : 'Upload Avatar'}
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        accept="image/*" 
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                    />
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Recommended: Square image, min 400x400px.</p>
                        </div>
                    </div>
                    {isUploading && <Progress value={uploadProgress} className="h-1 mt-2" />}
                </FormItem>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="identity.displayName" render={({ field }) => (
                        <FormItem><FormLabel>Display Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="identity.statusLabel" render={({ field }) => (
                        <FormItem><FormLabel>Status Label</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>e.g. "Online"</FormDescription><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="identity.headline" render={({ field }) => (
                    <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="identity.languages" render={({ field }) => (
                        <FormItem><FormLabel>Languages</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField
                        control={form.control}
                        name="identity.metaLine"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Line (Trust/History)</FormLabel>
                            <FormControl>
                              <Input placeholder="В екосистемі з 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="identity.countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country Code</FormLabel>
                          <FormControl>
                            <Input placeholder="UA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </CardContent>
        </Card>

        {/* Section C: Specializations (Center Zone - Top) */}
        <Card>
            <CardHeader><CardTitle>C. Specializations (Center Zone - Top)</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {watchSpecializations.map((_, index) => (
                        <FormField key={index} control={form.control} name={`specializations.${index}`} render={({ field }) => (
                            <FormItem>
                                <div className='flex items-center gap-2'>
                                    <FormControl><Input {...field} placeholder="e.g. Tarot, Energetics..." /></FormControl>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecialization(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    ))}
                    {watchSpecializations.length < 4 && (
                        <Button type="button" size="sm" variant="outline" className="mt-2" onClick={addSpecialization}><PlusCircle className="mr-2 h-4 w-4" /> Add Specialization</Button>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-2">Maximum 4 specializations appear in the showcase header.</p>
                </div>
            </CardContent>
        </Card>

        {/* Section D: Interaction Methods (Center Zone - Main Strip) */}
        <Card>
            <CardHeader><CardTitle>D. Interaction Methods (Center Zone - Middle)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {watchInteractions.map((_, index) => (
                        <div key={index} className="p-4 rounded-xl border bg-muted/20 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Method {index + 1}</span>
                                <FormField control={form.control} name={`interactions.${index}.isVisible`} render={({ field }) => (
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                )} />
                            </div>
                            <FormField control={form.control} name={`interactions.${index}.type`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select 
                                        value={field.value} 
                                        onValueChange={(v) => field.onChange(normalizeInteractionType(v))}
                                    >
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="text"><div className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Chat</div></SelectItem>
                                            <SelectItem value="video"><div className="flex items-center gap-2"><Video className="h-4 w-4" /> Video</div></SelectItem>
                                            <SelectItem value="file"><div className="flex items-center gap-2"><Paperclip className="h-4 w-4" /> File</div></SelectItem>
                                            <SelectItem value="calendar"><div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Calendar</div></SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name={`interactions.${index}.topText`} render={({ field }) => (
                                <FormItem><FormLabel>Top Text</FormLabel><FormControl><Input {...field} placeholder="e.g. 1 COIN / Q&A" /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name={`interactions.${index}.label`} render={({ field }) => (
                                <FormItem><FormLabel>Label</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name={`interactions.${index}.subLabel`} render={({ field }) => (
                                <FormItem><FormLabel>Sub-Label</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Section E: Right Preview Modules */}
        <Card>
            <CardHeader><CardTitle>E. Right Preview Modules</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                {[
                    { key: 'publications', icon: BookOpen, label: 'Publications' },
                    { key: 'artifacts', icon: Package, label: 'Artifacts' },
                    { key: 'biography', icon: User, label: 'Biography' }
                ].map((mod) => (
                    <div key={mod.key} className="p-4 rounded-xl border space-y-4">
                        <div className="flex items-center justify-between border-b pb-2 mb-2">
                            <div className="flex items-center gap-2 font-semibold">
                                <mod.icon className="h-4 w-4 text-accent" />
                                {mod.label} Module
                            </div>
                            <FormField control={form.control} name={`rightModules.${mod.key}.isVisible` as any} render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name={`rightModules.${mod.key}.title` as any} render={({ field }) => (
                                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name={`rightModules.${mod.key}.subtitle` as any} render={({ field }) => (
                                <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                            <FormField control={form.control} name={`rightModules.${mod.key}.hint` as any} render={({ field }) => (
                                <FormItem><FormLabel>Hint Text</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-between pt-4 pb-20">
            <p className="text-sm text-muted-foreground">Carefully check all zones before saving.</p>
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting || isUploading}>
                {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Showcase Content'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
