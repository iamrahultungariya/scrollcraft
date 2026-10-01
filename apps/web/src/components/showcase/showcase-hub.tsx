'use client';

/**
 * ScrollCraft Showcase: "You Build. We Showcase."
 * Pure Brutalist Exhibition Portal:
 * - 0 Radius globally, 2px borders, hard offset shadows
 * - Strict 2 Neutrals + 1 Accent: #0C0F0C, #F4F1EA, #A8ABA0, #DFFF00
 * - Zero gimmicky FPS claims — focused on real hardware compositing & 0 re-render velocity
 * - Direct interactive routing to Test Lab for every featured primitive
 */

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Send, 
  X, 
  Check, 
  ExternalLink, 
  Layers, 
  Zap, 
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ShowcaseProject {
  id: string;
  number: string;
  title: string;
  category: '3D & Spatial' | 'Editorial & Pin' | 'Kinetic Commerce' | 'Experimental';
  studio: string;
  image: string;
  description: string;
  primitives: string[];
  driver: string;
  testSlug: string;
  metrics: string;
}

const PROJECTS: ShowcaseProject[] = [
  {
    id: 'chrono-horlogerie',
    number: '01',
    title: 'Chrono Horlogerie Haute',
    category: '3D & Spatial',
    studio: 'Atelier Horlogerie Geneva',
    image: '/images/showcase-img.webp',
    description: 'Subpixel frame scrubbing across 90 high-resolution pre-rendered rotational frames. Smooth kinetic acceleration coupled with user scroll momentum.',
    primitives: ['<ScrollSequence />', '<ScrollProgress />'],
    driver: 'Phase 4 Canvas 2D / LRU',
    testSlug: 'scroll-sequence',
    metrics: '90 Decoded Frames • 0 VDOM Re-renders',
  },
  {
    id: 'monolith-narrative',
    number: '02',
    title: 'Monolith Architectural Monograph',
    category: 'Editorial & Pin',
    studio: 'Studio Monolith Oslo',
    image: '/images/interior-plant.webp',
    description: 'Pinned multi-stage narrative where massive typography locks into viewport coordinates while editorial chapters sequence into view with zero layout shifts.',
    primitives: ['<Pin />', '<Reveal />', '<ScrollTransform />'],
    driver: 'Compositor Thread Native',
    testSlug: 'pin',
    metrics: '250vh Pin Budget • Slot Native',
  },
  {
    id: 'vanguard-runway',
    number: '03',
    title: 'Vanguard Velocity Runway',
    category: 'Kinetic Commerce',
    studio: 'Vanguard Atelier Paris',
    image: '/images/mountain-moody.webp',
    description: 'High-momentum continuous marquee and skew gallery responding to instantaneous scroll velocity. Automatically recovers stationary crawl velocity on scroll stop.',
    primitives: ['<VelocityMarquee />', '<SkewGallery />'],
    driver: 'Kinetic Momentum Solver',
    testSlug: 'velocity-marquee',
    metrics: 'Velocity Damped • 0 Forced Reflows',
  },
  {
    id: 'terra-gallery',
    number: '04',
    title: 'Terra Geographic Pavilion',
    category: 'Editorial & Pin',
    studio: 'Form & Space Architects',
    image: '/images/mountain-snow.webp',
    description: 'Seamlessly translates vertical page scroll distance into pinned horizontal slide progression without synthetic spacers or window hijacking.',
    primitives: ['<HorizontalScroll />', '<StackedCards />'],
    driver: 'CSS Snap & Compositor',
    testSlug: 'horizontal-scroll',
    metrics: '200vh Travel • CSS Scroll-Snap Native',
  },
  {
    id: 'synthetik-morph',
    number: '05',
    title: 'Synthetik Neural Vector Matrix',
    category: 'Experimental',
    studio: 'Synthetik Systems Zurich',
    image: '/images/hero-mountain-code.webp',
    description: 'Multi-axis GPU vector transformations and parametric SVG geometry drawing pinned to scroll triggers with zero React virtual DOM reconciliation.',
    primitives: ['<ScrollDraw />', '<ScrollTransform />', '<Magnetic />'],
    driver: 'Compositor SVG Ref Driver',
    testSlug: 'scroll-draw',
    metrics: 'Hardware Matrix • Subpixel Spring',
  },
  {
    id: 'spatial-dimension',
    number: '06',
    title: 'Dimension R3F Spatial Canvas',
    category: '3D & Spatial',
    studio: 'Nexus Interactive Tokyo',
    image: '/images/showcase-img.webp',
    description: 'Zero-rerender Three.js scene bridge driven via useScroll3D(). Camera perspective, wireframe geometry, and mesh transforms synchronized inside a single unified RAF loop.',
    primitives: ['useScroll3D()', '<PinContainer />'],
    driver: 'R3F Pull-Based RAF Bridge',
    testSlug: 'use-scroll-timeline',
    metrics: 'Zero Double-Pumping • GPU Matrix',
  },
];

const CATEGORIES = ['ALL', '3D & Spatial', 'Editorial & Pin', 'Kinetic Commerce', 'Experimental'] as const;
type CategoryFilter = typeof CATEGORIES[number];

export function ShowcaseHub() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    liveUrl: '',
    studioName: '',
    primitivesUsed: '',
  });

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Modal ESC handler & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSubmitModalOpen(false);
      }
    };
    if (isSubmitModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isSubmitModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setFormData({ projectName: '', liveUrl: '', studioName: '', primitivesUsed: '' });
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col items-center font-body text-fg not-prose selection:bg-accent selection:text-black">
      {/* 1. Hero Header */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 border-b-2 border-line">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
              <span className="w-2 h-2 bg-accent inline-block" />
              <span>[EXHIBITION / 01] PRODUCTION SHOWCASE</span>
            </div>

            {/* Submit Project Button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>SUBMIT PROJECT</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
              You Build. We Showcase.
            </h1>
            <p className="text-base sm:text-lg text-fg/90 font-body leading-relaxed max-w-3xl">
              A curated index of hardware-accelerated, high-fidelity web experiences built by creative developers and digital studios using ScrollCraft. Pure visual proof of declarative scroll performance with zero React Virtual DOM re-renders.
            </p>
          </div>

          {/* Brutalist Telemetry Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">CURATED SITES</span>
              <span className="text-xl sm:text-2xl font-black text-accent font-display">06</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">VDOM RE-RENDERS</span>
              <span className="text-xl sm:text-2xl font-black text-fg font-display">0</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">FRAME PIPELINE</span>
              <span className="text-xl sm:text-2xl font-black text-accent font-display">GPU COMPOSITED</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">RUNTIME FOOTPRINT</span>
              <span className="text-xl sm:text-2xl font-black text-fg font-display">&lt; 5KB</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Exhibition Master Canvas Hero Feature */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b-2 border-line">
        <div className="border-2 border-line bg-bg shadow-rest overflow-hidden">
          {/* Header strip */}
          <div className="px-4 py-3 bg-line-soft/30 border-b-2 border-line flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 font-bold uppercase text-fg">
              <span className="w-2 h-2 bg-accent inline-block" />
              <span>[01] EXHIBITION MASTER CANVAS &bull; 1536 &times; 1024</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase text-muted">
              <span className="text-accent font-bold">✦ HARDWARE ACCELERATED</span>
              <span>&bull;</span>
              <span>SMOOTH INERTIA NORMALIZATION</span>
            </div>
          </div>

          {/* Master Canvas Graphic */}
          <div className="relative w-full overflow-hidden bg-black aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center border-b-2 border-line group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/showcase-img.webp"
              alt="ScrollCraft Exhibition Master Visual"
              className="w-full h-full object-cover select-none group-hover:scale-[1.01] transition-transform duration-300"
              loading="eager"
            />
            {/* Floating Brutalist Tag Overlay */}
            <div className="absolute bottom-4 left-4 border-2 border-line bg-bg/95 p-3 shadow-rest font-mono text-xs hidden sm:block">
              <div className="font-bold text-accent uppercase tracking-wider">FEATURED ARCHITECTURE</div>
              <div className="text-fg font-display text-sm font-black uppercase mt-0.5">Physical Scroll Mechanics in Production</div>
            </div>
          </div>

          {/* Caption & Actions Footer */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="font-bold uppercase text-fg flex items-center gap-2">
                <span>PRODUCTION HARDENED DEPLOYMENT</span>
                <span className="text-[10px] px-2 py-0.5 border border-line bg-accent text-black font-bold uppercase">
                  v0.2.0 BETA
                </span>
              </div>
              <p className="text-muted text-xs font-body">
                All showcase components run with direct ref GPU writes without triggering React component re-renders.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/test"
                className="h-10 px-4 border-2 border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
              >
                <span>OPEN TEST LAB</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/docs"
                className="h-10 px-4 border-2 border-line bg-bg hover:bg-fg text-fg hover:text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
              >
                <span>DOCS REFERENCE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Tabs */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-line pb-4 font-mono">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted">
            <span>FILTER ARCHITECTURE:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              const count = cat === 'ALL' ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`h-9 px-3.5 border-2 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    active
                      ? 'bg-accent text-black border-line shadow-rest'
                      : 'bg-bg text-muted hover:text-fg hover:border-line border-line-soft'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="ml-1.5 opacity-70">[{count}]</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Curated Project Gallery Grid */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b-2 border-line">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="border-2 border-line bg-bg shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Header Strip */}
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold flex items-center justify-between">
                  <span className="text-accent uppercase tracking-wider">[{project.number}] {project.category}</span>
                  <span className="text-muted uppercase text-[10px]">{project.studio}</span>
                </div>

                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-line bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* Driver Pill Badge */}
                  <div className="absolute top-2.5 right-2.5 border-2 border-line bg-bg/95 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-accent shadow-rest">
                    {project.driver}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 font-body">
                  <h3 className="text-xl font-black uppercase tracking-tight text-fg font-display group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-fg/80 leading-relaxed font-body">
                    {project.description}
                  </p>

                  {/* Primitives Used Tag Strip */}
                  <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                    {project.primitives.map((prim) => (
                      <span
                        key={prim}
                        className="text-[10px] px-2 py-0.5 border border-line-soft bg-line-soft/30 text-fg font-bold uppercase"
                      >
                        {prim}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="border-t-2 border-line p-4 bg-line-soft/10 flex items-center justify-between gap-3 font-mono text-xs">
                <span className="text-[11px] text-muted font-bold uppercase truncate max-w-[55%]">
                  {project.metrics}
                </span>

                <Link
                  href={`/test/${project.testSlug}`}
                  className="h-9 px-3.5 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover transition-all inline-flex items-center gap-1.5 shrink-0"
                >
                  <span>TEST IN LAB</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Master Architecture Blueprint: 4-Stage Hardware Flow */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b-2 border-line">
        <div className="space-y-6">
          <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
            <Cpu className="w-3.5 h-3.5 text-accent" />
            <span>[02] THE ARCHITECTURAL BLUEPRINT</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-fg font-display">
              How Projects Achieve Zero Re-Render Velocity
            </h2>
            <p className="text-sm text-fg/80 font-body leading-relaxed max-w-3xl">
              ScrollCraft decouples scroll input ingestion completely from the React Virtual DOM reconciliation tree. Gestures flow through a deterministic microtask pipeline directly into hardware composite layers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-mono">
            {/* Stage 1 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-accent uppercase tracking-wider flex items-center justify-between">
                <span>[STAGE 01] GESTURE INGESTION</span>
                <span className="w-2 h-2 bg-accent inline-block" />
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-display font-black text-sm uppercase text-fg">Inertia Physics Solver</h4>
                <p className="text-xs text-fg/80 font-body leading-relaxed">
                  Subpixel trackpad, mousewheel, and touch momentum normalization inspired by Lenis kinetics.
                </p>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 text-[10px] text-muted font-bold uppercase">
                Zero Wheel Hijacking
              </div>
            </div>

            {/* Stage 2 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-fg uppercase tracking-wider flex items-center justify-between">
                <span>[STAGE 02] 3-PHASE TICKER</span>
                <Zap className="w-3.5 h-3.5 text-fg" />
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-display font-black text-sm uppercase text-fg">Isolated Microtask Loop</h4>
                <p className="text-xs text-fg/80 font-body leading-relaxed">
                  Strictly separated Measure, Update, and Render phases eliminate forced synchronous reflows.
                </p>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 text-[10px] text-muted font-bold uppercase">
                Single Unified RAF Queue
              </div>
            </div>

            {/* Stage 3 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-fg uppercase tracking-wider flex items-center justify-between">
                <span>[STAGE 03] DIRECT REF MUTATION</span>
                <Layers className="w-3.5 h-3.5 text-fg" />
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-display font-black text-sm uppercase text-fg">Bypasses React VDOM</h4>
                <p className="text-xs text-fg/80 font-body leading-relaxed">
                  Transforms and opacity values write straight to registered DOM ref elements and Three.js matrices.
                </p>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 text-[10px] text-muted font-bold uppercase">
                0 React Tree Passes
              </div>
            </div>

            {/* Stage 4 */}
            <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold text-accent uppercase tracking-wider flex items-center justify-between">
                <span>[STAGE 04] GPU COMPOSITING</span>
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-display font-black text-sm uppercase text-fg">Hardware Layer Writes</h4>
                <p className="text-xs text-fg/80 font-body leading-relaxed">
                  translate3d and scale transformations execute on browser compositor threads with smooth frame delivery.
                </p>
              </div>
              <div className="border-t-2 border-line-soft p-3 bg-line-soft/10 text-[10px] text-accent font-bold uppercase">
                Sub-Millisecond Execution
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Community Submission CTA Section */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="border-2 border-line bg-bg p-6 sm:p-10 shadow-rest flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3 font-body">
            <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
              <Send className="w-3 h-3 text-accent" />
              <span>[03] COMMUNITY SUBMISSIONS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-fg font-display">
              Built Something Remarkable with ScrollCraft?
            </h3>
            <p className="text-xs sm:text-sm text-fg/80 font-body leading-relaxed">
              Whether it&apos;s an immersive 3D spatial experience, an editorial narrative, or a high-velocity product launch, we feature extraordinary engineering on this curated showcase.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto font-mono">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="h-11 px-6 border-2 border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <span>SUBMIT YOUR PROJECT</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <Link
              href="/docs"
              className="h-11 px-6 border-2 border-line bg-bg hover:bg-fg text-fg hover:text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>DOCS SETUP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Pure Brutalist Submission Modal */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 font-body"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg border-2 border-line bg-bg p-6 sm:p-8 shadow-[8px_8px_0px_#DFFF00] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Titlebar */}
            <div className="flex items-center justify-between border-b-2 border-line pb-4 mb-6 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-accent inline-block" />
                <span className="font-bold text-xs uppercase tracking-wider text-fg">[SUBMISSION / 01] EXHIBITION INTAKE</span>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="h-8 w-8 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black flex items-center justify-center font-mono cursor-pointer transition-colors"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4 font-mono">
                <div className="h-12 w-12 border-2 border-line bg-accent text-black flex items-center justify-center mx-auto shadow-rest">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-black uppercase text-fg font-display">Submission Received!</h4>
                <p className="text-xs text-muted font-body max-w-xs mx-auto">
                  Your project has been queued for verification against the 0-re-render benchmark. We will follow up via your repository or email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-fg block">PROJECT NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. ATELIER PRECISION WATCH"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full h-10 px-3 border-2 border-line bg-bg text-fg font-mono uppercase focus:outline-none focus:border-accent shadow-rest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-fg block">LIVE URL / DEPLOYMENT *</label>
                  <input
                    type="url"
                    required
                    placeholder="HTTPS://PROJECT.DOMAIN.COM"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full h-10 px-3 border-2 border-line bg-bg text-fg font-mono focus:outline-none focus:border-accent shadow-rest"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-fg block">STUDIO / AUTHOR</label>
                    <input
                      type="text"
                      placeholder="NAME OR HANDLE"
                      value={formData.studioName}
                      onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                      className="w-full h-10 px-3 border-2 border-line bg-bg text-fg font-mono uppercase focus:outline-none focus:border-accent shadow-rest"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-fg block">PRIMITIVES USED</label>
                    <input
                      type="text"
                      placeholder="E.G. PIN, PARALLAX"
                      value={formData.primitivesUsed}
                      onChange={(e) => setFormData({ ...formData, primitivesUsed: e.target.value })}
                      className="w-full h-10 px-3 border-2 border-line bg-bg text-fg font-mono uppercase focus:outline-none focus:border-accent shadow-rest"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-11 border-2 border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>TRANSMIT FOR REVIEW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-muted text-center pt-1 font-body">
                  Submissions are reviewed for architectural fidelity and compliance with zero-rerender performance standards.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
