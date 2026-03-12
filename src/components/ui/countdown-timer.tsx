'use client';

import { useState, useEffect } from 'react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set the date we're counting down to: 3 days from when the component mounts
    const countDownDate = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;

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

  return (
    <div className="text-center">
      <div className="flex justify-center gap-1 text-xs font-bold tabular-nums text-foreground">
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
