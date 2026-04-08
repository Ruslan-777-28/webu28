'use client';

import { auth, db } from '@/lib/firebase/client';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, type IdTokenResult } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  claims: IdTokenResult['claims'] | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, claims: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [claims, setClaims] = useState<IdTokenResult['claims'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      // 1. Always cleanup previous profile listener if it exists
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      setUser(authUser);
      
      if (authUser) {
        authUser.getIdTokenResult().then((idTokenResult) => {
            setClaims(idTokenResult.claims);
        });

        const profileDocRef = doc(db, 'users', authUser.uid);
        unsubProfile = onSnapshot(profileDocRef, (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
            console.error("Auth profile listener error:", error);
            setLoading(false);
        });
      } else {
        // User is signed out
        setUser(null);
        setProfile(null);
        setClaims(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, claims, loading }}>
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
