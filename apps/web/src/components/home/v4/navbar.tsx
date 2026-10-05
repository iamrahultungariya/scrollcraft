'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollProgress } from '@scrollcraft/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { GithubIcon } from '@/components/ui/social-icons';

const NAV_LINKS = [
  { href: '/docs', label: 'DOCS' },
  { href: '/showcase', label: 'SHOWCASE' },
  { href: '/test', label: 'TEST LAB', badge: '25' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 3px Accent Linear Scrub Progress Bar */}
      <ScrollProgress className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[100] origin-left pointer-events-none" />

      <header className="sticky top-0 z-50 border-b-2 border-line bg-bg">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-10">
          {/* Logo Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-sm sm:text-base font-black uppercase tracking-tight text-fg hover:opacity-90 transition-opacity shrink-0"
            aria-label="ScrollCraft home"
          >
            SCROLL CRAFT <span className="w-2 h-2 bg-accent inline-block shrink-0" />
          </Link>

          {/* Desktop Navigation - Direct Page Routes */}
          <nav
            className="hidden items-center gap-2 font-mono text-xs uppercase tracking-wider md:flex"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 border-2 transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider ${
                    active
                      ? 'bg-accent text-black border-line shadow-rest'
                      : 'border-transparent text-muted hover:text-black hover:bg-fg hover:border-line'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 border border-line bg-bg text-accent font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="hidden sm:flex h-10 w-10 items-center justify-center border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <GithubIcon className="size-4" />
            </a>

            <Link
              href="/docs"
              className="group inline-flex items-center gap-1.5 h-10 px-4 border-2 border-line bg-accent text-black font-mono text-xs font-bold uppercase shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <span>GET STARTED</span>
              <ArrowRight className="size-3.5 transition-transform duration-120 group-hover:translate-x-0.5" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden h-10 w-10 flex items-center justify-center border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black transition-all shadow-rest cursor-pointer"
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b-2 border-line bg-bg px-5 py-4 flex flex-col gap-2 shadow-rest">
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted mb-1 px-1 font-bold">
              NAVIGATION
            </div>
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 border-2 font-mono text-xs uppercase tracking-wider transition-colors font-bold ${
                    active
                      ? 'bg-accent text-black border-line'
                      : 'border-line-soft text-fg hover:bg-fg hover:text-black'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 border border-line bg-bg text-accent font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t-2 border-line-soft flex items-center justify-between px-1">
              <a
                href="https://github.com/ScrollCraft/scrollcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-fg hover:text-accent transition-colors"
              >
                <GithubIcon className="size-4" />
                <span>GITHUB</span>
              </a>
              <Link
                href="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 px-3 flex items-center border-2 border-line bg-accent text-black font-bold font-mono text-xs shadow-rest"
              >
                GET STARTED →
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
