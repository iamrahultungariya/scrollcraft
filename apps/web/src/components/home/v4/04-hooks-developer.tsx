'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useScrollCraft } from '@scrollcraft/react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { Eyebrow } from './01-hero';

type HookKey = 'useScrollProgress' | 'useParallax' | 'useReveal' | 'usePin' | 'useScrollTimeline';

interface HookDoc {
  name: string;
  badge: string;
  howItWorks: string;
  signature: string;
  returns: string;
  code: string;
}

const HOOKS: Record<HookKey, HookDoc> = {
  useScrollProgress: {
    name: 'useScrollProgress()',
    badge: 'ZERO-RECONCILIATION OBSERVABLE',
    howItWorks:
      'Subscribes to scroll position outside of React Fiber. Returns both direct zero-rerender ScrollValue observables for high-performance DOM binding and an optional reactive bridge when text rendering is required.',
    signature: 'useScrollProgress(targetRef?, options?: { offset?, orientation?, reactive? }): ScrollProgressReturn',
    returns: '{ targetRef, progressValue, scrollYValue, progress, scrollY }',
    code: `'use client';

import { useScrollProgress } from '@scrollcraft/react';

export function ScrollProgressBar() {
  // progressValue is an observable ScrollValue<number> that updates style directly
  const { progressValue } = useScrollProgress();

  return (
    <div className="fixed top-0 inset-x-0 h-0.5 bg-paper/10 z-50">
      {/* Mutates hardware style directly with zero React re-renders */}
      <div className="h-full bg-lime origin-left" style={{ transform: 'scaleX(var(--p))' }} />
    </div>
  );
}`,
  },
  useParallax: {
    name: 'useParallax()',
    badge: 'DIRECT COMPOSITOR MUTATION',
    howItWorks:
      'Computes spatial transformation matrices based on element viewport coordinates and writes translate3d styles directly to the DOM during Phase 4 of the ticker loop, completely bypassing React reconciliation.',
    signature: 'useParallax(ref: RefObject<HTMLElement>, options: { speed?, direction?, easing? }): void',
    returns: 'void (Mutates target DOM style declarations directly on GPU compositor)',
    code: `'use client';

import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function DepthSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Directly updates translate3d(0, y, 0) on hardware layer
  useParallax(targetRef, {
    speed: 0.25,
    direction: 'vertical',
  });

  return (
    <div ref={targetRef} className="card">
      <h3>Hardware-Accelerated Depth</h3>
    </div>
  );
}`,
  },
  useReveal: {
    name: 'useReveal()',
    badge: 'SSR-SAFE OBSERVER POOL',
    howItWorks:
      'Coordinates shared IntersectionObserver pools to track viewport intersections. Uses CSS data-attributes ([data-scrollcraft-reveal]) to prevent hydration flashes (zero-FOUC) while managing CSS transition lifecycles.',
    signature: 'useReveal(ref: RefObject<HTMLElement>, options?: { direction?, distance?, duration?, threshold? }): void',
    returns: 'void (Observer pool manages active entrance transitions)',
    code: `'use client';

import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function Headline() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useReveal(titleRef, {
    direction: 'up',
    distance: 24,
    duration: 0.6,
  });

  return (
    <h2 ref={titleRef} className="text-3xl font-bold uppercase">
      Fluid Entrance Without Layout Shift
    </h2>
  );
}`,
  },
  usePin: {
    name: 'usePin()',
    badge: 'CONTAINING-BLOCK PINNING',
    howItWorks:
      'Leverages native position: sticky with automated spacer calculation to preserve natural document flow. Detects containing-block boundaries and cleanly dismantles all ghost spacer elements when the component unmounts.',
    signature: 'usePin(ref: RefObject<HTMLElement>, options: { top?, pinSpacing?, anticipatePin? }): void',
    returns: 'void (Manages sticky layout pinning lifecycle and spacer cleanup)',
    code: `'use client';

import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function PinnedSidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);

  usePin(sidebarRef, {
    top: 80,
    pinSpacing: 400,
  });

  return (
    <aside ref={sidebarRef} className="sidebar">
      <div>Sticky Navigation Control</div>
    </aside>
  );
}`,
  },
  useScrollTimeline: {
    name: 'useScrollTimeline()',
    badge: 'NORMALIZED KEYFRAME SOLVER',
    howItWorks:
      'Interpolates normalized multi-track keyframe definitions ([0.0, 1.0]) against viewport scroll progress, evaluating cubic bezier easing and writing composite matrix styles without touching React component state.',
    signature: 'useScrollTimeline(target: RefObject<HTMLElement>, keyframes: KeyframeTrack[]): void',
    returns: 'void (Drives multi-segment keyframe transformations)',
    code: `'use client';

import { useRef } from 'react';
import { useScrollTimeline } from '@scrollcraft/react';

export function TimelineCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useScrollTimeline(canvasRef, [
    { at: 0.0, opacity: 0, scale: 0.9 },
    { at: 0.5, opacity: 1, scale: 1.0 },
    { at: 1.0, opacity: 0.2, scale: 1.05 },
  ]);

  return <div ref={canvasRef} className="timeline-stage" />;
}`,
  },
};

function LiveTelemetry() {
  const progressRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const { subscribe } = useScrollCraft();

  useEffect(() => {
    // Zero-reconciliation live telemetry: updates textContent on scroll with 0 React re-renders!
    return subscribe((m) => {
      if (progressRef.current) {
        progressRef.current.textContent = `${(m.progress * 100).toFixed(1)}%`;
      }
      if (scrollRef.current) {
        scrollRef.current.textContent = `${Math.round(m.scroll)} px`;
      }
    });
  }, [subscribe]);

  return (
    <div className="border-t border-paper/10 bg-ink/80 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
      <div>
        <span className="text-[10px] uppercase text-paper/40 block">Scroll Progress</span>
        <span ref={progressRef} className="font-bold text-lime">0.0%</span>
      </div>
      <div>
        <span className="text-[10px] uppercase text-paper/40 block">Scroll Offset</span>
        <span ref={scrollRef} className="font-bold text-paper">0 px</span>
      </div>
      <div>
        <span className="text-[10px] uppercase text-paper/40 block">Motion Pipeline</span>
        <span className="font-bold text-lime">Hardware Accelerated</span>
      </div>
      <div>
        <span className="text-[10px] uppercase text-paper/40 block">Reconciliation</span>
        <span className="font-bold text-lime">0 VDOM Dispatches</span>
      </div>
    </div>
  );
}

export function HooksDeveloperSection() {
  const [activeHook, setActiveHook] = useState<HookKey>('useScrollProgress');
  const [copied, setCopied] = useState(false);

  const doc = HOOKS[activeHook];

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hooks" className="relative w-full border-b border-paper/10 bg-ink py-24 px-5 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: API Architecture & Hook Selector */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Eyebrow number="06">Reactive hooks</Eyebrow>

            <h2 className="mt-7 font-display text-4xl font-extrabold uppercase leading-[0.95] text-paper sm:text-6xl">
              Tiny API.<br />
              <span className="text-lime">Clear intent.</span>
            </h2>

            <p className="mt-6 text-sm text-paper/70 leading-relaxed font-body">
              Import only what you need. Each hook operates as a decoupled controller that calculates numeric transform matrices and flushes directly to DOM elements with zero React state overhead.
            </p>

            {/* Architecture points */}
            <ul className="mt-8 grid gap-px border-y border-paper/10 font-mono text-xs uppercase tracking-wider text-paper/60">
              {[
                'Hardware compositor style writes',
                'Native prefers-reduced-motion fallback',
                'Tree-shakeable architecture (<5 KB core)',
                'WeakMap lifecycle automatic garbage collection',
              ].map((item, index) => (
                <li key={item} className="flex items-center gap-3.5 border-b border-paper/10 py-3 last:border-0">
                  <span className="text-lime font-bold">0{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Hook Selector Buttons */}
            <div className="mt-8 flex flex-wrap gap-2">
              {(Object.keys(HOOKS) as HookKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveHook(key)}
                  className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all cursor-pointer ${
                    activeHook === key
                      ? 'bg-lime text-ink font-bold shadow-sm'
                      : 'border border-paper/15 bg-panel text-paper/70 hover:border-lime/40 hover:text-paper'
                  }`}
                >
                  {key}()
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Code Window with Live Telemetry */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border-2 border-paper/20 bg-panel shadow-[8px_8px_0px_#0e1210]">
              
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-paper/10 px-5 py-3.5 bg-ink/60">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.68rem] uppercase tracking-widest text-paper/50">
                    {activeHook}.tsx
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime/10 text-lime font-bold">
                    {doc.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded bg-paper/10 px-2.5 py-1 text-[11px] font-mono text-paper/70 hover:text-paper hover:bg-paper/20 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3 text-lime" />
                        <span className="text-lime">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <span className="size-2 bg-lime" />
                </div>
              </div>

              {/* How it works banner */}
              <div className="px-5 py-3 bg-paper/5 border-b border-paper/10 font-body text-xs text-paper/70 leading-relaxed">
                <span className="font-mono text-[10px] text-lime font-bold uppercase tracking-wider block mb-1">
                  How it works:
                </span>
                {doc.howItWorks}
              </div>

              {/* Code Pre Block */}
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-paper/85 sm:p-7 sm:text-[0.82rem]">
                <code>{doc.code}</code>
              </pre>

              {/* Live Telemetry Footer (Real-time DOM ref update without React re-renders) */}
              <LiveTelemetry />

            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-mono text-paper/40">
              <span className="text-paper/60 truncate pr-4">{doc.signature}</span>
              <Link href="/docs#hooks" className="text-lime hover:underline shrink-0 inline-flex items-center gap-1">
                Full API Reference <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
