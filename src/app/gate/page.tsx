'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

function GateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const returnUrl = searchParams.get('returnUrl') || '/';

  useEffect(() => {
    // Autofocus the input on load
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Redirect to the intended page
        router.push(returnUrl);
      } else {
        setError('Неправильний пароль');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch (err) {
      setError('Виникла помилка. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-8 font-sans antialiased text-slate-900">
      <div className="w-full max-w-sm flex flex-col items-center space-y-12">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold tracking-[0.2em] uppercase">LECTOR</h1>
            <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-slate-400 mt-1">Staging Access</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введіть пароль"
              className={cn(
                "w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 text-sm outline-none transition-all",
                "placeholder:text-slate-300 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-50",
                error && "border-red-200 bg-red-50 focus:border-red-400 focus:ring-red-50"
              )}
            />
            <button
              type="submit"
              disabled={loading || !password}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-slate-900 transition-all active:scale-95"
            >
              <ArrowRight className={cn("w-4 h-4", loading && "animate-pulse")} />
            </button>
          </div>

          {/* Feedback */}
          <div className="h-4 text-center">
            {error && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 animate-in fade-in slide-in-from-top-2">
                {error}
              </p>
            )}
          </div>
        </form>

        {/* Footer info */}
        <div className="pt-8 text-center space-y-2">
          <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-slate-300">
            &copy; 2026 LECTOR PLATFORM. PRIVATE PREVIEW.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GatePage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
                Завантаження...
            </div>
        </div>
    }>
      <GateContent />
    </Suspense>
  );
}
