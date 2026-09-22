'use client';

import React from 'react';
import {
  ParallaxDemoStage,
  RevealDemoStage,
  PinDemoStage,
  ScrollProgressDemoStage,
  ScrollTransformDemoStage,
  ScrollDrawDemoStage,
} from './demos/primitives-demos';
import {
  StackedCardsDemoStage,
  VelocityMarqueeDemoStage,
  HorizontalScrollDemoStage,
  ScrollSequenceDemoStage,
  TextRevealDemoStage,
  MagneticDemoStage,
  SkewGalleryDemoStage,
} from './demos/components-demos';
import {
  HeadlessParallaxDemoStage,
  HeadlessRevealDemoStage,
  HeadlessPinDemoStage,
  HeadlessProgressDemoStage,
  HeadlessTransformDemoStage,
  HeadlessDrawDemoStage,
  HeadlessMagneticDemoStage,
  TimelineChoreographyDemoStage,
  AutoHideHeaderDemoStage,
  HighPrecisionTickerDemoStage,
  ZeroRerenderAuditDemoStage,
  RouteRestorationDemoStage,
  EngineMetricsDemoStage,
} from './demos/hooks-demos';

interface StageDispatcherProps {
  slug: string;
  knobs: Record<string, any>;
}

export const TestStageDispatcher: React.FC<StageDispatcherProps> = ({ slug, knobs }) => {
  switch (slug) {
    // Primitives
    case 'parallax':
      return <ParallaxDemoStage knobs={knobs} />;
    case 'reveal':
      return <RevealDemoStage knobs={knobs} />;
    case 'pin':
      return <PinDemoStage knobs={knobs} />;
    case 'scroll-progress':
      return <ScrollProgressDemoStage knobs={knobs} />;
    case 'scroll-transform':
      return <ScrollTransformDemoStage knobs={knobs} />;
    case 'scroll-draw':
      return <ScrollDrawDemoStage knobs={knobs} />;

    // Components
    case 'stacked-cards':
      return <StackedCardsDemoStage knobs={knobs} />;
    case 'velocity-marquee':
      return <VelocityMarqueeDemoStage knobs={knobs} />;
    case 'horizontal-scroll':
      return <HorizontalScrollDemoStage knobs={knobs} />;
    case 'scroll-sequence':
      return <ScrollSequenceDemoStage knobs={knobs} />;
    case 'text-reveal':
      return <TextRevealDemoStage knobs={knobs} />;
    case 'magnetic':
      return <MagneticDemoStage knobs={knobs} />;
    case 'skew-gallery':
      return <SkewGalleryDemoStage knobs={knobs} />;

    // Hooks
    case 'use-parallax':
      return <HeadlessParallaxDemoStage knobs={knobs} />;
    case 'use-reveal':
      return <HeadlessRevealDemoStage knobs={knobs} />;
    case 'use-pin':
      return <HeadlessPinDemoStage knobs={knobs} />;
    case 'use-scroll-progress':
      return <HeadlessProgressDemoStage knobs={knobs} />;
    case 'use-scroll-transform':
      return <HeadlessTransformDemoStage knobs={knobs} />;
    case 'use-scroll-draw':
      return <HeadlessDrawDemoStage knobs={knobs} />;
    case 'use-magnetic':
      return <HeadlessMagneticDemoStage knobs={knobs} />;
    case 'use-scroll-timeline':
      return <TimelineChoreographyDemoStage knobs={knobs} />;
    case 'use-scroll-direction':
      return <AutoHideHeaderDemoStage knobs={knobs} />;
    case 'use-ticker':
      return <HighPrecisionTickerDemoStage knobs={knobs} />;
    case 'use-render-tracker':
      return <ZeroRerenderAuditDemoStage knobs={knobs} />;
    case 'use-scroll-restoration':
      return <RouteRestorationDemoStage knobs={knobs} />;
    case 'use-scroll-craft':
      return <EngineMetricsDemoStage knobs={knobs} />;

    case 'robust':
      return (
        <div className="py-16 text-center space-y-6">
          <div className="max-w-md mx-auto p-8 rounded-3xl border border-emerald-500/30 bg-[#09090d] space-y-4">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">8-Layer Hardening Laboratory</span>
            <h4 className="text-xl font-bold text-white">Full Interactive Test Suite Available</h4>
            <p className="text-xs text-zinc-400">
              Explore the dedicated full-screen interactive test laboratory with real-time adversarial fuzzing, 50ms chaos loops, and 200-solver memory soak.
            </p>
            <a
              href="/test/robust"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all"
            >
              <span>Launch Fullscreen Robustness Lab &rarr;</span>
            </a>
          </div>
        </div>
      );

    default:
      return (
        <div className="py-24 text-center text-zinc-500 font-mono text-sm">
          Stage not found for slug: {slug}
        </div>
      );
  }
};
