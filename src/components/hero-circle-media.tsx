'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { HomeHeroMediaSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function HeroCircleMedia() {
  const [settings, setSettings] = useState<HomeHeroMediaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'siteSettings', 'homeHeroMedia');
    
    getDoc(docRef).then((snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as HomeHeroMediaSettings);
      } else {
        setSettings(null);
      }
      setLoading(false);
    }).catch((error) => {
      console.error("Error loading home hero media:", error);
      setSettings(null);
      setLoading(false);
    });
  }, []);

  // Reset video ready state when URL changes
  const rawVideoUrl = settings?.desktopVideoUrl || settings?.mobileVideoUrl;
  useEffect(() => {
    setIsVideoReady(false);
  }, [rawVideoUrl]);

  // Use values from Firestore
  const isEnabled = settings?.enabled !== false;
  
  let effectiveMediaType = settings?.mediaType;
  if (!effectiveMediaType && settings) {
    if (settings.desktopVideoUrl || settings.mobileVideoUrl) effectiveMediaType = 'video';
    else if (settings.imageUrl) effectiveMediaType = 'image';
  }

  const hasVideo = !!(settings?.desktopVideoUrl || settings?.mobileVideoUrl);
  const hasImage = !!settings?.imageUrl;
  
  const finalRenderType = (effectiveMediaType === 'video' && hasVideo) ? 'video' : 
                         (effectiveMediaType === 'image' && hasImage) ? 'image' : 
                         hasVideo ? 'video' : 
                         hasImage ? 'image' : null;

  // Cache-busting and Key logic
  const { safeVideoSrc, videoKey } = useMemo(() => {
    if (!rawVideoUrl || !settings) return { safeVideoSrc: '', videoKey: '' };
    
    const version = settings.updatedAt?.toMillis?.() || settings.version || 0;
    const connector = rawVideoUrl.includes('?') ? '&' : '?';
    const src = version ? `${rawVideoUrl}${connector}v=${version}` : rawVideoUrl;
    
    return {
      safeVideoSrc: src,
      videoKey: `${rawVideoUrl}-${version}`
    };
  }, [rawVideoUrl, settings]);

  if (loading) {
    return (
      <div className="absolute inset-0 rounded-full overflow-hidden bg-background/50 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
    );
  }

  if (!isEnabled || !finalRenderType || !settings) {
    return null;
  }

  return (
    <div className="absolute inset-0 rounded-full overflow-hidden z-0 bg-slate-50/10">
      {finalRenderType === 'video' ? (
        <video
          key={videoKey}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700 ease-in-out",
            isVideoReady ? "opacity-100" : "opacity-0"
          )}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          poster=""
          src={safeVideoSrc}
        />
      ) : (finalRenderType === 'image' && settings.imageUrl) ? (
        <img
          src={settings.imageUrl}
          alt="Hero representation"
          className="w-full h-full object-cover animate-in fade-in duration-700"
        />
      ) : null}
    </div>
  );
}
