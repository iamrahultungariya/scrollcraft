'use client';

import React from 'react';
import Link from 'next/link';
import { ScrollCraftEmblem } from '@/components/ui/scrollcraft-logo';

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
    <footer className="w-full bg-[#09090b] border-t border-[#1c1c1f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 border-b border-[#1c1c1f]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <ScrollCraftEmblem size={22} />
              <span className="text-base font-bold text-[#fafafa] tracking-tight">ScrollCraft</span>
            </Link>
            <p className="text-sm text-[#71717a] max-w-xs leading-[1.7] font-sans">
              The zero-VDOM React scroll engine. Direct hardware GPU matrix transforms with 120 FPS native display lock.
            </p>
          </div>

          {/* Nav columns */}
          <div className="flex flex-wrap gap-14">
            {NAV_COLS.map((col) => (
              <div key={col.heading}>
                <div className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.18em] mb-4">
                  {col.heading}
                </div>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) =>
                    'external' in link && link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#a1a1aa] hover:text-[#fafafa] transition-colors font-sans"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-xs text-[#a1a1aa] hover:text-[#fafafa] transition-colors font-sans"
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

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#71717a] font-mono">
          <span>&copy; {new Date().getFullYear()} ScrollCraft (v0.2.0 Beta). MIT Licensed.</span>
          <span>Zero VDOM diffs. Pure compositor motion.</span>
        </div>
      </div>
    </footer>
  );
}
