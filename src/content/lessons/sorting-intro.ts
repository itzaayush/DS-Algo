import type { Lesson } from "@/lib/schema";

export const sortingIntro: Lesson = {
  slug: "sorting-intro",
  moduleId: "sorting",
  order: 1,
  title: "Sorting: order from chaos",
  subtitle: "Compare three O(n²) sorts side by side, then learn when to reach for each.",
  estMinutes: 26,
  difficulty: "medium",
  lastReviewed: "2026-07-18",
  published: true,
  hook: "Sorting is the Swiss Army knife of algorithms — once data is ordered, searching, deduping, and grouping all get easier. Seeing three sorts move the same bars makes their personalities obvious.",
  objectives: [
    "Trace bubble, selection, and insertion sort on the same input.",
    "Explain what 'stable' and 'in-place' mean and why they matter.",
    "Pick the right simple sort for nearly-sorted vs. random data.",
  ],
  analogy: {
    emoji: "🃏",
    title: "Sorting a hand of cards",
    body: "Insertion sort is exactly how most people sort playing cards: pick up one card at a time and slide it left until it sits in the right spot among the cards you've already arranged.",
  },
  concept: [
    {
      type: "p",
      text: "Use the algorithm switcher on the visualizer to run the same array through three different sorts. Watch the colors: amber means a comparison, rose means a swap, green means locked in place. Each sort reaches order a different way.",
    },
    {
      type: "heading",
      text: "Three personalities",
    },
    {
      type: "list",
      ordered: false,
      items: [
        "Bubble sort repeatedly swaps adjacent out-of-order pairs, letting the largest value 'bubble' to the end each pass. It can stop early if a pass makes no swaps.",
        "Selection sort scans for the minimum of the unsorted region and swaps it into place. It always does the same work — but the fewest swaps.",
        "Insertion sort grows a sorted prefix, sliding each new value left into position. It's blazing fast when the data is already nearly sorted.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Stable vs. in-place",
      text: "Stable means equal values keep their original relative order (crucial when sorting by multiple keys). In-place means it needs only O(1) extra memory. Insertion and bubble sort are stable; selection sort is not.",
    },
    {
      type: "callout",
      tone: "warning",
      title: "These are teaching sorts",
      text: "In real code you'll call the built-in sort (an optimized O(n log n) hybrid). You learn these to build intuition — and because their ideas reappear inside bigger algorithms.",
    },
  ],
  visualizer: {
    algorithmId: "bubble-sort",
    algorithmOptions: ["bubble-sort", "selection-sort", "insertion-sort"],
    initialInput: [5, 2, 8, 1, 9, 3, 7, 4],
  },
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "i = 0", x: 200, y: 0 },
      { id: "d1", kind: "decision", label: "i < n-1 ?", x: 200, y: 100 },
      { id: "sorted", kind: "end", label: "return sorted a", x: 460, y: 114 },
      { id: "d2", kind: "decision", label: "j < n-1-i ?", x: 200, y: 230 },
      { id: "d3", kind: "decision", label: "a[j] > a[j+1] ?", x: 200, y: 360 },
      { id: "swap", kind: "process", label: "swap a[j], a[j+1]", x: 450, y: 374 },
      { id: "incj", kind: "process", label: "j = j + 1", x: 200, y: 490 },
      { id: "inci", kind: "process", label: "i = i + 1", x: 10, y: 240 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "sorted", label: "no", sourceHandle: "yes" },
      { id: "e3", from: "d1", to: "d2", label: "yes" },
      { id: "e4", from: "d2", to: "inci", label: "no", sourceHandle: "loop" },
      { id: "e5", from: "d2", to: "d3", label: "yes" },
      { id: "e6", from: "d3", to: "swap", label: "yes", sourceHandle: "yes" },
      { id: "e7", from: "d3", to: "incj", label: "no" },
      { id: "e8", from: "swap", to: "incj" },
      { id: "e9", from: "incj", to: "d2", label: "loop", sourceHandle: "loop" },
      { id: "e10", from: "inci", to: "d1", label: "loop", sourceHandle: "loop" },
    ],
  },
  pseudocode: `for i from 0 to n-2:
    swapped = false
    for j from 0 to n-2-i:
        if a[j] > a[j+1]:
            swap a[j], a[j+1]
            swapped = true
    if not swapped: break   // already sorted`,
  implementation: {
    language: "cpp",
    code: `void bubbleSort(vector<int>& a) {
  int n = a.size();
  for (int i = 0; i < n - 1; i++) {
    bool swapped = false;
    for (int j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        swap(a[j], a[j + 1]);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  },
  complexity: {
    summary: "All three are O(n²) worst case; insertion sort shines on nearly-sorted data.",
    rows: [
      { label: "Bubble sort", time: "O(n²)", space: "O(1)", note: "O(n) best case (already sorted)." },
      { label: "Selection sort", time: "O(n²)", space: "O(1)", note: "Always n²; fewest swaps." },
      { label: "Insertion sort", time: "O(n²)", space: "O(1)", note: "O(n) on nearly-sorted; stable." },
      { label: "Built-in sort", time: "O(n log n)", space: "O(n)", note: "What you actually use." },
    ],
  },
  mistakes: [
    { title: "Sorting when you didn't need to", body: "If you only need the max or the top-k, a full sort is overkill — a single pass or a heap is faster." },
    { title: "Forgetting the comparator", body: "std::sort is ascending by default. For descending or custom keys, pass a comparator: sort(a.begin(), a.end(), greater<int>())." },
    { title: "Forgetting stability", body: "When sorting records by a second key, an unstable sort can scramble the first key's order — use stable_sort when order matters." },
  ],
  recap: [
    "Bubble, selection, and insertion sort are all O(n²) but behave differently.",
    "Insertion sort is the go-to simple sort for nearly-sorted input.",
    "Reach for the built-in O(n log n) sort in production — with a comparator.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which simple sort is fastest on an array that's already almost sorted?",
      choices: [
        { id: "a", text: "Selection sort" },
        { id: "b", text: "Insertion sort" },
        { id: "c", text: "They're identical" },
        { id: "d", text: "None can beat O(n²) here" },
      ],
      correctId: "b",
      explanation: "Insertion sort does only O(n) work when few elements are out of place.",
      concept: "Adaptivity",
    },
    {
      id: "q2",
      prompt: "In C++, std::sort(a.begin(), a.end()) orders the vector how?",
      choices: [
        { id: "a", text: "Descending by default." },
        { id: "b", text: "Ascending by default; pass a comparator to change it." },
        { id: "c", text: "It only works on already-sorted data." },
        { id: "d", text: "Alphabetically, as strings." },
      ],
      correctId: "b",
      explanation: "std::sort is ascending by default and runs in O(n log n). Pass greater<int>() or a lambda for another order.",
      concept: "std::sort defaults",
    },
    {
      id: "q3",
      prompt: "'Stable' sorting means:",
      choices: [
        { id: "a", text: "It never crashes." },
        { id: "b", text: "Equal elements keep their original relative order." },
        { id: "c", text: "It uses no extra memory." },
        { id: "d", text: "It runs in O(n)." },
      ],
      correctId: "b",
      explanation: "Stability preserves the prior order of equal keys, which matters for multi-key sorts.",
      concept: "Stability",
    },
  ],
  practiceIds: ["lc-maximum-subarray", "lc-3sum", "lc-contains-duplicate"],
  companyTags: ["Google", "Microsoft"],
};
