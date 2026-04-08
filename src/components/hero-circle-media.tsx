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
    }, (error) => {
      console.error("Error loading home hero media:", error);
      setSettings(null);
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

  // Use values from Firestore
  const isEnabled = settings?.enabled !== false; // Active by default if not strictly disabled
  
  // Resilient media type detection
  let effectiveMediaType = settings?.mediaType;
  if (!effectiveMediaType && settings) {
    if (settings.desktopVideoUrl || settings.mobileVideoUrl) effectiveMediaType = 'video';
    else if (settings.imageUrl) effectiveMediaType = 'image';
  }

  // Final check for media presence (including fallbacks)
  const hasVideo = !!(settings?.desktopVideoUrl || settings?.mobileVideoUrl);
  const hasImage = !!settings?.imageUrl;
  
  // Decide what to actually render based on priority and availability
  const finalRenderType = (effectiveMediaType === 'video' && hasVideo) ? 'video' : 
                         (effectiveMediaType === 'image' && hasImage) ? 'image' : 
                         hasVideo ? 'video' : 
                         hasImage ? 'image' : null;

  if (!isEnabled || !finalRenderType || !settings) {
    return null; // Fallback to just the border from parent
  }

  return (
    <div className="absolute inset-0 rounded-full overflow-hidden z-0">
      {finalRenderType === 'video' ? (
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={settings.posterUrl}
          src={settings.desktopVideoUrl || settings.mobileVideoUrl}
        />
      ) : (finalRenderType === 'image' && settings.imageUrl) ? (
        <img
          src={settings.imageUrl}
          alt="Hero representation"
          className="w-full h-full object-cover"
        />
      ) : null}
    </div>
  );
}
