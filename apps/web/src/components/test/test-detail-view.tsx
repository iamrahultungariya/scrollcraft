'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sliders, Code2, BookOpen, AlertTriangle } from 'lucide-react';
import { TEST_REGISTRY, TestItem } from './test-registry';
import { TestHeaderHUD } from './test-header-hud';
import { TestStageDispatcher } from './test-stage-dispatcher';
import { CodeViewer } from '@/components/ui/code-viewer';

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

  const categoryBadge =
    item.category === 'primitives'
      ? 'bg-violet-500/10 text-violet-400 border-violet-500/30'
      : item.category === 'components'
      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

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
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-white pb-32">
      {/* Sticky Hardware Diagnostics HUD */}
      <TestHeaderHUD title={item.title} badge={item.driver.split('(')[0].trim()} />

      {/* Breadcrumb & Navigation Subnav */}
      <div className="w-full border-b border-zinc-800/80 bg-zinc-950/40 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/test"
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to </span><span>Test Lab</span>
            </Link>
            <span className="text-zinc-700">/</span>
            <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${categoryBadge}`}>
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {prevItem && (
              <Link
                href={`/test/${prevItem.slug}`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-[11px]"
              >
                <ArrowLeft className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[80px] sm:max-w-[150px]">{prevItem.title}</span>
              </Link>
            )}
            {nextItem && (
              <Link
                href={`/test/${nextItem.slug}`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-[11px]"
              >
                <span className="truncate max-w-[80px] sm:max-w-[150px]">{nextItem.title}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header & Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                Driver: <span className="text-white font-semibold">{item.driver}</span>
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                Runway: {item.runwayHeight}
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/30 text-violet-300">
                Zero Re-renders Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-mono break-all sm:break-normal">
              {item.title}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              {item.fullDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Knobs Bar */}
        {item.knobs && item.knobs.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-violet-400">
              <Sliders className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider">Live Control Knobs:</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {item.knobs.map((knob) => {
                const currentVal = knobValues[knob.id] ?? knob.default;

                if (knob.type === 'number') {
                  return (
                    <div key={knob.id} className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-zinc-400">{knob.label}:</span>
                      <input
                        type="range"
                        min={knob.min}
                        max={knob.max}
                        step={knob.step}
                        value={currentVal}
                        onChange={(e) => handleKnobChange(knob.id, parseFloat(e.target.value))}
                        className="w-24 accent-violet-500 cursor-pointer"
                      />
                      <span className="text-white font-bold min-w-[36px]">{currentVal}</span>
                    </div>
                  );
                }

                if (knob.type === 'boolean') {
                  return (
                    <label key={knob.id} className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentVal}
                        onChange={(e) => handleKnobChange(knob.id, e.target.checked)}
                        className="accent-violet-500 w-4 h-4 rounded cursor-pointer"
                      />
                      <span>{knob.label}</span>
                    </label>
                  );
                }

                if (knob.type === 'select') {
                  return (
                    <div key={knob.id} className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-zinc-400">{knob.label}:</span>
                      <select
                        value={currentVal}
                        onChange={(e) => handleKnobChange(knob.id, e.target.value)}
                        className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white cursor-pointer"
                      >
                        {knob.options?.map((opt) => (
                          <option key={opt} value={opt}>
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
      <div className="w-full relative border-y border-zinc-800/80 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <TestStageDispatcher slug={item.slug} knobs={knobValues} />
        </div>
      </div>

      {/* Production-Ready Ditto Code Block */}
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 w-full space-y-12"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-sm text-violet-400 font-bold">
            <Code2 className="w-5 h-5" />
            <span className="uppercase tracking-wider">Ditto Production Implementation</span>
          </div>
          <p className="text-xs text-zinc-400">
            Copy and paste this verified implementation directly into your application.
          </p>
          <CodeViewer tabs={codeTabs} className="rounded-2xl border border-zinc-800 shadow-2xl" />
        </div>

        {/* API Props & Options Specification Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-sm text-sky-400 font-bold">
              <BookOpen className="w-5 h-5" />
              <span className="uppercase tracking-wider">Props & Configuration Reference</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 sm:hidden">Swipe table &rarr;</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/60">
            <table className="w-full text-left font-mono text-xs border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                  <th className="p-4">Prop / Option</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Default</th>
                  <th className="p-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {item.props.map((p, pIdx) => (
                  <tr key={pIdx} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 font-bold text-violet-300">{p.name}</td>
                    <td className="p-4 text-emerald-400">{p.type}</td>
                    <td className="p-4 text-zinc-500">{p.default}</td>
                    <td className="p-4 text-zinc-400 font-sans">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Architecture Gotchas & Pitfalls */}
        <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold">
            <AlertTriangle className="w-5 h-5" />
            <span className="uppercase tracking-wider">Architecture Rules & Gotchas</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {item.gotchas.map((gotcha, gIdx) => (
              <li key={gIdx} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span className="leading-relaxed">{gotcha}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
