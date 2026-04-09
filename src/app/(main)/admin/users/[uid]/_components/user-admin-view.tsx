'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, UserAccountStatus } from "@/lib/types";
import { useUser } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

import { UserTrustAdminSection } from './user-trust-admin-section';


async function updateUser(uid: string, action: string, payload: any, token: string) {
    const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, action, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user.');
    }

    return response.json();
}


export function UserAdminView({ userProfile }: { userProfile: UserProfile }) {
    const { toast } = useToast();
    const { user: adminUser } = useUser();
    const [notes, setNotes] = useState(userProfile.adminMeta?.notes || '');
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [suspensionReason, setSuspensionReason] = useState('');
    const [suspensionDays, setSuspensionDays] = useState('7');
    const [banReason, setBanReason] = useState('');

    const handleUpdateStatus = async (status: UserAccountStatus, reason?: string, until?: Date | null) => {
        if (!adminUser) {
            toast({ variant: 'destructive', title: 'Not authenticated' });
            return;
        }

        setIsUpdatingStatus(true);
        try {
            const token = await adminUser.getIdToken();
            const payload: any = { status };
            if (reason) payload.reason = reason;
            if (until) payload.until = until.toISOString();
            
            await updateUser(userProfile.uid, 'SET_STATUS', payload, token);
            toast({ title: 'User status updated successfully!' });
            // UI will update via Firestore listener on the parent page
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error updating status", description: error.message });
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!adminUser) {
            toast({ variant: 'destructive', title: 'Not authenticated' });
            return;
        }
        setIsSavingNotes(true);
         try {
            const token = await adminUser.getIdToken();
            await updateUser(userProfile.uid, 'UPDATE_NOTES', { notes }, token);
            toast({ title: 'Admin notes saved!' });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error saving notes", description: error.message });
        } finally {
            setIsSavingNotes(false);
        }
    };

    const handleSuspend = () => {
        if (!suspensionReason) {
            toast({ variant: 'destructive', title: 'Reason is required for suspension' });
            return;
        }
        const days = parseInt(suspensionDays, 10);
        if (isNaN(days) || days <= 0) {
            toast({ variant: 'destructive', title: 'Invalid number of days' });
            return;
        }
        const until = new Date();
        until.setDate(until.getDate() + days);
        handleUpdateStatus('suspended', suspensionReason, until);
    };

    const handleBan = () => {
        if (!banReason) {
            toast({ variant: 'destructive', title: 'Reason is required for banning' });
            return;
        }
        handleUpdateStatus('banned', banReason);
    };
    
    const handleRestore = () => {
        handleUpdateStatus('active', 'Account restored by admin.');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <UserTrustAdminSection userProfile={userProfile} />
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>Main profile and platform details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <p><strong>Email:</strong> {userProfile.email}</p>
                        <p><strong>UID:</strong> <code>{userProfile.uid}</code></p>
                        <p><strong>Created At:</strong> {userProfile.createdAt?.toDate().toLocaleString()}</p>
                         <div>
                            <strong>Roles:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {userProfile.roles && Object.entries(userProfile.roles).filter(([, active]) => active).map(([role]) => 
                                    <Badge key={role} variant="secondary">{role}</Badge>
                                )}
                            </div>
                        </div>
                        <div>
                            <strong>Admin Access:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {userProfile.adminAccess?.isStaff && <Badge variant="outline">Is Staff</Badge>}
                                {userProfile.adminAccess?.panelEnabled && <Badge><Shield className="w-3 h-3 mr-1"/> Panel Access</Badge>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Internal Admin Notes</CardTitle>
                        <CardDescription>These notes are only visible to admins and moderators.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="Add notes about this user..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-48"
                        />
                         {userProfile.adminMeta?.lastReviewedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Last saved at {userProfile.adminMeta.lastReviewedAt.toDate().toLocaleString()}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveNotes} disabled={isSavingNotes || notes === (userProfile.adminMeta?.notes || '')}>
                            {isSavingNotes ? 'Saving...' : 'Save Notes'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span>Status:</span> 
                            <Badge variant={userProfile.accountStatus === 'banned' || userProfile.accountStatus === 'suspended' ? 'destructive' : 'default'} className="capitalize">
                                {userProfile.accountStatus || 'active'}
                            </Badge>
                        </div>
                        <Select 
                            value={userProfile.accountStatus || 'active'} 
                            onValueChange={(value) => handleUpdateStatus(value as UserAccountStatus)}
                            disabled={isUpdatingStatus || userProfile.accountStatus === 'suspended' || userProfile.accountStatus === 'banned'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="limited">Limited</SelectItem>
                            </SelectContent>
                        </Select>

                        {userProfile.accountStatus === 'suspended' && userProfile.suspension && (
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-sm">
                                <p className="font-bold text-orange-800">Suspended</p>
                                <p><strong>Reason:</strong> {userProfile.suspension.reason}</p>
                                <p><strong>Until:</strong> {userProfile.suspension.until?.toDate().toLocaleString() || 'Permanent'}</p>
                                <p className="text-xs mt-1">Set at: {userProfile.suspension.setAt?.toDate().toLocaleString()}</p>
                            </div>
                        )}
                         {userProfile.accountStatus === 'banned' && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                                <p className="font-bold text-red-800">Banned</p>
                                {userProfile.suspension?.reason && <p><strong>Reason:</strong> {userProfile.suspension.reason}</p>}
                                <p className="text-xs mt-1">Set at: {userProfile.suspension?.setAt?.toDate().toLocaleString()}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Moderation Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {userProfile.accountStatus === 'suspended' || userProfile.accountStatus === 'banned' ? (
                            <Button onClick={handleRestore} disabled={isUpdatingStatus} variant="secondary">
                                Restore to Active
                            </Button>
                        ) : (
                            <>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={isUpdatingStatus}>Suspend User</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Suspend User</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will temporarily restrict the user's account. Please provide a reason and duration.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="space-y-4">
                                            <Input 
                                                placeholder="Reason for suspension (required)" 
                                                value={suspensionReason}
                                                onChange={(e) => setSuspensionReason(e.target.value)}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="7"
                                                    value={suspensionDays}
                                                    onChange={(e) => setSuspensionDays(e.target.value)}
                                                    className="w-20"
                                                />
                                                <span>days</span>
                                            </div>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleSuspend}>Confirm Suspension</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="border-destructive text-destructive" disabled={isUpdatingStatus}>Ban User</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action is permanent and will ban the user from the platform indefinitely. Please provide a reason.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                         <Input 
                                            placeholder="Reason for ban (required)" 
                                            value={banReason}
                                            onChange={(e) => setBanReason(e.target.value)}
                                        />
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleBan}>Confirm Ban</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
