'use client';

import React from 'react';
import { Cpu, ShieldCheck, RefreshCw, Zap, Layers, Compass } from 'lucide-react';

const PRINCIPLES = [
  {
    code: 'SPEC-01',
    name: '0 VDOM Re-renders',
    term: 'Hardware Compositor Layer Mutation',
    icon: <Cpu className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: 'Strict 0 React reconciliation overhead',
    details:
      'Scroll events never dispatch React state hooks (useState/useReducer). Instead, numeric 3D transformation matrices are calculated in the ticker loop and written directly to element CSS style declarations, keeping the React reconciler completely idle.',
    metrics: ['0 Virtual DOM diffs', 'GPU compositor thread locked', 'Zero React fiber traversal'],
  },
  {
    code: 'SPEC-02',
    name: 'Zero Memory Leaks',
    term: 'Native WeakMap & WeakRef Lifecycle',
    icon: <ShieldCheck className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: 'Automatic Garbage Collection Safety',
    details:
      'All DOM node references, trigger coordinates, and velocity trackers are stored in WeakMap keys. When components unmount during Next.js route transitions, the JavaScript engine automatically frees all associated memory without detached DOM node leaks.',
    metrics: ['WeakMap key lifecycle', 'Automatic ghost spacer teardown', 'Zero listener accumulation'],
  },
  {
    code: 'SPEC-03',
    name: 'Layout Thrashing Prevention',
    term: 'Batched Read-Before-Write Phase Isolation',
    icon: <RefreshCw className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: 'Elimination of forced reflow cascades',
    details:
      'Browsers stall when getBoundingClientRect() and style.transform mutations alternate within the same frame. ScrollCraft enforces a 4-phase game loop that batches all viewport queries into Phase 1 before executing style writes in Phase 4.',
    metrics: ['Separated read/write passes', 'ResizeObserver pool caching', 'Idle sleep mode during dormancy'],
  },
  {
    code: 'SPEC-04',
    name: 'Subpixel Precision',
    term: 'Velocity-Gated Kinetic Damping',
    icon: <Zap className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: 'Eliminates 120Hz trackpad micro-stutter',
    details:
      'Subpixel rounding errors on high-DPI displays create perceptible micro-stutter during low-velocity gliding. ScrollCraft clamps fractional remainders and applies exponential spring damping until velocity settles below 0.001 px/ms.',
    metrics: ['Subpixel modulo wrap', 'Exponential velocity decay', 'Spring momentum restoration'],
  },
  {
    code: 'SPEC-05',
    name: 'SSR Hydration Safety',
    term: 'Pending CSS State & Zero-FOUC Lifecycle',
    icon: <Layers className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: 'Preserves pre-rendered HTML without flash',
    details:
      'React Server Components stream HTML before client JavaScript executes. ScrollCraft leverages CSS data attributes ([data-scrollcraft-reveal]) to guarantee server-rendered typography never flashes or jumps during React 19 hydration handoff.',
    metrics: ['Zero hydration mismatch errors', 'Survives RSC stream chunks', 'Progressive enhancement ready'],
  },
  {
    code: 'SPEC-06',
    name: 'Standards-First Fallback',
    term: 'Native CSS ViewTimeline & JS Driver Parity',
    icon: <Compass className="w-4 h-4 text-[#3b82f6]" />,
    guarantee: 'Compositor thread execution where supported',
    details:
      'Detects native CSS animation-timeline support via feature queries. In supporting browsers, scroll transitions run entirely off the main thread. Transparently falls back to our sub-5kB JavaScript ticker without breaking API contracts.',
    metrics: ['Off-main-thread execution', 'Universal fallback transparency', 'Sub-5 kB gzipped footprint'],
  },
];

export function CorePrinciplesSection() {
  return (
    <section className="relative w-full border-b border-[#1c1c1f] bg-[#09090b] py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-[#1c1c1f] mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.2em]">
                Core Principles // Engineering Guarantees
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-[-0.03em] font-sans">
              Strict architectural guarantees.<br />Built for high-scale production.
            </h2>
          </div>
          <p className="text-sm text-[#a1a1aa] max-w-sm leading-[1.75] font-sans md:text-right">
            Engineered from ground up with game-engine discipline. Every primitive adheres to strict memory safety, zero-reconciliation, and forced-reflow prevention.
          </p>
        </div>

        {/* 6-Grid Principle Specification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRINCIPLES.map((item) => (
            <div
              key={item.code}
              className="p-7 rounded-xl border border-[#27272a] bg-[#121214] flex flex-col justify-between shadow-sm hover:border-[#3f3f46] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#1c1c1f] mb-4">
                  <span className="text-[10px] font-mono text-[#71717a] font-bold">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-mono text-[#10b981] font-semibold">
                    VERIFIED
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-1.5 rounded bg-[#18181b] border border-[#27272a]">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#fafafa] font-sans">
                    {item.name}
                  </h3>
                </div>

                <div className="text-[11px] font-mono text-[#3b82f6] mb-3">
                  {item.term}
                </div>

                <p className="text-xs text-[#a1a1aa] leading-[1.75] font-sans">
                  {item.details}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-[#1c1c1f] space-y-1.5 font-mono text-[11px] text-[#71717a]">
                {item.metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#3b82f6]" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Spec Bar Footer */}
        <div className="mt-14 p-4 rounded-lg border border-[#1c1c1f] bg-[#0d0d0f] flex flex-wrap items-center justify-between text-xs font-mono text-[#71717a] gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[#fafafa] font-semibold">ARCHITECTURE SUMMARY</span>
            <span className="text-[#27272a]">//</span>
            <span>Zero Re-renders: <strong className="text-[#10b981]">Guaranteed</strong></span>
            <span className="text-[#27272a]">//</span>
            <span>Memory Leak Safety: <strong className="text-[#10b981]">WeakMap Enforced</strong></span>
          </div>
          <span>4.8 kB gzipped &bull; MIT Licensed</span>
        </div>
      </div>
    </section>
  );
}
