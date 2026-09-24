'use client';

import React from 'react';
import { Layers, Activity, GitCommit, Zap, CheckCircle2 } from 'lucide-react';

interface PipelinePhase {
  phase: string;
  name: string;
  role: string;
  details: string;
  guarantee: string;
}

const PHASES: PipelinePhase[] = [
  {
    phase: '01',
    name: 'MEASURE',
    role: 'Batched DOM & Viewport Geometry Read',
    details: 'Gathers trigger bounds, scroll dimensions, and client heights once per invalidation. Strict separation prevents layout thrashing.',
    guarantee: 'Zero layout recalculation cascades',
  },
  {
    phase: '02',
    name: 'DRIVER',
    role: 'Scroll & Velocity Synchronization',
    details: 'Synchronizes Lenis virtual delta or native window scroll position with sub-frame delta precision and idle detection.',
    guarantee: 'Smooth 120Hz display refresh alignment',
  },
  {
    phase: '03',
    name: 'UPDATE',
    role: 'Spatial & Progress Math Solvers',
    details: 'Runs pure numeric timeline evaluations, trigger intersections, and spatial coordinate mappings through WeakMap node caches.',
    guarantee: 'Zero React reconciliation overhead',
  },
  {
    phase: '04',
    name: 'RENDER',
    role: 'GPU Transform Flush',
    details: 'Writes individual hardware transforms (translate3d, scale, rotate) directly to style records with velocity-gated subpixel settling.',
    guarantee: 'Bypasses React VDOM entirely',
  },
];

export function EngineArchitectureSection() {
  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Internal Pipeline</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 font-sans">
            The 4-Phase Game Engine Loop
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl font-sans">
            Browsers stutter when DOM reads and writes interleave within a single frame. ScrollCraft enforces a strict four-phase execution order modeled after real-time game renderers.
          </p>
        </div>

        {/* 4-Phase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PHASES.map((p) => (
            <div
              key={p.phase}
              className="relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-zinc-600 font-bold">PHASE {p.phase}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white font-mono mb-1">{p.name}</h3>
                <h4 className="text-xs font-mono text-zinc-400 mb-3">{p.role}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans mb-6">
                  {p.details}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] font-mono text-zinc-400 leading-tight">
                  {p.guarantee}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Highlights Bar */}
        <div className="mt-12 p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-sans">Zero Garbage Collection Pressure</h4>
              <p className="text-xs text-zinc-500 font-sans mt-0.5">
                Preallocated numeric state arrays eliminate object allocations during continuous scrolling.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-zinc-400">
            <div>
              <span className="text-zinc-500 block text-[10px]">TICKER RATE</span>
              <span className="text-white font-semibold">120 Hz Target</span>
            </div>
            <div className="w-px h-6 bg-zinc-800" />
            <div>
              <span className="text-zinc-500 block text-[10px]">LIFECYCLE</span>
              <span className="text-white font-semibold">WeakMap Scoped</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
