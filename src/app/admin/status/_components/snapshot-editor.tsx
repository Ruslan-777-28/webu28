'use client';

import React, { useState } from 'react';
import { useStatusAdmin } from './status-admin-provider';
import { SnapshotMetadata } from '@/lib/status/types';
import { StatusAdminAdapters } from '@/lib/status/admin-adapters';
import { snapshotSchema, SnapshotFormValues } from '@/lib/status/admin-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Calendar, CheckCircle2, Globe } from 'lucide-react';

/**
 * Snapshots Management UI.
 */
export function SnapshotEditor() {
    const { snapshots, saveSnapshot, deleteSnapshot } = useStatusAdmin();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const form = useForm<SnapshotFormValues>({
        resolver: zodResolver(snapshotSchema),
        defaultValues: {
            snapshotId: '',
            title: '',
            snapshotType: 'seasonal',
            effectiveDate: new Date().toISOString().split('T')[0],
            periodLabel: '',
            description: '',
            published: false,
            isDemo: true
        }
    });

    const handleEdit = (s: SnapshotMetadata) => {
        setEditingId(s.snapshotId);
        form.reset(StatusAdminAdapters.snapshot.toForm(s));
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingId(null);
        form.reset({
            snapshotId: `snapshot-${Date.now()}`,
            title: '',
            snapshotType: 'seasonal',
            effectiveDate: new Date().toISOString().split('T')[0],
            periodLabel: '',
            description: '',
            published: false,
            isDemo: true
        });
        setIsFormOpen(true);
    };

    const onSubmit = (values: SnapshotFormValues) => {
        saveSnapshot(StatusAdminAdapters.snapshot.fromForm(values));
        setIsFormOpen(false);
    };

    // Filter out internal permanent snapshot for the editor list
    const editableSnapshots = snapshots.filter(s => s.snapshotId !== 'permanent');

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Time Snapshots</h3>
                <Button onClick={handleAdd} size="sm" className="h-8 gap-2 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground border-accent/20">
                    <Plus className="w-4 h-4" /> New Snapshot
                </Button>
            </div>

            <div className="rounded-xl border border-muted/20 bg-background/50 overflow-hidden backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-muted/5">
                        <TableRow className="hover:bg-transparent border-muted/10">
                            <TableHead className="w-[280px] text-[10px] uppercase tracking-tighter">Snapshot</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-tighter">Type</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-tighter">Date / Label</TableHead>
                            <TableHead className="text-center text-[10px] uppercase tracking-tighter">Status</TableHead>
                            <TableHead className="text-right text-[10px] uppercase tracking-tighter pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {editableSnapshots.map((s) => (
                            <TableRow key={s.snapshotId} className="group border-muted/10 hover:bg-muted/5 transition-colors">
                                <TableCell className="py-3">
                                    <div className="font-bold text-foreground/90 flex items-center gap-2">
                                        {s.title}
                                        {s.isDemo && <Badge variant="outline" className="text-[8px] h-3 px-1 border-muted/20 opacity-50">DEMO</Badge>}
                                    </div>
                                    <div className="text-[10px] font-mono text-muted-foreground/60">{s.snapshotId}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize text-[10px] font-medium h-4 px-1.5">
                                        {s.snapshotType}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {s.effectiveDate}
                                    </div>
                                    <div className="text-[10px] font-bold text-foreground/70">{s.periodLabel}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {s.published ? <Globe className="w-3.5 h-3.5 text-green-500 mx-auto fill-green-500/10" /> : <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/30 mx-auto" />}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(s)} className="h-7 w-7 hover:bg-accent/10 hover:text-accent">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => deleteSnapshot(s.snapshotId)} className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-xl border-accent/20">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Snapshot' : 'Create New Snapshot'}</DialogTitle>
                        <DialogDescription className="text-xs">Налаштуйте часовий проміжок для фіксації системних результатів (зрізів).</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="snapshotId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">System ID</FormLabel>
                                        <FormControl><Input placeholder="snapshot-id" {...field} disabled={!!editingId} className="h-9 text-xs font-mono" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Display Title</FormLabel>
                                        <FormControl><Input placeholder="Назва (напр. Весна 2026)" {...field} className="h-9 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Description</FormLabel>
                                    <FormControl><Textarea placeholder="Опис періоду..." {...field} className="text-xs min-h-[60px]" /></FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )}/>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="snapshotType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="monthly" className="text-xs">Monthly</SelectItem>
                                                <SelectItem value="seasonal" className="text-xs">Seasonal</SelectItem>
                                                <SelectItem value="yearly" className="text-xs">Yearly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="periodLabel" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Period Label (Public UI)</FormLabel>
                                        <FormControl><Input placeholder="Spring 2026" {...field} className="h-9 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="effectiveDate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Effective Date</FormLabel>
                                        <FormControl><Input type="date" {...field} className="h-9 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <div className="flex items-end pb-1">
                                    <FormField control={form.control} name="published" render={({ field }) => (
                                        <FormItem className="flex items-center justify-between space-y-0 w-full p-2.5 rounded-lg border border-muted/20 bg-muted/5">
                                            <div className="space-y-0">
                                                <FormLabel className="text-[10px]">Published</FormLabel>
                                                <FormDescription className="text-[8px] leading-tight">Видимий в архіві.</FormDescription>
                                            </div>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                                        </FormItem>
                                    )}/>
                                </div>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-9">
                                    {editingId ? 'Save Snapshot' : 'Create Snapshot'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
