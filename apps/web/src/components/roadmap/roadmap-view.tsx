'use client';

/**
 * ScrollCraft Roadmap & Engineering Strategy View
 * Pure Brutalist Overhaul:
 * - 0 Radius globally, 2px borders, hard offset shadows
 * - Strict 2 Neutrals + 1 Accent: #0C0F0C, #F4F1EA, #A8ABA0, #DFFF00
 * - Professional wording, 0 gimmicky FPS claims
 * - Direct interactive routing to Test Lab & GitHub bug tracker
 */

import React, { useState } from 'react';
import Link from 'next/link';
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
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

export function RoadmapView() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCliBug, setCopiedCliBug] = useState(false);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('npm install @scrollcraft/core@beta @scrollcraft/react@beta');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 1500);
  };

  const copyCliBug = () => {
    navigator.clipboard.writeText('npm bugs @scrollcraft/core');
    setCopiedCliBug(true);
    setTimeout(() => setCopiedCliBug(false), 1500);
  };

  return (
    <div className="w-full min-h-screen bg-bg text-fg flex flex-col font-body selection:bg-accent selection:text-black">
      {/* Unified Site Navigation with Real Routes */}
      <SiteNav variant="sticky" maxWidth="max-w-[1536px]" />

      <main className="flex-1 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-16">
        {/* 1. Hero Section */}
        <section className="space-y-6 pb-8 border-b-2 border-line">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span>[ROADMAP / 01] ARCHITECTURE &amp; RELEASE STRATEGY</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <span>STATUS:</span>
              <span className="px-2 py-0.5 border-2 border-line bg-accent text-black font-bold uppercase text-[10px]">
                PRODUCTION HARDENED
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
              ScrollCraft Roadmap
            </h1>
            <p className="text-base sm:text-lg text-fg/90 font-body leading-relaxed max-w-3xl">
              Certified against the 8-Layer Engine Hardening Protocol and the Named Scroll-Timeline Architecture. Explore our current production release verification and upcoming zero-jank engineering milestones.
            </p>
          </div>

          {/* Telemetry Stat Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">CURRENT MILESTONE</span>
              <span className="text-xl sm:text-2xl font-black text-accent font-display">v0.2.0 BETA</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">HOTFIX TRIAGE SLA</span>
              <span className="text-xl sm:text-2xl font-black text-fg font-display">24–48 HOURS</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">PRIMITIVES &amp; HOOKS</span>
              <span className="text-xl sm:text-2xl font-black text-accent font-display">20 TOTAL</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">VDOM OVERHEAD</span>
              <span className="text-xl sm:text-2xl font-black text-fg font-display">0 RE-RENDERS</span>
            </div>
          </div>
        </section>

        {/* 2. Milestone Cards: v0.2.0 Beta vs v0.3.0 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Milestone 1: Current v0.2.0 Beta */}
          <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
            <div>
              {/* Card Header Strip */}
              <div className="border-b-2 border-line bg-line-soft/30 px-4 py-2.5 font-mono text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent uppercase tracking-wider">
                  <span className="w-2 h-2 bg-accent inline-block" />
                  <span>[CURRENT MILESTONE] LIVE ON NPM</span>
                </div>
                <span className="px-2 py-0.5 border border-line bg-accent text-black text-[10px] font-bold uppercase">
                  v0.2.0 Beta
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-fg font-display tracking-tight">
                  Universal Dual API &amp; Hardened Suite
                </h2>
                <p className="text-xs sm:text-sm text-fg/80 font-body leading-relaxed">
                  Production-certified release delivering the Universal Dual API (1:1 parity between declarative primitives and headless hooks), 11 production primitives, 9 core reactive hooks, DevTools Inspector Studio, and zero React Virtual DOM re-renders.
                </p>

                <div className="space-y-2.5 pt-2 text-xs font-mono text-fg">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>Universal Dual API: 1:1 Parity between &lt;Primitives /&gt; and useHooks()</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>11 Production Primitives: Parallax, Pin, Reveal, Sequence, StackedCards, etc.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>DevTools Inspector Studio: Real-time telemetry, HUD, and live spring tuner</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>Engine Invariant: Sub-millisecond throughput with direct ref GPU style writes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Install Strip Footer */}
            <div className="border-t-2 border-line p-5 bg-line-soft/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
                <span className="text-accent font-bold select-none">$</span>
                <span className="text-fg font-bold whitespace-nowrap">
                  npm i @scrollcraft/core@beta @scrollcraft/react@beta
                </span>
              </div>

              <button
                onClick={copyInstallCommand}
                className="h-9 px-3.5 border-2 border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Copy install command"
              >
                {copiedInstall ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Milestone 2: Upcoming v0.3.0 */}
          <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
            <div>
              {/* Card Header Strip */}
              <div className="border-b-2 border-line bg-line-soft/30 px-4 py-2.5 font-mono text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2 text-fg uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span>[NEXT HORIZON] PLANNED &bull; TARGET Q4 2026</span>
                </div>
                <span className="px-2 py-0.5 border border-line-soft bg-bg text-muted text-[10px] font-bold uppercase">
                  v0.3.0
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-fg font-display tracking-tight">
                  Native Timelines &amp; Spatial Motion
                </h2>
                <p className="text-xs sm:text-sm text-fg/80 font-body leading-relaxed">
                  Next-generation motion kernel introducing universal CSS Scroll-Driven Timelines across all primitives, View Transitions route choreography, and Multi-Canvas R3F spatial synchronization.
                </p>

                <div className="space-y-2.5 pt-2 text-xs font-mono text-fg">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-accent inline-block shrink-0" />
                    <span>Universal CSS Scroll Timelines (animation-timeline: view() / scroll())</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-accent inline-block shrink-0" />
                    <span>View Transitions API integration for smooth route choreography</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-accent inline-block shrink-0" />
                    <span>Multi-Canvas R3F spatial scene synchronization with unified RAF</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-accent inline-block shrink-0" />
                    <span>Automated WCAG 2.1 OS prefers-reduced-motion across all primitives</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scope Status Footer */}
            <div className="border-t-2 border-line p-5 bg-line-soft/20 flex items-center justify-between gap-3 font-mono text-xs">
              <span className="text-muted text-xs font-body">
                Architecture spec verified against engine invariants.
              </span>
              <span className="text-[11px] font-mono px-3 py-1 border border-line bg-bg text-accent font-bold uppercase shrink-0">
                SCOPE GOVERNED
              </span>
            </div>
          </div>
        </section>

        {/* 3. Section 1: Patch SLA & Bug Triage Policy */}
        <section className="border-2 border-line bg-bg p-6 sm:p-10 shadow-rest space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-line pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 border-2 border-line bg-accent text-black">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-fg font-display tracking-tight">
                  v0.2.1 Patch SLA &amp; Bug Triage Policy
                </h2>
                <p className="text-xs text-muted font-body mt-0.5">
                  Transparent, objective criteria ensuring community predictability and rapid hotfix turnaround.
                </p>
              </div>
            </div>
            <span className="border-2 border-line bg-bg px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-rest shrink-0">
              48-HOUR TRIAGE WINDOW
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Severity */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-xs font-bold flex items-center justify-between">
                <span className="text-accent uppercase tracking-wider">[P0] HIGH SEVERITY</span>
                <span className="px-2 py-0.5 border border-line bg-accent text-black text-[10px] font-bold">24–48H HOTFIX</span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-sm font-bold uppercase text-fg font-display">Crash, Core Inoperable, OOM</h4>
                <p className="text-xs text-fg/80 leading-relaxed font-body">
                  Application crashes, severe memory leaks (OOM), core primitive completely inoperable, or catastrophic scroll lock / state corruption.
                </p>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 text-[11px] font-mono text-accent font-bold uppercase">
                ACTION: IMMEDIATE TRIAGE &amp; HOTFIX PATCH
              </div>
            </div>

            {/* Medium Severity */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-xs font-bold flex items-center justify-between">
                <span className="text-fg uppercase tracking-wider">[P1] MEDIUM SEVERITY</span>
                <span className="px-2 py-0.5 border border-line-soft bg-bg text-muted text-[10px] font-bold">0.2.1 PATCH</span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-sm font-bold uppercase text-fg font-display">Flawed Behavior, Silent Failure</h4>
                <p className="text-xs text-fg/80 leading-relaxed font-body">
                  Flawed behavior in commonly-used primitives, silent failure (e.g. ref or prop forwarding defects), or documented API mismatches.
                </p>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 text-[11px] font-mono text-muted font-bold uppercase">
                ACTION: REMEDIATED IN 0.2.1 WINDOW
              </div>
            </div>

            {/* Small Severity */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-xs font-bold flex items-center justify-between">
                <span className="text-muted uppercase tracking-wider">[P2] SMALL SEVERITY</span>
                <span className="px-2 py-0.5 border border-line-soft bg-bg text-muted text-[10px] font-bold">SCHEDULED MINOR</span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-sm font-bold uppercase text-fg font-display">Cosmetic Glitch, Edge Case</h4>
                <p className="text-xs text-fg/80 leading-relaxed font-body">
                  Sub-pixel visual artifacts, rare edge-case configurations, or nice-to-have documentation and ergonomic type gaps.
                </p>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 text-[11px] font-mono text-muted font-bold uppercase">
                ACTION: BUNDLED INTO MINOR RELEASE
              </div>
            </div>
          </div>

          {/* Action Links & Terminal Shortcut */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-line font-mono text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://discord.gg/scrollcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-bold uppercase shadow-rest hover:shadow-hover transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>DISCORD COMMUNITY</span>
              </a>

              <a
                href="https://github.com/ScrollCraft/scrollcraft/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-bold uppercase shadow-rest hover:shadow-hover transition-all flex items-center gap-2"
              >
                <Bug className="w-3.5 h-3.5 text-accent group-hover:text-black" />
                <span>REPORT ISSUE ON GITHUB</span>
              </a>
            </div>

            {/* Terminal CLI Bug Shortcut */}
            <div className="flex items-center gap-2 border-2 border-line bg-bg px-3 py-1.5 shadow-rest">
              <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-muted hidden sm:inline">CLI SHORTCUT:</span>
              <code className="text-fg font-bold select-all">npm bugs @scrollcraft/core</code>
              <button
                onClick={copyCliBug}
                className="p-1 border border-line-soft hover:bg-fg hover:text-black transition-colors cursor-pointer text-muted hover:text-black ml-1"
                title="Copy CLI shortcut"
              >
                {copiedCliBug ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </section>

        {/* 4. Section 2: Shipped in v0.2.0: The 6 Production Footguns Solved */}
        <section className="space-y-8">
          <div className="space-y-2 border-b-2 border-line pb-6">
            <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span>[SHIPPED IN v0.2.0] HARDENED PRODUCTION GUARDS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-fg font-display">
              The 6 Production Footguns Solved in v0.2.0
            </h2>
            <p className="text-sm text-fg/80 font-body leading-relaxed max-w-3xl">
              Engineered around natural module boundaries and strict runtime invariants. Here are the core browser failure classes permanently eliminated in this release:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-body">
            {/* Footgun 1 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-accent uppercase flex items-center justify-between">
                  <span>[01] HYSTERESIS GUARD</span>
                  <span className="text-muted">useScrollDirection</span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-black text-base uppercase text-fg">iOS Safari Rubber-Band Guard</h3>
                  <p className="text-xs text-fg/80 leading-relaxed font-body">
                    Prevents navbar flickering during elastic bounce-back. If scrollY &le; 0, direction is locked to &apos;up&apos; with dual-threshold hysteresis.
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 font-mono text-[10px] text-muted font-bold uppercase">
                ELIMINATES MOBILE TOP STROBE
              </div>
            </div>

            {/* Footgun 2 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-fg uppercase flex items-center justify-between">
                  <span>[02] VRAM JETSAM GUARD</span>
                  <span className="text-muted">&lt;ScrollSequence /&gt;</span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-black text-base uppercase text-fg">Mobile Safari 1GB VRAM Guard</h3>
                  <p className="text-xs text-fg/80 leading-relaxed font-body">
                    Eliminates mobile memory termination crashes. Implements an LRU cache maintaining only 15–20 decoded frames in memory, with DPR clamped to 2.0.
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 font-mono text-[10px] text-muted font-bold uppercase">
                PREVENTS BROWSER OUT-OF-MEMORY
              </div>
            </div>

            {/* Footgun 3 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-accent uppercase flex items-center justify-between">
                  <span>[03] HYDRATION RACE</span>
                  <span className="text-muted">&lt;TextReveal /&gt;</span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-black text-base uppercase text-fg">SSR Hydration Cancellation</h3>
                  <p className="text-xs text-fg/80 leading-relaxed font-body">
                    Eliminates React Hydration #418/#425 and ghost text. State transitions from data-sc-reveal=&quot;pending&quot; to &quot;active&quot; upon hydration, cancelling CSS fallback races.
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 font-mono text-[10px] text-accent font-bold uppercase">
                ZERO REACT HYDRATION MISMATCH
              </div>
            </div>

            {/* Footgun 4 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-fg uppercase flex items-center justify-between">
                  <span>[04] DYNAMIC REF SWAPPING</span>
                  <span className="text-muted">Universal Dual API</span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-black text-base uppercase text-fg">Dynamic Callback Ref Guard</h3>
                  <p className="text-xs text-fg/80 leading-relaxed font-body">
                    Prevents memory leaks during conditional renders. Captured node closures ensure the previously mounted element is safely unobserved even if ref.current mutates.
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 font-mono text-[10px] text-muted font-bold uppercase">
                SAFE CONDITIONAL REMOUNTING
              </div>
            </div>

            {/* Footgun 5 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-fg uppercase flex items-center justify-between">
                  <span>[05] POINTER-EVENTS GATING</span>
                  <span className="text-muted">&lt;StackedCards /&gt;</span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-black text-base uppercase text-fg">Variable Heights &amp; Depth Gating</h3>
                  <p className="text-xs text-fg/80 leading-relaxed font-body">
                    Measures each card&apos;s unique offsetHeight to calculate custom pin durations. Inactive buried cards receive pointer-events: none to prevent ghost clicks.
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 font-mono text-[10px] text-muted font-bold uppercase">
                NO GHOST CLICKS ON BURIED LAYERS
              </div>
            </div>

            {/* Footgun 6 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-accent uppercase flex items-center justify-between">
                  <span>[06] ZERO-GC PARSING</span>
                  <span className="text-muted">&lt;ScrollTransform /&gt;</span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-black text-base uppercase text-fg">Zero-GC Pre-Parsed Color Tuples</h3>
                  <p className="text-xs text-fg/80 leading-relaxed font-body">
                    Eliminates regex garbage collection pauses during scroll. Pre-parses hex and rgba strings into numeric float tuples [r, g, b, a] during Phase 1 (measure).
                  </p>
                </div>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 font-mono text-[10px] text-accent font-bold uppercase">
                0 GC PAUSES DURING HIGH VELOCITY
              </div>
            </div>
          </div>
        </section>

        {/* 5. Section 3: Architecture & Attributions */}
        <section className="border-2 border-line bg-bg p-6 sm:p-10 shadow-rest space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-line pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 border-2 border-line bg-accent text-black">
                <Heart className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-fg font-display tracking-tight">
                  Architecture &amp; Open Source Attributions
                </h3>
                <p className="text-xs text-muted font-body mt-0.5">
                  Custom React 19 Motion Core &bull; Inertia Normalization Prior Art
                </p>
              </div>
            </div>

            <a
              href="https://github.com/darkroomengineering/lenis"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>VIEW LENIS REPOSITORY</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body">
            {/* Pillar 1: ScrollCraft In-House Core */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-xs font-bold text-accent uppercase flex items-center justify-between">
                  <span>SCROLLCRAFT MOTION CORE</span>
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-display font-black text-lg uppercase text-fg">In-House React 19 Architecture</h4>
                  <p className="text-xs sm:text-sm text-fg/80 leading-relaxed font-body">
                    The centralized 3-Phase Ticker, direct DOM Transform Composer, and all declarative primitives (&lt;Parallax&gt;, &lt;Pin&gt;, &lt;Reveal&gt;, &lt;StackedCards&gt;, &lt;ScrollSequence&gt;) are custom systems built specifically for React 19 concurrency and Next.js 15 App Router streaming with 0 React re-renders.
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-line p-3 bg-line-soft/20 flex flex-wrap gap-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 border border-line bg-bg text-accent font-bold uppercase">✦ 3-PHASE TICKER</span>
                <span className="px-2 py-0.5 border border-line bg-bg text-fg font-bold uppercase">✦ GPU COMPOSITOR</span>
                <span className="px-2 py-0.5 border border-line bg-bg text-accent font-bold uppercase">✦ 0 RE-RENDERS</span>
              </div>
            </div>

            {/* Pillar 2: Open Source Pedigree & Lenis Attributions */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div>
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-xs font-bold text-fg uppercase flex items-center justify-between">
                  <span>INERTIA PHYSICS PRIOR ART</span>
                  <Heart className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-display font-black text-lg uppercase text-fg">Studio Freight Lineage</h4>
                  <p className="text-xs sm:text-sm text-fg/80 leading-relaxed font-body">
                    Our virtual momentum calculations take mathematical inspiration from the pioneering work of Studio Freight&apos;s Lenis. We utilize these normalization principles to deliver smooth trackpad and wheel interpolation across platforms, wired directly into ScrollCraft&apos;s zero-rerender compositor pipeline.
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-line p-3 bg-line-soft/20 flex flex-wrap gap-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 border border-line bg-bg text-fg font-bold uppercase">✦ KINETIC NORMALIZATION</span>
                <span className="px-2 py-0.5 border border-line bg-bg text-accent font-bold uppercase">✦ CROSS-BROWSER DELTAS</span>
                <span className="px-2 py-0.5 border border-line bg-bg text-fg font-bold uppercase">✦ MIT COLLABORATION</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Pure Brutalist Footer */}
      <footer className="w-full border-t-2 border-line py-8 sm:py-10 bg-bg text-xs font-mono text-muted">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-fg font-bold uppercase">
            <span>SCROLL CRAFT</span>
            <span className="w-2 h-2 bg-accent inline-block" />
            <span className="text-muted font-normal text-[11px]">&copy; {new Date().getFullYear()} MIT LICENSED</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs uppercase font-bold">
            <Link href="/" className="hover:text-accent transition-colors">HOME</Link>
            <Link href="/docs" className="hover:text-accent transition-colors">DOCS</Link>
            <Link href="/showcase" className="hover:text-accent transition-colors">SHOWCASE</Link>
            <Link href="/test" className="hover:text-accent transition-colors">TEST LAB</Link>
            <Link href="/roadmap" className="text-accent underline underline-offset-4">ROADMAP</Link>
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GITHUB ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
