'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useParallax,
  useReveal,
  usePin,
  useScrollProgress,
  useScrollTransform,
  useScrollDraw,
  useMagnetic,
  useScrollTimeline,
  useScrollDirection,
  useTicker,
  useRenderTracker,
  useScrollRestoration,
  useScrollCraft,
  useScrollCraftTier,
} from '@scrollcraft/react';
import { ticker } from '@scrollcraft/core';
import { ShieldCheck, Bookmark, ArrowUp, MapPin, Sparkles } from 'lucide-react';

// ==========================================
// 14. USE PARALLAX DEMO
// ==========================================
export function HeadlessParallaxDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const speed = knobs.speed ?? 0.35;
  const ref = useParallax<HTMLDivElement>({ speed, min: -100, max: 100 });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [HEADLESS DIRECT REF BINDING]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useParallax Hook</h3>
        <p className="text-xs text-muted font-mono">Zero wrapper elements. Attached directly to ref.</p>
      </div>

      <div
        ref={ref as any}
        className="w-80 h-80 border-2 border-line bg-bg p-8 shadow-hover flex flex-col justify-between"
      >
        <span className="text-xs font-mono text-accent font-black uppercase">SPEED: {speed}X</span>
        <h4 className="text-2xl font-black uppercase text-fg">Headless Depth</h4>
        <span className="text-xs font-mono text-muted font-bold uppercase">0 Virtual DOM Re-renders</span>
      </div>
    </div>
  );
}

// ==========================================
// 15. USE REVEAL DEMO
// ==========================================
export function HeadlessRevealDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const distance = knobs.distance ?? 50;
  const blur = knobs.blur ?? 8;
  const ref = useReveal<HTMLDivElement>({ direction: 'up', distance, blur, rotateX: 12 });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [SCROLL DOWN TO TRIGGER REF REVEAL]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useReveal Hook</h3>
      </div>

      <div
        ref={ref as any}
        className="w-88 border-2 border-line bg-bg p-8 shadow-rest text-center space-y-4"
      >
        <span className="text-xs font-mono text-accent font-black uppercase">[REF BOUND REVEAL]</span>
        <h4 className="text-2xl font-black uppercase text-fg">Batch-Optimized Observer</h4>
        <p className="text-xs text-muted font-mono">
          Enters with 3D tilt and optical blur clearance when intersecting viewport.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 16. USE PIN DEMO (Zero Re-renders)
// ==========================================
export function HeadlessPinDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const top = knobs.top ?? 100;
  const badgeRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const { ref } = usePin<HTMLDivElement>({
    top,
    trackState: false, // Strict 0 re-render mode
    onProgress: (p) => {
      if (progressRef.current) {
        progressRef.current.textContent = `${(p * 100).toFixed(1)}%`;
      }
    },
    onEnter: () => {
      if (badgeRef.current) {
        badgeRef.current.textContent = 'PIN ACTIVE';
        badgeRef.current.className =
          'text-xs font-mono font-black px-2.5 py-1 border-2 border-accent bg-bg text-accent uppercase';
      }
    },
    onLeave: () => {
      if (badgeRef.current) {
        badgeRef.current.textContent = 'UNPINNED (PAST)';
        badgeRef.current.className =
          'text-xs font-mono font-bold px-2.5 py-1 border-2 border-line-soft bg-bg text-muted uppercase';
      }
    },
    onEnterBack: () => {
      if (badgeRef.current) {
        badgeRef.current.textContent = 'PIN ACTIVE';
        badgeRef.current.className =
          'text-xs font-mono font-black px-2.5 py-1 border-2 border-accent bg-bg text-accent uppercase';
      }
    },
    onLeaveBack: () => {
      if (badgeRef.current) {
        badgeRef.current.textContent = 'UNPINNED';
        badgeRef.current.className =
          'text-xs font-mono font-bold px-2.5 py-1 border-2 border-line-soft bg-bg text-muted uppercase';
      }
    },
  });

  return (
    <div className="w-full min-h-[220vh] pt-24 pb-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [HEADLESS PINNING // DIRECT DOM OBSERVABLES]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">usePin Hook</h3>
      </div>

      <div
        ref={ref as any}
        className="max-w-md mx-auto border-2 border-line bg-bg p-8 shadow-hover space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-accent font-black uppercase">TOP: {top}PX</span>
          <span
            ref={badgeRef}
            className="text-xs font-mono font-bold px-2.5 py-1 border-2 border-line-soft bg-bg text-muted uppercase"
          >
            UNPINNED
          </span>
        </div>

        <h4 className="text-2xl font-black uppercase text-fg">Headless Sticky Pin</h4>
        <p className="text-xs text-muted font-mono">
          Dual API supports pure headless ref or ref-forwarding with observable progress values and 0 re-renders.
        </p>

        <div className="p-4 border-2 border-line-soft bg-zinc-950 font-mono text-xs text-fg">
          Normalized Pin Progress:{' '}
          <span ref={progressRef} className="text-accent font-black">
            0.0%
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 17. USE SCROLL PROGRESS DEMO (Zero Re-renders)
// ==========================================
export function HeadlessProgressDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const percentRef = useRef<HTMLDivElement>(null);

  const { targetRef } = useScrollProgress<HTMLDivElement>({
    offset: ['top bottom', 'bottom top'],
    onProgress: (p) => {
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(p * 100)}%`;
      }
    },
  });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [TARGET SCOPED MATH // 0 RE-RENDERS]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useScrollProgress Hook</h3>
      </div>

      <div
        ref={targetRef as any}
        className="w-88 border-2 border-line bg-bg p-8 shadow-hover text-center space-y-4"
      >
        <span className="text-xs font-mono text-muted uppercase font-bold">[TARGET PROGRESSION]</span>
        <div ref={percentRef} className="text-6xl font-black text-accent font-mono">
          0%
        </div>
        <p className="text-xs text-muted font-mono">Calculated across offset: [&apos;top bottom&apos;, &apos;bottom top&apos;]</p>
      </div>
    </div>
  );
}

// ==========================================
// 18. USE SCROLL TRANSFORM DEMO
// ==========================================
export function HeadlessTransformDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const preset = knobs.preset ?? 'zoom-in';
  const ref = useScrollTransform<HTMLDivElement>({
    preset,
    scrub: true,
  });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [COMPOSITOR REF DRIVER]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useScrollTransform Hook</h3>
      </div>

      <div
        ref={ref as any}
        className="sticky top-40 w-80 h-80 border-2 border-line bg-bg p-8 shadow-hover flex flex-col justify-between"
      >
        <span className="text-xs font-mono text-accent font-black uppercase">PRESET: {preset}</span>
        <h4 className="text-2xl font-black uppercase text-fg">Direct GPU Writes</h4>
        <span className="text-xs font-mono text-muted font-bold uppercase">0 Re-renders on Scroll</span>
      </div>
    </div>
  );
}

// ==========================================
// 19. USE SCROLL DRAW DEMO
// ==========================================
export function HeadlessDrawDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const direction = knobs.direction ?? 'forward';
  const pathRef = useScrollDraw<SVGPathElement>({ direction, scrub: true });

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [HEADLESS SVG DRAWING]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useScrollDraw Hook</h3>
      </div>

      <div className="w-88 h-88 border-2 border-line bg-bg p-8 shadow-hover flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-56 h-56 overflow-visible" fill="none">
          <circle cx="50" cy="50" r="40" stroke="var(--line-soft)" strokeWidth="6" />
          <path
            ref={pathRef as any}
            d="M 10 50 A 40 40 0 0 0 90 50 A 40 40 0 0 0 10 50"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="square"
          />
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 20. USE MAGNETIC DEMO
// ==========================================
export function HeadlessMagneticDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const strength = knobs.strength ?? 0.4;
  const radius = knobs.radius ?? 180;
  const btnRef = useRef<HTMLButtonElement>(null);
  useMagnetic(btnRef, { strength, radius });

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [HEADLESS SPRING MAGNETISM]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useMagnetic Hook</h3>
      </div>

      <button
        ref={btnRef}
        className="px-10 py-5 border-2 border-line bg-bg text-fg hover:bg-accent hover:text-black font-black font-mono text-lg shadow-rest cursor-pointer transition-colors uppercase"
      >
        Headless Magnetic Button
      </button>
    </div>
  );
}

// ==========================================
// 21. USE SCROLL TIMELINE DEMO
// ==========================================
export function TimelineChoreographyDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const cardRef = useRef<HTMLDivElement | null>(null);

  useScrollTimeline(cardRef as any, {
    keyframes: {
      opacity: [0.2, 1, 0.3],
      scale: [0.8, 1.1, 0.9],
      rotate: [-15, 0, 15],
    },
  });

  return (
    <div className="w-full min-h-[220vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [CHOREOGRAPHED MULTI-KEYFRAME]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useScrollTimeline Hook</h3>
        <p className="text-xs text-muted font-mono">0% (Scale 0.8) → 50% (Scale 1.1) → 100% (Scale 0.9)</p>
      </div>

      <div
        ref={cardRef as any}
        className="sticky top-40 w-88 h-88 border-2 border-line bg-bg p-8 shadow-hover flex flex-col justify-between"
      >
        <span className="text-xs font-mono text-accent font-black uppercase">KEYFRAME SEQUENCER</span>
        <h4 className="text-2xl font-black uppercase text-fg">Multi-Stage Choreography</h4>
        <span className="text-xs font-mono text-muted font-bold uppercase">0 Virtual DOM Re-renders</span>
      </div>
    </div>
  );
}

// ==========================================
// 22. USE SCROLL DIRECTION DEMO
// ==========================================
export function AutoHideHeaderDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const thresholdDown = knobs.thresholdDown ?? 15;
  const thresholdUp = knobs.thresholdUp ?? 25;
  const navRef = useRef<HTMLDivElement>(null);
  const { direction, isAtTop } = useScrollDirection(navRef, {
    thresholdDown,
    thresholdUp,
  });

  return (
    <div className="w-full min-h-[200vh] relative pt-24 px-4">
      {/* Auto Hiding Bar */}
      <div
        ref={navRef}
        className="fixed top-20 left-1/2 -translate-x-1/2 w-11/12 max-w-xl border-2 border-line bg-bg px-6 py-4 flex items-center justify-between shadow-rest z-40 transition-transform duration-300"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-accent animate-pulse" />
          <span className="font-black text-fg uppercase text-sm font-mono">Auto-Hiding Floating Bar</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-muted">DIR:</span>
          <span className="text-accent font-black uppercase">{direction}</span>
          <span
            className={`px-2 py-0.5 border-2 text-[10px] font-bold uppercase ${
              isAtTop ? 'border-accent text-accent bg-bg' : 'border-line-soft text-muted bg-bg'
            }`}
          >
            {isAtTop ? 'AT TOP (GUARD)' : 'SCROLLED'}
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto text-center mt-32 space-y-4">
        <h4 className="text-2xl font-black uppercase text-fg">iOS Rubber-Band Guard &amp; Hysteresis</h4>
        <p className="text-xs text-muted leading-relaxed font-mono">
          Scroll down past {thresholdDown}px to hide the floating bar. Scroll up past {thresholdUp}px to reveal it. When at the top of the page, the iOS rubber-band guard locks direction to &apos;up&apos; to prevent false hide glitches.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 23. USE TICKER DEMO (Zero Re-renders)
// ==========================================
export function HighPrecisionTickerDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const lastTimeRef = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  useTicker((_dt, _elapsed, current) => {
    const now = current;
    if (now - lastTimeRef.current >= 250) {
      if (fpsRef.current) {
        const { fps, isIdle, targetFps } = ticker.getFrameRate();
        const displayFps = isIdle ? targetFps : fps;
        fpsRef.current.textContent = isIdle ? `${displayFps} FPS (idle)` : `${displayFps} FPS`;
      }
      lastTimeRef.current = now;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#DFFF00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const time = now * 0.003;
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.05 + time) * 25;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, 'render');

  return (
    <div className="w-full min-h-[120vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [SCROLLCRAFT 4-STAGE GAME LOOP // 0 RE-RENDERS]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useTicker (Phase: render)</h3>
      </div>

      <div className="border-2 border-line bg-bg p-8 shadow-rest text-center space-y-4">
        <canvas ref={canvasRef} width={340} height={120} className="border-2 border-line-soft bg-zinc-950" />
        <div className="font-mono text-xs text-muted font-bold uppercase">
          Ticker Loop Framerate:{' '}
          <span ref={fpsRef} className="text-accent font-black text-sm">
            60 FPS
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 24. USE RENDER TRACKER DEMO
// ==========================================
export function ZeroRerenderAuditDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const audit = useRenderTracker('ZeroRerenderAuditDemo');

  return (
    <div className="w-full min-h-[160vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [ZERO-RERENDER ARCHITECTURE AUDIT]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">useRenderTracker Hook</h3>
      </div>

      <div className="w-96 border-2 border-line bg-bg p-8 shadow-rest text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <span className="text-xs font-mono text-accent font-black uppercase">
            Virtual DOM Integrity
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 font-mono">
          <div className="p-4 border-2 border-line-soft bg-zinc-950">
            <span className="text-[10px] text-muted block uppercase">INITIAL MOUNT</span>
            <span className="text-2xl font-black text-fg">{audit.renderCount}</span>
          </div>
          <div className="p-4 border-2 border-line-soft bg-zinc-950">
            <span className="text-[10px] text-muted block uppercase">DURING SCROLL</span>
            <span className="text-2xl font-black text-accent">{audit.rendersWhileScrolling}</span>
          </div>
        </div>

        <p className="text-xs text-muted leading-relaxed font-mono">
          ScrollCraft components mutate transforms directly on GPU layers. React never diffs or re-renders the component during scroll gestures.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 25. USE SCROLL RESTORATION DEMO (Interactive Checkpoints & Smooth Glide)
// ==========================================
export function RouteRestorationDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const { scrollTo, subscribe } = useScrollCraft();
  const { savePosition, restorePosition, savedPosition } = useScrollRestoration({
    routeKey: '/test/use-scroll-restoration',
  });

  const [localSavedPos, setLocalSavedPos] = useState<number | null>(savedPosition ?? null);
  const activeSaved = localSavedPos ?? savedPosition;

  useEffect(() => {
    if (savedPosition !== null) {
      setLocalSavedPos(savedPosition);
    }
  }, [savedPosition]);

  const scrollYDisplayRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const jumpTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (jumpTimerRef.current) {
        clearTimeout(jumpTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const unsub = subscribe((metrics) => {
      if (scrollYDisplayRef.current) {
        scrollYDisplayRef.current.textContent = `${Math.round(metrics.scroll)}px`;
      }
    });
    return unsub;
  }, [subscribe]);

  const handleSave = () => {
    savePosition();
    const cur = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0;
    const rounded = Math.round(cur);
    setLocalSavedPos(rounded);
    if (statusRef.current) {
      statusRef.current.textContent = `Bookmark recorded at ${rounded}px`;
    }
  };

  const handleSmoothGlideToSaved = () => {
    if (activeSaved !== null && activeSaved !== undefined) {
      if (statusRef.current) {
        statusRef.current.textContent = `Gliding smoothly to saved bookmark (${activeSaved}px)...`;
      }
      scrollTo(activeSaved, { duration: 1.2 });
    }
  };

  const handleSmoothResetTop = () => {
    if (statusRef.current) {
      statusRef.current.textContent = 'Gliding smoothly to top (0px)...';
    }
    scrollTo(0, { duration: 1.0 });
  };

  const handleInstantRestore = () => {
    if (statusRef.current) {
      statusRef.current.textContent = `Instant browser restore to ${activeSaved ?? 0}px`;
    }
    restorePosition();
  };

  const checkpoints = [
    {
      id: 'alpha',
      name: 'Checkpoint Alpha — Hero & Introduction',
      y: 450,
      desc: 'Top section of document. Tests short-range scroll restoration.',
    },
    {
      id: 'beta',
      name: 'Checkpoint Beta — Interactive Canvas Lab',
      y: 1100,
      desc: 'Mid-document rich canvas state. Common reading depth for articles.',
    },
    {
      id: 'gamma',
      name: 'Checkpoint Gamma — Architecture & Spec Registry',
      y: 1750,
      desc: 'Deep document milestone. Demonstrates restoration survival across deep layout shifts.',
    },
  ];

  return (
    <div className="w-full min-h-[260vh] pt-16 pb-32">
      {/* Sticky Interactive Command Center */}
      <div className="sticky top-20 z-30 max-w-2xl mx-auto px-4 mb-16">
        <div className="border-2 border-line bg-bg p-6 shadow-rest space-y-5">
          <div className="flex items-center justify-between border-b-2 border-line-soft pb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono font-black text-fg uppercase tracking-wider">
                Route Restoration Controller
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-muted">LIVE Y:</span>
              <span ref={scrollYDisplayRef} className="text-accent font-bold">
                0px
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 border-2 border-line-soft bg-zinc-950 text-xs font-mono">
              <span className="text-muted block mb-1 uppercase font-bold">SAVED IN STORAGE:</span>
              <span className="text-accent font-black text-lg">
                {activeSaved !== null ? `${activeSaved}px` : 'No Bookmark Saved'}
              </span>
            </div>
            <div className="p-3.5 border-2 border-line-soft bg-zinc-950 text-xs font-mono">
              <span className="text-muted block mb-1 uppercase font-bold">STATUS:</span>
              <span ref={statusRef} className="text-fg font-bold text-xs">
                {activeSaved !== null ? 'Bookmark ready in sessionStorage' : 'Click "Save Bookmark" below'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={handleSave}
              className="px-4 py-2 border-2 border-line bg-bg hover:bg-accent hover:text-black text-fg text-xs font-mono font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-rest"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Save Current Y
            </button>
            <button
              onClick={handleSmoothGlideToSaved}
              disabled={activeSaved === null}
              className="px-4 py-2 border-2 border-line bg-bg hover:bg-accent hover:text-black disabled:opacity-40 disabled:hover:bg-bg disabled:hover:text-fg text-xs font-mono font-bold uppercase text-fg transition-colors cursor-pointer flex items-center gap-1.5 shadow-rest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Smooth Glide
            </button>
            <button
              onClick={handleInstantRestore}
              disabled={activeSaved === null}
              className="px-4 py-2 border-2 border-line-soft bg-zinc-950 hover:bg-line-soft/40 disabled:opacity-40 text-xs font-mono font-bold uppercase text-fg transition-colors cursor-pointer"
            >
              Instant Restore
            </button>
            <button
              onClick={handleSmoothResetTop}
              className="px-4 py-2 border-2 border-line-soft bg-bg hover:bg-accent hover:text-black text-xs font-mono font-bold uppercase text-fg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Top (0px)
            </button>
          </div>
        </div>
      </div>

      {/* Visual Checkpoints Runway */}
      <div className="max-w-2xl mx-auto px-4 space-y-48 pt-12">
        {checkpoints.map((cp, idx) => (
          <div
            key={cp.id}
            className="border-2 border-line bg-bg p-8 shadow-rest relative space-y-4"
          >
            <div className="flex items-center justify-between border-b-2 border-line-soft pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-black uppercase tracking-wider text-accent">
                  CHECKPOINT 0{idx + 1}
                </span>
              </div>
              <span className="text-xs font-mono px-3 py-1 border-2 border-line-soft bg-zinc-950 text-fg font-bold uppercase">
                TARGET Y: {cp.y}PX
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-black uppercase text-fg">{cp.name}</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed font-mono">{cp.desc}</p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t-2 border-line-soft">
              <button
                onClick={() => {
                  scrollTo(cp.y, { duration: 1.0 });
                }}
                className="px-4 py-2 border-2 border-line bg-bg hover:bg-accent hover:text-black text-xs font-mono font-bold text-fg uppercase transition-colors cursor-pointer"
              >
                Scroll to {cp.y}px →
              </button>
              <button
                onClick={() => {
                  scrollTo(cp.y, { duration: 0.8 });
                  if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
                  jumpTimerRef.current = setTimeout(() => savePosition(), 900);
                }}
                className="px-4 py-2 border-2 border-accent bg-bg hover:bg-accent hover:text-black text-xs font-mono font-bold text-accent uppercase transition-colors cursor-pointer"
              >
                Jump &amp; Save Bookmark
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 26. USE SCROLL CRAFT DEMO (Direct DOM Writes)
// ==========================================
export function EngineMetricsDemoStage({ knobs }: { knobs: Record<string, any> }) {
  void knobs;
  const { subscribe } = useScrollCraft();
  const tier = useScrollCraftTier();
  const scrollRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let last = 0;
    const unsub = subscribe((m) => {
      const now = performance.now();
      if (now - last < 25) return;
      last = now;

      if (scrollRef.current) scrollRef.current.textContent = `${Math.round(m.scroll)}px`;
      if (progressRef.current) progressRef.current.textContent = `${(m.progress * 100).toFixed(1)}%`;
      if (velocityRef.current) velocityRef.current.textContent = m.velocity.toFixed(2);
    });
    return unsub;
  }, [subscribe]);

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [DIRECT DOM ENGINE TELEMETRY // 0 RE-RENDERS]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">Engine Telemetry &amp; Tiers</h3>
      </div>

      <div className="max-w-md w-full border-2 border-line bg-bg p-8 shadow-rest space-y-6">
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-4 border-2 border-line-soft bg-zinc-950">
            <span className="text-muted block text-[10px] uppercase font-bold">SCROLL Y</span>
            <span ref={scrollRef} className="text-fg font-black text-lg">
              0px
            </span>
          </div>
          <div className="p-4 border-2 border-line-soft bg-zinc-950">
            <span className="text-muted block text-[10px] uppercase font-bold">PROGRESS</span>
            <span ref={progressRef} className="text-accent font-black text-lg">
              0.0%
            </span>
          </div>
          <div className="p-4 border-2 border-line-soft bg-zinc-950">
            <span className="text-muted block text-[10px] uppercase font-bold">VELOCITY</span>
            <span ref={velocityRef} className="text-fg font-black text-lg">
              0.00
            </span>
          </div>
          <div className="p-4 border-2 border-line-soft bg-zinc-950">
            <span className="text-muted block text-[10px] uppercase font-bold">HARDWARE TIER</span>
            <span className="text-accent font-black uppercase text-lg">{tier}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
