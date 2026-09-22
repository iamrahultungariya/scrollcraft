'use client';

import React, { useRef, useEffect } from 'react';
import { damp, clamp, ticker, TransformComposer } from '@scrollcraft/core';
import { useScrollCraft } from '../context';

export interface SkewGalleryProps {
  images: string[];
  className?: string;
  intensity?: number;
}

export const SkewGallery: React.FC<SkewGalleryProps> = ({ images, className = '', intensity = 1.8 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { engine, reducedMotion } = useScrollCraft();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (reducedMotion) {
      TransformComposer.clear(container, 'skew-gallery');
      return;
    }

    const taskId = `skew-gallery-${Math.random().toString(36).slice(2, 8)}`;
    
    // We want to apply skew based on scroll velocity.
    let currentSkew = 0;
    
    ticker.add(taskId, 'render', (dt) => {
      const velocity = engine?.getMetrics().velocity || 0;
      const targetSkew = clamp(velocity * intensity, -12, 12);
      currentSkew = damp(currentSkew, targetSkew, 8, dt);
      if (Math.abs(currentSkew) < 0.01 && Math.abs(targetSkew) < 0.01) {
        if (currentSkew !== 0) {
          currentSkew = 0;
          TransformComposer.clear(container, 'skew-gallery');
        }
        return;
      }
      TransformComposer.setNumeric(container, 'skew-gallery', {
        skewY: Number(currentSkew.toFixed(3)),
      });
    });

    return () => {
      ticker.remove(taskId);
      TransformComposer.clear(container, 'skew-gallery');
    };
  }, [engine, intensity, reducedMotion]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className={`grid grid-cols-2 md:grid-cols-3 gap-6 ${!reducedMotion ? 'will-change-transform' : ''}`}>
        {images.map((src, idx) => (
          <div key={idx} className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={src} 
              alt={`Gallery Image ${idx}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
