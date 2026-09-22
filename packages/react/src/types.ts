/**
 * React & Next.js Type Definitions for ScrollCraft
 * Strictly under 650 LOC.
 */

import React from 'react';
import type {
  InertiaConfig,
  ScrollMetrics,
  SpringConfig,
  ElementTransform,
  InertiaEngine,
  ScrollValue,
  TransformProperties,
  PropertyTimeline,
  SequenceOptions,
  StackedCardsOptions,
  TextRevealOptions,
  MotionMode,
} from '@scrollcraft/core';

export type {
  InertiaConfig,
  ScrollMetrics,
  SpringConfig,
  ElementTransform,
  InertiaEngine,
  ScrollValue,
  TransformProperties,
  PropertyTimeline,
  SequenceOptions,
  StackedCardsOptions,
  TextRevealOptions,
  MotionMode,
};

export type {
  ScrollRestorationOptions,
  ScrollRestorationReturn,
} from './hooks/useScrollRestoration';

export interface DebugOptions {
  /** Screen position of the inspector HUD. Default: 'bottom-right' */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Start HUD in collapsed pill mode. Default: false */
  collapsed?: boolean;
  /** Automatically enable visual markers globally on mount. Default: false */
  markers?: boolean;
  /** Enable Inspector Studio mode with Frame Drop timeline & spatial trigger diagnostics. Default: false */
  studio?: boolean;
}

export interface ScrollInspectorProps {
  /** Initial placement on screen. Default: 'bottom-right' */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Start initially collapsed. Default: false */
  defaultCollapsed?: boolean;
  /** Whether to automatically enable visual markers globally on mount. Default: false */
  markers?: boolean;
  /** Enable Inspector Studio mode with Frame Drop timeline & spatial trigger diagnostics. Default: false */
  studio?: boolean;
}

export interface ScrollProviderProps {
  children: React.ReactNode;
  /** Whether to enable inertia smooth scrolling. Default: true */
  smooth?: boolean | Partial<InertiaConfig>;
  /**
   * Developer inspector and debugging suite.
   * When true or configured with DebugOptions, mounts <ScrollInspector /> and enables live telemetry.
   * When false (default), 0 DOM elements and 0 extra ticker tasks exist.
   */
  debug?: boolean | DebugOptions;
  /**
   * @deprecated Framework-agnostic packages cannot reliably observe Next.js App Router
   * transitions. Call scrollTo(0) from your router transition instead.
   */
  autoResetOnRouteChange?: boolean;
  /**
   * Automatically recalculate scroll limits on body ResizeObserver & document.fonts.ready.
   * Default: true
   */
  autoRecalc?: boolean;
  /**
   * Disable smoothing and element transforms if user has prefers-reduced-motion: reduce.
   * Default: true
   */
  respectReducedMotion?: boolean;
  /**
   * Manual override for user motion preference ('system', 'reduce', or 'no-preference').
   * Default: 'system'
   */
  motionOverride?: MotionMode;
  /**
   * Automatically restore scroll positions on browser history navigation (popstate)
   * backed by sessionStorage LRU store.
   * Default: false
   */
  restoreScroll?: boolean;
  /** Automatically permit nested scrollable elements to scroll natively without hijacking wheel events. Default: true */
  allowNestedScroll?: boolean;
  /** Custom function to prevent smooth scrolling on traversed elements (e.g. modals, maps) */
  prevent?: (node: HTMLElement) => boolean;
  /** Automatically pause/resume Lenis when wrapper overflow changes (e.g. modal adds overflow: hidden). Default: true */
  autoToggle?: boolean;
}

export type ScrollCraftProviderProps = ScrollProviderProps;

export interface ScrollContextValue {
  engine: InertiaEngine | null;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      easing?: (t: number) => number;
    }
  ) => void;
  resize: () => void;
  isReady: boolean;
  reducedMotion: boolean;
  getMetrics: () => ScrollMetrics;
  subscribe: (callback: (metrics: ScrollMetrics) => void) => () => void;
  /** Legacy metrics getter */
  metrics?: ScrollMetrics;
}

export interface ParallaxOptions {
  /** Speed multiplier: > 0 scrolls slower (deeper), < 0 scrolls faster. Default: 0.2 */
  speed?: number;
  /** Axis of parallax displacement: 'vertical' or 'horizontal'. Default: 'vertical' */
  direction?: 'vertical' | 'horizontal';
  /** Clamp lower bound displacement in pixels */
  min?: number;
  /** Clamp upper bound displacement in pixels */
  max?: number;
  /**
   * Reference anchor origin:
   * - 'center' (default): displacement relative to viewport center
   * - 'auto': Hero anti-jump anchor: displacement is strictly 0px when scrollY=0
   * - 'top': displacement relative to viewport top
   * - number: custom pixel offset anchor
   */
  origin?: 'auto' | 'center' | 'top' | number;
  /** Auto-scales element to prevent unpainted gaps during strong parallax, clips parent container */
  bleed?: boolean | number;
  /** Optional scale multiplier */
  scale?: number;
  /** Optional rotate angle in degrees */
  rotate?: number;
  /** Disable transform if prefers-reduced-motion is active. Default: true */
  respectReducedMotion?: boolean;
  /** Driver selection: 'auto' (native CSS scroll-timeline with JS fallback), 'native' (force native), or 'js' (force JS ticker). Default: 'auto' */
  driver?: 'auto' | 'js' | 'native';
}

export interface ParallaxProps extends React.HTMLAttributes<HTMLElement>, ParallaxOptions {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface RevealOptions {
  /** Entry slide direction. Default: 'up' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Slide travel distance in pixels. Default: 32 */
  distance?: number;
  /** Duration in seconds. Default: 0.6 */
  duration?: number;
  /** Delay in seconds. Default: 0 */
  delay?: number;
  /** Viewport intersection ratio to trigger reveal. Default: 0.15 */
  threshold?: number;
  /** Whether to trigger reveal only once. Default: true */
  once?: boolean;
  /** Atmospheric blur reveal in px (e.g. 8 or true for 8px). Default: false */
  blur?: boolean | number;
  /** Entry scale factor (e.g. 0.85). Default: 1 */
  scale?: number;
  /** 3D entry tilt on X axis in degrees. Default: 0 */
  rotateX?: number;
  /** 3D entry tilt on Y axis in degrees. Default: 0 */
  rotateY?: number;
  /** Item index for automatic stagger sequencing */
  index?: number;
  /** Stagger increment in seconds between indexed siblings. Default: 0.05 */
  stagger?: number;
  /** Callback fired when element is revealed (0 re-renders) */
  onReveal?: () => void;
  /** Callback fired when element is reset to hidden state (0 re-renders) */
  onReset?: () => void;
  /** Bypass slide/opacity if prefers-reduced-motion is active. Default: true */
  respectReducedMotion?: boolean;
}

export interface RevealProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onReset'>, RevealOptions {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface PinOptions {
  /** Top sticky offset in pixels. Default: 0 */
  top?: number;
  /** Bottom boundary offset */
  bottom?: number;
  /** Scroll duration / distance in pixels for pin travel track */
  duration?: number;
  /** Callback receiving normalized progress (0 to 1) while pinned */
  onProgress?: (progress: number) => void;
  /** Auto-spacing placeholder track height generation without <PinContainer>. Default: false */
  pinSpacing?: boolean | number;
  /** GSAP 4-State Lifecycle: fired when scroll enters pinned zone going forward */
  onEnter?: () => void;
  /** GSAP 4-State Lifecycle: fired when scroll leaves pinned zone going forward */
  onLeave?: () => void;
  /** GSAP 4-State Lifecycle: fired when scroll re-enters pinned zone going backward */
  onEnterBack?: () => void;
  /** GSAP 4-State Lifecycle: fired when scroll leaves pinned zone going backward */
  onLeaveBack?: () => void;
  /** Observable ScrollValue receiving normalized progress without re-renders */
  progressValue?: ScrollValue;
  /** Whether to trigger React state updates for progress and pinOffsetY. Default: false */
  trackState?: boolean;
  /** Disable writing translate3d transform (e.g. when using native CSS position: sticky). Default: false */
  disableTransform?: boolean;
}

export interface PinProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onProgress'>, PinOptions {
  asChild?: boolean;
  /** Explicit track height to auto-wrap pinned child without requiring <PinContainer>. */
  height?: string | number;
  children?: React.ReactNode;
}

export interface PinContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Height of scroll space to provide pin travel track. Default: '200vh' */
  height?: string | number;
  children?: React.ReactNode;
}

export interface ScrollProgressOptions {
  /** Section / target element to measure viewport traversal for */
  target?: React.RefObject<HTMLElement | null>;
  /** Trigger offsets: [containerEnter, containerExit]. Default: ['top bottom', 'bottom top'] */
  offset?: [string, string];
  /** Scroll orientation: 'vertical' or 'horizontal'. Default: 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Zero-rerender progress observable */
  progressValue?: ScrollValue;
  /** If true, triggers React state re-renders via useSyncExternalStore. Default: false */
  reactive?: boolean;
  /** Progress callback */
  onProgress?: (progress: number) => void;
}

export interface ScrollProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onProgress'>, ScrollProgressOptions {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface ScrollTransformOptions {
  id?: string;
  /** Built-in animation preset */
  preset?: 'zoom-in' | 'fade-up' | 'scale-down' | 'blur-in' | '3d-flip';
  /** Unit-free or CSS-unit properties: x, y, scale, rotate, opacity, blur, backgroundColor, etc. */
  properties?: TransformProperties | Record<string, (number | string)[]>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  snap?: boolean;
  onSnap?: (targetScroll: number) => void;
  markers?: boolean;
  respectReducedMotion?: boolean;
}

export interface ScrollDrawOptions {
  id?: string;
  /** SVG stroke dash array pattern for technical drawing */
  dashArray?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  direction?: 'forward' | 'reverse' | 'bidirectional';
  markers?: boolean;
  onDrawProgress?: (progress: number) => void;
  respectReducedMotion?: boolean;
}

export interface MagneticOptions {
  /** Magnetic attraction strength multiplier. Default: 0.3 */
  strength?: number;
  /** Activation radius in pixels. Default: 100 */
  radius?: number;
  /** Subtle hover inflation scale (e.g. 1.05). Default: 1 */
  scale?: number;
  /** Spring physics stiffness. Default: 150 */
  stiffness?: number;
  /** Spring physics damping. Default: 15 */
  damping?: number;
  /** Optional inner target element for layered parallax effect */
  innerTargetRef?: React.RefObject<HTMLElement | null>;
  /** Multiplier for inner layer movement. Default: 0.5 */
  innerStrength?: number;
  /** Bypass if prefers-reduced-motion is active. Default: true */
  respectReducedMotion?: boolean;
}

export interface ScrollTimelineOptions {
  timeline?: PropertyTimeline;
  /** Keyframe timeline driving direct GPU transforms in Ticker Phase 3 */
  keyframes?: Record<string, (number | string)[]> | Array<{ progress: number; transform?: ElementTransform; opacity?: number }>;
  progress?: number;
  onUpdate?: (values: Record<string, number>) => void;
  respectReducedMotion?: boolean;
}

export interface ScrollDirectionOptions {
  /** Downward travel required to trigger 'down' state. Default: 15px */
  thresholdDown?: number;
  /** Upward travel required to trigger 'up' state. Default: 25px */
  thresholdUp?: number;
  /** Target navbar/header element to automatically animate GPU translate with 0 re-renders */
  targetRef?: React.RefObject<HTMLElement | null>;
  /** Callback fired when direction changes or top boundary is hit */
  onDirectionChange?: (direction: 'up' | 'down', isAtTop: boolean) => void;
  /** Auto-hide transform CSS string. Default: 'translateY(-100%)' */
  hideTransform?: string;
}

export interface ScrollElementProps extends React.HTMLAttributes<HTMLElement> {
  parallax?: number | { y?: number; x?: number; rotate?: number; scale?: number };
  pin?: boolean;
  spring?: Partial<SpringConfig>;
  magnetic?: boolean | { strength?: number; radius?: number };
  transform?: ElementTransform;
  children?: React.ReactNode;
}

export interface UseTextRevealOptions extends TextRevealOptions {
  /** Target character/word elements to animate. If omitted, queries within container. */
  targets?: HTMLElement[] | (() => HTMLElement[]);
  /** Respect prefers-reduced-motion media query. Default: true */
  respectReducedMotion?: boolean;
}

export interface UseTextRevealReturn<T extends HTMLElement = HTMLParagraphElement> {
  ref: React.RefObject<T | null>;
  solver: any;
}

export interface TextRevealProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>, TextRevealOptions {
  /** The text content to split and reveal, or child element when asChild is true */
  children: string | React.ReactElement;
  className?: string;
  /** Granularity of text splitting: 'chars' (default) or 'words' */
  by?: 'chars' | 'words';
  /** Polymorphic slot composition: replace <p> with custom element (e.g. <h1>) */
  asChild?: boolean;
}

export interface StackedCardsProps extends React.HTMLAttributes<HTMLDivElement>, StackedCardsOptions {
  /** Array of card elements or nodes (alternative to direct children) */
  cards?: React.ReactNode[];
  children?: React.ReactNode;
  className?: string;
  /** Optional overall track height */
  height?: string | number;
  /** Polymorphic slot composition: replace outer runway <div> with custom element */
  asChild?: boolean;
}

export interface ScrollSequenceProps extends React.HTMLAttributes<HTMLDivElement>, SequenceOptions {
  className?: string;
  /** Total scroll distance for scrub (e.g. '300vh') */
  height?: string | number;
  /** Optional poster image */
  poster?: string;
  /** Optional overlays or elements rendered inside the pinned sticky presentation container */
  children?: React.ReactNode;
}

