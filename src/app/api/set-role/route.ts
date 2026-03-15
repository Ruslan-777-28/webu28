import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { UserProfile } from '@/lib/types';

type UserRole = keyof UserProfile['roles'];

// Define staff roles that can be assigned as claims
const STAFF_ROLES: UserRole[] = ['admin', 'editor', 'author', 'moderator'];

export async function POST(req: NextRequest) {
    try {
        // 1. Verify the caller is an admin by checking their ID token's custom claims.
        const idToken = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ success: false, message: 'Unauthorized: No token provided.' }, { status: 401 });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        if (decodedToken.admin !== true) {
            return NextResponse.json({ success: false, message: 'Unauthorized: Caller is not an admin.' }, { status: 403 });
        }

        // 2. Parse request body
        const { uid, roles, panelEnabled } = await req.json();
        if (!uid || typeof uid !== 'string' || !roles || typeof roles !== 'object') {
            return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
        }

        // 3. Prepare custom claims and Firestore data
        const claims: { [key: string]: boolean } = {};
        let isStaff = false;

        STAFF_ROLES.forEach(role => {
            if (roles[role] === true) {
                claims[role] = true;
                isStaff = true;
            }
        });

        // Ensure panelEnabled is only true if user is staff
        const safePanelEnabled = isStaff && panelEnabled === true;
        
        // 4. Set custom claims on the user in Firebase Auth
        await adminAuth.setCustomUserClaims(uid, claims);

        // 5. Update the user document in Firestore to keep UI and DB in sync
        const userRef = adminDb.collection('users').doc(uid);
        await userRef.update({
            'roles': roles, // Update the entire roles map
            'adminAccess.isStaff': isStaff,
            'adminAccess.panelEnabled': safePanelEnabled,
        });
        
        return NextResponse.json({ success: true, message: `Successfully updated roles and claims for user ${uid}.` });

    } catch (error: any) {
        console.error('API set-role error:', error);
        return NextResponse.json({ success: false, message: 'Error setting user role.', error: error.message }, { status: 500 });
    }
}
