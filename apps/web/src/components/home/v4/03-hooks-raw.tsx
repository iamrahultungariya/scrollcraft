'use client';

/**
 * ScrollCraft Section 3: Reactive Hooks / Raw Data
 * - Pixel-perfect match to media_1789365572064.png
 * - Pill tab selector: useScrollProgress(), useParallax(), useReveal(), usePin()
 * - Left: Production-ready code editor with TSX syntax highlighting, line numbers, framework tabs, copy button, status bar
 * - Right: Live telemetry card with real-time scroll metrics, smooth glowing SVG progress wave chart, and update stats
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useScrollCraft, Reveal } from '@scrollcraft/react';
import { ticker } from '@scrollcraft/core';
import {
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Check,
  Ruler,
  CircleDot,
  Activity,
  ArrowUpDown,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

type HookTab = 'useScrollProgress' | 'useParallax' | 'useReveal' | 'usePin';
type Framework = 'React' | 'Next.js' | 'TypeScript';

interface HookDefinition {
  title: string;
  desc: string;
  fileName: Record<Framework, string>;
  docLink: string;
  refLink: string;
  code: Record<Framework, string>;
}

const HOOK_DEFINITIONS: Record<HookTab, HookDefinition> = {
  useScrollProgress: {
    title: 'useScrollProgress()',
    desc: 'Provides continuous scroll progress [0.0 to 1.0], frame-to-frame data velocity, and direction vector.',
    fileName: {
      React: 'ScrollProgressDemo.tsx',
      'Next.js': 'scroll-indicator.tsx',
      TypeScript: 'scroll-telemetry.ts',
    },
    docLink: '/docs#progress',
    refLink: '/docs#hooks',
    code: {
      React: `import { useScrollProgress } from '@scrollcraft/react';

export function ScrollProgressDemo() {
  const { progress, velocity, direction } = useScrollProgress({
    smooth: true,
  });

  return (
    <div className="space-y-4">
      <div className="text-sm text-zinc-400">Scroll Progress</div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 transition-all duration-75"
          style={{ width: \`\${progress * 100}%\` }}
        />
      </div>
      <p className="text-xs text-zinc-500">
        {progress.toFixed(3)} · {velocity.toFixed(3)} px/f · {direction > 0 ? 'down' : 'up'}
      </p>
    </div>
  );
}`,
      'Next.js': `'use client';

import { useScrollProgress } from '@scrollcraft/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function NextScrollIndicator() {
  const pathname = usePathname();
  const { progress } = useScrollProgress({ smooth: true });

  // Recalibrates scroll track on Next.js route transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-1 bg-zinc-900">
      <div
        className="h-full bg-violet-500 transition-[width] duration-100 ease-out will-change-[width]"
        style={{ width: \`\${progress * 100}%\` }}
      />
    </header>
  );
}`,
      TypeScript: `import { ScrollEngine, ScrollMetrics } from '@scrollcraft/core';

export class ScrollTelemetryService {
  private engine: ScrollEngine;
  private unsubscribe?: () => void;

  constructor(engine: ScrollEngine) {
    this.engine = engine;
  }

  public monitor(onUpdate: (metrics: ScrollMetrics) => void): () => void {
    this.unsubscribe = this.engine.subscribe((metrics: ScrollMetrics) => {
      const { scroll, progress, velocity, direction } = metrics;
      onUpdate({ scroll, progress, velocity, direction });
    });
    return () => this.unsubscribe?.();
  }
}`,
    },
  },
  useParallax: {
    title: 'useParallax()',
    desc: 'Direct hardware GPU ref mutator. Calculates bounding client rect in measure phase and updates transform in mutate phase.',
    fileName: {
      React: 'ParallaxDemo.tsx',
      'Next.js': 'hero-parallax.tsx',
      TypeScript: 'parallax-driver.ts',
    },
    docLink: '/docs#parallax',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function ParallaxDemo() {
  const targetRef = useRef<HTMLDivElement>(null);
  useParallax(targetRef, {
    speed: 0.35,
    direction: 'vertical',
    min: -80,
    max: 80,
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 p-8">
      <div
        ref={targetRef}
        className="p-6 rounded-xl bg-violet-950/40 border border-violet-500/30 text-white"
      >
        <h4 className="text-sm font-bold">120 FPS Direct GPU Mutex</h4>
        <p className="text-xs text-zinc-400 mt-1">Zero React re-renders on scroll</p>
      </div>
    </div>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useParallax } from '@scrollcraft/react';

export function HeroParallax() {
  const imageRef = useRef<HTMLDivElement>(null);
  useParallax(imageRef, { speed: -0.25, min: -120, max: 120 });

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl">
      <div ref={imageRef} className="absolute inset-0 -top-20 h-[140%] w-full">
        <Image
          src="/images/mountains.jpg"
          alt="Hero Parallax Landscape"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}`,
      TypeScript: `import { ParallaxSolver, ticker, GlobalResizeManager } from '@scrollcraft/core';

export function initParallaxElement(element: HTMLElement, speed = 0.3): () => void {
  const solver = new ParallaxSolver(element, { speed, direction: 'vertical' });
  const unobserveResize = GlobalResizeManager.observe(element, () => solver.measure());

  const taskId = \`parallax-\${Math.random().toString(36).slice(2, 8)}\`;
  ticker.add(taskId, 'update', () => {
    solver.update(window.scrollY);
  });
  ticker.add(taskId, 'render', () => {
    solver.render();
  });

  return () => {
    ticker.remove(taskId);
    unobserveResize();
  };
}`,
    },
  },
  useReveal: {
    title: 'useReveal()',
    desc: 'IntersectionObserver wrapper computing distance-adjusted entry triggers with zero re-renders unless requested.',
    fileName: {
      React: 'RevealDemo.tsx',
      'Next.js': 'client-reveal-card.tsx',
      TypeScript: 'reveal-observer.ts',
    },
    docLink: '/docs#reveal',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function RevealDemo() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { inView, progress } = useReveal(targetRef, {
    threshold: 0.2,
    once: true,
  });

  return (
    <div
      ref={targetRef}
      className={\`p-6 rounded-xl border transition-all duration-700 \${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }\`}
    >
      <p className="text-xs text-emerald-400">Entry Progress: {progress.toFixed(2)}</p>
    </div>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

interface CardProps {
  title: string;
  description: string;
  delay?: number;
}

export function NextRevealCard({ title, description, delay = 0 }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { inView } = useReveal(cardRef, { threshold: 0.15, once: true });

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: \`\${delay}ms\` }}
      className={\`p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 transition-all duration-500 ease-out \${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }\`}
    >
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-zinc-400 mt-2">{description}</p>
    </div>
  );
}`,
      TypeScript: `import { globalVisibilityManager } from '@scrollcraft/core';

export interface RevealConfig {
  threshold?: number;
  onEnter?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement) => void;
}

export function observeReveal(element: HTMLElement, config: RevealConfig = {}): () => void {
  const unobserve = globalVisibilityManager.observe(element, (isVisible: boolean) => {
    if (isVisible) {
      element.setAttribute('data-visible', 'true');
      config.onEnter?.(element);
    } else {
      element.removeAttribute('data-visible');
      config.onLeave?.(element);
    }
  });
  return unobserve;
}`,
    },
  },
  usePin: {
    title: 'usePin()',
    desc: 'Calculates pinning bounds and preserves document flow using native sticky physics without layout thrashing.',
    fileName: {
      React: 'PinDemo.tsx',
      'Next.js': 'sticky-section.tsx',
      TypeScript: 'pinning-math.ts',
    },
    docLink: '/docs#pin',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function PinDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPinned, progress } = usePin(containerRef, {
    start: 'top top',
    end: '+=100%',
    pinSpacing: true,
    trackState: true,
  });

  return (
    <div ref={containerRef} className="h-screen w-full relative">
      <div className={\`p-6 rounded-xl border \${isPinned ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-800'}\`}>
        <span className="text-xs font-mono text-emerald-400">
          {isPinned ? 'PINNED' : 'FLOWING'} · {(progress * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function StickyShowcaseSection({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isPinned } = usePin(sectionRef, {
    start: 'top top',
    end: '+=200%',
    pinSpacing: true,
  });

  return (
    <section ref={sectionRef} className="relative min-h-[250vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <div className={\`transition-opacity duration-300 \${isPinned ? 'opacity-100' : 'opacity-70'}\`}>
          {children}
        </div>
      </div>
    </section>
  );
}`,
      TypeScript: `import { PinController, PinOptions } from '@scrollcraft/core';

export function setupPinning(element: HTMLElement, options: Partial<PinOptions> = {}): () => void {
  const controller = new PinController(element, {
    start: options.start ?? 'top top',
    end: options.end ?? '+=100%',
    pinSpacing: options.pinSpacing ?? true,
  });

  controller.init();
  window.addEventListener('resize', controller.refresh, { passive: true });

  return () => {
    window.removeEventListener('resize', controller.refresh);
    controller.destroy();
  };
}`,
    },
  },
};

/**
 * High-fidelity TSX token renderer
 */
function renderSyntaxLine(line: string, lineIndex: number): React.ReactNode {
  if (!line.trim()) {
    return <span key={lineIndex}>&nbsp;</span>;
  }

  // Pure comment line
  if (line.trim().startsWith('//')) {
    return (
      <span key={lineIndex} className="text-zinc-500 italic">
        {line}
      </span>
    );
  }

  // Tokenize line with regex
  const tokenRegex =
    /(\/\*[\s\S]*?\*\/|\/\/.*$)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')|(\b(?:import|export|from|const|function|return|default|interface|type|extends|let|var|if|else)\b)|(\b(?:undefined|true|false|null)\b)|(<\/?(?:div|p|span|button|section)|(?:\/>|>))|(\b(?:className|style|target|smooth|speed|direction|clamp|threshold|once|start|end|pinSpacing|ref|width)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=.:\$\*\/])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`text-${lastIndex}`} className="text-zinc-200">
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }

    const [full, comment, str, keyword, literal, tag, prop, num, punct] = match;

    if (comment) {
      nodes.push(
        <span key={`comment-${match.index}`} className="text-zinc-500 italic">
          {comment}
        </span>
      );
    } else if (str) {
      nodes.push(
        <span key={`str-${match.index}`} className="text-emerald-400">
          {str}
        </span>
      );
    } else if (keyword) {
      nodes.push(
        <span key={`kw-${match.index}`} className="text-purple-400 font-semibold">
          {keyword}
        </span>
      );
    } else if (literal) {
      nodes.push(
        <span key={`lit-${match.index}`} className="text-sky-400">
          {literal}
        </span>
      );
    } else if (tag) {
      nodes.push(
        <span key={`tag-${match.index}`} className="text-sky-400 font-medium">
          {tag}
        </span>
      );
    } else if (prop) {
      nodes.push(
        <span key={`prop-${match.index}`} className="text-cyan-300">
          {prop}
        </span>
      );
    } else if (num) {
      nodes.push(
        <span key={`num-${match.index}`} className="text-purple-300">
          {num}
        </span>
      );
    } else if (punct) {
      nodes.push(
        <span key={`punct-${match.index}`} className="text-zinc-400">
          {punct}
        </span>
      );
    } else {
      nodes.push(
        <span key={`other-${match.index}`} className="text-zinc-200">
          {full}
        </span>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <span key={`rem-${lastIndex}`} className="text-zinc-200">
        {line.slice(lastIndex)}
      </span>
    );
  }

  return <>{nodes}</>;
}

function computeWavePaths(pts: number[]) {
  const width = 300;
  const height = 90;
  const paddingBottom = 8;
  const step = width / (pts.length - 1);

  const coords = pts.map((val, idx) => {
    const x = idx * step;
    const y = (1 - val) * (height - paddingBottom) + 2;
    return { x, y };
  });

  if (coords.length === 0) return { strokePath: '', fillPath: '', lastY: 45 };

  let d = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  const fill = `${d} L ${width},${height} L 0,${height} Z`;
  const lastY = Number(coords[coords.length - 1].y.toFixed(1));
  return { strokePath: d, fillPath: fill, lastY };
}

const INITIAL_HISTORY = [
  0.14, 0.18, 0.24, 0.31, 0.38, 0.34, 0.32, 0.35, 0.39, 0.46,
  0.52, 0.58, 0.55, 0.49, 0.51, 0.56, 0.61, 0.57, 0.52, 0.56,
  0.62, 0.68, 0.65, 0.62, 0.58, 0.54, 0.48, 0.44, 0.41, 0.38,
];
const INITIAL_PATHS = computeWavePaths(INITIAL_HISTORY);

export function HooksRawSection() {
  const [activeTab, setActiveTab] = useState<HookTab>('useScrollProgress');
  const [activeFramework, setActiveFramework] = useState<'React' | 'Next.js' | 'TypeScript'>('React');
  const [copied, setCopied] = useState(false);

  // Mutable DOM refs for 0 React re-renders during high-frequency scroll
  const scrollPosTextRef = useRef<HTMLSpanElement>(null);
  const scrollPosBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const velocityTextRef = useRef<HTMLSpanElement>(null);
  const velocityFillRef = useRef<HTMLDivElement>(null);
  const directionTextRef = useRef<HTMLSpanElement>(null);
  const lastUpdateTextRef = useRef<HTMLDivElement>(null);
  const updateRateTextRef = useRef<HTMLDivElement>(null);
  const fpsBadgeRef = useRef<HTMLSpanElement>(null);
  const strokePathRef = useRef<SVGPathElement>(null);
  const fillPathRef = useRef<SVGPathElement>(null);
  const scanDotRef = useRef<SVGCircleElement>(null);
  const scanDotPingRef = useRef<SVGCircleElement>(null);
  const graphValBadgeRef = useRef<HTMLSpanElement>(null);

  const historyPointsRef = useRef<number[]>([...INITIAL_HISTORY]);

  const { subscribe } = useScrollCraft();

  const sectionRef = useRef<HTMLElement>(null);
  const isVisibleRef = useRef(false);

  // IntersectionObserver to cull off-screen telemetry updates & Bezier math
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      isVisibleRef.current = true;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '150px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll event & central ticker telemetry tracking - 0 React re-renders!
  useEffect(() => {
    let lastTimestamp = performance.now();
    let lastWaveUpdate = performance.now();

    const updateMetrics = (currScroll: number, currProgress: number, currVel: number, currDir: number) => {
      // Offscreen culling: skip DOM writes and Bezier math when section is not in viewport
      if (!isVisibleRef.current) return;

      const now = performance.now();
      const deltaMs = Math.max(1, now - lastTimestamp);
      lastTimestamp = now;

      // Direct DOM writes (GPU matched, 0 React re-renders)
      if (scrollPosTextRef.current) {
        scrollPosTextRef.current.textContent = `${Math.round(currScroll)} px`;
      }
      if (scrollPosBarRef.current) {
        scrollPosBarRef.current.style.width = `${Math.min(100, Math.max(12, (currScroll / 4000) * 100))}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = currProgress.toFixed(3);
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${Math.max(8, currProgress * 100)}%`;
      }
      if (velocityTextRef.current) {
        velocityTextRef.current.textContent = `${Math.abs(currVel).toFixed(3)} px/f`;
      }
      if (velocityFillRef.current) {
        velocityFillRef.current.style.width = `${Math.min(100, Math.max(8, Math.abs(currVel) * 25))}%`;
      }
      if (directionTextRef.current) {
        directionTextRef.current.textContent = currDir === -1 ? 'Up' : 'Down';
      }
      if (lastUpdateTextRef.current) {
        lastUpdateTextRef.current.textContent = `${deltaMs.toFixed(1)} ms ago`;
      }
      if (updateRateTextRef.current) {
        const rateHz = Math.min(240, Math.max(1, Math.round(1000 / deltaMs)));
        updateRateTextRef.current.textContent = `${rateHz} Hz`;
      }

      // Smoothly update waveform path & oscilloscope scan reticle (~15Hz throttle)
      if (now - lastWaveUpdate >= 66) {
        lastWaveUpdate = now;
        const pts = historyPointsRef.current;
        pts.shift();
        pts.push(Math.max(0.05, Math.min(0.95, currProgress)));
        const { strokePath, fillPath, lastY } = computeWavePaths(pts);
        if (strokePathRef.current) strokePathRef.current.setAttribute('d', strokePath);
        if (fillPathRef.current) fillPathRef.current.setAttribute('d', fillPath);
        if (scanDotRef.current) scanDotRef.current.setAttribute('cy', String(lastY));
        if (scanDotPingRef.current) scanDotPingRef.current.setAttribute('cy', String(lastY));
        if (graphValBadgeRef.current) graphValBadgeRef.current.textContent = `VAL: ${currProgress.toFixed(3)}`;
      }
    };

    // 1. Subscribe to ScrollCraft engine (Single Source of Truth)
    const unsub = subscribe((m) => {
      const dir = m.direction !== 0 ? m.direction : m.velocity > 0 ? 1 : m.velocity < 0 ? -1 : 1;
      updateMetrics(m.scroll || 0, m.progress || 0, m.velocity || 0, dir);
    });

    // 2. Hardware FPS telemetry synced with central Ticker (Zero competing RAF loops!)
    const fpsTimer = setInterval(() => {
      if (!isVisibleRef.current) return;
      const { fps, isIdle, targetFps } = ticker.getFrameRate();
      const displayFps = isIdle ? targetFps : Math.min(240, Math.max(1, fps));
      if (fpsBadgeRef.current) {
        fpsBadgeRef.current.textContent = isIdle ? `${displayFps} FPS (idle)` : `${displayFps} FPS`;
      }
    }, 1000);

    return () => {
      unsub();
      clearInterval(fpsTimer);
    };
  }, [subscribe]);

  const currentHook = HOOK_DEFINITIONS[activeTab];
  const currentCode = currentHook.code[activeFramework];
  const currentFileName = currentHook.fileName[activeFramework];

  // Copy code handler
  const handleCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [currentCode]);

  const codeLines = useMemo(() => {
    return currentCode.split('\n');
  }, [currentCode]);

  return (
    <section
      ref={sectionRef}
      id="hooks"
      className="relative w-full bg-[#050507] py-16 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <Reveal direction="down" distance={15}>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-violet-400">
                Reactive Hooks
              </span>
              <span className="text-xs font-mono text-zinc-600">/</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-violet-400">
                Raw Data
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                v0.2.0 (LIVE)
              </span>
            </div>
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-3 sm:mb-4 break-words">
              <span className="text-white block">Prefer to build your own?</span>
              <span className="text-zinc-500 block">Here&apos;s the data.</span>
            </h2>
          </Reveal>

          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Headless hooks exposing high-precision scroll telemetry, mutable ref values, and 3-phase microtask lifecycle events.
            </p>
          </Reveal>
        </div>

        {/* Hook Pill Tabs Selector with Mobile Horizontal Scroll */}
        <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-1 px-1 mb-8 sm:mb-10">
          <div className="inline-flex items-center p-1 rounded-full bg-zinc-950 border border-zinc-800/80 gap-1 shadow-inner shrink-0">
            {(['useScrollProgress', 'useParallax', 'useReveal', 'usePin'] as HookTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                    isActive
                      ? 'bg-zinc-900 border border-zinc-700/90 text-white font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  )}
                  <span>{tab}()</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* v0.2.0 Shipped Hooks Discovery Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs font-mono">
          <span className="text-emerald-400 font-bold">Shipped in v0.2.0 Beta:</span>
          <Link
            href="/docs#use-scroll-direction"
            className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>useScrollDirection()</span>
          </Link>
          <Link
            href="/docs#use-scroll-timeline"
            className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            useScrollTimeline()
          </Link>
          <Link
            href="/docs#use-scroll-transform"
            className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            useScrollTransform()
          </Link>
          <Link
            href="/docs#use-scroll-draw"
            className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            useScrollDraw()
          </Link>
        </div>

        {/* 2-Column Split: Code Viewer (Left) & Live Telemetry (Right) */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Code Viewer (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#09090b] shadow-2xl overflow-hidden">
            {/* Top Subheader */}
            <div className="p-5 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-violet-400 shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-mono font-bold text-white tracking-tight">
                    {currentHook.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-md">
                    {currentHook.desc}
                  </p>
                </div>
              </div>

              {/* Documentation Links */}
              <div className="flex items-center gap-4 shrink-0 sm:self-start pt-1 font-mono text-xs">
                <Link
                  href={currentHook.docLink}
                  className="text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <span>Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link
                  href={currentHook.refLink}
                  className="text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                >
                  <span>Hook Reference</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Framework & Filename Bar */}
            <div className="px-5 py-2.5 bg-[#0d0d10] border-b border-zinc-800/80 flex items-center justify-between gap-3">
              {/* Framework Switcher */}
              <div className="flex items-center gap-1">
                {(['React', 'Next.js', 'TypeScript'] as const).map((fw) => (
                  <button
                    key={fw}
                    type="button"
                    onClick={() => setActiveFramework(fw)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                      activeFramework === fw
                        ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {fw}
                  </button>
                ))}
              </div>

              {/* Filename & Copy Button */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                  {currentFileName}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-all cursor-pointer active:scale-95 ${
                    copied
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                  title="Copy code"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Syntax Highlighted Code Block with Auto Word Wrap */}
            <div className="p-4 sm:p-5 bg-[#060608] overflow-y-auto overflow-x-hidden flex-1 font-mono text-[12.5px] leading-relaxed select-text max-h-[380px]">
              <table className="w-full border-collapse table-fixed">
                <tbody>
                  {codeLines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="pr-4 text-right text-zinc-600 select-none w-7 align-top text-xs shrink-0">
                        {idx + 1}
                      </td>
                      <td className="whitespace-pre-wrap break-words text-zinc-200 overflow-hidden">
                        {renderSyntaxLine(line, idx)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Status Bar */}
            <div className="px-5 py-2.5 bg-[#09090b] border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Ln 1, Col 1</span>
              <div className="flex items-center gap-2">
                <span>{activeFramework} {activeFramework === 'TypeScript' ? '(TS)' : '(TSX)'}</span>
                <Settings className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          </div>

          {/* Right: Live Telemetry Card (5 Columns) */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-800/80 bg-[#09090b] p-4 sm:p-6 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Telemetry Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5 sm:mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                  <span className="text-sm font-semibold text-white">Live telemetry</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[11px] sm:text-xs font-semibold">
                    Live
                  </span>
                  <span ref={fpsBadgeRef} className="text-xs font-mono text-zinc-400">60 FPS</span>
                </div>
              </div>

              {/* 4 Metric Readout Rows */}
              <div className="space-y-3.5 sm:space-y-4 mb-5 sm:mb-6">
                {/* 1. Scroll Position */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Ruler className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">Scroll pos</span>
                  </div>
                  <div className="w-16 sm:w-28 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden shrink-0">
                    <div
                      ref={scrollPosBarRef}
                      className="h-full bg-violet-500 rounded-full transition-all duration-75"
                      style={{ width: '59%' }}
                    />
                  </div>
                  <span ref={scrollPosTextRef} className="font-mono text-xs sm:text-sm font-bold text-white text-right shrink-0 min-w-[54px] sm:min-w-[70px]">
                    2367 px
                  </span>
                </div>

                {/* 2. Scroll Progress */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <CircleDot className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">Progress</span>
                  </div>
                  <div className="w-16 sm:w-28 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden shrink-0">
                    <div
                      ref={progressFillRef}
                      className="h-full bg-emerald-400 rounded-full transition-all duration-75"
                      style={{ width: '30.4%' }}
                    />
                  </div>
                  <span ref={progressTextRef} className="font-mono text-xs sm:text-sm font-bold text-emerald-400 text-right shrink-0 min-w-[54px] sm:min-w-[70px]">
                    0.304
                  </span>
                </div>

                {/* 3. Scroll Velocity */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Activity className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">Velocity</span>
                  </div>
                  <div className="w-16 sm:w-28 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden shrink-0">
                    <div
                      ref={velocityFillRef}
                      className="h-full bg-violet-500 rounded-full transition-all duration-75"
                      style={{ width: '20%' }}
                    />
                  </div>
                  <span ref={velocityTextRef} className="font-mono text-xs sm:text-sm font-bold text-violet-300 text-right shrink-0 min-w-[54px] sm:min-w-[70px]">
                    0.080 px/f
                  </span>
                </div>

                {/* 4. Scroll Direction */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <ArrowUpDown className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">Direction</span>
                  </div>
                  <span ref={directionTextRef} className="font-medium text-xs sm:text-sm text-emerald-400 text-right">
                    Down
                  </span>
                </div>
              </div>

              {/* Progress Over Time Oscilloscope Graph */}
              <div className="mt-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                      Telemetry Stream
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                    <span>30 SAMPLES</span>
                    <span>•</span>
                    <span>WINDOW: 2.0s</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">VSYNC LOCKED</span>
                  </div>
                </div>

                <div className="relative w-full h-36 rounded-xl bg-[#06070a] border border-zinc-800/90 p-3 pt-6 pb-6 pr-10 pl-3 overflow-hidden shadow-inner">
                  {/* Floating live badge in top-left */}
                  <div className="absolute left-3 top-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-300 z-10 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span ref={graphValBadgeRef}>VAL: {INITIAL_HISTORY[INITIAL_HISTORY.length - 1].toFixed(3)}</span>
                  </div>

                  {/* Y-Axis scale marks on the right */}
                  <div className="absolute right-2.5 top-2 text-[9px] font-mono text-zinc-500 select-none">
                    1.00
                  </div>
                  <div className="absolute right-2.5 top-[35%] -translate-y-1/2 text-[9px] font-mono text-zinc-600 select-none">
                    0.75
                  </div>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-500 select-none">
                    0.50
                  </div>
                  <div className="absolute right-2.5 top-[65%] -translate-y-1/2 text-[9px] font-mono text-zinc-600 select-none">
                    0.25
                  </div>
                  <div className="absolute right-2.5 bottom-3.5 text-[9px] font-mono text-zinc-500 select-none">
                    0.00
                  </div>

                  {/* SVG Waveform Curve & Oscilloscope Grid */}
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 300 90"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="progress-wave-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#34d399" floodOpacity="0.6" />
                      </filter>
                    </defs>

                    {/* Horizontal Level Grid Lines */}
                    <line x1="0" y1="12" x2="300" y2="12" stroke="#27272a" strokeWidth="0.75" strokeDasharray="3 3" />
                    <line x1="0" y1="32" x2="300" y2="32" stroke="#27272a" strokeWidth="0.75" strokeDasharray="3 3" />
                    <line x1="0" y1="52" x2="300" y2="52" stroke="#27272a" strokeWidth="0.75" strokeDasharray="3 3" />
                    <line x1="0" y1="72" x2="300" y2="72" stroke="#27272a" strokeWidth="0.75" strokeDasharray="3 3" />

                    {/* Vertical Time Markers */}
                    <line x1="75" y1="0" x2="75" y2="90" stroke="#27272a" strokeWidth="0.75" strokeDasharray="3 3" />
                    <line x1="150" y1="0" x2="150" y2="90" stroke="#27272a" strokeWidth="0.75" strokeDasharray="3 3" />
                    <line x1="225" y1="0" x2="225" y2="90" stroke="#27272a" strokeWidth="0.75" strokeDasharray="3 3" />
                    <line x1="300" y1="0" x2="300" y2="90" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />

                    {/* Area Fill */}
                    <path ref={fillPathRef} d={INITIAL_PATHS.fillPath} fill="url(#progress-wave-grad)" />

                    {/* Oscilloscope Beam Line */}
                    <path
                      ref={strokePathRef}
                      d={INITIAL_PATHS.strokePath}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#wave-glow)"
                    />

                    {/* Live Leading Reticle / Scan Dot */}
                    <circle
                      ref={scanDotPingRef}
                      cx="300"
                      cy={INITIAL_PATHS.lastY}
                      r="5"
                      fill="#34d399"
                      fillOpacity="0.3"
                      className="animate-ping origin-center"
                    />
                    <circle
                      ref={scanDotRef}
                      cx="300"
                      cy={INITIAL_PATHS.lastY}
                      r="3.5"
                      fill="#34d399"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* X-Axis Time Marks */}
                  <div className="absolute left-3 right-10 bottom-1 flex justify-between text-[9px] font-mono text-zinc-600 select-none">
                    <span>-2.0s</span>
                    <span>-1.5s</span>
                    <span>-1.0s</span>
                    <span>-0.5s</span>
                    <span className="text-emerald-400 font-semibold">NOW</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Spec Strip */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80">
              <div>
                <div className="text-xs text-zinc-500">Update rate</div>
                <div ref={updateRateTextRef} className="font-mono text-sm font-bold text-white mt-1">60 Hz</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Last update</div>
                <div ref={lastUpdateTextRef} className="font-mono text-sm font-bold text-white mt-1">
                  16.7 ms ago
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Active hook</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-white mt-1 truncate">
                  {activeTab}()
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
