'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/client';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    doc, 
    setDoc, 
    deleteDoc, 
    serverTimestamp
} from 'firebase/firestore';
import { useUser } from '@/hooks/use-auth';
import type { Friendship, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useFriends(targetFriendUid?: string) {
    const { user } = useUser();
    const { toast } = useToast();
    const [friends, setFriends] = useState<Friendship[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFriend, setIsFriend] = useState(false);

    // Listen to all friends of the current user
    useEffect(() => {
        if (!user) {
            setFriends([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'friendships'),
            where('ownerUid', '==', user.uid)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Friendship));
            setFriends(data);
            
            if (targetFriendUid) {
                setIsFriend(data.some(f => f.friendUid === targetFriendUid));
            }
            
            setLoading(false);
        }, (err) => {
            console.error('Error fetching friends:', err);
            setLoading(false);
        });

        return () => unsub();
    }, [user?.uid, targetFriendUid]);

    const toggleFriend = async (friendProfile: UserProfile) => {
        if (!user) {
            toast({
                title: "Потрібна авторизація",
                description: "Будь ласка, увійдіть, щоб додавати друзів",
                variant: "destructive"
            });
            return;
        }

        if (user.uid === friendProfile.uid) {
            toast({
                title: "Помилка",
                description: "Ви не можете додати себе в друзі",
                variant: "destructive"
            });
            return;
        }

        const friendshipId = `${user.uid}_${friendProfile.uid}`;
        const friendRef = doc(db, 'friendships', friendshipId);

        try {
            if (isFriend) {
                await deleteDoc(friendRef);
                toast({
                    title: "Видалено з друзів",
                    description: `${friendProfile.displayName || friendProfile.name} більше не у вашому списку друзів`,
                });
            } else {
                const newFriendship: Omit<Friendship, 'id'> = {
                    ownerUid: user.uid,
                    friendUid: friendProfile.uid,
                    friendDisplayName: friendProfile.displayName || friendProfile.name,
                    friendAvatarUrl: friendProfile.avatarUrl,
                    createdAt: serverTimestamp()
                };
                await setDoc(friendRef, newFriendship);
                toast({
                    title: "Додано в друзі",
                    description: `${friendProfile.displayName || friendProfile.name} тепер у вашому списку друзів`,
                });
            }
        } catch (err) {
            console.error('Error toggling friendship:', err);
            toast({
                title: "Помилка",
                description: "Помилка при оновленні списку друзів",
                variant: "destructive"
            });
        }
    };

    return {
        friends,
        isFriend,
        toggleFriend,
        loading
    };
}
