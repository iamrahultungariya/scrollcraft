'use client';

/**
 * 120 FPS Direct DOM Reveal-on-Enter Hook
 * Universal Dual API:
 *   - Headless: `const ref = useReveal<HTMLDivElement>(options)`
 *   - Ref-Forwarding: `useReveal(existingRef, options)`
 *
 * Features:
 * - Subscribes to the single global intersection observer (GlobalRevealObserver)
 * - Atmospheric blur, 3D tilt (rotateX, rotateY), and scale entry
 * - Automatic stagger indexing calculation (`delay + index * stagger`)
 * - Zero-rerender callbacks (`onReveal`, `onReset`)
 * - Captured-node closure cleanup preventing stale node leaks
 * Strictly under 650 LOC.
 */

import { useEffect, useRef } from 'react';
import { revealObserver } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { RevealOptions } from '../types';
import { useDualRef, watchRefAttachment } from '../utils/ref';

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: RevealOptions
): React.RefObject<T | null>;
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  targetRef: React.RefObject<T | null>,
  options?: RevealOptions
): void;
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  refOrOptions?: React.RefObject<T | null> | RevealOptions,
  maybeOptions?: RevealOptions
): React.RefObject<T | null> | void {
  const { ref, options, isHeadless } = useDualRef<T, RevealOptions>(refOrOptions, maybeOptions);
  const { respectReducedMotion = true } = options;
  const { reducedMotion } = useScrollCraft();

  // Stable callbacks ref to prevent inline callbacks from tearing down observer on every render
  const callbacksRef = useRef({ onReveal: options.onReveal, onReset: options.onReset });
  callbacksRef.current.onReveal = options.onReveal;
  callbacksRef.current.onReset = options.onReset;

  useEffect(() => {
    return watchRefAttachment(ref as React.RefObject<HTMLElement | null>, (node) => {
      if (reducedMotion && respectReducedMotion) {
        node.style.opacity = '1';
        node.style.transform = 'none';
        if (options.blur) node.style.filter = 'none';
        if (typeof node.setAttribute === 'function') {
          node.setAttribute('data-scrollcraft-reveal', 'active');
        }
        callbacksRef.current.onReveal?.();
        return;
      }

      // Calculate auto-stagger delay if index is provided
      const baseDelay = options.delay ?? 0;
      const staggerIncrement = options.stagger ?? 0.04;
      const computedDelay = options.index !== undefined
        ? baseDelay + (options.index * staggerIncrement)
        : baseDelay;

      const resolvedOptions = {
        ...options,
        delay: computedDelay,
        onReveal: () => callbacksRef.current.onReveal?.(),
        onReset: () => callbacksRef.current.onReset?.(),
      };

      revealObserver.observe(node, resolvedOptions);

      return () => {
        revealObserver.unobserve(node);
      };
    });
  }, [
    options.direction,
    options.distance,
    options.duration,
    options.delay,
    options.threshold,
    options.once,
    options.blur,
    options.scale,
    options.rotateX,
    options.rotateY,
    options.index,
    options.stagger,
    reducedMotion,
    respectReducedMotion,
    ref,
  ]);

  if (isHeadless) {
    return ref;
  }
}
