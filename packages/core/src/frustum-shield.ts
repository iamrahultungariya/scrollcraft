/**
 * Active Frustum Shield & Spatial Culling Coordinator for ScrollCraft
 * 
 * Freezes offscreen solvers so elements outside the active viewport
 * consume zero CPU and GPU cycles during scroll ticks.
 * 
 * Strictly under 650 LOC.
 */

import { globalVisibilityManager } from './visibility';

export class FrustumShield {
  private static instance: FrustumShield | null = null;
  private culledElements: WeakMap<HTMLElement, boolean> = new WeakMap();
  private unobserveMap: WeakMap<HTMLElement, () => void> = new WeakMap();

  private constructor() {}

  public static get(): FrustumShield {
    if (!FrustumShield.instance) {
      FrustumShield.instance = new FrustumShield();
    }
    return FrustumShield.instance;
  }

  /**
   * Registers an element for automatic spatial culling.
   * When outside the viewport (+250px margin), the element is marked as culled.
   */
  public track(element: HTMLElement, onVisibilityChange?: (isVisible: boolean) => void): () => void {
    if (!element || typeof window === 'undefined') return () => {};

    // Initial state: assume visible until observer reports
    this.culledElements.set(element, false);

    const unobserve = globalVisibilityManager.observe(element, (isVisible) => {
      this.culledElements.set(element, !isVisible);
      onVisibilityChange?.(isVisible);
    });

    this.unobserveMap.set(element, unobserve);

    return () => {
      unobserve();
      this.culledElements.delete(element);
      this.unobserveMap.delete(element);
    };
  }

  /**
   * Synchronous check: Returns true if the element is currently culled (offscreen).
   */
  public isCulled(element: HTMLElement): boolean {
    if (!element || typeof window === 'undefined') return false;
    return this.culledElements.get(element) ?? false;
  }

  public untrack(element: HTMLElement): void {
    const unobserve = this.unobserveMap.get(element);
    if (unobserve) {
      unobserve();
      this.unobserveMap.delete(element);
      this.culledElements.delete(element);
    }
  }
}

export const frustumShield = /* @__PURE__ */ FrustumShield.get();
