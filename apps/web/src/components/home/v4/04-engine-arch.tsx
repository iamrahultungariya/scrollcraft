'use client';

/**
 * ScrollCraft Section 5: Engine Architecture
 * - Pixel-perfect match to media_1789367813271.png
 * - Headline: "Not a wrapper. An engine."
 * - 3-phase microtask pipeline: 01 Schedule Ticket -> 02 Inertia Physics -> 03 ScrollValue Mutators
 * - Reactive Context & Headless Bindings Bridge
 * - 3 Specs: Deterministic, Hardware Timed, Framework Agnostic
 * - Scroll To Explore indicator
 */

import React from 'react';
import { Reveal } from '@scrollcraft/react';
import {
  Box,
  Code,
  Layers,
  Activity,
  SlidersHorizontal,
  Zap,
  Leaf,
} from 'lucide-react';

export function EngineArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative w-full bg-[#050505] py-16 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 overflow-hidden"
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

      {/* Left Outer Floating Watermark */}
      <div className="hidden xl:flex absolute left-8 bottom-24 flex-col items-start font-mono text-[10px] tracking-[0.25em] text-zinc-600 uppercase select-none pointer-events-none">
        <span>BUILT</span>
        <span>FOR</span>
        <span>REAL</span>
        <span>SCROLL.</span>
        <div className="w-5 h-[1.5px] bg-zinc-700 mt-2" />
      </div>

      {/* Right Outer Floating Watermark */}
      <div className="hidden xl:flex absolute right-8 bottom-24 flex-col items-end text-right font-mono text-[10px] tracking-[0.25em] text-zinc-600 uppercase select-none pointer-events-none">
        <span>MORE</span>
        <span>THAN</span>
        <span>AN</span>
        <span>ABSTRACTION.</span>
        <div className="w-5 h-[1.5px] bg-zinc-700 mt-2" />
      </div>

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
                Engineering Authority
              </span>
            </div>
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-3 sm:mb-4 break-words">
              <span className="text-white block">Not a wrapper.</span>
              <span className="text-zinc-500 block">An engine.</span>
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
          <div className="w-full max-w-5xl mx-auto rounded-2xl border border-zinc-800/90 bg-[#09090b] p-4 sm:p-8 shadow-2xl relative overflow-hidden mb-10 sm:mb-14">
            {/* Top Bar inside card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-violet-400 shrink-0 shadow-inner">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm sm:text-base font-bold text-white">
                      @scrollcraft/core
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                      v0.2.0 (LIVE)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/30 text-[10px] font-mono font-bold text-violet-300">
                      v0.3.0 Horizon
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Zero-dependency hardware-timed scroll &amp; physics kernel.
                  </p>
                </div>
              </div>

              {/* Bundle Size Pill */}
              <div className="self-start sm:self-auto flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-mono text-xs shadow-xs">
                  <Code className="w-3.5 h-3.5" />
                  <span>&lt; 5 KB (tree-shaken)</span>
                </div>
              </div>
            </div>

            {/* 3 Pipeline Flow Cards */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-3">
              {/* Phase 1: Schedule Ticket */}
              <div className="rounded-xl border border-zinc-800/90 bg-[#060608] p-4 sm:p-5 flex items-start gap-4 flex-1 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-violet-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-violet-400 font-bold">01</span>
                    <span className="text-zinc-500">Phase 1</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    Schedule Ticket
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Measure &rarr; Mutate &rarr; Render loop eliminates layout thrashing.
                  </p>
                </div>
              </div>

              {/* Connecting Dot 1 */}
              <div className="hidden lg:flex items-center justify-center shrink-0 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
              </div>

              {/* Phase 2: Inertia Normalizer */}
              <div className="rounded-xl border border-zinc-800/90 bg-[#060608] p-4 sm:p-5 flex items-start gap-4 flex-1 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-violet-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-violet-400 font-bold">02</span>
                    <span className="text-zinc-500">Phase 2</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    Inertia Normalizer
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Powered by smooth scrolling physics inspired by Lenis, wired directly into ScrollCraft&apos;s proprietary zero-rerender animation engine.
                  </p>
                </div>
              </div>

              {/* Connecting Dot 2 */}
              <div className="hidden lg:flex items-center justify-center shrink-0 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
              </div>

              {/* Phase 3: ScrollValue Mutators */}
              <div className="rounded-xl border border-zinc-800/90 bg-[#060608] p-4 sm:p-5 flex items-start gap-4 flex-1 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-violet-400 shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-violet-400 font-bold">03</span>
                    <span className="text-zinc-500">Phase 3</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                    ScrollValue Mutators
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Direct GPU style value bypassing React virtual DOM diffing.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Bridge Line inside card */}
            <div className="relative mt-6 sm:mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-center">
              <span className="text-[9px] sm:text-[11px] font-mono tracking-[0.1em] sm:tracking-[0.2em] text-zinc-500 uppercase bg-[#09090b] px-2.5 sm:px-3 text-center break-words">
                REACTIVE CONTEXT &amp; HEADLESS BINDINGS BRIDGE
              </span>
            </div>
          </div>
        </Reveal>

        {/* 3 Spec Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12 sm:mb-16">
          {/* Spec 1 */}
          <div className="flex items-center gap-3.5 justify-start">
            <div className="text-violet-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Deterministic</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Runs between vSync ticks</p>
            </div>
          </div>

          {/* Spec 2 */}
          <div className="flex items-center gap-3.5 justify-start">
            <div className="text-violet-400 shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hardware Timed</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Built for real devices</p>
            </div>
          </div>

          {/* Spec 3 */}
          <div className="flex items-center gap-3.5 justify-start">
            <div className="text-violet-400 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Framework Agnostic</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Use anywhere</p>
            </div>
          </div>
        </div>

        {/* Scroll To Explore Indicator */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-5 h-8 rounded-full border-2 border-zinc-700/80 flex items-start justify-center p-1 shadow-inner">
            <span className="w-1 h-2 rounded-full bg-violet-400 animate-bounce" />
          </div>
          <span className="text-[10px] font-mono font-semibold tracking-[0.25em] text-zinc-500 uppercase mt-2.5">
            SCROLL TO EXPLORE
          </span>
        </div>
      </div>
    </section>
  );
}
