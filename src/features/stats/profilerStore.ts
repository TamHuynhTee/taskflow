import { useSyncExternalStore, type ProfilerOnRenderCallback } from "react";
import type { ProfilerRow } from "../../types";

// A simple store outside React (T5.2). Every write creates a NEW ARRAY so getSnapshot returns
// a different reference → useSyncExternalStore knows something changed. Returning the same mutated array
// (push) means React sees no change; returning a new array on every getSnapshot CALL loops forever.
const MAX_ROWS = 20;
let rows: ProfilerRow[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function record(row: ProfilerRow) {
  rows = [row, ...rows].slice(0, MAX_ROWS);
  emit();
}

export function clear() {
  rows = [];
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return rows;
}

export function useProfilerRows(): ProfilerRow[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Callback for <Profiler onRender>.
 *  - actualDuration: time spent rendering the subtree IN THIS COMMIT (the more memo skips,
 *    the smaller it gets).
 *  - baseDuration: estimated time to re-render THE WHOLE subtree with no memo at all.
 *  actual << base means memo is doing its job.
 *
 * Why not setState in onRender? onRender runs after every commit of the measured tree. If
 * the <Profiler>'s parent called setState here → the parent re-renders → Profiler commits → onRender
 * → setState... a loop. Writing to an external store only re-renders the components reading it.
 * (This store emits synchronously — don't put the Profiler table inside the tree being measured.)
 */
export const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  _startTime,
  commitTime,
) => {
  record({ id, phase, actualDuration, baseDuration, commitTime });
};
