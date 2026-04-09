'use client';

import { useEffect } from 'react';
import { setFirebaseConfig } from '@/lib/firebase/client';
import type { FirebaseOptions } from 'firebase/app';

interface Props {
  config: FirebaseOptions;
}

/**
 * Client Component that initializes the Firebase Client SDK in the browser.
 * It uses the configuration passed directly from the server-side layout.
 */
export function FirebaseClientInitializer({ config }: Props) {
  // We initialize as early as possible on the client
  if (typeof window !== 'undefined') {
    setFirebaseConfig(config);
  }

  useEffect(() => {
    // Secondary check in useEffect
    if (config.apiKey) {
      setFirebaseConfig(config);
    }
  }, [config]);

  return null;
}
