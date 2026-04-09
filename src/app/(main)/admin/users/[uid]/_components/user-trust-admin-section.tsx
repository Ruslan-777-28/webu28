'use client';

import React, { useState } from 'react';
import { UserProfile, VerificationLevel, UserVerification } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ShieldCheck, 
  RefreshCcw, 
  CheckCircle2, 
  Circle,
  Clock,
  UserCheck,
  AlertCircle,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-auth';
import { getUserTrustState, TRUST_COLORS } from '@/lib/trust/get-user-trust-state';

interface UserTrustAdminSectionProps {
  userProfile: UserProfile;
}

/**
 * UserTrustAdminSection (Refined)
 * Focused onstaff-friendly state management and validation hardening.
 */
export function UserTrustAdminSection({ userProfile }: UserTrustAdminSectionProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const v = userProfile.verification;
  const trustState = getUserTrustState(userProfile);
  
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [isSavingOverride, setIsSavingOverride] = useState(false);
  
  // Manual Override Local State
  const [overrideEnabled, setOverrideEnabled] = useState(v?.manualOverride?.enabled || false);
  const [overrideLevel, setOverrideLevel] = useState<string>(v?.manualOverride?.trustLevel?.toString() || '0');
  const [overrideReason, setOverrideReason] = useState(v?.manualOverride?.reason || '');

  // Dirty check logic (compares with Firestore state)
  const isDirty = (
    overrideEnabled !== (v?.manualOverride?.enabled || false) ||
    (overrideEnabled && parseInt(overrideLevel, 10) !== (v?.manualOverride?.trustLevel ?? 0)) ||
    (overrideEnabled && overrideReason !== (v?.manualOverride?.reason || ''))
  );

  const isReasonValid = !overrideEnabled || (overrideReason.trim().length >= 5);

  const handleRecompute = async () => {
    if (!user) return;
    setIsRecomputing(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/recompute-trust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid: userProfile.uid })
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      toast({ title: 'Trust recomputed successfully' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Recompute failed', description: err.message });
    } finally {
      setIsRecomputing(false);
    }
  };

  const handleSaveOverride = async () => {
    if (!user) return;
    if (overrideEnabled && !isReasonValid) {
      toast({ variant: 'destructive', title: 'Valid reason required', description: 'Please provide at least 5 characters.' });
      return;
    }

    setIsSavingOverride(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: userProfile.uid,
          action: 'UPDATE_TRUST_OVERRIDE',
          payload: {
            enabled: overrideEnabled,
            trustLevel: parseInt(overrideLevel, 10),
            reason: overrideReason.trim()
          }
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      toast({ title: 'Manual override updated' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Update failed', description: err.message });
    } finally {
      setIsSavingOverride(false);
    }
  };

  return (
    <Card className="border-sidebar-border/40 overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/5 border-b border-muted/10">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-foreground/90">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            Trust & Verification
          </CardTitle>
          <CardDescription className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground/60">Profile Integrity Management</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRecompute} 
          disabled={isRecomputing}
          className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 h-9 bg-background shadow-sm hover:bg-muted/50"
        >
          <RefreshCcw className={`w-3 h-3 ${isRecomputing ? 'animate-spin' : ''}`} />
          {isRecomputing ? 'Syncing...' : 'Sync History Log'}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Layered Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 p-4 bg-muted/20 rounded-2xl border border-muted/20 shadow-inner">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
               <Database className="w-3 h-3" />
               System Predicted
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter">{v?.trustLevel ?? 0}</span>
              <Badge variant="outline" className="text-[9px] uppercase font-bold px-1.5 py-0 h-4 border-muted-foreground/20">Auto</Badge>
            </div>
          </div>
          
          <div className="space-y-2 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-indigo-500/60">
               <ShieldCheck className="w-3 h-3" />
               Public Status
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-colors" 
                style={{ backgroundColor: TRUST_COLORS[trustState.level] }} 
              />
              <span className="font-extrabold text-sm uppercase tracking-tight text-foreground/90">{trustState.label}</span>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-muted/10 rounded-2xl border border-muted/20">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
               <AlertCircle className="w-3 h-3" />
               Risk Profile
            </div>
            <div className="pt-0.5">
              <Badge 
                variant={v?.riskLevel === 'low' ? 'default' : v?.riskLevel === 'medium' ? 'secondary' : 'destructive'}
                className="uppercase text-[9px] font-black h-5 px-2"
              >
                {v?.riskLevel || 'standard'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Audit Signal Details */}
        <div className="space-y-4 p-5 border border-muted/15 rounded-2xl bg-muted/5">
           <div className="flex items-center justify-between border-b border-muted/10 pb-2 mb-1">
             <h4 className="text-[10px] uppercase font-black tracking-[0.15em] text-muted-foreground/40 text-center w-full">
                Active Verification Signals
              </h4>
           </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
              <SignalItem label="Account Verification" active={v?.emailVerified || v?.phoneVerified} />
              <SignalItem label="Identity Validation" active={v?.identityVerificationStatus === 'verified'} />
              <SignalItem label="Profile Completeness" active={v?.profileCompletionEligible} />
              <SignalItem label="Professional History" active={(v?.completedPaidInteractions || 0) > 0} count={v?.completedPaidInteractions} />
              <SignalItem label="Account Seniority" active={(v?.accountAgeDays || 0) >= 3} count={v?.accountAgeDays} />
              <SignalItem label="Offer Visibility" active={(v?.activeProfessionalOffersCount || 0) > 0} count={v?.activeProfessionalOffersCount} />
            </div>
        </div>

        {/* Manual Override (Admin Control) */}
        <div className="pt-6 border-t border-muted/20 space-y-5">
           <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase tracking-tight flex items-center gap-2 text-foreground/80">
                  Manual Intervention
                  {v?.manualOverride?.enabled && <Badge className="bg-orange-500 hover:bg-orange-600 text-[8px] uppercase h-3.5 px-1 font-black">Active Lock</Badge>}
                </Label>
                <p className="text-[11px] text-muted-foreground leading-tight">Force a static trust level to bypass automated platform computations.</p>
              </div>
              <Switch 
                checked={overrideEnabled} 
                onCheckedChange={setOverrideEnabled} 
              />
           </div>

           {overrideEnabled && (
             <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground/70 tracking-widest">Enforced Trust Level</Label>
                  <Select value={overrideLevel} onValueChange={setOverrideLevel}>
                    <SelectTrigger className="rounded-xl font-bold h-10 border-muted/30 focus:ring-1 focus:ring-indigo-500 bg-background shadow-sm">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="0" className="text-xs font-bold">Level 0: No Status</SelectItem>
                      <SelectItem value="1" className="text-xs font-bold">Level 1: Account Confirmed</SelectItem>
                      <SelectItem value="2" className="text-xs font-bold">Level 2: Identity Verified</SelectItem>
                      <SelectItem value="3" className="text-xs font-bold">Level 3: Active Specialist</SelectItem>
                      <SelectItem value="4" className="text-xs font-bold">Level 4: Platform Trusted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground/70 tracking-widest flex items-center justify-between">
                    Audit Rationale
                    {!isReasonValid && <span className="text-[9px] text-destructive/80 font-bold lowercase italic">min. 5 chars</span>}
                  </Label>
                  <Textarea 
                    placeholder="Provide justification for manual trust override..."
                    className="min-h-24 rounded-2xl text-[13px] font-medium border-muted/30 focus-visible:ring-1 focus-visible:ring-indigo-500 bg-background shadow-inner leading-relaxed"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                  />
                </div>

                {v?.manualOverride?.setBy && (
                   <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-black uppercase tracking-[0.1em] bg-muted/20 px-3 py-2 rounded-xl border border-muted/10">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-500/50" />
                      Updated by {v.manualOverride.setBy} • {v.manualOverride.setAt?.toDate().toLocaleDateString()}
                   </div>
                )}

                <Button 
                  onClick={handleSaveOverride} 
                  disabled={isSavingOverride || !isDirty || !isReasonValid}
                  className={`w-full rounded-2xl font-black uppercase text-xs tracking-[0.12em] h-12 shadow-md transition-all ${isDirty && isReasonValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-muted text-muted-foreground'}`}
                >
                  {isSavingOverride ? (
                    <span className="flex items-center gap-2">
                      <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                      Updating Registry...
                    </span>
                  ) : (isDirty ? (isReasonValid ? 'Apply Manual Override' : 'Details Required') : 'No Changes Detected')}
                </Button>
             </div>
           )}

           {!overrideEnabled && v?.manualOverride?.enabled && (
             <div className="space-y-4">
               <div className="p-3.5 bg-destructive/5 border border-destructive/10 rounded-xl text-[11px] font-bold text-destructive/80 flex items-center gap-2.5 italic">
                 <RefreshCcw className="w-3.5 h-3.5 shrink-0" />
                 Platform will restore automated recomputation logic upon saving.
               </div>
               <Button 
                  variant="outline"
                  onClick={handleSaveOverride} 
                  disabled={isSavingOverride}
                  className="w-full rounded-2xl font-black uppercase text-xs tracking-[0.15em] h-12 border-destructive/30 text-destructive hover:bg-destructive/5 shadow-sm active:scale-95 transition-all"
                >
                  {isSavingOverride ? 'Restoring System Control...' : 'Deactivate Override & Restore System'}
                </Button>
             </div>
           )}
        </div>
      </CardContent>

      <CardFooter className="bg-muted/10 border-t border-muted/10 flex flex-col items-start gap-1 py-4 px-6">
         <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 w-full opacity-70">
            <div className="flex items-center gap-5">
               <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Last synchronization: {v?.verificationSyncedAt?.toDate().toLocaleString() || 'Never'}
               </span>
               <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-indigo-500/50" />
                  Metadata Protocol V1.0
               </span>
            </div>
            <div className="text-[8px] font-bold tracking-normal italic opacity-40">Internal ID: {userProfile.uid}</div>
         </div>
      </CardFooter>
    </Card>
  );
}

/**
 * SignalItem component for verification signals audit.
 */
function SignalItem({ label, active, count }: { label: string; active?: boolean; count?: number }) {
  return (
    <div className="flex items-center justify-between text-[12px] font-bold">
      <div className="flex items-center gap-2.5">
        {active ? (
          <div className="h-4 w-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
            <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
          </div>
        ) : (
          <div className="h-4 w-4 rounded-full bg-muted/20 flex items-center justify-center shrink-0 border border-muted/10">
            <Circle className="w-2 h-2 text-muted-foreground/20" />
          </div>
        )}
        <span className={`tracking-tight ${active ? 'text-foreground/80' : 'text-muted-foreground/30 font-semibold'}`}>
          {label}
        </span>
      </div>
      {active && typeof count === 'number' && (
        <Badge variant="outline" className="text-[10px] font-black h-4.5 min-w-[18px] justify-center scale-90 opacity-60 bg-muted/5 font-mono">
          {count}
        </Badge>
      )}
    </div>
  );
}
