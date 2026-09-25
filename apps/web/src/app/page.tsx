import type { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';

import { 
  Navbar,
  HeroSection,
  PrimitivesShowcase,
  Footer,
} from '@/components/home/v4';

// Code-split below-the-fold sections for instant initial render
const PinnedEngineSection = dynamic(
  () => import('@/components/home/v4/03-pinned-engine').then((m) => m.PinnedEngineSection)
);
const HooksDeveloperSection = dynamic(
  () => import('@/components/home/v4/04-hooks-developer').then((m) => m.HooksDeveloperSection)
);
const BenchmarksSection = dynamic(
  () => import('@/components/home/v4/05-benchmarks').then((m) => m.BenchmarksSection)
);
const MomentumStripSection = dynamic(
  () => import('@/components/home/v4/06-momentum-strip').then((m) => m.MomentumStripSection)
);
const FinalCTASection = dynamic(
  () => import('@/components/home/v4/07-final-cta').then((m) => m.FinalCTASection)
);

export const metadata: Metadata = {
  title: 'ScrollCraft — The Zero-VDOM Scroll Engine for React',
  description: 'Composable primitives and low-level reactive hooks for parallax, reveals, pins, and scroll timelines with zero React re-renders.',
};

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] text-[#e4e4e7] overflow-x-clip selection:bg-[#1c1c1e] selection:text-white font-sans antialiased">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-800 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 font-medium text-xs shadow-lg transition-all"
      >
        Skip to main content
      </a>

      <Navbar />
      
      <main id="main-content" className="flex flex-col w-full items-center justify-start">
        {/* Section 1: Hero with 3D Spatial Multi-Plane Stage & Logo Cloud */}
        <HeroSection />

        {/* Section 2: Declarative Primitives Showcase */}
        <PrimitivesShowcase />

        {/* Section 3: 4-Phase Game Engine Loop (Dogfooded via <Pin />) */}
        <PinnedEngineSection />

        {/* Section 4: Headless Reactive Hooks & Live Telemetry */}
        <HooksDeveloperSection />

        {/* Section 5: Head-to-Head Architecture Benchmarks */}
        <BenchmarksSection />

        {/* Section 6: Scroll Momentum Velocity Marquee Ticker */}
        <MomentumStripSection />

        {/* Section 7: Final Production CTA & Test Lab */}
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
