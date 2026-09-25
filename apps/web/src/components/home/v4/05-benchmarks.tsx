'use client';

import React from 'react';
import { Reveal } from '@scrollcraft/react';
import { Check, X } from 'lucide-react';

interface MetricRow {
  feature: string;
  category: string;
  scrollcraft: string | boolean;
  gsap: string | boolean;
  framer: string | boolean;
  note: string;
}

const COMPARISON: MetricRow[] = [
  {
    feature: 'Core Engine Bundle Size',
    category: 'Footprint',
    scrollcraft: '4.8 kB gzipped',
    gsap: '28.4 kB gzipped',
    framer: '34.2 kB gzipped',
    note: 'Zero dependencies, tree-shakable subpath exports',
  },
  {
    feature: 'VDOM Re-renders on Scroll',
    category: 'React Architecture',
    scrollcraft: '0 (Bypasses VDOM)',
    gsap: '0 (Imperative)',
    framer: '1 per frame (State)',
    note: 'Direct hardware GPU transform mutation',
  },
  {
    feature: 'Next.js SSR Hydration Safety',
    category: 'Framework Ready',
    scrollcraft: 'Native 0-FOUC',
    gsap: 'Requires useGSAP',
    framer: 'Hydration jump risk',
    note: 'Preserves pre-rendered markup with pending CSS safety',
  },
  {
    feature: 'Velocity-Gated Subpixel Snapping',
    category: 'Smoothness',
    scrollcraft: true,
    gsap: false,
    framer: false,
    note: 'Eliminates 120Hz trackpad rounding micro-stutter',
  },
  {
    feature: 'Dynamic Layout Shift Invalidation',
    category: 'Resilience',
    scrollcraft: true,
    gsap: 'Manual refresh()',
    framer: false,
    note: 'ResizeObserver pool recalculates downstream triggers',
  },
  {
    feature: 'Native CSS ViewTimeline Fallback',
    category: 'Web Standards',
    scrollcraft: true,
    gsap: false,
    framer: false,
    note: 'Runs on compositor thread when supported by browser',
  },
];

export function BenchmarksSection() {
  const renderCell = (val: string | boolean, isScrollCraft: boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold ${isScrollCraft ? 'text-[#3b82f6]' : 'text-[#a1a1aa]'}`}>
          <Check className={`w-3.5 h-3.5 ${isScrollCraft ? 'text-[#3b82f6]' : 'text-[#52525b]'}`} />
          Yes
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-[#3f3f46] text-xs font-mono">
          <X className="w-3 h-3 text-[#3f3f46]" />
          No
        </span>
      );
    }
    return (
      <span className={`text-xs font-mono ${isScrollCraft ? 'text-white font-semibold' : 'text-[#71717a]'}`}>
        {val}
      </span>
    );
  };

  return (
    <section className="relative w-full border-b border-[#1c1c1e] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <Reveal duration={0.45}>
          <div className="py-14 border-b border-[#1c1c1e] flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span className="text-[11px] font-mono text-[#52525b] uppercase tracking-[0.18em]">
                  Head-to-Head Specs
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.025em] font-sans">
                Engineered for React 19.<br />Benchmarked for 120 FPS.
              </h2>
            </div>
            <p className="text-sm text-[#71717a] max-w-sm leading-[1.75] font-sans md:text-right">
              Compare architectural guarantees against traditional animation engines and legacy scroll libraries.
            </p>
          </div>
        </Reveal>

        {/* Table */}
        <Reveal duration={0.5} delay={0.08}>
          <div className="py-10">
            <div className="border border-[#1c1c1e] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-[#1c1c1e] bg-[#0d0d0f]">
                      <th className="py-3.5 px-5 text-[10px] font-mono text-[#52525b] uppercase tracking-[0.18em]">
                        Architectural Capability
                      </th>
                      <th className="py-3.5 px-5 text-[10px] font-mono text-[#3b82f6] font-bold bg-[#0d1520] border-x border-[#1c2535]">
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                          ScrollCraft (v0.2.0)
                        </span>
                      </th>
                      <th className="py-3.5 px-5 text-[10px] font-mono text-[#52525b] uppercase tracking-[0.12em]">
                        GSAP ScrollTrigger
                      </th>
                      <th className="py-3.5 px-5 text-[10px] font-mono text-[#52525b] uppercase tracking-[0.12em]">
                        Framer Motion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c1e]">
                    {COMPARISON.map((row) => (
                      <tr
                        key={row.feature}
                        className="hover:bg-[#0d0d0f] transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="text-xs font-semibold text-white font-mono mb-0.5">
                            {row.feature}
                          </div>
                          <div className="text-[11px] text-[#52525b] font-sans">
                            {row.note}
                          </div>
                        </td>
                        <td className="py-4 px-5 bg-[#0d1520] border-x border-[#1c2535]">
                          {renderCell(row.scrollcraft, true)}
                        </td>
                        <td className="py-4 px-5">
                          {renderCell(row.gsap, false)}
                        </td>
                        <td className="py-4 px-5">
                          {renderCell(row.framer, false)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-[#1c1c1e] bg-[#0d0d0f] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#52525b] gap-3">
                <span>Tests measured on Apple M-Series and Intel i9 hardware</span>
                <span>Continuous 120Hz display refresh test pass</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
