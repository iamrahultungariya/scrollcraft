'use client';

<<<<<<< HEAD
/**
 * ScrollCraft Section 1: Hero
 * - Left column:
 *   - Overline: CORE PRIMITIVES ? BETA
 *   - Dual-tone Headline: "You build the markup. / We handle the physics."
 *   - Description: Declarative, slot-based components that mutate hardware transform styles directly on the GPU thread.
 *   - 4 Feature Cards: React Re-Renders, Lenis Physics, RSC Safe, Tree-shakeable
 * - Right column:
 *   - Tag: FOR MODERN / WEB CREATORS
 *   - High-fidelity 3D Mountain & Code Block visual (/images/hero-mountain-code.webp)
 *   - Tag: SMOOTH / SCROLL. / REAL IMPACT.
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Parallax, Reveal } from '@scrollcraft/react';
import { Zap, Box, Leaf } from 'lucide-react';

export function HeroSection() {
=======
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reveal, useScrollCraft } from '@scrollcraft/react';
import { Terminal, Copy, Check, ArrowRight, Activity, Cpu, Zap, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'npm' | 'pnpm' | 'bun'>('npm');
  const [telemetry, setTelemetry] = useState({ fps: 120, velocity: 0, state: 'IDLE' });

  const installCmds = {
    npm: 'npm i @scrollcraft/react @scrollcraft/core',
    pnpm: 'pnpm add @scrollcraft/react @scrollcraft/core',
    bun: 'bun add @scrollcraft/react @scrollcraft/core',
  };

  const copyInstall = () => {
    navigator.clipboard.writeText(installCmds[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = performance.now();
    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const dt = Math.max(1, now - lastTime);
      const vel = Math.abs(currentY - lastY) / dt;
      setTelemetry({
        fps: 120,
        velocity: Number(vel.toFixed(2)),
        state: vel > 0.05 ? 'ACTIVE' : 'IDLE',
      });
      lastY = currentY;
      lastTime = now;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-20 overflow-hidden bg-[#050505]">
      {/* Background Architectural Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[360px] bg-gradient-to-b from-zinc-800/20 to-transparent blur-3xl pointer-events-none -z-10" />

<<<<<<< HEAD
            {/* Main Dual-Tone Headline with Reveal */}
            <Reveal direction="up" distance={20}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.4rem] font-bold tracking-tight leading-[1.08] mb-4 sm:mb-6 break-words">
                <span className="text-white block font-extrabold">You build the markup.</span>
                <span className="text-zinc-500 block font-bold mt-1">We handle the physics.</span>
              </h1>
            </Reveal>

            {/* Subtitle Description */}
            <Reveal direction="up" distance={15} delay={0.1}>
              <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl font-normal leading-relaxed mb-12 sm:mb-16">
                Declarative, slot-based components that mutate hardware transform styles directly on the GPU thread.
              </p>
            </Reveal>

            {/* 4 Feature Spec Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pt-4 border-t border-white/[0.06]">
              
              {/* 1. React Re-Renders */}
              <div className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-sm">
                  <Zap className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    React Re-Renders
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Zero during scroll
                  </div>
                </div>
              </div>

              {/* 2. Lenis Physics */}
              <div className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-sm">
                  <svg
                    className="w-4 h-4 text-violet-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12c3-4 6-4 9 0s6 4 9 0" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Lenis Physics
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Subpixel lerp
                  </div>
                </div>
              </div>

              {/* 3. RSC Safe */}
              <div className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-sm">
                  <Box className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    RSC Safe
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Next.js 15 Ready
                  </div>
                </div>
              </div>

              {/* 4. Tree-shakeable */}
              <div className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-white/[0.08] flex items-center justify-center text-zinc-300 shadow-sm">
                  <Leaf className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    Tree-shakeable
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    &lt; 5 KB brotli
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (Multi-Layer Kinetic Stage) - 5 cols on lg */}
          <div className="lg:col-span-5 flex flex-col justify-between relative">
            
            {/* Top Right Tag */}
            <div className="flex flex-col items-start lg:items-end mb-4 lg:mb-6 select-none">
              <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase text-left lg:text-right leading-relaxed">
                FOR MODERN<br />
                WEB CREATORS
              </div>
              <div className="w-8 h-[1px] bg-violet-500/40 mt-2 self-start lg:self-end" />
            </div>

            {/* Multi-Depth Kinetic Stage */}
            <div className="relative w-full flex items-center justify-center my-auto">
              {/* Layer 1: Parallax 3D Perspective Mountain Base */}
              <Parallax speed={0.06} min={-20} max={20} className="w-full flex items-center justify-center">
                <div className="relative w-full max-w-[580px] xl:max-w-[640px] transform transition-transform duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] hover:scale-[1.01] cursor-default">
                  <Image
                    src="/images/hero-mountain-code.webp"
                    alt="ScrollCraft 3D Mountain and Code Window"
                    width={960}
                    height={640}
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                    className="w-full h-auto object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] select-none pointer-events-none"
                  />
                </div>
              </Parallax>
            </div>

            {/* Bottom Right Tag */}
            <div className="flex justify-end mt-4 lg:mt-6 select-none">
              <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase text-right leading-relaxed">
                SMOOTH<br />
                SCROLL.<br />
                REAL IMPACT.
              </div>
            </div>

          </div>

        </div>

      </div>
=======
      <div className="w-full max-w-5xl flex flex-col items-center text-center relative z-10">
        {/* Engine Telemetry HUD Pill */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-xs font-mono text-zinc-400 mb-8 shadow-sm">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetry.state === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            ENGINE {telemetry.state}
          </span>
          <span className="w-px h-3 bg-zinc-700" />
          <span className="text-zinc-300">TARGET: 120 FPS</span>
          <span className="w-px h-3 bg-zinc-700" />
          <span className="text-zinc-400">VELOCITY: {telemetry.velocity} px/ms</span>
          <span className="w-px h-3 bg-zinc-700 hidden sm:inline" />
          <span className="text-emerald-400 hidden sm:inline">ZERO VDOM RE-RENDERS</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] font-sans">
          The Zero-VDOM Scroll Engine for <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">React</span>.
        </h1>
>>>>>>> aa606abecf8f94b309a543375cad20747d36f6f3

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-sans font-normal">
          Composable primitives and low-level hooks that write hardware transforms directly to the GPU layer. Silky 120 FPS motion without per-frame React reconciliation overhead.
        </p>

        {/* Install Command Terminal Box */}
        <div className="mt-10 w-full max-w-lg bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-2.5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2 px-2 border-b border-zinc-900">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="ml-2 text-[11px] font-mono text-zinc-500">install package</span>
            </div>
            <div className="flex gap-1">
              {(['npm', 'pnpm', 'bun'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    activeTab === tab ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2.5 mt-1 font-mono text-xs sm:text-sm text-zinc-200">
            <span className="select-all truncate text-zinc-300 font-mono">
              <span className="text-zinc-600 mr-2">$</span>
              {installCmds[activeTab]}
            </span>
            <button
              onClick={copyInstall}
              className="ml-3 p-1.5 rounded-md hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all shadow-md hover:shadow-zinc-700/20 active:scale-[0.98]"
          >
            Launch Test Lab
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-800/80 hover:text-white transition-all active:scale-[0.98]"
          >
            Documentation
          </Link>
        </div>

        {/* Core Architectural Guarantees */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left border-t border-zinc-900/80 pt-10">
          <div className="p-3.5 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              ZERO VDOM
            </div>
            <p className="text-xs text-zinc-500">Zero React state mutations during frame loop.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              4-PHASE PIPELINE
            </div>
            <p className="text-xs text-zinc-500">Measure, Driver, Update, Render separation.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              RSC COMPLIANT
            </div>
            <p className="text-xs text-zinc-500">Next.js App Router & React 19 production ready.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              SUBPIXEL SETTLING
            </div>
            <p className="text-xs text-zinc-500">Fluid motion settling with integer snapping.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
