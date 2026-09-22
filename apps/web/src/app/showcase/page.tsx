import type { Metadata } from 'next';
import React from 'react';
import { ShowcaseHub } from '@/components/showcase/showcase-hub';
import { SiteNav } from '@/components/layout/site-nav';

export const metadata: Metadata = {
  title: 'Showcase — You Build. We Showcase. | ScrollCraft',
  description:
    'A curated exhibition of physics-driven, high-framerate web experiences powered by ScrollCraft. Pure visual proof of declarative scroll performance.',
};

export default function ShowcasePage() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-white">
      {/* Unified Site Navigation */}
      <SiteNav />

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
