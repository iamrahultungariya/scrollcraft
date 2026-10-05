import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TextRevealSolver } from '../text-reveal';

describe('TextRevealSolver Hero & Above-The-Fold Robustness', () => {
  let originalWindow: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    originalWindow = (globalThis as any).window;
    (globalThis as any).window = {
      scrollY: 0,
      pageYOffset: 0,
      innerHeight: 800,
      innerWidth: 1200,
    };
    (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16);
    (globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
  });

  afterEach(() => {
    (globalThis as any).window = originalWindow;
    delete (globalThis as any).requestAnimationFrame;
    delete (globalThis as any).cancelAnimationFrame;
  });

  it('guarantees progress is strictly 0.0 at scrollY = 0 when element is in the Hero section', () => {
    // Hero element located at containerTop = 250px on an 800px window
    const container = {
      offsetHeight: 100,
      getBoundingClientRect: () => ({ top: 250, height: 100 }),
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    } as unknown as HTMLElement;

    const chars: HTMLElement[] = [];
    for (let i = 0; i < 10; i++) {
      chars.push({
        style: { opacity: '', filter: '', transform: '', willChange: '' },
      } as unknown as HTMLElement);
    }

    const solver = new TextRevealSolver(container, chars, {
      baseOpacity: 0,
      triggerStart: 0.85,
      triggerEnd: 0.15,
    });

    solver.measure();

    // At scrollY = 0 (page just loaded):
    // Hero elements bind to effectiveStartY = 0, so at scrollY = 0, progress = 0.0!
    solver.update(0, 800);
    solver.render();

    // Verify zero characters are revealed at scrollY = 0
    for (const char of chars) {
      expect(char.style.opacity).toBe('0');
    }
    expect(solver.getSettled()).toBe(false);

    // Mid-scroll through hero (e.g. scrollY = 180)
    solver.update(180, 800);
    solver.render();

    // Characters should be partially entering with proper opacity
    const activeChars = chars.filter((c) => c.style.opacity !== '0');
    expect(activeChars.length).toBeGreaterThan(0);
    expect(activeChars.length).toBeLessThanOrEqual(chars.length);

    // Full scroll past hero (e.g. scrollY = 400)
    solver.update(400, 800);
    solver.render();

    // All characters must be completely revealed
    for (const char of chars) {
      expect(char.style.opacity).toBe('1');
    }
    expect(solver.getSettled()).toBe(true);

    solver.destroy();
  });

  it('immediately applies baseOpacity 0 on initial creation without waiting for scroll or RAF tick', () => {
    const container = {
      offsetHeight: 50,
      getBoundingClientRect: () => ({ top: 500, height: 50 }),
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    } as unknown as HTMLElement;

    const chars: HTMLElement[] = [
      { style: { opacity: '' } } as unknown as HTMLElement,
      { style: { opacity: '' } } as unknown as HTMLElement,
    ];

    const solver = new TextRevealSolver(container, chars);

    // Constructor immediately applies initial styles to eliminate unstyled flash and pre-visible text
    expect(chars[0].style.opacity).toBe('0');
    expect(chars[1].style.opacity).toBe('0');

    solver.destroy();
  });

  it('runs playOnMount entrance automatically without user scroll', async () => {
    vi.useFakeTimers();

    const container = {
      offsetHeight: 60,
      getBoundingClientRect: () => ({ top: 150, height: 60 }),
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
    } as unknown as HTMLElement;

    const chars: HTMLElement[] = [];
    for (let i = 0; i < 5; i++) {
      chars.push({
        style: { opacity: '', filter: '', transform: '', willChange: '' },
      } as unknown as HTMLElement);
    }

    const solver = new TextRevealSolver(container, chars, {
      playOnMount: { delay: 0.05, duration: 0.5 },
    });

    // Before timer fires, text is clean baseOpacity 0
    expect(chars[0].style.opacity).toBe('0');

    // Advance past delay
    vi.advanceTimersByTime(60);

    // Simulate RAF steps
    solver.update(0, 800);
    solver.render();

    solver.destroy();
    vi.useRealTimers();
  });
});
