'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DOCS_CATEGORIES } from './docs-data';
import { ChevronRight, ChevronsUpDown, Check, Terminal } from 'lucide-react';

interface DocsSidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({
  activeSection,
  onSelectSection,
  searchQuery,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // Initialize open state: active category is open by default, plus getting-started and primitives
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    DOCS_CATEGORIES.forEach((cat) => {
      const hasActive = cat.items.some((item) => item.id === activeSection);
      initial[cat.id] = hasActive || cat.id === 'getting-started' || cat.id === 'primitives';
    });
    return initial;
  });

  // Keep active category expanded if activeSection changes
  useEffect(() => {
    const parentCategory = DOCS_CATEGORIES.find((cat) =>
      cat.items.some((item) => item.id === activeSection)
    );
    if (parentCategory) {
      setOpenCategories((prev) => ({
        ...prev,
        [parentCategory.id]: true,
      }));
    }
  }, [activeSection]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleAll = () => {
    const allOpen = Object.values(openCategories).every(Boolean);
    const updated: Record<string, boolean> = {};
    DOCS_CATEGORIES.forEach((cat) => {
      updated[cat.id] = !allOpen;
    });
    setOpenCategories(updated);
  };

  const copyPrompt = () => {
    const promptContent = `# ScrollCraft Developer Context (llms.txt)
Package: @scrollcraft/core@beta @scrollcraft/react@beta
Architecture: Zero React re-renders, 3-phase microtask RAF loop, RSC & Slot (<asChild>) native.
Key Primitives:
- <Parallax speed={-0.2} direction="vertical" clamp={[-100, 100]} />
- <Reveal direction="up" distance={30} duration={0.6} threshold={0.15} />
- <Pin start="top top" end="+=100%" />
- <ScrollProgress />
- <ScrollTransform />
- <ScrollDraw />
- <StackedCards />
- <VelocityMarquee />
- <HorizontalScroll />
- <TextReveal />
- <Magnetic />
Key Hooks: useScrollProgress, useParallax, useReveal, usePin, useScrollTransform, useScrollTimeline, useScrollDirection, useTicker.
Documentation: https://scrollcraft.dev/docs`;

    navigator.clipboard.writeText(promptContent);
    setCopiedPrompt(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedPrompt(false), 1500);
  };

  return (
    <nav className="w-full shrink-0 flex flex-col gap-5 select-none pb-12 text-xs font-mono" aria-label="Documentation Sidebar">
      {/* Category Toggle Quick Action */}
      <div className="flex items-center justify-between px-1 text-[11px] font-mono text-muted/80 font-bold border-b border-line-soft/60 pb-2">
        <span className="tracking-wider uppercase text-[10px] text-muted">DOCUMENTATION MAP</span>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1 text-muted hover:text-accent transition-colors cursor-pointer py-0.5 px-1.5 border border-line-soft/80 bg-bg font-mono text-[10px] uppercase font-semibold"
          title="Toggle all categories"
        >
          <ChevronsUpDown className="w-3 h-3" />
          <span>Toggle All</span>
        </button>
      </div>

      {/* Grouped Categories with Accordion */}
      <div className="flex flex-col gap-4">
        {DOCS_CATEGORIES.map((category) => {
          const matchingItems = category.items.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (matchingItems.length === 0) return null;

          const isOpen = searchQuery ? true : !!openCategories[category.id];
          const hasActiveItem = category.items.some((item) => item.id === activeSection);

          return (
            <div key={category.id} className="flex flex-col">
              {/* Category Header Button */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-1.5 py-1 text-left transition-colors cursor-pointer group ${
                  hasActiveItem
                    ? 'text-fg font-bold'
                    : 'text-muted/90 hover:text-fg'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`transition-transform duration-150 text-muted/70 group-hover:text-fg shrink-0 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold truncate">
                    {category.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {category.badge && (
                    <span className="text-[9px] font-mono px-1 py-0.2 border border-accent/40 bg-accent/10 text-accent font-bold uppercase">
                      {category.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-muted/60 px-1 py-0.2">
                    {category.items.length}
                  </span>
                </div>
              </button>

              {/* Items List (Collapsible) */}
              {isOpen && (
                <ul className="flex flex-col gap-0.5 ml-2 pl-2 border-l border-line-soft/80 mt-1">
                  {matchingItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => onSelectSection(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono transition-all text-left cursor-pointer border-l-2 ${
                            isActive
                              ? 'border-accent bg-accent/10 text-accent font-bold'
                              : 'border-transparent text-muted/90 hover:text-fg hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono px-1 py-0.2 border shrink-0 ml-1.5 uppercase font-bold ${
                                isActive
                                  ? 'bg-accent text-black border-accent'
                                  : 'bg-bg text-muted border-line-soft'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Developer Context / llms.txt */}
      <div className="pt-4 border-t border-line-soft/80 mt-2 space-y-2">
        <button
          type="button"
          onClick={copyPrompt}
          className="w-full h-9 px-3 border border-line-soft bg-bg hover:border-accent hover:text-accent text-muted font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-rest active:translate-y-px"
          title="Copy ScrollCraft context prompt for AI code assistants"
        >
          {copiedPrompt ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent stroke-[3]" />
              <span className="text-accent">PROMPT COPIED!</span>
            </>
          ) : (
            <>
              <Terminal className="w-3.5 h-3.5" />
              <span>COPY AS PROMPT</span>
            </>
          )}
        </button>
        <span className="text-[10px] font-mono text-muted/60 text-center block">
          Exports full API reference for LLMs
        </span>
      </div>
    </nav>
  );
};
