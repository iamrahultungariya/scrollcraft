'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Sparkles, Compass, Sliders } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    isActive: (p) => p === '/',
    color: '#8b5cf6',
  },
  {
    label: 'Docs',
    href: '/docs',
    icon: BookOpen,
    isActive: (p) => p.startsWith('/docs'),
    color: '#a855f7',
  },
  {
    label: 'Showcase',
    href: '/showcase',
    icon: Sparkles,
    isActive: (p) => p.startsWith('/showcase'),
    color: '#ec4899',
  },
  {
    label: 'Test Lab',
    href: '/test',
    icon: Compass,
    isActive: (p) => p.startsWith('/test') && !p.startsWith('/test/robust'),
    color: '#06b6d4',
  },
  {
    label: 'Robust',
    href: '/test/robust',
    icon: Sliders,
    isActive: (p) => p.startsWith('/test/robust') || p.startsWith('/robust'),
    color: '#10b981',
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[calc(env(safe-area-inset-bottom,0px)+0.4rem)] pt-1.5 px-2 select-none"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 relative group ${
                active
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              {/* Active Ambient Glow */}
              {active && (
                <span
                  className="absolute inset-x-2 top-0.5 h-full rounded-xl opacity-20 blur-md pointer-events-none"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
              )}

              {/* Icon Container */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  active
                    ? 'scale-110 shadow-sm'
                    : 'group-hover:scale-105'
                }`}
                style={
                  active
                    ? {
                        backgroundColor: `${item.color}25`,
                        color: item.color,
                        border: `1px solid ${item.color}40`,
                      }
                    : undefined
                }
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Text Label */}
              <span
                className={`text-[10px] font-mono tracking-tight mt-1 transition-colors ${
                  active ? 'font-bold' : 'font-medium text-zinc-500'
                }`}
                style={active ? { color: item.color } : undefined}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
