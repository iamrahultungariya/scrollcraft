'use client';

/**
 * ScrollCraft Section 3: Reactive Hooks / Raw Data
 * - Theme-compliant custom select toggle for hook selection
 * - Production-ready code viewer with React and Next.js targets (no TS clutter)
 * - Clean layout centered without unneeded live telemetry DOM overhead
 * - Strictly under 650 LOC.
 */

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Reveal } from '@scrollcraft/react';
import {
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Code2,
} from 'lucide-react';
import Link from 'next/link';

type HookTab =
  | 'useScrollProgress'
  | 'useParallax'
  | 'useReveal'
  | 'usePin'
  | 'useScrollDirection'
  | 'useScrollTimeline'
  | 'useScrollTransform';

type Framework = 'React' | 'Next.js';

interface HookDefinition {
  title: string;
  badge: string;
  desc: string;
  fileName: Record<Framework, string>;
  docLink: string;
  refLink: string;
  code: Record<Framework, string>;
}

const HOOK_DEFINITIONS: Record<HookTab, HookDefinition> = {
  useScrollProgress: {
    title: 'useScrollProgress()',
    badge: 'Continuous Observable',
    desc: 'Provides continuous scroll progress [0.0 to 1.0], subpixel frame velocity, and direction vector.',
    fileName: {
      React: 'ScrollProgressDemo.tsx',
      'Next.js': 'scroll-indicator.tsx',
    },
    docLink: '/docs#progress',
    refLink: '/docs#hooks',
    code: {
      React: `import { useScrollProgress } from '@scrollcraft/react';

export function ScrollProgressBar() {
  const { progress, velocity, direction } = useScrollProgress({
    smooth: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>Scroll Progress</span>
        <span>{(progress * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-[80ms]"
          style={{ width: \`\${progress * 100}%\` }}
        />
      </div>
      <div className="flex gap-4 text-xs font-mono text-zinc-500">
        <span>Velocity: {velocity.toFixed(2)} px/f</span>
        <span>Vector: {direction > 0 ? 'down' : 'up'}</span>
      </div>
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

  // Recalibrates scroll track on Next.js route transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-1 bg-zinc-900/50">
      <div
        className="h-full bg-violet-500 transition-[width] duration-[150ms] ease-out will-change-[width]"
        style={{ width: \`\${progress * 100}%\` }}
      />
    </header>
  );
}`,
    },
  },
  useParallax: {
    title: 'useParallax()',
    badge: 'Direct GPU Mutator',
    desc: 'Bypasses React virtual DOM diffing to mutate hardware transform styles on the compositor thread.',
    fileName: {
      React: 'ParallaxDemo.tsx',
      'Next.js': 'hero-parallax.tsx',
    },
    docLink: '/docs#parallax',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function ParallaxCard() {
  const targetRef = useRef<HTMLDivElement>(null);
  useParallax(targetRef, {
    speed: 0.35,
    direction: 'vertical',
    min: -80,
    max: 80,
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 p-8 border border-zinc-800">
      <div
        ref={targetRef}
        className="p-6 rounded-xl bg-violet-950/40 border border-violet-500/30 text-white"
      >
        <h4 className="text-sm font-bold">120 FPS Direct GPU Mutex</h4>
        <p className="text-xs text-zinc-400 mt-1">Zero React re-renders during active scroll</p>
      </div>
    </div>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useParallax } from '@scrollcraft/react';

export function NextParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null);
  useParallax(bgRef, { speed: -0.2, min: -100, max: 100 });

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 scale-110">
        <Image
          src="/images/mountains.jpg"
          alt="Atmospheric Parallax"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-5xl font-bold text-white">Composed in Motion</h1>
      </div>
    </section>
  );
}`,
    },
  },
  useReveal: {
    title: 'useReveal()',
    badge: 'Batched Observer',
    desc: 'Single shared IntersectionObserver handling viewport reveals, 3D tilt, and stagger sequencing.',
    fileName: {
      React: 'RevealDemo.tsx',
      'Next.js': 'reveal-grid.tsx',
    },
    docLink: '/docs#reveal',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function RevealCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { inView } = useReveal(cardRef, {
    direction: 'up',
    distance: 24,
    duration: 0.5,
    threshold: 0.15,
  });

  return (
    <div
      ref={cardRef}
      className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
    >
      <h3 className="text-lg font-bold text-white">Hardware Physics</h3>
      <p className="text-xs text-zinc-400 mt-2">
        Status: {inView ? 'Active in Viewport' : 'Awaiting Scroll'}
      </p>
    </div>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function NextFeatureGrid({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, idx) => {
        const itemRef = useRef<HTMLDivElement>(null);
        useReveal(itemRef, {
          direction: 'up',
          distance: 20,
          index: idx,
          stagger: 0.04,
        });

        return (
          <div
            key={item}
            ref={itemRef}
            className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800"
          >
            <h4 className="text-base font-semibold text-white">{item}</h4>
          </div>
        );
      })}
    </div>
  );
}`,
    },
  },
  usePin: {
    title: 'usePin()',
    badge: 'Layout Lock',
    desc: 'Sticky layout pinning that computes travel tracks without spacer jumps or layout thrashing.',
    fileName: {
      React: 'PinDemo.tsx',
      'Next.js': 'pinned-section.tsx',
    },
    docLink: '/docs#pin',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function PinPresentation() {
  const pinRef = useRef<HTMLDivElement>(null);
  const { isPinned, progress } = usePin(pinRef, {
    start: 'top top',
    end: '+=150%',
    pinSpacing: true,
  });

  return (
    <div ref={pinRef} className="h-screen w-full flex items-center justify-center bg-black">
      <div className="p-8 rounded-2xl border border-violet-500/30 bg-zinc-950">
        <h2 className="text-2xl font-bold text-white">
          {isPinned ? 'Locked in Viewport' : 'Free Flowing'}
        </h2>
        <p className="text-xs text-zinc-400 mt-2">
          Pin Travel Progress: {(progress * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function NextStoryBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
  usePin(containerRef, {
    start: 'top top',
    end: '+=200%',
  });

  return (
    <section ref={containerRef} className="relative min-h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <h2 className="text-4xl font-extrabold text-white">Zero Thrash Pinning</h2>
      </div>
    </section>
  );
}`,
    },
  },
  useScrollDirection: {
    title: 'useScrollDirection()',
    badge: 'Hysteresis Gated',
    desc: 'Hysteresis-gated scroll direction detection with iOS rubber-band guard and direct auto-hide support.',
    fileName: {
      React: 'ScrollDirectionDemo.tsx',
      'Next.js': 'auto-hide-nav.tsx',
    },
    docLink: '/docs#use-scroll-direction',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { useScrollDirection } from '@scrollcraft/react';

export function AutoHideNavbar() {
  const navRef = useRef<HTMLElement>(null);
  const { direction, isAtTop } = useScrollDirection(navRef, {
    thresholdDown: 15,
    thresholdUp: 25,
  });

  return (
    <nav
      ref={navRef}
      className="fixed top-0 inset-x-0 h-16 border-b border-zinc-800 bg-black/80 backdrop-blur-md px-6 flex items-center justify-between z-50 transition-transform duration-[250ms] [transition-timing-function:var(--ease-smooth-out)]"
    >
      <span className="font-bold text-white">ScrollCraft</span>
      <span className="text-xs font-mono text-zinc-400">
        {isAtTop ? 'AT BOUNDARY' : \`SCROLLING \${direction.toUpperCase()}\`}
      </span>
    </nav>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import { useScrollDirection } from '@scrollcraft/react';

export function NextSmartHeader() {
  const headerRef = useRef<HTMLElement>(null);
  useScrollDirection(headerRef, {
    thresholdDown: 20,
    thresholdUp: 10,
    hideTransform: 'translateY(-100%)',
  });

  return (
    <header
      ref={headerRef}
      className="fixed top-0 inset-x-0 z-40 transition-transform duration-[250ms] ease-out"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="font-mono text-xs text-white">Interactive Header</span>
      </div>
    </header>
  );
}`,
    },
  },
  useScrollTimeline: {
    title: 'useScrollTimeline()',
    badge: 'Keyframe Solver',
    desc: 'Interpolates multi-element, multi-property keyframes across normalized scroll progress in Ticker Phase 3.',
    fileName: {
      React: 'TimelineDemo.tsx',
      'Next.js': 'scroll-timeline.tsx',
    },
    docLink: '/docs#use-scroll-timeline',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { useScrollTimeline } from '@scrollcraft/react';

export function KeyframeChoreographer() {
  const boxRef = useRef<HTMLDivElement>(null);
  useScrollTimeline(boxRef, [
    { progress: 0.0, transform: { scale: 1, rotate: 0 }, opacity: 1 },
    { progress: 0.5, transform: { scale: 1.15, rotate: 45 }, opacity: 0.8 },
    { progress: 1.0, transform: { scale: 0.9, rotate: 90 }, opacity: 0.2 },
  ]);

  return (
    <div className="h-[200vh] relative pt-20">
      <div ref={boxRef} className="w-32 h-32 rounded-2xl bg-violet-600 sticky top-40 mx-auto" />
    </div>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import { useScrollTimeline } from '@scrollcraft/react';

export function NextChoreographedStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  useScrollTimeline(stageRef, {
    keyframes: [
      { progress: 0.0, transform: { y: 0 }, opacity: 1 },
      { progress: 1.0, transform: { y: -120 }, opacity: 0 },
    ],
  });

  return (
    <div ref={stageRef} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
      <h3 className="text-xl font-bold text-white">Choreographed Entrance</h3>
    </div>
  );
}`,
    },
  },
  useScrollTransform: {
    title: 'useScrollTransform()',
    badge: 'Transform Mapping',
    desc: 'Maps scroll progress to arbitrary CSS properties and physics presets with subpixel interpolation.',
    fileName: {
      React: 'TransformDemo.tsx',
      'Next.js': 'scroll-transform.tsx',
    },
    docLink: '/docs#use-scroll-transform',
    refLink: '/docs#hooks',
    code: {
      React: `import { useRef } from 'react';
import { useScrollTransform } from '@scrollcraft/react';

export function TransformPreview() {
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollTransform(cardRef, {
    preset: 'zoom-in',
    scrub: 0.5,
  });

  return (
    <div className="h-[180vh] pt-32">
      <div
        ref={cardRef}
        className="max-w-md mx-auto p-8 rounded-3xl bg-zinc-900 border border-zinc-800 sticky top-32"
      >
        <h4 className="text-xl font-bold text-white">Scrubbed Physics</h4>
        <p className="text-xs text-zinc-400 mt-2">Smoothly scales up as you traverse viewport</p>
      </div>
    </div>
  );
}`,
      'Next.js': `'use client';

import { useRef } from 'react';
import { useScrollTransform } from '@scrollcraft/react';

export function NextScrollZoom() {
  const zoomRef = useRef<HTMLDivElement>(null);
  useScrollTransform(zoomRef, {
    properties: {
      scale: [0.85, 1],
      opacity: [0.2, 1],
    },
  });

  return (
    <div ref={zoomRef} className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-zinc-900">
      <h3 className="text-2xl font-bold text-white">Precision Transform</h3>
    </div>
  );
}`,
    },
  },
};

/**
 * Tokenizer for syntax highlighted lines
 */
function renderSyntaxLine(line: string, lineIndex: number): React.ReactNode {
  if (!line.trim()) {
    return <span key={lineIndex}>&nbsp;</span>;
  }

  if (line.trim().startsWith('//')) {
    return (
      <span key={lineIndex} className="text-zinc-500 italic">
        {line}
      </span>
    );
  }

  const tokenRegex =
    /(\/\*[\s\S]*?\*\/|\/\/.*$)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')|(\b(?:import|export|from|function|const|return|default)\b)|(<\/?(?:div|header|nav|span|p|h1|h2|h3|h4|section|Image)|(?:\/>|>))|(\b(?:ref|className|style|src|alt|fill|priority|width)\b)|(\b(?:useRef|useEffect|usePathname|useScrollProgress|useParallax|useReveal|usePin|useScrollDirection|useScrollTimeline|useScrollTransform)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=.:\$\*\/])/g;

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

    const [full, comment, str, keyword, tag, prop, identifier, num, punct] = match;

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
        <span key={`kw-${match.index}`} className="text-violet-400 font-semibold">
          {keyword}
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
        <span key={`prop-${match.index}`} className="text-purple-300">
          {prop}
        </span>
      );
    } else if (identifier) {
      nodes.push(
        <span key={`id-${match.index}`} className="text-sky-300">
          {identifier}
        </span>
      );
    } else if (num) {
      nodes.push(
        <span key={`num-${match.index}`} className="text-amber-300">
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
      <span key={`text-end`} className="text-zinc-200">
        {line.slice(lastIndex)}
      </span>
    );
  }

  return nodes;
}

export function HooksRawSection() {
  const [activeTab, setActiveTab] = useState<HookTab>('useScrollProgress');
  const [activeFramework, setActiveFramework] = useState<Framework>('React');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentHook = HOOK_DEFINITIONS[activeTab];
  const currentCode = currentHook.code[activeFramework];
  const currentFileName = currentHook.fileName[activeFramework];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const hookKeys = Object.keys(HOOK_DEFINITIONS) as HookTab[];

  return (
    <section
      id="hooks"
      className="relative w-full bg-[#050507] py-16 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header (Beta box removed) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <Reveal direction="down" distance={15}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-violet-400">
                Reactive Hooks
              </span>
              <span className="text-xs font-mono text-zinc-600">/</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-violet-400">
                Raw Telemetry
              </span>
            </div>
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] mb-3 sm:mb-4 break-words">
              <span className="text-white block font-extrabold">Prefer to build your own?</span>
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent block font-extrabold mt-1">
                Here&apos;s the data.
              </span>
            </h2>
          </Reveal>

          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Headless hooks exposing high-precision scroll telemetry, mutable ref values, and 3-phase microtask lifecycle events.
            </p>
          </Reveal>
        </div>

        {/* Hook Select Toggle (Theme-compliant obsidian/glass dropdown) */}
        <div className="w-full flex items-center justify-center mb-8 relative z-30" ref={dropdownRef}>
          <div className="relative w-full max-w-md">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#0a0b0e] border border-white/[0.08] hover:border-violet-500/40 text-white font-mono text-sm shadow-xl transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                <span className="font-semibold text-white tracking-tight">{currentHook.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 hidden sm:inline">
                  {currentHook.badge}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-transform duration-[250ms] [transition-timing-function:var(--ease-in-out)] ${
                  isDropdownOpen ? 'rotate-180 text-violet-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-[#09090d]/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl z-50 animate-in fade-in zoom-in-[0.97] duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] space-y-1">
                {hookKeys.map((key) => {
                  const item = HOOK_DEFINITIONS[key];
                  const isSelected = activeTab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActiveTab(key);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-mono transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 font-semibold'
                          : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{item.title}</span>
                        <span className="text-[11px] text-zinc-500 font-sans mt-0.5 line-clamp-1">{item.desc}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-violet-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Centralized Code Viewer (Full Width Clean Layout, Telemetry Removed) */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-[#0a0b0e] shadow-2xl overflow-hidden flex flex-col justify-between">
          {/* Top Subheader */}
          <div className="p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0 shadow-inner">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-mono font-bold text-white tracking-tight">
                    {currentHook.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    {currentHook.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-xl">
                  {currentHook.desc}
                </p>
              </div>
            </div>

            {/* Documentation Links */}
            <div className="flex items-center gap-3 shrink-0 sm:self-start pt-1 font-mono text-xs">
              <Link
                href={currentHook.docLink}
                className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </Link>
              <Link
                href={currentHook.refLink}
                className="text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30"
              >
                <span>Reference</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Framework Selector & Filename Bar (Only React and Next.js, no TS) */}
          <div className="px-5 py-2.5 bg-[#07080a] border-b border-white/[0.06] flex items-center justify-between gap-3">
            {/* Framework Switcher (React vs Next.js) */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0e1015] border border-white/[0.06]">
              {(['React', 'Next.js'] as const).map((fw) => (
                <button
                  key={fw}
                  type="button"
                  onClick={() => setActiveFramework(fw)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-[150ms] cursor-pointer ${
                    activeFramework === fw
                      ? 'bg-violet-600 text-white font-semibold shadow-xs'
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-[150ms] cursor-pointer active:scale-95 ${
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

          {/* Syntax Highlighted Code Block */}
          <div className="p-4 sm:p-6 bg-[#060608] overflow-y-auto overflow-x-hidden flex-1 font-mono text-[12.5px] leading-relaxed select-text max-h-[460px]">
            <table className="w-full border-collapse table-fixed">
              <tbody>
                {codeLines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="pr-4 text-right text-zinc-600 select-none w-8 align-top text-xs shrink-0">
                      {idx + 1}
                    </td>
                    <td className="whitespace-pre-wrap break-words text-zinc-200 overflow-hidden font-mono-code">
                      {renderSyntaxLine(line, idx)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Status Bar */}
          <div className="px-5 py-2.5 bg-[#0a0b0e] border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Production-Ready TSX</span>
            </span>
            <div className="flex items-center gap-3">
              <span>{activeFramework} Framework Target</span>
              <Code2 className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
