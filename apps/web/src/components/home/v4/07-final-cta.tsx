'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowRight, BookOpen, FlaskConical } from 'lucide-react';

export function FinalCTASection() {
  const [copied, setCopied] = useState(false);
  const command = 'npm i @scrollcraft/react @scrollcraft/core';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sizes" className="relative w-full bg-lime text-ink border-b border-paper/10">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-10 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          
          {/* Left: Copy & Actions */}
          <div>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink/60">
              08 &bull; PRODUCTION SIZING
            </div>

            <h2 className="mt-5 font-display text-4xl sm:text-6xl font-extrabold uppercase leading-[0.95] tracking-tight">
              Use one primitive.<br />
              Ship one primitive.
            </h2>

            <p className="mt-6 text-sm sm:text-base text-ink/75 max-w-xl leading-relaxed font-body">
              Zero Virtual DOM re-renders. Every primitive and hook is fully tree-shakable down to sub-5 KB footprint. Optimized for Next.js 15 App Router and React 19.
            </p>

            {/* Terminal Box */}
            <div className="mt-8 max-w-md">
              <div className="flex items-center justify-between rounded-md border border-ink/20 bg-ink px-4 py-3 font-mono text-xs sm:text-sm text-paper shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto select-all pr-2">
                  <span className="text-lime font-bold select-none">$</span>
                  <span className="truncate">{command}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 p-1.5 rounded hover:bg-paper/10 text-paper/60 hover:text-paper transition-colors cursor-pointer"
                  title="Copy command"
                >
                  {copied ? <Check className="size-4 text-lime" /> : <Copy className="size-4" />}
                </button>
              </div>
              <p className="mt-2 font-mono text-[10px] text-ink/60 uppercase tracking-wider">
                CLI Scaffolder: npx scrollcraft add &lt;primitive&gt;
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/test"
                className="group inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 font-display text-xs font-bold uppercase text-lime hover:bg-ink/90 transition-all shadow-md active:scale-95"
              >
                <FlaskConical className="size-4" />
                <span>Open Test Lab (25 Demos)</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-md border border-ink/25 bg-transparent px-5 py-3 font-display text-xs font-bold uppercase text-ink hover:bg-ink/10 transition-colors"
              >
                <BookOpen className="size-4" />
                <span>Explore Docs</span>
              </Link>
            </div>
          </div>

          {/* Right: Sizing Comparison Matrix */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-px bg-ink/20 rounded-xl overflow-hidden border-2 border-ink/30 shadow-[8px_8px_0px_#0e1210]">
              <div className="bg-lime p-6 sm:p-8">
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                  24 KB
                </div>
                <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-ink/60">
                  Full Library Bundle
                </div>
                <p className="mt-3 text-xs text-ink/75 font-body">
                  Includes all primitives, hooks, R3F adapter, and ticker subsystem.
                </p>
              </div>

              <div className="bg-lime p-6 sm:p-8 border-l border-ink/10">
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                  &lt;5 KB
                </div>
                <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest text-ink/60">
                  Tree-Shaken Core
                </div>
                <p className="mt-3 text-xs text-ink/75 font-body">
                  Import only what you need. Zero unused dependencies or polyfills.
                </p>
              </div>
            </div>

            {/* Quick Spec Strip */}
            <div className="rounded-lg border border-ink/15 bg-ink/5 p-4 font-mono text-xs flex flex-wrap items-center justify-between gap-3 text-ink/70">
              <span>ZERO DEPENDENCIES</span>
              <span>&bull;</span>
              <span>WEAKMAP SAFE</span>
              <span>&bull;</span>
              <span>MIT LICENSED</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
