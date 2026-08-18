import type { Lesson } from "@/lib/schema";

export const cppStlIntro: Lesson = {
  slug: "cpp-stl-intro",
  moduleId: "cpp-stl",
  order: 1,
  title: "C++ STL: your competitive toolkit",
  subtitle: "vector, sort, set/map, and priority_queue — the containers and algorithms that win contests.",
  estMinutes: 34,
  difficulty: "medium",
  lastReviewed: "2026-07-26",
  published: true,
  hook: "In competitive programming, the difference between solving 4 problems and 6 is often just knowing the STL. Why hand-roll a heap when priority_queue is one line?",
  objectives: [
    "Choose the right STL container: vector, set/map, unordered_*, priority_queue, deque.",
    "Use std::sort with comparators, and lower_bound / upper_bound for binary search.",
    "Reach for ready-made algorithms instead of rewriting them.",
  ],
  analogy: {
    emoji: "🧰",
    title: "A pro's toolbox",
    body: "An amateur carves every tool by hand; a pro opens a toolbox of tested instruments and gets to work. The STL is that toolbox — battle-tested containers and algorithms so you spend your time on the idea, not the plumbing.",
  },
  concept: [
    { type: "p", text: "The Standard Template Library gives you generic, optimized containers and algorithms. Knowing which to grab — and their complexities — is a competitive superpower. The visualizer below animates the sorting that std::sort performs for you in optimized O(n log n)." },
    { type: "heading", text: "The containers you'll use most" },
    { type: "list", ordered: false, items: [
      "vector<T> — a dynamic array; your default. push_back is amortized O(1).",
      "set / map — sorted, O(log n) ops, ordered iteration. unordered_set / unordered_map — average O(1), no order.",
      "priority_queue<T> — a max-heap; top()/push()/pop() for greedy and Dijkstra.",
      "deque, stack, queue — double-ended and disciplined access.",
    ] },
    { type: "heading", text: "Algorithms that save you" },
    { type: "code", language: "cpp", code: "vector<int> a = {5, 2, 8, 1, 9};\nsort(a.begin(), a.end());                 // ascending, O(n log n)\nsort(a.begin(), a.end(), greater<int>()); // descending\n\n// Binary search on sorted data:\nauto it = lower_bound(a.begin(), a.end(), 8); // first >= 8\nint idx = it - a.begin();\n\n// Handy one-liners:\nint g = __gcd(12, 18);                     // 6\nreverse(a.begin(), a.end());\nnext_permutation(a.begin(), a.end());      // next lexicographic order" },
    { type: "callout", tone: "info", title: "Know the complexity, not just the name", text: "set operations are O(log n); unordered_map is average O(1) but can be hacked to O(n). Pick based on whether you need order and how adversarial the judge is." },
  ],
  visualizer: {
    algorithmId: "bubble-sort",
    algorithmOptions: ["bubble-sort", "selection-sort", "insertion-sort"],
    initialInput: [5, 2, 8, 1, 9, 3, 7],
  },
  pseudocode: `// The STL replaces hand-written loops:
sort(v.begin(), v.end());               // sorting
lower_bound(v.begin(), v.end(), x);     // binary search
priority_queue<int> pq;                 // heap
unordered_map<int,int> cnt;             // frequency map`,
  implementation: {
    language: "cpp",
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);                 // fast I/O

  int n; cin >> n;
  vector<int> a(n);
  for (int& x : a) cin >> x;

  sort(a.begin(), a.end());         // O(n log n)

  // count frequencies in O(n) average
  unordered_map<int,int> freq;
  for (int x : a) freq[x]++;

  // largest element via a max-heap
  priority_queue<int> pq(a.begin(), a.end());
  cout << pq.top() << "\\n";
  return 0;
}`,
  },
  complexity: {
    summary: "Match the container to the operation you repeat most.",
    rows: [
      { label: "vector push_back / index", time: "O(1)*", space: "O(n)", note: "Amortized append." },
      { label: "set / map op", time: "O(log n)", space: "O(n)", note: "Ordered, balanced tree." },
      { label: "unordered_map op", time: "O(1) avg", space: "O(n)", note: "Hashing." },
      { label: "sort", time: "O(n log n)", space: "O(log n)", note: "Introsort." },
      { label: "priority_queue push/pop", time: "O(log n)", space: "O(n)", note: "Binary heap." },
    ],
  },
  mistakes: [
    { title: "unordered_map hacks", body: "Contest setters can force worst-case collisions. Add a custom hash or use map when correctness under attack matters." },
    { title: "Integer overflow", body: "int overflows around 2·10⁹. Use long long for sums and products of large values." },
    { title: "Slow I/O", body: "Forgetting sync_with_stdio(false) and cin.tie(nullptr) can TLE on large inputs." },
  ],
  recap: [
    "vector is your default; set/map for order, unordered_* for speed.",
    "std::sort, lower_bound, and priority_queue replace hand-rolled code.",
    "Guard against overflow (long long) and slow I/O in contests.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which container gives average O(1) lookup but no ordering?",
      choices: [
        { id: "a", text: "map" },
        { id: "b", text: "set" },
        { id: "c", text: "unordered_map" },
        { id: "d", text: "vector" },
      ],
      correctId: "c",
      explanation: "unordered_map hashes keys for average O(1) access and does not keep them sorted.",
      concept: "STL containers",
    },
    {
      id: "q2",
      prompt: "std::priority_queue<int> by default behaves as a:",
      choices: [
        { id: "a", text: "Min-heap" },
        { id: "b", text: "Max-heap" },
        { id: "c", text: "Sorted list" },
        { id: "d", text: "Queue (FIFO)" },
      ],
      correctId: "b",
      explanation: "By default the largest element sits on top; use greater<int> for a min-heap.",
      concept: "priority_queue",
    },
    {
      id: "q3",
      prompt: "To avoid TLE from input on large cases, you should:",
      choices: [
        { id: "a", text: "Use printf everywhere" },
        { id: "b", text: "Call sync_with_stdio(false) and cin.tie(nullptr)" },
        { id: "c", text: "Read input twice" },
        { id: "d", text: "Use global variables" },
      ],
      correctId: "b",
      explanation: "Un-syncing C and C++ streams and untying cin/cout dramatically speeds up I/O.",
      concept: "Fast I/O",
    },
  ],
  practiceIds: ["lc-two-sum", "lc-group-anagrams", "lc-kth-largest", "lc-binary-search"],
  companyTags: ["Codeforces", "Google", "Amazon"],
};

export const cpToolkitIntro: Lesson = {
  slug: "cp-toolkit-intro",
  moduleId: "cp-toolkit",
  order: 1,
  title: "Competitive programming toolkit",
  subtitle: "Fast I/O, bit tricks, prefix sums, and modular arithmetic.",
  estMinutes: 30,
  difficulty: "hard",
  lastReviewed: "2026-07-26",
  published: true,
  hook: "Contests reward a small kit of reusable tricks. Learn them once and they show up in problem after problem.",
  objectives: [
    "Set up fast I/O and avoid integer overflow with long long.",
    "Use bit manipulation for sets, parity, and power-of-two checks.",
    "Apply prefix sums and modular arithmetic for range and big-number problems.",
  ],
  analogy: {
    emoji: "🏎️",
    title: "A pit crew",
    body: "A race is won in the pit as much as on the track. These utilities are your pit crew — tiny, well-drilled routines that shave the milliseconds and bugs that separate Accepted from Time Limit Exceeded.",
  },
  concept: [
    { type: "heading", text: "Bit manipulation" },
    { type: "code", language: "cpp", code: "x & 1            // is x odd?\nx >> 1           // divide by 2\nx & (x - 1)      // clears lowest set bit\n(x & (x-1)) == 0 // is x a power of two? (x>0)\n1 << k           // 2^k, use 1LL<<k for big k\n__builtin_popcount(x) // number of set bits" },
    { type: "heading", text: "Prefix sums" },
    { type: "p", text: "Precompute cumulative sums so any range sum is a single subtraction — turning many range queries from O(n) each into O(1) each after O(n) setup." },
    { type: "heading", text: "Modular arithmetic" },
    { type: "p", text: "Answers to counting problems are often huge, so they're asked modulo a prime like 1e9+7. Take the modulus after every addition and multiplication to keep numbers in range, and use fast exponentiation for powers." },
    { type: "callout", tone: "warning", title: "Overflow is the silent killer", text: "1e9 + 1e9 overflows a 32-bit int. Multiply two ints near 1e9 and you're far past the limit. Reach for long long, and take the mod before it overflows." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "x = 0", x: 165, y: 0 },
      { id: "d1", kind: "decision", label: "more values ?", x: 155, y: 110 },
      { id: "xor", kind: "process", label: "x ^= v", x: 125, y: 240 },
      { id: "end", kind: "end", label: "return x", x: 430, y: 124 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "xor", label: "yes" },
      { id: "e3", from: "xor", to: "d1", label: "loop", sourceHandle: "loop" },
      { id: "e4", from: "d1", to: "end", label: "no", sourceHandle: "yes" },
    ],
  },
  conceptVisualizer: { conceptId: "bits", codeLineToNode: { "2": "start", "3": "xor", "4": "end" } },
  pseudocode: `// prefix sums
prefix[0] = 0
for i in 0..n-1: prefix[i+1] = prefix[i] + a[i]
rangeSum(l, r) = prefix[r+1] - prefix[l]

// modular multiply
(a * b) % MOD   // with a, b already reduced mod MOD`,
  implementation: {
    language: "cpp",
    code: `const long long MOD = 1e9 + 7;

// Fast modular exponentiation: base^exp % MOD in O(log exp).
long long power(long long base, long long exp) {
  long long result = 1; base %= MOD;
  while (exp > 0) {
    if (exp & 1) result = result * base % MOD;
    base = base * base % MOD;
    exp >>= 1;
  }
  return result;
}`,
  },
  complexity: {
    summary: "These utilities are cheap — most are O(1) or O(log n) per use.",
    rows: [
      { label: "Prefix build / query", time: "O(n) / O(1)", space: "O(n)", note: "Setup then constant queries." },
      { label: "Bit tricks", time: "O(1)", space: "O(1)", note: "Single machine ops." },
      { label: "Modular exponentiation", time: "O(log e)", space: "O(1)", note: "Square-and-multiply." },
    ],
  },
  mistakes: [
    { title: "32-bit overflow", body: "Sums/products of values near 1e9 overflow int. Use long long and mod early." },
    { title: "Negative modulo", body: "In C++, (-3) % 5 is -3, not 2. Add MOD then take mod again for a non-negative result." },
    { title: "Off-by-one in prefix sums", body: "Keep prefix length n+1 with prefix[0]=0 to make range math clean." },
  ],
  recap: [
    "Enable fast I/O and default to long long for big arithmetic.",
    "Bit tricks handle parity, powers of two, and subsets cheaply.",
    "Prefix sums give O(1) range queries; take the mod after every op.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "The expression x & (x - 1) == 0 (for x > 0) tests whether x is:",
      choices: [
        { id: "a", text: "Odd" },
        { id: "b", text: "A power of two" },
        { id: "c", text: "Negative" },
        { id: "d", text: "Prime" },
      ],
      correctId: "b",
      explanation: "A power of two has exactly one set bit, so clearing the lowest set bit yields 0.",
      concept: "Bit tricks",
    },
    {
      id: "q2",
      prompt: "Why take the modulus after every multiplication in counting problems?",
      choices: [
        { id: "a", text: "To make the code shorter" },
        { id: "b", text: "To keep intermediate values from overflowing" },
        { id: "c", text: "Because it changes the answer" },
        { id: "d", text: "It's only for output formatting" },
      ],
      correctId: "b",
      explanation: "Reducing mod after each op keeps numbers small enough to avoid overflow while preserving the result mod p.",
      concept: "Modular arithmetic",
    },
  ],
  practiceIds: ["cf-watermelon", "cf-theatre-square", "cf-way-too-long-words"],
  companyTags: ["Codeforces"],
};

export const advancedIntro: Lesson = {
  slug: "advanced-intro",
  moduleId: "advanced",
  order: 1,
  title: "Advanced structures",
  subtitle: "Union-Find, tries, and range-query trees for the hardest problems.",
  estMinutes: 30,
  difficulty: "hard",
  lastReviewed: "2026-07-26",
  published: true,
  hook: "When the basics aren't enough, these four structures unlock a tier of problems: connectivity, prefix queries, and dynamic range sums that would otherwise be impossible in time.",
  objectives: [
    "Use Disjoint Set Union to merge groups and query connectivity near O(1).",
    "Store strings in a trie for prefix queries.",
    "Recognize when a Fenwick or segment tree is needed for range queries.",
  ],
  analogy: {
    emoji: "🧩",
    title: "Specialist tools",
    body: "You don't reach for a torque wrench every day, but when a bolt needs exact tension nothing else will do. These structures are specialists — overkill for easy problems, indispensable for the hard ones.",
  },
  concept: [
    { type: "heading", text: "Disjoint Set Union (Union-Find)" },
    { type: "p", text: "DSU tracks a partition of elements into groups. With path compression and union by rank, both 'which group is x in?' and 'merge x's and y's groups' run in near-constant amortized time — the go-to for connectivity and Kruskal's MST." },
    { type: "code", language: "cpp", code: "struct DSU {\n  vector<int> p, r;\n  DSU(int n): p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }\n  int find(int x) { return p[x]==x ? x : p[x]=find(p[x]); }\n  void unite(int a, int b) {\n    a=find(a); b=find(b); if (a==b) return;\n    if (r[a]<r[b]) swap(a,b);\n    p[b]=a; if (r[a]==r[b]) r[a]++;\n  }\n};" },
    { type: "heading", text: "Trie, Fenwick, and segment trees" },
    { type: "list", ordered: false, items: [
      "Trie — a tree keyed by characters; prefix search and autocomplete in O(word length).",
      "Fenwick (BIT) — prefix sums with point updates, both O(log n), tiny and fast.",
      "Segment tree — range queries and range updates in O(log n); the Swiss-army knife of range problems.",
    ] },
    { type: "callout", tone: "info", title: "Reach for these last", text: "They're powerful but bug-prone. Confirm a simpler structure truly can't meet the constraints before writing a segment tree under contest pressure." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "unite(a, b)", x: 165, y: 0 },
      { id: "fa", kind: "process", label: "ra = find(a)", x: 155, y: 110 },
      { id: "fb", kind: "process", label: "rb = find(b)", x: 155, y: 210 },
      { id: "link", kind: "process", label: "p[ra] = rb", x: 155, y: 310 },
      { id: "end", kind: "end", label: "sets merged", x: 430, y: 324 },
    ],
    edges: [
      { id: "e1", from: "start", to: "fa" },
      { id: "e2", from: "fa", to: "fb" },
      { id: "e3", from: "fb", to: "link" },
      { id: "e4", from: "link", to: "end" },
    ],
  },
  conceptVisualizer: { conceptId: "union-find", codeLineToNode: { "2": "fa", "5": "link" } },
  pseudocode: `find(x):  if p[x] != x: p[x] = find(p[x])   // path compression
          return p[x]
unite(a, b): link the smaller tree under the larger`,
  implementation: {
    language: "cpp",
    code: `// Fenwick tree: prefix sums with point updates, both O(log n).
struct Fenwick {
  vector<long long> t;
  Fenwick(int n): t(n + 1, 0) {}
  void add(int i, long long v) {         // 1-indexed
    for (; i < (int)t.size(); i += i & -i) t[i] += v;
  }
  long long sum(int i) {                  // prefix sum [1..i]
    long long s = 0;
    for (; i > 0; i -= i & -i) s += t[i];
    return s;
  }
};`,
  },
  complexity: {
    summary: "All offer logarithmic (or near-constant) operations that simpler structures can't.",
    rows: [
      { label: "DSU find / union", time: "O(α(n))", space: "O(n)", note: "Near-constant amortized." },
      { label: "Trie insert / search", time: "O(L)", space: "O(Σ·nodes)", note: "L = word length." },
      { label: "Fenwick update / query", time: "O(log n)", space: "O(n)", note: "Prefix sums." },
      { label: "Segment tree", time: "O(log n)", space: "O(n)", note: "Range query + update." },
    ],
  },
  mistakes: [
    { title: "DSU without compression", body: "Skipping path compression or union by rank degrades DSU toward O(n) per operation." },
    { title: "Fenwick indexing", body: "BITs are 1-indexed; mixing in 0-based indices silently corrupts sums." },
    { title: "Over-engineering", body: "Don't write a segment tree when a prefix-sum array or a sort would do." },
  ],
  recap: [
    "DSU merges and queries groups in near-constant time.",
    "Tries make prefix queries O(word length).",
    "Fenwick and segment trees answer range queries in O(log n).",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which structure best answers 'are x and y in the same group?' with fast merges?",
      choices: [
        { id: "a", text: "Trie" },
        { id: "b", text: "Disjoint Set Union" },
        { id: "c", text: "Segment tree" },
        { id: "d", text: "Hash map" },
      ],
      correctId: "b",
      explanation: "DSU is purpose-built for connectivity: near-constant find and union.",
      concept: "Union-Find",
    },
    {
      id: "q2",
      prompt: "A Fenwick tree supports prefix-sum queries and point updates in:",
      choices: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" },
      ],
      correctId: "b",
      explanation: "Both operations walk O(log n) indices using the low-bit trick.",
      concept: "Fenwick tree",
    },
  ],
  practiceIds: ["lc-implement-trie", "lc-number-of-provinces", "lc-range-sum-query"],
  companyTags: ["Google", "Codeforces"],
};
