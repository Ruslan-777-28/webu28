'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-auth';
import { 
  ShieldCheck, 
  RefreshCcw, 
  AlertTriangle, 
  Database,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Trust Operations Page V1 (Polished)
 * Centralized dashboard for staff to manage ecosystem-wide trust data.
 */
export default function TrustOperationsPage() {
  const { toast } = useToast();
  const { user, claims } = useUser();
  const isAdmin = claims?.admin === true;
  
  const [targetUid, setTargetUid] = useState('');
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [recomputeResult, setRecomputeResult] = useState<any>(null);

  const [isDryRun, setIsDryRun] = useState(true);
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [backfillResult, setBackfillResult] = useState<any>(null);
  const [showConfirmBackfill, setShowConfirmBackfill] = useState(false);

  const handleRecomputeIndividual = async () => {
    if (!user || !targetUid) return;
    setIsRecomputing(true);
    setRecomputeResult(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/recompute-trust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid: targetUid.trim() })
      });
      
      const data = await res.json();
      setRecomputeResult(data);
      if (data.success) {
        toast({ title: 'User trust recomputed' });
      } else {
        toast({ variant: 'destructive', title: 'Recompute failed', description: data.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Network error', description: err.message });
    } finally {
      setIsRecomputing(false);
    }
  };

  const onBackfillClick = () => {
    if (isDryRun) {
      handleBackfill();
    } else {
      setShowConfirmBackfill(true);
    }
  };

  const handleBackfill = async () => {
    if (!user || !isAdmin) {
      toast({ variant: 'destructive', title: 'Forbidden', description: 'Admin privileges required.' });
      return;
    }
    
    setIsBackfilling(true);
    setBackfillResult(null);
    setShowConfirmBackfill(false);
    
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/backfill-trust?dryRun=${isDryRun}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      setBackfillResult(data);
      if (data.success) {
        toast({ 
          title: isDryRun ? 'Audit mode finished' : 'Global backfill completed',
          description: `Processed ${data.results?.total || 0} user profiles.`
        });
      } else {
        toast({ variant: 'destructive', title: 'Operation failed', description: data.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Network error', description: err.message });
    } finally {
      setIsBackfilling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3 text-foreground/90">
          <ShieldCheck className="w-8 h-8 text-indigo-500" />
          Trust Operations
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Control center for shared Trust & Verification data models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Logic Summary Block */}
          <Card className="border-sidebar-border/40 overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/5 border-b border-muted/10">
              <CardTitle className="text-lg font-black uppercase tracking-tight text-foreground/80">Platform Governance</CardTitle>
              <CardDescription>Rules governing public trust indicators.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-[13px] font-medium text-foreground/70 leading-relaxed">
              <div className="p-4 bg-muted/20 rounded-2xl border border-muted/10 space-y-3">
                <p>• Trust indicators are derived from <code className="bg-muted/50 px-1 rounded">users.verification</code> data.</p>
                <p>• Systems aggregate professional activity, identity, and contact verification.</p>
                <p>• <strong>Manual Intervention</strong> acts as a permanent lock during sync operations.</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[10px] font-black uppercase tracking-widest text-indigo-600/60">
                <FileText className="w-4 h-4" />
                Data Standard: Shared Architecture V1
              </div>
            </CardContent>
          </Card>

          {/* Individual Tool */}
          <Card className="border-sidebar-border/40 overflow-hidden shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Search className="w-4 h-4 text-primary/60" />
                Targeted Recompute
              </CardTitle>
              <CardDescription>Force trust recalculation for a specific profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Profile identifier (UID)</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter UID..." 
                    value={targetUid}
                    onChange={(e) => setTargetUid(e.target.value)}
                    className="rounded-xl font-mono text-sm border-muted/50 focus:ring-1 focus:ring-indigo-500"
                  />
                  <Button 
                    onClick={handleRecomputeIndividual} 
                    disabled={isRecomputing || !targetUid.trim()}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 font-bold uppercase text-[10px] tracking-widest gap-2 shrink-0 h-10 shadow-md transition-all active:scale-95"
                  >
                    {isRecomputing ? <RefreshCcw className="w-3 h-3 animate-spin" /> : 'Sync Profile'}
                  </Button>
                </div>
              </div>

              {recomputeResult && (
                <div className={`p-4 rounded-2xl border text-sm space-y-2 animate-in slide-in-from-top-2 flex flex-col gap-1 ${recomputeResult.success ? 'bg-green-500/5 border-green-500/10' : 'bg-destructive/5 border-destructive/10'}`}>
                   <div className="flex items-center justify-between">
                     <span className="font-bold flex items-center gap-2">
                       {recomputeResult.success ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-destructive" />}
                       {recomputeResult.success ? 'Sync Success' : 'Operation Failed'}
                     </span>
                     {recomputeResult.verification && (
                       <Badge variant="outline" className="text-[10px] font-black uppercase px-2 h-5">
                         Lvl {recomputeResult.verification.trustLevel}
                       </Badge>
                     )}
                   </div>
                   <p className="text-xs text-muted-foreground font-medium">{recomputeResult.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Global Backfill Tool */}
        <div className="space-y-8">
           <Card className={`border-sidebar-border/40 flex flex-col h-full overflow-hidden transition-all shadow-sm ${!isAdmin ? 'opacity-50 grayscale border-dashed bg-muted/5' : ''} ${!isDryRun && isAdmin ? 'ring-2 ring-destructive ring-offset-4' : ''}`}>
             <CardHeader className={`${!isDryRun ? 'bg-destructive/5' : 'bg-muted/5'} border-b border-muted/10 transition-colors`}>
               <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    {isDryRun ? 'Ecosystem Audit' : 'Database Backfill'}
                    </CardTitle>
                    <CardDescription>{isDryRun ? 'Safe logic verification.' : 'Global data synchronization.'}</CardDescription>
                 </div>
                 <Badge variant={isAdmin ? (isDryRun ? 'secondary' : 'destructive') : 'outline'} className="text-[9px] font-black uppercase tracking-widest h-5 transition-colors">
                   {isAdmin ? (isDryRun ? 'Audit Mode' : 'Live Action') : 'Restricted'}
                 </Badge>
               </div>
             </CardHeader>
             
             <CardContent className="flex-1 space-y-6 pt-6">
                <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${isDryRun ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
                   <div className={`flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] ${isDryRun ? 'text-indigo-600' : 'text-orange-600'}`}>
                      {isDryRun ? <Info className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                      {isDryRun ? 'Safe Mode Enabled' : 'Critical Database Operation'}
                   </div>
                   <p className={`text-xs font-semibold leading-relaxed ${isDryRun ? 'text-indigo-950/60' : 'text-orange-950/60'}`}>
                      {isDryRun ? (
                        'System will process all users and log results to the server instance. No Firestore documents will be altered.'
                      ) : (
                        'Proceeding will update trust levels for every user in the project. This action affects public visibility indicators across the platform.'
                      )}
                   </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-muted/10 shadow-inner">
                   <div className="space-y-0.5">
                     <Label className="text-sm font-bold uppercase tracking-tight">Audit Mode Only</Label>
                     <p className="text-[10px] text-muted-foreground font-medium">Safe validation without write privileges.</p>
                   </div>
                   <Switch 
                     checked={isDryRun} 
                     onCheckedChange={setIsDryRun} 
                     disabled={!isAdmin || isBackfilling}
                   />
                </div>

                {backfillResult && (
                  <div className="p-4 bg-muted/40 border border-muted/10 rounded-2xl text-[13px] font-extrabold flex flex-col gap-2 animate-in zoom-in-95 duration-200">
                     <div className="flex justify-between items-center text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">
                        Operational Result Summary
                        {backfillResult.results?.isDryRun && <Badge className="text-[8px] h-4 bg-indigo-500">No Writes</Badge>}
                     </div>
                     <div className="flex justify-between items-center bg-background/50 p-2.5 rounded-lg border border-muted/5">
                        <span className="text-muted-foreground font-bold text-[11px] uppercase tracking-tight">Users Processed</span>
                        <span className="text-foreground text-base tracking-tighter">{backfillResult.results?.total || 0}</span>
                     </div>
                     <div className="flex justify-between items-center bg-green-500/5 p-2.5 rounded-lg border border-green-500/10 text-green-700">
                        <span className="text-[11px] uppercase tracking-tight">Sync Completed</span>
                        <span className="text-base tracking-tighter font-black">{backfillResult.results?.success || 0}</span>
                     </div>
                     {backfillResult.results?.failed > 0 && (
                       <div className="flex justify-between items-center bg-destructive/5 p-2.5 rounded-lg border border-destructive/10 text-destructive">
                          <span className="text-[11px] uppercase tracking-tight">Errors Identified</span>
                          <span className="text-base tracking-tighter font-black">{backfillResult.results.failed}</span>
                       </div>
                     )}
                     <p className="text-[10px] text-center text-muted-foreground pt-1 italic font-semibold">
                        {backfillResult.results?.isDryRun ? 'Safe audit finished successfully.' : 'Platform-wide synchronization complete.'}
                     </p>
                  </div>
                )}
             </CardContent>

             <CardFooter className="pt-0 pb-6">
                <Button 
                  onClick={onBackfillClick} 
                  disabled={!isAdmin || isBackfilling}
                  variant={isDryRun ? 'outline' : 'destructive'}
                  className={`w-full rounded-2xl font-black uppercase text-xs tracking-[0.15em] h-12 shadow-md transition-all active:scale-[0.98] ${isDryRun ? 'border-primary/20' : 'hover:scale-[1.01]'}`}
                >
                  {isBackfilling ? (
                    <span className="flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      Initializing Operation...
                    </span>
                  ) : (
                    isDryRun ? 'Verify Trust Logic (Audit)' : 'Proceed with Global Backfill'
                  )}
                </Button>
             </CardFooter>
           </Card>
        </div>
      </div>

      {/* Confirmation Dialog for Live Operations */}
      <AlertDialog open={showConfirmBackfill} onOpenChange={setShowConfirmBackfill}>
        <AlertDialogContent className="rounded-3xl border-destructive/20 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              Confirm Global Synchronization
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base font-semibold text-foreground/80 leading-relaxed italic">
              You are about to re-evaluate trust levels for ALL users. 
              This is a production-level database operation that affects every profile immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 bg-muted/30 rounded-2xl text-sm font-bold border border-muted/10 space-y-2">
              <p className="flex justify-between">Target Environment: <span className="text-destructive uppercase">Project Shared Backend</span></p>
              <p className="flex justify-between">Source Documents: <span className="text-foreground uppercase">Collection: users</span></p>
              <p className="flex justify-between">Authorized by: <span className="text-indigo-600 uppercase italic underline">{user?.email || 'Admin Staff'}</span></p>
          </div>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-3">
            <AlertDialogCancel className="rounded-2xl font-bold uppercase text-[10px] shadow-sm">Cancel Operation</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBackfill}
              className="rounded-2xl bg-destructive hover:bg-destructive/90 text-white font-black uppercase text-[10px] tracking-widest shadow-lg"
            >
              Understand & Execute
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
