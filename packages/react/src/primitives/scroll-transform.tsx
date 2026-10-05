'use client';

/**
 * <ScrollTransform> Declarative Primitive
 * Supports asChild composition with bespoke Slot and direct GPU TransformComposer writes.
 * Supports built-in animation presets ('zoom-in', 'fade-up', 'scale-down', 'blur-in', '3d-flip').
 * Strictly under 650 LOC.
 */

import React from 'react';
import { Slot, composeRefs } from '../slot';
import { useScrollTransform } from '../hooks/useScrollTransform';
import { ScrollTransformOptions } from '../types';

export interface ScrollTransformProps extends React.HTMLAttributes<HTMLDivElement>, ScrollTransformOptions {
  asChild?: boolean;
}

export const ScrollTransform = React.forwardRef<HTMLDivElement, ScrollTransformProps>(
  (
    {
      asChild,
      id,
      markers,
      start,
      end,
      properties,
      scrub,
      snap,
      onSnap,
      preset,
      respectReducedMotion,
      heroAware,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useScrollTransform<HTMLDivElement>({
      id,
      markers,
      start,
      end,
      properties,
      scrub,
      snap,
      onSnap,
      preset,
      respectReducedMotion,
      heroAware,
    });
    const mergedRef = composeRefs(forwardedRef, internalRef);

    if (asChild) {
      return (
        <Slot ref={mergedRef} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <div ref={mergedRef} {...props}>
        {children}
      </div>
    );
  }
);

ScrollTransform.displayName = 'ScrollTransform';
