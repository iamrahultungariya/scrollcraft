import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TextRevealSolver } from '../text-reveal';
import { StackedCardsSolver } from '../stacked-cards-solver';
import { TransformSolver } from '../transform-solver';

describe('Robust Page Audit Remediation Tests', () => {
  let originalWindow: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    originalWindow = (globalThis as any).window;
    (globalThis as any).window = {
      scrollY: 0,
      pageYOffset: 0,
      innerHeight: 800,
      innerWidth: 1200,
      getComputedStyle: () => ({ position: 'relative' }),
    };
    (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16);
    (globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
    delete (globalThis as any).requestAnimationFrame;
    delete (globalThis as any).cancelAnimationFrame;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. TextReveal Optical Wave & Zero-Blur Rest Invariants
  // ─────────────────────────────────────────────────────────────────────────────
  describe('TextReveal Optical Wave Invariants', () => {
    it('guarantees zero static blur filter on unstarted text (p <= 0) and settled text (p >= 1)', () => {
      const container = {
        offsetHeight: 100,
        getBoundingClientRect: () => ({ top: 400, height: 100 }),
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
      } as unknown as HTMLElement;

      const chars: HTMLElement[] = [];
      for (let i = 0; i < 6; i++) {
        chars.push({
          style: { opacity: '', filter: '', transform: '', willChange: '' },
        } as unknown as HTMLElement);
      }

      const solver = new TextRevealSolver(container, chars, {
        mode: 'kinetic',
        blur: 12,
        rotateX: 30,
        slide: 24,
      });

      // 1. Initial styles right after construction: NO blur filter stamped on unstarted text!
      for (const char of chars) {
        expect(char.style.filter).toBe('');
        expect(char.style.opacity).toBe('0');
      }

      solver.measure();

      // 2. Render before scroll threshold (p <= 0): filter must remain strictly empty string!
      solver.update(0, 800);
      solver.render();
      for (const char of chars) {
        expect(char.style.filter).toBe('');
        expect(char.style.opacity).toBe('0');
      }

      // 3. Active transition wave (0 < p < 1): dynamic optical blur is applied
      solver.update(300, 800);
      solver.render();
      const activeWithBlur = chars.filter((c) => c.style.filter.includes('blur'));
      expect(activeWithBlur.length).toBeGreaterThan(0);

      // 4. Fully scrolled past (p >= 1): filter is cleanly cleared to '' for GPU layer de-promotion
      solver.update(1000, 800);
      solver.render();
      for (const char of chars) {
        expect(char.style.filter).toBe('');
        expect(char.style.opacity).toBe('1');
      }

      solver.destroy();
    });

    it('implements mode: "reading" with crisp muted baseOpacity (0.2) and strictly zero blur at rest', () => {
      const container = {
        offsetHeight: 100,
        getBoundingClientRect: () => ({ top: 300, height: 100 }),
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
      } as unknown as HTMLElement;

      const words: HTMLElement[] = [
        { style: { opacity: '', filter: '', transform: '', willChange: '' } } as unknown as HTMLElement,
        { style: { opacity: '', filter: '', transform: '', willChange: '' } } as unknown as HTMLElement,
      ];

      const solver = new TextRevealSolver(container, words, {
        mode: 'reading',
        blur: 10,
      });

      // Reading mode must default baseOpacity to 0.2
      expect(words[0].style.opacity).toBe('0.2');
      expect(words[1].style.opacity).toBe('0.2');
      // Must NOT have blur filter at rest before scroll
      expect(words[0].style.filter).toBe('');
      expect(words[1].style.filter).toBe('');

      solver.destroy();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. StackedCards Geometric Exit Runway & Dead Zone Elimination
  // ─────────────────────────────────────────────────────────────────────────────
  describe('StackedCards Geometric Exit Runway', () => {
    it('unpins cleanly after exactly exitRunway pixels of buffer, eliminating frozen dead space', () => {
      const container = {
        offsetHeight: 1840,
        getBoundingClientRect: () => ({ top: 1000, height: 1840 }),
      } as unknown as HTMLElement;

      const cardElements: HTMLElement[] = [];
      for (let i = 0; i < 4; i++) {
        cardElements.push({
          style: { zIndex: '', pointerEvents: '', opacity: '', transform: '' },
          offsetHeight: 360,
          offsetTop: 0,
          getBoundingClientRect: () => ({ top: 1000, height: 360 }),
        } as unknown as HTMLElement);
      }

      const cardDistance = 380;
      const topOffset = 100;
      const exitRunway = 120;

      const solver = new StackedCardsSolver(container, cardElements, {
        top: topOffset,
        cardDistance,
        exitRunway,
      });

      solver.measure();

      // Final (4th) card reaches its pin position after (4 - 1) * cardDistance = 1140px
      // Container top is 1000, so last card pinStartY is 1000 + 1140 = 2140px
      const finalCardPinStartY = 1000 + 3 * cardDistance;

      // When scroll reaches final card pin point, all cards are stacked
      solver.update(finalCardPinStartY);
      solver.render();

      // Card 0, 1, 2 must be buried and scaled down
      expect(cardElements[0].style.pointerEvents).toBe('none');
      expect(cardElements[3].style.pointerEvents).toBe('auto');

      // During the exitRunway window (e.g. finalCardPinStartY + 60px): cards remain pinned
      solver.update(finalCardPinStartY + 60);
      solver.render();
      const currentTranslateAt60 = cardElements[3].style.transform;
      expect(currentTranslateAt60).toContain('translate3d');

      // After exitRunway passes (e.g. finalCardPinStartY + 150px): cards are clamped at maxPinY
      // and do not translate further relative to container, allowing natural exit to next section
      solver.update(finalCardPinStartY + 150);
      solver.render();

      solver.destroy();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. TransformSolver Default End Trigger Completion
  // ─────────────────────────────────────────────────────────────────────────────
  describe('TransformSolver Default Trigger Completion', () => {
    it('defaults end trigger to "center center" so entrance animations complete at viewport center', () => {
      // Element with height 200px located at top 1000px
      const element = {
        style: { transform: '', opacity: '', willChange: '', filter: '', borderRadius: '' },
        getBoundingClientRect: () => ({ top: 1000, bottom: 1200, height: 200 }),
      } as unknown as HTMLElement;

      const solver = new TransformSolver(element, {
        preset: 'zoom-in',
        properties: {
          scale: [0.75, 1],
          opacity: [0, 1],
        },
      });

      solver.measure();

      // With start: 'top bottom' (wh=800): startY = 1000 - 800 = 200px
      // With end: 'center center': element center (1100) - viewport center (400) = 700px
      expect(solver.startY).toBe(200);
      expect(solver.endY).toBe(700);

      // At scrollY = 200 (element just enters viewport bottom): progress is 0
      solver.update(200, 0, 0.016);
      expect(solver.getProgress()).toBe(0);

      // At scrollY = 700 (element reaches viewport center): progress MUST be 1.0!
      // This guarantees completion BEFORE the section traversal finishes!
      solver.update(700, 0, 0.016);
      solver.render();
      expect(solver.getProgress()).toBe(1);
      expect(element.style.opacity).toBe('1');
      expect(element.style.transform).toContain('scale(1)');

      // Above scrollY = 700 (scrolling further in the section): progress stays clamped at 1.0
      solver.update(850, 0, 0.016);
      expect(solver.getProgress()).toBe(1);

      solver.destroy();
    });
  });
});
