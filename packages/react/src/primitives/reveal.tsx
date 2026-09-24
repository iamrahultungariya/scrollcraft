'use client';

/**
 * <Reveal> Declarative Primitive
 * Smooth reveal-on-enter animation with asChild Slot composition.
 * Strictly under 650 LOC.
 */

import React, { forwardRef, useRef } from 'react';
import { Slot, composeRefs } from '../slot';
import { useReveal } from '../hooks/useReveal';
import { RevealProps } from '../types';

export const Reveal = React.memo(
  forwardRef<HTMLElement, RevealProps>((props, forwardedRef) => {
    const {
      asChild = false,
      direction = 'up',
      distance = 32,
      duration = 0.5,
      delay = 0,
      threshold = 0.15,
      once = true,
      blur,
      scale,
      rotateX,
      rotateY,
      index,
      stagger,
      onReveal,
      onReset,
      respectReducedMotion = true,
      children,
      ...domProps
    } = props;

    const internalRef = useRef<HTMLElement | null>(null);

    useReveal(internalRef, {
      direction,
      distance,
      duration,
      delay,
      threshold,
      once,
      blur,
      scale,
      rotateX,
      rotateY,
      index,
      stagger,
      onReveal,
      onReset,
      respectReducedMotion,
    });

    const mergedRef = composeRefs(forwardedRef, internalRef);
    const revealProps = {
      'data-scrollcraft-reveal': (domProps as Record<string, any>)['data-scrollcraft-reveal'] || 'pending',
      ...domProps,
    };

    if (asChild) {
      return (
        <Slot ref={mergedRef} {...revealProps}>
          {children}
        </Slot>
      );
    }

    return (
      <div ref={mergedRef as React.Ref<HTMLDivElement>} {...revealProps}>
        {children}
      </div>
    );
  })
);

Reveal.displayName = 'Reveal';
