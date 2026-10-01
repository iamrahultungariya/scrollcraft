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
      <div className="flex flex-col gap-10 font-body not-prose">
        <header className="flex flex-col gap-3 border-b-2 border-line pb-6">
          <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
            <span className="w-2 h-2 bg-accent inline-block" />
            <span>[ENGINE / PIPELINE]</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
            3-Phase Ticker Pipeline
          </h1>
          <p className="text-base text-fg/90 font-body leading-relaxed max-w-3xl">
            How ScrollCraft completely eliminates layout thrashing, avoids forced synchronous reflows, and locks in buttery smooth frame consistency across high-refresh displays.
          </p>
        </header>

        <section id="ticker-execution" className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
            The Zero-Allocation Microtask Loop
          </h2>
          <p className="text-sm text-fg/80 font-body leading-relaxed">
            In standard JavaScript animation libraries, reading layout properties (like <code className="font-mono text-xs text-accent bg-bg border border-line-soft px-1.5 py-0.5">getBoundingClientRect()</code>) in the middle of writing styles (<code className="font-mono text-xs text-accent bg-bg border border-line-soft px-1.5 py-0.5">el.style.transform = ...</code>) forces the browser to halt execution and recalculate page layout synchronously.
          </p>
          <p className="text-sm text-fg/80 font-body leading-relaxed">
            ScrollCraft operates a persistent 3-phase Ticker executed via <code className="font-mono text-xs text-accent bg-bg border border-line-soft px-1.5 py-0.5">requestAnimationFrame</code>:
          </p>

          <div className="space-y-3 text-xs font-mono">
            <div className="border-2 border-line bg-bg shadow-rest">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-1.5 font-mono text-[11px] font-bold text-accent uppercase tracking-wider">
                [01] PHASE 1: MEASURE
              </div>
              <div className="p-4 text-fg/90 font-body text-xs leading-relaxed">
                Reads window scroll, cached client rectangles, and screen dimensions. Absolutely zero DOM style writes permitted.
              </div>
            </div>

            <div className="border-2 border-line bg-bg shadow-rest">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-1.5 font-mono text-[11px] font-bold text-fg uppercase tracking-wider">
                [02] PHASE 2: UPDATE
              </div>
              <div className="p-4 text-fg/90 font-body text-xs leading-relaxed">
                Subpixel lerp math, spring physics, and kinetic damping computed purely in V8 memory without accessing any DOM properties.
              </div>
            </div>

            <div className="border-2 border-line bg-bg shadow-rest">
              <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-1.5 font-mono text-[11px] font-bold text-fg uppercase tracking-wider">
                [03] PHASE 3: RENDER
              </div>
              <div className="p-4 text-fg/90 font-body text-xs leading-relaxed">
                Batched GPU flush. Applies <code className="font-mono text-[11px] text-accent font-bold">translate3d</code> and <code className="font-mono text-[11px] text-accent font-bold">opacity</code> styles directly to registered element refs.
              </div>
            </div>
          </div>
        </section>

        <DocsCallout type="tip" title="Result: Zero Dropped Frames">
          By isolating reads and writes into strict micro-phases, browser engines never experience forced reflows, maintaining smooth rendering performance on high-refresh ProMotion and OLED displays.
        </DocsCallout>
      </div>
    );
  }

  if (sectionId === 'reduced-motion') {
    return (
      <div className="flex flex-col gap-10 font-body not-prose">
        <header className="flex flex-col gap-3 border-b-2 border-line pb-6">
          <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
            <span className="w-2 h-2 bg-accent inline-block" />
            <span>[ACCESSIBILITY / A11Y]</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
            Dual-Layer Reduced Motion
          </h1>
          <p className="text-base text-fg/90 font-body leading-relaxed max-w-3xl">
            Built-in OS-level vestibular disorder protection. ScrollCraft automatically honors user accessibility preferences out of the box.
          </p>
        </header>

        <section id="a11y-detection" className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
            How Dual-Layer Protection Operates
          </h2>
          <div className="space-y-4 text-sm text-fg/80 leading-relaxed font-body">
            <p>
              When a user has enabled &ldquo;Reduce Motion&rdquo; in macOS, Windows, iOS, or Android settings, ScrollCraft responds at two distinct layers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-1.5 font-mono text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  <span>[01] LAYER 1: BASE SCROLL</span>
                </div>
                <div className="p-4 text-xs text-fg/80 font-body leading-relaxed">
                  Inertia smoothing is disabled. The page tracks 1:1 with native hardware scroll without lag or momentum damping.
                </div>
              </div>

              <div className="border-2 border-line bg-bg shadow-rest flex flex-col justify-between">
                <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-1.5 font-mono text-[11px] font-bold text-fg uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>[02] LAYER 2: ELEMENT TRANSFORMS</span>
                </div>
                <div className="p-4 text-xs text-fg/80 font-body leading-relaxed">
                  <code className="font-mono text-[11px] text-accent font-bold">&lt;Parallax&gt;</code> zeroes out displacement (<code className="font-mono text-[11px] text-muted">translate3d(0, 0, 0)</code>), while <code className="font-mono text-[11px] text-accent font-bold">&lt;Reveal&gt;</code> immediately reveals content with <code className="font-mono text-[11px] text-muted">opacity: 1</code>.
                </div>
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

  // benchmark / engine comparison
  return (
    <div className="flex flex-col gap-10 font-body not-prose">
      <header className="flex flex-col gap-3 border-b-2 border-line pb-6">
        <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
          <span className="w-2 h-2 bg-accent inline-block" />
          <span>[ARCHITECTURE / PERF]</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
          Engine Comparison
        </h1>
        <p className="text-base text-fg/90 font-body leading-relaxed max-w-3xl">
          Direct architectural comparison between ScrollCraft and other web scroll toolkits.
        </p>
      </header>

      <section id="fps-comparison" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
            Architectural Paradigms Compared
          </h2>
          <span className="text-[10px] font-mono text-muted sm:hidden">SWIPE TABLE &rarr;</span>
        </div>
        <p className="text-sm text-fg/80 font-body leading-relaxed">
          How different scroll engineering paradigms handle thread execution, DOM manipulation, and React rendering:
        </p>

        <div className="border-2 border-line bg-bg shadow-rest overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b-2 border-line bg-line-soft/30 text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
                <th className="py-3 px-4 w-[20%] text-fg font-bold">DIMENSION</th>
                <th className="py-3 px-4 w-[30%] text-accent font-bold border-x-2 border-line bg-accent/5">
                  SCROLLCRAFT (HYBRID)
                </th>
                <th className="py-3 px-4 w-[25%]">VIRTUAL / HIJACKED</th>
                <th className="py-3 px-4 w-[25%]">COMPONENT STATE</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-line-soft font-mono">
              {ARCHITECTURE_PARADIGMS.map((row, idx) => (
                <tr key={idx} className="hover:bg-fg hover:text-black transition-colors group">
                  <td className="py-3.5 px-4 font-bold text-fg group-hover:text-black font-display align-top">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-fg group-hover:text-black border-x-2 border-line bg-accent/5 group-hover:bg-transparent align-top break-words">
                    <span className="text-accent group-hover:text-black font-bold mr-1.5">✦</span>
                    {row.scrollcraft}
                  </td>
                  <td className="py-3.5 px-4 text-muted group-hover:text-black align-top break-words">
                    {row.virtual}
                  </td>
                  <td className="py-3.5 px-4 text-muted group-hover:text-black align-top break-words">
                    {row.stateDriven}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DocsCallout type="tip" title="Headless Architecture by Principle">
        ScrollCraft is built to be a permanent, unopinionated foundational primitive in your frontend stack. Because it adheres strictly to standard DOM transforms and Radix-style Slot composition, it never locks your codebase into proprietary runtime architectures.
      </DocsCallout>
    </div>
  );
};
