import type { Difficulty, Pattern } from "@/lib/schema";
import { MORE_PATTERNS } from "./patterns-more";

/** Fully-authored Pattern Lab units — all 20 patterns of the catalog. */
export const PATTERNS: Pattern[] = [
  {
    slug: "frequency-hashing",
    order: 1,
    title: "Frequency Counting & Hashing",
    summary: "Trade memory for speed: one pass builds counts so questions become O(1) lookups.",
    difficulty: "easy",
    estMinutes: 30,
    published: true,
    recognitionSignals: [
      "The problem asks 'how many', 'are there duplicates', or 'do two things match'.",
      "A brute force compares every pair (O(n²)).",
      "You need to remember what you've already seen.",
    ],
    intuition:
      "A hash map answers 'have I seen this / how many times?' in O(1) average. Replace nested scanning with a single pass that records or looks up counts.",
    visualModel:
      "Imagine tally marks in labeled buckets. As you walk the input, you drop a mark in the bucket for each value — then read the tallies to answer instantly.",
    template: {
      language: "javascript",
      code: `const count = new Map();
for (const x of arr) {
  count.set(x, (count.get(x) ?? 0) + 1);
}
// Now answer questions from 'count' in O(1) each.`,
    },
    complexity: "O(n) time, O(n) extra space.",
    mistakes: [
      "Using an object for non-string keys — prefer Map for numeric or object keys.",
      "Forgetting the default 0 with (count.get(x) ?? 0).",
    ],
    variations: [
      "Set for pure membership (seen / not seen).",
      "Complement lookup (Two Sum): store target − x.",
      "Sliding-window counts for substring problems.",
    ],
    prerequisites: ["arrays", "hashing"],
    relatedPatterns: ["two-pointers", "sliding-window"],
    practiceIds: ["lc-two-sum", "lc-contains-duplicate", "lc-valid-anagram"],
    companyTags: ["Amazon", "Google", "Meta"],
    recognition: [
      {
        id: "r1",
        prompt: "You must find whether any value repeats in an array. Best first move?",
        choices: [
          { id: "a", text: "Sort, then scan neighbors" },
          { id: "b", text: "Insert into a hash set, checking membership first" },
          { id: "c", text: "Compare every pair" },
          { id: "d", text: "Binary search each element" },
        ],
        correctId: "b",
        explanation: "A seen-set answers 'have I encountered this?' in O(1) average — one pass, no nested loops.",
      },
    ],
  },
  {
    slug: "two-pointers",
    order: 2,
    title: "Two Pointers",
    summary: "Converge or chase two indices to replace a nested loop with a single sweep.",
    difficulty: "easy",
    estMinutes: 30,
    published: true,
    recognitionSignals: [
      "Input is sorted, or sorting is cheap and helps.",
      "You're looking for a pair/triplet meeting a condition.",
      "You need to compare the ends of a range moving inward.",
    ],
    intuition:
      "Place pointers at strategic positions (both ends, or both at the start) and move them based on a comparison, so each element is visited at most once.",
    visualModel:
      "Two fingers on a sorted list: if their sum is too big, pull the right finger left; too small, push the left finger right.",
    template: {
      language: "javascript",
      code: `let lo = 0, hi = a.length - 1;
while (lo < hi) {
  const sum = a[lo] + a[hi];
  if (sum === target) return [lo, hi];
  if (sum < target) lo++;
  else hi--;
}`,
    },
    complexity: "O(n) after an optional O(n log n) sort.",
    mistakes: [
      "Using two pointers on unsorted data when the logic assumes order.",
      "Skipping duplicate handling in problems like 3Sum.",
    ],
    variations: [
      "Opposite ends (pair sums, palindrome checks).",
      "Same direction / fast-slow (cycle detection).",
      "Merging two sorted sequences.",
    ],
    prerequisites: ["arrays", "sorting"],
    relatedPatterns: ["fast-slow-pointers", "sliding-window"],
    practiceIds: ["lc-valid-palindrome", "lc-3sum", "lc-merge-two-lists"],
    companyTags: ["Meta", "Amazon", "Google"],
    visualizer: { algorithmId: "two-pointers" },
    recognition: [
      {
        id: "r1",
        prompt: "A sorted array — find two numbers that sum to a target. Which approach is O(n)?",
        choices: [
          { id: "a", text: "Two pointers from both ends" },
          { id: "b", text: "Check every pair" },
          { id: "c", text: "Sort again, then scan" },
          { id: "d", text: "A stack" },
        ],
        correctId: "a",
        explanation: "Because it's sorted, moving the lo/hi pointers based on the running sum finds the pair in one pass.",
      },
    ],
  },
  {
    slug: "sliding-window",
    order: 3,
    title: "Sliding Window",
    summary: "Maintain a running window over a sequence instead of recomputing every subarray.",
    difficulty: "medium",
    estMinutes: 35,
    published: true,
    recognitionSignals: [
      "You need the best/longest/shortest contiguous subarray or substring.",
      "A condition is monotonic as the window grows or shrinks.",
      "Recomputing each window from scratch would be O(n·k).",
    ],
    intuition:
      "Expand the window by moving the right edge; when it violates the constraint, shrink from the left. Each index enters and leaves once, giving O(n).",
    visualModel:
      "A stretchy frame gliding across the array — it grows to include more, then contracts when it breaks the rule.",
    template: {
      language: "javascript",
      code: `let left = 0, best = 0;
const seen = new Map();
for (let right = 0; right < s.length; right++) {
  seen.set(s[right], (seen.get(s[right]) ?? 0) + 1);
  while (/* window invalid */ seen.get(s[right]) > 1) {
    seen.set(s[left], seen.get(s[left]) - 1);
    left++;
  }
  best = Math.max(best, right - left + 1);
}`,
    },
    complexity: "O(n) time; O(k) space for the window contents.",
    mistakes: [
      "Shrinking with an if instead of a while.",
      "Forgetting to update the answer at the right moment.",
    ],
    variations: [
      "Fixed-size window (averages of size k).",
      "Variable window (longest substring without repeats).",
      "Window with a counter/frequency constraint.",
    ],
    prerequisites: ["arrays", "hashing"],
    relatedPatterns: ["two-pointers", "frequency-hashing"],
    practiceIds: ["lc-longest-substring", "lc-best-time-stock"],
    companyTags: ["Amazon", "Google", "Meta"],
    visualizer: { algorithmId: "sliding-window" },
    recognition: [
      {
        id: "r1",
        prompt: "'Longest substring without repeating characters' points to which pattern?",
        choices: [
          { id: "a", text: "Binary search" },
          { id: "b", text: "Sliding window" },
          { id: "c", text: "Backtracking" },
          { id: "d", text: "Union-find" },
        ],
        correctId: "b",
        explanation: "A contiguous 'longest/shortest' span with a running constraint is the sliding-window signature.",
      },
    ],
  },
  {
    slug: "prefix-sums",
    order: 4,
    title: "Prefix Sums & Difference Arrays",
    summary: "Precompute cumulative totals so any range query becomes a single subtraction.",
    difficulty: "medium",
    estMinutes: 30,
    published: true,
    recognitionSignals: [
      "Many queries ask for the sum/count over a range [l, r].",
      "You repeatedly re-add the same elements.",
      "Updates apply to whole ranges at once (difference array).",
    ],
    intuition:
      "Build prefix[i] = sum of the first i elements. Then sum(l, r) = prefix[r+1] − prefix[l] in O(1). The reverse idea (difference arrays) makes range updates O(1).",
    visualModel:
      "Mile markers on a road: distance between two towns is just the difference of their mile markers — no need to re-walk the road.",
    template: {
      language: "javascript",
      code: `const prefix = [0];
for (let i = 0; i < a.length; i++) {
  prefix.push(prefix[i] + a[i]);
}
const rangeSum = (l, r) => prefix[r + 1] - prefix[l];`,
    },
    complexity: "O(n) preprocessing, O(1) per query.",
    mistakes: [
      "Off-by-one between prefix indices and array indices.",
      "Rebuilding prefixes after every query instead of once.",
    ],
    variations: [
      "2D prefix sums for submatrix queries.",
      "Difference array for range increments.",
      "Prefix XOR / prefix product.",
    ],
    prerequisites: ["arrays"],
    relatedPatterns: ["sliding-window"],
    practiceIds: ["lc-product-except-self", "lc-maximum-subarray"],
    companyTags: ["Meta", "Amazon", "Microsoft"],
    recognition: [
      {
        id: "r1",
        prompt: "Many queries ask for the sum of a[l..r]. What makes each query O(1)?",
        choices: [
          { id: "a", text: "Sort the array" },
          { id: "b", text: "Build a prefix-sum array" },
          { id: "c", text: "A hash map of values" },
          { id: "d", text: "A stack" },
        ],
        correctId: "b",
        explanation: "prefix[r+1] − prefix[l] answers any range sum in constant time after O(n) setup.",
      },
    ],
  },
  {
    slug: "fast-slow-pointers",
    order: 5,
    title: "Fast & Slow Pointers",
    summary: "Two runners at different speeds detect cycles and find midpoints in O(1) space.",
    difficulty: "medium",
    estMinutes: 28,
    published: true,
    recognitionSignals: [
      "You're on a linked list or an implicit 'next' function.",
      "You must detect a cycle or find the middle in one pass.",
      "O(1) extra space is required.",
    ],
    intuition:
      "Move one pointer one step and another two steps. If there's a cycle they eventually meet; when the fast one reaches the end, the slow one sits at the middle.",
    visualModel:
      "A runner and a walker on a circular track — the faster runner inevitably laps and meets the walker.",
    template: {
      language: "javascript",
      code: `let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true; // cycle
}
return false;`,
    },
    complexity: "O(n) time, O(1) space.",
    mistakes: [
      "Not checking fast && fast.next before advancing twice.",
      "Confusing 'meeting point' with 'cycle start' (needs a second phase).",
    ],
    variations: [
      "Middle of a linked list.",
      "Cycle start (Floyd's second phase).",
      "Happy-number style implicit sequences.",
    ],
    prerequisites: ["linked-lists"],
    relatedPatterns: ["two-pointers"],
    practiceIds: ["lc-linked-list-cycle", "lc-reverse-linked-list"],
    companyTags: ["Amazon", "Microsoft"],
    recognition: [
      {
        id: "r1",
        prompt: "Detect a cycle in a linked list using O(1) extra memory. Which technique?",
        choices: [
          { id: "a", text: "Store visited nodes in a set" },
          { id: "b", text: "Fast and slow pointers" },
          { id: "c", text: "Sort the nodes" },
          { id: "d", text: "Binary search" },
        ],
        correctId: "b",
        explanation: "Two runners at different speeds meet inside a cycle without any extra storage.",
      },
    ],
  },
  {
    slug: "binary-search-answer",
    order: 8,
    title: "Binary Search on the Answer",
    summary: "When feasibility is monotonic, binary-search the answer space itself.",
    difficulty: "hard",
    estMinutes: 35,
    published: true,
    recognitionSignals: [
      "You're asked for a minimum/maximum value that 'just works'.",
      "A helper can check 'is X feasible?' quickly.",
      "Feasibility flips once from false to true (monotonic).",
    ],
    intuition:
      "Don't search the data — search the range of possible answers. Binary-search for the boundary where a feasibility check changes from no to yes.",
    visualModel:
      "A dimmer switch: dim is infeasible, bright is feasible. Binary search hunts for the exact turning point.",
    template: {
      language: "javascript",
      code: `let lo = minAnswer, hi = maxAnswer;
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (feasible(mid)) hi = mid;   // mid works, try smaller
  else lo = mid + 1;             // mid fails, go bigger
}
return lo; // smallest feasible answer`,
    },
    complexity: "O(log(range) × cost(feasible)).",
    mistakes: [
      "Picking answer bounds that are too tight and miss the optimum.",
      "A feasibility check that isn't actually monotonic.",
    ],
    variations: [
      "Minimize the maximum (ship capacity, Koko bananas).",
      "Maximize the minimum (aggressive cows).",
      "Real-valued search with an epsilon.",
    ],
    prerequisites: ["binary-search"],
    relatedPatterns: ["two-pointers"],
    practiceIds: ["lc-koko-bananas", "lc-search-rotated", "lc-binary-search"],
    companyTags: ["Google", "Meta", "Amazon"],
    visualizer: { algorithmId: "binary-search" },
    recognition: [
      {
        id: "r1",
        prompt: "'Minimum eating speed to finish in H hours' — why can we binary search?",
        choices: [
          { id: "a", text: "The bananas are sorted" },
          { id: "b", text: "Feasibility is monotonic in the speed" },
          { id: "c", text: "There are few speeds" },
          { id: "d", text: "It's actually greedy" },
        ],
        correctId: "b",
        explanation: "If a speed works, any higher speed works too — a monotonic yes/no boundary we can binary search.",
      },
    ],
  },
  ...MORE_PATTERNS,
];

export const PATTERN_MAP = new Map(PATTERNS.map((p) => [p.slug, p]));

export function getPattern(slug: string) {
  return PATTERN_MAP.get(slug);
}

/** The complete 20-unit Pattern Lab catalog (PRD §5.6). Authored units link through. */
export interface PatternCatalogEntry {
  slug: string;
  order: number;
  title: string;
  summary: string;
  difficulty: Difficulty;
}

export const PATTERN_CATALOG: PatternCatalogEntry[] = [
  { slug: "frequency-hashing", order: 1, title: "Frequency Counting & Hashing", summary: "Count once, answer instantly.", difficulty: "easy" },
  { slug: "two-pointers", order: 2, title: "Two Pointers", summary: "Sweep a range from both ends.", difficulty: "easy" },
  { slug: "sliding-window", order: 3, title: "Sliding Window", summary: "Best contiguous subarray in one pass.", difficulty: "medium" },
  { slug: "prefix-sums", order: 4, title: "Prefix Sums & Difference Arrays", summary: "Range queries in O(1).", difficulty: "medium" },
  { slug: "fast-slow-pointers", order: 5, title: "Fast & Slow Pointers", summary: "Detect cycles in O(1) space.", difficulty: "medium" },
  { slug: "merge-intervals", order: 6, title: "Merge Intervals", summary: "Sort, then coalesce overlaps.", difficulty: "medium" },
  { slug: "cyclic-placement", order: 7, title: "Cyclic Placement", summary: "Put each value at its index.", difficulty: "medium" },
  { slug: "binary-search-answer", order: 8, title: "Binary Search on the Answer", summary: "Search the answer space.", difficulty: "hard" },
  { slug: "monotonic-stack", order: 9, title: "Monotonic Stack & Queue", summary: "Next greater / smaller element.", difficulty: "medium" },
  { slug: "top-k-heap", order: 10, title: "Top-K & Heap Selection", summary: "Keep the best k with a heap.", difficulty: "medium" },
  { slug: "tree-traversal", order: 11, title: "Tree DFS & BFS Templates", summary: "Reusable traversal skeletons.", difficulty: "medium" },
  { slug: "graph-traversal", order: 12, title: "Graph Traversal & Components", summary: "Flood fill and connectivity.", difficulty: "medium" },
  { slug: "topological-sort", order: 13, title: "Topological Ordering", summary: "Order a DAG by dependencies.", difficulty: "hard" },
  { slug: "backtracking", order: 14, title: "Backtracking Decision Trees", summary: "Choose, explore, un-choose.", difficulty: "hard" },
  { slug: "greedy-choice", order: 15, title: "Greedy Choice Patterns", summary: "Locally optimal, provably global.", difficulty: "hard" },
  { slug: "one-d-dp", order: 16, title: "1-D Dynamic Programming", summary: "State, transition, base case.", difficulty: "hard" },
  { slug: "grid-dp", order: 17, title: "Grid & Subsequence DP", summary: "2-D tables and LCS-style DP.", difficulty: "hard" },
  { slug: "bitmasking", order: 18, title: "Bitmasking & Subsets", summary: "Enumerate subsets with bits.", difficulty: "hard" },
  { slug: "union-find", order: 19, title: "Union-Find Connectivity", summary: "Merge sets, query roots.", difficulty: "hard" },
  { slug: "mixed-recognition", order: 20, title: "Mixed-Pattern Recognition", summary: "Pick the right tool under pressure.", difficulty: "hard" },
];
