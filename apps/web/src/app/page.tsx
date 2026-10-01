import type { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';

import { 
  Navbar,
  HeroSection,
  Footer,
} from '@/components/home/v4';

// Code-split below-the-fold sections for instant initial render
const TextRevealSection = dynamic(
  () => import('@/components/home/v4/02-text-reveal-section').then((m) => m.TextRevealSection)
);
const PrimitivesShowcase = dynamic(
  () => import('@/components/home/v4/02-primitives-showcase').then((m) => m.PrimitivesShowcase)
);
const StackedCardsSection = dynamic(
  () => import('@/components/home/v4/03-stacked-cards-section').then((m) => m.StackedCardsSection)
);
const ScrollDrawSection = dynamic(
  () => import('@/components/home/v4/04-scroll-draw-section').then((m) => m.ScrollDrawSection)
);
const HooksDeveloperSection = dynamic(
  () => import('@/components/home/v4/04-hooks-developer').then((m) => m.HooksDeveloperSection)
);
const CorePrinciplesSection = dynamic(
  () => import('@/components/home/v4/05-core-principles').then((m) => m.CorePrinciplesSection)
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
    <div className="scrollcraft relative w-full min-h-screen bg-ink text-paper overflow-x-clip selection:bg-lime selection:text-ink font-body antialiased">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-lime focus:text-ink focus:font-bold focus:rounded-md focus:outline-none font-mono text-xs shadow-lg transition-all"
      >
        Skip to main content
      </a>

      {/* Brutalist Header & Top Progress */}
      <Navbar />
      
      <main id="main-content" className="flex flex-col w-full items-center justify-start">
        {/* Section 1: Hero & Kinetic Stage */}
        <HeroSection />

        {/* Section 2: Kinetic Typography Scrub (<TextReveal /> Dogfood) */}
        <TextRevealSection />

        {/* Section 3: Three Core Primitives Showcase (<Parallax />, <Reveal />, <Pin />) */}
        <PrimitivesShowcase />

        {/* Section 4: Physical Stacked Cards Runway (<StackedCards /> Dogfood) */}
        <StackedCardsSection />

        {/* Section 5: Real-Time Vector Architectural Circuit (<ScrollDraw /> Dogfood) */}
        <ScrollDrawSection />

        {/* Section 6: Headless Reactive Hooks Studio */}
        <HooksDeveloperSection />

        {/* Section 7: Core Engineering Principles & Specifications */}
        <CorePrinciplesSection />

        {/* Section 8: Scroll Momentum Velocity Marquee Ticker */}
        <MomentumStripSection />

        {/* Section 9: Production Sizing & Onboarding Banner */}
        <FinalCTASection />
      </main>

      {/* Brutalist Footer */}
      <Footer />
    </div>
  );
}
