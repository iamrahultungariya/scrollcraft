'use client';

/**
 * ScrollCraft Section 5: R3F Preview (Alpha)
 * - Pixel-perfect match to media_1789366052160.png
 * - Real Three.js (@react-three/fiber) 3D canvas with glowing coral-red cube, orbiting meshes, light beam, and orbit ring
 * - Synchronous scroll-driven telemetry via @scrollcraft/react and @scrollcraft/r3f
 * - Copyable production-ready TSX code snippet
 * - Auto-rotate toggle switch & interactive live controls
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Reveal, useScrollCraft, useScrollCraftTier } from '@scrollcraft/react';
import {
  Box,
  Zap,
  Leaf,
  ExternalLink,
  Copy,
  Check,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

// Dynamically load the R3F WebGL Canvas (SSR false to prevent hydration errors)
const R3FCanvasStage = dynamic(() => import('./r3f-canvas-stage'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-zinc-500 gap-2">
      <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      <span className="animate-pulse">Mounting WebGL Context...</span>
    </div>
  ),
});

const R3F_CODE = `import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useScroll3D } from '@scrollcraft/r3f'

function Box({ targetRef }) {
  const mesh = useRef()
  const { tick } = useScroll3D(targetRef.current)

  useFrame(() => {
    const { progress } = tick()
    mesh.current.rotation.y = progress * Math.PI * 2
    mesh.current.position.y = progress * 2
  })

  return <mesh ref={mesh}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#ff4d6d" />
  </mesh>
}`;

/**
 * Tokenizer for TSX code in Scene.tsx
 */
function renderR3FSyntaxLine(line: string, lineIndex: number): React.ReactNode {
  if (!line.trim()) {
    return <span key={lineIndex}>&nbsp;</span>;
  }

  // Pure comment line
  if (line.trim().startsWith('//')) {
    return (
      <span key={lineIndex} className="text-zinc-500 italic">
        {line}
      </span>
    );
  }

  const tokenRegex =
    /(\/\*[\s\S]*?\*\/|\/\/.*$)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')|(\b(?:import|export|from|function|const|return)\b)|(<\/?(?:mesh|boxGeometry|meshStandardMaterial)|(?:\/>|>))|(\b(?:ref|args|color|scrollY|mesh)\b)|(\b(?:useRef|Canvas|useFrame|useScroll3D|Box|Math|PI)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=.:\$\*\/])/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`text-${lastIndex}`} className="text-zinc-200">
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }

    const [full, comment, str, keyword, tag, prop, identifier, num, punct] = match;

    if (comment) {
      nodes.push(
        <span key={`comment-${match.index}`} className="text-zinc-500 italic">
          {comment}
        </span>
      );
    } else if (str) {
      nodes.push(
        <span key={`str-${match.index}`} className="text-emerald-400">
          {str}
        </span>
      );
    } else if (keyword) {
      nodes.push(
        <span key={`kw-${match.index}`} className="text-purple-400 font-semibold">
          {keyword}
        </span>
      );
    } else if (tag) {
      nodes.push(
        <span key={`tag-${match.index}`} className="text-sky-400 font-medium">
          {tag}
        </span>
      );
    } else if (prop) {
      nodes.push(
        <span key={`prop-${match.index}`} className="text-cyan-300">
          {prop}
        </span>
      );
    } else if (identifier) {
      nodes.push(
        <span key={`id-${match.index}`} className="text-sky-400">
          {identifier}
        </span>
      );
    } else if (num) {
      nodes.push(
        <span key={`num-${match.index}`} className="text-purple-300">
          {num}
        </span>
      );
    } else if (punct) {
      nodes.push(
        <span key={`punct-${match.index}`} className="text-zinc-400">
          {punct}
        </span>
      );
    } else {
      nodes.push(
        <span key={`other-${match.index}`} className="text-zinc-200">
          {full}
        </span>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <span key={`rem-${lastIndex}`} className="text-zinc-200">
        {line.slice(lastIndex)}
      </span>
    );
  }

  return <>{nodes}</>;
}

export function R3FPreviewSection() {
  const [copied, setCopied] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef({ progress: 0, velocity: 0 });

  const tier = useScrollCraftTier();
  const { subscribe } = useScrollCraft();

  // IntersectionObserver to pause Three.js frameloop offscreen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pure mutable ref binding: zero React re-renders, zero jitter
  useEffect(() => {
    const unsub = subscribe((m) => {
      scrollRef.current.progress = m.progress || 0;
      scrollRef.current.velocity = m.velocity || 0;
    });

    return () => unsub();
  }, [subscribe]);

  const handleCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(R3F_CODE).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, []);

  const codeLines = useMemo(() => R3F_CODE.split('\n'), []);

  return (
    <section
      ref={sectionRef}
      id="r3f"
      className="relative w-full bg-[#050505] py-16 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 overflow-hidden"
    >
      {/* Outer Left Edge Floating Watermark */}
      <div className="hidden xl:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-start font-mono text-[10px] tracking-[0.25em] text-zinc-600 uppercase select-none pointer-events-none">
        <span>SCROLL</span>
        <span>MEETS</span>
        <span>DEPTH.</span>
        <div className="w-5 h-[1.5px] bg-zinc-700 mt-2" />
      </div>

      {/* Outer Right Edge Floating Watermark */}
      <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-start font-mono text-[10px] tracking-[0.25em] text-zinc-600 uppercase select-none pointer-events-none">
        <span>SIMPLE 3D.</span>
        <span>REAL IMPACT.</span>
        <div className="w-5 h-[1.5px] bg-zinc-700 mt-2" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {/* Alpha Preview Pill */}
          <Reveal direction="down" distance={15}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/30 border border-red-500/20 text-xs font-mono mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
              <span className="text-red-400 font-bold uppercase tracking-wider text-[11px]">
                ALPHA PREVIEW
              </span>
              <span className="text-zinc-500 text-[11px]">@scrollcraft/r3f</span>
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-3 sm:mb-5 break-words">
              <span className="text-white block">Now leaking into the</span>
              <span className="text-[#ff4d6d] block">third dimension.</span>
            </h2>
          </Reveal>

          {/* Subtitle */}
          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Pull-based scroll metrics synchronization for React Three Fiber.
              <br className="hidden sm:inline" /> Synchronize 3D meshes without double-pumping RequestAnimationFrame.
            </p>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal direction="up" distance={15} delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <Link
                href="/docs#r3f"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-black" />
                <span>View Docs</span>
              </Link>
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Explore Showcase</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Split Grid: Left (Code) vs Right (Live 3D Canvas) */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-12">
          {/* Left: Code Viewer */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-[#09090b] p-5 sm:p-6 shadow-2xl overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <Box className="w-5 h-5 text-[#ff4d6d]" />
                  <span className="text-base font-mono font-bold text-white">useScroll3D()</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider">
                    ALPHA
                  </span>
                </div>
                <Link
                  href="/docs#r3f"
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>R3F Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                Invoke useScroll3D inside your native R3F useFrame loop. Pulls latest scroll data synchronously on the render tick.
              </p>

              {/* Code Editor Window */}
              <div className="rounded-xl bg-[#060608] border border-zinc-800/80 overflow-hidden shadow-inner">
                {/* Titlebar */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0d0d10] border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    {/* Mac Traffic Lights */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
                    </div>
                    <span className="text-xs font-mono text-zinc-400">Scene.tsx</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono transition-all cursor-pointer ${
                        copied
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-zinc-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] font-mono transition-all cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-zinc-400" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                {/* Code Table */}
                <div className="p-4 overflow-x-auto select-text font-mono text-[12.5px] leading-relaxed">
                  <table className="w-full border-collapse">
                    <tbody>
                      {codeLines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="pr-4 text-right text-zinc-600 select-none w-6 align-top text-xs shrink-0">
                            {idx + 1}
                          </td>
                          <td className="whitespace-pre text-zinc-200">
                            {renderR3FSyntaxLine(line, idx)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Three.js Native</span>
              <span>Single Unified RAF Loop</span>
            </div>
          </div>

          {/* Right: Live Interactive 3D Canvas Preview */}
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800/80 bg-[#070709] relative overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-4 sm:p-6">
            {/* Top Bar Overlay */}
            <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 z-10 flex items-center justify-between pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-md pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-[#ff4d6d] shadow-[0_0_8px_rgba(255,77,109,0.9)] animate-pulse" />
                <span className="text-xs font-semibold text-white">Live Preview</span>
              </div>

              <div className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-zinc-400 pointer-events-auto select-none">
                Scroll to interact
              </div>
            </div>

            {/* 3D WebGL Canvas Viewport */}
            <div className="relative w-full h-[290px] sm:h-[390px] rounded-xl overflow-hidden flex items-center justify-center">
              {tier === 'low' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#070709] p-6 text-center">
                  <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#ff4d6d]/20 to-purple-600/20 border border-[#ff4d6d]/40 rotate-12 transform-gpu" />
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-[#ff4d6d] to-[#d90429] shadow-[0_0_25px_rgba(255,77,109,0.5)] flex items-center justify-center">
                      <Box className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-300 font-semibold mb-1">
                    WebGL Optimized (Power Saver)
                  </span>
                  <span className="text-[11px] text-zinc-500 max-w-xs leading-normal">
                    WebGL context suspended to guarantee locked 60 FPS on low-power hardware.
                  </span>
                </div>
              ) : (
                <R3FCanvasStage
                  scrollRef={scrollRef}
                  autoRotate={autoRotate}
                  isVisible={isVisible}
                />
              )}

              {/* Bottom-left overlay inside canvas */}
              <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase select-none pointer-events-none flex flex-col gap-0.5 leading-tight">
                <span>SCROLL</span>
                <span>ROTATE</span>
                <span>EXPLORE</span>
              </div>

              {/* Bottom-right auto-rotate toggle inside canvas */}
              <div className="absolute bottom-4 right-4 z-10 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md text-xs text-white hover:border-zinc-500 transition-all cursor-pointer shadow-lg"
                >
                  <div
                    className={`w-7 h-3.5 rounded-full p-0.5 transition-colors flex items-center ${
                      autoRotate ? 'bg-[#ff4d6d]' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                        autoRotate ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-medium font-sans">Auto Rotate</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3 Spec Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-5xl mx-auto border-t border-zinc-800/80">
          {/* Spec 1: Scroll Synced */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Scroll Synced</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Real-time, smooth updates</p>
            </div>
          </div>

          {/* Spec 2: Lightweight */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Lightweight</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Built for performance</p>
            </div>
          </div>

          {/* Spec 3: Framework Agnostic */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Framework Agnostic</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Works with any R3F setup</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
