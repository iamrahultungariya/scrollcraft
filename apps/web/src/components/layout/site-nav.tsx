'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollProgress } from '@scrollcraft/react';
import { GithubIcon } from '@/components/ui/social-icons';
import { Menu, X, ArrowRight } from 'lucide-react';

export interface SiteNavProps {
  /** Optional extra content on the right (e.g. search bar, sidebar toggle) */
  extraActions?: React.ReactNode;
  /** Whether the nav is fixed (hero style) or sticky (inner page style) */
  variant?: 'floating' | 'sticky';
  /** Optional custom container max-width */
  maxWidth?: string;
  /** Optional callback for mobile menu state change (e.g. for docs sidebar) */
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

const NAV_LINKS = [
  { href: '/docs', label: 'DOCS' },
  { href: '/showcase', label: 'SHOWCASE' },
  { href: '/test', label: 'TEST LAB', badge: '25' },
  { href: '/roadmap', label: 'ROADMAP' },
];

export function SiteNav({
  extraActions,
  variant = 'sticky',
  maxWidth = 'max-w-[1536px]',
  onMobileMenuToggle,
}: SiteNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    onMobileMenuToggle?.(false);
  }, [pathname, onMobileMenuToggle]);

  const toggleMobileMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    onMobileMenuToggle?.(nextState);
  };

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 3px Accent Linear Scrub Progress Bar */}
      <ScrollProgress className="fixed top-0 left-0 right-0 h-[3px] bg-accent z-[100] origin-left pointer-events-none" />

      <header
        className={`w-full z-50 bg-bg border-b-2 border-line ${
          variant === 'floating'
            ? 'fixed top-0 left-0 right-0 h-16 flex items-center'
            : 'sticky top-0 h-16 flex items-center'
        }`}
      >
        <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between relative`}>
          {/* Brand Wordmark & Desktop Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-sm sm:text-base font-black uppercase tracking-tight text-fg hover:opacity-90 transition-opacity shrink-0"
              aria-label="ScrollCraft home"
            >
              SCROLL CRAFT <span className="w-2 h-2 bg-accent inline-block shrink-0" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-mono">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-1.5 border-2 transition-all flex items-center gap-1.5 uppercase tracking-wider font-bold ${
                      active
                        ? 'bg-accent text-black border-line shadow-rest'
                        : 'border-transparent text-muted hover:text-black hover:bg-fg hover:border-line'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 border-2 border-line bg-bg text-accent font-mono font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions & Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            {extraActions}

            {/* GitHub Link */}
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ScrollCraft GitHub Repository"
              className="h-10 w-10 flex items-center justify-center border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {/* Get Started CTA Button */}
            {pathname !== '/docs' && (
              <Link
                href="/docs"
                className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 border-2 border-line font-mono text-xs font-bold uppercase transition-all bg-accent text-black shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden h-10 w-10 flex items-center justify-center border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black transition-all shadow-rest cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-bg border-b-2 border-line p-4 z-50 flex flex-col gap-2 shadow-rest">
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
                  className={`px-3 py-2.5 border-2 text-xs font-mono uppercase tracking-wider flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-accent text-black border-line font-bold'
                      : 'text-fg hover:bg-fg hover:text-black border-line-soft'
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

            <div className="pt-3 mt-2 border-t-2 border-line-soft flex items-center justify-between px-1 text-xs font-mono">
              <a
                href="https://github.com/ScrollCraft/scrollcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-fg hover:text-accent transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
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
