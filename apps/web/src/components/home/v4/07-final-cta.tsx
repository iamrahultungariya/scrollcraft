'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Copy, Check, ArrowRight, BookOpen, FlaskConical } from 'lucide-react';

export function FinalCTASection() {
  const [copied, setCopied] = useState(false);
  const command = 'npm i @scrollcraft/react @scrollcraft/core';

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-zinc-900 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Overline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          READY FOR PRODUCTION
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans max-w-2xl">
          Build scroll experiences with engineering confidence.
        </h2>

        <p className="mt-4 text-base text-zinc-400 max-w-xl font-sans">
          Zero VDOM re-renders. Composables and low-level reactive hooks ready for Next.js App Router and React 19.
        </p>

        {/* Terminal Box */}
        <div className="mt-10 w-full max-w-md bg-zinc-950 border border-zinc-800/90 rounded-xl p-3 flex items-center justify-between font-mono text-xs sm:text-sm text-zinc-300 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto pr-2">
            <span className="text-zinc-600 select-none">$</span>
            <span className="select-all text-zinc-200">{command}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
            title="Copy command"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* CLI Future Note */}
        <p className="mt-3 text-xs font-mono text-zinc-600">
          CLI component support (<span className="text-zinc-500">npx scrollcraft add &lt;primitive&gt;</span>) arriving in v0.3.0
        </p>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            <FlaskConical className="w-4 h-4" />
            Open Live Test Lab
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-800 hover:text-white transition-all active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4" />
            Explore Documentation
          </Link>
        </div>
      </div>
    </section>
  );
}
