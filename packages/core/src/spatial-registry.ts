/**
 * High-Performance Spatial Trigger Registry & Coordinate Precomputer
 * 
 * GSAP ScrollTrigger-style architecture for ScrollCraft:
 * Precomputes exact start and end scroll pixel coordinates during the batched
 * 'measure' phase. During active scroll ticks, evaluates progress purely mathematically
 * with ZERO DOM queries.
 * 
 * Strictly under 650 LOC.
 */

import { clamp } from './math';

export interface SpatialTriggerConfig {
  id: string;
  element: HTMLElement;
  /**
   * Start trigger specification:
   * e.g. 'top bottom' (top of element reaches bottom of viewport),
   * 'top center', 'center center', or a numeric pixel offset.
   */
  start?: string | number;
  /**
   * End trigger specification:
   * e.g. 'bottom top' (bottom of element reaches top of viewport),
   * '+=500' (500px after start), or a numeric pixel offset.
   */
  end?: string | number;
  onUpdate?: (progress: number, scrollY: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export interface SpatialTriggerState {
  config: SpatialTriggerConfig;
  startScroll: number;
  endScroll: number;
  distance: number;
  progress: number;
  isActive: boolean;
  hasEntered: boolean;
  hasLeft: boolean;
}

export class SpatialTriggerRegistry {
  private static instance: SpatialTriggerRegistry | null = null;
  private triggers: Map<string, SpatialTriggerState> = new Map();
  private sortedTriggers: SpatialTriggerState[] = [];
  private isDirty: boolean = true;
  private resizeObserver: ResizeObserver | null = null;
  private observedElements: Map<HTMLElement, number> = new Map();
  private refreshScheduled: boolean = false;
  private isListeningGlobal: boolean = false;

  private constructor() {}

  public static get(): SpatialTriggerRegistry {
    if (!SpatialTriggerRegistry.instance) {
      SpatialTriggerRegistry.instance = new SpatialTriggerRegistry();
    }
    return SpatialTriggerRegistry.instance;
  }

  private initObserver(): void {
    if (typeof window === 'undefined') return;

    if (!this.resizeObserver && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.scheduleRefresh();
      });
    }

    if (!this.isListeningGlobal) {
      this.isListeningGlobal = true;
      window.addEventListener('resize', this.scheduleRefresh, { passive: true });
      window.addEventListener('load', this.scheduleRefresh, { passive: true });
      if (typeof document !== 'undefined' && 'fonts' in document) {
        document.fonts.ready.then(() => {
          this.scheduleRefresh();
        }).catch(() => {});
      }
    }
  }

  public scheduleRefresh = (): void => {
    if (this.refreshScheduled || typeof window === 'undefined') return;
    this.refreshScheduled = true;
    requestAnimationFrame(() => {
      this.refreshScheduled = false;
      this.refresh();
    });
  };

  public register(config: SpatialTriggerConfig): () => void {
    this.initObserver();

    const state: SpatialTriggerState = {
      config,
      startScroll: 0,
      endScroll: 0,
      distance: 1,
      progress: 0,
      isActive: false,
      hasEntered: false,
      hasLeft: false,
    };

    this.triggers.set(config.id, state);
    this.isDirty = true;
    this.measureTrigger(state);

    if (config.element && this.resizeObserver) {
      const count = this.observedElements.get(config.element) ?? 0;
      if (count === 0) {
        try {
          this.resizeObserver.observe(config.element);
        } catch {}
      }
      this.observedElements.set(config.element, count + 1);
    }

    return () => {
      this.triggers.delete(config.id);
      this.isDirty = true;

      if (config.element && this.resizeObserver) {
        const count = this.observedElements.get(config.element) ?? 1;
        if (count <= 1) {
          try {
            this.resizeObserver.unobserve(config.element);
          } catch {}
          this.observedElements.delete(config.element);
        } else {
          this.observedElements.set(config.element, count - 1);
        }
      }
    };
  }

  private parseTriggerOffset(
    spec: string | number | undefined,
    rect: DOMRect,
    elementTopAbs: number,
    windowHeight: number,
    defaultSpec: string
  ): number {
    if (typeof spec === 'number') return spec;
    const safeSpec = spec && typeof spec === 'string' && spec.trim() ? spec.trim() : defaultSpec;

    if (safeSpec.startsWith('+=')) {
      return parseFloat(safeSpec.replace('+=', ''));
    }
    if (safeSpec.startsWith('-=')) {
      return -parseFloat(safeSpec.replace('-=', ''));
    }

    const parts = safeSpec.split(/\s+/);
    const elAlign = parts[0] || 'top';
    const vpAlign = parts[1] || 'bottom';

    let elOffset = 0;
    if (elAlign === 'center') elOffset = rect.height / 2;
    else if (elAlign === 'bottom') elOffset = rect.height;
    else if (elAlign.endsWith('%')) elOffset = rect.height * (parseFloat(elAlign) / 100);
    else if (elAlign.endsWith('px')) elOffset = parseFloat(elAlign);

    let vpOffset = 0;
    if (vpAlign === 'center') vpOffset = windowHeight / 2;
    else if (vpAlign === 'bottom') vpOffset = windowHeight;
    else if (vpAlign.endsWith('%')) vpOffset = windowHeight * (parseFloat(vpAlign) / 100);
    else if (vpAlign.endsWith('px')) vpOffset = parseFloat(vpAlign);

    return elementTopAbs + elOffset - vpOffset;
  }

  private measureTrigger(state: SpatialTriggerState): void {
    if (typeof window === 'undefined') return;
    const element = state.config.element;
    if (!element || !element.isConnected) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const elementTopAbs = rect.top + scrollTop;
    const windowHeight = window.innerHeight;

    state.startScroll = this.parseTriggerOffset(
      state.config.start,
      rect,
      elementTopAbs,
      windowHeight,
      'top bottom'
    );

    if (typeof state.config.end === 'string' && state.config.end.startsWith('+=')) {
      const delta = parseFloat(state.config.end.replace('+=', ''));
      state.endScroll = state.startScroll + delta;
    } else {
      state.endScroll = this.parseTriggerOffset(
        state.config.end,
        rect,
        elementTopAbs,
        windowHeight,
        'bottom top'
      );
    }

    state.distance = Math.max(1, state.endScroll - state.startScroll);
  }

  /**
   * Batched refresh pass: Re-measures all triggers in a single sequential layout pass.
   * Called on window resize, font loading, or layout shift.
   */
  public refresh(): void {
    if (typeof window === 'undefined') return;

    for (const state of this.triggers.values()) {
      this.measureTrigger(state);
    }

    this.sortedTriggers = Array.from(this.triggers.values()).sort(
      (a, b) => a.startScroll - b.startScroll
    );
    this.isDirty = false;
  }

  /**
   * Pure mathematical progress evaluation: ZERO DOM reads.
   * Runs at 60/120 FPS without layout thrashing.
   */
  public update(scrollY: number): void {
    if (this.isDirty) {
      this.refresh();
    }

    const total = this.sortedTriggers.length;
    for (let i = 0; i < total; i++) {
      const state = this.sortedTriggers[i];
      const start = state.startScroll;
      const end = state.endScroll;

      let progress: number;
      let isActive: boolean;

      if (scrollY < start) {
        progress = 0;
        isActive = false;
        if (state.hasEntered) {
          state.hasEntered = false;
          state.config.onLeaveBack?.();
        }
      } else if (scrollY > end) {
        progress = 1;
        isActive = false;
        if (!state.hasLeft) {
          state.hasLeft = true;
          state.config.onLeave?.();
        }
      } else {
        progress = clamp((scrollY - start) / state.distance, 0, 1);
        isActive = true;
        if (!state.hasEntered) {
          state.hasEntered = true;
          state.config.onEnter?.();
        }
        if (state.hasLeft) {
          state.hasLeft = false;
          state.config.onEnterBack?.();
        }
      }

      state.progress = progress;
      state.isActive = isActive;
      state.config.onUpdate?.(progress, scrollY);
    }
  }

  public getTrigger(id: string): SpatialTriggerState | undefined {
    return this.triggers.get(id);
  }

  public clear(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.observedElements.clear();
    this.triggers.clear();
    this.sortedTriggers = [];
    this.isDirty = false;
  }

  public destroy(): void {
    this.clear();
    if (this.isListeningGlobal && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.scheduleRefresh);
      window.removeEventListener('load', this.scheduleRefresh);
      this.isListeningGlobal = false;
    }
  }
}

export const spatialRegistry = /* @__PURE__ */ SpatialTriggerRegistry.get();
