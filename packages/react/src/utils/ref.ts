'use client';

/**
 * Universal Dual API & Captured-Node Ref Utilities for ScrollCraft React
 *
 * Implements:
 * 1. Universal Dual API (useHook(options) => ref OR useHook(ref, options))
 * 2. Captured-Node Closure Pattern:
 *    Guarantees that when consumers conditionally mount elements or swap forwarded refs,
 *    unobserve() and solver.destroy() run against the captured DOM node snapshot,
 *    strictly eliminating stale node memory leaks and null pointer exceptions.
 *
 * Strictly under 650 LOC.
 */

import React, { useRef } from 'react';

/**
 * Type guard checking if an argument is a React.RefObject
 */
export function isRefObject<T>(val: unknown): val is React.RefObject<T> {
  return val !== null && typeof val === 'object' && 'current' in val;
}

export interface DualRefResult<T extends Element = HTMLElement, O = Record<string, unknown>> {
  ref: React.RefObject<T | null>;
  options: O;
  isHeadless: boolean;
}

/**
 * Dispatches between headless invocation (`useHook(options)`) and ref-forwarding (`useHook(ref, options)`).
 */
export function useDualRef<T extends Element = HTMLElement, O extends object = Record<string, unknown>>(
  refOrOptions?: React.RefObject<T | null> | O,
  maybeOptions?: O,
  defaultOptions: O = {} as O
): DualRefResult<T, O> {
  const internalRef = useRef<T | null>(null);

  if (isRefObject<T | null>(refOrOptions)) {
    return {
      ref: refOrOptions,
      options: { ...defaultOptions, ...maybeOptions },
      isHeadless: false,
    };
  }

  return {
    ref: internalRef,
    options: { ...defaultOptions, ...(refOrOptions as O) },
    isHeadless: true,
  };
}

/**
 * Captures the current DOM element reference at effect execution time.
 * Prevents stale node memory leaks during conditional unmounts or ref swaps.
 */
export function captureNode<T extends Element = HTMLElement>(ref: React.RefObject<T | null>): T | null {
  return ref?.current ?? null;
}

/**
 * Resiliently observes when a ref object attaches to a DOM element.
 * If node is immediately available, invokes onAttach synchronously.
 * Otherwise, watches via MutationObserver and requestAnimationFrame until attached.
 */
export function watchRefAttachment<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  onAttach: (node: T) => (() => void) | void
): () => void {
  const immediateNode = captureNode(ref);
  if (immediateNode) {
    const cleanup = onAttach(immediateNode);
    return () => cleanup?.();
  }

  if (typeof window === 'undefined') {
    return () => {};
  }

  let cleanupAttached: (() => void) | void;
  let rafId: number | null = null;
  let observer: MutationObserver | null = null;
  let isDone = false;

  const tryAttach = () => {
    if (isDone) return;
    const node = captureNode(ref);
    if (node) {
      isDone = true;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      cleanupAttached = onAttach(node);
    }
  };

  if (typeof MutationObserver !== 'undefined' && (document.body || document.documentElement)) {
    observer = new MutationObserver(() => tryAttach());
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  let attempts = 0;
  const poll = () => {
    tryAttach();
    if (!isDone && attempts++ < 30) {
      rafId = requestAnimationFrame(poll);
    }
  };
  rafId = requestAnimationFrame(poll);

  return () => {
    isDone = true;
    if (observer) observer.disconnect();
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (typeof cleanupAttached === 'function') {
      cleanupAttached();
    }
  };
}
