'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Like, Comment } from '@/lib/types';
import { useUser } from '@/hooks/use-auth';

export function usePostSocial(postId: string) {
    const { user } = useUser();
    const [likes, setLikes] = useState<Like[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!postId) return;

        let unsubLikes = () => {};
        let unsubComments = () => {};

        // Likes listener - only for authenticated users per firestore rules
        if (user) {
            const likesQuery = query(
                collection(db, 'likes'),
                where('targetId', '==', postId),
                where('type', '==', 'post')
            );

            unsubLikes = onSnapshot(likesQuery, (snapshot) => {
                setLikes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Like)));
            });
        }

        // Comments listener - allowed for guests
        const commentsQuery = query(
            collection(db, 'posts', postId, 'comments'),
            orderBy('createdAt', 'desc')
        );

        unsubComments = onSnapshot(commentsQuery, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching comments:", error);
            setLoading(false);
        });

        return () => {
            unsubLikes();
            unsubComments();
        };
    }, [postId, user?.uid]);

    const isLiked = user ? likes.some(l => l.uid === user.uid) : false;
    const userLike = user ? likes.find(l => l.uid === user.uid) : null;

    return {
        likesCount: likes.length,
        isLiked,
        userLike,
        commentsCount: comments.length,
        comments,
        loading
    };
}
