# ScrollCraft Complete Audit And Implementation Plan

## Verdict

ScrollCraft has a strong foundation: a four-phase ticker, Lenis inertia, native CSS scroll timelines, visibility culling, compositor utilities, and extensive unit/stress tests. The main production gap is runtime coordination. Solvers, hooks, and components duplicate scheduling, geometry invalidation, DOM ownership, and cleanup logic.

The engine can deliver GSAP/Framer Motion-level smoothness for moderate transform/opacity workloads, but universal 120/144 FPS claims require real browser and device evidence.

## Scope

- `packages/core/src`: all engine services, drivers, solvers, registries, math, lifecycle, and exports.
- `packages/react/src/primitives`: all six primitives.
- `packages/react/src/hooks`: all hooks, including restoration, ticker, timeline, and diagnostics.
- `packages/react/src/components`: provider, feature components, inspector, and utilities.
- `packages/r3f/src`: timeline bridge.
- Existing tests, package exports, browser tests, and release documentation.

Excluded: visual redesign, worker-based DOM writes, and new third-party animation dependencies.

## Highest-Priority Findings

### Core runtime

- `ticker.ts` dispatches independent callbacks instead of scheduling engine nodes with priorities and budgets.
- Task arrays still require Map/Set checks on the hot path.
- `dt` is clamped to 33ms without an explicit long-frame recovery policy.
- `driver.ts` has no priority, invalidation, visibility, quality, or numeric-render contract.
- `inertia.ts` and `scroll-value.ts` need snapshot subscriber iteration and consistent error isolation.
- `inertia.ts` clears subscribers during destroy; define terminal destroy or explicit reinitialization semantics.

### Rendering and ownership

- `dom.ts` recomposes transform strings immediately on every owner update.
- `fast-transform.ts` exists but is not the canonical renderer.
- Opacity, filter, border radius, `will-change`, animation fields, CSS variables, and SVG properties lack one ownership model.
- `SmartCompositor` can overwrite pre-existing `will-change` state.
- `TransformSolver` still serializes numeric values into strings and directly writes non-transform properties.
- Measurement that temporarily clears transform can conflict with other animation owners.

### Geometry and scale

- Trigger parsing is duplicated in transform, draw, and spatial systems.
- Timeline evaluation linearly scans segments on every update.
- Spatial registry updates all triggers linearly.
- Stacked cards perform O(n²) buried-depth work.
- Nested scroller coordinate conversion is not a shared engine contract.
- Markers write every marker every frame instead of being dirty-aware.

### Heavy workloads

- Sequence loading needs decode concurrency, visibility pause, context-loss recovery, and memory budgets.
- Text reveal writes many targets individually and needs batched numeric output.
- Blur, backdrop-filter, SVG, and canvas work need adaptive quality policies.
- Hardware tier detection is heuristic and should be combined with measured runtime quality.

## Primitive Actions

- **Parallax:** shared scheduler, native runtime probe, culling, numeric renderer, ownership-safe cleanup.
- **Reveal:** preserve ownership in reduced-motion and already-past cleanup paths.
- **Pin:** define bottom-boundary semantics, preserve caller position/top styles, test clipping fallback and spacers.
- **ScrollProgress:** use centralized compositor and restore transform origin/will-change.
- **ScrollTransform:** migrate opacity/filter/border-radius to ownership-aware numeric output.
- **ScrollDraw:** implement or rename `bidirectional`, preserve dash styles, and test cleanup/ref swaps.

## Hook Actions

- **useParallax:** remove duplicated resize/load/image listeners; use scheduler and invalidation coordinator.
- **useReveal:** lifecycle-owned observer registration and cleanup.
- **usePin:** move clipping and spacing ownership behind core contracts.
- **useScrollProgress:** use one scroll source, shared trigger compiler, and one reactive subscription.
- **useScrollTransform/useScrollDraw:** use compiled option identity and shared scheduler lifecycle.
- **useScrollTimeline:** stop writing directly inside scroll subscribers; render through ticker and numeric compositor.
- **useScrollDirection:** fix bottom behavior and use style ownership.
- **useTicker:** preserve API, later add priority/budget options through compatibility adapter.
- **useRenderTracker:** development-only by default and backed by runtime telemetry.
- **useScrollRestoration:** make the engine the single scroll authority and use invalidation-aware retries.
- **useMagnetic:** enforce reduced motion and robust inner-target lifecycle.

## Component Actions

- **Provider/context:** centralize invalidation, make route patching idempotent, test multiple providers and StrictMode.
- **HorizontalScroll:** add culling, shared invalidation, and native/JS parity tests.
- **VelocityMarquee:** cache motion preference, use quality policy, and avoid unconditional duplicate content cost.
- **ScrollSequence:** add resource manager, decode budget, visibility pause, context restoration, and stronger frame identity.
- **TextReveal:** define text extraction, preserve accessible text, and batch target writes.
- **SkewGallery:** use numeric renderer, culling, and tier-based degradation.
- **StackedCards:** fix dynamic card identity, culling, and O(n²) core algorithm.
- **ScrollInspector:** dev-only ownership, marker reference counting, timer cleanup, and focus tests.
- **R3F:** runtime capability probe and demand-driven frame-loop policy.

## New Engine Layers

### 1. Style ownership registry

Own transform, opacity, filter, border radius, `will-change`, animation fields, CSS variables, SVG dash fields, and base inline values.

Requirements:

- owner tokens and deterministic precedence;
- initial-value snapshots;
- restore only values still owned by the engine;
- idempotent clear/destroy;
- development conflict diagnostics.

### 2. Runtime node scheduler

Replace one update/render task per integration with nodes containing:

- phase participation;
- priority lane;
- active, dormant, visible, and settling state;
- measure/update/render dirty flags;
- estimated cost;
- settle policy;
- cleanup callback.

Keep the existing ticker API through a compatibility adapter.

### 3. Frame snapshot and invalidation coordinator

Create one per-frame snapshot containing scroll, velocity, direction, progress, viewport, time, motion preference, quality tier, and layout version. Centralize resize, font, image, DOM, route, and manual invalidation.

### 4. Canonical numeric renderer

Make `fast-transform.ts` the default path. Solvers publish numbers; the renderer serializes once per dirty element. Keep raw strings only for compatibility. Add one-write-per-element tests.

### 5. Compiled geometry and timelines

Compile trigger expressions and timeline tracks once. Use monotonic cursors, binary search for jumps, shared coordinate conversion, active-range indexing, and one refresh pass.

### 6. Adaptive quality/resource manager

Use frame time, long tasks, active nodes, writes, visibility, and sequence memory pressure. Govern blur, layers, update throttling, image decoding, canvas DPR, SVG, and text complexity.

### 7. Native driver verifier

Use CSS feature detection first, then a runtime probe for actual scroll-linked progress. Fall back to JS when inconclusive and restore all native inline styles safely.

## Implementation Phases

### Phase 0: Baseline

- Run core, React, R3F lint/build/tests and browser tests.
- Record bundle sizes and browser traces.
- Classify historical findings as fixed, open, or deferred.

### Phase 1: Correctness and lifecycle

- Implement style ownership.
- Isolate subscriber and observer errors.
- Make destroy paths idempotent.
- Fix trigger, draw, pin, restoration, route, and sequence lifecycle edge cases.
- Add regression tests.

### Phase 2: Shared geometry

- Consolidate resize/font/image/body invalidation.
- Compile trigger grammar.
- Share geometry between transform, draw, pin, progress, and spatial registry.
- Add nested scroller coordinates.

### Phase 3: Scheduler compatibility

- Add runtime node registry behind ticker.
- Add priorities, visibility, dormant wake, settle policies, and budgets.
- Adapt `useTicker` without breaking its API.
- Migrate one core solver, hook, and component first.

### Phase 4: Numeric renderer migration

1. TransformSolver and Parallax.
2. Pin, Horizontal, Magnetic, Reveal.
3. ScrollTimeline, ScrollProgress, Direction, SkewGallery.
4. TextReveal and SVG Draw.
5. Markers and remaining components.

### Phase 5: Scale optimization

- Compiled timeline tracks.
- Active trigger index.
- O(n) stacked-card depth calculation.
- Sequence decode/load budget.
- Scheduler-integrated culling.
- Dirty-aware marker rendering.

### Phase 6: Quality and native verification

- Measured quality controller with hysteresis.
- Compositor layer leases.
- Blur/filter/canvas/SVG policies.
- Native timeline runtime probe.
- Visibility/context-loss recovery.

### Phase 7: Release validation

- Chromium, WebKit, and Firefox native/JS parity.
- Overflow-hidden ancestor timeline tests.
- Reduced motion and accessibility tests.
- DevTools traces.
- Low-end Android, iOS Safari, and desktop Safari validation.

## Test Matrix

Core:

- scheduler ordering, priority, budgets, sleep/wake, cancellation;
- ownership restoration and conflict precedence;
- subscriber snapshot/error isolation;
- geometry parser and nested scroller conversion;
- timeline forward/reverse/jump behavior;
- numeric composition and skipped writes;
- O(n) stacked cards;
- sequence cancellation, bounded cache, and context loss;
- reduced-motion branches.

React:

- every primitive option and DOM prop filtering;
- dual APIs and `asChild` ref/style merging;
- StrictMode mount/unmount/remount;
- dynamic options and callbacks;
- detached nodes and ref swaps;
- multiple providers and route restoration;
- reactive render frequency;
- marker inspector ownership and cleanup.

Browser:

- native timeline inside overflow-hidden ancestors;
- JS/native parallax and horizontal parity;
- resize, font, image, and DOM shifts;
- reduced motion;
- nested scrollers;
- canvas sequence memory/visibility/context restoration;
- keyboard focus and screen-reader text.

Performance evidence:

- JS update p50/p95/p99;
- render serialization cost;
- style/layout/paint/composite cost;
- input delay and long tasks;
- writes/frame, active nodes, promoted layers;
- dropped frames at 60/90/120Hz;
- thermal soak and memory growth.

## Decisions

- React fixes must consume shared core contracts rather than add hook-specific machinery.
- Preserve public APIs through adapters.
- Native CSS is preferred only after runtime verification; JS remains first-class fallback.
- Optimize bounded p95/p99 frame work and input responsiveness, not a fixed FPS promise.
- Keep Lenis initially while abstracting native/custom/nested scroll sources.
- Numeric transforms are the primary path; raw strings remain compatibility-only.
- Quality degradation must be explicit and reversible, never starving input or focused content.
