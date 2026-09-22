'use client';

import React from 'react';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsCallout } from '../docs-callout';

interface DocRecipesProps {
  recipeId: string;
}

const STICKY_REACT = `import React from 'react';
import { Pin, PinContainer, Reveal } from '@scrollcraft/react';

const CHAPTERS = [
  { step: '01', title: 'Compositor Acceleration', desc: 'Direct GPU transforms bypass React virtual DOM diffing.' },
  { step: '02', title: 'Subpixel Lerping', desc: 'Normalized inertia algorithm delivers locked 120 FPS frame consistency.' },
  { step: '03', title: 'Native Sticky Pinning', desc: 'Zero DOM spacers or layout disruptions inside complex CSS grid containers.' },
];

export function StickyNarrative() {
  return (
    <PinContainer className="h-[300vh]">
      <Pin asChild start="top top" end="+=100%">
        <section className="h-screen w-full flex items-center justify-center bg-[#070709] p-6">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Sticky Headline */}
            <div>
              <span className="text-xs font-mono font-bold text-violet-400 uppercase">Architecture</span>
              <h2 className="text-4xl font-extrabold text-white mt-2">Built for Performance</h2>
            </div>

            {/* Right: Sequenced Kinetic Cards */}
            <div className="space-y-4">
              {CHAPTERS.map((chap) => (
                <Reveal key={chap.step} direction="up" duration={0.5}>
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                    <span className="text-xs font-mono font-bold text-violet-400">{chap.step}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{chap.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{chap.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Pin>
    </PinContainer>
  );
}`;

const STICKY_NEXT = `'use client';

import React from 'react';
import { Pin, PinContainer, Reveal } from '@scrollcraft/react';

const CHAPTERS = [
  { step: '01', title: 'Compositor Acceleration', desc: 'Direct GPU transforms bypass React virtual DOM diffing.' },
  { step: '02', title: 'Subpixel Lerping', desc: 'Normalized inertia algorithm delivers locked 120 FPS frame consistency.' },
  { step: '03', title: 'Native Sticky Pinning', desc: 'Zero DOM spacers or layout disruptions inside complex CSS grid containers.' },
];

export function StickyNarrative() {
  return (
    <PinContainer className="h-[300vh]">
      <Pin asChild start="top top" end="+=100%">
        <section className="h-screen w-full flex items-center justify-center bg-[#070709] p-6">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono font-bold text-violet-400 uppercase">Architecture</span>
              <h2 className="text-4xl font-extrabold text-white mt-2">Built for Performance</h2>
            </div>

            <div className="space-y-4">
              {CHAPTERS.map((chap) => (
                <Reveal key={chap.step} direction="up" duration={0.5}>
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                    <span className="text-xs font-mono font-bold text-violet-400">{chap.step}</span>
                    <h3 className="text-lg font-bold text-white mt-1">{chap.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{chap.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Pin>
    </PinContainer>
  );
}`;

const HORIZONTAL_REACT = `import React from 'react';
import { HorizontalScroll } from '@scrollcraft/react';

export function HorizontalShowcase() {
  return (
    <HorizontalScroll speed={2.5} className="bg-black">
      <div className="flex gap-8 items-center h-screen px-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[450px] h-[320px] rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl flex flex-col justify-between">
            <span className="text-xs font-mono text-violet-400 font-bold">STAGE 0{i}</span>
            <h3 className="text-2xl font-bold text-white">Full Compositor Pinning</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Maps vertical page scroll budget to horizontal translation matrix without layout thrashing.
            </p>
          </div>
        ))}
      </div>
    </HorizontalScroll>
  );
}`;

const HORIZONTAL_NEXT = `'use client';

import React from 'react';
import { HorizontalScroll } from '@scrollcraft/react';

export function HorizontalShowcase() {
  return (
    <HorizontalScroll speed={2.5} className="bg-black">
      <div className="flex gap-8 items-center h-screen px-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[450px] h-[320px] rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl flex flex-col justify-between">
            <span className="text-xs font-mono text-violet-400 font-bold">STAGE 0{i}</span>
            <h3 className="text-2xl font-bold text-white">Full Compositor Pinning</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Maps vertical page scroll budget to horizontal translation matrix without layout thrashing.
            </p>
          </div>
        ))}
      </div>
    </HorizontalScroll>
  );
}`;

export const DocRecipes: React.FC<DocRecipesProps> = ({ recipeId }) => {
  if (recipeId === 'recipe-sticky-narrative') {
    return (
      <div className="flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono font-semibold text-violet-300 uppercase tracking-widest w-fit">
            PRODUCTION RECIPES
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] break-words">
            Sticky Narrative Cards
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl font-normal">
            A full-page pinned narrative pattern where sticky headlines remain locked in place while content cards sequence into view.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white break-words">
            Implementation Pattern
          </h2>
          <CodeViewer
            tabs={[
              { label: 'React', code: STICKY_REACT, fileName: 'src/StickyNarrative.tsx' },
              { label: 'Next.js', code: STICKY_NEXT, fileName: 'app/components/StickyNarrative.tsx' },
            ]}
          />
        </section>

        <DocsCallout type="tip" title="Scroll Travel Budget">
          Adjust the container height (e.g. <code className="font-mono text-xs text-white">h-[300vh]</code>) to control how long the pin remains locked before naturally resuming page scroll.
        </DocsCallout>
      </div>
    );
  }

  // recipe-horizontal-scroll & 3d
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono font-semibold text-violet-300 uppercase tracking-widest w-fit">
          PRODUCTION RECIPES
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] break-words">
          Horizontal Gallery Scrub
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl font-normal">
          Convert vertical page scroll distance into seamless horizontal slide translation with zero layout shift.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white break-words">
          Implementation Pattern
        </h2>
        <CodeViewer
          tabs={[
            { label: 'React', code: HORIZONTAL_REACT, fileName: 'src/HorizontalShowcase.tsx' },
            { label: 'Next.js', code: HORIZONTAL_NEXT, fileName: 'app/components/HorizontalShowcase.tsx' },
          ]}
        />
      </section>
    </div>
  );
};
