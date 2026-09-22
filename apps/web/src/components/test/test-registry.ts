export type TestCategory = 'primitives' | 'components' | 'hooks';

export type DriverType =
  | 'CSS Animation-Timeline (Compositor)'
  | 'Ticker Phase 3 (Compositor)'
  | 'Ticker Phase 4 (Canvas 2D / LRU)'
  | 'JS Physics Solver'
  | 'Headless Hook'
  | 'Audit Utility';

export interface PropDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface KnobDefinition {
  id: string;
  label: string;
  type: 'number' | 'boolean' | 'select';
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface TestItem {
  id: string;
  slug: string;
  category: TestCategory;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  driver: DriverType;
  runwayHeight: string;
  features: string[];
  gotchas: string[];
  props: PropDefinition[];
  knobs?: KnobDefinition[];
  code: string;
  usageCode: string;
}

export const TEST_REGISTRY: TestItem[] = [
  // ==========================================
  // SECTION A: PRIMITIVES (6)
  // ==========================================
  {
    id: 'parallax',
    slug: 'parallax',
    category: 'primitives',
    title: '<Parallax>',
    shortDescription: 'Multi-layer depth with clamp limits, anti-jump auto-origin, and bleed prevention.',
    fullDescription:
      '<Parallax> provides 120 FPS buttery depth translation across scroll. Features speed direction inversion, custom min/max travel clamps, bleed prevention for edge-clipping backgrounds, and asChild polymorphic composition with Slot.',
    tags: ['Compositor', '120 FPS', 'Depth Motion', 'Zero Re-renders', 'asChild'],
    driver: 'CSS Animation-Timeline (Compositor)',
    runwayHeight: '220vh',
    features: [
      'Multi-layer speeds (positive & negative parallax offsets)',
      'Min/Max travel clamping to eliminate layout breaks',
      'origin="auto" anti-jump calculation for hero components',
      'bleed={true} safety margins for background cards',
      'asChild polymorphic slot composition',
    ],
    gotchas: [
      'Never place overflow: hidden on immediate parent containers when using large speed factors unless bleed is explicitly set.',
      'Speed values typically range between -1.0 (reverse) and 1.0 (forward). Speed of 0 locks the element in place.',
    ],
    props: [
      { name: 'speed', type: 'number', default: '0.2', description: 'Parallax movement speed multiplier. Negative values move counter to scroll.' },
      { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Axis of parallax translation.' },
      { name: 'min', type: 'number', default: 'undefined', description: 'Minimum pixel clamp limit for translation.' },
      { name: 'max', type: 'number', default: 'undefined', description: 'Maximum pixel clamp limit for translation.' },
      { name: 'origin', type: "'auto' | 'top' | 'center' | 'bottom'", default: "'center'", description: 'Anchor origin for zero-offset calculation.' },
      { name: 'bleed', type: 'boolean | number', default: 'false', description: 'Extends element boundaries to prevent empty edge gaps during rapid scroll.' },
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Merges props and ref directly onto child element via polymorphic Slot.' },
    ],
    knobs: [
      { id: 'speed', label: 'Speed', type: 'number', default: 0.35, min: -1, max: 1, step: 0.05 },
      { id: 'bleed', label: 'Bleed Safety', type: 'boolean', default: true },
    ],
    code: `import React from 'react';
import { Parallax } from '@scrollcraft/react';

export function ParallaxHeroScene() {
  return (
    <div className="relative min-h-[160vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Plane (Deep Depth) */}
      <Parallax speed={-0.3} className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-b from-violet-950/20 via-zinc-900/40 to-transparent blur-3xl opacity-60" />
      </Parallax>

      {/* Midground Element */}
      <Parallax speed={0.15} min={-80} max={80}>
        <div className="w-72 h-72 rounded-3xl border border-violet-500/20 bg-zinc-900/80 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400">Mid-Layer 0.15x</span>
          <p className="text-sm text-zinc-300">Translates smoothly relative to scroll velocity.</p>
        </div>
      </Parallax>

      {/* Foreground Hero Element (Fast Depth) */}
      <Parallax speed={0.45} min={-140} max={140} className="mt-20">
        <div className="w-80 rounded-3xl border border-white/20 bg-gradient-to-br from-violet-600/30 to-zinc-900/90 p-8 shadow-2xl backdrop-blur-2xl">
          <span className="text-xs font-mono text-emerald-400 font-semibold">Foreground 0.45x</span>
          <h3 className="text-xl font-bold text-white mt-2">Zero-Rerender Depth</h3>
        </div>
      </Parallax>
    </div>
  );
}`,
    usageCode: `import { Parallax } from '@scrollcraft/react';

<Parallax speed={0.4} min={-100} max={100} bleed={true}>
  <img src="/hero-card.png" alt="Parallax Card" />
</Parallax>`,
  },

  {
    id: 'reveal',
    slug: 'reveal',
    category: 'primitives',
    title: '<Reveal>',
    shortDescription: 'Optical viewport reveals with direction, 3D tilt, optical blur, and stagger.',
    fullDescription:
      '<Reveal> triggers smooth entrance animations when elements enter the viewport. Features 4 directions (up, down, left, right), distance, duration, delay, optical blur filtering, 3D rotateX perspective, and batch-optimized IntersectionObserver handling.',
    tags: ['Entrance Animation', '3D Tilt', 'Optical Blur', 'IntersectionObserver', 'Stagger', 'asChild'],
    driver: 'CSS Animation-Timeline (Compositor)',
    runwayHeight: '180vh',
    features: [
      'Multi-axis direction: up, down, left, right',
      'Optical blur transition for cinematic entrance',
      '3D rotateX and scale presets for modern spatial feel',
      'Custom distance, duration, delay, and easing curve',
      'Batch-optimized IntersectionObserver without scroll lag',
      'Polymorphic asChild slot composition without wrapper markup',
    ],
    gotchas: [
      'Set once={false} if you want the reveal animation to reset and replay when scrolling backward.',
      'Ensure the threshold value (0.0 to 1.0) matches the height of the element to avoid premature reveals.',
    ],
    props: [
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Merges reveal transitions and ref directly onto child element via polymorphic Slot.' },
      { name: 'direction', type: "'up' | 'down' | 'left' | 'right' | 'none'", default: "'up'", description: 'Direction from which the element transitions.' },
      { name: 'distance', type: 'number', default: '40', description: 'Pixel distance of the entrance slide.' },
      { name: 'duration', type: 'number', default: '0.6', description: 'Animation duration in seconds.' },
      { name: 'delay', type: 'number', default: '0', description: 'Base transition delay in seconds.' },
      { name: 'index', type: 'number', default: 'undefined', description: 'Zero-based sibling index for automatic staggered entrance sequencing.' },
      { name: 'stagger', type: 'number', default: '0.05', description: 'Incremental delay in seconds applied per sibling index (delay + index * stagger).' },
      { name: 'blur', type: 'number', default: '0', description: 'Optical blur in pixels transitioning to 0.' },
      { name: 'scale', type: 'number', default: '1', description: 'Initial scale transitioning to 1.' },
      { name: 'rotateX', type: 'number', default: '0', description: 'Initial 3D X-axis tilt in degrees.' },
      { name: 'threshold', type: 'number', default: '0.15', description: 'IntersectionObserver threshold (0 to 1).' },
      { name: 'once', type: 'boolean', default: 'true', description: 'Whether reveal fires only once or replays on exit.' },
    ],
    knobs: [
      { id: 'direction', label: 'Direction', type: 'select', default: 'up', options: ['up', 'down', 'left', 'right'] },
      { id: 'distance', label: 'Distance (px)', type: 'number', default: 48, min: 10, max: 120, step: 2 },
      { id: 'blur', label: 'Blur (px)', type: 'number', default: 8, min: 0, max: 24, step: 1 },
      { id: 'scale', label: 'Start Scale', type: 'number', default: 0.92, min: 0.7, max: 1, step: 0.02 },
      { id: 'rotateX', label: '3D Tilt (deg)', type: 'number', default: 15, min: 0, max: 45, step: 5 },
    ],
    code: `import React from 'react';
import { Reveal } from '@scrollcraft/react';

export function StaggeredFeatureMatrix() {
  const items = [
    { title: 'Zero Re-Renders', desc: 'Direct compositor writes preserve 120 FPS.' },
    { title: 'GSAP Parity', desc: 'Enterprise 4-state lifecycle triggers without bloat.' },
    { title: 'Pure CSS Timeline', desc: 'Hardware accelerated scroll-driven animations.' },
    { title: 'RSC Hydration Safe', desc: 'No layout shifts or hydration mismatches in Next.js.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto py-24">
      {items.map((item, idx) => (
        <Reveal
          key={idx}
          index={idx}
          stagger={0.12}
          direction="up"
          distance={48}
          duration={0.7}
          blur={8}
          scale={0.92}
          rotateX={12}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl"
        >
          <span className="text-xs font-mono text-violet-400">0{idx + 1} / FEATURE</span>
          <h4 className="text-lg font-bold text-white mt-2">{item.title}</h4>
          <p className="text-sm text-zinc-400 mt-1">{item.desc}</p>
        </Reveal>
      ))}
    </div>
  );
}`,
    usageCode: `import { Reveal } from '@scrollcraft/react';

<Reveal direction="up" distance={40} blur={6} rotateX={10}>
  <div className="card">Content reveals smoothly</div>
</Reveal>`,
  },

  {
    id: 'pin',
    slug: 'pin',
    category: 'primitives',
    title: '<Pin> & <PinContainer>',
    shortDescription: 'Sticky locking with scroll runway, GSAP 4-state lifecycle, and zero-rerender pinning.',
    fullDescription:
      '<Pin> and <PinContainer> implement rock-solid CSS sticky pinning combined with ScrollCraft’s 120 FPS GSAP 4-state lifecycle (onEnter, onLeave, onEnterBack, onLeaveBack). Features zero-rerender progress tracking, auto track spacing, and explicit runway heights.',
    tags: ['Sticky Pinning', 'GSAP Lifecycle', 'Scroll Runway', '120 FPS', 'Progress Tracking'],
    driver: 'Ticker Phase 3 (Compositor)',
    runwayHeight: '240vh',
    features: [
      'PinContainer establishing dedicated scroll runway (e.g. 180vh–240vh)',
      'Zero-rerender observable progressValue or reactive trackState',
      'GSAP 4-State Lifecycle: onEnter, onLeave, onEnterBack, onLeaveBack',
      'Configurable top offset & automatic pinSpacing compensation',
      'Polymorphic asChild support for custom elements',
    ],
    gotchas: [
      'CRITICAL: Ancestor elements must NEVER have overflow: hidden or overflow: clip, which destroys CSS position: sticky.',
      'Always give PinContainer a minHeight of at least 150vh to 250vh so there is sufficient runway distance for the pin to lock and unlock.',
    ],
    props: [
      { name: 'top', type: 'number | string', default: '0', description: 'Top sticky offset in pixels or CSS string (e.g. 100 or "80px").' },
      { name: 'duration', type: 'number | string', default: 'undefined', description: 'Active pin scroll distance before unlocking.' },
      { name: 'trackState', type: 'boolean', default: 'false', description: 'Enables reactive isPinned and progress state (triggers state updates).' },
      { name: 'pinSpacing', type: 'boolean | number', default: 'false', description: 'Automatically inserts layout spacing to offset pinned height.' },
      { name: 'onEnter', type: '() => void', default: 'undefined', description: 'Fired when scrolling down into the pin trigger.' },
      { name: 'onLeave', type: '() => void', default: 'undefined', description: 'Fired when scrolling down past the pin exit.' },
      { name: 'onEnterBack', type: '() => void', default: 'undefined', description: 'Fired when scrolling up back into the pin zone.' },
      { name: 'onLeaveBack', type: '() => void', default: 'undefined', description: 'Fired when scrolling up above the pin trigger.' },
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Merges sticky styles and refs onto child.' },
    ],
    knobs: [
      { id: 'top', label: 'Top Offset (px)', type: 'number', default: 90, min: 20, max: 180, step: 10 },
      { id: 'pinSpacing', label: 'Pin Spacing', type: 'boolean', default: false },
    ],
    code: `import React, { useState } from 'react';
import { Pin, PinContainer } from '@scrollcraft/react';

export function PinMilestoneDemo() {
  const [activeState, setActiveState] = useState('Idle');

  return (
    <PinContainer height="240vh" className="relative w-full border-y border-zinc-800/80 bg-zinc-950/40">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
        {/* Left Side: Pinned Control Card */}
        <div className="relative">
          <Pin
            top={90}
            onEnter={() => setActiveState('Active Pinning (onEnter)')}
            onLeave={() => setActiveState('Unlocked (onLeave)')}
            onEnterBack={() => setActiveState('Re-pinned (onEnterBack)')}
            onLeaveBack={() => setActiveState('Idle (onLeaveBack)')}
            className="w-full rounded-3xl border border-violet-500/30 bg-zinc-900/95 p-8 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase text-emerald-400">Sticky Lock Active</span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">GSAP 4-State Pinning</h3>
            <p className="text-sm text-zinc-400 mt-2">
              This card locks at top: 90px while the right column milestones scroll through the 240vh runway.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-violet-300">
              Lifecycle: <span className="text-white font-bold">{activeState}</span>
            </div>
          </Pin>
        </div>

        {/* Right Side: Scrolling Milestones */}
        <div className="space-y-32 py-16">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md">
              <span className="text-xs font-mono text-violet-400">STAGE 0{step}</span>
              <h4 className="text-xl font-bold text-white mt-2">Milestone Phase {step}</h4>
              <p className="text-sm text-zinc-400 mt-2">
                As this card passes the pinned left viewport, the pin solver coordinates without layout jitter.
              </p>
            </div>
          ))}
        </div>
      </div>
    </PinContainer>
  );
}`,
    usageCode: `import { Pin, PinContainer } from '@scrollcraft/react';

<PinContainer height="220vh">
  <Pin top={80} onEnter={() => console.log('pinned')}>
    <div className="sticky-card">Pinned Card</div>
  </Pin>
  <div className="scrolling-content">Scroll past content</div>
</PinContainer>`,
  },

  {
    id: 'scroll-progress',
    slug: 'scroll-progress',
    category: 'primitives',
    title: '<ScrollProgress>',
    shortDescription: 'Hardware-accelerated progress tracking with element target offsets and gradient bars.',
    fullDescription:
      '<ScrollProgress> creates smooth progress tracks synchronized to global page scroll or specific target DOM elements using custom offset triggers (e.g. `["top bottom", "bottom top"]`). Direct GPU scaleX writes guarantee 0 Virtual DOM re-renders.',
    tags: ['Progress Bar', 'GPU ScaleX', 'Target Offset', 'Zero Re-renders', 'Gradient', 'asChild'],
    driver: 'CSS Animation-Timeline (Compositor)',
    runwayHeight: '200vh',
    features: [
      'Direct GPU scaleX transform writes without React state thrashing',
      'Target element binding with custom scroll offsets',
      'Horizontal or vertical progress track orientation',
      'Configurable gradient colors, height, and glow effects',
      'Smooth interpolation with optional inertia damping',
      'Polymorphic asChild composition for custom progress bars',
    ],
    gotchas: [
      'When binding to a target ref, ensure the ref is attached to an element with measurable layout geometry in the DOM.',
    ],
    props: [
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Merges progress scaleX transform and ref directly onto custom child element.' },
      { name: 'target', type: 'React.RefObject<HTMLElement | null>', default: 'undefined', description: 'Optional target element to measure progress against instead of window scroll.' },
      { name: 'offset', type: '[string, string]', default: "['top bottom', 'bottom top']", description: 'Viewport trigger alignment pair.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Orientation of the progress indicator.' },
      { name: 'reactive', type: 'boolean', default: 'false', description: 'Whether progress triggers React state updates for re-rendering numeric indicators.' },
      { name: 'className', type: 'string', default: "''", description: 'Custom CSS classes for indicator styling.' },
    ],
    knobs: [
      { id: 'orientation', label: 'Orientation', type: 'select', default: 'horizontal', options: ['horizontal', 'vertical'] },
    ],
    code: `import React, { useRef } from 'react';
import { ScrollProgress } from '@scrollcraft/react';

export function ScopedProgressDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full space-y-8 py-12">
      {/* Global Top Indicator */}
      <ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-400 z-50 origin-left" />

      {/* Target-Scoped Progress Container */}
      <div ref={containerRef} className="relative max-w-3xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <h4 className="font-bold text-white">Target-Scoped Progress</h4>
          <span className="text-xs font-mono text-violet-400">Offset: ['top bottom', 'bottom top']</span>
        </div>

        {/* Embedded Container Progress Track */}
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden mb-8">
          <ScrollProgress target={containerRef} className="h-full bg-emerald-400 origin-left" />
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed">
          The top glowing bar measures the entire document scroll, while the green inner track measures this target card’s progression through the viewport with zero re-renders.
        </p>
      </div>
    </div>
  );
}`,
    usageCode: `import { ScrollProgress } from '@scrollcraft/react';

// Global top bar
<ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-violet-600 origin-left" />

// Target element scoped
<ScrollProgress target={myRef} className="h-2 bg-emerald-500 origin-left" />`,
  },

  {
    id: 'scroll-transform',
    slug: 'scroll-transform',
    category: 'primitives',
    title: '<ScrollTransform>',
    shortDescription: 'Scrubbed GPU transforms with presets (zoom-in, 3d-flip, blur-in) and snap points.',
    fullDescription:
      '<ScrollTransform> maps scroll progress directly to 3D matrix properties (rotateX, rotateY, scale, translate3d, blur, opacity). Features built-in animation presets, snap point magnetics, and direct TransformComposer execution.',
    tags: ['3D Matrix', 'Scrubbed Motion', 'Presets', 'Snap Points', 'Compositor', 'asChild'],
    driver: 'Ticker Phase 3 (Compositor)',
    runwayHeight: '220vh',
    features: [
      'Direct GPU TransformComposer writes in Ticker Phase 3',
      'Built-in presets: zoom-in, fade-up, scale-down, blur-in, 3d-flip',
      'Custom property interpolation: y, scale, rotate, rotateX, opacity',
      'Magnetic snap points with onSnap callback',
      'Polymorphic asChild composition with zero-allocation cleanup',
    ],
    gotchas: [
      'When using custom property tuples (e.g. y: [100, 0]), ensure numeric bounds are properly scaled for your target viewport size.',
    ],
    props: [
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Applies transform matrix and ref directly to custom child element via Slot.' },
      { name: 'preset', type: "'zoom-in' | 'fade-up' | 'scale-down' | 'blur-in' | '3d-flip'", default: 'undefined', description: 'Built-in transform preset.' },
      { name: 'properties', type: 'Record<string, [number, number]>', default: 'undefined', description: 'Custom transform property keyframe mapping (e.g. { scale: [0.8, 1.2] }).' },
      { name: 'scrub', type: 'boolean | number', default: 'true', description: 'Scrubbing smoothing factor or boolean toggle.' },
      { name: 'snap', type: 'number[]', default: 'undefined', description: 'Array of progress snap points (e.g. [0, 0.5, 1]).' },
      { name: 'onSnap', type: '(snapPoint: number) => void', default: 'undefined', description: 'Callback fired when a snap point is engaged.' },
    ],
    knobs: [
      { id: 'preset', label: 'Preset', type: 'select', default: '3d-flip', options: ['3d-flip', 'zoom-in', 'blur-in', 'fade-up', 'scale-down'] },
      { id: 'scrub', label: 'Smooth Scrub', type: 'boolean', default: true },
    ],
    code: `import React from 'react';
import { ScrollTransform } from '@scrollcraft/react';

export function ScrollTransform3DStage() {
  return (
    <div className="relative min-h-[180vh] w-full flex items-center justify-center">
      <ScrollTransform
        preset="3d-flip"
        scrub={true}
        className="w-80 h-96 rounded-3xl border border-violet-500/40 bg-gradient-to-br from-violet-900/40 via-zinc-900 to-black p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between"
      >
        <div>
          <span className="text-xs font-mono uppercase text-violet-400 tracking-wider">3D GPU Flip</span>
          <h3 className="text-2xl font-bold text-white mt-2">Matrix Morphing</h3>
          <p className="text-sm text-zinc-400 mt-2">
            Transforms dynamically across scroll progress using direct hardware compositor writes.
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 font-mono text-xs text-zinc-500">
          <span>Preset: 3d-flip</span>
          <span className="text-emerald-400">0 Re-renders</span>
        </div>
      </ScrollTransform>
    </div>
  );
}`,
    usageCode: `import { ScrollTransform } from '@scrollcraft/react';

<ScrollTransform
  preset="3d-flip"
  scrub={true}
  snap={[0, 0.5, 1]}
  onSnap={(point) => console.log('Snapped to', point)}
>
  <div className="transform-card">3D Card Content</div>
</ScrollTransform>`,
  },

  {
    id: 'scroll-draw',
    slug: 'scroll-draw',
    category: 'primitives',
    title: '<ScrollDraw>',
    shortDescription: 'SVG geometry path drawing synchronized with scroll progress (strokeDashoffset).',
    fullDescription:
      '<ScrollDraw> calculates exact SVG path lengths and scrubs `strokeDashoffset` in lockstep with scroll progress. Supports universal SVG geometry elements (<path>, <circle>, <rect>, <line>, <polygon>) with custom dash arrays and onDrawProgress telemetry.',
    tags: ['SVG Path Drawing', 'Vector Animation', 'strokeDashoffset', 'Zero Re-renders', 'Geometry'],
    driver: 'Ticker Phase 3 (Compositor)',
    runwayHeight: '200vh',
    features: [
      'Universal SVG support (<path>, <circle>, <rect>, <line>, <polygon>)',
      'Real-time path length measurement via getTotalLength() and GlobalResizeManager',
      'Smooth scrubbing with direction="forward" or "reverse"',
      'Zero React re-renders during SVG stroke painting',
      'onDrawProgress callback for reactive stroke telemetry',
    ],
    gotchas: [
      'The SVG element must have a defined stroke and fill="none" (or transparent) to visibly showcase the path drawing progress.',
      'Ensure the SVG path data has clean winding coordinates.',
    ],
    props: [
      { name: 'direction', type: "'forward' | 'reverse'", default: "'forward'", description: 'Drawing progression direction.' },
      { name: 'scrub', type: 'boolean', default: 'true', description: 'Whether drawing scrubs directly with scroll.' },
      { name: 'dashArray', type: 'number | string', default: 'undefined', description: 'Custom SVG stroke-dasharray override.' },
      { name: 'onDrawProgress', type: '(progress: number) => void', default: 'undefined', description: 'Callback fired on every frame with normalized draw progress (0 to 1).' },
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Applies draw solver to custom SVG child geometry.' },
    ],
    knobs: [
      { id: 'direction', label: 'Direction', type: 'select', default: 'forward', options: ['forward', 'reverse'] },
      { id: 'scrub', label: 'Scrub With Scroll', type: 'boolean', default: true },
    ],
    code: `import React from 'react';
import { ScrollDraw } from '@scrollcraft/react';

export function SVGDrawEmblemDemo() {
  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center">
      <div className="w-80 h-80 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 flex items-center justify-center relative">
        <svg viewBox="0 0 200 200" className="w-64 h-64 overflow-visible" fill="none">
          {/* Background Guide Line */}
          <path
            d="M 20,100 Q 60,20 100,100 T 180,100"
            stroke="#27272a"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Active ScrollDraw Path */}
          <ScrollDraw
            d="M 20,100 Q 60,20 100,100 T 180,100"
            stroke="url(#gradient-draw)"
            strokeWidth="6"
            strokeLinecap="round"
            direction="forward"
            scrub={true}
          />
          <defs>
            <linearGradient id="gradient-draw" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}`,
    usageCode: `import { ScrollDraw } from '@scrollcraft/react';

<svg viewBox="0 0 100 100" fill="none">
  <ScrollDraw
    d="M 10,50 Q 30,10 50,50 T 90,50"
    stroke="#8b5cf6"
    strokeWidth="4"
    scrub={true}
  />
</svg>`,
  },

  // ==========================================
  // SECTION B: HIGH-PERFORMANCE COMPONENTS (7)
  // ==========================================
  {
    id: 'stacked-cards',
    slug: 'stacked-cards',
    category: 'components',
    title: '<StackedCards>',
    shortDescription: '120 FPS deck stacking solver with dynamic scale steps, z-index depth, and pointer gating.',
    fullDescription:
      '<StackedCards> calculates stacking deck physics on the fly. As cards scroll into view, they latch to the sticky threshold, stacking with subtle scaleStep reduction, z-index depth sorting, and pointer-events gating for interaction precision.',
    tags: ['Deck Solver', '120 FPS', 'Z-Index Depth', 'Pointer Gating', 'Zero Re-renders', 'asChild'],
    driver: 'JS Physics Solver',
    runwayHeight: '260vh',
    features: [
      'Dynamic sibling z-index depth scaling',
      'Dynamic individual card offsetHeight measurements via GlobalResizeManager',
      'Runtime pointer-events gating preventing background click interception',
      'Custom scaleStep and minScale for cinematic depth',
      'Configurable cardDistance and top pinning offset',
      'Polymorphic asChild composition for custom container tags',
    ],
    gotchas: [
      'The parent must have adequate scroll height (default: cards.length * cardDistance + 600px).',
      'Do not apply CSS transitions to transform on the card container, as the ticker handles 120 FPS rendering directly.',
    ],
    props: [
      { name: 'cards', type: 'React.ReactNode[]', default: '[]', description: 'Array of React card nodes to stack sequentially (or pass directly as children).' },
      { name: 'children', type: 'React.ReactNode', default: 'undefined', description: 'Direct child card elements to stack without requiring the cards prop array.' },
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Renders custom container element (e.g. <section>) instead of default <div>.' },
      { name: 'offset', type: 'number', default: '40', description: 'Vertical offset between stacked cards in pixels.' },
      { name: 'top', type: 'number', default: '100', description: 'Top pinning threshold in pixels.' },
      { name: 'scaleStep', type: 'number', default: '0.05', description: 'Scale reduction factor per stacked card.' },
      { name: 'minScale', type: 'number', default: '0.8', description: 'Minimum scale clamp for deepest stacked card.' },
      { name: 'cardDistance', type: 'number', default: '400', description: 'Scroll distance per card transition.' },
      { name: 'height', type: 'string | number', default: 'undefined', description: 'Custom runway height override (defaults to cards.length * (cardDistance + 350) + 800px).' },
    ],
    knobs: [
      { id: 'offset', label: 'Stack Offset (px)', type: 'number', default: 36, min: 10, max: 80, step: 2 },
      { id: 'top', label: 'Top Offset (px)', type: 'number', default: 110, min: 50, max: 200, step: 10 },
      { id: 'scaleStep', label: 'Scale Step', type: 'number', default: 0.05, min: 0.01, max: 0.1, step: 0.01 },
    ],
    code: `import React from 'react';
import { StackedCards } from '@scrollcraft/react';

export function StackedCardsShowcase() {
  return (
    <div className="w-full py-12">
      <StackedCards offset={40} top={110} scaleStep={0.05} minScale={0.85} cardDistance={400}>
        <div className="w-full max-w-xl mx-auto h-64 rounded-3xl border border-violet-500/30 bg-[#0d0e15] p-8 shadow-2xl">
          <span className="text-xs font-mono text-violet-400">CARD 01</span>
          <h3 className="text-2xl font-bold text-white mt-2">Zero-Rerender Engine</h3>
          <p className="text-sm text-zinc-300 mt-2">Direct DOM matrix calculations avoid Virtual DOM thrashing.</p>
        </div>
        <div className="w-full max-w-xl mx-auto h-64 rounded-3xl border border-sky-500/30 bg-[#0d0e15] p-8 shadow-2xl">
          <span className="text-xs font-mono text-sky-400">CARD 02</span>
          <h3 className="text-2xl font-bold text-white mt-2">GSAP Parity Solvers</h3>
          <p className="text-sm text-zinc-300 mt-2">Pinning, velocity marquees, and horizontal panning built-in.</p>
        </div>
        <div className="w-full max-w-xl mx-auto h-64 rounded-3xl border border-emerald-500/30 bg-[#0d0e15] p-8 shadow-2xl">
          <span className="text-xs font-mono text-emerald-400">CARD 03</span>
          <h3 className="text-2xl font-bold text-white mt-2">Next.js App Router Native</h3>
          <p className="text-sm text-zinc-300 mt-2">Survives React 19 RSC streaming and route hydration without jumps.</p>
        </div>
      </StackedCards>
    </div>
  );
}`,
    usageCode: `import { StackedCards } from '@scrollcraft/react';

// Option A: Direct JSX children
<StackedCards offset={40} top={100} scaleStep={0.05}>
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</StackedCards>

// Option B: cards prop array
<StackedCards
  cards={[<Card1 />, <Card2 />, <Card3 />]}
  offset={40}
  top={100}
/>`,
  },

  {
    id: 'velocity-marquee',
    slug: 'velocity-marquee',
    category: 'components',
    title: '<VelocityMarquee>',
    shortDescription: 'Physics-driven velocity acceleration, direction reversal, and autonomous culling.',
    fullDescription:
      '<VelocityMarquee> runs an infinite continuous ribbon at base speed, dynamically accelerating when the user scrolls fast and gliding back down smoothly with spring damping. Offscreen instances are automatically paused to conserve battery.',
    tags: ['Marquee', 'Velocity Driven', 'Physics Spring', 'Smart Culling', 'Infinite Scroll'],
    driver: 'JS Physics Solver',
    runwayHeight: '180vh',
    features: [
      'Velocity-based acceleration with smooth decay',
      'Configurable baseSpeed and velocityMultiplier',
      'Direction inversion (forward / reverse)',
      'Smart compositor layer promotion',
      'Autonomous viewport visibility culling via globalVisibilityManager',
    ],
    gotchas: [
      'Ensure the inner content has sufficient duplicate elements to wrap seamlessly across the viewport width.',
    ],
    props: [
      { name: 'baseSpeed', type: 'number', default: '1', description: 'Base cruise speed in pixels per frame.' },
      { name: 'velocityMultiplier', type: 'number', default: '0.2', description: 'Acceleration sensitivity factor for scroll velocity.' },
      { name: 'direction', type: "'left' | 'right'", default: "'left'", description: 'Marquee scroll direction.' },
      { name: 'maxSpeed', type: 'number', default: '10', description: 'Maximum speed clamp.' },
    ],
    knobs: [
      { id: 'baseSpeed', label: 'Base Speed', type: 'number', default: 1.5, min: 0.5, max: 5, step: 0.5 },
      { id: 'velocityMultiplier', label: 'Velocity Multiplier', type: 'number', default: 0.3, min: 0.1, max: 1, step: 0.05 },
    ],
    code: `import React from 'react';
import { VelocityMarquee } from '@scrollcraft/react';

export function VelocityTickerStage() {
  return (
    <div className="w-full space-y-6 py-16 overflow-hidden">
      {/* Strip 1: Left */}
      <VelocityMarquee baseSpeed={1.5} velocityMultiplier={0.3} direction="left" className="py-2 border-y border-zinc-800 bg-zinc-950/60">
        <div className="flex items-center gap-12 font-mono text-2xl font-bold uppercase tracking-wider text-zinc-300">
          <span>⚡ SCROLLCRAFT ENGINE</span>
          <span className="text-violet-400">120 FPS MOTION</span>
          <span>ZERO REACT RE-RENDERS</span>
          <span className="text-emerald-400">HARDWARE COMPOSITOR</span>
        </div>
      </VelocityMarquee>

      {/* Strip 2: Right */}
      <VelocityMarquee baseSpeed={1.5} velocityMultiplier={0.3} direction="right" className="py-2 border-y border-zinc-800 bg-zinc-950/60">
        <div className="flex items-center gap-12 font-mono text-2xl font-bold uppercase tracking-wider text-zinc-400">
          <span className="text-fuchsia-400">VELOCITY ACCELERATION</span>
          <span>GSAP 4-STATE PARITY</span>
          <span className="text-sky-400">REACT 19 COMPATIBLE</span>
          <span>STRICT ENGINE ARCHITECTURE</span>
        </div>
      </VelocityMarquee>
    </div>
  );
}`,
    usageCode: `import { VelocityMarquee } from '@scrollcraft/react';

<VelocityMarquee baseSpeed={2} velocityMultiplier={0.25} direction="left">
  <div className="flex gap-8">
    <span>ACCELERATES WITH SCROLL</span>
  </div>
</VelocityMarquee>`,
  },

  {
    id: 'horizontal-scroll',
    slug: 'horizontal-scroll',
    category: 'components',
    title: '<HorizontalScroll>',
    shortDescription: 'Vertical-to-horizontal conversion in a sticky viewport with panoramic sliding.',
    fullDescription:
      '<HorizontalScroll> maps vertical window scrolling into horizontal translation across panoramic slides. Features automated scroll distance calculation based on track scrollWidth, sticky full-screen pinning, and zero layout jitter.',
    tags: ['Horizontal Scroll', 'Sticky Container', 'Panoramic Slides', '120 FPS', 'Compositor'],
    driver: 'JS Physics Solver',
    runwayHeight: '260vh',
    features: [
      'Vertical to horizontal translation mapping',
      'Dynamic container width measurement (parentElement.clientWidth) ensuring the final slide is never cut off in constrained containers',
      'Configurable speed multiplier or explicit height runway (e.g. height="350vh")',
      'Direct GPU translation writes via SmartCompositor',
      'Safe unmount and resize teardown',
    ],
    gotchas: [
      'Do not set overflow-x: scroll on the sticky container, as translation is managed imperatively via transforms.',
    ],
    props: [
      { name: 'speed', type: 'number', default: '2', description: 'Scroll height multiplier (speed * 100vh = total scroll runway).' },
      { name: 'height', type: 'string | number', default: 'undefined', description: 'Explicit scroll runway height override (e.g. "350vh" or 3200).' },
      { name: 'stickyClassName', type: 'string', default: "'sticky top-0 h-screen w-full overflow-hidden flex items-center'", description: 'CSS classes for the sticky viewport layer.' },
      { name: 'innerClassName', type: 'string', default: "''", description: 'CSS classes for the moving horizontal track.' },
    ],
    knobs: [
      { id: 'speed', label: 'Runway Speed Multiplier', type: 'number', default: 1.5, min: 1.0, max: 4, step: 0.5 },
    ],
    code: `import React from 'react';
import { HorizontalScroll } from '@scrollcraft/react';

export function PanoramicHorizontalShowcase() {
  const slides = [
    { title: 'Obsidian Theme', desc: 'Precision engineered for high-contrast dark interfaces.', color: 'from-violet-900/40' },
    { title: 'Zero Re-renders', desc: 'Preserves 120 FPS regardless of scroll gesture intensity.', color: 'from-sky-900/40' },
    { title: 'Sub-650 LOC', desc: 'Audited codebase guarantees zero bundle bloat.', color: 'from-emerald-900/40' },
    { title: 'RSC Native', desc: 'Runs seamlessly with Next.js 15 App Router streaming.', color: 'from-fuchsia-900/40' },
  ];

  return (
    <HorizontalScroll speed={2.5} height="350vh" className="w-full">
      <div className="flex gap-8 px-12">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={\`w-[420px] h-[360px] flex-shrink-0 rounded-3xl border border-zinc-800 bg-gradient-to-br \${slide.color} to-zinc-900 p-8 flex flex-col justify-between shadow-2xl glass-card\`}
          >
            <span className="text-xs font-mono text-zinc-400">SLIDE 0{idx + 1}</span>
            <div>
              <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
              <p className="text-sm text-zinc-400 mt-2">{slide.desc}</p>
            </div>
            <span className="text-xs font-mono text-violet-400">Horizontal Pan Active →</span>
          </div>
        ))}
      </div>
    </HorizontalScroll>
  );
}`,
    usageCode: `import { HorizontalScroll } from '@scrollcraft/react';

<HorizontalScroll speed={2.5} height="350vh">
  <div className="flex gap-8">
    <div className="slide">Slide 1</div>
    <div className="slide">Slide 2</div>
  </div>
</HorizontalScroll>`,
  },

  {
    id: 'scroll-sequence',
    slug: 'scroll-sequence',
    category: 'components',
    title: '<ScrollSequence>',
    shortDescription: 'HTML5 canvas 2D frame drawing with LRU caching, speed control, and poster fallback.',
    fullDescription:
      '<ScrollSequence> renders high-framerate image sequences directly into an HTML5 2D canvas synced to scroll progress. Features LRU frame memory caching, device pixel ratio scaling (maxDpr), poster image fallback, and zero garbage collection thrashing.',
    tags: ['Canvas 2D', 'LRU Cache', 'Frame Sequence', 'Zero GC Thrash', 'High Framerate'],
    driver: 'Ticker Phase 4 (Canvas 2D / LRU)',
    runwayHeight: '400vh',
    features: [
      'HTML5 Canvas 2D frame drawing with sub-pixel rendering',
      'Built-in sliding LRU frame caching preventing mobile Safari VRAM Jetsam crashes',
      'Configurable maxDpr preventing GPU memory spikes on Retina screens',
      'Immediate poster preview fallback while frames buffer',
      'Built-in children overlay pinning inside sticky presentation viewport',
      'Full window resize recalculation',
    ],
    gotchas: [
      'Serve static frame images with immutable caching in next.config.js: async headers() { return [{ source: "/sequence/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }]; }',
      'Preload the first 10-15 sequence frames in <head> to eliminate initial blank frame hitching: <link rel="preload" as="image" href="/sequence/chrono-watch/frame-001.webp" />',
    ],
    props: [
      { name: 'frames', type: 'string[]', default: '[]', description: 'Array of image frame URLs in playback sequence order.' },
      { name: 'speed', type: 'number', default: '1', description: 'Playback speed multiplier relative to scroll.' },
      { name: 'maxDpr', type: 'number', default: '2', description: 'Maximum device pixel ratio clamp.' },
      { name: 'poster', type: 'string', default: 'undefined', description: 'Immediate fallback image rendered before frames load.' },
      { name: 'height', type: 'string | number', default: "'300vh'", description: 'Total scroll runway height for sequence scrubbing.' },
      { name: 'fit', type: "'contain' | 'cover'", default: "'contain'", description: 'Preserve frame aspect ratio without clipping (contain) or stretch to fill canvas (cover).' },
      { name: 'children', type: 'React.ReactNode', default: 'undefined', description: 'Optional overlays or elements rendered inside the pinned sticky presentation container.' },
    ],
    knobs: [
      { id: 'fit', label: 'Fit Mode', type: 'select', default: 'contain', options: ['contain', 'cover'] },
      { id: 'speed', label: 'Speed', type: 'number', default: 1, min: 0.5, max: 2.5, step: 0.25 },
      { id: 'maxDpr', label: 'Max DPR', type: 'number', default: 2, min: 1, max: 3, step: 0.5 },
    ],
    code: `import React from 'react';
import { ScrollSequence } from '@scrollcraft/react';

export function ProductRevealSequence() {
  const FRAME_COUNT = 90;
  const frames = Array.from({ length: FRAME_COUNT }, (_, i) =>
    \`/sequence/chrono-watch/frame-\${String(i + 1).padStart(3, '0')}.webp\`
  );

  return (
    <div className="relative w-full bg-black">
      <ScrollSequence
        frames={frames}
        speed={1}
        maxDpr={2}
        poster="/sequence/chrono-watch/poster.webp"
        height="400vh"
        className="w-full"
      >
        {/* Pinned Hero overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-12 text-center px-4">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
            Chrono · Automatic
          </span>
          <h1 className="mt-2 text-4xl sm:text-6xl font-light tracking-tight text-white">
            Engineered Precision.
          </h1>
          <p className="mt-2 max-w-sm mx-auto text-xs text-zinc-400">
            Scroll to explore the 360° internal mechanics and high-frequency escapement.
          </p>
        </div>

        {/* Bottom specs overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-around text-center max-w-3xl mx-auto px-6">
          <div>
            <div className="text-xl font-bold text-white">36,000</div>
            <div className="text-xs text-zinc-500">VPH BEAT RATE</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">68 HRS</div>
            <div className="text-xs text-zinc-500">POWER RESERVE</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">300 M</div>
            <div className="text-xs text-zinc-500">WATER RESISTANCE</div>
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}`,
    usageCode: `import { ScrollSequence } from '@scrollcraft/react';

<ScrollSequence
  frames={Array.from({ length: 90 }, (_, i) => \`/sequence/chrono-watch/frame-\${String(i + 1).padStart(3, '0')}.webp\`)}
  speed={1}
  maxDpr={2}
  poster="/sequence/chrono-watch/poster.webp"
  height="400vh"
>
  <div className="pointer-events-none absolute inset-x-0 top-12 text-center">
    <h1 className="text-4xl font-bold text-white">Chrono · Automatic</h1>
  </div>
</ScrollSequence>`,
  },

  {
    id: 'text-reveal',
    slug: 'text-reveal',
    category: 'components',
    title: '<TextReveal>',
    shortDescription: 'Word and character kinetic split with optical blur, 3D tilt, and range triggers.',
    fullDescription:
      '<TextReveal> splits editorial text by words or characters and progressively illuminates them as the element scrolls through a customizable viewport range (e.g. \`[0.15, 0.85]\`). Features optical blur, 3D rotateX tilt, and kinetic scaling.',
    tags: ['Typography', 'Kinetic Split', 'Optical Blur', 'Range Scrubbing', '3D Tilt', 'asChild'],
    driver: 'Ticker Phase 3 (Compositor)',
    runwayHeight: '180vh',
    features: [
      'Split by words (by="words") or characters (by="chars")',
      'Optical blur de-focusing as letters activate',
      'Autonomous sticky container detection and runway tracking',
      'Natural ergonomic reading viewport zone ([0.80, 0.25]) preventing premature bottom/taskbar reveals',
      'Soft kinetic overlap (overlap: 0.25) ensuring continuous editorial reading flow',
      '3D rotateX and scale kinetic entrance',
      'Direct DOM span updates with zero Virtual DOM re-renders',
      'Polymorphic asChild composition for semantic headings (<h1>, <h2>, etc.)',
    ],
    gotchas: [
      'In normal document flow, TextReveal illuminates as lines reach the natural reading viewport band (80% down to 25% from top). When inside sticky containers (sticky top-*), it automatically tracks the pinned parent runway without manual offset adjustments.',
      'Provide plain text as the direct child string so the split algorithm can calculate exact word and character indices.',
    ],
    props: [
      { name: 'children', type: 'React.ReactNode', default: "''", description: 'Text content (or child element when asChild is active) to split and reveal kinetically.' },
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Renders custom heading element (e.g. <h1>) instead of default <p> without extra wrapper.' },
      { name: 'by', type: "'chars' | 'words'", default: "'chars'", description: 'Splitting granularity.' },
      { name: 'range', type: '[number, number]', default: '[0, 1]', description: 'Normalized viewport entry and exit range [start, end].' },
      { name: 'blur', type: 'number', default: '8', description: 'Initial optical blur in pixels.' },
      { name: 'scale', type: 'number', default: '0.9', description: 'Initial scale factor.' },
      { name: 'rotateX', type: 'number', default: '35', description: 'Initial 3D X-axis tilt in degrees.' },
      { name: 'baseOpacity', type: 'number', default: '0', description: 'Initial base opacity for unrevealed characters.' },
      { name: 'slide', type: 'number', default: '20', description: 'Initial vertical slide offset in pixels.' },
    ],
    knobs: [
      { id: 'by', label: 'Split By', type: 'select', default: 'chars', options: ['chars', 'words'] },
      { id: 'blur', label: 'Blur (px)', type: 'number', default: 8, min: 0, max: 20, step: 1 },
      { id: 'rotateX', label: 'RotateX (deg)', type: 'number', default: 35, min: 0, max: 60, step: 5 },
    ],
    code: `import React from 'react';
import { TextReveal } from '@scrollcraft/react';

export function KineticTypographyDemo() {
  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400">Kinetic Editorial Split</span>
        <TextReveal
          by="chars"
          blur={8}
          scale={0.88}
          rotateX={35}
          baseOpacity={0}
          range={[0.1, 0.9]}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
        >
          Declarative scroll physics with zero React re-renders. Every character illuminates and flips in 3D in sync with your gesture.
        </TextReveal>
      </div>
    </div>
  );
}`,
    usageCode: `import { TextReveal } from '@scrollcraft/react';

<TextReveal by="chars" blur={8} rotateX={35} baseOpacity={0} range={[0.1, 0.9]}>
  Fluid kinetic typography powered by ScrollCraft.
</TextReveal>`,
  },

  {
    id: 'magnetic',
    slug: 'magnetic',
    category: 'components',
    title: '<Magnetic>',
    shortDescription: 'Spring physics cursor attraction with inner icon multi-layer parallax.',
    fullDescription:
      '<Magnetic> creates fluid magnetic attraction toward the cursor within a defined radius. Features spring physics with configurable stiffness and damping, scaling on hover, and an innerTargetRef for dual-layer parallax motion.',
    tags: ['Spring Physics', 'Cursor Magnetism', 'Dual-Layer Parallax', 'Zero Re-renders', 'Interactive', 'asChild'],
    driver: 'JS Physics Solver',
    runwayHeight: '120vh',
    features: [
      'Spring physics with stiffness, damping, and attraction strength',
      'Configurable attraction radius and scale amplification',
      'Dual-layer parallax support via innerTargetRef and innerStrength',
      'Polymorphic asChild composition',
      'Autonomous reduced-motion clearance',
    ],
    gotchas: [
      'For best effect, keep the button within reasonable bounding box bounds so cursor exit releases cleanly without slingshot overshoot.',
    ],
    props: [
      { name: 'asChild', type: 'boolean', default: 'false', description: 'Merges magnetic physics spring handlers and ref onto child element.' },
      { name: 'strength', type: 'number', default: '0.3', description: 'Magnetic attraction strength multiplier.' },
      { name: 'radius', type: 'number', default: '150', description: 'Detection radius in pixels from element center.' },
      { name: 'stiffness', type: 'number', default: '150', description: 'Spring stiffness.' },
      { name: 'damping', type: 'number', default: '15', description: 'Spring damping factor.' },
      { name: 'scale', type: 'number', default: '1.05', description: 'Scale factor on cursor hover.' },
      { name: 'innerTargetRef', type: 'React.RefObject<HTMLElement | null>', default: 'undefined', description: 'Target for multi-layer inner icon attraction.' },
      { name: 'innerStrength', type: 'number', default: '0.6', description: 'Inner element attraction strength multiplier.' },
      { name: 'respectReducedMotion', type: 'boolean', default: 'true', description: 'Whether magnetic attraction automatically disables when prefers-reduced-motion is active.' },
    ],
    knobs: [
      { id: 'strength', label: 'Attraction Strength', type: 'number', default: 0.35, min: 0.1, max: 0.8, step: 0.05 },
      { id: 'radius', label: 'Radius (px)', type: 'number', default: 160, min: 60, max: 300, step: 10 },
      { id: 'stiffness', label: 'Stiffness', type: 'number', default: 180, min: 50, max: 400, step: 10 },
    ],
    code: `import React, { useRef } from 'react';
import { Magnetic } from '@scrollcraft/react';
import { Sparkles } from 'lucide-react';

export function MagneticButtonShowcase() {
  const innerIconRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center">
      <Magnetic
        strength={0.35}
        radius={160}
        stiffness={180}
        damping={15}
        scale={1.08}
        innerTargetRef={innerIconRef}
        innerStrength={0.65}
      >
        <button className="relative group px-10 py-5 rounded-full border border-violet-500/40 bg-zinc-900/90 text-white font-semibold text-lg shadow-2xl backdrop-blur-xl flex items-center gap-4 hover:border-violet-400 transition-colors">
          <span>Explore Test Lab</span>
          <span ref={innerIconRef} className="p-2 rounded-full bg-violet-600/30 text-violet-300">
            <Sparkles className="w-5 h-5" />
          </span>
        </button>
      </Magnetic>
    </div>
  );
}`,
    usageCode: `import { Magnetic } from '@scrollcraft/react';

<Magnetic strength={0.35} radius={150}>
  <button className="btn">Magnetic Button</button>
</Magnetic>`,
  },

  {
    id: 'skew-gallery',
    slug: 'skew-gallery',
    category: 'components',
    title: '<SkewGallery>',
    shortDescription: 'Velocity-driven dynamic skewY distortion with smooth spring damping.',
    fullDescription:
      '<SkewGallery> dynamically calculates scroll velocity and applies proportional skewY matrix distortion to image grids. When the user stops scrolling, the skew smoothly recovers back to 0deg with spring damping.',
    tags: ['Velocity Distortion', 'Skew Matrix', 'Spring Damping', 'Gallery Grid', '120 FPS'],
    driver: 'JS Physics Solver',
    runwayHeight: '220vh',
    features: [
      'Real-time skewY distortion proportional to scroll velocity',
      'Smooth spring damping recovery when scroll halts',
      'Configurable distortion intensity multiplier',
      'Direct TransformComposer writes avoiding React Virtual DOM updates',
      'Automatic reduced-motion safety bypass',
    ],
    gotchas: [
      'Built-in velocity clamping prevents disorienting distortions while maintaining tangible, tactile skew physics.',
    ],
    props: [
      { name: 'images', type: 'string[]', default: '[]', description: 'Array of image URLs to display in the skewed gallery grid.' },
      { name: 'intensity', type: 'number', default: '1.8', description: 'Distortion intensity factor.' },
      { name: 'className', type: 'string', default: "''", description: 'Custom CSS classes for container.' },
    ],
    knobs: [
      { id: 'intensity', label: 'Skew Intensity', type: 'number', default: 1.8, min: 0.5, max: 3.5, step: 0.1 },
    ],
    code: `import React from 'react';
import { SkewGallery } from '@scrollcraft/react';

export function SkewGalleryShowcase() {
  const images = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-16">
      <SkewGallery images={images} intensity={1.8} />
    </div>
  );
}`,
    usageCode: `import { SkewGallery } from '@scrollcraft/react';

<SkewGallery images={imageUrls} intensity={1.8} />`,
  },

  // ==========================================
  // SECTION C: ADVANCED HOOKS (12)
  // ==========================================
  {
    id: 'use-parallax',
    slug: 'use-parallax',
    category: 'hooks',
    title: 'useParallax',
    shortDescription: 'Headless hook mode with direct DOM ref binding and custom speed limits.',
    fullDescription:
      '`useParallax` binds 120 FPS depth translation directly to any DOM element ref. Ideal for custom canvas canvases, WebGL scenes, or custom components that require headless parallax without wrapper div elements.',
    tags: ['Headless Hook', 'Direct DOM Ref', 'Zero Re-renders', 'Depth Math'],
    driver: 'Headless Hook',
    runwayHeight: '200vh',
    features: [
      'Headless DOM ref binding without extra wrapper markup',
      'Configurable speed, min/max clamps, and origin calculation',
      'Bleed margin support for background fills',
      'Zero React re-renders during active scrolling',
    ],
    gotchas: [
      'Ensure the element ref is attached to a rendered DOM node before scroll triggers fire.',
    ],
    props: [
      { name: 'speed', type: 'number', default: '0.2', description: 'Parallax speed factor.' },
      { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Translation axis.' },
      { name: 'min', type: 'number', default: 'undefined', description: 'Minimum pixel clamp.' },
      { name: 'max', type: 'number', default: 'undefined', description: 'Maximum pixel clamp.' },
    ],
    code: `import React from 'react';
import { useParallax } from '@scrollcraft/react';

export function HeadlessParallaxExample() {
  const cardRef = useParallax<HTMLDivElement>({ speed: 0.4, min: -80, max: 80 });

  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center">
      <div ref={cardRef} className="w-72 h-72 rounded-3xl border border-violet-500/30 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-xl">
        <span className="text-xs font-mono text-violet-400">Headless useParallax</span>
        <h4 className="text-xl font-bold text-white mt-2">Zero Markup Bloat</h4>
      </div>
    </div>
  );
}`,
    usageCode: `import { useParallax } from '@scrollcraft/react';

const ref = useParallax<HTMLDivElement>({ speed: 0.35 });
return <div ref={ref}>Parallax Element</div>;`,
  },

  {
    id: 'use-reveal',
    slug: 'use-reveal',
    category: 'hooks',
    title: 'useReveal',
    shortDescription: 'Programmatic and ref-forwarding reveal triggers with observer batching.',
    fullDescription:
      '`useReveal` applies viewport entrance animations via direct element refs. Supports directional entrance, distance, optical blur, scale, rotateX tilt, and batch-optimized observer scheduling.',
    tags: ['Headless Hook', 'Observer Batching', 'Entrance Animation', 'Zero Re-renders'],
    driver: 'Headless Hook',
    runwayHeight: '180vh',
    features: [
      'Dual API: headless hook (`const ref = useReveal(opts)`) or ref-forwarding (`useReveal(ref, opts)`)',
      'Batch-optimized observer subscription without scroll lag',
      'Configurable direction, distance, duration, delay, blur, scale, rotateX',
    ],
    gotchas: [
      'When animating multiple cards, use the delay parameter to create staggered sequences.',
    ],
    props: [
      { name: 'direction', type: "'up' | 'down' | 'left' | 'right' | 'none'", default: "'up'", description: 'Slide direction.' },
      { name: 'distance', type: 'number', default: '40', description: 'Entrance travel distance in pixels.' },
      { name: 'blur', type: 'number', default: '0', description: 'Optical blur transition in pixels.' },
    ],
    code: `import React from 'react';
import { useReveal } from '@scrollcraft/react';

export function HeadlessRevealExample() {
  const cardRef = useReveal<HTMLDivElement>({ direction: 'up', distance: 50, blur: 8, rotateX: 12 });

  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center">
      <div ref={cardRef} className="w-80 rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl">
        <span className="text-xs font-mono text-emerald-400">Headless useReveal</span>
        <h4 className="text-xl font-bold text-white mt-2">3D Tilt & Optical Blur</h4>
      </div>
    </div>
  );
}`,
    usageCode: `import { useReveal } from '@scrollcraft/react';

const ref = useReveal<HTMLDivElement>({ direction: 'up', distance: 40, blur: 6 });
return <div ref={ref}>Reveals on Scroll</div>;`,
  },

  {
    id: 'use-pin',
    slug: 'use-pin',
    category: 'hooks',
    title: 'usePin',
    shortDescription: 'Dual API pinning hook: progress, isPinned, pinOffsetY, and GSAP lifecycle.',
    fullDescription:
      '`usePin` provides headless sticky pinning control. Offers dual APIs: pure headless (`const { ref, isPinned, progress } = usePin(opts)`) or direct ref binding with GSAP 4-state lifecycle callbacks.',
    tags: ['Headless Hook', 'GSAP Lifecycle', 'Sticky Controller', 'trackState'],
    driver: 'Headless Hook',
    runwayHeight: '220vh',
    features: [
      'Dual API: headless or ref-forwarding',
      'Zero-rerender observable progressValue or reactive trackState',
      'GSAP 4-State Lifecycle (onEnter, onLeave, onEnterBack, onLeaveBack)',
      'Configurable top offset & automatic pinSpacing compensation',
    ],
    gotchas: [
      'Enable trackState: true only if you need React state (like badge colors) to update based on pin engagement.',
    ],
    props: [
      { name: 'top', type: 'number', default: '0', description: 'Top pinning offset.' },
      { name: 'duration', type: 'number | string', default: 'undefined', description: 'Pin lock duration.' },
      { name: 'trackState', type: 'boolean', default: 'false', description: 'Enables reactive state updates.' },
    ],
    code: `import React from 'react';
import { usePin } from '@scrollcraft/react';

export function HeadlessPinDemo() {
  const { ref, isPinned, progress } = usePin<HTMLDivElement>({
    top: 100,
    trackState: true,
  });

  return (
    <div className="min-h-[220vh] w-full py-16">
      <div ref={ref} className="max-w-md mx-auto rounded-3xl border border-violet-500/30 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-violet-400">usePin Hook</span>
          <span className={\`text-xs font-mono font-bold px-2 py-0.5 rounded \${isPinned ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400'}\`}>
            {isPinned ? 'PINNED' : 'UNPINNED'}
          </span>
        </div>
        <h4 className="text-xl font-bold text-white mt-4">Headless Sticky Pin</h4>
        <div className="mt-4 font-mono text-xs text-zinc-400">
          Pin Progress: <span className="text-violet-300 font-bold">{(progress * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}`,
    usageCode: `import { usePin } from '@scrollcraft/react';

const { ref, isPinned, progress } = usePin<HTMLDivElement>({
  top: 80,
  trackState: true,
});`,
  },

  {
    id: 'use-scroll-progress',
    slug: 'use-scroll-progress',
    category: 'hooks',
    title: 'useScrollProgress',
    shortDescription: 'Target-scoped element progression with offsets and onProgress callback.',
    fullDescription:
      '`useScrollProgress` measures normalized scroll progression (0.0 to 1.0) of any target DOM element with configurable viewport trigger offsets (e.g. \`["top bottom", "bottom top"]\`).',
    tags: ['Headless Hook', 'Progress Math', 'Target Scoped', 'Zero Re-renders'],
    driver: 'Headless Hook',
    runwayHeight: '180vh',
    features: [
      'Target element binding with custom viewport offsets',
      'Reactive onProgress callback without Virtual DOM thrashing',
      'Zero-allocation ticker subscription',
    ],
    gotchas: [
      'Specify offset triggers cleanly to match your desired start and end alignment in the viewport.',
    ],
    props: [
      { name: 'offset', type: '[string, string]', default: "['top bottom', 'bottom top']", description: 'Trigger alignment pair.' },
      { name: 'onProgress', type: '(progress: number) => void', default: 'undefined', description: 'Progress callback.' },
    ],
    code: `import React, { useState } from 'react';
import { useScrollProgress } from '@scrollcraft/react';

export function HeadlessProgressDemo() {
  const [percent, setPercent] = useState(0);
  const ref = useScrollProgress<HTMLDivElement>({
    offset: ['top bottom', 'bottom top'],
    onProgress: (p) => setPercent(Math.round(p * 100)),
  });

  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center">
      <div ref={ref} className="w-80 rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl text-center">
        <span className="text-xs font-mono text-violet-400">useScrollProgress</span>
        <div className="text-5xl font-black text-white font-mono my-4">{percent}%</div>
        <p className="text-xs text-zinc-400">Target Element Viewport Progress</p>
      </div>
    </div>
  );
}`,
    usageCode: `import { useScrollProgress } from '@scrollcraft/react';

const ref = useScrollProgress<HTMLDivElement>({
  offset: ['top bottom', 'bottom top'],
  onProgress: (p) => console.log('Progress:', p),
});`,
  },

  {
    id: 'use-scroll-transform',
    slug: 'use-scroll-transform',
    category: 'hooks',
    title: 'useScrollTransform',
    shortDescription: 'Direct compositor hook driving 3D rotation and scale without React state updates.',
    fullDescription:
      '`useScrollTransform` drives direct GPU matrix transforms on element refs without causing React state changes. Supports presets, custom property mappings, and snap points.',
    tags: ['Headless Hook', 'Compositor', '3D Matrix', 'Zero Re-renders'],
    driver: 'Headless Hook',
    runwayHeight: '200vh',
    features: [
      'Direct TransformComposer writes in Ticker Phase 3',
      'Preset support: zoom-in, fade-up, scale-down, blur-in, 3d-flip',
      'Magnetic snap point integration',
    ],
    gotchas: [
      'Ensure the element ref is attached to a valid DOM node.',
    ],
    props: [
      { name: 'preset', type: 'string', default: 'undefined', description: 'Transform preset name.' },
      { name: 'scrub', type: 'boolean', default: 'true', description: 'Scrubbing enabled.' },
    ],
    code: `import React from 'react';
import { useScrollTransform } from '@scrollcraft/react';

export function HeadlessTransformDemo() {
  const ref = useScrollTransform<HTMLDivElement>({
    preset: 'zoom-in',
    scrub: true,
  });

  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center">
      <div ref={ref} className="w-72 h-72 rounded-3xl border border-violet-500/30 bg-zinc-900/90 p-6 shadow-2xl flex flex-col justify-between">
        <span className="text-xs font-mono text-violet-400">useScrollTransform</span>
        <h4 className="text-xl font-bold text-white">Preset: zoom-in</h4>
        <span className="text-xs text-emerald-400 font-mono">0 Re-renders on Scroll</span>
      </div>
    </div>
  );
}`,
    usageCode: `import { useScrollTransform } from '@scrollcraft/react';

const ref = useScrollTransform<HTMLDivElement>({
  preset: 'zoom-in',
  scrub: true,
});`,
  },

  {
    id: 'use-scroll-draw',
    slug: 'use-scroll-draw',
    category: 'hooks',
    title: 'useScrollDraw',
    shortDescription: 'Headless SVG path draw hook controlling custom SVG geometry with zero re-renders.',
    fullDescription:
      '`useScrollDraw` measures SVG geometry lengths and writes directly to `strokeDashoffset` on every animation frame in Ticker Phase 3.',
    tags: ['Headless Hook', 'SVG Draw', 'strokeDashoffset', 'Zero Re-renders'],
    driver: 'Headless Hook',
    runwayHeight: '180vh',
    features: [
      'Direct ref binding to any SVGGeometryElement (<path>, <circle>, <polygon>, etc.)',
      'Dynamic length measurement via getTotalLength() and GlobalResizeManager',
      'Forward and reverse drawing directions',
    ],
    gotchas: [
      'The target SVG geometry must have a stroke defined to be visible.',
    ],
    props: [
      { name: 'direction', type: "'forward' | 'reverse'", default: "'forward'", description: 'Draw direction.' },
      { name: 'scrub', type: 'boolean', default: 'true', description: 'Scrub with scroll.' },
    ],
    code: `import React from 'react';
import { useScrollDraw } from '@scrollcraft/react';

export function HeadlessDrawDemo() {
  const pathRef = useScrollDraw<SVGPathElement>({ direction: 'forward', scrub: true });

  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-48 h-48 overflow-visible" fill="none">
        <circle cx="50" cy="50" r="40" stroke="#27272a" strokeWidth="4" />
        <path ref={pathRef} d="M 10 50 A 40 40 0 0 0 90 50 A 40 40 0 0 0 10 50" stroke="#8b5cf6" strokeWidth="4" />
      </svg>
    </div>
  );
}`,
    usageCode: `import { useScrollDraw } from '@scrollcraft/react';

const pathRef = useScrollDraw<SVGPathElement>({ scrub: true });
return <path ref={pathRef} d="..." stroke="#8b5cf6" />;`,
  },

  {
    id: 'use-magnetic',
    slug: 'use-magnetic',
    category: 'hooks',
    title: 'useMagnetic',
    shortDescription: 'Headless button interaction hook with inner icon spring dynamics.',
    fullDescription:
      '`useMagnetic` attaches spring physics cursor attraction to any ref. Enables interactive magnetic buttons and controls without wrapping in custom components.',
    tags: ['Headless Hook', 'Spring Physics', 'Cursor Magnetism', 'Interactive'],
    driver: 'Headless Hook',
    runwayHeight: '100vh',
    features: [
      'Direct ref binding to any interactive element',
      'Configurable strength, radius, stiffness, and damping',
      'Multi-layer inner element attraction support',
    ],
    gotchas: [
      'Works best with interactive elements (buttons, links, badges).',
    ],
    props: [
      { name: 'strength', type: 'number', default: '0.3', description: 'Attraction strength.' },
      { name: 'radius', type: 'number', default: '150', description: 'Detection radius in pixels.' },
    ],
    code: `import React, { useRef } from 'react';
import { useMagnetic } from '@scrollcraft/react';

export function HeadlessMagneticDemo() {
  const btnRef = useRef<HTMLButtonElement>(null);
  useMagnetic(btnRef, { strength: 0.4, radius: 180 });

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center">
      <button ref={btnRef} className="px-8 py-4 rounded-full border border-violet-500/40 bg-zinc-900 text-white font-bold shadow-2xl">
        Headless Magnetic Button
      </button>
    </div>
  );
}`,
    usageCode: `import { useMagnetic } from '@scrollcraft/react';

const btnRef = useRef<HTMLButtonElement>(null);
useMagnetic(btnRef, { strength: 0.35 });`,
  },

  {
    id: 'use-scroll-timeline',
    slug: 'use-scroll-timeline',
    category: 'hooks',
    title: 'useScrollTimeline',
    shortDescription: 'Multi-keyframe choreography driving complex sequences across scroll percentage.',
    fullDescription:
      '`useScrollTimeline` animates multiple properties across arbitrary progress keyframes (e.g. \`0% -> scale 1, 50% -> rotate 45deg, 100% -> opacity 0\`). Operates directly in Ticker Phase 3 with 0 re-renders.',
    tags: ['Multi-Keyframe', 'Choreography', 'Timeline Solver', 'Zero Re-renders'],
    driver: 'Headless Hook',
    runwayHeight: '220vh',
    features: [
      'Choreographed multi-keyframe animations across scroll %',
      'Interpolates opacity, scale, rotate, rotateX, rotateY, and translate',
      'Direct GPU compositor writes with zero Virtual DOM updates',
    ],
    gotchas: [
      'Sort your keyframe progress steps in ascending order from 0.0 to 1.0.',
    ],
    props: [
      { name: 'keyframes', type: 'Array<{ progress: number; transform?: any; opacity?: number }>', default: '[]', description: 'Keyframe sequence configuration.' },
    ],
    code: `import React from 'react';
import { useScrollTimeline } from '@scrollcraft/react';

export function TimelineChoreographyDemo() {
  const cardRef = useScrollTimeline<HTMLDivElement>({
    keyframes: [
      { progress: 0, opacity: 0.3, transform: { scale: 0.8, rotate: -15 } },
      { progress: 0.5, opacity: 1, transform: { scale: 1.1, rotate: 0 } },
      { progress: 1.0, opacity: 0.4, transform: { scale: 0.9, rotate: 15 } },
    ],
  });

  return (
    <div className="min-h-[200vh] w-full flex items-center justify-center">
      <div ref={cardRef} className="w-80 h-80 rounded-3xl border border-violet-500/40 bg-zinc-900/90 p-8 shadow-2xl flex flex-col justify-between">
        <span className="text-xs font-mono text-violet-400">useScrollTimeline</span>
        <h4 className="text-2xl font-bold text-white">Choreographed Keyframes</h4>
        <span className="text-xs font-mono text-zinc-400">0% → 50% → 100%</span>
      </div>
    </div>
  );
}`,
    usageCode: `import { useScrollTimeline } from '@scrollcraft/react';

const ref = useScrollTimeline<HTMLDivElement>({
  keyframes: [
    { progress: 0, opacity: 0.2, transform: { scale: 0.8 } },
    { progress: 1, opacity: 1, transform: { scale: 1.2 } },
  ],
});`,
  },

  {
    id: 'use-scroll-direction',
    slug: 'use-scroll-direction',
    category: 'hooks',
    title: 'useScrollDirection',
    shortDescription: 'iOS rubber-band guard, dual-threshold hysteresis, and sticky header auto-hide.',
    fullDescription:
      '`useScrollDirection` detects scroll direction (\`up\` | \`down\`) with iOS Safari rubber-band bounce guard (scrollY <= 0 locks to up) and dual-threshold directional hysteresis (15px down, 25px up). Supports direct GPU auto-hide writes with 0 React re-renders.',
    tags: ['iOS Bounce Guard', 'Hysteresis', 'Auto-Hide Header', 'Zero Re-renders'],
    driver: 'Headless Hook',
    runwayHeight: '200vh',
    features: [
      'iOS Safari rubber-band bounce guard (prevents false down flick at page top)',
      'Dual-threshold hysteresis (thresholdDown: 15, thresholdUp: 25)',
      'Direct GPU compositor auto-hide writes with 0 React re-renders',
      'Dual API: headless or ref-forwarding',
    ],
    gotchas: [
      'Do not pass zero threshold values on touch devices to avoid jitter from micro-finger tremors.',
    ],
    props: [
      { name: 'thresholdDown', type: 'number', default: '15', description: 'Pixel travel before switching to down.' },
      { name: 'thresholdUp', type: 'number', default: '25', description: 'Pixel travel before switching to up.' },
      { name: 'hideTransform', type: 'string', default: "'translate3d(0, -100%, 0)'", description: 'GPU transform applied when scrolling down.' },
    ],
    code: `import React, { useRef } from 'react';
import { useScrollDirection } from '@scrollcraft/react';

export function AutoHideHeaderDemo() {
  const navRef = useRef<HTMLDivElement>(null);
  const { direction, isAtTop } = useScrollDirection(navRef, {
    thresholdDown: 15,
    thresholdUp: 25,
  });

  return (
    <div className="w-full min-h-[180vh] relative pt-24">
      <div
        ref={navRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-2xl z-40 transition-transform duration-300"
      >
        <span className="font-bold text-white">Auto-Hiding Floating Nav</span>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-400">Dir:</span>
          <span className="text-violet-400 font-bold uppercase">{direction}</span>
          <span className={\`px-2 py-0.5 rounded \${isAtTop ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}\`}>
            {isAtTop ? 'AT TOP' : 'SCROLLED'}
          </span>
        </div>
      </div>
    </div>
  );
}`,
    usageCode: `import { useScrollDirection } from '@scrollcraft/react';

const { direction, isAtTop, ref } = useScrollDirection<HTMLElement>({
  thresholdDown: 15,
  thresholdUp: 25,
});`,
  },

  {
    id: 'use-ticker',
    slug: 'use-ticker',
    category: 'hooks',
    title: 'useTicker',
    shortDescription: 'Direct hook into ScrollCraft’s 4-stage game loop (measure, driver, update, render).',
    fullDescription:
      '`useTicker` hooks custom callbacks into ScrollCraft’s centralized 120 FPS game loop without spawning competing requestAnimationFrame loops. Direct execution in TickerPhase ("measure" | "driver" | "update" | "render").',
    tags: ['Game Loop', 'Ticker Phase', '120 FPS', 'RAF Consolidation'],
    driver: 'Headless Hook',
    runwayHeight: '140vh',
    features: [
      'Direct phase execution: measure -> driver -> update -> render',
      'Zero task thrashing: stable ref ensures callback identity changes do not re-bind tasks',
      'React 19 StrictMode safety and zero-allocation unmount cleanup',
    ],
    gotchas: [
      'Put DOM reads in phase "measure" and DOM writes in phase "render" to prevent layout thrashing.',
    ],
    props: [
      { name: 'callback', type: '(dt: number, elapsed: number, current: number) => void', default: 'undefined', description: 'Callback executed on each frame tick.' },
      { name: 'phase', type: "'measure' | 'driver' | 'update' | 'render'", default: "'update'", description: 'Game loop execution phase.' },
    ],
    code: `import React, { useRef, useState } from 'react';
import { useTicker } from '@scrollcraft/react';

export function HighPrecisionTickerDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useTicker((dt) => {
    frameCountRef.current++;
    const now = performance.now();
    if (now - lastTimeRef.current >= 500) {
      setFps(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    // Direct canvas wave drawing in game loop
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const time = now * 0.003;
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.05 + time) * 20;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, 'render');

  return (
    <div className="min-h-[100vh] w-full flex items-center justify-center">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl text-center">
        <span className="text-xs font-mono text-violet-400">useTicker (Phase: render)</span>
        <canvas ref={canvasRef} width={300} height={100} className="my-4 mx-auto" />
        <div className="font-mono text-sm text-zinc-300">
          Engine Ticker FPS: <span className="text-emerald-400 font-bold">{fps}</span>
        </div>
      </div>
    </div>
  );
}`,
    usageCode: `import { useTicker } from '@scrollcraft/react';

useTicker((dt, elapsed) => {
  // Direct execution in centralized 120 FPS game loop
}, 'render');`,
  },

  {
    id: 'use-render-tracker',
    slug: 'use-render-tracker',
    category: 'hooks',
    title: 'useRenderTracker',
    shortDescription: 'Zero-rerender audit tracker verifying component renders during active scrolling remain 0.',
    fullDescription:
      '`useRenderTracker` audits component lifecycles to detect accidental React Virtual DOM thrashing during active gestures. Provides live proof of zero re-renders during active scrolling gestures.',
    tags: ['Audit Utility', 'Zero Re-renders', 'Performance Proof', 'Telemetry'],
    driver: 'Audit Utility',
    runwayHeight: '160vh',
    features: [
      'Synchronous re-render tracking without scheduling additional state updates',
      'Imperative velocity subscription without triggering re-renders',
      'Categorizes total renders vs renders during active scroll gestures',
      'Actionable guidance warnings in non-production builds',
    ],
    gotchas: [
      'In a zero-rerender architecture, rendersWhileScrolling should remain exactly 0 during active flick gestures.',
    ],
    props: [
      { name: 'componentName', type: 'string', default: "''", description: 'Label for console audit reporting.' },
      { name: 'enabled', type: 'boolean', default: 'true', description: 'Whether audit tracking is active.' },
    ],
    code: `import React from 'react';
import { useRenderTracker } from '@scrollcraft/react';

export function ZeroRerenderAuditDemo() {
  const audit = useRenderTracker('ZeroRerenderAuditDemo');

  return (
    <div className="min-h-[140vh] w-full flex items-center justify-center">
      <div className="w-88 rounded-3xl border border-emerald-500/30 bg-zinc-900/90 p-8 shadow-2xl text-center">
        <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Zero-Rerender Proof</span>
        <h4 className="text-xl font-bold text-white mt-2">Render Tracker Report</h4>
        <div className="grid grid-cols-2 gap-4 my-6 font-mono">
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">INITIAL RENDERS</span>
            <span className="text-lg font-bold text-white">{audit.renderCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block">DURING SCROLL</span>
            <span className="text-lg font-bold text-emerald-400">{audit.rendersWhileScrolling}</span>
          </div>
        </div>
        <p className="text-xs text-zinc-400">
          Even during violent high-speed scrolls, ScrollCraft components never thrash React’s Virtual DOM.
        </p>
      </div>
    </div>
  );
}`,
    usageCode: `import { useRenderTracker } from '@scrollcraft/react';

const audit = useRenderTracker('MyComponent');
console.log('Scroll renders:', audit.rendersWhileScrolling); // Always 0!`,
  },

  {
    id: 'use-scroll-restoration',
    slug: 'use-scroll-restoration',
    category: 'hooks',
    title: 'useScrollRestoration',
    shortDescription: 'Session-storage scroll coordinate persistence and route hydration retry cycles.',
    fullDescription:
      '`useScrollRestoration` resolves Next.js App Router scroll-jumps, cancels pending inertia momentum, persists scroll coordinates in an LRU sessionStorage registry, and survives RSC streaming hydration shifts.',
    tags: ['Route Restoration', 'Next.js App Router', 'RSC Hydration', 'Session Storage'],
    driver: 'Headless Hook',
    runwayHeight: '180vh',
    features: [
      'Next.js App Router routeKey tracking',
      'Survives RSC streaming DOM expansions via multi-frame retry cycles',
      'Manual savePosition(), restorePosition(), and resetToTop() methods',
      'LRU sessionStorage backing persistence',
    ],
    gotchas: [
      'Pass usePathname() or useSearchParams() as the routeKey for full App Router dynamic route sensitivity.',
    ],
    props: [
      { name: 'routeKey', type: 'string', default: 'undefined', description: 'Unique key for current route.' },
      { name: 'enabled', type: 'boolean', default: 'true', description: 'Whether restoration is active.' },
      { name: 'retryFrames', type: 'number', default: '3', description: 'RAF retry cycles to survive layout shifts.' },
    ],
    code: `import React from 'react';
import { useScrollRestoration } from '@scrollcraft/react';

export function RouteRestorationDemo() {
  const { savePosition, restorePosition, resetToTop, savedPosition } = useScrollRestoration({
    routeKey: '/test/use-scroll-restoration',
  });

  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center">
      <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl space-y-6 text-center">
        <span className="text-xs font-mono text-violet-400">useScrollRestoration</span>
        <h4 className="text-2xl font-bold text-white">Route Scroll Memory</h4>
        <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 font-mono text-xs text-zinc-300">
          Saved Coordinate: <span className="text-emerald-400 font-bold">{savedPosition ?? 0}px</span>
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={savePosition} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors">
            Save Position
          </button>
          <button onClick={resetToTop} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors">
            Reset to Top
          </button>
        </div>
      </div>
    </div>
  );
}`,
    usageCode: `import { useScrollRestoration } from '@scrollcraft/react';

const { savePosition, resetToTop } = useScrollRestoration({
  routeKey: '/dashboard',
});`,
  },

  {
    id: 'use-scroll-craft',
    slug: 'use-scroll-craft',
    category: 'hooks',
    title: 'useScrollCraft & useScrollState',
    shortDescription: 'Root engine metrics, selective external store selectors, and autonomous tier switches.',
    fullDescription:
      '`useScrollCraft` grants direct imperative engine access, while `useScrollState` uses `useSyncExternalStore` for selective reactive subscriptions (like scrollY or progress) without causing root tree re-renders.',
    tags: ['Root Context', 'useSyncExternalStore', 'Selective Selector', 'Performance Tier'],
    driver: 'Headless Hook',
    runwayHeight: '180vh',
    features: [
      'Direct access to InertiaEngine instance via useScrollCraft()',
      'Selective subscription via useScrollState((metrics) => metrics.scroll)',
      'Autonomous hardware tier observation via useScrollCraftTier()',
      'SSR safe hydration without server mismatch',
    ],
    gotchas: [
      'Use useScrollState with a focused selector rather than subscribing to the full metrics object to avoid unnecessary re-renders.',
    ],
    props: [
      { name: 'selector', type: '(metrics: ScrollMetrics) => T', default: 'undefined', description: 'Selector picking specific metrics.' },
      { name: 'isEqual', type: '(a: T, b: T) => boolean', default: 'shallowEqual', description: 'Custom equality comparator.' },
    ],
    code: `import React from 'react';
import { useScrollCraft, useScrollState, useScrollCraftTier } from '@scrollcraft/react';

export function EngineMetricsDemo() {
  const { isReady, reducedMotion } = useScrollCraft();
  const scrollY = useScrollState((m) => Math.round(m.scroll));
  const progress = useScrollState((m) => (m.progress * 100).toFixed(1));
  const velocity = useScrollState((m) => m.velocity.toFixed(2));
  const tier = useScrollCraftTier();

  return (
    <div className="min-h-[160vh] w-full flex items-center justify-center">
      <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-2xl space-y-4">
        <span className="text-xs font-mono text-violet-400">Engine Metrics & Hardware Tier</span>
        <h4 className="text-2xl font-bold text-white">Live Engine Telemetry</h4>
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">SCROLL Y</span>
            <span className="text-white font-bold">{scrollY}px</span>
          </div>
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">PROGRESS</span>
            <span className="text-violet-400 font-bold">{progress}%</span>
          </div>
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">VELOCITY</span>
            <span className="text-emerald-400 font-bold">{velocity} px/ms</span>
          </div>
          <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">HARDWARE TIER</span>
            <span className="text-amber-400 font-bold uppercase">{tier}</span>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    usageCode: `import { useScrollState, useScrollCraftTier } from '@scrollcraft/react';

const scrollY = useScrollState((m) => m.scroll);
const tier = useScrollCraftTier();`,
  },

  {
    id: 'robust',
    slug: 'robust',
    category: 'components',
    title: 'Robust Testing Lab',
    shortDescription: 'Live 8-layer verification suite: adversarial math fuzzing, chaos lifecycle, and zero-leak soak.',
    fullDescription:
      '21-card interactive testing lab using all ScrollCraft primitives and hooks. Validates adversarial math fuzzing, chaos unmount bursts, instant coordinate synchronization, clock recovery, memory leak soak, and FrustumShield culling.',
    tags: ['8-Layer Protocol', 'Fuzzing', 'Chaos Testing', 'Memory Soak', 'Primitives', 'Hooks'],
    driver: 'Audit Utility',
    runwayHeight: '180vh',
    features: [
      'Layer 1: Adversarial mathematical fuzzing (NaN, Infinity, dt spikes)',
      'Layer 2: Chaos rapid 50ms unmount burst under StrictMode',
      'Layer 3: Compositor parity and instant 1,000px coordinate synchronization',
      'Layer 4: Clock jitter and 5,000ms tab suspension recovery',
      'Layer 5: Memory soak test with zero residual task leak invariant',
      'Layer 6: FrustumShield offscreen culling saving 90% GPU composition',
      'Layer 7: 400-span TextReveal settled-gating workload reduction',
      'Layer 8: Adaptive quality dynamic blur and layer throttling',
    ],
    gotchas: [
      'For the dedicated full-screen laboratory with live interactive runners, visit /test/robust directly.',
    ],
    props: [],
    code: `// Visit /test/robust for the full interactive 8-layer test laboratory.`,
    usageCode: `// Run all automated unit and resilience tests via CLI:
pnpm test`,
  },
];
