import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SmartCompositor } from '../dom';
import { tierStore } from '../feature-detection';

function createMockElement(): HTMLElement {
  return {
    style: { willChange: '' }
  } as unknown as HTMLElement;
}

describe('SmartCompositor', () => {
  let compositor: SmartCompositor;

  beforeEach(() => {
    vi.useFakeTimers();
    (globalThis as any).window = globalThis;
    compositor = SmartCompositor.get();
    compositor.destroyAll();
    tierStore.setTier('balanced');
  });

  afterEach(() => {
    compositor.destroyAll();
    vi.useRealTimers();
  });

  it('maintains a single shared singleton instance', () => {
    const a = SmartCompositor.get();
    const b = SmartCompositor.get();
    expect(a).toBe(b);
  });

  it('promotes an element to willChange: transform', () => {
    const el = createMockElement();
    const promoted = compositor.promote(el);

    expect(promoted).toBe(true);
    expect(el.style.willChange).toBe('transform');
    expect(compositor.isPromoted(el)).toBe(true);
    expect(compositor.getPromotedCount()).toBe(1);
  });

  it('debounces demotion by 300ms to prevent layer thrashing', () => {
    const el = createMockElement();
    compositor.promote(el);
    expect(el.style.willChange).toBe('transform');

    compositor.demote(el, 300);
    // At 200ms, should still be promoted (debounced)
    vi.advanceTimersByTime(200);
    expect(el.style.willChange).toBe('transform');
    expect(compositor.isPromoted(el)).toBe(true);

    // After 300ms total, resets to auto
    vi.advanceTimersByTime(150);
    expect(el.style.willChange).toBe('auto');
    expect(compositor.isPromoted(el)).toBe(false);
  });

  it('cancels pending demotion if element is promoted again within debounce window', () => {
    const el = createMockElement();
    compositor.promote(el);
    compositor.demote(el, 300);

    vi.advanceTimersByTime(200);
    // User scrolls again before 300ms expires:
    compositor.promote(el);

    // Advance past the original 300ms mark
    vi.advanceTimersByTime(200);
    expect(el.style.willChange).toBe('transform');
    expect(compositor.isPromoted(el)).toBe(true);
  });

  it('enforces reject-new budget cap (max 3) under Tier 1 (low)', () => {
    tierStore.setTier('low');

    const el1 = createMockElement();
    const el2 = createMockElement();
    const el3 = createMockElement();
    const el4 = createMockElement();

    expect(compositor.promote(el1)).toBe(true);
    expect(compositor.promote(el2)).toBe(true);
    expect(compositor.promote(el3)).toBe(true);
    expect(compositor.getPromotedCount()).toBe(3);

    // 4th element must be rejected (returns false, willChange unchanged)
    expect(compositor.promote(el4)).toBe(false);
    expect(el4.style.willChange).toBe('');
    expect(compositor.getPromotedCount()).toBe(3);
  });

  it('destroyAll cleans up all elements and timers', () => {
    const el1 = createMockElement();
    const el2 = createMockElement();

    compositor.promote(el1);
    compositor.promote(el2);
    expect(compositor.getPromotedCount()).toBe(2);

    compositor.destroyAll();
    expect(compositor.getPromotedCount()).toBe(0);
    expect(el1.style.willChange).toBe('auto');
    expect(el2.style.willChange).toBe('auto');
  });
});

