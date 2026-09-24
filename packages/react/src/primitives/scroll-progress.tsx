'use client';

/**
 * <ScrollProgress> Declarative Progress Bar Primitive
 * Subscribes directly to ScrollValue to update scaleX without React re-renders.
 * Strictly under 650 LOC.
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { TransformComposer, styleRegistry } from '@scrollcraft/core';
import { Slot, composeRefs } from '../slot';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { ScrollProgressProps } from '../types';

export const ScrollProgress = React.memo(
  forwardRef<HTMLDivElement, ScrollProgressProps>((props, forwardedRef) => {
    const {
      asChild = false,
      style,
      children,
      target,
      offset,
      orientation,
      reactive,
      progressValue: customProgressValue,
      onProgress,
      ...domProps
    } = props;
    const internalRef = useRef<HTMLDivElement | null>(null);
    const { progressValue } = useScrollProgress({
      target,
      offset,
      orientation,
      reactive,
      progressValue: customProgressValue,
      onProgress,
    });

    useEffect(() => {
      const node = internalRef.current;
      if (!node) return;

      const origin = orientation === 'vertical' ? '50% 0%' : '0% 50%';
      styleRegistry.lease(node, 'scroll-progress', 'transformOrigin', origin);
      styleRegistry.lease(node, 'scroll-progress', 'willChange', 'transform');
      styleRegistry.lease(node, 'scroll-progress', 'backfaceVisibility', 'hidden');

      const unsubscribe = progressValue.subscribe((progress) => {
        if (internalRef.current) {
          TransformComposer.setNumeric(
            internalRef.current,
            'scroll-progress',
            orientation === 'vertical' ? { z: 0, scaleY: progress } : { z: 0, scaleX: progress }
          );
        }
      });

      return () => {
        unsubscribe();
        if (node) {
          styleRegistry.release(node, 'scroll-progress');
          TransformComposer.clear(node, 'scroll-progress');
        }
      };
    }, [progressValue, orientation]);

    const mergedRef = composeRefs(forwardedRef, internalRef);

    if (asChild) {
      return (
        <Slot ref={mergedRef} style={{ willChange: 'transform', backfaceVisibility: 'hidden', ...style }} {...domProps}>
          {children}
        </Slot>
      );
    }

    const defaultOrigin = orientation === 'vertical' ? '50% 0%' : '0% 50%';
    const initialTransform = orientation === 'vertical'
      ? `translate3d(0, 0, 0) scaleY(${progressValue.get()})`
      : `translate3d(0, 0, 0) scaleX(${progressValue.get()})`;

    return (
      <div
        ref={mergedRef}
        style={{
          transform: initialTransform,
          transformOrigin: defaultOrigin,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          ...style,
        }}
        {...domProps}
      >
        {children}
      </div>
    );
  })
);

ScrollProgress.displayName = 'ScrollProgress';
