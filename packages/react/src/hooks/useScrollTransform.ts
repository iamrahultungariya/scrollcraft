'use client';

/**
 * Direct GPU Scroll-Linked Transform Hook
 * Universal Dual API:
 *   - Headless: `const ref = useScrollTransform<HTMLDivElement>(options)`
 *   - Ref-Forwarding: `useScrollTransform(existingRef, options)`
 *
 * Features:
 * - Built-in presets: 'zoom-in', 'fade-up', 'scale-down', 'blur-in', '3d-flip'
 * - Unit freedom (parses strings with px, %, deg, vh, vw into numeric keyframes)
 * - Zero-rerender compositor pipeline in Ticker Phase 3
 * - Captured-node closure cleanup preventing memory leaks
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useLayoutEffect } from 'react';
import {
  TransformSolver,
  ticker,
  GlobalResizeManager,
  TransformProperties,
  frustumShield,
} from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { ScrollTransformOptions } from '../types';
import { useDualRef, captureNode } from '../utils/ref';

const PRESET_PROPERTIES: Record<string, TransformProperties> = {
  'zoom-in': { scale: [0.75, 1], opacity: [0.4, 1] },
  'fade-up': { y: [50, 0], opacity: [0.4, 1] },
  'scale-down': { scale: [1.3, 1], opacity: [0.6, 1] },
  'blur-in': { blur: [12, 0], opacity: [0.5, 1] },
  '3d-flip': { rotateX: [60, 0], opacity: [0.45, 1], scale: [0.85, 1] },
};

function parsePropertyValue(val: number | string): number {
  if (typeof val === 'number') return val;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

function resolveProperties(options: ScrollTransformOptions): TransformProperties {
  let baseProperties: TransformProperties = {};

  if (options.preset && PRESET_PROPERTIES[options.preset]) {
    baseProperties = { ...PRESET_PROPERTIES[options.preset] };
  }

  if (options.properties) {
    const parsed: TransformProperties = {};
    for (const [key, rawValues] of Object.entries(options.properties)) {
      if (Array.isArray(rawValues)) {
        parsed[key as keyof TransformProperties] = rawValues.map(parsePropertyValue) as [number, number];
      }
    }
    baseProperties = { ...baseProperties, ...parsed };
  }

  return baseProperties;
}

export function useScrollTransform<T extends HTMLElement = HTMLDivElement>(
  options?: ScrollTransformOptions
): React.RefObject<T | null>;
export function useScrollTransform<T extends HTMLElement = HTMLDivElement>(
  targetRef: React.RefObject<T | null>,
  options?: ScrollTransformOptions
): void;
export function useScrollTransform<T extends HTMLElement = HTMLDivElement>(
  refOrOptions?: React.RefObject<T | null> | ScrollTransformOptions,
  maybeOptions?: ScrollTransformOptions
): React.RefObject<T | null> | void {
  const { ref, options, isHeadless } = useDualRef<T, ScrollTransformOptions>(refOrOptions, maybeOptions);
  const solverRef = useRef<TransformSolver | null>(null);
  const { engine, subscribe, reducedMotion, scrollTo } = useScrollCraft();

  const optionsKey = JSON.stringify({
    preset: options.preset,
    properties: options.properties,
    start: options.start,
    end: options.end,
    scrub: options.scrub,
    snap: options.snap,
  });

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const element = captureNode(ref);
    if (!element) return;

    const properties = resolveProperties(options);

    const onSnap = (targetScroll: number) => {
      scrollTo(targetScroll, { duration: 1 });
      options.onSnap?.(targetScroll);
    };

    const solver = new TransformSolver(element, {
      ...options,
      properties,
      onSnap,
    });
    solverRef.current = solver;

    const taskId = `transform-${Math.random().toString(36).slice(2, 8)}`;
    let isMounted = true;
    let settledFrames = 0;

    const measureGeometry = () => {
      if (isMounted) {
        solver.measure();
        frustumShield.updateBounds(taskId, solver.startY, solver.endY);
        settledFrames = 0;
        if (!frustumShield.isCulled(taskId)) {
          ticker.resumeTask(taskId);
        }
      }
    };
    const unobserveElement = GlobalResizeManager.observe(element, measureGeometry);
    const unobserveParent = element.parentElement
      ? GlobalResizeManager.observe(element.parentElement, measureGeometry)
      : () => {};
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (isMounted) measureGeometry();
      });
    }

    const unbindEngineRemeasure = engine?.onRemeasure(measureGeometry);

    let currentScroll = 0;
    let currentVelocity = 0;
    let lastScroll = -999999;

    const unregisterFrustum = frustumShield.register({
      id: taskId,
      element,
      startY: solver.startY,
      endY: solver.endY,
      margin: 200,
      onEnter: () => {
        solver.measure();
        ticker.resumeTask(taskId);
      },
      onExit: (boundary) => {
        solver.clamp(boundary === 'start' ? 0 : 1);
        ticker.pauseTask(taskId);
      },
      clamp: (p) => solver.clamp(p),
      update: (scrollY) => {
        solver.update(scrollY, 0, 0.016, reducedMotion);
        solver.render();
      },
    });

    const unsubscribe = subscribe((metrics) => {
      currentScroll = metrics.scroll;
      currentVelocity = metrics.velocity;
      frustumShield.evaluate(metrics.scroll);
      if (frustumShield.isCulled(taskId)) {
        return;
      }
      if (Math.abs(metrics.velocity) >= 0.001 || Math.abs(metrics.scroll - lastScroll) > 0.1) {
        lastScroll = metrics.scroll;
        settledFrames = 0;
        ticker.resumeTask(taskId);
      }
    });

    ticker.add(taskId, 'update', (dt) => {
      solver.update(currentScroll, currentVelocity, dt, reducedMotion);
      if (solver.isSettled() && Math.abs(currentVelocity) < 0.001) {
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

    solver.measure();
    frustumShield.updateBounds(taskId, solver.startY, solver.endY);

    return () => {
      isMounted = false;
      unregisterFrustum();
      unsubscribe();
      unbindEngineRemeasure?.();
      unobserveElement();
      unobserveParent();
      ticker.remove(taskId);
      solver.destroy();
      solverRef.current = null;
    };
  }, [reducedMotion, subscribe, scrollTo, optionsKey, ref, engine]);

  if (isHeadless) {
    return ref;
  }
}
