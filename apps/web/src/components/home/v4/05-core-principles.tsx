'use client';

import React from 'react';
import { Cpu, ShieldCheck, RefreshCw, Zap, Layers, Compass } from 'lucide-react';
import { Eyebrow } from './01-hero';

const PRINCIPLES = [
  {
    code: 'SPEC-01',
    name: '0 VDOM Re-renders',
    term: 'Hardware Compositor Layer Mutation',
    icon: <Cpu className="size-4 text-lime" />,
    guarantee: 'Strict 0 React reconciliation overhead',
    details:
      'Scroll events never dispatch React state hooks (useState/useReducer). Instead, numeric 3D transformation matrices are calculated in the ticker loop and written directly to element CSS style declarations, keeping the React reconciler completely idle.',
    metrics: ['0 Virtual DOM diffs', 'GPU compositor thread locked', 'Zero React fiber traversal'],
  },
  {
    code: 'SPEC-02',
    name: 'Zero Memory Leaks',
    term: 'Native WeakMap & WeakRef Lifecycle',
    icon: <ShieldCheck className="size-4 text-lime" />,
    guarantee: 'Automatic Garbage Collection Safety',
    details:
      'All DOM node references, trigger coordinates, and velocity trackers are stored in WeakMap keys. When components unmount during Next.js route transitions, the JavaScript engine automatically frees all associated memory without detached DOM node leaks.',
    metrics: ['WeakMap key lifecycle', 'Automatic ghost spacer teardown', 'Zero listener accumulation'],
  },
  {
    code: 'SPEC-03',
    name: 'Layout Thrashing Prevention',
    term: 'Batched Read-Before-Write Phase Isolation',
    icon: <RefreshCw className="size-4 text-lime" />,
    guarantee: 'Elimination of forced reflow cascades',
    details:
      'Browsers stall when getBoundingClientRect() and style.transform mutations alternate within the same frame. ScrollCraft enforces a 4-phase game loop that batches all viewport queries into Phase 1 before executing style writes in Phase 4.',
    metrics: ['Separated read/write passes', 'ResizeObserver pool caching', 'Idle sleep mode during dormancy'],
  },
  {
    code: 'SPEC-04',
    name: 'Subpixel Precision',
    term: 'Velocity-Gated Kinetic Damping',
    icon: <Zap className="size-4 text-lime" />,
    guarantee: 'Eliminates trackpad micro-stutter & jitter',
    details:
      'Subpixel rounding errors on high-DPI displays create perceptible micro-stutter during low-velocity gliding. ScrollCraft clamps fractional remainders and applies exponential spring damping until velocity settles below 0.001 px/ms.',
    metrics: ['Subpixel modulo wrap', 'Exponential velocity decay', 'Spring momentum restoration'],
  },
  {
    code: 'SPEC-05',
    name: 'SSR Hydration Safety',
    term: 'Pending CSS State & Zero-FOUC Lifecycle',
    icon: <Layers className="size-4 text-lime" />,
    guarantee: 'Preserves pre-rendered HTML without flash',
    details:
      'React Server Components stream HTML before client JavaScript executes. ScrollCraft leverages CSS data attributes ([data-scrollcraft-reveal]) to guarantee server-rendered typography never flashes or jumps during React 19 hydration handoff.',
    metrics: ['Zero hydration mismatch errors', 'Survives RSC stream chunks', 'Progressive enhancement ready'],
  },
  {
    code: 'SPEC-06',
    name: 'Standards-First Fallback',
    term: 'Native CSS ViewTimeline & JS Driver Parity',
    icon: <Compass className="size-4 text-lime" />,
    guarantee: 'Compositor thread execution where supported',
    details:
      'Detects native CSS animation-timeline support via feature queries. In supporting browsers, scroll transitions run entirely off the main thread. Transparently falls back to our sub-5kB JavaScript ticker without breaking API contracts.',
    metrics: ['Off-main-thread execution', 'Universal fallback transparency', 'Sub-5 kB gzipped footprint'],
  },
];

export function CorePrinciplesSection() {
  return (
    <section id="principles" className="relative w-full border-b border-paper/10 bg-panel/20 py-24 px-5 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-paper/10 mb-14 gap-6">
          <div>
            <Eyebrow number="07">Core principles</Eyebrow>
            <h2 className="mt-7 font-display text-3xl font-extrabold uppercase leading-[0.95] text-paper sm:text-5xl">
              Strict architectural guarantees.<br />
              <span className="text-lime">Built for high-scale production.</span>
            </h2>
          </div>
          <p className="text-sm text-paper/60 max-w-sm leading-relaxed font-body md:text-right">
            Engineered from ground up with game-engine discipline. Every primitive adheres to strict memory safety, zero-reconciliation, and forced-reflow prevention.
          </p>
        </div>

        {/* 6-Grid Principle Specification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRINCIPLES.map((item) => (
            <div
              key={item.code}
              className="p-7 rounded-xl border border-paper/15 bg-panel flex flex-col justify-between shadow-[6px_6px_0px_#0e1210] hover:border-lime/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-paper/10 mb-4">
                  <span className="text-[10px] font-mono text-paper/40 font-bold">
                    {item.code}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink border border-paper/15 text-lime font-bold">
                      VERIFIED
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold uppercase text-paper tracking-tight">
                  {item.name}
                </h3>
                
                <div className="text-[11px] font-mono text-paper/50 mt-1">
                  {item.term}
                </div>

                <p className="text-xs text-paper/60 leading-relaxed font-body mt-4">
                  {item.details}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-paper/10 space-y-1.5 font-mono text-[10px] text-paper/50">
                {item.metrics.map((metric, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-lime" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
