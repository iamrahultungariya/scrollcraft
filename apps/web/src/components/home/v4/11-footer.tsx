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
      { href: '/test', label: 'Test Lab' },
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
    heading: 'Legal',
    links: [
      { href: '#', label: 'MIT License' },
      { href: '#', label: 'Privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-[#1c1c1e]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 border-b border-[#1c1c1e]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <ScrollCraftEmblem size={22} />
              <span className="text-base font-bold text-white tracking-tight">ScrollCraft</span>
            </Link>
            <p className="text-sm text-[#52525b] max-w-xs leading-[1.7] font-sans">
              The declarative React scroll engine. Zero VDOM re-renders. 120 FPS native GPU sync.
            </p>
          </div>

          {/* Nav columns */}
          <div className="flex flex-wrap gap-12">
            {NAV_COLS.map((col) => (
              <div key={col.heading}>
                <div className="text-[10px] font-mono text-[#52525b] uppercase tracking-[0.18em] mb-4">
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
                        className="text-sm text-[#71717a] hover:text-white transition-colors font-sans"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm text-[#71717a] hover:text-white transition-colors font-sans"
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
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#3f3f46] font-mono">
          <span>&copy; {new Date().getFullYear()} ScrollCraft (v0.2.0 Beta). MIT Licensed.</span>
          <span>Make the web move.</span>
        </div>
      </div>
    </footer>
  );
}
