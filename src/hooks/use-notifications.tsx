'use client';

import { useState, useEffect } from 'react';
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    orderBy,
    doc
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useUser } from '@/hooks/use-auth';
import { functions, db } from '@/lib/firebase/client';
import type { AppNotification } from '@/lib/types';

export function useNotifications() {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        // Listen to notifications for the current user
        const q = query(
            collection(db, 'notifications'),
            where('uid', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            } as AppNotification & { id: string }));
            setNotifications(data);
            setLoading(false);
        }, (err) => {
            console.error('Error fetching notifications:', err);
            // Fallback for missing index
            if (err.message.includes('index')) {
                const fallbackQ = query(
                    collection(db, 'notifications'),
                    where('uid', '==', user.uid)
                );
                onSnapshot(fallbackQ, (fallbackSnapshot) => {
                    const fallbackData = fallbackSnapshot.docs.map(doc => ({ 
                        id: doc.id, 
                        ...doc.data() 
                    } as AppNotification & { id: string }));
                    fallbackData.sort((a, b) => {
                        const timeA = a.createdAt?.toMillis?.() || 0;
                        const timeB = b.createdAt?.toMillis?.() || 0;
                        return timeB - timeA;
                    });
                    setNotifications(fallbackData);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        return () => unsub();
    }, [user?.uid]);

    const markAsRead = async (notificationId: string) => {
        if (!user) return;
        try {
            // Use callable function instead of direct updateDoc to bypass security rules
            const callMarkRead = httpsCallable(functions, 'markNotificationRead');
            await callMarkRead({ notificationId });
        } catch (err) {
            console.error('Error marking notification as read via callable:', err);
        }
    };

    const markAllAsRead = async () => {
        if (!user || notifications.length === 0) return;
        
        const unread = notifications.filter(n => !n.readAt);
        if (unread.length === 0) return;

        try {
            const callMarkRead = httpsCallable(functions, 'markNotificationRead');
            // Parallel execution for multiple notifications
            await Promise.all(unread.map(n => 
                callMarkRead({ notificationId: (n as any).id })
            ));
        } catch (err) {
            console.error('Error marking all notifications as read via callable:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.readAt).length;

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        loading
    };
}
