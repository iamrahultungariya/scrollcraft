'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { DocsSidebar } from './docs-sidebar';
import { DOCS_CATEGORIES } from './docs-data';
import { useScrollCraft } from '@scrollcraft/react';
import { DocGettingStarted } from './sections/doc-getting-started';
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

export interface TocItem {
  id: string;
  title: string;
  level?: number;
}

const SectionLoading = () => (
  <div className="flex flex-col gap-6 animate-pulse py-12 font-mono">
    <div className="h-6 w-32 bg-line-soft/40 border border-line-soft" />
    <div className="h-10 w-3/4 bg-line-soft/40 border border-line-soft" />
    <div className="h-4 w-full bg-line-soft/30" />
    <div className="h-4 w-5/6 bg-line-soft/30" />
    <div className="h-64 w-full bg-line-soft/20 border border-line-soft" />
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

const GETTING_STARTED_TOC: TocItem[] = [
  { id: 'introduction-mental-model', title: 'Overview & Concept', level: 2 },
  { id: 'step-01-install', title: 'Package Installation', level: 2 },
  { id: 'step-02-provider', title: 'Framework Setup', level: 2 },
  { id: 'provider-props', title: 'Configuration Options', level: 3 },
  { id: 'step-03-scene', title: 'First Scroll Scene', level: 2 },
  { id: 'feature-matrix', title: 'Feature Support Matrix', level: 2 },
  { id: 'core-invariants', title: 'Engineering Invariants', level: 2 },
  { id: 'architecture-attributions', title: 'Engine & Attributions', level: 2 },
];

const TOC_MAPPING: Record<string, TocItem[]> = {
  introduction: GETTING_STARTED_TOC,
  installation: GETTING_STARTED_TOC,
  setup: GETTING_STARTED_TOC,
  'three-phase-ticker': [
    { id: 'ticker-execution', title: 'Execution Pipeline', level: 2 },
  ],
  'reduced-motion': [
    { id: 'a11y-detection', title: 'OS Motion Detection', level: 2 },
  ],
  benchmark: [
    { id: 'fps-comparison', title: 'Paradigms Comparison', level: 2 },
  ],
};

export function DocsView() {
  const { subscribe, scrollTo } = useScrollCraft();
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('introduction-mental-model');
  const [readProgress, setReadProgress] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);

  const tocItems = useMemo(() => {
    if (TOC_MAPPING[activeSection]) return TOC_MAPPING[activeSection];
    const cat = DOCS_CATEGORIES.find((c) => c.items.some((i) => i.id === activeSection));
    if (cat?.id === 'primitives') {
      return [
        { id: 'syntax', title: 'Syntax & Production Code', level: 2 },
        { id: 'capabilities', title: 'Capabilities & Props', level: 2 },
      ];
    }
    if (cat?.id === 'hooks') {
      return [
        { id: 'syntax', title: 'Syntax & Signature', level: 2 },
        { id: 'capabilities', title: 'Capabilities & Return Values', level: 2 },
      ];
    }
    if (cat?.id === 'recipes') {
      return [
        { id: 'recipe-code', title: 'Recipe Implementation', level: 2 },
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

  // Isolate wheel events on sidebar so mousewheel scrolling works natively
  useEffect(() => {
    const sidebar = sidebarContainerRef.current;
    if (!sidebar) return;
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };
    sidebar.addEventListener('wheel', handleWheel, { passive: true });
    return () => sidebar.removeEventListener('wheel', handleWheel);
  }, []);

  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;
  const tocItemsRef = useRef(tocItems);
  tocItemsRef.current = tocItems;

  // Track active heading and sync active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const items = tocItemsRef.current;
      if (items.length === 0) return;

      // Reading progress percentage
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalDocHeight > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((window.scrollY / totalDocHeight) * 100)));
        setReadProgress(pct);
      }

      if (isNavigatingRef.current) return;

      const scrollPos = window.scrollY + 140;
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      let foundHeadingId = '';
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.offsetTop <= scrollPos) {
          foundHeadingId = el.id;
          break;
        }
      }
      if (!foundHeadingId && headingElements.length > 0 && headingElements[0]) {
        foundHeadingId = headingElements[0].id;
      }

      if (foundHeadingId) {
        setActiveHeadingId(foundHeadingId);

        // Synchronize Left Sidebar active state for Getting Started sub-stages
        const curSection = activeSectionRef.current;
        if (['introduction', 'installation', 'setup'].includes(curSection)) {
          const installEl = document.getElementById('step-01-install');
          const providerEl = document.getElementById('step-02-provider');

          const installTop = installEl ? installEl.offsetTop - 160 : Infinity;
          const providerTop = providerEl ? providerEl.offsetTop - 160 : Infinity;

          if (scrollPos >= providerTop) {
            if (curSection !== 'setup') {
              setActiveSection('setup');
            }
          } else if (scrollPos >= installTop) {
            if (curSection !== 'installation') {
              setActiveSection('installation');
            }
          } else {
            if (curSection !== 'introduction') {
              setActiveSection('introduction');
            }
          }
        }
      }
    };

    const unsubscribe = subscribe(() => {
      handleScroll();
    });
    handleScroll();
    return () => unsubscribe();
  }, [subscribe]);

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

  const handleSelectSection = useCallback((id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`);

      // Smooth scroll handling for Getting Started sub-stages
      if (['introduction', 'installation', 'setup'].includes(id)) {
        isNavigatingRef.current = true;
        let targetElementId = 'introduction-mental-model';
        if (id === 'installation') targetElementId = 'step-01-install';
        if (id === 'setup') targetElementId = 'step-02-provider';

        const el = document.getElementById(targetElementId);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 88;
          scrollTo(y);
          setActiveHeadingId(targetElementId);
        } else {
          scrollTo(0);
        }

        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 600);
      } else {
        scrollTo(0);
      }
    }
  }, [scrollTo]);

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      isNavigatingRef.current = true;
      const yOffset = -88;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      scrollTo(y);
      setActiveHeadingId(id);

      // Also update section if clicking a major stage
      if (id === 'step-01-install') {
        setActiveSection('installation');
        window.history.replaceState(null, '', '#installation');
      } else if (id === 'step-02-provider' || id === 'provider-props') {
        setActiveSection('setup');
        window.history.replaceState(null, '', '#setup');
      } else if (id === 'introduction-mental-model') {
        setActiveSection('introduction');
        window.history.replaceState(null, '', '#introduction');
      }

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 500);
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
              className="flex items-center gap-2 bg-bg hover:bg-fg hover:text-black border border-line-soft h-9 px-3 text-xs text-muted hover:text-black font-mono transition-all cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-accent group-hover:text-black transition-colors" />
              <span className="hidden sm:inline font-mono font-bold uppercase tracking-wider text-[11px]">
                SEARCH <span className="text-accent group-hover:text-black ml-1">⌘K</span>
              </span>
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden md:flex h-9 w-9 items-center justify-center border border-line-soft bg-bg hover:border-accent text-muted hover:text-accent transition-colors cursor-pointer"
              title={desktopSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {desktopSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* Mobile Docs Sidebar Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 px-2.5 border border-line-soft bg-bg hover:border-accent text-fg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold uppercase"
              title={mobileMenuOpen ? 'Close docs outline' : 'Open docs outline'}
            >
              <BookOpen className="w-3.5 h-3.5 text-accent" />
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

      {/* Main Docs Content Layout */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex relative">
        {/* Left Sidebar */}
        <aside
          ref={sidebarContainerRef}
          data-lenis-prevent="true"
          className={`
            sticky top-16 h-[calc(100vh-4rem)] w-64 lg:w-72 shrink-0 py-6 pr-5 border-r border-line-soft
            overflow-y-auto overscroll-contain sidebar-scroll
            ${
              mobileMenuOpen
                ? 'fixed inset-y-0 left-0 z-50 w-72 bg-bg p-6 pb-28 shadow-xl block border-r border-line'
                : desktopSidebarOpen
                ? 'hidden md:block'
                : 'hidden'
            }
          `}
        >
          {/* Mobile Close Button inside Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden flex items-center justify-between pb-4 mb-4 border-b border-line-soft">
              <span className="font-display font-black text-sm uppercase text-fg">
                SCROLL CRAFT <span className="w-2 h-2 bg-accent inline-block ml-1" />
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 flex items-center justify-center border border-line-soft bg-bg text-fg hover:border-accent hover:text-accent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Version Selector & Stability Signal */}
          <div className="mb-5 space-y-1.5">
            <div className="w-full bg-white/[0.02] border border-line-soft p-2.5 text-xs text-fg font-mono flex items-center justify-between">
              <span className="font-bold text-fg">@scrollcraft/react</span>
              <span className="text-[10px] px-1.5 py-0.2 font-bold uppercase tracking-wider bg-accent text-black font-mono">
                v0.2.0 Beta
              </span>
            </div>
            <p className="text-[11px] text-muted/70 leading-tight px-1 font-mono">
              Hardware-composited scroll engine with 0 React re-renders.
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

          {/* Pagination Cards */}
          <div className="mt-16 pt-8 border-t border-line-soft grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            {prevSection ? (
              <button
                onClick={() => handleSelectSection(prevSection.id)}
                className="flex flex-col gap-1.5 p-4 border border-line-soft bg-bg text-fg hover:border-accent hover:bg-white/[0.02] transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-muted group-hover:text-accent font-mono uppercase font-bold">
                  <ArrowLeft className="w-3.5 h-3.5 text-accent transition-transform group-hover:-translate-x-1" />
                  <span>PREVIOUS</span>
                </div>
                <span className="text-sm sm:text-base font-bold text-fg group-hover:text-accent font-display tracking-tight">
                  {prevSection.title}
                </span>
                <span className="text-[10px] text-muted font-mono uppercase">
                  {prevSection.categoryTitle}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextSection && (
              <button
                onClick={() => handleSelectSection(nextSection.id)}
                className="flex flex-col gap-1.5 p-4 border border-line-soft bg-bg text-fg hover:border-accent hover:bg-white/[0.02] transition-all text-right items-end group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-muted group-hover:text-accent font-mono uppercase font-bold">
                  <span>NEXT</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent transition-transform group-hover:translate-x-1" />
                </div>
                <span className="text-sm sm:text-base font-bold text-fg group-hover:text-accent font-display tracking-tight">
                  {nextSection.title}
                </span>
                <span className="text-[10px] text-muted font-mono uppercase">
                  {nextSection.categoryTitle}
                </span>
              </button>
            )}
          </div>
        </main>

        {/* Right Reading-Progress Rail (ON THIS PAGE) */}
        <aside
          data-lenis-prevent="true"
          className="sticky top-16 h-[calc(100vh-4rem)] w-56 lg:w-64 shrink-0 py-8 pl-5 border-l border-line-soft overflow-y-auto overscroll-contain sidebar-scroll hidden xl:block font-mono"
        >
          {/* Header with Reading Percentage */}
          <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-muted mb-4 pb-2 border-b border-line-soft/60">
            <span>ON THIS PAGE</span>
            {readProgress > 0 && (
              <span className="text-[10px] text-accent font-semibold">{readProgress}%</span>
            )}
          </div>

          {/* Navigation Rail with Vertical Track Indicator */}
          {tocItems.length > 0 ? (
            <div className="relative flex flex-col border-l border-line-soft/80">
              {tocItems.map((item) => {
                const isHeadingActive = activeHeadingId === item.id;
                const isLevel3 = item.level === 3;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => scrollToHeading(item.id, e)}
                    className={`text-left text-xs transition-colors cursor-pointer py-1.5 leading-snug border-l-2 -ml-[1.5px] ${
                      isLevel3 ? 'pl-5 text-[11px]' : 'pl-3.5'
                    } ${
                      isHeadingActive
                        ? 'border-accent text-accent font-bold bg-accent/5'
                        : 'border-transparent text-muted hover:text-fg hover:border-line-soft'
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-muted/60 italic">Overview section</div>
          )}

          {/* Subtle Feedback Widget */}
          <div className="mt-10 pt-4 border-t border-line-soft/60 space-y-2">
            <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block">
              WAS THIS HELPFUL?
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFeedbackSubmitted(true)}
                className="h-7 px-3 border border-line-soft bg-bg hover:border-accent hover:text-accent text-muted text-xs font-mono font-bold transition-all cursor-pointer"
              >
                YES
              </button>
              <button
                onClick={() => setFeedbackSubmitted(true)}
                className="h-7 px-3 border border-line-soft bg-bg hover:border-accent hover:text-accent text-muted text-xs font-mono font-bold transition-all cursor-pointer"
              >
                NO
              </button>
              {feedbackSubmitted && (
                <span className="text-[10px] text-accent font-mono ml-1 font-semibold">Thank you!</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
