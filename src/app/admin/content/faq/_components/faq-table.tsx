'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, HelpCircle, PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { FaqItem } from '@/lib/types';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { FaqForm } from './faq-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';

export function FaqTable({ items, isLoading }: { items: FaqItem[], isLoading: boolean }) {
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEdit = (item: FaqItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    try {
        await deleteDoc(doc(db, 'faqItems', itemId));
        toast({ title: 'FAQ item deleted successfully.' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error deleting item', description: error.message });
    }
  };
  
  return (
    <div className="space-y-4">
        <div className="flex justify-end">
            <Button onClick={handleCreate}>
                <PlusCircle className="mr-2" />
                Create FAQ Item
            </Button>
        </div>
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className='w-16'>Order</TableHead>
                <TableHead className="w-1/3">Question</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>On /pro</TableHead>
                <TableHead>On /user</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                ))
                ) : items.length > 0 ? (
                items.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className='font-mono'>{item.sortOrder}</TableCell>
                    <TableCell className="font-medium max-w-md truncate">{item.question}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{item.audience}</Badge></TableCell>
                    <TableCell>{item.showOnProPage ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{item.showOnCommunityPage ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                        <Badge variant={item.isActive ? 'default' : 'secondary'}>
                            {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone and will permanently delete this FAQ item.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <HelpCircle className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No FAQ items found.</p>
                            <Button variant="outline" size="sm" onClick={handleCreate}>Create First Item</Button>
                        </div>
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild />
            <FaqForm item={editingItem} setOpen={setIsDialogOpen} />
        </Dialog>
    </div>
  );
}
