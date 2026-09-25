'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { href: '/test/robust', label: 'Robust Testing', badge: '21 Cards' },
];

export function SiteNav({
  extraActions,
  variant = 'sticky',
  maxWidth = 'max-w-7xl',
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
    <header
      className={`w-full z-50 ${
        variant === 'floating'
          ? 'fixed top-0 left-0 right-0 h-14 flex items-center bg-[#0a0a0a]/98 backdrop-blur-sm border-b border-[#1c1c1e]'
          : 'sticky top-0 h-14 flex items-center bg-[#0a0a0a]/98 backdrop-blur-sm border-b border-[#1c1c1e]'
      }`}
    >

      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between relative`}>
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <ScrollCraftLogo variant="badge" badgeText="Beta" size="sm" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-0.5 text-xs font-medium">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#111113] text-white border border-[#2a2a2e]'
                      : 'text-[#71717a] hover:text-white hover:bg-[#111113]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1c1c1e] text-[#71717a] border border-[#2a2a2e] font-mono">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          {extraActions}

          {/* Discord Community Link */}
          <a
            href="https://discord.gg/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ScrollCraft Discord Community"
            className="hidden sm:flex p-1.5 rounded border border-[#1c1c1e] hover:border-[#2a2a2e] text-[#52525b] hover:text-[#a1a1aa] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/ScrollCraft/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ScrollCraft GitHub Repository"
            className="p-1.5 rounded border border-[#1c1c1e] hover:border-[#2a2a2e] text-[#52525b] hover:text-[#a1a1aa] transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>

          {/* Get Started CTA Button */}
          {pathname !== '/docs' && (
            <Link
              href="/docs"
              className="hidden sm:inline-flex px-4 py-1.5 rounded bg-white text-black text-xs font-semibold hover:bg-[#e4e4e7] transition-colors"
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
            className="md:hidden p-1.5 rounded border border-[#1c1c1e] hover:border-[#2a2a2e] text-[#71717a] hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-[#0a0a0a] border-b border-[#1c1c1e] p-4 z-50 flex flex-col gap-1">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#52525b] mb-2 px-3">
            Navigation
          </div>
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded text-sm font-medium flex items-center justify-between transition-colors ${
                  active
                    ? 'bg-[#111113] text-white border border-[#2a2a2e]'
                    : 'text-[#71717a] hover:text-white hover:bg-[#111113]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1c1c1e] text-[#52525b] border border-[#2a2a2e] font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-[#1c1c1e] flex items-center justify-between px-1 text-xs font-mono text-[#52525b]">
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
              className="px-3 py-1.5 rounded bg-white text-black font-semibold text-xs hover:bg-[#e4e4e7] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
