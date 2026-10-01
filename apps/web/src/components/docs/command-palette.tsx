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
        return <BookOpen className="w-3.5 h-3.5 text-accent" />;
      case 'primitives':
        return <Layers className="w-3.5 h-3.5 text-accent" />;
      case 'hooks':
        return <Terminal className="w-3.5 h-3.5 text-accent" />;
      case 'r3f':
        return <Sparkles className="w-3.5 h-3.5 text-accent" />;
      default:
        return <Hash className="w-3.5 h-3.5 text-muted" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div 
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl border-2 border-line bg-bg shadow-[8px_8px_0px_var(--accent)] overflow-hidden z-10 flex flex-col max-h-[75vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b-2 border-line bg-bg">
          <Search className="w-4 h-4 text-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH DOCUMENTATION, PRIMITIVES, HOOKS..."
            className="flex-1 bg-transparent text-sm text-fg placeholder:text-muted font-mono uppercase focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted hover:text-fg p-1 border border-line-soft transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-black bg-accent border-2 border-line font-bold">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div 
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto max-h-[55vh] overscroll-contain p-2 space-y-1 touch-pan-y"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono uppercase text-muted">
              NO RESULTS FOUND FOR &ldquo;<span className="text-fg font-bold">{query}</span>&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors cursor-pointer border-2 ${
                    isSelected
                      ? 'bg-accent text-black border-accent font-bold shadow-rest'
                      : 'text-fg border-transparent hover:bg-fg hover:text-black hover:border-line'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 border border-line-soft bg-bg shrink-0">
                      {getCategoryIcon(item.categoryId)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold uppercase truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 border uppercase font-bold ${
                            isSelected ? 'bg-black text-accent border-black' : 'bg-bg text-muted border-line-soft'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] uppercase font-mono ${isSelected ? 'text-black/80' : 'text-muted'}`}>
                        <span>{item.categoryTitle}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-black translate-x-0.5' : 'text-muted'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-line-soft/30 border-t-2 border-line flex items-center justify-between text-[11px] text-muted font-mono font-bold uppercase">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="text-accent font-bold">↑↓</kbd> NAVIGATE
            </span>
            <span>
              <kbd className="text-accent font-bold">↵</kbd> SELECT
            </span>
            <span>
              <kbd className="text-accent font-bold">ESC</kbd> CLOSE
            </span>
          </div>
          <span>{filteredItems.length} RESULTS</span>
        </div>
      </div>
    </div>
  );
};
