'use client';

import React, { useRef, useEffect } from 'react';
import {
  StackedCards,
  VelocityMarquee,
  HorizontalScroll,
  TextReveal,
  Magnetic,
  SkewGallery,
  ScrollSequence,
  useScrollCraft,
} from '@scrollcraft/react';
import { Sparkles, Layers, Compass, Activity } from 'lucide-react';

// ==========================================
// 7. STACKED CARDS DEMO (True Cascade & Boundary Unpinning)
// ==========================================
export function StackedCardsDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const offset = knobs.offset ?? 40;
  const top = knobs.top ?? 110;
  const scaleStep = knobs.scaleStep ?? 0.05;

  const cards = [
    <div key={1} className="w-full max-w-xl mx-auto h-72 border-2 border-line bg-bg p-8 shadow-rest flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-2 border-line-soft pb-4">
        <span className="text-xs font-mono text-accent font-black uppercase tracking-wider">
          CARD 01 // PHYSICS SOLVER
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 border-2 border-line-soft text-fg bg-bg font-bold uppercase">
          Scale: 1.0 → 0.85
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-black uppercase text-fg">Hardware Compositor Deck</h4>
        <p className="text-xs text-muted mt-2 leading-relaxed font-mono">
          Direct GPU matrix writes avoid React Virtual DOM reconciliation. As Card 02 stacks above, this card smoothly scales down with spring depth.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-muted pt-2 border-t-2 border-line-soft font-bold">
        <span>Z-INDEX: 01</span>
        <span className="text-accent uppercase">■ BASE PINNED ANCHOR</span>
      </div>
    </div>,

    <div key={2} className="w-full max-w-xl mx-auto h-72 border-2 border-line bg-bg p-8 shadow-rest flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-2 border-line-soft pb-4">
        <span className="text-xs font-mono text-accent font-black uppercase tracking-wider">
          CARD 02 // LIFECYCLE SOLVERS
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 border-2 border-line-soft text-fg bg-bg font-bold uppercase">
          Scale: 1.0 → 0.90
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-black uppercase text-fg">GSAP 4-State Lifecycle</h4>
        <p className="text-xs text-muted mt-2 leading-relaxed font-mono">
          Arrives from below at 1.0 scale (larger than Card 01), stacks cleanly on top, and begins scaling down as Card 03 enters the viewport.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-muted pt-2 border-t-2 border-line-soft font-bold">
        <span>Z-INDEX: 02</span>
        <span className="text-accent uppercase">■ MID-TIER STACKING</span>
      </div>
    </div>,

    <div key={3} className="w-full max-w-xl mx-auto h-72 border-2 border-line bg-bg p-8 shadow-rest flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-2 border-line-soft pb-4">
        <span className="text-xs font-mono text-accent font-black uppercase tracking-wider">
          CARD 03 // NEXT.JS STREAMING
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 border-2 border-line-soft text-fg bg-bg font-bold uppercase">
          Scale: 1.0 → 0.95
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-black uppercase text-fg">Next.js App Router Native</h4>
        <p className="text-xs text-muted mt-2 leading-relaxed font-mono">
          Survives React 19 RSC streaming and route hydration without layout jumps. Ghost clicks on buried cards are gated via pointer-events: none.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-muted pt-2 border-t-2 border-line-soft font-bold">
        <span>Z-INDEX: 03</span>
        <span className="text-accent uppercase">■ UPPER TIER STACKING</span>
      </div>
    </div>,

    <div key={4} className="w-full max-w-xl mx-auto h-72 border-2 border-line bg-bg p-8 shadow-rest flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-2 border-line-soft pb-4">
        <span className="text-xs font-mono text-accent font-black uppercase tracking-wider">
          CARD 04 // BOUNDARY UNPINNING
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 border-2 border-line-soft text-fg bg-bg font-bold uppercase">
          Scale: 1.0 (Full Size)
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-black uppercase text-fg">Deck Termination &amp; Unpin</h4>
        <p className="text-xs text-muted mt-2 leading-relaxed font-mono">
          When the runway finishes, the entire stack naturally unpins and scrolls away with the page. Never blocks subsequent content or documentation below.
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-xs text-muted pt-2 border-t-2 border-line-soft font-bold">
        <span>Z-INDEX: 04</span>
        <span className="text-accent uppercase">■ FINAL TOP LAYER</span>
      </div>
    </div>,
  ];

  return (
    <div className="w-full pt-16 pb-24">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase">
          <Layers className="w-3.5 h-3.5" />
          <span>[TRUE STACKING CASCADE // DESKTOP RUNWAY]</span>
        </div>
        <h3 className="text-3xl font-black uppercase text-fg">Stacking Deck Solver</h3>
        <p className="text-xs text-muted font-mono">
          Offset: {offset}px | Top: {top}px | ScaleStep: {scaleStep}
        </p>
      </div>

      <StackedCards
        key={`${offset}-${top}-${scaleStep}`}
        cards={cards}
        offset={offset}
        top={top}
        scaleStep={scaleStep}
        minScale={0.85}
        cardDistance={380}
      />
    </div>
  );
}

// ==========================================
// 8. VELOCITY MARQUEE DEMO
// ==========================================
export function VelocityMarqueeDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const baseSpeed = knobs.baseSpeed ?? 1.5;
  const velocityMultiplier = knobs.velocityMultiplier ?? 0.3;

  return (
    <div className="w-full min-h-[160vh] pt-24 pb-32 flex flex-col justify-start">
      <div className="text-center max-w-md mx-auto mb-16 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [FLICK SCROLL TO ACCELERATE]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">Velocity Acceleration Ticker</h3>
        <p className="text-xs text-muted font-mono">
          Base: {baseSpeed}px/frame | Multiplier: {velocityMultiplier}
        </p>
      </div>

      <div className="space-y-6 w-full overflow-hidden">
        {/* Strip 1 (Left Direction) */}
        <VelocityMarquee
          key={`strip1-${baseSpeed}-${velocityMultiplier}`}
          baseSpeed={baseSpeed}
          velocityMultiplier={velocityMultiplier}
          direction="left"
          className="py-4 border-y-2 border-line bg-bg"
        >
          <div className="flex items-center gap-12 font-mono text-2xl font-black uppercase tracking-wider text-fg">
            <span>SCROLLCRAFT ENGINE</span>
            <span className="text-accent">■</span>
            <span>COMPOSITOR DIRECT</span>
            <span className="text-accent">■</span>
            <span>ZERO REACT RE-RENDERS</span>
            <span className="text-accent">■</span>
            <span>HARDWARE COMPOSITOR</span>
          </div>
        </VelocityMarquee>

        {/* Strip 2 (Right Direction) */}
        <VelocityMarquee
          key={`strip2-${baseSpeed}-${velocityMultiplier}`}
          baseSpeed={baseSpeed}
          velocityMultiplier={velocityMultiplier}
          direction="right"
          className="py-4 border-y-2 border-line bg-bg"
        >
          <div className="flex items-center gap-12 font-mono text-2xl font-black uppercase tracking-wider text-muted">
            <span>VELOCITY ACCELERATION</span>
            <span className="text-accent">■</span>
            <span>GSAP 4-STATE PARITY</span>
            <span className="text-accent">■</span>
            <span>REACT 19 COMPATIBLE</span>
            <span className="text-accent">■</span>
            <span>STRICT ENGINE ARCHITECTURE</span>
          </div>
        </VelocityMarquee>
      </div>

      <div className="max-w-md mx-auto mt-24 p-6 border-2 border-line-soft bg-bg shadow-rest text-center font-mono text-xs text-muted uppercase">
        Scroll rapidly up and down to observe the spring momentum decay back to cruise speed.
      </div>
    </div>
  );
}

// ==========================================
// 9. HORIZONTAL SCROLL DEMO (7 Rich Cards & Smooth Continuous Pan)
// ==========================================
export function HorizontalScrollDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const speed = knobs.speed ?? 1.5;

  const slides = [
    {
      badge: '01 / HARDWARE ENGINE',
      title: 'Compositor Matrix Pipeline',
      desc: 'Direct GPU translate3d writes bypass Virtual DOM reconciliation for guaranteed hardware motion fidelity.',
    },
    {
      badge: '02 / RE-RENDER AUDIT',
      title: 'Zero Virtual DOM Thrash',
      desc: 'Synchronous render audit tracker verifies strict 0 re-renders during high-frequency scrolling gestures.',
    },
    {
      badge: '03 / LIFECYCLE PARITY',
      title: 'GSAP 4-State Solvers',
      desc: 'onEnter, onLeave, onEnterBack, and onLeaveBack execution in centralized Ticker Phase 3.',
    },
    {
      badge: '04 / MODERN STACK',
      title: 'Next.js 15 RSC Streaming',
      desc: 'Survives React 19 server component streaming, concurrent hydration, and dynamic DOM expansion without jumps.',
    },
    {
      badge: '05 / PHYSICAL DYNAMICS',
      title: 'Spring Momentum Damping',
      desc: 'Physics-based inertia with zero layout shift. Velocity decay smoothly restores baseline speed.',
    },
    {
      badge: '06 / HIGH DPI RETINA',
      title: 'Dynamic Device Pixel Ratio',
      desc: 'Sub-pixel crispness with dynamic maxDpr clamping and LRU canvas frame caching.',
    },
    {
      badge: '07 / BUNDLE INTEGRITY',
      title: 'Sub-650 LOC Architecture',
      desc: 'Strictly audited file size guarantee ensures zero bundle bloat and clean modular treeshaking.',
    },
  ];

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto text-center py-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>[CONTINUOUS PANORAMIC PAN // 7 SLIDES]</span>
        </div>
        <h3 className="text-3xl font-black uppercase text-fg">Panoramic Deck Slider</h3>
        <p className="text-xs text-muted font-mono">
          Scroll down continuously to slide through all 7 slides with zero jitter or abrupt stops.
        </p>
      </div>

      <HorizontalScroll key={speed} speed={speed} height="350vh" className="w-full">
        <div className="flex gap-8 px-12 items-center">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="w-[460px] h-[380px] flex-shrink-0 border-2 border-line bg-bg p-8 flex flex-col justify-between shadow-rest relative"
            >
              <div className="flex items-center justify-between border-b-2 border-line-soft pb-4">
                <span className="text-xs font-mono font-black text-accent tracking-wider uppercase">
                  {slide.badge}
                </span>
                <span className="text-xs font-mono text-muted">
                  SLIDE 0{idx + 1} / 07
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-black uppercase text-fg">{slide.title}</h3>
                <p className="text-xs text-muted leading-relaxed font-mono">{slide.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-line-soft font-mono text-xs">
                <span className="text-muted">Speed: {speed}x</span>
                <span className="text-accent font-bold uppercase">Pan Active →</span>
              </div>
            </div>
          ))}
        </div>
      </HorizontalScroll>
    </div>
  );
}

// ==========================================
// 10. SCROLL SEQUENCE DEMO (Luxury Chrono Watch Product Reveal)
// ==========================================
export function ScrollSequenceDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const speed = knobs.speed ?? 1;
  const maxDpr = knobs.maxDpr ?? 2;
  const fit = (knobs.fit as 'contain' | 'cover') ?? 'contain';
  const FRAME_COUNT = 90;

  const frames = React.useMemo(
    () =>
      Array.from({ length: FRAME_COUNT }, (_, i) =>
        `/sequence/chrono-watch/frame-${String(i + 1).padStart(3, '0')}.webp`
      ),
    []
  );

  return (
    <div className="relative w-full bg-black">
      <ScrollSequence
        key={`${fit}-${speed}-${maxDpr}`}
        frames={frames}
        speed={speed}
        maxDpr={maxDpr}
        fit={fit}
        poster="/sequence/chrono-watch/poster.webp"
        height="400vh"
        className="w-full"
      >
        {/* Top Hero Overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-10 sm:top-14 z-20 flex flex-col items-center justify-center text-center px-4">
          <span className="text-xs uppercase tracking-widest text-muted font-mono font-bold">
            [CHRONO · AUTOMATIC]
          </span>
          <h1 className="mt-2 text-4xl sm:text-6xl font-black uppercase tracking-tight text-fg">
            Engineered Precision.
          </h1>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-muted font-mono">
            Scroll to explore the 360° internal mechanics, ceramic tachymeter bezel, and high-frequency escapement.
          </p>
        </div>

        {/* Floating Spec Badges Left & Right (Mid-Scroll visual interest) */}
        <div className="pointer-events-none absolute inset-y-0 left-6 sm:left-12 z-20 hidden md:flex flex-col justify-center gap-4">
          <div className="p-3.5 border-2 border-line bg-bg shadow-rest max-w-[240px]">
            <div className="text-[10px] font-mono text-accent uppercase tracking-wider font-black">
              SAPPHIRE CRYSTAL
            </div>
            <div className="text-xs text-muted mt-1 font-mono">
              Double AR anti-reflective coating with diamond specular sweep
            </div>
          </div>
          <div className="p-3.5 border-2 border-line bg-bg shadow-rest max-w-[240px]">
            <div className="text-[10px] font-mono text-accent uppercase tracking-wider font-black">
              TITANIUM GRADE 5
            </div>
            <div className="text-xs text-muted mt-1 font-mono">
              Lightweight aerospace case with satin-brushed bevels
            </div>
          </div>
        </div>

        {/* Bottom Specs Overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 sm:bottom-14 z-20 flex justify-around text-center max-w-4xl mx-auto px-6">
          <div className="p-3.5 border-2 border-line bg-bg shadow-rest min-w-[120px]">
            <div className="text-xl sm:text-2xl font-black text-accent font-mono">36,000</div>
            <div className="text-[10px] sm:text-xs text-muted font-mono mt-0.5 font-bold uppercase">VPH BEAT RATE</div>
          </div>
          <div className="p-3.5 border-2 border-line bg-bg shadow-rest min-w-[120px]">
            <div className="text-xl sm:text-2xl font-black text-accent font-mono">68 HRS</div>
            <div className="text-[10px] sm:text-xs text-muted font-mono mt-0.5 font-bold uppercase">POWER RESERVE</div>
          </div>
          <div className="p-3.5 border-2 border-line bg-bg shadow-rest min-w-[120px]">
            <div className="text-xl sm:text-2xl font-black text-accent font-mono">300 M</div>
            <div className="text-[10px] sm:text-xs text-muted font-mono mt-0.5 font-bold uppercase">WATER RESIST</div>
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}

// ==========================================
// 11. TEXT REVEAL DEMO (BaseOpacity 0 & 3D Perspective Rotation)
// ==========================================
export function TextRevealDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const by = knobs.by ?? 'chars';
  const blur = knobs.blur ?? 0;
  const rotateX = knobs.rotateX ?? 35;

  return (
    <div className="w-full flex flex-col items-center justify-start pt-16 pb-32 px-6">
      {/* Top Entrance Intro */}
      <div className="max-w-md mx-auto text-center mb-28 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase">
          <span>[NATURAL DOCUMENT FLOW • NO STICKY LOCKING]</span>
        </div>
        <h3 className="text-2xl font-black uppercase text-fg">Editorial Typography Reveal</h3>
        <p className="text-xs text-muted leading-relaxed font-mono">
          In mature production sites, text reveals naturally as the user scrolls down through the viewport reading zone — with zero artificial section pinning.
        </p>
        <div className="inline-flex items-center gap-1 font-mono text-xs text-accent pt-2 font-bold uppercase">
          <span>↓ Scroll down to read editorial copy</span>
        </div>
      </div>

      {/* Reveal Target in Normal Document Flow */}
      <div className="max-w-4xl mx-auto text-center space-y-8 my-20 p-8 sm:p-14 border-2 border-line bg-bg shadow-hover">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent font-black">
          <span>[KINETIC TYPOGRAPHIC SPLIT]</span>
          <span className="text-line-soft">■</span>
          <span>by=&quot;{by}&quot;</span>
          <span className="text-line-soft">■</span>
          <span>rotateX: {rotateX}°</span>
        </div>

        <TextReveal
          key={`${by}-${blur}-${rotateX}-${knobs.playOnMount}`}
          by={by}
          blur={blur}
          scale={0.92}
          rotateX={rotateX}
          baseOpacity={knobs.baseOpacity ?? 0}
          playOnMount={knobs.playOnMount}
          className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-fg leading-tight"
        >
          Declarative scroll physics with zero React re-renders. Every single character illuminates and flips in 3D perspective space in lockstep with your gesture.
        </TextReveal>
      </div>

      {/* Trailing Section demonstrating unblocked scroll */}
      <div className="max-w-md mx-auto text-center mt-24 space-y-2 text-muted font-mono text-xs">
        <span className="text-accent font-black uppercase">✓ Natural Flow Verified</span>
        <p className="text-muted text-xs">
          The page continues scrolling freely past the typography with zero scroll hijacking or sticky trapping.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 12. MAGNETIC DEMO
// ==========================================
export function MagneticDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const strength = knobs.strength ?? 0.35;
  const radius = knobs.radius ?? 160;
  const stiffness = knobs.stiffness ?? 180;
  const innerIconRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [HOVER CURSOR NEAR BUTTON]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">Spring Magnetic Attraction</h3>
      </div>

      <Magnetic
        key={`${strength}-${radius}-${stiffness}`}
        strength={strength}
        radius={radius}
        stiffness={stiffness}
        damping={15}
        scale={1.08}
        innerTargetRef={innerIconRef}
        innerStrength={0.65}
      >
        <button className="relative group px-10 py-5 border-2 border-line bg-bg text-fg hover:bg-accent hover:text-black font-black font-mono text-lg shadow-rest flex items-center gap-4 transition-colors cursor-pointer uppercase">
          <span>MAGNETIC TARGET</span>
          <span ref={innerIconRef} className="p-2 border-2 border-line bg-bg text-accent group-hover:text-black group-hover:border-black transition-colors">
            <Sparkles className="w-5 h-5" />
          </span>
        </button>
      </Magnetic>
    </div>
  );
}

// ==========================================
// 13. SKEW GALLERY DEMO (Default 1.8 Intensity & Live Telemetry Gauge)
// ==========================================
export function SkewGalleryDemoStage({ knobs }: { knobs: Record<string, any> }) {
  const intensity = knobs.intensity ?? 1.8;
  const { subscribe } = useScrollCraft();

  const skewDegRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsub = subscribe((metrics: any) => {
      const v = metrics.velocity;
      const angle = Math.max(-12, Math.min(12, v * intensity));
      if (skewDegRef.current) {
        skewDegRef.current.textContent = `${angle >= 0 ? '+' : ''}${angle.toFixed(2)}°`;
        skewDegRef.current.className = `font-black font-mono ${
          Math.abs(angle) > 1 ? 'text-accent' : 'text-muted'
        }`;
      }
      if (velocityRef.current) {
        velocityRef.current.textContent = `${Math.abs(v).toFixed(2)} px/ms`;
      }
    });

    return unsub;
  }, [subscribe, intensity]);

  const images = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[220vh] py-16 px-4">
      <div className="text-center max-w-md mx-auto mb-10 space-y-2">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-black">
          [FLICK SCROLL TO SKEW MATRIX]
        </span>
        <h3 className="text-3xl font-black uppercase text-fg">Dynamic Velocity Skew</h3>
        <p className="text-xs text-muted font-mono">
          Scroll velocity dynamically skews the gallery cards. When scrolling ceases, spring damping restores 0°.
        </p>

        {/* Live Physics HUD Gauge */}
        <div className="inline-flex items-center gap-5 px-5 py-2.5 border-2 border-line bg-bg text-xs font-mono mt-4 shadow-rest font-bold">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span className="text-muted uppercase">SKEW:</span>
            <span ref={skewDegRef} className="text-accent font-black">+0.00°</span>
          </div>
          <span className="text-line-soft font-bold">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted uppercase">VELOCITY:</span>
            <span ref={velocityRef} className="text-fg font-black">0.00 px/ms</span>
          </div>
        </div>
      </div>

      <SkewGallery key={intensity} images={images} intensity={intensity} />
    </div>
  );
}
