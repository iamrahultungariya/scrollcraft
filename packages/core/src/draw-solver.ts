import { clamp, damp } from './math';
import { triggerRegistry } from './markers';
import { compileTrigger, CompiledTrigger } from './trigger-compiler';

export interface DrawSolverOptions {
  id?: string;
  markers?: boolean;
  start?: string; // 'top bottom', 'center center', etc.
  end?: string;
  scrub?: boolean | number;
  direction?: 'forward' | 'reverse' | 'bidirectional';
}

export class DrawSolver {
  private element: SVGGeometryElement;
  private options: DrawSolverOptions;
  public readonly id: string;
  
  public startY: number = 0;
  public endY: number = 0;

  public getBounds(): { startY: number; endY: number } {
    return { startY: this.startY, endY: this.endY };
  }
  private startTriggerCompiled: CompiledTrigger;
  private endTriggerCompiled: CompiledTrigger;
  
  private progress: number = 0;
  private targetProgress: number = 0;
  
  private totalLength: number = 0;
  private isVisible: boolean = false;
  private wasVisible: boolean = false;
  private hasDrawn: boolean = false;
  private initialStrokeDasharray: string;
  private initialStrokeDashoffset: string;

  constructor(element: SVGGeometryElement, options: DrawSolverOptions) {
    this.element = element;
    this.id = options.id || (`draw-${Math.random().toString(36).slice(2, 8)}`);
    this.options = {
      direction: 'forward',
      scrub: true,
      ...options,
      start: options.start ?? 'top bottom',
      end: options.end ?? 'bottom top',
    };
    this.startTriggerCompiled = compileTrigger(this.options.start);
    this.endTriggerCompiled = compileTrigger(this.options.end);
    this.initialStrokeDasharray = element.style.strokeDasharray || '';
    this.initialStrokeDashoffset = element.style.strokeDashoffset || '';
  }

  public measure(): void {
    if (typeof window === 'undefined') return;
    
    const rect = this.element.getBoundingClientRect();
    const wh = window.innerHeight;
    const scrollTop = window.scrollY ?? window.pageYOffset ?? 0;
    
    this.startY = this.startTriggerCompiled.evaluate(rect, wh, scrollTop);
    this.endY = this.endTriggerCompiled.evaluate(rect, wh, scrollTop);
    
    if (this.options.end?.startsWith('+=')) {
        this.endY = this.startY + parseFloat(this.options.end.replace('+=', ''));
    }

    triggerRegistry.register({
      id: this.id,
      type: 'draw',
      element: this.element,
      startTrigger: this.options.start || 'top bottom',
      endTrigger: this.options.end || 'bottom top',
      startY: this.startY,
      endY: this.endY,
      progress: this.progress,
      markers: this.options.markers,
    });

    if (this.element.getTotalLength) {
      this.totalLength = this.element.getTotalLength();
      
      // Initialize offset correctly based on direction
      if (!this.hasDrawn) {
        this.element.style.strokeDasharray = `${this.totalLength} ${this.totalLength}`;
        if (this.options.direction === 'reverse') {
          this.element.style.strokeDashoffset = `-${this.totalLength}`;
        } else {
          this.element.style.strokeDashoffset = `${this.totalLength}`;
        }
      }
    }
  }

  public update(scrollY: number, _velocity: number, dt: number, isReducedMotion: boolean = false): void {
    if (this.startY === this.endY || this.totalLength === 0) return;
    
    // Calculate raw progress
    let rawProgress = (scrollY - this.startY) / (this.endY - this.startY);
    rawProgress = clamp(rawProgress, 0, 1);
    
    if (isReducedMotion) {
      this.progress = 1;
      return;
    }
    
    if (this.options.scrub) {
      this.targetProgress = rawProgress;
      const scrub = this.options.scrub;
      if (typeof scrub === 'number' && scrub > 0) {
         this.progress = damp(this.progress, this.targetProgress, scrub, dt);
      } else {
         this.progress = this.targetProgress;
      }
    } else {
      // If no scrub, trigger play once when scrolled into view
      if (rawProgress > 0) {
        this.targetProgress = 1;
      }
      this.progress = damp(this.progress, this.targetProgress, 5, dt); // Default ease
    }
    
    this.isVisible = this.progress > 0 && this.progress < 1;
    triggerRegistry.updateProgress(this.id, this.progress);
  }

  public getProgress(): number {
    return this.progress;
  }

  public isSettled(): boolean {
    return Math.abs(this.progress - this.targetProgress) < 0.0005;
  }

  public clamp(boundaryProgress: number): void {
    const clamped = clamp(boundaryProgress, 0, 1);
    this.targetProgress = clamped;
    this.progress = clamped;
    this.isVisible = this.progress > 0 && this.progress < 1;
    triggerRegistry.updateProgress(this.id, this.progress);
    this.render();
  }

  public render(): void {
    if (this.totalLength === 0) return;
    // Only flush styles if visible or just exited visibility or first time
    if (!this.isVisible && !this.wasVisible && this.progress === 0 && this.hasDrawn) return;
    
    let offset = 0;
    
    if (this.options.direction === 'reverse') {
      offset = -this.totalLength * (1 - this.progress);
    } else if (this.options.direction === 'bidirectional') {
      // Start from center
      this.element.style.strokeDasharray = `${this.totalLength} ${this.totalLength}`;
      offset = this.totalLength * (1 - this.progress);
      // For bidirectional, you typically draw from middle or both ends, 
      // but simpler to just do standard draw. We'll map bidirectional to standard for now 
      // since strokeDashoffset is 1D.
    } else {
      offset = this.totalLength * (1 - this.progress);
    }
    
    this.element.style.strokeDashoffset = `${offset}`;
    
    this.hasDrawn = true;
    this.wasVisible = this.isVisible;
  }

  public destroy(): void {
    triggerRegistry.unregister(this.id);
    this.element.style.strokeDasharray = this.initialStrokeDasharray;
    this.element.style.strokeDashoffset = this.initialStrokeDashoffset;
  }
}
