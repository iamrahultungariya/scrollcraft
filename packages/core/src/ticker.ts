/**
 * Zero-Allocation Autonomous Game Ticker for ScrollCraft
 * Coordinates measure, update, and render phases at 120 FPS.
 * Features:
 * - Dynamic dormancy / viewport culling task management
 * - 60-frame asymmetric hysteresis performance sampler
 * - Background tab suspension with mid-scroll unhide recovery
 * - Idle sleep and passive gesture wake-up
 * Strictly under 650 LOC.
 */

import { TickerCallback, TickerErrorHandler, TickerPhase } from './types';
import { tierStore } from './feature-detection';

export const MIN_DELTA_TIME = 0.001;
export const MAX_DELTA_TIME = 0.033;
const COOLDOWN_STEP_UP_MS = 3000;

export class Ticker {
  private static instance: Ticker | null = null;

  private measureTasks: Map<string, TickerCallback> = new Map();
  private driverTasks: Map<string, TickerCallback> = new Map();
  private updateTasks: Map<string, TickerCallback> = new Map();
  private renderTasks: Map<string, TickerCallback> = new Map();

  private measureTasksArray: Array<[string, TickerCallback]> = [];
  private driverTasksArray: Array<[string, TickerCallback]> = [];
  private updateTasksArray: Array<[string, TickerCallback]> = [];
  private renderTasksArray: Array<[string, TickerCallback]> = [];
  private taskArraysDirty = true;
  private dormantTasks: Set<string> = new Set();
  private errorHandler: TickerErrorHandler | null = null;

  private isRunning: boolean = false;
  private eventsBound: boolean = false;
  private rafId: number | null = null;
  private lastTime: number = 0;
  private elapsedTime: number = 0;

  // Frame sampler for runtime self-healing
  private frameHistory: number[] = new Array(60).fill(0.016);
  private frameHistoryIndex: number = 0;
  private sampledFrameCount: number = 0;
  private lastStepTime: number = 0;
  private justWokeUp: boolean = true;
  private emaDelta: number = 0;

  /**
   * Benchmark Contamination Guard:
   * When true, disables performance.mark and performance.measure so synthetic test baselines
   * (e.g. engine-stress.test.ts) are not skewed by tracing instrumentation overhead.
   */
  public benchmarkingMode: boolean = false;

  /**
   * Opt-in Diagnostic Profiling:
   * By default false to eliminate catastrophic User Timing buffer floods and GC pauses.
   */
  public profilingEnabled: boolean = false;

  public setProfiling(enabled: boolean): void {
    this.profilingEnabled = enabled;
  }

  // Frame drop ring buffer (last 60 frames)
  private droppedFrames: number = 0;
  private droppedFramesHistory: number[] = new Array(60).fill(0);
  private droppedFramesIndex: number = 0;

  // Adaptive target refresh rate calibration (60Hz / 90Hz / 120Hz / 144Hz)
  private detectedTargetInterval: number = 0.01667;
  private calibrationSamples: number[] = [];

  private constructor() {}

  public static get(): Ticker {
    if (!Ticker.instance) {
      Ticker.instance = new Ticker();
    }
    return Ticker.instance;
  }

  private syncTaskArrays(): void {
    if (!this.taskArraysDirty) return;
    this.measureTasksArray = Array.from(this.measureTasks.entries());
    this.driverTasksArray = Array.from(this.driverTasks.entries());
    this.updateTasksArray = Array.from(this.updateTasks.entries());
    this.renderTasksArray = Array.from(this.renderTasks.entries());
    this.taskArraysDirty = false;
  }

  private getPhaseTasks(phase: TickerPhase): Map<string, TickerCallback> {
    switch (phase) {
      case 'measure':
        return this.measureTasks;
      case 'driver':
        return this.driverTasks;
      case 'update':
        return this.updateTasks;
      case 'render':
        return this.renderTasks;
    }
  }

  /**
   * Register a task in one of four engine phases (measure -> driver -> update -> render).
   */
  public add(id: string, phase: TickerPhase, callback: TickerCallback): void {
    const tasks = this.getPhaseTasks(phase);
    if (tasks.get(id) === callback) {
      this.ensureRunning();
      return;
    }
    tasks.set(id, callback);
    this.dormantTasks.delete(id);
    this.taskArraysDirty = true;
    this.ensureRunning();
  }

  /**
   * Remove a registered task. If phase is omitted, removes from all phases.
   */
  public remove(id: string, phase?: TickerPhase): void {
    if (phase) {
      const tasks = this.getPhaseTasks(phase);
      tasks.delete(id);
      const stillHasTask =
        this.measureTasks.has(id) ||
        this.driverTasks.has(id) ||
        this.updateTasks.has(id) ||
        this.renderTasks.has(id);
      if (!stillHasTask) {
        this.dormantTasks.delete(id);
      }
    } else {
      this.measureTasks.delete(id);
      this.driverTasks.delete(id);
      this.updateTasks.delete(id);
      this.renderTasks.delete(id);
      this.dormantTasks.delete(id);
    }
    this.taskArraysDirty = true;

    if (!this.hasActiveTasks()) {
      this.stop();
    }
  }

  /**
   * Puts a registered task to sleep (e.g. element is scrolled out of viewport).
   */
  public pauseTask(id: string): void {
    this.dormantTasks.add(id);
    if (!this.hasActiveTasks()) {
      this.stop();
    }
  }

  /**
   * Wakes up a dormant task when its element enters the visibility overdraw margin.
   */
  public resumeTask(id: string): void {
    if (this.dormantTasks.delete(id)) {
      this.ensureRunning();
    }
  }

  public isTaskDormant(id: string): boolean {
    return this.dormantTasks.has(id);
  }

  /**
   * Checks whether any tasks are currently registered and not dormant.
   */
  public hasActiveTasks(): boolean {
    const totalCount =
      this.measureTasks.size +
      this.driverTasks.size +
      this.updateTasks.size +
      this.renderTasks.size;
    if (totalCount === 0) return false;

    for (const id of this.measureTasks.keys()) {
      if (!this.dormantTasks.has(id)) return true;
    }
    for (const id of this.driverTasks.keys()) {
      if (!this.dormantTasks.has(id)) return true;
    }
    for (const id of this.updateTasks.keys()) {
      if (!this.dormantTasks.has(id)) return true;
    }
    for (const id of this.renderTasks.keys()) {
      if (!this.dormantTasks.has(id)) return true;
    }
    return false;
  }

  /**
   * Returns total registered tasks across all 4 phases.
   */
  public getTaskCount(): number {
    return (
      this.measureTasks.size +
      this.driverTasks.size +
      this.updateTasks.size +
      this.renderTasks.size
    );
  }

  public setErrorHandler(handler: TickerErrorHandler | null): void {
    this.errorHandler = handler;
  }

  private runPhase(
    phase: TickerPhase,
    map: Map<string, TickerCallback>,
    tasks: Array<[string, TickerCallback]>,
    dt: number,
    currentTime: number
  ): void {
    const shouldProfile =
      this.profilingEnabled &&
      !this.benchmarkingMode &&
      (tasks.length > 0 || map.size > 0) &&
      typeof performance !== 'undefined' &&
      typeof performance.mark === 'function';

    if (shouldProfile) {
      performance.mark(`sc-${phase}-start`);
    }

    for (let i = 0; i < tasks.length; i++) {
      const [id, callback] = tasks[i];
      // Guard: skip task if removed or marked dormant by visibility culling
      if (!map.has(id) || this.dormantTasks.has(id)) continue;
      try {
        callback(dt, this.elapsedTime, currentTime);
      } catch (error) {
        try {
          if (this.errorHandler) {
            this.errorHandler({ id, phase, error });
          } else if (typeof console !== 'undefined') {
            console.error(`[ScrollCraft] ticker task "${id}" failed during ${phase}.`, error);
          }
        } catch {
          // Diagnostics must never interrupt the RAF loop
        }
      }
    }

    if (shouldProfile) {
      performance.mark(`sc-${phase}-end`);
      try {
        performance.measure(`ScrollCraft:${phase}`, `sc-${phase}-start`, `sc-${phase}-end`);
        if (typeof performance.clearMarks === 'function') {
          performance.clearMarks(`sc-${phase}-start`);
          performance.clearMarks(`sc-${phase}-end`);
        }
      } catch {
        // Safe no-op
      }
    }
  }

  public ensureRunning(): void {
    if (typeof window === 'undefined') return;

    if (!this.eventsBound && typeof document !== 'undefined') {
      this.eventsBound = true;
      document.addEventListener('visibilitychange', this.onVisibilityChange);
      
      // Passive wake listeners for zero-power idle sleep
      const wake = () => this.wake();
      window.addEventListener('wheel', wake, { passive: true });
      window.addEventListener('touchstart', wake, { passive: true });
      window.addEventListener('scroll', wake, { passive: true });
      window.addEventListener('keydown', wake, { passive: true });
    }

    if (this.isRunning) return;
    this.isRunning = true;
    this.justWokeUp = true;
    this.lastTime = performance.now();
    if (typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  public wake(): void {
    if (this.hasActiveTasks()) {
      this.ensureRunning();
    }
  }

  private onVisibilityChange = (): void => {
    if (typeof document === 'undefined') return;

    if (document.hidden) {
      // Invariant 3: Halt ticker completely in background tabs
      this.stop();
    } else {
      // Invariant 3: Wipe 60-frame buffer completely and reset clock
      this.resetFrameHistory();
      this.lastTime = performance.now();

      // Invariant 3 (User comment Issue 2): If active tasks exist, resume immediately
      if (this.hasActiveTasks()) {
        this.ensureRunning();
      }
    }
  };

  private resetFrameHistory(): void {
    this.frameHistory.fill(this.detectedTargetInterval);
    this.frameHistoryIndex = 0;
    this.sampledFrameCount = 0;
    this.droppedFramesHistory.fill(0);
    this.droppedFramesIndex = 0;
    this.calibrationSamples.length = 0;
  }

  private recordFrameDelta(rawDelta: number, currentTime: number): void {
    // 1. In-flight jank detection: clamp extreme spikes to 0.5s (500ms)
    // Real hitches (>100ms) while running are preserved and penalized accurately.
    const effectiveDelta = Math.min(Math.max(rawDelta, 0.001), 0.5);

    // 2. Calibrate display refresh rate dynamically from healthy VSync frames
    // Uses running median of healthy frames to prevent isolated jitter spikes from poisoning calibration.
    if (effectiveDelta >= 0.004 && effectiveDelta <= 0.035) {
      this.calibrationSamples.push(effectiveDelta);
      if (this.calibrationSamples.length >= 30) {
        const sorted = [...this.calibrationSamples].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        if (median <= 0.0078) {
          // 144Hz - 165Hz high-refresh display (target ~6.94ms)
          this.detectedTargetInterval = 0.00694;
        } else if (median <= 0.0098) {
          // 120Hz display (target ~8.33ms)
          this.detectedTargetInterval = 0.00833;
        } else if (median <= 0.0135) {
          // 90Hz display (target ~11.11ms)
          this.detectedTargetInterval = 0.01111;
        } else if (median <= 0.0185) {
          // Standard 60Hz display (target ~16.67ms)
          this.detectedTargetInterval = 0.01667;
        } else {
          // 48Hz - 50Hz display or low-power mode (target ~20.0ms)
          this.detectedTargetInterval = 0.02000;
        }
        this.calibrationSamples.length = 0;
      }
    }

    this.frameHistory[this.frameHistoryIndex] = effectiveDelta;
    this.frameHistoryIndex = (this.frameHistoryIndex + 1) % 60;
    this.sampledFrameCount++;

    // Responsive Exponential Moving Average (alpha = 0.25)
    if (this.emaDelta <= 0) {
      this.emaDelta = effectiveDelta;
    } else {
      this.emaDelta = this.emaDelta * 0.75 + effectiveDelta * 0.25;
    }

    // 3. Adaptive Frame Drop Rule:
    // A frame is dropped when delta exceeds 1.45x target refresh interval.
    const dropThreshold = this.detectedTargetInterval * 1.45;
    const isDrop = effectiveDelta > dropThreshold;
    const missedFrames = isDrop ? Math.max(1, Math.round(effectiveDelta / this.detectedTargetInterval) - 1) : 0;
    this.droppedFramesHistory[this.droppedFramesIndex] = isDrop ? 1 : 0;
    this.droppedFramesIndex = (this.droppedFramesIndex + 1) % 60;
    if (isDrop) this.droppedFrames += missedFrames;

    if (this.sampledFrameCount >= 60) {
      let slowFrames = 0;
      let fastFrames = 0;

      for (let i = 0; i < 60; i++) {
        const d = this.frameHistory[i];
        if (d > 0.0333) slowFrames++;
        if (d < 0.0180) fastFrames++;
      }

      const currentTier = tierStore.getTier();

      // Step-Down: Sustained delta > 33.3ms for >= 45 of 60 frames
      if (slowFrames >= 45 && currentTier !== 'low') {
        const nextTier = currentTier === 'high' ? 'balanced' : 'low';
        tierStore.setTier(nextTier);
        this.lastStepTime = currentTime;
        this.resetFrameHistory();
      } else if (
        fastFrames >= 50 &&
        currentTier !== 'high' &&
        currentTime - this.lastStepTime >= COOLDOWN_STEP_UP_MS
      ) {
        // Step-Up: Sustained delta < 18ms for >= 50 of 60 frames AND 3.0s cooldown passed
        const nextTier = currentTier === 'low' ? 'balanced' : 'high';
        tierStore.setTier(nextTier);
        this.lastStepTime = currentTime;
        this.resetFrameHistory();
      }
    }
  }

  /**
   * Returns current rolling frame rate and frame time in milliseconds.
   * Single source of truth for HUDs, DevTools, and performance telemetry.
   */
  public getFrameRate(): { fps: number; frameMs: number; isIdle: boolean; targetFps: number } {
    const targetFps = this.detectedTargetInterval > 0 ? Math.round(1 / this.detectedTargetInterval) : 60;
    const isIdle = !this.isRunning || this.sampledFrameCount === 0;

    if (isIdle) {
      return {
        fps: targetFps,
        frameMs: Math.round(this.detectedTargetInterval * 1000 * 10) / 10,
        isIdle: true,
        targetFps,
      };
    }

    const effDelta = this.emaDelta > 0 ? this.emaDelta : this.detectedTargetInterval;
    const frameMs = Math.round(effDelta * 1000 * 10) / 10;
    const fps = effDelta > 0 ? Math.min(Math.round(1 / effDelta), 360) : targetFps;
    return { fps, frameMs, isIdle: false, targetFps };
  }

  /**
   * Returns total lifetime dropped frames, recent (last 60 frames) dropped frames,
   * overall frame health percentage, and detected target FPS.
   */
  public getDroppedFrames(): { total: number; recent: number; health: number; targetFps: number } {
    let recent = 0;
    for (let i = 0; i < 60; i++) {
      recent += this.droppedFramesHistory[i];
    }
    const health = Math.max(0, Math.min(100, Math.round(((60 - recent) / 60) * 100)));
    const targetFps = this.detectedTargetInterval > 0 ? Math.round(1 / this.detectedTargetInterval) : 60;
    return { total: this.droppedFrames, recent, health, targetFps };
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.emaDelta = 0;
    if (this.rafId !== null) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.rafId);
      }
      this.rafId = null;
    }
  }

  private tick = (currentTime: number): void => {
    if (!this.isRunning) return;

    const rawDelta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (this.justWokeUp) {
      this.justWokeUp = false;
    } else {
      this.recordFrameDelta(rawDelta, currentTime);
    }

    // Delta time in seconds, clamped between 1ms and 33ms for physics integration
    const dt = Math.min(Math.max(rawDelta, MIN_DELTA_TIME), MAX_DELTA_TIME);
    this.elapsedTime += dt;

    // Phase 1: Read/Measure (Layout reads isolated)
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('measure', this.measureTasks, this.measureTasksArray, dt, currentTime);

    // Phase 2: Driver (Scroll drivers like Lenis update FIRST to eliminate 1-frame phase lag)
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('driver', this.driverTasks, this.driverTasksArray, dt, currentTime);

    // Phase 3: Math/Physics Calculations (Solvers read fresh scroll metrics)
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('update', this.updateTasks, this.updateTasksArray, dt, currentTime);

    // Phase 4: Direct DOM GPU Compositor writes
    if (this.taskArraysDirty) this.syncTaskArrays();
    this.runPhase('render', this.renderTasks, this.renderTasksArray, dt, currentTime);

    // Check if tasks settled/went dormant
    if (this.isRunning && this.hasActiveTasks()) {
      if (typeof requestAnimationFrame !== 'undefined') {
        this.rafId = requestAnimationFrame(this.tick);
      }
    } else {
      this.stop();
    }
  };
}

export const ticker = /* @__PURE__ */ Ticker.get();
