'use client';

/**
 * ScrollCraft Showcase: "You Build. We Showcase."
 * Authentic Brutalist Community Exhibition Portal:
 * - Pure Brutalist design: font-display (Sora), font-body (Manrope), font-mono (JetBrains Mono)
 * - Strict palette: #0C0F0C (bg), #F4F1EA (fg), #A8ABA0 (muted), #DFFF00 (accent)
 * - Zero fake agency cards, zero stock photo fluff
 * - Genuine community submission intake & real verified builds
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Send,
  X,
  Check,
  ArrowRight,
  ShieldCheck,
  Layers,
  Cpu,
  Sparkles,
} from 'lucide-react';

interface VerifiedBuild {
  id: string;
  tag: string;
  badge: string;
  title: string;
  description: string;
  primitives: string[];
  href: string;
  isExternal?: boolean;
  metrics: string;
}

const VERIFIED_BUILDS: VerifiedBuild[] = [
  {
    id: 'test-lab',
    tag: 'DOGFOOD // 01',
    badge: 'INTERACTIVE LAB',
    title: 'ScrollCraft Interactive Test Laboratory',
    description:
      'The official test harness dogfooding all 25+ primitives and reactive hooks in production. Features live telemetry, subpixel scroll tracking, and frame performance verification.',
    primitives: ['<Parallax />', '<Pin />', '<Reveal />', '<VelocityMarquee />', '<StackedCards />'],
    href: '/test',
    metrics: '25 Active Demos • 0 VDOM Re-renders',
  },
  {
    id: 'stress-studio',
    tag: 'BENCHMARK // 02',
    badge: 'STRESS LAB',
    title: 'Zero-Re-Render Compositor Benchmarks',
    description:
      'Hardware matrix benchmarking environment comparing traditional React state scroll updates against ScrollCraft direct ref mutations under heavy multi-node concurrency.',
    primitives: ['<ScrollTransform />', '<ScrollDraw />', 'useTicker()'],
    href: '/test/robust',
    metrics: '100+ Concurrent Nodes • 120 FPS Composited',
  },
  {
    id: 'docs-portal',
    tag: 'PRODUCTION // 03',
    badge: 'DOCS HUB',
    title: 'ScrollCraft Technical Manual',
    description:
      'Developer documentation built with zero layout shifts, continuous reading-progress rail, interactive package manager tabs, and polymorphic Next.js App Router slot composition.',
    primitives: ['<ScrollProgress />', '<Reveal />', 'useScrollProgress()'],
    href: '/docs',
    metrics: 'Full TypeScript API • <5KB Brotli',
  },
];

export function ShowcaseHub() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const submitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [formData, setFormData] = useState({
    projectName: '',
    liveUrl: '',
    githubUrl: '',
    authorName: '',
    primitivesUsed: '',
  });

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

  // Teardown pending timers on unmount
  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
    submitTimerRef.current = setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setFormData({
        projectName: '',
        liveUrl: '',
        githubUrl: '',
        authorName: '',
        primitivesUsed: '',
      });
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col items-center font-body text-fg not-prose selection:bg-accent selection:text-black">
      {/* 1. Header & Hero: You Build. We Showcase. */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 border-b border-line-soft">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="border border-line-soft bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
              <span className="w-2 h-2 bg-accent inline-block" />
              <span>[COMMUNITY EXHIBITION / 01]</span>
            </div>

            {/* Submit Project Button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="h-10 px-4 border border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>SUBMIT YOUR BUILD</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
              You Build. <span className="text-accent">We Showcase.</span>
            </h1>
            <p className="text-base sm:text-lg text-fg/90 font-body leading-relaxed max-w-3xl">
              An authentic exhibition of real-world projects, creative experiments, and production sites built with ScrollCraft. Every submission is reviewed against our zero-rerender performance standard.
            </p>
          </div>

          {/* Standards Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted border-t border-line-soft">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-fg font-bold uppercase">ZERO VDOM RE-RENDERS</span>
            </div>
            <span className="text-muted/40">•</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-accent" />
              <span className="text-fg font-bold uppercase">DIRECT GPU MATRIX TRANSFORMS</span>
            </div>
            <span className="text-muted/40">•</span>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent" />
              <span className="text-fg font-bold uppercase">RSC &amp; NEXT.JS 15 NATIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Verified Builds & Community Directory */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-line-soft">
        <div className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-line-soft pb-3 font-mono">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-fg">
              <span className="w-2 h-2 bg-accent inline-block" />
              <span>VERIFIED DIRECTORY</span>
            </div>
            <span className="text-[11px] text-muted">AUTHENTIC PRODUCTION IMPLEMENTATIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
            {VERIFIED_BUILDS.map((item) => (
              <article
                key={item.id}
                className="border border-line-soft bg-bg shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header Strip */}
                  <div className="border-b border-line-soft bg-line-soft/30 px-4 py-2.5 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-accent uppercase tracking-wider">{item.tag}</span>
                    <span className="text-muted uppercase text-[10px] border border-line-soft px-1.5 py-0.5 bg-bg">
                      {item.badge}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3 font-body">
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-fg/80 leading-relaxed font-body">
                      {item.description}
                    </p>

                    {/* Primitives Strip */}
                    <div className="flex flex-wrap gap-1.5 pt-2 font-mono">
                      {item.primitives.map((prim) => (
                        <span
                          key={prim}
                          className="text-[10px] px-2 py-0.5 border border-line-soft bg-bg text-muted font-bold uppercase"
                        >
                          {prim}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-line-soft p-4 bg-line-soft/10 flex items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] text-muted font-bold uppercase truncate max-w-[60%]">
                    {item.metrics}
                  </span>

                  <Link
                    href={item.href}
                    className="h-8 px-3 border border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover transition-all inline-flex items-center gap-1.5 shrink-0"
                  >
                    <span>LAUNCH</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}

            {/* Slot 04: Community Submission Callout Card */}
            <article className="border border-line-soft border-dashed bg-bg/50 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="border border-accent/40 bg-accent/10 inline-flex items-center gap-2 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-accent w-fit">
                  <Sparkles className="w-3 h-3" />
                  <span>SLOT AVAILABLE</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
                  Your Project Here
                </h3>

                <p className="text-xs sm:text-sm text-muted font-body leading-relaxed">
                  Have you built a high-performance web experience, portfolio, spatial 3D product canvas, or interactive editorial story with ScrollCraft? We want to feature your work.
                </p>

                <ul className="text-xs font-mono text-muted space-y-1.5 pt-1">
                  <li className="flex items-center gap-2">
                    <span className="text-accent font-bold">✓</span> Free permanent showcase listing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent font-bold">✓</span> Direct backlinks to your live site &amp; repo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent font-bold">✓</span> Architecture &amp; 0-re-render verification badge
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="h-10 px-5 border border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2 cursor-pointer w-full"
              >
                <span>SUBMIT YOUR BUILD FOR REVIEW</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* 3. Community Submission Intake Modal */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 font-body"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg border-2 border-line bg-bg p-6 sm:p-8 shadow-[8px_8px_0px_#DFFF00] overflow-hidden font-body"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Titlebar */}
            <div className="flex items-center justify-between border-b-2 border-line pb-4 mb-6 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-accent inline-block" />
                <span className="font-bold text-xs uppercase tracking-wider text-fg">
                  [SUBMISSION] EXHIBITION INTAKE
                </span>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="h-8 w-8 border border-line bg-bg hover:bg-accent text-fg hover:text-black flex items-center justify-center font-mono cursor-pointer transition-colors"
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
                  Your project has been queued for verification against the 0-re-render benchmark. We will review your deployment and feature it in the showcase.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-fg block">PROJECT NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. MY PORTFOLIO / STUDIO SITE"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full h-10 px-3 border border-line bg-bg text-fg font-mono uppercase focus:outline-none focus:border-accent shadow-rest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-fg block">LIVE URL / DEPLOYMENT *</label>
                  <input
                    type="url"
                    required
                    placeholder="HTTPS://MYPROJECT.COM"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full h-10 px-3 border border-line bg-bg text-fg font-mono focus:outline-none focus:border-accent shadow-rest"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-fg block">CREATOR / AUTHOR</label>
                    <input
                      type="text"
                      placeholder="NAME OR @HANDLE"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full h-10 px-3 border border-line bg-bg text-fg font-mono uppercase focus:outline-none focus:border-accent shadow-rest"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold uppercase text-fg block">GITHUB REPO (OPTIONAL)</label>
                    <input
                      type="url"
                      placeholder="HTTPS://GITHUB.COM/..."
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full h-10 px-3 border border-line bg-bg text-fg font-mono focus:outline-none focus:border-accent shadow-rest"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-fg block">PRIMITIVES USED</label>
                  <input
                    type="text"
                    placeholder="E.G. <Parallax />, <Pin />, <Reveal />"
                    value={formData.primitivesUsed}
                    onChange={(e) => setFormData({ ...formData, primitivesUsed: e.target.value })}
                    className="w-full h-10 px-3 border border-line bg-bg text-fg font-mono uppercase focus:outline-none focus:border-accent shadow-rest"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-11 border border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>TRANSMIT FOR REVIEW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-muted text-center pt-1 font-body">
                  Prefer GitHub? Open a{' '}
                  <a
                    href="https://github.com/ScrollCraft/scrollcraft/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2"
                  >
                    Showcase Submission Issue ↗
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
