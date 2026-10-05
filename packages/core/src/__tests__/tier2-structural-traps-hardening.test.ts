import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StackedCardsSolver } from '../stacked-cards-solver';

describe('Tier 2 Hardening: Structural Layout Traps & Card Depth Falloff', () => {
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
      getComputedStyle: vi.fn().mockReturnValue({ position: 'sticky' }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    Object.assign(globalThis, {
      Window: MockWindow,
      window: mockWin,
      document: {
        documentElement: { scrollHeight: 4000 },
        body: { scrollHeight: 4000 },
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {},
          setAttribute: vi.fn(),
        }),
      },
    });
  });

  afterEach(() => {
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
    });
  });

  describe('StackedCardsSolver Sticky Alignment & Depth Opacity', () => {
    it('accurately aligns Card 0 pinStartY with the CSS sticky top position', () => {
      const container = {
        getBoundingClientRect: () => ({ top: 500, bottom: 2500, height: 2000, width: 800 }),
        offsetHeight: 2000,
      } as unknown as HTMLElement;

      const card0 = {
        style: { zIndex: '', transform: '', pointerEvents: '', opacity: '', position: 'sticky' },
        offsetTop: 0,
        offsetHeight: 300,
        getBoundingClientRect: () => ({ top: 500, bottom: 800, height: 300, width: 800 }),
      } as unknown as HTMLElement;

      const card1 = {
        style: { zIndex: '', transform: '', pointerEvents: '', opacity: '', position: 'sticky' },
        offsetTop: 700,
        offsetHeight: 300,
        getBoundingClientRect: () => ({ top: 1200, bottom: 1500, height: 300, width: 800 }),
      } as unknown as HTMLElement;

      const solver = new StackedCardsSolver(container, [card0, card1], {
        top: 100,
        offset: 40,
        cardDistance: 400,
        opacityStep: 0.2,
      });

      solver.measure();

      // Card 0 with top: 100px sticks at containerTop - top = 500 - 100 = 400px!
      // When scrollY reaches 400px, Card 0 must be pinned!
      solver.update(400);
      const stateAtStick = solver.getCardsState();
      expect(stateAtStick[0].currentScale).toBe(1);
      expect(stateAtStick[0].isBuried).toBe(false);

      // When scroll advances past Card 1 pin start, Card 0 becomes buried and fades smoothly
      solver.update(1200);
      const stateBuried = solver.getCardsState();
      expect(stateBuried[0].isBuried).toBe(true);
      expect(stateBuried[0].currentOpacity).toBeLessThan(1.0);
      expect(stateBuried[0].currentOpacity).toBeGreaterThanOrEqual(0.2);

      solver.render();
      expect(card0.style.pointerEvents).toBe('none');
      expect(card0.style.opacity).not.toBe('');

      solver.destroy();
      expect(card0.style.opacity).toBe('');
      expect(card0.style.zIndex).toBe('');
    });
  });
});
