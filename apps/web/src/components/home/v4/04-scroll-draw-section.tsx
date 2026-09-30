'use client';

import React from 'react';
import { ScrollDraw } from '@scrollcraft/react';
import { Cpu, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

const PIPELINE_NODES = [
  {
    step: '01',
    name: 'MEASURE',
    badge: 'READ ONLY',
    icon: <Cpu className="w-4 h-4 text-[#3b82f6]" />,
    detail: 'Batched geometry read. Queries viewport bounds and trigger offsets once per layout invalidation. Zero forced reflow cascades.',
  },
  {
    step: '02',
    name: 'DRIVER',
    badge: 'TIME SYNC',
    icon: <RefreshCw className="w-4 h-4 text-[#3b82f6]" />,
    detail: 'Sub-frame delta synchronizer. Aligns virtual scroll velocity with native window ticks. Auto-sleeps during idle intervals.',
  },
  {
    step: '03',
    name: 'SOLVE',
    badge: 'NUMERIC MATH',
    icon: <Zap className="w-4 h-4 text-[#3b82f6]" />,
    detail: 'Spatial matrix and spring dampening solver. Evaluates curves through WeakMap node caches without React reconciliation.',
  },
  {
    step: '04',
    name: 'FLUSH',
    badge: 'WRITE ONLY',
    icon: <ShieldCheck className="w-4 h-4 text-[#3b82f6]" />,
    detail: 'Hardware GPU compositor flush. Writes numeric translate3d and transform styles directly to DOM layers. Zero VDOM thrash.',
  },
];

export function ScrollDrawSection() {
  return (
    <section className="relative w-full border-b border-[#1c1c1f] bg-[#09090b] py-28 px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
          <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.2em]">
            Core Principle 03 // Real-Time Vector Circuit
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-[-0.03em] font-sans">
          The 4-Phase Game Engine Loop.<br />Drawn directly in sync with scroll.
        </h2>
        <p className="mt-4 text-sm text-[#a1a1aa] max-w-xl leading-[1.75] font-sans">
          Watch the architectural data bus draw itself as you scroll through this section. ScrollCraft strictly isolates DOM measurements from style mutations to prevent browser layout thrashing.
        </p>

        {/* Technical SVG Bus with ScrollDraw */}
        <div className="mt-16 relative">
          {/* Desktop SVG Circuit Line (connects nodes horizontally) */}
          <div className="hidden lg:block w-full h-12 mb-6">
            <svg
              viewBox="0 0 960 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
            >
              {/* Subtle background track */}
              <path
                d="M 20 24 L 940 24"
                stroke="#1c1c1f"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {/* ScrollDraw Active Path: draws in 1:1 sync with scroll */}
              <ScrollDraw
                scrub={true}
                start="top 75%"
                end="bottom 45%"
                d="M 20 24 L 940 24"
                stroke="#3b82f6"
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
                className="p-6 rounded-xl border border-[#27272a] bg-[#121214] flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1f] mb-4">
                    <span className="text-[11px] font-mono text-[#71717a] font-bold">
                      PHASE {node.step}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                      {node.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="p-1.5 rounded bg-[#18181b] border border-[#27272a]">
                      {node.icon}
                    </div>
                    <h3 className="text-base font-bold text-[#fafafa] font-mono tracking-tight">
                      {node.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#a1a1aa] leading-[1.75] font-sans mt-2">
                    {node.detail}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#1c1c1f] flex items-center justify-between text-[11px] font-mono text-[#71717a]">
                  <span>Phase Isolation</span>
                  <span className="text-[#10b981] font-semibold">120Hz Aligned</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Technical Annotation */}
        <div className="mt-12 pt-4 border-t border-[#1c1c1f] flex flex-wrap items-center justify-between text-xs font-mono text-[#71717a] gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#3b82f6] font-semibold">&lt;ScrollDraw scrub=&#123;true&#125; /&gt;</span>
            <span className="text-[#27272a]">•</span>
            <span>Universal SVG geometry driven via strokeDashoffset</span>
          </div>
          <span className="text-[#fafafa]">Zero forced synchronous layouts</span>
        </div>
      </div>
    </section>
  );
}
