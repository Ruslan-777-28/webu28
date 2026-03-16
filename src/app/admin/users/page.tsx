'use client';

import { Button } from "@/components/ui/button";
import { UsersTable } from "./_components/users-table";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/types";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function AllUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const usersRef = collection(db, "users");
        const q = query(usersRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            } as UserProfile));
            setUsers(fetchedUsers);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">User Management</h1>
                {/* Future actions like "Invite User" could go here */}
            </div>
            <UsersTable users={users} isLoading={isLoading} />
        </div>
    );
}
