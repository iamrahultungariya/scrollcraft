'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Parallax, Reveal } from '@scrollcraft/react';
import { Copy, Check, ArrowRight, FlaskConical } from 'lucide-react';
import { GithubIcon } from '@/components/ui/social-icons';

const SPECS = [
  { label: 'BUNDLE SIZE', value: '4.8 kB', detail: 'gzipped core' },
  { label: 'VDOM DIFFS', value: '0', detail: 'bypasses react fiber' },
  { label: 'DISPLAY SYNC', value: '120 FPS', detail: 'compositor locked' },
  { label: 'MEMORY MODEL', value: 'WeakMap', detail: 'zero leak lifecycle' },
];

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pnpm' | 'npm' | 'bun'>('pnpm');

  const installCmds = {
    pnpm: 'pnpm add @scrollcraft/react @scrollcraft/core',
    npm: 'npm i @scrollcraft/react @scrollcraft/core',
    bun: 'bun add @scrollcraft/react @scrollcraft/core',
  };

  const copyInstall = () => {
    navigator.clipboard.writeText(installCmds[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-[#09090b] border-b border-[#1c1c1f]">
      {/* Top Architectural Coordinate Strip */}
      <div className="border-b border-[#1c1c1f] bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2.5 flex items-center justify-between font-mono text-[11px] text-[#71717a]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            <span className="text-[#fafafa] font-semibold">SCROLLCRAFT</span>
            <span className="text-[#27272a]">//</span>
            <span className="uppercase tracking-[0.14em]">Hardware-Accelerated React Motion Engine</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>[v0.2.0-BETA]</span>
            <span className="text-[#27272a]">//</span>
            <span>REACT 19 + NEXT.JS 15</span>
          </div>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Statement & Actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tag Badge */}
            <Reveal duration={0.4}>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#121214] border border-[#27272a] mb-6">
                <span className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-[0.18em] font-semibold">
                  Zero-VDOM Architecture
                </span>
                <span className="text-[#27272a]">•</span>
                <span className="text-[10px] font-mono text-[#71717a]">Direct GPU Compositing</span>
              </div>
            </Reveal>

            {/* Giant Headline */}
            <Reveal duration={0.5} delay={0.06}>
              <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-[-0.04em] text-[#fafafa] leading-[1.04] font-sans">
                Physics-driven scroll.<br />
                <span className="text-[#a1a1aa]">Engineered for React.</span>
              </h1>
            </Reveal>

            {/* Subtitle */}
            <Reveal duration={0.5} delay={0.12}>
              <p className="mt-6 text-base sm:text-lg text-[#a1a1aa] max-w-xl leading-[1.7] font-sans">
                Composable primitives and reactive hooks that compute numeric spatial matrices and flush directly to hardware style declarations. Buttery 120 FPS motion with zero Virtual DOM reconciliation.
              </p>
            </Reveal>

            {/* Terminal Box */}
            <Reveal duration={0.5} delay={0.18}>
              <div className="mt-8 w-full max-w-lg rounded-lg border border-[#27272a] bg-[#121214] overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#1c1c1f] bg-[#0d0d0f]">
                  <div className="flex items-center gap-1">
                    {(['pnpm', 'npm', 'bun'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                          activeTab === tab
                            ? 'bg-[#18181b] text-[#fafafa] font-medium border border-[#27272a]'
                            : 'text-[#71717a] hover:text-[#a1a1aa]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider">
                    PACKAGE MANAGER
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3 font-mono text-xs sm:text-sm">
                  <div className="flex items-center gap-2 overflow-x-auto select-all pr-2">
                    <span className="text-[#52525b] select-none">$</span>
                    <span className="text-[#fafafa] whitespace-nowrap">{installCmds[activeTab]}</span>
                  </div>
                  <button
                    onClick={copyInstall}
                    className="p-1.5 rounded hover:bg-[#18181b] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer shrink-0"
                    title="Copy command"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#3b82f6]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Action Buttons */}
            <Reveal duration={0.5} delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#fafafa] text-[#09090b] text-xs sm:text-sm font-semibold hover:bg-[#e4e4e7] transition-colors shadow-sm"
                >
                  Explore Documentation
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/test"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[#27272a] bg-[#121214] text-[#fafafa] text-xs sm:text-sm font-medium hover:border-[#3f3f46] hover:bg-[#18181b] transition-colors"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-[#3b82f6]" />
                  Interactive Test Lab
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#71717a] font-mono">
                    25
                  </span>
                </Link>

                <a
                  href="https://github.com/ScrollCraft/scrollcraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-[#27272a] text-[#71717a] hover:text-[#fafafa] hover:border-[#3f3f46] text-xs sm:text-sm transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub</span>
                  <span className="text-[10px] font-mono text-[#71717a]">2.1k</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Physical Hardware Compositor Stage (5 Cols) */}
          <div className="lg:col-span-5 w-full">
            <Reveal duration={0.6} delay={0.15}>
              <div className="relative w-full rounded-xl border border-[#27272a] bg-[#121214] p-6 shadow-2xl overflow-hidden">
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1f] font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span className="text-[#fafafa] font-semibold">STAGE // COMPOSITOR_VIEW</span>
                  </div>
                  <span className="text-[#71717a]">FPS: 120 LOCKED</span>
                </div>

                {/* Spatial Parallax Preview Canvas */}
                <div className="relative h-[290px] my-5 rounded-lg border border-[#1c1c1f] bg-[#09090b] overflow-hidden flex flex-col justify-between p-4">
                  {/* Subtle Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* Corner Crosshairs */}
                  <span className="absolute top-2 left-2 text-[10px] font-mono text-[#3f3f46] select-none">+</span>
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-[#3f3f46] select-none">+</span>
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#3f3f46] select-none">+</span>
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#3f3f46] select-none">+</span>

                  {/* Background Depth Plane with Parallax */}
                  <Parallax speed={-0.2} className="relative z-0 pointer-events-none">
                    <div className="w-full h-16 rounded border border-[#1c1c1f] bg-[#101012] p-3 flex items-center justify-between font-mono text-[10px] text-[#71717a]">
                      <span>DEPTH LAYER -0.20x</span>
                      <span>Z-INDEX: 00</span>
                    </div>
                  </Parallax>

                  {/* Active Foreground Plane with Parallax */}
                  <Parallax speed={0.25} className="relative z-10 my-auto">
                    <div className="p-4 rounded-lg border border-[#27272a] bg-[#18181b] shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-[#27272a] text-[11px] font-mono">
                        <span className="text-[#3b82f6] font-semibold">LAYER 01 // FOREGROUND</span>
                        <span className="text-[#10b981] font-semibold">translate3d(0, y, 0)</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between font-mono text-xs">
                        <span className="text-[#a1a1aa]">Reconciliation:</span>
                        <span className="text-[#fafafa] font-bold">0 VDOM Dispatches</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between font-mono text-xs">
                        <span className="text-[#a1a1aa]">Render Pipeline:</span>
                        <span className="text-[#fafafa]">Direct Style Flush</span>
                      </div>
                    </div>
                  </Parallax>

                  {/* Sub-plane with Counter Velocity */}
                  <Parallax speed={-0.1} className="relative z-0 pointer-events-none">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a] px-1">
                      <span>[COORDINATE MATRIX: 3D TRANSFORM]</span>
                      <span>TICKER: ACTIVE</span>
                    </div>
                  </Parallax>
                </div>

                {/* Stage Telemetry Specs */}
                <div className="pt-3 border-t border-[#1c1c1f] grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-[#71717a]">RE-RENDER COUNTER</div>
                    <div className="text-sm font-bold text-[#10b981] mt-0.5">0 Diff Passes</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#71717a]">LIFECYCLE DRIVER</div>
                    <div className="text-sm font-bold text-[#fafafa] mt-0.5">Ticker Loop Phase 4</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>

      {/* Architectural Metric Strip */}
      <div className="border-t border-[#1c1c1f] bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 divide-x divide-transparent sm:divide-[#1c1c1f]">
            {SPECS.map((spec, idx) => (
              <div key={spec.label} className={idx > 0 ? 'sm:pl-8' : ''}>
                <div className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.16em]">
                  {spec.label}
                </div>
                <div className="text-2xl font-bold text-[#fafafa] font-sans mt-1 tracking-tight">
                  {spec.value}
                </div>
                <div className="text-xs text-[#71717a] font-mono mt-0.5">
                  {spec.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
