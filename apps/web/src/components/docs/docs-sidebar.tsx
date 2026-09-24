'use client';

import React, { useState, useEffect } from 'react';
import { DOCS_CATEGORIES } from './docs-data';
import { ChevronRight, ChevronsUpDown } from 'lucide-react';

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

  return (
    <aside className="w-full shrink-0 flex flex-col gap-6 select-none pb-24 text-xs font-sans">
      {/* Category Toggle Quick Action */}
      <div className="flex items-center justify-between px-2 text-[11px] font-mono text-zinc-500">
        <span>NAVIGATION</span>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1 hover:text-zinc-300 transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-zinc-800/40"
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
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer group ${
                  hasActiveItem ? 'text-zinc-200 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`transition-transform duration-[250ms] [transition-timing-function:var(--ease-in-out)] text-zinc-500 group-hover:text-zinc-300 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                    {category.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {category.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        category.badge === 'Alpha'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {category.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/60">
                    {category.items.length}
                  </span>
                </div>
              </button>

              {/* Items List (Collapsible) */}
              {isOpen && (
                <ul className="flex flex-col gap-0.5 ml-4 pl-2.5 border-l border-zinc-800/60 mt-1 mb-2 animate-in fade-in duration-[250ms]">
                  {matchingItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const isAlpha = item.badge === 'Alpha';
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => onSelectSection(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs border transition-colors text-left cursor-pointer ${
                            isActive
                              ? 'text-white font-medium bg-zinc-800/90 shadow-xs border-zinc-700/60'
                              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 border-transparent'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ml-1.5 ${
                                isAlpha
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase'
                                  : isActive
                                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
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
    </aside>
  );
};
