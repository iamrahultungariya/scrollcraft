'use client';

<<<<<<< HEAD
/**
 * ScrollCraft Section 5: Engine Architecture
 * - Clean, equalized fixed-height pipeline cards (no dynamic height jumping)
 * - Professional 3-phase microtask architecture explanation
 * - Strictly under 650 LOC.
 */

=======
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3
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
<<<<<<< HEAD
    <section
      id="architecture"
      className="relative w-full bg-[#050505] py-16 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 overflow-hidden"
    >
      {/* Background Ambience Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -100 600 C 300 600 400 750 600 750"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1.5"
        />
        <path
          d="M 800 750 C 1000 750 1100 600 1500 600"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1.5"
        />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <Reveal direction="down" distance={15}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-violet-400">
                Engine Architecture
              </span>
              <span className="text-xs font-mono text-zinc-600">&bull;</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-violet-400">
                Deterministic Kernel
              </span>
            </div>
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] mb-3 sm:mb-4 break-words">
              <span className="text-white block font-extrabold">Not a wrapper.</span>
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent block font-extrabold mt-1">An engine.</span>
            </h2>
          </Reveal>

          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              A 3-phase deterministic microtask pipeline executing between hardware vSync ticks and React component reconciliation.
            </p>
          </Reveal>
        </div>

        {/* Main Architecture Diagram Container */}
        <Reveal direction="up" distance={25} delay={0.25}>
          <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/[0.08] bg-[#09090b] p-5 sm:p-8 shadow-2xl relative overflow-hidden mb-12 sm:mb-16">
            {/* Top Bar inside card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 shadow-inner">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm sm:text-base font-bold text-white">
                      @scrollcraft/core
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-[10px] font-mono font-bold text-violet-300">
                      Phase-Locked Pipeline
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Zero-dependency hardware-timed scroll &amp; physics kernel.
                  </p>
=======
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
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3
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
<<<<<<< HEAD

            {/* 3 Pipeline Flow Cards - Equalized Balanced Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              {/* Phase 1: Schedule Ticket */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#060608] p-5 flex flex-col justify-between shadow-md hover:border-violet-500/30 transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-violet-400 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-violet-400 font-bold">01</span>
                      <span className="text-zinc-600">/</span>
                      <span className="text-zinc-400">Phase 1</span>
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Schedule Ticket
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Microtask queue separating DOM measurements from style mutations to eliminate layout thrashing.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] font-mono text-zinc-500">
                  Measure Phase &bull; Batching
                </div>
              </div>

              {/* Phase 2: Inertia Normalizer */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#060608] p-5 flex flex-col justify-between shadow-md hover:border-violet-500/30 transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-violet-400 shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-violet-400 font-bold">02</span>
                      <span className="text-zinc-600">/</span>
                      <span className="text-zinc-400">Phase 2</span>
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Inertia Normalizer
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    High-precision subpixel physics solver calculating normalized delta velocity and damping curves.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] font-mono text-zinc-500">
                  Physics Phase &bull; Damping
                </div>
              </div>

              {/* Phase 3: ScrollValue Mutators */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#060608] p-5 flex flex-col justify-between shadow-md hover:border-violet-500/30 transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-violet-400 shrink-0">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-violet-400 font-bold">03</span>
                      <span className="text-zinc-600">/</span>
                      <span className="text-zinc-400">Phase 3</span>
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    ScrollValue Mutators
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Direct compositor style injection writing hardware transforms with 0 React reconciler cycles.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.04] text-[11px] font-mono text-zinc-500">
                  Mutate Phase &bull; GPU Inline
                </div>
              </div>
            </div>

            {/* Bottom Bridge Line inside card */}
            <div className="relative mt-6 sm:mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-center">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.15em] text-zinc-500 uppercase bg-[#09090b] px-3 text-center">
                REACTIVE CONTEXT &bull; HEADLESS BINDINGS BRIDGE
              </span>
            </div>
          </div>
        </Reveal>

        {/* 3 Spec Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Deterministic</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Executes synchronously between vSync ticks</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hardware Timed</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Precision timing for 60Hz and 120Hz displays</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Framework Agnostic</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Core engine operates with or without React</p>
            </div>
          </div>
        </div>
=======
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
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3
      </div>
    </section>
  );
}
