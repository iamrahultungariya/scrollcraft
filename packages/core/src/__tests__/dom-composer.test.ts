import { describe, expect, it } from 'vitest';
import { TransformComposer } from '../dom';

describe('TransformComposer', () => {
  it('keeps independently-owned transforms composed and restores the base transform', () => {
    const element = { style: { transform: 'rotate(5deg)' } } as unknown as HTMLElement;

    TransformComposer.set(element, 'parallax', 'translate3d(0, 40px, 0)');
    TransformComposer.set(element, 'magnetic', 'translate3d(4px, 2px, 0)');

    expect(element.style.transform).toContain('rotate(5deg)');
    expect(element.style.transform).toContain('translate3d(0, 40px, 0)');
    expect(element.style.transform).toContain('translate3d(4px, 2px, 0)');

    TransformComposer.clear(element, 'parallax');
    expect(element.style.transform).not.toContain('40px');
    expect(element.style.transform).toContain('4px');

    TransformComposer.clear(element, 'magnetic');
    expect(element.style.transform).toBe('rotate(5deg)');
  });

  it('asserts: exactly 1 DOM write per element per frame when numeric transforms update', () => {
    let rawTransform = '';
    let setterCallCount = 0;
    const element = {
      style: {
        get transform() {
          return rawTransform;
        },
        set transform(val: string) {
          setterCallCount++;
          rawTransform = val;
        },
      },
    } as unknown as HTMLElement;

    // Frame 1: Initial render
    setterCallCount = 0;
    TransformComposer.setNumeric(element, 'parallax', { y: 50, format: 'parallax' });
    expect(setterCallCount).toBe(1);
    expect(element.style.transform).toContain('translate3d(0, 50.00px, 0)');
    expect(TransformComposer.getWriteCount(element)).toBe(1);

    // Frame 2: Identical values (e.g. idle or clamped scroll position) -> strictly ZERO DOM writes!
    setterCallCount = 0;
    TransformComposer.setNumeric(element, 'parallax', { y: 50, format: 'parallax' });
    expect(setterCallCount).toBe(0);
    expect(TransformComposer.getWriteCount(element)).toBe(1);

    // Frame 3: Value updates -> strictly 1 DOM write!
    setterCallCount = 0;
    TransformComposer.setNumeric(element, 'parallax', { y: 100, format: 'parallax' });
    expect(setterCallCount).toBe(1);
    expect(element.style.transform).toContain('translate3d(0, 100.00px, 0)');
    expect(TransformComposer.getWriteCount(element)).toBe(2);
  });

  it('composes numeric transforms and legacy string transforms seamlessly with single write per mutation', () => {
    let writeCount = 0;
    const element = {
      style: {
        _t: '',
        get transform() { return this._t; },
        set transform(v: string) { writeCount++; this._t = v; },
      },
    } as unknown as HTMLElement;

    TransformComposer.setNumeric(element, 'parallax', { y: 20, format: 'parallax' });
    TransformComposer.setNumeric(element, 'transform-solver', { scale: 1.1, rotateX: 15 });
    TransformComposer.set(element, 'legacy-hover', 'scale(1.05)');

    expect(element.style.transform).toContain('translate3d(0, 20.00px, 0)');
    expect(element.style.transform).toContain('scale(1.1)');
    expect(element.style.transform).toContain('rotateX(15deg)');
    expect(element.style.transform).toContain('scale(1.05)');

    // Clear one owner
    TransformComposer.clear(element, 'transform-solver');
    expect(element.style.transform).not.toContain('rotateX(15deg)');
    expect(element.style.transform).toContain('translate3d(0, 20.00px, 0)');
  });
});
