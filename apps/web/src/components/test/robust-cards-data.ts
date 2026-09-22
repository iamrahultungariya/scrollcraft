export interface HorizontalCardItem {
  id: string;
  number: string;
  tag: string;
  title: string;
  description: string;
  metrics: string;
  icon: string;
  color: string;
}

export const HORIZONTAL_CARDS: HorizontalCardItem[] = [
  {
    id: 'c1',
    number: '01',
    tag: 'ARCHITECTURE',
    title: 'Zero Re-render Engine',
    description: 'Bypasses React reconciliation on every frame. Scroll metrics stream directly into GPU transforms without causing Virtual DOM diffing.',
    metrics: '0 React renders / 120 FPS',
    icon: 'Zap',
    color: '#8b5cf6',
  },
  {
    id: 'c2',
    number: '02',
    tag: 'TICKER PIPELINE',
    title: 'Three-Phase Ticker',
    description: 'Deterministic microtask sequencing orchestrates Read, Solve, and Render phases with zero layout thrashing or synchronous reflows.',
    metrics: '< 0.2ms task overhead',
    icon: 'Cpu',
    color: '#ec4899',
  },
  {
    id: 'c3',
    number: '03',
    tag: 'GPU COMPOSITOR',
    title: 'TransformComposer Direct Writes',
    description: 'Synthesizes translate3d, scale3d, and rotate3d matrices directly to HTMLElement.style.transform through unified string builders.',
    metrics: 'Composite-only paint',
    icon: 'Layers',
    color: '#06b6d4',
  },
  {
    id: 'c4',
    number: '04',
    tag: 'PERFORMANCE',
    title: 'Autonomous Frustum Culling',
    description: 'Elements beyond the viewport boundaries enter hibernation. Ticker tasks are automatically paused to conserve device battery and GPU cycles.',
    metrics: '70% GPU cycles saved',
    icon: 'EyeOff',
    color: '#10b981',
  },
  {
    id: 'c5',
    number: '05',
    tag: 'KINETICS',
    title: 'Smooth Physics Driver',
    description: 'Powered by an internal Lenis-compatible kinetic engine delivering subpixel smooth scrolling across mice, trackpads, and touch devices.',
    metrics: '16.6ms frame pacing',
    icon: 'Activity',
    color: '#f59e0b',
  },
  {
    id: 'c6',
    number: '06',
    tag: 'INTEGRITY',
    title: 'Style Leasing Protocol',
    description: 'Guarantees that multiple concurrent scroll primitives operating on the same DOM node never clobber each others styles or transform matrices.',
    metrics: '100% collision free',
    icon: 'Shield',
    color: '#6366f1',
  },
  {
    id: 'c7',
    number: '07',
    tag: 'TYPOGRAPHY',
    title: 'Zero-Reflow Text Splitting',
    description: 'Character and word slicing with CSS inline span preserves natural text flow while allowing granular per-character 3D rotations.',
    metrics: 'Sub-millisecond init',
    icon: 'Type',
    color: '#d946ef',
  },
  {
    id: 'c8',
    number: '08',
    tag: 'RESPONSIVE',
    title: 'Global Resize Manager',
    description: 'Centralized ResizeObserver batch-dispatches geometry remeasurements in requestAnimationFrame to eliminate single-element observer noise.',
    metrics: 'Debounced batching',
    icon: 'Maximize2',
    color: '#14b8a6',
  },
  {
    id: 'c9',
    number: '09',
    tag: 'ACCELERATION',
    title: 'Velocity Dynamic Marquee',
    description: 'Seamless kinetic marquee that proportionally accelerates in response to scroll velocity and smoothly damps down to baseline speed.',
    metrics: 'Dynamic velocity scalar',
    icon: 'Repeat',
    color: '#f43f5e',
  },
  {
    id: 'c10',
    number: '10',
    tag: 'MATHEMATICS',
    title: 'Hermite & Spring Solvers',
    description: 'Analytical cubic Hermite spline interpolation and critically damped harmonic oscillators for natural inertia and snapping physics.',
    metrics: 'No external physics engine',
    icon: 'TrendingUp',
    color: '#eab308',
  },
  {
    id: 'c11',
    number: '11',
    tag: 'HARDWARE TIER',
    title: 'Dynamic Hardware Profiler',
    description: 'Profiles client GPU capabilities into High, Balanced, or Low tiers, dynamically adjusting blur convolutions to preserve framerates.',
    metrics: 'Auto-adapts to mobile',
    icon: 'Smartphone',
    color: '#3b82f6',
  },
  {
    id: 'c12',
    number: '12',
    tag: 'MEMORY',
    title: 'Zero Memory Leaks',
    description: 'Strict cleanup lifecycle unregisters all Ticker tasks, observer leases, and style listeners upon component unmount.',
    metrics: '0 dangling references',
    icon: 'Database',
    color: '#84cc16',
  },
];

export interface StackedCardItem {
  id: string;
  step: string;
  badge: string;
  title: string;
  description: string;
  details: string[];
  gradient: string;
}

export const STACKED_CARDS_DATA: StackedCardItem[] = [
  {
    id: 's1',
    step: 'LAYER 01',
    badge: 'DECLARATIVE DOM',
    title: 'The React Tree & Component Primitives',
    description: 'Developers declare scroll behavior using composable JSX primitives like <Parallax>, <Pin>, <ScrollTransform>, and <TextReveal> with full TypeScript type safety.',
    details: [
      'Universal slot pattern supporting `asChild` composition',
      'Hydration-safe dual-pass initialization preventing SSR layout shifts',
      'Zero React state mutations during frame updates',
    ],
    gradient: 'from-violet-500/20 to-indigo-500/5',
  },
  {
    id: 's2',
    step: 'LAYER 02',
    badge: 'DETERMINISTIC CLOCK',
    title: 'ScrollCraft Global RAF Ticker Graph',
    description: 'A single high-precision requestAnimationFrame loop drives all active animations, categorizing every frame operation into Update, Render, and Post-Render microtasks.',
    details: [
      'Batched DOM measurements eliminate layout thrashing',
      'Settled task automatic sleeping saves battery and CPU cycles',
      'Dynamic frame pacing supporting 60Hz, 120Hz, and ProMotion displays',
    ],
    gradient: 'from-pink-500/20 to-purple-500/5',
  },
  {
    id: 's3',
    step: 'LAYER 03',
    badge: 'ANALYTICAL SOLVERS',
    title: 'Headless Mathematical Solvers',
    description: 'Pure functional solvers compute normalized progress coordinates, spring curves, clamp boundaries, and view-frustum visibility bounds independently of the DOM.',
    details: [
      'Subpixel precision hermite interpolation',
      'Bounding box frustum culling outside active viewport margins',
      'Spatial cache tracking with zero garbage collection allocations',
    ],
    gradient: 'from-cyan-500/20 to-blue-500/5',
  },
  {
    id: 's4',
    step: 'LAYER 04',
    badge: 'HARDWARE COMPOSITOR',
    title: 'TransformComposer Direct GPU Writes',
    description: 'Transforms are dispatched directly to the browsers hardware compositor using translate3d and will-change leasing, achieving fluid 120 FPS execution.',
    details: [
      'Direct node style mutation bypassing VDOM diffing overhead',
      'Style lease locks prevent conflicting animation properties',
      'Hardware rasterization isolation on GPU render threads',
    ],
    gradient: 'from-emerald-500/20 to-teal-500/5',
  },
];
