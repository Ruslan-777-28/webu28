'use client';

import { useState, useEffect } from 'react';

// Set the date we're counting down to
const countDownDate = new Date("Jan 1, 2025 00:00:00").getTime();

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

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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
      <div className="flex justify-center gap-6 text-foreground">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums">{formatTime(timeLeft.days)}</span>
          <span className="text-xs font-light uppercase tracking-widest text-muted-foreground">Дні</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums">{formatTime(timeLeft.hours)}</span>
          <span className="text-xs font-light uppercase tracking-widest text-muted-foreground">Години</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums">{formatTime(timeLeft.minutes)}</span>
          <span className="text-xs font-light uppercase tracking-widest text-muted-foreground">Хвилини</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums">{formatTime(timeLeft.seconds)}</span>
          <span className="text-xs font-light uppercase tracking-widest text-muted-foreground">Секунди</span>
        </div>
      </div>
    </div>
  );
}
