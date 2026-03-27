'use client';

import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useFriends } from "@/hooks/use-friends";
import { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FriendButtonProps {
    targetProfile: UserProfile;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
    className?: string;
    showText?: boolean;
}

export function FriendButton({ 
    targetProfile, 
    variant = 'outline', 
    className,
    showText = true
}: FriendButtonProps) {
    const { isFriend, toggleFriend, loading } = useFriends(targetProfile.uid);

    if (loading) {
        return (
            <Button variant={variant} size="sm" disabled className={cn("gap-2", className)}>
                <Loader2 className="h-4 w-4 animate-spin" />
                {showText && <span>...</span>}
            </Button>
        );
    }

    return (
        <Button
            variant={isFriend ? 'secondary' : variant}
            size="sm"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFriend(targetProfile);
            }}
            className={cn(
                "gap-2 transition-all duration-300 rounded-full px-4 h-9",
                isFriend && "bg-primary/5 text-primary border-primary/10 hover:bg-primary/10",
                className
            )}
        >
            {isFriend ? (
                <>
                    <UserMinus className="h-4 w-4 text-primary" />
                    {showText && <span className="text-xs font-medium uppercase tracking-wider">У друзях</span>}
                </>
            ) : (
                <>
                    <UserPlus className="h-4 w-4" />
                    {showText && <span className="text-xs font-medium uppercase tracking-wider">Додати</span>}
                </>
            )}
        </Button>
    );
}
