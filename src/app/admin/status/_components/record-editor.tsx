'use client';

import React, { useState, useMemo } from 'react';
import { useStatusAdmin } from './status-admin-provider';
import { StatusAwardRecord } from '@/lib/status/types';
import { StatusAdminAdapters } from '@/lib/status/admin-adapters';
import { recordSchema, RecordFormValues } from '@/lib/status/admin-schemas';
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
import { Plus, Edit2, Trash2, Search, User, Award } from 'lucide-react';
import { LEVEL_LOCALE } from '@/lib/status/constants';

/**
 * Award Records Management UI.
 */
export function RecordEditor() {
    const { records, definitions, snapshots, saveRecord, deleteRecord } = useStatusAdmin();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const form = useForm<RecordFormValues>({
        resolver: zodResolver(recordSchema),
        defaultValues: {
            id: '',
            userId: '',
            userDisplayName: '',
            subcategoryKey: 'таро',
            awardDefinitionId: '',
            snapshotId: 'snapshot-spring-2026',
            level: 'winner',
            featuredOnProfile: true,
            archiveVisible: true,
            isDemo: true
        }
    });

    const filteredRecords = useMemo(() => {
        if (!searchQuery) return records;
        const q = searchQuery.toLowerCase();
        return records.filter(r => 
            r.userDisplayName.toLowerCase().includes(q) || 
            definitions.find(d => d.id === r.awardDefinitionId)?.title.toLowerCase().includes(q)
        );
    }, [records, searchQuery, definitions]);

    const handleEdit = (r: StatusAwardRecord) => {
        setEditingId(r.id);
        form.reset(StatusAdminAdapters.record.toForm(r));
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingId(null);
        form.reset({
            id: `rec-${Date.now()}`,
            userId: 'usr-demo-1',
            userDisplayName: 'New User',
            subcategoryKey: 'таро',
            awardDefinitionId: definitions[0]?.id || '',
            snapshotId: snapshots.find(s => s.published)?.snapshotId || snapshots[0]?.snapshotId || '',
            level: 'winner',
            featuredOnProfile: true,
            archiveVisible: true,
            isDemo: true
        });
        setIsFormOpen(true);
    };

    const onSubmit = (values: RecordFormValues) => {
        saveRecord(StatusAdminAdapters.record.fromForm(values));
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Award Records</h3>
                    <div className="relative w-64 group">
                        <Search className="absolute left-2.5 top-2.5 w-3 h-3 text-muted-foreground/40 group-focus-within:text-accent transition-colors" />
                        <Input 
                            placeholder="Find user or award..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 pl-8 text-xs bg-muted/5 border-muted/20 focus-visible:ring-accent/30"
                        />
                    </div>
                </div>
                <Button onClick={handleAdd} size="sm" className="h-8 gap-2 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground border-accent/20">
                    <Plus className="w-4 h-4" /> Assign Award
                </Button>
            </div>

            <div className="rounded-xl border border-muted/20 bg-background/50 overflow-hidden backdrop-blur-sm">
                <div className="max-h-[500px] overflow-y-auto">
                    <Table>
                        <TableHeader className="bg-muted/5 sticky top-0 z-10">
                            <TableRow className="hover:bg-transparent border-muted/10">
                                <TableHead className="w-[200px] text-[10px] uppercase tracking-tighter">User</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-tighter">Award / Period</TableHead>
                                <TableHead className="text-[10px] uppercase tracking-tighter">Category</TableHead>
                                <TableHead className="text-center text-[10px] uppercase tracking-tighter">Level</TableHead>
                                <TableHead className="text-right text-[10px] uppercase tracking-tighter pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.map((r) => {
                                const def = definitions.find(d => d.id === r.awardDefinitionId);
                                const snap = snapshots.find(s => s.snapshotId === r.snapshotId);
                                return (
                                    <TableRow key={r.id} className="group border-muted/10 hover:bg-muted/5 transition-colors">
                                        <TableCell className="py-3">
                                            <div className="font-bold text-foreground/90 flex items-center gap-1.5 leading-tight">
                                                <User className="w-3 h-3 text-muted-foreground/30" />
                                                {r.userDisplayName}
                                            </div>
                                            <div className="text-[10px] font-mono text-muted-foreground/50">{r.userId}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent/70 leading-tight">
                                                <Award className="w-3 h-3" />
                                                {def?.title || '??'}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground/60">{snap?.periodLabel || r.snapshotId}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-tight px-1.5 py-0 h-4 border-muted/20 text-muted-foreground/80">
                                                {r.subcategoryKey}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className="text-[8px] h-3.5 px-1 bg-muted/20 text-muted-foreground hover:bg-muted/30 border-none uppercase tracking-tighter leading-none">
                                                {LEVEL_LOCALE[r.level || 'holder']}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(r)} className="h-7 w-7 hover:bg-accent/10 hover:text-accent">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => deleteRecord(r.id)} className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl border-accent/20">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Award Record' : 'Assign New Award'}</DialogTitle>
                        <DialogDescription className="text-xs">Зв’яжіть нагороду з профілем конкретного експерта.</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="userId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Target User ID</FormLabel>
                                        <FormControl><Input placeholder="usr-xxx" {...field} className="h-9 text-xs font-mono" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="userDisplayName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">User Name (Admin Only Title)</FormLabel>
                                        <FormControl><Input placeholder="Full Name" {...field} className="h-9 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="awardDefinitionId" render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="text-xs">Choose Award</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select award" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {definitions.map(d => (
                                                    <SelectItem key={d.id} value={d.id} className="text-xs">{d.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="level" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Recognition Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="winner" className="text-xs">Winner</SelectItem>
                                                <SelectItem value="finalist" className="text-xs">Finalist</SelectItem>
                                                <SelectItem value="nominee" className="text-xs">Nominee</SelectItem>
                                                <SelectItem value="honor" className="text-xs">Honor</SelectItem>
                                                <SelectItem value="holder" className="text-xs">Holder / Active</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="snapshotId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Related Period</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select period" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="permanent" className="text-xs font-bold text-accent">Permanent (Lifetime)</SelectItem>
                                                {snapshots.filter(s => s.snapshotId !== 'permanent').sort((a,b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()).map(s => (
                                                    <SelectItem key={s.snapshotId} value={s.snapshotId} className="text-xs">{s.periodLabel}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="subcategoryKey" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Subcategory Key</FormLabel>
                                        <FormControl><Input placeholder="таро, астрологія, наставники..." {...field} className="h-9 text-xs" /></FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}/>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/20 border border-muted/10">
                                <FormField control={form.control} name="featuredOnProfile" render={({ field }) => (
                                    <FormItem className="flex items-center justify-between space-y-0 p-1 rounded hover:bg-muted/10 transition-colors">
                                        <div className="space-y-0">
                                            <FormLabel className="text-[10px]">Show in Profile</FormLabel>
                                            <FormDescription className="text-[8px]">Відображати на полиці.</FormDescription>
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="archiveVisible" render={({ field }) => (
                                    <FormItem className="flex items-center justify-between space-y-0 p-1 rounded hover:bg-muted/10 transition-colors">
                                        <div className="space-y-0">
                                            <FormLabel className="text-[10px]">Archive Visible</FormLabel>
                                            <FormDescription className="text-[8px]">Показувати в історії.</FormDescription>
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                                    </FormItem>
                                )}/>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-9">
                                    {editingId ? 'Update Record' : 'Save & Assign'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
