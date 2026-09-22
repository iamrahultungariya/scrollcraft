import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { compileTrigger, evaluateTrigger, clearTriggerCache } from '../trigger-compiler';
import { TransformSolver } from '../transform-solver';
import { DrawSolver } from '../draw-solver';

describe('Step 5: Zero-Allocation Compiled Trigger Engine', () => {
  const originalWindow = globalThis.window;

  beforeEach(() => {
    clearTriggerCache();
    (globalThis as any).window = {
      scrollY: 0,
      pageYOffset: 0,
      innerHeight: 1000,
      innerWidth: 1200,
      devicePixelRatio: 2,
    };
  });

  afterEach(() => {
    globalThis.window = originalWindow;
  });

  it('compiles standard keyword triggers accurately', () => {
    const rect = { top: 1000, height: 200 };
    const windowHeight = 1000;
    const scrollTop = 0;

    // 'top bottom': element top enters viewport bottom
    // 1000 + 0 - 1000 = 0
    expect(evaluateTrigger('top bottom', rect, windowHeight, scrollTop)).toBe(0);

    // 'center center': element center hits viewport center
    // 1000 + 100 - 500 = 600
    expect(evaluateTrigger('center center', rect, windowHeight, scrollTop)).toBe(600);

    // 'bottom top': element bottom leaves viewport top
    // 1000 + 200 - 0 = 1200
    expect(evaluateTrigger('bottom top', rect, windowHeight, scrollTop)).toBe(1200);
  });

  it('compiles percentage and pixel triggers accurately', () => {
    const rect = { top: 1000, height: 200 };
    const windowHeight = 1000;
    const scrollTop = 150;

    // '50% 80%': element top + 50% height - 80% windowHeight
    // (1000 + 150) + 100 - 800 = 450
    expect(evaluateTrigger('50% 80%', rect, windowHeight, scrollTop)).toBe(450);

    // '100px 200px':
    // (1000 + 150) + 100 - 200 = 1050
    expect(evaluateTrigger('100px 200px', rect, windowHeight, scrollTop)).toBe(1050);

    // relative offset: 'top +=400'
    // (1000 + 150) + 0 + 400 = 1550
    expect(evaluateTrigger('top +=400', rect, windowHeight, scrollTop)).toBe(1550);
  });

  it('memoizes compiled triggers without string regex re-execution', () => {
    const t1 = compileTrigger('center center');
    const t2 = compileTrigger('center center');
    expect(t1).toBe(t2); // identical cached reference
  });

  it('guarantees STRICTLY ZERO getBoundingClientRect reads during active scroll update & render', () => {
    const getBoundingClientRectSpy = vi.fn(() => ({
      top: 500,
      bottom: 700,
      left: 0,
      right: 200,
      width: 200,
      height: 200,
      x: 0,
      y: 500,
      toJSON: () => {},
    }));
    const element = {
      style: { transform: '' },
      getBoundingClientRect: getBoundingClientRectSpy,
    } as unknown as HTMLElement;

    const solver = new TransformSolver(element, {
      start: 'top bottom',
      end: 'bottom top',
      properties: {
        y: [0, 100],
        opacity: [0, 1],
      },
    });

    // 1. Initial measurement (read allowed in measure phase)
    solver.measure();
    const readsAfterMeasure = getBoundingClientRectSpy.mock.calls.length;
    expect(readsAfterMeasure).toBeGreaterThanOrEqual(1);

    // 2. Active scrolling loop across 100 frames
    for (let frame = 0; frame < 100; frame++) {
      const scrollY = frame * 10;
      solver.update(scrollY, 10, 0.016);
      solver.render();
    }

    // 3. MUST NOT invoke getBoundingClientRect a single time during scroll!
    expect(getBoundingClientRectSpy.mock.calls.length).toBe(readsAfterMeasure);

    solver.destroy();
  });

  it('guarantees ZERO getBoundingClientRect reads during DrawSolver active scroll', () => {
    const svgEl = {
      style: { strokeDasharray: '', strokeDashoffset: '' },
      getBoundingClientRect: vi.fn(() => ({ top: 400, height: 300 })),
      getTotalLength: vi.fn(() => 500),
    } as unknown as SVGGeometryElement;

    const drawSolver = new DrawSolver(svgEl, {
      start: 'top bottom',
      end: 'bottom top',
    });

    drawSolver.measure();
    expect((svgEl.getBoundingClientRect as any).mock.calls.length).toBe(1);

    // 50 frames of active scrubbing
    for (let i = 0; i < 50; i++) {
      drawSolver.update(i * 20, 10, 0.016);
      drawSolver.render();
    }

    // Still exactly 1 read! Zero reads during scroll!
    expect((svgEl.getBoundingClientRect as any).mock.calls.length).toBe(1);
  });
});
