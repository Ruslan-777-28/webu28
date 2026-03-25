'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/client';
import { collection, query, where, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { useUser } from '@/hooks/use-auth';
import type { Favorite, FavoriteType } from '@/lib/types';

export function useFavorites(targetId?: string, type?: FavoriteType) {
    const { user } = useUser();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [userFavorites, setUserFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Listen to ALL favorites for this target (to get the global count)
    // If targetId is provided, we listen to that specific target
    useEffect(() => {
        if (!targetId || !type) return;

        const q = query(
            collection(db, 'favorites'),
            where('targetId', '==', targetId),
            where('type', '==', type)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Favorite));
            setFavorites(data);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching favorites for target:', err);
            setLoading(false);
        });

        return () => unsub();
    }, [targetId, type]);

    // 2. Listen to OWN favorites (to show counts in user menu or list pages)
    // If targetId is NOT provided, we can use this to get lists of what user favorited
    useEffect(() => {
        if (!user) {
            setUserFavorites([]);
            if (!targetId) setLoading(false);
            return;
        }

        let q = query(
            collection(db, 'favorites'),
            where('uid', '==', user.uid)
        );

        if (type && !targetId) {
            q = query(q, where('type', '==', type));
        }

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Favorite));
            setUserFavorites(data);
            if (!targetId) setLoading(false);
        }, (err) => {
            console.error('Error fetching user favorites:', err);
            if (!targetId) setLoading(false);
        });

        return () => unsub();
    }, [user?.uid, targetId, type]);

    const isFavorited = user ? favorites.some(f => f.uid === user.uid) : false;
    const count = favorites.length;

    return {
        favorites,
        userFavorites,
        isFavorited,
        count,
        loading
    };
}
