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
      <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-12 flex-1">
        {/* 1. Hero Header */}
        <section className="space-y-6 pb-8 border-b-2 border-line">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
              <span className="w-2 h-2 bg-accent inline-block" />
              <span>[TEST LAB / 01] 25 PRODUCTION HARDENED UNITS</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-muted">
              <span>ACTIVE TEST BENCH:</span>
              <span className="px-2 py-0.5 border-2 border-line bg-accent text-black font-bold uppercase text-[10px]">
                ZERO RE-RENDER LAB
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
              Test Lab &amp; Interactive Catalog
            </h1>
            <p className="text-base sm:text-lg text-fg/90 font-body leading-relaxed max-w-3xl">
              Explore all 25 official primitives, high-performance components, and advanced hooks. Click on any unit to enter its dedicated deep-dive page with live telemetry, zero-rerender audit proof, unconstrained scroll runways, and exact production code.
            </p>
          </div>

          {/* Telemetry Stat Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">TOTAL UNITS</span>
              <span className="text-xl sm:text-2xl font-black text-accent font-display">25</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">VDOM PASSES</span>
              <span className="text-xl sm:text-2xl font-black text-fg font-display">0 RE-RENDERS</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">GPU PIPELINE</span>
              <span className="text-xl sm:text-2xl font-black text-accent font-display">COMPOSITOR</span>
            </div>
            <div className="border-2 border-line bg-bg p-3 shadow-rest">
              <span className="text-[10px] text-muted block uppercase font-bold">RESILIENCE</span>
              <span className="text-xl sm:text-2xl font-black text-fg font-display">8 LAYERS</span>
            </div>
          </div>

          {/* Featured Robustness Lab Banner */}
          <div className="pt-2">
            <Link
              href="/test/robust"
              className="border-2 border-line bg-bg p-5 sm:p-6 shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="space-y-1.5 font-body">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-accent uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>[STRESS LAB] ADVERSARIAL HARDENING BENCHMARK</span>
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl uppercase text-fg group-hover:text-accent transition-colors">
                  Engine Robustness &amp; Hardening Laboratory (8 Layers)
                </h3>
                <p className="text-xs text-muted max-w-2xl font-body">
                  Live in-browser test suite verifying mathematical adversarial fuzzing (500+ vectors), 50ms chaos lifecycle resilience, 200-solver memory soak, and FrustumShield culling.
                </p>
              </div>

              <div className="h-10 px-4 border-2 border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest inline-flex items-center justify-center gap-2 shrink-0">
                <span>ENTER ROBUSTNESS LAB</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* 2. Controls Bar: Category Filter & Search */}
        <section className="border-2 border-line bg-bg p-4 sm:p-5 shadow-rest flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {[
              { id: 'all', label: `ALL [${TEST_REGISTRY.length}]` },
              { id: 'primitives', label: 'PRIMITIVES [6]' },
              { id: 'components', label: 'COMPONENTS [7]' },
              { id: 'hooks', label: 'ADVANCED HOOKS [12]' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`h-9 px-3.5 border-2 text-xs font-mono font-bold uppercase whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-accent text-black border-line shadow-rest'
                    : 'bg-bg text-muted hover:text-fg hover:border-line border-line-soft'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-accent absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="SEARCH CATALOG [⌘K]..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 border-2 border-line bg-bg text-fg placeholder:text-muted font-mono uppercase text-xs focus:outline-none focus:border-accent shadow-rest"
            />
          </div>
        </section>

        {/* 3. Section 1: Primitives (6 Cards) */}
        {(activeCategory === 'all' || activeCategory === 'primitives') && primitives.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-line pb-4 font-mono">
              <div className="flex items-center gap-3">
                <span className="border border-line bg-bg px-2.5 py-0.5 text-accent font-bold uppercase text-xs">
                  [PRIMITIVES / 01]
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-fg font-display">
                  Declarative Scroll Primitives
                </h2>
              </div>
              <span className="text-xs text-muted font-bold uppercase">{primitives.length} UNITS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {primitives.map((item, idx) => (
                <TestItemCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Section 2: High-Performance Components (7 Cards) */}
        {(activeCategory === 'all' || activeCategory === 'components') && components.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-line pb-4 font-mono">
              <div className="flex items-center gap-3">
                <span className="border border-line bg-bg px-2.5 py-0.5 text-fg font-bold uppercase text-xs">
                  [COMPONENTS / 02]
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-fg font-display">
                  High-Performance Components
                </h2>
              </div>
              <span className="text-xs text-muted font-bold uppercase">{components.length} UNITS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components.map((item, idx) => (
                <TestItemCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Section 3: Advanced Hooks (12 Cards) */}
        {(activeCategory === 'all' || activeCategory === 'hooks') && hooks.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-line pb-4 font-mono">
              <div className="flex items-center gap-3">
                <span className="border border-line bg-bg px-2.5 py-0.5 text-accent font-bold uppercase text-xs">
                  [HOOKS / 03]
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-fg font-display">
                  Headless Reactive Hooks &amp; Solvers
                </h2>
              </div>
              <span className="text-xs text-muted font-bold uppercase">{hooks.length} UNITS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hooks.map((item, idx) => (
                <TestItemCard key={item.id} item={item} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center space-y-6 font-mono">
            <p className="text-muted text-xs uppercase font-bold">
              NO STANDARD UNIT TESTS FOUND MATCHING &ldquo;{searchQuery}&rdquo;.
            </p>
            <div className="inline-block p-6 border-2 border-line bg-bg shadow-rest text-left max-w-lg">
              <span className="text-xs text-accent uppercase font-bold block mb-2">
                LOOKING FOR STRESS OR RESILIENCE BENCHMARKS?
              </span>
              <Link
                href="/test/robust"
                className="h-10 px-4 border-2 border-line bg-accent text-black font-mono font-bold text-xs uppercase shadow-rest hover:shadow-hover transition-all inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>EXPLORE ENGINE ROBUSTNESS LAB (8 LAYERS) &rarr;</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Global Brutalist Footer */}
      <footer className="w-full border-t-2 border-line py-8 sm:py-10 bg-bg text-xs font-mono text-muted">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-fg font-bold uppercase">
            <span>SCROLL CRAFT</span>
            <span className="w-2 h-2 bg-accent inline-block" />
            <span className="text-muted font-normal text-[11px]">&copy; {new Date().getFullYear()} MIT LICENSED</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs uppercase font-bold">
            <Link href="/" className="hover:text-accent transition-colors">HOME</Link>
            <Link href="/docs" className="hover:text-accent transition-colors">DOCS</Link>
            <Link href="/showcase" className="hover:text-accent transition-colors">SHOWCASE</Link>
            <Link href="/test" className="text-accent underline underline-offset-4">TEST LAB</Link>
            <Link href="/roadmap" className="hover:text-accent transition-colors">ROADMAP</Link>
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
