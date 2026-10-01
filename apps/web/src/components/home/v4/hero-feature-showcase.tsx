'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useScrollCraft } from '@scrollcraft/react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type ShowcaseTab = 'sequence' | 'parallax' | 'reveal' | 'pin';

const TOTAL_FRAMES = 90;
const FRAME_PATHS = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/sequence/chrono-watch/frame-${String(i + 1).padStart(3, '0')}.webp`
);

export function HeroFeatureShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('sequence');
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for zero-rerender direct updates
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxStageRef = useRef<HTMLDivElement>(null);
  const revealMaskRef = useRef<HTMLDivElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const scrubThumbRef = useRef<HTMLDivElement>(null);
  const scrubTrackRef = useRef<HTMLDivElement>(null);
  const frameTextRef = useRef<HTMLSpanElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // Cached frame images for instantaneous canvas playback
  const imagesCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrameRef = useRef<number>(1);
  const currentProgressRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const animFrameId = useRef<number>(0);

  const { subscribe } = useScrollCraft();

  function renderImgToCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;

    let dw: number, dh: number, dx: number, dy: number;
    if (imgRatio > canvasRatio) {
      dw = w;
      dh = w / imgRatio;
      dx = 0;
      dy = (h - dh) / 2;
    } else {
      dh = h;
      dw = h * imgRatio;
      dx = (w - dw) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // Draw a specific frame to canvas
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const clampedFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameNum)));
    currentFrameRef.current = clampedFrame;

    let img = imagesCache.current.get(clampedFrame);
    if (!img) {
      img = new window.Image();
      img.src = FRAME_PATHS[clampedFrame - 1];
      imagesCache.current.set(clampedFrame, img);
      img.onload = () => {
        if (currentFrameRef.current === clampedFrame && canvasRef.current) {
          renderImgToCanvas(canvasRef.current, img!);
        }
      };
    }

    if (img.complete && img.naturalWidth > 0) {
      renderImgToCanvas(canvas, img);
    }
  }, []);

  // Preload initial batch of frames around current position
  useEffect(() => {
    const preloadCount = 20;
    for (let i = 1; i <= preloadCount; i++) {
      if (!imagesCache.current.has(i)) {
        const img = new window.Image();
        img.src = FRAME_PATHS[i - 1];
        imagesCache.current.set(i, img);
      }
    }
  }, []);

  // Update visual elements across all tabs directly on DOM without React re-rendering
  const updateVisuals = useCallback((progress: number) => {
    const p = Math.max(0, Math.min(1, progress));
    currentProgressRef.current = p;

    // 1. Scrub Thumb & Percentage Text
    if (scrubThumbRef.current) {
      scrubThumbRef.current.style.left = `${(p * 100).toFixed(1)}%`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
    }

    // 2. Sequence Frame update
    const targetFrame = 1 + Math.round(p * (TOTAL_FRAMES - 1));
    if (frameTextRef.current) {
      frameTextRef.current.textContent = `FRAME ${String(targetFrame).padStart(3, '0')} / 090`;
    }
    drawFrame(targetFrame);

    // 3. Parallax stage transforms
    if (parallaxStageRef.current) {
      const offset = (p - 0.5) * 60;
      parallaxStageRef.current.style.setProperty('--para-offset', `${offset.toFixed(1)}px`);
    }

    // 4. Reveal mask clip
    if (revealMaskRef.current) {
      const clipPercent = Math.max(10, Math.min(100, p * 120));
      revealMaskRef.current.style.clipPath = `polygon(0 0, ${clipPercent}% 0, ${clipPercent}% 100%, 0 100%)`;
    }

    // 5. Pin status indicator
    if (pinTrackRef.current) {
      pinTrackRef.current.style.width = `${(p * 100).toFixed(1)}%`;
    }
  }, [drawFrame]);

  // Synchronize with natural page scroll
  useEffect(() => {
    return subscribe((m) => {
      if (!isDraggingRef.current && !isPlaying) {
        // Map the first 800px of scroll to 0 -> 1 progress for dramatic hero reaction
        const scrollFactor = Math.min(1, m.scroll / 700);
        updateVisuals(scrollFactor);
      }
    });
  }, [subscribe, updateVisuals, isPlaying]);

  // Initialize canvas on mount / tab change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      drawFrame(currentFrameRef.current);
    }
  }, [activeTab, drawFrame]);

  // Auto-play feature rotation loop
  useEffect(() => {
    if (!isPlaying) return;

    let p = currentProgressRef.current;
    const step = () => {
      p = (p + 0.006) % 1;
      updateVisuals(p);
      animFrameId.current = requestAnimationFrame(step);
    };

    animFrameId.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameId.current);
  }, [isPlaying, updateVisuals]);

  // Interactive scrubber drag handler
  const handleScrubPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = scrubTrackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const p = x / rect.width;
    updateVisuals(p);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl border border-paper/15 bg-panel p-3 sm:p-5 shadow-[8px_8px_0px_#0e1210] flex flex-col justify-between overflow-hidden"
    >
      {/* Top Header: Mode Switcher & Engine Live Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-paper/10">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'sequence', label: '01 // 360° SEQUENCE' },
            { id: 'parallax', label: '02 // 3D PARALLAX' },
            { id: 'reveal', label: '03 // CLIP REVEAL' },
            { id: 'pin', label: '04 // STICKY PIN' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ShowcaseTab)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-lime text-ink shadow-sm'
                  : 'text-paper/50 hover:text-paper hover:bg-paper/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-lime">
          <span className="size-1.5 rounded-full bg-lime animate-pulse" />
          <span className="hidden sm:inline">0 VDOM RE-RENDERS</span>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div className="relative w-full h-[320px] sm:h-[360px] my-3 rounded-xl border border-paper/10 bg-ink flex items-center justify-center overflow-hidden">
        
        {/* =========================================================
            TAB 1: SCROLL SEQUENCE (360° Chrono Watch Canvas)
            ========================================================= */}
        {activeTab === 'sequence' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Radial Light Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,254,0,0.06)_0%,transparent_70%)] pointer-events-none" />

            {/* Direct HTML5 Canvas: 0 React Re-renders during 360 rotation */}
            <canvas
              ref={canvasRef}
              className="relative z-10 w-full h-full max-h-[300px] object-contain cursor-grab active:cursor-grabbing"
              onPointerDown={() => { isDraggingRef.current = true; }}
              onPointerUp={() => { isDraggingRef.current = false; }}
              onPointerMove={(e) => {
                if (isDraggingRef.current && containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  updateVisuals(p);
                }
              }}
            />

            {/* Technical HUD Floating Overlay Tags */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 font-mono text-[9px] text-paper/60 pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-panel/90 border border-paper/15 text-paper font-semibold">
                TITANIUM GRADE 5 · 40MM
              </span>
              <span className="px-2 py-0.5 rounded bg-panel/90 border border-paper/15 text-lime">
                HIGH-FREQUENCY 36,000 VPH
              </span>
            </div>

            <div className="absolute bottom-3 right-3 z-20 font-mono text-[9px] text-paper/40 pointer-events-none text-right">
              <div>&lt;ScrollSequence /&gt; DOGFOOD</div>
              <div className="text-paper/60">HTML5 2D CANVAS · 90 FRAMES</div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: PARALLAX 3D (Multi-Layer Photography Stage)
            ========================================================= */}
        {activeTab === 'parallax' && (
          <div
            ref={parallaxStageRef}
            className="relative w-full h-full flex items-center justify-center select-none"
          >
            {/* Background Layer: Moody Dusk Mountain (Speed -0.2) */}
            <div
              className="absolute w-[260px] sm:w-[320px] h-[180px] rounded-xl overflow-hidden border border-paper/20 shadow-lg -translate-x-12 -translate-y-8 opacity-75"
              style={{
                transform: 'translate3d(calc(-40px + var(--para-offset, 0px) * -0.5), calc(-20px + var(--para-offset, 0px) * -0.3), 0)',
                transition: 'transform 80ms ease-out',
              }}
            >
              <Image
                src="/hero/mountain-moody.webp"
                alt="Moody Mountain"
                fill
                sizes="320px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/40" />
              <div className="absolute top-2 left-2 text-[9px] font-mono text-paper/70 bg-ink/80 px-1.5 py-0.5 rounded">
                DEPTH: -0.2x
              </div>
            </div>

            {/* Foreground Hero Layer: Snow Mountain Peak (Speed +0.35) */}
            <div
              className="relative z-10 w-[280px] sm:w-[340px] h-[200px] rounded-xl overflow-hidden border-2 border-paper/30 shadow-[6px_6px_0px_#0e1210]"
              style={{
                transform: 'translate3d(calc(var(--para-offset, 0px) * 0.8), calc(var(--para-offset, 0px) * 0.4), 0)',
                transition: 'transform 80ms ease-out',
              }}
            >
              <Image
                src="/hero/mountain-snow.webp"
                alt="Snow Mountain"
                fill
                sizes="340px"
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-paper bg-ink/80 px-2.5 py-1 rounded border border-paper/15">
                <span className="text-lime font-bold">&lt;Parallax speed=&#123;0.35&#125; /&gt;</span>
                <span>SUBPIXEL GLIDE</span>
              </div>
            </div>

            {/* Detail Floating Badge (Speed +0.5) */}
            <div
              className="absolute z-20 bottom-4 left-6 px-3 py-1.5 rounded-lg border border-lime/40 bg-panel text-[10px] font-mono text-paper shadow-md"
              style={{
                transform: 'translate3d(calc(var(--para-offset, 0px) * 1.2), calc(var(--para-offset, 0px) * 0.6), 0)',
                transition: 'transform 80ms ease-out',
              }}
            >
              <span className="text-lime font-bold">Z-DEPTH: 40px</span> · COMPOSITOR LERPED
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: REVEAL MASK (SSR-Safe Typography & Clip)
            ========================================================= */}
        {activeTab === 'reveal' && (
          <div className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-center">
            <div className="text-[10px] font-mono text-paper/50 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="size-2 bg-lime" />
              <span>data-scrollcraft-reveal=&quot;active&quot; · ZERO FOUC</span>
            </div>

            {/* Clip Mask Container */}
            <div
              ref={revealMaskRef}
              className="relative p-6 rounded-xl border border-lime/30 bg-panel/80 transition-all"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              }}
            >
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-paper tracking-tight leading-tight">
                SSR-safe reveal.<br />
                <span className="text-lime">Zero hydration flash.</span>
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-paper/70 font-body leading-relaxed max-w-md">
                Guarantees pre-rendered server HTML displays instantly during Next.js streaming hydration. Wipes in on subpixel clip paths with zero layout shift.
              </p>
              <div className="mt-4 pt-3 border-t border-paper/10 flex items-center justify-between font-mono text-[10px] text-paper/40">
                <span>WIPE: DIRECTION=&quot;UP&quot;</span>
                <span className="text-lime">INTERSECTIONOBSERVER POOLED</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: PINNED STAGE (GSAP 4-State Lifecycle)
            ========================================================= */}
        {activeTab === 'pin' && (
          <div className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-paper/10 pb-3">
              <span className="font-mono text-xs text-lime font-bold uppercase">
                &lt;Pin /&gt; Sticky Runway Solver
              </span>
              <span className="font-mono text-[10px] text-paper/50">
                CONTAINING BLOCK SAFE
              </span>
            </div>

            {/* Pinned Card Demonstration */}
            <div className="p-5 rounded-xl border-2 border-paper/20 bg-panel shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono text-paper mb-2">
                <span className="font-bold">STATUS: PINNED RUNWAY</span>
                <span className="text-lime">4-STATE LIFECYCLE</span>
              </div>
              <p className="text-xs text-paper/60 font-body">
                Holds element sticky in place while scroll timeline advances. Automatically unpins and tears down ghost spacers upon exit.
              </p>

              {/* Progress Track */}
              <div className="mt-4 w-full h-1.5 bg-ink rounded-full overflow-hidden border border-paper/10">
                <div
                  ref={pinTrackRef}
                  className="h-full bg-lime transition-all duration-75"
                  style={{ width: '40%' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] text-paper/40 pt-2 border-t border-paper/10">
              <span>onEnter &rarr; onUpdate &rarr; onLeave</span>
              <span className="text-lime">SPACER AUTO-TEARDOWN</span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Controls & Interactive Scrubber Rail */}
      <div className="flex flex-col gap-2 pt-2 border-t border-paper/10">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded bg-ink hover:bg-paper/10 text-paper/80 hover:text-lime transition-colors cursor-pointer"
              title={isPlaying ? 'Pause timeline' : 'Auto-play sequence'}
            >
              {isPlaying ? <Pause className="size-3" /> : <Play className="size-3" />}
            </button>
            <button
              type="button"
              onClick={() => updateVisuals(0)}
              className="p-1.5 rounded bg-ink hover:bg-paper/10 text-paper/60 hover:text-paper transition-colors cursor-pointer"
              title="Reset timeline"
            >
              <RotateCcw className="size-3" />
            </button>
            <span ref={frameTextRef} className="text-paper/70 font-semibold">
              FRAME 001 / 090
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-paper/40 uppercase">PROGRESS:</span>
            <span ref={progressTextRef} className="font-bold text-lime">
              0%
            </span>
          </div>
        </div>

        {/* Interactive Scrub Track */}
        <div
          ref={scrubTrackRef}
          onPointerDown={(e) => {
            isDraggingRef.current = true;
            handleScrubPointer(e);
          }}
          onPointerUp={() => { isDraggingRef.current = false; }}
          onPointerMove={(e) => {
            if (isDraggingRef.current) handleScrubPointer(e);
          }}
          className="relative w-full h-3 bg-ink rounded-full border border-paper/15 cursor-ew-resize flex items-center px-1 group"
        >
          {/* Thumb indicator */}
          <div
            ref={scrubThumbRef}
            className="absolute -top-1 -ml-2 size-5 rounded-full bg-lime border-2 border-ink shadow-md pointer-events-none transition-transform group-hover:scale-110"
            style={{ left: '0%' }}
          />
        </div>
      </div>
    </div>
  );
}
