import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Parallax } from '../primitives/parallax';
import { Pin } from '../primitives/pin';
import { usePin } from '../hooks/usePin';
import { useScrollTransform } from '../hooks/useScrollTransform';
import { useScrollDraw } from '../hooks/useScrollDraw';
import * as useParallaxModule from '../hooks/useParallax';

describe('React Primitives Remediation', () => {
  describe('M-04: Parallax driver Option Forwarding', () => {
    it('does not leak driver into DOM attributes when rendered', () => {
      const html = renderToString(
        <Parallax driver="native" speed={0.5} className="my-parallax" id="parallax-elem">
          <span>Parallax Content</span>
        </Parallax>
      );

      // Must render valid DOM element
      expect(html).toContain('id="parallax-elem"');
      expect(html).toContain('class="my-parallax"');
      expect(html).toContain('Parallax Content');

      // Crucial: driver must NOT leak into DOM attributes
      expect(html).not.toContain('driver="native"');
      expect(html).not.toContain('driver=');
    });

    it('forwards driver option into useParallax', () => {
      const useParallaxSpy = vi.spyOn(useParallaxModule, 'useParallax');

      renderToString(
        <Parallax driver="native" speed={0.75}>
          <div>Inner</div>
        </Parallax>
      );

      expect(useParallaxSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          driver: 'native',
          speed: 0.75,
        })
      );

      useParallaxSpy.mockRestore();
    });
  });

  describe('M-05: Pin Primitive Options & Bottom Support', () => {
    it('does not leak trackState, disableTransform, or onProgress into DOM attributes', () => {
      const onProgressSpy = vi.fn();
      const html = renderToString(
        <Pin
          top={15}
          bottom={30}
          duration={500}
          trackState={true}
          disableTransform={true}
          onProgress={onProgressSpy}
          id="pin-elem"
        >
          <div>Pinned Item</div>
        </Pin>
      );

      expect(html).toContain('id="pin-elem"');
      expect(html).toContain('Pinned Item');

      // Crucial: none of the reactive / solver props should leak as invalid HTML attributes
      expect(html).not.toContain('trackState');
      expect(html).not.toContain('disableTransform');
      expect(html).not.toContain('onProgress');
      expect(html).not.toContain('bottom="30"');
      expect(html).not.toContain('top="15"');
    });
  });

  describe('M-06: Dynamic Options Contract', () => {
    it('exports useScrollTransform, useScrollDraw, usePin, and useTextReveal functions', () => {
      expect(typeof useScrollTransform).toBe('function');
      expect(typeof useScrollDraw).toBe('function');
      expect(typeof usePin).toBe('function');
    });

    it('supports useTextReveal headless and ref-forwarding dual API', async () => {
      const { useTextReveal } = await import('../hooks/useTextReveal');
      expect(typeof useTextReveal).toBe('function');

      function HeadlessConsumer() {
        const { ref } = useTextReveal({ range: [0, 1] });
        return <p ref={ref}><span>Headless</span></p>;
      }

      function ForwardingConsumer() {
        const targetRef = React.createRef<HTMLParagraphElement>();
        useTextReveal(targetRef, { baseOpacity: 0.1 });
        return <p ref={targetRef}><span>Forwarding</span></p>;
      }

      const hHtml = renderToString(<HeadlessConsumer />);
      expect(hHtml).toContain('Headless');

      const fHtml = renderToString(<ForwardingConsumer />);
      expect(fHtml).toContain('Forwarding');
    });
  });
});
