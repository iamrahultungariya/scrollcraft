'use client';

import React, { useRef, useEffect } from 'react';
import {
  VelocityMarqueeSolver,
  MarqueeOptions,
  ticker,
  globalVisibilityManager,
  GlobalResizeManager,
} from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export interface VelocityMarqueeProps extends React.HTMLAttributes<HTMLDivElement>, MarqueeOptions {
  children: React.ReactNode;
  className?: string;
  /**
   * Explicit number of duplicated track items.
   * If omitted, dynamically auto-fills based on container and item width to prevent gaps on ultrawide/4K screens (min 6).
   */
  copies?: number;
}

export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({
  children,
  className = '',
  baseSpeed,
  velocityMultiplier,
  direction,
  maxSpeed,
  reverseOnScrollUp,
  copies,
  ...domProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { engine, reducedMotion } = useScrollCraft();

  const [repeatCount, setRepeatCount] = React.useState<number>(() => Math.max(copies ?? 6, 6));

  useEffect(() => {
    if (copies !== undefined) {
      setRepeatCount(Math.max(copies, 2));
    }
  }, [copies]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // SmartCompositor handles layer promotion dynamically inside solver
    const solver = new VelocityMarqueeSolver(track, {
      baseSpeed,
      velocityMultiplier,
      direction,
      maxSpeed,
      reverseOnScrollUp,
    });

    const taskId = `marquee-${Math.random().toString(36).slice(2, 8)}`;

    let isMounted = true;
    const measure = () => {
      if (!isMounted) return;
      solver.measure();

      // Ultrawide screen auto-expansion: ensure enough copies exist to span viewport + buffer
      if (copies === undefined && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1920);
        const firstChild = track.firstElementChild as HTMLElement | null;
        if (firstChild) {
          const itemWidth = firstChild.getBoundingClientRect().width;
          if (itemWidth > 0) {
            const needed = Math.max(6, Math.ceil(containerWidth / itemWidth) + 2);
            setRepeatCount((prev) => (needed > prev ? needed : prev));
          }
        }
      }
    };

    const unobserveResize = GlobalResizeManager.observe(track, measure);
    if (containerRef.current) {
      GlobalResizeManager.observe(containerRef.current, measure);
    }

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (isMounted) measure();
      });
    }
    
    const rafId = requestAnimationFrame(() => {
      if (isMounted) measure();
    });

    ticker.add(taskId, 'update', (dt) => {
      if (reducedMotion || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        return;
      }
      const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
      const velocity = engine?.getMetrics().velocity ?? 0;
      solver.update(scrollY, velocity, dt);
    });

    ticker.add(taskId, 'render', () => {
      solver.render();
    });

    // Autonomous Viewport Culling
    const observeTarget = containerRef.current || track;
    const unobserveVisibility = globalVisibilityManager.observe(observeTarget, (isVisible) => {
      solver.setVisible(isVisible);
      if (isVisible) {
        ticker.resumeTask(taskId);
      } else {
        ticker.pauseTask(taskId);
      }
    });

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      unobserveVisibility();
      unobserveResize();
      ticker.remove(taskId);
      solver.destroy();
    };
  }, [baseSpeed, velocityMultiplier, direction, maxSpeed, reverseOnScrollUp, copies, engine, reducedMotion]);

  return (
    <div ref={containerRef} className={`overflow-hidden flex flex-nowrap w-full ${className}`} {...domProps}>
      <div
        ref={trackRef}
        className="flex flex-nowrap whitespace-nowrap min-w-max shrink-0"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0px, 0px, 0px)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {Array.from({ length: repeatCount }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 flex items-center pr-8"
            aria-hidden={i > 0 ? true : undefined}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
};
