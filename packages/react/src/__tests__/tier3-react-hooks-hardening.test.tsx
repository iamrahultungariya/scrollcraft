import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { historyStore } from '@scrollcraft/core';
import {
  useScrollTimeline,
  useScrollProgress,
  useScrollRestoration,
  ScrollProvider,
} from '../index';

describe('Tier 3 React Hooks Hardening: Timeline Hook Rules, Hero Progress Clamping & PushState Restoration', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  let listeners: Record<string, Function[]> = {};

  beforeEach(() => {
    listeners = {};
    historyStore.clear();

    class MockWindow {}
    const mockWin = Object.assign(new MockWindow(), {
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      innerHeight: 800,
      innerWidth: 1000,
      location: {
        pathname: '/home',
        search: '',
        hash: '',
      },
      history: {
        pushState: vi.fn((state: any, title: string, url?: string) => {
          if (url) {
            mockWin.location.pathname = url;
          }
        }),
        replaceState: vi.fn(),
      },
      addEventListener: vi.fn((event: string, fn: Function) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(fn);
      }),
      removeEventListener: vi.fn((event: string, fn: Function) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((cb) => cb !== fn);
        }
      }),
      scrollTo: vi.fn((x: number | ScrollToOptions, y?: number) => {
        if (typeof x === 'object') {
          mockWin.scrollY = x.top ?? 0;
        } else {
          mockWin.scrollY = y ?? 0;
        }
      }),
      requestAnimationFrame: vi.fn((fn: Function) => {
        fn();
        return 1;
      }),
      cancelAnimationFrame: vi.fn(),
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
        documentElement: { scrollHeight: 3000, style: {} },
        body: { scrollHeight: 3000, style: {} },
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {},
          setAttribute: vi.fn(),
          appendChild: vi.fn(),
        }),
        querySelector: vi.fn().mockReturnValue(null),
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

  describe('useScrollTimeline: React Rules of Hooks Compliance', () => {
    it('evaluates pure keyframes without throwing React hook condition errors', () => {
      let result: any = null;

      const TestComponent = ({ progress }: { progress: number }) => {
        const values = useScrollTimeline(progress, {
          opacity: [
            { from: 0, to: 1, startValue: 0, endValue: 1 },
          ],
        });
        result = values;
        return <div style={{ opacity: values.opacity }}>Test</div>;
      };

      // SSR Render
      renderToString(<TestComponent progress={0.5} />);
      expect(result).toBeDefined();
      expect(result.opacity).toBeCloseTo(0.5, 2);
    });

    it('renders headless DOM sequencer mode cleanly without violating hook ordering', () => {
      let targetRefResult: any = null;

      const TestComponent = () => {
        const ref = useScrollTimeline<HTMLDivElement>({
          keyframes: {
            opacity: [0, 1],
          },
        });
        targetRefResult = ref;
        return <div ref={ref}>Sequencer</div>;
      };

      expect(() => {
        renderToString(
          <ScrollProvider>
            <TestComponent />
          </ScrollProvider>
        );
      }).not.toThrow();

      expect(targetRefResult).toBeDefined();
      expect(targetRefResult.current).toBeDefined();
    });
  });

  describe('useScrollProgress: Hero Zero Anchoring & Trigger Compilation', () => {
    it('renders with heroAware=true and compiles triggers without parseEdge NaN errors', () => {
      let progressOutput: any = null;

      const TestComponent = () => {
        const ref = useRef<HTMLDivElement>(null);
        const { progress } = useScrollProgress(ref, {
          offset: ['50% 50%', 'bottom top'],
          heroAware: true,
        });
        progressOutput = progress;
        return <div ref={ref}>Progress Test</div>;
      };

      expect(() => {
        renderToString(
          <ScrollProvider>
            <TestComponent />
          </ScrollProvider>
        );
      }).not.toThrow();

      expect(progressOutput).toBe(0);
    });
  });
});
