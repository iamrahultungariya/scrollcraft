import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ShowcaseHub } from '@/components/showcase/showcase-hub';
import { SiteNav } from '@/components/layout/site-nav';

export const metadata: Metadata = {
  title: 'Showcase — You Build. We Showcase. | ScrollCraft',
  description:
    'A curated exhibition of hardware-accelerated, high-fidelity web experiences powered by ScrollCraft. Pure visual proof of declarative scroll performance with zero React re-renders.',
};

export default function ShowcasePage() {
  return (
    <div className="w-full min-h-screen bg-bg text-fg flex flex-col font-body selection:bg-accent selection:text-black">
      {/* Unified Site Navigation with Real Routes */}
      <SiteNav variant="sticky" maxWidth="max-w-[1536px]" />

      {/* Main Showcase View */}
      <main className="flex-1 w-full">
        <ShowcaseHub />
      </main>

      {/* Pure Brutalist Footer */}
      <footer className="w-full border-t border-line-soft py-8 sm:py-10 bg-bg text-xs font-mono text-muted">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-fg font-bold uppercase">
            <span>SCROLL CRAFT</span>
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            <span className="text-muted font-normal text-[11px]">&copy; {new Date().getFullYear()} MIT LICENSED</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs uppercase font-bold">
            <Link href="/" className="hover:text-accent transition-colors">HOME</Link>
            <Link href="/docs" className="hover:text-accent transition-colors">DOCS</Link>
            <Link href="/showcase" className="text-accent underline underline-offset-4">SHOWCASE</Link>
            <Link href="/test" className="hover:text-accent transition-colors">TEST LAB</Link>
            <a
              href="https://github.com/ScrollCraft/scrollcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              GITHUB ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
