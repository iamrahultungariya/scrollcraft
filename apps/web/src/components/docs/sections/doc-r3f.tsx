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
import Link from 'next/link';
import { CodeViewer } from '@/components/ui/code-viewer';
import { Zap, ExternalLink, Box } from 'lucide-react';

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
      <meshStandardMaterial wireframe color="#DFFF00" />
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
    <div className="space-y-10 not-prose font-body">
      {/* Header */}
      <div className="border-b-2 border-line pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
            <span className="w-2 h-2 bg-accent inline-block" />
            <span>[CANVAS / R3F BRIDGE]</span>
          </div>

          <Link
            href="/test"
            className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>TEST IN LAB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-accent tracking-tight font-mono uppercase">
            useScroll3D()
          </h1>
          <span className="px-2.5 py-1 border-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-bg text-muted border-line-soft">
            Alpha
          </span>
        </div>
        <p className="text-base text-fg/90 font-body leading-relaxed max-w-3xl">
          <strong className="text-fg font-mono font-bold uppercase mr-1">WHAT IT DOES:</strong> Pull-based Three.js scroll metrics bridge for R3F Canvas without double-pumping RequestAnimationFrame.
        </p>
      </div>

      {/* Minimal 5-10 Line Syntax Highlighted Code Snippet */}
      <div id="syntax" className="space-y-3 scroll-mt-24">
        <span className="text-xs font-mono uppercase tracking-wider text-muted block font-bold">
          SYNTAX &bull; 5–10 LINE REFERENCE
        </span>
        <CodeViewer code={R3F_CODE} fileName="use-scroll-3d.tsx" />
      </div>

      {/* Capabilities & Options - NO PURPLE, 2 neutrals + 1 accent */}
      <div id="capabilities" className="space-y-4 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted font-bold">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span>CAPABILITIES &amp; PARAMETERS</span>
          </div>
          <span className="text-[10px] font-mono text-muted sm:hidden">SWIPE TABLE &rarr;</span>
        </div>

        <div className="border-2 border-line bg-bg shadow-rest overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[500px]">
            <thead className="bg-line-soft/30 text-muted uppercase text-[11px] border-b-2 border-line font-bold">
              <tr>
                <th className="px-4 py-3 font-bold text-fg">PARAMETER / METHOD</th>
                <th className="px-4 py-3 font-bold">TYPE</th>
                <th className="px-4 py-3 font-bold">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-line-soft font-mono">
              {CAPABILITIES.map((c) => (
                <tr key={c.param} className="hover:bg-fg hover:text-black transition-colors group">
                  <td className="px-4 py-3 text-accent group-hover:text-black font-bold">{c.param}</td>
                  <td className="px-4 py-3 text-fg font-mono text-xs">{c.type}</td>
                  <td className="px-4 py-3 text-fg group-hover:text-black text-xs font-body">{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alpha Notice */}
      <div className="p-4 border-2 border-line bg-bg text-xs font-mono text-fg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-rest">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-accent shrink-0" />
          <span>STATUS: <strong className="text-accent uppercase font-bold">ALPHA</strong> &bull; API SURFACE IN ACTIVE PREVIEW</span>
        </div>
        <span className="text-xs text-muted font-body">
          Requires @react-three/fiber and three peer dependencies
        </span>
      </div>
    </div>
  );
};
