'use client';

import React from 'react';
import { VelocityMarquee } from '@scrollcraft/react';

const BADGES = [
  'ZERO VDOM OVERHEAD',
  '120 FPS SYNCHRONIZED',
  'NEXT.JS APP ROUTER READY',
  '4.8 KB GZIPPED',
  'ZERO HYDRATION FOUC',
  'HARDWARE GPU TRANSFORM FLUSH',
  'REACT 19 READY',
  'TREE SHAKABLE',
];

export function MomentumStripSection() {
  return (
    <div className="relative w-full py-10 bg-[#0a0a0a] border-b border-[#1c1c1e] overflow-hidden select-none">
      <VelocityMarquee
        baseSpeed={0.9}
        velocityMultiplier={2.8}
        className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#52525b] py-1"
      >
        {BADGES.map((b, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-4"
          >
            <span className="w-1 h-1 rounded-full bg-[#3b82f6] shrink-0" />
            <span className="text-[#71717a]">{b}</span>
          </span>
        ))}
      </VelocityMarquee>
    </div>
  );
}
