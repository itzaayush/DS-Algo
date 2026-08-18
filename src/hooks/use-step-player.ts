"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BASE_INTERVAL_MS = 900;

export interface StepController<T> {
  index: number;
  step: T;
  total: number;
  playing: boolean;
  speed: number;
  isFirst: boolean;
  isLast: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  seek: (i: number) => void;
  setSpeed: (s: number) => void;
}

/** Generic deterministic step player: play/pause/step/scrub over any step list. */
export function useStepPlayer<T>(steps: T[]): StepController<T> {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = steps.length;
  const isFirst = index <= 0;
  const isLast = index >= total - 1;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (index >= total - 1) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), BASE_INTERVAL_MS / speed);
    return clear;
  }, [playing, index, speed, total, clear]);

  const play = useCallback(() => {
    setIndex((i) => (i >= total - 1 ? 0 : i));
    setPlaying(true);
  }, [total]);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);
  const next = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);
  const prev = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);
  const restart = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);
  const seek = useCallback(
    (i: number) => {
      setPlaying(false);
      setIndex(Math.max(0, Math.min(i, total - 1)));
    },
    [total]
  );

  return {
    index,
    step: steps[index] ?? steps[0],
    total,
    playing,
    speed,
    isFirst,
    isLast,
    play,
    pause,
    toggle,
    next,
    prev,
    restart,
    seek,
    setSpeed,
  };
}
