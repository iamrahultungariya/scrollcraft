'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DocsSidebar } from './docs-sidebar';
import { DOCS_CATEGORIES } from './docs-data';
import { useScrollCraft } from '@scrollcraft/react';

export interface TocItem {
  id: string;
  title: string;
  level?: number;
}
import dynamic from 'next/dynamic';
import { DocGettingStarted } from './sections/doc-getting-started';

const SectionLoading = () => (
  <div className="flex flex-col gap-6 animate-pulse py-12">
    <div className="h-6 w-32 bg-zinc-850 rounded-md" />
    <div className="h-12 w-3/4 bg-zinc-800 rounded-lg" />
    <div className="h-4 w-full bg-zinc-900 rounded" />
    <div className="h-4 w-5/6 bg-zinc-900 rounded" />
    <div className="h-72 w-full bg-zinc-900/60 rounded-2xl border border-zinc-800" />
  </div>
);

const DocPrimitives = dynamic(
  () => import('./sections/doc-primitives').then((mod) => mod.DocPrimitives),
  { loading: SectionLoading }
);
const DocHooks = dynamic(
  () => import('./sections/doc-hooks').then((mod) => mod.DocHooks),
  { loading: SectionLoading }
);
const DocArchitecture = dynamic(
  () => import('./sections/doc-architecture').then((mod) => mod.DocArchitecture),
  { loading: SectionLoading }
);
const DocR3F = dynamic(
  () => import('./sections/doc-r3f').then((mod) => mod.DocR3F),
  { loading: SectionLoading }
);
const DocRecipes = dynamic(
  () => import('./sections/doc-recipes').then((mod) => mod.DocRecipes),
  { loading: SectionLoading }
);
const CommandPalette = dynamic(
  () => import('./command-palette').then((mod) => mod.CommandPalette),
  { ssr: false }
);
import {
  Menu,
  X,
  Search,
  ArrowRight,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Link from 'next/link';
import { ScrollCraftLogo } from '@/components/ui/scrollcraft-logo';

const TOC_MAPPING: Record<string, TocItem[]> = {
  introduction: [
    { id: 'introduction-mental-model', title: 'Mental Model & Pillars' },
    { id: 'install-package', title: 'Package Installation' },
    { id: 'feature-matrix', title: 'Feature Support Matrix' },
    { id: 'provider-setup', title: 'Root Layout Setup' },
    { id: 'provider-props', title: 'Configuration Props' },
    { id: 'quick-example', title: 'Quickstart Component' },
    { id: 'core-invariants', title: 'Engineering Invariants' },
    { id: 'architecture-attributions', title: 'Attributions & Engine' },
  ],
  installation: [
    { id: 'install-package', title: 'Package Manager' },
    { id: 'feature-matrix', title: 'Feature Support Matrix' },
  ],
  setup: [
    { id: 'provider-setup', title: 'Root Layout Setup' },
    { id: 'provider-props', title: 'Configuration Props' },
    { id: 'quick-example', title: 'Quickstart Component' },
    { id: 'core-invariants', title: 'Core Invariants' },
  ],
  'three-phase-ticker': [
    { id: 'ticker-execution', title: 'Execution Pipeline' },
    { id: 'ticker-api', title: 'Ticker API Reference' },
  ],
  'reduced-motion': [
    { id: 'a11y-detection', title: 'OS Motion Detection' },
    { id: 'a11y-fallback', title: 'Graceful Fallback' },
  ],
  benchmark: [
    { id: 'fps-comparison', title: 'FPS Stress Benchmark' },
  ],
};

export function DocsView() {
  const { subscribe, scrollTo } = useScrollCraft();
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  const tocItems = useMemo(() => {
    if (TOC_MAPPING[activeSection]) return TOC_MAPPING[activeSection];
    const cat = DOCS_CATEGORIES.find((c) => c.items.some((i) => i.id === activeSection));
    if (cat?.id === 'primitives') {
      return [
        { id: 'syntax', title: 'Syntax & Production Code' },
        { id: 'capabilities', title: 'Capabilities & Props' },
      ];
    }
    if (cat?.id === 'hooks') {
      return [
        { id: 'syntax', title: 'Syntax & Signature' },
        { id: 'capabilities', title: 'Capabilities & Return Values' },
      ];
    }
    if (cat?.id === 'recipes') {
      return [
        { id: 'recipe-code', title: 'Recipe Implementation' },
      ];
    }
    return [];
  }, [activeSection]);

  const flatSections = useMemo(() => {
    return DOCS_CATEGORIES.flatMap((cat) =>
      cat.items.map((item) => ({ ...item, categoryTitle: cat.title }))
    );
  }, []);

  const currentIndex = useMemo(() => {
    return flatSections.findIndex((item) => item.id === activeSection);
  }, [flatSections, activeSection]);

  const prevSection = currentIndex > 0 ? flatSections[currentIndex - 1] : null;
  const nextSection =
    currentIndex >= 0 && currentIndex < flatSections.length - 1
      ? flatSections[currentIndex + 1]
      : null;

  // Global shortcut for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Isolate wheel events on sidebar so mousewheel scrolling works natively without Lenis interception
  useEffect(() => {
    const sidebar = sidebarContainerRef.current;
    if (!sidebar) return;
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };
    sidebar.addEventListener('wheel', handleWheel, { passive: true });
    return () => sidebar.removeEventListener('wheel', handleWheel);
  }, []);

  // Track active heading on scroll for Right TOC
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveHeadingId(el.id);
          return;
        }
      }
      if (headingElements.length > 0 && headingElements[0]) {
        setActiveHeadingId(headingElements[0].id);
      }
    };

    const unsubscribe = subscribe(() => {
      handleScroll();
    });
    handleScroll();
    return () => unsubscribe();
  }, [tocItems, activeSection, subscribe]);

  // Sync section with URL hash on load and back/forward navigation
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === 'undefined') return;
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      if (!rawHash) return;

      const aliasMap: Record<string, string> = {
        progress: 'scroll-progress',
        hooks: 'use-scroll-progress',
        r3f: 'r3f-overview',
        ticker: 'three-phase-ticker',
        marquee: 'velocity-marquee',
        horizontal: 'horizontal-scroll',
        sequence: 'scroll-sequence',
        stacked: 'stacked-cards',
        cards: 'stacked-cards',
        text: 'text-reveal',
        transform: 'scroll-transform',
        draw: 'scroll-draw',
        inspector: 'scroll-inspector',
        direction: 'use-scroll-direction',
        timeline: 'use-scroll-timeline',
        restoration: 'use-scroll-restoration',
      };

      const targetId = aliasMap[rawHash] || rawHash;
      const exists = flatSections.some((s) => s.id === targetId);
      if (exists) {
        setActiveSection(targetId);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [flatSections]);

  const handleSelectSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`);
      if (!['installation', 'setup'].includes(id)) {
        scrollTo(0);
      }
    }
  };

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -88; // offset for sticky 64px header + padding
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      scrollTo(y);
      setActiveHeadingId(id);
    }
  };

  const renderSection = () => {
    if (['introduction', 'installation', 'setup'].includes(activeSection)) {
      return <DocGettingStarted sectionId={activeSection} />;
    }
    const cat = DOCS_CATEGORIES.find((c) => c.items.some((i) => i.id === activeSection));
    if (cat) {
      switch (cat.id) {
        case 'getting-started':
          return <DocGettingStarted sectionId={activeSection} />;
        case 'primitives':
          return <DocPrimitives primitiveId={activeSection} />;
        case 'hooks':
          return <DocHooks hookId={activeSection} />;
        case 'r3f':
          return <DocR3F sectionId={activeSection} />;
        case 'architecture':
          return <DocArchitecture sectionId={activeSection} />;
        case 'recipes':
          return <DocRecipes recipeId={activeSection} />;
      }
    }
    return <DocGettingStarted sectionId="introduction" />;
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#050505] text-zinc-100 font-sans selection:bg-violet-600/30 selection:text-white">
      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectSection={handleSelectSection}
      />

      {/* Top Header - Consistent with Home/Showcase/Roadmap Navbar */}
      <header className="w-full border-b border-zinc-800/80 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ScrollCraftLogo variant="badge" badgeText="Beta" size="sm" />
            </Link>
            <nav className="hidden md:flex items-center gap-2 text-xs font-medium">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/docs"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-semibold border border-zinc-800 shadow-xs"
              >
                Docs
              </Link>
              <Link
                href="/showcase"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Showcase
              </Link>
              <Link
                href="/roadmap"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Roadmap
              </Link>
            </nav>
          </div>

          {/* Quick Search trigger & right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2.5 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full h-9 px-3.5 text-xs text-zinc-400 transition-all cursor-pointer shadow-inner group"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              <span className="hidden sm:inline text-zinc-400 text-xs">Search docs...</span>
              <div className="hidden sm:flex items-center gap-0.5 ml-1">
                <kbd className="px-1.5 py-0.5 text-[9px] bg-zinc-800 border border-zinc-700 rounded font-mono text-zinc-400">⌘K</kbd>
              </div>
            </button>

            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ScrollCraft GitHub Repository"
              className="p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden md:flex p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {desktopSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Docs Content Layout: Framed in max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex relative">
        {/* Left Sidebar - Sticky within container, data-lenis-prevent, smoothly wheel-scrollable */}
        <aside
          ref={sidebarContainerRef}
          data-lenis-prevent="true"
          className={`
            sticky top-16 h-[calc(100vh-4rem)] w-64 lg:w-72 shrink-0 py-6 pr-6 border-r border-zinc-800/80
            overflow-y-auto overscroll-contain sidebar-scroll
            ${
              mobileMenuOpen
                ? 'fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] p-6 pb-28 shadow-2xl block border-r border-zinc-800'
                : desktopSidebarOpen
                ? 'hidden md:block'
                : 'hidden'
            }
          `}
        >
          {/* Mobile Close Button inside Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
              <ScrollCraftLogo variant="badge" badgeText="Beta" size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Version Selector & Stability Signal */}
          <div className="mb-6 space-y-2">
            <div className="w-full bg-zinc-900/90 border border-violet-500/30 rounded-lg px-3 py-1.5 text-xs text-zinc-300 font-mono flex items-center justify-between shadow-xs">
              <span className="font-semibold text-white">@scrollcraft/react</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-violet-500/15 text-violet-400 border border-violet-500/30 font-mono">
                v0.2.0 Beta
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight px-1 font-sans">
              <span className="text-zinc-300 font-medium">v0.2.0 Beta</span> is production-hardened across the 8-Layer Protocol with zero React re-renders.
            </p>
          </div>

          <DocsSidebar
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </aside>

        {/* Center Main Article */}
        <main className="flex-1 min-w-0 px-3 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-12 pb-28 sm:pb-16">
          <article className="prose prose-invert prose-zinc max-w-none">
            {renderSection()}
          </article>

          {/* Pagination Cards */}
          <div className="mt-20 pt-8 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevSection ? (
              <button
                onClick={() => handleSelectSection(prevSection.id)}
                className="flex flex-col gap-1 p-5 rounded-xl border border-zinc-800/80 bg-[#09090b] hover:border-zinc-700 transition-all text-left group shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300 font-mono mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>Previous</span>
                </div>
                <span className="text-base font-semibold text-white group-hover:text-violet-400 transition-colors">
                  {prevSection.title}
                </span>
                <span className="text-xs text-zinc-500">{prevSection.categoryTitle}</span>
              </button>
            ) : (
              <div />
            )}

            {nextSection && (
              <button
                onClick={() => handleSelectSection(nextSection.id)}
                className="flex flex-col gap-1 p-5 rounded-xl border border-zinc-800/80 bg-[#09090b] hover:border-zinc-700 transition-all text-right items-end group shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300 font-mono mb-1">
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
                <span className="text-base font-semibold text-white group-hover:text-violet-400 transition-colors">
                  {nextSection.title}
                </span>
                <span className="text-xs text-zinc-500">{nextSection.categoryTitle}</span>
              </button>
            )}
          </div>
        </main>

        {/* Right TOC Sidebar - Sticky within container, data-lenis-prevent */}
        <aside
          data-lenis-prevent="true"
          className="sticky top-16 h-[calc(100vh-4rem)] w-56 lg:w-64 shrink-0 py-12 pl-6 border-l border-zinc-800/80 overflow-y-auto overscroll-contain sidebar-scroll hidden xl:block"
        >
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            On this page
          </div>

          {tocItems.length > 0 ? (
            <div className="flex flex-col border-l border-zinc-800/80 pl-0 relative">
              {tocItems.map((item) => {
                const isHeadingActive = activeHeadingId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`text-left pl-3.5 py-1.5 text-xs transition-all cursor-pointer border-l -ml-[1px] leading-relaxed ${
                      isHeadingActive
                        ? 'text-white font-semibold border-violet-500'
                        : 'text-zinc-500 hover:text-zinc-300 border-transparent'
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-zinc-600 italic">Overview section</div>
          )}

          {/* Feedback Widget */}
          <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-col gap-3 text-xs text-zinc-500">
            <span className="font-mono text-[11px]">Was this section helpful?</span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs">
                👍 Yes
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs">
                👎 No
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
