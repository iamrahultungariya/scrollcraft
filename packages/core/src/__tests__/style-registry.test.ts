import { describe, expect, it } from 'vitest';
import { styleRegistry } from '../style-registry';
import { SmartCompositor } from '../dom';

describe('StyleOwnershipRegistry', () => {
  it('preserves caller initial inline styles upon solver unmount/destroy', () => {
    const element = {
      style: {
        opacity: '0.65',
        filter: 'contrast(120%)',
        willChange: 'scroll-position',
      },
    } as unknown as HTMLElement;

    // Owner A (e.g. Reveal) claims opacity and filter
    styleRegistry.set(element, 'reveal', 'opacity', '0');
    styleRegistry.set(element, 'reveal', 'filter', 'blur(8px)');
    styleRegistry.set(element, 'reveal', 'willChange', 'opacity, transform');

    expect(element.style.opacity).toBe('0');
    expect(element.style.filter).toBe('blur(8px)');
    expect(element.style.willChange).toContain('scroll-position');
    expect(element.style.willChange).toContain('opacity');

    // Owner A teardown
    styleRegistry.clear(element, 'reveal');

    // Asserts: Original caller inline values are strictly restored!
    expect(element.style.opacity).toBe('0.65');
    expect(element.style.filter).toBe('contrast(120%)');
    expect(element.style.willChange).toBe('scroll-position');
  });

  it('handles multi-owner conflict resolution and fallback gracefully', () => {
    const element = {
      style: {
        opacity: '1',
      },
    } as unknown as HTMLElement;

    // Owner 1 sets opacity 0.8
    styleRegistry.set(element, 'solver-1', 'opacity', '0.8');
    expect(element.style.opacity).toBe('0.8');

    // Owner 2 overrides with opacity 0.2
    styleRegistry.set(element, 'solver-2', 'opacity', '0.2');
    expect(element.style.opacity).toBe('0.2');

    // Owner 2 unmounts; should cleanly fallback to Owner 1's value (0.8), NOT the initial or empty string!
    styleRegistry.clear(element, 'solver-2', 'opacity');
    expect(element.style.opacity).toBe('0.8');

    // Owner 1 unmounts; falls back to original initial style
    styleRegistry.clear(element, 'solver-1', 'opacity');
    expect(element.style.opacity).toBe('1');
  });

  it('preserves caller willChange when SmartCompositor promotes and demotes', () => {
    const element = {
      isConnected: true,
      style: {
        willChange: 'transform, scroll-position',
      },
    } as unknown as HTMLElement;

    const compositor = SmartCompositor.get();
    compositor.promote(element);

    expect(element.style.willChange).toContain('scroll-position');
    expect(element.style.willChange).toContain('transform');

    compositor.destroy(element);
    // Asserts: Does not overwrite caller's pre-existing scroll-position with auto!
    expect(element.style.willChange).toBe('transform, scroll-position');
  });
});
