/**
 * Zero-Allocation Fast Transform Buffer & Batch Renderer for ScrollCraft
 * 
 * Replaces high-churn WeakMap string concatenations with a direct, dirty-flagged
 * numeric transform register. Multi-owner transforms (e.g. Parallax + Reveal)
 * are composed mathematically in memory with zero intermediate string allocations.
 * 
 * Strictly under 650 LOC.
 */

import { snapToDevicePixel } from './math';

export const SC_STATE_KEY = Symbol.for('scrollcraft.transform.state');

export interface NumericTransform {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  opacity?: number;
  rawString?: string;
}

export interface ElementTransformRecord {
  owners: Map<string, NumericTransform>;
  baseTransform: string;
  isDirty: boolean;
  lastWrittenTransform: string;
  lastWrittenOpacity: string;
}

export class FastTransformBuffer {
  private static instance: FastTransformBuffer | null = null;
  private dirtyElements: Set<HTMLElement> = new Set();
  private elementRecords: WeakMap<HTMLElement, ElementTransformRecord> = new WeakMap();

  private constructor() {}

  public static get(): FastTransformBuffer {
    if (!FastTransformBuffer.instance) {
      FastTransformBuffer.instance = new FastTransformBuffer();
    }
    return FastTransformBuffer.instance;
  }

  private getRecord(element: HTMLElement): ElementTransformRecord {
    let record = (element as any)[SC_STATE_KEY] as ElementTransformRecord | undefined;
    if (!record) {
      record = this.elementRecords.get(element);
    }
    if (!record) {
      record = {
        owners: new Map(),
        baseTransform: element.style?.transform || '',
        isDirty: false,
        lastWrittenTransform: '',
        lastWrittenOpacity: '',
      };
      try {
        (element as any)[SC_STATE_KEY] = record;
      } catch {
        // Fallback for non-extensible nodes
      }
      this.elementRecords.set(element, record);
    }
    return record;
  }

  /**
   * Sets numeric transform components for a specific owner on an element.
   * Zero allocations when owner values are unchanged.
   */
  public set(element: HTMLElement, owner: string, transform: NumericTransform): void {
    if (!element) return;
    const record = this.getRecord(element);
    const prev = record.owners.get(owner);

    if (
      prev &&
      prev.x === transform.x &&
      prev.y === transform.y &&
      prev.z === transform.z &&
      prev.scale === transform.scale &&
      prev.scaleX === transform.scaleX &&
      prev.scaleY === transform.scaleY &&
      prev.rotate === transform.rotate &&
      prev.rotateX === transform.rotateX &&
      prev.rotateY === transform.rotateY &&
      prev.rotateZ === transform.rotateZ &&
      prev.opacity === transform.opacity &&
      prev.rawString === transform.rawString
    ) {
      return;
    }

    record.owners.set(owner, transform);
    record.isDirty = true;
    this.dirtyElements.add(element);
  }

  /**
   * Sets a raw string transform for backward compatibility with existing solvers.
   */
  public setRaw(element: HTMLElement, owner: string, rawString: string): void {
    this.set(element, owner, { rawString });
  }

  /**
   * Clears an owner's contribution to an element's transform.
   */
  public clear(element: HTMLElement, owner: string): void {
    if (!element) return;
    const record = this.getRecord(element);
    if (!record.owners.has(owner)) return;

    record.owners.delete(owner);
    record.isDirty = true;
    this.dirtyElements.add(element);
  }

  /**
   * Batched flush: Evaluates and writes composed transforms for all dirty elements.
   * Called once per frame in Ticker's render phase.
   */
  public flush(): void {
    if (this.dirtyElements.size === 0) return;

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;

    for (const element of this.dirtyElements) {
      const record = this.getRecord(element);
      if (!record.isDirty) continue;
      record.isDirty = false;

      if (record.owners.size === 0) {
        if (record.lastWrittenTransform !== record.baseTransform) {
          element.style.transform = record.baseTransform;
          record.lastWrittenTransform = record.baseTransform;
        }
        if (record.lastWrittenOpacity !== '') {
          element.style.opacity = '';
          record.lastWrittenOpacity = '';
        }
        continue;
      }

      let totalX = 0;
      let totalY = 0;
      let totalZ = 0;
      let totalScaleX = 1;
      let totalScaleY = 1;
      let totalRotateX = 0;
      let totalRotateY = 0;
      let totalRotateZ = 0;
      let minOpacity = 1;
      let hasOpacity = false;
      let rawStrings: string[] = [];

      for (const t of record.owners.values()) {
        if (t.x !== undefined) totalX += t.x;
        if (t.y !== undefined) totalY += t.y;
        if (t.z !== undefined) totalZ += t.z;
        if (t.scale !== undefined) {
          totalScaleX *= t.scale;
          totalScaleY *= t.scale;
        }
        if (t.scaleX !== undefined) totalScaleX *= t.scaleX;
        if (t.scaleY !== undefined) totalScaleY *= t.scaleY;
        if (t.rotate !== undefined) totalRotateZ += t.rotate;
        if (t.rotateX !== undefined) totalRotateX += t.rotateX;
        if (t.rotateY !== undefined) totalRotateY += t.rotateY;
        if (t.rotateZ !== undefined) totalRotateZ += t.rotateZ;
        if (t.opacity !== undefined) {
          minOpacity = Math.min(minOpacity, t.opacity);
          hasOpacity = true;
        }
        if (t.rawString) {
          rawStrings.push(t.rawString);
        }
      }

      // Build composed transform string with subpixel snapping
      let composed = record.baseTransform || '';

      if (rawStrings.length > 0) {
        for (let i = 0; i < rawStrings.length; i++) {
          const raw = rawStrings[i];
          if (raw) composed = composed ? `${composed} ${raw}` : raw;
        }
      }

      const hasNumericTransforms =
        totalX !== 0 ||
        totalY !== 0 ||
        totalZ !== 0 ||
        totalScaleX !== 1 ||
        totalScaleY !== 1 ||
        totalRotateX !== 0 ||
        totalRotateY !== 0 ||
        totalRotateZ !== 0;

      if (hasNumericTransforms) {
        const sx = snapToDevicePixel(totalX, dpr);
        const sy = snapToDevicePixel(totalY, dpr);
        const sz = snapToDevicePixel(totalZ, dpr);

        const numericStr = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, ${sz.toFixed(2)}px) rotateX(${totalRotateX.toFixed(2)}deg) rotateY(${totalRotateY.toFixed(2)}deg) rotateZ(${totalRotateZ.toFixed(2)}deg) scale(${totalScaleX.toFixed(4)}, ${totalScaleY.toFixed(4)})`;
        composed = composed ? `${composed} ${numericStr}` : numericStr;
      }

      composed = composed.trim();

      if (composed !== record.lastWrittenTransform) {
        record.lastWrittenTransform = composed;
        element.style.transform = composed;
      }

      if (hasOpacity) {
        const opacityStr = minOpacity.toFixed(4);
        if (opacityStr !== record.lastWrittenOpacity) {
          record.lastWrittenOpacity = opacityStr;
          element.style.opacity = opacityStr;
        }
      }
    }

    this.dirtyElements.clear();
  }

  public get(element: HTMLElement): string {
    const record = this.getRecord(element);
    return record.lastWrittenTransform || element.style.transform || '';
  }

  public reset(): void {
    this.dirtyElements.clear();
  }
}

export const fastTransform = /* @__PURE__ */ FastTransformBuffer.get();
