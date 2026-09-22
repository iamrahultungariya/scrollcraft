import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FrustumShield, frustumShield } from '../visibility';
import { ticker } from '../ticker';

describe('FrustumShield Culling & Boundary Clamping', () => {
  const originalWindow = (globalThis as any).window;

  beforeEach(() => {
    (globalThis as any).window = {
      scrollY: 0,
      pageYOffset: 0,
      innerHeight: 1000,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollTo: vi.fn(),
    };
    frustumShield.destroy();
    ticker.stop();
  });

  afterEach(() => {
    frustumShield.destroy();
    ticker.stop();
    (globalThis as any).window = originalWindow;
    vi.restoreAllMocks();
  });

  it('verifies 50 elements down a 10,000px page have only ~5 active ticker tasks at any scroll position', () => {
    // 50 elements spaced every 200px across 10,000px
    // Viewport height: 1,000px. Margin: 200px.
    // At any point, visible window is [scrollY - 200, scrollY + 1000 + 200] = 1400px span.
    // With elements having 200px duration: each element active across [startY - 200, endY + 200] = 600px.
    const clampSpies: Record<string, ReturnType<typeof vi.fn>> = {};

    for (let i = 0; i < 50; i++) {
      const id = `item-${i}`;
      const startY = i * 200;
      const endY = startY + 200;
      clampSpies[id] = vi.fn();

      // Register dummy task in ticker
      ticker.add(id, 'update', () => {});

      frustumShield.register({
        id,
        startY,
        endY,
        margin: 200,
        clamp: clampSpies[id],
      });
    }

    // At initial scroll position Y=0:
    // Items with startY - 200 <= 0 and endY + 200 >= 0:
    // startY <= 200 (i=0: [0, 200], i=1: [200, 400])
    // Notice range: rangeStart <= 0 <= rangeEnd.
    // i=0: [-200, 400] -> active
    // i=1: [0, 600] -> active
    // i=2: [200, 800] -> outside (0 < 200) -> dormant
    let activeCount = frustumShield.getActiveCount();
    expect(activeCount).toBeLessThanOrEqual(5);
    expect(activeCount).toBeGreaterThanOrEqual(1);

    // Verify all other elements are dormant in ticker
    let tickerActiveCount = 0;
    for (let i = 0; i < 50; i++) {
      if (!ticker.isTaskDormant(`item-${i}`)) {
        tickerActiveCount++;
      }
    }
    expect(tickerActiveCount).toBe(activeCount);
    expect(tickerActiveCount).toBeLessThanOrEqual(5);

    // Now simulate scroll to Y=3000
    frustumShield.evaluate(3000);

    // Active items should be around i = 3000 / 200 = 15
    // i=14: [2800 - 200, 3000 + 200] = [2600, 3200] -> active
    // i=15: [3000 - 200, 3200 + 200] = [2800, 3400] -> active
    // i=16: [3200 - 200, 3400 + 200] = [3000, 3600] -> active
    activeCount = frustumShield.getActiveCount();
    expect(activeCount).toBeLessThanOrEqual(5);
    expect(activeCount).toBeGreaterThanOrEqual(1);

    // Offscreen items before Y=3000 (e.g. i=0..10) must be clamped to 1
    for (let i = 0; i <= 10; i++) {
      expect(clampSpies[`item-${i}`]).toHaveBeenCalledWith(1);
      expect(ticker.isTaskDormant(`item-${i}`)).toBe(true);
    }

    // Offscreen items after Y=3000 (e.g. i=30..49) must be clamped to 0
    for (let i = 30; i < 50; i++) {
      expect(clampSpies[`item-${i}`]).toHaveBeenCalledWith(0);
      expect(ticker.isTaskDormant(`item-${i}`)).toBe(true);
    }
  });

  it('jumps from Y=0 to Y=5,000; clamps offscreen elements and wakes on-screen elements instantly', () => {
    const clampSpies: Record<string, ReturnType<typeof vi.fn>> = {};
    const enterSpies: Record<string, ReturnType<typeof vi.fn>> = {};
    const updateSpies: Record<string, ReturnType<typeof vi.fn>> = {};

    for (let i = 0; i < 50; i++) {
      const id = `jump-item-${i}`;
      const startY = i * 200;
      const endY = startY + 200;
      clampSpies[id] = vi.fn();
      enterSpies[id] = vi.fn();
      updateSpies[id] = vi.fn();

      ticker.add(id, 'update', () => {});

      frustumShield.register({
        id,
        startY,
        endY,
        margin: 200,
        clamp: clampSpies[id],
        onEnter: enterSpies[id],
        update: updateSpies[id],
      });
    }

    // Initial state at Y=0
    expect(ticker.isTaskDormant('jump-item-25')).toBe(true); // 25 is at 5000px

    // Teleport jump: Y=0 -> Y=5000
    frustumShield.evaluate(5000);

    // Item 25 (startY=5000, endY=5200) must wake instantly
    expect(ticker.isTaskDormant('jump-item-25')).toBe(false);
    expect(enterSpies['jump-item-25']).toHaveBeenCalledTimes(1);
    expect(updateSpies['jump-item-25']).toHaveBeenCalledWith(5000);

    // Items passed by the jump (i=0..20) must be clamped to 1 and dormant
    for (let i = 0; i <= 20; i++) {
      expect(clampSpies[`jump-item-${i}`]).toHaveBeenCalledWith(1);
      expect(ticker.isTaskDormant(`jump-item-${i}`)).toBe(true);
    }

    // Items far beyond 5000 (i=35..49) must remain clamped to 0 and dormant
    for (let i = 35; i < 50; i++) {
      expect(clampSpies[`jump-item-${i}`]).toHaveBeenCalledWith(0);
      expect(ticker.isTaskDormant(`jump-item-${i}`)).toBe(true);
    }

    // Reverse teleport jump: Y=5000 -> Y=0
    frustumShield.evaluate(0);

    // Item 25 must now be clamped to 1 (wait, at Y=0, scrollY < startY, so clamped to 0!)
    expect(clampSpies['jump-item-25']).toHaveBeenCalledWith(0);
    expect(ticker.isTaskDormant('jump-item-25')).toBe(true);

    // Items at Y=0 (i=0, 1) must wake instantly
    expect(ticker.isTaskDormant('jump-item-0')).toBe(false);
    expect(enterSpies['jump-item-0']).toHaveBeenCalled();
  });

  it('intercepts window.scrollTo and triggers immediate evaluation', () => {
    const updateSpy = vi.fn();
    ticker.add('scrollto-test', 'update', () => {});

    frustumShield.register({
      id: 'scrollto-test',
      startY: 4000,
      endY: 4200,
      margin: 200,
      update: updateSpy,
    });

    expect(ticker.isTaskDormant('scrollto-test')).toBe(true);

    // Instant scrollTo object syntax
    window.scrollTo({ top: 4100, behavior: 'instant' });
    expect(ticker.isTaskDormant('scrollto-test')).toBe(false);
    expect(updateSpy).toHaveBeenCalledWith(4100);

    // ScrollTo coordinates syntax (x, y)
    window.scrollTo(0, 0);
    expect(ticker.isTaskDormant('scrollto-test')).toBe(true);
  });

  it('updates bounds dynamically on geometry shifts and unregisters cleanly', () => {
    ticker.add('dynamic-bounds', 'update', () => {});
    const unregister = frustumShield.register({
      id: 'dynamic-bounds',
      startY: 1000,
      endY: 1500,
      margin: 100,
    });

    expect(frustumShield.isCulled('dynamic-bounds')).toBe(true);

    // Dynamic remeasure shifts element to [0, 500]
    frustumShield.updateBounds('dynamic-bounds', 0, 500);
    expect(frustumShield.isCulled('dynamic-bounds')).toBe(false);
    expect(ticker.isTaskDormant('dynamic-bounds')).toBe(false);

    // Unregister
    unregister();
    expect(frustumShield.getTotalCount()).toBe(0);
  });
});
