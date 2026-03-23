'use client';

import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { HomeHeroMediaSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroCircleMedia() {
  const [settings, setSettings] = useState<HomeHeroMediaSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'siteSettings', 'homeHeroMedia');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as HomeHeroMediaSettings);
      } else {
        setSettings(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 rounded-full overflow-hidden bg-background/50 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
    );
  }

  if (!settings || !settings.enabled) {
    return null; // Fallback to just the border from parent
  }

  return (
    <div className="absolute inset-0 rounded-full overflow-hidden z-0">
      {settings.mediaType === 'video' ? (
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={settings.posterUrl}
        >
          {settings.desktopVideoUrl && (
            <source src={settings.desktopVideoUrl} type="video/mp4" />
          )}
          {/* Typically mobile video could be handled by a responsive logic if needed, 
              but standard HTML5 video takes multiple sources or CSS media queries.
              Since we want minimal, prioritizing the primary video source here.
              If we want strict mobile src swapping, we'd need a window resize listener,
              but for simplicity and standard support, using desktopVideoUrl as primary. */}
        </video>
      ) : settings.imageUrl ? (
        <img
          src={settings.imageUrl}
          alt="Hero representation"
          className="w-full h-full object-cover"
        />
      ) : null}
    </div>
  );
}
