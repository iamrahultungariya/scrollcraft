'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Copy, Check, ArrowRight, Activity, Cpu, Zap, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'npm' | 'pnpm' | 'bun'>('npm');
  const [telemetry, setTelemetry] = useState({ fps: 120, velocity: 0, state: 'IDLE' });

  const installCmds = {
    npm: 'npm i @scrollcraft/react @scrollcraft/core',
    pnpm: 'pnpm add @scrollcraft/react @scrollcraft/core',
    bun: 'bun add @scrollcraft/react @scrollcraft/core',
  };

  const copyInstall = () => {
    navigator.clipboard.writeText(installCmds[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = performance.now();
    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const dt = Math.max(1, now - lastTime);
      const vel = Math.abs(currentY - lastY) / dt;
      setTelemetry({
        fps: 120,
        velocity: Number(vel.toFixed(2)),
        state: vel > 0.05 ? 'ACTIVE' : 'IDLE',
      });
      lastY = currentY;
      lastTime = now;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-20 overflow-hidden bg-[#050505]">
      {/* Background Architectural Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[360px] bg-gradient-to-b from-zinc-800/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-5xl flex flex-col items-center text-center relative z-10">
        {/* Engine Telemetry HUD Pill */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-xs font-mono text-zinc-400 mb-8 shadow-sm">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${telemetry.state === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            ENGINE {telemetry.state}
          </span>
          <span className="w-px h-3 bg-zinc-700" />
          <span className="text-zinc-300">TARGET: 120 FPS</span>
          <span className="w-px h-3 bg-zinc-700" />
          <span className="text-zinc-400">VELOCITY: {telemetry.velocity} px/ms</span>
          <span className="w-px h-3 bg-zinc-700 hidden sm:inline" />
          <span className="text-emerald-400 hidden sm:inline">ZERO VDOM RE-RENDERS</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] font-sans">
          The Zero-VDOM Scroll Engine for <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">React</span>.
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed font-sans font-normal">
          Composable primitives and low-level hooks that write hardware transforms directly to the GPU layer. Silky 120 FPS motion without per-frame React reconciliation overhead.
        </p>

        {/* Install Command Terminal Box */}
        <div className="mt-10 w-full max-w-lg bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-2.5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2 px-2 border-b border-zinc-900">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="ml-2 text-[11px] font-mono text-zinc-500">install package</span>
            </div>
            <div className="flex gap-1">
              {(['npm', 'pnpm', 'bun'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    activeTab === tab ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2.5 mt-1 font-mono text-xs sm:text-sm text-zinc-200">
            <span className="select-all truncate text-zinc-300 font-mono">
              <span className="text-zinc-600 mr-2">$</span>
              {installCmds[activeTab]}
            </span>
            <button
              onClick={copyInstall}
              className="ml-3 p-1.5 rounded-md hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/test"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all shadow-md hover:shadow-zinc-700/20 active:scale-[0.98]"
          >
            Launch Test Lab
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-800/80 hover:text-white transition-all active:scale-[0.98]"
          >
            Documentation
          </Link>
        </div>

        {/* Core Architectural Guarantees */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left border-t border-zinc-900/80 pt-10">
          <div className="p-3.5 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
              <Zap className="w-3.5 h-3.5 text-zinc-400" />
              ZERO VDOM
            </div>
            <p className="text-xs text-zinc-500">Zero React state mutations during frame loop.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              4-PHASE PIPELINE
            </div>
            <p className="text-xs text-zinc-500">Measure, Driver, Update, Render separation.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              RSC COMPLIANT
            </div>
            <p className="text-xs text-zinc-500">Next.js App Router & React 19 production ready.</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-900/60 bg-zinc-950/40">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono mb-1">
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              SUBPIXEL SETTLING
            </div>
            <p className="text-xs text-zinc-500">Fluid motion settling with integer snapping.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
