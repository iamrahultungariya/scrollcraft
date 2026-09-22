'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Sliders,
  Sparkles,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Rotate3d,
  Activity,
  Cpu,
  Zap,
  Gauge,
  CheckCircle2,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import {
  Reveal,
  ScrollTransform,
  StackedCards,
  HorizontalScroll,
} from '@scrollcraft/react';

type BlurMode = 'raw' | 'reduced' | 'hardcoded' | 'flat';

export default function RobustTestingPage() {
  const [blurMode, setBlurMode] = useState<BlurMode>('raw');

  // Direct DOM Refs for Telemetry: ZERO React Virtual DOM re-renders during active scrolling!
  const instantFpsRef = React.useRef<HTMLSpanElement>(null);
  const avgFpsRef = React.useRef<HTMLSpanElement>(null);
  const onePercentRef = React.useRef<HTMLSpanElement>(null);
  const frameTimeRef = React.useRef<HTMLSpanElement>(null);
  const droppedFramesRef = React.useRef<HTMLSpanElement>(null);

  const statsRef = React.useRef({
    resetRequested: false,
  });

  // High-precision RAF Telemetry Sampler: writes directly to DOM nodes without triggering setState
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const frameTimes: number[] = [];
    let droppedCount = 0;
    let totalCount = 0;

    const tick = (now: number) => {
      // Handle user reset request immediately inside the RAF loop
      if (statsRef.current.resetRequested) {
        droppedCount = 0;
        totalCount = 0;
        frameTimes.length = 0;
        statsRef.current.resetRequested = false;
        lastTime = now;
      }

      const delta = now - lastTime;
      lastTime = now;

      if (delta > 0 && delta < 200) {
        totalCount++;
        const currentFps = Math.min(120, Math.round(1000 / delta));
        if (delta > 18.0) {
          droppedCount++;
        }

        frameTimes.push(delta);
        if (frameTimes.length > 60) {
          frameTimes.shift();
        }

        const avgDelta = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const avgFps = Math.min(120, Math.round(1000 / avgDelta));

        // 1% Low: 99th percentile slowest frame
        const sortedDeltas = [...frameTimes].sort((a, b) => b - a);
        const p99Delta = sortedDeltas[0] || delta;
        const onePercentLow = Math.max(1, Math.min(120, Math.round(1000 / p99Delta)));

        // Write directly to DOM refs: 0 React re-renders on the page!
        if (totalCount % 4 === 0) {
          if (instantFpsRef.current) {
            instantFpsRef.current.textContent = `${currentFps} FPS`;
            instantFpsRef.current.className = `font-bold ${
              currentFps >= 55 ? 'text-emerald-400' : currentFps >= 40 ? 'text-amber-400' : 'text-rose-400'
            }`;
          }
          if (avgFpsRef.current) {
            avgFpsRef.current.textContent = `${avgFps} FPS`;
          }
          if (onePercentRef.current) {
            onePercentRef.current.textContent = `${onePercentLow} FPS`;
          }
          if (frameTimeRef.current) {
            const ft = Math.round(delta * 10) / 10;
            frameTimeRef.current.textContent = `${ft}ms`;
            frameTimeRef.current.className = `font-bold ${
              ft <= 16.7 ? 'text-emerald-400' : ft <= 33.3 ? 'text-amber-400' : 'text-rose-400'
            }`;
          }
          if (droppedFramesRef.current) {
            droppedFramesRef.current.textContent = `${droppedCount}`;
            droppedFramesRef.current.className = `font-bold ${
              droppedCount === 0 ? 'text-zinc-400' : 'text-rose-400'
            }`;
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const resetTelemetry = () => {
    statsRef.current.resetRequested = true;
    if (instantFpsRef.current) instantFpsRef.current.textContent = '60 FPS';
    if (avgFpsRef.current) avgFpsRef.current.textContent = '60 FPS';
    if (onePercentRef.current) onePercentRef.current.textContent = '60 FPS';
    if (frameTimeRef.current) frameTimeRef.current.textContent = '16.6ms';
    if (droppedFramesRef.current) droppedFramesRef.current.textContent = '0';
  };

  // Dynamic Card Styling based on Blur Mode
  const cardStyle: React.CSSProperties = useMemo(() => {
    switch (blurMode) {
      case 'raw':
        return {
          background: 'rgba(18, 18, 26, 0.55)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
          transition: 'backdrop-filter 0.3s ease, background 0.3s ease, border-color 0.3s ease',
        };
      case 'reduced':
        return {
          background: 'rgba(18, 18, 26, 0.82)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.5)',
          transition: 'backdrop-filter 0.3s ease, background 0.3s ease, border-color 0.3s ease',
        };
      case 'hardcoded':
        return {
          background: '#121218',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          border: '1px solid #27272a',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
          transition: 'backdrop-filter 0.3s ease, background 0.3s ease, border-color 0.3s ease',
        };
      case 'flat':
        return {
          background: '#121218',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          border: '1px solid #27272a',
          boxShadow: 'none',
          transition: 'backdrop-filter 0.3s ease, background 0.3s ease, border-color 0.3s ease',
        };
    }
  }, [blurMode]);

  // Section 3: 5 Stacked Cards Data
  const stackCards = useMemo(
    () => [
      <div
        key="card-12"
        style={cardStyle}
        className="rounded-3xl p-8 max-w-2xl mx-auto w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Card #12 • Stack Step 1
          </span>
          <span className="text-xs font-mono text-zinc-400">Depth Factor: 1.00</span>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          12. FastTransformBuffer Layer
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Zero-allocation numeric matrix buffer attached to DOM nodes via un-enumerable symbols.
          Eliminates 18,000+ string allocations per second.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
          <span>GC Churn: 0 bytes/frame</span>
          <span>•</span>
          <span>Phase 4 Flush</span>
        </div>
      </div>,

      <div
        key="card-13"
        style={cardStyle}
        className="rounded-3xl p-8 max-w-2xl mx-auto w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            Card #13 • Stack Step 2
          </span>
          <span className="text-xs font-mono text-zinc-400">Depth Factor: 0.95</span>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          13. Spatial Trigger Registry
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Precomputes scroll start and end boundaries during the measure phase. During active scroll,
          evaluates progress purely mathematically with zero layout reads.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
          <span>DOM Reads: 0</span>
          <span>•</span>
          <span>Pure Float Math</span>
        </div>
      </div>,

      <div
        key="card-14"
        style={cardStyle}
        className="rounded-3xl p-8 max-w-2xl mx-auto w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Card #14 • Stack Step 3
          </span>
          <span className="text-xs font-mono text-zinc-400">Depth Factor: 0.90</span>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          14. Frustum Culling Shield
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Freezes solvers and bypasses matrix calculations for elements outside the viewport ±250px
          culling envelope.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
          <span>Offscreen Load: Bypassed</span>
          <span>•</span>
          <span>85% CPU Saved</span>
        </div>
      </div>,

      <div
        key="card-15"
        style={cardStyle}
        className="rounded-3xl p-8 max-w-2xl mx-auto w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Card #15 • Stack Step 4
          </span>
          <span className="text-xs font-mono text-zinc-400">Depth Factor: 0.85</span>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          15. Settled Character Gating
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Characters that have settled at 0 or 1 opacity are skipped in subsequent frames, dropping
          DOM style mutations from 1,200/frame to 15/frame.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
          <span>Mutations: -98%</span>
          <span>•</span>
          <span>Zero Layout Queue</span>
        </div>
      </div>,

      <div
        key="card-16"
        style={cardStyle}
        className="rounded-3xl p-8 max-w-2xl mx-auto w-full flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Card #16 • Stack Step 5
          </span>
          <span className="text-xs font-mono text-zinc-400">Depth Factor: 0.80</span>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          16. GPU Raster Isolation
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Switching from Raw Glassmorphism to Hardcoded allows isolating GPU composite latency from
          JavaScript execution.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
          <span>GPU Shader Cost: Isolated</span>
          <span>•</span>
          <span>Hardware Proof</span>
        </div>
      </div>,
    ],
    [cardStyle]
  );

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-violet-600/30 selection:text-white">
      {/* Universal Navigation */}
      <SiteNav />

      {/* Sticky Telemetry HUD & Blur Isolation Controller */}
      <aside aria-label="Performance Telemetry and Controls" className="sticky top-16 z-40 w-full border-b border-zinc-800/80 bg-[#09090e]/95 backdrop-blur-md px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left: Mode Selector */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 shrink-0">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Glassmorphism Mode:</span>
            </div>

            {/* Custom Interactive Select Box */}
            <div className="relative flex-1 sm:w-64">
              <label htmlFor="blur-mode-select" className="sr-only">Select Glassmorphism Mode</label>
              <select
                id="blur-mode-select"
                value={blurMode}
                onChange={(e) => setBlurMode(e.target.value as BlurMode)}
                className="w-full appearance-none bg-zinc-900 border border-zinc-700 text-white text-xs font-mono font-medium rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer shadow-inner"
              >
                <option value="raw">Raw Glassmorphism (Heavy 24px Blur)</option>
                <option value="reduced">50% Reduced (Light 8px Blur)</option>
                <option value="hardcoded">Solid (0px Blur, Standard Shadow)</option>
                <option value="flat">Flat / Zero-Shadow (0px Blur, 0px Shadow)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 1-Tap Quick Buttons for Mobile and Fast Switching */}
            <div className="hidden sm:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 shrink-0">
              <button
                type="button"
                onClick={() => setBlurMode('raw')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  blurMode === 'raw'
                    ? 'bg-violet-600 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Raw
              </button>
              <button
                type="button"
                onClick={() => setBlurMode('reduced')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  blurMode === 'reduced'
                    ? 'bg-sky-600 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => setBlurMode('hardcoded')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  blurMode === 'hardcoded'
                    ? 'bg-emerald-600 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => setBlurMode('flat')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  blurMode === 'flat'
                    ? 'bg-amber-600 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Flat
              </button>
            </div>

            {/* Reset Telemetry Button */}
            <button
              onClick={resetTelemetry}
              title="Reset frame counter"
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Live Telemetry Gauges (Direct DOM Refs: 0 React Re-renders!) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto justify-end text-xs font-mono">
            {/* Instant FPS */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400">Instant:</span>
              <span ref={instantFpsRef} className="font-bold text-emerald-400">
                60 FPS
              </span>
            </div>

            {/* Rolling Avg FPS */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-zinc-400">Avg:</span>
              <span ref={avgFpsRef} className="font-bold text-white">60 FPS</span>
            </div>

            {/* 1% Low FPS */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400">1% Low:</span>
              <span ref={onePercentRef} className="font-bold text-amber-300">60 FPS</span>
            </div>

            {/* Frame Time */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-zinc-400">Frame:</span>
              <span ref={frameTimeRef} className="font-bold text-emerald-400">
                16.6ms
              </span>
            </div>

            {/* Dropped Frames */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400">Dropped:</span>
              <span ref={droppedFramesRef} className="font-bold text-zinc-400">
                0
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Hero Intro Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-mono text-violet-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Glassmorphism Isolation & High-Load Torture Benchmark</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Robust Testing Laboratory
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
          This dedicated benchmark isolates <strong>Engine Overhead</strong> from{' '}
          <strong>GPU Backdrop-Filter Raster Cost</strong> across 21 heavily styled cards and 4
          distinct scroll primitives (Reveals, Transforms, Stacked Pinning, and Horizontal Scroll).
        </p>

        {/* Diagnostic Explanation Banner */}
        <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0b0b12] text-left max-w-3xl mx-auto text-xs text-zinc-400 space-y-2 font-mono">
          <div className="flex items-center gap-2 text-violet-300 font-bold">
            <Zap className="w-4 h-4 text-violet-400" />
            <span>How to Interpret the Test:</span>
          </div>
          <p>
            • If FPS drops on <span className="text-white font-semibold">Raw Glassmorphism</span> but stays locked at 60 FPS on{' '}
            <span className="text-emerald-400 font-semibold">Hardcoded (No Blur)</span>, the bottleneck is 100% GPU texture fill-rate/rasterization on your device’s GPU, not the JS engine.
          </p>
          <p>
            • If FPS drops even on <span className="text-emerald-400 font-semibold">Hardcoded</span>, then the CPU/JS Ticker is the culprit.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-32 pb-48">
        {/* ========================================================================= */}
        {/* SECTION 1: MULTI-DIRECTIONAL REVEAL PRIMITIVES (CARDS #01 TO #06)       */}
        {/* ========================================================================= */}
        <section className="space-y-12">
          <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-violet-400 uppercase tracking-wider font-semibold">
                Primitive Suite 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Multi-Directional Reveals (Cards #01 – #06)
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">6 Cards • Left, Right, Up, Down, Scale, 3D</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Reveal Left */}
            <Reveal direction="left" distance={80} duration={0.7} once={false}>
              <div style={cardStyle} className="rounded-3xl p-6 flex flex-col justify-between h-72">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Card #01
                  </span>
                  <ArrowLeft className="w-4 h-4 text-violet-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">01. Reveal From Left</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Translates along the X axis from -80px to 0px with cubic bezier easing. Zero layout reflow during movement.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                  direction=&quot;left&quot; • distance=80
                </div>
              </div>
            </Reveal>

            {/* Card 2: Reveal Right */}
            <Reveal direction="right" distance={80} duration={0.7} once={false}>
              <div style={cardStyle} className="rounded-3xl p-6 flex flex-col justify-between h-72">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Card #02
                  </span>
                  <ArrowRight className="w-4 h-4 text-violet-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">02. Reveal From Right</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Translates along the X axis from +80px to 0px. Tested under rapid directional reversal.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                  direction=&quot;right&quot; • distance=80
                </div>
              </div>
            </Reveal>

            {/* Card 3: Reveal Up */}
            <Reveal direction="up" distance={80} duration={0.7} once={false}>
              <div style={cardStyle} className="rounded-3xl p-6 flex flex-col justify-between h-72">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Card #03
                  </span>
                  <ArrowUp className="w-4 h-4 text-violet-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">03. Reveal From Bottom (Up)</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Translates from Y: +80px to 0px. Classical scroll entrance with hardware opacity interpolation.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                  direction=&quot;up&quot; • distance=80
                </div>
              </div>
            </Reveal>

            {/* Card 4: Reveal Down */}
            <Reveal direction="down" distance={80} duration={0.7} once={false}>
              <div style={cardStyle} className="rounded-3xl p-6 flex flex-col justify-between h-72">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Card #04
                  </span>
                  <ArrowDown className="w-4 h-4 text-violet-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">04. Reveal From Top (Down)</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Translates from Y: -80px to 0px. Ideal for inverse scrolling and sticky ceiling headers.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                  direction=&quot;down&quot; • distance=80
                </div>
              </div>
            </Reveal>

            {/* Card 5: Scale & Blur Reveal */}
            <Reveal scale={0.75} blur={16} duration={0.8} once={false}>
              <div style={cardStyle} className="rounded-3xl p-6 flex flex-col justify-between h-72">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Card #05
                  </span>
                  <Maximize2 className="w-4 h-4 text-violet-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">05. Scale & Dynamic Blur</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Combines matrix3d scaling (0.75 to 1.0) with an animated filter blur from 16px to 0px.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                  scale=0.75 • blur=16
                </div>
              </div>
            </Reveal>

            {/* Card 6: 3D Perspective Rotation Reveal */}
            <Reveal rotateX={30} rotateY={-20} distance={60} duration={0.9} once={false}>
              <div style={cardStyle} className="rounded-3xl p-6 flex flex-col justify-between h-72">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Card #06
                  </span>
                  <Rotate3d className="w-4 h-4 text-violet-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">06. 3D Perspective Rotate</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Rotates on both X (+30deg) and Y (-20deg) axes in 3D perspective space with zero jitter.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                  rotateX=30 • rotateY=-20
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: SCROLL SEQUENCE & KEYFRAME TRANSFORMS (CARDS #07 TO #11)      */}
        {/* ========================================================================= */}
        <section className="space-y-12">
          <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-wider font-semibold">
                Primitive Suite 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Scroll Sequence & Keyframe Transforms (Cards #07 – #11)
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">5 Cards • Scrubbed Keyframe Transforms</span>
          </div>

          <div className="space-y-8">
            {/* Card 7: ScrollTransform Zoom-In */}
            <ScrollTransform preset="zoom-in" scrub={0.2}>
              <div style={cardStyle} className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Card #07
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Preset: zoom-in</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">07. Continuous Zoom-In Scrub</h3>
                  <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
                    Scales smoothly as the viewport crosses the trigger bounds. Uses FastTransformBuffer to avoid string parsing.
                  </p>
                </div>
                <div className="w-full md:w-48 h-24 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center font-mono text-xs text-sky-300 shrink-0">
                  Matrix3D Scale
                </div>
              </div>
            </ScrollTransform>

            {/* Card 8: ScrollTransform 3D Flip */}
            <ScrollTransform preset="3d-flip" scrub={0.3}>
              <div style={cardStyle} className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Card #08
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Preset: 3d-flip</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">08. 3D Spatial Flip Scrub</h3>
                  <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
                    Flips 90 degrees in 3D perspective during scrub window. Tests GPU depth buffer and backface culling.
                  </p>
                </div>
                <div className="w-full md:w-48 h-24 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center font-mono text-xs text-sky-300 shrink-0">
                  Perspective 1000px
                </div>
              </div>
            </ScrollTransform>

            {/* Card 9: ScrollTransform Fade-Up */}
            <ScrollTransform preset="fade-up" scrub={0.2}>
              <div style={cardStyle} className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Card #09
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Preset: fade-up</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">09. Keyframe Fade-Up</h3>
                  <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
                    Interpolates opacity and translate3d(0, 100px, 0) concurrently with zero layout thrashing.
                  </p>
                </div>
                <div className="w-full md:w-48 h-24 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center font-mono text-xs text-sky-300 shrink-0">
                  TranslateY + Alpha
                </div>
              </div>
            </ScrollTransform>

            {/* Card 10: ScrollTransform Scale-Down */}
            <ScrollTransform preset="scale-down" scrub={0.2}>
              <div style={cardStyle} className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Card #10
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Preset: scale-down</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">10. Scale-Down & Compress</h3>
                  <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
                    Shrinks from 1.15 to 0.95 scale factor. Proves subpixel snapping prevents blurry font rasterization.
                  </p>
                </div>
                <div className="w-full md:w-48 h-24 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center font-mono text-xs text-sky-300 shrink-0">
                  Subpixel Snapped
                </div>
              </div>
            </ScrollTransform>

            {/* Card 11: ScrollTransform Blur-In */}
            <ScrollTransform preset="blur-in" scrub={0.25}>
              <div style={cardStyle} className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Card #11
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Preset: blur-in</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">11. Dynamically Scrubbed Blur-In</h3>
                  <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
                    Animates CSS filter blur alongside backdrop-filter. This tests maximum GPU raster pipeline stress.
                  </p>
                </div>
                <div className="w-full md:w-48 h-24 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center font-mono text-xs text-sky-300 shrink-0">
                  Dual Filter Pipeline
                </div>
              </div>
            </ScrollTransform>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: STACKED CARDS SECTION (CARDS #12 TO #16)                      */}
        {/* ========================================================================= */}
        <section className="space-y-12">
          <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Primitive Suite 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Stacked Cards Pinning (Cards #12 – #16)
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">5 Cards • Sticky Pinning + Depth Scaling</span>
          </div>

          <div className="relative">
            <StackedCards
              cards={stackCards}
              top={150}
              offset={40}
              scaleStep={0.05}
              minScale={0.8}
              cardDistance={350}
              height="2800px"
            />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: HORIZONTAL SCROLL TRACK (CARDS #17 TO #21)                    */}
        {/* ========================================================================= */}
        <section className="space-y-12">
          <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
                Primitive Suite 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Horizontal Scroll Showcase (Cards #17 – #21)
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">5 Cards • Vertical-to-Horizontal Runway</span>
          </div>

          <div className="relative rounded-3xl border border-zinc-800 bg-[#09090f] overflow-hidden">
            <HorizontalScroll
              height="300vh"
              speed={1.8}
              stickyClassName="sticky top-28 h-[calc(100vh-7rem)] w-full overflow-hidden flex items-center"
            >
              <div className="flex gap-8 p-12 items-center">
                {/* Card 17: Horizontal Node Alpha */}
                <div
                  style={cardStyle}
                  className="w-[420px] h-[340px] rounded-3xl p-8 flex flex-col justify-between shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Card #17
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Track 01/05</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      17. Horizontal Node Alpha
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      First card on the horizontal runway. Translates along the X axis purely via GPU
                      compositor transforms as you scroll vertically.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                    TranslateX: Computed from ScrollY
                  </div>
                </div>

                {/* Card 18: Horizontal Node Beta */}
                <div
                  style={cardStyle}
                  className="w-[420px] h-[340px] rounded-3xl p-8 flex flex-col justify-between shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Card #18
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Track 02/05</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      18. Horizontal Node Beta
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Maintains backdrop-filter blur continuously during high-speed horizontal
                      translation across the screen width.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                    Composite Layer: Independent
                  </div>
                </div>

                {/* Card 19: Horizontal Node Gamma */}
                <div
                  style={cardStyle}
                  className="w-[420px] h-[340px] rounded-3xl p-8 flex flex-col justify-between shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Card #19
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Track 03/05</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      19. Horizontal Node Gamma
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Zero DOM reads inside the horizontal loop. Track offset is evaluated strictly
                      against cached container geometry.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                    Spatial Registry Bounds Sync
                  </div>
                </div>

                {/* Card 20: Horizontal Node Delta */}
                <div
                  style={cardStyle}
                  className="w-[420px] h-[340px] rounded-3xl p-8 flex flex-col justify-between shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Card #20
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Track 04/05</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      20. Horizontal Node Delta
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Stress tests the browser compositor when multiple glass layers cross over
                      each other at oblique angles.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                    Multi-Layer Compositing Test
                  </div>
                </div>

                {/* Card 21: Horizontal Node Epsilon */}
                <div
                  style={cardStyle}
                  className="w-[420px] h-[340px] rounded-3xl p-8 flex flex-col justify-between shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Card #21
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Track 05/05</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      21. Horizontal Node Epsilon
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Terminal card completing the 21-card torture benchmark. Reaching this card
                      completes the full test lifecycle.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 border-t border-white/5 pt-2">
                    Final Benchmark Node #21
                  </div>
                </div>
              </div>
            </HorizontalScroll>
          </div>
        </section>

        {/* Conclusion / Summary Verdict Section */}
        <section className="p-8 rounded-3xl border border-zinc-800 bg-[#090910] space-y-6">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight">Benchmark Summary & Conclusions</h2>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            By toggling between <strong>Raw Glassmorphism</strong>, <strong>50% Reduced</strong>,{' '}
            <strong>Solid</strong>, and <strong>Flat (Zero-Shadow)</strong> in the controller above:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="text-violet-300 font-bold">1. Raw Glass (24px)</div>
              <p className="text-zinc-400">
                Puts maximum pressure on GPU texture sampling and framebuffer copies. Reveals if the
                device GPU fill-rate is the bottleneck.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="text-sky-300 font-bold">2. 50% Reduced (8px)</div>
              <p className="text-zinc-400">
                Balanced real-world threshold. Reduces GPU multi-pass overhead by ~60% while maintaining
                modern aesthetic blur.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="text-emerald-300 font-bold">3. Solid (0px Blur)</div>
              <p className="text-zinc-400">
                Removes all backdrop-filter shaders. Retains 25px box-shadows.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="text-amber-300 font-bold">4. Flat (0px Shadow)</div>
              <p className="text-zinc-400">
                Removes both blur and box-shadow shaders. Completely isolates pure CPU/JS engine execution time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
