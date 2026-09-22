'use client';

/**
 * ScrollCraft Section: Final CTA ("Ready when you are.")
 * - Pixel-perfect match to media_1789367953976.png (Top Part)
 * - Headline: "Ready when you are." with blue highlighted "you are."
 * - Badges: MIT Licensed • Free & Open Source
 * - Buttons: Documentation →, Star on GitHub, npm i @scrollcraft/react
 * - Supported badges: React 18/19 | Next.js Ready | Vite Supported | MIT Licensed
 * - Right: Floating 3D perspective card with glowing blue cube visual
 * - Outer right watermark: "BUILD / SCROLL / BETTER. —"
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Reveal } from '@scrollcraft/react';
import { ArrowRight, BookOpen, Check, Copy, Shield, Terminal, Code2, Cpu, CheckCircle2 } from 'lucide-react';

export function FinalCTASection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'quickstart' | 'specs'>('terminal');
  const [copiedCode, setCopiedCode] = useState(false);
  const installCmd = 'npm i @scrollcraft/react@beta';

  const quickstartSnippet = `import { ScrollProvider, Parallax } from '@scrollcraft/react';

export default function App() {
  return (
    <ScrollProvider smooth={true}>
      <main className="min-h-[200vh] flex flex-col items-center justify-center">
        <Parallax speed={0.25}>
          <h1 className="text-5xl font-extrabold text-white">
            Make the web move.
          </h1>
        </Parallax>
      </main>
    </ScrollProvider>
  );
};`;

  const copyToClipboard = (text: string, onSuccess: () => void) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        fallbackCopy(text, onSuccess);
      });
    } else {
      fallbackCopy(text, onSuccess);
    }
  };

  const fallbackCopy = (text: string, onSuccess: () => void) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      onSuccess();
    } catch {
      // Fallback failed
    }
  };

  const copyQuickstart = () => {
    copyToClipboard(quickstartSnippet, () => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const copyCommand = () => {
    copyToClipboard(installCmd, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="relative w-full bg-[#050505] py-16 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 overflow-hidden">
      {/* Background Ambience Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Far Right Floating Watermark */}
      <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-start font-mono text-[10px] tracking-[0.25em] text-zinc-600 uppercase select-none pointer-events-none">
        <span>BUILD</span>
        <span>SCROLL</span>
        <span>BETTER</span>
        <div className="w-5 h-[1.5px] bg-zinc-700 mt-2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <Reveal direction="down" distance={15}>
              {/* MIT Licensed Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 mb-5 sm:mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                <span className="font-semibold text-[11px] uppercase tracking-wider text-zinc-300">
                  MIT LICENSED
                </span>
                <span className="text-zinc-600">&bull;</span>
                <span className="text-[11px] text-zinc-400">FREE &amp; OPEN SOURCE</span>
              </div>
            </Reveal>

            <Reveal direction="up" distance={20} delay={0.1}>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-4 sm:mb-5 break-words">
                <span className="text-white">Ready when </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">you are.</span>
              </h2>
            </Reveal>

            <Reveal direction="up" distance={15} delay={0.2}>
              <p className="text-xs sm:text-base text-zinc-400 max-w-xl leading-relaxed mb-6 sm:mb-8">
                Start building high-performance, scroll-driven web experiences in minutes. Direct GPU compositor writes, zero wrapper clutter.
              </p>
            </Reveal>

            {/* CTAs Row */}
            <Reveal direction="up" distance={15} delay={0.25}>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-8 sm:mb-10 w-full sm:w-auto">
                {/* Documentation Button */}
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-black" />
                  <span>Documentation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </Link>

                {/* Star on GitHub */}
                <a
                  href="https://github.com/ScrollCraft/scrollcraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-medium text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span>Star on GitHub</span>
                </a>

                {/* npm install command */}
                <button
                  type="button"
                  onClick={copyCommand}
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 transition-all cursor-pointer shadow-inner active:scale-95 max-w-full overflow-hidden"
                  title="Copy install command"
                >
                  <span className="text-zinc-500 select-none">$</span>
                  <span className="truncate">{installCmd}</span>
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 ml-1 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400 ml-1 hover:text-white shrink-0" />
                  )}
                </button>
              </div>
            </Reveal>

            {/* Supported Technologies Row */}
            <div className="flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-mono text-zinc-400 flex-wrap pt-3 border-t border-zinc-800/80 w-full">
              <div className="flex items-center gap-2 text-zinc-300">
                <svg className="w-4 h-4 text-violet-400" viewBox="-11.5 -10.23174 23 20.46348">
                  <circle cx="0" cy="0" r="2.05" fill="#a78bfa"/>
                  <g stroke="#a78bfa" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                  </g>
                </svg>
                <span>Works with React 18/19</span>
              </div>

              <span className="text-zinc-700 select-none">|</span>

              <div className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
                  N
                </span>
                <span>Next.js Ready</span>
              </div>

              <span className="text-zinc-700 select-none">|</span>

              <div className="flex items-center gap-1.5 text-zinc-300">
                <span className="text-purple-400 text-sm">⚡</span>
                <span>Vite Supported</span>
              </div>

              <span className="text-zinc-700 select-none">|</span>

              <div className="flex items-center gap-1.5 text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-violet-400" />
                <span>MIT Licensed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Developer Quickstart & Runtime Console */}
          <div className="lg:col-span-5 flex items-center justify-center relative w-full">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[480px]">
                {/* Subtle Ambient Backing Glow */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600/10 via-purple-500/10 to-indigo-600/10 opacity-75 pointer-events-none"
                />

                {/* Main Console Box - Rigid Layout with ZERO Shift */}
                <div className="relative w-full h-[360px] min-h-[360px] max-h-[360px] rounded-2xl border border-zinc-800/90 bg-[#090a0f] shadow-2xl overflow-hidden flex flex-col justify-between">
                  {/* Console Header Bar - Fixed 48px */}
                  <div className="flex items-center justify-between px-3 sm:px-4 h-12 min-h-[48px] max-h-[48px] border-b border-zinc-800/80 bg-zinc-950/70 shrink-0">
                    {/* Window Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                    </div>

                    {/* Interactive Tab Switcher - Fixed Button Widths */}
                    <div className="flex items-center gap-1 bg-zinc-900/90 p-0.5 sm:p-1 rounded-lg border border-zinc-800/60">
                      <button
                        type="button"
                        onClick={() => setActiveTab('terminal')}
                        className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer ${
                          activeTab === 'terminal'
                            ? 'bg-zinc-800 text-white font-medium shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Terminal className="w-3 h-3 text-violet-400 shrink-0" />
                        <span>term</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('quickstart')}
                        className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer ${
                          activeTab === 'quickstart'
                            ? 'bg-zinc-800 text-white font-medium shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Code2 className="w-3 h-3 text-violet-400 shrink-0" />
                        <span>App.tsx</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('specs')}
                        className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer ${
                          activeTab === 'specs'
                            ? 'bg-zinc-800 text-white font-medium shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Cpu className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>specs</span>
                      </button>
                    </div>

                    {/* Online Status Pill */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="hidden sm:inline">RAF Sync</span>
                    </div>
                  </div>

                  {/* Tab Body - Locked 268px Height Container across all tabs */}
                  <div className="p-4 sm:p-5 h-[268px] min-h-[268px] max-h-[268px] flex flex-col justify-between overflow-hidden">
                    {/* TAB 1: TERMINAL */}
                    {activeTab === 'terminal' && (
                      <div className="space-y-2.5 font-mono text-xs flex flex-col justify-between h-full">
                        {/* Interactive Command Prompt */}
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 group">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-zinc-500 select-none">$</span>
                            <span className="text-violet-300 font-semibold truncate">{installCmd}</span>
                          </div>
                          <button
                            type="button"
                            onClick={copyCommand}
                            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Copy command"
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Professional Engine Logs */}
                        <div className="space-y-1.5 text-[11px] text-zinc-400">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Package: @scrollcraft/react@0.2.0-beta</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Compositor: Direct GPU matrix transforms</span>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Ticker: Decoupled 3-phase microtask loop</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Footprint: &lt; 5.2 KB Brotli • 0 runtime dependencies</span>
                          </div>
                        </div>

                        {/* Telemetry Status Bar */}
                        <div className="pt-0.5">
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                              <span>Active release:</span>
                            </div>
                            <span className="text-emerald-400 font-semibold">v0.2.0 Beta (LIVE)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: QUICKSTART CODE */}
                    {activeTab === 'quickstart' && (
                      <div className="relative font-mono text-xs flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800/60 pb-1 mb-1 shrink-0">
                          <span className="text-zinc-500">Drop-in JSX example</span>
                          <button
                            type="button"
                            onClick={copyQuickstart}
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[10px]"
                          >
                            {copiedCode ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-zinc-400" />
                                <span>Copy code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-[11px] leading-[1.6] text-zinc-300 overflow-y-auto overflow-x-hidden p-1 font-mono flex-1 whitespace-pre-wrap break-words">
                          <span className="text-purple-400">import</span> &#123; <span className="text-violet-300">ScrollProvider</span>, <span className="text-violet-300">Parallax</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;@scrollcraft/react&apos;</span>;{'\n\n'}
                          <span className="text-purple-400">export default function</span> <span className="text-violet-400 font-semibold">App</span>() &#123;{'\n'}
                          {'  '}<span className="text-purple-400">return</span> ({'\n'}
                          {'    '}&lt;<span className="text-violet-300">ScrollProvider</span> <span className="text-amber-300">smooth</span>=&#123;<span className="text-emerald-400">true</span>&#125;&gt;{'\n'}
                          {'      '}&lt;<span className="text-zinc-300">main</span> <span className="text-amber-300">className</span>=<span className="text-emerald-300">&quot;min-h-[200vh]&quot;</span>&gt;{'\n'}
                          {'        '}&lt;<span className="text-violet-300">Parallax</span> <span className="text-amber-300">speed</span>=&#123;<span className="text-emerald-400">0.25</span>&#125;&gt;{'\n'}
                          {'          '}&lt;<span className="text-zinc-100">h1</span>&gt;Make the web move.&lt;/<span className="text-zinc-100">h1</span>&gt;{'\n'}
                          {'        '}&lt;/<span className="text-violet-300">Parallax</span>&gt;{'\n'}
                          {'      '}&lt;/<span className="text-zinc-300">main</span>&gt;{'\n'}
                          {'    '}&lt;/<span className="text-violet-300">ScrollProvider</span>&gt;{'\n'}
                          {'  '});{'\n'}
                          &#125;
                        </pre>
                      </div>
                    )}

                    {/* TAB 3: ENGINE SPECS */}
                    {activeTab === 'specs' && (
                      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs h-full content-between">
                        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 flex flex-col justify-between">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Bundle Footprint</span>
                          <span className="text-lg sm:text-xl font-bold text-white mt-1">&lt; 5.2 KB</span>
                          <span className="text-[10px] text-zinc-400 mt-0.5">Brotli • 0 Dependencies</span>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 flex flex-col justify-between">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Frame Pipeline</span>
                          <span className="text-lg sm:text-xl font-bold text-emerald-400 mt-1">Host VSync</span>
                          <span className="text-[10px] text-zinc-400 mt-0.5">Adaptive 60–240 Hz</span>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 flex flex-col justify-between">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">DOM Compositing</span>
                          <span className="text-lg sm:text-xl font-bold text-emerald-400 mt-1">Zero Re-renders</span>
                          <span className="text-[10px] text-zinc-400 mt-0.5">Direct Transform Writes</span>
                        </div>

                        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 flex flex-col justify-between">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Component Model</span>
                          <span className="text-lg sm:text-xl font-bold text-violet-400 mt-1">React 18 &amp; 19</span>
                          <span className="text-[10px] text-zinc-400 mt-0.5">RSC Streaming Ready</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Console Bottom Bar - Fixed 44px */}
                  <div className="flex items-center justify-between px-4 h-11 min-h-[44px] max-h-[44px] bg-zinc-950/90 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500 shrink-0">
                    <div className="flex items-center gap-3">
                      <span>engine: direct-dom</span>
                      <span className="text-zinc-700">&bull;</span>
                      <span>zero layout shift</span>
                    </div>
                    <span className="text-emerald-400 font-medium font-mono text-[10px]">v0.2.0-beta • active release</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
