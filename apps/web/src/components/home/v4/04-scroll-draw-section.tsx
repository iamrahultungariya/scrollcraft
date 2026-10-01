'use client';

import React from 'react';
import { ScrollDraw } from '@scrollcraft/react';
import { Cpu, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { Eyebrow } from './01-hero';

const PIPELINE_NODES = [
  {
    step: '01',
    name: 'MEASURE',
    badge: 'READ ONLY',
    icon: <Cpu className="size-4 text-lime" />,
    detail: 'Batched geometry read. Queries viewport bounds and trigger offsets once per layout invalidation. Zero forced reflow cascades.',
  },
  {
    step: '02',
    name: 'DRIVER',
    badge: 'TIME SYNC',
    icon: <RefreshCw className="size-4 text-lime" />,
    detail: 'Sub-frame delta synchronizer. Aligns virtual scroll velocity with native window ticks. Auto-sleeps during idle intervals.',
  },
  {
    step: '03',
    name: 'SOLVE',
    badge: 'NUMERIC MATH',
    icon: <Zap className="size-4 text-lime" />,
    detail: 'Spatial matrix and spring dampening solver. Evaluates curves through WeakMap node caches without React reconciliation.',
  },
  {
    step: '04',
    name: 'FLUSH',
    badge: 'WRITE ONLY',
    icon: <ShieldCheck className="size-4 text-lime" />,
    detail: 'Hardware GPU compositor flush. Writes numeric translate3d and transform styles directly to DOM layers. Zero VDOM thrash.',
  },
];

export function ScrollDrawSection() {
  return (
    <section id="circuit" className="relative w-full border-b border-paper/10 bg-panel/30 py-24 px-5 sm:px-10 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1280px]">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Eyebrow number="05">Vector circuit</Eyebrow>
          <h2 className="mt-7 font-display text-3xl font-extrabold uppercase leading-[0.95] text-paper sm:text-5xl">
            The 4-Phase Game Engine Loop.<br />
            <span className="text-lime">Drawn in real-time.</span>
          </h2>
          <p className="mt-5 text-sm text-paper/60 leading-relaxed font-body">
            Watch the architectural data bus draw itself as you scroll through this section. ScrollCraft strictly isolates DOM measurements from style mutations to prevent browser layout thrashing.
          </p>
        </div>

        {/* Technical SVG Bus with ScrollDraw */}
        <div className="relative">
          {/* Desktop SVG Circuit Line (connects nodes horizontally) */}
          <div className="hidden lg:block w-full h-12 mb-6">
            <svg
              viewBox="0 0 960 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
            >
              {/* Background track */}
              <path
                d="M 20 24 L 940 24"
                stroke="color-mix(in oklab, var(--paper) 12%, transparent)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {/* Real ScrollDraw Primitive: draws in 1:1 sync with scroll in signal lime */}
              <ScrollDraw
                scrub={true}
                start="top 75%"
                end="bottom 45%"
                d="M 20 24 L 940 24"
                stroke="#d9fe00"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 4 Architectural Pipeline Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PIPELINE_NODES.map((node) => (
              <div
                key={node.step}
                className="p-6 rounded-xl border border-paper/15 bg-panel flex flex-col justify-between shadow-[6px_6px_0px_#0e1210] hover:border-lime/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-paper/10 mb-4">
                    <span className="text-[11px] font-mono text-paper/40 font-bold">
                      PHASE {node.step}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink border border-paper/15 text-lime font-bold">
                      {node.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {node.icon}
                    <h3 className="font-display text-lg font-bold uppercase text-paper tracking-tight">
                      {node.name}
                    </h3>
                  </div>

                  <p className="text-xs text-paper/60 leading-relaxed font-body">
                    {node.detail}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-paper/10 flex items-center justify-between font-mono text-[10px] text-paper/40">
                  <span>DISPATCH: PHASE {node.step}</span>
                  <span className="size-1.5 rounded-full bg-lime" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-paper/10 flex items-center justify-between text-xs font-mono text-paper/40">
            <span className="text-lime">Dogfooded via &lt;ScrollDraw scrub=&#123;true&#125; stroke=&quot;#d9fe00&quot; /&gt;</span>
            <span>Vector path synchronizes directly with native scroll updates</span>
          </div>

        </div>

      </div>
    </section>
  );
}
