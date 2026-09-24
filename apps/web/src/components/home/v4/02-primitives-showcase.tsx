'use client';

/**
 * ScrollCraft Section 2: Primitives Showcase
 * Redesigned to use official @scrollcraft/react library primitives:
 * - Parallax, Reveal, Pin, ScrollProgress directly from @scrollcraft/react
 * - Clean Code Block header: no source link or unnecessary CTAs
 * - Clean Preview header: no Live Controls toggle, clean device viewports
 * - Production-ready, copy-pasteable code blocks
 * - Tab-wise interactive primitive execution in live preview
 */

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
  name: string;
  badge?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  code: Record<FrameworkKey, string>;
}

const PRIMITIVES_DATA: Record<PrimitiveKey, PrimitiveData> = {
  parallax: {
    id: 'parallax',
    name: 'Parallax',
    badge: 'Most Popular',
    description: 'Smooth, hardware-accelerated parallax effects with zero layout shift.',
    icon: Layers,
    code: {
      react: `import { Parallax } from '@scrollcraft/react'

export function Hero() {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <Parallax speed={0.3} className="absolute inset-0">
        <img 
          src="/images/mountains.jpg" 
          alt="Mountains" 
          className="h-full w-full object-cover" 
        />
      </Parallax>
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-5xl font-semibold">Build without limits.</h1>
      </div>
    </section>
  )
}`,
      nextjs: `import Image from 'next/image'
import { Parallax } from '@scrollcraft/react'

export function Hero() {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <Parallax speed={0.3} className="absolute inset-0">
        <Image 
          src="/images/mountains.jpg" 
          alt="Mountains" 
          fill
          priority
          className="object-cover" 
        />
      </Parallax>
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-5xl font-semibold">Build without limits.</h1>
      </div>
    </section>
  )
}`,
    },
  },
  reveal: {
    id: 'reveal',
    name: 'Reveal',
    badge: 'GPU Batched',
    description: 'Smooth reveal-on-enter animation with staggered hardware physics.',
    icon: Eye,
    code: {
      react: `import { Reveal } from '@scrollcraft/react'

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Reveal direction="up" distance={32} duration={0.6}>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-lg font-bold text-white">Hardware Physics</h3>
          <p className="text-zinc-400 mt-2">Mutates transform styles directly on GPU.</p>
        </div>
      </Reveal>
      <Reveal direction="up" distance={32} duration={0.6} delay={0.12}>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-lg font-bold text-white">Batched Observers</h3>
          <p className="text-zinc-400 mt-2">Single shared IntersectionObserver.</p>
        </div>
      </Reveal>
      <Reveal direction="up" distance={32} duration={0.6} delay={0.24}>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-lg font-bold text-white">Zero Re-renders</h3>
          <p className="text-zinc-400 mt-2">Zero React reconciler overhead.</p>
        </div>
      </Reveal>
    </div>
  )
}`,
      nextjs: `'use client'
import { Reveal } from '@scrollcraft/react'

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Reveal direction="up" distance={32} duration={0.6}>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-lg font-bold text-white">RSC Safe</h3>
          <p className="text-zinc-400 mt-2">Works seamlessly in Next.js 15 App Router.</p>
        </div>
      </Reveal>
    </div>
  )
}`,
    },
  },
  pin: {
    id: 'pin',
    name: 'Pin',
    badge: 'Zero Thrash',
    description: 'Sticky layout pinning without layout thrashing or spacer jumps.',
    icon: Lock,
    code: {
      react: `import { Pin } from '@scrollcraft/react'

export function StickyShowcase() {
  return (
    <div className="relative flex gap-8 p-6">
      <Pin top={24} className="w-1/3 self-start">
        <div className="p-6 rounded-2xl bg-violet-950/40 border border-violet-500/30">
          <h3 className="text-lg font-bold text-white">Pinned Focal Node</h3>
          <p className="text-zinc-400 mt-2">Sticky lock-in with 0 layout thrashing.</p>
        </div>
      </Pin>
      <div className="w-2/3 space-y-6">
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">Step 01 &bull; Measure</div>
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">Step 02 &bull; Mutate</div>
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">Step 03 &bull; Render</div>
      </div>
    </div>
  )
}`,
      nextjs: `'use client'
import { Pin } from '@scrollcraft/react'

export function StickyShowcase() {
  return (
    <div className="flex gap-8">
      <Pin top={24} className="w-1/3">
        <div className="p-6 rounded-xl bg-violet-950/40 border border-violet-500/30">
          <h3 className="text-white font-bold">Sticky Hero</h3>
        </div>
      </Pin>
    </div>
  )
}`,
    },
  },
  progress: {
    id: 'progress',
    name: 'ScrollProgress',
    badge: 'Normalized',
    description: 'Direct GPU scaleX scroll progress normalization (0.0 to 1.0).',
    icon: Disc3,
    code: {
      react: `import { ScrollProgress } from '@scrollcraft/react'

export function HeaderProgressBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-zinc-900">
      <ScrollProgress asChild>
        <div className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-indigo-500 origin-left" />
      </ScrollProgress>
    </div>
  )
}`,
      nextjs: `'use client'
import { ScrollProgress } from '@scrollcraft/react'

export function HeaderProgressBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-zinc-900">
      <ScrollProgress asChild>
        <div className="h-full bg-violet-500 origin-left" />
      </ScrollProgress>
    </div>
  )
}`,
    },
  },
};

export function PrimitivesShowcase() {
  const [activePrimitive, setActivePrimitive] = useState<PrimitiveKey>('parallax');
  const [activeFramework, setActiveFramework] = useState<FrameworkKey>('react');
  const [activeDevice, setActiveDevice] = useState<DeviceKey>('desktop');
  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState<'code' | 'preview'>('code');
  // Direct DOM refs for 0 React re-renders during scroll
  const progressPctRef = useRef<HTMLSpanElement>(null);
  const progressValRef = useRef<HTMLSpanElement>(null);
  const velocityValRef = useRef<HTMLSpanElement>(null);

  const { subscribe } = useScrollCraft();

  useEffect(() => {
    if (activePrimitive !== 'progress') return;
    const unsub = subscribe((metrics) => {
      const p = metrics.progress || 0;
      if (progressPctRef.current) {
        progressPctRef.current.textContent = `${Math.round(p * 100)}%`;
      }
      if (progressValRef.current) {
        progressValRef.current.textContent = p.toFixed(3);
      }
      if (velocityValRef.current) {
        velocityValRef.current.textContent = `${Math.abs(metrics.velocity || 0).toFixed(1)} px/f`;
      }
    });
    return () => unsub();
  }, [subscribe, activePrimitive]);

  const currentData = PRIMITIVES_DATA[activePrimitive];
  const currentCode = currentData.code[activeFramework];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Device width mapping
  const deviceWidthClass = {
    desktop: 'w-full',
    tablet: 'w-full max-w-[540px] mx-auto',
    mobile: 'w-full max-w-[360px] mx-auto',
  }[activeDevice];

  return (
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
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
              Copy, paste, and customize. Each primitive is a composable building block with live preview and production-ready code.
            </p>
          </div>

          {/* Right Tag */}
          <div className="hidden md:flex md:col-span-3 flex-col items-end pt-2">
            <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase text-right leading-relaxed">
              POWERFUL<br />
              PRIMITIVES.<br />
              REAL EXPERIENCES.
            </div>
            <div className="w-8 h-[1px] bg-zinc-800 mt-2 ml-auto" />
          </div>

        </div>

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
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {currentData.description}
                  </p>
                </div>
              </div>

              {/* Framework Selector Tabs & Copy Action */}
              <div className="flex items-center justify-between mt-4 mb-3">
                <div className="flex items-center gap-2">
                  {(['react', 'nextjs'] as FrameworkKey[]).map((fw) => {
                    const isFwActive = activeFramework === fw;
                    const label = fw === 'react' ? 'React' : 'Next.js';
                    return (
                      <button
                        key={fw}
                        type="button"
                        onClick={() => setActiveFramework(fw)}
                        className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                          isFwActive
                            ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-all cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Syntax Highlighted Code Viewer with Auto Word Wrap and Isolated Vertical Scroll */}
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="rounded-xl bg-[#07080b] border border-white/[0.06] p-4 overflow-y-auto overflow-x-hidden font-mono text-xs leading-relaxed h-[280px] max-h-[280px] select-text overscroll-contain"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(168, 85, 247, 0.4) rgba(255, 255, 255, 0.05)',
                }}
              >
                <table className="w-full border-collapse table-fixed">
                  <tbody>
                    {currentCode.split('\n').map((line, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="pr-3 text-right select-none text-zinc-600 w-7 align-top text-[11px] shrink-0">
                          {idx + 1}
                        </td>
                        <td className="whitespace-pre-wrap break-words text-zinc-300 overflow-hidden">
                          {renderSyntaxLine(line)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

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

        </div>

      </div>

    </section>
  );
}

/**
 * Lightweight client-side syntax highlighter for code preview tokens
 */
function renderSyntaxLine(line: string) {
  const keywords = ['import', 'from', 'export', 'function', 'return', 'const', 'let', 'class', 'default'];
  const components = ['Parallax', 'Reveal', 'Pin', 'ScrollProgress', 'Hero', 'Image', 'FeatureGrid', 'StickySection', 'HeaderProgress'];
  
  if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
    return <span className="text-zinc-500 italic">{line}</span>;
  }

  const parts = line.split(/(\s+|[{}\[\](),<>=;:]|"[^"]*"|'[^']*')/g);

  return parts.map((part, i) => {
    if (keywords.includes(part)) {
      return <span key={i} className="text-pink-400 font-semibold">{part}</span>;
    }
    if (components.includes(part)) {
      return <span key={i} className="text-cyan-300 font-semibold">{part}</span>;
    }
    if (part.startsWith('"') || part.startsWith("'")) {
      return <span key={i} className="text-emerald-300">{part}</span>;
    }
    if (part.startsWith('<') || part.endsWith('>')) {
      return <span key={i} className="text-violet-300">{part}</span>;
    }
    if (/^[0-9.]+$/.test(part)) {
      return <span key={i} className="text-amber-300">{part}</span>;
    }
    if (['className', 'speed', 'src', 'alt', 'direction', 'distance', 'duration', 'delay', 'start', 'end', 'asChild'].includes(part)) {
      return <span key={i} className="text-yellow-200">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}
