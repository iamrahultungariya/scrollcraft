import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ShowcaseHub } from '@/components/showcase/showcase-hub';
import { GithubIcon } from '@/components/ui/social-icons';
import { ScrollCraftLogo } from '@/components/ui/scrollcraft-logo';

export const metadata: Metadata = {
  title: 'Showcase — You Build. We Showcase. | ScrollCraft',
  description:
    'A curated exhibition of physics-driven, high-framerate web experiences powered by ScrollCraft. Pure visual proof of declarative scroll performance.',
};

export default function ShowcasePage() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-white">
      {/* Top Sticky Header */}
      <header className="w-full border-b border-zinc-800/80 bg-[#050505]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <ScrollCraftLogo variant="badge" badgeText="Beta" size="sm" />
            </Link>

            <nav className="hidden md:flex items-center gap-2 text-xs font-medium">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/docs"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Docs
              </Link>
              <Link
                href="/showcase"
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-semibold border border-zinc-800 shadow-xs"
              >
                Showcase
              </Link>
              <Link
                href="/roadmap"
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                Roadmap
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <Link
              href="/docs"
              className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Read Docs</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Showcase View */}
      <main className="flex-1">
        <ShowcaseHub />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500 bg-[#050505]">
        <p>&copy; {new Date().getFullYear()} ScrollCraft. Designed for the high-performance web.</p>
      </footer>
    </div>
  );
}
