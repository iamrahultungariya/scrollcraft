# ScrollCraft

[![@scrollcraft/core](https://img.shields.io/badge/@scrollcraft/core-beta-7C3AED.svg)](https://www.npmjs.com/package/@scrollcraft/core)
[![@scrollcraft/react](https://img.shields.io/badge/@scrollcraft/react-beta-7C3AED.svg)](https://www.npmjs.com/package/@scrollcraft/react)
[![@scrollcraft/r3f](https://img.shields.io/badge/@scrollcraft/r3f-alpha-amber.svg)](https://www.npmjs.com/package/@scrollcraft/r3f)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-%3C%205%20KB%20brotli-7C3AED.svg)](#packages-in-this-monorepo)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg)](LICENSE)

**The scroll engine React never had.**

High-performance, GPU-composited motion engine, declarative primitives, and headless scroll hooks for React. Powered by a custom zero-rerender architecture and smooth inertia normalization.

> **Beta Notice:**  
> ScrollCraft is actively entering its public Beta. "Beta" signifies that public API contracts are finalizing toward 1.0 — the engine underneath is rock-solid and battle-tested for production web applications. All kinetic primitives bypass React's reconciliation cycle, writing subpixel transform matrices directly to the GPU compositor for guaranteed 120 FPS performance with zero re-render overhead.

---

## Packages in This Monorepo

| Package | Status | Size (Brotli) | Description |
|---|---|---|---|
| [`@scrollcraft/core`](./packages/core) | **Beta** | `~1.4 - 2.2 KB (per solver)` | Headless 3-phase ticker, inertia physics, timeline solver & pin solver. |
| [`@scrollcraft/react`](./packages/react) | **Beta** | `~2.8 - 5.0 KB (per primitive)` | Declarative React primitives (`<Parallax>`, `<Reveal>`, `<Pin>`, `<ScrollProgress>`) & hooks. |
| [`@scrollcraft/r3f`](./packages/r3f) | **Alpha (Experimental)** | `~1.7 KB` | Experimental pull-based Three.js / React Three Fiber scroll bridge with zero RAF conflicts. |

---

## Quick Start

Install the packages:

```bash
npm install @scrollcraft/core@beta @scrollcraft/react@beta
# or
pnpm add @scrollcraft/core@beta @scrollcraft/react@beta
# or
yarn add @scrollcraft/core@beta @scrollcraft/react@beta
```

Wrap your root layout in Next.js App Router:

```tsx
// app/layout.tsx
import { ScrollProvider } from '@scrollcraft/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollProvider smooth={true}>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
```

### 1. Parallax
Layer elements with fluid physical depth offsets:

```tsx
import { Parallax } from '@scrollcraft/react';

export function HeroScene() {
  return (
    <div className="relative min-h-screen">
      <Parallax speed={-0.2}>
        <div className="background-layer" />
      </Parallax>
      <Parallax speed={0.15}>
        <div className="foreground-card" />
      </Parallax>
    </div>
  );
}
```

### 2. Reveal
Fade and slide elements in as they intersect the viewport:

```tsx
import { Reveal } from '@scrollcraft/react';

export function FeatureList() {
  return (
    <Reveal direction="up" distance={30} delay={0.1}>
      <div className="card">Production Grade Physics</div>
    </Reveal>
  );
}
```

### 3. Pin
Sticky-lock sections while subordinate steps or content scrub through:

```tsx
import { Pin } from '@scrollcraft/react';

export function StorySection() {
  return (
    <Pin start="top top" end="+=150%">
      <div className="pinned-display">Locked in viewport</div>
    </Pin>
  );
}
```

### 4. ScrollProgress
Track progress across a section or entire document:

```tsx
import { ScrollProgress } from '@scrollcraft/react';

export function ReadingBar() {
  return (
    <ScrollProgress className="fixed top-0 left-0 right-0 h-1 bg-violet-600 origin-left" />
  );
}
```

### 5. ScrollTransform
Direct GPU multi-property compositor interpolator (scale, opacity, 3D tilt, rotation):

```tsx
import { ScrollTransform } from '@scrollcraft/react';

export function MorphHero() {
  return (
    <ScrollTransform preset="3d-flip" start="top center" end="bottom top">
      <div className="card">Hardware Compositor Morph</div>
    </ScrollTransform>
  );
}
```

### 6. ScrollDraw
Universal SVG geometry line-drawing scrubber for vectors, paths, polylines, and circles:

```tsx
import { ScrollDraw } from '@scrollcraft/react';

export function VectorPathScrub() {
  return (
    <svg viewBox="0 0 1000 300">
      <ScrollDraw start="top 75%" end="center center">
        <path d="M 50 150 C 250 50, 450 250, 650 150" stroke="#8b5cf6" strokeWidth="4" fill="none" />
      </ScrollDraw>
    </svg>
  );
}
```

---

## High-Performance Components & DevTools

Beyond the 6 core primitives, `@scrollcraft/react` ships with 8 specialized components:

- `<VelocityMarquee />`: Kinetic continuous marquee track accelerating with scroll velocity.
- `<HorizontalScroll />`: Pinned horizontal gallery converting vertical scroll into smooth horizontal track translation.
- `<ScrollSequence />`: Canvas-based high-DPI image sequence scrubber with automatic frame preloading.
- `<TextReveal />`: Split-text reveal by word, character, or line with SSR zero-layout-shift fallback.
- `<Magnetic />`: Cursor proximity magnetic spring physics with automatic bounce-back.
- `<SkewGallery />`: Scroll velocity-reactive image gallery with dynamic angular shear deformation.
- `<StackedCards />`: Pinned 3D card deck with automatic height calculation and depth-gated pointer events.
- `<ScrollInspector />`: Development HUD featuring frame-drop telemetry ribbon, live spring tuner, and trigger visualizer.

---

## Reactive Hooks

Prefer headless access to scroll data? Use 13 reactive hooks that write directly to element refs or return fine-grained selectors without triggering React component re-renders:

- `useScrollProgress()`: Normalized scroll progress (0–1), velocity, direction, and observable `progressValue`.
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

## 3D WebGL (React Three Fiber) — Alpha

For React Three Fiber projects, `@scrollcraft/r3f` provides a pull-based bridge that synchronizes Three.js camera/object transforms directly inside `useFrame`:

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';

function Scene({ target }: { target: HTMLElement | null }) {
  const { tick } = useScroll3D(target);
  
  useFrame((state) => {
    const { progress } = tick();
    // Rotate 3D mesh based on scroll progress
    meshRef.current.rotation.y = progress * Math.PI * 2;
  });

  return <mesh ref={meshRef}><boxGeometry /></mesh>;
}
```

---

## Core Engineering Principles

1. **Strict 0 React Re-Renders**: All frame-by-frame updates execute via direct DOM GPU compositor writes (`transform`, `opacity`), completely bypassing React's reconciliation tree.
2. **Deterministic 3-Phase Loop**: Measure ➔ Update ➔ Render separation guarantees layout read/write isolation with zero layout thrashing.
3. **Inertia Normalizer**: Virtual inertia physics inspired by Lenis, wired directly into ScrollCraft's proprietary zero-rerender animation engine.
4. **RSC Safe**: 100% compatible with React 19 and Next.js 15 Server Components.
5. **Free & Open Source**: MIT License with no commercial tier locks.

---

## Architecture & Attributions

- **ScrollCraft Motion Engine**: The core multi-phase ticker, zero-rerender DOM compositor, native CSS Scroll-Timeline drivers, and declarative primitives (`<Parallax>`, `<Pin>`, `<Reveal>`, `<StackedCards>`) are custom in-house systems built from scratch for React.
- **Smooth Inertia Normalization**: Our virtual inertia physics take mathematical inspiration from the pioneering work of Studio Freight's Lenis. We utilize these normalization principles to provide buttery trackpad and wheel interpolation across browsers, wired directly into ScrollCraft's proprietary zero-rerender animation engine.

---

## Community Bug Triage & Patch Policy (v0.2.x SLA)

To ensure high reliability and predictable maintenance for teams building on ScrollCraft, all reported issues are governed by our public triage SLA:

- **48-Hour Triage Window**: Every issue reported on [GitHub Issues](https://github.com/ScrollCraft/scrollcraft/issues) is verified and classified within 48 hours.
- **High Severity (P0)**: Application crashes, severe memory leaks (OOM), core primitive completely inoperable, or catastrophic scroll lock / state loss.  
  *Resolution SLA*: Immediate hotfix patch released within 24–48 hours.
- **Medium Severity (P1)**: Flawed visual/physics behavior under standard usage, silent failure (e.g. ref or prop forwarding defects), or documented prop API mismatches.  
  *Resolution SLA*: Remediated in the scheduled 0.2.1 patch window.
- **Small Severity (P2)**: Sub-pixel cosmetic glitches, rare edge-case configurations, or nice-to-have documentation/type ergonomics.  
  *Resolution SLA*: Deferred or bundled into scheduled minor releases (0.2.2+ or 0.3.0).

---

## Roadmap

Explore the [ScrollCraft Roadmap & Architecture Plan](https://scrollcraft.dev/roadmap) for details on our current **v0.2.0 Beta (LIVE)** release, the 7 solved browser footguns, and our upcoming **v0.3.0 Native Timelines & Spatial Motion** milestone.

---
## License

MIT &copy; ScrollCraft Team
