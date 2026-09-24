/**
 * High-Performance Direct DOM Transform Writer for ScrollCraft
 * Directly writes transform and opacity styles to elements.
 * Strictly under 650 LOC.
 */

import { ElementTransform, NumericTransform } from './types';
import { formatDevicePixel, snapToDevicePixel } from './math';
import { styleRegistry } from './style-registry';
import { adaptiveQualityGovernor } from './adaptive-quality';

export type { NumericTransform };

export function serializeNumericTransform(t: NumericTransform): string {
  let parts = '';
  if (t.format === 'parallax') {
    const x = t.x !== undefined ? `${Number(t.x).toFixed(2)}px` : '0';
    const y = t.y !== undefined ? `${Number(t.y).toFixed(2)}px` : '0';
    parts += `translate3d(${x}, ${y}, 0) `;
  } else if (t.format === 'reveal') {
    const x = t.x ? `${t.x}px` : '0';
    const y = t.y ? `${t.y}px` : '0';
    const z = t.z ? `${t.z}px` : '0';
    parts += `translate3d(${x}, ${y}, ${z}) `;
  } else if (t.x !== undefined || t.y !== undefined || t.z !== undefined) {
    const sx = formatDevicePixel(t.x || 0);
    const sy = formatDevicePixel(t.y || 0);
    const sz = formatDevicePixel(t.z || 0);
    parts += `translate3d(${sx}, ${sy}, ${sz}) `;
  } else {
    // Hardware Compositing Anchor: Always anchor transforms to 3D space to guarantee Blink compositor layer allocation
    parts += 'translate3d(0px, 0px, 0px) ';
  }
  if (t.scale !== undefined) parts += `scale(${t.scale}) `;
  if (t.scaleX !== undefined) parts += `scaleX(${t.scaleX}) `;
  if (t.scaleY !== undefined) parts += `scaleY(${t.scaleY}) `;
  if (t.rotate !== undefined) parts += `rotate(${t.rotate}deg) `;
  if (t.rotateX !== undefined) parts += `rotateX(${t.rotateX}deg) `;
  if (t.rotateY !== undefined) parts += `rotateY(${t.rotateY}deg) `;
  if (t.rotateZ !== undefined) parts += `rotateZ(${t.rotateZ}deg) `;
  if (t.skewX !== undefined) parts += `skewX(${t.skewX}deg) `;
  if (t.skewY !== undefined) parts += `skewY(${t.skewY}deg) `;
  return parts.trim();
}

function numericTransformsEqual(a?: NumericTransform, b?: NumericTransform): boolean {
  if (!a || !b) return a === b;
  return (
    (a.x ?? 0) === (b.x ?? 0) &&
    (a.y ?? 0) === (b.y ?? 0) &&
    (a.z ?? 0) === (b.z ?? 0) &&
    a.scale === b.scale &&
    a.scaleX === b.scaleX &&
    a.scaleY === b.scaleY &&
    a.rotate === b.rotate &&
    a.rotateX === b.rotateX &&
    a.rotateY === b.rotateY &&
    a.rotateZ === b.rotateZ &&
    a.skewX === b.skewX &&
    a.skewY === b.skewY &&
    a.format === b.format
  );
}

interface ComposedTransformState {
  base: string;
  parts: Map<string, string>;
  numericParts: Map<string, NumericTransform>;
  lastComposed: string;
  writeCount: number;
}


const transformCache = new WeakMap<HTMLElement, ElementTransform>();
const composedTransforms = new WeakMap<HTMLElement, ComposedTransformState>();

/**
 * Coordinates independent animation primitives without letting their transforms overwrite each other.
 * The first use preserves an existing inline transform as the base layer.
 * Supports canonical zero-allocation NumericTransform and legacy string transforms.
 */
function cleanInitialBaseTransform(base: string): string {
  if (!base) return '';
  const trimmed = base.trim();
  if (
    trimmed === 'translateZ(0)' ||
    trimmed === 'translateZ(0px)' ||
    trimmed === 'translate3d(0, 0, 0)' ||
    trimmed === 'translate3d(0px, 0px, 0px)' ||
    (trimmed.startsWith('translate3d(0') && (trimmed.includes('scaleX(') || trimmed.includes('scaleY(')))
  ) {
    return '';
  }
  return trimmed;
}

export class TransformComposer {
  public static setNumeric(element: HTMLElement, owner: string, transform: NumericTransform): void {
    let state = composedTransforms.get(element);
    if (!state) {
      state = {
        base: cleanInitialBaseTransform(element.style.transform || ''),
        parts: new Map(),
        numericParts: new Map(),
        lastComposed: '',
        writeCount: 0,
      };
      composedTransforms.set(element, state);
    }

    const existing = state.numericParts.get(owner);
    if (numericTransformsEqual(existing, transform)) return;

    state.numericParts.set(owner, { ...transform });
    state.parts.delete(owner);

    let composed = state.base || '';
    for (const part of state.parts.values()) {
      if (part) {
        composed = composed ? `${composed} ${part}` : part;
      }
    }
    for (const num of state.numericParts.values()) {
      const numStr = serializeNumericTransform(num);
      if (numStr) {
        composed = composed ? `${composed} ${numStr}` : numStr;
      }
    }
    composed = composed.trim();

    if (composed !== state.lastComposed) {
      state.lastComposed = composed;
      element.style.transform = composed;
      state.writeCount++;
      if (owner !== 'reveal' && !SmartCompositor.get().isPromoted(element)) {
        SmartCompositor.get().promote(element);
      }
    }
  }

  public static set(element: HTMLElement, owner: string, transform: string | NumericTransform): void {
    if (typeof transform !== 'string') {
      return this.setNumeric(element, owner, transform);
    }

    let state = composedTransforms.get(element);
    if (!state) {
      state = {
        base: cleanInitialBaseTransform(element.style.transform || ''),
        parts: new Map(),
        numericParts: new Map(),
        lastComposed: '',
        writeCount: 0,
      };
      composedTransforms.set(element, state);
    }

    // Fast path: if the owner's transform hasn't changed, skip composition entirely
    if (state.parts.get(owner) === transform) return;
    state.parts.set(owner, transform);
    state.numericParts.delete(owner);

    // Direct string composition without intermediate array allocations
    let composed = state.base || '';
    for (const part of state.parts.values()) {
      if (part) {
        composed = composed ? `${composed} ${part}` : part;
      }
    }
    for (const num of state.numericParts.values()) {
      const numStr = serializeNumericTransform(num);
      if (numStr) {
        composed = composed ? `${composed} ${numStr}` : numStr;
      }
    }
    composed = composed.trim();

    if (composed !== state.lastComposed) {
      state.lastComposed = composed;
      element.style.transform = composed;
      state.writeCount++;
      if (owner !== 'reveal' && !SmartCompositor.get().isPromoted(element)) {
        SmartCompositor.get().promote(element);
      }
    }
  }

  public static clear(element: HTMLElement, owner: string): void {
    const state = composedTransforms.get(element);
    if (!state || (!state.parts.has(owner) && !state.numericParts.has(owner))) return;
    state.parts.delete(owner);
    state.numericParts.delete(owner);

    let composed = state.base || '';
    for (const part of state.parts.values()) {
      if (part) {
        composed = composed ? `${composed} ${part}` : part;
      }
    }
    for (const num of state.numericParts.values()) {
      const numStr = serializeNumericTransform(num);
      if (numStr) {
        composed = composed ? `${composed} ${numStr}` : numStr;
      }
    }
    composed = composed.trim();

    if (composed !== state.lastComposed) {
      state.lastComposed = composed;
      element.style.transform = composed;
      state.writeCount++;
    }
    if (state.parts.size === 0 && state.numericParts.size === 0) {
      composedTransforms.delete(element);
      if (SmartCompositor.get().isPromoted(element)) {
        SmartCompositor.get().destroy(element);
      }
    }
  }

  public static get(element: HTMLElement): string {
    return composedTransforms.get(element)?.lastComposed ?? element.style.transform ?? '';
  }

  public static getWriteCount(element: HTMLElement): number {
    return composedTransforms.get(element)?.writeCount ?? 0;
  }

  public static resetWriteCount(element: HTMLElement): void {
    const state = composedTransforms.get(element);
    if (state) state.writeCount = 0;
  }
}

export class TransformWriter {
  /**
   * Applies 3D hardware-accelerated transform to an HTMLElement
   */
  public static applyTransform(element: HTMLElement, transform: ElementTransform): void {
    const x = transform.x !== undefined ? snapToDevicePixel(transform.x) : 0;
    const y = transform.y !== undefined ? snapToDevicePixel(transform.y) : 0;
    const z = transform.z !== undefined ? snapToDevicePixel(transform.z) : 0;
    const scaleX = transform.scaleX ?? transform.scale ?? 1;
    const scaleY = transform.scaleY ?? transform.scale ?? 1;
    const rotateX = transform.rotateX ?? 0;
    const rotateY = transform.rotateY ?? 0;
    const rotateZ = transform.rotateZ ?? 0;

    const cached = transformCache.get(element);
    if (
      !cached ||
      cached.x !== x ||
      cached.y !== y ||
      cached.z !== z ||
      cached.scaleX !== scaleX ||
      cached.scaleY !== scaleY ||
      cached.rotateX !== rotateX ||
      cached.rotateY !== rotateY ||
      cached.rotateZ !== rotateZ
    ) {
      const transformString = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scaleX}, ${scaleY})`;
      element.style.transform = transformString;
      transformCache.set(element, { x, y, z, scaleX, scaleY, rotateX, rotateY, rotateZ });
      SmartCompositor.get().promote(element);
    }

    if (transform.opacity !== undefined && element.style.opacity !== String(transform.opacity)) {
      element.style.opacity = String(transform.opacity);
    }
  }

  /**
   * Sets a custom CSS property on an element
   */
  public static setCssVariable(element: HTMLElement, property: string, value: string | number): void {
    element.style.setProperty(property, String(value));
  }

  /**
   * Prepares element for GPU compositing
   */
  public static promoteToCompositor(element: HTMLElement): void {
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';
  }

  /**
   * Cleans up GPU promotion when idle
   */
  public static demoteFromCompositor(element: HTMLElement): void {
    element.style.willChange = 'auto';
  }
}

/** Backwards-compatibility alias */
export const DomCompositor = TransformWriter;
export type DomCompositor = TransformWriter;

/**
 * Autonomous Smart Compositor for ScrollCraft
 * Manages layer lifecycle with debounced demotion, WeakMap+Set timer tracking,
 * and a global reject-new budget cap on Tier 1 hardware.
 * Singleton instance: smartCompositor
 */
export class SmartCompositor {
  private static instance: SmartCompositor | null = null;
  private demoteTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
  private companionSet = new Set<HTMLElement>();
  private promotedElements = new Set<HTMLElement>();

  private constructor() {}

  public static get(): SmartCompositor {
    if (!SmartCompositor.instance) {
      SmartCompositor.instance = new SmartCompositor();
    }
    return SmartCompositor.instance;
  }

  private pruneDisconnected(): void {
    for (const el of this.promotedElements) {
      if ((el as any).__sc_connected && !el.isConnected) {
        const timer = this.demoteTimers.get(el);
        if (timer) {
          clearTimeout(timer);
          this.demoteTimers.delete(el);
        }
        this.promotedElements.delete(el);
        this.companionSet.delete(el);
      }
    }
  }

  /**
   * Promotes element to compositor layer with willChange: transform.
   * Cancels any pending demotion. Enforces reject-new cap on Tier 1.
   */
  public promote(element: HTMLElement): boolean {
    if (!element || typeof window === 'undefined') return false;

    if (element.isConnected) {
      (element as any).__sc_connected = true;
    }
    this.pruneDisconnected();

    // Clear any pending demotion timer
    const pendingTimer = this.demoteTimers.get(element);
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      this.demoteTimers.delete(element);
    }

    // Global reject-new cap governed by AdaptiveQualityGovernor
    const maxLayers = adaptiveQualityGovernor.getMaxLayers();
    if (this.promotedElements.size >= maxLayers && !this.promotedElements.has(element)) {
      // If any currently promoted element is off-screen, demote it to yield layer budget to incoming visible element
      if (typeof window !== 'undefined' && window.innerHeight > 0) {
        const vh = window.innerHeight;
        for (const el of this.promotedElements) {
          if (typeof el.getBoundingClientRect === 'function') {
            const rect = el.getBoundingClientRect();
            // True off-screen check: element is completely outside viewport with margin
            if ((rect.bottom < -150 || rect.top > vh + 150) && rect.width > 0 && rect.height > 0) {
              const timer = this.demoteTimers.get(el);
              if (timer) {
                clearTimeout(timer);
                this.demoteTimers.delete(el);
              }
              this.promotedElements.delete(el);
              this.companionSet.delete(el);
              styleRegistry.clear(el, 'smart-compositor', 'willChange');
              styleRegistry.clear(el, 'smart-compositor', 'backfaceVisibility');
              if (el && el.style && !el.style.willChange) {
                el.style.willChange = 'auto';
              }
              break;
            }
          }
        }
      }
      if (this.promotedElements.size >= maxLayers && !this.promotedElements.has(element)) {
        return false;
      }
    }

    styleRegistry.set(element, 'smart-compositor', 'willChange', 'transform');
    styleRegistry.set(element, 'smart-compositor', 'backfaceVisibility', 'hidden');
    this.promotedElements.add(element);
    this.companionSet.add(element);
    return true;
  }

  /**
   * Schedules a debounced demotion after motion settles.
   */
  public demote(element: HTMLElement, debounceMs: number = 300): void {
    if (!element || typeof window === 'undefined') return;

    const existingTimer = this.demoteTimers.get(element);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.demoteTimers.delete(element);
      this.promotedElements.delete(element);
      this.companionSet.delete(element);
      styleRegistry.clear(element, 'smart-compositor', 'willChange');
      styleRegistry.clear(element, 'smart-compositor', 'backfaceVisibility');
      if (element && element.style && !element.style.willChange) {
        element.style.willChange = 'auto';
      }
    }, debounceMs);

    this.demoteTimers.set(element, timer);
    this.companionSet.add(element);
  }

  public isPromoted(element: HTMLElement): boolean {
    return this.promotedElements.has(element);
  }

  public getPromotedCount(): number {
    this.pruneDisconnected();
    return this.promotedElements.size;
  }

  /**
   * Cleans up an element upon component unmount.
   */
  public destroy(element: HTMLElement): void {
    const timer = this.demoteTimers.get(element);
    if (timer) {
      clearTimeout(timer);
      this.demoteTimers.delete(element);
    }
    this.promotedElements.delete(element);
    this.companionSet.delete(element);
    styleRegistry.clear(element, 'smart-compositor', 'willChange');
    styleRegistry.clear(element, 'smart-compositor', 'backfaceVisibility');
    if (element && element.style && !element.style.willChange) {
      element.style.willChange = 'auto';
    }
  }

  /**
   * Global teardown clearing all timers and resetting all tracked elements.
   */
  public destroyAll(): void {
    for (const element of this.companionSet) {
      const timer = this.demoteTimers.get(element);
      if (timer) {
        clearTimeout(timer);
        this.demoteTimers.delete(element);
      }
      styleRegistry.clear(element, 'smart-compositor', 'willChange');
      styleRegistry.clear(element, 'smart-compositor', 'backfaceVisibility');
      if (element && element.style && !element.style.willChange) {
        element.style.willChange = 'auto';
      }
    }
    this.companionSet.clear();
    this.promotedElements.clear();
  }
}

export const smartCompositor = SmartCompositor.get();

export type GlobalResizeCallback = (entry?: ResizeObserverEntry) => void;

/**
 * Singleton GlobalResizeManager
 * Consolidates dozens of ResizeObservers into a single shared instance.
 * Batches callbacks in requestAnimationFrame to eliminate layout thrashing.
 */
export class GlobalResizeManager {
  private static observer: ResizeObserver | null = null;
  private static callbacks = new Map<Element, Set<GlobalResizeCallback>>();
  private static rafId: number | null = null;
  private static pendingEntries: ResizeObserverEntry[] = [];

  private static lastWindowWidth: number = typeof window !== 'undefined' ? window.innerWidth : 0;
  private static lastWindowHeight: number = typeof window !== 'undefined' ? window.innerHeight : 0;
  private static windowListeners = new Set<() => void>();
  private static isWindowBound = false;

  private static getObserver(): ResizeObserver | null {
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return null;
    if (!this.observer) {
      this.observer = new ResizeObserver((entries) => {
        this.pendingEntries.push(...entries);
        if (this.rafId === null) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            const currentEntries = this.pendingEntries;
            this.pendingEntries = [];
            for (const entry of currentEntries) {
              const cbs = this.callbacks.get(entry.target);
              if (cbs) {
                for (const cb of cbs) {
                  cb(entry);
                }
              }
            }
          });
        }
      });
    }
    return this.observer;
  }

  public static observe(element: Element | null | undefined, callback: GlobalResizeCallback): () => void {
    if (!element) return () => {};
    const obs = this.getObserver();
    if (!obs) return () => {};

    let cbs = this.callbacks.get(element);
    if (!cbs) {
      cbs = new Set();
      this.callbacks.set(element, cbs);
      obs.observe(element);
    }
    cbs.add(callback);

    return () => {
      this.unobserve(element, callback);
    };
  }

  /**
   * Strictly null-safe unobserve implementation.
   * Safe no-op if element is null or undefined.
   */
  public static unobserve(element: Element | null | undefined, callback?: GlobalResizeCallback): void {
    if (!element) return;
    const cbs = this.callbacks.get(element);
    if (!cbs) return;
    if (callback) {
      cbs.delete(callback);
    } else {
      cbs.clear();
    }
    if (cbs.size === 0) {
      this.callbacks.delete(element);
      this.observer?.unobserve(element);
    }
  }

  /**
   * Helper to determine whether a resize delta corresponds to mobile address bar collapse/expand.
   * Ignores vertical shifts < 100px when width has not changed.
   */
  public static shouldIgnoreResize(prevWidth: number, prevHeight: number, newWidth: number, newHeight: number): boolean {
    return prevWidth === newWidth && Math.abs(newHeight - prevHeight) < 100;
  }

  /**
   * Subscribes to window resize events, automatically filtering out mobile address bar jitter (<100px height shift without width change).
   */
  public static onWindowResize(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    if (!this.isWindowBound) {
      this.isWindowBound = true;
      this.lastWindowWidth = window.innerWidth;
      this.lastWindowHeight = window.innerHeight;

      window.addEventListener(
        'resize',
        () => {
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;
          const widthChanged = newWidth !== this.lastWindowWidth;
          const heightDelta = Math.abs(newHeight - this.lastWindowHeight);

          if (!widthChanged && heightDelta < 100) {
            // Suppress mobile address bar expansion/collapse jitter
            return;
          }

          this.lastWindowWidth = newWidth;
          this.lastWindowHeight = newHeight;

          for (const cb of this.windowListeners) {
            cb();
          }
        },
        { passive: true }
      );
    }

    this.windowListeners.add(callback);
    return () => {
      this.windowListeners.delete(callback);
    };
  }

  public static disconnect(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.pendingEntries = [];
    this.observer?.disconnect();
    this.observer = null;
    this.callbacks.clear();
    this.windowListeners.clear();
  }
}








