'use client';

/**
 * ScrollCraft Root Provider & Zero-Rerender Context
 * Implements dual-layer architecture: direct DOM updates for 120 FPS motion
 * and useSyncExternalStore for selective reactive UI readouts.
 * Strictly under 650 LOC.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  InertiaEngine,
  InertiaConfig,
  ScrollMetrics,
  tierStore,
  PerformanceTier,
  GlobalResizeManager,
  motionStore,
  historyStore,
} from '@scrollcraft/core';
import { ScrollContextValue, ScrollProviderProps } from './types';

// Lazily instantiate inspector only if debug prop is enabled in ScrollProvider
let LazyScrollInspector: React.ComponentType<any> | null = null;
function getLazyScrollInspector() {
  if (!LazyScrollInspector && typeof window !== 'undefined') {
    LazyScrollInspector = React.lazy(() =>
      import('./components/scroll-inspector').then((m) => ({ default: m.ScrollInspector }))
    );
  }
  return LazyScrollInspector;
}

declare const process: any;

const defaultMetrics: ScrollMetrics = {
  scroll: 0,
  limit: 0,
  velocity: 0,
  direction: 0,
  progress: 0,
  current: 0,
  target: 0,
  maxScroll: 0,
};

const ScrollContext = /* @__PURE__ */ createContext<ScrollContextValue>({
  engine: null,
  scrollTo: () => {},
  resize: () => {},
  isReady: false,
  reducedMotion: false,
  getMetrics: () => defaultMetrics,
  subscribe: () => () => {},
});

export const ScrollProvider: React.FC<ScrollProviderProps> = ({
  children,
  smooth = true,
  debug = false,
  autoResetOnRouteChange = false,
  autoRecalc = true,
  respectReducedMotion = true,
  motionOverride,
  restoreScroll = false,
  allowNestedScroll,
  prevent,
  autoToggle,
}) => {
  if (motionOverride && motionStore.getMode() !== motionOverride) {
    motionStore.setOverride(motionOverride);
  }
  const [isReady, setIsReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    respectReducedMotion ? motionStore.isReduced() : false
  );
  const engineRef = useRef<InertiaEngine | null>(null);

  const getCombinedConfig = (): InertiaConfig => {
    const base = typeof smooth === 'object' ? smooth : {};
    return {
      ...base,
      ...(allowNestedScroll !== undefined ? { allowNestedScroll } : {}),
      ...(prevent !== undefined ? { prevent } : {}),
      ...(autoToggle !== undefined ? { autoToggle } : {}),
    };
  };

  // Serialize smooth prop to prevent referential-inequality re-init loops
  const smoothConfigKey = JSON.stringify({
    smooth: typeof smooth === 'object' ? smooth : String(smooth),
    allowNestedScroll,
    hasPrevent: Boolean(prevent),
    autoToggle,
  });
  const smoothPropRef = useRef(smooth);
  smoothPropRef.current = smooth;

  // Initialize engine once without causing re-renders
  if (!engineRef.current && typeof window !== 'undefined') {
    engineRef.current = new InertiaEngine(getCombinedConfig());
  }

  useEffect(() => {
    let isMounted = true;
    if (typeof window === 'undefined') return;

    if (motionOverride) {
      motionStore.setOverride(motionOverride);
    }
    const isMotionReduced = respectReducedMotion ? motionStore.isReduced() : false;
    setReducedMotion(isMotionReduced);

    const unsubMotion = motionStore.subscribe((reduced) => {
      if (isMounted) {
        setReducedMotion(respectReducedMotion ? reduced : false);
      }
    });

    const activeSmooth = smoothPropRef.current;
    // Safely re-instantiate engine if cleared by React StrictMode cleanup pass
    if (!engineRef.current) {
      engineRef.current = new InertiaEngine(getCombinedConfig());
    }

    const engine = engineRef.current;
    if (engine) {
      if (activeSmooth && !isMotionReduced) {
        engine.init();
      }
      setIsReady(true);
    }

    // Handle route changes automatically if enabled
    let cleanupRouteChange: (() => void) | null = null;
    if (autoResetOnRouteChange && typeof window !== 'undefined') {
      let lastPathname = window.location.pathname;

      const handleRouteChange = () => {
        if (window.location.pathname === lastPathname) return;
        lastPathname = window.location.pathname;
        engine?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
          if (isMounted) engine?.resize();
        });
      };

      window.addEventListener('popstate', handleRouteChange);

      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = function (...args) {
        originalPushState.apply(this, args);
        handleRouteChange();
      };

      window.history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        handleRouteChange();
      };

      cleanupRouteChange = () => {
        window.removeEventListener('popstate', handleRouteChange);
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
      };
    }

    // Handle history scroll restoration if enabled
    let cleanupRestore: (() => void) | null = null;
    if (restoreScroll && typeof window !== 'undefined') {
      const handlePopState = () => {
        const key = `${window.location.pathname}${window.location.search}`;
        const saved = historyStore.get(key);
        if (saved !== null) {
          engine?.scrollTo(saved, { immediate: true });
          window.scrollTo(0, saved);
        }
      };

      const saveCurrent = () => {
        const key = `${window.location.pathname}${window.location.search}`;
        historyStore.save(key, window.scrollY || window.pageYOffset || 0);
      };

      window.addEventListener('popstate', handlePopState);
      window.addEventListener('pagehide', saveCurrent);
      window.addEventListener('beforeunload', saveCurrent);

      cleanupRestore = () => {
        saveCurrent();
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('pagehide', saveCurrent);
        window.removeEventListener('beforeunload', saveCurrent);
      };
    }

    // Window resize handling (debounced via requestAnimationFrame, no body ResizeObserver loop)
    let resizeRafId: number | null = null;
    const handleResize = () => {
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        engine?.resize();
        resizeRafId = null;
      });
    };

    if (autoRecalc && typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize, { passive: true });

      if (typeof document !== 'undefined' && 'fonts' in document) {
        document.fonts.ready.then(() => {
          if (isMounted) engine?.resize();
        });
      }
    }

    // Observe DOM mutations to detect route changes and content shifts via centralized GlobalResizeManager
    let unobserveBodyResize: (() => void) | null = null;

    if (autoRecalc && typeof window !== 'undefined' && typeof document !== 'undefined' && document.body) {
      let recalcRafId: number | null = null;
      const handleDOMChange = () => {
        if (recalcRafId !== null) return;
        recalcRafId = requestAnimationFrame(() => {
          recalcRafId = null;
          if (isMounted) engine?.resize();
        });
      };

      unobserveBodyResize = GlobalResizeManager.observe(document.body, handleDOMChange);
    }

    // Invariant: Imperative sync of data-scrollcraft-tier attribute (SSR safe, no hydration mismatch)
    const unsubTier = tierStore.subscribe((tier) => {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-scrollcraft-tier', tier);
      }
    });

    return () => {
      isMounted = false;
      unsubTier();
      unsubMotion();
      cleanupRouteChange?.();
      cleanupRestore?.();
      if (autoRecalc) {
        window.removeEventListener('resize', handleResize);
        if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
        unobserveBodyResize?.();
      }
      engine?.destroy();
      engineRef.current = null;
    };
  }, [smoothConfigKey, autoResetOnRouteChange, autoRecalc, respectReducedMotion, motionOverride, restoreScroll]);

  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: {
        offset?: number;
        immediate?: boolean;
        duration?: number;
        easing?: (t: number) => number;
      }
    ) => {
      engineRef.current?.scrollTo(target, options);
    },
    []
  );

  const resize = useCallback(() => {
    engineRef.current?.resize();
  }, []);

  const getMetrics = useCallback(() => {
    return engineRef.current?.getMetrics() ?? defaultMetrics;
  }, []);

  const subscribe = useCallback((callback: (metrics: ScrollMetrics) => void) => {
    if (engineRef.current) {
      return engineRef.current.subscribe(callback);
    }
    callback(defaultMetrics);
    return () => {};
  }, []);

  const contextValue = useMemo<ScrollContextValue>(
    () => ({
      engine: engineRef.current,
      scrollTo,
      resize,
      isReady,
      reducedMotion,
      getMetrics,
      subscribe,
    }),
    [scrollTo, resize, isReady, reducedMotion, getMetrics, subscribe]
  );

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
      {debug && (() => {
        const Inspector = getLazyScrollInspector();
        return Inspector ? (
          <React.Suspense fallback={null}>
            <Inspector
              position={typeof debug === 'object' ? debug.position : 'bottom-right'}
              defaultCollapsed={typeof debug === 'object' ? debug.collapsed : false}
              markers={typeof debug === 'object' ? debug.markers : false}
            />
          </React.Suspense>
        ) : null;
      })()}
    </ScrollContext.Provider>
  );
};

export const ScrollCraftProvider = ScrollProvider;

export const useScrollCraft = (): ScrollContextValue => {
  return useContext(ScrollContext);
};

function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  const recordA = a as Record<string, unknown>;
  const recordB = b as Record<string, unknown>;
  const keysA = Object.keys(recordA);
  const keysB = Object.keys(recordB);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(recordB, key) || !Object.is(recordA[key], recordB[key])) {
      return false;
    }
  }
  return true;
}

export interface ScrollStateOptions {
  enabled?: boolean;
}

/**
 * Selective reactive state subscriber using useSyncExternalStore.
 * Allows components (like HUDs or percentage counters) to subscribe to specific metrics
 * without forcing root tree re-renders.
 */
export function useScrollState<T = ScrollMetrics>(
  selector?: (metrics: ScrollMetrics) => T,
  isEqual: (a: T, b: T) => boolean = shallowEqual,
  options: ScrollStateOptions = {}
): T {
  const { enabled = true } = options;
  const { subscribe, getMetrics } = useScrollCraft();
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const isEqualRef = useRef(isEqual);
  isEqualRef.current = isEqual;

  const lastSelectedRef = useRef<{ hasValue: boolean; value: T; raw: ScrollMetrics } | null>(null);

  const getSnapshot = () => {
    if (!enabled) {
      if (!lastSelectedRef.current) {
        const currentSelector = selectorRef.current;
        const initial = currentSelector ? currentSelector(defaultMetrics) : (defaultMetrics as unknown as T);
        lastSelectedRef.current = { hasValue: true, value: initial, raw: defaultMetrics };
      }
      return lastSelectedRef.current.value;
    }

    const raw = getMetrics();
    const currentSelector = selectorRef.current;
    const nextSelected = currentSelector ? currentSelector(raw) : (raw as unknown as T);

    if (lastSelectedRef.current && lastSelectedRef.current.hasValue) {
      if (isEqualRef.current(lastSelectedRef.current.value, nextSelected)) {
        return lastSelectedRef.current.value;
      }
    }

    lastSelectedRef.current = { hasValue: true, value: nextSelected, raw };
    return nextSelected;
  };

  const cachedServerRef = useRef<{ hasValue: boolean; value: T } | null>(null);
  const getServerSnapshot = () => {
    if (!cachedServerRef.current) {
      const currentSelector = selectorRef.current;
      const val = currentSelector ? currentSelector(defaultMetrics) : (defaultMetrics as unknown as T);
      cachedServerRef.current = { hasValue: true, value: val };
    }
    return cachedServerRef.current.value;
  };

  const noopSubscribe = useCallback(() => () => {}, []);
  const activeSubscribe = enabled ? subscribe : noopSubscribe;

  return useSyncExternalStore(activeSubscribe, getSnapshot, getServerSnapshot);
}

/**
 * Autonomous Reactive Tier Hook
 * Subscribes to runtime performance tier changes ('high' | 'balanced' | 'low').
 * Fully SSR safe (returns 'balanced' on server).
 */
export function useScrollCraftTier(): PerformanceTier {
  return useSyncExternalStore(
    (callback) => tierStore.subscribe(callback),
    () => tierStore.getTier(),
    () => 'balanced'
  );
}

