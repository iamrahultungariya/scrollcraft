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
  <div className="flex flex-col gap-6 animate-pulse py-12 font-mono">
    <div className="h-6 w-32 bg-panel border border-paper/10 rounded-sm" />
    <div className="h-10 w-3/4 bg-panel border border-paper/10 rounded-sm" />
    <div className="h-4 w-full bg-panel/60 rounded-sm" />
    <div className="h-4 w-5/6 bg-panel/60 rounded-sm" />
    <div className="h-64 w-full bg-panel/40 rounded-sm border border-paper/15 shadow-[4px_4px_0px_#0e1210]" />
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
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  X,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { SiteNav } from '@/components/layout/site-nav';

const TOC_MAPPING: Record<string, TocItem[]> = {
  introduction: [
    { id: 'introduction-mental-model', title: 'Mental Model & Guarantees' },
    { id: 'step-01-install', title: 'Step 1: Install Package' },
    { id: 'step-02-provider', title: 'Step 2: Root Provider Setup' },
    { id: 'provider-props', title: 'Configuration Options' },
    { id: 'step-03-scene', title: 'Step 3: First Scroll Scene' },
    { id: 'feature-matrix', title: 'Feature Support Matrix' },
    { id: 'core-invariants', title: 'Engineering Invariants' },
    { id: 'architecture-attributions', title: 'Attributions & Engine' },
  ],
  installation: [
    { id: 'step-01-install', title: 'Package Manager' },
    { id: 'feature-matrix', title: 'Feature Support Matrix' },
  ],
  setup: [
    { id: 'step-02-provider', title: 'Root Layout Setup' },
    { id: 'provider-props', title: 'Configuration Options' },
    { id: 'step-03-scene', title: 'First Scroll Scene' },
    { id: 'core-invariants', title: 'Engineering Invariants' },
  ],
  'three-phase-ticker': [
    { id: 'ticker-execution', title: 'Execution Pipeline' },
  ],
  'reduced-motion': [
    { id: 'a11y-detection', title: 'OS Motion Detection' },
  ],
  benchmark: [
    { id: 'fps-comparison', title: 'Paradigms Comparison' },
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
        magnetic: 'magnetic',
        skew: 'skew-gallery',
        gallery: 'skew-gallery',
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
    <div className="w-full min-h-screen flex flex-col bg-bg text-fg font-body selection:bg-accent selection:text-black">
      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectSection={handleSelectSection}
      />

      {/* Top Header - Unified SiteNav */}
      <SiteNav
        variant="sticky"
        maxWidth="max-w-[1536px]"
        extraActions={
          <>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2.5 bg-bg hover:bg-fg hover:text-black border-2 border-line h-10 px-3.5 text-xs text-muted hover:text-black font-mono transition-all cursor-pointer shadow-rest hover:shadow-hover group"
            >
              <Search className="w-3.5 h-3.5 text-accent group-hover:text-black transition-colors" />
              <span className="hidden sm:inline font-mono font-bold uppercase tracking-wider text-xs">
                [ SEARCH <span className="text-accent group-hover:text-black">⌘K</span> ]
              </span>
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden md:flex h-10 w-10 items-center justify-center border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black transition-all shadow-rest hover:shadow-hover cursor-pointer"
              title={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {desktopSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* Mobile Docs Sidebar Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-10 px-3 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black transition-all shadow-rest cursor-pointer flex items-center gap-2 text-xs font-mono font-bold uppercase"
              title={mobileMenuOpen ? 'Close docs outline' : 'Open docs outline'}
            >
              <BookOpen className="w-4 h-4 text-accent" />
              <span>TOPICS</span>
            </button>
          </>
        }
      />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
        />
      )}

      {/* Main Docs Content Layout: Framed in max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex relative">
        {/* Left Sidebar - Sticky within container, data-lenis-prevent, smoothly wheel-scrollable */}
        <aside
          ref={sidebarContainerRef}
          data-lenis-prevent="true"
          className={`
            sticky top-16 h-[calc(100vh-4rem)] w-64 lg:w-72 shrink-0 py-6 pr-6 border-r-2 border-line-soft
            overflow-y-auto overscroll-contain sidebar-scroll
            ${
              mobileMenuOpen
                ? 'fixed inset-y-0 left-0 z-50 w-72 bg-bg p-6 pb-28 shadow-rest block border-r-2 border-line'
                : desktopSidebarOpen
                ? 'hidden md:block'
                : 'hidden'
            }
          `}
        >
          {/* Mobile Close Button inside Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden flex items-center justify-between pb-4 mb-4 border-b-2 border-line">
              <span className="font-display font-black text-sm uppercase text-fg">
                SCROLL CRAFT <span className="w-2 h-2 bg-accent inline-block" />
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-9 w-9 flex items-center justify-center border-2 border-line bg-bg text-fg hover:bg-accent hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Version Selector & Stability Signal */}
          <div className="mb-6 space-y-2">
            <div className="w-full bg-bg border-2 border-line p-3 text-xs text-fg font-mono flex items-center justify-between shadow-rest">
              <span className="font-bold text-fg">@scrollcraft/react</span>
              <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider bg-accent text-black border-2 border-line font-mono">
                v0.2.0 Beta
              </span>
            </div>
            <p className="text-[11px] text-muted leading-tight px-1 font-mono">
              <strong className="text-fg font-bold">v0.2.0 Beta</strong> is production-hardened with zero Virtual DOM re-renders.
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
        <main className="flex-1 min-w-0 px-3 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-10 pb-28 sm:pb-16 font-body">
          <article className="docs docs-prose max-w-none text-fg font-body">
            {renderSection()}
          </article>

          {/* Pagination Cards - Poora block --accent fill + text black on hover with hard shadow */}
          <div className="mt-20 pt-8 border-t-2 border-line grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            {prevSection ? (
              <button
                onClick={() => handleSelectSection(prevSection.id)}
                className="flex flex-col gap-1.5 p-5 border-2 border-line bg-bg text-fg hover:bg-accent hover:text-black transition-all text-left group shadow-rest hover:shadow-hover cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted group-hover:text-black font-mono uppercase font-bold mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 text-accent group-hover:text-black transition-transform group-hover:-translate-x-1" />
                  <span>PREVIOUS</span>
                </div>
                <span className="text-base sm:text-lg font-black uppercase text-fg group-hover:text-black font-display tracking-tight">
                  {prevSection.title}
                </span>
                <span className="text-xs text-muted group-hover:text-black/80 font-mono font-bold uppercase">
                  {prevSection.categoryTitle}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextSection && (
              <button
                onClick={() => handleSelectSection(nextSection.id)}
                className="flex flex-col gap-1.5 p-5 border-2 border-line bg-bg text-fg hover:bg-accent hover:text-black transition-all text-right items-end group shadow-rest hover:shadow-hover cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted group-hover:text-black font-mono uppercase font-bold mb-1">
                  <span>NEXT</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:text-black transition-transform group-hover:translate-x-1" />
                </div>
                <span className="text-base sm:text-lg font-black uppercase text-fg group-hover:text-black font-display tracking-tight">
                  {nextSection.title}
                </span>
                <span className="text-xs text-muted group-hover:text-black/80 font-mono font-bold uppercase">
                  {nextSection.categoryTitle}
                </span>
              </button>
            )}
          </div>
        </main>

        {/* Right TOC Sidebar - Sticky within container, data-lenis-prevent */}
        <aside
          data-lenis-prevent="true"
          className="sticky top-16 h-[calc(100vh-4rem)] w-56 lg:w-64 shrink-0 py-10 pl-6 border-l-2 border-line-soft overflow-y-auto overscroll-contain sidebar-scroll hidden xl:block font-mono"
        >
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted mb-4">
            ON THIS PAGE
          </div>

          {tocItems.length > 0 ? (
            <div className="flex flex-col gap-1 relative">
              {tocItems.map((item) => {
                const isHeadingActive = activeHeadingId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`text-left px-3 py-1.5 text-xs transition-all cursor-pointer leading-relaxed border-2 uppercase font-mono font-bold ${
                      isHeadingActive
                        ? 'bg-accent text-black border-accent shadow-rest'
                        : 'text-muted hover:text-fg hover:bg-fg hover:text-black border-transparent'
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-muted italic">Overview section</div>
          )}

          {/* Feedback Widget - Min height 40px buttons */}
          <div className="mt-12 pt-6 border-t-2 border-line-soft flex flex-col gap-3 text-xs text-muted">
            <span className="font-mono text-[11px] font-bold text-fg uppercase tracking-wider">
              WAS THIS SECTION HELPFUL?
            </span>
            <div className="flex gap-2">
              <button className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs font-mono font-bold shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5">
                👍 YES
              </button>
              <button className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs font-mono font-bold shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5">
                👎 NO
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
