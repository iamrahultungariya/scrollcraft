import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VelocityMarqueeSolver } from '../marquee';
import { MagneticSolver } from '../magnetic';
import { compileTrigger } from '../trigger-compiler';

describe('Tier 3 Hardening: Marquee Velocity Reversal, Magnetic Hit Zone & Trigger Compiler', () => {
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

  describe('VelocityMarqueeSolver: Direction Inversion & Ultrawide Math', () => {
    it('accelerates forward on positive velocity and reverses movement on upward scroll when reverseOnScrollUp is enabled', () => {
      const child = {
        getBoundingClientRect: () => ({ width: 400, height: 50, top: 0, left: 0, right: 400, bottom: 50 }),
      };
      const element = {
        style: { transform: '' },
        firstElementChild: child,
      } as unknown as HTMLElement;

      const solver = new VelocityMarqueeSolver(element, {
        baseSpeed: 1,
        velocityMultiplier: 0.1,
        direction: 'left',
        maxSpeed: 50,
        reverseOnScrollUp: true,
      });

      // Set initial position to -200 (middle of [-400, 0] track)
      (solver.getState() as any).position = -200;

      // 1. Nominal forward drift at rest (velocity = 0)
      const posRest = solver.update(0, 0, 1 / 60).position;
      expect(posRest).toBeLessThan(-200); // moves left (more negative)

      // 2. Downward scroll (positive velocity = 100) -> accelerates further left
      const posBeforeDown = posRest;
      const posDown = solver.update(100, 100, 1 / 60).position;
      const deltaDown = posDown - posBeforeDown;
      expect(deltaDown).toBeLessThan(-1); // moving left faster

      // 3. Upward scroll (negative velocity = -200) -> reverses direction, moving right (position increases)
      const posBeforeUp = posDown;
      let posUp = posDown;
      // Step a few frames to let damp catch up to negative target speed
      for (let i = 0; i < 5; i++) {
        posUp = solver.update(50, -200, 1 / 60).position;
      }
      expect(posUp).toBeGreaterThan(posBeforeUp); // moving right!

      // 4. Modulo wrapping stays within seamless bounds [-400, 0]
      expect(posUp).toBeLessThanOrEqual(0);
      expect(posUp).toBeGreaterThanOrEqual(-400);

      solver.destroy();
    });

    it('remains unidirectional when reverseOnScrollUp is false', () => {
      const child = {
        getBoundingClientRect: () => ({ width: 500, height: 50, top: 0, left: 0, right: 500, bottom: 50 }),
      };
      const element = {
        style: { transform: '' },
        firstElementChild: child,
      } as unknown as HTMLElement;

      const solver = new VelocityMarqueeSolver(element, {
        baseSpeed: 1,
        velocityMultiplier: 0.05,
        direction: 'left',
        reverseOnScrollUp: false,
      });

      const pos1 = solver.update(0, 0, 1 / 60).position;
      // Upward scroll with reverseOnScrollUp=false should still move left (decrease position)
      const pos2 = solver.update(50, -100, 1 / 60).position;
      expect(pos2).toBeLessThan(pos1);

      solver.destroy();
    });
  });

  describe('MagneticSolver: Radial Proximity Detection & Anchor Stability', () => {
    it('detects cursor approaching within radius even when cursor is outside the element bounding box', () => {
      let windowMouseMoveListener: ((e: any) => void) | null = null;
      (globalThis.window as any).addEventListener = vi.fn((event, handler) => {
        if (event === 'mousemove') {
          windowMouseMoveListener = handler;
        }
      });

      // 40x40 button at (100, 100), center at (120, 120)
      const element = {
        style: { transform: '' },
        getBoundingClientRect: () => ({
          left: 100,
          top: 100,
          right: 140,
          bottom: 140,
          width: 40,
          height: 40,
        }),
      } as unknown as HTMLElement;

      const solver = new MagneticSolver(element, {
        strength: 0.5,
        radius: 120,
        scale: 1.1,
      });

      expect(windowMouseMoveListener).toBeDefined();

      // Cursor moves to (180, 120): this is 40px past the button's right edge (140),
      // but distance from center (120, 120) is exactly 60px, which is inside radius 120px.
      windowMouseMoveListener!({ clientX: 180, clientY: 120 } as MouseEvent);

      // Verify the element is pulled towards the cursor (deltaX = 180 - 120 = 60, targetX = 60 * 0.5 = 30)
      // Check that internal targetX is active by verifying solver spring starts ticking
      const state = (solver as any).targetX;
      expect(state).toBeCloseTo(30, 1);
      expect((solver as any).isHovering).toBe(true);

      // Cursor moves outside radius (e.g. at 400, 400: distance > 300px)
      windowMouseMoveListener!({ clientX: 400, clientY: 400 } as MouseEvent);
      expect((solver as any).targetX).toBe(0);
      expect((solver as any).targetY).toBe(0);
      expect((solver as any).isHovering).toBe(false);

      solver.destroy();
    });

    it('compensates for current spring displacement in measureRect to prevent center drift', () => {
      const element = {
        style: { transform: '' },
        getBoundingClientRect: () => ({
          left: 125, // currently displaced by +25px due to magnetic spring
          top: 110,  // currently displaced by +10px
          width: 50,
          height: 50,
          right: 175,
          bottom: 160,
        }),
      } as unknown as HTMLElement;

      const solver = new MagneticSolver(element, { radius: 100 });
      (solver as any).stateX.position = 25;
      (solver as any).stateY.position = 10;

      // Call measureRect
      (solver as any).measureRect();

      // Caching must subtract the current displacement
      const cached = (solver as any).cachedAbsoluteRect;
      expect(cached.left).toBe(100); // 125 - 25 = 100
      expect(cached.top).toBe(100);  // 110 - 10 = 100

      solver.destroy();
    });
  });

  describe('Trigger Compiler: Horizontal Alignment & Proportional Offsets', () => {
    it('correctly handles horizontal aliases left and right', () => {
      const trigger = compileTrigger('left right');
      // When element left is at viewport right (windowWidth = 1000):
      // elementTopAbs = 500, elOffset = 0, vpOffset = 1000.
      // Expected trigger scroll = 500 - 1000 = -500.
      const scrollPos = trigger.evaluate({ top: 500, height: 100 }, 1000, 0);
      expect(scrollPos).toBe(-500);
    });

    it('accurately parses percentages without treating them as fixed pixels', () => {
      const trigger = compileTrigger('50% 50%');
      // element height = 400, element top = 1000
      // 50% element = 200px.
      // 50% viewport (windowHeight = 800) = 400px.
      // Expected scroll = 1000 + 200 - 400 = 800.
      const scrollPos = trigger.evaluate({ top: 1000, height: 400 }, 800, 0);
      expect(scrollPos).toBe(800);
    });
  });
});
