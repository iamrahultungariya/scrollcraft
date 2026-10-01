'use client';

import React, { useState, useRef, type MouseEvent } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Check, Copy } from 'lucide-react';
import { HeroFeatureShowcase } from './hero-feature-showcase';

export function Eyebrow({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.64rem] font-medium uppercase tracking-[0.2em] text-paper/45">
      <span className="text-lime">{number}</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-paper/10" />
    </div>
  );
}

function MagneticDocsButton({ className }: { className?: string }) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const el = buttonRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * 0.16;
    const y = (event.clientY - box.top - box.height / 2) * 0.2;
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
  }

  function handleLeave() {
    const el = buttonRef.current;
    if (!el) return;
    el.style.transform = 'translate3d(0, 0, 0)';
  }

  return (
    <Link
      ref={buttonRef}
      href="/docs"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-6 font-display text-xs font-bold uppercase text-lime transition-transform duration-150 hover:bg-ink/90 active:scale-95 ${className || ''}`}
    >
      <span>Explore docs</span>
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

function InstallCommand({ light = false }: { light?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [activePm, setActivePm] = useState<'pnpm' | 'npm' | 'bun'>('npm');

  const commands = {
    npm: 'npm i @scrollcraft/react @scrollcraft/core',
    pnpm: 'pnpm add @scrollcraft/react @scrollcraft/core',
    bun: 'bun add @scrollcraft/react @scrollcraft/core',
  };

  const currentCmd = commands[activePm];

  async function copyCommand() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentCmd);
      } else {
        const input = document.createElement('textarea');
        input.value = currentCmd;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    window.setTimeout(() => setStatus('idle'), 2000);
  }

  const label = status === 'copied' ? 'Copied to clipboard' : status === 'error' ? 'Copy failed' : currentCmd;

  return (
    <div
      className={`flex h-12 min-w-0 items-center justify-between rounded-md border px-3 font-mono text-xs shadow-none transition-all sm:px-4 sm:text-sm ${
        light
          ? 'border-ink/20 bg-ink text-paper'
          : 'border-paper/15 bg-panel text-paper/85'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 overflow-hidden pr-2">
        <div className="flex items-center gap-1 border-r border-ink/30 pr-2">
          {(['npm', 'pnpm', 'bun'] as const).map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => setActivePm(pm)}
              className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                activePm === pm
                  ? 'bg-lime text-ink font-bold'
                  : 'text-paper/50 hover:text-paper'
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
        <span className="text-lime select-none font-bold">$</span>
        <span className="truncate select-all text-xs font-mono">{label}</span>
      </div>

      <button
        type="button"
        onClick={copyCommand}
        aria-label={status === 'copied' ? 'Install command copied' : 'Copy install command'}
        className="shrink-0 p-1.5 rounded hover:bg-paper/10 text-paper/60 hover:text-paper transition-colors cursor-pointer"
        title="Copy command"
      >
        {status === 'copied' ? (
          <Check className="size-4 text-lime" />
        ) : (
          <Copy className="size-4 opacity-60 hover:opacity-100 transition-opacity" />
        )}
      </button>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="hero-shell relative w-full border-b border-paper/10 bg-ink">
      {/* First Viewport Hero Grid */}
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 pb-8 pt-10 sm:px-10 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:pb-16">
        
        {/* Left Column: Stacked Kinetic Typography */}
        <div className="relative z-10">
          <Eyebrow number="01">Zero-VDOM Engine</Eyebrow>

          <h1 className="hero-title mt-7 font-display font-extrabold uppercase text-paper">
            <span>Scroll</span>
            <span>is the</span>
            <span className="text-lime">engine.</span>
          </h1>

          <p className="mt-6 max-w-[44ch] text-sm leading-relaxed text-paper/70 sm:text-base font-body">
            ScrollCraft decouples scroll animations from React Fiber. Instead of triggering full component re-renders on high-frequency scroll events, spatial matrices are calculated in a 4-phase game loop and applied directly to DOM hardware layers.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-paper/50">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-lime" />
              REACT 19 + NEXT.JS 15
            </span>
            <span>//</span>
            <span>HARDWARE COMPOSITOR DRIVEN</span>
            <span>//</span>
            <span>WEAKMAP MEMORY SAFETY</span>
          </div>
        </div>

        {/* Right Column: Real Feature Showcase Stage */}
        <div className="relative lg:pt-4">
          <HeroFeatureShowcase />
        </div>

      </div>

      {/* High-Impact Signal-Lime Conversion Banner */}
      <div className="bg-lime text-ink">
        <div className="mx-auto grid max-w-[1280px] gap-5 px-5 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-10 lg:grid-cols-[280px_1fr_220px]">
          {/* Sizing Specifications */}
          <div className="flex items-end justify-between gap-8 border-b border-ink/20 pb-4 sm:block sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
            <div>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink/70">
                Core Engine
              </span>
              <div className="font-display text-2xl font-extrabold tracking-tight">
                &lt;5 KB
              </div>
              <span className="text-[10px] font-mono text-ink/60">Tree-shakable zero-dep core</span>
            </div>
            <div className="text-right sm:mt-2 sm:text-left">
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink/70">
                Full Suite
              </span>
              <div className="font-display text-sm font-bold tracking-tight">
                24 KB
              </div>
              <span className="text-[10px] font-mono text-ink/60">Primitives, hooks & physics</span>
            </div>
          </div>

          {/* Terminal Command */}
          <InstallCommand light />

          {/* Magnetic CTA Button */}
          <MagneticDocsButton />
        </div>
      </div>

      {/* Bottom See-It-In-Motion Prompt */}
      <a
        href="#primitives"
        className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper/40 hover:text-paper transition-colors sm:px-10"
      >
        <span>Inspect architecture & primitives</span>
        <ArrowDown className="size-3.5 animate-bounce text-lime" aria-hidden="true" />
      </a>
    </section>
  );
}
