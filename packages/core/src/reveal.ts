/**
 * Global Reveal Observer for ScrollCraft
 * Prevents IntersectionObserver spam by centralizing all reveal elements into a single observer.
 * Strictly under 650 LOC.
 */

import { TransformComposer, NumericTransform } from './dom';
import { motionStore } from './motion-preference';
import { styleRegistry } from './style-registry';
import { adaptiveQualityGovernor } from './adaptive-quality';

export interface RevealOptions {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
  blur?: boolean | number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  onReveal?: () => void;
  onReset?: () => void;
}

interface RevealEntry {
  element: HTMLElement;
  options: RevealOptions;
  hasRevealed: boolean;
  initialStyles: {
    opacity: string;
    transition: string;
    willChange: string;
    filter: string;
  };
  isObserved: boolean;
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

export class GlobalRevealObserver {
  private static instance: GlobalRevealObserver | null = null;
  // Use a map to support multiple threshold requirements efficiently
  private observers: Map<number, IntersectionObserver> = new Map();
  private entries: Map<Element, RevealEntry> = new Map();

  private constructor() {}

  public static get(): GlobalRevealObserver {
    if (!GlobalRevealObserver.instance) {
      GlobalRevealObserver.instance = new GlobalRevealObserver();
    }
    return GlobalRevealObserver.instance;
  }

  private getObserver(threshold: number): IntersectionObserver | null {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return null;
    
    if (!this.observers.has(threshold)) {
      try {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              const target = entry.target as HTMLElement;
              const data = this.entries.get(target);
              if (!data) continue;

              // Robust check: if it's intersecting, OR if it's already above the viewport (we scrolled past it fast)
              if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
                data.hasRevealed = true;
                this.applyRevealedState(target, data.options);
                data.options.onReveal?.();

                if (data.options.once) {
                  for (const obs of this.observers.values()) {
                    obs.unobserve(target);
                  }
                  data.isObserved = false;
                }
              } else if (!data.options.once && data.hasRevealed) {
                data.hasRevealed = false;
                this.applyHiddenState(target, data.options);
                data.options.onReset?.();
              }
            }
          },
          { threshold }
        );
        this.observers.set(threshold, observer);
      } catch (err) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.warn('[ScrollCraft] Failed to instantiate IntersectionObserver in reveal:', err);
        }
        return null;
      }
    }
    return this.observers.get(threshold) ?? null;
  }

  private getHiddenNumericTransform(options: RevealOptions): NumericTransform {
    const direction = options.direction ?? 'up';
    const distance = options.distance ?? 32;
    let x: number | undefined;
    let y: number | undefined;
    let z: number | undefined;

    switch (direction) {
      case 'up': x = 0; y = distance; z = 0; break;
      case 'down': x = 0; y = -distance; z = 0; break;
      case 'left': x = distance; y = 0; z = 0; break;
      case 'right': x = -distance; y = 0; z = 0; break;
      default: break;
    }

    return {
      x,
      y,
      z,
      format: 'reveal',
      scale: options.scale !== undefined && options.scale !== 1 ? options.scale : undefined,
      rotateX: options.rotateX,
      rotateY: options.rotateY,
    };
  }

  private applyInitialHiddenState(element: HTMLElement, options: RevealOptions): void {
    styleRegistry.lease(element, 'reveal', 'transition', 'none');
    styleRegistry.lease(element, 'reveal', 'opacity', '0');
    if (options.blur) {
      const blurPx = typeof options.blur === 'number' ? options.blur : 8;
      const effectiveBlur = adaptiveQualityGovernor.clampBlur(blurPx);
      if (effectiveBlur > 0) {
        styleRegistry.lease(element, 'reveal', 'filter', `blur(${effectiveBlur}px)`);
      } else {
        styleRegistry.release(element, 'reveal', 'filter');
      }
    }
    const hidden = this.getHiddenNumericTransform(options);
    if (hidden.x !== undefined || hidden.scale !== undefined || hidden.rotateX !== undefined || hidden.rotateY !== undefined) {
      TransformComposer.setNumeric(element, 'reveal', hidden);
    } else {
      TransformComposer.clear(element, 'reveal');
    }
    void element.offsetHeight;
  }

  private applyHiddenState(element: HTMLElement, options: RevealOptions): void {
    (element as any).__sc_revealed = false;
    const duration = options.duration ?? 0.6;
    let transition = `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`;
    if (options.blur) {
      const blurPx = typeof options.blur === 'number' ? options.blur : 8;
      styleRegistry.lease(element, 'reveal', 'filter', `blur(${blurPx}px)`);
      transition += `, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`;
    }
    styleRegistry.lease(element, 'reveal', 'willChange', 'opacity, transform');
    styleRegistry.lease(element, 'reveal', 'transition', transition);
    styleRegistry.lease(element, 'reveal', 'opacity', '0');
    const hidden = this.getHiddenNumericTransform(options);
    if (hidden.x !== undefined || hidden.scale !== undefined || hidden.rotateX !== undefined || hidden.rotateY !== undefined) {
      TransformComposer.setNumeric(element, 'reveal', hidden);
    } else {
      TransformComposer.clear(element, 'reveal');
    }
  }

  private applyRevealedState(element: HTMLElement, options: RevealOptions): void {
    const data = this.entries.get(element);
    if (data?.cleanupTimer) {
      clearTimeout(data.cleanupTimer);
      data.cleanupTimer = undefined;
    }

    const duration = options.duration ?? 0.6;
    const delay = options.delay ?? 0;
    const delayStr = delay > 0 ? ` ${delay}s` : '';
    let transition = `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1)${delayStr}, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)${delayStr}`;
    if (options.blur) {
      styleRegistry.lease(element, 'reveal', 'filter', 'blur(0px)');
      transition += `, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1)${delayStr}`;
    }
    styleRegistry.lease(element, 'reveal', 'transition', transition);
    styleRegistry.lease(element, 'reveal', 'opacity', '1');
    TransformComposer.setNumeric(element, 'reveal', { x: 0, y: 0, z: 0, format: 'reveal' });

    (element as any).__sc_revealed = true;

    // Release GPU compositing layer once animation finishes to eliminate texture exhaustion and ghosting
    const cleanupMs = Math.max(50, Math.round((duration + delay) * 1000) + 60);
    const timer = setTimeout(() => {
      if ((element as any).__sc_revealed) {
        styleRegistry.release(element, 'reveal', 'willChange');
        styleRegistry.release(element, 'reveal', 'transition');
        if (options.blur) {
          styleRegistry.release(element, 'reveal', 'filter');
        }
        TransformComposer.clear(element, 'reveal');
      }
      if (data) data.cleanupTimer = undefined;
    }, cleanupMs);

    if (data) {
      data.cleanupTimer = timer;
    }
  }

  public observe(element: HTMLElement, options: RevealOptions): void {
    if (!element || typeof window === 'undefined') return;

    if (motionStore.isReduced()) {
      (element as any).__sc_revealed = true;
      styleRegistry.lease(element, 'reveal', 'opacity', '1');
      styleRegistry.lease(element, 'reveal', 'transition', 'none');
      if (options.blur) styleRegistry.release(element, 'reveal', 'filter');
      TransformComposer.clear(element, 'reveal');
      options.onReveal?.();
      return;
    }

    const fullOptions: RevealOptions = {
      direction: options.direction ?? 'up',
      distance: options.distance ?? 32,
      duration: options.duration ?? 0.6,
      delay: options.delay ?? 0,
      threshold: options.threshold ?? 0.15,
      once: options.once ?? true,
      blur: options.blur,
      scale: options.scale,
      rotateX: options.rotateX,
      rotateY: options.rotateY,
      onReveal: options.onReveal,
      onReset: options.onReset,
    };

    // If element has already completed its one-time reveal, guarantee it stays visible
    if (fullOptions.once && (element as any).__sc_revealed) {
      styleRegistry.lease(element, 'reveal', 'opacity', '1');
      styleRegistry.release(element, 'reveal', 'willChange');
      styleRegistry.release(element, 'reveal', 'transition');
      if (fullOptions.blur) styleRegistry.release(element, 'reveal', 'filter');
      TransformComposer.clear(element, 'reveal');
      return;
    }

    // Safety: If element is taller than window, IntersectionObserver might never hit 0.15 threshold
    // We dynamically clamp the threshold to ensure it triggers
    const wh = window.innerHeight;
    const rect = element.getBoundingClientRect();
    let safeThreshold = fullOptions.threshold ?? 0.15;
    if (rect.height > wh * 0.8) {
      safeThreshold = 0.05; // Drop threshold for massive elements
    }

    const initialStyles = {
      opacity: element.style.opacity || '',
      transition: element.style.transition || '',
      willChange: element.style.willChange || '',
      filter: element.style.filter || '',
    };

    const entry: RevealEntry = {
      element,
      options: fullOptions,
      hasRevealed: false,
      initialStyles,
      isObserved: false,
    };
    this.entries.set(element, entry);

    // Initial State Check: If already scrolled past the viewport above on mount, reveal instantly without animation
    if (rect.bottom < 0) {
      entry.hasRevealed = true;
      (element as any).__sc_revealed = true;
      styleRegistry.lease(element, 'reveal', 'opacity', '1');
      if (fullOptions.blur) styleRegistry.lease(element, 'reveal', 'filter', 'none');
      TransformComposer.setNumeric(element, 'reveal', { x: 0, y: 0, z: 0, format: 'reveal' });
      fullOptions.onReveal?.();
      
      if (fullOptions.once) {
        // Retain entry so unobserve() and destroy() can clean up, but do not register with IntersectionObserver
        return;
      }
    } else {
      styleRegistry.lease(element, 'reveal', 'willChange', 'opacity, transform');
      this.applyInitialHiddenState(element, fullOptions);
    }

    const observer = this.getObserver(safeThreshold);
    if (!observer) {
      entry.hasRevealed = true;
      (element as any).__sc_revealed = true;
      styleRegistry.lease(element, 'reveal', 'opacity', '1');
      if (fullOptions.blur) styleRegistry.lease(element, 'reveal', 'filter', 'none');
      TransformComposer.setNumeric(element, 'reveal', { x: 0, y: 0, z: 0, format: 'reveal' });
      fullOptions.onReveal?.();
      return;
    }
    observer.observe(element);
    entry.isObserved = true;
  }

  public unobserve(element: HTMLElement | null): void {
    if (!element) return;
    const data = this.entries.get(element);
    if (!data) return;

    if (data.cleanupTimer) {
      clearTimeout(data.cleanupTimer);
      data.cleanupTimer = undefined;
    }

    if (data.isObserved) {
      for (const observer of this.observers.values()) {
        observer.unobserve(element);
      }
    }
    
    this.entries.delete(element);
    delete (element as any).__sc_revealed;
    styleRegistry.release(element, 'reveal', 'opacity');
    styleRegistry.release(element, 'reveal', 'willChange');
    styleRegistry.release(element, 'reveal', 'transition');
    styleRegistry.release(element, 'reveal', 'filter');
    if (element.style) {
      if (element.style.opacity === '') element.style.opacity = data.initialStyles.opacity;
      if (element.style.transition === '') element.style.transition = data.initialStyles.transition;
      if (element.style.willChange === '') element.style.willChange = data.initialStyles.willChange;
      if (element.style.filter === '') element.style.filter = data.initialStyles.filter;
    }
    TransformComposer.clear(element, 'reveal');
  }

  /** Releases pooled observers during application teardown and tests. */
  public destroy(): void {
    for (const observer of this.observers.values()) observer.disconnect();
    this.observers.clear();
    for (const entry of this.entries.values()) {
      if (entry.cleanupTimer) {
        clearTimeout(entry.cleanupTimer);
        entry.cleanupTimer = undefined;
      }
      delete (entry.element as any).__sc_revealed;
      styleRegistry.release(entry.element, 'reveal', 'opacity');
      styleRegistry.release(entry.element, 'reveal', 'willChange');
      styleRegistry.release(entry.element, 'reveal', 'transition');
      styleRegistry.release(entry.element, 'reveal', 'filter');
      if (entry.element.style) {
        if (entry.element.style.opacity === '') entry.element.style.opacity = entry.initialStyles.opacity;
        if (entry.element.style.transition === '') entry.element.style.transition = entry.initialStyles.transition;
        if (entry.element.style.willChange === '') entry.element.style.willChange = entry.initialStyles.willChange;
        if (entry.element.style.filter === '') entry.element.style.filter = entry.initialStyles.filter;
      }
      TransformComposer.clear(entry.element, 'reveal');
    }
    this.entries.clear();
  }
}

export const revealObserver = /* @__PURE__ */ GlobalRevealObserver.get();
export { GlobalRevealObserver as RevealSolver };
