/**
 * Deterministic visualizer engine — shared types.
 *
 * Each algorithm is a pure function `(input) => Frame[]`. A Frame is a complete,
 * self-contained snapshot of the visualization at one step, so the player can
 * jump forward/backward to any frame with zero side effects. This determinism
 * is what makes the visualizers testable (PRD FR-006, GH-026) and lets the
 * "previous" control return to the exact prior state (GH-007).
 */

export type CellRole =
  | "default"
  | "compare"
  | "swap"
  | "sorted"
  | "pivot"
  | "pointer"
  | "visited"
  | "active"
  | "min"
  | "key"
  | "window"
  | "found"
  | "discarded";

/** A value with a stable identity so motion can animate it moving between slots. */
export interface Cell {
  id: number;
  value: number;
}

/** A named marker sitting above a column (e.g. `i`, `j`, `low`, `mid`, `high`). */
export interface Pointer {
  name: string;
  index: number;
  tone?: "primary" | "secondary" | "accent" | "danger";
}

export interface Frame {
  /** Ordered cells; render keyed by `cell.id` so swaps animate as slides. */
  cells: Cell[];
  /** Role per *position* (0..n-1), parallel to `cells`. */
  roles: CellRole[];
  /** Pointers anchored to positions. */
  pointers: Pointer[];
  /** One-line narration for this exact step. */
  narration: string;
  /** 1-based line of the reference implementation to highlight (0 = none). */
  codeLine: number;
  /** Live operation counters (comparisons, swaps, ...). */
  counters: Record<string, number>;
  /** True on the terminal frame. */
  done?: boolean;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: "sorting" | "searching" | "pointers" | "window";
  /** Reference implementation shown alongside the trace, line-indexed from 1. */
  code: string;
  language: string;
  complexity: { time: string; space: string; note?: string };
  /** Whether the input must be sorted for this algorithm to be meaningful. */
  requiresSorted?: boolean;
  /** Whether this algorithm searches for a target value (shows a target input). */
  usesTarget?: boolean;
}

export interface AlgorithmModule extends AlgorithmMeta {
  /** Pure frame generator. `target` is used by search algorithms. */
  run: (input: number[], target?: number) => Frame[];
  /** A sensible default target for search algorithms. */
  defaultTarget?: (input: number[]) => number;
}

/** Convenience: a fresh roles array with an optional sorted tail. */
export function baseRoles(n: number, sortedFrom = n): CellRole[] {
  return Array.from({ length: n }, (_, i) => (i >= sortedFrom ? "sorted" : "default"));
}

/** Deep-clone a frame's mutable parts so the generator can keep mutating cells. */
export function snapshot(
  cells: Cell[],
  roles: CellRole[],
  pointers: Pointer[],
  narration: string,
  codeLine: number,
  counters: Record<string, number>,
  done = false
): Frame {
  return {
    cells: cells.map((c) => ({ ...c })),
    roles: [...roles],
    pointers: pointers.map((p) => ({ ...p })),
    narration,
    codeLine,
    counters: { ...counters },
    done,
  };
}
