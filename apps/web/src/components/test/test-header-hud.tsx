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
 * Guarantees:
 * - STRICT 0 Virtual DOM re-renders during active scrolling gestures.
 * - All high-frequency telemetry (FPS, scrollY, progress, velocity, direction)
 *   mutates the DOM directly via imperative subscriptions and centralized ticker.
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
        fpsRef.current.style.color = isIdle || displayFps >= 50 ? '#34d399' : displayFps >= 30 ? '#fbbf24' : '#fb7185';
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
        directionRef.current.style.color = isDown ? '#34d399' : '#38bdf8';
      }

      if (auditRef.current) {
        auditRef.current.textContent = `${audit.rendersWhileScrolling}`;
      }
    });

    return unsub;
  }, [subscribe, audit.rendersWhileScrolling]);

  const tierColor =
    tier === 'high'
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
      : tier === 'balanced'
      ? 'text-sky-400 border-sky-500/40 bg-sky-500/10'
      : 'text-amber-400 border-amber-500/40 bg-amber-500/10';

  return (
    <div
      className={`sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#050505]/90 backdrop-blur-md px-4 sm:px-6 py-2.5 text-xs font-mono select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Identifier & Live Status */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">{title}</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {badge}
            </span>
          </div>
        </div>

        {/* Center: Live Real-Time Telemetry Gauges (Direct DOM Writes) */}
        <div className="flex items-center gap-3 sm:gap-6 text-zinc-300 overflow-x-auto no-scrollbar max-w-full py-0.5">
          {/* FPS Gauge */}
          <div className="flex items-center gap-1.5 shrink-0" title="Hardware frame rate via ScrollCraft ticker">
            <Activity className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500">FPS:</span>
            <span ref={fpsRef} className="font-bold text-emerald-400">
              60
            </span>
          </div>

          {/* Re-render Audit Counter */}
          <div
            className="flex items-center gap-1.5 shrink-0"
            title="Proof of zero virtual DOM re-renders during active scrolling"
          >
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-zinc-500"><span className="hidden sm:inline">SCROLL </span>RE-RENDERS:</span>
            <span
              ref={auditRef}
              className="font-bold px-1.5 py-0.2 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
            >
              0
            </span>
          </div>

          {/* Scroll Y & Progress */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Compass className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500">Y:</span>
            <span ref={scrollRef} className="text-white font-bold">
              0px
            </span>
            <span ref={progressRef} className="text-zinc-600">
              (0%)
            </span>
          </div>

          {/* Velocity & Direction */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-zinc-500">VEL:</span>
            <span ref={velocityRef} className="text-sky-400 font-bold">
              0.00
            </span>
            <span ref={directionRef} className="text-emerald-400 font-bold text-[10px] ml-1">
              ↓ DOWN
            </span>
          </div>

          {/* Performance Tier */}
          <div className="hidden md:flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-500">TIER:</span>
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${tierColor}`}>
              {tier}
            </span>
          </div>

          {reducedMotion && (
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer text-[11px]"
            title="Reset scroll to top (0px)"
          >
            <RotateCcw className="w-3 h-3 text-zinc-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
