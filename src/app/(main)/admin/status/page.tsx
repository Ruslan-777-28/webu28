'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Activity, 
  Crown, 
  History, 
  Trophy, 
  Archive, 
  RotateCcw, 
  Download, 
  Upload,
  Eye,
  User,
  Award,
  Search
} from 'lucide-react';

import { StatusAdminProvider, useStatusAdmin } from './_components/status-admin-provider';
import { DefinitionEditor } from './_components/definition-editor';
import { SnapshotEditor } from './_components/snapshot-editor';
import { RecordEditor } from './_components/record-editor';
import { HofEditor } from './_components/hof-editor';

import {
  getStatusAdminSummary,
  getProfileShelfPreview,
  getStatusTablePreview,
  getArchiveSnapshotPreview
} from '@/lib/status/admin-selectors';
import { LEVEL_LOCALE } from '@/lib/status/constants';

type TabView = 'definitions' | 'snapshots' | 'records' | 'hof' | 'archive' | 'preview-profile' | 'preview-table';

/**
 * Main Status Admin Page - Integrated with local state provider.
 */
export default function StatusAdminPage() {
  return (
    <StatusAdminProvider>
      <StatusAdminContent />
    </StatusAdminProvider>
  );
}

function StatusAdminContent() {
  const [activeTab, setActiveTab] = useState<TabView>('records');
  const { 
    definitions, snapshots, records, hofEntries, 
    hasEdits, resetToDemo, exportJson, importJson, isInitialized 
  } = useStatusAdmin();

  const summary = useMemo(() => getStatusAdminSummary({
    definitions, snapshots, records, hofEntries
  }), [definitions, snapshots, records, hofEntries, isInitialized]);

  if (!isInitialized) return (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1200px] animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header & Global Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            Status CMS <Badge variant="outline" className="text-[9px] h-4 uppercase tracking-widest font-mono text-accent border-accent/30 bg-accent/5">V1 Editor</Badge>
          </h1>
          <p className="text-muted-foreground text-[13px] font-medium flex items-center gap-2">
            Редагування статусів та нагород в режимі Local State.
            {hasEdits && (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 uppercase tracking-tighter">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> unsaved
                </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 p-1 bg-muted/5 rounded-xl border border-muted/10">
           <Button variant="ghost" size="sm" onClick={exportJson} className="h-8 gap-2 text-[10px] uppercase font-black tracking-wider hover:bg-foreground/5 transition-all">
             <Download className="w-3.5 h-3.5" /> Export
           </Button>
           <label className="cursor-pointer group">
             <div className="inline-flex items-center justify-center rounded-lg border border-transparent bg-background/50 group-hover:bg-background h-8 px-3 text-[10px] uppercase font-black tracking-wider shadow-sm transition-all gap-2">
               <Upload className="w-3.5 h-3.5" /> Import
               <input type="file" className="hidden" accept=".json" onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => importJson(ev.target?.result as string);
                    reader.readAsText(file);
                 }
               }}/>
             </div>
           </label>
           <div className="w-px h-4 bg-muted/20 mx-1" />
           <Button variant="ghost" size="sm" onClick={resetToDemo} className="h-8 gap-2 text-[10px] uppercase font-black tracking-wider text-destructive hover:text-destructive hover:bg-destructive/10 transition-all">
             <RotateCcw className="w-3.5 h-3.5" /> Reset
           </Button>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <SummaryCard label="Definitions" value={summary.definitionsCount} icon={Database} onClick={() => setActiveTab('definitions')} active={activeTab === 'definitions'} />
        <SummaryCard label="Snapshots" value={summary.snapshotsCount} icon={History} onClick={() => setActiveTab('snapshots')} active={activeTab === 'snapshots'} />
        <SummaryCard label="Total Records" value={summary.recordsCount} icon={Activity} onClick={() => setActiveTab('records')} active={activeTab === 'records'} />
        <SummaryCard label="HoF Members" value={summary.hofEntriesCount} icon={Trophy} onClick={() => setActiveTab('hof')} active={activeTab === 'hof'} className="border-accent/10" />
        <SummaryCard label="Archive Items" value={summary.archiveSnapshotsCount} icon={Archive} onClick={() => setActiveTab('archive')} active={activeTab === 'archive'} className="border-accent/30 text-accent/90" />
        <SummaryCard label="Unique Users" value={summary.uniqueUsersCount} icon={Crown} className="opacity-80" />
      </div>

      {/* Contextual Navigation */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-muted/20 pb-4 px-1">
        <TabButton active={activeTab === 'definitions'} onClick={() => setActiveTab('definitions')}>Editor: Definitions</TabButton>
        <TabButton active={activeTab === 'snapshots'} onClick={() => setActiveTab('snapshots')}>Editor: Timeframes</TabButton>
        <TabButton active={activeTab === 'records'} onClick={() => setActiveTab('records')}>Editor: User Awards</TabButton>
        <TabButton active={activeTab === 'hof'} onClick={() => setActiveTab('hof')}>Editor: Hall of Fame</TabButton>
        
        <div className="w-px h-5 bg-muted/20 mx-2 self-center hidden lg:block" />
        
        <div className="flex items-center gap-2 lg:ml-auto">
            <TabButton active={activeTab === 'archive'} onClick={() => setActiveTab('archive')} variant="outline" className="border-accent/10 h-8 px-3">
              <Archive className="w-3 h-3 mr-1.5 opacity-40" /> Archive Preview
            </TabButton>
            <TabButton active={activeTab === 'preview-profile'} onClick={() => setActiveTab('preview-profile')} variant="outline" className="h-8 px-3">
                <Eye className="w-3 h-3 mr-1.5 opacity-40" /> Shelf Impact
            </TabButton>
            <TabButton active={activeTab === 'preview-table'} onClick={() => setActiveTab('preview-table')} variant="outline" className="h-8 px-3">
                <Eye className="w-3 h-3 mr-1.5 opacity-40" /> Table Impact
            </TabButton>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="min-h-[600px] pb-10">
        {activeTab === 'definitions' && <DefinitionEditor />}
        {activeTab === 'snapshots' && <SnapshotEditor />}
        {activeTab === 'records' && <RecordEditor />}
        {activeTab === 'hof' && <HofEditor />}
        {activeTab === 'archive' && <ArchivePreviewTab />}
        {activeTab === 'preview-profile' && <ProfilePreviewTab />}
        {activeTab === 'preview-table' && <TablePreviewTab />}
      </div>
    </div>
  );
}

/**
 * HELPER COMPONENTS
 */

function SummaryCard({ label, value, icon: Icon, onClick, active, className }: { label: string, value: number, icon: any, onClick?: () => void, active?: boolean, className?: string }) {
    return (
        <Card 
            className={`cursor-pointer transition-all hover:scale-105 active:scale-95 border-muted/20 bg-card/50 backdrop-blur-sm ${active ? 'ring-2 ring-accent border-accent/20' : ''} ${className}`}
            onClick={onClick}
        >
          <div className="p-4 flex flex-col gap-1">
             <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
                <Icon className="w-3 h-3 opacity-40" />
             </div>
             <div className="text-2xl font-black tracking-tight">{value}</div>
          </div>
        </Card>
    );
}

function TabButton({ children, active, onClick, className, variant = 'ghost' }: { children: React.ReactNode, active: boolean, onClick: () => void, className?: string, variant?: 'ghost' | 'outline' }) {
    if (variant === 'outline') {
        return (
            <Button 
                variant="outline" 
                size="sm" 
                onClick={onClick}
                className={`h-9 text-[10px] uppercase font-black tracking-wider transition-all rounded-lg ${active ? 'bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20' : 'text-muted-foreground hover:bg-accent/5 hover:text-accent'} ${className}`}
            >
                {children}
            </Button>
        );
    }
    return (
        <Button 
            variant={active ? 'default' : 'ghost'} 
            size="sm" 
            onClick={onClick}
            className={`h-9 text-[10px] uppercase font-black tracking-wider transition-all rounded-lg ${active ? 'bg-foreground text-background shadow-lg shadow-foreground/20' : 'text-muted-foreground hover:bg-muted font-bold'} ${className}`}
        >
            {children}
        </Button>
    );
}

/**
 * PREVIEW TABS
 */

function ProfilePreviewTab() {
  const { definitions, snapshots, records } = useStatusAdmin();
  const [usr, setUsr] = useState('usr-demo-1');
  const [subcat, setSubcat] = useState('таро');
  const results = getProfileShelfPreview(usr, subcat, { definitions, snapshots, records });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5 px-1">
         <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4 text-accent" /> Profile Shelf Impact
         </h3>
         <p className="text-xs text-muted-foreground italic">Simulation of what an expert will see on their profile page.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
         <div className="md:col-span-4 space-y-4">
            <Card className="border-muted/20 bg-background/50">
               <CardHeader className="p-4"><CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Test Parameters</CardTitle></CardHeader>
               <CardContent className="p-4 pt-0 space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-muted-foreground/60">Target User ID</label>
                     <Input placeholder="User ID" className="h-9 text-xs font-mono" value={usr} onChange={(e) => setUsr(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-muted-foreground/60">Subcategory</label>
                     <Input placeholder="напр. таро" className="h-9 text-xs" value={subcat} onChange={(e) => setSubcat(e.target.value)} />
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="md:col-span-8">
            <div className="bg-muted/10 border border-muted/10 p-6 rounded-2xl space-y-6 min-h-[300px] flex flex-col relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <User className="w-64 h-64" />
                </div>

                <div className="flex justify-between items-center border-b border-muted/10 pb-4 z-10">
                   <div className="text-sm font-black uppercase tracking-widest text-foreground/80">Result Set: {results.length} items</div>
                   <Badge variant="outline" className="text-[9px] border-accent/20 text-accent">Active Sync</Badge>
                </div>

                {results.length > 0 ? (
                  <div className="grid gap-3 z-10">
                    {results.map((r, i) => (
                      <div key={r.id} className="group flex items-center gap-4 p-3 bg-background/80 border border-muted/20 rounded-xl hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                           {i+1}
                        </div>
                        <div className="flex flex-col">
                           <div className="text-xs font-bold leading-tight flex items-center gap-2">
                              {r.definition?.title || 'Unknown'}
                              {i < 3 && <Badge className="text-[7px] h-3 px-1 uppercase border-none bg-accent text-accent-foreground">VISIBLE</Badge>}
                           </div>
                           <div className="text-[10px] text-muted-foreground/60 font-mono tracking-tighter uppercase">{r.periodLabel} • {r.subcategoryKey}</div>
                        </div>
                        <div className="ml-auto text-right">
                           {r.level && (
                               <Badge className="text-[9px] h-4 tracking-tighter bg-muted/50 text-muted-foreground border-none group-hover:bg-accent/10 group-hover:text-accent">
                                   {LEVEL_LOCALE[r.level || 'holder']}
                               </Badge>
                           )}
                           <div className="text-[8px] font-bold text-muted-foreground/30 mt-1 uppercase tracking-widest">Priority {r.definition?.displayPriority}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm italic py-20 px-10 text-center gap-2">
                    <Search className="w-8 h-8 opacity-20" />
                    No records found in current edited state.
                  </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
}

function TablePreviewTab() {
  const { definitions, snapshots, records } = useStatusAdmin();
  const [subcat, setSubcat] = useState('таро');
  const results = getStatusTablePreview(subcat, { definitions, snapshots, records });

  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-1.5 px-1">
         <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" /> Status Table Impact
         </h3>
         <p className="text-xs text-muted-foreground italic">Simulation of what all users will see on the public /status leaderboard.</p>
      </div>

      <div className="bg-muted/10 border border-muted/10 p-6 rounded-2xl space-y-6 min-h-[400px] backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-muted/10 pb-4">
           <div className="space-y-1">
              <div className="text-sm font-black uppercase tracking-widest text-foreground/80">Result Set: {results.length} rows</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter opacity-60">Snapshot + Permanent overlap</div>
           </div>
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3 h-3 text-muted-foreground/40" />
              <Input placeholder="Subcategory to test..." className="h-9 pl-9 text-xs bg-background/50" value={subcat} onChange={(e) => setSubcat(e.target.value)} />
           </div>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((r, i) => (
              <div key={r.id} className="group p-3 bg-background/60 border border-muted/20 rounded-xl hover:border-accent/30 hover:bg-background transition-all">
                <div className="flex items-start justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center text-[9px] font-black text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent transition-colors">{i+1}</div>
                      <div className="text-[11px] font-bold truncate max-w-[120px] text-foreground/90">{r.userDisplayName}</div>
                   </div>
                   <Badge variant="outline" className="text-[8px] h-3 px-1 border-muted/20 text-muted-foreground uppercase">{r.periodLabel}</Badge>
                </div>
                <div className="flex items-center gap-2 mb-1">
                   <Award className="w-3 h-3 text-accent/50" />
                   <div className="text-[11px] font-black text-accent/90 truncate">{r.definition?.title}</div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-muted/5">
                   <Badge className="text-[8px] h-3.5 px-1 bg-muted/50 text-muted-foreground border-none font-bold">{LEVEL_LOCALE[r.level || 'holder']}</Badge>
                   <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>PRI:{r.definition?.displayPriority}</span>
                      <span>SRT:{r.tableSortOrder}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-muted-foreground text-sm italic gap-2">
            <Database className="w-10 h-10 opacity-10" />
            No records generated for subcategory <strong>"{subcat}"</strong> in current state.
          </div>
        )}
      </div>
    </div>
  );
}

function ArchivePreviewTab() {
  const { snapshots, definitions, records } = useStatusAdmin();
  const editableSnapshots = snapshots.filter(s => s.snapshotId !== 'permanent');
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>(editableSnapshots[0]?.snapshotId || '');
  const items = getArchiveSnapshotPreview(selectedSnapshotId, { definitions, snapshots, records });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <Card className="lg:col-span-4 border-muted/10 bg-background/50 h-fit">
        <CardHeader className="p-5 border-b border-muted/5">
          <CardTitle className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/70">Archive Periods</CardTitle>
        </CardHeader>
        <CardContent className="p-2 space-y-1">
          {editableSnapshots.map(s => (
            <button 
              key={s.snapshotId}
              onClick={() => setSelectedSnapshotId(s.snapshotId)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex flex-col gap-0.5 ${selectedSnapshotId === s.snapshotId ? 'bg-accent/10 border border-accent/20 shadow-sm shadow-accent/5' : 'hover:bg-muted/10 border border-transparent text-muted-foreground/80'}`}
            >
              <span className={`text-[13px] font-black ${selectedSnapshotId === s.snapshotId ? 'text-accent' : 'text-foreground/70'}`}>{s.title}</span>
              <span className="text-[9px] font-mono uppercase tracking-tighter opacity-60 leading-none">{s.periodLabel}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1.5 px-1">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Archive className="w-4 h-4 text-muted-foreground" /> Historical Archive Impact
            </h3>
            <p className="text-xs text-muted-foreground italic">What visitors see when looking back at past periods.</p>
        </div>

        <div className="bg-muted/10 border border-muted/10 p-6 rounded-2xl space-y-6 min-h-[400px] backdrop-blur-md">
            {items.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">{selectedSnapshotId} • {items.length} records</div>
                        <Badge variant="outline" className="text-[8px] border-muted/30">PUBLIC VIEW</Badge>
                    </div>
                    <div className="overflow-hidden border border-muted/10 rounded-xl bg-background/40">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted/10">
                                <tr>
                                    <th className="px-4 py-3 text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Expert</th>
                                    <th className="px-4 py-3 text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Awarded Title</th>
                                    <th className="px-4 py-3 text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Recognition</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-muted/10">
                                {items.map(r => (
                                    <tr key={r.id} className="hover:bg-accent/5">
                                        <td className="px-4 py-3 font-bold text-foreground/80">{r.userDisplayName}</td>
                                        <td className="px-4 py-3 text-muted-foreground font-medium">{r.definition?.title}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary" className="text-[8px] h-3.5 px-1 border-none bg-muted/50 text-muted-foreground uppercase">{LEVEL_LOCALE[r.level || 'holder']}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-24 text-muted-foreground/40 text-sm italic gap-2 text-center px-10">
                    <History className="w-10 h-10 opacity-10" />
                    Snapshot <strong>"{selectedSnapshotId}"</strong> has no records marked with <strong>archiveVisible</strong>.
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
