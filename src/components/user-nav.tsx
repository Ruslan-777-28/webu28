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
import { useFavorites } from "@/hooks/use-favorites";
import { useFriends } from "@/hooks/use-friends";
import { useNotifications } from "@/hooks/use-notifications";
import { useShares } from "@/hooks/use-shares";
import { useArchitectForumAccess } from "@/hooks/use-architect-forum-access";
import { ArchitectForumPendingIndicator } from './architect/forum-pending-indicator';

export function UserNav() {
  const { user, profile, loading } = useUser();
  const { userFavorites: favoriteUsers } = useFavorites(undefined, 'user');
  const { userFavorites: favoritePosts } = useFavorites(undefined, 'post');
  const { friends } = useFriends();
  const { unreadCount: shareUnreadCount } = useShares();
  const { unreadCount: notifUnreadCount } = useNotifications();
  const { hasAccess: isArchitect } = useArchitectForumAccess();

  const totalUnread = shareUnreadCount + notifUnreadCount;

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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full group">
          <Avatar className="h-10 w-10 border border-transparent group-hover:border-primary/20 transition-all">
            <AvatarImage src={profile.avatarUrl || ''} alt={profile.name || 'user avatar'} />
            <AvatarFallback>{profile.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          {totalUnread > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary ring-2 ring-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
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
          <Link href="/notifications">
            <DropdownMenuItem className="cursor-pointer flex justify-between items-center group font-bold">
              <span className="flex items-center">
                Сповіщення
              </span>
              {totalUnread > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-primary/40 group-hover:bg-primary/90 transition-colors">
                  {totalUnread}
                </span>
              )}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
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
          <Link href="/trust-verification">
            <DropdownMenuItem className="cursor-pointer font-bold text-primary">
              Довіра і верифікація
            </DropdownMenuItem>
          </Link>
          {isArchitect && (
            <Link href="/architect-council/forum">
              <DropdownMenuItem className="cursor-pointer flex justify-between items-center">
                <span>Форум</span>
                <ArchitectForumPendingIndicator />
              </DropdownMenuItem>
            </Link>
          )}
          {canAccessAdmin && (
            <Link href="/admin" prefetch={false}>
              <DropdownMenuItem className="cursor-pointer">
                Адмін панель
              </DropdownMenuItem>
            </Link>
          )}
          <DropdownMenuSeparator />
          <Link href="/my-shared-items">
            <DropdownMenuItem className="cursor-pointer flex justify-between items-center group">
              <span>Мені поділилися</span>
              {shareUnreadCount > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {shareUnreadCount}
                </span>
              )}
            </DropdownMenuItem>
          </Link>
          <Link href="/my-friends">
            <DropdownMenuItem className="cursor-pointer flex justify-between items-center">
              <span>Мої друзі</span>
              {friends.length > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {friends.length}
                </span>
              )}
            </DropdownMenuItem>
          </Link>
          <Link href="/favorites/profiles">
            <DropdownMenuItem className="cursor-pointer flex justify-between items-center">
              <span>Мої фаворити</span>
              {favoriteUsers.length > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {favoriteUsers.length}
                </span>
              )}
            </DropdownMenuItem>
          </Link>
          <Link href="/saved-posts">
            <DropdownMenuItem className="cursor-pointer flex justify-between items-center">
              <span>Збережені публікації</span>
              {favoritePosts.length > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {favoritePosts.length}
                </span>
              )}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          Вийти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
