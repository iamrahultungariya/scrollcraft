'use client';

import React from 'react';
import { TextReveal } from '@scrollcraft/react';

export function TextRevealSection() {
  return (
    <section className="relative w-full border-b border-[#1c1c1f] bg-[#09090b] py-28 sm:py-36 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Metadata Column (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              <span className="text-[11px] font-mono text-[#71717a] uppercase tracking-[0.2em]">
                01 // THE VDOM DECOUPLING
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#fafafa] font-sans tracking-tight">
              Why high-frequency scrolling breaks React.
            </h3>

            <p className="mt-4 text-xs sm:text-sm text-[#a1a1aa] leading-[1.8] font-sans">
              Traditional scroll libraries tie transform calculations to React state triggers. When a user flings a high-precision trackpad or gaming mouse, the component tree attempts 120 full reconciliations per second, dropping frames and thrashing the browser layout.
            </p>

            <div className="mt-8 pt-6 border-t border-[#1c1c1f] space-y-2.5 font-mono text-[11px] text-[#71717a]">
              <div className="flex items-center justify-between">
                <span>SCROLL DISPATCH:</span>
                <span className="text-[#3b82f6] font-semibold">BYPASSES REACT FIBER</span>
              </div>
              <div className="flex items-center justify-between">
                <span>MUTATION TARGET:</span>
                <span className="text-[#fafafa]">STYLE.TRANSFORM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RE-RENDER OVERHEAD:</span>
                <span className="text-[#10b981] font-semibold">0.00 MS</span>
              </div>
            </div>
          </div>

          {/* Right Text Scrub Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="p-8 sm:p-12 rounded-xl border border-[#27272a] bg-[#121214] shadow-sm">
              <div className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.2em] mb-6">
                SCROLL TO SCRUB TYPOGRAPHY &bull; 1:1 VELOCITY TRACKING
              </div>

              <TextReveal
                by="words"
                baseOpacity={0.15}
                className="text-2xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#fafafa] leading-[1.3] tracking-[-0.03em] font-sans"
              >
                ScrollCraft operates directly at the hardware GPU compositor layer. Zero reconciliation. Zero garbage collection spikes. Just pure subpixel physics locked to your display refresh rate.
              </TextReveal>

              <div className="mt-10 pt-6 border-t border-[#1c1c1f] flex flex-wrap items-center justify-between text-xs font-mono text-[#71717a] gap-4">
                <span>&lt;TextReveal by=&quot;words&quot; /&gt;</span>
                <span className="text-[#10b981] font-semibold">0 React re-renders during active scrub</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
