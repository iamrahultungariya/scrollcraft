/**
 * Native CSS Engine Styles
 * Strictly under 650 LOC.
 * 
 * Injects required @keyframes for the Native ViewTimeline Drivers.
 * Only injected once if the browser supports native capabilities.
 */

let injected = false;

export function injectNativeStyles(nonce?: string): void {
  if (typeof document === 'undefined' || injected) return;
  
  const styleId = 'scrollcraft-native-engine';
  if (document.getElementById(styleId)) {
    injected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  if (nonce) {
    style.setAttribute('nonce', nonce);
  } else if (typeof document.querySelector === 'function') {
    const metaNonce = document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content');
    if (metaNonce) {
      style.setAttribute('nonce', metaNonce);
    }
  }
  style.textContent = `
    :root {
      scroll-timeline: --sc-doc-scroll block;
      scroll-timeline-name: --sc-doc-scroll;
      scroll-timeline-axis: block;
    }
    .sc-parallax-target {
      animation-timeline: --sc-doc-scroll;
    }
    @media (prefers-reduced-motion: no-preference) {
      @keyframes sc-parallax-y {
        0% { transform: translate3d(0, var(--sc-parallax-start, 0px), 0); }
        100% { transform: translate3d(0, var(--sc-parallax-end, 0px), 0); }
      }
      @keyframes sc-parallax-x {
        0% { transform: translate3d(var(--sc-parallax-start, 0px), 0, 0); }
        100% { transform: translate3d(var(--sc-parallax-end, 0px), 0, 0); }
      }
    }
    @media (prefers-reduced-motion: reduce) {
      @keyframes sc-parallax-y {
        0%, 100% { transform: none; }
      }
      @keyframes sc-parallax-x {
        0%, 100% { transform: none; }
      }
    }
    [data-scrollcraft-reveal="pending"] {
      opacity: 0;
    }
    @media (prefers-reduced-motion: reduce) {
      [data-scrollcraft-reveal="pending"] {
        opacity: 1 !important;
      }
    }
  `;
  document.head.appendChild(style);
  injected = true;
}

export function resetNativeStylesForTesting(): void {
  injected = false;
  if (typeof document !== 'undefined') {
    const el = document.getElementById('scrollcraft-native-engine');
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
}
