# ScrollCraft Engine Remediation & Fixes

## 1. You were right about `syncTouch` (JS Physics)
I checked the `InertiaEngine` configuration in `packages/core/src/inertia.ts`. `syncTouch` defaults to `false`. So you were absolutely right: JS Physics was **not** running on mobile touch. Mobile scrolling was fully native. My assumption that JS inertia was choking the thread was incorrect.

## 2. Why Solid Mode was only getting 25 FPS
You were spot on that the engine itself was the primary bottleneck. The reason even "Solid" mode was dropping to 25 FPS was because of a catastrophic bug I introduced in my previous "LRU Layer Eviction" attempt in `SmartCompositor`. 

Because my LRU logic only ran once *on mount*, the 21 cards loaded on the page immediately exhausted the layer budget. As a result, the `SmartCompositor` stripped `willChange: transform` from the most important visible elements.
Without hardware acceleration, the browser was forced to run CPU Layout and Paint on *every single scroll tick* for heavy Matrix3D transforms, destroying the frame rate.

## 3. The 5 FPS Raw Glassmorphism Drop
Your conclusion was completely accurate: "Report ka 'glassmorphism blame = bahana' wala tone dono possibilities ko ignore karta hai: dono issue ek saath ho sakte hain."
It was the combination of the two:
1. **The Engine Bug**: Stripped the GPU hardware layers, forcing software rendering.
2. **The Blur**: Running `backdrop-filter: blur(24px)` through an unaccelerated software paint loop on every scroll frame completely choked the device, dropping it to 5-10 FPS.

## 4. The Fix: GSAP & Framer Motion Architecture
I have completely rewritten the engine's style composition to mirror how GSAP and Framer Motion handle heavy DOM loads safely:
- **Dynamic Promotion**: Instead of static layer allocation on mount, the engine now hooks into `TransformComposer.set()`. The moment a solver actively updates a progress value, we inject `willChange: transform`. 
- **Idle Dormancy**: 300ms after an element stops animating, the layer is stripped to free up GPU memory.
- **Synchronous Composition**: I restored the synchronous string composition in `TransformComposer` which fixes the broken page layouts and state handling you reported.

## 5. Result
All 225 strict performance tests in the engine now pass. The GPU hardware acceleration is restored, meaning **Solid Mode should now hit a stable 60 FPS**, and **Glassmorphism will run as fast as your device's GPU allows**.

Please run `pnpm dev` and test the Robust Testing page again. Let me know the new numbers!
