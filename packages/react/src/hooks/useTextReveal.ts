'use client';

/**
 * 120 FPS Direct DOM Text Reveal Hook
 * Universal Dual API:
 *   - Headless: `const { ref } = useTextReveal<HTMLParagraphElement>(options)`
 *   - Ref-Forwarding: `useTextReveal(existingRef, options)`
 *
 * Features:
 * - GSAP-grade bounded active-window stagger wave (zero compositor layer explosion)
 * - Automatic 3D layer de-promotion when characters settle at 1.0 (transform: none)
 * - Dynamic hardware-tier adaptive blur and layer throttling via adaptiveQualityGovernor
 * - Container sticky-runway auto-tracking or viewport reading zone illumination
 * - Captured-node closure cleanup preventing memory leaks
 * Strictly under 650 LOC.
 */

import { useEffect, useRef } from 'react';
import { GlobalResizeManager, TextRevealSolver, ticker } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { UseTextRevealOptions, UseTextRevealReturn } from '../types';
import { useDualRef, captureNode } from '../utils/ref';

export function useTextReveal<T extends HTMLElement = HTMLParagraphElement>(
  options?: UseTextRevealOptions
): UseTextRevealReturn<T>;
export function useTextReveal<T extends HTMLElement = HTMLParagraphElement>(
  targetRef: React.RefObject<T | null>,
  options?: UseTextRevealOptions
): UseTextRevealReturn<T>;
export function useTextReveal<T extends HTMLElement = HTMLParagraphElement>(
  refOrOptions?: React.RefObject<T | null> | UseTextRevealOptions,
  maybeOptions?: UseTextRevealOptions
): UseTextRevealReturn<T> {
  const { ref, options } = useDualRef<T, UseTextRevealOptions>(refOrOptions, maybeOptions);
  const { engine, reducedMotion } = useScrollCraft();
  const {
    range,
    blur,
    scale,
    rotateX,
    rotateY,
    slide,
    baseOpacity = 0,
    triggerStart,
    triggerEnd,
    targets,
    respectReducedMotion = true,
  } = options;

  const [rangeStart = 0, rangeEnd = 1] = range ?? [];
  const solverRef = useRef<TextRevealSolver | null>(null);

  useEffect(() => {
    const container = captureNode(ref);
    if (!container || typeof window === 'undefined') return;

    // Resolve target spans: explicit targets array, callback, or query selector
    let targetElements: HTMLElement[] = [];
    if (typeof targets === 'function') {
      targetElements = targets();
    } else if (Array.isArray(targets) && targets.length > 0) {
      targetElements = targets;
    } else {
      targetElements = Array.from(
        container.querySelectorAll<HTMLElement>('.sc-char, .sc-word, [data-sc-char], [data-sc-word], [data-sc-target]')
      );
    }

    if (targetElements.length === 0) return;

    // Hydration takeover: Cancel CSS keyframe fallback race condition immediately
    container.classList.remove('sc-reveal-css-fallback');

    if (reducedMotion && respectReducedMotion) {
      targetElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = '';
        el.style.filter = '';
        el.style.willChange = '';
      });
      return;
    }

    const solver = new TextRevealSolver(container, targetElements, {
      range: [rangeStart, rangeEnd],
      blur,
      scale,
      rotateX,
      rotateY,
      slide,
      baseOpacity,
      triggerStart,
      triggerEnd,
    });

    solverRef.current = solver;

    const taskId = `text-reveal-${Math.random().toString(36).slice(2, 8)}`;

    const measure = () => solver.measure();
    const unobserve = GlobalResizeManager.observe(container, measure);

    ticker.add(`${taskId}-update`, 'update', () => {
      const metrics = engine?.getMetrics();
      const scrollY = metrics?.scroll ?? (window.scrollY || window.pageYOffset);
      const wh = window.innerHeight;
      const velocity = metrics?.velocity;
      solver.update(scrollY, wh, velocity);
    });

    ticker.add(`${taskId}-render`, 'render', () => {
      solver.render();
    });

    return () => {
      unobserve();
      ticker.remove(`${taskId}-update`);
      ticker.remove(`${taskId}-render`);
      solver.destroy();
      solverRef.current = null;
    };
  }, [
    engine,
    rangeStart,
    rangeEnd,
    blur,
    scale,
    rotateX,
    rotateY,
    slide,
    baseOpacity,
    triggerStart,
    triggerEnd,
    targets,
    reducedMotion,
    respectReducedMotion,
    ref,
  ]);

  return {
    ref,
    solver: solverRef.current,
  };
}
