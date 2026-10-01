'use client';

import React from 'react';
import { VelocityMarquee } from '@scrollcraft/react';

const BADGES = [
  'ZERO VDOM OVERHEAD',
  'SUBPIXEL FLUID MOMENTUM',
  'NEXT.JS 15 APP ROUTER READY',
  '<5 KB TREE-SHAKEN CORE',
  'ZERO HYDRATION FOUC',
  'HARDWARE GPU TRANSFORM FLUSH',
  'REACT 19 COMPATIBLE',
  'WEAKMAP ZERO LEAK LIFECYCLE',
  'VIEWTIMELINE STANDARDS FIRST',
];

export function MomentumStripSection() {
  return (
    <div className="relative w-full py-8 bg-ink border-b border-paper/10 overflow-hidden select-none">
      <VelocityMarquee
        baseSpeed={0.8}
        velocityMultiplier={2.6}
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/40 py-1"
      >
        {BADGES.map((badge, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-6">
            <span className="size-1.5 rounded-full bg-lime shrink-0" />
            <span className="text-paper/80 font-medium">{badge}</span>
          </span>
        ))}
      </VelocityMarquee>
    </div>
  );
}
