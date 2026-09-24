/**
 * Zero-Spacer Pinning Engine for ScrollCraft
 * Calculates pinned bounds without injecting disruptive spacer elements.
 * Strictly under 650 LOC.
 */

import { clamp } from './math';
import { TransformComposer } from './dom';

export const DEFAULT_PIN_DURATION = 800;

export interface PinOptions {
  /** Scroll distance (in px) the element stays pinned. Default: window.innerHeight or DEFAULT_PIN_DURATION */
  duration?: number;
  /** Offset from top of viewport to start pinning (in px). Default: 0 */
  topOffset?: number;
  /** Offset from bottom of viewport (in px). Default: 0 */
  bottomOffset?: number;
  /** Callback on pin progress (0.0 to 1.0) */
  onProgress?: (progress: number) => void;
  /** Disable writing translate3d transform (e.g. when using native CSS position: sticky). Default: false */
  disableTransform?: boolean;
}

export interface PinState {
  isPinned: boolean;
  progress: number;
  pinOffsetY: number;
}

export class PinSolver {
  private element: HTMLElement;
  private options: Required<PinOptions>;
  private elementTop: number = 0;
  private state: PinState = {
    isPinned: false,
    progress: 0,
    pinOffsetY: 0,
  };

  private detectClippingAncestor(el: HTMLElement): boolean {
    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function' || !el || !el.parentElement) {
      return false;
    }
    let parent: HTMLElement | null = el.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      try {
        const computed = window.getComputedStyle(parent);
        if (computed) {
          const overflow = (computed.overflow + computed.overflowY + computed.overflowX).toLowerCase();
          if (/(hidden|auto|scroll|clip)/.test(overflow)) {
            return true;
          }
        }
      } catch {
        break;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  constructor(element: HTMLElement, options?: PinOptions) {
    this.element = element;
    const rawDuration = options?.duration ?? (typeof window !== 'undefined' ? window.innerHeight : DEFAULT_PIN_DURATION);
    const hasClipping = this.detectClippingAncestor(element);
    const isSticky = typeof element?.style?.position === 'string' && element.style.position === 'sticky';

    this.options = {
      duration: Math.max(1, rawDuration),
      topOffset: options?.topOffset ?? 0,
      bottomOffset: options?.bottomOffset ?? 0,
      onProgress: options?.onProgress ?? (() => {}),
      // Default to native CSS sticky (disableTransform: true) when element is styled sticky and safe,
      // preventing translate3d containing block traps for position: fixed descendants
      disableTransform: options?.disableTransform ?? (isSticky && !hasClipping),
    };
    this.measure();
  }

  /**
   * Phase 1: Layout Read (batched to prevent reflows)
   */
  public measure(): void {
    if (typeof window === 'undefined') return;
    if (this.options.disableTransform && this.element?.style) {
      if (this.element.style.position !== 'sticky') {
        this.element.style.position = 'sticky';
        this.element.style.top = `${this.options.topOffset}px`;
      }
    }
    const rect = this.element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    // Current top position relative to document minus existing pin offset
    this.elementTop = rect.top + scrollTop - this.state.pinOffsetY;
  }

  /**
   * Phase 2: Compute pin progress and offset
   */
  public update(scrollY: number): PinState {
    const duration = Math.max(1, this.options.duration);
    const pinStart = this.elementTop - this.options.topOffset;
    const pinEnd = pinStart + duration;

    if (scrollY < pinStart) {
      // Above pin range
      this.state.isPinned = false;
      this.state.progress = 0;
      this.state.pinOffsetY = 0;
    } else if (scrollY >= pinStart && scrollY <= pinEnd) {
      // Inside active pin range
      this.state.isPinned = true;
      this.state.progress = clamp((scrollY - pinStart) / duration, 0, 1);
      this.state.pinOffsetY = scrollY - pinStart;
    } else {
      // Past pin range
      this.state.isPinned = false;
      this.state.progress = 1;
      this.state.pinOffsetY = duration;
    }

    this.options.onProgress(this.state.progress);
    return this.state;
  }

  public getBounds(): { startY: number; endY: number } {
    const pinStart = this.elementTop - this.options.topOffset;
    return {
      startY: pinStart,
      endY: pinStart + Math.max(1, this.options.duration),
    };
  }

  public clamp(boundaryProgress: number): void {
    const bounds = this.getBounds();
    if (boundaryProgress <= 0) {
      this.update(bounds.startY - 1);
    } else {
      this.update(bounds.endY + 1);
    }
    this.render();
  }

  /**
   * Phase 3: Direct GPU transform application
   */
  private lastRenderedOffsetY: number | null = null;

  public render(): void {
    if (this.options.disableTransform) return;
    if (this.lastRenderedOffsetY === this.state.pinOffsetY) return;
    this.lastRenderedOffsetY = this.state.pinOffsetY;

    if (this.state.pinOffsetY > 0) {
      TransformComposer.setNumeric(this.element, 'pin', {
        x: 0,
        y: this.state.pinOffsetY,
        z: 0,
      });
    } else {
      TransformComposer.clear(this.element, 'pin');
    }
  }

  public getState(): PinState {
    return this.state;
  }

  public destroy(): void {
    if (!this.options.disableTransform) {
      TransformComposer.clear(this.element, 'pin');
    } else if (this.element?.style && this.element.style.position === 'sticky') {
      this.element.style.position = '';
      this.element.style.top = '';
    }
  }
}
