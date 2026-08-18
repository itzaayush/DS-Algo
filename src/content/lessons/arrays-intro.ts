import type { Lesson } from "@/lib/schema";

export const arraysIntro: Lesson = {
  slug: "arrays-intro",
  moduleId: "arrays",
  order: 1,
  title: "Arrays: the contiguous shelf",
  subtitle: "The memory model, traversal, and the frequency-counting superpower.",
  estMinutes: 24,
  difficulty: "easy",
  lastReviewed: "2026-07-20",
  published: true,
  hook: "Almost every algorithm you'll ever write starts by walking across an array. Master how it lives in memory and half of DSA stops feeling like magic.",
  objectives: [
    "Explain why array access is O(1) but inserting in the middle is O(n).",
    "Traverse an array and reason about each index you touch.",
    "Use a frequency map to turn many nested loops into a single pass.",
  ],
  analogy: {
    emoji: "📚",
    title: "A shelf of numbered cubbies",
    body: "An array is a row of identical cubbies placed side by side. Because they're the same size and touching, you can jump straight to cubby #7 without passing the others — that's random access. But to squeeze a new cubby into the middle, every cubby to its right has to shuffle over.",
  },
  concept: [
    {
      type: "p",
      text: "An array stores its elements in one contiguous block of memory. The computer knows where the block starts and how big each element is, so the address of index i is simply start + i × size. That single multiplication is why reading a[i] is constant time no matter how big the array is.",
    },
    {
      type: "callout",
      tone: "info",
      title: "Random access is the whole point",
      text: "Because addresses are computed, not searched, a[0] and a[1000000] cost exactly the same to read. Contrast that with a linked list, where reaching the millionth node means walking a million pointers.",
    },
    {
      type: "heading",
      text: "Traversal: touching every index once",
    },
    {
      type: "p",
      text: "The most common thing you do with an array is scan it. Below, linear search walks left to right, checking one cubby at a time. Play it, then scrub backward — notice how the discarded cells stay dimmed so you always know what's already been ruled out.",
    },
    {
      type: "heading",
      text: "The frequency-map superpower",
    },
    {
      type: "p",
      text: "A huge number of array problems collapse the instant you count things. Instead of comparing every pair (O(n²)), you make one pass building a map of value → count, then answer questions in O(1). This single idea powers Two Sum, anagrams, and dozens more.",
    },
    {
      type: "code",
      language: "cpp",
      code: "// Count how many times each value appears — one pass, O(n).\nunordered_map<int,int> frequency(vector<int>& a) {\n  unordered_map<int,int> count;\n  for (int x : a) count[x]++;\n  return count;\n}\n\n// Now \"is there a duplicate?\" is instant:\nbool hasDuplicate(vector<int>& a) {\n  unordered_set<int> seen;\n  for (int x : a) {\n    if (seen.count(x)) return true;\n    seen.insert(x);\n  }\n  return false;\n}",
    },
    {
      type: "callout",
      tone: "warning",
      title: "Space for time",
      text: "The frequency map trades memory (the Map) for speed. That's the central bargain of hashing — remember it, because interviewers love watching you make it on purpose.",
    },
  ],
  visualizer: {
    algorithmId: "linear-search",
    initialInput: [8, 3, 5, 9, 2, 7, 4, 6, 1],
    codeLineToNode: { "1": "start", "3": "d2", "5": "notfound" },
  },
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "i = 0", x: 150, y: 0 },
      { id: "d1", kind: "decision", label: "i < n ?", x: 140, y: 100 },
      { id: "d2", kind: "decision", label: "a[i] === target ?", x: 140, y: 230 },
      { id: "found", kind: "end", label: "return i", x: 400, y: 244 },
      { id: "inc", kind: "process", label: "i = i + 1", x: 150, y: 370 },
      { id: "notfound", kind: "end", label: "return -1", x: 150, y: 500 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "d2", label: "yes" },
      { id: "e3", from: "d1", to: "notfound", label: "no" },
      { id: "e4", from: "d2", to: "found", label: "yes", sourceHandle: "yes" },
      { id: "e5", from: "d2", to: "inc", label: "no" },
      { id: "e6", from: "inc", to: "d1", label: "loop", sourceHandle: "loop" },
    ],
  },
  pseudocode: `for each index i from 0 to n-1:
    if a[i] equals target:
        return i          // found it
return -1                  // fell off the end`,
  implementation: {
    language: "cpp",
    code: `#include <vector>
using namespace std;

// Returns the index of target, or -1 if absent.
int linearSearch(vector<int>& a, int target) {
  for (int i = 0; i < (int)a.size(); i++) {
    if (a[i] == target) return i;   // found it
  }
  return -1;                        // fell off the end
}`,
  },
  complexity: {
    summary:
      "Reads are free; edits near the front are expensive because everything after has to shift.",
    rows: [
      { label: "Access a[i]", time: "O(1)", space: "O(1)", note: "Address arithmetic." },
      { label: "Linear search", time: "O(n)", space: "O(1)", note: "Worst case scans all." },
      { label: "Insert / delete at end", time: "O(1)*", space: "O(1)", note: "Amortized for dynamic arrays." },
      { label: "Insert / delete in middle", time: "O(n)", space: "O(1)", note: "Shift the tail." },
      { label: "Frequency map pass", time: "O(n)", space: "O(n)", note: "Trade space for speed." },
    ],
  },
  mistakes: [
    { title: "Off-by-one at the boundary", body: "Loop conditions of i <= n read one past the end. Use i < n, and remember the last valid index is n - 1." },
    { title: "Mutating while iterating", body: "Removing elements during a forward loop shifts everything left and makes you skip items. Iterate backward or build a new array." },
    { title: "Assuming sorted order", body: "Linear search works on any array, but binary search does not. Never binary-search unsorted data." },
  ],
  recap: [
    "Arrays live in one contiguous block, so a[i] is O(1).",
    "Editing the middle is O(n) because the tail must shift.",
    "A single frequency/seen pass turns many O(n²) brute forces into O(n).",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why is reading a[i] in an array O(1)?",
      choices: [
        { id: "a", text: "The array keeps a sorted index for fast lookup." },
        { id: "b", text: "The address is computed as start + i × elementSize." },
        { id: "c", text: "The CPU caches the entire array." },
        { id: "d", text: "Arrays are always small." },
      ],
      correctId: "b",
      explanation: "Contiguous storage lets the machine compute an element's address directly, so index does not affect cost.",
      concept: "Memory model",
    },
    {
      id: "q2",
      prompt: "Inserting a value at the front of a length-n array is:",
      choices: [
        { id: "a", text: "O(1), it just writes index 0." },
        { id: "b", text: "O(log n), it rebalances." },
        { id: "c", text: "O(n), every other element shifts right." },
        { id: "d", text: "Impossible without a linked list." },
      ],
      correctId: "c",
      explanation: "All n existing elements move one slot to the right to make room, which is linear work.",
      concept: "Insertion cost",
    },
    {
      id: "q3",
      prompt: "Which technique turns 'does any value repeat?' from O(n²) into O(n)?",
      choices: [
        { id: "a", text: "Sorting the array first." },
        { id: "b", text: "A Set that records values already seen." },
        { id: "c", text: "Two nested loops." },
        { id: "d", text: "Binary search." },
      ],
      correctId: "b",
      explanation: "A Set answers 'seen before?' in O(1) average, so one pass detects duplicates.",
      concept: "Frequency / hashing",
    },
    {
      id: "q4",
      prompt: "Linear search on the array [8,3,5,9,2] for target 2 touches how many cells?",
      choices: [
        { id: "a", text: "1" },
        { id: "b", text: "3" },
        { id: "c", text: "5" },
        { id: "d", text: "It cannot be found." },
      ],
      correctId: "c",
      explanation: "2 is the last element, so the scan checks all five cells before returning index 4.",
      concept: "Traversal",
    },
  ],
  practiceIds: [
    "lc-two-sum",
    "lc-contains-duplicate",
    "lc-best-time-stock",
    "lc-product-except-self",
    "lc-maximum-subarray",
  ],
  companyTags: ["Google", "Amazon", "Microsoft", "Meta"],
};
