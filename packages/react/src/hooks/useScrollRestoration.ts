'use client';

/**
 * ScrollCraft Route Lifecycle & Scroll Restoration Hook
 * Resolves Next.js App Router scroll-jumps, cancels pending inertia momentum,
 * persists scroll coordinates in an LRU sessionStorage registry, and handles RSC hydration shifts.
 * Strictly under 650 LOC.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { historyStore } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export interface ScrollRestorationOptions {
  /**
   * Unique key for the current route.
   * If omitted, falls back to `window.location.pathname + window.location.search`.
   * For Next.js App Router, pass `usePathname()` or `usePathname() + useSearchParams().toString()`.
   */
  routeKey?: string;

  /**
   * Whether scroll restoration is active.
   * Default: true
   */
  enabled?: boolean;

  /**
   * Whether to scroll to top (0px) on new route pushes when no saved history exists.
   * Default: true
   */
  scrollToTopOnPush?: boolean;

  /**
   * Number of requestAnimationFrame retry cycles to survive RSC layout shifts / streaming DOM expansion.
   * Default: 3
   */
  retryFrames?: number;

  /**
   * Optional custom scroll target calculator.
   */
  getScrollTarget?: (routeKey: string) => number | null;

  /**
   * Callback fired when scroll position is restored or reset.
   */
  onRestore?: (position: number, routeKey: string) => void;
}

export interface ScrollRestorationReturn {
  /** Saves current scroll position immediately for the current route */
  savePosition: () => void;
  /** Manually restores position for current route */
  restorePosition: () => void;
  /** Resets scroll to top (0px) immediately */
  resetToTop: () => void;
  /** Current saved scroll position for current route, or null */
  savedPosition: number | null;
}

function resolveCurrentKey(explicitKey?: string): string {
  if (explicitKey) return explicitKey;
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.pathname}${window.location.search}`;
  }
  return '/';
}

export function useScrollRestoration(options: ScrollRestorationOptions = {}): ScrollRestorationReturn {
  const {
    routeKey: explicitRouteKey,
    enabled = true,
    scrollToTopOnPush = true,
    retryFrames = 3,
    getScrollTarget,
    onRestore,
  } = options;

  const { engine, scrollTo } = useScrollCraft();
  const [activeKey, setActiveKey] = useState<string>(() => resolveCurrentKey(explicitRouteKey));

  useEffect(() => {
    if (explicitRouteKey) {
      setActiveKey(explicitRouteKey);
    }
  }, [explicitRouteKey]);

  const currentKey = explicitRouteKey || activeKey;
  const currentKeyRef = useRef(currentKey);
  currentKeyRef.current = currentKey;

  const prevKeyRef = useRef<string | null>(null);
  const isPopStateRef = useRef<boolean>(false);
  const retryRafRef = useRef<number | null>(null);

  const [savedPosState, setSavedPosState] = useState<number | null>(() => {
    return typeof window !== 'undefined' ? historyStore.get(currentKey) : null;
  });

  const savePosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const key = currentKeyRef.current;
    if (!key) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    historyStore.save(key, scrollY);
    setSavedPosState(scrollY);
  }, []);

  const resetToTop = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (retryRafRef.current !== null && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(retryRafRef.current);
      retryRafRef.current = null;
    }
    // Kill inertia immediately
    if (engine) {
      scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
  }, [engine, scrollTo]);

  const executeRestore = useCallback(
    (targetY: number, key: string) => {
      if (typeof window === 'undefined') return;

      if (retryRafRef.current !== null && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(retryRafRef.current);
        retryRafRef.current = null;
      }

      // Step 1: Immediate velocity kill & target positioning
      if (engine) {
        scrollTo(targetY, { immediate: true });
      }
      window.scrollTo(0, targetY);
      onRestore?.(targetY, key);

      // Step 2: Hydration retry loop (handles late RSC chunks & image layout shifts)
      if (targetY > 0 && retryFrames > 0 && typeof window.requestAnimationFrame === 'function') {
        let remainingFrames = retryFrames;

        const checkAndReapply = () => {
          if (typeof window === 'undefined') return;
          const currentY = window.scrollY || window.pageYOffset || 0;
          const maxScrollable = Math.max(
            0,
            (document.documentElement?.scrollHeight || 0) - (window.innerHeight || 0)
          );

          // If current scroll was clamped short because DOM was smaller, re-apply if DOM grew
          if (Math.abs(currentY - targetY) > 2 && maxScrollable >= targetY) {
            if (engine) {
              scrollTo(targetY, { immediate: true });
            }
            window.scrollTo(0, targetY);
          }

          remainingFrames--;
          if (remainingFrames > 0 && typeof window.requestAnimationFrame === 'function') {
            retryRafRef.current = window.requestAnimationFrame(checkAndReapply);
          } else {
            retryRafRef.current = null;
          }
        };

        retryRafRef.current = window.requestAnimationFrame(checkAndReapply);
      }
    },
    [engine, scrollTo, onRestore, retryFrames]
  );

  const restorePosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const key = currentKeyRef.current;

    // Check for hash navigation first
    if (window.location.hash) {
      try {
        const anchor = document.querySelector(window.location.hash);
        if (anchor && typeof (anchor as any).getBoundingClientRect === 'function') {
          const anchorTop = (anchor as any).getBoundingClientRect().top + (window.scrollY || 0);
          executeRestore(anchorTop, key);
          return;
        }
      } catch {
        // Fall through on invalid selector
      }
    }

    // Check custom target
    if (getScrollTarget) {
      const customTarget = getScrollTarget(key);
      if (customTarget !== null && !isNaN(customTarget)) {
        executeRestore(customTarget, key);
        return;
      }
    }

    // Check saved history
    const saved = historyStore.get(key);
    if (saved !== null) {
      executeRestore(saved, key);
    } else if (scrollToTopOnPush) {
      resetToTop();
    }
  }, [executeRestore, getScrollTarget, resetToTop, scrollToTopOnPush]);

  // Global popstate, history pushState/replaceState, and lifecycle listeners
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handlePopState = () => {
      isPopStateRef.current = true;
      if (!explicitRouteKey) {
        setActiveKey(resolveCurrentKey());
      }
    };

    const handlePageHide = () => {
      savePosition();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handlePageHide);

    // Patch pushState and replaceState so client SPA navigations trigger scroll restoration even when routeKey prop is omitted
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      if (typeof window !== 'undefined') {
        const leavingKey = currentKeyRef.current;
        if (leavingKey) {
          const scrollY = window.scrollY || window.pageYOffset || 0;
          historyStore.save(leavingKey, scrollY);
        }
      }
      originalPushState.apply(this, args);
      if (!explicitRouteKey) {
        setActiveKey(resolveCurrentKey());
      }
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      if (!explicitRouteKey) {
        setActiveKey(resolveCurrentKey());
      }
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handlePageHide);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      if (retryRafRef.current !== null && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(retryRafRef.current);
        retryRafRef.current = null;
      }
    };
  }, [enabled, explicitRouteKey, savePosition]);

  // Route transition effect
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const oldKey = prevKeyRef.current;
    if (oldKey && oldKey !== currentKey) {
      // Save scroll for leaving route before transitioning
      const prevScroll = window.scrollY || window.pageYOffset || 0;
      historyStore.save(oldKey, prevScroll);
    }

    const wasPopState = isPopStateRef.current;
    isPopStateRef.current = false;

    // Hash check
    if (window.location.hash) {
      try {
        const targetEl = document.querySelector(window.location.hash);
        if (targetEl && typeof (targetEl as any).getBoundingClientRect === 'function') {
          const top = (targetEl as any).getBoundingClientRect().top + (window.scrollY || 0);
          executeRestore(top, currentKey);
          prevKeyRef.current = currentKey;
          return;
        }
      } catch {
        // Fall through
      }
    }

    if (wasPopState) {
      const saved = historyStore.get(currentKey);
      if (saved !== null) {
        executeRestore(saved, currentKey);
      } else if (scrollToTopOnPush) {
        resetToTop();
      }
    } else {
      // Push navigation
      if (scrollToTopOnPush) {
        resetToTop();
      }
    }

    prevKeyRef.current = currentKey;
  }, [currentKey, enabled, executeRestore, resetToTop, scrollToTopOnPush]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && currentKeyRef.current) {
        const scroll = window.scrollY || window.pageYOffset || 0;
        historyStore.save(currentKeyRef.current, scroll);
      }
    };
  }, []);

  useEffect(() => {
    setSavedPosState(typeof window !== 'undefined' ? historyStore.get(currentKey) : null);
  }, [currentKey]);

  return {
    savePosition,
    restorePosition,
    resetToTop,
    savedPosition: savedPosState,
  };
}
