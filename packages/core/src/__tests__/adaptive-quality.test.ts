import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { adaptiveQualityGovernor, AdaptiveQualityGovernor } from '../adaptive-quality';
import { tierStore } from '../feature-detection';
import { TransformSolver } from '../transform-solver';
import { smartCompositor } from '../dom';
import { TextRevealSolver } from '../text-reveal';

describe('AdaptiveQualityGovernor (Low-End Dynamic Blur & Layer Throttling)', () => {
  const originalWindow = (globalThis as any).window;

  beforeEach(() => {
    (globalThis as any).window = {
      scrollY: 0,
      pageYOffset: 0,
      innerHeight: 1000,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollTo: vi.fn(),
      getComputedStyle: () => ({ position: 'relative' }),
    };
    adaptiveQualityGovernor.resetConfig();
    tierStore.setTier('high');
  });

  afterEach(() => {
    adaptiveQualityGovernor.resetConfig();
    tierStore.setTier('high');
    (globalThis as any).window = originalWindow;
    vi.restoreAllMocks();
  });

  it('clamps blur radius based on hardware performance tiers', () => {
    // High Tier (Tier 3)
    adaptiveQualityGovernor.setTier('high');
    expect(adaptiveQualityGovernor.clampBlur(20)).toBe(20);
    expect(adaptiveQualityGovernor.clampBlur(8)).toBe(8);
    expect(adaptiveQualityGovernor.clampBlur(0)).toBe(0);

    // Balanced Tier (Tier 2): Clamps to max 8px
    adaptiveQualityGovernor.setTier('balanced');
    expect(adaptiveQualityGovernor.clampBlur(20)).toBe(8);
    expect(adaptiveQualityGovernor.clampBlur(12)).toBe(8);
    expect(adaptiveQualityGovernor.clampBlur(6)).toBe(6);

    // Low Tier (Tier 1): Clamps to strictly 0px to bypass fragment shader bottleneck
    adaptiveQualityGovernor.setTier('low');
    expect(adaptiveQualityGovernor.clampBlur(20)).toBe(0);
    expect(adaptiveQualityGovernor.clampBlur(8)).toBe(0);
    expect(adaptiveQualityGovernor.clampBlur(1)).toBe(0);
  });

  it('clamps backdrop-filter expressions according to hardware tier', () => {
    // High Tier: untouched
    adaptiveQualityGovernor.setTier('high');
    expect(adaptiveQualityGovernor.clampBackdropFilter('blur(25px) saturate(180%)')).toBe('blur(25px) saturate(180%)');

    // Balanced Tier: clamps blur component to 8px
    adaptiveQualityGovernor.setTier('balanced');
    expect(adaptiveQualityGovernor.clampBackdropFilter('blur(25px) saturate(180%)')).toBe('blur(8px) saturate(180%)');
    expect(adaptiveQualityGovernor.clampBackdropFilter('blur(4px)')).toBe('blur(4px)');

    // Low Tier: strictly 'none'
    adaptiveQualityGovernor.setTier('low');
    expect(adaptiveQualityGovernor.clampBackdropFilter('blur(25px) saturate(180%)')).toBe('none');
  });

  it('dynamically adapts TransformSolver blur rendering across tiers', () => {
    const el = {
      style: { transform: '', filter: '', opacity: '', willChange: '' },
      getBoundingClientRect: () => ({ top: 100, bottom: 300, height: 200 }),
    } as unknown as HTMLElement;

    const solver = new TransformSolver(el, {
      properties: {
        blur: [20, 20],
      },
    });
    solver.measure();

    // High tier: blur(20px) is preserved
    adaptiveQualityGovernor.setTier('high');
    solver.update(0, 0, 0.016);
    solver.render();
    expect(el.style.filter).toContain('blur(20');

    // Step down to Balanced tier: blur clamped to 8px
    adaptiveQualityGovernor.setTier('balanced');
    solver.update(0, 0, 0.016);
    solver.render();
    expect(el.style.filter).toBe('blur(8px)');

    // Step down to Low tier: blur completely stripped (0px) to solve rasterizer choke
    adaptiveQualityGovernor.setTier('low');
    solver.update(0, 0, 0.016);
    solver.render();
    expect(el.style.filter).toBe('');
  });

  it('enforces GPU layer promotion limits per tier via SmartCompositor', () => {
    const makeEl = () => ({
      style: { willChange: '' },
      isConnected: true,
    } as unknown as HTMLElement);

    // Low tier: max 3 layers
    adaptiveQualityGovernor.setTier('low');
    expect(adaptiveQualityGovernor.getMaxLayers()).toBe(3);

    const el1 = makeEl();
    const el2 = makeEl();
    const el3 = makeEl();
    const el4 = makeEl();

    expect(smartCompositor.promote(el1)).toBe(true);
    expect(smartCompositor.promote(el2)).toBe(true);
    expect(smartCompositor.promote(el3)).toBe(true);
    // 4th element rejected on low tier
    expect(smartCompositor.promote(el4)).toBe(false);

    // Switch to Balanced tier: limit is 8, so el4 is accepted
    adaptiveQualityGovernor.setTier('balanced');
    expect(adaptiveQualityGovernor.getMaxLayers()).toBe(8);
    expect(smartCompositor.promote(el4)).toBe(true);

    smartCompositor.destroy(el1);
    smartCompositor.destroy(el2);
    smartCompositor.destroy(el3);
    smartCompositor.destroy(el4);
  });

  it('dynamically adapts TextReveal atmospheric blur based on hardware tier', () => {
    const container = {
      querySelectorAll: () => [],
      getBoundingClientRect: () => ({ top: 600, bottom: 1100, height: 500 }),
      parentElement: null,
      offsetTop: 600,
      offsetHeight: 500,
    } as unknown as HTMLElement;

    const charEl = {
      style: { opacity: '', filter: '', transform: '' },
      getBoundingClientRect: () => ({ top: 0, bottom: 20, height: 20 }),
    } as unknown as HTMLElement;

    const solver = new TextRevealSolver(container, [charEl], {
      blur: 20,
    });
    solver.measure();

    // High tier: Atmospheric blur written
    adaptiveQualityGovernor.setTier('high');
    solver.update(0, 1000);
    solver.render();
    expect(charEl.style.filter).toContain('blur(');

    // Low tier: Atmospheric blur completely suppressed
    adaptiveQualityGovernor.setTier('low');
    solver.update(0, 1000);
    solver.render();
    expect(charEl.style.filter).toBe('');
  });
});
