'use client';

import React, { useState, useEffect } from 'react';
import { DOCS_CATEGORIES } from './docs-data';
import { ChevronRight, ChevronsUpDown, Copy, Check } from 'lucide-react';

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
    setTimeout(() => setCopiedPrompt(false), 1500);
  };

  return (
    <aside className="w-full shrink-0 flex flex-col gap-6 select-none pb-12 text-xs font-mono">
      {/* Category Toggle Quick Action */}
      <div className="flex items-center justify-between px-1 text-[11px] font-mono text-muted font-bold">
        <span className="tracking-wider uppercase">SECTIONS</span>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1 text-muted hover:text-accent transition-colors cursor-pointer py-1 px-1.5 border border-line-soft bg-bg font-mono text-[10px] uppercase font-bold"
          title="Toggle all categories"
        >
          <ChevronsUpDown className="w-3 h-3" />
          <span>Toggle All</span>
        </button>
      </div>

      {/* Grouped Categories with Accordion */}
      <div className="flex flex-col gap-3">
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
                className={`w-full flex items-center justify-between px-2.5 py-2 text-left transition-all cursor-pointer group border-2 ${
                  hasActiveItem
                    ? 'border-line bg-line-soft/30 text-fg font-bold'
                    : 'border-transparent text-muted hover:text-fg hover:border-line-soft'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`transition-transform duration-120 text-muted group-hover:text-fg ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                    {category.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {category.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 border border-line bg-bg text-accent font-bold uppercase">
                      {category.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-muted group-hover:text-fg px-1.5 py-0.5 bg-bg border border-line-soft font-bold">
                    {category.items.length}
                  </span>
                </div>
              </button>

              {/* Items List (Collapsible) */}
              {isOpen && (
                <ul className="flex flex-col gap-1 ml-3 pl-2.5 border-l-2 border-line-soft mt-1.5 mb-2">
                  {matchingItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => onSelectSection(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono transition-all text-left cursor-pointer border-2 ${
                            isActive
                              ? 'bg-accent text-black border-accent font-bold shadow-rest'
                              : 'text-fg/80 hover:bg-fg hover:text-black border-transparent hover:border-line'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 border shrink-0 ml-1.5 uppercase font-bold ${
                                isActive
                                  ? 'bg-black text-accent border-black'
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

      {/* Retention Mechanic: COPY AS PROMPT / llms.txt */}
      <div className="pt-4 border-t-2 border-line-soft mt-2">
        <button
          type="button"
          onClick={copyPrompt}
          className="w-full h-10 px-3 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
          title="Copy ScrollCraft context prompt for AI code assistants"
        >
          {copiedPrompt ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>PROMPT COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY AS PROMPT</span>
            </>
          )}
        </button>
        <span className="text-[10px] font-mono text-muted text-center block mt-1.5">
          Exports full API reference for LLMs
        </span>
      </div>
    </aside>
  );
};
