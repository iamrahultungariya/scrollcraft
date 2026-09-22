/**
 * ScrollCraft Feature & Performance Tier Detection
 * Strictly under 650 LOC.
 * 
 * Determines CSS Scroll-driven animation support and autonomous hardware performance tier.
 * Caches results to avoid repeated CSS.supports and WebGL context overhead.
 */

import { PerformanceTier, TierChangeListener } from './types';

export interface CapabilityMatrix {
  viewTimeline: boolean;
  animationRange: boolean;
  scrollTimeline: boolean;
  isNativeReady: boolean;
}

let cachedCapabilities: CapabilityMatrix | null = null;
let cachedTier: PerformanceTier | null = null;

export class ScrollCraftTierStore {
  private static instance: ScrollCraftTierStore | null = null;
  private currentTier: PerformanceTier = 'balanced';
  private listeners: Set<TierChangeListener> = new Set();

  private constructor() {
    this.currentTier = detectPerformanceTier();
    this.syncDomAttribute();
  }

  public static get(): ScrollCraftTierStore {
    if (!ScrollCraftTierStore.instance) {
      ScrollCraftTierStore.instance = new ScrollCraftTierStore();
    }
    return ScrollCraftTierStore.instance;
  }

  public getTier(): PerformanceTier {
    return this.currentTier;
  }

  public setTier(newTier: PerformanceTier): void {
    if (this.currentTier === newTier) return;
    this.currentTier = newTier;
    this.syncDomAttribute();

    for (const listener of this.listeners) {
      try {
        listener(newTier);
      } catch (err) {
        console.error('[ScrollCraft] Tier change listener error:', err);
      }
    }
  }

  private syncDomAttribute(): void {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-scrollcraft-tier', this.currentTier);
    }
  }

  public subscribe(listener: TierChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.currentTier);
    return () => this.listeners.delete(listener);
  }

  public reset(tier?: PerformanceTier): void {
    this.currentTier = tier ?? detectPerformanceTier();
    this.syncDomAttribute();
    this.listeners.clear();
  }
}

function detectLowEndGpu(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return true; // No WebGL support at all => low tier
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      const rendererLower = String(renderer).toLowerCase();
      // Software renderers
      if (/swiftshader|llvmpipe|softpipe|mesa|software|virtualbox|vmware|basic render/i.test(rendererLower)) {
        return true;
      }
      // Low-end mobile / legacy GPUs
      if (/mali-4|mali-t6|mali-t7|mali-t8|mali-g31|mali-g51|mali-g52|adreno\s*(2|3|4|504|505|506|508|509|610|612)|powervr\s*(sgx|ge8)|intel\s*(hd\s*graphics\s*(2000|3000|4000|2500|4400|515|520|500|505)|gma)/i.test(rendererLower)) {
        return true;
      }
    }
  } catch {
    // Canvas or WebGL context creation failed or blocked
  }
  return false;
}

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') {
    return 'balanced';
  }

  if (cachedTier !== null) {
    return cachedTier;
  }

  try {
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');
    const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '');
    const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || (isMobile ? 4 : 4)) : 4;
    // On mobile, default memory assumption should be conservative (4GB) since deviceMemory is undefined on Safari/iOS
    const memory = typeof navigator !== 'undefined' && 'deviceMemory' in navigator
      ? (navigator as any).deviceMemory
      : (isMobile ? 4 : 8);

    // 0. User Preferences / Network Constraints
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSaveData = typeof navigator !== 'undefined' &&
      (navigator as any).connection?.saveData === true;

    if (prefersReducedMotion || isSaveData) {
      cachedTier = 'low';
      return cachedTier;
    }

    // 1. GPU Check: software renderers or weak integrated mobile GPUs
    if (detectLowEndGpu()) {
      cachedTier = 'low';
      return cachedTier;
    }

    // 2. Low Tier:
    // - 4 or fewer cores on mobile (budget entry mobile devices)
    // - 4 or fewer cores on desktop
    // - 4GB or less system memory
    // - 6 or fewer cores on mobile (entry/mid big.LITTLE Cortex-A53/A55)
    if (cores <= 4 || memory <= 4 || (isMobile && cores <= 6)) {
      cachedTier = 'low';
      return cachedTier;
    }

    // 3. High Tier:
    // Strictly powerful desktop non-Safari machines with 8+ high-performance cores and >4GB RAM
    // Mobile and Safari are capped at 'balanced' to prevent GPU layer memory exhaustion and thermal throttling
    if (cores >= 8 && memory > 4 && !isMobile && !isSafari) {
      cachedTier = 'high';
      return cachedTier;
    }

    // Default to 'balanced'. The Ticker's rolling sampler will autonomously
    // self-heal and step down to 'low' if sustained frame drops occur.
    cachedTier = 'balanced';
    return cachedTier;
  } catch {
    cachedTier = 'balanced';
    return cachedTier;
  }
}

export const Capabilities = {
  /**
   * Lazily evaluates and caches browser capabilities.
   */
  get(): CapabilityMatrix {
    if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.supports) {
      return {
        viewTimeline: false,
        animationRange: false,
        scrollTimeline: false,
        isNativeReady: false,
      };
    }

    if (cachedCapabilities !== null) {
      return cachedCapabilities;
    }

    const viewTimeline = CSS.supports('view-timeline-name', '--x');
    const animationRange = CSS.supports('animation-range', 'entry 0% exit 100%');
    const scrollTimeline = CSS.supports('scroll-timeline-name', '--x');

    cachedCapabilities = {
      viewTimeline,
      animationRange,
      scrollTimeline,
      isNativeReady: viewTimeline && animationRange,
    };

    return cachedCapabilities;
  },

  /**
   * Hard resets the cache. Primarily for testing environments.
   */
  reset(): void {
    cachedCapabilities = null;
    cachedTier = null;
    ScrollCraftTierStore.get().reset();
  }
};

export const tierStore = /* @__PURE__ */ ScrollCraftTierStore.get();
