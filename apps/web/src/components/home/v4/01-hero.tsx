'use client';

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
  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-between pt-24 pb-12 overflow-hidden">
      {/* Architectural Background Grid Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)] z-0"
      />

      {/* Ambient Electric Violet Glow Behind 3D Mountain & Code Visual */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-10 w-[520px] h-[520px] rounded-full pointer-events-none -z-0"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Top Section Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex-1 flex flex-col justify-center">
        
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center pt-4 pb-8">
          
          {/* Left Column (Hero Copy & Controls) - 7 cols on lg */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Overline Badge */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5 sm:mb-6 text-xs font-mono select-none">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                <span>v0.2.0 BETA (LIVE)</span>
              </div>
              <Link
                href="/roadmap"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[11px] font-bold tracking-wide hover:bg-violet-500/20 transition-colors"
              >
                <span>v0.3.0 Horizon</span>
                <span className="text-[10px] text-violet-400">&rarr;</span>
              </Link>
            </div>

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

    </section>
  );
}
