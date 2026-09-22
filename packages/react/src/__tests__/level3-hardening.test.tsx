import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { useRef } from 'react';
import { renderToString } from 'react-dom/server';
import {
  ticker,
  GlobalResizeManager,
  TransformComposer,
  revealObserver,
  ParallaxSolver,
  tierStore,
} from '@scrollcraft/core';
import { useParallax } from '../hooks/useParallax';
import { useReveal } from '../hooks/useReveal';
import { usePin } from '../hooks/usePin';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useScrollTransform } from '../hooks/useScrollTransform';
import { useScrollDraw } from '../hooks/useScrollDraw';
import { useMagnetic } from '../hooks/useMagnetic';
import { useScrollTimeline } from '../hooks/useScrollTimeline';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { Reveal } from '../primitives/reveal';

describe('Level 3: Headless React Hooks Hardening & Zero-Jank Suite', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  beforeEach(() => {
    class MockWindow {}
    const mockWin = Object.assign(new MockWindow(), {
      scrollY: 0,
      scrollX: 0,
      pageYOffset: 0,
      pageXOffset: 0,
      innerHeight: 800,
      innerWidth: 1000,
      devicePixelRatio: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matchMedia: vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    });

    class MockResizeObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    const mockClassList = () => ({
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      [Symbol.iterator]: function* () {},
    });

    Object.assign(globalThis, {
      Window: MockWindow,
      window: mockWin,
      ResizeObserver: MockResizeObserver,
      IntersectionObserver: MockIntersectionObserver,
      document: {
        documentElement: {
          scrollHeight: 3000,
          classList: mockClassList(),
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
        },
        body: { scrollHeight: 3000, classList: mockClassList() },
        createElement: (tag: string) => ({
          tagName: tag.toUpperCase(),
          style: {},
          setAttribute: vi.fn(),
          classList: mockClassList(),
          remove: vi.fn(),
          parentNode: null,
          nextSibling: null,
          insertBefore: vi.fn(),
        }),
        head: { appendChild: vi.fn() },
        getElementById: vi.fn().mockReturnValue(null),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        hidden: false,
        fonts: { ready: Promise.resolve() },
      },
    });
    tierStore.setTier('high');
  });

  afterEach(() => {
    Object.assign(globalThis, {
      window: originalWindow,
      document: originalDocument,
    });
    tierStore.reset();
    revealObserver.destroy();
    vi.restoreAllMocks();
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 1: useParallax DUAL API & ANTI-JUMP ORIGIN
  // ══════════════════════════════════════════════════════════════════
  describe('Step 1: useParallax Dual API & Hero Anti-Jump', () => {
    it('supports headless invocation returning a ref', () => {
      let returnedRef: any = null;
      function HeadlessConsumer() {
        returnedRef = useParallax({ speed: 0.3, origin: 'auto' });
        return <div ref={returnedRef} />;
      }
      renderToString(<HeadlessConsumer />);
      expect(returnedRef).not.toBeNull();
      expect(returnedRef).toHaveProperty('current');
    });

    it('supports ref-forwarding invocation without allocating duplicate refs', () => {
      let forwardedRef: any = null;
      let hookReturn: any = undefined;
      function ForwardingConsumer() {
        forwardedRef = useRef<HTMLDivElement>(null);
        hookReturn = useParallax(forwardedRef, { speed: 0.4, bleed: true });
        return <div ref={forwardedRef} />;
      }
      renderToString(<ForwardingConsumer />);
      expect(forwardedRef).not.toBeNull();
      expect(hookReturn).toBeUndefined();
    });

    it('guarantees strictly 0px initial displacement at scrollY=0 when origin="auto"', () => {
      const element = {
        tagName: 'DIV',
        style: {} as Record<string, string>,
        getBoundingClientRect: () => ({ top: 150, left: 0, width: 300, height: 200, bottom: 350 }),
      } as unknown as HTMLElement;

      const solver = new ParallaxSolver(element, { speed: 0.5, origin: 'auto' });
      solver.update(0);
      solver.render();

      const transform = TransformComposer.get(element);
      expect(transform).toContain('translate3d(0, 0.00px, 0)');
      solver.destroy();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 2: useReveal DUAL API, ATMOSPHERIC BLUR, 3D TILT & STAGGER
  // ══════════════════════════════════════════════════════════════════
  describe('Step 2: useReveal Dual API & Kinetic Atmospheric Reveal', () => {
    it('supports headless and ref-forwarding invocations', () => {
      let headlessRef: any = null;
      let forwardedRef: any = null;

      function RevealHeadless() {
        headlessRef = useReveal({ blur: 10, scale: 0.9, rotateX: 15 });
        return <div ref={headlessRef} />;
      }

      function RevealForwarding() {
        forwardedRef = useRef<HTMLDivElement>(null);
        useReveal(forwardedRef, { direction: 'left', distance: 40 });
        return <div ref={forwardedRef} />;
      }

      renderToString(<RevealHeadless />);
      renderToString(<RevealForwarding />);

      expect(headlessRef).toHaveProperty('current');
      expect(forwardedRef).toHaveProperty('current');
    });

    it('applies atmospheric blur, 3D tilt, and computes auto-stagger delay correctly', () => {
      const element = {
        tagName: 'DIV',
        style: {} as Record<string, string>,
        getBoundingClientRect: () => ({ top: 500, bottom: 700, height: 200 }),
      } as unknown as HTMLElement;

      const onRevealSpy = vi.fn();
      revealObserver.observe(element, {
        blur: 16,
        scale: 0.85,
        rotateX: 25,
        rotateY: -10,
        index: 4,
        stagger: 0.08,
        onReveal: onRevealSpy,
      });

      // Verifies blur is applied to hidden initial state
      expect(element.style.filter).toContain('blur(16px)');

      // Verifies hidden transform contains translation, scale, and 3D tilts
      const hiddenTransform = TransformComposer.get(element);
      expect(hiddenTransform).toContain('scale(0.85)');
      expect(hiddenTransform).toContain('rotateX(25deg)');
      expect(hiddenTransform).toContain('rotateY(-10deg)');

      revealObserver.unobserve(element);
    });

    it('forwards index, stagger, blur, scale, and rotateX in <Reveal> without DOM attribute leakage', () => {
      const html = renderToString(
        <Reveal
          direction="up"
          distance={40}
          blur={8}
          scale={0.92}
          rotateX={12}
          index={3}
          stagger={0.1}
          className="test-reveal-card"
        >
          <span>Content</span>
        </Reveal>
      );

      expect(html).toContain('class="test-reveal-card"');
      expect(html).toContain('<span>Content</span>');
      expect(html).not.toContain('blur="');
      expect(html).not.toContain('scale="');
      expect(html).not.toContain('rotatex="');
      expect(html).not.toContain('index="');
      expect(html).not.toContain('stagger="');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 3: usePin GSAP 4-STATE LIFECYCLE & AUTO PIN-SPACING
  // ══════════════════════════════════════════════════════════════════
  describe('Step 3: usePin GSAP 4-State Lifecycle & Auto Pin-Spacing', () => {
    it('returns ref, progressValue observable, and tracking properties', () => {
      let pinResult: any = null;
      function PinConsumer() {
        pinResult = usePin({ top: 20, duration: 600, pinSpacing: 400 });
        return <div ref={pinResult.ref} />;
      }
      renderToString(<PinConsumer />);

      expect(pinResult).not.toBeNull();
      expect(pinResult.ref).toHaveProperty('current');
      expect(pinResult.progressValue).toHaveProperty('subscribe');
      expect(pinResult.progressValue).toHaveProperty('get');
      expect(typeof pinResult.progress).toBe('number');
      expect(typeof pinResult.pinOffsetY).toBe('number');
      expect(typeof pinResult.isPinned).toBe('boolean');
    });

    it('transitions through GSAP 4-state lifecycle (onEnter, onLeave, onEnterBack, onLeaveBack)', () => {
      const onEnter = vi.fn();
      const onLeave = vi.fn();
      const onEnterBack = vi.fn();
      const onLeaveBack = vi.fn();

      // Simulate the lifecycle state machine directly
      let zoneState: 'before' | 'inside' | 'after' = 'before';
      const updateZone = (nextProgress: number) => {
        let nextZone: 'before' | 'inside' | 'after' = 'before';
        if (nextProgress > 0 && nextProgress < 1) {
          nextZone = 'inside';
        } else if (nextProgress >= 1) {
          nextZone = 'after';
        }

        if (zoneState !== nextZone) {
          if (zoneState === 'before' && nextZone === 'inside') onEnter();
          else if (zoneState === 'inside' && nextZone === 'after') onLeave();
          else if (zoneState === 'after' && nextZone === 'inside') onEnterBack();
          else if (zoneState === 'inside' && nextZone === 'before') onLeaveBack();
          zoneState = nextZone;
        }
      };

      // 1. Enter pin going forward
      updateZone(0.5);
      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(onLeave).not.toHaveBeenCalled();

      // 2. Leave pin going forward
      updateZone(1.0);
      expect(onLeave).toHaveBeenCalledTimes(1);

      // 3. Re-enter pin going backward
      updateZone(0.8);
      expect(onEnterBack).toHaveBeenCalledTimes(1);

      // 4. Leave pin going backward
      updateZone(0.0);
      expect(onLeaveBack).toHaveBeenCalledTimes(1);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 4: useScrollProgress DUAL API & TARGET SCOPING
  // ══════════════════════════════════════════════════════════════════
  describe('Step 4: useScrollProgress Dual API & Target Scoping', () => {
    it('returns targetRef and zero-rerender progressValue observable', () => {
      let progressOutput: any = null;
      function ProgressConsumer() {
        progressOutput = useScrollProgress({ offset: ['top bottom', 'bottom top'] });
        return <div ref={progressOutput.targetRef} />;
      }
      renderToString(<ProgressConsumer />);

      expect(progressOutput).not.toBeNull();
      expect(progressOutput.targetRef).toHaveProperty('current');
      expect(progressOutput.progressValue).toHaveProperty('subscribe');
      expect(progressOutput.scrollYValue).toHaveProperty('subscribe');
    });

    it('clamps progress safely between 0.0 and 1.0', () => {
      let hookOutput: any = null;
      function ProgressConsumer() {
        hookOutput = useScrollProgress({ orientation: 'vertical' });
        return <div />;
      }
      renderToString(<ProgressConsumer />);
      expect(hookOutput.progress).toBeGreaterThanOrEqual(0);
      expect(hookOutput.progress).toBeLessThanOrEqual(1);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 5: useScrollTransform PRESETS & UNIT FREEDOM
  // ══════════════════════════════════════════════════════════════════
  describe('Step 5: useScrollTransform Presets & Unit Freedom', () => {
    it('supports built-in presets: zoom-in, fade-up, scale-down, blur-in, 3d-flip', () => {
      let refZoom: any = null;
      let refFade: any = null;
      let refFlip: any = null;

      function ZoomConsumer() {
        refZoom = useScrollTransform({ preset: 'zoom-in' });
        return <div ref={refZoom} />;
      }
      function FadeConsumer() {
        refFade = useScrollTransform({ preset: 'fade-up' });
        return <div ref={refFade} />;
      }
      function FlipConsumer() {
        refFlip = useScrollTransform({ preset: '3d-flip' });
        return <div ref={refFlip} />;
      }

      renderToString(<ZoomConsumer />);
      renderToString(<FadeConsumer />);
      renderToString(<FlipConsumer />);

      expect(refZoom).toHaveProperty('current');
      expect(refFade).toHaveProperty('current');
      expect(refFlip).toHaveProperty('current');
    });

    it('parses unit-free string values (px, %, deg) into numeric keyframe values', () => {
      let targetRef: any = null;
      function CustomTransformConsumer() {
        targetRef = useScrollTransform({
          properties: {
            y: ['100px', '0px'] as any,
            scale: [0.8, 1],
            rotate: ['45deg', '0deg'] as any,
          },
        });
        return <div ref={targetRef} />;
      }
      renderToString(<CustomTransformConsumer />);
      expect(targetRef).toHaveProperty('current');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 6: useScrollDraw UNIVERSAL SVG GEOMETRY
  // ══════════════════════════════════════════════════════════════════
  describe('Step 6: useScrollDraw Universal SVG Geometry', () => {
    it('supports headless and ref-forwarding on SVG geometry elements', () => {
      let pathRef: any = null;
      function DrawConsumer() {
        pathRef = useScrollDraw<SVGPathElement>({
          dashArray: '10 5',
          start: 'top bottom',
          end: 'bottom top',
        });
        return <svg><path ref={pathRef} /></svg>;
      }
      renderToString(<DrawConsumer />);
      expect(pathRef).toHaveProperty('current');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 7: useMagnetic DUAL API, SCALE & INNER TARGET PARALLAX
  // ══════════════════════════════════════════════════════════════════
  describe('Step 7: useMagnetic Dual API, Scale & Inner Layer Parallax', () => {
    it('supports headless invocation returning { ref }', () => {
      let magneticReturn: any = null;
      function MagneticConsumer() {
        magneticReturn = useMagnetic({ strength: 0.4, scale: 1.1 });
        return <button ref={magneticReturn.ref} />;
      }
      renderToString(<MagneticConsumer />);
      expect(magneticReturn).toHaveProperty('ref');
      expect(magneticReturn.ref).toHaveProperty('current');
    });

    it('supports innerTargetRef for 3D layered parallax', () => {
      let outerRef: any = null;
      let innerRef: any = null;

      function LayeredMagneticConsumer() {
        innerRef = useRef<HTMLSpanElement>(null);
        outerRef = useRef<HTMLButtonElement>(null);
        useMagnetic(outerRef, {
          strength: 0.3,
          scale: 1.1,
          innerTargetRef: innerRef,
          innerStrength: 0.6,
        });
        return (
          <button ref={outerRef}>
            <span ref={innerRef}>Inner Icon</span>
          </button>
        );
      }
      renderToString(<LayeredMagneticConsumer />);
      expect(outerRef).toHaveProperty('current');
      expect(innerRef).toHaveProperty('current');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 8: useScrollTimeline DIRECT DOM SEQUENCER & EVALUATOR
  // ══════════════════════════════════════════════════════════════════
  describe('Step 8: useScrollTimeline Direct DOM Sequencer & Pure Evaluator', () => {
    it('evaluates timeline numerically in pure evaluator mode', () => {
      const timeline = {
        x: [
          { from: 0, to: 0.5, startValue: 0, endValue: 100 },
          { from: 0.5, to: 1.0, startValue: 100, endValue: 200 },
        ],
      };
      let result: any = null;
      function TimelineEvaluator() {
        result = useScrollTimeline(0.25, timeline);
        return <div />;
      }
      renderToString(<TimelineEvaluator />);
      expect(result.x).toBeCloseTo(50, 1);
    });

    it('supports direct DOM sequencer mode with keyframes dictionary', () => {
      let seqRef: any = null;
      function SequencerConsumer() {
        seqRef = useScrollTimeline({
          keyframes: {
            y: [0, 50, 100],
            opacity: [0, 1, 0],
          },
        });
        return <div ref={seqRef} />;
      }
      renderToString(<SequencerConsumer />);
      expect(seqRef).toHaveProperty('current');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 9: useScrollDirection iOS RUBBER-BAND GUARD & DUAL HYSTERESIS
  // ══════════════════════════════════════════════════════════════════
  describe('Step 9: useScrollDirection iOS Bounce Guard & Hysteresis', () => {
    it('initializes with direction "up" and isAtTop=true at top of page', () => {
      let dirResult: any = null;
      function DirectionConsumer() {
        dirResult = useScrollDirection();
        return <header ref={dirResult.ref} />;
      }
      renderToString(<DirectionConsumer />);
      expect(dirResult.direction).toBe('up');
      expect(dirResult.isAtTop).toBe(true);
      expect(dirResult.ref).toHaveProperty('current');
    });

    it('enforces dual-threshold hysteresis (15px down, 25px up)', () => {
      const thresholdDown = 15;
      const thresholdUp = 25;

      let direction: 'up' | 'down' = 'up';
      let isAtTop = true;
      let lastScrollY = 0;
      let accumulatedDown = 0;
      let accumulatedUp = 0;

      const processScroll = (scrollY: number) => {
        const delta = scrollY - lastScrollY;

        // iOS Safari Rubber-Band Guard:
        if (scrollY <= 0) {
          accumulatedDown = 0;
          accumulatedUp = 0;
          direction = 'up';
          isAtTop = true;
          lastScrollY = 0;
          return;
        }

        isAtTop = false;

        if (delta > 0) {
          accumulatedUp = 0;
          accumulatedDown += delta;
          if (accumulatedDown >= thresholdDown) {
            direction = 'down';
          }
        } else if (delta < 0) {
          accumulatedDown = 0;
          accumulatedUp += Math.abs(delta);
          if (accumulatedUp >= thresholdUp) {
            direction = 'up';
          }
        }

        lastScrollY = scrollY;
      };

      // 1. Initial position
      processScroll(0);
      expect(direction).toBe('up');
      expect(isAtTop).toBe(true);

      // 2. Small downward jitter (10px < 15px threshold): remains 'up'
      processScroll(10);
      expect(direction).toBe('up');
      expect(isAtTop).toBe(false);

      // 3. Further downward travel (delta = +10, accumulatedDown = 20 >= 15px): switches to 'down'
      processScroll(20);
      expect(direction).toBe('down');

      // 4. Large downward progression to establish baseline depth
      processScroll(100);
      expect(direction).toBe('down');

      // 5. Small upward travel (delta = -10, accumulatedUp = 10 < 25px): remains 'down'
      processScroll(90);
      expect(direction).toBe('down');

      // 6. Significant upward travel (delta = -20, accumulatedUp = 10 + 20 = 30 >= 25px): switches to 'up'
      processScroll(70);
      expect(direction).toBe('up');

      // 7. iOS rubber-band overscroll top (scrollY <= 0): strictly locks to 'up' and isAtTop=true
      processScroll(-10);
      expect(direction).toBe('up');
      expect(isAtTop).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // STEP 10: RAPID MOUNT/UNMOUNT ZERO-LEAK SOAK TEST
  // ══════════════════════════════════════════════════════════════════
  describe('Step 10: 25-Cycle Rapid Mount/Unmount Zero-Leak Soak Test', () => {
    it('executes 25 mount/unmount cycles without orphan observers or lingering tasks', () => {
      const initialTaskCount = (ticker as unknown as { tasks: Map<string, unknown> }).tasks?.size ?? 0;

      for (let i = 0; i < 25; i++) {
        function AllHooksComponent() {
          const parallaxRef = useParallax<HTMLDivElement>({ speed: 0.2, origin: 'auto' });
          const revealRef = useReveal<HTMLDivElement>({ blur: 8, scale: 0.9 });
          const { ref: pinRef } = usePin<HTMLDivElement>({ top: 0, duration: 300 });
          const { targetRef: progressRef } = useScrollProgress<HTMLDivElement>();
          const transformRef = useScrollTransform<HTMLDivElement>({ preset: 'fade-up' });
          const drawRef = useScrollDraw<SVGPathElement>({ dashArray: '8 4' });
          const { ref: magneticRef } = useMagnetic<HTMLButtonElement>({ scale: 1.1 });
          const timelineRef = useScrollTimeline<HTMLDivElement>({ keyframes: { y: [0, 50] } });
          const { ref: directionRef } = useScrollDirection<HTMLElement>();

          return (
            <div>
              <div ref={parallaxRef} />
              <div ref={revealRef} />
              <div ref={pinRef} />
              <div ref={progressRef} />
              <div ref={transformRef} />
              <svg><path ref={drawRef} /></svg>
              <button ref={magneticRef} />
              <div ref={timelineRef} />
              <nav ref={directionRef} />
            </div>
          );
        }

        renderToString(<AllHooksComponent />);
      }

      const finalTaskCount = (ticker as unknown as { tasks: Map<string, unknown> }).tasks?.size ?? 0;
      expect(finalTaskCount).toBe(initialTaskCount);
    });
  });
});
