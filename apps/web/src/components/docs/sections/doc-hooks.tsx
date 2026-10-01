'use client';

/**
 * ScrollCraft Docs: Reactive Hooks (Reference-Only)
 * Follows strict 15-second scanning template:
 * - Minimal 5–10 line code block
 * - What it does: one line
 * - Capabilities: bullet list of returns/options
 * - Status: Beta
 * Strictly zero prose paragraphs. Zero tutorials.
 */

import React from 'react';
import Link from 'next/link';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Activity, ExternalLink } from 'lucide-react';

interface DocHooksProps {
  hookId: string;
}

interface HookReference {
  name: string;
  signature: string;
  status: 'Beta' | 'Alpha' | 'v0.2.0 (Coming Soon)';
  code: string;
  whatItDoes: string;
  capabilities: { param: string; type: string; desc: string }[];
}

const HOOKS_DATA: Record<string, HookReference> = {
  'use-scroll-progress': {
    name: 'useScrollProgress',
    signature: 'useScrollProgress(options?: { reactive?: boolean })',
    status: 'Beta',
    code: `import { useScrollProgress } from '@scrollcraft/react';

export function HeaderProgress() {
  const { progress, direction, velocity, progressValue } = useScrollProgress();

  return (
    <div>
      <span>Progress: {progress.toFixed(2)}</span>
      <span>Direction: {direction}</span>
      <span>Velocity: {velocity.toFixed(2)}px/frame</span>
    </div>
  );
}`,
    whatItDoes: 'Returns normalized scroll progress (0–1), direction, velocity, and observable values with zero React re-renders.',
    capabilities: [
      { param: 'progress', type: 'number', desc: 'Normalized scroll completion ratio between 0.00 and 1.00.' },
      { param: 'direction', type: '1 | -1 | 0', desc: 'Active scroll direction vector (1: down, -1: up, 0: stationary).' },
      { param: 'velocity', type: 'number', desc: 'Instantaneous scroll velocity in pixels per frame.' },
      { param: 'progressValue', type: 'ScrollValue<number>', desc: 'Zero-rerender observable for direct raf/canvas consumption.' },
      { param: 'scrollY', type: 'number', desc: 'Absolute scroll offset position in pixels.' },
    ],
  },

  'use-parallax': {
    name: 'useParallax',
    signature: 'useParallax<T>(targetRef, options?: ParallaxOptions)',
    status: 'Beta',
    code: `import { useRef } from 'react';
import { useParallax } from '@scrollcraft/react';

export function FloatingCard() {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref, { speed: 0.25, clamp: [-80, 80] });

  return <div ref={ref} className="card">Parallax Layer</div>;
}`,
    whatItDoes: 'Writes direct subpixel hardware transforms to element refs with automatic viewport visibility culling.',
    capabilities: [
      { param: 'targetRef', type: 'RefObject<HTMLElement>', desc: 'Target element ref receiving direct GPU compositor transform writes.' },
      { param: 'speed', type: 'number', desc: 'Displacement rate multiplier (+ lags behind scroll, - accelerates ahead).' },
      { param: 'direction', type: "'vertical' | 'horizontal'", desc: 'Transform axis orientation (default: vertical).' },
      { param: 'clamp', type: '[number, number]', desc: 'Displacement boundaries [min, max] in pixels.' },
      { param: 'respectReducedMotion', type: 'boolean', desc: 'Automatically bypasses translation if OS prefers-reduced-motion is active.' },
    ],
  },

  'use-reveal': {
    name: 'useReveal',
    signature: 'useReveal<T>(targetRef, options?: RevealOptions)',
    status: 'Beta',
    code: `import { useRef } from 'react';
import { useReveal } from '@scrollcraft/react';

export function AnimatedSection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { direction: 'up', distance: 30, delay: 0.1 });

  return <div ref={ref}>Fades and slides on entrance</div>;
}`,
    whatItDoes: 'Subscribes target elements to the global IntersectionObserver singleton without layout thrashing.',
    capabilities: [
      { param: 'targetRef', type: 'RefObject<HTMLElement>', desc: 'Target element ref to animate on entering view.' },
      { param: 'direction', type: "'up' | 'down' | 'left' | 'right'", desc: 'Entrance translation vector (default: up).' },
      { param: 'distance', type: 'number', desc: 'Entrance travel distance in pixels (default: 24).' },
      { param: 'threshold', type: 'number', desc: 'Intersection ratio 0.0 to 1.0 triggering animation (default: 0.15).' },
      { param: 'duration', type: 'number', desc: 'Animation duration in seconds (default: 0.6).' },
      { param: 'once', type: 'boolean', desc: 'Whether to fire transition only once or repeat on scroll (default: true).' },
    ],
  },

  'use-pin': {
    name: 'usePin',
    signature: 'usePin<T>(targetRefOrOptions, options?)',
    status: 'Beta',
    code: `import { useRef } from 'react';
import { usePin } from '@scrollcraft/react';

export function StickyCard() {
  const ref = useRef<HTMLDivElement>(null);
  // trackState: true opts-in to React re-renders. Default is false (zero re-renders).
  const { isPinned, progress } = usePin(ref, { 
    start: 'top top', 
    end: '+=100%',
    trackState: true 
  });

  return (
    <div ref={ref}>
      <span>{isPinned ? 'LOCKED' : 'FLOWING'}</span>
      <span>Scrub: {(progress * 100).toFixed(0)}%</span>
    </div>
  );
}`,
    whatItDoes: 'Tracks sticky viewport locking states and relative scroll progress through a pinned travel budget.',
    capabilities: [
      { param: 'isPinned', type: 'boolean', desc: 'Boolean indicating if target is actively locked in sticky viewport position (requires trackState: true).' },
      { param: 'progress', type: 'number', desc: 'Relative progression ratio within the designated pin range (0.0 to 1.0, requires trackState: true).' },
      { param: 'trackState', type: 'boolean', desc: 'Opt-in to reactive React re-renders during scroll. Default false for zero-rerender performance.' },
      { param: 'start', type: 'string | number', desc: 'Trigger point initiating sticky pin (default: "top top").' },
      { param: 'end', type: 'string | number', desc: 'Total travel distance for the pin lock (default: "+=100%").' },
      { param: 'top', type: 'number', desc: 'Sticky offset from viewport top edge in pixels (default: 0).' },
    ],
  },

  'use-scrollcraft': {
    name: 'useScrollCraft',
    signature: 'useScrollCraft()',
    status: 'Beta',
    code: `import { useScrollCraft } from '@scrollcraft/react';

export function ScrollControls() {
  const { scrollTo, getMetrics, subscribe } = useScrollCraft();

  return (
    <button onClick={() => scrollTo('#section-2', { duration: 1.2 })}>
      Scroll to Next
    </button>
  );
}`,
    whatItDoes: 'Provides direct context access to the ScrollCraft core engine instance, metrics, and controls.',
    capabilities: [
      { param: 'scrollTo', type: '(target, options?) => void', desc: 'Programmatically scrolls window with Lenis inertia physics.' },
      { param: 'getMetrics', type: '() => ScrollMetrics', desc: 'Synchronous snapshot of current scroll offset, velocity, limit, and direction.' },
      { param: 'subscribe', type: '(callback) => () => void', desc: 'Registers high-frequency ticker listener running on hardware frame ticks.' },
      { param: 'reducedMotion', type: 'boolean', desc: 'System accessibility reduced-motion preference.' },
    ],
  },

  'use-scroll-state': {
    name: 'useScrollState',
    signature: 'useScrollState<T>(selector, defaultValue?, options?)',
    status: 'Beta',
    code: `import { useScrollState } from '@scrollcraft/react';

export function VelocityBadge() {
  const velocity = useScrollState((m) => Math.round(m.velocity));

  return <span>Speed: {velocity}px/s</span>;
}`,
    whatItDoes: 'Fine-grained selector subscription backed by useSyncExternalStore with 0 unnecessary parent re-renders.',
    capabilities: [
      { param: 'selector', type: '(metrics: ScrollMetrics) => T', desc: 'Pure selector mapping global scroll state to slice.' },
      { param: 'defaultValue', type: 'T', desc: 'Initial SSR value rendered during server hydration.' },
      { param: 'shallowCompare', type: 'boolean', desc: 'Prevents re-renders if object or primitive slice remains identical.' },
    ],
  },

  'use-magnetic': {
    name: 'useMagnetic',
    signature: 'useMagnetic<T>(options?: MagneticOptions)',
    status: 'Beta',
    code: `import { useMagnetic } from '@scrollcraft/react';

export function MagneticButton() {
  const ref = useMagnetic<HTMLButtonElement>({ strength: 0.3, radius: 120 });

  return <button ref={ref}>Magnetic Action</button>;
}`,
    whatItDoes: 'Attaches spring-physics cursor pull to an element with automatic spring-back on cursor exit.',
    capabilities: [
      { param: 'strength', type: 'number', desc: 'Magnetic attraction intensity towards pointer position (default: 0.3).' },
      { param: 'radius', type: 'number', desc: 'Distance threshold in pixels detecting pointer proximity (default: 150).' },
      { param: 'springConfig', type: 'SpringConfig', desc: 'Optional stiffness, damping, and mass customization.' },
    ],
  },

  'use-scroll-direction': {
    name: 'useScrollDirection',
    signature: 'useScrollDirection(options?: ScrollDirectionOptions)',
    status: 'Beta',
    code: `import { useScrollDirection } from '@scrollcraft/react';

export function SmartNavbar() {
  // Hysteresis-gated direction detection with iOS rubber-band guard
  const { direction, isDown, isUp } = useScrollDirection({
    threshold: 10,
    guardTop: true, // prevents spurious toggles when scrollY <= 0
  });

  return (
    <nav className={\`fixed top-0 inset-x-0 transition-transform duration-300 \${
      isDown ? '-translate-y-full' : 'translate-y-0'
    }\`}>
      <span className="font-mono">Scroll: {direction ?? 'idle'}</span>
    </nav>
  );
}`,
    whatItDoes: 'Hysteresis-gated scroll direction hook with iOS rubber-band guard and direct DOM auto-hide navbar mode.',
    capabilities: [
      { param: 'direction', type: "'up' | 'down' | null", desc: 'Active scroll direction vector.' },
      { param: 'isDown', type: 'boolean', desc: 'True when scrolling downwards past the hysteresis threshold.' },
      { param: 'isUp', type: 'boolean', desc: 'True when scrolling upwards past the hysteresis threshold.' },
      { param: 'threshold', type: 'number', desc: 'Minimum scroll delta in pixels before triggering direction switch (default: 8).' },
      { param: 'guardTop', type: 'boolean', desc: 'Suppresses direction changes when scrollY <= 0 to avoid iOS rubber-band flips.' },
      { param: 'targetRef', type: 'RefObject<HTMLElement>', desc: 'Optional ref for zero-rerender direct CSS transform toggling.' },
    ],
  },

  'use-scroll-timeline': {
    name: 'useScrollTimeline',
    signature: 'useScrollTimeline<T>(targetRefOrOptions, keyframes?, options?)',
    status: 'Beta',
    code: `import { useScrollTimeline } from '@scrollcraft/react';

export function KeyframeSequencer() {
  // Universal Dual API: Call headlessly to receive element ref
  const ref = useScrollTimeline<HTMLDivElement>({
    keyframes: [
      { offset: 0.0, opacity: 0, scale: 0.8, rotate: -10 },
      { offset: 0.5, opacity: 1, scale: 1.0, rotate: 0 },
      { offset: 1.0, opacity: 0.2, scale: 1.2, rotate: 10 },
    ],
    start: 'top 80%',
    end: 'bottom 20%',
  });

  return <div ref={ref} className="box">Scroll Sequencer</div>;
}`,
    whatItDoes: 'Sequences multi-stage keyframe animations directly driven by scroll progress with zero React re-renders.',
    capabilities: [
      { param: 'keyframes', type: 'ScrollKeyframe[]', desc: 'Normalized keyframes array (offset: 0.0 to 1.0) with transform and opacity properties.' },
      { param: 'start', type: 'string', desc: 'Viewport scroll trigger boundary start point (default: "top bottom").' },
      { param: 'end', type: 'string', desc: 'Viewport scroll trigger boundary finish point (default: "bottom top").' },
      { param: 'smooth', type: 'number', desc: 'Optional spring inertia dampening factor for continuous keyframe lerp.' },
      { param: 'respectReducedMotion', type: 'boolean', desc: 'Snaps to final keyframe state if OS prefers-reduced-motion is active.' },
    ],
  },

  'use-scroll-transform': {
    name: 'useScrollTransform',
    signature: 'useScrollTransform<T>(targetRefOrOptions, options?)',
    status: 'Beta',
    code: `import { useScrollTransform } from '@scrollcraft/react';

export function InterpolatedSection() {
  // Universal Dual API: Headless ref assignment with direct GPU composite writes
  const ref = useScrollTransform<HTMLDivElement>({
    input: [0, 1],
    output: {
      scale: [0.9, 1.1],
      opacity: [0.3, 1],
      rotateY: [-15, 0],
    },
    clamp: true,
  });

  return <div ref={ref}>Composite Morph</div>;
}`,
    whatItDoes: 'Headless hook interpolating style attributes (scale, opacity, rotateX/Y, blur) based on container scroll.',
    capabilities: [
      { param: 'input', type: '[number, number]', desc: 'Input scroll progression bounds (typically [0, 1]).' },
      { param: 'output', type: 'TransformOutputMap', desc: 'Target style maps including scale, opacity, rotate, blur, and RGBA tuples.' },
      { param: 'clamp', type: 'boolean', desc: 'Guards output from extrapolating past designated ranges (default: true).' },
      { param: 'easing', type: '(t: number) => number', desc: 'Custom timing function curve (e.g. cubicBezier, easeInOut).' },
    ],
  },

  'use-scroll-draw': {
    name: 'useScrollDraw',
    signature: 'useScrollDraw<T extends SVGGeometryElement>(targetRefOrOptions, options?)',
    status: 'Beta',
    code: `import { useScrollDraw } from '@scrollcraft/react';

export function AnimatedLogo() {
  const pathRef = useScrollDraw<SVGPathElement>({
    start: 'top 80%',
    end: 'center center',
    direction: 'forward',
  });

  return (
    <svg viewBox="0 0 200 200">
      <path ref={pathRef} d="M 20 100 L 100 20 L 180 100 Z" stroke="#38bdf8" fill="none" strokeWidth="4" />
    </svg>
  );
}`,
    whatItDoes: 'Measures total length of any SVG geometry element and syncs strokeDashoffset to scroll ticker.',
    capabilities: [
      { param: 'targetRef', type: 'RefObject<SVGGeometryElement>', desc: 'Target SVG geometry element (path, rect, circle, polyline, line).' },
      { param: 'start', type: 'string', desc: 'Trigger point initiating stroke drawing (default: "top 80%").' },
      { param: 'end', type: 'string', desc: 'Trigger point concluding complete stroke drawing (default: "center center").' },
      { param: 'direction', type: "'forward' | 'reverse'", desc: 'Drawing direction vector (default: "forward").' },
      { param: 'dashArray', type: 'string | number', desc: 'Custom dash segment sizing; defaults to measured total path length.' },
    ],
  },

  'use-scroll-restoration': {
    name: 'useScrollRestoration',
    signature: 'useScrollRestoration(options?: ScrollRestorationOptions)',
    status: 'Beta',
    code: `import { useScrollRestoration } from '@scrollcraft/react';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  // Eliminates Next.js App Router scroll jumps on route transitions
  useScrollRestoration({
    restoreOnBack: true,
    resetOnPush: true,
    killInertiaOnNavigate: true,
    maxRetries: 5,
  });

  return <>{children}</>;
}`,
    whatItDoes: 'Prevents Next.js App Router scroll-jumps on route change, kills inertia momentum, and restores scroll position from LRU sessionStorage.',
    capabilities: [
      { param: 'restoreOnBack', type: 'boolean', desc: 'Restore exact scroll offset on popstate/history back navigation (default: true).' },
      { param: 'resetOnPush', type: 'boolean', desc: 'Reset scroll position to top (0) on forward page push navigation (default: true).' },
      { param: 'killInertiaOnNavigate', type: 'boolean', desc: 'Immediately cancels lingering momentum from prior page upon route boundary transition (default: true).' },
      { param: 'maxRetries', type: 'number', desc: 'Number of frame retry checks for slow RSC streaming hydration before settling (default: 5).' },
      { param: 'storageKey', type: 'string', desc: 'Custom sessionStorage LRU cache key namespace (default: "__scrollcraft_restore__").' },
    ],
  },

  'use-text-reveal': {
    name: 'useTextReveal',
    signature: 'useTextReveal<T>(targetRefOrOptions, options?)',
    status: 'Beta',
    code: `import { useRef } from 'react';
import { useTextReveal } from '@scrollcraft/react';

export function KineticTitle() {
  const containerRef = useRef<HTMLHeadingElement>(null);
  useTextReveal(containerRef, {
    by: 'word',
    stagger: 0.04,
    scrub: true,
  });

  return <h1 ref={containerRef}>Hardware Accelerated Split Text</h1>;
}`,
    whatItDoes: 'Splits text into animated tokens (word, character, line) with direct GPU composite opacity and translateY.',
    capabilities: [
      { param: 'targetRef', type: 'RefObject<HTMLElement>', desc: 'Target text container ref.' },
      { param: 'by', type: "'character' | 'word' | 'line'", desc: 'Token segmentation mode (default: "word").' },
      { param: 'stagger', type: 'number', desc: 'Delay increment between tokens in seconds (default: 0.03).' },
      { param: 'scrub', type: 'boolean', desc: 'Scrub tokens directly from scroll progress (default: true).' },
    ],
  },

  'use-ticker': {
    name: 'useTicker',
    signature: 'useTicker(callback, phase?, deps?)',
    status: 'Beta',
    code: `import { useTicker } from '@scrollcraft/react';

export function CanvasAnimation() {
  useTicker((dt) => {
    // Runs inside ScrollCraft deterministic 4-phase microtask loop
    drawFrame(dt);
  }, 'render');

  return <canvas />;
}`,
    whatItDoes: 'Direct subscription to the ScrollCraft high-precision game-dev engine ticker without React re-renders.',
    capabilities: [
      { param: 'callback', type: '(dt: number) => void', desc: 'Hardware tick callback function with high-precision delta time.' },
      { param: 'phase', type: "'measure' | 'driver' | 'update' | 'render'", desc: 'Execution loop phase (default: "update").' },
      { param: 'deps', type: 'DependencyList', desc: 'React effect dependency array for callback lifecycle management.' },
    ],
  },

  'use-render-tracker': {
    name: 'useRenderTracker',
    signature: 'useRenderTracker(componentName)',
    status: 'Beta',
    code: `import { useRenderTracker } from '@scrollcraft/react';

export function HeavyWidget() {
  // Logs warning in development console if component re-renders during active scroll
  useRenderTracker('HeavyWidget');

  return <div>Zero Re-Render Invariant</div>;
}`,
    whatItDoes: 'Dev-mode audit utility validating the zero-re-render invariant during high-frequency scroll gestures.',
    capabilities: [
      { param: 'componentName', type: 'string', desc: 'Name of component tracked in telemetry console.' },
      { param: 'renderCount', type: 'number', desc: 'Total number of component render passes.' },
    ],
  },
};

export const DocHooks: React.FC<DocHooksProps> = ({ hookId }) => {
  const hook = HOOKS_DATA[hookId] || HOOKS_DATA['use-scroll-progress'];
  const isComingSoon = hook.status.includes('Coming Soon');

  return (
    <div className="space-y-10 not-prose font-body">
      {/* Header */}
      <div className="border-b-2 border-line pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
            <span className="w-2 h-2 bg-accent inline-block" />
            <span>[HOOK / {hook.name.toUpperCase()}]</span>
          </div>

          <Link
            href={`/test/${hookId}`}
            className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>TEST IN LAB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-accent tracking-tight font-mono uppercase">
            {hook.name}()
          </h1>
          <span className={`px-2.5 py-1 border-2 text-[10px] font-mono font-bold uppercase tracking-wider ${
            isComingSoon
              ? 'bg-bg text-muted border-line-soft'
              : 'bg-accent text-black border-line shadow-rest'
          }`}>
            {hook.status}
          </span>
        </div>
        <p className="text-base text-fg/90 font-body leading-relaxed max-w-3xl">
          <strong className="text-fg font-mono font-bold uppercase mr-1">WHAT IT DOES:</strong> {hook.whatItDoes}
        </p>
      </div>

      {/* Minimal 5-10 Line Syntax Highlighted Code Snippet */}
      <div id="syntax" className="space-y-3 scroll-mt-24">
        <span className="text-xs font-mono uppercase tracking-wider text-muted block font-bold">
          SYNTAX &bull; 5–10 LINE REFERENCE
        </span>
        <CodeViewer code={hook.code} fileName={`${hook.name}.ts`} />
      </div>

      {/* Capabilities / Return Values - NO PURPLE, 2 neutrals + 1 accent */}
      <div id="capabilities" className="space-y-4 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted font-bold">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span>CAPABILITIES &amp; RETURN VALUES</span>
          </div>
          <span className="text-[10px] font-mono text-muted sm:hidden">SWIPE TABLE &rarr;</span>
        </div>

        <div className="border-2 border-line bg-bg shadow-rest overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[500px]">
            <thead className="bg-line-soft/30 text-muted uppercase text-[11px] border-b-2 border-line font-bold">
              <tr>
                <th className="px-4 py-3 font-bold text-fg">PARAMETER / RETURN</th>
                <th className="px-4 py-3 font-bold">TYPE</th>
                <th className="px-4 py-3 font-bold">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-line-soft font-mono">
              {hook.capabilities.map((c) => (
                <tr key={c.param} className="hover:bg-fg hover:text-black transition-colors group">
                  <td className="px-4 py-3 text-accent group-hover:text-black font-bold">{c.param}</td>
                  <td className="px-4 py-3 text-fg font-mono text-xs">{c.type}</td>
                  <td className="px-4 py-3 text-fg group-hover:text-black text-xs font-body">{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Signal */}
      <div className="p-4 border-2 border-line bg-bg text-xs font-mono text-fg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-rest">
        <div className="flex items-center gap-2">
          <span className="text-muted uppercase">STATUS:</span>
          <span className={`px-2.5 py-0.5 border-2 font-bold uppercase text-[11px] ${
            isComingSoon ? "border-line-soft text-muted bg-bg" : "border-line bg-accent text-black"
          }`}>
            {hook.status}
          </span>
        </div>
        <span className="text-xs text-muted font-body">
          {isComingSoon
            ? 'Scheduled for ScrollCraft v0.3.0 • Universal Dual API support'
            : 'Production hardened • Direct ref mutation without state churn'}
        </span>
      </div>
    </div>
  );
};
