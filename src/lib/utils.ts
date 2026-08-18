import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, resolving Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number to an inclusive range. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Format an integer with thousands separators. */
export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Deterministic seeded PRNG (mulberry32) for reproducible sample inputs. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build a reproducible integer array for visualizers. */
export function makeSampleArray(size: number, seed = 42, max = 90, min = 5) {
  const rand = seededRandom(seed);
  return Array.from({ length: size }, () => Math.floor(min + rand() * (max - min)));
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
