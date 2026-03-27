'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/client';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    orderBy,
    doc, 
    updateDoc, 
    serverTimestamp
} from 'firebase/firestore';
import { useUser } from '@/hooks/use-auth';
import type { InternalShare } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useShares() {
    const { user } = useUser();
    const { toast } = useToast();
    const [shares, setShares] = useState<InternalShare[]>([]);
    const [loading, setLoading] = useState(true);

    // Listen to shares sent to the current user
    useEffect(() => {
        if (!user) {
            setShares([]);
            setLoading(false);
            return;
        }

        // Note: This query will require a composite index once deployed to production:
        // shares: targetUid ASC, createdAt DESC
        const q = query(
            collection(db, 'shares'),
            where('targetUid', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalShare));
            setShares(data);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching shares:', err);
            // If the error is about a missing index, we fallback to a simpler query without ordering
            if (err.message.includes('index')) {
                const fallbackQ = query(
                    collection(db, 'shares'),
                    where('targetUid', '==', user.uid)
                );
                onSnapshot(fallbackQ, (fallbackSnapshot) => {
                    const fallbackData = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalShare));
                    // Sort manually if index is missing
                    fallbackData.sort((a, b) => {
                        const timeA = a.createdAt?.toMillis?.() || 0;
                        const timeB = b.createdAt?.toMillis?.() || 0;
                        return timeB - timeA;
                    });
                    setShares(fallbackData);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        return () => unsub();
    }, [user?.uid]);

    const markAsRead = async (shareId: string) => {
        if (!user) return;

        try {
            const shareRef = doc(db, 'shares', shareId);
            await updateDoc(shareRef, {
                read: true
            });
        } catch (err) {
            console.error('Error marking share as read:', err);
        }
    };

    const unreadCount = shares.filter(s => !s.read).length;

    return {
        shares,
        unreadCount,
        markAsRead,
        loading
    };
}
