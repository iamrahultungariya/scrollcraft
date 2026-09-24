'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, X, Hash, BookOpen, Layers, Terminal, Sparkles } from 'lucide-react';
import { DOCS_CATEGORIES } from './docs-data';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSection,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Flatten all searchable items
  const allItems = React.useMemo(() => {
    return DOCS_CATEGORIES.flatMap((category) =>
      category.items.map((item) => ({
        ...item,
        categoryId: category.id,
        categoryTitle: category.title,
      }))
    );
  }, []);

  // Filter items based on query
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.categoryTitle.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-scroll selected item into view on arrow key navigation
  useEffect(() => {
    if (isOpen && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelectSection(filteredItems[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onSelectSection, onClose]);

  if (!isOpen) return null;

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'getting-started':
        return <BookOpen className="w-3.5 h-3.5 text-violet-400" />;
      case 'primitives':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case 'hooks':
        return <Terminal className="w-3.5 h-3.5 text-purple-400" />;
      case 'r3f':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Hash className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-[250ms]"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-2xl bg-[#09090b] border border-zinc-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh] animate-in zoom-in-[0.96] duration-[250ms] [transition-timing-function:var(--ease-smooth-out)]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-[#0c0c0e]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, primitives, hooks..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div 
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto max-h-[55vh] overscroll-contain p-2 divide-y divide-zinc-900/60 touch-pan-y"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No results found for &ldquo;<span className="text-zinc-300">{query}</span>&rdquo;
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={`${item.categoryId}-${item.id}`}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    onClick={() => {
                      onSelectSection(item.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800/90 text-white'
                        : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                        {getCategoryIcon(item.categoryId)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                          <span>{item.categoryTitle}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isSelected ? 'text-zinc-300 translate-x-0.5' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#0a0a0c] border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="text-zinc-400">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="text-zinc-400">↵</kbd> Select
            </span>
            <span>
              <kbd className="text-zinc-400">ESC</kbd> Close
            </span>
          </div>
          <span>{filteredItems.length} results</span>
        </div>
      </div>
    </div>
  );
};
