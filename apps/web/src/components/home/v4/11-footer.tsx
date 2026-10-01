'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const NAV_COLS = [
  {
    heading: 'Product',
    links: [
      { href: '/docs', label: 'Documentation' },
      { href: '/showcase', label: 'Showcase' },
      { href: '/roadmap', label: 'Roadmap' },
      { href: '/test', label: 'Test Lab (25 Demos)' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { href: 'https://discord.gg/scrollcraft', label: 'Discord', external: true },
      { href: 'https://github.com/ScrollCraft/scrollcraft', label: 'GitHub', external: true },
      { href: 'https://twitter.com/scrollcraft', label: 'Twitter', external: true },
    ],
  },
  {
    heading: 'Engine Specs',
    links: [
      { href: '/docs#architecture', label: '4-Phase Game Loop' },
      { href: '/docs#hooks', label: 'Reactive Hooks' },
      { href: 'https://github.com/ScrollCraft/scrollcraft/blob/main/LICENSE', label: 'MIT License', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-ink border-t border-paper/10 text-paper">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
        
        {/* Main Footer Row */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-[1.2fr_auto] gap-12 border-b border-paper/10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-lg font-bold uppercase tracking-tight text-paper"
            >
              Scroll<span className="text-lime">Craft</span>
              <span className="size-2 bg-lime inline-block" />
            </Link>
            <p className="mt-4 text-xs sm:text-sm text-paper/50 max-w-sm leading-relaxed font-body">
              The zero-VDOM React scroll engine. Direct hardware GPU matrix transforms with native compositor thread lock.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-paper/40">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-lime" />
                FRAME BUDGET LOCKED
              </span>
              <span>&bull;</span>
              <span>100% TREE-SHAKABLE</span>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="flex flex-wrap gap-12 sm:gap-16">
            {NAV_COLS.map((col) => (
              <div key={col.heading}>
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/40 mb-4 font-bold">
                  {col.heading}
                </div>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((link) =>
                    'external' in link && link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-paper/60 hover:text-paper hover:underline transition-colors font-mono inline-flex items-center gap-1"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="size-2.5 opacity-60" />
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-xs text-paper/60 hover:text-paper hover:underline transition-colors font-mono"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[0.62rem] uppercase tracking-widest text-paper/40">
          <span>&copy; {new Date().getFullYear()} ScrollCraft. Built for the frame budget.</span>
          <span>Zero VDOM diffs &bull; Pure compositor motion</span>
        </div>

      </div>
    </footer>
  );
}
