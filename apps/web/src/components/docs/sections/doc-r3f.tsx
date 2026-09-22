'use client';

/**
 * ScrollCraft Docs: React Three Fiber Bridge (Reference-Only)
 * Follows strict 15-second scanning template:
 * - Minimal 5–10 line code block
 * - What it does: one line
 * - Capabilities: bullet list of parameters/returns
 * - Status: Alpha
 * Strictly zero prose paragraphs. Zero tutorials.
 */

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Box, Zap } from 'lucide-react';

interface DocR3FProps {
  sectionId: string;
}

const R3F_CODE = `import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll3D } from '@scrollcraft/r3f';
import type { Mesh } from 'three';

export function KineticMesh({ target }: { target: HTMLElement | null }) {
  const meshRef = useRef<Mesh>(null);
  const { tick } = useScroll3D(target, { axis: 'block' });

  useFrame(() => {
    const { progress } = tick();
    if (meshRef.current) {
      meshRef.current.rotation.y = progress * Math.PI * 2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial wireframe color="#8b5cf6" />
    </mesh>
  );
}`;

const CAPABILITIES = [
  { param: 'target', type: 'Element | null', desc: 'DOM element whose scroll intersection or viewport timeline triggers 3D updates.' },
  { param: 'options.axis', type: "'block' | 'inline'", desc: 'Scroll orientation axis: block (vertical) or inline (horizontal).' },
  { param: 'tick()', type: '() => Scroll3DMetrics', desc: 'Pull-based function invoked synchronously inside R3F useFrame loop.' },
  { param: 'metrics.progress', type: 'number', desc: 'Normalized scroll position from 0.0 to 1.0.' },
  { param: 'metrics.velocity', type: 'number', desc: 'Instantaneous frame-to-frame delta velocity.' },
  { param: 'metrics.direction', type: '1 | -1 | 0', desc: 'Scroll direction vector (1: down, -1: up, 0: stationary).' },
];

export const DocR3F: React.FC<DocR3FProps> = () => {
  return (
    <div className="space-y-10 not-prose">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono break-all sm:break-normal">
              useScroll3D()
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
              Alpha
            </span>
          </div>
          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
            <strong className="text-white">What it does:</strong> Pull-based Three.js scroll metrics bridge for R3F Canvas without double-pumping RequestAnimationFrame.
          </p>
        </div>
      </div>

      {/* Minimal 5-10 Line Syntax Highlighted Code Snippet */}
      <div id="syntax" className="space-y-3 scroll-mt-24">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
          Syntax &bull; 5–10 Line Reference
        </span>
        <CodeViewer code={R3F_CODE} fileName="use-scroll-3d.tsx" />
      </div>

      {/* Capabilities & Options */}
      <div id="capabilities" className="space-y-4 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span>Capabilities &amp; Parameters</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 sm:hidden">Swipe table &rarr;</span>
        </div>

        <div className="rounded-xl border border-zinc-800 overflow-x-auto bg-[#0a0a0c]">
          <table className="w-full text-left text-xs font-mono min-w-[500px]">
            <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Parameter / Method</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans text-zinc-300">
              {CAPABILITIES.map((c) => (
                <tr key={c.param} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-red-400 font-semibold">{c.param}</td>
                  <td className="px-4 py-3 font-mono text-purple-300 text-[11px]">{c.type}</td>
                  <td className="px-4 py-3 text-zinc-300 text-xs">{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alpha Notice */}
      <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs font-mono text-zinc-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-red-400 shrink-0" />
          <span>Status: <strong className="text-red-400 uppercase">Alpha</strong> &bull; API surface in active preview</span>
        </div>
        <span className="text-[11px] text-zinc-400 font-sans hidden sm:inline">
          Requires @react-three/fiber and three peer dependencies
        </span>
      </div>
    </div>
  );
};
