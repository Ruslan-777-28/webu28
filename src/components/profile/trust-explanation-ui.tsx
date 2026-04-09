'use client';

import React from 'react';
import { TrustState } from '@/lib/trust/get-user-trust-state';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useMediaQuery } from '@/hooks/use-media-query';

interface TrustExplanationUIProps {
  state: TrustState;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrustExplanationUI({ state, isOpen, onOpenChange }: TrustExplanationUIProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-[20px] p-6 pb-10">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="sr-only">Довіра і верифікація</SheetTitle>
            <SheetDescription className="sr-only">Пояснення рівня довіри користувача</SheetDescription>
          </SheetHeader>
          <TrustExplanationContent state={state} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-[24px]">
        <DialogHeader className="sr-only">
          <DialogTitle>Довіра і верифікація</DialogTitle>
          <DialogDescription>Пояснення рівня довіри користувача</DialogDescription>
        </DialogHeader>
        <TrustExplanationContent state={state} />
      </DialogContent>
    </Dialog>
  );
}

function TrustExplanationContent({ state }: { state: TrustState }) {
  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center gap-4 pb-5 border-b border-muted/20">
        <div 
          className="h-12 w-12 rounded-2xl flex items-center justify-center bg-muted/5 shrink-0 border border-muted/10 shadow-sm" 
          style={{ color: state.color }}
        >
          <ShieldCheck className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground leading-tight">
            {state.label}
          </h3>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
            Рівень {state.level} <span className="opacity-40 mx-1">/</span> 4
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {state.confirmedItems.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase font-black tracking-[0.15em] text-muted-foreground/50 mb-3">
              Підтверджено
            </h4>
            <ul className="space-y-3">
              {state.confirmedItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-foreground/80">
                  <div className="h-4 w-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {state.nextLevelRequirements.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase font-black tracking-[0.15em] text-muted-foreground/50 mb-3">
              Для наступного рівня
            </h4>
            <ul className="space-y-3">
              {state.nextLevelRequirements.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-muted-foreground/70">
                  <div className="h-4 w-4 rounded-full bg-muted/10 flex items-center justify-center shrink-0">
                    <Circle className="h-2 w-2 text-muted-foreground/20" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button variant="outline" size="lg" className="w-full rounded-2xl gap-2 font-black text-xs uppercase tracking-widest border-muted/50 hover:bg-muted/30 transition-all active:scale-[0.98]" asChild>
          <Link href="/trust-verification">
            Дізнатися більше
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
