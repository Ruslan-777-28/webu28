'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import type { UserProfile } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const STAFF_ROLES: (keyof UserProfile['roles'])[] = ['admin', 'editor', 'author', 'moderator'];

export default function ManageRolesPage() {
    const { toast } = useToast();
    const [uid, setUid] = useState('');
    const [roles, setRoles] = useState<UserProfile['roles']>({
        user: true,
        expert: false,
        author: false,
        editor: false,
        moderator: false,
        admin: false,
    });
     const [panelEnabled, setPanelEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleRoleChange = (role: keyof UserProfile['roles'], checked: boolean) => {
        setRoles(prev => ({ ...prev, [role]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uid) {
            toast({ variant: 'destructive', title: 'UID is required.' });
            return;
        }
        setIsLoading(true);

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("You must be logged in to perform this action.");
            }
            const idToken = await currentUser.getIdToken();

            const response = await fetch('/api/set-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ uid, roles, panelEnabled }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to set role.');
            }

            toast({
                title: 'Success!',
                description: `Roles for user ${uid} have been updated. You might be signed out. Please log in again to see changes.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error setting role',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Manage User Roles (Temporary)</h1>
                    <p className="text-muted-foreground mt-2">This page is for the initial setup of the first admin user.</p>
                     <Button asChild variant="link" className="mt-4">
                        <Link href="/">Back to Home</Link>
                     </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Set User Roles & Claims</CardTitle>
                        <CardDescription>
                            Enter a User ID (UID) from the Firebase Authentication page and assign roles. The user's custom claims will be updated accordingly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="uid">User ID (UID)</Label>
                                <Input
                                    id="uid"
                                    value={uid}
                                    onChange={(e) => setUid(e.target.value)}
                                    placeholder="Enter user's UID to modify"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>System Roles</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg border p-4">
                                {STAFF_ROLES.map((role) => (
                                        <div key={role} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={role}
                                                checked={roles[role]}
                                                onCheckedChange={(checked) => handleRoleChange(role, !!checked)}
                                            />
                                            <Label htmlFor={role} className="capitalize font-medium">{role}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 rounded-lg border p-4">
                                <Checkbox
                                    id="panelEnabled"
                                    checked={panelEnabled}
                                    onCheckedChange={(checked) => setPanelEnabled(!!checked)}
                                />
                                <Label htmlFor="panelEnabled" className="font-medium">Enable Admin Panel Access</Label>
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'Updating...' : 'Update Roles & Claims'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
