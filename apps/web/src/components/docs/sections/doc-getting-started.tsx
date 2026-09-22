'use client';

/**
 * ScrollCraft Docs: Getting Started (Reference-Only)
 * Fast 15-second scanning setup reference:
 * - Package install command
 * - Root layout integration (<ScrollProvider>)
 * - Mental model & RSC rules
 * Strictly zero narrative fluff.
 */

import React, { useState } from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Check, Copy, Terminal, ShieldCheck, BookOpen, Layers, Cpu, Zap, Heart } from 'lucide-react';

interface DocGettingStartedProps {
  sectionId: string;
}

const PM_COMMANDS = {
  pnpm: 'pnpm add @scrollcraft/core@beta @scrollcraft/react@beta',
  npm: 'npm install @scrollcraft/core@beta @scrollcraft/react@beta',
  yarn: 'yarn add @scrollcraft/core@beta @scrollcraft/react@beta',
  bun: 'bun add @scrollcraft/core@beta @scrollcraft/react@beta',
};

const NEXT_LAYOUT_SETUP = `// app/layout.tsx
import type { Metadata } from 'next';
import { ScrollProvider } from '@scrollcraft/react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider smooth={true} respectReducedMotion={true} autoRecalc={true}>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}`;

const QUICK_START_CODE = `'use client';

import { Parallax, Reveal } from '@scrollcraft/react';

export function HeroScene() {
  return (
    <div className="relative min-h-screen">
      <Parallax speed={-0.2}>
        <div className="bg-layer" />
      </Parallax>
      <Reveal direction="up" distance={30} delay={0.1}>
        <h1>High-Performance Scroll Engine</h1>
      </Reveal>
    </div>
  );
}`;

const PROVIDER_PROPS = [
  { prop: 'smooth', type: 'boolean | InertiaConfig', defaultValue: 'true', desc: 'Enables Lenis subpixel inertia scroll normalization across all platforms.' },
  { prop: 'respectReducedMotion', type: 'boolean', defaultValue: 'true', desc: 'Automatically disables smooth inertia and collapses animations when OS prefers-reduced-motion is active.' },
  { prop: 'autoRecalc', type: 'boolean', defaultValue: 'true', desc: 'Monitors document body mutations and font loading to dynamically update scroll dimensions.' },
  { prop: 'debug', type: 'boolean | DebugOptions', defaultValue: 'false', desc: 'Mounts telemetry inspector HUD and visual scroll trigger boundaries.' },
];

export const DocGettingStarted: React.FC<DocGettingStartedProps> = ({ sectionId }) => {
  const [activePm, setActivePm] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('npm');
  const [copied, setCopied] = useState(false);

  // Auto-scroll to requested section when sectionId changes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const targetMap: Record<string, string> = {
      introduction: 'introduction-mental-model',
      installation: 'install-package',
      setup: 'provider-setup',
    };
    const targetId = targetMap[sectionId];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -88;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [sectionId]);

  const copyInstall = () => {
    navigator.clipboard.writeText(PM_COMMANDS[activePm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 not-prose">
      {/* 0. Introduction & Mental Model */}
      <section id="introduction-mental-model" className="space-y-4 border-b border-zinc-800 pb-8 scroll-mt-24">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-400 shrink-0" />
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono break-words">Introduction &amp; Mental Model</h1>
        </div>
        <p className="text-sm text-zinc-300 font-sans leading-relaxed">
          ScrollCraft is a hardware-accelerated declarative scroll engine built specifically for React and Next.js App Router. It decouples continuous scroll gestures from React&apos;s fiber reconciliation tree, writing directly to GPU composite matrices with zero Virtual DOM re-renders.
        </p>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Zero Re-Renders</span>
            </div>
            <p className="text-zinc-400 text-xs font-sans leading-relaxed">
              Scroll transformations update directly in the RAF render microtask without triggering component re-renders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>RSC &amp; Slot Native</span>
            </div>
            <p className="text-zinc-400 text-xs font-sans leading-relaxed">
              Fully compatible with Next.js 15 Server Components. Use <code className="text-zinc-300 font-mono">asChild</code> to avoid extra wrapper DOM nodes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0a0c] border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>&lt; 5 KB Brotli</span>
            </div>
            <p className="text-zinc-400 text-xs font-sans leading-relaxed">
              Tree-shakeable architecture with zero external runtime dependencies. Built on high-precision physics.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Installation */}
      <section id="install-package" className="space-y-4 border-b border-zinc-800 pb-8 scroll-mt-24">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400 shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-white font-mono break-words">Package Installation</h2>
        </div>

        {/* Package Manager Selector & Copy Box */}
        <div className="rounded-xl border border-zinc-800 bg-[#09090b] p-3 sm:p-4 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 overflow-x-auto no-scrollbar">
            {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => {
              const isUpcoming = pm === 'yarn' || pm === 'bun';
              return (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setActivePm(pm)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium border transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    activePm === pm
                      ? 'bg-zinc-800 text-white font-bold border-zinc-700'
                      : 'text-zinc-500 hover:text-zinc-300 border-transparent'
                  }`}
                >
                  <span>{pm}</span>
                  {isUpcoming && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-sans font-medium">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {(activePm === 'yarn' || activePm === 'bun') && (
            <div className="rounded-lg bg-amber-950/20 border border-amber-500/30 p-2.5 text-xs text-amber-300/90 font-sans flex items-center gap-2">
              <span className="font-semibold text-amber-400 uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 shrink-0">
                Notice
              </span>
              <span className="break-words">
                {activePm === 'yarn' ? 'Yarn' : 'Bun'} package registry integration is in validation. For v0.2.0 Beta, please use <strong>pnpm</strong> or <strong>npm</strong>.
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 font-mono text-xs sm:text-sm text-zinc-200">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-zinc-500 select-none">$</span>
              <span className="whitespace-nowrap">{PM_COMMANDS[activePm]}</span>
            </div>
            <button
              onClick={copyInstall}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors cursor-pointer shrink-0 self-end sm:self-auto"
              title="Copy installation command"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-zinc-400 pt-1">
          <span>Peer Requirements: React 18+ or 19+</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>Next.js 14+ or 15+ (App Router)</span>
        </div>

        {/* Release Status Banner */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-950/30 via-zinc-900/50 to-violet-950/30 border border-emerald-500/30 p-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">Current Release: v0.2.0 Beta (LIVE)</span>
            <span className="text-zinc-600 font-mono text-xs">|</span>
            <span className="text-xs font-mono font-bold text-violet-400">Next Horizon: v0.3.0 (Planned)</span>
          </div>
          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            Install the active release with <code className="text-emerald-300 font-mono font-semibold">npm install @scrollcraft/core@beta @scrollcraft/react@beta</code>. <strong className="text-white">v0.2.0 Beta</strong> is the single recommended package, featuring the Universal Dual API, 11 production primitives, 9 hooks, and zero React Virtual DOM re-renders. (Note: Early internal cycles <code className="text-zinc-400 font-mono">v0.1.0</code> and <code className="text-zinc-400 font-mono">v0.1.1</code> served strictly as soak baselines and are deprecated).
          </p>
        </div>

        {/* Feature Support Matrix Table */}
        <div id="feature-matrix" className="rounded-xl border border-zinc-800 bg-[#09090b] p-5 space-y-4 shadow-lg scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-mono">Feature Support Matrix</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  v0.2.0 Beta
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Transparent disclosure of primitive capabilities, polymorphic slot composition, accessibility, and hardware acceleration drivers.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono text-zinc-400 shrink-0">
              <span className="flex items-center gap-1"><span className="text-emerald-400 font-bold">✅</span> Shipped</span>
              <span className="flex items-center gap-1"><span className="text-amber-400 font-bold">🔜</span> v0.3.0</span>
              <span className="flex items-center gap-1"><span className="text-zinc-500 font-bold">—</span> N/A</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-2.5 px-3 font-semibold text-white">Primitive</th>
                  <th className="py-2.5 px-3 font-semibold text-center">asChild (Polymorphic)</th>
                  <th className="py-2.5 px-3 font-semibold text-center">respectReducedMotion (A11y)</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Native Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;Parallax /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-semibold">✅ (driver: &apos;css&apos;)</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;Reveal /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;ScrollTransform /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;ScrollDraw /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;Pin /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">🔜</td>
                  <td className="py-2.5 px-3 text-center text-zinc-400">Partial (disableTransform)</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;HorizontalScroll /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                  <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">🔜</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-semibold">✅ (CSS Snap)</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;StackedCards /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">🔜</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;Magnetic /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">🔜</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;ScrollProgress /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-semibold">✅ (CSS Timeline)</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;VelocityMarquee /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                  <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">🔜</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;ScrollSequence /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                  <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">🔜</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">— (Canvas 2D Ticker)</td>
                </tr>
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-violet-300">&lt;TextReveal /&gt;</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">✅</td>
                  <td className="py-2.5 px-3 text-center text-amber-400 font-semibold">🔜</td>
                  <td className="py-2.5 px-3 text-center text-zinc-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-zinc-400 font-sans">
            <p>
              In accordance with mature engineering standards (like React and MDN compatibility tables), transparently disclosing capabilities alongside current boundaries builds enduring developer trust.
            </p>
            <span className="font-mono text-violet-400 shrink-0">
              🔜 = Scheduled for v0.3.0
            </span>
          </div>
        </div>
      </section>

      {/* 2. Root Layout Integration */}
      <section id="provider-setup" className="space-y-4 border-b border-zinc-800 pb-8 scroll-mt-24">
        <div>
          <h2 className="text-xl font-bold text-white font-mono mb-1">Root Layout Integration</h2>
          <p className="text-xs text-zinc-400 font-sans">
            Mount <code className="text-violet-400 font-mono">&lt;ScrollProvider /&gt;</code> in your root layout. Initializes the global 3-phase ticker and Lenis inertia physics.
          </p>
        </div>

        <CodeViewer code={NEXT_LAYOUT_SETUP} fileName="app/layout.tsx" />

        {/* ScrollProvider Props Table */}
        <div id="provider-props" className="space-y-3 pt-3 scroll-mt-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
              ScrollProvider Configuration Options
            </span>
            <span className="text-[10px] font-mono text-zinc-500 sm:hidden">Swipe table &rarr;</span>
          </div>
          <div className="rounded-xl border border-zinc-800 overflow-x-auto bg-[#0a0a0c]">
            <table className="w-full text-left text-xs font-mono min-w-[550px]">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Prop</th>
                  <th className="px-4 py-2.5 font-semibold">Type</th>
                  <th className="px-4 py-2.5 font-semibold">Default</th>
                  <th className="px-4 py-2.5 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans text-zinc-300">
                {PROVIDER_PROPS.map((p) => (
                  <tr key={p.prop} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-violet-400 font-semibold">{p.prop}</td>
                    <td className="px-4 py-3 font-mono text-purple-300 text-[11px]">{p.type}</td>
                    <td className="px-4 py-3 font-mono text-zinc-500 text-[11px]">{p.defaultValue}</td>
                    <td className="px-4 py-3 text-zinc-300 text-xs">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Quickstart Component Example */}
      <section id="quick-example" className="space-y-4 border-b border-zinc-800 pb-8 scroll-mt-24">
        <div>
          <h2 className="text-xl font-bold text-white font-mono mb-1">Quickstart Component</h2>
          <p className="text-xs text-zinc-400 font-sans">
            Add <code className="text-violet-400 font-mono">&apos;use client&apos;</code> to components using primitives or hooks, or pass Server Components as children.
          </p>
        </div>

        <CodeViewer code={QUICK_START_CODE} fileName="components/hero-scene.tsx" />
      </section>

      {/* 4. Core Architecture Invariant */}
      <section id="core-invariants" className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-2 scroll-mt-24">
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Core Engineering Invariants</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-zinc-400 font-sans leading-relaxed">
          <li><strong className="text-white">Zero React Re-Renders:</strong> Scroll physics write directly to ref style transforms at hardware frame intervals.</li>
          <li><strong className="text-white">Deterministic 3-Phase Loop:</strong> Measure phase precedes all style mutator writes, eliminating layout thrashing.</li>
          <li><strong className="text-white">Full RSC Compatibility:</strong> Compatible with Next.js 15 Server Components and streaming SSR.</li>
        </ul>
      </section>

      {/* 5. Architecture & Attributions */}
      <section id="architecture-attributions" className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-400 space-y-3 font-sans scroll-mt-24">
        <div className="flex items-center gap-2 text-white font-mono font-bold">
          <Heart className="w-4 h-4 text-violet-400" />
          <span>Architecture &amp; Attributions</span>
        </div>
        <div className="space-y-2 leading-relaxed">
          <p>
            <strong className="text-zinc-200 font-mono">ScrollCraft Motion Engine:</strong> The core multi-phase ticker, zero-rerender DOM compositor, native CSS Scroll-Timeline drivers, and declarative primitives (<code className="text-violet-300">&lt;Parallax&gt;</code>, <code className="text-violet-300">&lt;Pin&gt;</code>, <code className="text-violet-300">&lt;Reveal&gt;</code>, <code className="text-violet-300">&lt;StackedCards&gt;</code>) are custom in-house systems built from scratch for React.
          </p>
          <p>
            <strong className="text-zinc-200 font-mono">Smooth Inertia Normalization:</strong> Our virtual inertia physics take mathematical inspiration from the pioneering work of Studio Freight&apos;s Lenis. We utilize these normalization principles to provide buttery trackpad and wheel interpolation across browsers, wired directly into ScrollCraft&apos;s proprietary zero-rerender animation engine.
          </p>
        </div>
      </section>
    </div>
  );
};
