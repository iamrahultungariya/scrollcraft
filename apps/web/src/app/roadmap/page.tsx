import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ScrollProgress, Reveal } from '@scrollcraft/react';
import { SiteNav } from '@/components/layout/site-nav';
import {
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Heart,
  MessageSquare,
  Bug,
  Sparkles,
  ExternalLink,
  Terminal,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Roadmap & Architecture Plan | ScrollCraft',
  description:
    'The certified engineering roadmap for ScrollCraft. Explore active v0.2.0 Beta production verification and upcoming v0.3.0 architectural milestones.',
};

export default function RoadmapPage() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-white">
      {/* Top Reading Progress Bar */}
      <ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-emerald-400 to-violet-500 z-50 origin-left" />

      {/* Unified Site Navigation */}
      <SiteNav />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono font-medium mb-6">
            <Shield className="w-3.5 h-3.5" />
            <span>Architecture &amp; Release Strategy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 break-words">
            ScrollCraft Roadmap
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
            Certified against the 8-Layer Engine Hardening Protocol and the Named Scroll-Timeline Architecture. Explore our current production release verification and upcoming zero-jank engineering milestones.
          </p>
        </div>

        {/* Milestone Cards Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Current Milestone: v0.2.0 Beta */}
          <Reveal direction="up" distance={24} delay={0.1}>
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#0c1410] to-[#070908] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                    CURRENT MILESTONE
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                      v0.2.0 Beta
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
                  Universal Dual API &amp; Hardened Suite
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-6">
                  Production-certified release delivering the Universal Dual API (primitives + hooks parity), 11 production primitives, 9 core hooks, DevTools Inspector Studio, and zero React Virtual DOM re-renders.
                </p>

                <div className="space-y-2.5 mb-6 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Universal Dual API: 1:1 Parity between &lt;Primitives /&gt; and useHooks()</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>11 Production Primitives: Parallax, Pin, Reveal, Sequence, StackedCards, etc.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>DevTools Inspector Studio: Real-time telemetry, HUD, and live knob controls</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Engine Performance: 0.926ms throughput (1,080 FPS capacity, 217 tests green)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="font-mono text-xs text-zinc-300 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 overflow-x-auto no-scrollbar max-w-full">
                  <span className="text-emerald-500 select-none">$</span>
                  <code className="text-emerald-300 select-all font-semibold whitespace-nowrap">npm install @scrollcraft/core@beta @scrollcraft/react@beta</code>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/30 font-semibold">
                  Live on npm • Recommended Release
                </span>
              </div>
            </div>
          </Reveal>

          {/* Upcoming Milestone: v0.3.0 Native Timelines & Spatial Motion */}
          <Reveal direction="up" distance={24} delay={0.2}>
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-[#110d1c] to-[#08070d] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-violet-400" />
                    NEXT HORIZON (PLANNED)
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                    Target Q4 2026
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans">
                  v0.3.0 Native Timelines &amp; Spatial Motion
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-6">
                  Next-generation motion kernel introducing universal CSS Scroll-Driven Timelines across all primitives, View Transitions route choreography, and Multi-Canvas R3F spatial synchronization.
                </p>

                <div className="space-y-2.5 mb-6 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Universal CSS Scroll Timelines (animation-timeline: view() / scroll())</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>View Transitions API integration for route choreography</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Multi-Canvas R3F spatial scene synchronization</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Automated WCAG 2.1 respectReducedMotion across all primitives</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-xs text-zinc-400 font-sans">
                  Architecture spec verified against engine invariants
                </span>
                <span className="text-[11px] font-mono text-violet-400 bg-violet-950/40 px-3 py-1 rounded border border-violet-500/30 font-semibold">
                  Scope-Governed Progress
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Section 1: v0.2.1 Patch SLA & Severity Triage Policy */}
        <Reveal direction="up" distance={20} delay={0.1}>
          <section className="mb-20 rounded-2xl border border-zinc-800 bg-[#09090b] p-6 sm:p-10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
                    v0.2.1 Patch SLA &amp; Bug Triage Policy
                  </h2>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    Transparent, objective criteria ensuring community predictability and rapid hotfix turnaround.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30 font-semibold shrink-0">
                48-Hour Triage Window
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* High Severity */}
              <div className="p-5 rounded-xl border border-red-500/30 bg-red-950/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">High Severity (P0)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">24–48h Hotfix</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">Crash, Core Inoperable, Data Loss</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Application crashes, severe memory leaks (OOM), core primitive completely inoperable, or catastrophic scroll lock / state corruption.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-red-500/20 text-[11px] font-mono text-red-300">
                  Action: Immediate triage &amp; hotfix patch
                </div>
              </div>

              {/* Medium Severity */}
              <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-950/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">Medium Severity (P1)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">0.2.1 Patch</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">Incorrect Behavior, Silent Failure</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Flawed behavior in commonly-used primitives, silent failure (e.g. ref or prop forwarding defects), or documented API mismatches.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-amber-500/20 text-[11px] font-mono text-amber-300">
                  Action: Remediated in 0.2.1 patch window
                </div>
              </div>

              {/* Small Severity */}
              <div className="p-5 rounded-xl border border-zinc-700 bg-zinc-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">Small Severity (P2)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">Scheduled Minor</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">Cosmetic Glitch, Edge Case</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Sub-pixel visual artifacts, rare edge-case configurations, or nice-to-have documentation and ergonomic type gaps.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
                  Action: Bundled into scheduled minor releases
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-800">
              <a
                href="https://discord.gg/scrollcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Join Discord Community</span>
              </a>
              <a
                href="https://github.com/ScrollCraft/scrollcraft/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <Bug className="w-4 h-4 text-emerald-400" />
                <span>Report Issue on GitHub</span>
              </a>
              <div className="flex items-center gap-2 ml-auto text-xs font-mono text-zinc-400 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800/80">
                <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="text-zinc-500 hidden sm:inline">CLI issue shortcut:</span>
                <code className="text-emerald-400 font-semibold select-all">npm bugs @scrollcraft/core</code>
                <span className="text-[10px] text-zinc-500 hidden md:inline border-l border-zinc-800 pl-2">
                  (opens bug tracker directly from terminal)
                </span>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Section 2: Shipped in v0.2.0 Beta: The 7 Production Footguns Solved */}
        <section className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-2">
              Shipped &amp; Verified in v0.2.0 Beta
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight mb-4">
              The 7 Production Footguns Solved in v0.2.0
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl mx-auto">
              Engineered around natural module boundaries and strict runtime invariants. Here are the core browser failure classes eliminated in this release:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {/* Footgun 1 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  01
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  iOS Safari Rubber-Band Guard
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Prevents navbar flicker during elastic bounce-back. If <code className="text-zinc-300">scrollY &lt;= 0</code>, direction is locked to <code className="text-zinc-300">&apos;up&apos;</code> with dual-threshold hysteresis.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                useScrollDirection hook
              </span>
            </div>

            {/* Footgun 2 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  02
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  Mobile Safari 1GB VRAM Jetsam Guard
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Eliminates mobile memory termination crashes. Implements an LRU cache maintaining only 15–20 decoded frames in memory, with DPR capped to 2.0.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                &lt;ScrollSequence /&gt; primitive
              </span>
            </div>

            {/* Footgun 3 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  03
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  SSR Hydration &amp; Race Cancellation
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Eliminates React Hydration #418/#425 and ghost text. State transitions from <code className="text-zinc-300">data-sc-reveal=&quot;pending&quot;</code> to <code className="text-zinc-300">&quot;active&quot;</code> upon hydration, instantly cancelling CSS fallback races.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                &lt;TextReveal /&gt; component
              </span>
            </div>

            {/* Footgun 4 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  04
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  Dynamic Callback Ref Swapping
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Prevents memory leaks during conditional renders. Captured node closures ensure the previously mounted element is safely unobserved even if ref.current mutates.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                Universal Dual API Guard
              </span>
            </div>

            {/* Footgun 5 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  05
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  Variable Heights &amp; Pointer-Events Gating
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Independently measures each card&apos;s unique offsetHeight to calculate custom pin durations. Inactive buried cards receive <code className="text-zinc-300">pointer-events: none</code> to prevent ghost clicks.
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                &lt;StackedCards /&gt; primitive
              </span>
            </div>

            {/* Footgun 6 */}
            <div className="p-6 rounded-2xl bg-[#09090b] border border-zinc-800/90 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-8 h-8 rounded-lg bg-violet-950/50 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-mono text-xs font-bold">
                  06
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-sans">
                  Zero-GC Pre-Parsed Color Tuples
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Eliminates regex garbage collection pauses during scroll. Pre-parses hex and rgba strings into numeric float tuples <code className="text-zinc-300">[r, g, b, a]</code> during Phase 1 (measure).
                </p>
              </div>
              <span className="text-[10px] font-mono text-violet-400 mt-4 block">
                &lt;ScrollTransform /&gt; color math
              </span>
            </div>
          </div>

          {/* Planned Hook Superpowers Grid */}
          <div className="rounded-2xl border border-zinc-800 bg-[#09090b] p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 font-sans flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              <span>Planned Superpowers across Existing Hooks</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useParallax</span>
                <p className="text-zinc-400 leading-relaxed">
                  Universal Dual API, <code className="text-zinc-300">origin=&quot;auto&quot;</code> hero anti-jump, bleed container clipping, and multi-axis 3D scale/rotation.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useReveal</span>
                <p className="text-zinc-400 leading-relaxed">
                  Atmospheric blur reveal (<code className="text-zinc-300">blur(8px) -&gt; 0</code>), 3D perspective tilt, auto-stagger indexing, and zero-rerender callbacks.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">usePin</span>
                <p className="text-zinc-400 leading-relaxed">
                  Auto pin-spacing without wrapper containers, 4-state lifecycle (onEnter, onLeave, onEnterBack, onLeaveBack), and zero-rerender progress value.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useScrollTransform</span>
                <p className="text-zinc-400 leading-relaxed">
                  Built-in presets (&apos;zoom-in&apos;, &apos;3d-flip&apos;), unit freedom (&apos;vh&apos;, &apos;%&apos;, &apos;deg&apos;), and pre-parsed RGBA numeric tuples.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useScrollDraw</span>
                <p className="text-zinc-400 leading-relaxed">
                  Universal SVG geometry support (&lt;path&gt;, &lt;rect&gt;, &lt;circle&gt;, &lt;polyline&gt;), dash array patterns, and direct DOM rendering.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="font-mono font-bold text-violet-400">useMagnetic</span>
                <p className="text-zinc-400 leading-relaxed">
                  Dual API, subtle hover scale inflation, and multi-layer inner parallax (button icon moves faster than background).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Architecture & Attributions */}
        <Reveal direction="up" distance={24} delay={0.15}>
          <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-950 to-[#07070a] p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-zinc-800/80 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-violet-400">
                    ENGINEERING ARCHITECTURE &amp; PRIOR ART
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono font-medium">
                    Open Source Attributions
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Custom React Motion Core &bull; Inertia Normalization Prior Art
                </h3>
              </div>

              <a
                href="https://github.com/darkroomengineering/lenis"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 hover:text-white transition-all shrink-0 cursor-pointer"
              >
                <span>View Lenis Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>
            </div>

            {/* Dual Architectural Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pillar 1: ScrollCraft In-House Core */}
              <div className="p-6 rounded-2xl bg-black/50 border border-zinc-800/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-300">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      ScrollCraft Motion Core
                    </h4>
                    <span className="text-[11px] font-mono text-violet-400">
                      In-House React 19 Architecture
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  The centralized 3-Phase Ticker, direct DOM Transform Composer, and all declarative primitives (<code className="text-violet-300">&lt;Parallax&gt;</code>, <code className="text-violet-300">&lt;Pin&gt;</code>, <code className="text-violet-300">&lt;Reveal&gt;</code>, <code className="text-violet-300">&lt;StackedCards&gt;</code>, <code className="text-violet-300">&lt;ScrollSequence&gt;</code>) are custom systems built specifically for React 19 concurrency and Next.js 15 App Router streaming.
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                  <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 3-Phase Ticker
                  </span>
                  <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GPU Compositor
                  </span>
                  <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 0 Re-Render Invariant
                  </span>
                </div>
              </div>

              {/* Pillar 2: Open Source Pedigree & Lenis Attributions */}
              <div className="p-6 rounded-2xl bg-black/50 border border-zinc-800/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Heart className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Inertia Physics Prior Art
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Studio Freight &amp; Clément Roche Lineage
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  Our virtual momentum calculations take mathematical inspiration from the pioneering work of Studio Freight&apos;s Lenis. We utilize these normalization principles to deliver smooth trackpad and wheel interpolation across platforms, wired directly into ScrollCraft&apos;s zero-rerender compositor pipeline.
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                  <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Kinetic Physics
                  </span>
                  <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cross-Browser Deltas
                  </span>
                  <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> MIT Collaboration
                  </span>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 pt-8 pb-28 sm:py-8 text-center text-xs text-zinc-500 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} ScrollCraft (v0.2.0 Beta). MIT Licensed.</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
            <Link href="/showcase" className="hover:text-zinc-300 transition-colors">Showcase</Link>
            <Link href="/roadmap" className="hover:text-zinc-300 transition-colors">Roadmap</Link>
            <Link href="/test" className="hover:text-zinc-300 transition-colors">Test Lab</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
