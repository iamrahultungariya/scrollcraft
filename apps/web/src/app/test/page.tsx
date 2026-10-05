'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';
import { TEST_REGISTRY, TestCategory } from '@/components/test/test-registry';
import { TestHeaderHUD } from '@/components/test/test-header-hud';
import { TestItemCard } from '@/components/test/test-item-card';

export default function TestLabHubPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | TestCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return TEST_REGISTRY.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.driver.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const primitives = useMemo(() => filteredItems.filter((i) => i.category === 'primitives'), [filteredItems]);
  const components = useMemo(() => filteredItems.filter((i) => i.category === 'components'), [filteredItems]);
  const hooks = useMemo(() => filteredItems.filter((i) => i.category === 'hooks'), [filteredItems]);

  return (
    <div className="w-full min-h-screen bg-bg text-fg flex flex-col font-body selection:bg-accent selection:text-black">
      {/* Top Global Navigation */}
      <SiteNav variant="sticky" maxWidth="max-w-[1536px]" />

      {/* Sticky Telemetry HUD */}
      <TestHeaderHUD title="ScrollCraft Test Lab" badge="25 Verified Units" />

      {/* Main Content */}
      <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full space-y-10 flex-1">
        {/* 1. Hero Header */}
        <section className="space-y-6 pb-6 border-b border-line-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-accent inline-block" />
              <span>[TEST LAB] 25 PRODUCTION HARDENED UNITS</span>
            </div>

            <div className="text-muted text-[11px] font-mono uppercase">
              BENCHMARK: <span className="text-accent font-bold">ZERO VDOM RE-RENDERS</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg font-display leading-[0.95]">
              Interactive Test Lab
            </h1>
            <p className="text-sm sm:text-base text-muted font-body leading-relaxed max-w-3xl">
              Verified benchmark catalog for all 25 official primitives, high-performance components, and headless hooks. Each unit includes dedicated live telemetry, unconstrained scroll runways, zero-rerender proof, and production code.
            </p>
          </div>

          {/* Specs Strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 font-mono text-xs text-muted border-t border-b border-line-soft">
            <div>
              <span className="text-muted uppercase">UNITS: </span>
              <span className="text-accent font-bold">25 HARDENED</span>
            </div>
            <span className="text-line-soft select-none hidden sm:inline">•</span>
            <div>
              <span className="text-muted uppercase">RENDER OVERHEAD: </span>
              <span className="text-fg font-bold">0 VDOM PASSES</span>
            </div>
            <span className="text-line-soft select-none hidden sm:inline">•</span>
            <div>
              <span className="text-muted uppercase">PIPELINE: </span>
              <span className="text-fg font-bold">GPU COMPOSITOR DRIVEN</span>
            </div>
            <span className="text-line-soft select-none hidden sm:inline">•</span>
            <div>
              <span className="text-muted uppercase">ARCHITECTURE: </span>
              <span className="text-accent font-bold">3-PHASE MICROTASK</span>
            </div>
          </div>

          {/* Featured Robustness Lab Callout */}
          <div>
            <Link
              href="/test/robust"
              className="block border border-line-soft hover:border-accent bg-bg/50 hover:bg-bg p-4 sm:p-5 transition-colors group cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 font-body">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-accent uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>ADVERSARIAL HARDENING BENCHMARK</span>
                  </div>
                  <h3 className="font-mono font-bold text-base sm:text-lg uppercase text-fg group-hover:text-accent transition-colors">
                    Engine Robustness &amp; Adversarial Stress Laboratory
                  </h3>
                  <p className="text-xs text-muted max-w-2xl font-body">
                    In-browser test suite verifying mathematical fuzzing (500+ vectors), 50ms chaos lifecycle resilience, memory soak, and FrustumShield culling.
                  </p>
                </div>

                <div className="text-xs font-mono font-bold uppercase text-muted group-hover:text-accent transition-colors inline-flex items-center gap-1.5 shrink-0">
                  <span>ENTER STRESS LAB</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 2. Controls Bar: Category Filter & Search */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono pb-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {[
              { id: 'all', label: `ALL (${TEST_REGISTRY.length})` },
              { id: 'primitives', label: 'PRIMITIVES (6)' },
              { id: 'components', label: 'COMPONENTS (7)' },
              { id: 'hooks', label: 'HOOKS (12)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`h-8 px-3 text-xs font-mono font-bold uppercase whitespace-nowrap transition-colors cursor-pointer border ${
                  activeCategory === tab.id
                    ? 'bg-accent text-black border-accent'
                    : 'bg-transparent text-muted hover:text-fg border-line-soft hover:border-line'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="FILTER TESTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 border border-line-soft bg-bg text-fg placeholder:text-muted/60 font-mono uppercase text-xs focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </section>

        {/* 3. Section 1: Primitives (6 Cards) */}
        {(activeCategory === 'all' || activeCategory === 'primitives') && primitives.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-line-soft pb-3 font-mono">
              <div className="flex items-center gap-2.5">
                <span className="text-accent font-bold uppercase text-xs tracking-wider">
                  [01]
                </span>
                <h2 className="text-lg sm:text-xl font-bold uppercase text-fg font-mono">
                  Declarative Scroll Primitives
                </h2>
              </div>
              <span className="text-xs text-muted font-mono">{primitives.length} UNITS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {primitives.map((item, idx) => (
                <TestItemCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Section 2: High-Performance Components (7 Cards) */}
        {(activeCategory === 'all' || activeCategory === 'components') && components.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-line-soft pb-3 font-mono">
              <div className="flex items-center gap-2.5">
                <span className="text-accent font-bold uppercase text-xs tracking-wider">
                  [02]
                </span>
                <h2 className="text-lg sm:text-xl font-bold uppercase text-fg font-mono">
                  High-Performance Components
                </h2>
              </div>
              <span className="text-xs text-muted font-mono">{components.length} UNITS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {components.map((item, idx) => (
                <TestItemCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Section 3: Advanced Hooks (12 Cards) */}
        {(activeCategory === 'all' || activeCategory === 'hooks') && hooks.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-line-soft pb-3 font-mono">
              <div className="flex items-center gap-2.5">
                <span className="text-accent font-bold uppercase text-xs tracking-wider">
                  [03]
                </span>
                <h2 className="text-lg sm:text-xl font-bold uppercase text-fg font-mono">
                  Headless Reactive Hooks &amp; Solvers
                </h2>
              </div>
              <span className="text-xs text-muted font-mono">{hooks.length} UNITS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {hooks.map((item, idx) => (
                <TestItemCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-16 text-center space-y-4 font-mono">
            <p className="text-muted text-xs uppercase font-bold">
              NO STANDARD UNIT TESTS FOUND MATCHING &ldquo;{searchQuery}&rdquo;.
            </p>
            <div className="inline-block p-5 border border-line-soft bg-bg/50 text-left max-w-lg">
              <span className="text-xs text-accent uppercase font-bold block mb-2">
                LOOKING FOR STRESS OR RESILIENCE BENCHMARKS?
              </span>
              <Link
                href="/test/robust"
                className="h-8 px-3 border border-accent bg-accent text-black font-mono font-bold text-xs uppercase hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EXPLORE ENGINE ROBUSTNESS LAB &rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Global Brutalist Footer */}
      <footer className="w-full border-t border-line-soft py-8 sm:py-10 bg-bg text-xs font-mono text-muted">
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
}
