'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowRight, BookOpen, FlaskConical } from 'lucide-react';
import { Reveal } from '@scrollcraft/react';

export function FinalCTASection() {
  const [copied, setCopied] = useState(false);
  const command = 'pnpm add @scrollcraft/react @scrollcraft/core';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-[#09090b] border-b border-[#1c1c1f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal duration={0.5}>
          <div className="py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
            {/* Left: Copy & Actions */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.2em]">
                  Production Onboarding
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-[#fafafa] font-sans leading-[1.08] max-w-xl">
                Build scroll experiences with engineering confidence.
              </h2>

              <p className="mt-5 text-base text-[#a1a1aa] max-w-md leading-[1.75] font-sans">
                Zero Virtual DOM re-renders. Composable primitives and low-level reactive hooks ready for Next.js 15 App Router and React 19.
              </p>

              {/* Terminal Install Box */}
              <div className="mt-8 max-w-md">
                <div className="border border-[#27272a] bg-[#121214] rounded-lg overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-4 py-3 font-mono text-sm">
                    <div className="flex items-center gap-2 overflow-x-auto select-all pr-2">
                      <span className="text-[#52525b] select-none shrink-0">$</span>
                      <span className="text-[#fafafa] whitespace-nowrap">{command}</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded hover:bg-[#18181b] text-[#71717a] hover:text-[#fafafa] transition-colors flex-shrink-0 cursor-pointer"
                      title="Copy command"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#3b82f6]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] font-mono text-[#71717a]">
                  CLI component installer: <span className="text-[#a1a1aa]">npx scrollcraft add &lt;primitive&gt;</span> &bull; v0.3.0
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/test"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#fafafa] text-[#09090b] text-sm font-semibold rounded hover:bg-[#e4e4e7] transition-colors shadow-sm"
                >
                  <FlaskConical className="w-4 h-4 text-[#3b82f6]" />
                  Open Live Test Lab
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#27272a] text-[#fafafa] text-sm font-medium rounded hover:border-[#3f3f46] hover:bg-[#121214] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#71717a]" />
                  Explore Documentation
                </Link>
              </div>
            </div>

            {/* Right: Architectural Specifications Matrix */}
            <div className="border border-[#27272a] bg-[#121214] rounded-xl overflow-hidden w-full lg:w-[280px] shrink-0 shadow-lg">
              <div className="px-5 py-3 border-b border-[#1c1c1f] bg-[#0d0d0f]">
                <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.18em]">
                  Architectural Matrix
                </span>
              </div>
              <div className="divide-y divide-[#1c1c1f]">
                {[
                  { label: 'Bundle Footprint', value: '4.8 kB gzipped' },
                  { label: 'Dependencies', value: '0 (Pure zero-dep)' },
                  { label: 'React Support', value: '18 & 19 Native' },
                  { label: 'Next.js Routing', value: 'App Router / RSC' },
                  { label: 'TypeScript', value: 'Strict 5.9 Types' },
                  { label: 'License Model', value: 'MIT Open Source' },
                  { label: 'Current Release', value: 'v0.2.0 Beta' },
                ].map(({ label, value }) => (
                  <div key={label} className="px-5 py-3 flex items-center justify-between text-xs">
                    <span className="text-[#71717a] font-sans">{label}</span>
                    <span className="font-mono text-[#fafafa] font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
