'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { Copy, Check, ExternalLink, Code2 } from 'lucide-react';

type HookKey = 'useScrollProgress' | 'useParallax' | 'useReveal' | 'usePin';
type Framework = 'Next.js' | 'React';

interface HookDoc {
  name: string;
  badge: string;
  desc: string;
  signature: string;
  returns: string;
  code: Record<Framework, string>;
}

const HOOKS: Record<HookKey, HookDoc> = {
  useScrollProgress: {
    name: 'useScrollProgress()',
    badge: 'CONTINUOUS OBSERVABLE',
    desc: 'Provides continuous scroll progress [0.0 to 1.0], instantaneous subpixel velocity, and scroll direction vector.',
    signature: 'useScrollProgress(options?: { smooth?: boolean; dampening?: number }): ScrollProgressState',
    returns: '{ progress: number; velocity: number; direction: 1 | -1 | 0 }',
    code: {
      'Next.js': `'use client';

import { useScrollProgress } from '@scrollcraft/react';

export function ScrollProgressBar() {
  const { progress, velocity } = useScrollProgress({ smooth: true });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[#121214] z-50">
      <div
        className="h-full bg-[#3b82f6] origin-left"
        style={{ transform: \`scaleX(\${progress})\` }}
      />
    </div>
  );
}`,
      React: `import { useScrollProgress } from '@scrollcraft/react';

export function Indicator() {
  const { progress, velocity, direction } = useScrollProgress();

  return (
    <div className="font-mono text-xs">
      <span>Progress: {(progress * 100).toFixed(0)}%</span>
      <span>Velocity: {velocity.toFixed(2)} px/ms</span>
      <span>Direction: {direction > 0 ? 'DOWN' : 'UP'}</span>
    </div>
  );
}`,
    },
  },
  useParallax: {
    name: 'useParallax()',
    badge: 'HARDWARE TRANSFORM',
    desc: 'Computes velocity-aware hardware matrix transforms and binds directly to DOM element styles bypassing React reconciliation.',
    signature: 'useParallax(ref: RefObject<HTMLElement>, options: ParallaxOptions): void',
    returns: 'void (Mutates DOM style directly via GPU layer)',
    code: {
      'Next.js': `'use client';

import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function FloatingHeroLayer() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Directly mutates translate3d on hardware GPU layer
  useParallax(targetRef, {
    speed: 0.25,
    direction: 'vertical',
  });

  return (
    <div ref={targetRef} className="floating-card">
      <h3>Multi-Plane Depth</h3>
    </div>
  );
}`,
      React: `import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function ParallaxStack() {
  const layer1 = useRef(null);
  const layer2 = useRef(null);

  useParallax(layer1, { speed: -0.15 });
  useParallax(layer2, { speed: 0.3 });

  return (
    <div className="stack-container">
      <div ref={layer1} className="background-layer" />
      <div ref={layer2} className="foreground-layer" />
    </div>
  );
}`,
    },
  },
  useReveal: {
    name: 'useReveal()',
    badge: 'SSR-SAFE ENTRANCES',
    desc: 'Coordinates IntersectionObserver pools for zero-FOUC entrance animations with atmospheric blur and automatic stagger sequencing.',
    signature: 'useReveal(ref: RefObject<HTMLElement>, options?: RevealOptions): void',
    returns: 'void (Observer pool manages active transitions)',
    code: {
      'Next.js': `'use client';

import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function SectionTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useReveal(titleRef, {
    distance: 24,
    duration: 0.6,
    blur: 8,
  });

  return (
    <h2 ref={titleRef} className="text-4xl font-bold">
      Zero-FOUC Typography Entrance
    </h2>
  );
}`,
      React: `import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function StaggeredDeck() {
  const cardRef = useRef(null);
  useReveal(cardRef, { stagger: 0.08, scale: 0.96 });

  return <div ref={cardRef} className="deck-card" />;
}`,
    },
  },
  usePin: {
    name: 'usePin()',
    badge: 'STICKY CONTAINMENT',
    desc: 'Smart layout containment engine that prefers native position: sticky with transform fallbacks and automatic ghost spacer teardown.',
    signature: 'usePin(ref: RefObject<HTMLElement>, options?: PinOptions): PinHandle',
    returns: '{ unpin: () => void; isPinned: boolean }',
    code: {
      'Next.js': `'use client';

import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function StickySidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);

  usePin(sidebarRef, {
    top: 80,
    pinSpacing: 500,
    disableTransform: true, // Prevents clipping ancestor traps
  });

  return (
    <aside ref={sidebarRef} className="pinned-nav">
      <TableOfContents />
    </aside>
  );
}`,
      React: `import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function PinnedShowcase() {
  const target = useRef(null);
  usePin(target, { top: 96, pinSpacing: 400 });

  return <div ref={target} className="pinned-stage" />;
}`,
    },
  },
};

function highlightCode(code: string): React.ReactNode {
  return code.split('\n').map((line, idx) => {
    const tokenRegex =
      /(".*?"|'.*?'|`.*?`)|(<\/?(?:[A-Z][a-zA-Z0-9]*|[a-z]+)|(?:\/>|>))|(\b(?:import|export|from|function|const|return|default)\b)|(\b(?:speed|direction|duration|blur|distance|top|pinSpacing|disableTransform|smooth|scale|stagger)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=.:\/<>])/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`txt-${lastIndex}`} className="text-[#a1a1aa]">
            {line.slice(lastIndex, match.index)}
          </span>
        );
      }
      const [full, str, tag, kw, prop, num, punct] = match;
      if (str) {
        parts.push(<span key={`str-${match.index}`} className="text-[#10b981]">{str}</span>);
      } else if (tag) {
        parts.push(<span key={`tag-${match.index}`} className="text-[#93c5fd] font-semibold">{tag}</span>);
      } else if (kw) {
        parts.push(<span key={`kw-${match.index}`} className="text-[#3b82f6] font-semibold">{kw}</span>);
      } else if (prop) {
        parts.push(<span key={`prop-${match.index}`} className="text-[#c4b5fd]">{prop}</span>);
      } else if (num) {
        parts.push(<span key={`num-${match.index}`} className="text-[#f59e0b]">{num}</span>);
      } else if (punct) {
        parts.push(<span key={`punct-${match.index}`} className="text-[#52525b]">{punct}</span>);
      } else {
        parts.push(<span key={`other-${match.index}`} className="text-[#fafafa]">{full}</span>);
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(<span key={`end-${idx}`} className="text-[#a1a1aa]">{line.slice(lastIndex)}</span>);
    }

    return (
      <div key={idx} className="flex leading-relaxed font-mono text-[12px] px-1 py-[1px]">
        <span className="w-6 shrink-0 text-right pr-3 select-none text-[#3f3f46] text-[11px]">
          {idx + 1}
        </span>
        <span className="whitespace-pre text-[#fafafa]">
          {parts.length > 0 ? parts : <span>&nbsp;</span>}
        </span>
      </div>
    );
  });
}

export function HooksDeveloperSection() {
  const [activeHook, setActiveHook] = useState<HookKey>('useScrollProgress');
  const [activeFramework, setActiveFramework] = useState<Framework>('Next.js');
  const [copied, setCopied] = useState(false);

  const current = HOOKS[activeHook];
  const currentCode = current.code[activeFramework];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full border-b border-[#1c1c1f] bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <Reveal duration={0.45}>
          <div className="py-14 border-b border-[#1c1c1f] flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.2em]">
                  Headless Reactive Hooks
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-[-0.03em] font-sans">
                Prefer headless code?<br />Direct reactive primitives.
              </h2>
            </div>
            <p className="text-sm text-[#a1a1aa] max-w-sm leading-[1.75] font-sans md:text-right">
              Composable reactive hooks exposing sub-frame scroll telemetry, mutable ref binds, and 4-phase microtask lifecycle events.
            </p>
          </div>
        </Reveal>

        <div className="py-10">
          {/* Hook selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#27272a] rounded-lg overflow-hidden mb-6">
            {(Object.keys(HOOKS) as HookKey[]).map((key) => {
              const h = HOOKS[key];
              const isSelected = activeHook === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveHook(key)}
                  className={`p-4 text-left font-mono transition-colors cursor-pointer border-r last:border-r-0 border-b sm:border-b-0 border-[#27272a] ${
                    isSelected
                      ? 'bg-[#18181b] text-white'
                      : 'bg-[#121214] text-[#71717a] hover:text-[#a1a1aa] hover:bg-[#151518]'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">{h.name}</div>
                  <div className="text-[10px] text-[#71717a] uppercase truncate">{h.badge}</div>
                </button>
              );
            })}
          </div>

          {/* Code studio */}
          <div className="border border-[#27272a] rounded-lg overflow-hidden bg-[#121214]">
            {/* Studio header */}
            <div className="px-5 py-4 border-b border-[#1c1c1f] bg-[#0d0d0f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-[#3b82f6]">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#fafafa] font-mono mb-0.5">{current.name}</div>
                  <div className="text-xs text-[#a1a1aa]">{current.desc}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Framework switcher */}
                <div className="flex items-center gap-0.5 bg-[#18181b] border border-[#27272a] rounded p-0.5">
                  {(['Next.js', 'React'] as const).map((fw) => (
                    <button
                      key={fw}
                      onClick={() => setActiveFramework(fw)}
                      className={`px-3 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                        activeFramework === fw
                          ? 'bg-[#27272a] text-white font-medium'
                          : 'text-[#71717a] hover:text-[#a1a1aa]'
                      }`}
                    >
                      {fw}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#27272a] hover:border-[#3f3f46] rounded text-xs font-mono text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#3b82f6]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Code body */}
            <div className="p-5 bg-[#09090b] overflow-y-auto max-h-[380px] select-text">
              {highlightCode(currentCode)}
            </div>

            {/* API Contract & Return Signature Bar */}
            <div className="px-5 py-3 border-t border-[#1c1c1f] bg-[#0d0d0f] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#71717a] gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[#3b82f6] font-semibold">RETURN:</span>
                <code className="text-[#a1a1aa] text-[11px]">{current.returns}</code>
              </div>
              <Link
                href="/docs#hooks"
                className="inline-flex items-center gap-1.5 text-[#71717a] hover:text-[#fafafa] transition-colors shrink-0"
              >
                <span>Full Hook Specification</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
