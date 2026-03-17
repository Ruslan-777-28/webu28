'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
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
import { Trash2, PlusCircle, Upload, X, ImageIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const formSchema = z.object({
  isActive: z.boolean().default(true),
  sectionTitle: z.string().min(1, 'Required'),
  sectionDescription: z.string().min(1, 'Required'),
  bullets: z.array(z.string().min(1, 'Bullet point cannot be empty')),
  cardTitle: z.string().min(1, 'Required'),
  imageUrl: z.string().url().or(z.literal('')),
  imageAlt: z.string(),
  cardPersonName: z.string().min(1, 'Required'),
  cardMetaText: z.string().min(1, 'Required'),
  cardRatingValue: z.coerce.number().min(0).max(5),
  cardCompletedSessions: z.coerce.number().min(0),
  cardTags: z.array(z.string().min(1, 'Tag cannot be empty')),
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
      cardTags: [''],
    },
  });

  const { fields: bulletFields, append: appendBullet, remove: removeBullet } = useFieldArray({ control: form.control, name: 'bullets' });
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control: form.control, name: 'cardTags' });

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        form.reset(doc.data() as FormValues);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
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
            </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
