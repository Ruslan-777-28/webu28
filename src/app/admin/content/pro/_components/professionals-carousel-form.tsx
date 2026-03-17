'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, setDoc, serverTimestamp, addDoc, deleteDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProProfessionalsBlock, ProProfessionalItem } from '@/lib/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, PlusCircle, Trash2, ImageIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const blockSchema = z.object({
  isActive: z.boolean().default(true),
  sectionTitle: z.string().min(1, 'Required'),
  sectionDescription: z.string().min(1, 'Required'),
});
type BlockFormValues = z.infer<typeof blockSchema>;

const itemSchema = z.object({
    isActive: z.boolean().default(true),
    sortOrder: z.coerce.number(),
    name: z.string().min(1, 'Required'),
    roleLine: z.string().min(1, 'Required'),
    description: z.string().min(1, 'Required'),
    imageUrl: z.string().url().or(z.literal('')),
    imageAlt: z.string().optional(),
});
type ItemFormValues = z.infer<typeof itemSchema>;


function ItemEditDialog({ item, onSave, onCancel }: { item: Partial<ProProfessionalItem>, onSave: (data: ItemFormValues, itemId?: string) => void, onCancel: () => void }) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const form = useForm<ItemFormValues>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            isActive: item.isActive ?? true,
            sortOrder: item.sortOrder ?? 0,
            name: item.name ?? '',
            roleLine: item.roleLine ?? '',
            description: item.description ?? '',
            imageUrl: item.imageUrl ?? '',
            imageAlt: item.imageAlt ?? '',
        }
    });

    const handleImageUpload = (file: File) => {
        if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });
        setIsUploading(true);
        const storagePath = `site-content/pro/professionals-already-with-us/${item.id || 'new'}/image-${Date.now()}-${file.name}`;
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
                    form.setValue('imageUrl', url, { shouldValidate: true });
                    setIsUploading(false);
                    toast({ title: 'Image uploaded!' });
                });
            }
        );
    };
    
    return (
        <DialogContent className="sm:max-w-xl">
             <Form {...form}>
                <form onSubmit={form.handleSubmit((v) => onSave(v, item.id))} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{item.id ? 'Edit' : 'Add'} Professional Card</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto p-1 space-y-4">
                        <FormField control={form.control} name="isActive" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><FormLabel>Active</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="sortOrder" render={({ field }) => (
                            <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                         <FormField control={form.control} name="roleLine" render={({ field }) => (
                            <FormItem><FormLabel>Role / Specialization</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                        )} />
                         <FormItem>
                            <FormLabel>Image</FormLabel>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16"><AvatarImage src={form.getValues('imageUrl')} /><AvatarFallback><ImageIcon/></AvatarFallback></Avatar>
                                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} disabled={isUploading} className='w-auto' />
                            </div>
                            {isUploading && <Progress value={uploadProgress} className="mt-2" />}
                        </FormItem>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                        <Button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Save'}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}


export function ProfessionalsCarouselForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<ProProfessionalItem[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<ProProfessionalItem> | null>(null);

  const blockDocRef = doc(db, 'sitePages', 'pro', 'contentBlocks', 'professionals-already-with-us');
  const itemsCollectionRef = collection(blockDocRef, 'items');

  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: { isActive: true, sectionTitle: '', sectionDescription: '' },
  });

  useEffect(() => {
    const unsubBlock = onSnapshot(blockDocRef, (doc) => {
      if (doc.exists()) form.reset(doc.data() as BlockFormValues);
      setIsLoading(false);
    });
    
    const itemsQuery = query(itemsCollectionRef, orderBy('sortOrder', 'asc'));
    const unsubItems = onSnapshot(itemsQuery, (snapshot) => {
        const fetchedItems = snapshot.docs.map(d => ({...d.data(), id: d.id } as ProProfessionalItem));
        setItems(fetchedItems);
    });

    return () => {
        unsubBlock();
        unsubItems();
    };
  }, [form]);

  async function onBlockSubmit(values: BlockFormValues) {
    if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });
    try {
      await setDoc(blockDocRef, { ...values, updatedAt: serverTimestamp(), updatedBy: user.uid, });
      toast({ title: 'Section details updated!' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error saving content', description: error.message });
    }
  }

  const handleSaveItem = async (data: ItemFormValues, itemId?: string) => {
    if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });
    const payload = { ...data, updatedAt: serverTimestamp(), updatedBy: user.uid };
    try {
        if (itemId) {
            await setDoc(doc(itemsCollectionRef, itemId), payload, { merge: true });
            toast({ title: 'Item updated!' });
        } else {
            await addDoc(itemsCollectionRef, payload);
            toast({ title: 'Item added!' });
        }
        setEditingItem(null);
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error saving item', description: error.message });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
     if (!user) return toast({ variant: 'destructive', title: 'Authentication Error' });
     try {
        await deleteDoc(doc(itemsCollectionRef, itemId));
        toast({ title: 'Item deleted.' });
     } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error deleting item', description: error.message });
     }
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onBlockSubmit)} className="space-y-4 p-4 border rounded-lg">
                 <FormField control={form.control} name="isActive" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between"><FormLabel>Section is Active</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                 )} />
                <FormField control={form.control} name="sectionTitle" render={({ field }) => (
                    <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="sectionDescription" render={({ field }) => (
                    <FormItem><FormLabel>Section Description</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                 <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>Save Section Details</Button>
            </form>
        </Form>

        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Carousel Items</h3>
                <Button onClick={() => setEditingItem({})}><PlusCircle className="mr-2"/> Add Item</Button>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead className='text-right'>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.sortOrder}</TableCell>
                                <TableCell><Avatar><AvatarImage src={item.imageUrl} /><AvatarFallback><ImageIcon/></AvatarFallback></Avatar></TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell><Switch checked={item.isActive} disabled/></TableCell>
                                <TableCell className='text-right'>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}><Edit className="h-4 w-4"/></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteItem(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
            {editingItem && <ItemEditDialog item={editingItem} onSave={handleSaveItem} onCancel={() => setEditingItem(null)} />}
        </Dialog>
    </div>
  );
}
