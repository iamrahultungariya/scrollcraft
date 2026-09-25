'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Parallax } from '@scrollcraft/react';
import { ArrowDown } from 'lucide-react';

export function Hero3DStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tilt effect directly mutating style.transform without React re-renders
  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 14; // degrees
      targetY = -y * 14; // degrees
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const updateTilt = () => {
      // Smooth lerp
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (stage) {
        stage.style.transform = `rotateX(${10 + currentY}deg) rotateY(${-16 + currentX}deg) rotateZ(-3deg)`;
      }

      rafId = requestAnimationFrame(updateTilt);
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    rafId = requestAnimationFrame(updateTilt);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] sm:h-[600px] flex items-center justify-center select-none overflow-visible"
    >
      {/* Ambient Backlight for 3D Stage */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-tr from-violet-600/15 via-blue-600/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10"
      />

      {/* Left Timeline Axis */}
      <div className="absolute left-1 sm:left-4 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent flex flex-col items-center justify-center z-30 pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.9)] mb-auto mt-12" />

        {/* Scroll Indicator Pill */}
        <div className="my-auto px-2.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800 text-[10px] font-mono text-zinc-400 shadow-xl flex flex-col items-center gap-1 backdrop-blur-md pointer-events-auto">
          <span className="text-[9px] tracking-wider uppercase text-zinc-300">Scroll</span>
          <ArrowDown className="w-3 h-3 text-violet-400 animate-bounce" />
        </div>

        <div className="w-2 h-2 rounded-full bg-zinc-700 mt-auto mb-12" />
      </div>

      {/* 3D Isometric Viewport */}
      <div
        className="relative w-full max-w-[480px] sm:max-w-[540px] h-full flex items-center justify-center [perspective:1200px]"
      >
        <div
          ref={stageRef}
          className="relative w-[340px] sm:w-[420px] h-[340px] flex items-center justify-center [transform-style:preserve-3d] transition-transform duration-75 will-change-transform"
          style={{
            transform: 'rotateX(10deg) rotateY(-16deg) rotateZ(-3deg)',
          }}
        >
          {/* Layer 0: Deepest Glass Plate & Perspective Coordinates */}
          <Parallax speed={-0.18} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[360px] sm:w-[440px] h-[260px] rounded-3xl bg-white/[0.015] border border-white/[0.08] backdrop-blur-[2px] shadow-2xl -translate-x-12 -translate-y-8 flex flex-col justify-between p-4"
              style={{ transform: 'translateZ(-80px)' }}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
                <span>Z: -80px // HARDWARE COMPOSITE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              </div>
              <div className="text-[10px] font-mono text-zinc-700 text-right">
                PARALLAX DEPTH 0.18x
              </div>
            </div>
          </Parallax>

          {/* Layer 1: Moody Dusk Mountain Card (Back Right) */}
          <Parallax speed={0.1} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="relative w-[300px] sm:w-[380px] h-[210px] rounded-2xl overflow-hidden border border-white/[0.12] shadow-2xl translate-x-12 -translate-y-12 bg-zinc-900 group"
              style={{ transform: 'translateZ(-20px)' }}
            >
              <Image
                src="/hero/mountain-moody.webp"
                alt="Atmospheric Mountain Range"
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-300">
                <span className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10">02 // SUB_FRAME</span>
              </div>
            </div>
          </Parallax>

          {/* Layer 2: Translucent Frosted Glass Slab */}
          <Parallax speed={-0.1} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[280px] sm:w-[360px] h-[190px] rounded-2xl bg-white/[0.03] border border-white/[0.14] backdrop-blur-sm shadow-xl translate-x-4 -translate-y-4"
              style={{ transform: 'translateZ(15px)' }}
            />
          </Parallax>

          {/* Layer 3: Foreground Snowy Mountain Peak Card (HERO PHOTO) */}
          <Parallax speed={0.24} className="absolute inset-0 flex items-center justify-center z-20">
            <div
              className="relative w-[320px] sm:w-[410px] h-[240px] rounded-2xl overflow-hidden border border-white/[0.22] shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-zinc-950 group cursor-pointer"
              style={{ transform: 'translateZ(55px)' }}
            >
              <Image
                src="/hero/mountain-snow.webp"
                alt="Snowy Mountain Peaks"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 410px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Corner specular gloss */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none" />
              {/* Card Label */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <div className="px-2 py-1 rounded-md bg-black/70 border border-white/15 text-[11px] font-mono text-white flex items-center gap-2 backdrop-blur-md shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>120 FPS Native Sync</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded bg-black/60 border border-white/10 backdrop-blur-md">
                  01 // PRIMARY
                </div>
              </div>
            </div>
          </Parallax>

          {/* Layer 4: Bottom Architectural Interior Card */}
          <Parallax speed={0.38} className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div
              className="relative w-[280px] sm:w-[350px] h-[190px] rounded-2xl overflow-hidden border border-white/[0.18] shadow-[0_20px_50px_rgba(0,0,0,0.8)] translate-x-8 translate-y-28 bg-zinc-900 group"
              style={{ transform: 'translateZ(35px)' }}
            >
              <Image
                src="/hero/interior-plant.webp"
                alt="Architectural Interior"
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-200">
                <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10">03 // VIEW_TRANSFORM</span>
              </div>
            </div>
          </Parallax>

          {/* Layer 5: Floating Right Wireframe Plate */}
          <Parallax speed={-0.22} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              className="w-[180px] sm:w-[220px] h-[220px] rounded-2xl bg-white/[0.025] border border-white/[0.18] backdrop-blur-sm translate-x-36 translate-y-8 shadow-2xl"
              style={{ transform: 'translateZ(75px)' }}
            />
          </Parallax>
        </div>
      </div>

      {/* Right Timeline Milestones */}
      <div className="absolute right-0 sm:right-2 top-8 bottom-8 flex flex-col justify-between z-30 pointer-events-none hidden md:flex">
        {/* Milestone 1: Scroll Sequence */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.9)] ring-4 ring-violet-500/20" />
          <div className="w-6 h-px bg-zinc-800" />
          <div className="px-3 py-2 rounded-xl bg-zinc-950/90 border border-zinc-800 text-left shadow-lg backdrop-blur-md pointer-events-auto">
            <div className="text-xs font-semibold text-white font-mono">Scroll Sequence</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Pin &bull; Scrub &bull; Reveal</div>
          </div>
        </div>

        {/* Milestone 2: ViewTimeline */}
        <div className="flex items-center gap-3 my-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.9)] ring-4 ring-violet-500/20" />
          <div className="w-6 h-px bg-zinc-800" />
          <div className="px-3 py-2 rounded-xl bg-zinc-950/90 border border-zinc-800 text-left shadow-lg backdrop-blur-md pointer-events-auto">
            <div className="text-xs font-semibold text-white font-mono">ViewTimeline</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Native driver</div>
          </div>
        </div>

        {/* Milestone 3: GPU Composited */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.9)] ring-4 ring-violet-500/20" />
          <div className="w-6 h-px bg-zinc-800" />
          <div className="px-3 py-2 rounded-xl bg-zinc-950/90 border border-zinc-800 text-left shadow-lg backdrop-blur-md pointer-events-auto">
            <div className="text-xs font-semibold text-white font-mono">GPU Composited</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Transform &bull; Opacity &bull; Filter</div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2.5 text-xs font-mono text-zinc-500 z-20 pointer-events-none">
        <span className="text-zinc-400 font-semibold">01</span>
        <div className="w-24 sm:w-36 h-0.5 bg-zinc-850 rounded-full overflow-hidden">
          <div className="h-full w-2/5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
