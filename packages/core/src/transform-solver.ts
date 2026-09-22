import { clamp, damp, calculateVelocitySnapTarget } from './math';
import { TimelineSolver, PropertyTimeline, KeyframeSegment } from './timeline';
import { TransformComposer } from './dom';
import { triggerRegistry } from './markers';
import { styleRegistry } from './style-registry';
import { compileTrigger, CompiledTrigger } from './trigger-compiler';
import { adaptiveQualityGovernor } from './adaptive-quality';
import { PerformanceTier } from './types';

export interface TransformProperties {
  x?: [number, number] | number[];
  y?: [number, number] | number[];
  z?: [number, number] | number[];
  scale?: [number, number] | number[];
  scaleX?: [number, number] | number[];
  scaleY?: [number, number] | number[];
  rotate?: [number, number] | number[];
  rotateX?: [number, number] | number[];
  rotateY?: [number, number] | number[];
  rotateZ?: [number, number] | number[];
  skewX?: [number, number] | number[];
  skewY?: [number, number] | number[];
  opacity?: [number, number] | number[];
  blur?: [number, number] | number[];
  borderRadius?: [number, number] | number[];
}

export interface TransformSolverOptions {
  id?: string;
  markers?: boolean;
  start?: string; // 'top bottom', 'center center', etc.
  end?: string;
  properties: TransformProperties;
  scrub?: boolean | number;
  snap?: boolean;
  onSnap?: (targetScroll: number) => void;
}

export class TransformSolver {
  private element: HTMLElement;
  private options: TransformSolverOptions;
  public readonly id: string;
  
  public startY: number = 0;
  public endY: number = 0;

  public getBounds(): { startY: number; endY: number } {
    return { startY: this.startY, endY: this.endY };
  }
  
  private progress: number = 0;
  private targetProgress: number = 0;
  
  private timeline: PropertyTimeline = {};
  private currentValues: Record<string, number> = {};
  private targetValues: Record<string, number> = {};
  
  private isVisible: boolean = false;
  private wasVisible: boolean = false;

  private snapTimeout: number | null = null;
  private startTriggerCompiled: CompiledTrigger;
  private endTriggerCompiled: CompiledTrigger;

  constructor(element: HTMLElement, options: TransformSolverOptions) {
    this.element = element;
    this.id = options.id || (`transform-${Math.random().toString(36).slice(2, 8)}`);
    this.options = {
      ...options,
      start: options.start ?? 'top bottom',
      end: options.end ?? 'bottom top',
    };
    
    this.startTriggerCompiled = compileTrigger(this.options.start);
    this.endTriggerCompiled = compileTrigger(this.options.end);
    this.buildTimeline();
  }

  private buildTimeline() {
    for (const [key, values] of Object.entries(this.options.properties)) {
      if (!values || values.length < 2) continue;
      
      const segments: KeyframeSegment[] = [];
      const step = 1 / (values.length - 1);
      
      for (let i = 0; i < values.length - 1; i++) {
        segments.push({
          from: i * step,
          to: (i + 1) * step,
          startValue: values[i] as number,
          endValue: values[i + 1] as number,
        });
      }
      this.timeline[key] = segments;
      this.currentValues[key] = values[0] as number;
      this.targetValues[key] = values[0] as number;
    }
  }

  public measure(): void {
    if (typeof window === 'undefined') return;
    
    // Clear transform for accurate measurement
    const prevTransform = this.element.style.transform;
    this.element.style.transform = '';
    
    const rect = this.element.getBoundingClientRect();
    const wh = window.innerHeight;
    const scrollTop = window.scrollY ?? window.pageYOffset ?? 0;
    
    this.startY = this.startTriggerCompiled.evaluate(rect, wh, scrollTop);
    this.endY = this.endTriggerCompiled.evaluate(rect, wh, scrollTop);
    
    if (this.options.end?.startsWith('+=')) {
        this.endY = this.startY + parseFloat(this.options.end.replace('+=', ''));
    }
    
    // Restore transform
    this.element.style.transform = prevTransform;

    triggerRegistry.register({
      id: this.id,
      type: 'transform',
      element: this.element,
      startTrigger: this.options.start || 'top bottom',
      endTrigger: this.options.end || 'bottom top',
      startY: this.startY,
      endY: this.endY,
      progress: this.progress,
      markers: this.options.markers,
    });
  }

  public update(scrollY: number, velocity: number, dt: number, isReducedMotion: boolean = false): void {
    if (this.startY === this.endY) return;
    
    // Calculate raw progress
    let rawProgress = (scrollY - this.startY) / (this.endY - this.startY);
    rawProgress = clamp(rawProgress, 0, 1);
    
    this.targetProgress = rawProgress;
    
    // Velocity-aware kinetic snap release
    if (this.options.snap && this.options.onSnap) {
      const snapPoints = [this.startY, this.endY];
      const targetScroll = calculateVelocitySnapTarget(scrollY, velocity, snapPoints, {
        releaseThreshold: 120,
        inertiaHorizon: 0.2,
        minBound: this.startY,
        maxBound: this.endY,
      });

      if (targetScroll !== null && rawProgress > 0 && rawProgress < 1) {
        if (!this.snapTimeout) {
          this.snapTimeout = window.setTimeout(() => {
            this.options.onSnap!(targetScroll);
            this.snapTimeout = null;
          }, 100);
        }
      } else if (this.snapTimeout) {
        window.clearTimeout(this.snapTimeout);
        this.snapTimeout = null;
      }
    }
    
    if (isReducedMotion) {
      this.progress = 1;
      this.targetValues = TimelineSolver.evaluateTimeline(this.timeline, 1, this.targetValues);
      Object.assign(this.currentValues, this.targetValues);
      return;
    }
    
    // Scrub damping: damp progress once to preserve timeline keyframe coherence and prevent lag
    const scrub = this.options.scrub;
    if (typeof scrub === 'number' && scrub > 0) {
       this.progress = damp(this.progress, this.targetProgress, scrub, dt);
    } else if (scrub === true) {
       this.progress = damp(this.progress, this.targetProgress, 12, dt);
    } else {
       this.progress = this.targetProgress;
    }
    
    this.targetValues = TimelineSolver.evaluateTimeline(this.timeline, this.progress, this.targetValues);
    Object.assign(this.currentValues, this.targetValues);
    
    this.isVisible = this.progress > 0 && this.progress < 1;
    triggerRegistry.updateProgress(this.id, this.progress);
  }

  public isSettled(): boolean {
    return Math.abs(this.progress - this.targetProgress) < 0.0005;
  }

  public clamp(boundaryProgress: number): void {
    const clampedProgress = clamp(boundaryProgress, 0, 1);
    this.targetProgress = clampedProgress;
    this.progress = clampedProgress;
    this.targetValues = TimelineSolver.evaluateTimeline(this.timeline, this.progress, this.targetValues);
    Object.assign(this.currentValues, this.targetValues);
    this.isVisible = this.progress > 0 && this.progress < 1;
    triggerRegistry.updateProgress(this.id, this.progress);
    this.render();
  }

  private lastRenderedProgress: number | null = null;
  private lastRenderedValues: Record<string, number> = {};
  private lastRenderedTier: PerformanceTier | null = null;

  public render(): void {
    const currentTier = adaptiveQualityGovernor.getTier();
    let hasChanges = currentTier !== this.lastRenderedTier;
    for (const key in this.currentValues) {
      if (this.currentValues[key] !== this.lastRenderedValues[key]) {
        hasChanges = true;
        break;
      }
    }
    if (!hasChanges && this.lastRenderedProgress === this.progress) return;
    
    this.lastRenderedTier = currentTier;
    this.lastRenderedProgress = this.progress;
    Object.assign(this.lastRenderedValues, this.currentValues);

    // Only flush styles if visible or just exited visibility
    if (!this.isVisible && !this.wasVisible && this.progress === 0) return;
    
    const v = this.currentValues;
    const hasTransformProps =
      v.x !== undefined ||
      v.y !== undefined ||
      v.z !== undefined ||
      v.scale !== undefined ||
      v.scaleX !== undefined ||
      v.scaleY !== undefined ||
      v.rotate !== undefined ||
      v.rotateX !== undefined ||
      v.rotateY !== undefined ||
      v.rotateZ !== undefined ||
      v.skewX !== undefined ||
      v.skewY !== undefined;

    if (hasTransformProps) {
      TransformComposer.setNumeric(this.element, 'scroll-transform', {
        x: v.x,
        y: v.y,
        z: v.z,
        scale: v.scale,
        scaleX: v.scaleX,
        scaleY: v.scaleY,
        rotate: v.rotate,
        rotateX: v.rotateX,
        rotateY: v.rotateY,
        rotateZ: v.rotateZ,
        skewX: v.skewX,
        skewY: v.skewY,
      });
    }
    
    if (v.opacity !== undefined) {
      styleRegistry.set(this.element, 'scroll-transform', 'opacity', v.opacity.toString());
    }
    if (v.blur !== undefined) {
      const effectiveBlur = adaptiveQualityGovernor.clampBlur(v.blur);
      if (effectiveBlur > 0) {
        styleRegistry.set(this.element, 'scroll-transform', 'filter', `blur(${effectiveBlur}px)`);
      } else {
        styleRegistry.clear(this.element, 'scroll-transform', 'filter');
      }
    }
    if (v.borderRadius !== undefined) {
      styleRegistry.set(this.element, 'scroll-transform', 'borderRadius', `${v.borderRadius}px`);
    }
    
    // Manage will-change via styleRegistry
    if (this.isVisible && !this.wasVisible) {
      styleRegistry.set(this.element, 'scroll-transform', 'willChange', 'transform, opacity, filter');
    } else if (!this.isVisible && this.wasVisible) {
      styleRegistry.clear(this.element, 'scroll-transform', 'willChange');
    }
    
    this.wasVisible = this.isVisible;
  }

  public getProgress(): number {
    return this.progress;
  }

  public getState() {
    return {
      progress: this.progress,
      values: { ...this.currentValues },
    };
  }

  public destroy(): void {
    if (this.snapTimeout && typeof window !== 'undefined') {
      window.clearTimeout(this.snapTimeout);
    }
    TransformComposer.clear(this.element, 'scroll-transform');
    triggerRegistry.unregister(this.id);
    styleRegistry.clear(this.element, 'scroll-transform');
  }
}
