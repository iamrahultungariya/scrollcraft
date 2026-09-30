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
const StackedCardsSection = dynamic(
  () => import('@/components/home/v4/03-stacked-cards-section').then((m) => m.StackedCardsSection)
);
const ScrollDrawSection = dynamic(
  () => import('@/components/home/v4/04-scroll-draw-section').then((m) => m.ScrollDrawSection)
);
const CorePrinciplesSection = dynamic(
  () => import('@/components/home/v4/05-core-principles').then((m) => m.CorePrinciplesSection)
);
const PrimitivesShowcase = dynamic(
  () => import('@/components/home/v4/02-primitives-showcase').then((m) => m.PrimitivesShowcase)
);
const HooksDeveloperSection = dynamic(
  () => import('@/components/home/v4/04-hooks-developer').then((m) => m.HooksDeveloperSection)
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
    <div className="relative w-full min-h-screen bg-[#09090b] text-[#fafafa] overflow-x-clip selection:bg-[#18181b] selection:text-white font-sans antialiased">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#18181b] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] font-medium text-xs shadow-lg transition-all"
      >
        Skip to main content
      </a>

      <Navbar />
      
      <main id="main-content" className="flex flex-col w-full items-center justify-start">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Kinetic Typography Scrub (<TextReveal /> Dogfood) */}
        <TextRevealSection />

        {/* Section 3: Physical Stacked Cards Runway (<StackedCards /> Dogfood) */}
        <StackedCardsSection />

        {/* Section 4: Real-Time Vector Architectural Blueprint (<ScrollDraw /> Dogfood) */}
        <ScrollDrawSection />

        {/* Section 5: Core Engineering Principles & Specifications */}
        <CorePrinciplesSection />

        {/* Section 6: Declarative Primitives Showcase */}
        <PrimitivesShowcase />

        {/* Section 7: Headless Reactive Hooks Studio */}
        <HooksDeveloperSection />

        {/* Section 8: Scroll Momentum Velocity Marquee Ticker */}
        <MomentumStripSection />

        {/* Section 9: Final Production CTA & Test Lab */}
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
