import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const adminDb = getAdminDb();
        const body = await req.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
        }

        // Use admin privileges to bypass client-side firestore.rules
        const postRef = adminDb.collection('posts').doc(postId);
        
        await postRef.update({
            views: FieldValue.increment(1)
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error incrementing post views:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
