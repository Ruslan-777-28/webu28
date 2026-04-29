'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface PageCloseButtonProps {
  fallbackHref?: string;
}

function CloseButtonInner({ fallbackHref = '/' }: PageCloseButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      const from = searchParams.get('from');
      const referrer = document.referrer;
      const host = window.location.host;

      // 1. Prioritize 'from' parameter
      if (from) {
        // Ensure it starts with / and append footer anchor
        const targetUrl = (from.startsWith('/') ? from : `/${from}`).split('#')[0] + '#site-footer';
        router.push(targetUrl);
        return;
      }

      // 2. Secondary fallback: existing referrer logic
      if (referrer && referrer.includes(host)) {
        const targetUrl = referrer.split('#')[0] + '#site-footer';
        router.push(targetUrl);
        return;
      }

      // 3. Ultimate fallback
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleClose}
      className="absolute top-4 right-4 md:top-8 md:right-8 p-2 rounded-full bg-background/50 backdrop-blur hover:bg-accent/10 transition-colors z-50 group flex items-center justify-center text-muted-foreground hover:text-foreground"
      aria-label="Close page"
    >
      <X className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" strokeWidth={1.5} />
    </button>
  );
}

export function PageCloseButton(props: PageCloseButtonProps) {
  return (
    <Suspense fallback={<div className="absolute top-4 right-4 md:top-8 md:right-8 p-2 w-9 h-9 md:w-10 md:h-10" />}>
      <CloseButtonInner {...props} />
    </Suspense>
  );
}
