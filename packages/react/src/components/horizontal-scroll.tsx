'use client';

import React, { useRef, useEffect } from 'react';
import { HorizontalScrollSolver, HorizontalScrollOptions, ticker, GlobalResizeManager } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export interface HorizontalScrollProps extends React.HTMLAttributes<HTMLDivElement>, HorizontalScrollOptions {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  stickyClassName?: string;
  /** Total vertical scroll runway height (e.g. '300vh' or 3000). Default: 250vh-350vh based on speed */
  height?: string | number;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className = '',
  innerClassName = '',
  stickyClassName = 'sticky top-0 h-screen w-full overflow-hidden flex items-center',
  speed,
  driver,
  height,
  style,
  ...domProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { engine } = useScrollCraft();

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const solver = new HorizontalScrollSolver(container, track, { speed, driver });
    const taskId = `horizontal-${Math.random().toString(36).slice(2, 8)}`;

    let isMounted = true;
    const measure = () => {
      if (isMounted) solver.measure();
    };
    const unobserveContainer = GlobalResizeManager.observe(container, measure);
    const unobserveTrack = GlobalResizeManager.observe(track, measure);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (isMounted) measure();
      });
    }

    const images = track.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', measure, { once: true });
        img.addEventListener('error', measure, { once: true });
      }
    });

    const rafId = requestAnimationFrame(() => {
      if (isMounted) measure();
    });

    ticker.add(taskId, 'update', () => {
      const scrollY = engine?.getMetrics().scroll ?? (window.scrollY || window.pageYOffset);
      solver.update(scrollY);
    });

    ticker.add(taskId, 'render', () => {
      solver.render();
    });

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      unobserveContainer();
      unobserveTrack();
      images.forEach((img) => {
        img.removeEventListener('load', measure);
        img.removeEventListener('error', measure);
      });
      ticker.remove(taskId);
      solver.destroy();
    };
  }, [speed, driver, engine]);

  const resolvedHeight =
    height !== undefined
      ? typeof height === 'number'
        ? `${height}px`
        : height
      : style?.height ?? `${Math.max(250, (speed ?? 1.5) * 150)}vh`;

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${className}`}
      style={{
        ...style,
        height: resolvedHeight,
      }}
      {...domProps}
    >
      <div className={stickyClassName}>
        <div ref={trackRef} className={`flex flex-nowrap w-max ${innerClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
