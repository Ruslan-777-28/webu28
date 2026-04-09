'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaqItem } from '@/lib/types';
import { useUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/client';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters.'),
  answer: z.string().min(10, 'Answer must be at least 10 characters.'),
  sortOrder: z.coerce.number().int().min(0, 'Sort order must be a positive number.'),
  audience: z.enum(['professional', 'community', 'general']),
  isActive: z.boolean().default(true),
  showOnProPage: z.boolean().default(false),
  showOnCommunityPage: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface FaqFormProps {
  item: FaqItem | null;
  setOpen: (open: boolean) => void;
}

export function FaqForm({ item, setOpen }: FaqFormProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const isEditing = !!item;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: item?.question ?? '',
      answer: item?.answer ?? '',
      sortOrder: item?.sortOrder ?? 0,
      audience: item?.audience ?? 'general',
      isActive: item?.isActive ?? true,
      showOnProPage: item?.showOnProPage ?? false,
      showOnCommunityPage: item?.showOnCommunityPage ?? false,
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error' });
      return;
    }

    try {
      if (isEditing) {
        const docRef = doc(db, 'faqItems', item.id);
        await setDoc(docRef, {
          ...values,
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
        }, { merge: true });
        toast({ title: 'FAQ item updated successfully.' });
      } else {
        await addDoc(collection(db, 'faqItems'), {
          ...values,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
        });
        toast({ title: 'FAQ item created successfully.' });
      }
      setOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error saving item', description: error.message });
    }
  }

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit' : 'Create'} FAQ Item</DialogTitle>
        <DialogDescription>
          Fill out the form below to manage an FAQ item.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-h-[70vh] overflow-y-auto p-1 space-y-4">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                            <Textarea className="min-h-32" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="sortOrder"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Sort Order</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="audience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Audience</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="community">Community</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-3 pt-4">
                     <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <FormLabel>Active</FormLabel>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="showOnProPage"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div>
                                    <FormLabel>Show on /pro page</FormLabel>
                                    <FormDescription>Display this item in the FAQ section of the "For Experts" page.</FormDescription>
                                </div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="showOnCommunityPage"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div>
                                    <FormLabel>Show on /user page</FormLabel>
                                    <FormDescription>Display this item in the FAQ section of the "For Community" page.</FormDescription>
                                </div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Item'}
                </Button>
            </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
