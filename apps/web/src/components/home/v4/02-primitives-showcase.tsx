'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Parallax, Reveal } from '@scrollcraft/react';
import { ArrowUpRight, Copy, Check, Layers, Eye, PinIcon, Repeat } from 'lucide-react';

<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Layers,
  Eye,
  Lock,
  Disc3,
  Copy,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Zap,
  Box,
  SlidersHorizontal,
  Code,
} from 'lucide-react';
import { Parallax, Reveal, Pin, ScrollProgress, useScrollCraft } from '@scrollcraft/react';

type PrimitiveKey = 'parallax' | 'reveal' | 'pin' | 'progress';
type FrameworkKey = 'react' | 'nextjs';
type DeviceKey = 'desktop' | 'tablet' | 'mobile';

interface PrimitiveData {
  id: PrimitiveKey;
=======
interface PrimitiveCard {
  id: string;
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3
  name: string;
  tag: string;
  icon: React.ReactNode;
  description: string;
  specs: string[];
  snippet: string;
  testSlug: string;
}

const PRIMITIVES: PrimitiveCard[] = [
  {
    id: 'parallax',
    name: '<Parallax />',
    tag: 'HARDWARE DEPTH',
    icon: <Layers className="w-4 h-4 text-zinc-300" />,
    description: 'Multi-layer depth container with real velocity responsiveness. Direct hardware transform writes with zero layout thrashing.',
    specs: ['Numeric transform matrix', 'Hardware GPU composite', 'WeakMap coordinate cache'],
    snippet: `<Parallax speed={0.25} direction="up">
  <div className="glass-card">
    <h3>Floating Architecture</h3>
  </div>
</Parallax>`,
    testSlug: 'parallax',
  },
  {
    id: 'reveal',
    name: '<Reveal />',
    tag: 'SSR-SAFE TRANSITIONS',
    icon: <Eye className="w-4 h-4 text-zinc-300" />,
    description: 'Zero-FOUC text and component entrances. Resilient hydration lifecycle with native no-JS fallback support.',
    specs: ['IntersectionObserver driver', 'Zero layout jumps', 'Custom easing curves'],
    snippet: `<Reveal effect="fade-up" duration={600} threshold={0.2}>
  <h2>Production Grade Animations</h2>
</Reveal>`,
    testSlug: 'reveal',
  },
  {
    id: 'pin',
    name: '<Pin />',
    tag: 'STICKY CONTAINMENT',
    icon: <PinIcon className="w-4 h-4 text-zinc-300" />,
    description: 'Smart pinning primitive. Prefers native position: sticky with transform fallbacks and containing-block safety.',
    specs: ['Native sticky preference', 'Spacer cleanup on route change', 'Stacking context safe'],
    snippet: `<Pin pinSpacer stickyOptions={{ top: 80 }}>
  <div className="sticky-sidebar">
    <NavigationIndex />
  </div>
</Pin>`,
    testSlug: 'pin',
  },
  {
    id: 'velocity-marquee',
    name: '<VelocityMarquee />',
    tag: 'CONTINUOUS MODULO',
    icon: <Repeat className="w-4 h-4 text-zinc-300" />,
    description: 'Infinite ticker that speeds up with user scroll momentum and settles seamlessly into idle baseline speed.',
    specs: ['Velocity-coupled acceleration', 'Subpixel modulo wrapping', 'Idle state sleep mode'],
    snippet: `<VelocityMarquee baseVelocity={1} velocityFactor={2.5}>
  <span>ZERO VDOM • 120 FPS • REACT 19 • LENIS ENGINE</span>
</VelocityMarquee>`,
    testSlug: 'velocity-marquee',
  },
];

export function PrimitivesShowcase() {
<<<<<<< HEAD
  const [activePrimitive, setActivePrimitive] = useState<PrimitiveKey>('parallax');
  const [activeFramework, setActiveFramework] = useState<FrameworkKey>('react');
  const [activeDevice, setActiveDevice] = useState<DeviceKey>('desktop');
  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState<'code' | 'preview'>('code');
  // Direct DOM refs for 0 React re-renders during scroll
  const progressPctRef = useRef<HTMLSpanElement>(null);
  const progressValRef = useRef<HTMLSpanElement>(null);
  const velocityValRef = useRef<HTMLSpanElement>(null);
=======
  const [copiedId, setCopiedId] = useState<string | null>(null);
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
<<<<<<< HEAD
    <section id="primitives" className="relative w-full bg-[#060709] text-zinc-100 py-16 sm:py-28 px-4 sm:px-6 md:px-12 border-t border-white/[0.06] overflow-hidden">
      
      {/* Background Architectural Grid Lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header with Left and Right Architectural Tags */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-8 sm:mb-12 select-none">
          
          {/* Left Tag */}
          <div className="hidden md:flex md:col-span-3 flex-col items-start pt-2">
            <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase leading-relaxed">
              SCROLL<br />
              ANIMATIONS<br />
              MADE SIMPLE.
            </div>
            <div className="w-8 h-[1px] bg-zinc-800 mt-2" />
          </div>

          {/* Center Title & Subtitle */}
          <div className="md:col-span-6 flex flex-col items-center text-center">
            {/* Dual-Tone Headline */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] mb-3 sm:mb-4 break-words">
              <span className="text-white block font-extrabold">Declarative Primitives.</span>
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent block font-extrabold mt-1">
                Composed for the GPU.
              </span>
=======
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-zinc-900">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Core Primitives</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 font-sans">
              Declarative wrappers. Zero overhead.
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-zinc-400 max-w-md font-sans">
            Plug-and-play components configured via props. Direct DOM manipulation inside the render phase without React state triggers.
          </p>
        </div>

<<<<<<< HEAD
        {/* Horizontal Primitive Selector Strip */}
        <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 sm:gap-2.5 py-1 mb-6 sm:mb-8">
          {(Object.keys(PRIMITIVES_DATA) as PrimitiveKey[]).map((key) => {
            const item = PRIMITIVES_DATA[key];
            const Icon = item.icon;
            const isActive = activePrimitive === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActivePrimitive(key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-violet-400/50 scale-[1.02]'
                    : 'bg-[#0d0f14]/90 text-zinc-400 border border-white/[0.08] hover:border-violet-500/30 hover:bg-[#151922] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Tab Toggles (Code vs Preview) */}
        <div className="flex lg:hidden bg-[#0d0f14] p-1 rounded-xl mb-6 border border-white/[0.08] w-full max-w-xs mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => setMobileTab('code')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] ${
              mobileTab === 'code'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] ${
              mobileTab === 'preview'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* 2-Column Split Cards: Code Left vs Live Preview Right */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* ================= LEFT CARD: CODE VIEWER ================= */}
          <div className={`rounded-2xl border border-white/[0.08] bg-[#0a0b0e] p-4 sm:p-6 shadow-2xl flex-col justify-between ${mobileTab === 'code' ? 'flex' : 'hidden lg:flex'}`}>
            
            <div>
              {/* Clean Top Header of Code Card (No Source link, No CTAs) */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 shadow-inner">
                  <currentData.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {currentData.name}
                    </span>
                    {currentData.badge && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                        {currentData.badge}
                      </span>
                    )}
=======
        {/* Stacked Cards Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRIMITIVES.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 hover:border-zinc-700/80 transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white font-mono">{item.name}</h3>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.tag}</span>
                    </div>
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3
                  </div>
                  <Link
                    href={`/test/${item.testSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    Test Lab
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-sm text-zinc-400 mb-5 leading-relaxed font-sans">
                  {item.description}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.specs.map((spec) => (
                    <span
                      key={spec}
                      className="px-2.5 py-1 rounded bg-zinc-900/90 border border-zinc-800/80 text-[11px] font-mono text-zinc-400"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-lg bg-black/80 border border-zinc-900 p-3.5 font-mono text-xs text-zinc-300">
                <button
                  onClick={() => copyCode(item.id, item.snippet)}
                  className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                  title="Copy code"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <pre className="overflow-x-auto text-zinc-300 pr-8">
                  <code>{item.snippet}</code>
                </pre>
              </div>
            </div>
<<<<<<< HEAD

          </div>

          {/* ================= RIGHT CARD: LIVE PREVIEW ================= */}
          <div className={`rounded-2xl border border-white/[0.08] bg-[#0a0b0e] p-4 sm:p-6 shadow-2xl flex-col justify-between ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
            
            <div>
              {/* Top Bar: Preview Badge + Device Viewport Toggles (Live Controls removed) */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
                
                {/* Clean Preview Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-medium bg-violet-600/25 text-violet-400 border border-violet-500/30">
                    Preview
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Interactive Live Render
                  </span>
                </div>

                {/* Device Viewport Toggles */}
                <div className="flex items-center gap-1 bg-[#060709] p-1 rounded-lg border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setActiveDevice('desktop')}
                    title="Desktop View"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      activeDevice === 'desktop'
                        ? 'bg-violet-600/30 text-violet-400 border border-violet-500/40'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDevice('tablet')}
                    title="Tablet View"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      activeDevice === 'tablet'
                        ? 'bg-violet-600/30 text-violet-400 border border-violet-500/40'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDevice('mobile')}
                    title="Mobile View"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                      activeDevice === 'mobile'
                        ? 'bg-violet-600/30 text-violet-400 border border-violet-500/40'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Tab-wise Dynamic Primitive Execution using @scrollcraft/react */}
              <div className={`transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] ${deviceWidthClass}`}>
                
                {/* 1. PURE PARALLAX DEMO (No scrub slider, multi-layer hardware parallax) */}
                {activePrimitive === 'parallax' && (
                  <div className="relative w-full h-[280px] rounded-xl overflow-hidden border border-white/[0.08] shadow-inner bg-[#07080b]">
                    {/* Multi-layer Parallax Stage */}
                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                      {/* Layer 1 (Background): Mountain scenery with negative speed for deep parallax */}
                      <Parallax speed={-0.35} min={-80} max={80} className="absolute inset-x-0 -top-[30%] w-full h-[160%]">
                        <div className="w-full h-full relative">
                          <Image
                            src="/images/mountains.jpg"
                            alt="Mountains Parallax Preview"
                            fill
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover select-none pointer-events-none opacity-80"
                          />
                        </div>
                      </Parallax>

                      {/* Vignette Depth Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/85 pointer-events-none" />

                      {/* Layer 2 & 3: Content Stack with distinct parallax speeds */}
                      <div className="relative z-10 flex flex-col items-center text-center px-4 select-none">
                        {/* Midground Badge (speed 0.4) */}
                        <Parallax speed={0.4} min={-50} max={50}>
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/85 border border-violet-500/40 text-[10px] font-mono text-violet-300 tracking-wider backdrop-blur-md shadow-lg shadow-violet-950/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Hardware Subpixel Compositor
                            </span>
                          </div>
                        </Parallax>

                        {/* Foreground Heading (speed 0.18) */}
                        <Parallax speed={0.18} min={-30} max={30}>
                          <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                              Build without limits.
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-sans drop-shadow">
                              Real-time multi-layer subpixel parallax
                            </p>
                          </div>
                        </Parallax>
                      </div>

                      {/* Component Tag Badge */}
                      <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-zinc-300">
                        &lt;Parallax speed={'{0.35}'} /&gt;
                      </div>

                      {/* Bottom Status Pill */}
                      <div className="absolute bottom-3 inset-x-3 z-20 px-3 py-1.5 rounded-lg bg-black/65 backdrop-blur-md border border-white/[0.08] flex items-center justify-between font-mono text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-zinc-300 text-[10px]">Pure Scroll Driver Active</span>
                        </span>
                        <span className="text-[10px] text-violet-400">Scroll window to see layers move</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. REVEAL DEMO */}
                {activePrimitive === 'reveal' && (
                  <div className="relative w-full h-[280px] rounded-xl overflow-y-auto border border-white/[0.08] p-4 bg-[#07080b] flex flex-col justify-center space-y-3">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>&lt;Reveal /&gt; Live GPU Batched Observer</span>
                      <span className="text-emerald-400 font-semibold">Active</span>
                    </div>

                    {/* Real <Reveal> Primitives from @scrollcraft/react */}
                    <Reveal direction="up" distance={25} duration={0.6}>
                      <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-mono flex items-center justify-center font-bold">1</span>
                          <span className="text-xs font-semibold text-white">Direct Hardware Transform</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">GPU Mutex</span>
                      </div>
                    </Reveal>

                    <Reveal direction="up" distance={25} duration={0.6} delay={0.12}>
                      <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-mono flex items-center justify-center font-bold">2</span>
                          <span className="text-xs font-semibold text-white">Batched IntersectionObserver</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">0 Re-renders</span>
                      </div>
                    </Reveal>

                    <Reveal direction="up" distance={25} duration={0.6} delay={0.24}>
                      <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-mono flex items-center justify-center font-bold">3</span>
                          <span className="text-xs font-semibold text-white">Subpixel Lerp Interpolation</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">60 FPS</span>
                      </div>
                    </Reveal>
                  </div>
                )}

                {/* 3. PIN DEMO */}
                {activePrimitive === 'pin' && (
                  <div className="relative w-full h-[280px] rounded-xl border border-white/[0.08] p-4 bg-[#07080b] flex flex-col justify-between">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>&lt;Pin /&gt; Sticky GPU Layout Mutex</span>
                      <span className="text-emerald-400 font-semibold">Active</span>
                    </div>

                    <div className="relative flex gap-4 flex-1 items-stretch">
                      <Pin top={12} className="w-2/5 shrink-0 self-start">
                        <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/40 shadow-lg">
                          <span className="text-[10px] font-mono text-violet-400 uppercase font-bold block mb-1">PINNED NODE</span>
                          <h4 className="text-xs font-bold text-white leading-snug">Locked Focus</h4>
                          <p className="text-[10px] text-zinc-400 mt-1">Spacer-free sticky physics with 0 layout shift</p>
                        </div>
                      </Pin>
                      <div className="w-3/5 space-y-2 flex flex-col justify-center">
                        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-between">
                          <span>01 &bull; Measure bounds</span>
                          <span className="text-[10px] text-emerald-400">Locked</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-between">
                          <span>02 &bull; Sticky lock</span>
                          <span className="text-[10px] text-violet-400">RAF Sync</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-between">
                          <span>03 &bull; Scroll content</span>
                          <span className="text-[10px] text-zinc-500">GPU Matched</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-between">
                          <span>04 &bull; Unpin cleanly</span>
                          <span className="text-[10px] text-zinc-500">0 Shift</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SCROLLPROGRESS DEMO */}
                {activePrimitive === 'progress' && (
                  <div className="relative w-full h-[280px] rounded-xl overflow-hidden border border-white/[0.08] p-6 bg-[#07080b] flex flex-col items-center justify-center space-y-6">
                    <div className="w-full max-w-sm space-y-2">
                      <div className="flex justify-between text-xs font-mono text-zinc-400">
                        <span>Normalized Scroll Track</span>
                        <span ref={progressPctRef} className="text-violet-400 font-bold">0%</span>
                      </div>
                      {/* Real <ScrollProgress> Primitive from @scrollcraft/react */}
                      <div className="w-full h-3 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <ScrollProgress asChild>
                          <div className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-indigo-500 origin-left" />
                        </ScrollProgress>
                      </div>
                    </div>

                    {/* Real-time Subscribed Metrics from useScrollCraft() - Zero React re-renders */}
                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm text-center font-mono text-xs">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 block">scaleX</span>
                        <span ref={progressValRef} className="text-violet-400 font-bold">0.000</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 block">Velocity</span>
                        <span ref={velocityValRef} className="text-emerald-400 font-bold">0.0 px/f</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Bottom 3 Feature Specs Row Matching Screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 mt-4 border-t border-white/[0.06]">
              
              {/* 1. 60 FPS */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shrink-0">
                  <Zap className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    60 FPS
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Smooth performance
                  </div>
                </div>
              </div>

              {/* 2. Composable */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shrink-0">
                  <Box className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Composable
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Use anywhere
                  </div>
                </div>
              </div>

              {/* 3. Customizable */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shrink-0">
                  <SlidersHorizontal className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Customizable
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Full control
                  </div>
                </div>
              </div>

            </div>

          </div>

=======
          ))}
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3
        </div>
      </div>
    </section>
  );
}
