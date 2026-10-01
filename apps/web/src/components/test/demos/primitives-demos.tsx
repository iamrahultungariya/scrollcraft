'use client';

import React, { useRef } from 'react';
import {
  Parallax,
  Reveal,
  Pin,
  PinContainer,
  ScrollProgress,
  ScrollTransform,
  ScrollDraw,
} from '@scrollcraft/react';
import { ArrowDown, Lock } from 'lucide-react';

// ==========================================
// 1. PARALLAX DEMO
// ==========================================
export function ParallaxDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const speed = knobs.speed ?? 0.35;
  const bleed = knobs.bleed ?? true;

  return (
    <div className="relative w-full min-h-[200vh] flex flex-col items-center justify-start pt-32 select-none">
      {/* Visual Scroll Guide Markers */}
      <div className="absolute top-12 left-6 font-mono text-xs text-muted flex items-center gap-2 font-bold uppercase">
        <ArrowDown className="w-3.5 h-3.5 text-accent animate-bounce" />
        <span>Scroll down to test multi-speed depth parallax</span>
      </div>

      {/* Background Plane (Reverse Parallax) */}
      <Parallax speed={-0.3} bleed={bleed} className="w-full max-w-4xl px-4 pointer-events-none">
        <div className="w-full h-64 border-2 border-line-soft bg-zinc-950 p-8 flex items-end">
          <span className="font-mono text-xs text-muted uppercase tracking-widest font-bold">
            [BACKGROUND DEPTH PLANE // SPEED: -0.30X]
          </span>
        </div>
      </Parallax>

      {/* Midground Plane */}
      <Parallax speed={0.15} bleed={bleed} className="w-full max-w-2xl px-4 mt-8 z-10">
        <div className="border-2 border-line-soft bg-bg p-8 shadow-rest">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-accent">Mid-Layer 0.15x</span>
            <span className="text-[10px] font-mono text-muted">origin=&quot;auto&quot;</span>
          </div>
          <h4 className="text-xl font-black uppercase text-fg mt-3">Linear Depth Translation</h4>
          <p className="text-xs text-muted mt-2 font-mono">
            This card moves steadily at 0.15x scroll velocity without layout jumping.
          </p>
        </div>
      </Parallax>

      {/* Foreground Hero Card (Controlled by Live Knob Speed) */}
      <Parallax speed={speed} bleed={bleed} className="w-full max-w-xl px-4 mt-12 z-20">
        <div className="border-2 border-line bg-bg p-8 shadow-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black uppercase text-accent">
              INTERACTIVE FOREGROUND
            </span>
            <span className="text-xs font-mono px-2 py-0.5 border-2 border-accent text-accent font-bold uppercase bg-bg">
              Speed: {speed}x
            </span>
          </div>
          <h3 className="text-2xl font-black uppercase text-fg mt-4">Direct GPU Compositor Parallax</h3>
          <p className="text-sm text-muted mt-2 leading-relaxed font-mono">
            Adjust the speed knob in the control bar above to see instant translation changes applied directly via GPU transforms.
          </p>
          <div className="mt-6 pt-4 border-t-2 border-line-soft flex items-center justify-between text-xs font-mono text-muted font-bold">
            <span>Bleed Protection: {bleed ? 'ENABLED' : 'DISABLED'}</span>
            <span className="text-accent">0 RE-RENDERS</span>
          </div>
        </div>
      </Parallax>
    </div>
  );
}

// ==========================================
// 2. REVEAL DEMO
// ==========================================
export function RevealDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const direction = knobs.direction ?? 'up';
  const distance = knobs.distance ?? 48;
  const blur = knobs.blur ?? 8;
  const scale = knobs.scale ?? 0.92;
  const rotateX = knobs.rotateX ?? 15;

  return (
    <div className="w-full min-h-[180vh] flex flex-col items-center justify-start pt-24 pb-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [SCROLL DOWN TO TRIGGER VIEWPORT REVEAL]
        </span>
        <h3 className="text-2xl font-black uppercase text-fg tracking-tight">Staggered Entrance Matrix</h3>
        <p className="text-xs text-muted font-mono">
          Cards enter with 3D tilt, optical blur, and directional translation when intersecting viewport.
        </p>
      </div>

      <div className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Zero Re-renders', desc: 'Compositor writes bypass React Virtual DOM.' },
          { title: '3D Rotate Perspective', desc: `Optical tilt set to ${rotateX}deg during entrance.` },
          { title: 'Optical Blur Decay', desc: `Transitions from ${blur}px blur to razor-sharp crispness.` },
          { title: 'Directional Slide', desc: `Enters from ${direction} axis across ${distance}px.` },
        ].map((item, idx) => (
          <Reveal
            key={`${idx}-${direction}-${distance}-${blur}-${rotateX}`}
            index={idx}
            stagger={0.1}
            direction={direction}
            distance={distance}
            blur={blur}
            scale={scale}
            rotateX={rotateX}
            duration={0.7}
            threshold={0.15}
            className="border-2 border-line bg-bg p-8 shadow-rest"
          >
            <span className="text-xs font-mono text-accent font-black uppercase">[STAGE 0{idx + 1}]</span>
            <h4 className="text-xl font-black uppercase text-fg mt-2">{item.title}</h4>
            <p className="text-sm text-muted mt-2 font-mono">{item.desc}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. PIN DEMO
// ==========================================
export function PinDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const top = knobs.top ?? 90;
  const pinSpacing = knobs.pinSpacing ?? false;
  const lifecycleRef = useRef<HTMLSpanElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const pushLog = (msg: string) => {
    if (lifecycleRef.current) lifecycleRef.current.textContent = msg;
    if (logRef.current) {
      const item = document.createElement('div');
      item.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      logRef.current.prepend(item);
      while (logRef.current.children.length > 5) {
        logRef.current.lastChild?.remove();
      }
    }
  };

  return (
    <PinContainer height="240vh" className="relative w-full border-y-2 border-line bg-bg">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 py-16">
        {/* Left: Sticky Pin Controller */}
        <div className="relative">
          <Pin
            top={top}
            pinSpacing={pinSpacing}
            onEnter={() => pushLog('onEnter: Pin Locked')}
            onLeave={() => pushLog('onLeave: Pin Released')}
            onEnterBack={() => pushLog('onEnterBack: Pin Re-engaged')}
            onLeaveBack={() => pushLog('onLeaveBack: Idle above trigger')}
            className="w-full border-2 border-line bg-bg p-8 shadow-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-black uppercase text-accent">
                  GSAP 4-STATE STICKY PIN
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 border-2 border-line-soft bg-bg text-muted font-bold uppercase">
                TOP: {top}PX
              </span>
            </div>

            <h3 className="text-2xl font-black uppercase text-fg mt-4">Sticky Pin Telemetry</h3>
            <p className="text-sm text-muted mt-2 font-mono">
              This panel locks at top: {top}px as you scroll through the 240vh runway. The right column cards scroll smoothly past.
            </p>

            <div className="mt-6 p-4 border-2 border-line-soft bg-zinc-950 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted uppercase">CURRENT STATUS:</span>
                <span ref={lifecycleRef} className="text-accent font-bold uppercase">
                  Idle (Before Trigger)
                </span>
              </div>
              <div className="border-t-2 border-line-soft pt-2 text-[11px] text-muted space-y-1">
                <span className="text-muted text-[10px] block uppercase font-bold">EVENT STREAM:</span>
                <div ref={logRef} className="space-y-1">
                  <span className="text-muted italic">Scroll down to trigger callbacks...</span>
                </div>
              </div>
            </div>
          </Pin>
        </div>

        {/* Right: Scrolling Milestones */}
        <div className="space-y-36 py-12">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="border-2 border-line bg-bg p-8 shadow-rest">
              <span className="text-xs font-mono text-accent font-black uppercase">[CHECKPOINT 0{step}]</span>
              <h4 className="text-xl font-black uppercase text-fg mt-2">Milestone Card #{step}</h4>
              <p className="text-sm text-muted mt-2 font-mono">
                Unconstrained scroll runway ensures the sticky positioning algorithm executes cleanly without overflow clipping.
              </p>
            </div>
          ))}
        </div>
      </div>
    </PinContainer>
  );
}

// ==========================================
// 4. SCROLL PROGRESS DEMO
// ==========================================
export function ScrollProgressDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const orientation = knobs.orientation ?? 'horizontal';
  const targetCardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full min-h-[200vh] pt-20 pb-32 space-y-16">
      {/* Top Fixed Progress Bar */}
      <ScrollProgress className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-50 origin-left" />

      <div className="max-w-3xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
            [DUAL SCOPE DEMONSTRATION]
          </span>
          <h3 className="text-3xl font-black uppercase text-fg tracking-tight">Global &amp; Target-Scoped Progress</h3>
          <p className="text-sm text-muted font-mono">
            The top bar tracks the global page. The card below tracks its own target-scoped progression.
          </p>
        </div>

        {/* Target Card with Embedded Progress Bar */}
        <div
          ref={targetCardRef}
          className="border-2 border-line bg-bg p-8 shadow-hover space-y-6"
        >
          <div className="flex items-center justify-between border-b-2 border-line-soft pb-4">
            <h4 className="text-lg font-black uppercase text-fg">Target Element Progress Track</h4>
            <span className="text-xs font-mono text-accent font-bold uppercase">
              Offset: [&apos;top bottom&apos;, &apos;bottom top&apos;]
            </span>
          </div>

          <div className="w-full h-3 bg-bg border-2 border-line p-0.5">
            <ScrollProgress
              target={targetCardRef}
              orientation={orientation}
              className="h-full bg-accent origin-left"
            />
          </div>

          <p className="text-xs text-muted leading-relaxed font-mono">
            As you scroll this card in and out of the viewport, the inner bar interpolates from 0% to 100% with direct GPU scaleX writes.
          </p>

          <div className="p-4 border-2 border-line-soft bg-zinc-950 text-xs font-mono space-y-1.5">
            <div className="flex items-center gap-2 text-accent font-black uppercase">
              <span className="h-2 w-2 bg-accent inline-block"></span>
              RENDER AUDIT ARCHITECTURE NOTE:
            </div>
            <p className="text-[11px] text-muted leading-normal">
              • Initial Render Count = 1 is expected on page load: this is React&apos;s initial mount / DOM hydration.
              <br />
              • During continuous active scrolling, re-render count remains strictly <span className="text-accent font-bold">0</span> because <code className="text-fg font-bold">useScrollProgress</code> uses observable <code className="text-fg font-bold">ScrollValue</code> scaleX updates.
            </p>
          </div>
        </div>

        {/* Extra runway content */}
        <div className="space-y-16 pt-16">
          <div className="p-8 border-2 border-line-soft bg-bg shadow-rest">
            <h5 className="font-black uppercase text-fg">Scroll Runway Buffer 1</h5>
            <p className="text-xs text-muted mt-1 font-mono">Scroll further down to test full completion.</p>
          </div>
          <div className="p-8 border-2 border-line-soft bg-bg shadow-rest">
            <h5 className="font-black uppercase text-fg">Scroll Runway Buffer 2</h5>
            <p className="text-xs text-muted mt-1 font-mono">Scroll up to observe clean reverse progression.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. SCROLL TRANSFORM DEMO
// ==========================================
export function ScrollTransformDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const preset = knobs.preset ?? '3d-flip';
  const scrub = knobs.scrub ?? true;
  const snapRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="w-full min-h-[220vh] flex flex-col items-center justify-start pt-24 pb-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [HARDWARE TRANSFORM SCRUBBING]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg tracking-tight">GPU Matrix Morphing</h3>
        <p className="text-xs text-muted font-mono">
          Preset: <span className="font-mono text-accent font-bold">{preset}</span> | Scrub: {scrub ? 'TRUE' : 'FALSE'}
        </p>
      </div>

      <div className="sticky top-40 z-20">
        <ScrollTransform
          key={`${preset}-${scrub}`}
          preset={preset}
          scrub={scrub}
          snap={knobs.snap ? true : undefined}
          onSnap={(point) => {
            if (snapRef.current) snapRef.current.textContent = `Snapped at scroll: ${point}px`;
          }}
          className="w-88 h-96 border-2 border-line bg-bg p-8 shadow-hover flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-accent uppercase font-black">PRESET: {preset}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 border-2 border-line bg-bg text-fg uppercase font-bold">
                COMPOSITOR DIRECT
              </span>
            </div>
            <h4 className="text-2xl font-black uppercase text-fg mt-4">Direct GPU Writes</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed font-mono">
              Matrices are updated directly in Ticker Phase 3 without Virtual DOM diffing.
            </p>
          </div>

          <div className="border-t-2 border-line-soft pt-4 font-mono text-xs text-muted flex items-center justify-between">
            <span className="uppercase">Snap Status:</span>
            <span ref={snapRef} className="text-accent font-bold uppercase">
              Free Scrubbing
            </span>
          </div>
        </ScrollTransform>
      </div>

      <div className="mt-[60vh] text-center font-mono text-xs text-muted uppercase">
        Scroll zone continues below to complete full transform cycle...
      </div>
    </div>
  );
}

// ==========================================
// 6. SCROLL DRAW DEMO
// ==========================================
export function ScrollDrawDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const direction = knobs.direction ?? 'forward';
  const scrub = knobs.scrub ?? true;
  const percentRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="w-full min-h-[200vh] flex flex-col items-center justify-start pt-24 pb-32">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [VECTOR PATH SYNCHRONIZATION]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg tracking-tight">SVG Geometry Drawing</h3>
        <p className="text-xs text-muted font-mono">
          Scroll progress maps synchronously to strokeDashoffset.
        </p>
      </div>

      <div className="sticky top-36 z-20 w-88 h-88 border-2 border-line bg-bg p-8 shadow-hover flex flex-col items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-64 h-64 overflow-visible" fill="none">
          {/* Background track */}
          <path
            d="M 30,100 C 30,50 70,30 100,30 C 130,30 170,50 170,100 C 170,150 130,170 100,170 C 70,170 30,150 30,100 Z"
            stroke="var(--line-soft)"
            strokeWidth="8"
            strokeLinecap="square"
          />
          {/* Dynamic ScrollDraw SVG Path */}
          <ScrollDraw
            key={`${direction}-${scrub}`}
            d="M 30,100 C 30,50 70,30 100,30 C 130,30 170,50 170,100 C 170,150 130,170 100,170 C 70,170 30,150 30,100 Z"
            stroke="var(--accent)"
            strokeWidth="8"
            strokeLinecap="square"
            direction={direction}
            scrub={scrub}
            onDrawProgress={(p) => {
              if (percentRef.current) percentRef.current.textContent = `${Math.round(p * 100)}%`;
            }}
          />
        </svg>

        <div className="mt-6 font-mono text-xs flex items-center gap-4 text-muted font-bold uppercase">
          <span>Path Drawn:</span>
          <span ref={percentRef} className="text-accent font-black text-sm">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
