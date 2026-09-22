/**
 * Adaptive Quality Governor for ScrollCraft
 *
 * Prevents GPU fragment shader and CPU software-raster bottlenecks (e.g. blur(20px))
 * on lower-spec hardware by dynamically throttling blurs, backdrop filters, and promoted layers.
 *
 * Tier Hierarchy:
 * - High (Tier 3): Full unconstrained quality (blur(20px)+, unlimited layers)
 * - Balanced (Tier 2): Clamped to max 8px blur, max 8 concurrent compositor layers
 * - Low (Tier 1): Clamped to 0px blur (rasterizer choke avoided), max 3 compositor layers
 *
 * Strictly under 650 LOC.
 */

import { PerformanceTier } from './types';
import { tierStore } from './feature-detection';

export interface QualityConfig {
  maxBlurHigh: number;
  maxBlurBalanced: number;
  maxBlurLow: number;
  maxLayersHigh: number;
  maxLayersBalanced: number;
  maxLayersLow: number;
}

export const DEFAULT_QUALITY_CONFIG: QualityConfig = {
  maxBlurHigh: 100,
  maxBlurBalanced: 8,
  maxBlurLow: 0,
  maxLayersHigh: 32,
  maxLayersBalanced: 8,
  maxLayersLow: 3,
};

export class AdaptiveQualityGovernor {
  private static instance: AdaptiveQualityGovernor | null = null;
  private config: QualityConfig;

  private constructor(config: Partial<QualityConfig> = {}) {
    this.config = { ...DEFAULT_QUALITY_CONFIG, ...config };
  }

  public static get(config?: Partial<QualityConfig>): AdaptiveQualityGovernor {
    if (!AdaptiveQualityGovernor.instance) {
      AdaptiveQualityGovernor.instance = new AdaptiveQualityGovernor(config);
    }
    return AdaptiveQualityGovernor.instance;
  }

  public getTier(): PerformanceTier {
    return tierStore.getTier();
  }

  public setTier(tier: PerformanceTier): void {
    tierStore.setTier(tier);
  }

  public subscribe(listener: (tier: PerformanceTier) => void): () => void {
    return tierStore.subscribe(listener);
  }

  /**
   * Clamps requested blur radius in pixels according to current hardware tier.
   * - High: returns requested value
   * - Balanced: clamped to max 8px
   * - Low: clamped to 0px (bypasses fragment shader bottleneck completely)
   */
  public clampBlur(requestedBlurPx: number): number {
    if (requestedBlurPx <= 0) return 0;
    const tier = this.getTier();

    switch (tier) {
      case 'high':
        return Math.min(requestedBlurPx, this.config.maxBlurHigh);
      case 'balanced':
        return Math.min(requestedBlurPx, this.config.maxBlurBalanced);
      case 'low':
      default:
        return this.config.maxBlurLow; // strictly 0px
    }
  }

  /**
   * Clamps CSS backdrop-filter string according to hardware tier.
   * On low tier, returns 'none' to eliminate expensive offscreen framebuffer passes.
   * On balanced tier, clamps any blur(Npx) where N > 8px to blur(8px).
   */
  public clampBackdropFilter(requestedFilter: string): string {
    if (!requestedFilter || requestedFilter === 'none') return 'none';
    const tier = this.getTier();

    if (tier === 'low') {
      return 'none';
    }

    if (tier === 'balanced') {
      return requestedFilter.replace(/blur\(\s*(\d+(?:\.\d+)?)\s*px\s*\)/gi, (_match, p1) => {
        const val = parseFloat(p1);
        const clamped = Math.min(val, this.config.maxBlurBalanced);
        return `blur(${clamped}px)`;
      });
    }

    return requestedFilter;
  }

  /**
   * Returns maximum concurrent GPU compositor layers permitted for current tier.
   */
  public getMaxLayers(): number {
    const tier = this.getTier();
    switch (tier) {
      case 'high':
        return this.config.maxLayersHigh;
      case 'balanced':
        return this.config.maxLayersBalanced;
      case 'low':
      default:
        return this.config.maxLayersLow;
    }
  }

  /**
   * Returns whether heavy GPU effects (e.g. multi-pass gaussian blur, backdrop filters) are allowed.
   */
  public isHeavyEffectsAllowed(): boolean {
    return this.getTier() !== 'low';
  }

  public resetConfig(config?: Partial<QualityConfig>): void {
    this.config = { ...DEFAULT_QUALITY_CONFIG, ...config };
  }
}

export const adaptiveQualityGovernor = /* @__PURE__ */ AdaptiveQualityGovernor.get();
