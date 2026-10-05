'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Sparkles, Compass } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'HOME',
    href: '/',
    icon: Home,
    isActive: (p) => p === '/',
  },
  {
    label: 'DOCS',
    href: '/docs',
    icon: BookOpen,
    isActive: (p) => p.startsWith('/docs'),
  },
  {
    label: 'SHOWCASE',
    href: '/showcase',
    icon: Sparkles,
    isActive: (p) => p.startsWith('/showcase'),
  },
  {
    label: 'TEST LAB',
    href: '/test',
    icon: Compass,
    isActive: (p) => p.startsWith('/test'),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-bg border-t border-line-soft pb-[calc(env(safe-area-inset-bottom,0px)+0.4rem)] pt-1 px-3 select-none font-mono"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 items-center">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 border transition-colors cursor-pointer ${
                active
                  ? 'border-accent bg-accent text-black font-bold'
                  : 'border-transparent text-muted hover:text-fg hover:border-line-soft'
              }`}
            >
              {/* Icon Container */}
              <div className="flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>

              {/* Text Label */}
              <span className="text-[10px] uppercase tracking-wider mt-1 truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
