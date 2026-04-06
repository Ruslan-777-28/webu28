'use client';

import React, { useState } from 'react';
import { useStatusAdmin } from './status-admin-provider';
import { HallOfFameEntry } from '@/lib/status/types';
import { StatusAdminAdapters } from '@/lib/status/admin-adapters';
import { hofEntrySchema, HofEntryFormValues } from '@/lib/status/admin-schemas';
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
import { Plus, Edit2, Trash2, Star, Quote } from 'lucide-react';

/**
 * Hall of Fame Management UI.
 */
export function HofEditor() {
    const { hofEntries, definitions, snapshots, saveHofEntry, deleteHofEntry } = useStatusAdmin();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const form = useForm<HofEntryFormValues>({
        resolver: zodResolver(hofEntrySchema),
        defaultValues: {
            id: '',
            userId: '',
            userDisplayName: '',
            awardDefinitionId: '',
            snapshotId: '',
            subcategoryKey: 'таро',
            titleOverride: '',
            citation: '',
            hallSection: 'seasonal',
            featured: true,
            sortOrder: 99,
            isDemo: true
        }
    });

    const handleEdit = (h: HallOfFameEntry) => {
        setEditingId(h.id);
        form.reset(StatusAdminAdapters.hofEntry.toForm(h));
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingId(null);
        form.reset({
            id: `hof-${Date.now()}`,
            userId: '',
            userDisplayName: '',
            awardDefinitionId: definitions[0]?.id || '',
            snapshotId: snapshots[0]?.snapshotId || '',
            subcategoryKey: 'таро',
            titleOverride: '',
            citation: '',
            hallSection: 'seasonal',
            featured: true,
            sortOrder: 99,
            isDemo: true
        });
        setIsFormOpen(true);
    };

    const onSubmit = (values: HofEntryFormValues) => {
        saveHofEntry(StatusAdminAdapters.hofEntry.fromForm(values));
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Hall of Fame Entries</h3>
                <Button onClick={handleAdd} size="sm" className="h-8 gap-2 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground border-accent/20">
                    <Plus className="w-4 h-4" /> Induct Member
                </Button>
            </div>

            <div className="rounded-xl border border-muted/20 bg-background/50 overflow-hidden backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-muted/5">
                        <TableRow className="hover:bg-transparent border-muted/10">
                            <TableHead className="w-[200px] text-[10px] uppercase tracking-tighter text-muted-foreground font-semibold">User</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-tighter text-muted-foreground font-semibold">Section</TableHead>
                            <TableHead className="text-[10px] uppercase tracking-tighter text-muted-foreground font-semibold">Citation</TableHead>
                            <TableHead className="text-center text-[10px] uppercase tracking-tighter text-muted-foreground font-semibold">Featured</TableHead>
                            <TableHead className="text-right text-[10px] uppercase tracking-tighter text-muted-foreground font-semibold pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hofEntries.map((h) => (
                            <TableRow key={h.id} className="group border-muted/10 hover:bg-muted/5 transition-colors">
                                <TableCell className="py-3">
                                    <div className="font-bold text-foreground/90 leading-tight">{h.userDisplayName}</div>
                                    <div className="text-[10px] font-mono text-muted-foreground/60">{h.userId}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-tight px-1.5 h-4 border-accent/20 text-accent bg-accent/5">
                                        {h.hallSection}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-[300px]">
                                    <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground transition-colors group-hover:text-foreground/70">
                                        <Quote className="w-2.5 h-2.5 mt-0.5 opacity-30 flex-shrink-0" />
                                        <span className="italic line-clamp-2 leading-relaxed">"{h.citation}"</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {h.featured ? <Star className="w-3.5 h-3.5 text-accent mx-auto fill-accent/20" /> : <div className="w-3 h-3 mx-auto rounded-full border border-muted/30" />}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(h)} className="h-7 w-7 hover:bg-accent/10 hover:text-accent">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => deleteHofEntry(h.id)} className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive">
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
                <DialogContent className="max-w-2xl border-accent/20 bg-background/95 backdrop-blur-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                           {editingId ? 'Edit Hall Induction' : 'Induct into Hall of Fame'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">Визначте роль експерта в «Золотому фонді» платформи.</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="userId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Member ID</FormLabel>
                                        <FormControl><Input placeholder="usr-xxx" {...field} className="h-9 text-xs font-mono" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="userDisplayName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Display Name</FormLabel>
                                        <FormControl><Input placeholder="Full Name" {...field} className="h-9 text-xs shadow-sm" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="awardDefinitionId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Award Milestone</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select award" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {definitions.filter(d => d.eligibleForHallOfFame).map(d => (
                                                    <SelectItem key={d.id} value={d.id} className="text-xs">{d.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="hallSection" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">HoF Gallery Section</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select gallery" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="legendary" className="text-xs font-bold text-accent">Legendary Figures</SelectItem>
                                                <SelectItem value="yearly" className="text-xs">Yearly Heroes</SelectItem>
                                                <SelectItem value="seasonal" className="text-xs">Seasonal Breakthroughs</SelectItem>
                                                <SelectItem value="picks" className="text-xs">Editorial Picks</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <FormField control={form.control} name="citation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Citation (Museum Quote)</FormLabel>
                                    <FormControl><Textarea placeholder="Стисло опишіть особливе досягнення..." {...field} className="text-xs min-h-[80px] italic bg-muted/5 shadow-inner" /></FormControl>
                                    <FormMessage className="text-[10px]" />
                                </FormItem>
                            )}/>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="titleOverride" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Custom Title (Optional)</FormLabel>
                                        <FormControl><Input placeholder="напр. Майстер року" {...field} className="h-9 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <div className="flex items-end pb-1">
                                    <FormField control={form.control} name="featured" render={({ field }) => (
                                        <FormItem className="flex items-center justify-between space-y-0 w-full p-2.5 rounded-lg border border-accent/20 bg-accent/5 ring-1 ring-accent/5">
                                            <div className="space-y-0">
                                                <FormLabel className="text-[11px] text-accent font-bold">Featured Entry</FormLabel>
                                                <FormDescription className="text-[9px] text-accent/60 font-medium">Показувати з акцентом.</FormDescription>
                                            </div>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75 data-[state=checked]:bg-accent" /></FormControl>
                                        </FormItem>
                                    )}/>
                                </div>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold h-9 shadow-lg shadow-accent/20">
                                    {editingId ? 'Save Induction Details' : 'Finalize Induction'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
