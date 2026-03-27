import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
        }

        // Use admin privileges to bypass client-side firestore.rules
        const postRef = adminDb.collection('posts').doc(postId);
        
        await postRef.update({
            views: admin.firestore.FieldValue.increment(1)
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error incrementing post views:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
