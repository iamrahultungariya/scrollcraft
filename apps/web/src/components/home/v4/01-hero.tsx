'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { Copy, Check, ArrowRight, BookOpen } from 'lucide-react';
import { GithubIcon } from '@/components/ui/social-icons';

const STATS = [
  { value: '4.8 kB', label: 'gzipped core' },
  { value: '0', label: 'VDOM re-renders' },
  { value: '120', label: 'FPS native sync' },
  { value: '4', label: 'phase engine loop' },
];

const FEATURE_GRID = [
  {
    heading: 'Zero Re-renders',
    body: 'Hardware GPU transform writes bypass React reconciliation entirely. Scroll events never touch the VDOM.',
  },
  {
    heading: 'Composable Primitives',
    body: '<Parallax />, <Reveal />, <Pin />, <VelocityMarquee /> — each configurable via props, each tree-shakable.',
  },
  {
    heading: 'Native ViewTimeline',
    body: 'Runs on the compositor thread when the browser supports it. Falls back to a JS driver transparently.',
  },
  {
    heading: 'SSR & Next.js Ready',
    body: 'Zero-FOUC hydration lifecycle. Works with React 19, Next.js App Router, and Turbopack out of the box.',
  },
];

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'npm' | 'pnpm' | 'bun'>('npm');

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

  return (
    <section className="relative w-full bg-[#0a0a0a] border-b border-[#1c1c1e]">
      {/* Top rule */}
      <div className="border-b border-[#1c1c1e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#52525b] tracking-[0.18em] uppercase">
            ScrollCraft — v0.2.0 Beta
          </span>
          <span className="text-[11px] font-mono text-[#52525b]">
            The Zero-VDOM Scroll Engine
          </span>
        </div>
      </div>

      {/* Hero content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-0 border-b border-[#1c1c1e]">
          {/* Left: Big headline */}
          <div className="py-16 lg:py-24 pr-0 lg:pr-16 lg:border-r border-[#1c1c1e]">
            <Reveal duration={0.45}>
              <div className="mb-6 inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.2em]">
                  Performance-first · React 19 · Next.js App Router
                </span>
              </div>
            </Reveal>

            <Reveal duration={0.5} delay={0.06}>
              <h1 className="text-[3rem] sm:text-[4rem] lg:text-[4.75rem] font-bold tracking-[-0.03em] text-white leading-[1.02] font-sans">
                The scroll engine<br />
                React deserves.
              </h1>
            </Reveal>

            <Reveal duration={0.5} delay={0.12}>
              <p className="mt-6 text-base text-[#a1a1aa] max-w-lg leading-[1.7] font-sans">
                Composable primitives and low-level reactive hooks that write hardware transforms directly to the GPU layer. Silky 120 FPS motion — no per-frame React reconciliation.
              </p>
            </Reveal>

            {/* Install block */}
            <Reveal duration={0.5} delay={0.18}>
              <div className="mt-10 max-w-lg">
                <div className="border border-[#2a2a2e] bg-[#111113] rounded-lg overflow-hidden">
                  {/* Tab bar */}
                  <div className="flex items-center border-b border-[#1c1c1e] px-3 py-2 gap-1">
                    {(['npm', 'pnpm', 'bun'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                          activeTab === tab
                            ? 'bg-[#1c1c1e] text-white'
                            : 'text-[#71717a] hover:text-[#a1a1aa]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {/* Command */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 overflow-x-auto font-mono text-sm">
                      <span className="text-[#52525b] select-none shrink-0">$</span>
                      <span className="text-[#e4e4e7] select-all whitespace-nowrap">
                        {installCmds[activeTab]}
                      </span>
                    </div>
                    <button
                      onClick={copyInstall}
                      className="ml-3 p-1.5 rounded hover:bg-[#1c1c1e] text-[#52525b] hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Copy command"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-[#3b82f6]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* CTA buttons */}
            <Reveal duration={0.5} delay={0.24}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-[#e4e4e7] transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2a2a2e] text-[#a1a1aa] text-sm font-medium rounded-lg hover:border-[#3f3f46] hover:text-white transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Documentation
                </Link>
                <a
                  href="https://github.com/ScrollCraft/scrollcraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2a2a2e] text-[#a1a1aa] text-sm font-medium rounded-lg hover:border-[#3f3f46] hover:text-white transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  Star on GitHub
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#1c1c1e] text-[#71717a] font-mono rounded">2.1k</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right: Stats column */}
          <Reveal duration={0.5} delay={0.1}>
            <div className="hidden lg:flex flex-col divide-y divide-[#1c1c1e] py-24">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex-1 flex flex-col justify-center px-8">
                  <div className="text-[2.5rem] font-bold text-white tracking-[-0.04em] font-sans leading-none tabular-nums">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-xs text-[#71717a] font-sans uppercase tracking-[0.12em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Feature grid — 4 columns below the fold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1c1c1e] border-b border-[#1c1c1e]">
          {FEATURE_GRID.map((item, i) => (
            <Reveal key={item.heading} duration={0.45} delay={i * 0.06}>
              <div className="py-10 px-7 group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-[0.18em]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2.5 font-sans">
                  {item.heading}
                </h3>
                <p className="text-xs text-[#71717a] leading-[1.75] font-sans">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
