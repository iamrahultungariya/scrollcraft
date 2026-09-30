/**
 * Documentation Navigation & Content Architecture
 * Strictly under 650 LOC.
 */

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

export interface DocSection {
  id: string;
  title: string;
  category: string;
  description: string;
  snippet?: string;
  props?: PropRow[];
  details?: string[];
  subsections?: { id: string; title: string }[];
}

export interface DocCategory {
  id: string;
  title: string;
  badge?: string;
  items: { id: string; title: string; badge?: string }[];
}

export const DOCS_CATEGORIES: DocCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      { id: 'introduction', title: 'Introduction & Mental Model' },
      { id: 'installation', title: 'Installation' },
      { id: 'setup', title: 'Next.js App Router Setup' },
    ],
  },
  {
    id: 'primitives',
    title: 'Component Reference',
    badge: 'Beta',
    items: [
      { id: 'parallax', title: '<Parallax />', badge: 'Slot' },
      { id: 'reveal', title: '<Reveal />', badge: 'Slot' },
      { id: 'pin', title: '<Pin />', badge: 'Sticky' },
      { id: 'scroll-progress', title: '<ScrollProgress />', badge: 'Slot' },
      { id: 'scroll-transform', title: '<ScrollTransform />', badge: 'Compositor' },
      { id: 'scroll-draw', title: '<ScrollDraw />', badge: 'SVG Vector' },
      { id: 'velocity-marquee', title: '<VelocityMarquee />', badge: 'Kinetic' },
      { id: 'horizontal-scroll', title: '<HorizontalScroll />', badge: 'Gallery' },
      { id: 'scroll-sequence', title: '<ScrollSequence />', badge: 'Canvas' },
      { id: 'stacked-cards', title: '<StackedCards />', badge: 'Deck' },
      { id: 'text-reveal', title: '<TextReveal />', badge: 'Typography' },
      { id: 'magnetic', title: '<Magnetic />', badge: 'Spring' },
      { id: 'skew-gallery', title: '<SkewGallery />', badge: 'Kinetic' },
      { id: 'scroll-inspector', title: '<ScrollInspector />', badge: 'Studio' },
    ],
  },
  {
    id: 'hooks',
    title: 'Reactive Hooks',
    badge: 'Beta',
    items: [
      { id: 'use-scroll-progress', title: 'useScrollProgress', badge: 'Core' },
      { id: 'use-parallax', title: 'useParallax', badge: 'Headless' },
      { id: 'use-reveal', title: 'useReveal', badge: 'Headless' },
      { id: 'use-pin', title: 'usePin', badge: 'Headless' },
      { id: 'use-scroll-transform', title: 'useScrollTransform', badge: 'Headless' },
      { id: 'use-scroll-draw', title: 'useScrollDraw', badge: 'SVG Vector' },
      { id: 'use-magnetic', title: 'useMagnetic', badge: 'Spring' },
      { id: 'use-scroll-timeline', title: 'useScrollTimeline', badge: 'Keyframes' },
      { id: 'use-scroll-direction', title: 'useScrollDirection', badge: 'Hysteresis' },
      { id: 'use-ticker', title: 'useTicker', badge: 'Engine Loop' },
      { id: 'use-render-tracker', title: 'useRenderTracker', badge: 'Audit' },
      { id: 'use-scroll-restoration', title: 'useScrollRestoration', badge: 'History/RSC' },
      { id: 'use-text-reveal', title: 'useTextReveal', badge: 'Split Text' },
      { id: 'use-scrollcraft', title: 'useScrollCraft', badge: 'Context' },
      { id: 'use-scroll-state', title: 'useScrollState', badge: '0-rerender' },
    ],
  },
  {
    id: 'r3f',
    title: '3D & Canvas (R3F)',
    badge: 'Alpha',
    items: [
      { id: 'r3f-overview', title: '3D Scroll Architecture', badge: 'Alpha' },
      { id: 'r3f-three-tier', title: 'WAAPI vs Fallback Bridge' },
      { id: 'use-scroll-3d', title: 'useScroll3D Hook', badge: 'Alpha' },
      { id: 'r3f-recipes', title: 'Three.js Scene Recipe' },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture & Perf',
    items: [
      { id: 'three-phase-ticker', title: '3-Phase Ticker' },
      { id: 'reduced-motion', title: 'Reduced Motion (A11y)' },
      { id: 'benchmark', title: 'Engine Comparison' },
    ],
  },
  {
    id: 'recipes',
    title: 'Production Recipes',
    items: [
      { id: 'recipe-sticky-narrative', title: 'Sticky Narrative Cards' },
      { id: 'recipe-horizontal-scroll', title: 'Horizontal Gallery Scrub' },
      { id: 'recipe-3d-scroll', title: '3D Kinetic Product Canvas' },
    ],
  },
];

export const PARALLAX_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, renders children directly using Radix-style Slot composition. Zero extra wrapper <div> injected.',
  },
  {
    name: 'speed',
    type: 'number',
    defaultValue: '0.2',
    description:
      'Parallax intensity multiplier. Positive values lag behind scroll; negative values scroll faster.',
  },
  {
    name: 'direction',
    type: "'vertical' | 'horizontal'",
    defaultValue: "'vertical'",
    description:
      'Axis of displacement. Vertical modifies translateY; horizontal modifies translateX.',
  },
  {
    name: 'clamp',
    type: '[number, number]',
    defaultValue: 'undefined',
    description:
      'Optional min/max displacement boundaries in pixels [min, max] to prevent excessive drift.',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: "''",
    description: 'CSS class names merged cleanly onto the element or child component.',
  },
];

export const REVEAL_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, delegates ref and transition inline styles to the immediate child element.',
  },
  {
    name: 'variant',
    type: "'slide-up' | 'slide-down' | 'fade' | 'scale' | 'blur'",
    defaultValue: "'slide-up'",
    description: 'Transition animation variant applied upon intersecting viewport trigger.',
  },
  {
    name: 'threshold',
    type: 'number',
    defaultValue: '0.15',
    description:
      'Intersection ratio threshold (0.0 to 1.0) before triggering entry animation.',
  },
  {
    name: 'duration',
    type: 'number',
    defaultValue: '0.6',
    description: 'Animation duration in seconds.',
  },
  {
    name: 'delay',
    type: 'number',
    defaultValue: '0',
    description: 'Stagger or sequence delay in seconds before triggering transition.',
  },
  {
    name: 'once',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Whether to fire transition only once upon entering view.',
  },
];

export const PIN_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Renders child directly into the pinning container.',
  },
  {
    name: 'pinSpacing',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'When true, preserves scroll spacing so subsequent content does not overlap prematurely.',
  },
  {
    name: 'start',
    type: 'string | number',
    defaultValue: "'top top'",
    description:
      'Viewport intersection trigger point where sticky pin locks in place.',
  },
  {
    name: 'end',
    type: 'string | number',
    defaultValue: "'+=100%'",
    description:
      'Scroll distance duration through which the element remains pinned.',
  },
];

export const PIN_CONTAINER_PROPS: PropRow[] = [
  {
    name: 'height',
    type: 'string | number',
    defaultValue: "'200vh'",
    description: 'Explicit scroll travel track height for pinned card transitions.',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: "''",
    description: 'Optional styling classes merged onto container.',
  },
];

export const SCROLL_PROGRESS_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Passes normalized progress scaleX / width directly to child.',
  },
  {
    name: 'targetRef',
    type: 'RefObject<HTMLElement>',
    defaultValue: 'undefined',
    description:
      'Optional specific container element. If omitted, tracks entire document scroll progress (0.0 to 1.0).',
  },
  {
    name: 'axis',
    type: "'y' | 'x'",
    defaultValue: "'y'",
    description: 'Scroll orientation axis to calculate completion percentage for.',
  },
];

export const PROVIDER_PROPS: PropRow[] = [
  {
    name: 'smooth',
    type: 'boolean | InertiaConfig',
    defaultValue: 'true',
    description:
      'Enables Lenis inertia scroll wrap. Can pass custom lerp, duration, and orientation configuration.',
  },
  {
    name: 'respectReducedMotion',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Automatically disables inertia and collapses transitions if user OS prefers-reduced-motion is active.',
  },
  {
    name: 'autoResetOnRouteChange',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Opt-in parameter to reset scroll offset to 0 upon Next.js App Router route transitions.',
  },
  {
    name: 'autoRecalc',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Watches document body with ResizeObserver and document.fonts.ready to recalculate scroll bounds dynamically.',
  },
];

export const USE_SCROLL_3D_PROPS: PropRow[] = [
  {
    name: 'target',
    type: 'Element | null',
    required: true,
    description: 'DOM element whose scroll intersection or timeline triggers 3D updates.',
  },
  {
    name: 'options.axis',
    type: "'block' | 'inline'",
    defaultValue: "'block'",
    description: 'Scroll orientation axis: block (vertical) or inline (horizontal).',
  },
];

export const VELOCITY_MARQUEE_PROPS: PropRow[] = [
  {
    name: 'baseSpeed',
    type: 'number',
    defaultValue: '1',
    description: 'Default continuous crawling speed in pixels per frame when stationary.',
  },
  {
    name: 'velocityMultiplier',
    type: 'number',
    defaultValue: '0.05',
    description: 'Acceleration factor applied to instantaneous user scroll velocity.',
  },
  {
    name: 'direction',
    type: "'left' | 'right'",
    defaultValue: "'left'",
    description: 'Horizontal flow direction of the marquee track.',
  },
  {
    name: 'maxSpeed',
    type: 'number',
    defaultValue: '50',
    description: 'Maximum velocity clamp in pixels per frame to prevent visual shearing.',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: "''",
    description: 'Tailwind or CSS classes merged onto outer container.',
  },
];

export const HORIZONTAL_SCROLL_PROPS: PropRow[] = [
  {
    name: 'speed',
    type: 'number',
    defaultValue: '2',
    description: 'Scroll distance multiplier relative to viewport height (e.g. 2 = 200vh total scroll travel).',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: "''",
    description: 'Classes applied to the outer pinned scroll container.',
  },
  {
    name: 'innerClassName',
    type: 'string',
    defaultValue: "''",
    description: 'Classes applied to the inner horizontally translating sliding track.',
  },
];

export const SCROLL_SEQUENCE_PROPS: PropRow[] = [
  {
    name: 'frames',
    type: 'string[]',
    required: true,
    description: 'Array of sequential image URLs to preload and scrub on canvas.',
  },
  {
    name: 'height',
    type: 'string',
    defaultValue: "'300vh'",
    description: 'CSS height defining the total scroll travel budget for scrubbing through frames.',
  },
  {
    name: 'speed',
    type: 'number',
    defaultValue: '1.5',
    description: 'Scrub sensitivity multiplier across the image frame array.',
  },
  {
    name: 'className',
    type: 'string',
    defaultValue: "''",
    description: 'Classes merged onto canvas container.',
  },
];

export const USE_MAGNETIC_PROPS: PropRow[] = [
  {
    name: 'targetRef',
    type: 'RefObject<HTMLElement>',
    required: true,
    description: 'Target element to apply magnetic spring physics pull towards cursor.',
  },
  {
    name: 'strength',
    type: 'number',
    defaultValue: '0.3',
    description: 'Magnetic attraction intensity towards pointer position.',
  },
  {
    name: 'radius',
    type: 'number',
    defaultValue: '150',
    description: 'Distance threshold in pixels within which the element detects and attracts pointer.',
  },
];
