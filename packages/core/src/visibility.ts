/**
 * Global Viewport Visibility Manager for ScrollCraft
 * Coordinates all viewport-culling and off-screen dormancy through a single coalesced IntersectionObserver.
 * Strictly under 650 LOC.
 */

import { VisibilityCallback, VisibilityOptions } from './types';
import { ticker } from './ticker';

export class GlobalVisibilityManager {
  private static instance: GlobalVisibilityManager | null = null;

  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, Set<VisibilityCallback>>();
  private visibilityState = new WeakMap<Element, boolean>();

  // Single coalesced queue to absorb rapid scroll bursts
  private pendingEntries: IntersectionObserverEntry[] = [];
  private isDrainScheduled = false;
  private rafId: number | null = null;

  private constructor(private options: VisibilityOptions = {}) {
    this.initObserver();
  }

  public static get(options?: VisibilityOptions): GlobalVisibilityManager {
    if (!GlobalVisibilityManager.instance) {
      GlobalVisibilityManager.instance = new GlobalVisibilityManager(options);
    }
    return GlobalVisibilityManager.instance;
  }

  private initObserver(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

    const rootMargin = this.options.rootMargin ?? '250px 0px';
    const threshold = this.options.threshold ?? 0;

    this.observer = new IntersectionObserver((entries) => {
      this.pendingEntries.push(...entries);

      if (!this.isDrainScheduled) {
        this.isDrainScheduled = true;
        this.rafId = requestAnimationFrame(this.drainPendingEntries);
      }
    }, { rootMargin, threshold });
  }

  private drainPendingEntries = (): void => {
    this.isDrainScheduled = false;
    this.rafId = null;

    const entries = this.pendingEntries;
    this.pendingEntries = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const target = entry.target;
      const isVisible = entry.isIntersecting || entry.boundingClientRect.top < 0 && entry.boundingClientRect.bottom > 0;

      this.visibilityState.set(target, isVisible);

      const listeners = this.callbacks.get(target);
      if (listeners) {
        for (const cb of listeners) {
          try {
            cb(isVisible, entry);
          } catch (err) {
            console.error('[ScrollCraft] Visibility callback error:', err);
          }
        }
      }
    }
  };

  /**
   * Subscribes an element to viewport visibility events.
   * Returns an unobserve cleanup function.
   */
  public observe(element: Element, callback: VisibilityCallback): () => void {
    if (!this.observer) {
      // In SSR or unaccelerated environment, fallback to always visible
      callback(true, {} as IntersectionObserverEntry);
      return () => {};
    }

    let listeners = this.callbacks.get(element);
    if (!listeners) {
      listeners = new Set();
      this.callbacks.set(element, listeners);
      this.observer.observe(element);
    }

    listeners.add(callback);

    // Immediate sync if we already know visibility state
    if (this.visibilityState.has(element)) {
      const state = this.visibilityState.get(element)!;
      callback(state, {} as IntersectionObserverEntry);
    }

    return () => {
      this.unobserve(element, callback);
    };
  }

  /**
   * Removes subscription for an element.
   */
  public unobserve(element: Element, callback?: VisibilityCallback): void {
    const listeners = this.callbacks.get(element);
    if (!listeners) return;

    if (callback) {
      listeners.delete(callback);
    } else {
      listeners.clear();
    }

    if (listeners.size === 0) {
      this.callbacks.delete(element);
      this.observer?.unobserve(element);
    }
  }

  /**
   * Synchronously queries whether an element is currently marked visible.
   */
  public isVisible(element: Element): boolean {
    return this.visibilityState.get(element) ?? true;
  }

  /**
   * Flushes any pending visibility callbacks immediately (useful for tests).
   */
  public flush(): void {
    if (this.isDrainScheduled) {
      if (this.rafId !== null) cancelAnimationFrame(this.rafId);
      this.drainPendingEntries();
    }
  }

  /**
   * Resets and disconnects the singleton observer.
   */
  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isDrainScheduled = false;
    this.pendingEntries = [];
    this.observer?.disconnect();
    this.observer = null;
    this.callbacks.clear();
    GlobalVisibilityManager.instance = null;
  }
}

export const globalVisibilityManager = GlobalVisibilityManager.get();
 
export interface FrustumItem {
  id: string;
  element?: Element;
  startY: number;
  endY: number;
  margin?: number; // default: 200px
  onEnter?: () => void;
  onExit?: (boundary: 'start' | 'end') => void;
  clamp?: (progress: number) => void;
  update?: (scrollY: number) => void;
}

interface FrustumItemInternal {
  item: FrustumItem;
  isActive: boolean;
  lastBoundary: 'start' | 'end' | null;
}

export class FrustumShield {
  private static instance: FrustumShield | null = null;
  private items = new Map<string, FrustumItemInternal>();
  private originalScrollTo: typeof window.scrollTo | null = null;
  private isListening = false;

  public static get(): FrustumShield {
    if (!FrustumShield.instance) {
      FrustumShield.instance = new FrustumShield();
    }
    return FrustumShield.instance;
  }

  private constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;
    if (!this.isListening) {
      this.isListening = true;
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.bindScrollTo();
    }
  }

  private onScroll = (): void => {
    const scrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset) : 0;
    this.evaluate(scrollY);
  };

  private bindScrollTo(): void {
    if (typeof window === 'undefined' || this.originalScrollTo) return;
    this.originalScrollTo = window.scrollTo;
    const self = this;
    window.scrollTo = function (...args: any[]) {
      self.originalScrollTo!.apply(this, args as any);
      let targetY: number | undefined;
      if (typeof args[0] === 'object' && args[0] !== null) {
        targetY = args[0].top;
      } else if (typeof args[1] === 'number') {
        targetY = args[1];
      } else if (typeof args[0] === 'number') {
        targetY = args[0];
      }
      if (typeof targetY === 'number' && !isNaN(targetY)) {
        self.evaluate(targetY);
      }
    };
  }

  public register(item: FrustumItem): () => void {
    if (!this.isListening) {
      this.init();
    }
    const currentScrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset) : 0;
    const internal: FrustumItemInternal = {
      item,
      isActive: false,
      lastBoundary: null,
    };
    this.items.set(item.id, internal);
    this.evaluateItem(internal, currentScrollY, true);

    return () => {
      this.unregister(item.id);
    };
  }

  public unregister(id: string): void {
    this.items.delete(id);
  }

  public updateBounds(id: string, startY: number, endY: number): void {
    const record = this.items.get(id);
    if (!record) return;
    record.item.startY = startY;
    record.item.endY = endY;
    const currentScrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset) : 0;
    this.evaluateItem(record, currentScrollY);
  }

  public evaluate(scrollY: number): void {
    for (const record of this.items.values()) {
      this.evaluateItem(record, scrollY);
    }
  }

  private evaluateItem(record: FrustumItemInternal, scrollY: number, isInitial = false): void {
    const margin = record.item.margin ?? 200;
    const minBound = Math.min(record.item.startY, record.item.endY);
    const maxBound = Math.max(record.item.startY, record.item.endY);
    const rangeStart = minBound - margin;
    const rangeEnd = maxBound + margin;
    const id = record.item.id;

    if (scrollY < rangeStart) {
      if (record.isActive || record.lastBoundary !== 'start' || isInitial) {
        record.item.clamp?.(0);
        record.item.onExit?.('start');
        record.lastBoundary = 'start';
      }
      if (record.isActive || isInitial) {
        record.isActive = false;
        ticker.pauseTask(id);
      }
    } else if (scrollY > rangeEnd) {
      if (record.isActive || record.lastBoundary !== 'end' || isInitial) {
        record.item.clamp?.(1);
        record.item.onExit?.('end');
        record.lastBoundary = 'end';
      }
      if (record.isActive || isInitial) {
        record.isActive = false;
        ticker.pauseTask(id);
      }
    } else {
      if (!record.isActive || isInitial) {
        record.isActive = true;
        record.lastBoundary = null;
        ticker.resumeTask(id);
        record.item.onEnter?.();
        record.item.update?.(scrollY);
      }
    }
  }

  public isCulled(id: string): boolean {
    const record = this.items.get(id);
    if (!record) return false;
    return !record.isActive;
  }

  public getActiveCount(): number {
    let count = 0;
    for (const record of this.items.values()) {
      if (record.isActive) count++;
    }
    return count;
  }

  public getTotalCount(): number {
    return this.items.size;
  }

  public destroy(): void {
    if (this.isListening && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
      this.isListening = false;
    }
    if (this.originalScrollTo && typeof window !== 'undefined') {
      window.scrollTo = this.originalScrollTo;
      this.originalScrollTo = null;
    }
    this.items.clear();
  }
}

export const frustumShield = /* @__PURE__ */ FrustumShield.get();

