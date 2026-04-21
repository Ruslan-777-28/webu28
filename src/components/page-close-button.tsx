'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageCloseButtonProps {
  fallbackHref?: string;
}

export function PageCloseButton({ fallbackHref = '/' }: PageCloseButtonProps) {
  const router = useRouter();

  const handleClose = () => {
    // Check if we have internal history to go back to
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
      router.back();
    } else {
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
