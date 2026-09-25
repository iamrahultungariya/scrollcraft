'use client';

import React from 'react';
import { Pin, Reveal } from '@scrollcraft/react';
import { CheckCircle2, Cpu, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface EnginePhase {
  number: string;
  name: string;
  role: string;
  description: string;
  guarantee: string;
  badge: string;
  icon: React.ReactNode;
}

const PHASES: EnginePhase[] = [
  {
    number: '01',
    name: 'MEASURE',
    role: 'Batched DOM & Viewport Geometry Read',
    description:
      'Gathers trigger bounds, scroll dimensions, and client heights once per layout invalidation. Strict phase separation prevents browser layout thrashing.',
    guarantee: 'Zero forced reflow cascades',
    badge: 'READ ONLY',
    icon: <Cpu className="w-4 h-4 text-[#3b82f6]" />,
  },
  {
    number: '02',
    name: 'DRIVER',
    role: 'Scroll & Velocity Synchronization',
    description:
      'Synchronizes virtual delta and native window scroll position with sub-frame precision. Automatically detects scroll idle and switches to sleep mode.',
    guarantee: '120Hz display refresh alignment',
    badge: 'TIME SYNC',
    icon: <RefreshCw className="w-4 h-4 text-[#3b82f6]" />,
  },
  {
    number: '03',
    name: 'SOLVE',
    role: 'Spatial & Progress Math Solvers',
    description:
      'Runs pure numeric timeline evaluations, trigger intersections, and spatial coordinate mappings through garbage-free WeakMap node caches.',
    guarantee: 'Zero React reconciliation overhead',
    badge: 'NUMERIC MATH',
    icon: <Zap className="w-4 h-4 text-[#3b82f6]" />,
  },
  {
    number: '04',
    name: 'FLUSH',
    role: 'Hardware GPU Transform Flush',
    description:
      'Writes individual hardware transforms (translate3d, scale, rotate) directly to style records with velocity-gated subpixel settling.',
    guarantee: 'Bypasses React VDOM entirely',
    badge: 'WRITE ONLY',
    icon: <ShieldCheck className="w-4 h-4 text-[#3b82f6]" />,
  },
];

export function PinnedEngineSection() {
  return (
    <section className="relative w-full border-b border-[#1c1c1e] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Mobile header */}
        <Reveal duration={0.45}>
          <div className="py-14 border-b border-[#1c1c1e] lg:hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              <span className="text-[11px] font-mono text-[#52525b] uppercase tracking-[0.18em]">
                Engine Architecture
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-[-0.025em] font-sans">
              The 4-Phase<br />Game Engine Loop.
            </h2>
            <p className="mt-4 text-sm text-[#71717a] leading-[1.75]">
              ScrollCraft enforces a strict four-phase execution order modeled after real-time game engines.
            </p>
          </div>
        </Reveal>

        {/* Desktop 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[#1c1c1e]">
          {/* Left: Pinned sidebar — desktop only */}
          <div className="hidden lg:block">
            <Pin top={100} pinSpacing={680} className="w-full">
              <div className="p-10 pt-14">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  <span className="text-[11px] font-mono text-[#52525b] uppercase tracking-[0.18em]">
                    Engine Architecture
                  </span>
                </div>
                <h2 className="text-[2.5rem] font-bold text-white tracking-[-0.03em] font-sans leading-[1.08]">
                  The 4-Phase<br />Game Loop.
                </h2>
                <p className="mt-5 text-sm text-[#71717a] leading-[1.8] font-sans">
                  Browsers stutter when DOM reads and writes interleave within a frame. ScrollCraft enforces a strict four-phase pipeline modeled after real-time game engines.
                </p>

                {/* Telemetry block */}
                <div className="mt-8 border border-[#1c1c1e] rounded-lg overflow-hidden">
                  <div className="px-4 py-2 border-b border-[#1c1c1e] bg-[#0d0d0f]">
                    <span className="text-[10px] font-mono text-[#52525b] uppercase tracking-[0.18em]">Pipeline Telemetry</span>
                  </div>
                  <div className="divide-y divide-[#1c1c1e]">
                    <div className="px-4 py-3 flex items-center justify-between font-mono text-xs">
                      <span className="text-[#52525b]">EXECUTION MODEL</span>
                      <span className="text-[#3b82f6]">TICKER LOOP</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between font-mono text-xs">
                      <span className="text-[#52525b]">REFRESH SYNC</span>
                      <span className="text-[#a1a1aa]">120 HZ LOCKED</span>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between font-mono text-xs">
                      <span className="text-[#52525b]">RECONCILIATION</span>
                      <span className="text-white font-semibold">0 VDOM DIFFS</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-[#52525b]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  <span>Dogfooded via &lt;Pin /&gt; container</span>
                </div>
              </div>
            </Pin>
          </div>

          {/* Right: Phase cards */}
          <div className="divide-y divide-[#1c1c1e]">
            {PHASES.map((p, idx) => (
              <Reveal key={p.number} duration={0.45} delay={idx * 0.07}>
                <div className="p-8 lg:p-10 group">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-[#111113] border border-[#1c1c1e]">
                        {p.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-[#52525b] uppercase tracking-[0.18em]">
                            Phase {p.number}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#111113] border border-[#1c1c1e] text-[#71717a] rounded">
                            {p.badge}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white font-mono tracking-[-0.015em]">
                          {p.name}
                        </h3>
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5" />
                  </div>

                  <div className="text-xs font-mono text-[#3b82f6] mb-3 uppercase tracking-[0.12em]">
                    {p.role}
                  </div>

                  <p className="text-sm text-[#71717a] leading-[1.8] font-sans mb-6">
                    {p.description}
                  </p>

                  <div className="pt-4 border-t border-[#1c1c1e] flex items-center gap-2 text-xs font-mono text-[#a1a1aa]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
                    <span>{p.guarantee}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
