# @scrollcraft/core

[![Status](https://img.shields.io/badge/status-beta-7C3AED.svg)](https://www.npmjs.com/package/@scrollcraft/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc.svg)](LICENSE)

Headless, high-performance game-dev scroll & physics engine for the web.

> **Beta Notice:**  
> **Beta means the public API contracts are finalizing before 1.0 — it does not mean unstable.** `@scrollcraft/core` is battle-tested for 60/120 FPS high-precision scroll animation with subpixel inertia smoothing and zero memory thrashing.

---

## Installation

```bash
npm install @scrollcraft/core
# or
pnpm add @scrollcraft/core
```

---

## Features

- **4-Phase Engine Ticker**: Deterministic `Measure -> Driver -> Update -> Flush` execution loop guarantees strict read/write layout separation and eliminates forced reflow cascades.
- **FastTransformBuffer**: Zero-allocation numeric matrix buffer applying `translate3d`, `scale`, and `rotate` directly with velocity-gated subpixel snapping.
- **Inertia Normalizer**: Virtual inertia physics inspired by Lenis, normalizing trackpad, wheel, and touch inputs into high-precision subpixel trajectories.
- **SpatialRegistry**: Shared ResizeObserver pool with WeakMap caching that automatically invalidates trigger bounds upon layout shifts without memory leaks.
- **VisibilityManager**: Frustum culling and sleep mode that pauses offscreen calculations and puts the engine to sleep during scroll idle.
- **Kinetic Solvers & Controllers**:
  - `PinningController`: Ghost-spacer pinning with clipping-ancestor detection and zero DOM distortion.
  - `ParallaxController`: Multi-plane subpixel speed differential calculations.
  - `RevealController`: Batched viewport intersection observer tracking.
  - `StackedCardsSolver`: Pinned 3D card deck layout with depth-gated pointer events.
  - `TransformSolver`: Multi-property curve interpolator (scale, opacity, 3D tilt, rotation).
  - `DrawSolver`: Vector path measurement and normalized stroke scrubbing.
  - `HorizontalScrollController`: Pinned vertical-to-horizontal translation converter.
  - `VelocityMarqueeController`: Dynamic velocity-reactive endless ribbon loop.
  - `ImageSequenceController`: High-framerate canvas frame scrubber with LRU caching.
  - `MagneticController`: Physical spring-pointer proximity attraction and bounce-back.
  - `AdaptiveQualityManager`: Real-time frame dropped-time monitoring with dynamic degradation levels.
- **GSAP & CSS Standards Bridge**: Seamless bi-directional timeline interpolation and CSS ViewTimeline support.

---

## Architecture Overview

```
Window Scroll Event / Touch Event
          │
          ▼
    ┌────────────┐
    │Lenis Engine│  (Inertia & Wheel Normalization)
    └─────┬──────┘
          │
          ▼
   ┌─────────────┐
   │3-Phase Ticker│ (Game-dev RAF Loop: Measure ➔ Update ➔ Render)
   └──────┬──────┘
          │
    ┌─────┴──────────────────┐
    ▼                        ▼
┌──────────────┐     ┌──────────────┐
│TimelineSolver│     │  PinSolver   │
└──────┬───────┘     └───────┬──────┘
       │                     │
       └──────────┬──────────┘
                  ▼
          ┌───────────────┐
          │ DOM Compositor│  (Direct GPU Transforms: Zero React Re-renders)
          └───────────────┘
```

---

## Architecture & Attributions

- **ScrollCraft Motion Engine**: The core multi-phase ticker, zero-rerender DOM compositor, native CSS Scroll-Timeline drivers, and kinetic solvers (`TimelineSolver`, `PinSolver`, `ParallaxSolver`) are custom in-house systems built from scratch.
- **Smooth Inertia Normalization**: Our virtual inertia physics take mathematical inspiration from the pioneering work of Studio Freight's Lenis. We utilize these normalization principles to provide buttery trackpad and wheel interpolation across browsers.

---

## License

MIT &copy; ScrollCraft Team
