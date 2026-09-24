/**
 * Dynamic Velocity Marquee Solver for ScrollCraft
 * Infinite scrolling track that accelerates based on scroll velocity.
 * Integrated with SmartCompositor and Viewport Culling.
 * Strictly under 650 LOC.
 */

import { ScrollDriver, DriverState } from './driver';
import { clamp, damp } from './math';
import { TransformComposer, smartCompositor } from './dom';

export interface MarqueeOptions {
  baseSpeed?: number;
  velocityMultiplier?: number;
  direction?: 'left' | 'right';
  maxSpeed?: number;
}

export interface MarqueeState extends DriverState {
  position: number;
}

export class VelocityMarqueeSolver implements ScrollDriver {
  private state: MarqueeState = { position: 0 };
  private elementWidth: number = 0;
  private currentSpeed: number = 0;
  private isVisible: boolean = true;
  private options: Required<MarqueeOptions>;

  constructor(
    private element: HTMLElement,
    options?: MarqueeOptions
  ) {
    this.options = {
      baseSpeed: options?.baseSpeed ?? 1,
      velocityMultiplier: options?.velocityMultiplier ?? 0.05,
      direction: options?.direction ?? 'left',
      maxSpeed: options?.maxSpeed ?? 50,
    };

    if (this.element && this.element.style) {
      this.element.style.backfaceVisibility = 'hidden';
      (this.element.style as any).webkitBackfaceVisibility = 'hidden';
    }
    this.measure();
    smartCompositor.promote(this.element);
  }

  public setVisible(visible: boolean): void {
    if (this.isVisible === visible) return;
    this.isVisible = visible;

    if (visible) {
      if (this.element && this.element.style) {
        this.element.style.backfaceVisibility = 'hidden';
        (this.element.style as any).webkitBackfaceVisibility = 'hidden';
      }
      smartCompositor.promote(this.element);
    } else {
      smartCompositor.demote(this.element, 300);
    }
  }

  public measure(): void {
    // Read the width of the first child to know the modulo wrapping point
    const firstChild = this.element.firstElementChild as HTMLElement;
    if (firstChild) {
      this.elementWidth = firstChild.getBoundingClientRect().width;
    }
  }

  public update(_scrollY: number, velocity: number = 0, deltaTime: number = 1 / 60): MarqueeState {
    if (!this.isVisible || this.elementWidth <= 0) return this.state;

    // The target speed is base + (scroll velocity * multiplier)
    const rawTargetSpeed = this.options.baseSpeed + (Math.abs(velocity) * this.options.velocityMultiplier);
    const targetSpeed = clamp(rawTargetSpeed, this.options.baseSpeed, this.options.maxSpeed);

    // Smooth damp the speed so it decays nicely
    this.currentSpeed = damp(this.currentSpeed, targetSpeed, 8, deltaTime);

    const dirMultiplier = this.options.direction === 'left' ? -1 : 1;
    
    this.state.position += this.currentSpeed * dirMultiplier * (deltaTime * 60);

    // Seamless infinite loop wrap via modulo arithmetic
    let p = this.state.position % this.elementWidth;
    if (this.options.direction === 'left') {
      if (p > 0) p -= this.elementWidth;
      if (p <= -this.elementWidth) p += this.elementWidth;
    } else {
      if (p >= 0) p -= this.elementWidth;
      if (p < -this.elementWidth) p += this.elementWidth;
    }
    this.state.position = p;

    return this.state;
  }

  public render(): void {
    if (!this.isVisible) return;
    // 3D translate for hardware acceleration
    TransformComposer.set(this.element, 'marquee', `translate3d(${this.state.position.toFixed(2)}px, 0, 0)`);
  }

  public getState(): MarqueeState {
    return this.state;
  }

  public destroy(): void {
    smartCompositor.destroy(this.element);
    TransformComposer.clear(this.element, 'marquee');
  }
}

