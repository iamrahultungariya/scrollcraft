'use client';

import React from 'react';
import Link from 'next/link';
import { ScrollCraftEmblem } from '@/components/ui/scrollcraft-logo';

export function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-12 pb-28 md:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2.5">
            <ScrollCraftEmblem size={24} />
            <span className="text-xl font-bold text-white tracking-tight">ScrollCraft</span>
          </Link>
          <p className="text-sm text-zinc-500">
            The declarative React scroll engine.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-8 text-sm font-medium text-zinc-400">
          <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
          <Link href="/showcase" className="hover:text-white transition-colors">Showcase</Link>
          <Link href="/roadmap" className="hover:text-white transition-colors">Roadmap</Link>
          <Link href="/test" className="hover:text-white transition-colors">Test Lab</Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a
            href="https://discord.gg/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Discord
          </a>
          <a
            href="https://github.com/ScrollCraft/scrollcraft"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            GitHub
          </a>
        </div>
        
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 text-xs text-zinc-600">
        <span>&copy; {new Date().getFullYear()} ScrollCraft (v0.2.0 Beta). MIT Licensed. Physics inspired by Studio Freight&apos;s Lenis.</span>
        <span>Make the web move.</span>
      </div>
    </footer>
  );
}
