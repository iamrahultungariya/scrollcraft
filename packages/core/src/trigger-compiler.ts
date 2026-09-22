/**
 * Zero-Allocation Compiled Trigger Engine for ScrollCraft
 * Pre-compiles trigger strings ('top bottom', 'center 50%', 'bottom 200px', '+=500')
 * into high-performance numeric evaluator functions.
 * Strictly under 650 LOC.
 */

export interface CompiledTrigger {
  raw: string;
  evaluate: (rect: { top: number; height: number }, windowHeight: number, scrollTop: number) => number;
}

const triggerCache = new Map<string, CompiledTrigger>();

/**
 * Compiles a scroll trigger string into a zero-allocation evaluator.
 * Results are memoized globally to eliminate runtime regex and string operations.
 */
export function compileTrigger(trigger: string | undefined): CompiledTrigger {
  const safeTrigger = trigger && typeof trigger === 'string' && trigger.trim() ? trigger.trim() : 'top bottom';
  const cached = triggerCache.get(safeTrigger);
  if (cached) return cached;

  const parts = safeTrigger.split(/\s+/);
  const elAlign = parts[0] || 'top';
  const vpAlign = parts[1] || 'bottom';

  // Relative offset syntax: '+=200' or '-=150'
  const isRelative = vpAlign.startsWith('+=') || vpAlign.startsWith('-=');
  const relativeOffset = isRelative ? parseFloat(vpAlign.replace('=', '')) : 0;

  // Pre-calculate element alignment logic
  let elOffsetRatio = 0;
  let elFixedPx: number | null = null;
  if (elAlign === 'center') {
    elOffsetRatio = 0.5;
  } else if (elAlign === 'bottom') {
    elOffsetRatio = 1.0;
  } else if (elAlign.endsWith('%')) {
    elOffsetRatio = parseFloat(elAlign) / 100;
  } else if (elAlign.endsWith('px')) {
    elFixedPx = parseFloat(elAlign);
  }

  // Pre-calculate viewport alignment logic
  let vpOffsetRatio = 0;
  let vpFixedPx: number | null = null;
  if (vpAlign === 'center') {
    vpOffsetRatio = 0.5;
  } else if (vpAlign === 'bottom') {
    vpOffsetRatio = 1.0;
  } else if (vpAlign.endsWith('%')) {
    vpOffsetRatio = parseFloat(vpAlign) / 100;
  } else if (vpAlign.endsWith('px')) {
    vpFixedPx = parseFloat(vpAlign);
  }

  const evaluate = (
    rect: { top: number; height: number },
    windowHeight: number,
    scrollTop: number
  ): number => {
    const elementTopAbs = rect.top + scrollTop;
    const elOffset = elFixedPx !== null ? elFixedPx : rect.height * elOffsetRatio;

    if (isRelative) {
      return elementTopAbs + elOffset + relativeOffset;
    }

    const vpOffset = vpFixedPx !== null ? vpFixedPx : windowHeight * vpOffsetRatio;
    return elementTopAbs + elOffset - vpOffset;
  };

  const compiled: CompiledTrigger = {
    raw: safeTrigger,
    evaluate,
  };

  triggerCache.set(safeTrigger, compiled);
  return compiled;
}

/**
 * Direct evaluation helper with memoized compilation.
 */
export function evaluateTrigger(
  trigger: string | undefined,
  rect: { top: number; height: number },
  windowHeight: number,
  scrollTop: number
): number {
  return compileTrigger(trigger).evaluate(rect, windowHeight, scrollTop);
}

/**
 * Resets trigger cache during test teardown.
 */
export function clearTriggerCache(): void {
  triggerCache.clear();
}
