'use client';

import React from 'react';
import { StackedCards } from '@scrollcraft/react';
import { Cpu, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { Eyebrow } from './01-hero';

const ARCHITECTURAL_CARDS = [
  {
    serial: 'MOD-01 // COMPOSITOR_PIPELINE',
    title: 'Direct Hardware GPU Compositor',
    icon: <Cpu className="size-4 text-lime" />,
    guarantee: '0 VDOM Re-renders per frame',
    description:
      'Scroll events bypass React state dispatch entirely. The engine computes numeric 3D matrix transforms and writes directly to hardware CSS style properties, executing animations smoothly on compositor threads.',
    specs: ['Bypasses React reconciliation', 'Subpixel translate3d writes', 'Zero layout recalculation'],
  },
  {
    serial: 'MOD-02 // WEAKMAP_LIFECYCLE',
    title: 'Zero Memory Leaks & WeakMap Caching',
    icon: <ShieldCheck className="size-4 text-lime" />,
    guarantee: 'Automatic Garbage Collection Safety',
    description:
      'All node metadata, trigger bounding boxes, and velocity state records are keyed via native WeakMap and WeakRef references. When DOM nodes unmount or routes change in Next.js, all allocations are automatically reclaimed.',
    specs: ['WeakMap target storage', 'Automatic spacer teardown', 'Zero detached DOM node traps'],
  },
  {
    serial: 'MOD-03 // PHASE_ISOLATION',
    title: 'Forced Reflow Prevention (Phase Isolation)',
    icon: <RefreshCw className="size-4 text-lime" />,
    guarantee: 'Zero Forced Layout Thrashing',
    description:
      'Browsers drop frames when DOM reads (getBoundingClientRect) and writes (style.transform) interleave. ScrollCraft enforces a strict 4-phase game loop separating geometric measurement from compositor flushing.',
    specs: ['Batched read-before-write pass', 'ResizeObserver pool caching', 'Idle sleep mode during inactivity'],
  },
  {
    serial: 'MOD-04 // SSR_SHIELD',
    title: 'React 19 & Next.js App Router Native',
    icon: <Layers className="size-4 text-lime" />,
    guarantee: 'Zero-FOUC SSR Hydration Safety',
    description:
      'Pre-rendered HTML from React Server Components renders instantly without jumping or layout shift. Transitions activate smoothly upon client hydration with zero CSS flash or flash of unstyled content.',
    specs: ['Pending CSS state immunity', 'Survives RSC streaming chunks', 'Dynamic viewport shift adaptation'],
  },
];

export function StackedCardsSection() {
  const cards = ARCHITECTURAL_CARDS.map((card) => (
    <div
      key={card.serial}
      className="relative w-full max-w-2xl mx-auto h-[320px] rounded-xl border-2 border-paper/20 bg-panel p-8 flex flex-col justify-between shadow-[8px_8px_0px_#0e1210] overflow-hidden"
    >
      {/* Corner Crosshairs */}
      <span className="absolute top-3 left-3 text-[10px] font-mono text-paper/30 select-none">+</span>
      <span className="absolute top-3 right-3 text-[10px] font-mono text-paper/30 select-none">+</span>
      <span className="absolute bottom-3 left-3 text-[10px] font-mono text-paper/30 select-none">+</span>
      <span className="absolute bottom-3 right-3 text-[10px] font-mono text-paper/30 select-none">+</span>

      <div>
        <div className="flex items-center justify-between pb-4 border-b border-paper/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-ink border border-paper/15">
              {card.icon}
            </div>
            <span className="text-[11px] font-mono text-paper/50 uppercase tracking-[0.16em]">
              {card.serial}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-lime">
            {card.guarantee}
          </span>
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-paper mt-5 tracking-tight">
          {card.title}
        </h3>

        <p className="text-xs sm:text-sm text-paper/60 leading-relaxed font-body mt-3">
          {card.description}
        </p>
      </div>

      <div className="pt-4 border-t border-paper/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-paper/40">
        <div className="flex items-center gap-3">
          {card.specs.map((spec, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-paper/20">&bull;</span>}
              <span>{spec}</span>
            </span>
          ))}
        </div>
        <span className="text-lime font-bold">Hardware Depth</span>
      </div>
    </div>
  ));

  return (
    <section id="runway" className="relative w-full border-b border-paper/10 bg-ink py-24 px-5 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Eyebrow number="04">Physical runway</Eyebrow>
          <h2 className="mt-7 font-display text-3xl font-extrabold uppercase leading-[0.95] text-paper sm:text-5xl">
            Four architectural layers.<br />
            <span className="text-lime">Stacked in the render tree.</span>
          </h2>
          <p className="mt-5 text-sm text-paper/60 leading-relaxed font-body">
            Scroll down to experience physical card stacking. As new layers arrive from below, previous layers scale down smoothly and lock into depth coordinates before unpinning cleanly.
          </p>
        </div>

        {/* Real StackedCards Primitive Dogfooding */}
        <StackedCards
          cards={cards}
          top={110}
          offset={36}
          scaleStep={0.04}
          cardDistance={380}
          className="w-full"
        />

        <div className="mt-8 pt-4 border-t border-paper/10 flex items-center justify-between text-xs font-mono text-paper/40">
          <span className="text-lime">Dogfooded via &lt;StackedCards top=&#123;110&#125; offset=&#123;36&#125; /&gt;</span>
          <span>Clean container unpin on runway completion</span>
        </div>

      </div>
    </section>
  );
}
