'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Parallax, Reveal, VelocityMarquee } from '@scrollcraft/react';
import { ArrowUpRight, Copy, Check, Layers, Eye, PinIcon, Repeat, Code2, Play } from 'lucide-react';

interface PrimitiveSpec {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  specs: string[];
  snippet: string;
  testSlug: string;
}

const PRIMITIVES: PrimitiveSpec[] = [
  {
    id: 'parallax',
    name: '<Parallax />',
    category: 'HARDWARE TRANSFORM DEPTH',
    icon: <Layers className="w-4 h-4 text-[#3b82f6]" />,
    description:
      'Multi-layer depth container with real velocity responsiveness. Writes numeric translate3d matrices directly to GPU layers with zero layout thrashing.',
    specs: ['Numeric 3D transform matrix', 'Hardware composite layer lock', 'WeakMap coordinate cache'],
    snippet: `import { Parallax } from '@scrollcraft/react';

export function DepthSection() {
  return (
    <div className="relative h-96 overflow-hidden">
      {/* Background layer moves at -0.15x speed */}
      <Parallax speed={-0.15} className="absolute inset-0">
        <div className="grid-pattern opacity-20" />
      </Parallax>

      {/* Foreground card moves at +0.25x speed */}
      <Parallax speed={0.25} className="relative z-10 m-auto">
        <div className="card">Hardware Accelerated Depth</div>
      </Parallax>
    </div>
  );
}`,
    testSlug: 'parallax',
  },
  {
    id: 'reveal',
    name: '<Reveal />',
    category: 'SSR-SAFE VIEWPORT ENTRANCE',
    icon: <Eye className="w-4 h-4 text-[#3b82f6]" />,
    description:
      'Zero-FOUC element and typography entrances. Preserves server-rendered HTML during hydration with native no-JS CSS fallbacks.',
    specs: ['IntersectionObserver pooling', 'Atmospheric optical blur & 3D tilt', 'Automatic stagger sequencing'],
    snippet: `import { Reveal } from '@scrollcraft/react';

export function Features() {
  return (
    <Reveal direction="up" distance={32} duration={0.6} blur={6} scale={0.96}>
      <div className="feature-card">
        <h3>120 FPS Viewport Entrance</h3>
        <p>SSR-safe hydration with zero FOUC.</p>
      </div>
    </Reveal>
  );
}`,
    testSlug: 'reveal',
  },
  {
    id: 'pin',
    name: '<Pin />',
    category: 'STICKY LAYOUT CONTAINMENT',
    icon: <PinIcon className="w-4 h-4 text-[#3b82f6]" />,
    description:
      'Smart pinning container. Prefers native position: sticky with transform fallbacks and containing-block safety.',
    specs: ['Native sticky preference', 'Automatic ghost spacer teardown', 'Stacking context safe'],
    snippet: `import { Pin } from '@scrollcraft/react';

export function PinnedLayout() {
  return (
    <div className="grid grid-cols-12">
      <Pin top={80} pinSpacing={500} className="col-span-4">
        <aside className="sticky-sidebar">Pinned Navigation Index</aside>
      </Pin>
      <main className="col-span-8">Scrollable Content Stream</main>
    </div>
  );
}`,
    testSlug: 'pin',
  },
  {
    id: 'velocity-marquee',
    name: '<VelocityMarquee />',
    category: 'MOMENTUM ACCELERATION TICKER',
    icon: <Repeat className="w-4 h-4 text-[#3b82f6]" />,
    description:
      'Infinite marquee ticker that dynamically accelerates with user scroll momentum and settles seamlessly into idle baseline speed.',
    specs: ['Velocity-coupled acceleration', 'Subpixel modulo wrapping', 'Automatic idle sleep mode'],
    snippet: `import { VelocityMarquee } from '@scrollcraft/react';

export function MomentumTicker() {
  return (
    <VelocityMarquee baseSpeed={0.8} velocityMultiplier={2.5}>
      <span>ZERO VDOM • 120 FPS • NEXT.JS 15 APP ROUTER • WEAKMAP CACHING • </span>
    </VelocityMarquee>
  );
}`,
    testSlug: 'velocity-marquee',
  },
];

function highlightCode(code: string): React.ReactNode {
  return code.split('\n').map((line, idx) => {
    const tokenRegex =
      /(".*?"|'.*?'|`.*?`)|(<\/?(?:[A-Z][a-zA-Z0-9]*|[a-z]+)|(?:\/>|>))|(\b(?:import|export|from|function|const|return|default)\b)|(\b(?:speed|direction|duration|blur|distance|top|pinSpacing|disableTransform|smooth|scale|stagger|baseSpeed|velocityMultiplier|className)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=.:\/<>])/g;

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

export function PrimitivesShowcase() {
  const [selectedId, setSelectedId] = useState<string>('parallax');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const selected = PRIMITIVES.find((p) => p.id === selectedId) ?? PRIMITIVES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selected.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full border-b border-[#1c1c1f] bg-[#09090b] py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 border-b border-[#1c1c1f] mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.2em]">
                Declarative Primitives // Studio Suite
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-[-0.03em] font-sans">
              Declarative wrappers.<br />Engineered for zero overhead.
            </h2>
          </div>
          <p className="text-sm text-[#a1a1aa] max-w-sm leading-[1.75] font-sans md:text-right">
            Configure complex motion behaviors entirely through React props. Direct DOM manipulation executes in the render phase without React state triggers.
          </p>
        </div>

        {/* Studio Workspace: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Primitive Selector Deck (4 Cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            {PRIMITIVES.map((item, idx) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full p-5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#18181b] border-[#3b82f6] shadow-sm'
                      : 'bg-[#121214] border-[#27272a] hover:border-[#3f3f46] hover:bg-[#151518]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-[#101012] border border-[#27272a]">
                        {item.icon}
                      </div>
                      <span className="text-sm font-bold text-[#fafafa] font-mono">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#71717a]">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-wider mb-2">
                    {item.category}
                  </div>

                  <p className="text-xs text-[#a1a1aa] leading-[1.7] font-sans">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Stage & Code Studio (8 Cols) */}
          <div className="lg:col-span-8 rounded-xl border border-[#27272a] bg-[#121214] overflow-hidden shadow-2xl">
            
            {/* Studio Navigation Bar */}
            <div className="px-5 py-4 border-b border-[#1c1c1f] bg-[#0d0d0f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#fafafa] font-mono">
                    {selected.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
                    PROPS CONFIGURED
                  </span>
                </div>
                <div className="text-xs text-[#a1a1aa] mt-1">
                  {selected.description}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-[#18181b] border border-[#27272a] rounded p-0.5">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                      activeTab === 'preview'
                        ? 'bg-[#27272a] text-[#fafafa] font-medium'
                        : 'text-[#71717a] hover:text-[#a1a1aa]'
                    }`}
                  >
                    <Play className="w-3 h-3 text-[#3b82f6]" />
                    Live Motion
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                      activeTab === 'code'
                        ? 'bg-[#27272a] text-[#fafafa] font-medium'
                        : 'text-[#71717a] hover:text-[#a1a1aa]'
                    }`}
                  >
                    <Code2 className="w-3 h-3 text-[#3b82f6]" />
                    TSX Code
                  </button>
                </div>

                {activeTab === 'code' && (
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded border border-[#27272a] hover:border-[#3f3f46] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
                    title="Copy snippet"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#3b82f6]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Studio Canvas Area */}
            {activeTab === 'preview' ? (
              <div className="relative h-[340px] bg-[#09090b] p-6 overflow-hidden flex flex-col justify-between">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Live Preview Display per Selected Primitive */}
                {selected.id === 'parallax' && (
                  <div className="relative w-full h-full flex flex-col justify-between select-none">
                    <Parallax speed={-0.15} className="w-full flex items-center justify-between text-xs font-mono text-[#71717a] border-b border-[#1c1c1f] pb-2">
                      <span>PARALLAX DEPTH -0.15x</span>
                      <span>BACKGROUND LAYER</span>
                    </Parallax>

                    <Parallax speed={0.25} className="my-auto mx-auto w-full max-w-md">
                      <div className="p-6 rounded-xl border border-[#27272a] bg-[#18181b] shadow-2xl text-center">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#101012] border border-[#27272a] text-xs font-mono text-[#3b82f6] mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          <span>Parallax Speed: +0.25x</span>
                        </div>
                        <h4 className="text-lg font-bold text-[#fafafa] font-sans">
                          Direct Hardware Compositor
                        </h4>
                        <p className="text-xs text-[#a1a1aa] mt-1 font-sans">
                          Scroll to watch this card translate with continuous spring velocity.
                        </p>
                      </div>
                    </Parallax>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a] pt-2 border-t border-[#1c1c1f]">
                      <span>Z-INDEX: FOREGROUND</span>
                      <span className="text-[#10b981]">0 Re-renders</span>
                    </div>
                  </div>
                )}

                {selected.id === 'reveal' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Reveal duration={0.6} blur={6} scale={0.96}>
                      <div className="p-8 rounded-xl border border-[#27272a] bg-[#18181b] shadow-2xl text-center space-y-2 max-w-md">
                        <div className="text-xs font-mono text-[#10b981] font-semibold flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          120 FPS Direct GPU Entrance
                        </div>
                        <h4 className="text-lg font-bold text-[#fafafa] font-sans">
                          Zero-FOUC Viewport Intersection
                        </h4>
                        <p className="text-xs text-[#a1a1aa] font-sans leading-relaxed">
                          Preserves pre-rendered markup during React 19 SSR hydration.
                        </p>
                      </div>
                    </Reveal>
                  </div>
                )}

                {selected.id === 'pin' && (
                  <div className="w-full h-full flex flex-col justify-between p-4 bg-[#101012] rounded-lg border border-[#27272a] font-mono text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1f]">
                      <span className="text-[#3b82f6] font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                        STICKY POSITION: PINNED (top: 80px)
                      </span>
                      <span className="text-[#71717a]">CONTAINER: LOCKED</span>
                    </div>
                    <div className="my-auto text-center space-y-1">
                      <div className="text-[#fafafa] font-bold text-sm">
                        Native CSS Sticky Preference
                      </div>
                      <div className="text-xs text-[#a1a1aa]">
                        Falls back to 3D matrix transform if parent has clipping masks.
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#1c1c1f] text-[11px] text-[#71717a]">
                      <span>SPACER TEARDOWN: AUTO</span>
                      <span className="text-[#10b981]">Safe Stacking Context</span>
                    </div>
                  </div>
                )}

                {selected.id === 'velocity-marquee' && (
                  <div className="w-full h-full flex flex-col justify-center overflow-hidden">
                    <VelocityMarquee baseSpeed={0.8} velocityMultiplier={2.5} className="font-mono text-xs uppercase tracking-wider text-[#71717a] py-4">
                      <span className="mx-3 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-[#fafafa]">
                        MOMENTUM ACCELERATION
                      </span>
                      <span className="mx-3 px-3 py-1.5 rounded bg-[#18181b] border border-[#3b82f6] text-[#93c5fd]">
                        120 FPS MODULO
                      </span>
                      <span className="mx-3 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-[#fafafa]">
                        SUBPIXEL SNAPPING
                      </span>
                      <span className="mx-3 px-3 py-1.5 rounded bg-[#18181b] border border-[#27272a] text-[#fafafa]">
                        ZERO VDOM RE-RENDERS
                      </span>
                    </VelocityMarquee>
                    <div className="mt-4 text-center text-[11px] font-mono text-[#71717a]">
                      Scroll rapidly up and down to observe velocity decay back to cruise speed.
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="p-5 bg-[#09090b] overflow-y-auto max-h-[340px] select-text">
                {highlightCode(selected.snippet)}
              </div>
            )}

            {/* Studio Footer */}
            <div className="px-5 py-3 border-t border-[#1c1c1f] bg-[#0d0d0f] flex flex-wrap items-center justify-between text-xs font-mono text-[#71717a] gap-3">
              <div className="flex items-center gap-3">
                {selected.specs.map((spec, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-[#27272a]">•</span>}
                    <span>{spec}</span>
                  </span>
                ))}
              </div>
              <Link
                href={`/test/${selected.testSlug}`}
                className="inline-flex items-center gap-1.5 text-[#fafafa] hover:text-[#3b82f6] transition-colors"
              >
                <span>Open in Test Lab</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
