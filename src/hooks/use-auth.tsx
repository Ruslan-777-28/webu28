'use client';

import { auth, db } from '@/lib/firebase/client';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser) {
        // User is signed in, listen to profile changes
        const profileDocRef = doc(db, 'users', authUser.uid);
        const unsubProfile = onSnapshot(profileDocRef, (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, () => {
            // on error
            setLoading(false);
        });
        return () => unsubProfile(); // Cleanup profile listener on user change
      } else {
        // User is signed out
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};
