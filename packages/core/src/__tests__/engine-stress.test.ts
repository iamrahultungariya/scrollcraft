/**
 * ScrollCraft Core Engine Robustness & Stress Testing Suite
 * Validates high-concurrency 120 FPS performance, task churn,
 * velocity shock resilience, chaotic inputs, and memory stability.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Ticker } from '../ticker';
import { ParallaxSolver } from '../parallax';
import { PinSolver } from '../pinning';
import { TextRevealSolver } from '../text-reveal';
import { springStep, damp, clamp, mapRange } from '../math';
import { TransformComposer } from '../dom';

describe('ScrollCraft Engine High-Load Stress Testing', () => {
  let ticker: Ticker;
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalRaf = globalThis.requestAnimationFrame;
  const originalCancelRaf = globalThis.cancelAnimationFrame;

  beforeEach(() => {
    Object.assign(globalThis, {
      window: {
        scrollY: 0,
        scrollX: 0,
        pageYOffset: 0,
        pageXOffset: 0,
        innerHeight: 1000,
        innerWidth: 1200,
        devicePixelRatio: 2,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        setTimeout: (fn: Function) => { fn(); return 1; },
        clearTimeout: vi.fn(),
      },
      document: {
        documentElement: { scrollHeight: 20000 },
        body: { scrollHeight: 20000 },
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {},
          setAttribute: vi.fn(),
        }),
        head: { appendChild: vi.fn() },
        getElementById: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        hidden: false,
      },
      requestAnimationFrame: (_cb: FrameRequestCallback) => {
        return 1;
      },
      cancelAnimationFrame: vi.fn(),
    });

    ticker = Ticker.get();
  });

  afterEach(() => {
    ticker.stop();
    ticker.setErrorHandler(null);
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
      requestAnimationFrame: originalRaf,
      cancelAnimationFrame: originalCancelRaf,
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STRESS TEST 1: 500+ Concurrent Solvers Under 120 FPS Frame Budget
  // ══════════════════════════════════════════════════════════════════
  it('STRESS: 500 concurrent parallax elements sustain < 8.33ms (120 FPS budget)', () => {
    const COUNT = 500;
    const solvers: ParallaxSolver[] = [];
    const elements: HTMLElement[] = [];

    for (let i = 0; i < COUNT; i++) {
      const el = {
        style: { transform: '' },
        getBoundingClientRect: () => ({
          top: i * 50,
          left: 0,
          width: 200,
          height: 100,
        }),
      } as unknown as HTMLElement;
      elements.push(el);
      solvers.push(new ParallaxSolver(el, { speed: 0.1 + (i % 10) * 0.05 }));
    }

    // Warmup JIT compiler
    for (let i = 0; i < COUNT; i++) {
      solvers[i].update(500);
      solvers[i].render();
    }

    // Benchmark: 5-sample median to eliminate JIT compilation and CPU scheduling variance
    const SAMPLES = 5;
    const FRAMES_PER_SAMPLE = 60;
    const sampleResults: number[] = [];

    for (let s = 0; s < SAMPLES; s++) {
      const start = performance.now();
      for (let f = 0; f < FRAMES_PER_SAMPLE; f++) {
        const scrollY = (s * FRAMES_PER_SAMPLE + f) * 10;
        for (let i = 0; i < COUNT; i++) {
          solvers[i].update(scrollY);
          solvers[i].render();
        }
      }
      const duration = performance.now() - start;
      sampleResults.push(duration / FRAMES_PER_SAMPLE);
    }

    const sorted = [...sampleResults].sort((a, b) => a - b);
    const medianMsPerFrame = sorted[Math.floor(SAMPLES / 2)];
    const theoreticalFps = Math.round(1000 / medianMsPerFrame);

    console.log(
      `\n>>> STRESS: 500 Parallax Elements (5-run median): ${medianMsPerFrame.toFixed(3)}ms / frame (${theoreticalFps} theoretical FPS) [sorted samples: ${sorted.map((v) => v.toFixed(3) + 'ms').join(', ')}]`
    );

    // 120 FPS budget is 8.33ms; median JS math execution must comfortably sustain < 8.33ms
    expect(medianMsPerFrame).toBeLessThan(8.33);

    // Teardown
    for (const solver of solvers) solver.destroy();
  });

  // ══════════════════════════════════════════════════════════════════
  // STRESS TEST 2: Rapid Task Churn & Heavy Registration Churn
  // ══════════════════════════════════════════════════════════════════
  it('STRESS: 1,000 rapid task registrations and removals across phases execute cleanly', () => {
    const TASK_COUNT = 1000;
    let executedCount = 0;

    // Benchmark: 5-sample median to eliminate task churn scheduling variance
    const SAMPLES = 5;
    const sampleDurations: number[] = [];

    for (let s = 0; s < SAMPLES; s++) {
      const start = performance.now();

      // Register 1,000 tasks across measure, update, and render
      for (let i = 0; i < TASK_COUNT; i++) {
        const id = `churn-task-${s}-${i}`;
        const phase = i % 3 === 0 ? 'measure' : i % 3 === 1 ? 'update' : 'render';
        ticker.add(id, phase, () => {
          executedCount++;
        });
      }

      // Remove half of them before tick
      for (let i = 0; i < TASK_COUNT; i += 2) {
        ticker.remove(`churn-task-${s}-${i}`);
      }

      // Remove the remaining half
      for (let i = 1; i < TASK_COUNT; i += 2) {
        ticker.remove(`churn-task-${s}-${i}`);
      }

      sampleDurations.push(performance.now() - start);
    }

    const sorted = [...sampleDurations].sort((a, b) => a - b);
    const medianDuration = sorted[Math.floor(SAMPLES / 2)];

    console.log(
      `>>> STRESS: 1,000 Task Churn Duration (5-run median): ${medianDuration.toFixed(2)}ms [sorted samples: ${sorted.map((v) => v.toFixed(2) + 'ms').join(', ')}]`
    );

    expect(medianDuration).toBeLessThan(50); // High throughput task management
    expect(executedCount).toBe(0);
  });

  // ══════════════════════════════════════════════════════════════════
  // STRESS TEST 3: Velocity Shock & Instant Direction Reversal
  // ══════════════════════════════════════════════════════════════════
  it('STRESS: extreme velocity shock (+50,000 px/s to -50,000 px/s) does not explode spring physics', () => {
    const config = { stiffness: 300, damping: 15, mass: 1, precision: 0.001 };
    const state = { position: 0, velocity: 0, settled: false };

    // Fling forward with massive kinetic impulse
    springStep(0, 1000, 50000, config, 0.016, state);
    expect(Number.isFinite(state.position)).toBe(true);
    expect(Number.isFinite(state.velocity)).toBe(true);

    // Instant reverse impulse in opposite direction
    springStep(state.position, 0, -50000, config, 0.016, state);
    expect(Number.isFinite(state.position)).toBe(true);
    expect(Number.isFinite(state.velocity)).toBe(true);

    // Run 180 frames to verify settling back to equilibrium
    for (let f = 0; f < 180; f++) {
      springStep(state.position, 0, state.velocity, config, 0.016, state);
    }

    expect(state.settled).toBe(true);
    expect(state.position).toBe(0);
  });

  // ══════════════════════════════════════════════════════════════════
  // STRESS TEST 4: TransformComposer Multi-Owner Concurrency
  // ══════════════════════════════════════════════════════════════════
  it('STRESS: 50 independent animation owners writing to the same element compose without conflict', () => {
    const element = { style: { transform: 'scale(1)' } } as unknown as HTMLElement;

    // 50 distinct owners (e.g. parallax, magnetic, hover, tilt, physics, etc.)
    for (let i = 0; i < 50; i++) {
      TransformComposer.set(element, `module-${i}`, `translate3d(0, ${i}px, 0)`);
    }

    // Verify all 50 owners are represented in the composed style
    expect(element.style.transform).toContain('scale(1)');
    expect(element.style.transform).toContain('translate3d(0, 0px, 0)');
    expect(element.style.transform).toContain('translate3d(0, 49px, 0)');

    // Fast-path benchmark: 5-sample median of 1,000 consecutive identical sets
    const SAMPLES = 5;
    const sampleDurations: number[] = [];

    for (let s = 0; s < SAMPLES; s++) {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        TransformComposer.set(element, 'module-25', 'translate3d(0, 25px, 0)');
      }
      sampleDurations.push(performance.now() - start);
    }

    const sorted = [...sampleDurations].sort((a, b) => a - b);
    const medianDuration = sorted[Math.floor(SAMPLES / 2)];

    console.log(
      `>>> STRESS: 1,000 Static Compositions Fast-Path (5-run median): ${medianDuration.toFixed(3)}ms [sorted samples: ${sorted.map((v) => v.toFixed(3) + 'ms').join(', ')}]`
    );

    expect(medianDuration).toBeLessThan(15); // Ultra-fast cache hit under multi-worker load

    // Clear all owners
    for (let i = 0; i < 50; i++) {
      TransformComposer.clear(element, `module-${i}`);
    }

    // Restores original base transform
    expect(element.style.transform).toBe('scale(1)');
  });

  // ══════════════════════════════════════════════════════════════════
  // STRESS TEST 5: Chaos, Degenerate Boundaries & Non-Finite Inputs
  // ══════════════════════════════════════════════════════════════════
  it('STRESS: handles chaotic non-finite inputs (NaN, Infinity, 0-division) without throwing', () => {
    // Math functions under chaos
    expect(clamp(NaN, 0, 100)).toBe(0);
    expect(clamp(Infinity, 0, 100)).toBe(100);
    expect(clamp(-Infinity, 0, 100)).toBe(0);

    expect(damp(NaN, 100, 10, 0.016)).toBe(100);
    expect(damp(0, NaN, 10, 0.016)).toBe(0);
    expect(damp(0, 100, -10, 0.016)).toBeGreaterThanOrEqual(0);

    expect(mapRange(0, 0, 0, 100, 50)).toBe(0); // 0-range division by zero
    expect(mapRange(0, 100, 0, 100, NaN)).toBe(0);

    // Spring with 0 mass or negative damping
    const degenerateConfig = { stiffness: 100, damping: 10, mass: 0 };
    const springRes = springStep(0, 100, 0, degenerateConfig, 0.016);
    expect(Number.isFinite(springRes.position)).toBe(true);
    expect(Number.isFinite(springRes.velocity)).toBe(true);

    // Degenerate element dimensions (0x0)
    const zeroElem = {
      style: { transform: '' },
      getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0 }),
    } as unknown as HTMLElement;

    const zeroParallax = new ParallaxSolver(zeroElem, { speed: 0.5 });
    expect(() => zeroParallax.update(0)).not.toThrow();
    zeroParallax.destroy();

    const zeroPin = new PinSolver(zeroElem, { duration: 0 });
    expect(() => zeroPin.update(0)).not.toThrow();
    zeroPin.destroy();
  });

  // ══════════════════════════════════════════════════════════════════
  // STRESS TEST 6: Background Tab Suspension & Visibility Recovery (Layer 4)
  // ══════════════════════════════════════════════════════════════════
  it('STRESS: tab backgrounding suspends RAF loop and foregrounding cleanly resumes without frame burst', () => {
    let cancelCount = 0;
    let rafCount = 0;
    (globalThis as any).cancelAnimationFrame = vi.fn(() => {
      cancelCount++;
    });
    (globalThis as any).requestAnimationFrame = vi.fn(() => {
      rafCount++;
      return 42;
    });

    const listeners: Record<string, ((event?: any) => void)[]> = {};
    (document as any).addEventListener = vi.fn((evt: string, handler: any) => {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(handler);
    });

    (ticker as any).eventsBound = false;
    (ticker as any).stop();

    // Register active task to wake ticker
    ticker.add('bg-test-task', 'update', vi.fn());
    expect((ticker as any).isRunning).toBe(true);
    expect(ticker.hasActiveTasks()).toBe(true);

    // Verify visibilitychange listener was bound
    expect(listeners['visibilitychange']).toBeDefined();
    expect(listeners['visibilitychange'].length).toBeGreaterThan(0);

    // 1. Simulate tab hidden (document.hidden = true)
    (document as any).hidden = true;
    for (const listener of listeners['visibilitychange']) {
      listener();
    }

    // Must immediately halt RAF loop to conserve battery & prevent runaway physics
    expect((ticker as any).isRunning).toBe(false);
    expect(cancelCount).toBeGreaterThanOrEqual(1);

    // 2. Simulate tab unhidden (document.hidden = false)
    (document as any).hidden = false;
    for (const listener of listeners['visibilitychange']) {
      listener();
    }

    // Must immediately resume RAF loop since active tasks exist
    expect((ticker as any).isRunning).toBe(true);
    expect(rafCount).toBeGreaterThanOrEqual(2);

    // Teardown
    ticker.remove('bg-test-task');
    ticker.stop();
  });

  // ══════════════════════════════════════════════════════════════════
  // STRESS TEST 7: 400-Span TextReveal Settled-Gating & Dirty Tracking
  // ══════════════════════════════════════════════════════════════════
  it('STRESS: 400-span TextReveal settles at progress >= 1.0, skips DOM writes, resets on scroll reversal', () => {
    const container = {
      getBoundingClientRect: () => ({ top: 1000, height: 200 }),
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    } as unknown as HTMLElement;

    const chars: HTMLElement[] = [];
    for (let i = 0; i < 400; i++) {
      chars.push({
        style: { opacity: '0', filter: '', transform: '' },
      } as unknown as HTMLElement);
    }

    const solver = new TextRevealSolver(container, chars, {
      baseOpacity: 0.1,
      triggerStart: 0.8,
      triggerEnd: 0.2,
    });

    solver.measure();
    expect(solver.getSettled()).toBe(false);

    // Mid-scroll: e.g. viewportTop = 500 (inside reading zone)
    solver.update(500, 1000);
    solver.render();
    expect(solver.getSettled()).toBe(false);

    // Count opacities changed
    const modifiedCount = chars.filter((c) => c.style.opacity !== '0').length;
    expect(modifiedCount).toBeGreaterThan(0);

    // Full reveal: scroll past element so progress >= 1.0
    solver.update(2000, 1000);
    solver.render();
    expect(solver.getSettled()).toBe(true);

    // All chars fully revealed
    for (const c of chars) {
      expect(c.style.opacity).toBe('1');
    }

    // Settled gate verification:
    // With progress >= 1.0 and scrolling down further, no DOM writes must occur
    let writeCount = 0;
    const observer = new Proxy(chars[0].style, {
      set(target, prop, value) {
        writeCount++;
        return Reflect.set(target, prop, value);
      },
    });
    chars[0].style = observer;

    // Further downward scroll frame
    solver.update(2500, 1000, 100);
    solver.render();
    expect(solver.getSettled()).toBe(true);
    expect(writeCount).toBe(0); // ZERO DOM WRITES!

    // Reversal test: scrolling backwards resets settled state
    solver.update(1500, 1000, -50);
    expect(solver.getSettled()).toBe(false);

    // Measure test: resize resets settled state
    solver.update(2500, 1000);
    solver.render();
    expect(solver.getSettled()).toBe(true);
    solver.measure();
    expect(solver.getSettled()).toBe(false);

    solver.destroy();
  });
});
