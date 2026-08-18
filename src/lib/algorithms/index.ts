import type { AlgorithmModule } from "./types";
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  bubbleSortCode,
  selectionSortCode,
  insertionSortCode,
} from "./sorting";
import {
  linearSearch,
  binarySearch,
  linearSearchCode,
  binarySearchCode,
} from "./searching";
import {
  twoPointerSum,
  slidingWindow,
  twoPointerSumCode,
  slidingWindowCode,
} from "./pointers";

export const ALGORITHMS: Record<string, AlgorithmModule> = {
  "bubble-sort": {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "sorting",
    language: "cpp",
    code: bubbleSortCode,
    complexity: { time: "O(n²)", space: "O(1)", note: "Adaptive: O(n) on already-sorted input." },
    run: (input) => bubbleSort(input),
  },
  "selection-sort": {
    id: "selection-sort",
    name: "Selection Sort",
    category: "sorting",
    language: "cpp",
    code: selectionSortCode,
    complexity: { time: "O(n²)", space: "O(1)", note: "Always n²; minimizes number of swaps." },
    run: (input) => selectionSort(input),
  },
  "insertion-sort": {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "sorting",
    language: "cpp",
    code: insertionSortCode,
    complexity: { time: "O(n²)", space: "O(1)", note: "Fast on nearly-sorted data; stable." },
    run: (input) => insertionSort(input),
  },
  "linear-search": {
    id: "linear-search",
    name: "Linear Search",
    category: "searching",
    language: "cpp",
    code: linearSearchCode,
    complexity: { time: "O(n)", space: "O(1)", note: "Works on any array, sorted or not." },
    usesTarget: true,
    run: (input, target) => linearSearch(input, target),
    defaultTarget: (input) => input[Math.floor(input.length * 0.7)] ?? input[0],
  },
  "binary-search": {
    id: "binary-search",
    name: "Binary Search",
    category: "searching",
    language: "cpp",
    code: binarySearchCode,
    complexity: { time: "O(log n)", space: "O(1)", note: "Requires the array to be sorted first." },
    requiresSorted: true,
    usesTarget: true,
    run: (input, target) => binarySearch(input, target),
    defaultTarget: (input) => {
      const s = [...input].sort((a, b) => a - b);
      return s[Math.floor(s.length * 0.65)] ?? s[0];
    },
  },
  "two-pointers": {
    id: "two-pointers",
    name: "Two Pointers",
    category: "pointers",
    language: "cpp",
    code: twoPointerSumCode,
    complexity: { time: "O(n)", space: "O(1)", note: "After sorting: converge from both ends." },
    requiresSorted: true,
    usesTarget: true,
    run: (input, target) => twoPointerSum(input, target),
    defaultTarget: (input) => {
      const s = [...input].sort((a, b) => a - b);
      return s.length >= 2 ? s[1] + s[s.length - 2] : s[0];
    },
  },
  "sliding-window": {
    id: "sliding-window",
    name: "Sliding Window",
    category: "window",
    language: "cpp",
    code: slidingWindowCode,
    complexity: { time: "O(n)", space: "O(k)", note: "Each index enters and leaves once." },
    run: (input) => slidingWindow(input),
  },
};

export function getAlgorithm(id: string): AlgorithmModule | undefined {
  return ALGORITHMS[id];
}

export const ALGORITHM_LIST = Object.values(ALGORITHMS);
