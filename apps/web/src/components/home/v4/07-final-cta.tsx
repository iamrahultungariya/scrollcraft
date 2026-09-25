'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowRight, BookOpen, FlaskConical } from 'lucide-react';
import { Reveal } from '@scrollcraft/react';

export function FinalCTASection() {
  const [copied, setCopied] = useState(false);
  const command = 'npm i @scrollcraft/react @scrollcraft/core';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal duration={0.5}>
          <div className="py-24 lg:py-32 border-b border-[#1c1c1e] grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span className="text-[11px] font-mono text-[#52525b] uppercase tracking-[0.18em]">
                  Ready for Production
                </span>
              </div>

              <h2 className="text-[2.5rem] sm:text-[3.25rem] font-bold tracking-[-0.03em] text-white font-sans leading-[1.08] max-w-xl">
                Build scroll experiences with engineering confidence.
              </h2>

              <p className="mt-5 text-base text-[#71717a] max-w-md leading-[1.75] font-sans">
                Zero VDOM re-renders. Composables and low-level reactive hooks ready for Next.js App Router and React 19.
              </p>

              {/* Terminal install */}
              <div className="mt-8 max-w-md">
                <div className="border border-[#2a2a2e] bg-[#111113] rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 font-mono text-sm">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      <span className="text-[#52525b] select-none shrink-0">$</span>
                      <span className="text-[#e4e4e7] select-all whitespace-nowrap">{command}</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="ml-3 p-1.5 rounded text-[#52525b] hover:text-white hover:bg-[#1c1c1e] transition-colors flex-shrink-0 cursor-pointer"
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
                <p className="mt-2 text-xs font-mono text-[#52525b]">
                  CLI support: <span className="text-[#71717a]">npx scrollcraft add &lt;primitive&gt;</span> — arriving v0.3.0
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/test"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-[#e4e4e7] transition-colors"
                >
                  <FlaskConical className="w-4 h-4" />
                  Open Live Test Lab
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#2a2a2e] text-[#a1a1aa] text-sm font-medium rounded-lg hover:border-[#3f3f46] hover:text-white transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Explore Documentation
                </Link>
              </div>
            </div>

            {/* Right: quick facts */}
            <div className="border border-[#1c1c1e] rounded-lg overflow-hidden w-full lg:w-[260px] shrink-0">
              <div className="px-5 py-3 border-b border-[#1c1c1e] bg-[#0d0d0f]">
                <span className="text-[10px] font-mono text-[#52525b] uppercase tracking-[0.18em]">Quick Facts</span>
              </div>
              <div className="divide-y divide-[#1c1c1e]">
                {[
                  { label: 'Bundle size', value: '4.8 kB' },
                  { label: 'Dependencies', value: '0' },
                  { label: 'React version', value: '18 / 19' },
                  { label: 'TypeScript', value: 'Full types' },
                  { label: 'License', value: 'MIT' },
                  { label: 'Version', value: 'v0.2.0 Beta' },
                ].map(({ label, value }) => (
                  <div key={label} className="px-5 py-3 flex items-center justify-between">
                    <span className="text-xs text-[#52525b] font-sans">{label}</span>
                    <span className="text-xs font-mono text-[#e4e4e7] font-medium">{value}</span>
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
