'use client';

import React from 'react';
import { DocsCallout } from '../docs-callout';
import { Shield, Sparkles } from 'lucide-react';

interface DocArchitectureProps {
  sectionId: string;
}

const ARCHITECTURE_PARADIGMS = [
  {
    feature: 'Execution Pipeline',
    scrollcraft: 'Compositor Thread Native + 3-Phase Microtask Fallback',
    virtual: 'Window wheel hijacking & synthetic transform styles',
    stateDriven: 'React requestAnimationFrame state diffing',
    pureCss: 'Pure CSS animation-timeline: view()',
  },
  {
    feature: 'DOM Hierarchy Impact',
    scrollcraft: 'Headless asChild (Zero dummy wrapper divs injected)',
    virtual: 'Injected wrapper divs & synthetic spacers',
    stateDriven: 'Requires wrapper motion.div nodes',
    pureCss: 'Native styles on existing element',
  },
  {
    feature: 'React Re-render Cost',
    scrollcraft: '0 Re-renders (Direct ref GPU mutations)',
    virtual: '0 to 60 re-renders per second',
    stateDriven: '60 to 120 re-renders per second (CPU heavy)',
    pureCss: '0 Re-renders (Executed outside JS)',
  },
  {
    feature: 'Cross-Browser Consistency',
    scrollcraft: 'Universal (Native on Chrome/Edge, JS on Safari/Firefox)',
    virtual: 'Inconsistent touch & trackpad momentum',
    stateDriven: 'Consistent but high CPU/battery draw',
    pureCss: 'Incomplete (No native Safari/Firefox support)',
  },
  {
    feature: 'App Router & Hydration Safety',
    scrollcraft: 'Hydration-safe Slot composition & boundary observers',
    virtual: 'Severe hydration mismatch & scroll lock bugs',
    stateDriven: 'High client-bundle penalty on server components',
    pureCss: 'Hydration-safe CSS attributes',
  },
  {
    feature: 'A11y & Reduced Motion',
    scrollcraft: 'Dual-Layer (Automated OS detection + manual opt-out)',
    virtual: 'Often ignores OS prefers-reduced-motion',
    stateDriven: 'Requires custom hook guards',
    pureCss: 'Requires manual media queries',
  },
  {
    feature: 'Core Bundle Footprint',
    scrollcraft: '< 5 KB (brotli, tree-shaken)',
    virtual: '18 - 35 KB',
    stateDriven: '28 - 45 KB',
    pureCss: '0 KB JS runtime',
  },
];

export const DocArchitecture: React.FC<DocArchitectureProps> = ({
  sectionId,
}) => {
  if (sectionId === 'three-phase-ticker') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono font-semibold text-violet-400 uppercase tracking-widest w-fit">
            ENGINE ARCHITECTURE
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] break-words">
            3-Phase Ticker Pipeline
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl font-normal">
            How ScrollCraft completely eliminates layout thrashing, avoids forced synchronous reflows, and locks in 120 FPS frame consistency across refresh cycles.
          </p>
        </header>

        <section id="ticker-execution" className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white break-words">
            The Zero-Allocation Microtask Loop
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            In standard JavaScript animation libraries, reading layout properties (like <code className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">getBoundingClientRect()</code>) in the middle of writing styles (<code className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">el.style.transform = ...</code>) forces the browser to halt execution and recalculate page layout synchronously.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            ScrollCraft operates a persistent 3-phase Ticker executed via <code className="font-mono text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">requestAnimationFrame</code>:
          </p>
          <div className="space-y-2.5 text-xs text-zinc-300">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-[#09090b] shadow-lg">
              <strong className="text-white">Phase 1: Measure</strong> — Reads window scroll, cached client rectangles, and screen dimensions. Absolutely zero DOM style writes permitted.
            </div>
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-[#09090b] shadow-lg">
              <strong className="text-white">Phase 2: Update</strong> — Subpixel lerp math, spring physics, and kinetic damping computed purely in V8 memory without accessing any DOM properties.
            </div>
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-[#09090b] shadow-lg">
              <strong className="text-white">Phase 3: Render</strong> — Batched GPU flush. Applies <code className="font-mono text-[11px] text-violet-400">translate3d</code> and <code className="font-mono text-[11px] text-violet-400">opacity</code> styles directly to registered element refs.
            </div>
          </div>
        </section>

        <DocsCallout type="tip" title="Result: Zero Dropped Frames">
          By isolating reads and writes into strict micro-phases, browser engines never experience forced reflows, maintaining smooth 120Hz display refresh rates on ProMotion and OLED displays.
        </DocsCallout>
      </div>
    );
  }

  if (sectionId === 'reduced-motion') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-widest w-fit">
            ACCESSIBILITY (A11Y)
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] break-words">
            Dual-Layer Reduced Motion
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl font-normal">
            Built-in OS-level vestibular disorder protection. ScrollCraft automatically honors user accessibility preferences out of the box.
          </p>
        </header>

        <section id="a11y-detection" className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white break-words">
            How Dual-Layer Protection Operates
          </h2>
          <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
            <p>
              When a user has enabled &ldquo;Reduce Motion&rdquo; in macOS, Windows, iOS, or Android settings, ScrollCraft responds at two distinct layers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#09090b] shadow-xl">
                <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Layer 1: Base Scroll</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Inertia smoothing is disabled. The page tracks 1:1 with native hardware scroll without lag or momentum damping.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-zinc-800/80 bg-[#09090b] shadow-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Layer 2: Element Transforms</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <code className="font-mono text-[10px] text-white">&lt;Parallax&gt;</code> zeroes out displacement (<code className="font-mono text-[10px] text-zinc-400">translate3d(0, 0, 0)</code>), while <code className="font-mono text-[10px] text-white">&lt;Reveal&gt;</code> immediately reveals content with <code className="font-mono text-[10px] text-zinc-400">opacity: 1</code>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <DocsCallout type="note" title="WCAG 2.1 Compliance">
          Meeting WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions) requires animation to be disabled unless essential. ScrollCraft guarantees full compliance by default without requiring manual media query boilerplate.
        </DocsCallout>
      </div>
    );
  }

  // benchmark
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono font-semibold text-violet-400 uppercase tracking-widest w-fit">
          ARCHITECTURE &amp; PERF
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] break-words">
          Engine Comparison
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl font-normal">
          Direct architectural comparison between ScrollCraft and other web scroll toolkits.
        </p>
      </header>

      <section id="fps-comparison" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white break-words">
            Architectural Paradigms Compared
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 sm:hidden">Swipe table &rarr;</span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          How different scroll engineering paradigms handle thread execution, DOM manipulation, and React rendering:
        </p>

        <div className="w-full rounded-xl border border-zinc-800/80 bg-[#09090b] shadow-2xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-200 border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/50 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="py-3.5 px-4 w-[20%]">Dimension</th>
                  <th className="py-3.5 px-4 w-[30%] text-violet-400 font-bold bg-violet-500/10">
                    ScrollCraft (Hybrid)
                  </th>
                  <th className="py-3.5 px-4 w-[25%]">Virtual / Hijacked</th>
                  <th className="py-3.5 px-4 w-[25%]">Component State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {ARCHITECTURE_PARADIGMS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white align-top">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white bg-violet-500/5 align-top break-words">
                      <span className="text-violet-400 font-bold mr-1.5">✦</span>
                      {row.scrollcraft}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 align-top break-words">
                      {row.virtual}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 align-top break-words">
                      {row.stateDriven}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <DocsCallout type="tip" title="Headless Architecture by Principle">
        ScrollCraft is built to be a permanent, unopinionated foundational primitive in your frontend stack. Because it adheres strictly to standard DOM transforms and Radix-style Slot composition, it never locks your codebase into proprietary runtime architectures.
      </DocsCallout>
    </div>
  );
};
