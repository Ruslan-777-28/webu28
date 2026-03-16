'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, UserAccountStatus } from "@/lib/types";
import { useUser } from '@/hooks/use-auth';
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
            // Note: UI will update via Firestore listener on the parent page
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
        handleUpdateStatus('banned', 'User permanently banned by admin.');
    };
    
    const handleUnsuspend = () => {
        handleUpdateStatus('active', 'Suspension lifted by admin.');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>Main profile and platform details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p><strong>Email:</strong> {userProfile.email}</p>
                        <p><strong>UID:</strong> <code>{userProfile.uid}</code></p>
                        <p><strong>Created At:</strong> {userProfile.createdAt?.toDate().toLocaleString()}</p>
                         <div>
                            <strong>Roles:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {userProfile.roles && Object.entries(userProfile.roles).map(([role, active]) => 
                                    active && <Badge key={role} variant="secondary">{role}</Badge>
                                )}
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
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveNotes} disabled={isSavingNotes}>
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
                        <Select 
                            value={userProfile.accountStatus || 'active'} 
                            onValueChange={(value) => handleUpdateStatus(value as UserAccountStatus)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="limited">Limited</SelectItem>
                                <SelectItem value="suspended" disabled>Suspended</SelectItem>
                                <SelectItem value="banned" disabled>Banned</SelectItem>
                            </SelectContent>
                        </Select>

                        {userProfile.accountStatus === 'suspended' && userProfile.suspension && (
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-sm">
                                <p className="font-bold text-orange-800">Suspended</p>
                                <p><strong>Reason:</strong> {userProfile.suspension.reason}</p>
                                <p><strong>Until:</strong> {userProfile.suspension.until?.toDate().toLocaleString()}</p>
                            </div>
                        )}
                         {userProfile.accountStatus === 'banned' && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                                <p className="font-bold text-red-800">Banned</p>
                                <p>This user is permanently banned.</p>
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
                            <Button onClick={handleUnsuspend} disabled={isUpdatingStatus} variant="secondary">
                                Unsuspend / Unban
                            </Button>
                        ) : (
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
                                            placeholder="Reason for suspension" 
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
                        )}

                        {userProfile.accountStatus !== 'banned' && (
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" outline disabled={isUpdatingStatus}>Ban User</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action is permanent and will ban the user from the platform indefinitely.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleBan}>Confirm Ban</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
