'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { HomeHeroMediaSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PageHeroProps {
  pageId: 'pro' | 'community';
  headline?: string;
  subheadline?: string;
  fallbackHeadline?: string;
  fallbackSubheadline?: string;
  fallbackButtonLabel?: string;
  fallbackButtonLink?: string;
  onButtonClick?: () => void;
}

export function PageHero({
  pageId,
  headline: propHeadline,
  subheadline: propSubheadline,
  fallbackHeadline,
  fallbackSubheadline,
  fallbackButtonLabel,
  fallbackButtonLink,
  onButtonClick,
}: PageHeroProps) {
  const [settings, setSettings] = useState<HomeHeroMediaSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let docPath = '';
    if (pageId === 'pro') docPath = 'siteSettings/proHeroMedia';
    if (pageId === 'community') docPath = 'siteSettings/communityHeroMedia';

    if (!docPath) return;

    getDoc(doc(db, docPath)).then((docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as HomeHeroMediaSettings);
      } else {
        setSettings(null);
      }
      setLoading(false);
    }).catch((error) => {
      console.error(`Error loading hero settings for ${pageId}:`, error);
      setSettings(null);
      setLoading(false);
    });
  }, [pageId]);

  if (loading) {
    return (
      <section className="relative w-full min-h-[50vh] md:min-h-[600px] flex items-center justify-center bg-background/50">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-b-transparent animate-spin"></div>
      </section>
    );
  }

  // Use values from Firestore or fallbacks
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

  const showMedia = isEnabled && !!finalRenderType;

  const headline = propHeadline || settings?.headline || fallbackHeadline;
  const subheadline = propSubheadline || settings?.subheadline || fallbackSubheadline;
  const buttonLabel = settings?.buttonLabel || fallbackButtonLabel;
  const buttonLink = settings?.buttonLink || fallbackButtonLink || '#';
  const secondaryTextBlock = settings?.secondaryTextBlock;

  const isPro = pageId === 'pro';

  return (
    <section className={`relative w-full bg-background overflow-x-hidden ${isPro ? 'border-b border-border/50' : 'md:-mb-16'}`}>

      {/* 1. Pro-specific FULL WIDTH HEADLINE (above the video) */}
      {isPro && headline && (
        <div className="relative z-10 w-full px-8 pt-6 pb-2 md:pl-20 md:pr-12 md:pt-8 max-w-7xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold tracking-tighter text-foreground/70 uppercase">
            {headline}
          </h1>
        </div>
      )}

      {/* 2. Main Flex Container */}
      <div className={`flex flex-col md:flex-row items-stretch w-full ${isPro ? 'min-h-[350px] md:min-h-[400px]' : 'min-h-[500px] md:min-h-[650px]'}`}>

        {/* Left: Media Area (Wide 21:9 desktop, aspect-video mobile) */}
        {showMedia && (
          <div className={`relative w-full flex-shrink-0 bg-muted/20 ${isPro ? 'md:w-[50%] filter contrast-[1.05] brightness-[0.98]' : 'md:w-[72%]'}`}>
            <div className={`w-full h-full ${!isPro ? 'pt-6 pb-0 md:pt-12 md:pb-0 lg:pt-16 lg:pb-0 pl-4 pr-0 flex items-center justify-start -translate-x-[17%] -translate-y-[13%] scale-[0.8]' : ''}`}>
              {finalRenderType === 'video' && settings ? (
                <>
                  {/* Desktop Video */}
                  {settings.desktopVideoUrl && (
                    <video
                      src={settings.desktopVideoUrl}
                      poster={settings.posterUrl}
                      className="hidden md:block w-full h-full object-cover aspect-[21/9]"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                  {/* Mobile Video (fallback to desktop if mobile not provided) */}
                  <video
                    src={settings.mobileVideoUrl || settings.desktopVideoUrl}
                    poster={settings.posterUrl}
                    className="block md:hidden w-full h-full object-cover aspect-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </>
              ) : (finalRenderType === 'image' && settings?.imageUrl) ? (
                <img
                  src={settings.imageUrl}
                  alt="Hero Media"
                  className="w-full h-full object-cover md:aspect-[21/9] aspect-video"
                />
              ) : null}
            </div>

            {/* Desktop: seamless fades (Enhanced Atmospheric Layers) */}
            {!isPro && (
              <>
                <div className="hidden md:block absolute inset-y-0 right-[-1px] w-64 bg-gradient-to-l from-background to-transparent pointer-events-none backdrop-blur-[4px]" />
                <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/60 to-transparent pointer-events-none backdrop-blur-[2px]" />
                <div className="hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/90 to-transparent pointer-events-none" />
              </>
            )}

            {!isPro && (
              <>
                <div className="hidden md:block absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-background to-transparent pointer-events-none" />
                <div className="hidden md:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none" />

                <div className="hidden md:block absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none backdrop-blur-[1px]" />
                <div className="hidden md:block absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none backdrop-blur-[0.5px]" />
              </>
            )}

            {/* Mobile: seamless fades */}
            {!isPro && (
              <>
                <div className="block md:hidden absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
                <div className="block md:hidden absolute inset-x-0 bottom-[-1px] h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                <div className="block md:hidden absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
              </>
            )}
          </div>
        )}

        {/* Right: Text Content Area */}
        <div className={`relative flex flex-col justify-center px-6 py-2 md:px-12 z-10 flex-grow w-full ${isPro ? 'md:w-[50%] md:py-2 -mt-4 md:-mt-8' : 'md:w-[28%] md:py-10 md:pl-0 md:pr-12 md:-ml-40'}`}>
          {(headline || subheadline || secondaryTextBlock) && (
            <div className="max-w-xl text-left">
              {/* Only render headline inside the box if NOT Pro */}
              {/* Community Hero Text Layout: CMS Title + Brand Line */}
              {!isPro && (
                <div className="mb-8 flex flex-col gap-2">
                  {headline && (
                    <h1 className="text-lg md:text-xl lg:text-2xl font-medium tracking-tight text-foreground/50 uppercase leading-tight">
                      {headline}
                    </h1>
                  )}
                  <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter text-foreground uppercase leading-none">
                    LECTOR
                  </div>
                </div>
              )}

              {isPro && (
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-foreground font-semibold mb-3">
                  Наша роль
                </div>
              )}

              {subheadline && (
                <p className={`leading-relaxed font-light ${isPro ? 'text-[15px] md:text-[1.05rem] text-muted-foreground/90 mb-4' : 'text-base md:text-lg text-muted-foreground mb-10'}`}>
                  {subheadline}
                </p>
              )}

              {buttonLabel && (
                <Button
                  variant="outline"
                  size="default"
                  asChild={!onButtonClick}
                  className="font-medium w-full h-10 border-foreground/10 text-foreground/80 hover:bg-foreground/[0.03] hover:border-foreground/20 hover:text-foreground transition-all duration-300 underline decoration-1 decoration-foreground/20 underline-offset-[5px] hover:decoration-foreground/40 mt-4 mb-8"
                  onClick={onButtonClick}
                >
                  {onButtonClick ? (
                    buttonLabel
                  ) : buttonLink.startsWith('http') ? (
                    <a href={buttonLink} target="_blank" rel="noopener noreferrer">
                      {buttonLabel}
                    </a>
                  ) : (
                    <Link href={buttonLink}>
                      {buttonLabel}
                    </Link>
                  )}
                </Button>
              )}

              {isPro && secondaryTextBlock && (
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-foreground font-semibold mb-3">
                  Ваші можливості
                </div>
              )}

              {secondaryTextBlock && isPro && (
                <p className="text-[14px] md:text-[1rem] text-muted-foreground/90 leading-relaxed font-light">
                  {secondaryTextBlock}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
