'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { User, MapPin, Star } from 'lucide-react';
import { FavoriteButton } from './favorite-button';

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="group relative">
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton 
          targetId={profile.uid} 
          type="user" 
          showCount={false}
          className="bg-background/60 backdrop-blur-md hover:bg-background/80 shadow-sm border border-muted/20"
        />
      </div>
      <Link href={`/profile/${profile.uid}`}>
        <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 border-muted/60">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="mb-4 h-20 w-20 border-2 border-background shadow-sm">
                <AvatarImage src={profile.avatarUrl || ''} alt={profile.name || 'avatar'} className="object-cover" />
                <AvatarFallback className="text-xl">{profile.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <h3 className="text-lg font-bold text-foreground line-clamp-1">{profile.displayName || profile.name}</h3>
            
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                {profile.country && (
                    <span className="text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {profile.country}
                    </span>
                )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem] mt-3 mb-4">
              {profile.shortBio || profile.bio || 'Користувач ще не додав опис.'}
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full font-bold text-xs gap-2 border-muted/40 hover:bg-muted"
              asChild
            >
              <div>
                <User className="h-3.5 w-3.5" />
                <span>Переглянути профіль</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
