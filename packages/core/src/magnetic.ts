/**
 * Zero-Rerender Magnetic Pointer Solver for ScrollCraft
 * Handles springStep physics and direct DOM writes without React.
 * Strictly under 650 LOC.
 */

import { springStep } from './math';
import { SpringConfig, SpringState } from './types';
import { ticker } from './ticker';
import { TransformComposer, GlobalResizeManager } from './dom';

export interface MagneticOptions {
  strength?: number;
  radius?: number;
  stiffness?: number;
  damping?: number;
  scale?: number;
}

export class MagneticSolver {
  private element: HTMLElement;
  private options: Required<MagneticOptions>;
  
  private targetX: number = 0;
  private targetY: number = 0;
  private targetScale: number = 1;
  
  private stateX: SpringState = { position: 0, velocity: 0, settled: true };
  private stateY: SpringState = { position: 0, velocity: 0, settled: true };
  private stateScale: SpringState = { position: 1, velocity: 0, settled: true };
  
  private springConfig: SpringConfig;
  private taskId: string;
  
  private isHovering: boolean = false;
  private isTicking: boolean = false;
  private cachedAbsoluteRect: { left: number; top: number; width: number; height: number } | null = null;
  private unobserveResize: (() => void) | null = null;

  constructor(element: HTMLElement, options?: MagneticOptions) {
    this.element = element;
    this.options = {
      strength: options?.strength ?? 0.35,
      radius: options?.radius ?? 120,
      stiffness: options?.stiffness ?? 220,
      damping: options?.damping ?? 16,
      scale: options?.scale ?? 1,
    };

    this.springConfig = {
      stiffness: this.options.stiffness,
      damping: this.options.damping,
      mass: 1,
      precision: 0.001,
    };

    this.taskId = `magnetic-${Math.random().toString(36).slice(2, 8)}`;
    this.bindEvents();
  }

  private measureRect = () => {
    if (typeof window === 'undefined') return;
    const rect = this.element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    this.cachedAbsoluteRect = {
      left: rect.left + scrollX,
      top: rect.top + scrollY,
      width: rect.width,
      height: rect.height,
    };
  };

  private onMouseEnter = () => {
    this.isHovering = true;
    this.targetScale = this.options.scale;
    this.measureRect();
    this.ensureTicker();
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.cachedAbsoluteRect) this.measureRect();
    const absRect = this.cachedAbsoluteRect;
    if (!absRect) return;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    const left = absRect.left - scrollX;
    const top = absRect.top - scrollY;

    const centerX = left + absRect.width / 2;
    const centerY = top + absRect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance < this.options.radius) {
      this.targetX = deltaX * this.options.strength;
      this.targetY = deltaY * this.options.strength;
    } else {
      this.targetX = 0;
      this.targetY = 0;
    }
    
    this.ensureTicker();
  };

  private onMouseLeave = () => {
    this.isHovering = false;
    this.targetX = 0;
    this.targetY = 0;
    this.targetScale = 1;
    this.cachedAbsoluteRect = null;
    this.ensureTicker();
  };

  private bindEvents() {
    if (typeof window === 'undefined') return;

    // Disable magnetic physics on non-hover / pure touch devices
    if (typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches) {
      return;
    }

    this.element.addEventListener('mouseenter', this.onMouseEnter);
    this.element.addEventListener('mousemove', this.onMouseMove);
    this.element.addEventListener('mouseleave', this.onMouseLeave);
    
    this.unobserveResize = GlobalResizeManager.observe(this.element, () => this.measureRect());
  }

  public destroy() {
    if (typeof window === 'undefined') return;
    this.element.removeEventListener('mouseenter', this.onMouseEnter);
    this.element.removeEventListener('mousemove', this.onMouseMove);
    this.element.removeEventListener('mouseleave', this.onMouseLeave);
    this.unobserveResize?.();
    this.unobserveResize = null;
    ticker.remove(this.taskId);
    ticker.remove(this.taskId + '-render');
    this.isTicking = false;
    TransformComposer.clear(this.element, 'magnetic');
  }

  private ensureTicker() {
    // If not settled, we make sure it's running in the ticker
    if (
      this.stateX.settled &&
      this.stateY.settled &&
      this.stateScale.settled &&
      this.targetX === 0 &&
      this.targetY === 0 &&
      this.targetScale === 1 &&
      !this.isHovering
    ) {
      return; // fully idle
    }
    if (this.isTicking) return;
    this.isTicking = true;
    ticker.add(this.taskId, 'update', this.update);
    ticker.add(this.taskId + '-render', 'render', this.render);
  }

  private update = (dt: number) => {
    springStep(this.stateX.position, this.targetX, this.stateX.velocity, this.springConfig, dt, this.stateX);
    springStep(this.stateY.position, this.targetY, this.stateY.velocity, this.springConfig, dt, this.stateY);
    springStep(this.stateScale.position, this.targetScale, this.stateScale.velocity, this.springConfig, dt, this.stateScale);
    
    if (
      this.stateX.settled &&
      this.stateY.settled &&
      this.stateScale.settled &&
      this.targetX === 0 &&
      this.targetY === 0 &&
      this.targetScale === 1
    ) {
      TransformComposer.clear(this.element, 'magnetic');
      ticker.remove(this.taskId);
      ticker.remove(this.taskId + '-render');
      this.isTicking = false;
    }
  };

  private render = () => {
    TransformComposer.setNumeric(this.element, 'magnetic', {
      x: this.stateX.position,
      y: this.stateY.position,
      z: 0,
      scale: this.options.scale !== 1 ? Number(this.stateScale.position.toFixed(3)) : undefined,
    });
  };
}
