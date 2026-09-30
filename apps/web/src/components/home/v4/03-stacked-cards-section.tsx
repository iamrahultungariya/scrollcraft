'use client';

import React from 'react';
import { StackedCards } from '@scrollcraft/react';
import { Layers, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

const ARCHITECTURAL_CARDS = [
  {
    serial: 'MOD-01 // COMPOSITOR_PIPELINE',
    title: 'Direct Hardware GPU Compositor',
    icon: <Cpu className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: '0 VDOM Re-renders per frame',
    description:
      'Scroll events bypass React state dispatch entirely. The engine computes numeric 3D matrix transforms and writes directly to hardware CSS style properties, locking animations to 120 FPS on compositor threads.',
    specs: ['Bypasses React reconciliation', 'Subpixel translate3d writes', 'Zero layout recalculation'],
  },
  {
    serial: 'MOD-02 // WEAKMAP_LIFECYCLE',
    title: 'Zero Memory Leaks & WeakMap Caching',
    icon: <ShieldCheck className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: 'Automatic Garbage Collection Safety',
    description:
      'All node metadata, trigger bounding boxes, and velocity state records are keyed via native WeakMap and WeakRef references. When DOM nodes unmount or routes change in Next.js, all allocations are automatically reclaimed.',
    specs: ['WeakMap target storage', 'Automatic spacer teardown', 'Zero detached DOM node traps'],
  },
  {
    serial: 'MOD-03 // PHASE_ISOLATION',
    title: 'Forced Reflow Prevention (Phase Isolation)',
    icon: <RefreshCw className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: 'Zero Forced Layout Thrashing',
    description:
      'Browsers drop frames when DOM reads (getBoundingClientRect) and writes (style.transform) interleave. ScrollCraft enforces a strict 4-phase game loop separating geometric measurement from compositor flushing.',
    specs: ['Batched read-before-write pass', 'ResizeObserver pool caching', 'Idle sleep mode during inactivity'],
  },
  {
    serial: 'MOD-04 // SSR_SHIELD',
    title: 'React 19 & Next.js App Router Native',
    icon: <Layers className="w-4 h-4 text-[#3b82f6]" />,
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
      className="relative w-full max-w-2xl mx-auto h-[320px] rounded-xl border border-[#27272a] bg-[#121214] p-8 flex flex-col justify-between shadow-[0_25px_50px_rgba(0,0,0,0.9)] overflow-hidden"
    >
      {/* Corner Crosshair Details */}
      <span className="absolute top-2.5 left-2.5 text-[10px] font-mono text-[#3f3f46] select-none">+</span>
      <span className="absolute top-2.5 right-2.5 text-[10px] font-mono text-[#3f3f46] select-none">+</span>
      <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-[#3f3f46] select-none">+</span>
      <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-[#3f3f46] select-none">+</span>

      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1f]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#18181b] border border-[#27272a]">
              {card.icon}
            </div>
            <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.16em]">
              {card.serial}
            </span>
          </div>
          <span className="text-xs font-mono font-semibold text-[#10b981]">
            {card.guarantee}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-[#fafafa] font-sans mt-5 tracking-[-0.02em]">
          {card.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#a1a1aa] leading-[1.75] font-sans mt-3">
          {card.description}
        </p>
      </div>

      <div className="pt-4 border-t border-[#1c1c1f] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#71717a]">
        <div className="flex items-center gap-3">
          {card.specs.map((spec, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#27272a]">•</span>}
              <span>{spec}</span>
            </span>
          ))}
        </div>
        <span className="text-[#3b82f6] font-semibold">120 FPS Depth</span>
      </div>
    </div>
  ));

  return (
    <section className="relative w-full border-b border-[#1c1c1f] bg-[#09090b] py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
          <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.2em]">
            02 // PHYSICAL STACKED RUNWAY
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-[-0.03em] font-sans">
          Four architectural layers.<br />Stacked directly in the render tree.
        </h2>
        <p className="mt-4 text-sm text-[#a1a1aa] max-w-xl leading-[1.75] font-sans">
          Scroll down to experience physical card stacking. As new layers arrive from below, previous layers scale down smoothly and lock into depth coordinates before unpinning cleanly.
        </p>
      </div>

      {/* Real StackedCards Primitive Execution */}
      <StackedCards
        cards={cards}
        top={110}
        offset={36}
        scaleStep={0.04}
        cardDistance={380}
        className="w-full"
      />

      <div className="max-w-5xl mx-auto mt-8 pt-4 border-t border-[#1c1c1f] flex items-center justify-between text-xs font-mono text-[#71717a]">
        <span>Dogfooded via &lt;StackedCards top=&#123;110&#125; offset=&#123;36&#125; /&gt;</span>
        <span className="text-[#fafafa]">Clean container unpin on runway completion</span>
      </div>
    </section>
  );
}
