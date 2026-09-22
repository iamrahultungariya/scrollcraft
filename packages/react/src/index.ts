'use client';

/**
 * @scrollcraft/react - Public API Exports
 * React & Next.js-Native Scroll Toolkit
 * Strictly under 650 LOC.
 */

export * from './types';
export * from './context';
export * from './slot';
export * from './factory';
export * from './utils/ref';

// Primitives
export * from './primitives/parallax';
export * from './primitives/reveal';
export * from './primitives/pin';
export * from './primitives/scroll-progress';
export * from './primitives/scroll-transform';
export * from './primitives/scroll-draw';

// High Performance Components & DevTools
export * from './components/velocity-marquee';
export * from './components/horizontal-scroll';
export * from './components/scroll-sequence';
export * from './components/text-reveal';
export * from './components/magnetic';
export * from './components/skew-gallery';
export * from './components/stacked-cards';
export * from './components/scroll-inspector';

// Hooks
export * from './hooks/useParallax';
export * from './hooks/useReveal';
export * from './hooks/usePin';
export * from './hooks/useScrollProgress';
export * from './hooks/useScrollTransform';
export * from './hooks/useScrollDraw';
export * from './hooks/useMagnetic';
export * from './hooks/useScrollTimeline';
export * from './hooks/useScrollDirection';
export * from './hooks/useTicker';
export * from './hooks/useRenderTracker';
export * from './hooks/useScrollRestoration';
export * from './hooks/useTextReveal';
