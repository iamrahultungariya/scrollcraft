/**
 * Style Ownership Registry for ScrollCraft
 *
 * Provides deterministic property ownership, initial inline style snapshotting,
 * multi-owner conflict resolution, and non-destructive teardown.
 *
 * Owned properties:
 * - opacity
 * - filter
 * - borderRadius
 * - willChange
 * - transition
 * - CSS variables (--*)
 * - SVG strokeDasharray, strokeDashoffset
 *
 * Strictly under 650 LOC.
 */

interface PropertyState {
  initial: string;
  owners: Map<string, string>;
  lastApplied: string;
}

export class StyleOwnershipRegistry {
  private static instance: StyleOwnershipRegistry | null = null;
  private elements = new WeakMap<HTMLElement | SVGElement, Map<string, PropertyState>>();

  private constructor() {}

  public static get(): StyleOwnershipRegistry {
    if (!StyleOwnershipRegistry.instance) {
      StyleOwnershipRegistry.instance = new StyleOwnershipRegistry();
    }
    return StyleOwnershipRegistry.instance;
  }

  private getElementMap(element: HTMLElement | SVGElement): Map<string, PropertyState> {
    let propMap = this.elements.get(element);
    if (!propMap) {
      propMap = new Map();
      this.elements.set(element, propMap);
    }
    return propMap;
  }

  private getInitialStyle(element: HTMLElement | SVGElement, property: string): string {
    if (!element || !element.style) return '';
    if (property.startsWith('--')) {
      return element.style.getPropertyValue(property) || '';
    }
    return (element.style as any)[property] || '';
  }

  private setRawStyle(element: HTMLElement | SVGElement, property: string, value: string): void {
    if (!element || !element.style) return;
    if (property.startsWith('--')) {
      if (value) {
        element.style.setProperty(property, value);
      } else {
        element.style.removeProperty(property);
      }
    } else {
      (element.style as any)[property] = value;
    }
  }

  /**
   * Sets an owned style property on an element.
   * Snapshots initial inline value on first write by any owner.
   */
  public set(
    element: HTMLElement | SVGElement,
    owner: string,
    property: string,
    value: string
  ): void {
    if (!element || !element.style) return;

    const propMap = this.getElementMap(element);
    let state = propMap.get(property);

    if (!state) {
      state = {
        initial: this.getInitialStyle(element, property),
        owners: new Map(),
        lastApplied: '',
      };
      propMap.set(property, state);
    }

    if (state.owners.get(owner) === value) return;
    state.owners.set(owner, value);

    this.applyEffective(element, property, state);
  }

  /**
   * Clears an owner's claim on a specific property, or all properties on an element.
   * Restores caller's initial inline value if no owners remain.
   */
  public clear(
    element: HTMLElement | SVGElement,
    owner: string,
    property?: string
  ): void {
    if (!element || !element.style) return;

    const propMap = this.elements.get(element);
    if (!propMap) return;

    if (property) {
      const state = propMap.get(property);
      if (!state || !state.owners.has(owner)) return;
      state.owners.delete(owner);
      this.applyEffective(element, property, state);

      if (state.owners.size === 0) {
        propMap.delete(property);
      }
    } else {
      const props = Array.from(propMap.keys());
      for (const prop of props) {
        const state = propMap.get(prop);
        if (state && state.owners.has(owner)) {
          state.owners.delete(owner);
          this.applyEffective(element, prop, state);
          if (state.owners.size === 0) {
            propMap.delete(prop);
          }
        }
      }
    }
  }

  public lease(
    element: HTMLElement | SVGElement,
    owner: string,
    property: string,
    value: string
  ): void {
    this.set(element, owner, property, value);
  }

  public release(
    element: HTMLElement | SVGElement,
    owner: string,
    property?: string
  ): void {
    this.clear(element, owner, property);
  }

  private applyEffective(
    element: HTMLElement | SVGElement,
    property: string,
    state: PropertyState
  ): void {
    let effectiveValue = '';

    if (state.owners.size === 0) {
      effectiveValue = state.initial;
    } else if (property === 'willChange') {
      // Composition for willChange: union of tokens
      const tokenSet = new Set<string>();
      if (state.initial && state.initial !== 'auto') {
        state.initial.split(',').forEach((t) => {
          const trimmed = t.trim();
          if (trimmed && trimmed !== 'auto') tokenSet.add(trimmed);
        });
      }
      for (const val of state.owners.values()) {
        if (val && val !== 'auto') {
          val.split(',').forEach((t) => {
            const trimmed = t.trim();
            if (trimmed && trimmed !== 'auto') tokenSet.add(trimmed);
          });
        }
      }
      effectiveValue = tokenSet.size > 0 ? Array.from(tokenSet).join(', ') : state.initial || '';
    } else if (property === 'filter') {
      // Composition for filter: combine unique active filters
      const filterParts: string[] = [];
      for (const val of state.owners.values()) {
        if (val && val !== 'none' && !filterParts.includes(val)) {
          filterParts.push(val);
        }
      }
      effectiveValue = filterParts.length > 0 ? filterParts.join(' ') : state.initial || '';
    } else {
      // Standard precedence: latest registered owner value
      const values = Array.from(state.owners.values());
      effectiveValue = values[values.length - 1] ?? state.initial;
    }

    if (effectiveValue !== state.lastApplied) {
      state.lastApplied = effectiveValue;
      this.setRawStyle(element, property, effectiveValue);
    }
  }

  /**
   * Returns snapshotted initial value before engine touched the element.
   */
  public getInitial(element: HTMLElement | SVGElement, property: string): string {
    const propMap = this.elements.get(element);
    return propMap?.get(property)?.initial ?? this.getInitialStyle(element, property);
  }

  /**
   * Complete teardown: restores all initial styles on element.
   */
  public destroy(element: HTMLElement | SVGElement): void {
    const propMap = this.elements.get(element);
    if (!propMap) return;

    for (const [prop, state] of propMap.entries()) {
      state.owners.clear();
      this.setRawStyle(element, prop, state.initial);
    }
    this.elements.delete(element);
  }
}

export const styleRegistry = /* @__PURE__ */ StyleOwnershipRegistry.get();
