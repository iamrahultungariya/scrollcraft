'use client';

/**
 * ScrollCraft Showcase: "You Build. We Showcase."
 * Pure visual exhibition of real-world scroll architectures.
 * 100% Code-Free: No code viewers, no syntax snippets, zero clutter.
 * Rich bespoke SVG architectural illustrations with interactive category filtering.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { 
  Sparkles, 
  Cpu, 
  ArrowUpRight,
  Send,
  X,
  Hammer,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export function ShowcaseHub() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Close modal on Escape key press
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

  return (
    <div className="w-full flex flex-col items-center justify-start relative">
      {/* Hero Header */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-10 text-center relative">
        {/* Subtle Ambient Background Glow (High performance radial gradient) */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(124,58,237,0.12)_0%,transparent_70%)] pointer-events-none -z-10"
        />
        
        <Reveal direction="down" distance={20}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="uppercase tracking-widest text-[11px] font-semibold text-violet-400">CURATED EXHIBITION</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 text-[11px]">BUILT WITH SCROLLCRAFT</span>
          </div>
        </Reveal>

        <Reveal direction="up" distance={25} delay={0.1}>
          {/* Professional Dual-Tone Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] break-words">
            You Build. <span className="text-violet-400">We Showcase.</span>
          </h1>
        </Reveal>

        <Reveal direction="up" distance={20} delay={0.2}>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-4">
            An inspiring exhibition of high-framerate, physics-driven web experiences built by creative developers and digital studios with ScrollCraft.
          </p>
        </Reveal>
      </section>

      {/* Main Exhibition Showcase Master Graphic */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <Reveal direction="up" distance={30} delay={0.25}>
          <div className="relative group rounded-3xl border border-zinc-800/80 bg-[#08090d] p-3 sm:p-5 shadow-2xl shadow-black/80 overflow-hidden">
            {/* Ambient Radial Backing Light */}
            <div
              aria-hidden="true"
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_70%)] pointer-events-none"
            />

            {/* Showcase Canvas Frame Bar */}
            <div className="flex items-center justify-between px-3 py-2.5 mb-3 border-b border-zinc-800/60 bg-zinc-950/60 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="ml-2 text-[11px] font-mono text-zinc-400 hidden sm:inline">showcase.canvas • 1536 × 1024</span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-medium">120 FPS Ready</span>
                <span className="text-zinc-600 hidden md:inline">|</span>
                <span className="text-zinc-500 hidden md:inline">Hardware Accelerated</span>
              </div>
            </div>

            {/* Master Illustrator Visual (/images/showcase img.webp) */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-950 shadow-inner flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/showcase-img.webp"
                alt="ScrollCraft Exhibition Showcase"
                className="w-full h-auto object-cover rounded-2xl transition-transform duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] group-hover:scale-[1.01] select-none"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Bottom Showcase Caption Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-3 pt-4 text-xs font-mono text-zinc-500 gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-medium">Exhibition Master Canvas</span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">Curated Physical Scroll Mechanics</span>
              </div>
              <div className="text-zinc-400">
                Engineered with <span className="text-violet-400">@scrollcraft/react</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Illustrative Architecture Blueprint Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-[#0a0a0e] to-[#050507] p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-4">
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              <span>THE ARCHITECTURAL BLUEPRINT</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              How Projects Achieve Zero Re-Render Velocity
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              ScrollCraft decouples scroll input processing from the React reconciliation tree. Instead of pumping states through components on scroll, gestures flow through a deterministic microtask pipeline directly into hardware layers.
            </p>
          </div>

          {/* Flow Pipeline Graphic */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-wider block mb-2">Stage 01</span>
                <h4 className="text-sm font-bold text-white mb-2">Gesture Ingestion</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Normalized wheel, pointer, and touch delta captures with Lenis inertia dampening.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">Virtual Coordinate Pool</div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-2">Stage 02</span>
                <h4 className="text-sm font-bold text-white mb-2">4-Phase Scheduler</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Deterministic batching: Measure, Driver, Update, and Render prevent layout thrashing.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">Single Unified RAF Loop</div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block mb-2">Stage 03</span>
                <h4 className="text-sm font-bold text-white mb-2">Direct Ref Mutation</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Transforms write straight to DOM elements and Three.js matrices without React renders.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">0 React Tree Passes</div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 relative flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">Stage 04</span>
                <h4 className="text-sm font-bold text-white mb-2">GPU Compositing</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Hardware composited transforms, opacity, and WebGL buffers sustain 120 FPS rendering.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">Sub-millisecond Frame Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Submission Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 sm:pb-24">
        <div className="rounded-3xl border border-zinc-800 bg-[#070709] p-6 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs font-mono text-violet-300 mb-4">
              <Send className="w-3.5 h-3.5" />
              <span>SUBMIT YOUR WORK</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Built Something Remarkable with ScrollCraft?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Whether it&apos;s an immersive 3D spatial experience, an editorial narrative, or a high-velocity product launch, we&apos;d love to showcase your work in this curated gallery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            {/* Interactive Submit Project Button triggering the Under Development Popup */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all text-center shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Submit Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <Link
              href="/docs"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-medium text-xs transition-colors text-center"
            >
              Explore Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Under Development Popup / Modal */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-[250ms]"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          {/* Modal Card */}
          <div
            className="relative w-full max-w-md rounded-3xl border border-zinc-700/80 bg-[#0d0e14] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden transition-all transform animate-in zoom-in-[0.96] duration-[250ms] [transition-timing-function:var(--ease-smooth-out)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Glow Accent */}
            <div
              aria-hidden="true"
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[radial-gradient(circle,rgba(124,58,237,0.25)_0%,transparent_70%)] pointer-events-none"
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Animated Icon / Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.25)]">
                <Hammer className="w-6 h-6 text-violet-400 transform -rotate-12 transition-transform animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500" />
                </span>
              </div>

              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
                  Under Active Development
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Community Showcase Portal
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-300 leading-relaxed mb-5">
              We&apos;re currently engineering our automated project verification pipeline and
              interactive live sandbox embedder for community showcases. Soon you&apos;ll be able to
              submit and preview your site with 1-click!
            </p>

            {/* Feature Status Checklist */}
            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-2 mb-6 text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>60/120 FPS Performance Auditor (Ready)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GitHub Repository Link Verification (Ready)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <span className="w-4 h-4 rounded-full border border-amber-400/60 border-t-amber-400 animate-spin shrink-0" />
                <span>Automated WebGL / DOM Embedder (In Progress)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <a
                href="https://github.com/ScrollCraft/scrollcraft/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 text-center shadow-lg shadow-violet-600/25 cursor-pointer"
              >
                <span>Share in Discussions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-xs transition-colors text-center cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
