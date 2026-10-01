'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useScrollCraft } from '@scrollcraft/react';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { Eyebrow } from './01-hero';

interface PrimitiveCard {
  id: string;
  number: string;
  name: string;
  meta: string;
  tagline: string;
  desc: string;
  specs: string[];
  code: string;
  testSlug: string;
}

const PRIMITIVES: PrimitiveCard[] = [
  {
    id: 'parallax',
    number: '01',
    name: 'Parallax',
    meta: 'translate',
    tagline: 'Multi-layer depth with real velocity responsiveness.',
    desc: 'Bypasses React Fiber to compute 3D matrix transforms and writes directly to hardware style declarations with zero layout thrashing.',
    specs: ['Direct GPU matrix writes', 'WeakMap coordinate cache', 'Velocity-coupled gliding'],
    code: `import { Parallax } from '@scrollcraft/react';

export function DepthHero() {
  return (
    <div className="relative h-96 overflow-hidden">
      {/* Background layer moves slower */}
      <Parallax speed={-0.2} className="absolute inset-0">
        <div className="grid-layer" />
      </Parallax>

      {/* Foreground card moves faster */}
      <Parallax speed={0.3} className="relative z-10 m-auto">
        <div className="card">Hardware Depth</div>
      </Parallax>
    </div>
  );
}`,
    testSlug: 'parallax',
  },
  {
    id: 'reveal',
    number: '02',
    name: 'Reveal',
    meta: 'clip mask',
    tagline: 'Content wipes in on a precise, SSR-safe mask.',
    desc: 'Zero-FOUC typography and element entrances. Preserves server-rendered HTML during streaming hydration with native no-JS CSS fallbacks.',
    specs: ['IntersectionObserver pooling', 'Zero FOUC hydration safety', 'Staggered sequence timing'],
    code: `import { Reveal } from '@scrollcraft/react';

export function FeatureSection() {
  return (
    <Reveal direction="up" distance={32} duration={0.6}>
      <div className="feature-card">
        <h3>Hardware Entrance</h3>
        <p>SSR-safe hydration without flash.</p>
      </div>
    </Reveal>
  );
}`,
    testSlug: 'reveal',
  },
  {
    id: 'pin',
    number: '03',
    name: 'Pin',
    meta: 'sticky',
    tagline: 'Hold a stage while the scroll timeline runs.',
    desc: 'Prefers native position: sticky with transform fallbacks and containing-block safety. Automatically dismantles ghost spacers on unmount.',
    specs: ['Native sticky preference', 'Automatic spacer teardown', 'Stacking context safe'],
    code: `import { Pin } from '@scrollcraft/react';

export function PinnedShowcase() {
  return (
    <div className="grid grid-cols-12">
      <Pin top={80} pinSpacing={400} className="col-span-4">
        <aside className="sticky-stage">Pinned Runway Stage</aside>
      </Pin>
      <main className="col-span-8">Scrollable Stream</main>
    </div>
  );
}`,
    testSlug: 'pin',
  },
];

function PrimitiveVisual({ id }: { id: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLSpanElement>(null);
  const { subscribe } = useScrollCraft();

  useEffect(() => {
    return subscribe((m) => {
      if (id === 'parallax' && containerRef.current) {
        containerRef.current.style.setProperty('--vp', `${m.progress}`);
      } else if (id === 'pin' && pipRef.current) {
        pipRef.current.style.left = `${Math.min(m.progress * 100, 95)}%`;
      }
    });
  }, [id, subscribe]);

  if (id === 'parallax') {
    return (
      <div ref={containerRef} className="primitive-stage">
        <div className="absolute inset-0 grid place-items-center">
          {[0.2, 0.5, 0.9].map((speed, index) => (
            <span
              key={speed}
              className="absolute h-px bg-lime/70 motion-reduce:transform-none"
              style={{
                width: `${75 - index * 18}%`,
                transform: `translateX(calc((var(--vp, 0) - 0.5) * ${speed * 80}px))`,
              }}
            />
          ))}
        </div>
        <span className="absolute bottom-3 left-3 font-mono text-[0.62rem] text-paper/50">
          rate: 0.32 &bull; translate3d
        </span>
      </div>
    );
  }

  if (id === 'reveal') {
    return (
      <div className="primitive-stage p-4">
        <div className="grid h-full content-center gap-2">
          <div className="h-2 w-full bg-paper/20 rounded-sm" />
          <div className="h-2 w-4/5 bg-paper/20 rounded-sm" />
          <div className="h-2 w-1/2 bg-lime/80 rounded-sm" />
        </div>
        <span className="absolute bottom-3 right-3 font-mono text-[0.62rem] text-paper/50">
          mask: line &bull; ssr safe
        </span>
      </div>
    );
  }

  // Pin
  return (
    <div className="primitive-stage flex flex-col justify-between p-4">
      <div className="flex justify-center">
        <div className="h-fit rounded bg-lime px-3 py-1 font-mono text-[0.65rem] font-bold text-ink uppercase tracking-wider">
          PINNED STAGE
        </div>
      </div>
      <div className="h-px w-full bg-paper/20 relative">
        <span
          ref={pipRef}
          className="absolute -top-1 size-2 rounded-full bg-lime"
          style={{ left: '0%' }}
        />
      </div>
      <span className="font-mono text-[0.62rem] text-paper/50">
        sticky &bull; ghost spacer auto-teardown
      </span>
    </div>
  );
}

export function PrimitivesShowcase() {
  const [activeTab, setActiveTab] = useState<Record<string, 'preview' | 'code'>>({
    parallax: 'preview',
    reveal: 'preview',
    pin: 'preview',
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleTab = (id: string, tab: 'preview' | 'code') => {
    setActiveTab((prev) => ({ ...prev, [id]: tab }));
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="primitives" className="border-b border-paper/10 bg-panel/20">
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-10 sm:py-28">
        
        {/* Section Header */}
        <Eyebrow number="03">Three primitives</Eyebrow>
        
        <div className="mt-7 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] text-paper sm:text-6xl">
              Three moves.<br />
              <span className="text-lime">One engine.</span>
            </h2>
          </div>
          <p className="max-w-[36ch] text-sm leading-relaxed text-paper/60 font-body">
            Small primitives, composed with intent. Each responds directly to hardware scroll ticks instead of playing on a loop.
          </p>
        </div>

        {/* 3-Column Brutalist Grid */}
        <div className="mt-12 grid gap-px border border-paper/10 bg-paper/10 md:grid-cols-3">
          {PRIMITIVES.map((item) => {
            const isCode = activeTab[item.id] === 'code';

            return (
              <article
                key={item.id}
                className="primitive-card group flex flex-col justify-between bg-ink p-6 sm:p-7"
              >
                <div>
                  {/* Card Header */}
                  <div className="mb-5 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest">
                    <span className="text-lime font-bold">{item.number}</span>
                    <span className="text-paper/40">{item.meta}</span>
                    <div className="flex items-center gap-1 bg-panel rounded p-0.5 border border-paper/10">
                      <button
                        type="button"
                        onClick={() => toggleTab(item.id, 'preview')}
                        className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                          !isCode ? 'bg-lime text-ink font-bold' : 'text-paper/50 hover:text-paper'
                        }`}
                      >
                        Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTab(item.id, 'code')}
                        className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                          isCode ? 'bg-lime text-ink font-bold' : 'text-paper/50 hover:text-paper'
                        }`}
                      >
                        Code
                      </button>
                    </div>
                  </div>

                  {/* Visual / Code Switcher */}
                  {isCode ? (
                    <div className="relative h-[9rem] overflow-hidden rounded border border-paper/15 bg-panel p-3 font-mono text-[0.68rem] leading-relaxed text-paper/80">
                      <pre className="overflow-x-auto h-full pr-6">
                        <code>{item.code}</code>
                      </pre>
                      <button
                        type="button"
                        onClick={() => copyCode(item.id, item.code)}
                        className="absolute top-2 right-2 p-1.5 rounded bg-ink/80 text-paper/60 hover:text-paper"
                        title="Copy snippet"
                      >
                        {copiedId === item.id ? (
                          <Check className="size-3.5 text-lime" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <PrimitiveVisual id={item.id} />
                  )}

                  {/* Text Details */}
                  <div className="mt-6">
                    <h3 className="font-display text-xl font-bold uppercase text-paper tracking-tight">
                      &lt;{item.name} /&gt;
                    </h3>
                    <p className="mt-2 text-xs text-paper/60 leading-relaxed font-body">
                      {item.tagline}
                    </p>
                    <ul className="mt-4 space-y-1.5 font-mono text-[10px] text-paper/45">
                      {item.specs.map((spec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="size-1 bg-lime" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Link to Test Lab */}
                <div className="mt-8 pt-4 border-t border-paper/10 flex items-center justify-between">
                  <Link
                    href={`/test?primitive=${item.testSlug}`}
                    className="font-mono text-[0.65rem] uppercase tracking-wider text-lime hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>Test Lab Demo</span>
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <span className="font-mono text-[0.6rem] text-paper/40 uppercase">
                    GPU COMPOSITED
                  </span>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
