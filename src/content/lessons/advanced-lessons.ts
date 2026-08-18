import type { Lesson } from "@/lib/schema";

export const treesIntro: Lesson = {
  slug: "trees-intro",
  moduleId: "trees",
  order: 1,
  title: "Trees & binary search trees",
  subtitle: "Recursion's natural home — traversals, depth, and ordered search.",
  estMinutes: 28,
  difficulty: "medium",
  lastReviewed: "2026-07-25",
  published: true,
  hook: "Once recursion clicks, trees become almost free: most tree problems are three lines — do something with the node, recurse left, recurse right.",
  objectives: [
    "Traverse a binary tree in pre-, in-, and post-order.",
    "Compute height and check balance recursively.",
    "Use the BST ordering to search, insert, and validate in O(h).",
  ],
  analogy: {
    emoji: "🌳",
    title: "A family tree",
    body: "Each person (node) has up to two children. To count everyone below you, you ask each child to count their own subtree and add one for yourself — that recursive delegation is exactly how tree algorithms work.",
  },
  concept: [
    { type: "p", text: "A binary tree node holds a value and pointers to a left and right child. Almost every tree algorithm is a depth-first recursion: handle the current node and recurse into its children. Where you 'handle' the node — before, between, or after the recursive calls — gives pre-, in-, and post-order." },
    { type: "code", language: "cpp", code: "struct TreeNode {\n  int val;\n  TreeNode *left, *right;\n  TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}\n};\n\nint maxDepth(TreeNode* root) {\n  if (!root) return 0;                       // base case\n  return 1 + max(maxDepth(root->left),\n                 maxDepth(root->right));      // combine children\n}" },
    { type: "heading", text: "Binary search trees" },
    { type: "p", text: "In a BST, every left descendant is smaller and every right descendant is larger. That invariant lets you search, insert, and delete in O(h) where h is the height — O(log n) when balanced, but O(n) if the tree degenerates into a line." },
    { type: "callout", tone: "info", title: "In-order gives sorted output", text: "Traverse a BST in-order (left, node, right) and the values come out sorted. That's a one-line trick for many BST problems." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "inorder(node)", x: 165, y: 0 },
      { id: "dnull", kind: "decision", label: "node == null ?", x: 150, y: 100 },
      { id: "ret", kind: "end", label: "return", x: 430, y: 114 },
      { id: "left", kind: "process", label: "inorder(node.left)", x: 135, y: 220 },
      { id: "visit", kind: "process", label: "visit node", x: 135, y: 320 },
      { id: "right", kind: "process", label: "inorder(node.right)", x: 135, y: 420 },
    ],
    edges: [
      { id: "e1", from: "start", to: "dnull" },
      { id: "e2", from: "dnull", to: "ret", label: "yes", sourceHandle: "yes" },
      { id: "e3", from: "dnull", to: "left", label: "no" },
      { id: "e4", from: "left", to: "visit" },
      { id: "e5", from: "visit", to: "right" },
    ],
  },
  conceptVisualizer: { conceptId: "tree", codeLineToNode: { "2": "ret", "3": "left", "4": "visit", "5": "right" } },
  pseudocode: `searchBST(node, key):
    if node is null or node.val == key: return node
    if key < node.val: return searchBST(node.left, key)
    else:              return searchBST(node.right, key)`,
  implementation: {
    language: "cpp",
    code: `// Validate a BST by passing down the allowed (low, high) range.
bool valid(TreeNode* node, long lo, long hi) {
  if (!node) return true;
  if (node->val <= lo || node->val >= hi) return false;
  return valid(node->left,  lo, node->val) &&
         valid(node->right, node->val, hi);
}
bool isValidBST(TreeNode* root) {
  return valid(root, LONG_MIN, LONG_MAX);
}`,
  },
  complexity: {
    summary: "Traversals touch every node once; BST operations cost O(height).",
    rows: [
      { label: "Any traversal", time: "O(n)", space: "O(h)", note: "Recursion stack = height." },
      { label: "BST search / insert (balanced)", time: "O(log n)", space: "O(h)", note: "Halving per level." },
      { label: "BST search (degenerate)", time: "O(n)", space: "O(n)", note: "A tree that's a line." },
    ],
  },
  mistakes: [
    { title: "Validating a BST with only local checks", body: "Comparing a node only to its direct children is wrong — pass down a (min, max) range instead." },
    { title: "Forgetting the null base case", body: "Every tree recursion must return something sensible for a null node." },
    { title: "Assuming balance", body: "Insertions can skew a BST into O(n) height; balanced trees (or std::set) avoid this." },
  ],
  recap: [
    "Tree algorithms are DFS recursions: handle node, recurse children.",
    "Pre/in/post-order differ only in when you touch the node.",
    "BST operations are O(height) — O(log n) only when balanced.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "An in-order traversal of a binary search tree visits values in:",
      choices: [
        { id: "a", text: "Random order" },
        { id: "b", text: "Sorted ascending order" },
        { id: "c", text: "Reverse level order" },
        { id: "d", text: "Insertion order" },
      ],
      correctId: "b",
      explanation: "Left → node → right on a BST yields ascending values.",
      concept: "BST in-order",
    },
    {
      id: "q2",
      prompt: "Searching a balanced BST with n nodes costs:",
      choices: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" },
      ],
      correctId: "b",
      explanation: "Each comparison discards one subtree, halving the search — O(height) = O(log n) when balanced.",
      concept: "BST search",
    },
  ],
  practiceIds: ["lc-invert-binary-tree", "lc-max-depth-binary-tree", "lc-diameter-binary-tree", "lc-lca-bst"],
  companyTags: ["Amazon", "Microsoft", "Google"],
};

export const heapsIntro: Lesson = {
  slug: "heaps-intro",
  moduleId: "heaps",
  order: 1,
  title: "Heaps & priority queues",
  subtitle: "Always grab the best item next — top-k and streaming made easy.",
  estMinutes: 24,
  difficulty: "hard",
  lastReviewed: "2026-07-25",
  published: true,
  hook: "When you repeatedly need the smallest or largest item from a changing set, a heap gives it to you in O(log n) — the engine behind Dijkstra, top-k, and median-of-a-stream.",
  objectives: [
    "Describe the heap property and why it enables O(log n) push/pop.",
    "Use a priority queue to solve top-k problems.",
    "Pick a min-heap vs max-heap for a given goal.",
  ],
  analogy: {
    emoji: "🏥",
    title: "An emergency room",
    body: "Patients aren't seen first-come-first-served — the most critical is always next. A heap is that triage nurse: no matter who arrives, it can instantly hand you the highest-priority item.",
  },
  concept: [
    { type: "p", text: "A binary heap is a complete tree where every parent is ≤ (min-heap) or ≥ (max-heap) its children. The best element is always at the root. Push and pop reshuffle just one root-to-leaf path, so both are O(log n). In C++ it's std::priority_queue (a max-heap by default)." },
    { type: "heading", text: "The top-k pattern" },
    { type: "p", text: "To find the k largest elements, keep a min-heap of size k. Each new element pushes in and, if the heap exceeds k, the smallest pops out. What remains are the k largest — in O(n log k)." },
    { type: "code", language: "cpp", code: "// k largest elements using a size-k min-heap.\nvector<int> kLargest(vector<int>& a, int k) {\n  priority_queue<int, vector<int>, greater<int>> pq; // min-heap\n  for (int x : a) {\n    pq.push(x);\n    if ((int)pq.size() > k) pq.pop();  // drop the smallest\n  }\n  vector<int> res;\n  while (!pq.empty()) { res.push_back(pq.top()); pq.pop(); }\n  return res;\n}" },
    { type: "callout", tone: "info", title: "Two heaps find a median", text: "Balance a max-heap of the lower half against a min-heap of the upper half and the median is always at the tops — the classic 'median of a data stream' trick." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "push v; i = last", x: 165, y: 0 },
      { id: "d1", kind: "decision", label: "parent > h[i] ?", x: 155, y: 110 },
      { id: "swap", kind: "process", label: "swap with parent; i = parent", x: 110, y: 240 },
      { id: "end", kind: "end", label: "heap restored", x: 445, y: 124 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "swap", label: "yes" },
      { id: "e3", from: "swap", to: "d1", label: "loop", sourceHandle: "loop" },
      { id: "e4", from: "d1", to: "end", label: "no", sourceHandle: "yes" },
    ],
  },
  conceptVisualizer: { conceptId: "heap", codeLineToNode: { "2": "start", "4": "d1", "5": "swap", "8": "end" } },
  pseudocode: `kLargest(a, k):
    minHeap = empty
    for x in a:
        push x
        if size > k: pop smallest
    return everything in minHeap`,
  implementation: {
    language: "cpp",
    code: `// std::priority_queue is a max-heap by default.
priority_queue<int> maxHeap;
maxHeap.push(5); maxHeap.push(1); maxHeap.push(9);
int best = maxHeap.top();  // 9, in O(1)
maxHeap.pop();             // remove it, O(log n)

// For a min-heap, use greater<int>:
priority_queue<int, vector<int>, greater<int>> minHeap;`,
  },
  complexity: {
    summary: "Root access is O(1); restructuring on push/pop is O(log n).",
    rows: [
      { label: "peek best", time: "O(1)", space: "O(1)", note: "It's the root." },
      { label: "push / pop", time: "O(log n)", space: "O(1)", note: "One root-leaf path." },
      { label: "Build heap from n items", time: "O(n)", space: "O(n)", note: "Heapify bottom-up." },
      { label: "Top-k of n items", time: "O(n log k)", space: "O(k)", note: "Size-k heap." },
    ],
  },
  mistakes: [
    { title: "Wrong heap direction", body: "For k largest use a min-heap of size k; for k smallest use a max-heap. Mixing them up returns the wrong side." },
    { title: "Sorting when a heap suffices", body: "If you only need the top few, a full O(n log n) sort wastes work versus O(n log k)." },
    { title: "Assuming heap order iterates sorted", body: "A heap only guarantees the root; iterating its array is not sorted." },
  ],
  recap: [
    "A heap keeps the best element at the root for O(1) peeking.",
    "Push and pop are O(log n).",
    "A size-k heap solves top-k in O(n log k).",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "To keep the k largest elements of a stream, use:",
      choices: [
        { id: "a", text: "A max-heap of size k" },
        { id: "b", text: "A min-heap of size k" },
        { id: "c", text: "A sorted array rebuilt each step" },
        { id: "d", text: "A queue" },
      ],
      correctId: "b",
      explanation: "A size-k min-heap lets the smallest of the current top-k fall out as bigger values arrive.",
      concept: "Top-k",
    },
    {
      id: "q2",
      prompt: "Popping the best element from a heap of n items costs:",
      choices: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" },
      ],
      correctId: "b",
      explanation: "Removing the root and re-heapifying touches one root-to-leaf path.",
      concept: "Heap pop",
    },
  ],
  practiceIds: ["lc-kth-largest", "lc-k-closest-points", "lc-task-scheduler"],
  companyTags: ["Amazon", "Google"],
};

export const graphsIntro: Lesson = {
  slug: "graphs-intro",
  moduleId: "graphs",
  order: 1,
  title: "Graphs: BFS & DFS",
  subtitle: "Model connections, then explore them breadth-first or depth-first.",
  estMinutes: 30,
  difficulty: "hard",
  lastReviewed: "2026-07-25",
  published: true,
  hook: "Maps, social networks, dependencies, grids — they're all graphs. Two traversals, BFS and DFS, unlock a huge fraction of hard problems.",
  objectives: [
    "Represent a graph with an adjacency list.",
    "Traverse with BFS (queue) and DFS (stack/recursion), avoiding revisits.",
    "Use BFS to find shortest paths in an unweighted graph.",
  ],
  analogy: {
    emoji: "🗺️",
    title: "Exploring a cave system",
    body: "DFS is one explorer charging as deep as possible down a tunnel before backtracking. BFS is a flood of water filling every tunnel one step at a time — the water reaches the nearest exits first, which is why BFS finds shortest paths.",
  },
  concept: [
    { type: "p", text: "A graph is nodes (vertices) connected by edges. The workhorse representation is an adjacency list: for each node, a list of its neighbors. Always keep a visited set so you never process a node twice — forgetting it causes infinite loops on cycles." },
    { type: "code", language: "cpp", code: "// BFS from a source over an adjacency list.\nvector<int> bfs(vector<vector<int>>& adj, int src) {\n  vector<int> order;\n  vector<bool> seen(adj.size(), false);\n  queue<int> q; q.push(src); seen[src] = true;\n  while (!q.empty()) {\n    int u = q.front(); q.pop();\n    order.push_back(u);\n    for (int v : adj[u])\n      if (!seen[v]) { seen[v] = true; q.push(v); }\n  }\n  return order;\n}" },
    { type: "heading", text: "BFS finds shortest paths" },
    { type: "p", text: "Because BFS expands nodes in order of distance from the source, the first time it reaches a node it has found a shortest path (in edges). DFS does not guarantee this — it dives deep first." },
    { type: "callout", tone: "info", title: "Grids are graphs", text: "A 2D grid is just a graph where each cell connects to its four neighbors. 'Number of islands' is a connected-components count solved with BFS or DFS flood fill." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "push src; seen[src]=true", x: 175, y: 0 },
      { id: "d1", kind: "decision", label: "queue empty ?", x: 165, y: 110 },
      { id: "end", kind: "end", label: "done", x: 445, y: 124 },
      { id: "deq", kind: "process", label: "u = dequeue", x: 135, y: 240 },
      { id: "enq", kind: "process", label: "enqueue unseen neighbors", x: 120, y: 350 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "end", label: "yes", sourceHandle: "yes" },
      { id: "e3", from: "d1", to: "deq", label: "no" },
      { id: "e4", from: "deq", to: "enq" },
      { id: "e5", from: "enq", to: "d1", label: "loop", sourceHandle: "loop" },
    ],
  },
  conceptVisualizer: { conceptId: "graph", codeLineToNode: { "3": "start", "5": "deq", "7": "enq" } },
  pseudocode: `bfs(src):
    seen = {src}; queue = [src]
    while queue not empty:
        u = dequeue
        for v in neighbors(u):
            if v not seen:
                mark seen; enqueue v`,
  implementation: {
    language: "cpp",
    code: `// Count connected components (e.g. islands) with DFS flood fill.
void dfs(int u, vector<vector<int>>& adj, vector<bool>& seen) {
  seen[u] = true;
  for (int v : adj[u])
    if (!seen[v]) dfs(v, adj, seen);
}
int components(vector<vector<int>>& adj) {
  int n = adj.size(), count = 0;
  vector<bool> seen(n, false);
  for (int i = 0; i < n; i++)
    if (!seen[i]) { count++; dfs(i, adj, seen); }
  return count;
}`,
  },
  complexity: {
    summary: "Both traversals visit every vertex and edge once.",
    rows: [
      { label: "BFS / DFS", time: "O(V + E)", space: "O(V)", note: "Visited set + frontier." },
      { label: "Shortest path (unweighted)", time: "O(V + E)", space: "O(V)", note: "BFS layers." },
      { label: "Connected components", time: "O(V + E)", space: "O(V)", note: "Traverse from each unseen node." },
    ],
  },
  mistakes: [
    { title: "Forgetting the visited set", body: "Without marking nodes seen, cycles send you into an infinite loop." },
    { title: "Using DFS for shortest paths", body: "DFS can reach a node by a long route first; only BFS guarantees fewest edges." },
    { title: "Marking seen too late", body: "Mark a node visited when you enqueue it, not when you dequeue it, to avoid duplicates in the queue." },
  ],
  recap: [
    "Adjacency lists store each node's neighbors compactly.",
    "Always track visited nodes to avoid infinite loops.",
    "BFS = shortest paths in unweighted graphs; DFS = deep exploration.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which traversal finds the fewest-edges path in an unweighted graph?",
      choices: [
        { id: "a", text: "DFS" },
        { id: "b", text: "BFS" },
        { id: "c", text: "Either works equally" },
        { id: "d", text: "Neither — you need Dijkstra" },
      ],
      correctId: "b",
      explanation: "BFS expands by distance, so it reaches each node via a shortest path first.",
      concept: "BFS shortest path",
    },
    {
      id: "q2",
      prompt: "The time complexity of BFS or DFS on a graph is:",
      choices: [
        { id: "a", text: "O(V²)" },
        { id: "b", text: "O(V + E)" },
        { id: "c", text: "O(E log V)" },
        { id: "d", text: "O(V·E)" },
      ],
      correctId: "b",
      explanation: "Each vertex and each edge is examined a constant number of times.",
      concept: "Traversal cost",
    },
  ],
  practiceIds: ["lc-number-of-islands", "lc-clone-graph", "lc-course-schedule", "lc-pacific-atlantic"],
  companyTags: ["Google", "Meta", "Amazon"],
};

export const greedyIntro: Lesson = {
  slug: "greedy-intro",
  moduleId: "greedy",
  order: 1,
  title: "Greedy algorithms",
  subtitle: "Take the best local choice — and prove it stays best.",
  estMinutes: 24,
  difficulty: "hard",
  lastReviewed: "2026-07-25",
  published: true,
  hook: "Greedy is the most satisfying technique when it works: no tables, no recursion, just the obvious move at each step. The catch is proving 'obvious' is actually optimal.",
  objectives: [
    "Identify when a greedy choice leads to a global optimum.",
    "Solve interval scheduling by sorting on the right key.",
    "Spot a counterexample that breaks a tempting greedy idea.",
  ],
  analogy: {
    emoji: "🪙",
    title: "Making change",
    body: "To give change with the fewest coins, you keep taking the largest coin that fits. With standard coin systems that's provably optimal — but with a weird coin set it can fail, which is exactly why greedy needs justification.",
  },
  concept: [
    { type: "p", text: "A greedy algorithm builds a solution one locally optimal choice at a time, never reconsidering. It's fast and simple, but only correct when the problem has the 'greedy-choice property': a locally optimal step is always part of some globally optimal solution." },
    { type: "heading", text: "Interval scheduling" },
    { type: "p", text: "To attend the most non-overlapping meetings, sort by end time and always take the meeting that finishes earliest among those that still fit. Finishing early leaves the most room for the rest — that's the greedy insight, and it's provably optimal." },
    { type: "code", language: "cpp", code: "// Maximum non-overlapping intervals.\nint maxMeetings(vector<pair<int,int>>& iv) { // (end, start)? we sort by end\n  sort(iv.begin(), iv.end(), [](auto& a, auto& b){\n    return a.second < b.second;   // by end time\n  });\n  int count = 0, lastEnd = INT_MIN;\n  for (auto& [start, end] : iv)\n    if (start >= lastEnd) { count++; lastEnd = end; }\n  return count;\n}" },
    { type: "callout", tone: "warning", title: "Always look for a counterexample", text: "Before trusting a greedy idea, try to break it with a small case. If you can't after real effort, sketch an exchange argument that a greedy choice never hurts." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "sort by end time", x: 165, y: 0 },
      { id: "d1", kind: "decision", label: "start ≥ last ?", x: 155, y: 120 },
      { id: "pick", kind: "process", label: "pick it; last = end", x: 425, y: 134 },
      { id: "skip", kind: "process", label: "skip (overlaps)", x: 130, y: 250 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "pick", label: "yes", sourceHandle: "yes" },
      { id: "e3", from: "d1", to: "skip", label: "no" },
      { id: "e4", from: "pick", to: "d1", label: "next", sourceHandle: "loop" },
      { id: "e5", from: "skip", to: "d1", label: "next", sourceHandle: "loop" },
    ],
  },
  conceptVisualizer: { conceptId: "greedy", codeLineToNode: { "1": "start", "3": "skip", "4": "pick" } },
  pseudocode: `intervalScheduling(intervals):
    sort by end time ascending
    lastEnd = -infinity, count = 0
    for (start, end) in intervals:
        if start >= lastEnd:
            count++; lastEnd = end
    return count`,
  implementation: {
    language: "cpp",
    code: `// Jump Game: can you reach the last index?
bool canJump(vector<int>& nums) {
  int reach = 0;
  for (int i = 0; i < (int)nums.size(); i++) {
    if (i > reach) return false;          // stuck
    reach = max(reach, i + nums[i]);      // greedily extend
  }
  return true;
}`,
  },
  complexity: {
    summary: "Usually dominated by the sort that sets up the greedy pass.",
    rows: [
      { label: "Interval scheduling", time: "O(n log n)", space: "O(1)", note: "Sort + one pass." },
      { label: "Jump game", time: "O(n)", space: "O(1)", note: "Track farthest reach." },
      { label: "Greedy after sort (general)", time: "O(n log n)", space: "O(1)", note: "Sort dominates." },
    ],
  },
  mistakes: [
    { title: "Assuming greedy works", body: "Many problems look greedy but need DP. Verify with a counterexample or a proof." },
    { title: "Sorting on the wrong key", body: "Interval scheduling needs sort-by-end; sort-by-start gives wrong answers." },
    { title: "No proof, no confidence", body: "An exchange argument (swapping to the greedy choice never worsens the answer) is the standard justification." },
  ],
  recap: [
    "Greedy makes an irrevocable best-local choice each step.",
    "It's correct only with the greedy-choice property.",
    "Interval scheduling sorts by end time; always test for counterexamples.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "To schedule the most non-overlapping intervals, sort by:",
      choices: [
        { id: "a", text: "Start time ascending" },
        { id: "b", text: "End time ascending" },
        { id: "c", text: "Length descending" },
        { id: "d", text: "Randomly" },
      ],
      correctId: "b",
      explanation: "Choosing the earliest-finishing interval leaves maximum room for the rest.",
      concept: "Interval scheduling",
    },
    {
      id: "q2",
      prompt: "The main risk of a greedy approach is:",
      choices: [
        { id: "a", text: "It's always too slow." },
        { id: "b", text: "A locally optimal choice may not be globally optimal." },
        { id: "c", text: "It uses too much memory." },
        { id: "d", text: "It can't be coded in C++." },
      ],
      correctId: "b",
      explanation: "Greedy only works when local optimality guarantees global optimality; otherwise it fails.",
      concept: "Greedy pitfalls",
    },
  ],
  practiceIds: ["lc-jump-game", "lc-gas-station", "lc-hand-of-straights"],
  companyTags: ["Google", "Amazon"],
};

export const dpIntro: Lesson = {
  slug: "dp-intro",
  moduleId: "dp",
  order: 1,
  title: "Dynamic programming",
  subtitle: "Remember subproblems so you never solve the same thing twice.",
  estMinutes: 32,
  difficulty: "hard",
  lastReviewed: "2026-07-25",
  published: true,
  hook: "DP is recursion with a memory. The intimidating part is spotting the state; once you name it, the transition and the code almost write themselves.",
  objectives: [
    "Recognize overlapping subproblems and optimal substructure.",
    "Convert a recursion into memoization (top-down) and tabulation (bottom-up).",
    "Define a DP by its state, transition, and base case.",
  ],
  analogy: {
    emoji: "🧗",
    title: "Climbing stairs",
    body: "To reach step n you arrived from step n−1 or n−2, so the ways to reach n equal the ways to reach n−1 plus n−2. Compute each step once, write it down, and the whole climb is linear instead of exponential.",
  },
  concept: [
    { type: "p", text: "Dynamic programming applies when a problem has overlapping subproblems (the same smaller question comes up repeatedly) and optimal substructure (the best answer is built from best sub-answers). Instead of recomputing, you store each subproblem's answer once." },
    { type: "heading", text: "Two directions, same idea" },
    { type: "list", ordered: false, items: [
      "Top-down (memoization): write the natural recursion, then cache results in a table.",
      "Bottom-up (tabulation): fill a table from the base cases upward, no recursion needed.",
      "Both compute each state once — the exponential blowup disappears.",
    ] },
    { type: "code", language: "cpp", code: "// Coin change: fewest coins to make amount.\nint coinChange(vector<int>& coins, int amount) {\n  vector<int> dp(amount + 1, amount + 1);   // 'infinity'\n  dp[0] = 0;                                 // base case\n  for (int a = 1; a <= amount; a++)\n    for (int c : coins)\n      if (c <= a) dp[a] = min(dp[a], 1 + dp[a - c]);\n  return dp[amount] > amount ? -1 : dp[amount];\n}" },
    { type: "callout", tone: "info", title: "Name the state first", text: "Ask: 'what does dp[i] mean?' If you can state it in one sentence ('fewest coins to make i'), the transition follows. If you can't, you don't have the state yet." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "dp[0]=dp[1]=1", x: 165, y: 0 },
      { id: "d1", kind: "decision", label: "i ≤ n ?", x: 155, y: 110 },
      { id: "fill", kind: "process", label: "dp[i]=dp[i-1]+dp[i-2]", x: 110, y: 240 },
      { id: "end", kind: "end", label: "return dp[n]", x: 440, y: 124 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "fill", label: "yes" },
      { id: "e3", from: "fill", to: "d1", label: "loop", sourceHandle: "loop" },
      { id: "e4", from: "d1", to: "end", label: "no", sourceHandle: "yes" },
    ],
  },
  conceptVisualizer: { conceptId: "dp", codeLineToNode: { "1": "start", "3": "fill", "4": "end" } },
  pseudocode: `// State: dp[a] = fewest coins to make amount a
dp[0] = 0
for a in 1..amount:
    dp[a] = min over coins c<=a of (1 + dp[a - c])
answer = dp[amount]`,
  implementation: {
    language: "cpp",
    code: `// Climbing stairs — 1-D DP in O(n) time, O(1) space.
int climbStairs(int n) {
  int a = 1, b = 1;              // ways to reach steps 0 and 1
  for (int i = 2; i <= n; i++) {
    int c = a + b;               // ways to reach step i
    a = b; b = c;
  }
  return b;
}`,
  },
  complexity: {
    summary: "Cost = number of states × work per transition.",
    rows: [
      { label: "Climbing stairs", time: "O(n)", space: "O(1)", note: "Two rolling values." },
      { label: "Coin change", time: "O(amount·coins)", space: "O(amount)", note: "1-D table." },
      { label: "Grid / LCS DP", time: "O(n·m)", space: "O(n·m)", note: "2-D table." },
    ],
  },
  mistakes: [
    { title: "Vague state definition", body: "If you can't say what dp[i] means in one sentence, the transitions will be buggy." },
    { title: "Wrong iteration order", body: "Bottom-up DP must compute a state only after everything it depends on." },
    { title: "Missing base cases", body: "Unset base cases propagate garbage through the whole table." },
  ],
  recap: [
    "DP needs overlapping subproblems + optimal substructure.",
    "Memoization caches a recursion; tabulation fills a table bottom-up.",
    "Define state → transition → base case, in that order.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Dynamic programming helps most when a problem has:",
      choices: [
        { id: "a", text: "No repeated subproblems" },
        { id: "b", text: "Overlapping subproblems and optimal substructure" },
        { id: "c", text: "Only one possible answer" },
        { id: "d", text: "Random inputs" },
      ],
      correctId: "b",
      explanation: "Those two properties are exactly what lets caching turn exponential work into polynomial.",
      concept: "When to use DP",
    },
    {
      id: "q2",
      prompt: "Memoization differs from tabulation in that it:",
      choices: [
        { id: "a", text: "Fills the table bottom-up with loops" },
        { id: "b", text: "Caches results of a top-down recursion" },
        { id: "c", text: "Never stores anything" },
        { id: "d", text: "Only works for graphs" },
      ],
      correctId: "b",
      explanation: "Memoization is the recursive, top-down style that stores each subproblem's result on first computation.",
      concept: "Top-down vs bottom-up",
    },
  ],
  practiceIds: ["lc-climbing-stairs", "lc-coin-change", "lc-house-robber", "lc-longest-increasing-subsequence"],
  companyTags: ["Google", "Meta", "Amazon", "Microsoft"],
};
