# @scrollcraft/react

[![Status](https://img.shields.io/badge/status-beta-7C3AED.svg)](https://www.npmjs.com/package/@scrollcraft/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg)](LICENSE)

React and Next.js-native scroll toolkit with composable primitives and reactive hooks.

> **Beta Notice:**  
> **Beta means the public API contracts are finalizing before 1.0 — it does not mean unstable.** `@scrollcraft/react` is battle-tested for production React 18/19 and Next.js 14/15 applications, safely isolating React's rendering lifecycle from high-frequency scroll RAF updates for 120 FPS performance with zero re-renders.

---

## Installation

```bash
npm install @scrollcraft/react
# or
pnpm add @scrollcraft/react
# or
yarn add @scrollcraft/react
```

---

## Primitives

### `<Parallax>`
Displaces elements along the scroll axis with customizable speed multipliers and boundary clamping:

```tsx
import { Parallax } from '@scrollcraft/react';

<Parallax speed={-0.2}>
  <img src="/background.webp" alt="Parallax Background" />
</Parallax>
```

### `<Reveal>`
Triggers hardware-accelerated entry animations when intersecting the viewport:

```tsx
import { Reveal } from '@scrollcraft/react';

<Reveal direction="up" distance={40} delay={0.15}>
  <h2>Slide and fade on scroll</h2>
</Reveal>
```

### `<Pin>`
Locks an element in the viewport while adjacent steps or content scroll through:

```tsx
import { Pin } from '@scrollcraft/react';

<Pin start="top top" end="+=100%">
  <div>Sticky presentation section</div>
</Pin>
```

### `<ScrollProgress>`
Renders progress bars, rings, or fills driven by scroll progress:

```tsx
import { ScrollProgress } from '@scrollcraft/react';

<ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-violet-600 origin-left" />
```

### `<ScrollTransform>`
Direct GPU multi-property compositor interpolator (scale, opacity, 3D tilt, rotation):

```tsx
import { ScrollTransform } from '@scrollcraft/react';

<ScrollTransform preset="3d-flip" start="top center" end="bottom top">
  <div className="card">Hardware Compositor Morph</div>
</ScrollTransform>
```

### `<ScrollDraw>`
Universal SVG geometry line-drawing scrubber for vectors, paths, polylines, and circles:

```tsx
import { ScrollDraw } from '@scrollcraft/react';

<ScrollDraw start="top 75%" end="center center">
  <path d="M 50 150 C 250 50, 450 250, 650 150" stroke="#8b5cf6" strokeWidth="4" fill="none" />
</ScrollDraw>
```

---

## High-Performance Components & DevTools

- `<VelocityMarquee />`: Kinetic continuous marquee accelerating dynamically with scroll velocity.
- `<HorizontalScroll />`: Pinned horizontal gallery converting vertical scroll into smooth horizontal track translation.
- `<ScrollSequence />`: Canvas-based high-DPI image sequence scrubber with automatic frame preloading.
- `<TextReveal />`: Split-text reveal by word, character, or line with SSR zero-layout-shift fallback.
- `<Magnetic />`: Cursor proximity magnetic spring physics with automatic bounce-back.
- `<SkewGallery />`: Scroll velocity-reactive image gallery with dynamic angular shear deformation.
- `<StackedCards />`: Pinned 3D card deck with automatic height calculation and depth-gated pointer events.
- `<ScrollInspector />`: Development HUD featuring frame-drop telemetry ribbon, live spring tuner, and trigger visualizer.

---

## Headless Hooks

For direct ref control with zero component re-renders:

- `useScrollProgress()`: Returns normalized progress (`0–1`), direction, velocity, and observable `progressValue`.
- `useParallax(ref, options)`: Headless multi-layer subpixel displacement.
- `useReveal(ref, options)`: Batched IntersectionObserver entrance trigger.
- `usePin(ref, options)`: Sticky viewport locking and travel budget tracking.
- `useScrollTransform(ref, options)`: Headless multi-property style map interpolation.
- `useScrollDraw(ref, options)`: Dynamic SVG path length measurement and stroke scrub.
- `useMagnetic(options)`: Cursor spring-physics pull attached to element ref.
- `useScrollTimeline(ref, options)`: Multi-stage normalized keyframe sequencing.
- `useScrollDirection(options)`: Hysteresis-gated direction detection with iOS rubber-band guard.
- `useTicker(callback, phase)`: Direct subscription to the 4-phase microtask game loop.
- `useRenderTracker(name)`: Dev-mode audit utility verifying the zero-re-render invariant.
- `useScrollRestoration(options)`: Eliminates Next.js App Router scroll jumps on route transitions.
- `useTextReveal(ref, options)`: Headless split-text token animator.
- `useScrollCraft()`: Direct context access to the core engine instance and controls.
- `useScrollState(selector)`: Fine-grained slice subscription backed by `useSyncExternalStore`.

---

## License

MIT &copy; ScrollCraft Team
