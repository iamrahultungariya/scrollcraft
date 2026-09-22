/**
 * Horizontal Scroll Section Solver for ScrollCraft
 * Maps vertical scroll progress to horizontal translation.
 * Uses native view-timeline when supported.
 * Strictly under 650 LOC.
 */

import { ScrollDriver, DriverState } from './driver';
import { clamp } from './math';
import { Capabilities } from './feature-detection';
import { injectNativeStyles } from './native-styles';
import { TransformComposer } from './dom';
import { motionStore } from './motion-preference';

export interface HorizontalScrollOptions {
  /** Scroll speed multiplier (default: 1). Higher speed scrolls through horizontal track faster over less vertical distance. */
  speed?: number;
  driver?: 'auto' | 'native' | 'js';
}

export interface HorizontalState extends DriverState {
  progress: number;
  offset: number;
}

class JSHorizontalDriver implements ScrollDriver {
  private state: HorizontalState = { progress: 0, offset: 0 };
  private elementTop: number = 0;
  private maxScrollDistance: number = 0;
  private effectiveScrollDistance: number = 0;
  private trackWidth: number = 0;
  private windowHeight: number = 0;

  constructor(
    private element: HTMLElement,
    private innerContainer: HTMLElement,
    private options: Required<HorizontalScrollOptions>
  ) {}

  public measure(): void {
    if (typeof window === 'undefined') return;
    
    // The outer element is pinned (sticky). Its height dictates how long we scroll.
    const rect = this.element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    
    this.elementTop = rect.top + scrollTop;
    this.windowHeight = window.innerHeight;
    
    // Total scrollable distance for this section is outer height - window height
    this.maxScrollDistance = Math.max(1, rect.height - this.windowHeight);
    const speed = Math.max(0.001, this.options.speed || 1);
    this.effectiveScrollDistance = Math.max(1, this.maxScrollDistance / speed);
    
    // Width of the inner content that will slide left, bounded by the visible viewport container width
    const viewportWidth =
      this.innerContainer.parentElement?.clientWidth ||
      this.element.clientWidth ||
      (typeof window !== 'undefined' ? window.innerWidth : 0);
    this.trackWidth = Math.max(0, this.innerContainer.scrollWidth - viewportWidth);
  }

  public update(scrollY: number): HorizontalState {
    if (this.effectiveScrollDistance <= 0) return this.state;

    // Progress 0.0 to 1.0 based on how far we scrolled past the element's top
    const scrolledPastTop = scrollY - this.elementTop;
    let progress = clamp(scrolledPastTop / this.effectiveScrollDistance, 0, 1);

    this.state.progress = progress;
    this.state.offset = -(progress * this.trackWidth);

    return this.state;
  }

  public render(): void {
    if (motionStore.isReduced()) {
      TransformComposer.setNumeric(this.innerContainer, 'horizontal', { x: 0, y: 0, z: 0 });
      return;
    }
    TransformComposer.setNumeric(this.innerContainer, 'horizontal', {
      x: this.state.offset,
      y: 0,
      z: 0,
    });
  }

  public getState(): HorizontalState {
    return this.state;
  }

  public destroy(): void {
    TransformComposer.clear(this.innerContainer, 'horizontal');
  }
}

class NativeHorizontalDriver implements ScrollDriver {
  private state: HorizontalState = { progress: 0, offset: 0 };
  private elementTop: number = 0;
  private maxScrollDistance: number = 0;
  private effectiveScrollDistance: number = 0;
  private trackWidth: number = 0;
  private animationName: string;
  private onLayoutShift = (): void => {
    this.measure();
  };

  constructor(
    private element: HTMLElement,
    private innerContainer: HTMLElement,
    private options: Required<HorizontalScrollOptions>
  ) {
    injectNativeStyles();
    
    // Unique animation identifier per instance to prevent multi-section style collisions
    const id = Math.random().toString(36).slice(2, 8);
    this.animationName = `sc-horizontal-slide-${id}`;

    // Bind directly to the document-level named scroll-timeline (--sc-doc-scroll)
    // This provides 100% immunity to any intermediate overflow: hidden ancestor clipping
    this.innerContainer.classList?.add('sc-horizontal-target');
    this.innerContainer.style.animationTimeline = '--sc-doc-scroll';
    this.innerContainer.style.animationName = this.animationName;
    this.innerContainer.style.animationFillMode = 'both';
    this.innerContainer.style.animationTimingFunction = 'linear';
    this.innerContainer.style.willChange = 'transform';

    // Auto-remeasure upon late font readiness, image loads, and window resizing
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('load', this.onLayoutShift, { passive: true });
      window.addEventListener('resize', this.onLayoutShift, { passive: true });
    }
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (this.element.isConnected) {
          this.measure();
        }
      });
    }
  }

  public setVisible(_visible: boolean): void {
    // Native driver managed by compositor
  }

  public measure(): void {
    if (typeof window === 'undefined') return;
    
    const rect = this.element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    
    this.elementTop = rect.top + scrollTop;
    const viewportWidth =
      this.innerContainer.parentElement?.clientWidth ||
      this.element.clientWidth ||
      (typeof window !== 'undefined' ? window.innerWidth : 0);
    this.trackWidth = Math.max(0, this.innerContainer.scrollWidth - viewportWidth);
    
    const speed = Math.max(0.001, this.options.speed || 1);
    this.maxScrollDistance = Math.max(1, rect.height - window.innerHeight);
    this.effectiveScrollDistance = Math.max(1, this.maxScrollDistance / speed);

    const startScroll = this.elementTop;
    const endScroll = this.elementTop + this.maxScrollDistance;
    this.innerContainer.style.animationRange = `${startScroll.toFixed(2)}px ${endScroll.toFixed(2)}px`;

    const styleId = `sc-horizontal-style-${this.animationName}`;
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    this.innerContainer.style.setProperty('--sc-slide-end', `-${this.trackWidth}px`);
    
    let keyframes = '';
    if (speed >= 1) {
      const stopPercent = (100 / speed).toFixed(3);
      keyframes = `
        @media (prefers-reduced-motion: no-preference) {
          @keyframes ${this.animationName} {
            0% { transform: translate3d(0px, 0, 0); }
            ${stopPercent}%, 100% { transform: translate3d(var(--sc-slide-end, 0px), 0, 0); }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ${this.animationName} {
            0%, 100% { transform: none; }
          }
        }
      `;
    } else {
      keyframes = `
        @media (prefers-reduced-motion: no-preference) {
          @keyframes ${this.animationName} {
            0% { transform: translate3d(0px, 0, 0); }
            100% { transform: translate3d(calc(var(--sc-slide-end, 0px) * ${speed.toFixed(3)}), 0, 0); }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ${this.animationName} {
            0%, 100% { transform: none; }
          }
        }
      `;
    }
    styleEl.textContent = keyframes;
  }

  public update(scrollY: number): HorizontalState {
    const scrolledPastTop = scrollY - this.elementTop;
    const progress = clamp(scrolledPastTop / this.effectiveScrollDistance, 0, 1);
    this.state.progress = progress;
    this.state.offset = -(progress * this.trackWidth);
    return this.state;
  }

  public render(): void {}
  public getState(): HorizontalState { return this.state; }
  
  public destroy(): void {
    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('load', this.onLayoutShift);
      window.removeEventListener('resize', this.onLayoutShift);
    }
    this.innerContainer.classList?.remove('sc-horizontal-target');
    this.innerContainer.style.animationTimeline = '';
    this.innerContainer.style.animationRange = '';
    this.innerContainer.style.animationName = '';
    this.innerContainer.style.animationFillMode = '';
    this.innerContainer.style.willChange = '';
    this.innerContainer.style.removeProperty('--sc-slide-end');
    if (typeof document !== 'undefined') {
      const styleEl = document.getElementById(`sc-horizontal-style-${this.animationName}`);
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    }
  }
}

export class HorizontalScrollSolver {
  private driver: ScrollDriver;

  constructor(element: HTMLElement, innerContainer: HTMLElement, options?: HorizontalScrollOptions) {
    const opts: Required<HorizontalScrollOptions> = {
      speed: options?.speed ?? 1,
      driver: options?.driver ?? 'auto',
    };

    // Note: Horizontal sections define explicit named viewTimelineName on their sticky root container
    // rather than using anonymous view() timelines, so they are not subject to intermediate clipping.
    // 'native' explicitly requests Native driver; 'auto' uses NativeHorizontalDriver when supported and falls back safely.
    const useNative =
      opts.driver === 'native' || (opts.driver === 'auto' && Capabilities.get().isNativeReady);

    if (useNative) {
      try {
        this.driver = new NativeHorizontalDriver(element, innerContainer, opts);
      } catch (err) {
        if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
          console.warn('[ScrollCraft] NativeHorizontalDriver failed to initialize, falling back to JS driver:', err);
        }
        this.driver = new JSHorizontalDriver(element, innerContainer, opts);
      }
    } else {
      this.driver = new JSHorizontalDriver(element, innerContainer, opts);
    }
    
    this.measure();
  }

  public measure(): void { this.driver.measure(); }
  public update(scrollY: number): HorizontalState { return this.driver.update(scrollY) as HorizontalState; }
  public render(): void { this.driver.render(); }
  public getState(): HorizontalState { return this.driver.getState() as HorizontalState; }
  public destroy(): void { this.driver.destroy(); }
}
