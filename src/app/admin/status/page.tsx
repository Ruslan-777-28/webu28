'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Database, FolderTree, Activity, Crown, Search, History, BookOpen } from 'lucide-react';

import {
  getStatusAdminSummary,
  getStatusDefinitionsAdminRows,
  getStatusSnapshotsAdminRows,
  getStatusRecordsAdminRows,
  getProfileShelfPreview,
  getStatusTablePreview
} from '@/lib/status/admin-selectors';
import { LEVEL_LOCALE, RARITY_LOCALE, ASSIGNMENT_TYPE_LOCALE } from '@/lib/status/constants';

type TabView = 'definitions' | 'snapshots' | 'records' | 'hof' | 'archive' | 'preview-profile' | 'preview-table';

export default function StatusAdminPage() {
  const [activeTab, setActiveTab] = useState<TabView>('records');
  const summary = getStatusAdminSummary();

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
          Status Admin
        </h1>
        <p className="text-muted-foreground text-sm">
          Внутрішній read-only інспектор V1 статусного шару.
        </p>
      </div>

      {/* Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex justify-between">
              Definitions <Database className="w-3.5 h-3.5 text-muted-foreground/60" />
            </CardDescription>
            <CardTitle className="text-xl">{summary.definitionsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex justify-between">
              Snapshots <History className="w-3.5 h-3.5 text-muted-foreground/60" />
            </CardDescription>
            <CardTitle className="text-xl">{summary.snapshotsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex justify-between">
              Records <Activity className="w-3.5 h-3.5 text-muted-foreground/60" />
            </CardDescription>
            <CardTitle className="text-xl">{summary.recordsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex justify-between">
              HoF <Trophy className="w-3.5 h-3.5 text-accent" />
            </CardDescription>
            <CardTitle className="text-xl">{summary.hofEntriesCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card border-accent/20">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex justify-between text-accent">
              Archives <Archive className="w-3.5 h-3.5" />
            </CardDescription>
            <CardTitle className="text-xl">{summary.archiveSnapshotsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex justify-between text-muted-foreground">
              Users <Crown className="w-3.5 h-3.5" />
            </CardDescription>
            <CardTitle className="text-xl">{summary.uniqueUsersCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-muted/20 pb-4">
        <Button variant={activeTab === 'definitions' ? 'default' : 'secondary'} size="sm" onClick={() => setActiveTab('definitions')}>Definitions</Button>
        <Button variant={activeTab === 'snapshots' ? 'default' : 'secondary'} size="sm" onClick={() => setActiveTab('snapshots')}>Snapshots</Button>
        <Button variant={activeTab === 'records' ? 'default' : 'secondary'} size="sm" onClick={() => setActiveTab('records')}>Records</Button>
        <div className="w-px h-6 bg-muted/20 mx-1 self-center hidden sm:block" />
        <Button variant={activeTab === 'hof' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('hof')} className="border-accent/20">Hall of Fame</Button>
        <Button variant={activeTab === 'archive' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('archive')} className="border-accent/20">Archive Preview</Button>
        <div className="w-px h-6 bg-muted/20 mx-1 self-center hidden sm:block" />
        <Button variant={activeTab === 'preview-profile' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('preview-profile')}>Shelf Preview</Button>
        <Button variant={activeTab === 'preview-table' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('preview-table')}>Table Preview</Button>
      </div>

      {/* Renders */}
      <div className="min-h-[500px]">
        {activeTab === 'definitions' && <DefinitionsTab />}
        {activeTab === 'snapshots' && <SnapshotsTab />}
        {activeTab === 'records' && <RecordsTab />}
        {activeTab === 'hof' && <HallOfFameTab />}
        {activeTab === 'archive' && <ArchivePreviewTab />}
        {activeTab === 'preview-profile' && <ProfilePreviewTab />}
        {activeTab === 'preview-table' && <TablePreviewTab />}
      </div>
    </div>
  );
}

import { Trophy, Archive } from 'lucide-react';
import { getHallOfFameAdminRows, getArchiveSnapshotPreview } from '@/lib/status/admin-selectors';

// --------------------------------------------------------
// TABS COMPONENTS
// --------------------------------------------------------

function DefinitionsTab() {
  const definitions = getStatusDefinitionsAdminRows();
  return (
    <Card className="border-muted/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Definitions Listing</CardTitle>
        <CardDescription>Базові правила та налаштування нагород.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Назва (Title)</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Тип (Layer)</th>
                <th className="px-4 py-3 font-semibold">Призначення</th>
                <th className="px-4 py-3 font-semibold">Рідкість</th>
                <th className="px-4 py-3 font-semibold text-center">In Profile</th>
                <th className="px-4 py-3 font-semibold text-center">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {definitions.map(def => (
                <tr key={def.id} className="hover:bg-muted/5">
                  <td className="px-4 py-3 font-medium text-foreground">{def.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{def.displayPriority}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10px]">{def.layerType}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{ASSIGNMENT_TYPE_LOCALE[def.assignmentType]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{RARITY_LOCALE[def.rarity]}</td>
                  <td className="px-4 py-3 text-center">{def.visibleInProfile ? '🟢' : '⚪'}</td>
                  <td className="px-4 py-3 text-center">{def.active ? '🟢' : '🔴'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SnapshotsTab() {
  const snapshots = getStatusSnapshotsAdminRows();
  const summary = getStatusAdminSummary();
  return (
    <Card className="border-muted/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Snapshots Metadata</CardTitle>
        <CardDescription>Зареєстровані періоди статусної системи.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Тип (Type)</th>
                <th className="px-4 py-3 font-semibold">Period Label</th>
                <th className="px-4 py-3 font-semibold">Effective Date</th>
                <th className="px-4 py-3 font-semibold text-center">Is Demo</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {snapshots.map(snap => (
                <tr key={snap.snapshotId} className={`hover:bg-muted/5 ${snap.snapshotId === summary.activeDefaultSnapshotId ? 'bg-accent/5' : ''}`}>
                  <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                    {snap.snapshotId}
                    {snap.snapshotId === summary.activeDefaultSnapshotId && (
                      <Badge variant="default" className="text-[9px] uppercase tracking-wider bg-accent text-accent-foreground">Default</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{snap.snapshotType}</Badge></td>
                  <td className="px-4 py-3 font-semibold text-muted-foreground">{snap.periodLabel}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(snap.effectiveDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">{snap.isDemo ? '🟣' : '⚪'}</td>
                  <td className="px-4 py-3 text-center">{snap.published ? '🟢' : '🔴'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function RecordsTab() {
  const allRecords = getStatusRecordsAdminRows();
  const [searchTxt, setSearchTxt] = useState('');
  const [filterSubcat, setFilterSubcat] = useState('');

  const filtered = useMemo(() => {
    return allRecords.filter(r => 
      (searchTxt ? r.userDisplayName.toLowerCase().includes(searchTxt.toLowerCase()) || r.userId.toLowerCase().includes(searchTxt.toLowerCase()) : true) &&
      (filterSubcat ? r.subcategoryKey.toLowerCase().includes(filterSubcat.toLowerCase()) : true)
    );
  }, [allRecords, searchTxt, filterSubcat]);

  return (
    <Card className="border-muted/20 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Award Records</CardTitle>
            <CardDescription>Всі видані або згенеровані відзнаки (Total: {filtered.length}).</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="User, ID..." 
                className="pl-8 w-full sm:w-[200px] h-9 text-xs bg-muted/20" 
                value={searchTxt} 
                onChange={(e) => setSearchTxt(e.target.value)} 
              />
            </div>
            <Input 
              placeholder="Subcat (e.g. таро)" 
              className="w-full sm:w-[150px] h-9 text-xs bg-muted/20" 
              value={filterSubcat} 
              onChange={(e) => setFilterSubcat(e.target.value)} 
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border border-muted/10 rounded-md">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[9px] tracking-widest">
              <tr>
                <th className="px-3 py-3 font-semibold">User (ID/Name)</th>
                <th className="px-3 py-3 font-semibold">Subcategory</th>
                <th className="px-3 py-3 font-semibold">Award Title</th>
                <th className="px-3 py-3 font-semibold">Level</th>
                <th className="px-3 py-3 font-semibold text-center">Shelf?</th>
                <th className="px-3 py-3 font-semibold text-center">Sorts (Prof/Tbl)</th>
                <th className="px-3 py-3 font-semibold">Snapshot ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-muted/5 group">
                  <td className="px-3 py-3">
                    <div className="font-semibold text-foreground">{r.userDisplayName}</div>
                    <div className="text-[10px] text-muted-foreground/60">{r.userId}</div>
                  </td>
                  <td className="px-3 py-3 font-medium text-foreground">{r.subcategoryKey}</td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-foreground">{r.resolvedTitle}</div>
                    <div className="text-[10px] text-muted-foreground/60 tracking-widest uppercase">{r.resolvedLayer}</div>
                  </td>
                  <td className="px-3 py-3">{r.level ? <Badge variant="outline" className="text-[9px] uppercase tracking-wider">{LEVEL_LOCALE[r.level] || r.level}</Badge> : '-'}</td>
                  <td className="px-3 py-3 text-center">{r.featuredOnProfile ? '⭐' : '⚪'}</td>
                  <td className="px-3 py-3 text-center text-muted-foreground">{r.profileSortOrder ?? '-'}/{r.tableSortOrder ?? '-'}</td>
                  <td className="px-3 py-3 text-[10px] font-mono text-muted-foreground">{r.snapshotId}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
             <div className="p-10 text-center text-muted-foreground text-sm font-medium">No records found matching filters.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfilePreviewTab() {
  const [usr, setUsr] = useState('usr1');
  const [subcat, setSubcat] = useState('таро');
  const results = getProfileShelfPreview(usr, subcat);

  return (
    <Card className="border-muted/20 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Profile Logic Preview</CardTitle>
        <CardDescription>Симулює `ProfileStatusShelf` getProfileAwardsForSubcategory() selector.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
           <Input placeholder="User ID" className="max-w-[200px] h-9" value={usr} onChange={(e) => setUsr(e.target.value)} />
           <Input placeholder="Subcategory" className="max-w-[200px] h-9" value={subcat} onChange={(e) => setSubcat(e.target.value)} />
        </div>

        <div className="bg-muted/5 border border-muted/10 p-5 rounded-lg space-y-4">
           <div className="text-sm font-bold text-foreground">
             Returns: {results.length} items (Displays first 5 on actual page)
           </div>
           {results.length > 0 ? (
             <div className="grid gap-2">
               {results.map((r, i) => (
                 <div key={r.id} className="text-xs p-3 bg-background border border-muted/20 rounded flex items-center gap-4">
                   <div className="bg-muted/30 px-2 py-1 rounded text-[10px] text-muted-foreground font-mono w-6 text-center">{i+1}</div>
                   <div className="font-semibold">{r.definition?.title || 'Unknown'}</div>
                   <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">{r.level ? LEVEL_LOCALE[r.level] : '-'}</Badge>
                   <div className="ml-auto flex gap-6 text-muted-foreground text-[10px] uppercase font-mono">
                      <span>Pri: {r.definition?.displayPriority}</span>
                      <span>Sort: {r.profileSortOrder}</span>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-sm text-muted-foreground">0 records bypass filters (Ensure featuredOnProfile=true + definition visibleInProfile=true).</div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}

function TablePreviewTab() {
  const [subcat, setSubcat] = useState('таро');
  const results = getStatusTablePreview(subcat);

  return (
    <Card className="border-muted/20 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Status Table Logic Preview</CardTitle>
        <CardDescription>Симулює `/status` getStatusTableRowsForSubcategory() selector.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
           <Input placeholder="Subcategory" className="max-w-[200px] h-9" value={subcat} onChange={(e) => setSubcat(e.target.value)} />
        </div>

        <div className="bg-muted/5 border border-muted/10 p-5 rounded-lg space-y-4">
           <div className="text-sm font-bold text-foreground">
             Returns: {results.length} mapped rows (Combines Active Snapshot + Permanent blocks)
           </div>
           {results.length > 0 ? (
             <div className="grid gap-2">
               {results.map((r, i) => (
                 <div key={r.id} className="text-xs p-3 bg-background border border-muted/20 rounded flex items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                      <div className="bg-muted/30 px-2 py-1 rounded text-[10px] text-muted-foreground font-mono w-6 text-center">{i+1}</div>
                      <div className="font-bold text-foreground/80">{r.userDisplayName}</div>
                      <div className="font-semibold text-accent/80">{r.definition?.title || 'Unknown'}</div>
                   </div>
                   <div className="flex gap-4 text-muted-foreground text-[10px] uppercase font-mono">
                      <span>Pri: {r.definition?.displayPriority}</span>
                      <span>Sort: {r.tableSortOrder}</span>
                      <span>Snap: {r.snapshotId}</span>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-sm text-muted-foreground">0 rows generated.</div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}

function HallOfFameTab() {
  const rows = getHallOfFameAdminRows();
  return (
    <Card className="border-muted/20 shadow-sm transition-all border-accent/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" /> Hall of Fame Entries
        </CardTitle>
        <CardDescription>Записи, відібрані для публічної вітрини престижу.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/10 text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Section</th>
                <th className="px-4 py-3 font-semibold">Award / Title</th>
                <th className="px-4 py-3 font-semibold">Citation</th>
                <th className="px-4 py-3 font-semibold text-center">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/5 group">
                  <td className="px-4 py-3">
                    <div className="font-bold text-foreground">{row.userDisplayName}</div>
                    <div className="text-[10px] text-muted-foreground/60">{row.userId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-[9px] uppercase tracking-widest">{row.hallSection}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground/90">{row.titleOverride || row.definition?.title}</div>
                    <div className="text-[10px] text-muted-foreground/50">{row.subcategoryKey}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-muted-foreground italic max-w-[300px] line-clamp-2">"{row.citation}"</div>
                  </td>
                  <td className="px-4 py-3 text-center">{row.featured ? '⭐' : '⚪'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ArchivePreviewTab() {
  const snapshots = getStatusSnapshotsAdminRows().filter(s => s.snapshotId !== 'permanent');
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>(snapshots[0]?.snapshotId || '');
  const records = getArchiveSnapshotPreview(selectedSnapshotId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-4 border-accent/10">
        <CardHeader className="p-4">
          <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Snapshots</CardTitle>
        </CardHeader>
        <CardContent className="p-2 space-y-1">
          {snapshots.map(s => (
            <button 
              key={s.snapshotId}
              onClick={() => setSelectedSnapshotId(s.snapshotId)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${selectedSnapshotId === s.snapshotId ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-muted/5 text-muted-foreground'}`}
            >
              {s.title}
              <div className="text-[10px] font-normal opacity-60 uppercase tracking-tighter">{s.periodLabel}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-8 border-muted/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Archive className="w-5 h-5 text-muted-foreground" /> Snapshot Records Preview
          </CardTitle>
          <CardDescription>Записи, що будуть видимі в архіві для вибраного періоду.</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/5 text-muted-foreground uppercase text-[9px] tracking-widest">
                  <tr>
                    <th className="px-3 py-3 font-semibold">User</th>
                    <th className="px-3 py-3 font-semibold">Award</th>
                    <th className="px-3 py-3 font-semibold">Level</th>
                    <th className="px-3 py-3 font-semibold">Subcat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/10">
                  {records.map(r => (
                    <tr key={r.id} className="hover:bg-muted/5">
                      <td className="px-3 py-3 font-semibold">{r.userDisplayName}</td>
                      <td className="px-3 py-3 text-foreground/80">{r.definition?.title}</td>
                      <td className="px-3 py-3">
                        <Badge variant="outline" className="text-[9px] uppercase">{LEVEL_LOCALE[r.level || 'holder']}</Badge>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground capitalize">{r.subcategoryKey}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground text-sm italic">
              Зріз не містить записів із позначкою archiveVisible.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
