'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { ArrowUpRight, Copy, Check, Layers, Eye, PinIcon, Repeat } from 'lucide-react';

interface PrimitiveCard {
  id: string;
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
  <span>ZERO VDOM ΓÇó 120 FPS ΓÇó REACT 19 ΓÇó LENIS ENGINE</span>
</VelocityMarquee>`,
    testSlug: 'velocity-marquee',
  },
];

export function PrimitivesShowcase() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-zinc-900">
          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Core Primitives</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 font-sans">
              Declarative wrappers. Zero overhead.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm text-zinc-400 max-w-md font-sans">
            Plug-and-play components configured via props. Direct DOM manipulation inside the render phase without React state triggers.
          </p>
        </div>

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
          ))}
        </div>
      </div>
    </section>
  );
}
