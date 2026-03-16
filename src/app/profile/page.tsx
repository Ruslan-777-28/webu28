'use client';

import { useUser } from '@/hooks/use-auth';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { EditProfileModal } from '@/components/edit-profile-modal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

export default function ProfilePage() {
    const { user, profile, loading } = useUser();
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="flex items-center gap-6 mb-8">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-6 w-64" />
                        </div>
                    </div>
                    <Skeleton className="h-48 w-full" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!user || !profile) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8 text-center">
                    <p>Будь ласка, увійдіть, щоб переглянути свій профіль.</p>
                </main>
                <Footer />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start gap-6">
                        <Avatar className="h-24 w-24 border">
                            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                            <AvatarFallback>{profile.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <CardTitle className="text-3xl">{profile.name}</CardTitle>
                            <p className="text-muted-foreground">{user.email}</p>
                            <p className="mt-4 text-sm">{profile.bio || 'Інформація про себе не вказана.'}</p>
                        </div>
                        <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Редагувати
                                </Button>
                            </DialogTrigger>
                           <EditProfileModal profile={profile} setOpen={setEditModalOpen} />
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {/* Here we can add more profile details later */}
                        <h3 className="font-semibold mt-6 mb-4">Деталі профілю</h3>
                        <div className="text-sm space-y-2">
                             <p><strong>UID:</strong> <code>{user.uid}</code></p>
                             <p><strong>Дата реєстрації:</strong> {profile.createdAt?.toDate().toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
