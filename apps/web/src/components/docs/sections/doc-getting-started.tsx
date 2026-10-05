'use client';

/**
 * ScrollCraft Docs: Getting Started
 * Design: Linear docs × Vercel docs × Brutalist Technical Manual
 * - Streamlined developer-first header (no giant marketing hero)
 * - Subtle technical architecture concept (replaces bulky decorative cards)
 * - Complete package manager tabs (npm, pnpm, yarn, bun) with 1-click copy
 * - Multi-framework setup tabs (Next.js App Router, Pages Router, Vite / React SPA)
 * - Hover anchor links on all headings
 * - Responsive API configuration table
 * - Production-ready first scene snippet
 * - Transparent feature support matrix & engineering invariants
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { CodeViewer } from '@/components/ui/code-viewer';
import {
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Heart,
  Zap,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface DocGettingStartedProps {
  sectionId?: string;
}

const PM_COMMANDS: Record<string, string> = {
  npm: 'npm install @scrollcraft/core@beta @scrollcraft/react@beta',
  pnpm: 'pnpm add @scrollcraft/core@beta @scrollcraft/react@beta',
  yarn: 'yarn add @scrollcraft/core@beta @scrollcraft/react@beta',
  bun: 'bun add @scrollcraft/core@beta @scrollcraft/react@beta',
};

const FRAMEWORK_SNIPPETS = {
  appRouter: {
    fileName: 'app/layout.tsx',
    code: `// app/layout.tsx
import type { Metadata } from 'next';
import { ScrollProvider } from '@scrollcraft/react';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScrollCraft App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Global 3-phase microtask ticker & smooth inertia */}
        <ScrollProvider smooth={true} respectReducedMotion={true} autoRecalc={true}>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}`,
  },
  pagesRouter: {
    fileName: 'pages/_app.tsx',
    code: `// pages/_app.tsx
import type { AppProps } from 'next/app';
import { ScrollProvider } from '@scrollcraft/react';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ScrollProvider smooth={true} respectReducedMotion={true} autoRecalc={true}>
      <Component {...pageProps} />
    </ScrollProvider>
  );
}`,
  },
  viteSpa: {
    fileName: 'src/main.tsx',
    code: `// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ScrollProvider } from '@scrollcraft/react';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ScrollProvider smooth={true} respectReducedMotion={true}>
      <App />
    </ScrollProvider>
  </React.StrictMode>
);`,
  },
};

const QUICK_START_CODE = `'use client';

import { Parallax, Reveal } from '@scrollcraft/react';

export function HeroScene() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Layer: Displaces at -0.2x speed to create dimensional depth */}
      <Parallax speed={-0.2} className="absolute inset-0">
        <div className="w-full h-full bg-[#161c18]/60" />
      </Parallax>

      {/* Foreground Headline: Enters on viewport intersection with zero layout shift */}
      <Reveal direction="up" distance={32} duration={0.6}>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#F4F1EA] font-display">
          Make The Web Move
        </h1>
      </Reveal>
    </section>
  );
}`;

const PROVIDER_PROPS = [
  {
    prop: 'smooth',
    type: 'boolean | InertiaConfig',
    defaultValue: 'true',
    desc: 'Enables subpixel inertia normalization across wheel and trackpad inputs.',
  },
  {
    prop: 'respectReducedMotion',
    type: 'boolean',
    defaultValue: 'true',
    desc: 'Automatically bypasses inertia smoothing and collapses animations when OS prefers-reduced-motion is active.',
  },
  {
    prop: 'autoRecalc',
    type: 'boolean',
    defaultValue: 'true',
    desc: 'Monitors DOM mutations and webfont loading to dynamically recalculate scroll dimensions.',
  },
  {
    prop: 'autoResetOnRouteChange',
    type: 'boolean',
    defaultValue: 'false',
    desc: 'Opt-in parameter to reset scroll offset to 0 upon Next.js App Router route transitions.',
  },
  {
    prop: 'debug',
    type: 'boolean | DebugOptions',
    defaultValue: 'false',
    desc: 'Mounts telemetry inspector HUD and visual scroll trigger boundaries for local debugging.',
  },
];

const HeadingAnchor: React.FC<{ id: string; children: React.ReactNode; level?: 2 | 3 }> = ({
  id,
  children,
  level = 2,
}) => {
  const [copied, setCopied] = useState(false);

  const copyAnchor = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      window.history.replaceState(null, '', `#${id}`);
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -88;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="group flex items-center gap-2">
      {level === 2 ? (
        <h2 id={id} className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display scroll-mt-24">
          {children}
        </h2>
      ) : (
        <h3 id={id} className="text-sm sm:text-base font-bold uppercase tracking-tight text-fg font-display scroll-mt-24">
          {children}
        </h3>
      )}
      <button
        onClick={copyAnchor}
        aria-label={`Copy anchor link for ${id}`}
        title="Copy anchor link"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-muted hover:text-accent cursor-pointer font-mono text-sm leading-none"
      >
        {copied ? (
          <span className="text-[10px] text-accent font-mono font-bold uppercase">Copied!</span>
        ) : (
          <span>#</span>
        )}
      </button>
    </div>
  );
};

export const DocGettingStarted: React.FC<DocGettingStartedProps> = () => {
  const [activePm, setActivePm] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');
  const [copiedPm, setCopiedPm] = useState(false);
  const [activeFramework, setActiveFramework] = useState<'appRouter' | 'pagesRouter' | 'viteSpa'>('appRouter');

  const copyInstall = () => {
    navigator.clipboard.writeText(PM_COMMANDS[activePm]);
    setCopiedPm(true);
    setTimeout(() => setCopiedPm(false), 1500);
  };

  return (
    <div className="space-y-14 not-prose font-body pb-16">
      {/* 0. Streamlined Developer Header (No Landing-Page Bloat) */}
      <header id="introduction-mental-model" className="space-y-4 pb-6 border-b border-line-soft scroll-mt-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted tracking-wider uppercase font-semibold">
          <Link href="/docs" className="hover:text-fg transition-colors">DOCS</Link>
          <ChevronRight className="w-3 h-3 text-muted/60" />
          <span className="text-accent font-bold">GETTING STARTED</span>
          <span className="ml-2 px-1.5 py-0.2 text-[9px] font-mono border border-line-soft bg-white/[0.03] text-muted">
            v0.2.0 Beta
          </span>
        </div>

        {/* Title & Concise Summary */}
        <div className="space-y-2">
          <HeadingAnchor id="introduction-mental-model" level={2}>
            Getting Started
          </HeadingAnchor>
          <p className="text-sm sm:text-base text-fg/90 font-body leading-relaxed max-w-3xl">
            ScrollCraft is a hardware-accelerated declarative scroll engine for React and Next.js. It decouples continuous scroll gestures from React&apos;s Virtual DOM, writing directly to GPU composite matrices with zero re-renders.
          </p>
        </div>

        {/* Technical Specs Strip */}
        <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-muted border-t border-line-soft/60">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full inline-block" />
            <span className="text-fg font-semibold">React 18 &amp; 19</span>
          </div>
          <span className="text-muted/40">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-fg font-semibold">Next.js App Router Native</span>
          </div>
          <span className="text-muted/40">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-fg font-semibold">&lt;5KB Brotli</span>
          </div>
          <span className="text-muted/40">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-accent font-semibold">0 VDOM Re-renders</span>
          </div>
        </div>

        {/* 8. Technical Concept Visual: Architecture Pipeline (Subtle & Educational, Not Showcase) */}
        <div className="mt-4 p-4 border border-line-soft bg-white/[0.02] space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
            <span className="flex items-center gap-1.5 text-accent">
              <Zap className="w-3.5 h-3.5" />
              <span>THE 0-RERENDER PIPELINE</span>
            </span>
            <span className="text-muted/70 text-[10px]">MICROTASK RAF TICKER</span>
          </div>

          {/* Interactive Flow Visual */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-3 border border-line-soft/80 bg-bg space-y-1">
              <span className="text-[10px] text-muted uppercase font-bold block">[ 01 INPUT ]</span>
              <p className="text-fg font-semibold text-[11px]">Wheel / Touch / Key</p>
              <p className="text-[10px] text-muted leading-tight">Passive gesture stream captured without blocking scroll.</p>
            </div>

            <div className="p-3 border border-line-soft/80 bg-bg space-y-1">
              <span className="text-[10px] text-accent uppercase font-bold block">[ 02 MEASURE ]</span>
              <p className="text-fg font-semibold text-[11px]">Batched DOM Reads</p>
              <p className="text-[10px] text-muted leading-tight">Single RAF read phase prevents layout thrashing reflows.</p>
            </div>

            <div className="p-3 border border-line-soft/80 bg-bg space-y-1">
              <span className="text-[10px] text-accent uppercase font-bold block">[ 03 INERTIA ]</span>
              <p className="text-fg font-semibold text-[11px]">Subpixel Physics</p>
              <p className="text-[10px] text-muted leading-tight">High-precision momentum normalization across all viewports.</p>
            </div>

            <div className="p-3 border border-accent/40 bg-accent/5 space-y-1">
              <span className="text-[10px] text-accent uppercase font-bold block">[ 04 GPU WRITE ]</span>
              <p className="text-accent font-semibold text-[11px]">Direct Matrix Transform</p>
              <p className="text-[10px] text-fg/80 leading-tight">Writes directly to ref inline style. 0 React renders.</p>
            </div>
          </div>
        </div>
      </header>

      {/* STEP 01: INSTALLATION */}
      <section id="step-01-install" className="space-y-4 pb-8 border-b border-line-soft scroll-mt-24">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-accent text-black">
              01
            </span>
            <HeadingAnchor id="step-01-install" level={2}>
              Installation
            </HeadingAnchor>
          </div>
          <p className="text-xs sm:text-sm text-muted font-body">
            Install the core engine and React primitives package. ScrollCraft includes comprehensive TypeScript definitions and zero runtime dependencies.
          </p>
        </div>

        {/* Installation Terminal Box */}
        <div className="border border-line-soft bg-bg p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft/60 pb-3">
            {/* Package Manager Selector Tabs */}
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted mr-1.5">PM:</span>
              {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setActivePm(pm)}
                  className={`h-7 px-3 text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                    activePm === pm
                      ? 'bg-accent text-black border-accent'
                      : 'bg-bg text-muted hover:text-fg border-line-soft hover:border-line-soft/80'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>

            {/* Release Status */}
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent border border-accent/40 bg-accent/5 px-2 py-0.5">
              RELEASE: v0.2.0 BETA
            </div>
          </div>

          {/* Terminal Command Line + One-Click Copy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs sm:text-sm pt-1">
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-accent select-none font-bold text-base">$</span>
              <span className="whitespace-nowrap text-fg font-mono font-semibold tracking-tight">
                {PM_COMMANDS[activePm]}
              </span>
            </div>
            <button
              onClick={copyInstall}
              className="h-8 min-w-[100px] flex items-center justify-center gap-1.5 px-3 border border-line-soft bg-bg hover:border-accent hover:text-accent text-fg font-mono font-bold text-xs uppercase transition-all cursor-pointer shrink-0 self-end sm:self-auto active:scale-98"
              title="Copy installation command"
            >
              {copiedPm ? (
                <>
                  <Check className="w-3.5 h-3.5 text-accent stroke-[3]" />
                  <span className="text-accent">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          {/* Peer Requirements */}
          <div className="pt-3 border-t border-line-soft/60 flex flex-wrap items-center gap-3 text-[11px] font-mono text-muted/80">
            <span>PEER REQUIREMENTS:</span>
            <span className="text-fg font-medium">React 18.2+ or React 19</span>
            <span>•</span>
            <span className="text-fg font-medium">Next.js 14+ or 15+ (App Router &amp; Pages)</span>
            <span>•</span>
            <span className="text-fg font-medium">TypeScript 5.0+</span>
          </div>
        </div>
      </section>

      {/* STEP 02: FRAMEWORK INTEGRATION */}
      <section id="step-02-provider" className="space-y-4 pb-8 border-b border-line-soft scroll-mt-24">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-accent text-black">
              02
            </span>
            <HeadingAnchor id="step-02-provider" level={2}>
              Framework Setup
            </HeadingAnchor>
          </div>
          <p className="text-xs sm:text-sm text-muted font-body">
            Mount <code className="text-accent font-mono font-semibold">&lt;ScrollProvider /&gt;</code> at your application root. This sets up the central 3-phase microtask ticker, inertial motion listener, and automated dimension observer.
          </p>
        </div>

        {/* Framework Selector Tabs */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setActiveFramework('appRouter')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                activeFramework === 'appRouter'
                  ? 'bg-accent text-black border-accent'
                  : 'bg-bg text-muted hover:text-fg border-line-soft'
              }`}
            >
              Next.js (App Router)
            </button>
            <button
              onClick={() => setActiveFramework('pagesRouter')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                activeFramework === 'pagesRouter'
                  ? 'bg-accent text-black border-accent'
                  : 'bg-bg text-muted hover:text-fg border-line-soft'
              }`}
            >
              Next.js (Pages Router)
            </button>
            <button
              onClick={() => setActiveFramework('viteSpa')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                activeFramework === 'viteSpa'
                  ? 'bg-accent text-black border-accent'
                  : 'bg-bg text-muted hover:text-fg border-line-soft'
              }`}
            >
              Vite / React SPA
            </button>
          </div>

          <CodeViewer
            code={FRAMEWORK_SNIPPETS[activeFramework].code}
            fileName={FRAMEWORK_SNIPPETS[activeFramework].fileName}
          />
        </div>

        {/* Provider Configuration Options Table */}
        <div id="provider-props" className="space-y-3 pt-6 scroll-mt-24">
          <div className="flex items-center justify-between">
            <HeadingAnchor id="provider-props" level={3}>
              Configuration Options
            </HeadingAnchor>
            <span className="text-[10px] font-mono text-muted sm:hidden">SWIPE TABLE &rarr;</span>
          </div>

          <div className="border border-line-soft bg-bg shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs font-mono min-w-[550px]">
              <thead className="bg-white/[0.02] text-muted uppercase text-[11px] border-b border-line-soft font-bold">
                <tr>
                  <th className="px-4 py-3 text-fg font-bold">PROP</th>
                  <th className="px-4 py-3">TYPE</th>
                  <th className="px-4 py-3">DEFAULT</th>
                  <th className="px-4 py-3">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft font-mono">
                {PROVIDER_PROPS.map((p) => (
                  <tr key={p.prop} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-4 py-3 text-accent font-bold">{p.prop}</td>
                    <td className="px-4 py-3 text-fg/90 font-mono text-xs">{p.type}</td>
                    <td className="px-4 py-3 text-muted text-xs">{p.defaultValue}</td>
                    <td className="px-4 py-3 text-fg/90 text-xs font-body">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* STEP 03: FIRST SCROLL SCENE */}
      <section id="step-03-scene" className="space-y-4 pb-8 border-b border-line-soft scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-accent text-black">
                03
              </span>
              <HeadingAnchor id="step-03-scene" level={2}>
                First Scroll Scene
              </HeadingAnchor>
            </div>
            <p className="text-xs sm:text-sm text-muted font-body">
              Compose declarative primitives like <code className="text-accent font-mono font-semibold">&lt;Parallax&gt;</code> and <code className="text-accent font-mono font-semibold">&lt;Reveal&gt;</code> directly in your components.
            </p>
          </div>

          {/* Test Lab Direct Link */}
          <Link
            href="/test/parallax"
            className="h-8 px-3 border border-line-soft bg-bg hover:border-accent hover:text-accent text-fg font-mono text-xs font-bold uppercase transition-all inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>TEST IN LAB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CodeViewer code={QUICK_START_CODE} fileName="components/hero-scene.tsx" />
      </section>

      {/* FEATURE SUPPORT MATRIX */}
      <section id="feature-matrix" className="space-y-4 pb-8 border-b border-line-soft scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <HeadingAnchor id="feature-matrix" level={2}>
              Feature Support Matrix
            </HeadingAnchor>
            <p className="text-xs text-muted font-body">
              Transparent disclosure of primitive capabilities, polymorphic slot composition, and hardware drivers.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-muted shrink-0">
            <span className="flex items-center gap-1"><span className="text-accent font-bold">✅</span> SHIPPED</span>
            <span className="flex items-center gap-1"><span className="text-muted font-bold">🔜</span> v0.3.0</span>
            <span className="flex items-center gap-1"><span className="text-muted/40 font-bold">—</span> N/A</span>
          </div>
        </div>

        <div className="border border-line-soft bg-bg shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-line-soft bg-white/[0.02] text-muted uppercase font-bold text-[11px]">
                <th className="py-3 px-4 text-fg font-bold">PRIMITIVE</th>
                <th className="py-3 px-4 text-center">asChild (Slot)</th>
                <th className="py-3 px-4 text-center">Reduced Motion</th>
                <th className="py-3 px-4 text-center">Native Driver</th>
                <th className="py-3 px-4 text-center">Interactive Lab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft font-mono">
              {[
                { tag: '<Parallax />', slot: '✅', a11y: '✅', driver: 'CSS Timeline / RAF', slug: 'parallax' },
                { tag: '<Reveal />', slot: '✅', a11y: '✅', driver: 'IntersectionObserver', slug: 'reveal' },
                { tag: '<ScrollTransform />', slot: '✅', a11y: '✅', driver: 'Hardware Matrix', slug: 'scroll-transform' },
                { tag: '<ScrollDraw />', slot: '✅', a11y: '✅', driver: 'SVG stroke-dashoffset', slug: 'scroll-draw' },
                { tag: '<Pin />', slot: '✅', a11y: '🔜', driver: 'position: sticky + lock', slug: 'pin' },
                { tag: '<HorizontalScroll />', slot: '—', a11y: '🔜', driver: 'CSS Snap + Translate', slug: 'horizontal-scroll' },
                { tag: '<StackedCards />', slot: '✅', a11y: '🔜', driver: 'Layer Compositor', slug: 'stacked-cards' },
                { tag: '<Magnetic />', slot: '✅', a11y: '🔜', driver: 'Spring Physics', slug: 'magnetic' },
                { tag: '<ScrollProgress />', slot: '✅', a11y: '✅', driver: 'CSS Timeline', slug: 'scroll-progress' },
                { tag: '<VelocityMarquee />', slot: '—', a11y: '🔜', driver: 'RAF Velocity Lerp', slug: 'velocity-marquee' },
                { tag: '<ScrollSequence />', slot: '—', a11y: '🔜', driver: 'Canvas 2D Scrub', slug: 'scroll-sequence' },
                { tag: '<TextReveal />', slot: '✅', a11y: '🔜', driver: 'Character Splitter', slug: 'text-reveal' },
              ].map((row) => (
                <tr key={row.tag} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="py-3 px-4 font-bold text-accent">{row.tag}</td>
                  <td className="py-3 px-4 text-center font-bold">{row.slot}</td>
                  <td className="py-3 px-4 text-center font-bold">{row.a11y}</td>
                  <td className="py-3 px-4 text-center text-muted group-hover:text-fg transition-colors">{row.driver}</td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={`/test/${row.slug}`}
                      className="px-2 py-0.5 border border-line-soft bg-bg hover:border-accent text-accent text-[11px] font-mono font-bold uppercase transition-colors inline-flex items-center gap-1"
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

      {/* CORE INVARIANTS & ENGINE ATTRIBUTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section id="core-invariants" className="border border-line-soft bg-bg shadow-xs flex flex-col justify-between scroll-mt-24">
          <div className="border-b border-line-soft bg-white/[0.02] px-4 py-2.5 font-mono text-xs font-bold text-fg uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>ENGINEERING INVARIANTS</span>
          </div>
          <div className="p-4 space-y-2 text-xs font-mono text-fg">
            <ul className="list-disc list-inside space-y-2 text-fg/90 font-body leading-relaxed">
              <li><strong className="text-accent font-mono font-bold">Zero React Re-Renders:</strong> Scroll transformations write directly to ref transform styles in the RAF microtask without triggering component re-renders.</li>
              <li><strong className="text-accent font-mono font-bold">Deterministic 3-Phase Loop:</strong> Measure phase strictly precedes all style writes, eliminating forced synchronous reflows.</li>
              <li><strong className="text-accent font-mono font-bold">Full RSC Compatibility:</strong> Compatible with Next.js 15 Server Components and streaming SSR. Use <code className="text-accent font-mono">asChild</code> to avoid wrapper DOM nodes.</li>
            </ul>
          </div>
        </section>

        <section id="architecture-attributions" className="border border-line-soft bg-bg shadow-xs flex flex-col justify-between scroll-mt-24">
          <div className="border-b border-line-soft bg-white/[0.02] px-4 py-2.5 font-mono text-xs font-bold text-fg uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" />
            <span>ENGINE &amp; ATTRIBUTIONS</span>
          </div>
          <div className="p-4 space-y-3 text-xs text-fg/90 font-body leading-relaxed">
            <p>
              <strong className="text-accent font-mono font-bold uppercase">ScrollCraft Motion Engine:</strong> The multi-phase ticker, zero-rerender DOM compositor, CSS Scroll-Timeline drivers, and declarative primitives are custom in-house systems built from scratch for React.
            </p>
            <p>
              <strong className="text-accent font-mono font-bold uppercase">Smooth Inertia Normalization:</strong> Our virtual inertia physics take mathematical inspiration from the pioneering work of Studio Freight&apos;s Lenis to normalize trackpad and wheel velocity across browsers.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
