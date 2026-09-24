'use client';

/**
 * 120 FPS Sticky Pinning Hook with Layout Diagnostics & Zero-Lag Throttling
 * Universal Dual API:
 *   - Headless: `const { ref, progressValue } = usePin<HTMLDivElement>(options)`
 *   - Ref-Forwarding: `usePin(existingRef, options)`
 *
 * Features:
 * - GSAP 4-state lifecycle: onEnter, onLeave, onEnterBack, onLeaveBack (0 re-renders)
 * - Auto-spacing placeholder track height generation (`pinSpacing: boolean | number`)
 * - Zero-rerender observable `progressValue: ScrollValue<number>`
 * - Captured-node closure cleanup preventing stale node leaks
 * Strictly under 650 LOC.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ticker, PinSolver, GlobalResizeManager, createScrollValue, ScrollValue } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { PinOptions } from '../types';
import { useDualRef, captureNode } from '../utils/ref';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface UsePinReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  progress: number;
  pinOffsetY: number;
  isPinned: boolean;
  progressValue: ScrollValue<number>;
}

export function usePin<T extends HTMLElement = HTMLDivElement>(
  options?: PinOptions
): UsePinReturn<T>;
export function usePin<T extends HTMLElement = HTMLDivElement>(
  targetRef: React.RefObject<T | null>,
  options?: PinOptions
): UsePinReturn<T>;
export function usePin<T extends HTMLElement = HTMLDivElement>(
  refOrOptions?: React.RefObject<T | null> | PinOptions,
  maybeOptions?: PinOptions
): UsePinReturn<T> {
  const { ref, options } = useDualRef<T, PinOptions>(refOrOptions, maybeOptions);
  const {
    top = 0,
    duration,
    onProgress,
    trackState = false,
    pinSpacing,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    progressValue: externalProgressValue,
  } = options;

  const { engine, subscribe } = useScrollCraft();

  const [progress, setProgress] = useState(0);
  const [pinOffsetY, setPinOffsetY] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  const progressRef = useRef(0);
  const taskIdRef = useRef<string>(`pin-${Math.random().toString(36).slice(2, 8)}`);
  const internalProgressValue = useRef<ScrollValue<number> | null>(null);

  if (!internalProgressValue.current) {
    internalProgressValue.current = (externalProgressValue as ScrollValue<number>) ?? createScrollValue(0);
  }

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;
  const onEnterBackRef = useRef(onEnterBack);
  onEnterBackRef.current = onEnterBack;
  const onLeaveBackRef = useRef(onLeaveBack);
  onLeaveBackRef.current = onLeaveBack;

  useIsomorphicLayoutEffect(() => {
    const node = captureNode(ref);
    if (!node || typeof window === 'undefined') return;

    let isMounted = true;

    // Detect clipping ancestors that break native CSS position: sticky
    let hasClippingAncestor = false;
    let parent = node.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const computed = typeof window.getComputedStyle === 'function' ? window.getComputedStyle(parent) : null;
      if (computed) {
        const overflow = computed.overflow + computed.overflowY + computed.overflowX;
        if (/(hidden|auto|scroll)/.test(overflow)) {
          hasClippingAncestor = true;
          if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
            console.warn(
              `[ScrollCraft] <Pin> element cannot stick natively because ancestor <${parent.tagName.toLowerCase()} class="${parent.className}"> has overflow: "${computed.overflow}". Falling back to transform simulation.`
            );
          }
          break;
        }
      }
      parent = parent.parentElement;
    }

    if (!hasClippingAncestor) {
      node.style.position = 'sticky';
      node.style.top = `${top}px`;
    } else {
      node.style.position = 'relative';
    }

    // Auto-spacing placeholder track generation when pinSpacing is enabled
    let spacerElement: HTMLDivElement | null = null;
    if (pinSpacing) {
      if (node.nextElementSibling?.getAttribute('data-sc-pin-spacer') === 'true') {
        node.nextElementSibling.remove();
      }
      spacerElement = document.createElement('div');
      spacerElement.setAttribute('data-sc-pin-spacer', 'true');
      spacerElement.style.display = 'block';
      spacerElement.style.pointerEvents = 'none';
      spacerElement.style.visibility = 'hidden';
      const spacerHeight = typeof pinSpacing === 'number'
        ? pinSpacing
        : (duration ?? window.innerHeight);
      spacerElement.style.height = `${spacerHeight}px`;
      node.parentNode?.insertBefore(spacerElement, node.nextSibling);
    }

    const solver = new PinSolver(node, {
      duration,
      topOffset: top,
      bottomOffset: options.bottom,
      disableTransform: hasClippingAncestor ? false : (options.disableTransform ?? true),
    });

    const taskId = taskIdRef.current;
    let settledFrames = 0;
    let lastScroll = -999999;

    const measureGeometry = () => {
      if (isMounted) {
        solver.measure();
        settledFrames = 0;
        ticker.resumeTask(taskId);
      }
    };
    const unobserve = GlobalResizeManager.observe(node, measureGeometry);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (isMounted) measureGeometry();
      });
    }

    const unbindEngineRemeasure = engine?.onRemeasure(measureGeometry);

    const unsubScroll = subscribe((metrics) => {
      if (Math.abs(metrics.velocity) >= 0.001 || Math.abs(metrics.scroll - lastScroll) > 0.1) {
        lastScroll = metrics.scroll;
        settledFrames = 0;
        ticker.resumeTask(taskId);
      }
    });

    let zoneState: 'before' | 'inside' | 'after' = 'before';

    ticker.add(taskId, 'update', () => {
      const metrics = engine?.getMetrics();
      const scrollY = metrics?.scroll ?? (window.scrollY || window.pageYOffset);
      const velocity = Math.abs(metrics?.velocity ?? 0);
      const state = solver.update(scrollY);
      const nextProgress = state.progress;

      // Update zero-rerender observable
      internalProgressValue.current?.set(nextProgress);

      // GSAP 4-State Lifecycle transitions
      let nextZone: 'before' | 'inside' | 'after' = 'before';
      if (nextProgress > 0 && nextProgress < 1) {
        nextZone = 'inside';
      } else if (nextProgress >= 1) {
        nextZone = 'after';
      }

      if (zoneState !== nextZone) {
        if (zoneState === 'before' && nextZone === 'inside') {
          onEnterRef.current?.();
        } else if (zoneState === 'inside' && nextZone === 'after') {
          onLeaveRef.current?.();
        } else if (zoneState === 'after' && nextZone === 'inside') {
          onEnterBackRef.current?.();
        } else if (zoneState === 'inside' && nextZone === 'before') {
          onLeaveBackRef.current?.();
        }
        zoneState = nextZone;
      }

      // Extract state for optional reactive tracking
      if (trackState && Math.abs(nextProgress - progressRef.current) > 0.008) {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
        setPinOffsetY(state.pinOffsetY);
        setIsPinned(state.isPinned);
      } else {
        progressRef.current = nextProgress;
      }

      onProgressRef.current?.(nextProgress);

      if (velocity < 0.001) {
        settledFrames++;
        if (settledFrames >= 3) {
          ticker.pauseTask(taskId);
        }
      } else {
        settledFrames = 0;
      }
    });

    ticker.add(taskId, 'render', () => {
      solver.render();
    });

    return () => {
      isMounted = false;
      unsubScroll();
      unbindEngineRemeasure?.();
      unobserve();
      ticker.remove(taskId);
      solver.destroy();
      if (spacerElement && spacerElement.parentNode) {
        spacerElement.remove();
      }
      if (node.nextElementSibling?.getAttribute('data-sc-pin-spacer') === 'true') {
        node.nextElementSibling.remove();
      }
      node.style.position = '';
      node.style.top = '';
    };
  }, [
    top,
    options.bottom,
    duration,
    options.disableTransform,
    pinSpacing,
    trackState,
    ref,
    engine,
    subscribe,
  ]);

  return {
    ref,
    progress,
    pinOffsetY,
    isPinned,
    progressValue: internalProgressValue.current ?? createScrollValue(0),
  };
}
