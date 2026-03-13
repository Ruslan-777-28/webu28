'use client';

import { useUser } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Mail, Languages, Clock, Calendar, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { EditProfileModal } from '@/components/edit-profile-modal';
import { useState } from 'react';

export default function UserPage() {
  const { profile, loading, user } = useUser();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="container mx-auto max-w-3xl py-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start gap-6 p-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-5 w-32" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-16 w-full" />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-28" />
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold mb-4">Please log in</h2>
          <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
        </div>
      );
    }
    
    if (!profile) {
      return (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-semibold mb-4">Profile not found</h2>
              <p className="text-muted-foreground">We couldn't find your profile details. It might still be setting up.</p>
          </div>
      );
    }

    const availabilityStatus = profile.availability?.status || 'unavailable';
    const availabilityColor: Record<string, string> = {
      available: 'bg-green-500',
      busy: 'bg-red-500',
      away: 'bg-yellow-500',
      unavailable: 'bg-gray-500',
    };

    return (
      <div className="container mx-auto max-w-3xl py-8">
        <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between gap-6 bg-muted/30 p-6">
                    <div className="flex items-start gap-6">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                        <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                        <AvatarFallback className="text-3xl">
                            {profile.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                        </Avatar>
                        <div className="pt-2">
                            <CardTitle className="text-3xl font-bold">{profile.name}</CardTitle>
                            <CardDescription className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                                <Mail className="h-4 w-4" />
                                {profile.email}
                            </CardDescription>
                            {profile.createdAt && (
                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4" />
                                Member since {format(profile.createdAt.toDate(), 'MMMM yyyy')}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Profile</span>
                        </Button>
                    </DialogTrigger>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">About</h3>
                    <p className="text-foreground whitespace-pre-wrap">
                        {profile.bio || 'This user has not provided a bio yet.'}
                    </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Languages className="h-4 w-4" />Preferred Language</h3>
                        <Badge variant="outline">{profile.preferredLanguage || 'Not specified'}</Badge>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Clock className="h-4 w-4" />Availability</h3>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${availabilityColor[availabilityStatus]}`} />
                                <span className="capitalize">{availabilityStatus}</span>
                            </Badge>
                            {availabilityStatus !== 'available' && profile.availability?.until && (
                                <span className="text-muted-foreground text-xs">
                                    until {format(profile.availability.until.toDate(), 'PP')}
                                </span>
                            )}
                        </div>
                    </div>
                    </div>
                </CardContent>
            </Card>
            {isEditDialogOpen && <EditProfileModal profile={profile} setOpen={setEditDialogOpen} />}
        </Dialog>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <Navigation />
      {renderContent()}
    </main>
  );
}
