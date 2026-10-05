/**
 * 120 FPS Direct DOM Text Reveal Solver
 * GSAP-grade kinetic typographic wave solver with active-window staggered scheduling,
 * dynamic compositor layer de-promotion, and zero object allocation in RAF.
 * Strictly under 650 LOC.
 */

import { mapRange, clamp, lerp } from './math';
import { TransformComposer } from './dom';
import { adaptiveQualityGovernor } from './adaptive-quality';
import { PerformanceTier } from './types';

export interface TextRevealOptions {
  /**
   * Typographic reveal mode:
   * - 'kinetic' (default): Pure entrance animation. Unrevealed text is strictly 0% opacity.
   * - 'reading': Apple/Linear read-through prompter. Unread text is crisp muted gray (default 0.2).
   */
  mode?: 'kinetic' | 'reading';
  /** Offset start and end progress (0 to 1) relative to container viewport intersection */
  range?: [number, number];
  /** Atmospheric blur reveal in px (e.g. 8 or true for 8px). Default: 0 (disabled) */
  blur?: boolean | number;
  /** Entry scale factor (e.g. 0.9). Default: 1 (disabled) */
  scale?: number;
  /** 3D entry tilt on X axis in degrees. Default: 0 (disabled) */
  rotateX?: number;
  /** 3D entry tilt on Y axis in degrees. Default: 0 (disabled) */
  rotateY?: number;
  /** Entry slide distance in pixels. Default: 0 (disabled) */
  slide?: number;
  /** Initial base opacity for unrevealed characters (0 to 1). Default: 0 */
  baseOpacity?: number;
  /** Viewport trigger start fraction from top of viewport (e.g. 0.85 = 85% of window height). Default: 0.85 */
  triggerStart?: number;
  /** Viewport trigger end fraction from top of viewport (e.g. 0.15 = 15% of window height). Default: 0.15 */
  triggerEnd?: number;
  /** String trigger start (e.g. 'top 85%') */
  start?: string;
  /** String trigger end (e.g. 'top 15%') */
  end?: string;
  /** Automatically play entrance animation on mount without requiring scroll (ideal for hero sections) */
  playOnMount?: boolean | { delay?: number; duration?: number; stagger?: number };
}

export class TextRevealSolver {
  private container: HTMLElement;
  private chars: HTMLElement[];
  private options: TextRevealOptions;
  private range: [number, number];
  private containerTop = 0;
  private containerHeight = 0;
  private stickyContainer: HTMLElement | null = null;
  private stickyStartScroll: number = 0;
  private stickyRunwayDistance: number = 0;
  private cachedWindowHeight: number = 800;

  // Auto-play on mount state
  private isPlayOnMountActive: boolean = false;
  private autoPlayProgress: number = 0;
  private autoPlayRafId: number | null = null;
  private autoPlayTimerId: ReturnType<typeof setTimeout> | null = null;

  // Initial styles preserved for pristine cleanup on destroy
  private initialOpacities: string[] = [];
  private initialFilters: string[] = [];
  private initialTransforms: string[] = [];
  private initialWillChanges: string[] = [];

  // Kinetic animation options
  private maxBlur: number = 0;
  private effectiveMaxBlur: number = 0;
  private entryScale: number = 1;
  private entryRotateX: number = 0;
  private entryRotateY: number = 0;
  private entrySlide: number = 0;
  private baseOpacity: number = 0;
  private baseOpacityStr: string = '0';
  private hasKineticTransforms: boolean = false;

  // Stagger wave parameters
  private itemStarts: Float32Array = new Float32Array(0);
  private itemDurations: Float32Array = new Float32Array(0);

  // Per-character GSAP-style lifecycle state:
  // 0 = unstarted (at rest before scroll), 1 = actively transitioning, 2 = settled finished
  private charStatus: Uint8Array = new Uint8Array(0);
  private charProgress: Float32Array = new Float32Array(0);
  private lastCharProgress: Float32Array = new Float32Array(0);

  // Frame execution state
  private isSettled: boolean = false;
  private lastScrollY: number = -1;
  private currentProgress: number = -1;
  private dirtyIndices: number[] = [];
  private lastTier: PerformanceTier | null = null;

  constructor(container: HTMLElement, chars: HTMLElement[], options: TextRevealOptions = {}) {
    this.container = container;
    this.chars = chars;
    this.options = options;
    this.range = options.range || [0, 1];
    const mode = options.mode ?? 'kinetic';
    if (mode === 'kinetic') {
      this.baseOpacity = options.baseOpacity !== undefined ? options.baseOpacity : 0;
    } else {
      this.baseOpacity = options.baseOpacity !== undefined ? options.baseOpacity : 0.2;
    }
    this.baseOpacityStr = this.baseOpacity === 0 ? '0' : String(this.baseOpacity);

    // Capture initial inline styles for exact restoration on destroy
    const len = chars.length;
    this.initialOpacities = new Array(len);
    this.initialFilters = new Array(len);
    this.initialTransforms = new Array(len);
    this.initialWillChanges = new Array(len);
    for (let i = 0; i < len; i++) {
      const c = chars[i];
      this.initialOpacities[i] = c?.style?.opacity || '';
      this.initialFilters[i] = c?.style?.filter || '';
      this.initialTransforms[i] = c?.style?.transform || '';
      this.initialWillChanges[i] = c?.style?.willChange || '';
    }

    // State Transition: Immediately signal active hydration to cancel CSS fallback keyframes
    if (this.container && typeof this.container.setAttribute === 'function') {
      this.container.setAttribute('data-sc-reveal', 'active');
    }

    if (options.blur) {
      this.maxBlur = typeof options.blur === 'number' ? options.blur : 8;
    }
    if (options.scale !== undefined && options.scale !== 1) {
      this.entryScale = options.scale;
      this.hasKineticTransforms = true;
    }
    if (options.rotateX) {
      this.entryRotateX = options.rotateX;
      this.hasKineticTransforms = true;
    }
    if (options.rotateY) {
      this.entryRotateY = options.rotateY;
      this.hasKineticTransforms = true;
    }
    if (options.slide) {
      this.entrySlide = options.slide;
      this.hasKineticTransforms = true;
    }

    this.initStaggerTimings();

    this.applyInitialStyles();

    // Synchronous layout capture so containerTop is never 0 on mount
    if (typeof window !== 'undefined' && this.container) {
      this.measure();
    }

    if (options.playOnMount) {
      this.initPlayOnMount();
    }
  }

  private applyInitialStyles(): void {
    const len = this.chars.length;
    for (let i = 0; i < len; i++) {
      const char = this.chars[i];
      if (!char || !char.style) continue;
      char.style.opacity = this.baseOpacityStr;
      // Invariant: Unstarted text NEVER carries a static blur filter!
      // Blur is strictly a dynamic optical effect during the active wave (0 < p < 1).
      if (char.style.filter !== '') {
        char.style.filter = '';
      }
      if (this.hasKineticTransforms) {
        let tStr = '';
        if (this.entrySlide) tStr += `translate3d(0,${this.entrySlide.toFixed(1)}px,0) `;
        if (this.entryScale !== 1) tStr += `scale(${this.entryScale.toFixed(3)}) `;
        if (this.entryRotateX) tStr += `rotateX(${this.entryRotateX.toFixed(1)}deg) `;
        if (this.entryRotateY) tStr += `rotateY(${this.entryRotateY.toFixed(1)}deg) `;
        tStr = tStr.trim();
        if (tStr) char.style.transform = tStr;
      }
    }
  }

  private initPlayOnMount(): void {
    if (!this.options.playOnMount || typeof window === 'undefined') return;
    this.isPlayOnMountActive = true;
    this.autoPlayProgress = 0;

    const config = typeof this.options.playOnMount === 'object' ? this.options.playOnMount : {};
    const delay = (config.delay ?? 0.1) * 1000;
    const duration = (config.duration ?? 0.9) * 1000;

    this.autoPlayTimerId = setTimeout(() => {
      let startTime: number | null = null;
      const step = (now: number) => {
        if (!this.isPlayOnMountActive) return;
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const p = clamp(elapsed / duration, 0, 1);
        this.autoPlayProgress = p;
        this.update(window.scrollY || 0, window.innerHeight || 800);
        this.render();

        if (p < 1) {
          this.autoPlayRafId = requestAnimationFrame(step);
        } else {
          this.isSettled = true;
        }
      };
      this.autoPlayRafId = requestAnimationFrame(step);
    }, delay);
  }

  /**
   * Initializes GSAP-grade proportional stagger wave timings.
   * Dynamically bounds concurrent active spans to an optimal 4-16 window
   * regardless of total characters, avoiding GPU layer explosion.
   */
  private initStaggerTimings(): void {
    const N = this.chars.length;
    this.itemStarts = new Float32Array(N);
    this.itemDurations = new Float32Array(N);
    this.charStatus = new Uint8Array(N);
    this.charProgress = new Float32Array(N);
    this.lastCharProgress = new Float32Array(N);

    if (N === 0) return;
    if (N === 1) {
      this.itemStarts[0] = 0;
      this.itemDurations[0] = 1;
      return;
    }

    // Bounded concurrency K: 4 for few words, scaling up to max 16 for hundreds of chars
    const K = clamp(Math.round(Math.sqrt(N) * 1.2), 3, 16);
    const itemDuration = K / (N - 1 + K);
    const step = (1 - itemDuration) / (N - 1);

    for (let i = 0; i < N; i++) {
      this.itemStarts[i] = i * step;
      this.itemDurations[i] = itemDuration;
      this.charStatus[i] = 0;
      this.lastCharProgress[i] = -1;
    }
  }

  /** Phase 1: capture layout once during measure, never while calculating frame styles. */
  public measure(): void {
    this.isSettled = false;
    this.dirtyIndices.length = 0;
    this.lastScrollY = -1;

    if (typeof window === 'undefined' || !this.container) return;
    this.cachedWindowHeight = window.innerHeight;
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const rect = this.container.getBoundingClientRect();
    this.containerTop = rect.top + scrollTop;
    this.containerHeight = this.container.offsetHeight || rect.height || 0;

    // Detect sticky parent container
    let el: HTMLElement | null = this.container;
    let stickyEl: HTMLElement | null = null;
    const doc = typeof document !== 'undefined' ? document : null;

    while (el && (!doc || (el !== doc.body && el !== doc.documentElement))) {
      const pos =
        el.style?.position ||
        (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function'
          ? window.getComputedStyle(el)?.position
          : '');
      if (pos === 'sticky') {
        stickyEl = el;
        break;
      }
      el = el.parentElement;
    }

    this.stickyContainer = stickyEl;

    if (stickyEl && stickyEl.parentElement) {
      const parent = stickyEl.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const parentTop = parentRect.top + scrollTop;
      const parentHeight = parent.offsetHeight || parentRect.height || 0;
      const stickyHeight = stickyEl.offsetHeight || stickyEl.getBoundingClientRect().height || 0;

      const computedTop =
        typeof window.getComputedStyle === 'function'
          ? parseFloat(window.getComputedStyle(stickyEl).top) || 0
          : 0;

      this.stickyStartScroll = parentTop + stickyEl.offsetTop - computedTop;
      this.stickyRunwayDistance = Math.max(0, parentHeight - stickyHeight);
    }

    // Reset character tracking states on measure/resize
    const N = this.chars.length;
    for (let i = 0; i < N; i++) {
      this.charStatus[i] = 0;
      this.lastCharProgress[i] = -1;
    }
  }

  /** Phase 2: calculate staggered progress and dirty spans without DOM reads or writes. */
  public update(_scrollY: number, windowHeight?: number, velocity?: number): void {
    const totalChars = this.chars.length;
    if (!this.container || totalChars === 0) return;

    const vh = windowHeight || this.cachedWindowHeight;

    // Detect scroll reversal
    const isScrollingUp =
      (velocity !== undefined && velocity < 0) ||
      (_scrollY < this.lastScrollY && this.lastScrollY >= 0);

    let progress = 0;

    if (this.isPlayOnMountActive) {
      progress = this.autoPlayProgress;
    } else if (this.stickyContainer && this.stickyRunwayDistance > 100) {
      const runwayProgress = (_scrollY - this.stickyStartScroll) / this.stickyRunwayDistance;
      progress = clamp(runwayProgress, 0, 1);
    } else {
      const triggerStart = this.options.triggerStart ?? 0.85;
      const triggerEnd = this.options.triggerEnd ?? 0.15;

      const start = vh * triggerStart;
      const end = vh * triggerEnd;

      // Hero / Initial Viewport Auto-Detection:
      // If element starts inside viewport on load (containerTop < start),
      // scroll progress strictly starts at scrollY = 0 so no words are pre-revealed!
      if (this.containerTop < start) {
        const scrollDistance = Math.max(vh * 0.45, (this.containerTop - end) + this.containerHeight);
        const rawProgress = scrollDistance > 0 ? _scrollY / scrollDistance : 1;
        progress = clamp(rawProgress, 0, 1);
      } else {
        const viewportTop = this.containerTop - _scrollY;
        const rawProgress = mapRange(start, end, 0, 1, viewportTop);
        progress = clamp(rawProgress, 0, 1);
      }
    }

    if (this.range[0] !== 0 || this.range[1] !== 1) {
      progress = clamp(mapRange(this.range[0], this.range[1], 0, 1, progress), 0, 1);
    }

    if (progress < 1.0 || isScrollingUp) {
      this.isSettled = false;
    }

    // Settled gate: Once fully revealed (progress >= 1.0) and not reversing, skip entirely
    if (this.isSettled && progress >= 1.0 && !isScrollingUp) {
      this.lastScrollY = _scrollY;
      return;
    }

    this.lastScrollY = _scrollY;
    this.currentProgress = progress;

    const currentTier = adaptiveQualityGovernor.getTier();
    const tierChanged = currentTier !== this.lastTier;
    this.lastTier = currentTier;
    this.effectiveMaxBlur = adaptiveQualityGovernor.clampBlur(this.maxBlur);

    this.dirtyIndices.length = 0;

    // GSAP-style staggered active-window evaluation
    for (let i = 0; i < totalChars; i++) {
      const start = this.itemStarts[i];
      const dur = this.itemDurations[i];

      let p = 0;
      if (progress >= 1 || progress >= start + dur - 0.0001) {
        p = 1;
      } else if (progress <= 0 || progress <= start + 0.0001) {
        p = 0;
      } else {
        p = clamp((progress - start) / dur, 0, 1);
        if (p >= 0.999) p = 1;
        else if (p <= 0.001) p = 0;
      }

      this.charProgress[i] = p;

      // Status gating:
      // status 2 = already rendered at p=1 (settled high)
      // status 0 = already rendered at p=0 (unstarted)
      // status 1 = actively transitioning (0 < p < 1)
      const prevStatus = this.charStatus[i];

      if (p >= 1) {
        if (prevStatus === 2 && !tierChanged) {
          // Already settled at 1 and rendered — zero math, zero writes!
          continue;
        }
        this.charStatus[i] = 2;
        this.dirtyIndices.push(i);
      } else if (p <= 0) {
        if (prevStatus === 0 && !tierChanged) {
          // Already unstarted at 0 and rendered — zero math, zero writes!
          continue;
        }
        this.charStatus[i] = 0;
        this.dirtyIndices.push(i);
      } else {
        this.charStatus[i] = 1;
        // In active transition: write when progress advances by perceptible threshold
        const lastP = this.lastCharProgress[i];
        if (tierChanged || prevStatus !== 1 || Math.abs(p - lastP) > 0.003) {
          this.dirtyIndices.push(i);
        }
      }
    }
  }

  /** Phase 3: write values calculated in update to DOM. */
  public render(): void {
    const dirtyCount = this.dirtyIndices.length;
    if (dirtyCount === 0) {
      if (this.currentProgress >= 1.0) {
        this.isSettled = true;
      }
      return;
    }

    const hasBlur = this.effectiveMaxBlur > 0;

    for (let d = 0; d < dirtyCount; d++) {
      const i = this.dirtyIndices[d];
      const char = this.chars[i];
      if (!char) continue;

      const p = this.charProgress[i];
      this.lastCharProgress[i] = p;

      // 1. Opacity
      if (p >= 1) {
        if (char.style.opacity !== '1') char.style.opacity = '1';
      } else if (p <= 0) {
        if (char.style.opacity !== this.baseOpacityStr) char.style.opacity = this.baseOpacityStr;
      } else {
        const op = clamp(mapRange(0, 1, this.baseOpacity, 1, p), this.baseOpacity, 1);
        const opStr =
          op >= 0.995
            ? '1'
            : op <= this.baseOpacity + 0.005
            ? this.baseOpacityStr
            : (Math.round(op * 100) / 100).toFixed(2);
        if (char.style.opacity !== opStr) char.style.opacity = opStr;
      }

      // 2. Atmospheric Blur (strictly active during entrance wave 0 < p < 1)
      if (hasBlur && p > 0 && p < 1) {
        const currentBlur = lerp(this.effectiveMaxBlur, 0, p);
        const blurStr = currentBlur > 0.4 ? `blur(${currentBlur.toFixed(1)}px)` : '';
        if (char.style.filter !== blurStr) char.style.filter = blurStr;
      } else if (char.style.filter !== '') {
        char.style.filter = '';
      }

      // 3. Kinetic Transforms (3D Tilt, Scale & Slide)
      if (this.hasKineticTransforms) {
        if (p >= 1) {
          // Settled at 1: clear inline transform completely!
          // This allows the browser to immediately de-promote the span from a GPU compositor layer.
          if (char.style.transform !== '') char.style.transform = '';
        } else {
          let tStr = '';
          if (this.entrySlide) {
            const y = lerp(this.entrySlide, 0, p);
            if (Math.abs(y) > 0.05) tStr += `translate3d(0,${y.toFixed(1)}px,0) `;
          }
          if (this.entryScale !== 1) {
            const s = lerp(this.entryScale, 1, p);
            if (Math.abs(s - 1) > 0.002) tStr += `scale(${s.toFixed(3)}) `;
          }
          if (this.entryRotateX) {
            const rx = lerp(this.entryRotateX, 0, p);
            if (Math.abs(rx) > 0.05) tStr += `rotateX(${rx.toFixed(1)}deg) `;
          }
          if (this.entryRotateY) {
            const ry = lerp(this.entryRotateY, 0, p);
            if (Math.abs(ry) > 0.05) tStr += `rotateY(${ry.toFixed(1)}deg) `;
          }
          tStr = tStr.trim();
          if (char.style.transform !== tStr) {
            char.style.transform = tStr;
          }
        }
      }

      // 4. GSAP-style dynamic will-change management:
      // Only active spans in the wave have will-change set. Settled spans have it removed.
      if (p > 0.001 && p < 0.999) {
        if (char.style.willChange !== 'opacity, transform') {
          char.style.willChange = 'opacity, transform';
        }
      } else if (char.style.willChange !== '') {
        char.style.willChange = '';
      }
    }

    this.dirtyIndices.length = 0;

    if (this.currentProgress >= 1.0) {
      this.isSettled = true;
    }
  }

  public getSettled(): boolean {
    return this.isSettled;
  }

  public destroy(): void {
    this.isPlayOnMountActive = false;
    if (this.autoPlayRafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.autoPlayRafId);
      this.autoPlayRafId = null;
    }
    if (this.autoPlayTimerId !== null) {
      clearTimeout(this.autoPlayTimerId);
      this.autoPlayTimerId = null;
    }

    if (this.container && typeof this.container.removeAttribute === 'function') {
      this.container.removeAttribute('data-sc-reveal');
    }
    this.chars.forEach((char, i) => {
      char.style.opacity = this.initialOpacities[i] ?? '';
      char.style.filter = this.initialFilters[i] ?? '';
      char.style.transform = this.initialTransforms[i] ?? '';
      char.style.willChange = this.initialWillChanges[i] ?? '';
      TransformComposer.clear(char, 'text-reveal');
    });
    this.isSettled = false;
    this.dirtyIndices.length = 0;
    const N = this.chars.length;
    for (let i = 0; i < N; i++) {
      this.charStatus[i] = 0;
      this.lastCharProgress[i] = -1;
    }
  }
}
