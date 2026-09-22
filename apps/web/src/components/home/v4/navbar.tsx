'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useScrollCraft, ScrollMetrics } from '@scrollcraft/react';
import { ScrollCraftLogo } from '@/components/ui/scrollcraft-logo';

export function Navbar() {
  const bgRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useScrollCraft();

  useEffect(() => {
    let wasScrolled: boolean | null = null;
    const unsub = subscribe((metrics: ScrollMetrics) => {
      const isScrolled = metrics.scroll > 20;
      if (isScrolled === wasScrolled) return;
      wasScrolled = isScrolled;

      if (bgRef.current) {
        bgRef.current.style.opacity = isScrolled ? '1' : '0';
      }
    });
    return () => unsub();
  }, [subscribe]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 flex items-center">
      {/* Isolated GPU Composited Background Layer (Zero Repaint & Zero Blur Interpolation Lag) */}
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{ opacity: 0, willChange: 'opacity' }}
        className="absolute inset-0 -z-10 glass-surface border-b border-white/10 shadow-2xl transition-opacity duration-200 pointer-events-none"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex items-center justify-between relative">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <ScrollCraftLogo variant="badge" badgeText="Beta" size="md" />
          </Link>
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400 absolute left-1/2 -translate-x-1/2">
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/showcase" className="hover:text-white transition-colors">
            Showcase
          </Link>
          <Link href="/roadmap" className="hover:text-white transition-colors">
            Roadmap
          </Link>
          <Link href="/test" className="hover:text-white transition-colors flex items-center gap-1">
            <span>Test Lab</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono font-semibold">25</span>
          </Link>
          <Link href="/test/robust" className="hover:text-white transition-colors flex items-center gap-1">
            <span>Robust</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">8L</span>
          </Link>
        </nav>

        {/* Right GitHub icon & Get Started button */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ScrollCraft/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ScrollCraft GitHub Repository"
            className="text-zinc-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <Link
            href="/docs"
            className="px-4 py-2 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>

      </div>
    </header>
  );
}

