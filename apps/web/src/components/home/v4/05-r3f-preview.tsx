'use client';

/**
 * ScrollCraft Section 4: Spatial WebGL / R3F Preview
 * - Professional 3D spatial stage aligned to Electric Violet & Cyan identity
 * - Real Three.js (@react-three/fiber) canvas with synchronous scroll-driven telemetry
 * - Copyable production-ready TSX code snippet
 * - Auto-rotate toggle switch & interactive live controls
 * - Strictly under 650 LOC.
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
  Layers,
} from 'lucide-react';
import Link from 'next/link';

// Dynamically load the R3F WebGL Canvas (SSR false to prevent hydration errors)
const R3FCanvasStage = dynamic(() => import('./r3f-canvas-stage'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-zinc-500 gap-2">
      <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      <span className="animate-pulse">Mounting WebGL Context...</span>
    </div>
  ),
});

const R3F_CODE = `import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';

function SpatialMonolith({ targetRef }) {
  const meshRef = useRef(null);
  const { tick } = useScroll3D(targetRef.current);

  useFrame(() => {
    // Pull synchronized scroll progress in render phase
    const { progress } = tick();
    meshRef.current.rotation.y = progress * Math.PI * 2;
    meshRef.current.rotation.x = Math.sin(progress * Math.PI) * 0.4;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshPhysicalMaterial
        color="#1e1338"
        emissive="#7c3aed"
        emissiveIntensity={0.6}
        roughness={0.15}
        clearcoat={1}
      />
    </mesh>
  );
}`;

/**
 * Tokenizer for TSX code in Scene.tsx
 */
function renderR3FSyntaxLine(line: string, lineIndex: number): React.ReactNode {
  if (!line.trim()) {
    return <span key={lineIndex}>&nbsp;</span>;
  }

  if (line.trim().startsWith('//')) {
    return (
      <span key={lineIndex} className="text-zinc-500 italic">
        {line}
      </span>
    );
  }

  const tokenRegex =
    /(\/\*[\s\S]*?\*\/|\/\/.*$)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')|(\b(?:import|export|from|function|const|return)\b)|(<\/?(?:mesh|octahedronGeometry|meshPhysicalMaterial)|(?:\/>|>))|(\b(?:ref|args|color|emissive|emissiveIntensity|roughness|clearcoat)\b)|(\b(?:useRef|Canvas|useFrame|useScroll3D|SpatialMonolith|Math|PI)\b)|(\b\d+(?:\.\d+)?\b)|([{}(),;=.:\$\*\/])/g;

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
        <span key={`kw-${match.index}`} className="text-violet-400 font-semibold">
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
        <span key={`prop-${match.index}`} className="text-purple-300">
          {prop}
        </span>
      );
    } else if (identifier) {
      nodes.push(
        <span key={`id-${match.index}`} className="text-sky-300">
          {identifier}
        </span>
      );
    } else if (num) {
      nodes.push(
        <span key={`num-${match.index}`} className="text-amber-300">
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
      <span key={`text-end`} className="text-zinc-200">
        {line.slice(lastIndex)}
      </span>
    );
  }

  return nodes;
}

export function R3FPreviewSection() {
  const { engine } = useScrollCraft();
  const tier = useScrollCraftTier();
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollRef = useRef<{ progress: number; velocity: number }>({
    progress: 0,
    velocity: 0,
  });

  // IntersectionObserver for canvas visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Subscribe to ScrollCraft metrics
  useEffect(() => {
    if (!engine) return;

    const unsub = engine.subscribe((metrics) => {
      scrollRef.current = {
        progress: metrics.progress,
        velocity: metrics.velocity,
      };
    });

    return unsub;
  }, [engine]);

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
      className="relative w-full bg-[#050505] py-16 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 overflow-hidden"
    >
      {/* Subtle Ambient Radial Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none -z-0"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(56, 189, 248, 0.04) 50%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <Reveal direction="down" distance={15}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono mb-4 sm:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.9)] animate-pulse" />
              <span className="text-violet-300 font-bold uppercase tracking-wider text-[11px]">
                SPATIAL ENGINE
              </span>
              <span className="text-zinc-500 text-[11px]">&bull; @scrollcraft/r3f</span>
            </div>
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.1}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] mb-3 sm:mb-4 break-words">
              <span className="text-white block font-extrabold">Leaking into the</span>
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-sky-300 bg-clip-text text-transparent block font-extrabold mt-1">
                Third Dimension.
              </span>
            </h2>
          </Reveal>

          <Reveal direction="up" distance={15} delay={0.2}>
            <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8">
              Pull-based scroll metrics synchronization for React Three Fiber. Synchronize 3D meshes and orbital camera viewports with zero RAF contention.
            </p>
          </Reveal>

          {/* Action Links */}
          <Reveal direction="up" distance={15} delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs#r3f"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-xs transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] shadow-md active:scale-95 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-black" />
                <span>R3F Documentation</span>
              </Link>
              <Link
                href="/showcase"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] active:scale-95 cursor-pointer"
              >
                <span>Interactive Showcase</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Split Grid: Left (Code) vs Right (Live 3D Canvas) */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12 sm:mb-16">
          {/* Left: Code Viewer */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#09090b] p-5 sm:p-6 shadow-2xl overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <Box className="w-4 h-4 text-violet-400" />
                  <span className="text-base font-mono font-bold text-white">useScroll3D()</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 font-bold uppercase tracking-wider">
                    Core Hook
                  </span>
                </div>
                <Link
                  href="/docs#r3f"
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>API Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                Pulls latest normalized scroll data synchronously on the R3F useFrame render tick. Zero React reconciler overhead.
              </p>

              {/* Code Editor Window */}
              <div className="rounded-xl bg-[#060608] border border-white/[0.06] overflow-hidden shadow-inner">
                {/* Titlebar */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0d0d10] border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
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
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono transition-all duration-[150ms] cursor-pointer ${
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
                  </div>
                </div>

                {/* Code Table */}
                <div className="p-4 overflow-x-auto select-text font-mono text-[12px] leading-relaxed max-h-[360px]">
                  <table className="w-full border-collapse">
                    <tbody>
                      {codeLines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="pr-4 text-right text-zinc-600 select-none w-6 align-top text-xs shrink-0">
                            {idx + 1}
                          </td>
                          <td className="whitespace-pre text-zinc-200 font-mono-code">
                            {renderR3FSyntaxLine(line, idx)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Three.js Native</span>
              <span>Unified RAF Phase 3</span>
            </div>
          </div>

          {/* Right: Live Interactive 3D Canvas Preview */}
          <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#070709] relative overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-4 sm:p-6">
            {/* Top Bar Overlay */}
            <div className="absolute top-4 sm:top-5 left-4 sm:left-5 right-4 sm:right-5 z-10 flex items-center justify-between pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-md pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.9)] animate-pulse" />
                <span className="text-xs font-semibold text-white">Spatial Viewport</span>
              </div>

              <div className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-zinc-400 pointer-events-auto select-none">
                Scroll page to drive 3D
              </div>
            </div>

            {/* 3D WebGL Canvas Viewport */}
            <div className="relative w-full h-[290px] sm:h-[390px] rounded-xl overflow-hidden flex items-center justify-center">
              {tier === 'low' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#070709] p-6 text-center">
                  <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-sky-600/20 border border-violet-500/40 rotate-12 transform-gpu" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-[0_0_25px_rgba(124,58,237,0.5)] flex items-center justify-center">
                      <Box className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-300 font-semibold mb-1">
                    WebGL Optimized
                  </span>
                  <span className="text-[11px] text-zinc-500 max-w-xs leading-normal">
                    WebGL context suspended to preserve 60 FPS on low-power devices.
                  </span>
                </div>
              ) : (
                <R3FCanvasStage
                  scrollRef={scrollRef}
                  autoRotate={autoRotate}
                  isVisible={isVisible}
                />
              )}

              {/* Bottom-right auto-rotate toggle inside canvas */}
              <div className="absolute bottom-4 right-4 z-10 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md text-xs text-white hover:border-zinc-500 transition-all duration-[250ms] [transition-timing-function:var(--ease-smooth-out)] cursor-pointer shadow-lg"
                >
                  <div
                    className={`w-7 h-3.5 rounded-full p-0.5 transition-colors duration-[250ms] flex items-center ${
                      autoRotate ? 'bg-violet-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full bg-white transition-transform duration-[250ms] ${
                        autoRotate ? 'translate-x-3.5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] font-medium font-sans">Continuous Drift</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3 Spec Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-5xl mx-auto border-t border-white/[0.06]">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Unified RAF Ticker</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Executes directly in Phase 3 without dual-looping.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Tier-Aware GPU</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Automatic power-saving dormancy on mobile.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Subpixel Precision</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Direct quaternion &amp; Euler angle interpolation.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
