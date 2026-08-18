"use client";

import { useCallback, useMemo, useState } from "react";

/**
 * Shared logic for the "sort the towers" challenge, used by both the 3D scene
 * and the 2D fallback so they grant identical learning credit (PRD GH-020).
 * Click a tower to select it, click another to swap. Goal: ascending heights.
 */
export function useSortGame(initial: number[]) {
  const [values, setValues] = useState<number[]>(initial);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [hintPair, setHintPair] = useState<[number, number] | null>(null);

  const isSorted = useMemo(
    () => values.every((v, i) => i === 0 || values[i - 1] <= v),
    [values]
  );

  // Score rewards solving in fewer moves; floor keeps it positive.
  const optimalIsh = Math.max(1, values.length - 1);
  const score = useMemo(() => {
    if (!isSorted) return 0;
    return Math.max(100, Math.round(1000 * (optimalIsh / Math.max(moves, optimalIsh))));
  }, [isSorted, moves, optimalIsh]);

  // Click a tower to select; click another to swap. State updates are kept at
  // the top level (never nested inside an updater) so React StrictMode's
  // double-invocation can't queue the swap twice and cancel it out.
  const select = useCallback(
    (i: number) => {
      setHintPair(null);
      if (selected === null) {
        setSelected(i);
        return;
      }
      if (selected === i) {
        setSelected(null);
        return;
      }
      setValues((v) => {
        const n = [...v];
        [n[selected], n[i]] = [n[i], n[selected]];
        return n;
      });
      setMoves((m) => m + 1);
      setSelected(null);
    },
    [selected]
  );

  const reset = useCallback(
    (next?: number[]) => {
      setValues(next ?? initial);
      setSelected(null);
      setMoves(0);
      setHintPair(null);
    },
    [initial]
  );

  const shuffle = useCallback(() => {
    const n = [...values];
    for (let i = n.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [n[i], n[j]] = [n[j], n[i]];
    }
    reset(n);
  }, [values, reset]);

  const hint = useCallback(() => {
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] > values[i + 1]) {
        setHintPair([i, i + 1]);
        return;
      }
    }
    setHintPair(null);
  }, [values]);

  return { values, selected, moves, score, isSorted, hintPair, select, reset, shuffle, hint };
}

export type SortGame = ReturnType<typeof useSortGame>;
