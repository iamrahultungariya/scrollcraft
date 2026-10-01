'use client';

import React, { useEffect, useRef } from 'react';
import {
  useScrollCraft,
  useScrollCraftTier,
  useTicker,
  useRenderTracker,
} from '@scrollcraft/react';
import { ticker } from '@scrollcraft/core';
import { Activity, Zap, Cpu, Compass, RotateCcw } from 'lucide-react';

interface TestHeaderHUDProps {
  title?: string;
  badge?: string;
  className?: string;
}

/**
 * TestHeaderHUD — Zero-Rerender Telemetry & Diagnostic HUD
 *
 * Pure Brutalist Specifications:
 * - STRICT 0 Virtual DOM re-renders during active scrolling gestures.
 * - All high-frequency telemetry (FPS, scrollY, progress, velocity, direction)
 *   mutates the DOM directly via imperative subscriptions and centralized ticker.
 * - Solid obsidian background without expensive GPU blur.
 * - Uniform 2px borders, square tags, and hard offset shadows.
 */
export const TestHeaderHUD: React.FC<TestHeaderHUDProps> = ({
  title = 'Test Lab Telemetry HUD',
  badge = 'Hardware Engine',
  className = '',
}) => {
  const { scrollTo, subscribe, reducedMotion } = useScrollCraft();
  const tier = useScrollCraftTier();
  const audit = useRenderTracker('TestHeaderHUD');

  // Direct DOM refs for zero-rerender live mutations
  const fpsRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);
  const directionRef = useRef<HTMLSpanElement>(null);
  const auditRef = useRef<HTMLSpanElement>(null);

  // FPS measurement synced with central Ticker telemetry (phase 'measure')
  const lastFpsTimeRef = useRef(0);

  useTicker((_dt, _elapsed, current) => {
    if (current - lastFpsTimeRef.current >= 250) {
      lastFpsTimeRef.current = current;
      if (fpsRef.current) {
        const { fps, isIdle, targetFps } = ticker.getFrameRate();
        const displayFps = isIdle ? targetFps : fps;
        fpsRef.current.textContent = isIdle ? `${displayFps} (idle)` : `${displayFps}`;
        fpsRef.current.style.color = '#DFFF00';
      }
    }
  }, 'measure');

  // Imperative scroll subscription: Direct DOM text writes without React state updates!
  useEffect(() => {
    let lastUpdate = 0;
    let lastScroll = -1;
    let lastProgress = -1;
    let lastDirection: boolean | null = null;

    const unsub = subscribe((metrics) => {
      const now = performance.now();
      // Throttle DOM text writes to ~40 FPS to avoid layout thrash while remaining buttery smooth
      if (now - lastUpdate < 25) return;
      lastUpdate = now;

      const roundedScroll = Math.round(metrics.scroll);
      if (scrollRef.current && roundedScroll !== lastScroll) {
        lastScroll = roundedScroll;
        scrollRef.current.textContent = `${roundedScroll}px`;
      }

      const pct = Math.min(100, Math.max(0, Math.round(metrics.progress * 100)));
      if (progressRef.current && pct !== lastProgress) {
        lastProgress = pct;
        progressRef.current.textContent = `(${pct}%)`;
      }

      if (velocityRef.current) {
        velocityRef.current.textContent = Math.abs(metrics.velocity).toFixed(2);
      }

      const isDown = metrics.direction >= 0;
      if (directionRef.current && isDown !== lastDirection) {
        lastDirection = isDown;
        directionRef.current.textContent = isDown ? '↓ DOWN' : '↑ UP';
      }

      if (auditRef.current) {
        auditRef.current.textContent = `${audit.rendersWhileScrolling}`;
      }
    });

    return unsub;
  }, [subscribe, audit.rendersWhileScrolling]);

  return (
    <div
      className={`sticky top-16 z-40 w-full border-b-2 border-line bg-bg px-4 sm:px-6 py-2.5 text-xs font-mono select-none shadow-rest ${className}`}
    >
      <div className="max-w-[1536px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Identifier & Live Status */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-accent inline-block shrink-0" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-fg tracking-wide uppercase">{title}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 border border-line bg-accent text-black">
              {badge}
            </span>
          </div>
        </div>

        {/* Center: Live Real-Time Telemetry Gauges (Direct DOM Writes) */}
        <div className="flex items-center gap-3 sm:gap-6 text-fg overflow-x-auto no-scrollbar max-w-full py-0.5">
          {/* FPS Gauge */}
          <div className="flex items-center gap-1.5 shrink-0" title="Hardware frame rate via ScrollCraft ticker">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span className="text-muted">FPS:</span>
            <span ref={fpsRef} className="font-bold text-accent">
              60
            </span>
          </div>

          {/* Re-render Audit Counter */}
          <div
            className="flex items-center gap-1.5 shrink-0"
            title="Proof of zero virtual DOM re-renders during active scrolling"
          >
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-muted"><span className="hidden sm:inline">SCROLL </span>RE-RENDERS:</span>
            <span
              ref={auditRef}
              className="font-bold px-1.5 py-0.2 border border-line bg-bg text-accent"
            >
              0
            </span>
          </div>

          {/* Scroll Y & Progress */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Compass className="w-3.5 h-3.5 text-muted" />
            <span className="text-muted">Y:</span>
            <span ref={scrollRef} className="text-fg font-bold">
              0px
            </span>
            <span ref={progressRef} className="text-muted">
              (0%)
            </span>
          </div>

          {/* Velocity & Direction */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted">VEL:</span>
            <span ref={velocityRef} className="text-fg font-bold">
              0.00
            </span>
            <span ref={directionRef} className="text-accent font-bold text-[10px] ml-1">
              ↓ DOWN
            </span>
          </div>

          {/* Performance Tier */}
          <div className="hidden md:flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-muted" />
            <span className="text-muted">TIER:</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 border border-line bg-bg text-accent">
              {tier}
            </span>
          </div>

          {reducedMotion && (
            <span className="text-[10px] text-black bg-accent px-2 py-0.5 border border-line font-bold uppercase">
              REDUCED MOTION
            </span>
          )}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                scrollTo(0, { immediate: true });
                window.scrollTo({ top: 0, behavior: 'instant' as any });
              }
            }}
            className="h-8 px-2.5 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black transition-all cursor-pointer text-[11px] font-mono font-bold uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 flex items-center gap-1.5"
            title="Reset scroll to top (0px)"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
};
