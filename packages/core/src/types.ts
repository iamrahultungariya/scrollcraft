/**
 * Core Type Definitions for ScrollCraft Game-Dev Engine
 * Strictly under 650 LOC.
 */

export type TickerPhase = 'measure' | 'driver' | 'update' | 'render';

declare global {
  interface CSSStyleDeclaration {
    viewTimelineName?: string;
    viewTimelineAxis?: string;
    animationTimeline?: string;
    animationRange?: string;
  }
}

export type TickerCallback = (deltaTime: number, elapsedTime: number, currentTime: number) => void;

export interface TickerError {
  id: string;
  phase: TickerPhase;
  error: unknown;
}

export type TickerErrorHandler = (event: TickerError) => void;

export interface TickerTask {
  id: string;
  phase: TickerPhase;
  callback: TickerCallback;
  dormant?: boolean;
}

export type InertiaPreset = 'cinematic' | 'snappy' | 'natural' | 'smooth';

export interface InertiaConfig {
  /** Inertia preset profile. 'cinematic' = butter-smooth exponential decay; 'snappy' = high-reactivity tight tracking; 'natural' = balanced hybrid */
  preset?: InertiaPreset;
  /** Damping / lerp factor (0.01 to 0.2). Higher = snappier, lower = floatier. Default: 0.1 */
  lerp?: number;
  /** Duration in seconds for easing animation if lerp is not used */
  duration?: number;
  /** Easing function (t: 0-1) => number */
  easing?: (t: number) => number;
  /** Whether mouse wheel scrolling is smoothed. Default: true */
  smoothWheel?: boolean;
  /** Whether touch scrolling maintains inertia sync. Default: false */
  syncTouch?: boolean;
  /** Auto-resize on window resize. Default: true */
  autoResize?: boolean;
  /** Mouse wheel sensitivity multiplier. Can be a number or 'auto' for OS/hardware auto-tuning. Default: 'auto' */
  wheelMultiplier?: number | 'auto';
  /** Touch sensitivity multiplier. Default: 1 */
  touchMultiplier?: number;
  /** Allow momentum overscroll at page bounds. Default: true */
  overscroll?: boolean;
  /** Respect OS prefers-reduced-motion media query by disabling smooth scroll. Default: true */
  respectReducedMotion?: boolean;
  /** Physics simulation mode: 'lerp' (exponential decay) or 'spring' (damped harmonic oscillator). Default: 'lerp' */
  physicsMode?: 'lerp' | 'spring';
  /** Spring configuration used when physicsMode is 'spring' */
  spring?: SpringConfig;
  /** Enable 120Hz-aware exponential smoothing to equalize decay rate across 60Hz/120Hz/240Hz. Default: true */
  fpsAware?: boolean;
  /** Align scroll offsets to physical device pixel grid to eliminate raster blurring and jitter. Default: true */
  subpixelSnap?: boolean;
  /** Automatically permit nested scrollable elements to scroll natively without hijacking wheel events. Default: true */
  allowNestedScroll?: boolean;
  /** Custom function to prevent smooth scrolling on traversed elements (e.g. modals, maps) */
  prevent?: (node: HTMLElement) => boolean;
  /** Automatically pause/resume Lenis when wrapper overflow changes (e.g. modal adds overflow: hidden). Default: true */
  autoToggle?: boolean;
}

export interface ScrollMetrics {
  /** Current scroll offset in pixels */
  scroll: number;
  /** Maximum scroll offset */
  limit: number;
  /** Instantaneous velocity (px/s) */
  velocity: number;
  /** Direction: 1 (scrolling down), -1 (scrolling up), 0 (stationary) */
  direction: 1 | -1 | 0;
  /** Normalized scroll progress from 0 to 1 */
  progress: number;
  /** Legacy alias for scroll */
  current: number;
  /** Target scroll offset */
  target: number;
  /** Legacy alias for limit */
  maxScroll: number;
}

export interface IScrollValue<T = number> {
  get(): T;
  set(value: T): void;
  subscribe(callback: (value: T) => void): () => void;
  destroy(): void;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  precision?: number;
}

export interface SpringState {
  position: number;
  velocity: number;
  settled: boolean;
}

export interface LenisScrollEvent {
  scroll?: number;
  limit?: number;
  velocity?: number;
  direction?: number;
  progress?: number;
  targetScroll?: number;
  [key: string]: any;
}

export interface NumericTransform {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  skewX?: number;
  skewY?: number;
  format?: 'standard' | 'parallax' | 'compact' | 'reveal';
}

export interface ElementTransform extends NumericTransform {
  opacity?: number;
}

export type PerformanceTier = 'high' | 'balanced' | 'low';

export type TierChangeListener = (tier: PerformanceTier) => void;

export type VisibilityCallback = (isVisible: boolean, entry: IntersectionObserverEntry) => void;

export interface VisibilityOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export type TriggerType = 'transform' | 'draw' | 'pin' | 'custom';

export interface ScrollTriggerRecord {
  id: string;
  type: TriggerType;
  element: Element;
  startTrigger: string;
  endTrigger: string;
  startY: number;
  endY: number;
  progress: number;
  markers?: boolean;
}

export type TriggerRegistryListener = (triggers: ScrollTriggerRecord[]) => void;
