'use client';

/**
 * useScrollTimeline Hook for Multi-Keyframe Choreography
 * Universal Dual API & Direct DOM Sequencer Mode:
 *   - Direct DOM Sequencer (Headless): `const ref = useScrollTimeline<HTMLDivElement>(options)`
 *   - Direct DOM Sequencer (Forwarded Ref): `useScrollTimeline(targetRef, options)`
 *   - Pure Value Evaluator: `const values = useScrollTimeline(progress, timeline)`
 *
 * Features:
 * - Direct GPU compositor writes in Ticker Phase 3 (0 React re-renders)
 * - Interpolates keyframes across scroll progress
 * - Backward compatible with legacy pure evaluation mode
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useMemo } from 'react';
import {
  PropertyTimeline,
  KeyframeSegment,
  TimelineSolver,
  ticker,
  TransformComposer,
  styleRegistry,
} from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { ScrollTimelineOptions } from '../types';
import { isRefObject, watchRefAttachment } from '../utils/ref';

function buildTimelineFromKeyframes(
  keyframes: Record<string, (number | string)[]> | Array<{ progress: number; transform?: any; opacity?: number }>
): PropertyTimeline {
  const timeline: PropertyTimeline = {};

  if (Array.isArray(keyframes)) {
    const sorted = [...keyframes].sort((a, b) => a.progress - b.progress);
    if (sorted.length < 2) return timeline;

    const propNames = new Set<string>();
    for (const kf of sorted) {
      if (kf.opacity !== undefined) propNames.add('opacity');
      if (kf.transform) {
        for (const tKey of Object.keys(kf.transform)) {
          propNames.add(tKey);
        }
      }
    }

    for (const prop of propNames) {
      const segments: KeyframeSegment[] = [];
      for (let i = 0; i < sorted.length - 1; i++) {
        const kf1 = sorted[i];
        const kf2 = sorted[i + 1];
        const v1 = prop === 'opacity'
          ? (kf1.opacity ?? 1)
          : (kf1.transform?.[prop] ?? 0);
        const v2 = prop === 'opacity'
          ? (kf2.opacity ?? 1)
          : (kf2.transform?.[prop] ?? 0);

        segments.push({
          from: kf1.progress,
          to: kf2.progress,
          startValue: typeof v1 === 'number' ? v1 : 0,
          endValue: typeof v2 === 'number' ? v2 : 0,
        });
      }
      timeline[prop] = segments;
    }
    return timeline;
  }

  for (const [key, rawValues] of Object.entries(keyframes)) {
    if (!rawValues || rawValues.length < 2) continue;
    const values = rawValues.map((v) => (typeof v === 'number' ? v : parseFloat(v) || 0));
    const step = 1 / (values.length - 1);
    const segments: KeyframeSegment[] = [];
    for (let i = 0; i < values.length - 1; i++) {
      segments.push({
        from: i * step,
        to: (i + 1) * step,
        startValue: values[i],
        endValue: values[i + 1],
      });
    }
    timeline[key] = segments;
  }
  return timeline;
}

export function useScrollTimeline(
  progress: number,
  timeline: PropertyTimeline
): Record<string, number>;
export function useScrollTimeline<T extends HTMLElement = HTMLDivElement>(
  options?: ScrollTimelineOptions
): React.RefObject<T | null>;
export function useScrollTimeline<T extends HTMLElement = HTMLDivElement>(
  targetRef: React.RefObject<T | null>,
  options?: ScrollTimelineOptions
): void;
export function useScrollTimeline<T extends HTMLElement = HTMLDivElement>(
  refOrOptionsOrProgress?: React.RefObject<T | null> | ScrollTimelineOptions | number,
  maybeOptionsOrTimeline?: ScrollTimelineOptions | PropertyTimeline
): Record<string, number> | React.RefObject<T | null> | void {
  // Mode 1: Legacy Pure Evaluator Signature: (progress: number, timeline: PropertyTimeline)
  if (typeof refOrOptionsOrProgress === 'number') {
    const progress = refOrOptionsOrProgress;
    const timeline = (maybeOptionsOrTimeline as PropertyTimeline) ?? {};
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      return TimelineSolver.evaluateTimeline(timeline, progress);
    }, [progress, timeline]);
  }

  // Mode 2 & 3: Direct DOM Sequencer Mode (Dual API)
  const isRefPassed = isRefObject<T | null>(refOrOptionsOrProgress);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fallbackRef = useRef<T | null>(null);

  const targetRef = isRefPassed
    ? (refOrOptionsOrProgress as React.RefObject<T | null>)
    : fallbackRef;

  const options = (isRefPassed
    ? (maybeOptionsOrTimeline as ScrollTimelineOptions)
    : (refOrOptionsOrProgress as ScrollTimelineOptions)) ?? {};

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { subscribe } = useScrollCraft();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onUpdateRef = useRef(options.onUpdate);
  onUpdateRef.current = options.onUpdate;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    return watchRefAttachment(targetRef, (node) => {
      const timeline: PropertyTimeline = options.timeline
        ?? (options.keyframes ? buildTimelineFromKeyframes(options.keyframes) : {});

      const taskId = `timeline-${Math.random().toString(36).slice(2, 8)}`;
      const evaluatedValues: Record<string, number> = {};

      const applyProgress = (p: number) => {
        TimelineSolver.evaluateTimeline(timeline, p, evaluatedValues);

        const hasTransform =
          evaluatedValues.x !== undefined ||
          evaluatedValues.y !== undefined ||
          evaluatedValues.z !== undefined ||
          evaluatedValues.scale !== undefined ||
          evaluatedValues.rotate !== undefined ||
          evaluatedValues.rotateX !== undefined ||
          evaluatedValues.rotateY !== undefined;

        if (hasTransform) {
          TransformComposer.setNumeric(node, 'timeline', {
            x: evaluatedValues.x,
            y: evaluatedValues.y,
            z: evaluatedValues.z,
            scale: evaluatedValues.scale,
            rotate: evaluatedValues.rotate,
            rotateX: evaluatedValues.rotateX,
            rotateY: evaluatedValues.rotateY,
          });
        } else {
          TransformComposer.clear(node, 'timeline');
        }

        if (evaluatedValues.opacity !== undefined) {
          styleRegistry.lease(node, 'timeline', 'opacity', String(evaluatedValues.opacity));
        }

        onUpdateRef.current?.(evaluatedValues);
      };

      let unsub: (() => void) | null = null;

      if (options.progress !== undefined) {
        applyProgress(options.progress);
      } else {
        unsub = subscribe((metrics) => {
          applyProgress(metrics.progress);
        });
      }

      return () => {
        unsub?.();
        ticker.remove(taskId);
        styleRegistry.release(node, 'timeline', 'opacity');
        TransformComposer.clear(node, 'timeline');
      };
    });
  }, [
    targetRef,
    options.progress,
    options.keyframes,
    options.timeline,
    subscribe,
  ]);

  if (!isRefPassed) {
    return targetRef;
  }
}
