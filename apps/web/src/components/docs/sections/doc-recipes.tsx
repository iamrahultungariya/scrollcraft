'use client';

import React from 'react';
import Link from 'next/link';
import { CodeViewer } from '@/components/ui/code-viewer';
import { DocsCallout } from '../docs-callout';
import { ExternalLink } from 'lucide-react';

interface DocRecipesProps {
  recipeId: string;
}

const STICKY_REACT = `import React from 'react';
import { Pin, PinContainer, Reveal } from '@scrollcraft/react';

const CHAPTERS = [
  { step: '01', title: 'Compositor Acceleration', desc: 'Direct GPU transforms bypass React virtual DOM diffing.' },
  { step: '02', title: 'Subpixel Lerping', desc: 'Normalized inertia algorithm delivers silky smooth frame consistency.' },
  { step: '03', title: 'Native Sticky Pinning', desc: 'Zero DOM spacers or layout disruptions inside complex CSS grid containers.' },
];

export function StickyNarrative() {
  return (
    <PinContainer className="h-[300vh]">
      <Pin asChild start="top top" end="+=100%">
        <section className="h-screen w-full flex items-center justify-center bg-[#0C0F0C] p-6">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Sticky Headline */}
            <div>
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">Architecture</span>
              <h2 className="text-4xl font-black uppercase text-[#F4F1EA] mt-2">Built for Performance</h2>
            </div>

            {/* Right: Sequenced Kinetic Cards */}
            <div className="space-y-4">
              {CHAPTERS.map((chap) => (
                <Reveal key={chap.step} direction="up" duration={0.5}>
                  <div className="p-6 border-2 border-[#F4F1EA] bg-[#0C0F0C] shadow-[4px_4px_0px_#DFFF00]">
                    <span className="text-xs font-mono font-bold text-accent">{chap.step}</span>
                    <h3 className="text-lg font-bold text-[#F4F1EA] mt-1 uppercase">{chap.title}</h3>
                    <p className="text-xs text-[#A8ABA0] mt-1">{chap.desc}</p>
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
  { step: '02', title: 'Subpixel Lerping', desc: 'Normalized inertia algorithm delivers silky smooth frame consistency.' },
  { step: '03', title: 'Native Sticky Pinning', desc: 'Zero DOM spacers or layout disruptions inside complex CSS grid containers.' },
];

export function StickyNarrative() {
  return (
    <PinContainer className="h-[300vh]">
      <Pin asChild start="top top" end="+=100%">
        <section className="h-screen w-full flex items-center justify-center bg-[#0C0F0C] p-6">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">Architecture</span>
              <h2 className="text-4xl font-black uppercase text-[#F4F1EA] mt-2">Built for Performance</h2>
            </div>

            <div className="space-y-4">
              {CHAPTERS.map((chap) => (
                <Reveal key={chap.step} direction="up" duration={0.5}>
                  <div className="p-6 border-2 border-[#F4F1EA] bg-[#0C0F0C] shadow-[4px_4px_0px_#DFFF00]">
                    <span className="text-xs font-mono font-bold text-accent">{chap.step}</span>
                    <h3 className="text-lg font-bold text-[#F4F1EA] mt-1 uppercase">{chap.title}</h3>
                    <p className="text-xs text-[#A8ABA0] mt-1">{chap.desc}</p>
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
    <HorizontalScroll speed={2.5} className="bg-[#0C0F0C]">
      <div className="flex gap-8 items-center h-screen px-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[450px] h-[320px] border-2 border-[#F4F1EA] bg-[#0C0F0C] p-8 shadow-[6px_6px_0px_#DFFF00] flex flex-col justify-between">
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">STAGE 0{i}</span>
            <h3 className="text-2xl font-black uppercase text-[#F4F1EA]">Full Compositor Pinning</h3>
            <p className="text-[#A8ABA0] text-xs leading-relaxed">
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
    <HorizontalScroll speed={2.5} className="bg-[#0C0F0C]">
      <div className="flex gap-8 items-center h-screen px-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[450px] h-[320px] border-2 border-[#F4F1EA] bg-[#0C0F0C] p-8 shadow-[6px_6px_0px_#DFFF00] flex flex-col justify-between">
            <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">STAGE 0{i}</span>
            <h3 className="text-2xl font-black uppercase text-[#F4F1EA]">Full Compositor Pinning</h3>
            <p className="text-[#A8ABA0] text-xs leading-relaxed">
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
      <div className="flex flex-col gap-10 font-body not-prose">
        <header className="flex flex-col gap-3 border-b-2 border-line pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
              <span className="w-2 h-2 bg-accent inline-block" />
              <span>[RECIPE / PINNED NARRATIVE]</span>
            </div>

            <Link
              href="/test/pin"
              className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <span>TEST IN LAB</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
            Sticky Narrative Cards
          </h1>
          <p className="text-base text-fg/90 font-body leading-relaxed max-w-3xl">
            A full-page pinned narrative pattern where sticky headlines remain locked in place while content cards sequence into view.
          </p>
        </header>

        <section id="recipe-code" className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
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
          Adjust the container height (e.g. <code className="font-mono text-xs text-accent font-bold">h-[300vh]</code>) to control how long the pin remains locked before naturally resuming page scroll.
        </DocsCallout>
      </div>
    );
  }

  // recipe-horizontal-scroll & 3d
  return (
    <div className="flex flex-col gap-10 font-body not-prose">
      <header className="flex flex-col gap-3 border-b-2 border-line pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="border-2 border-line bg-bg inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent shadow-rest w-fit">
            <span className="w-2 h-2 bg-accent inline-block" />
            <span>[RECIPE / HORIZONTAL GALLERY]</span>
          </div>

          <Link
            href="/test/horizontal-scroll"
            className="h-10 px-4 border-2 border-line bg-bg hover:bg-accent text-fg hover:text-black font-mono text-xs font-bold uppercase transition-all shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>TEST IN LAB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-fg font-display leading-[0.92]">
          Horizontal Gallery Scrub
        </h1>
        <p className="text-base text-fg/90 font-body leading-relaxed max-w-3xl">
          Convert vertical page scroll distance into seamless horizontal slide translation with zero layout shift.
        </p>
      </header>

      <section id="recipe-code" className="flex flex-col gap-4">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-fg font-display">
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
