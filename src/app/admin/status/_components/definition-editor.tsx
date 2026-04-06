'use client';

import React, { useState } from 'react';
import { useStatusAdmin } from './status-admin-provider';
import { StatusAwardDefinition } from '@/lib/status/types';
import { StatusAdminAdapters } from '@/lib/status/admin-adapters';
import { definitionSchema, DefinitionFormValues } from '@/lib/status/admin-schemas';
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
import { Plus, Edit2, Trash2, ShieldCheck, Zap, MoreHorizontal } from 'lucide-react';
import { LAYER_TYPE_LOCALE } from '@/lib/status/constants';

/**
 * Award Definitions Management UI.
 */
export function DefinitionEditor() {
    const { definitions, saveDefinition, deleteDefinition } = useStatusAdmin();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const form = useForm<DefinitionFormValues>({
        resolver: zodResolver(definitionSchema),
        defaultValues: {
            id: '',
            title: '',
            shortLabel: '',
            description: '',
            layerType: 'seasonal',
            assignmentType: 'algorithmic',
            rarity: 'common',
            icon: 'award',
            displayPriority: 99,
            visibleInProfile: true,
            visibleInLegend: true,
            active: true,
            eligibleForHallOfFame: false
        }
    });

    const handleEdit = (d: StatusAwardDefinition) => {
        setEditingId(d.id);
        form.reset(StatusAdminAdapters.definition.toForm(d));
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingId(null);
        form.reset({
            id: `def-${Date.now()}`,
            title: '',
            shortLabel: '',
            description: '',
            layerType: 'seasonal',
            assignmentType: 'algorithmic',
            rarity: 'common',
            icon: 'award',
            displayPriority: 99,
            visibleInProfile: true,
            visibleInLegend: true,
            active: true,
            eligibleForHallOfFame: false
        });
        setIsFormOpen(true);
    };

    const onSubmit = (values: DefinitionFormValues) => {
        saveDefinition(StatusAdminAdapters.definition.fromForm(values));
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Award Definitions</h3>
                <Button onClick={handleAdd} size="sm" className="h-8 gap-2 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground border-accent/20">
                    <Plus className="w-4 h-4" /> New Definition
                </Button>
            </div>

            <div className="rounded-xl border border-muted/20 bg-background/50 overflow-hidden backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-muted/5">
                        <TableRow className="hover:bg-transparent border-muted/10">
                            <TableHead className="w-[280px] text-[10px] uppercase tracking-tighter">Definition</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-tighter">Layer</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-tighter">Rarity</TableHead>
                            <TableHead className="text-center text-[10px] uppercase tracking-tighter">Status</TableHead>
                            <TableHead className="text-right text-[10px] uppercase tracking-tighter pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {definitions.map((d) => (
                            <TableRow key={d.id} className="group border-muted/10 hover:bg-muted/5 transition-colors">
                                <TableCell className="py-3">
                                    <div className="font-bold text-foreground/90 flex items-center gap-2">
                                        {d.title}
                                        {d.eligibleForHallOfFame && <ShieldCheck className="w-3 h-3 text-accent" />}
                                    </div>
                                    <div className="text-[10px] font-mono text-muted-foreground/60">{d.id}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-tight px-1.5 py-0 h-4 border-muted/30">
                                        {LAYER_TYPE_LOCALE[d.layerType] || d.layerType}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize text-[10px] font-medium h-4 px-1.5">
                                        {d.rarity}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {d.active ? <Zap className="w-3.5 h-3.5 text-yellow-500 mx-auto fill-yellow-500/20" /> : <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground/30 mx-auto" />}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(d)} className="h-7 w-7 hover:bg-accent/10 hover:text-accent">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => deleteDefinition(d.id)} className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive">
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
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto border-accent/20">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Definition' : 'Create New Definition'}</DialogTitle>
                        <DialogDescription className="text-xs">Налаштуйте параметри відображення та правила для цієї нагороди.</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="id" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">System ID</FormLabel>
                                        <FormControl><Input placeholder="unique-id" {...field} disabled={!!editingId} className="h-9 text-xs font-mono" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Title (Public)</FormLabel>
                                        <FormControl><Input placeholder="Назва нагороди" {...field} className="h-9 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Description</FormLabel>
                                    <FormControl><Textarea placeholder="Опис нагороди..." {...field} className="text-xs min-h-[60px]" /></FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )}/>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="layerType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Layer Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="permanent" className="text-xs">Permanent</SelectItem>
                                                <SelectItem value="yearly" className="text-xs">Yearly</SelectItem>
                                                <SelectItem value="seasonal" className="text-xs">Seasonal</SelectItem>
                                                <SelectItem value="snapshot" className="text-xs">Snapshot</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="assignmentType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Assignment Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select logic" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="algorithmic" className="text-xs">Algorithmic</SelectItem>
                                                <SelectItem value="hybrid" className="text-xs">Hybrid</SelectItem>
                                                <SelectItem value="editorial" className="text-xs">Editorial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="rarity" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Rarity</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select rarity" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="common" className="text-xs">Common</SelectItem>
                                                <SelectItem value="rare" className="text-xs">Rare</SelectItem>
                                                <SelectItem value="legendary" className="text-xs">Legendary</SelectItem>
                                                <SelectItem value="unique" className="text-xs">Unique</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="icon" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Lucide Icon Name</FormLabel>
                                        <FormControl><Input placeholder="award, trophy, star..." {...field} className="h-9 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/20 border border-muted/10">
                                <FormField control={form.control} name="active" render={({ field }) => (
                                    <FormItem className="flex items-center justify-between space-y-0">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-[11px]">Active Definition</FormLabel>
                                            <FormDescription className="text-[9px]">Доступна в системі.</FormDescription>
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="eligibleForHallOfFame" render={({ field }) => (
                                    <FormItem className="flex items-center justify-between space-y-0">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-[11px]">Hall of Fame Eligibility</FormLabel>
                                            <FormDescription className="text-[9px]">Може бути в HoF.</FormDescription>
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                                    </FormItem>
                                )}/>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="visibleInProfile" render={({ field }) => (
                                    <FormItem className="flex items-center justify-between space-y-0 p-2 rounded border border-muted/5">
                                        <FormLabel className="text-[10px]">Show in Profile Shelf</FormLabel>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="visibleInLegend" render={({ field }) => (
                                    <FormItem className="flex items-center justify-between space-y-0 p-2 rounded border border-muted/5">
                                        <FormLabel className="text-[10px]">Show in Legend Page</FormLabel>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                                    </FormItem>
                                )}/>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-9">
                                    {editingId ? 'Save Definition' : 'Create Definition'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
