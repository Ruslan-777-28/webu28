'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/hooks/use-auth"
import { auth } from "@/lib/firebase/client"
import { signOut } from "firebase/auth"
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

export function UserNav() {
  const { user, profile, loading } = useUser();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (loading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user || !profile) {
    return null;
  }

  const canAccessAdmin = profile.adminAccess?.panelEnabled;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatarUrl || ''} alt={profile.name || 'user avatar'} />
            <AvatarFallback>{profile.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/profile/${user.uid}`}>
            <DropdownMenuItem className="cursor-pointer">
              Профіль
            </DropdownMenuItem>
          </Link>
           <Link href="/my-posts">
            <DropdownMenuItem className="cursor-pointer">
              Мої публікації
            </DropdownMenuItem>
          </Link>
          {canAccessAdmin && (
            <Link href="/admin">
              <DropdownMenuItem className="cursor-pointer">
                Адмін панель
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          Вийти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
