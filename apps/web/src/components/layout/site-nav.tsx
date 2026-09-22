'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollCraft, ScrollMetrics } from '@scrollcraft/react';
import { ScrollCraftLogo } from '@/components/ui/scrollcraft-logo';
import { GithubIcon } from '@/components/ui/social-icons';
import { Menu, X, MessageSquare } from 'lucide-react';

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
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
  { href: '/showcase', label: 'Showcase' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/test', label: 'Test Lab', badge: '25' },
  { href: '/robust-testing', label: 'Robust Testing', badge: '21 Cards' },
];

export function SiteNav({
  extraActions,
  variant = 'sticky',
  maxWidth = 'max-w-7xl',
  onMobileMenuToggle,
}: SiteNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useScrollCraft();

  useEffect(() => {
    let wasScrolled: boolean | null = null;
    const unsub = subscribe((metrics: ScrollMetrics) => {
      const isScrolled = metrics.scroll > 20;
      if (isScrolled === wasScrolled) return;
      wasScrolled = isScrolled;

      if (bgRef.current) {
        bgRef.current.style.opacity = isScrolled ? '1' : variant === 'floating' ? '0' : '1';
      }
    });
    return () => unsub();
  }, [subscribe, variant]);

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
    <header
      className={`w-full z-50 ${
        variant === 'floating'
          ? 'fixed top-0 left-0 right-0 h-20 flex items-center'
          : 'sticky top-0 h-16 flex items-center border-b border-zinc-800/80 bg-[#050505]/95 backdrop-blur-md'
      }`}
    >
      {/* Isolated GPU Composited Background Layer for Floating Navbar */}
      {variant === 'floating' && (
        <div
          ref={bgRef}
          aria-hidden="true"
          style={{ opacity: 0, willChange: 'opacity' }}
          className="absolute inset-0 -z-10 glass-surface border-b border-white/10 shadow-2xl transition-opacity duration-200 pointer-events-none"
        />
      )}

      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between relative`}>
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <ScrollCraftLogo variant="badge" badgeText="Beta" size="sm" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-zinc-900 text-white font-semibold border border-zinc-800 shadow-xs'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono font-semibold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {extraActions}

          {/* Discord Community Link */}
          <a
            href="https://discord.gg/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ScrollCraft Discord Community"
            className="hidden sm:flex p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/ScrollCraft/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ScrollCraft GitHub Repository"
            className="p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Get Started / Read Docs CTA Button */}
          {pathname !== '/docs' && (
            <Link
              href="/docs"
              className="hidden sm:inline-flex px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-xs"
            >
              Get Started
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#070709] border-b border-zinc-800/90 shadow-2xl p-5 z-50 flex flex-col gap-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1 px-3">
            Navigation
          </div>
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                  active
                    ? 'bg-zinc-900 text-white font-semibold border border-zinc-800'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono font-semibold">
                    {link.badge} units
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-zinc-800/80 flex items-center justify-between px-2 text-xs font-mono text-zinc-400">
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://discord.gg/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discord</span>
            </a>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded-full bg-white text-black font-sans font-semibold text-xs hover:bg-zinc-200 transition-colors"
            >
              Get Started &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
