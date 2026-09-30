'use client';

import React from 'react';
import { VelocityMarquee } from '@scrollcraft/react';

const BADGES = [
  'ZERO VDOM OVERHEAD',
  '120 FPS SYNCHRONIZED',
  'NEXT.JS 15 APP ROUTER READY',
  '4.8 KB GZIPPED CORE',
  'ZERO HYDRATION FOUC',
  'HARDWARE GPU TRANSFORM FLUSH',
  'REACT 19 COMPATIBLE',
  'WEAKMAP ZERO LEAK LIFECYCLE',
  'VIEWTIMELINE STANDARDS FIRST',
];

export function MomentumStripSection() {
  return (
    <div className="relative w-full py-8 bg-[#0c0c0e] border-b border-[#1c1c1f] overflow-hidden select-none">
      <VelocityMarquee
        baseSpeed={0.8}
        velocityMultiplier={2.6}
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#71717a] py-1"
      >
        {BADGES.map((b, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3.5 mx-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shrink-0" />
            <span className="text-[#a1a1aa] font-medium">{b}</span>
          </span>
        ))}
      </VelocityMarquee>
    </div>
  );
}
