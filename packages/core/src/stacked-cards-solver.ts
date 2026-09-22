/**
 * 120 FPS High-Performance Stacked Cards Solver for ScrollCraft
 *
 * Architectural Driver Classification:
 * STRICTLY JS/TICKER-DRIVEN SOLVER.
 * Dynamic sibling z-index depth scaling, variable individual card offsetHeight
 * measurements, and dynamic runtime pointer-events gating cannot be expressed in
 * static CSS scroll-driven keyframes (animation-timeline).
 *
 * Strictly under 650 LOC.
 */

import { clamp } from './math';
import { TransformComposer, smartCompositor } from './dom';

export interface StackedCardsOptions {
  /** Cascade top spacing between stacked cards in pixels. Default: 40 */
  offset?: number;
  /** Sticky top pin anchor position in pixels from viewport top. Default: 100 */
  top?: number;
  /** Scale reduction step per buried card (e.g. 0.05). Default: 0.05 */
  scaleStep?: number;
  /** Minimum scale bound for the deepest buried card. Default: 0.8 */
  minScale?: number;
  /** Travel scroll distance per card in pixels. Default: 400 */
  cardDistance?: number;
}

interface CardRuntimeState {
  element: HTMLElement;
  initialPointerEvents: string;
  measuredHeight: number;
  pinStartY: number;
  pinEndY: number;
  currentY: number;
  currentScale: number;
  isBuried: boolean;
}

export class StackedCardsSolver {
  private container: HTMLElement;
  private cards: CardRuntimeState[] = [];
  private options: Required<StackedCardsOptions>;
  private containerTop: number = 0;
  private containerHeight: number = 0;
  private isVisible: boolean = true;

  constructor(
    container: HTMLElement,
    cardElements: HTMLElement[],
    options: StackedCardsOptions = {}
  ) {
    this.container = container;
    this.options = {
      offset: options.offset ?? 40,
      top: options.top ?? 100,
      scaleStep: options.scaleStep ?? 0.05,
      minScale: options.minScale ?? 0.8,
      cardDistance: options.cardDistance ?? 400,
    };

    this.cards = cardElements.map((el, index) => {
      smartCompositor.promote(el);
      el.style.zIndex = String(index + 1);
      return {
        element: el,
        initialPointerEvents: el.style.pointerEvents || '',
        measuredHeight: 0,
        pinStartY: 0,
        pinEndY: 0,
        currentY: 0,
        currentScale: 1,
        isBuried: false,
      };
    });

    this.measure();
  }

  public setVisible(visible: boolean): void {
    this.isVisible = visible;
  }

  /**
   * Phase 1: Measure
   * Measures container geometry and individual card heights.
   * Handles variable-height cards without layout distortion.
   */
  public measure(): void {
    if (typeof window === 'undefined' || !this.container) return;

    const scrollTop = window.scrollY || window.pageYOffset;
    const containerRect = this.container.getBoundingClientRect();
    this.containerTop = containerRect.top + scrollTop;
    this.containerHeight = this.container.offsetHeight || containerRect.height || 2000;

    let accumulatedDistance = 0;
    const totalCards = this.cards.length;

    for (let i = 0; i < totalCards; i++) {
      const card = this.cards[i];
      const cardRect = card.element.getBoundingClientRect();
      card.measuredHeight = card.element.offsetHeight || cardRect.height || 300;

      const offsetTop = card.element.offsetTop;
      const targetStickyTop = this.options.top + i * this.options.offset;

      // When rendered in real DOM with layout, offsetTop reflects the natural document flow
      if (offsetTop > 0) {
        card.pinStartY = this.containerTop + offsetTop - targetStickyTop;
      } else {
        // Fallback for jsdom / unrendered elements / first card
        card.pinStartY = this.containerTop + accumulatedDistance;
      }

      // Unique card travel duration accounts for its individual height
      const individualDistance = Math.max(card.measuredHeight * 0.5, this.options.cardDistance);
      card.pinEndY = card.pinStartY + individualDistance;

      accumulatedDistance += individualDistance;
    }
  }

  /**
   * Phase 2: Update
   * Pure mathematical calculations in typed state with zero DOM reads/writes.
   */
  public update(scrollY: number): void {
    if (!this.isVisible || this.cards.length === 0) return;

    const totalCards = this.cards.length;
    // Boundary unpinning: When scroll exceeds container runway, cards stop following scroll
    // and naturally scroll away with the container so they never block subsequent sections!
    const lastCardHeight = this.cards[totalCards - 1]?.measuredHeight || 300;
    const maxStackHeight = lastCardHeight + this.options.top;
    const maxPinY = this.containerTop + Math.max(0, this.containerHeight - maxStackHeight);
    const effectiveScroll = Math.min(scrollY, maxPinY);

    // Pre-calculate the pinning and approach state across cards in O(n)
    let fullPinnedCount = 0;
    while (fullPinnedCount < totalCards && scrollY >= this.cards[fullPinnedCount].pinStartY) {
      fullPinnedCount++;
    }

    let approachFraction = 0;
    if (fullPinnedCount < totalCards) {
      const approachingCard = this.cards[fullPinnedCount];
      const approachDist = Math.max(100, this.options.cardDistance);
      if (scrollY > approachingCard.pinStartY - approachDist) {
        approachFraction = clamp(
          (scrollY - (approachingCard.pinStartY - approachDist)) / approachDist,
          0,
          1
        );
      }
    }

    for (let i = 0; i < totalCards; i++) {
      const card = this.cards[i];

      // Check if scroll has reached this card's pin point
      if (scrollY < card.pinStartY) {
        // Before pinning: natural flow position
        card.currentY = 0;
        card.currentScale = 1;
        card.isBuried = false;
      } else {
        // Pinned: travel with scroll until container runway finishes
        const pinnedY = effectiveScroll - card.pinStartY;
        card.currentY = Math.max(0, pinnedY);

        // O(1) depth calculation: cards strictly above i that are pinned + approaching card fraction
        const buriedDepth = Math.max(0, fullPinnedCount - 1 - i) + approachFraction;

        card.isBuried = buriedDepth >= 1;

        // Depth scale degradation: cards underneath scale down smoothly
        card.currentScale = clamp(
          1 - (buriedDepth * this.options.scaleStep),
          this.options.minScale,
          1
        );
      }
    }
  }

  public getBounds(): { startY: number; endY: number } {
    const wh = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      startY: Math.max(0, this.containerTop - wh),
      endY: this.containerTop + this.containerHeight,
    };
  }

  public clamp(boundaryProgress: number): void {
    const bounds = this.getBounds();
    if (boundaryProgress <= 0) {
      this.update(bounds.startY - 1);
    } else {
      this.update(bounds.endY + 1);
    }
    this.render();
  }

  /**
   * Phase 3: Render
   * Batched GPU compositor style writes and dynamic pointer-events gating.
   */
  public render(): void {
    if (!this.isVisible) return;

    const total = this.cards.length;
    for (let i = 0; i < total; i++) {
      const card = this.cards[i];

      // 1. Direct GPU Transform composition
      const isSticky =
        card.element &&
        (card.element.style?.position === 'sticky' ||
          (typeof window !== 'undefined' &&
            typeof window.getComputedStyle === 'function' &&
            window.getComputedStyle(card.element)?.position === 'sticky'));

      if (isSticky) {
        TransformComposer.setNumeric(card.element, 'stacked-cards', {
          scale: card.currentScale,
        });
      } else {
        TransformComposer.setNumeric(card.element, 'stacked-cards', {
          y: card.currentY,
          scale: card.currentScale,
        });
      }

      // 2. Dynamic pointer-events gating:
      // When a card is buried underneath subsequent cards, disable pointer events
      // to eliminate ghost clicks on covered interactive buttons/links.
      const targetPointerEvents = card.isBuried ? 'none' : 'auto';
      if (card.element.style.pointerEvents !== targetPointerEvents) {
        card.element.style.pointerEvents = targetPointerEvents;
      }
    }
  }

  public getCardsState(): Array<{ currentY: number; currentScale: number; isBuried: boolean }> {
    return this.cards.map((c) => ({
      currentY: c.currentY,
      currentScale: c.currentScale,
      isBuried: c.isBuried,
    }));
  }

  public destroy(): void {
    for (const card of this.cards) {
      smartCompositor.destroy(card.element);
      TransformComposer.clear(card.element, 'stacked-cards');
      card.element.style.pointerEvents = card.initialPointerEvents;
      card.element.style.zIndex = '';
    }
    this.cards = [];
  }
}
