'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  TextReveal,
  Pin,
  PinContainer,
  Parallax,
  HorizontalScroll,
  StackedCards,
  ScrollTransform,
  VelocityMarquee,
  ScrollProgress,
  useScrollCraft,
  useScrollProgress,
  useScrollDirection,
} from '@scrollcraft/react';
import {
  Sparkles,
  Layers,
  Zap,
  Activity,
  ArrowUp,
  ArrowLeft,
  ChevronDown,
  Check,
  Cpu,
  Sliders,
  Maximize2,
  Compass,
  Repeat,
  Shield,
  Smartphone,
  Eye,
  Database,
  Type,
  TrendingUp,
} from 'lucide-react';
import {
  GlassThemeProvider,
  useGlassTheme,
  GlassCard,
  GlassMode,
} from '@/components/test/glass-theme-context';
import {
  HORIZONTAL_CARDS,
  STACKED_CARDS_DATA,
} from '@/components/test/robust-cards-data';

/* ─────────────────────────────── icon map ─────────────────────────────── */
function RenderIcon({ name, className = 'w-5 h-5' }: { name: string; className?: string }) {
  switch (name) {
    case 'Zap': return <Zap className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'EyeOff': return <Eye className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Type': return <Type className={className} />;
    case 'Maximize2': return <Maximize2 className={className} />;
    case 'Repeat': return <Repeat className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'Database': return <Database className={className} />;
    default: return <Sparkles className={className} />;
  }
}

/* ────────────────────────── Top HUD & Controller ────────────────────────── */
function RobustHeaderHUD() {
  const { mode, setMode, allConfigs } = useGlassTheme();
  const { progress, scrollY } = useScrollProgress({ reactive: true });
  const { direction } = useScrollDirection();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const modes: GlassMode[] = ['raw', '50%', 'low', 'flat'];

  return (
    <header className="fixed top-2 sm:top-4 inset-x-0 z-50 px-2 sm:px-4 max-w-7xl mx-auto pointer-events-none">
      <div className="flex items-center justify-between gap-2 sm:gap-3 p-3 border-2 border-line bg-bg shadow-rest pointer-events-auto">
        {/* Left: Branding & Back Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/test"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-black hover:bg-accent px-3 py-1.5 border-2 border-line-soft transition-colors font-mono font-bold uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TEST LAB</span>
          </Link>
          <div className="h-4 w-[2px] bg-line-soft" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black tracking-wider text-fg uppercase">
              <span className="hidden sm:inline">ROBUST </span>SHOWCASE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 border-2 border-accent text-accent font-bold hidden md:inline uppercase">
              PROD-GRADE
            </span>
          </div>
        </div>

        {/* Center: Live Scroll Telemetry */}
        <div className="hidden lg:flex items-center gap-5 text-xs font-mono text-muted">
          <div className="flex items-center gap-1.5">
            <span className="text-muted">POS:</span>
            <span className="text-accent font-bold">{Math.round(scrollY)}px</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted">DIR:</span>
            <span className="text-fg font-bold uppercase">
              {direction.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted">PROGRESS:</span>
            <span className="text-accent font-bold">{Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* Right: Glassmorphism Mode Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 border-2 border-line bg-bg hover:bg-accent hover:text-black text-fg text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
            aria-label="Select glassmorphism mode"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-muted">GLASS:</span>
            <span className="text-accent hover:text-inherit font-bold hidden sm:inline">{allConfigs[mode].label}</span>
            <span className="text-accent hover:text-inherit font-bold sm:hidden">{mode.toUpperCase()}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 p-3 border-2 border-line bg-bg shadow-hover z-50">
              <div className="px-2 py-2 border-b-2 border-line-soft mb-2">
                <p className="text-xs font-mono uppercase tracking-wider text-fg font-black">
                  GLASS LEVEL
                </p>
                <p className="text-[11px] text-muted font-mono">
                  Select card blur and translucency tier
                </p>
              </div>
              <div className="space-y-1">
                {modes.map((m) => {
                  const item = allConfigs[m];
                  const isSelected = mode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer border-2 ${
                        isSelected
                          ? 'bg-accent text-black border-accent font-black'
                          : 'text-fg hover:bg-line-soft/40 border-transparent'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 font-bold uppercase">
                          <span>{item.label}</span>
                          <span className="text-[10px] opacity-70">({item.blurPx}px blur)</span>
                        </div>
                        <p className="text-[11px] opacity-80 font-sans mt-0.5">{item.description}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-black shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────── Section 1: Char Animation ────────────────────────── */
function SectionCharAnimation() {
  return (
    <section id="char-animation" className="relative min-h-screen pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col justify-center">
      {/* Section Tag */}
      <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase mb-6 w-max">
        <Sparkles className="w-3.5 h-3.5" />
        <span>[SECTION 01 // TEXT REVEAL]</span>
      </div>

      <h2 className="text-xs sm:text-sm font-mono text-muted tracking-wider uppercase mb-3">
        Character-By-Character Kinetic Reveal
      </h2>

      {/* Primary Kinetic Character Animation */}
      <div className="my-4 sm:my-6">
        <TextReveal
          by="chars"
          range={[0, 0.85]}
          blur={12}
          rotateX={30}
          slide={24}
          baseOpacity={0.05}
          className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-fg leading-[1.05] uppercase select-none break-words"
        >
          SCROLLCRAFT UNLOCKS NATIVE COMPOSITOR PERFORMANCE
        </TextReveal>
      </div>

      {/* Secondary Character Paragraph Animation */}
      <div className="max-w-3xl my-6">
        <TextReveal
          by="words"
          range={[0.15, 0.95]}
          slide={12}
          baseOpacity={0.12}
          className="text-lg sm:text-xl text-fg font-normal leading-relaxed select-none"
        >
          Each character node is split into lightweight inline spans with zero layout shifts. As you scroll through the viewport, the solver calculates hermite ease coordinates in the RAF Ticker and writes hardware transforms directly to the compositor.
        </TextReveal>
      </div>

      {/* Feature Breakdown Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        <GlassCard className="p-6 border-2 border-line bg-bg shadow-rest">
          <div className="w-10 h-10 border-2 border-line bg-bg flex items-center justify-center text-accent mb-4">
            <Type className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-fg uppercase mb-1.5">Zero-Reflow Splitting</h3>
          <p className="text-xs text-muted leading-relaxed">
            Preserves natural text wrap and word spacing using display contents span hierarchies. No layout thrashing or layout re-measures.
          </p>
          <div className="mt-4 pt-3 border-t-2 border-line-soft flex items-center justify-between text-[10px] font-mono text-muted">
            <span>MODE: BY=&quot;CHARS&quot;</span>
            <span className="text-accent font-bold">100% FLUID</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-2 border-line bg-bg shadow-rest">
          <div className="w-10 h-10 border-2 border-line bg-bg flex items-center justify-center text-accent mb-4">
            <Maximize2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-fg uppercase mb-1.5">3D Glyph Rotation</h3>
          <p className="text-xs text-muted leading-relaxed">
            Applies rotateX and rotateY transforms with hardware perspective. Characters tilt upwards from depth coordinates as they enter view.
          </p>
          <div className="mt-4 pt-3 border-t-2 border-line-soft flex items-center justify-between text-[10px] font-mono text-muted">
            <span>PERSPECTIVE: 1000PX</span>
            <span className="text-accent font-bold">GPU RASTER</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-2 border-line bg-bg shadow-rest">
          <div className="w-10 h-10 border-2 border-line bg-bg flex items-center justify-center text-accent mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-fg uppercase mb-1.5">Style Registry Leasing</h3>
          <p className="text-xs text-muted leading-relaxed">
            Transform writes are leased exclusively during active scroll windows and cleanly released on settled frames to prevent memory bloat.
          </p>
          <div className="mt-4 pt-3 border-t-2 border-line-soft flex items-center justify-between text-[10px] font-mono text-muted">
            <span>TICKER OVERHEAD</span>
            <span className="text-accent font-bold">&lt; 0.1MS</span>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/* ────────────────────────── Section 2: Parallax + Pin ────────────────────────── */
function SectionParallaxPin() {
  const [pinProgress, setPinProgress] = useState(0);

  return (
    <section id="parallax-pin" className="relative w-full border-t-2 border-line bg-bg">
      {/* Section Intro Header */}
      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>[SECTION 02 // PARALLAX &amp; PIN]</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-fg uppercase tracking-tight break-words">
          Sticky Card Pinning with Multi-Layer Parallax
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl font-mono">
          The center glass card is pinned firmly in view using the <code className="text-accent">&lt;Pin&gt;</code> primitive, while multiple surrounding layers float past at distinct parallax velocities (<code className="text-accent">&lt;Parallax&gt;</code>).
        </p>
      </div>

      {/* Pin Track Container */}
      <PinContainer height="240vh" className="relative px-4 sm:px-6 max-w-6xl mx-auto flex justify-center items-start">
        {/* Background Parallax Layer (Deep Drift) */}
        <Parallax speed={-0.35} className="absolute inset-x-0 top-12 flex justify-between pointer-events-none opacity-20 select-none">
          <div className="text-5xl sm:text-[100px] md:text-[160px] font-black tracking-tighter text-line-soft leading-none">
            PIN
          </div>
          <div className="text-5xl sm:text-[100px] md:text-[160px] font-black tracking-tighter text-line-soft leading-none">
            DRIFT
          </div>
        </Parallax>

        {/* Parallax Floating Chip Left */}
        <Parallax speed={0.45} className="hidden sm:flex absolute left-4 sm:left-12 top-48 z-10 pointer-events-none">
          <div className="p-3 border-2 border-line bg-bg text-accent text-xs font-mono font-bold flex items-center gap-2 shadow-rest">
            <span className="w-2 h-2 bg-accent animate-ping" />
            Parallax Speed: +0.45x
          </div>
        </Parallax>

        {/* Parallax Floating Chip Right */}
        <Parallax speed={-0.5} className="hidden sm:flex absolute right-4 sm:right-12 top-72 z-10 pointer-events-none">
          <div className="p-3 border-2 border-line bg-bg text-fg text-xs font-mono font-bold flex items-center gap-2 shadow-rest">
            <Activity className="w-3.5 h-3.5 text-accent" />
            Counter Parallax: -0.50x
          </div>
        </Parallax>

        {/* Pinned Card Centerpiece */}
        <Pin
          top={140}
          duration={1100}
          onProgress={(p) => setPinProgress(p)}
          className="w-full max-w-xl z-20 self-start"
        >
          <GlassCard className="p-5 sm:p-8 md:p-10 border-2 border-line bg-bg shadow-rest" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
            {/* Card Header */}
            <div className="flex items-center justify-between border-b-2 border-line-soft pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-line bg-bg flex items-center justify-center text-accent">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-fg uppercase">Sticky Pin Engine</h3>
                  <p className="text-xs font-mono text-muted">Track: 240vh Duration</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 border-2 border-accent text-accent font-bold">
                  ACTIVE PIN
                </span>
              </div>
            </div>

            {/* Telemetry Meter */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted">PIN RUNWAY PROGRESS</span>
                <span className="text-accent font-bold">{Math.round(pinProgress * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-bg border-2 border-line p-0.5">
                <div
                  className="h-full bg-accent origin-left"
                  style={{
                    transform: `scaleX(${Math.max(0.02, pinProgress)}) translateZ(0)`,
                    willChange: 'transform',
                  }}
                />
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="p-4 border-2 border-line-soft bg-zinc-950 font-mono text-xs text-fg mb-6 space-y-1">
              <p className="text-muted">// Declarative JSX Composition</p>
              <p><span className="text-accent">&lt;PinContainer</span> <span className="text-muted">height</span>=<span className="text-fg">&quot;240vh&quot;</span>&gt;</p>
              <p className="pl-4"><span className="text-accent">&lt;Parallax</span> <span className="text-muted">speed</span>=<span className="text-fg">&#123;-0.35&#125;</span> /&gt;</p>
              <p className="pl-4"><span className="text-accent">&lt;Pin</span> <span className="text-muted">top</span>=<span className="text-fg">&#123;140&#125;</span> <span className="text-muted">duration</span>=<span className="text-fg">&#123;1100&#125;</span>&gt;</p>
              <p className="pl-8"><span className="text-muted">&lt;GlassCard /&gt;</span></p>
              <p className="pl-4"><span className="text-accent">&lt;/Pin&gt;</span></p>
              <p><span className="text-accent">&lt;/PinContainer&gt;</span></p>
            </div>

            {/* Metrics Footer */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 border-2 border-line-soft bg-bg">
                <span className="block text-[10px] font-mono text-muted uppercase">PIN TYPE</span>
                <span className="text-xs font-mono font-bold text-fg">CSS STICKY + RAF</span>
              </div>
              <div className="p-3 border-2 border-line-soft bg-bg">
                <span className="block text-[10px] font-mono text-muted uppercase">RE-RENDERS</span>
                <span className="text-xs font-mono font-bold text-accent">ZERO RERENDERS</span>
              </div>
            </div>
          </GlassCard>
        </Pin>

        {/* Foreground Parallax Pill */}
        <Parallax speed={0.7} className="absolute left-1/4 bottom-36 z-30 pointer-events-none">
          <div className="p-3 border-2 border-line bg-bg text-accent text-xs font-mono font-bold shadow-rest">
            Foreground Velocity: +0.70x
          </div>
        </Parallax>
      </PinContainer>
    </section>
  );
}

/* ────────────────────────── Section 3: Horizontal Scroll (10-15 Cards) ────────────────────────── */
function SectionHorizontalScroll() {
  return (
    <section id="horizontal-scroll" className="relative w-full border-t-2 border-line bg-bg">
      {/* Intro Header */}
      <div className="pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase mb-4">
          <Repeat className="w-3.5 h-3.5" />
          <span>[SECTION 03 // HORIZONTAL SCROLL RUNWAY]</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-fg tracking-tight break-words">
              Horizontal Card Rail (12 Glass Cards)
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl font-mono">
              Converts continuous vertical scroll into smooth horizontal track translation. Scroll downward to traverse through 12 architectural cards.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted border-2 border-line bg-bg px-3 py-1.5 uppercase font-bold w-max">
            <span>Scroll Down to Slide &rarr;</span>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Component */}
      <HorizontalScroll
        speed={1.8}
        height="320vh"
        className="w-full"
        innerClassName="gap-4 sm:gap-6 px-4 sm:px-12 py-8 sm:py-12 items-center"
      >
        {HORIZONTAL_CARDS.map((card) => (
          <GlassCard
            key={card.id}
            className="w-[280px] sm:w-[340px] md:w-[380px] shrink-0 p-5 sm:p-7 border-2 border-line bg-bg shadow-rest flex flex-col justify-between select-none"
            style={{
              minHeight: '340px',
              willChange: 'transform',
              transform: 'translate3d(0px, 0px, 0px)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black font-mono text-accent">
                  {card.number}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 border-2 border-line uppercase text-fg bg-bg">
                  {card.tag}
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 border-2 border-line bg-bg flex items-center justify-center text-accent">
                  <RenderIcon name={card.icon} className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black uppercase text-fg leading-snug">
                  {card.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-muted leading-relaxed mt-2">
                {card.description}
              </p>
            </div>

            {/* Bottom Metrics Pill */}
            <div className="mt-6 pt-4 border-t-2 border-line-soft flex items-center justify-between text-xs font-mono font-bold text-accent">
              <span className="text-muted">BENCHMARK:</span>
              <span>{card.metrics}</span>
            </div>
          </GlassCard>
        ))}
      </HorizontalScroll>
    </section>
  );
}

/* ────────────────────────── Section 4: Stack Cards ────────────────────────── */
function SectionStackedCards() {
  return (
    <section id="stacked-cards" className="relative w-full border-t-2 border-line bg-bg py-16 sm:py-24">
      {/* Intro Header */}
      <div className="px-4 sm:px-6 max-w-6xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>[SECTION 04 // STACKED CARDS ENGINE]</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black uppercase text-fg tracking-tight break-words">
          Progressive Card Deck Stacking
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl font-mono">
          As you scroll, each architectural layer pins to the viewport top and subsequent cards slide cleanly over the previous ones with smooth depth scaling.
        </p>
      </div>

      {/* Stacked Cards Component */}
      <div className="px-4 sm:px-6 max-w-4xl mx-auto">
        <StackedCards
          top={120}
          offset={36}
          scaleStep={0.04}
          minScale={0.86}
          cardDistance={380}
        >
          {STACKED_CARDS_DATA.map((card) => (
            <GlassCard
              key={card.id}
              className="w-full p-5 sm:p-8 md:p-10 border-2 border-line bg-bg shadow-rest"
              style={{
                minHeight: '340px',
                willChange: 'transform',
                transform: 'translate3d(0px, 0px, 0px)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="flex items-center justify-between border-b-2 border-line-soft pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-black text-accent">
                    {card.step}
                  </span>
                  <div className="h-4 w-[2px] bg-line-soft" />
                  <span className="text-[11px] font-mono text-muted uppercase font-bold">
                    {card.badge}
                  </span>
                </div>
                <div className="w-2.5 h-2.5 bg-accent animate-pulse" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black uppercase text-fg mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-6 font-normal">
                {card.description}
              </p>

              <div className="space-y-2 pt-2 border-t-2 border-line-soft">
                {card.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-muted font-mono">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </StackedCards>
      </div>
    </section>
  );
}

/* ────────────────────────── Section 5: ScrollTransform ────────────────────────── */
function SectionScrollTransform() {
  return (
    <section id="scroll-transform" className="relative w-full border-t-2 border-line bg-bg py-16 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Intro Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>[SECTION 05 // SCROLL TRANSFORM]</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black uppercase text-fg tracking-tight break-words">
          Direct GPU Scroll-Linked Transforms
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl font-mono mb-10 sm:mb-16">
          Hardware accelerated keyframes written in Ticker Phase 3. Zero React re-renders while performing 3D rotations, zoom scaling, and blur filters.
        </p>

        {/* 4 Transform Demonstrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Preset 1: 3D Flip */}
          <ScrollTransform preset="3d-flip">
            <GlassCard className="p-5 sm:p-8 h-full border-2 border-line bg-bg shadow-rest">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-black text-accent px-2.5 py-1 border-2 border-line bg-bg uppercase">
                  PRESET: 3D-FLIP
                </span>
                <span className="text-xs font-mono text-muted">rotateX: 60&deg; &rarr; 0&deg;</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-fg mb-2">3D Perspective Elevation</h3>
              <p className="text-xs text-muted leading-relaxed mb-6">
                Tilts into view along the X-axis from 60 degrees to flat horizontal orientation with scale and opacity interpolation.
              </p>
              <div className="p-3.5 border-2 border-line-soft bg-zinc-950 font-mono text-xs text-fg">
                &lt;ScrollTransform preset=&quot;3d-flip&quot;&gt;
              </div>
            </GlassCard>
          </ScrollTransform>

          {/* Preset 2: Zoom In */}
          <ScrollTransform preset="zoom-in">
            <GlassCard className="p-5 sm:p-8 h-full border-2 border-line bg-bg shadow-rest">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-black text-accent px-2.5 py-1 border-2 border-line bg-bg uppercase">
                  PRESET: ZOOM-IN
                </span>
                <span className="text-xs font-mono text-muted">scale: 0.75 &rarr; 1.0</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-fg mb-2">Subpixel Zoom Expansion</h3>
              <p className="text-xs text-muted leading-relaxed mb-6">
                Expands smoothly from 75% scale into 100% scale while fading from 40% to 100% opacity as scroll progress advances.
              </p>
              <div className="p-3.5 border-2 border-line-soft bg-zinc-950 font-mono text-xs text-fg">
                &lt;ScrollTransform preset=&quot;zoom-in&quot;&gt;
              </div>
            </GlassCard>
          </ScrollTransform>

          {/* Preset 3: Blur In */}
          <ScrollTransform preset="blur-in">
            <GlassCard className="p-5 sm:p-8 h-full border-2 border-line bg-bg shadow-rest">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-black text-accent px-2.5 py-1 border-2 border-line bg-bg uppercase">
                  PRESET: BLUR-IN
                </span>
                <span className="text-xs font-mono text-muted">blur: 12px &rarr; 0px</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase text-fg mb-2">Atmospheric Lens De-Blur</h3>
              <p className="text-xs text-muted leading-relaxed mb-6">
                Transitions from 12px Gaussian blur to pin-sharp clarity directly synchronized to the viewport scroll threshold.
              </p>
              <div className="p-3.5 border-2 border-line-soft bg-zinc-950 font-mono text-xs text-fg">
                &lt;ScrollTransform preset=&quot;blur-in&quot;&gt;
              </div>
            </GlassCard>
          </ScrollTransform>

          {/* Custom Multi-Property Transform */}
          <ScrollTransform
            properties={{
              rotate: [-15, 0],
              scale: [0.9, 1],
              y: [40, 0],
            }}
          >
            <GlassCard className="p-5 sm:p-8 h-full border-2 border-line bg-bg shadow-rest">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-black text-accent px-2.5 py-1 border-2 border-line bg-bg uppercase">
                  CUSTOM MULTI-PROP
                </span>
                <span className="text-xs font-mono text-muted">rotate + scale + y</span>
              </div>
              <h3 className="text-xl font-black uppercase text-fg mb-2">Composite Coordinate Matrix</h3>
              <p className="text-xs text-muted leading-relaxed mb-6">
                Seamlessly combines arbitrary rotational angles, translation offsets, and geometric scaling within a single transform solver.
              </p>
              <div className="p-3.5 border-2 border-line-soft bg-zinc-950 font-mono text-xs text-fg">
                properties=&#123;&#123; rotate: [-15, 0], y: [40, 0] &#125;&#125;
              </div>
            </GlassCard>
          </ScrollTransform>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── Section 6: Velocity Marquee ────────────────────────── */
function SectionVelocityMarquee() {
  return (
    <section id="velocity-marquee" className="relative w-full border-t-2 border-line bg-bg py-16 sm:py-28 overflow-hidden">
      {/* Intro Header */}
      <div className="px-4 sm:px-6 max-w-6xl mx-auto mb-10 sm:mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase mb-4">
          <Repeat className="w-3.5 h-3.5" />
          <span>[SECTION 06 // VELOCITY MARQUEE]</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black uppercase text-fg tracking-tight break-words">
          Kinetic Velocity-Driven Marquee
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-2xl mx-auto font-mono">
          Scroll rapidly up or down to watch both marquee lanes dynamically accelerate proportional to your scroll velocity, then smoothly glide back to base speed.
        </p>
      </div>

      {/* Lane 1: High-Impact Typography (Direction: Left) */}
      <div className="mb-6">
        <VelocityMarquee
          baseSpeed={1.6}
          velocityMultiplier={0.35}
          direction="left"
          maxSpeed={16}
          className="py-4 border-y-2 border-line bg-bg"
        >
          <div className="flex items-center gap-8 text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight text-fg uppercase">
            <span>ZERO RERENDERS</span>
            <span className="text-accent">■</span>
            <span>DIRECT GPU TICKER</span>
            <span className="text-accent">■</span>
            <span>HARDWARE COMPOSITOR</span>
            <span className="text-accent">■</span>
            <span>FRUSTUM CULLING</span>
            <span className="text-accent">■</span>
            <span>DYNAMIC GLASS</span>
            <span className="text-accent">■</span>
          </div>
        </VelocityMarquee>
      </div>

      {/* Lane 2: Glass Cards & Feature Pills (Direction: Right) */}
      <div>
        <VelocityMarquee
          baseSpeed={1.4}
          velocityMultiplier={0.3}
          direction="right"
          maxSpeed={14}
          className="py-4"
        >
          <div className="flex items-center gap-5">
            <GlassCard activeHover={false} className="px-5 py-2.5 flex items-center gap-2.5 text-xs font-mono font-bold text-fg border-2 border-line bg-bg shadow-rest" style={{ willChange: 'transform', transform: 'translate3d(0px, 0px, 0px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <Zap className="w-4 h-4 text-accent" />
              <span>TransformComposer.ts</span>
            </GlassCard>
            <GlassCard activeHover={false} className="px-5 py-2.5 flex items-center gap-2.5 text-xs font-mono font-bold text-fg border-2 border-line bg-bg shadow-rest" style={{ willChange: 'transform', transform: 'translate3d(0px, 0px, 0px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <Cpu className="w-4 h-4 text-accent" />
              <span>FrustumShield Active</span>
            </GlassCard>
            <GlassCard activeHover={false} className="px-5 py-2.5 flex items-center gap-2.5 text-xs font-mono font-bold text-fg border-2 border-line bg-bg shadow-rest" style={{ willChange: 'transform', transform: 'translate3d(0px, 0px, 0px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <Shield className="w-4 h-4 text-accent" />
              <span>StyleLeasing Safe</span>
            </GlassCard>
            <GlassCard activeHover={false} className="px-5 py-2.5 flex items-center gap-2.5 text-xs font-mono font-bold text-fg border-2 border-line bg-bg shadow-rest" style={{ willChange: 'transform', transform: 'translate3d(0px, 0px, 0px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <Activity className="w-4 h-4 text-accent" />
              <span>Subpixel Lenis Kinetics</span>
            </GlassCard>
            <GlassCard activeHover={false} className="px-5 py-2.5 flex items-center gap-2.5 text-xs font-mono font-bold text-fg border-2 border-line bg-bg shadow-rest" style={{ willChange: 'transform', transform: 'translate3d(0px, 0px, 0px)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <Database className="w-4 h-4 text-accent" />
              <span>Zero GC Allocations</span>
            </GlassCard>
          </div>
        </VelocityMarquee>
      </div>
    </section>
  );
}

/* ────────────────────────── Footer: Scroll Progress ────────────────────────── */
function SectionFooterProgress() {
  const { progress, scrollY } = useScrollProgress({ reactive: true });
  const { scrollTo } = useScrollCraft();

  return (
    <footer className="relative w-full border-t-2 border-line bg-bg pt-16 pb-32 sm:pb-20 px-4 sm:px-6">
      {/* Top Edge Progress Bar Primitive */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-line-soft overflow-hidden" style={{ isolation: 'isolate', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
        <ScrollProgress className="h-full bg-accent" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b-2 border-line-soft">
          {/* Left: Overall Completion & Telemetry */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-line bg-bg text-accent text-xs font-mono font-bold uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[SCROLL PROGRESS PRIMITIVE]</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-fg tracking-tight break-words">
              End of Showcase Runway
            </h3>
            <p className="text-xs text-muted mt-1 max-w-md font-mono">
              Full page scroll progression monitored via ScrollProgress and reactive observables without DOM thrashing.
            </p>
          </div>

          {/* Center: Live Percentage Progress Ring / Badge */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6">
            <div className="p-5 border-2 border-line bg-bg shadow-rest flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider mb-1 font-bold">
                PAGE PROGRESS
              </span>
              <span className="text-4xl font-black font-mono text-accent">
                {Math.round(progress * 100)}%
              </span>
              <span className="text-[11px] font-mono text-muted mt-1">
                {Math.round(scrollY)}px scrolled
              </span>
            </div>

            {/* Back to Top Action */}
            <button
              onClick={() => scrollTo(0, { duration: 1.2 })}
              className="flex flex-col items-center justify-center p-5 border-2 border-line bg-bg hover:bg-accent hover:text-black text-fg transition-colors cursor-pointer group shadow-rest min-w-[120px]"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-5 h-5 text-accent group-hover:text-black transition-colors group-hover:-translate-y-1" />
              <span className="text-xs font-mono font-black mt-2 uppercase">TOP</span>
            </button>
          </div>
        </div>

        {/* Bottom Credits & Quick Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div>
            &copy; {new Date().getFullYear()} SCROLLCRAFT ENGINE. HIGH-PERFORMANCE SCROLL TOOLKIT FOR REACT &amp; NEXT.JS.
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 font-bold uppercase">
            <Link href="/" className="hover:text-accent transition-colors">
              HOME
            </Link>
            <Link href="/docs" className="hover:text-accent transition-colors">
              DOCS
            </Link>
            <Link href="/test" className="hover:text-accent transition-colors">
              TEST LAB
            </Link>
            <Link href="/showcase" className="hover:text-accent transition-colors">
              SHOWCASE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────── Main Robust Page ────────────────────────── */
export default function RobustShowcasePage() {
  useEffect(() => {
    document.title = 'Robust Showcase | ScrollCraft';
  }, []);

  return (
    <GlassThemeProvider initialMode="raw">
      <div className="min-h-screen bg-bg text-fg selection:bg-accent selection:text-black">
        {/* Global Hardware-Accelerated Progress Indicator (Top Edge) */}
        <div className="fixed top-0 inset-x-0 z-[60] h-[3px] pointer-events-none" style={{ isolation: 'isolate', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
          <ScrollProgress className="h-full bg-accent origin-left" />
        </div>

        {/* Fixed Header HUD with Glassmorphism Selector */}
        <RobustHeaderHUD />

        <main className="relative flex flex-col">
          {/* Section 1: Character Animation Demonstration */}
          <SectionCharAnimation />

          {/* Section 2: Parallax + Pin a Card */}
          <SectionParallaxPin />

          {/* Section 3: Horizontal Scrollbar (10-15 Cards) */}
          <SectionHorizontalScroll />

          {/* Section 4: Stack Cards */}
          <SectionStackedCards />

          {/* Section 5: ScrollTransform */}
          <SectionScrollTransform />

          {/* Section 6: Velocity Marquee */}
          <SectionVelocityMarquee />

          {/* Footer: Scroll Progress */}
          <SectionFooterProgress />
        </main>
      </div>
    </GlassThemeProvider>
  );
}
