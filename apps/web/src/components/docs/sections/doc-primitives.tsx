'use client';

/**
 * ScrollCraft Docs: Core Primitives (Reference-Only)
 * Follows strict 15-second scanning template:
 * - Minimal 5–10 line code block
 * - What it does: one line
 * - Capabilities: bullet list of props/behaviors
 * - Status: Beta
 * Strictly zero prose paragraphs. Zero tutorials.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Zap } from 'lucide-react';

interface DocPrimitivesProps {
  primitiveId: string;
}

interface PrimitiveReference {
  name: string;
  tag: string;
  status: 'Beta' | 'Alpha' | 'v0.2.0 (Coming Soon)';
  code: string;
  whatItDoes: string;
  capabilities: { prop: string; type: string; desc: string; defaultValue?: string }[];
}

const PRIMITIVES_DATA: Record<string, PrimitiveReference> = {
  parallax: {
    name: 'Parallax',
    tag: '<Parallax />',
    status: 'Beta',
    code: `import { Parallax } from '@scrollcraft/react';

/**
 * Multi-layer subpixel parallax with hardware composite writes.
 * Positive speeds lag behind scroll; negative speeds accelerate ahead.
 */
export function HeroParallax() {
  return (
    <div className="relative h-[600px] overflow-hidden rounded-2xl bg-zinc-950">
      {/* Background layer: moves slower to establish focal depth */}
      <Parallax speed={-0.25} direction="vertical" clamp={[-120, 120]}>
        <div className="absolute inset-0 bg-cover bg-center" />
      </Parallax>

      {/* Foreground layer: accelerates slightly for dimensional contrast */}
      <Parallax speed={0.15} direction="vertical">
        <h1 className="text-6xl font-bold text-white tracking-tight">
          Make The Web Move
        </h1>
      </Parallax>
    </div>
  );
}`,
    whatItDoes: 'Displaces children along vertical or horizontal scroll axes with subpixel physics offsets.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the animated DOM container.' },
      { prop: 'speed', type: 'number', defaultValue: '0.2', desc: 'Displacement rate multiplier (+ lags behind scroll, - accelerates ahead).' },
      { prop: 'direction', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", desc: 'Axis of translation (translates translateY vs translateX).' },
      { prop: 'clamp', type: '[number, number]', defaultValue: 'undefined', desc: 'Displacement boundaries [min, max] in pixels to prevent unbounded drift.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Radix-style Slot composition into immediate child without injecting extra wrapper <div>.' },
      { prop: 'className', type: 'string', defaultValue: "''", desc: 'Merged onto component or child element style attribute.' },
    ],
  },

  reveal: {
    name: 'Reveal',
    tag: '<Reveal />',
    status: 'Beta',
    code: `import { Reveal } from '@scrollcraft/react';

/**
 * Batched IntersectionObserver entrance animation.
 * Promotes element to GPU layer on intersect, avoids layout thrashing.
 */
export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card 1: Enters when 15% visible with subpixel spring lerp */}
      <Reveal direction="up" distance={28} duration={0.6} threshold={0.15}>
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-lg font-bold text-white">Direct GPU Pipeline</h3>
          <p className="text-sm text-zinc-400 mt-2">Zero React re-renders on scroll.</p>
        </div>
      </Reveal>

      {/* Card 2: 120ms staggered entrance delay */}
      <Reveal direction="up" distance={28} duration={0.6} delay={0.12}>
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-lg font-bold text-white">3-Phase Microtask Loop</h3>
          <p className="text-sm text-zinc-400 mt-2">Strictly separated measure, update, render phases.</p>
        </div>
      </Reveal>
    </div>
  );
}`,
    whatItDoes: 'Hardware-accelerated entrance animation triggered upon intersecting viewport visibility thresholds.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the animated element.' },
      { prop: 'direction', type: "'up' | 'down' | 'left' | 'right'", defaultValue: "'up'", desc: 'Entrance translation vector.' },
      { prop: 'distance', type: 'number', defaultValue: '24', desc: 'Initial offset distance in pixels before triggering entrance.' },
      { prop: 'threshold', type: 'number', defaultValue: '0.15', desc: 'Intersection ratio threshold (0.0 to 1.0) before transition fires.' },
      { prop: 'duration', type: 'number', defaultValue: '0.6', desc: 'Animation duration in seconds.' },
      { prop: 'delay', type: 'number', defaultValue: '0', desc: 'Sequence or stagger delay in seconds.' },
      { prop: 'once', type: 'boolean', defaultValue: 'true', desc: 'Whether to fire transition only once or replay upon re-intersection.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Applies transitions and ref directly to immediate child element.' },
    ],
  },

  pin: {
    name: 'Pin',
    tag: '<Pin />',
    status: 'Beta',
    code: `import { Pin } from '@scrollcraft/react';

/**
 * Sticky viewport lock without synthetic spacer wrapper divs.
 * Preserves normal document flow without layout reflow penalty.
 */
export function StickyNarrative() {
  return (
    <section className="relative min-h-[250vh]">
      {/* Pins node at viewport top for 150% of viewport height scroll distance */}
      <Pin start="top top" end="+=150%" pinSpacing={true}>
        <div className="h-screen flex items-center justify-center">
          <div className="max-w-xl p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h2 className="text-3xl font-bold text-white">Sticky Hardware Focus</h2>
            <p className="text-zinc-400 mt-2">
              Cleanly unpins with 0 layout shift once scroll travel completes.
            </p>
          </div>
        </div>
      </Pin>
    </section>
  );
}`,
    whatItDoes: 'Locks elements into sticky viewport coordinates for a designated scroll travel distance budget.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the pinned element.' },
      { prop: 'start', type: 'string | number', defaultValue: "'top top'", desc: 'Viewport intersection trigger point where sticky lock initiates.' },
      { prop: 'end', type: 'string | number', defaultValue: "'+=100%'", desc: 'Scroll travel distance through which the element remains locked.' },
      { prop: 'pinSpacing', type: 'boolean', defaultValue: 'true', desc: 'Preserves geometric scroll clearance so surrounding content does not collapse.' },
      { prop: 'top', type: 'number', defaultValue: '0', desc: 'Sticky offset from viewport top edge in pixels.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Renders child directly into pinning track without wrapper overhead.' },
    ],
  },

  'scroll-progress': {
    name: 'ScrollProgress',
    tag: '<ScrollProgress />',
    status: 'Beta',
    code: `import { ScrollProgress } from '@scrollcraft/react';

/**
 * Global normalized scroll indicator (0.0 to 1.0).
 * Updates GPU transform matrix directly on the compositor thread.
 */
export function ViewportProgressIndicator() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* GPU hardware-accelerated progress line with scaleX transform */}
      <ScrollProgress
        axis="y"
        className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500 origin-left"
      />
    </header>
  );
}`,
    whatItDoes: 'Tracks and normalizes scroll completion from 0.0 to 1.0 across a container or entire viewport.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the progress bar element.' },
      { prop: 'targetRef', type: 'RefObject<HTMLElement>', defaultValue: 'undefined', desc: 'Target element to track (omit to measure full document body scroll).' },
      { prop: 'axis', type: "'y' | 'x'", defaultValue: "'y'", desc: 'Scroll orientation axis to monitor.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Passes normalized ratio (0–1) directly to custom child render function or SVG.' },
      { prop: 'className', type: 'string', defaultValue: "''", desc: 'Styles applied to the progress indicator element.' },
    ],
  },

  'velocity-marquee': {
    name: 'VelocityMarquee',
    tag: '<VelocityMarquee />',
    status: 'Beta',
    code: `import { VelocityMarquee } from '@scrollcraft/react';

/**
 * Scroll velocity-reactive continuous marquee track.
 * Automatically accelerates on rapid scrolling and recovers base crawl speed.
 */
export function KineticVelocityMarquee() {
  return (
    <div className="py-10 border-y border-zinc-800 bg-black overflow-hidden">
      {/* Dynamic speed multiplier responsive to instantaneous scroll velocity */}
      <VelocityMarquee baseSpeed={1.2} velocityMultiplier={0.08} direction="left" maxSpeed={45}>
        <span className="text-3xl font-mono uppercase tracking-widest text-zinc-300">
          120 FPS DIRECT DOM &bull; ZERO RE-RENDERS &bull; SUBPIXEL COMPOSITOR &bull;&nbsp;
        </span>
      </VelocityMarquee>
    </div>
  );
}`,
    whatItDoes: 'Continuous horizontal text/image track whose crawl velocity accelerates dynamically with user scroll.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the marquee track wrapper.' },
      { prop: 'baseSpeed', type: 'number', defaultValue: '1', desc: 'Stationary crawling speed in pixels per frame.' },
      { prop: 'velocityMultiplier', type: 'number', defaultValue: '0.05', desc: 'Multiplier applied to instantaneous user scroll velocity.' },
      { prop: 'direction', type: "'left' | 'right'", defaultValue: "'left'", desc: 'Horizontal motion direction of the marquee track.' },
      { prop: 'maxSpeed', type: 'number', defaultValue: '50', desc: 'Maximum velocity clamp in pixels per frame to prevent visual tearing.' },
    ],
  },

  'horizontal-scroll': {
    name: 'HorizontalScroll',
    tag: '<HorizontalScroll />',
    status: 'Beta',
    code: `import { HorizontalScroll } from '@scrollcraft/react';

/**
 * Pinned horizontal gallery layout.
 * Directly translates vertical scroll momentum into horizontal track translation.
 */
export function HorizontalProjectGallery() {
  return (
    <HorizontalScroll speed={2.5} className="bg-black">
      {/* Horizontal track: slides are arrayed horizontally in full-height container */}
      <div className="flex gap-8 items-center h-screen px-12">
        <div className="w-[450px] h-[520px] rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0 p-8">
          <h4 className="text-xl font-bold text-white">Project One</h4>
        </div>
        <div className="w-[450px] h-[520px] rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0 p-8">
          <h4 className="text-xl font-bold text-white">Project Two</h4>
        </div>
      </div>
    </HorizontalScroll>
  );
}`,
    whatItDoes: 'Converts vertical document scroll into pinned horizontal sliding track motion.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLDivElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the outer pinned scroll container.' },
      { prop: 'speed', type: 'number', defaultValue: '2', desc: 'Scroll distance multiplier relative to viewport height (e.g. 2 = 200vh total travel).' },
      { prop: 'className', type: 'string', defaultValue: "''", desc: 'Styles applied to outer pinned container.' },
      { prop: 'innerClassName', type: 'string', defaultValue: "''", desc: 'Styles applied to inner horizontal translating track.' },
    ],
  },

  'scroll-sequence': {
    name: 'ScrollSequence',
    tag: '<ScrollSequence />',
    status: 'Beta',
    code: `import { ScrollSequence } from '@scrollcraft/react';

/**
 * Canvas-based sequential image frame scrubber.
 * Renders high-frame-rate 3D or product rotations pinned to scroll position.
 */
export function Product360Canvas({ frames }: { frames: string[] }) {
  return (
    <div className="relative">
      {/* High-performance canvas scrubs through sequential frames across 300vh budget */}
      <ScrollSequence
        frames={frames}
        height="300vh"
        speed={1.5}
        className="sticky top-0 w-full h-screen"
      />
    </div>
  );
}`,
    whatItDoes: 'Preloads and scrubs sequential image frames on an HTML5 canvas based on pinned scroll progress.',
    capabilities: [
      { prop: 'ref', type: 'React.Ref<HTMLCanvasElement>', defaultValue: 'undefined', desc: 'Forwarded React ref to the HTML5 canvas element.' },
      { prop: 'frames', type: 'string[]', defaultValue: 'required', desc: 'Array of sequential frame image URLs.' },
      { prop: 'height', type: 'string', defaultValue: "'300vh'", desc: 'CSS scroll travel height budget for scrubbing through the sequence.' },
      { prop: 'speed', type: 'number', defaultValue: '1.5', desc: 'Scrubbing sensitivity multiplier across image frames.' },
    ],
  },

  'stacked-cards': {
    name: 'StackedCards',
    tag: '<StackedCards />',
    status: 'v0.2.0 (Coming Soon)',
    code: `import { StackedCards } from '@scrollcraft/react';

const CARDS = [
  { id: '1', title: 'Zero Layout Shift', desc: 'Pre-computed geometric bounds.' },
  { id: '2', title: 'Depth Gating', desc: 'Buried cards automatically set pointer-events: none.' },
  { id: '3', title: 'Hardware Stacking', desc: 'Direct GPU composite scale and translateY.' },
];

export function CardDeckSection() {
  return (
    <StackedCards
      items={CARDS}
      stackOffset={28}
      scaleStep={0.04}
      fadeBuried={true}
      pinBudget="250vh"
      renderCard={(item) => (
        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          <h3 className="text-2xl font-bold text-white">{item.title}</h3>
          <p className="text-zinc-400 mt-2">{item.desc}</p>
        </div>
      )}
    />
  );
}`,
    whatItDoes: 'Kinetic 3D stacking card deck with automated variable height measurement and depth-gated pointer events.',
    capabilities: [
      { prop: 'items', type: 'T[]', defaultValue: 'required', desc: 'Array of data items mapped into stacked card layers.' },
      { prop: 'renderCard', type: '(item: T, index: number) => ReactNode', defaultValue: 'required', desc: 'Render prop producing individual card JSX.' },
      { prop: 'stackOffset', type: 'number', defaultValue: '24', desc: 'Vertical peek offset per stacked card in pixels.' },
      { prop: 'scaleStep', type: 'number', defaultValue: '0.04', desc: 'Scale reduction factor per depth layer (e.g. 0.04 = 0.96, 0.92, 0.88).' },
      { prop: 'fadeBuried', type: 'boolean', defaultValue: 'true', desc: 'Fades and disables pointer events on obscured cards behind active layer.' },
      { prop: 'pinBudget', type: 'string', defaultValue: "'200vh'", desc: 'Scroll travel height budget allocated for full deck scrub.' },
    ],
  },

  'text-reveal': {
    name: 'TextReveal',
    tag: '<TextReveal />',
    status: 'v0.2.0 (Coming Soon)',
    code: `import { TextReveal } from '@scrollcraft/react';

export function HeadlineReveal() {
  return (
    <TextReveal
      by="word"
      stagger={0.04}
      scrub={true}
      start="top 80%"
      end="top 25%"
      className="text-5xl font-extrabold text-white tracking-tight leading-tight"
    >
      Engineered for extreme frame fidelity and zero layout recalculations.
    </TextReveal>
  );
}`,
    whatItDoes: 'Split-text scroll reveal (by character, word, or line) with SSR-safe CSS fallback and zero layout shift.',
    capabilities: [
      { prop: 'children', type: 'string', defaultValue: 'required', desc: 'Text content to tokenize into animated DOM spans.' },
      { prop: 'by', type: "'character' | 'word' | 'line'", defaultValue: "'word'", desc: 'Token segmentation granularity.' },
      { prop: 'stagger', type: 'number', defaultValue: '0.03', desc: 'Delay increment between successive tokens in seconds.' },
      { prop: 'scrub', type: 'boolean', defaultValue: 'true', desc: 'Directly drives token opacity and Y offset from scroll progress.' },
      { prop: 'nowrap', type: 'boolean', defaultValue: 'true', desc: 'Wraps character tokens in inline-block words to prevent mid-word linebreaks.' },
      { prop: 'fallbackTimeout', type: 'number', defaultValue: '1200', desc: 'Timeout in ms before activating CSS animation if JS execution is delayed.' },
    ],
  },

  'scroll-transform': {
    name: 'ScrollTransform',
    tag: '<ScrollTransform />',
    status: 'v0.2.0 (Coming Soon)',
    code: `import { ScrollTransform } from '@scrollcraft/react';

export function DynamicMorphHero() {
  return (
    <ScrollTransform
      preset="3d-flip"
      start="top center"
      end="bottom top"
      asChild
    >
      <div className="p-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-900 text-white">
        <h2 className="text-4xl font-black">Multi-Axis GPU Morph</h2>
      </div>
    </ScrollTransform>
  );
}`,
    whatItDoes: 'Direct GPU multi-property compositor interpolator (opacity, scale, rotate, 3D tilt, blur, RGBA color).',
    capabilities: [
      { prop: 'preset', type: "'zoom-in' | 'fade-up' | 'scale-down' | 'blur-in' | '3d-flip'", defaultValue: 'undefined', desc: 'High-performance preset transform curves.' },
      { prop: 'keyframes', type: 'Record<number, KeyframeProps>', defaultValue: 'undefined', desc: 'Custom normalized keyframes (0.0 to 1.0) for composite injection.' },
      { prop: 'start', type: 'string', defaultValue: "'top bottom'", desc: 'Viewport scroll trigger boundary start point.' },
      { prop: 'end', type: 'string', defaultValue: "'bottom top'", desc: 'Viewport scroll trigger boundary finish point.' },
      { prop: 'clamp', type: 'boolean', defaultValue: 'true', desc: 'Guards against extrapolating transforms beyond boundary range.' },
      { prop: 'asChild', type: 'boolean', defaultValue: 'false', desc: 'Directly injects style mutations into first child without extra wrapper.' },
    ],
  },

  'scroll-draw': {
    name: 'ScrollDraw',
    tag: '<ScrollDraw />',
    status: 'v0.2.0 (Coming Soon)',
    code: `import { ScrollDraw } from '@scrollcraft/react';

export function VectorPathScrub() {
  return (
    <svg viewBox="0 0 1000 300" className="w-full h-auto">
      <ScrollDraw start="top 75%" end="center center" direction="forward">
        <path
          d="M 50 150 C 250 50, 450 250, 650 150 S 950 250, 950 150"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </ScrollDraw>
    </svg>
  );
}`,
    whatItDoes: 'Universal SVG geometry line-drawing scrubber supporting path, line, polyline, polygon, rect, and circle.',
    capabilities: [
      { prop: 'start', type: 'string', defaultValue: "'top 80%'", desc: 'Scroll offset triggering path drawing initiation.' },
      { prop: 'end', type: 'string', defaultValue: "'center center'", desc: 'Scroll offset where stroke finishes complete draw.' },
      { prop: 'direction', type: "'forward' | 'reverse'", defaultValue: "'forward'", desc: 'Stroke drawing progression vector.' },
      { prop: 'dashArray', type: 'string | number', defaultValue: 'totalLength', desc: 'Stroke dash pattern segment length.' },
      { prop: 'scrub', type: 'boolean', defaultValue: 'true', desc: 'Pins stroke offset directly to hardware scroll frame position.' },
    ],
  },

  'scroll-inspector': {
    name: 'ScrollInspector',
    tag: '<ScrollInspector />',
    status: 'v0.2.0 (Coming Soon)',
    code: `import { ScrollInspector } from '@scrollcraft/react';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Development Studio: Frame drop ribbon, live spring tuner, trigger markers */}
        {process.env.NODE_ENV === 'development' && (
          <ScrollInspector
            position="bottom-right"
            showFPS={true}
            showTriggers={true}
            exportProps={true}
          />
        )}
      </body>
    </html>
  );
}`,
    whatItDoes: 'ScrollCraft DevTools studio: frame-drop ribbon, live physics spring tuner, and spatial 3D trigger visualizer.',
    capabilities: [
      { prop: 'enabled', type: 'boolean', defaultValue: 'true', desc: 'Enables or disables HUD overlay (automatically stripped in production).' },
      { prop: 'position', type: "'bottom-right' | 'bottom-left' | 'top-right'", defaultValue: "'bottom-right'", desc: 'Viewport screen anchor position for the HUD window.' },
      { prop: 'showFPS', type: 'boolean', defaultValue: 'true', desc: 'Hardware 120Hz/60Hz frame delivery ribbon and dropped frame counter.' },
      { prop: 'showTriggers', type: 'boolean', defaultValue: 'true', desc: 'Projects visual trigger boundary planes and marker lines over page content.' },
      { prop: 'exportProps', type: 'boolean', defaultValue: 'true', desc: 'Allows one-click export of in-browser tweaked spring physics to JSX.' },
    ],
  },
};

export const DocPrimitives: React.FC<DocPrimitivesProps> = ({ primitiveId }) => {
  const primitive = PRIMITIVES_DATA[primitiveId] || PRIMITIVES_DATA.parallax;
  const isComingSoon = primitive.status.includes('Coming Soon');

  return (
    <div className="space-y-10 not-prose">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono break-all sm:break-normal">
              {primitive.tag}
            </h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              isComingSoon
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              {primitive.status}
            </span>
          </div>
          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
            <strong className="text-white">What it does:</strong> {primitive.whatItDoes}
          </p>
        </div>
      </div>

      {/* Production Sample Code */}
      <div id="syntax" className="space-y-3 scroll-mt-24">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
          Syntax &bull; Production Implementation
        </span>
        <CodeViewer code={primitive.code} fileName={`${primitive.name.toLowerCase()}.tsx`} />
      </div>

      {/* Capabilities Reference */}
      <div id="capabilities" className="space-y-4 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span>Capabilities &amp; Props</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 sm:hidden">Swipe table &rarr;</span>
        </div>

        <div className="rounded-xl border border-zinc-800 overflow-x-auto bg-[#0a0a0c]">
          <table className="w-full text-left text-xs font-mono min-w-[550px]">
            <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Prop</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Default</th>
                <th className="px-4 py-2.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans text-zinc-300">
              {primitive.capabilities.map((c) => (
                <tr key={c.prop} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-violet-400 font-semibold">{c.prop}</td>
                  <td className="px-4 py-3 font-mono text-purple-300 text-[11px]">{c.type}</td>
                  <td className="px-4 py-3 font-mono text-zinc-500 text-[11px]">{c.defaultValue ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-300 text-xs">{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Signal */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>Status: <strong className={isComingSoon ? "text-cyan-400 uppercase" : "text-amber-400 uppercase"}>{primitive.status}</strong></span>
        <span className="text-[11px] text-zinc-500 font-sans">
          {isComingSoon
            ? 'Scheduled for ScrollCraft v0.2.0 Beta (1–2 weeks) • Zero-rerender DOM pipeline'
            : 'API surface may shift before 1.0 • Direct GPU compositor writes'}
        </span>
      </div>
    </div>
  );
};
