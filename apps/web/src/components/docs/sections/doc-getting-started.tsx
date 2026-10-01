'use client';

/**
 * ScrollCraft Docs: Getting Started (Ground-Up Rebuild)
 * Clean 3-Step Setup Flow:
 * - Step 01: Package Installation (Working PMs only, 40px square COPY button)
 * - Step 02: Root Layout Setup (<ScrollProvider> code + 2-neutral props matrix)
 * - Step 03: First Scroll Scene (Runnable snippet + [ TEST IN LAB ↗ ])
 * - Guarantees: 3 Crisp Architectural Cards
 * - Support Matrix: Transparent capabilities disclosure
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Check, Copy, ArrowRight, ExternalLink, ShieldCheck, Heart, Layers, Zap, Cpu } from 'lucide-react';

interface DocGettingStartedProps {
  sectionId: string;
}

const PM_COMMANDS = {
  npm: 'npm install @scrollcraft/core@beta @scrollcraft/react@beta',
  pnpm: 'pnpm add @scrollcraft/core@beta @scrollcraft/react@beta',
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Layer: Displaces at -0.2x speed to create dimensional depth */}
      <Parallax speed={-0.2} className="absolute inset-0">
        <div className="w-full h-full bg-linear-to-b from-[#161c18] to-transparent opacity-50" />
      </Parallax>

      {/* Foreground Headline: Enters on viewport intersection with zero layout shift */}
      <Reveal direction="up" distance={32} duration={0.6}>
        <h1 className="text-5xl font-black uppercase tracking-tight text-[#F4F1EA]">
          Make The Web Move
        </h1>
      </Reveal>
    </section>
  );
}`;

const PROVIDER_PROPS = [
  { prop: 'smooth', type: 'boolean | InertiaConfig', defaultValue: 'true', desc: 'Enables subpixel inertia normalization across wheel and trackpad inputs.' },
  { prop: 'respectReducedMotion', type: 'boolean', defaultValue: 'true', desc: 'Automatically bypasses inertia smoothing and collapses animations when OS prefers-reduced-motion is active.' },
  { prop: 'autoRecalc', type: 'boolean', defaultValue: 'true', desc: 'Monitors DOM mutations and webfont loading to dynamically recalculate scroll dimensions.' },
  { prop: 'debug', type: 'boolean | DebugOptions', defaultValue: 'false', desc: 'Mounts telemetry inspector HUD and visual scroll trigger boundaries.' },
];

export const DocGettingStarted: React.FC<DocGettingStartedProps> = ({ sectionId }) => {
  const [activePm, setActivePm] = useState<'npm' | 'pnpm'>('npm');
  const [copied, setCopied] = useState(false);

  // Auto-scroll to requested section when sectionId changes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const targetMap: Record<string, string> = {
      introduction: 'introduction-mental-model',
      installation: 'step-01-install',
      setup: 'step-02-provider',
    };
    const targetId = targetMap[sectionId];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -96;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [sectionId]);

  const copyInstall = () => {
    navigator.clipboard.writeText(PM_COMMANDS[activePm]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-12 not-prose font-body">
      {/* 0. Hero Header */}
      <section id="introduction-mental-model" className="space-y-6 pb-8 border-b-2 border-line scroll-mt-24">
        <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest">
          <span className="w-2 h-2 bg-accent inline-block" />
          <span>[DOCS / 01] GETTING STARTED</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
            Getting Started
          </h1>
          <p className="text-base sm:text-lg text-fg/90 font-body leading-relaxed max-w-3xl">
            ScrollCraft is a hardware-accelerated declarative scroll engine built specifically for React and Next.js App Router. It decouples continuous scroll gestures from React&apos;s Virtual DOM reconciliation tree, writing directly to GPU composite matrices with zero re-renders.
          </p>
        </div>

        {/* 3 Core Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
            <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-accent uppercase tracking-wider flex items-center justify-between">
              <span>[01] ZERO RE-RENDERS</span>
              <Zap className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="p-4">
              <p className="text-fg/80 text-xs font-body leading-relaxed">
                Scroll transformations write directly to ref transform styles in the RAF microtask without triggering React component re-renders.
              </p>
            </div>
          </div>

          <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
            <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-fg uppercase tracking-wider flex items-center justify-between">
              <span>[02] RSC &amp; SLOT NATIVE</span>
              <Layers className="w-3.5 h-3.5 text-fg" />
            </div>
            <div className="p-4">
              <p className="text-fg/80 text-xs font-body leading-relaxed">
                Fully compatible with Next.js 15 Server Components. Use <code className="text-accent font-mono font-bold">asChild</code> to avoid dummy wrapper DOM nodes.
              </p>
            </div>
          </div>

          <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
            <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-fg uppercase tracking-wider flex items-center justify-between">
              <span>[03] &lt;5KB BROTLI</span>
              <Cpu className="w-3.5 h-3.5 text-fg" />
            </div>
            <div className="p-4">
              <p className="text-fg/80 text-xs font-body leading-relaxed">
                Tree-shakeable architecture with zero external runtime dependencies. Built on high-precision physics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 01: INSTALLATION */}
      <section id="step-01-install" className="space-y-4 border-b-2 border-line pb-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 border-2 border-line bg-accent text-black font-mono font-black flex items-center justify-center text-xs">
            01
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
            Step 1: Install Package
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted font-body">
          Install the official production package from npm. ScrollCraft is distributed with complete TypeScript typings.
        </p>

        {/* Installation Strip */}
        <div className="border-2 border-line bg-bg p-4 sm:p-5 shadow-rest space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line-soft pb-3">
            {/* Working Package Managers */}
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted mr-1">PACKAGE:</span>
              <button
                type="button"
                onClick={() => setActivePm('npm')}
                className={`h-9 px-3.5 border-2 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activePm === 'npm'
                    ? 'bg-accent text-black border-line shadow-rest'
                    : 'bg-bg text-muted hover:text-fg border-line-soft'
                }`}
              >
                npm
              </button>
              <button
                type="button"
                onClick={() => setActivePm('pnpm')}
                className={`h-9 px-3.5 border-2 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activePm === 'pnpm'
                    ? 'bg-accent text-black border-line shadow-rest'
                    : 'bg-bg text-muted hover:text-fg border-line-soft'
                }`}
              >
                pnpm
              </button>
              {/* Disabled options clearly marked */}
              <span
                aria-disabled="true"
                className="h-9 px-3 border-2 border-line-soft/40 bg-bg text-muted/40 text-xs font-mono line-through flex items-center cursor-not-allowed select-none"
                title="Yarn registry integration in progress"
              >
                yarn
              </span>
              <span
                aria-disabled="true"
                className="h-9 px-3 border-2 border-line-soft/40 bg-bg text-muted/40 text-xs font-mono line-through flex items-center cursor-not-allowed select-none"
                title="Bun registry integration in progress"
              >
                bun
              </span>
            </div>

            {/* Version Badge */}
            <div className="border-2 border-line bg-bg px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-accent">
              RELEASE: v0.2.0 BETA
            </div>
          </div>

          {/* Terminal Command + 40px Square Copy Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-accent select-none font-bold text-base">$</span>
              <span className="whitespace-nowrap text-fg font-mono font-bold tracking-tight">
                {PM_COMMANDS[activePm]}
              </span>
            </div>
            <button
              onClick={copyInstall}
              className="h-10 min-w-[110px] flex items-center justify-center gap-2 px-4 border-2 border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer shrink-0 self-end sm:self-auto"
              title="Copy installation command"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3]" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t-2 border-line-soft flex flex-wrap items-center gap-3 text-xs font-mono text-muted">
            <span>PEER REQUIREMENTS: REACT 18+ / 19+</span>
            <span>&bull;</span>
            <span>NEXT.JS 14+ / 15+ (APP ROUTER)</span>
          </div>
        </div>
      </section>

      {/* STEP 02: ROOT LAYOUT INTEGRATION */}
      <section id="step-02-provider" className="space-y-4 border-b-2 border-line pb-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <span className="h-7 w-7 border-2 border-line bg-accent text-black font-mono font-black flex items-center justify-center text-xs">
            02
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
            Step 2: Mount Root Provider
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted font-body">
          Mount <code className="text-accent font-mono font-bold">&lt;ScrollProvider /&gt;</code> in your root layout. This initializes the global 3-phase microtask ticker and smooth inertia normalization.
        </p>

        <CodeViewer code={NEXT_LAYOUT_SETUP} fileName="app/layout.tsx" />

        {/* Provider Configuration Options Table */}
        <div id="provider-props" className="space-y-3 pt-4 scroll-mt-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted block font-bold">
              ScrollProvider Configuration Options
            </span>
            <span className="text-[10px] font-mono text-muted sm:hidden">SWIPE TABLE &rarr;</span>
          </div>

          <div className="border-2 border-line bg-bg shadow-rest overflow-x-auto">
            <table className="w-full text-left text-xs font-mono min-w-[550px]">
              <thead className="bg-line-soft/30 text-muted uppercase text-[11px] border-b-2 border-line font-bold">
                <tr>
                  <th className="px-4 py-3 text-fg font-bold">PROP</th>
                  <th className="px-4 py-3">TYPE</th>
                  <th className="px-4 py-3">DEFAULT</th>
                  <th className="px-4 py-3">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-line-soft font-mono">
                {PROVIDER_PROPS.map((p) => (
                  <tr key={p.prop} className="hover:bg-fg hover:text-black transition-colors group">
                    <td className="px-4 py-3 text-accent group-hover:text-black font-bold">{p.prop}</td>
                    <td className="px-4 py-3 text-fg font-mono text-xs">{p.type}</td>
                    <td className="px-4 py-3 text-muted text-xs">{p.defaultValue}</td>
                    <td className="px-4 py-3 text-fg group-hover:text-black text-xs font-body">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* STEP 03: FIRST SCROLL SCENE */}
      <section id="step-03-scene" className="space-y-4 border-b-2 border-line pb-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 border-2 border-line bg-accent text-black font-mono font-black flex items-center justify-center text-xs">
              03
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
              Step 3: Create Your First Scene
            </h2>
          </div>

          {/* Test Lab Direct Link */}
          <Link
            href="/test/parallax"
            className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <span>TEST IN LAB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-muted font-body">
          Use declarative primitives like <code className="text-accent font-mono font-bold">&lt;Parallax&gt;</code> and <code className="text-accent font-mono font-bold">&lt;Reveal&gt;</code> inside any client component.
        </p>

        <CodeViewer code={QUICK_START_CODE} fileName="components/hero-scene.tsx" />
      </section>

      {/* FEATURE SUPPORT MATRIX */}
      <section id="feature-matrix" className="space-y-4 border-b-2 border-line pb-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
              Feature Support Matrix
            </h2>
            <p className="text-xs text-muted font-body mt-1">
              Transparent disclosure of primitive capabilities, polymorphic slot composition, and hardware drivers.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-muted shrink-0">
            <span className="flex items-center gap-1"><span className="text-accent font-bold">✅</span> SHIPPED</span>
            <span className="flex items-center gap-1"><span className="text-muted font-bold">🔜</span> v0.3.0</span>
            <span className="flex items-center gap-1"><span className="text-muted/40 font-bold">—</span> N/A</span>
          </div>
        </div>

        <div className="border-2 border-line bg-bg shadow-rest overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b-2 border-line bg-line-soft/30 text-muted uppercase font-bold text-[11px]">
                <th className="py-3 px-4 text-fg font-bold">PRIMITIVE</th>
                <th className="py-3 px-4 text-center">asChild (Slot)</th>
                <th className="py-3 px-4 text-center">Reduced Motion (A11y)</th>
                <th className="py-3 px-4 text-center">Native Driver</th>
                <th className="py-3 px-4 text-center">Interactive Lab</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-line-soft font-mono">
              {[
                { tag: '<Parallax />', slot: '✅', a11y: '✅', driver: '✅ (driver: "css")', slug: 'parallax' },
                { tag: '<Reveal />', slot: '✅', a11y: '✅', driver: '—', slug: 'reveal' },
                { tag: '<ScrollTransform />', slot: '✅', a11y: '✅', driver: '—', slug: 'scroll-transform' },
                { tag: '<ScrollDraw />', slot: '✅', a11y: '✅', driver: '—', slug: 'scroll-draw' },
                { tag: '<Pin />', slot: '✅', a11y: '🔜', driver: 'Partial (disableTransform)', slug: 'pin' },
                { tag: '<HorizontalScroll />', slot: '—', a11y: '🔜', driver: '✅ (CSS Snap)', slug: 'horizontal-scroll' },
                { tag: '<StackedCards />', slot: '✅', a11y: '🔜', driver: '—', slug: 'stacked-cards' },
                { tag: '<Magnetic />', slot: '✅', a11y: '🔜', driver: '—', slug: 'magnetic' },
                { tag: '<ScrollProgress />', slot: '✅', a11y: '✅', driver: '✅ (CSS Timeline)', slug: 'scroll-progress' },
                { tag: '<VelocityMarquee />', slot: '—', a11y: '🔜', driver: '—', slug: 'velocity-marquee' },
                { tag: '<ScrollSequence />', slot: '—', a11y: '🔜', driver: '— (Canvas 2D)', slug: 'scroll-sequence' },
                { tag: '<TextReveal />', slot: '✅', a11y: '🔜', driver: '—', slug: 'text-reveal' },
              ].map((row) => (
                <tr key={row.tag} className="hover:bg-fg hover:text-black transition-colors group">
                  <td className="py-3 px-4 font-bold text-accent group-hover:text-black">{row.tag}</td>
                  <td className="py-3 px-4 text-center font-bold">{row.slot}</td>
                  <td className="py-3 px-4 text-center font-bold">{row.a11y}</td>
                  <td className="py-3 px-4 text-center text-muted group-hover:text-black">{row.driver}</td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={`/test/${row.slug}`}
                      className="px-2 py-1 border border-line bg-bg group-hover:bg-black group-hover:text-accent text-accent text-[11px] font-mono font-bold uppercase transition-colors inline-flex items-center gap-1"
                    >
                      <span>TEST</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CORE INVARIANTS & ATTRIBUTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section id="core-invariants" className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
          <div className="border-b-2 border-line bg-line-soft/30 px-4 py-2.5 font-mono text-xs font-bold text-fg uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>ENGINEERING INVARIANTS</span>
          </div>
          <div className="p-5 space-y-2 text-xs font-mono text-fg">
            <ul className="list-disc list-inside space-y-2 text-fg/90 font-body leading-relaxed">
              <li><strong className="text-accent font-mono font-bold">Zero React Re-Renders:</strong> Scroll physics write directly to ref style transforms at hardware frame intervals.</li>
              <li><strong className="text-accent font-mono font-bold">Deterministic 3-Phase Loop:</strong> Measure phase strictly precedes all style writes, eliminating forced synchronous reflows.</li>
              <li><strong className="text-accent font-mono font-bold">Full RSC Compatibility:</strong> Compatible with Next.js 15 Server Components and streaming SSR.</li>
            </ul>
          </div>
        </section>

        <section id="architecture-attributions" className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
          <div className="border-b-2 border-line bg-line-soft/30 px-4 py-2.5 font-mono text-xs font-bold text-fg uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" />
            <span>ARCHITECTURE &amp; ATTRIBUTIONS</span>
          </div>
          <div className="p-5 space-y-3 text-xs text-fg/90 font-body leading-relaxed">
            <p>
              <strong className="text-accent font-mono font-bold uppercase">ScrollCraft Motion Engine:</strong> The multi-phase ticker, zero-rerender DOM compositor, CSS Scroll-Timeline drivers, and declarative primitives are custom in-house systems built from scratch for React.
            </p>
            <p>
              <strong className="text-accent font-mono font-bold uppercase">Smooth Inertia Normalization:</strong> Our virtual inertia physics take mathematical inspiration from the pioneering work of Studio Freight&apos;s Lenis. We utilize these normalization principles to provide buttery trackpad and wheel interpolation across browsers.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
