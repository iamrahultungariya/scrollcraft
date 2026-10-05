'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sliders, Code2, BookOpen, AlertTriangle } from 'lucide-react';
import { TEST_REGISTRY, TestItem } from './test-registry';
import { TestHeaderHUD } from './test-header-hud';
import { TestStageDispatcher } from './test-stage-dispatcher';
import { CodeViewer } from '@/components/ui/code-viewer';
import { SiteNav } from '@/components/layout/site-nav';

interface TestDetailViewProps {
  item: TestItem;
}

export const TestDetailView: React.FC<TestDetailViewProps> = ({ item }) => {
  // Navigation indices
  const currentIndex = TEST_REGISTRY.findIndex((i) => i.slug === item.slug);
  const prevItem = currentIndex > 0 ? TEST_REGISTRY[currentIndex - 1] : null;
  const nextItem = currentIndex < TEST_REGISTRY.length - 1 ? TEST_REGISTRY[currentIndex + 1] : null;

  // Initialize interactive knobs state
  const initialKnobs = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (item.knobs) {
      for (const knob of item.knobs) {
        defaults[knob.id] = knob.default;
      }
    }
    return defaults;
  }, [item.knobs]);

  const [knobValues, setKnobValues] = useState<Record<string, any>>(initialKnobs);

  const handleKnobChange = (id: string, value: any) => {
    setKnobValues((prev) => ({ ...prev, [id]: value }));
  };

  const codeTabs = [
    {
      label: 'Production Code',
      fileName: `${item.slug}.tsx`,
      code: item.code,
    },
    {
      label: 'Minimal Usage',
      fileName: 'UsageExample.tsx',
      code: item.usageCode,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-bg text-fg flex flex-col font-body selection:bg-accent selection:text-black">
      {/* Top Global Navigation */}
      <SiteNav variant="sticky" maxWidth="max-w-[1536px]" />

      {/* Sticky Hardware Diagnostics HUD */}
      <TestHeaderHUD title={item.title} badge={item.driver.split('(')[0].trim()} />

      {/* Breadcrumb & Navigation Subnav */}
      <div className="w-full border-b border-line-soft bg-bg px-4 sm:px-6 lg:px-8 py-2.5 font-mono text-xs">
        <div className="max-w-[1536px] mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/test"
              className="h-7 px-2 border border-line-soft hover:border-line bg-bg hover:bg-accent text-muted hover:text-black font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>TEST LAB</span>
            </Link>
            <span className="text-muted/60">/</span>
            <span className="text-accent uppercase font-bold text-[11px] tracking-wider">
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {prevItem && (
              <Link
                href={`/test/${prevItem.slug}`}
                className="h-7 px-2 border border-line-soft hover:border-line bg-bg hover:bg-accent text-muted hover:text-black transition-colors flex items-center gap-1 text-[11px] font-bold uppercase"
              >
                <ArrowLeft className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[80px] sm:max-w-[140px]">{prevItem.title}</span>
              </Link>
            )}
            {nextItem && (
              <Link
                href={`/test/${nextItem.slug}`}
                className="h-7 px-2 border border-line-soft hover:border-line bg-bg hover:bg-accent text-muted hover:text-black transition-colors flex items-center gap-1 text-[11px] font-bold uppercase"
              >
                <span className="truncate max-w-[80px] sm:max-w-[140px]">{nextItem.title}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header & Overview */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line-soft">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="border border-line-soft bg-bg px-2 py-0.5 text-muted uppercase text-[11px]">
                DRIVER: <strong className="text-accent">{item.driver}</strong>
              </span>
              <span className="border border-line-soft bg-bg px-2 py-0.5 text-muted uppercase text-[11px]">
                RUNWAY: {item.runwayHeight}
              </span>
              <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 text-accent font-bold uppercase text-[11px]">
                ZERO RE-RENDERS
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-fg font-display">
              {item.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted font-body leading-relaxed max-w-3xl">
              {item.fullDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-[11px] font-mono px-2 py-0.5 border border-line-soft bg-bg text-muted uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Knobs Bar */}
        {item.knobs && item.knobs.length > 0 && (
          <div className="border border-line-soft bg-bg/50 p-4 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-accent" />
              <span>LIVE CONTROLS:</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {item.knobs.map((knob) => {
                const currentVal = knobValues[knob.id] ?? knob.default;

                if (knob.type === 'number') {
                  return (
                    <div key={knob.id} className="flex items-center gap-2.5 text-xs font-mono">
                      <span className="text-muted uppercase font-bold">{knob.label}:</span>
                      <input
                        type="range"
                        min={knob.min}
                        max={knob.max}
                        step={knob.step}
                        value={currentVal}
                        onChange={(e) => handleKnobChange(knob.id, parseFloat(e.target.value))}
                        className="w-24 accent-accent cursor-pointer"
                      />
                      <span className="text-fg font-bold min-w-[32px]">{currentVal}</span>
                    </div>
                  );
                }

                if (knob.type === 'boolean') {
                  return (
                    <label key={knob.id} className="flex items-center gap-2 text-xs font-mono text-fg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentVal}
                        onChange={(e) => handleKnobChange(knob.id, e.target.checked)}
                        className="accent-accent w-4 h-4 cursor-pointer"
                      />
                      <span className="uppercase font-bold">{knob.label}</span>
                    </label>
                  );
                }

                if (knob.type === 'select') {
                  return (
                    <div key={knob.id} className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-muted uppercase font-bold">{knob.label}:</span>
                      <select
                        value={currentVal}
                        onChange={(e) => handleKnobChange(knob.id, e.target.value)}
                        className="px-2 py-0.5 border border-line-soft bg-bg text-fg font-mono uppercase font-bold text-xs cursor-pointer focus:outline-none focus:border-accent"
                      >
                        {knob.options?.map((opt) => (
                          <option key={opt} value={opt} className="bg-bg text-fg">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Unconstrained Live Demonstration Stage */}
      <div className="w-full relative border-y border-line-soft bg-bg">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <TestStageDispatcher slug={item.slug} knobs={knobValues} />
        </div>
      </div>

      {/* Production-Ready Ditto Code Block & Reference */}
      <div 
        className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-accent font-bold uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>[01] PRODUCTION IMPLEMENTATION</span>
          </div>
          <p className="text-xs text-muted font-body">
            Copy and paste this verified implementation directly into your application.
          </p>
          <CodeViewer tabs={codeTabs} />
        </div>

        {/* API Props & Options Specification Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-fg font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>[02] PROPS &amp; CONFIGURATION REFERENCE</span>
            </div>
            <span className="text-[10px] font-mono text-muted sm:hidden">SWIPE TABLE &rarr;</span>
          </div>

          <div className="border border-line-soft bg-bg overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-line-soft bg-bg/60 text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="p-3 text-fg font-bold">PROP / OPTION</th>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">DEFAULT</th>
                  <th className="p-3">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft text-fg font-mono">
                {item.props.map((p, pIdx) => (
                  <tr key={pIdx} className="hover:bg-fg hover:text-black transition-colors group">
                    <td className="p-3 font-bold text-accent group-hover:text-black">{p.name}</td>
                    <td className="p-3 text-fg font-mono">{p.type}</td>
                    <td className="p-3 text-muted">{p.default}</td>
                    <td className="p-3 text-fg group-hover:text-black font-body">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Architecture Gotchas & Pitfalls */}
        <div className="border border-line-soft bg-bg/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-accent" />
            <span>[03] ARCHITECTURE RULES &amp; GOTCHAS</span>
          </div>
          <ul className="space-y-2 text-xs text-muted font-body">
            {item.gotchas.map((gotcha, gIdx) => (
              <li key={gIdx} className="flex items-start gap-2">
                <span className="text-accent font-mono font-bold select-none">&bull;</span>
                <span className="leading-relaxed text-fg/90">{gotcha}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Global Brutalist Footer */}
      <footer className="w-full border-t border-line-soft py-8 sm:py-10 bg-bg text-xs font-mono text-muted mt-auto">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-fg font-bold uppercase">
            <span>SCROLL CRAFT</span>
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            <span className="text-muted font-normal text-[11px]">&copy; {new Date().getFullYear()} MIT LICENSED</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs uppercase font-bold">
            <Link href="/" className="hover:text-accent transition-colors">HOME</Link>
            <Link href="/docs" className="hover:text-accent transition-colors">DOCS</Link>
            <Link href="/showcase" className="hover:text-accent transition-colors">SHOWCASE</Link>
            <Link href="/test" className="text-accent underline underline-offset-4">TEST LAB</Link>
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GITHUB ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
