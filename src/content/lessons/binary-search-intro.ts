import type { Lesson } from "@/lib/schema";

export const binarySearchIntro: Lesson = {
  slug: "binary-search-intro",
  moduleId: "binary-search",
  order: 1,
  title: "Binary search: halve the world",
  subtitle: "Turn O(n) scanning into O(log n) by throwing away half the array each step.",
  estMinutes: 22,
  difficulty: "medium",
  lastReviewed: "2026-07-22",
  published: true,
  hook: "Twenty questions can pin down any number from 1 to a million. Binary search is that game — and it's the difference between a solution that times out and one that flies.",
  objectives: [
    "State the one precondition binary search requires.",
    "Maintain a correct low/high invariant without off-by-one bugs.",
    "Recognize 'search on the answer' as the same idea in disguise.",
  ],
  analogy: {
    emoji: "📖",
    title: "Finding a word in a dictionary",
    body: "You don't read a dictionary page by page. You flip to the middle, see whether your word is earlier or later, and rip the wrong half away. Repeat and a 2,000-page book folds down in about 11 flips.",
  },
  concept: [
    {
      type: "callout",
      tone: "warning",
      title: "Precondition: the data must be sorted",
      text: "Binary search only works because 'the target is on the left or the right of mid' is a decision you can trust. On unsorted data that decision is meaningless.",
    },
    {
      type: "p",
      text: "Keep two boundaries, low and high, describing the range that could still contain the target. Look at the middle. If it's the target, you're done. If the middle is too small, the answer must be to the right, so move low. Otherwise move high. Each step halves the range.",
    },
    {
      type: "p",
      text: "Play the trace below. Watch how everything outside [low, high] instantly greys out — that greyed area is the half you'll never look at again. That discarding is where the log n speed comes from.",
    },
    {
      type: "heading",
      text: "Why log n?",
    },
    {
      type: "p",
      text: "Halving repeatedly means the number of steps is how many times you can divide n by 2 before reaching 1 — that's log₂(n). For a million elements that's about 20 comparisons. For a billion, about 30.",
    },
    {
      type: "callout",
      tone: "info",
      title: "The real superpower: search on the answer",
      text: "When a problem asks for the smallest/largest value that satisfies a monotonic condition (e.g. 'slowest eating speed that finishes in time'), you can binary-search the answer space itself — even when there's no sorted array in sight.",
    },
    {
      type: "code",
      language: "cpp",
      code: "// Lower bound: first index whose value is >= target.\nint lowerBound(vector<int>& a, int target) {\n  int low = 0, high = a.size(); // half-open [low, high)\n  while (low < high) {\n    int mid = low + (high - low) / 2;\n    if (a[mid] < target) low = mid + 1;\n    else high = mid;\n  }\n  return low; // insertion point\n}",
    },
  ],
  visualizer: {
    algorithmId: "binary-search",
    initialInput: [4, 8, 15, 16, 23, 42, 55, 61, 78, 90],
    codeLineToNode: { "2": "start", "4": "mid", "5": "d2", "6": "right", "7": "left", "9": "notfound" },
  },
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "low=0, high=n-1", x: 210, y: 0 },
      { id: "d1", kind: "decision", label: "low ≤ high ?", x: 210, y: 100 },
      { id: "notfound", kind: "end", label: "return -1", x: 470, y: 114 },
      { id: "mid", kind: "process", label: "mid = (low+high)>>1", x: 200, y: 230 },
      { id: "d2", kind: "decision", label: "a[mid] === target ?", x: 210, y: 320 },
      { id: "found", kind: "end", label: "return mid", x: 480, y: 334 },
      { id: "d3", kind: "decision", label: "a[mid] < target ?", x: 210, y: 450 },
      { id: "right", kind: "process", label: "low = mid + 1", x: 20, y: 580 },
      { id: "left", kind: "process", label: "high = mid - 1", x: 410, y: 580 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "notfound", label: "no", sourceHandle: "yes" },
      { id: "e3", from: "d1", to: "mid", label: "yes" },
      { id: "e4", from: "mid", to: "d2" },
      { id: "e5", from: "d2", to: "found", label: "yes", sourceHandle: "yes" },
      { id: "e6", from: "d2", to: "d3", label: "no" },
      { id: "e7", from: "d3", to: "right", label: "yes" },
      { id: "e8", from: "d3", to: "left", label: "no", sourceHandle: "yes" },
      { id: "e9", from: "right", to: "d1", label: "loop", sourceHandle: "loop" },
      { id: "e10", from: "left", to: "d1", label: "loop", sourceHandle: "loop" },
    ],
  },
  pseudocode: `low = 0, high = n - 1
while low <= high:
    mid = (low + high) / 2
    if a[mid] == target: return mid
    if a[mid] < target:  low = mid + 1   // answer is to the right
    else:                high = mid - 1  // answer is to the left
return -1`,
  implementation: {
    language: "cpp",
    code: `int binarySearch(vector<int>& a, int target) {
  int low = 0, high = (int)a.size() - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;   // avoids overflow
    if (a[mid] == target) return mid;
    if (a[mid] < target) low = mid + 1; // answer is to the right
    else high = mid - 1;                // answer is to the left
  }
  return -1;
}`,
  },
  complexity: {
    summary: "Each comparison discards half of what's left, so the work is logarithmic.",
    rows: [
      { label: "Binary search", time: "O(log n)", space: "O(1)", note: "Halving the range." },
      { label: "Linear search (for contrast)", time: "O(n)", space: "O(1)", note: "No order needed." },
      { label: "Sorting first, then searching", time: "O(n log n)", space: "O(1)–O(n)", note: "Worth it for many queries." },
    ],
  },
  mistakes: [
    { title: "Overflow in mid", body: "In fixed-width languages (low + high) can overflow. Prefer low + (high - low) / 2. In JS, >> 1 also floors safely for our ranges." },
    { title: "Infinite loop", body: "If you forget to move low or high past mid, the range never shrinks. Always make progress every iteration." },
    { title: "Wrong invariant", body: "Mixing inclusive [low, high] with half-open [low, high) rules causes off-by-ones. Pick one and stay consistent." },
  ],
  recap: [
    "Binary search needs sorted input.",
    "Maintain low/high and always shrink the range — no infinite loops.",
    "'Search on the answer' applies binary search to any monotonic condition.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What must be true before you can binary search an array?",
      choices: [
        { id: "a", text: "It must be sorted." },
        { id: "b", text: "It must contain unique values." },
        { id: "c", text: "It must be a power of two in length." },
        { id: "d", text: "It must fit in cache." },
      ],
      correctId: "a",
      explanation: "The 'go left or right' decision is only valid when the data is ordered.",
      concept: "Precondition",
    },
    {
      id: "q2",
      prompt: "About how many steps does binary search take on 1,000,000 sorted items?",
      choices: [
        { id: "a", text: "About 1,000,000" },
        { id: "b", text: "About 1,000" },
        { id: "c", text: "About 20" },
        { id: "d", text: "Exactly 2" },
      ],
      correctId: "c",
      explanation: "log₂(1,000,000) ≈ 20, so ~20 comparisons suffice.",
      concept: "Logarithmic growth",
    },
    {
      id: "q3",
      prompt: "'Find the minimum eating speed that finishes in H hours' is solvable with binary search because…",
      choices: [
        { id: "a", text: "The bananas are already sorted." },
        { id: "b", text: "Feasibility is monotonic: faster always still finishes in time." },
        { id: "c", text: "There are only a few speeds." },
        { id: "d", text: "It isn't — that's a greedy problem." },
      ],
      correctId: "b",
      explanation: "A monotonic yes/no boundary lets you binary-search the answer space directly.",
      concept: "Search on the answer",
    },
  ],
  practiceIds: ["lc-binary-search", "lc-search-rotated", "lc-koko-bananas"],
  companyTags: ["Google", "Meta", "Amazon"],
};
