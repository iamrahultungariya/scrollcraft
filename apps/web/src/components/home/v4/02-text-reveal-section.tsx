'use client';

import React from 'react';
import { TextReveal } from '@scrollcraft/react';
import { Eyebrow } from './01-hero';

export function TextRevealSection() {
  return (
    <section className="relative w-full border-b border-paper/10 bg-panel/30 py-24 px-5 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Metadata Column (4 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Eyebrow number="02">The VDOM Decoupling</Eyebrow>

            <h2 className="mt-7 font-display text-3xl font-extrabold uppercase leading-[1.05] text-paper sm:text-5xl">
              Why high-frequency scrolling <span className="text-lime">breaks React.</span>
            </h2>

            <p className="mt-6 text-sm text-paper/70 leading-relaxed font-body">
              Traditional scroll libraries tie transform calculations directly to React component state. When high-frequency wheel or trackpad flings fire, the component tree attempts continuous full reconciliations on every frame tick, triggering layout thrashing and dropped animation frames.
            </p>

            <div className="mt-8 pt-6 border-t border-paper/10 space-y-3 font-mono text-[11px] text-paper/60">
              <div className="flex items-center justify-between">
                <span>SCROLL DISPATCH:</span>
                <span className="text-lime font-semibold">BYPASSES REACT FIBER</span>
              </div>
              <div className="flex items-center justify-between">
                <span>MUTATION TARGET:</span>
                <span className="text-paper font-semibold">STYLE.TRANSFORM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RE-RENDER OVERHEAD:</span>
                <span className="text-lime font-semibold">0.00 MS</span>
              </div>
            </div>
          </div>

          {/* Right Text Scrub Column (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative border-2 border-paper/20 bg-panel p-8 sm:p-12 shadow-[8px_8px_0px_#0e1210] overflow-hidden">
              {/* Corner crosshairs */}
              <span className="absolute top-2.5 left-2.5 text-[10px] font-mono text-paper/30 select-none">+</span>
              <span className="absolute top-2.5 right-2.5 text-[10px] font-mono text-paper/30 select-none">+</span>
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono text-paper/30 select-none">+</span>
              <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono text-paper/30 select-none">+</span>

              <div className="flex items-center justify-between border-b border-paper/10 pb-4 mb-8">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-paper/40">
                  SCROLL TO SCRUB &bull; 1:1 VELOCITY
                </span>
                <span className="size-2 bg-lime" />
              </div>

              {/* Real TextReveal Primitive Dogfooding */}
              <TextReveal
                by="words"
                baseOpacity={0.15}
                className="font-display text-2xl font-bold uppercase leading-[1.3] tracking-tight text-paper sm:text-4xl lg:text-[2.5rem]"
              >
                ScrollCraft operates directly at the hardware GPU compositor layer. Zero reconciliation. Zero garbage collection spikes. Just pure subpixel physics locked to your display refresh rate.
              </TextReveal>

              <div className="mt-10 pt-6 border-t border-paper/10 flex flex-wrap items-center justify-between text-xs font-mono text-paper/40 gap-4">
                <span className="text-lime">&lt;TextReveal by=&quot;words&quot; /&gt;</span>
                <span className="text-paper/70 font-semibold">0 React re-renders during active scrub</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
