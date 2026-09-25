'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Parallax, Reveal, VelocityMarquee } from '@scrollcraft/react';
import { ArrowUpRight, Copy, Check, Layers, Eye, PinIcon, Repeat } from 'lucide-react';

interface PrimitiveCard {
  id: string;
  name: string;
  index: string;
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
    index: '01',
    icon: <Layers className="w-4 h-4 text-[#3b82f6]" />,
    description: 'Multi-layer depth container with real velocity responsiveness. Direct hardware transform writes with zero layout thrashing.',
    specs: ['Numeric transform matrix', 'Hardware GPU composite', 'WeakMap coordinate cache'],
    snippet: `<Parallax speed={0.3} direction="vertical">
  <div className="depth-container">
    <Layer />
  </div>
</Parallax>`,
    testSlug: 'parallax',
  },
  {
    id: 'reveal',
    name: '<Reveal />',
    index: '02',
    icon: <Eye className="w-4 h-4 text-[#3b82f6]" />,
    description: 'Zero-FOUC element and typography entrances. Resilient hydration lifecycle with native no-JS fallback support.',
    specs: ['IntersectionObserver pool', 'Atmospheric blur & 3D tilt', 'Automatic stagger sequencing'],
    snippet: `<Reveal direction="up" duration={0.6} blur={8} scale={0.94}>
  <h2>Production Grade Animations</h2>
</Reveal>`,
    testSlug: 'reveal',
  },
  {
    id: 'pin',
    name: '<Pin />',
    index: '03',
    icon: <PinIcon className="w-4 h-4 text-[#3b82f6]" />,
    description: 'Smart pinning primitive. Prefers native position: sticky with transform fallbacks and containing-block safety.',
    specs: ['Native sticky preference', 'Spacer cleanup on route change', 'Stacking context safe'],
    snippet: `<Pin top={80} pinSpacing={400}>
  <div className="sticky-sidebar">
    <NavigationIndex />
  </div>
</Pin>`,
    testSlug: 'pin',
  },
  {
    id: 'velocity-marquee',
    name: '<VelocityMarquee />',
    index: '04',
    icon: <Repeat className="w-4 h-4 text-[#3b82f6]" />,
    description: 'Infinite ticker that speeds up with user scroll momentum and settles seamlessly into idle baseline speed.',
    specs: ['Velocity-coupled acceleration', 'Subpixel modulo wrapping', 'Idle state sleep mode'],
    snippet: `<VelocityMarquee baseSpeed={1} velocityMultiplier={2.2}>
  <span>ZERO VDOM • 120 FPS • REACT 19</span>
</VelocityMarquee>`,
    testSlug: 'velocity-marquee',
  },
];

function renderSyntaxSnippet(snippet: string): React.ReactNode {
  const lines = snippet.split('\n');
  return lines.map((line, lineIdx) => {
    const tokenRegex =
      /(".*?"|'.*?')|(<\/?(?:Parallax|Reveal|Pin|VelocityMarquee|Layer|NavigationIndex|div|h2|span)|(?:\/>|>))|([a-zA-Z-]+(?==))|(\b\d+(?:\.\d+)?\b)|([{}(),;=.:\/<>])/g;

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
      const [full, str, tag, prop, num, punct] = match;
      if (str) {
        parts.push(<span key={`str-${match.index}`} className="text-[#6ee7b7] font-medium">{str}</span>);
      } else if (tag) {
        parts.push(<span key={`tag-${match.index}`} className="text-[#93c5fd] font-semibold">{tag}</span>);
      } else if (prop) {
        parts.push(<span key={`prop-${match.index}`} className="text-[#c4b5fd]">{prop}</span>);
      } else if (num) {
        parts.push(<span key={`num-${match.index}`} className="text-[#fcd34d]">{num}</span>);
      } else if (punct) {
        parts.push(<span key={`punct-${match.index}`} className="text-[#52525b]">{punct}</span>);
      } else {
        parts.push(<span key={`other-${match.index}`} className="text-[#e4e4e7]">{full}</span>);
      }
      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(<span key={`end-${lineIdx}`} className="text-[#a1a1aa]">{line.slice(lastIndex)}</span>);
    }

    return (
      <div key={lineIdx} className="flex leading-relaxed font-mono text-[12px] px-1 py-[1px]">
        <span className="w-5 shrink-0 text-right pr-3 select-none text-[#3f3f46] text-[11px]">
          {lineIdx + 1}
        </span>
        <span className="whitespace-pre text-[#e4e4e7]">
          {parts.length > 0 ? parts : <span>&nbsp;</span>}
        </span>
      </div>
    );
  });
}

export function PrimitivesShowcase() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, 'preview' | 'code'>>({
    parallax: 'preview',
    reveal: 'preview',
    pin: 'preview',
    'velocity-marquee': 'preview',
  });

  const copyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleTab = (id: string, tab: 'preview' | 'code') => {
    setActiveTab((prev) => ({ ...prev, [id]: tab }));
  };

  return (
    <section className="relative w-full border-b border-[#1c1c1e] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <Reveal duration={0.45}>
          <div className="py-14 border-b border-[#1c1c1e] flex flex-col md:flex-row md:items-end gap-6 md:gap-0 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span className="text-[11px] font-mono text-[#52525b] uppercase tracking-[0.18em]">
                  Primitive Suite
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.025em] font-sans">
                Declarative wrappers.<br />Zero overhead.
              </h2>
            </div>
            <p className="text-sm text-[#71717a] max-w-sm leading-[1.75] font-sans md:text-right">
              High-level React primitives configured via props. Direct DOM manipulation inside the render phase without React state triggers.
            </p>
          </div>
        </Reveal>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1c1c1e] border-b border-[#1c1c1e]">
          {PRIMITIVES.map((item, idx) => (
            <Reveal key={item.id} duration={0.5} delay={idx * 0.07}>
              <div className="p-8 flex flex-col h-full border-b border-[#1c1c1e] last:border-b-0 md:last:border-b md:[&:nth-child(2)]:border-b md:[&:nth-child(4)]:border-b-0 md:[&:nth-child(3)]:border-b-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-[#111113] border border-[#1c1c1e]">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#52525b] uppercase tracking-[0.18em] mb-0.5">
                        {item.index}
                      </div>
                      <h3 className="text-sm font-semibold text-white font-mono">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  <Link
                    href={`/test/${item.testSlug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#52525b] hover:text-white transition-colors"
                  >
                    Test Lab
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                <p className="text-sm text-[#71717a] mb-4 leading-[1.7] font-sans">
                  {item.description}
                </p>

                {/* Specs */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.specs.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 text-[11px] font-mono text-[#71717a] bg-[#111113] border border-[#1c1c1e] rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Tab selector */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 bg-[#111113] border border-[#1c1c1e] rounded p-0.5">
                      {(['preview', 'code'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => toggleTab(item.id, tab)}
                          className={`px-3 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                            activeTab[item.id] === tab
                              ? 'bg-[#1c1c1e] text-white'
                              : 'text-[#52525b] hover:text-[#a1a1aa]'
                          }`}
                        >
                          {tab === 'preview' ? 'Preview' : 'Code'}
                        </button>
                      ))}
                    </div>
                    {activeTab[item.id] === 'code' && (
                      <button
                        onClick={() => copyCode(item.id, item.snippet)}
                        className="p-1.5 rounded text-[#52525b] hover:text-white hover:bg-[#1c1c1e] transition-colors cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-[#3b82f6]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Preview / Code body */}
                  {activeTab[item.id] === 'preview' ? (
                    <div className="h-36 rounded-lg bg-[#0d0d0f] border border-[#1c1c1e] p-3 overflow-hidden flex items-center justify-center">
                      {item.id === 'parallax' && (
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                          <Parallax speed={-0.12} className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                          </Parallax>
                          <Parallax speed={0.2} className="relative z-10">
                            <div className="px-3.5 py-2 rounded-md bg-[#111113] border border-[#2a2a2e] text-xs font-mono text-[#e4e4e7] flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                              Parallax Layer 0.2×
                            </div>
                          </Parallax>
                        </div>
                      )}
                      {item.id === 'reveal' && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Reveal duration={0.6} blur={6} scale={0.95}>
                            <div className="px-4 py-3 rounded-lg bg-[#111113] border border-[#2a2a2e] text-center space-y-1.5">
                              <div className="text-xs font-mono text-[#93c5fd] font-semibold">120 FPS GPU Entrance</div>
                              <div className="text-[10px] font-mono text-[#52525b]">SSR SAFE · ZERO FOUC · 3D TILT</div>
                            </div>
                          </Reveal>
                        </div>
                      )}
                      {item.id === 'pin' && (
                        <div className="w-full h-full p-3 flex flex-col justify-between bg-[#0d0d0f] rounded-lg font-mono text-xs border border-[#1c1c1e]">
                          <div className="px-3 py-1.5 rounded-md bg-[#111113] border border-[#2a2a2e] text-[#93c5fd] flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                              STICKY POSITION: PINNED
                            </span>
                            <span className="text-[10px] text-[#52525b]">top: 80px</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#52525b] pt-2 border-t border-[#1c1c1e]">
                            <span>Scroll Offset Delta</span>
                            <span className="text-[#a1a1aa]">Preserves Stacking Context</span>
                          </div>
                        </div>
                      )}
                      {item.id === 'velocity-marquee' && (
                        <div className="w-full h-full flex items-center overflow-hidden">
                          <VelocityMarquee baseSpeed={0.8} velocityMultiplier={2} className="font-mono text-xs text-[#71717a] uppercase tracking-wider">
                            <span className="mx-2.5 px-2.5 py-1 rounded bg-[#111113] border border-[#1c1c1e] text-[#e4e4e7]">SCROLL SENSITIVE</span>
                            <span className="mx-2.5 px-2.5 py-1 rounded bg-[#111113] border border-[#2a2a2e] text-[#93c5fd]">120 FPS MODULO</span>
                            <span className="mx-2.5 px-2.5 py-1 rounded bg-[#111113] border border-[#1c1c1e] text-[#e4e4e7]">ZERO VDOM DIFF</span>
                          </VelocityMarquee>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-36 rounded-lg bg-[#0d0d0f] border border-[#1c1c1e] p-3 overflow-y-auto select-text">
                      {renderSyntaxSnippet(item.snippet)}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
