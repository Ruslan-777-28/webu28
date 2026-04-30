'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function CountdownTimer({ className }: { className?: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Set the date we're counting down to: Founding Access - 21.06.2026
    const countDownDate = new Date('2026-06-21T00:00:00').getTime();

    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    };

    // Set initial time on client to avoid mismatch
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  if (!isClient) {
      return (
          <div className={cn("text-center", className)}>
              <div className="flex gap-1 text-xs font-bold tabular-nums text-muted-foreground">
                  <span>00</span>
                  <span>:</span>
                  <span>00</span>
                  <span>:</span>
                  <span>00</span>
                  <span>:</span>
                  <span>00</span>
              </div>
          </div>
      );
  }

  return (
    <div className={className}>
      <div className={cn("flex gap-1 text-xs font-bold tabular-nums text-muted-foreground", !className?.includes('text-left') && "justify-center")}>
        <span>{formatTime(timeLeft.days)}</span>
        <span>:</span>
        <span>{formatTime(timeLeft.hours)}</span>
        <span>:</span>
        <span>{formatTime(timeLeft.minutes)}</span>
        <span>:</span>
        <span>{formatTime(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}
