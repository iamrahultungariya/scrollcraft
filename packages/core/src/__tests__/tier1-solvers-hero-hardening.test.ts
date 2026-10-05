import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransformSolver } from '../transform-solver';
import { ParallaxSolver } from '../parallax';
import { DrawSolver } from '../draw-solver';

describe('Tier 1 Hardening: Hero Anti-Jump, Clean Opacity & Zero-Length Integrity', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    class MockWindow {}
    const mockWin = Object.assign(new MockWindow(), {
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      innerHeight: 900,
      innerWidth: 1200,
      devicePixelRatio: 2,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matchMedia: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });

    Object.assign(globalThis, {
      Window: MockWindow,
      window: mockWin,
      document: {
        documentElement: { scrollHeight: 4000, style: {} },
        body: { scrollHeight: 4000, style: {} },
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {},
          setAttribute: vi.fn(),
        }),
        head: { appendChild: vi.fn() },
        getElementById: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
  });

  afterEach(() => {
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
    });
  });

  describe('TransformSolver Hero Section Robustness', () => {
    it('guarantees progress is strictly 0.0 at scrollY = 0 when element starts above the fold', () => {
      // Element in hero section: top = 100px. With start: 'top bottom', startY = 100 - 900 = -800px.
      const el = {
        style: { transform: '', opacity: '' },
        getBoundingClientRect: () => ({ top: 100, bottom: 300, height: 200, left: 0, right: 200, width: 200 }),
      } as unknown as HTMLElement;

      const solver = new TransformSolver(el, {
        start: 'top bottom',
        end: 'bottom top',
        properties: {
          scale: [0.5, 1],
          opacity: [0, 1],
        },
      });

      solver.measure();
      // startY evaluated to negative because element is already inside viewport on load
      expect(solver.startY).toBeLessThan(0);

      // At scrollY = 0, progress MUST BE strictly 0.0, NOT 0.40!
      solver.update(0, 0, 0.016);
      expect(solver.getProgress()).toBe(0);

      solver.render();
      // Initial scale and opacity must reflect progress = 0
      const state = solver.getState();
      expect(state.progress).toBe(0);
      expect(state.values.scale).toBe(0.5);
      expect(state.values.opacity).toBe(0);

      // Scrolling down advances smoothly
      solver.update(300, 0, 0.016);
      expect(solver.getProgress()).toBeGreaterThan(0);
      expect(solver.getProgress()).toBeLessThan(1);

      solver.destroy();
    });

    it('flushes initial keyframe styles to the DOM immediately on mount without requiring scroll', () => {
      const el = {
        style: { transform: '', opacity: '' },
        getBoundingClientRect: () => ({ top: 500, bottom: 700, height: 200, left: 0, right: 200, width: 200 }),
      } as unknown as HTMLElement;

      const solver = new TransformSolver(el, {
        properties: {
          y: [100, 0],
          opacity: [0, 1],
        },
      });

      solver.measure();
      solver.update(0, 0, 0.016);
      solver.render();

      // Even at progress 0, initial styles must be flushed to the DOM
      expect(el.style.opacity).toBe('0');
      expect(el.style.transform).toContain('100');

      solver.destroy();
    });
  });

  describe('ParallaxSolver Hero Anti-Jump Anchor', () => {
    it('defaults to origin: auto and anchors initial displacement to strictly 0px at scrollY = 0', () => {
      // Element in hero section: top = 100px, height = 200px.
      const el = {
        style: { transform: '' },
        getBoundingClientRect: () => ({ top: 100, bottom: 300, height: 200, left: 0, right: 200, width: 200 }),
      } as unknown as HTMLElement;

      const solver = new ParallaxSolver(el, { speed: 0.5, driver: 'js' });
      solver.measure();

      // At scrollY = 0, displacement MUST BE 0px so hero content does not jump on load!
      const stateAt0 = solver.update(0);
      expect(stateAt0.offset).toBe(0);

      // When user scrolls down, parallax begins smoothly
      const stateScrolled = solver.update(200);
      expect(stateScrolled.offset).toBe(100); // 200px scroll * 0.5 speed

      solver.destroy();
    });

    it('preserves natural center-origin parallax for elements far below the fold', () => {
      // Element at top = 3000px (far below the fold, viewport = 900px)
      const el = {
        style: { transform: '' },
        getBoundingClientRect: () => ({ top: 3000, bottom: 3200, height: 200, left: 0, right: 200, width: 200 }),
      } as unknown as HTMLElement;

      const solver = new ParallaxSolver(el, { speed: 0.2, driver: 'js' });
      solver.measure();

      // Below the fold element centers naturally when scrolled to its viewport center:
      // elementCenter = 3000 + 100 = 3100. ViewportCenter at scrollY = 2650 is 2650 + 450 = 3100.
      const stateCentered = solver.update(2650);
      expect(stateCentered.offset).toBe(0);

      solver.destroy();
    });
  });

  describe('DrawSolver Hero Clamping, Zero-Length Recovery & Bidirectional Draw', () => {
    it('anchors progress to 0.0 at scrollY = 0 for SVGs in the hero section', () => {
      const el = {
        style: { strokeDasharray: '', strokeDashoffset: '' },
        getBoundingClientRect: () => ({ top: 100, bottom: 300, height: 200, left: 0, right: 200, width: 200 }),
        getTotalLength: () => 500,
      } as unknown as SVGGeometryElement;

      const solver = new DrawSolver(el, {
        start: 'top bottom',
        end: 'bottom top',
      });

      solver.measure();
      solver.update(0, 0, 0.016);
      expect(solver.getProgress()).toBe(0);

      solver.render();
      // Path is completely undrawn at scrollY = 0
      expect(el.style.strokeDashoffset).toBe('500.00');

      solver.destroy();
    });

    it('recovers from initial totalLength = 0 once layout settles', () => {
      let lengthValue = 0;
      const el = {
        style: { strokeDasharray: '', strokeDashoffset: '' },
        getBoundingClientRect: () => ({ top: 1000, bottom: 1200, height: 200, left: 0, right: 200, width: 200 }),
        getTotalLength: () => lengthValue,
      } as unknown as SVGGeometryElement;

      const solver = new DrawSolver(el, { start: 'top bottom' });
      solver.measure(); // initial measure returns 0

      // Simulate next frame where SVG geometry is rendered and reports valid length
      lengthValue = 850;
      solver.update(500, 0, 0.016);
      expect(el.style.strokeDasharray).toContain('850');

      solver.destroy();
    });

    it('performs mathematically symmetrical center-outward draw in bidirectional mode', () => {
      const el = {
        style: { strokeDasharray: '', strokeDashoffset: '' },
        getBoundingClientRect: () => ({ top: 1000, bottom: 1200, height: 200, left: 0, right: 200, width: 200 }),
        getTotalLength: () => 1000,
      } as unknown as SVGGeometryElement;

      const solver = new DrawSolver(el, {
        direction: 'bidirectional',
        start: 'top bottom',
        end: 'bottom top',
      });

      solver.measure();

      // At 50% progress: active draw length is 500px, centered with 250px offset
      solver.clamp(0.5);
      expect(el.style.strokeDasharray).toBe('500.00 1000.00');
      expect(el.style.strokeDashoffset).toBe('250.00');

      // At 100% progress: fully drawn
      solver.clamp(1.0);
      expect(el.style.strokeDasharray).toBe('1000.00 1000.00');
      expect(el.style.strokeDashoffset).toBe('0.00');

      solver.destroy();
    });
  });
});
