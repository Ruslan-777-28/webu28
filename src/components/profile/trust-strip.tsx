'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { getUserTrustState, TRUST_COLORS } from '@/lib/trust/get-user-trust-state';
import { TrustExplanationUI } from './trust-explanation-ui';
import { cn } from '@/lib/utils';

interface TrustStripProps {
  profile: UserProfile;
  className?: string;
}

/**
 * TrustStrip - A premium, thin horizontal strip divided into 4 segments.
 * Placed at the very top of the profile card/header.
 * Cumulative fill represents the user's trust level.
 */
export function TrustStrip({ profile, className }: TrustStripProps) {
  const [isOpen, setIsOpen] = useState(false);
  const trustState = getUserTrustState(profile);
  const { level } = trustState;

  // Sync with app parity: all active segments use the current level's primary color
  const activeColor = TRUST_COLORS[level as keyof typeof TRUST_COLORS];

  return (
    <>
      <div 
        className={cn(
          "relative z-40 w-full h-[5px] bg-muted/10 overflow-hidden cursor-pointer group/trust flex gap-0.5",
          className
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        {/* Track for 4 segments */}
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={cn(
              "flex-1 h-full transition-all duration-500 ease-out rounded-[1px]",
              i <= level ? "opacity-100" : "bg-muted/20 opacity-40"
            )}
            style={{ 
              backgroundColor: i <= level ? activeColor : undefined
            }}
          />
        ))}
        
        {/* Interaction layer: subtle glow/highlight on hover */}
        <div className="absolute inset-0 bg-white/0 group-hover/trust:bg-white/10 transition-colors pointer-events-none" />
        
        {/* Bottom edge shadow for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/5 pointer-events-none" />
      </div>

      <TrustExplanationUI 
        state={trustState} 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  );
}
