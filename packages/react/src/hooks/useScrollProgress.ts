'use client';

/**
 * Zero-Rerender useScrollProgress Hook
 * Universal Dual API:
 *   - Global page scroll: `const { progressValue, scrollYValue } = useScrollProgress()`
 *   - Target element progression: `const { targetRef, progressValue } = useScrollProgress({ offset: ['top bottom', 'bottom top'] })`
 *   - Ref-Forwarding: `useScrollProgress(targetRef, options)`
 *
 * Features:
 * - Target scoping with custom trigger offsets (['top bottom', 'bottom top'])
 * - Vertical and horizontal scroll orientations
 * - Zero-rerender observables (ScrollValue) for 120 FPS animations
 * - Optional reactive state bridge for declarative UI
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useState } from 'react';
import {
  createScrollValue,
  ScrollValue,
  GlobalResizeManager,
  clamp,
} from '@scrollcraft/core';
import { useScrollCraft, useScrollState } from '../context';
import { ScrollProgressOptions } from '../types';
import { isRefObject, watchRefAttachment } from '../utils/ref';

export type UseScrollProgressOptions = ScrollProgressOptions;

export interface UseScrollProgressReturn<T extends HTMLElement = HTMLElement> {
  targetRef: React.RefObject<T | null>;
  progressValue: ScrollValue<number>;
  scrollYValue: ScrollValue<number>;
  progress: number;
  scrollY: number;
}

function parseEdge(edge: string, size: number): number {
  switch (edge) {
    case 'top':
    case 'left':
      return 0;
    case 'center':
      return size / 2;
    case 'bottom':
    case 'right':
      return size;
    default: {
      const num = parseFloat(edge);
      return isNaN(num) ? 0 : num;
    }
  }
}

export function useScrollProgress<T extends HTMLElement = HTMLElement>(
  targetRefOrOptions?: React.RefObject<T | null> | ScrollProgressOptions,
  maybeOptions?: ScrollProgressOptions
): UseScrollProgressReturn<T> {
  const isRefPassed = isRefObject<T | null>(targetRefOrOptions);
  const fallbackRef = useRef<T | null>(null);

  const options = isRefPassed
    ? (maybeOptions ?? {})
    : ((targetRefOrOptions as ScrollProgressOptions) ?? {});

  const hasExplicitTarget = isRefPassed || !!options.target;
  const targetRef = isRefPassed
    ? (targetRefOrOptions as React.RefObject<T | null>)
    : (options.target as React.RefObject<T | null> ?? fallbackRef);

  const {
    offset = ['top bottom', 'bottom top'],
    orientation = 'vertical',
    reactive = false,
    onProgress,
    progressValue: customProgressValue,
  } = options;

  const { subscribe, engine } = useScrollCraft();

  const progressValueRef = useRef<ScrollValue<number> | null>(null);
  const scrollYValueRef = useRef<ScrollValue<number> | null>(null);

  if (!progressValueRef.current) {
    progressValueRef.current = (customProgressValue as ScrollValue<number>) ?? createScrollValue(0);
    scrollYValueRef.current = createScrollValue(0);
  }

  const [reactiveProgressState, setReactiveProgressState] = useState(0);
  const [reactiveScrollState, setReactiveScrollState] = useState(0);

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    // Mode A: Global Viewport / Page Scroll (when no target ref was explicitly supplied)
    if (!hasExplicitTarget) {
      const unsub = subscribe((metrics) => {
        const p = orientation === 'horizontal'
          ? (metrics.scroll / Math.max(1, metrics.maxScroll))
          : metrics.progress;
        progressValueRef.current?.set(p);
        scrollYValueRef.current?.set(metrics.scroll);
        onProgressRef.current?.(p);

        if (reactive) {
          setReactiveProgressState(p);
          setReactiveScrollState(metrics.scroll);
        }
      });
      return unsub;
    }

    // Mode B: Target Element Scroll Progression via resilient attachment watcher
    return watchRefAttachment(targetRef, (node) => {
      let startScroll = 0;
      let endScroll = 0;

      const measure = () => {
        if (!node || typeof window === 'undefined') return;
        const rect = node.getBoundingClientRect();
        const isVert = orientation === 'vertical';

        const currentScroll = isVert
          ? (window.scrollY || window.pageYOffset)
          : (window.scrollX || window.pageXOffset);

        const elemPos = isVert ? rect.top + currentScroll : rect.left + currentScroll;
        const elemSize = isVert ? rect.height : rect.width;
        const vpSize = isVert ? window.innerHeight : window.innerWidth;

        const [startSpec = 'top bottom', endSpec = 'bottom top'] = offset;
        const [startElemEdge, startVpEdge] = startSpec.split(' ');
        const [endElemEdge, endVpEdge] = endSpec.split(' ');

        const startElemOffset = parseEdge(startElemEdge, elemSize);
        const startVpOffset = parseEdge(startVpEdge, vpSize);
        startScroll = (elemPos + startElemOffset) - startVpOffset;

        const endElemOffset = parseEdge(endElemEdge, elemSize);
        const endVpOffset = parseEdge(endVpEdge, vpSize);
        endScroll = (elemPos + endElemOffset) - endVpOffset;

        if (endScroll <= startScroll) {
          endScroll = startScroll + 1;
        }
      };

      measure();
      const unobserve = GlobalResizeManager.observe(node, measure);
      window.addEventListener('resize', measure, { passive: true });

      const unsub = subscribe((metrics) => {
        const currentScroll = orientation === 'horizontal'
          ? (window.scrollX || window.pageXOffset)
          : metrics.scroll;

        const rawProgress = (currentScroll - startScroll) / (endScroll - startScroll);
        const p = clamp(rawProgress, 0, 1);

        progressValueRef.current?.set(p);
        scrollYValueRef.current?.set(currentScroll);
        onProgressRef.current?.(p);

        if (reactive) {
          setReactiveProgressState(p);
          setReactiveScrollState(currentScroll);
        }
      });

      return () => {
        unobserve();
        window.removeEventListener('resize', measure);
        unsub();
      };
    });
  }, [
    targetRef,
    hasExplicitTarget,
    offset,
    orientation,
    reactive,
    subscribe,
    engine,
  ]);

  const fallbackReactiveProgress = useScrollState((m) => m.progress, undefined, {
    enabled: reactive && !targetRef.current,
  });
  const fallbackReactiveScrollY = useScrollState((m) => m.scroll, undefined, {
    enabled: reactive && !targetRef.current,
  });

  const progressVal = progressValueRef.current ?? createScrollValue(0);
  const scrollYVal = scrollYValueRef.current ?? createScrollValue(0);

  return {
    targetRef,
    progressValue: progressVal,
    scrollYValue: scrollYVal,
    progress: reactive
      ? (targetRef.current ? reactiveProgressState : (fallbackReactiveProgress as number))
      : progressVal.get(),
    scrollY: reactive
      ? (targetRef.current ? reactiveScrollState : (fallbackReactiveScrollY as number))
      : scrollYVal.get(),
  };
}
