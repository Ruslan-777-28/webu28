'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProHowUsersSeeYouBlock } from '@/lib/types';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, PlusCircle, ImageIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const formSchema = z.object({
  isActive: z.boolean().default(true),
  sectionTitle: z.string().min(1, 'Required'),
  sectionDescription: z.string().min(1, 'Required'),
  imageUrl: z.string().url().or(z.literal('')),
  imageAlt: z.string(),
  cardPersonName: z.string().min(1, 'Required'),
  cardHeadline: z.string().min(1, 'Required'),
  cardLanguages: z.string().min(1, 'Required'),
  cardStatusLabel: z.string(),
  cardDirections: z.array(z.string().min(1, 'Cannot be empty')),
  cardButtonLabel: z.string().min(1, 'Required'),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfilePreviewForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const docRef = doc(db, 'sitePages', 'pro', 'contentBlocks', 'how-users-see-you');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
      sectionTitle: '',
      sectionDescription: '',
      imageUrl: '',
      imageAlt: '',
      cardPersonName: '',
      cardHeadline: '',
      cardLanguages: '',
      cardStatusLabel: 'Online',
      cardDirections: [''],
      cardButtonLabel: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'cardDirections' });

  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        form.reset(docSnap.data() as FormValues);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);
  
  const handleImageUpload = (file: File) => {
    if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });
    setIsUploading(true);
    const storagePath = `site-content/pro/how-users-see-you/image-${Date.now()}-${file.name}`;
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
          const oldUrl = form.getValues('imageUrl');
          if (oldUrl) {
            try { deleteObject(ref(storage, oldUrl)).catch(console.warn); } catch(e) { console.error(e) }
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

    const payload: Omit<ProHowUsersSeeYouBlock, 'updatedAt' | 'updatedBy'> = {
        ...values,
        cardDirections: values.cardDirections.filter(Boolean),
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
        
        <FormField control={form.control} name="sectionTitle" render={({ field }) => (
          <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="sectionDescription" render={({ field }) => (
          <FormItem><FormLabel>Section Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <h3 className="font-semibold pt-4 border-t">Preview Card Content</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <FormItem>
                <FormLabel>Person's Image</FormLabel>
                <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24"><AvatarImage src={form.getValues('imageUrl')} /><AvatarFallback><ImageIcon/></AvatarFallback></Avatar>
                    <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} disabled={isUploading} className='w-auto' />
                </div>
                {isUploading && <Progress value={uploadProgress} className="mt-2" />}
            </FormItem>
             <FormField control={form.control} name="cardPersonName" render={({ field }) => (
                <FormItem><FormLabel>Person's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="cardHeadline" render={({ field }) => (
                <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="cardLanguages" render={({ field }) => (
                <FormItem><FormLabel>Languages</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="space-y-4">
            <FormField control={form.control} name="cardStatusLabel" render={({ field }) => (
                <FormItem><FormLabel>Status Label</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>e.g. "Online". Leave empty to hide.</FormDescription><FormMessage /></FormItem>
            )} />
            <div>
                <FormLabel>Directions</FormLabel>
                {fields.map((field, index) => (
                    <FormField key={field.id} control={form.control} name={`cardDirections.${index}`} render={({ field }) => (
                        <FormItem><div className='flex items-center gap-2'><FormControl><Input {...field} /></FormControl><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div><FormMessage /></FormItem>
                    )}/>
                ))}
                <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => append('')}><PlusCircle className="mr-2 h-4 w-4" /> Add Direction</Button>
            </div>
             <FormField control={form.control} name="cardButtonLabel" render={({ field }) => (
                <FormItem><FormLabel>Button Label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
