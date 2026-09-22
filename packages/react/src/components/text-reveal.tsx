'use client';

import React, { forwardRef, useRef, useEffect, useMemo } from 'react';
import { GlobalResizeManager, TextRevealSolver, ticker } from '@scrollcraft/core';
import { useScrollCraft } from '../context';
import { composeRefs } from '../slot';
import { TextRevealProps } from '../types';

export type { TextRevealProps };

export const TextReveal = React.memo(
  forwardRef<HTMLParagraphElement, TextRevealProps>((props, forwardedRef) => {
    const {
      children,
      className = '',
      by = 'chars',
      asChild = false,
      range,
      blur,
      scale,
      rotateX,
      rotateY,
      slide,
      baseOpacity = 0,
      triggerStart,
      triggerEnd,
      style,
      ...domProps
    } = props;

    const [rangeStart = 0, rangeEnd = 1] = range ?? [];
    const internalRef = useRef<HTMLParagraphElement>(null);
    const targetsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const { engine } = useScrollCraft();

    const rawText = useMemo(() => {
      if (typeof children === 'string') return children;
      if (React.isValidElement(children) && typeof (children.props as any)?.children === 'string') {
        return (children.props as any).children as string;
      }
      return '';
    }, [children]);

    // Split words and characters with memoization
    const { wordGroups, totalTargets } = useMemo(() => {
      const words = rawText.split(' ');
      if (by === 'words') {
        return {
          wordGroups: words.map((word, index) => ({
            word,
            chars: [] as Array<{ char: string; index: number }>,
            wordIndex: index,
          })),
          totalTargets: words.length,
        };
      }

      let charCounter = 0;
      const groups = words.map((word, wIdx) => {
        const chars = word.split('').map((char) => ({
          char,
          index: charCounter++,
        }));
        return {
          word,
          chars,
          wordIndex: wIdx,
        };
      });

      return {
        wordGroups: groups,
        totalTargets: charCounter,
      };
    }, [children, by]);

    useEffect(() => {
      const container = internalRef.current;
      const targets = targetsRef.current.filter(Boolean) as HTMLElement[];

      if (!container || targets.length === 0) return;

      // Hydration takeover: Cancel CSS keyframe fallback race condition immediately
      container.classList.remove('sc-reveal-css-fallback');

      const solver = new TextRevealSolver(container, targets, {
        range: [rangeStart, rangeEnd],
        blur,
        scale,
        rotateX,
        rotateY,
        slide,
        baseOpacity,
        triggerStart,
        triggerEnd,
      });

      const taskId = `text-reveal-${Math.random().toString(36).slice(2, 8)}`;

      const measure = () => solver.measure();
      const unobserve = GlobalResizeManager.observe(container, measure);

      ticker.add(`${taskId}-update`, 'update', () => {
        const metrics = engine?.getMetrics();
        const scrollY = metrics?.scroll ?? (typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset) : 0);
        const wh = window.innerHeight;
        const velocity = metrics?.velocity;
        solver.update(scrollY, wh, velocity);
      });

      ticker.add(`${taskId}-render`, 'render', () => {
        solver.render();
      });

      return () => {
        unobserve();
        ticker.remove(`${taskId}-update`);
        ticker.remove(`${taskId}-render`);
        solver.destroy();
        targetsRef.current = [];
      };
    }, [engine, rangeStart, rangeEnd, blur, scale, rotateX, rotateY, slide, baseOpacity, triggerStart, triggerEnd, totalTargets]);

    const mergedRef = composeRefs(forwardedRef, internalRef);

    const contentSpans = (
      <span aria-hidden="true" style={{ display: 'contents' }}>
        {by === 'words'
          ? wordGroups.map(({ word, wordIndex }, i) => (
              <React.Fragment key={wordIndex}>
                <span
                  ref={(el) => {
                    targetsRef.current[wordIndex] = el;
                  }}
                  className="sc-word inline-block"
                  style={{
                    opacity: baseOpacity,
                    display: 'inline-block',
                    transformOrigin: '50% 100%',
                  }}
                >
                  {word}
                </span>
                {i < wordGroups.length - 1 && ' '}
              </React.Fragment>
            ))
          : wordGroups.map(({ chars, wordIndex }, i) => (
              <React.Fragment key={wordIndex}>
                <span
                  className="sc-word-group inline-block"
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chars.map(({ char, index }) => (
                    <span
                      key={index}
                      ref={(el) => {
                        targetsRef.current[index] = el;
                      }}
                      className="sc-char inline-block"
                      style={{
                        opacity: baseOpacity,
                        display: 'inline-block',
                        whiteSpace: char === ' ' ? 'pre' : 'normal',
                        transformOrigin: '50% 100%',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                {i < wordGroups.length - 1 && ' '}
              </React.Fragment>
            ))}
      </span>
    );

    const has3D = Boolean(rotateX || rotateY);

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      const childRef = (child.props as any)?.ref ?? (child as any).ref;
      const combinedRef = composeRefs(childRef, mergedRef);
      return React.cloneElement(child, {
        'data-sc-reveal': 'pending',
        'aria-label': rawText || child.props['aria-label'],
        ...domProps,
        ...child.props,
        ref: combinedRef,
        className: ['m-0 p-0 flex flex-wrap', className, child.props.className].filter(Boolean).join(' '),
        style: {
          ...(has3D ? { perspective: '1000px' } : undefined),
          ...style,
          ...child.props.style,
        },
        children: contentSpans,
      });
    }

    return (
      <p
        ref={mergedRef}
        data-sc-reveal="pending"
        aria-label={rawText}
        className={['m-0 p-0 flex flex-wrap', className].filter(Boolean).join(' ')}
        style={{
          ...(has3D ? { perspective: '1000px' } : undefined),
          ...style,
        }}
        {...domProps}
      >
        {contentSpans}
      </p>
    );
  })
);

TextReveal.displayName = 'TextReveal';
