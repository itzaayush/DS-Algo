import type { Pattern } from "@/lib/schema";

/**
 * The remaining Pattern Lab units (previously "in production"). Each is fully
 * authored: recognition signals, intuition, a C++ template, failure modes,
 * variations, an interactive recognition check, and a practice ladder that
 * references the pattern bank.
 */
export const MORE_PATTERNS: Pattern[] = [
  {
    slug: "merge-intervals",
    order: 6,
    title: "Merge Intervals",
    summary: "Sort by start, then coalesce anything that overlaps.",
    difficulty: "medium",
    estMinutes: 30,
    published: true,
    recognitionSignals: [
      "The input is a set of [start, end] ranges.",
      "You must merge, insert, count overlaps, or find free time.",
      "The answer depends on how ranges relate, not their original order.",
    ],
    intuition:
      "Sort intervals by start. Sweep left to right keeping the current merged interval; if the next one starts before the current ends, extend the end, otherwise close the current interval and open a new one.",
    visualModel:
      "Calendar blocks on a timeline: slide them together and any that touch fuse into one longer block.",
    template: {
      language: "cpp",
      code: `sort(iv.begin(), iv.end());
vector<vector<int>> merged;
for (auto& x : iv) {
  if (merged.empty() || merged.back()[1] < x[0])
    merged.push_back(x);                       // no overlap
  else
    merged.back()[1] = max(merged.back()[1], x[1]); // extend
}
return merged;`,
    },
    complexity: "O(n log n) for the sort, then a single O(n) sweep.",
    mistakes: [
      "Forgetting to sort by start first — the sweep logic breaks.",
      "Using < vs <= inconsistently when deciding whether touching intervals merge.",
    ],
    variations: [
      "Insert one interval into a sorted list.",
      "Count the minimum arrows/rooms (sort by end).",
      "Intersect two interval lists with two pointers.",
    ],
    prerequisites: ["sorting"],
    relatedPatterns: ["greedy-choice", "two-pointers"],
    practiceIds: ["lc-merge-intervals", "lc-insert-interval", "lc-interval-intersections", "lc-min-arrows-balloons"],
    companyTags: ["Amazon", "Meta", "Google"],
    recognition: [
      {
        id: "r1",
        prompt: "Before merging intervals, the essential first step is to:",
        choices: [
          { id: "a", text: "Sort them by end time" },
          { id: "b", text: "Sort them by start time" },
          { id: "c", text: "Put them in a hash set" },
          { id: "d", text: "Reverse the list" },
        ],
        correctId: "b",
        explanation: "Sorting by start lets a single left-to-right sweep decide overlaps correctly.",
      },
    ],
  },
  {
    slug: "cyclic-placement",
    order: 7,
    title: "Cyclic Placement (Cyclic Sort)",
    summary: "When values are 1..n, put each at its home index in O(n).",
    difficulty: "medium",
    estMinutes: 28,
    published: true,
    recognitionSignals: [
      "The array holds numbers in a known range like 1..n or 0..n.",
      "You're asked for a missing, duplicated, or misplaced number.",
      "The interviewer wants O(n) time and O(1) extra space.",
    ],
    intuition:
      "Each value has a 'home' index (value − 1). Repeatedly swap the current value to its home until it's already correct, then move on. Afterward, any index whose value isn't home reveals the answer.",
    visualModel:
      "Numbered seats: send every guest to their own seat by a chain of swaps; empty or double-booked seats expose the missing/duplicate.",
    template: {
      language: "cpp",
      code: `int i = 0;
while (i < n) {
  int home = nums[i] - 1;               // where nums[i] belongs
  if (nums[i] >= 1 && nums[i] <= n && nums[i] != nums[home])
    swap(nums[i], nums[home]);
  else
    i++;
}
// Scan: first index where nums[i] != i + 1 is the answer.`,
    },
    complexity: "O(n) time, O(1) extra space (each value reaches home once).",
    mistakes: [
      "Advancing i after a swap — you must re-check the newly placed value.",
      "Not bounding values before indexing (out-of-range values cause crashes).",
    ],
    variations: [
      "Missing number / all disappeared numbers.",
      "Find the duplicate(s).",
      "Set mismatch (one missing + one duplicate).",
    ],
    prerequisites: ["arrays"],
    relatedPatterns: ["fast-slow-pointers"],
    practiceIds: ["lc-missing-number", "lc-find-disappeared", "lc-set-mismatch", "lc-find-all-duplicates", "lc-first-missing-positive"],
    companyTags: ["Amazon", "Google"],
    recognition: [
      {
        id: "r1",
        prompt: "An array of length n holds values in 1..n and you must find the missing one in O(1) space. Best pattern?",
        choices: [
          { id: "a", text: "Sort it" },
          { id: "b", text: "Cyclic placement (put each value at index value−1)" },
          { id: "c", text: "Hash set" },
          { id: "d", text: "Binary search" },
        ],
        correctId: "b",
        explanation: "The 1..n range means each value has a home index, enabling in-place placement.",
      },
    ],
  },
  {
    slug: "monotonic-stack",
    order: 9,
    title: "Monotonic Stack & Queue",
    summary: "Answer 'next greater / smaller' for every element in one pass.",
    difficulty: "medium",
    estMinutes: 32,
    published: true,
    recognitionSignals: [
      "You need the next/previous greater or smaller element.",
      "A brute force compares each element with everything to its right.",
      "Spans, temperatures, stock spans, or histogram-style problems.",
    ],
    intuition:
      "Keep a stack whose values stay sorted (monotonic). As you scan, pop elements that the current value 'resolves', settling their answer. Each index is pushed and popped once, giving O(n).",
    visualModel:
      "A stack of plates where you toss out every plate shorter than the new one before setting it down.",
    template: {
      language: "cpp",
      code: `stack<int> st;                 // stores indices; values decreasing
vector<int> nextGreater(n, -1);
for (int i = 0; i < n; i++) {
  while (!st.empty() && a[st.top()] < a[i]) {
    nextGreater[st.top()] = i;   // a[i] resolves st.top()
    st.pop();
  }
  st.push(i);
}`,
    },
    complexity: "O(n) time — each index enters and leaves the stack once.",
    mistakes: [
      "Storing values instead of indices when you need positions or distances.",
      "Choosing the wrong monotonic direction (increasing vs decreasing).",
    ],
    variations: [
      "Daily temperatures / stock span.",
      "Largest rectangle in a histogram.",
      "Monotonic deque for sliding-window maximum.",
    ],
    prerequisites: ["stacks-queues"],
    relatedPatterns: ["sliding-window"],
    practiceIds: ["lc-daily-temperatures", "lc-next-greater-ii", "lc-car-fleet", "lc-largest-rectangle"],
    companyTags: ["Amazon", "Google", "Bloomberg"],
    recognition: [
      {
        id: "r1",
        prompt: "'For each day, how many days until a warmer temperature?' is a textbook use of:",
        choices: [
          { id: "a", text: "Binary search" },
          { id: "b", text: "A monotonic stack" },
          { id: "c", text: "Union-find" },
          { id: "d", text: "Backtracking" },
        ],
        correctId: "b",
        explanation: "A decreasing stack of indices resolves each day's next-greater in a single pass.",
      },
    ],
  },
  {
    slug: "top-k-heap",
    order: 10,
    title: "Top-K & Heap Selection",
    summary: "Maintain the best k items with a size-k heap.",
    difficulty: "medium",
    estMinutes: 30,
    published: true,
    recognitionSignals: [
      "You need the k largest/smallest/most-frequent items.",
      "You repeatedly need the current best from a changing set.",
      "A full sort is overkill because k ≪ n.",
    ],
    intuition:
      "A heap gives the extreme element in O(1) and updates in O(log k). Keep a size-k heap: for k largest use a min-heap and drop the smallest when it overflows.",
    visualModel:
      "A leaderboard that only keeps the top k scores — a new score bumps out the current lowest.",
    template: {
      language: "cpp",
      code: `priority_queue<int, vector<int>, greater<int>> pq; // min-heap
for (int x : a) {
  pq.push(x);
  if ((int)pq.size() > k) pq.pop();  // drop the smallest
}
// pq now holds the k largest elements.`,
    },
    complexity: "O(n log k) time, O(k) space — beats O(n log n) sorting when k is small.",
    mistakes: [
      "Using a max-heap for 'k largest' (you want a min-heap of size k).",
      "Sorting everything when only the top few are needed.",
    ],
    variations: [
      "Top-k frequent elements (count, then heap).",
      "K closest points to origin.",
      "Two heaps for a running median.",
    ],
    prerequisites: ["heaps"],
    relatedPatterns: ["frequency-hashing"],
    practiceIds: ["lc-kth-largest", "lc-top-k-frequent", "lc-k-closest-points", "lc-find-median-stream", "lc-merge-k-lists"],
    companyTags: ["Amazon", "Meta", "Google"],
    recognition: [
      {
        id: "r1",
        prompt: "To keep the k largest of a stream, the right heap is:",
        choices: [
          { id: "a", text: "A max-heap of size k" },
          { id: "b", text: "A min-heap of size k" },
          { id: "c", text: "A sorted array" },
          { id: "d", text: "A queue" },
        ],
        correctId: "b",
        explanation: "A size-k min-heap lets the smallest of the current top-k fall out as bigger values arrive.",
      },
    ],
  },
  {
    slug: "tree-traversal",
    order: 11,
    title: "Tree DFS & BFS Templates",
    summary: "Reusable skeletons for every binary-tree question.",
    difficulty: "medium",
    estMinutes: 32,
    published: true,
    recognitionSignals: [
      "The input is a binary (or n-ary) tree.",
      "You need depth, a path, a level, validation, or a transformation.",
      "The answer at a node depends on its children (or its level).",
    ],
    intuition:
      "Most tree problems are one DFS: do work before, between, or after the recursive calls (pre/in/post-order). 'By level' problems are a BFS with a queue.",
    visualModel:
      "DFS dives to the bottom of one branch before backing up; BFS floods outward one ring at a time.",
    template: {
      language: "cpp",
      code: `// DFS — returns info up from children.
int dfs(TreeNode* node) {
  if (!node) return 0;                 // base case
  int L = dfs(node->left);
  int R = dfs(node->right);
  return 1 + max(L, R);                // combine (here: height)
}

// BFS — process one level at a time.
queue<TreeNode*> q; q.push(root);
while (!q.empty()) {
  int sz = q.size();
  for (int i = 0; i < sz; i++) {
    TreeNode* n = q.front(); q.pop();
    if (n->left)  q.push(n->left);
    if (n->right) q.push(n->right);
  }
}`,
    },
    complexity: "O(n) time; O(h) space for DFS recursion, O(width) for BFS.",
    mistakes: [
      "Missing the null base case in the recursion.",
      "Validating a BST with only parent-child comparisons instead of a (min, max) range.",
    ],
    variations: [
      "Depth, diameter, balance (post-order).",
      "Validate BST / kth smallest (in-order).",
      "Level order, right-side view (BFS).",
    ],
    prerequisites: ["trees", "recursion"],
    relatedPatterns: ["graph-traversal", "backtracking"],
    practiceIds: ["lc-invert-binary-tree", "lc-max-depth-binary-tree", "lc-validate-bst", "lc-right-side-view", "lc-max-path-sum", "lc-serialize-tree"],
    companyTags: ["Amazon", "Meta", "Microsoft"],
    recognition: [
      {
        id: "r1",
        prompt: "To return values level by level from a tree, use:",
        choices: [
          { id: "a", text: "In-order DFS" },
          { id: "b", text: "BFS with a queue" },
          { id: "c", text: "A monotonic stack" },
          { id: "d", text: "Union-find" },
        ],
        correctId: "b",
        explanation: "Processing the queue one level's worth of nodes at a time yields level-order output.",
      },
    ],
  },
  {
    slug: "graph-traversal",
    order: 12,
    title: "Graph Traversal & Components",
    summary: "Flood fill, connectivity, and shortest unweighted paths.",
    difficulty: "medium",
    estMinutes: 34,
    published: true,
    recognitionSignals: [
      "Nodes and edges — or a grid where cells connect to neighbors.",
      "You need connected components, reachability, or shortest steps.",
      "Words like 'islands', 'regions', 'provinces', 'flood'.",
    ],
    intuition:
      "Visit nodes with DFS (recursion/stack) or BFS (queue), marking each visited so cycles don't loop forever. BFS additionally gives shortest paths in unweighted graphs.",
    visualModel:
      "Pour water onto a cell: it spreads to every connected cell, painting one whole component.",
    template: {
      language: "cpp",
      code: `void dfs(int u, vector<vector<int>>& adj, vector<bool>& seen) {
  seen[u] = true;
  for (int v : adj[u])
    if (!seen[v]) dfs(v, adj, seen);
}

// Count components:
int comps = 0;
for (int i = 0; i < n; i++)
  if (!seen[i]) { comps++; dfs(i, adj, seen); }`,
    },
    complexity: "O(V + E) — each vertex and edge visited a constant number of times.",
    mistakes: [
      "Forgetting the visited set — cycles cause infinite loops.",
      "Using DFS for shortest paths (only BFS guarantees fewest edges).",
    ],
    variations: [
      "Number of islands / max area (grid flood fill).",
      "Multi-source BFS (rotting oranges).",
      "Shortest transformation (word ladder).",
    ],
    prerequisites: ["graphs"],
    relatedPatterns: ["tree-traversal", "topological-sort", "union-find"],
    practiceIds: ["lc-flood-fill", "lc-number-of-islands", "lc-clone-graph", "lc-rotting-oranges", "lc-pacific-atlantic", "lc-word-ladder"],
    companyTags: ["Amazon", "Google", "Meta"],
    recognition: [
      {
        id: "r1",
        prompt: "'Count the number of islands in a grid' is fundamentally:",
        choices: [
          { id: "a", text: "A sorting problem" },
          { id: "b", text: "Counting connected components via flood fill" },
          { id: "c", text: "Binary search" },
          { id: "d", text: "A heap problem" },
        ],
        correctId: "b",
        explanation: "Each unvisited land cell starts one flood fill; the number of fills is the island count.",
      },
    ],
  },
  {
    slug: "topological-sort",
    order: 13,
    title: "Topological Ordering",
    summary: "Order a DAG so every prerequisite comes before what needs it.",
    difficulty: "hard",
    estMinutes: 32,
    published: true,
    recognitionSignals: [
      "Tasks with dependencies / prerequisites.",
      "You must find a valid order or detect an impossible cycle.",
      "A directed graph that should be acyclic.",
    ],
    intuition:
      "Kahn's algorithm: repeatedly take any node with no remaining prerequisites (in-degree 0), remove it, and decrement its neighbors. If you can't place every node, a cycle exists.",
    visualModel:
      "Peeling a to-do list: do everything with nothing blocking it, which unblocks the next layer.",
    template: {
      language: "cpp",
      code: `vector<int> indeg(n, 0);
for (auto& [u, v] : edges) indeg[v]++;   // u must come before v
queue<int> q;
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
vector<int> order;
while (!q.empty()) {
  int u = q.front(); q.pop(); order.push_back(u);
  for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
}
if ((int)order.size() != n) { /* cycle: no valid order */ }`,
    },
    complexity: "O(V + E) time and space.",
    mistakes: [
      "Forgetting the cycle check (order shorter than n means a cycle).",
      "Reversing edge direction — prerequisite u → v means u first.",
    ],
    variations: [
      "Course schedule (feasibility) and course schedule II (an order).",
      "Alien dictionary (derive edges from word order).",
      "Minimum height trees (peel leaves inward).",
    ],
    prerequisites: ["graphs"],
    relatedPatterns: ["graph-traversal"],
    practiceIds: ["lc-course-schedule", "lc-course-schedule-ii", "lc-min-height-trees", "lc-alien-dictionary"],
    companyTags: ["Amazon", "Meta", "Google"],
    recognition: [
      {
        id: "r1",
        prompt: "'Can all courses be finished given prerequisites?' is solved by:",
        choices: [
          { id: "a", text: "Detecting a cycle via topological sort" },
          { id: "b", text: "Binary search" },
          { id: "c", text: "A sliding window" },
          { id: "d", text: "Greedy sorting" },
        ],
        correctId: "a",
        explanation: "If a topological order includes every course, there's no dependency cycle, so it's feasible.",
      },
    ],
  },
  {
    slug: "backtracking",
    order: 14,
    title: "Backtracking Decision Trees",
    summary: "Choose, explore, un-choose — with pruning.",
    difficulty: "hard",
    estMinutes: 36,
    published: true,
    recognitionSignals: [
      "'Generate all', 'find every combination/permutation', or 'is there a valid arrangement'.",
      "The search space is a tree of choices.",
      "Constraints let you prune whole branches early.",
    ],
    intuition:
      "Walk a decision tree: make a choice, recurse to explore its consequences, then undo it so the next sibling starts clean. Prune the moment a branch can't yield a valid answer.",
    visualModel:
      "Exploring a maze while dropping breadcrumbs — dead ends send you back to the last junction to try another door.",
    template: {
      language: "cpp",
      code: `void backtrack(int start, vector<int>& cur,
               vector<vector<int>>& out) {
  out.push_back(cur);                    // record (for subsets)
  for (int i = start; i < n; i++) {
    cur.push_back(a[i]);                 // choose
    backtrack(i + 1, cur, out);          // explore
    cur.pop_back();                      // un-choose
  }
}`,
    },
    complexity: "Often exponential (O(2ⁿ) subsets, O(n·n!) permutations) — pruning is what makes it feasible.",
    mistakes: [
      "Forgetting to undo the choice, corrupting sibling branches.",
      "Not skipping duplicates (sort first, then skip equal values at a level).",
    ],
    variations: [
      "Subsets, permutations, combination sum.",
      "Grid search (word search), palindrome partitioning.",
      "Constraint puzzles: N-Queens, Sudoku.",
    ],
    prerequisites: ["recursion"],
    relatedPatterns: ["tree-traversal", "bitmasking"],
    practiceIds: ["lc-subsets", "lc-combination-sum", "lc-generate-parentheses", "lc-word-search", "lc-palindrome-partitioning", "lc-n-queens"],
    companyTags: ["Amazon", "Meta", "Google"],
    recognition: [
      {
        id: "r1",
        prompt: "After recursing on a choice in backtracking, you must:",
        choices: [
          { id: "a", text: "Return immediately" },
          { id: "b", text: "Undo the choice before trying the next one" },
          { id: "c", text: "Sort the array" },
          { id: "d", text: "Clear all state" },
        ],
        correctId: "b",
        explanation: "Un-choosing restores shared state so the next sibling branch explores correctly.",
      },
    ],
  },
  {
    slug: "greedy-choice",
    order: 15,
    title: "Greedy Choice Patterns",
    summary: "Take the locally best option — when it's provably global.",
    difficulty: "hard",
    estMinutes: 30,
    published: true,
    recognitionSignals: [
      "You can define an obvious 'best next move'.",
      "Sorting by the right key exposes that move.",
      "You can argue (or test) that the local choice never hurts.",
    ],
    intuition:
      "Commit to the best immediate choice and never look back. It's correct only when the problem has the greedy-choice property — otherwise you need DP.",
    visualModel:
      "Packing a bag by always grabbing the next most valuable item that still fits.",
    template: {
      language: "cpp",
      code: `sort(items.begin(), items.end(), byKey);   // reveal the greedy order
int result = 0, last = INT_MIN;
for (auto& x : items) {
  if (compatible(x, last)) {                // best local choice
    result++;
    last = x.end;
  }
}
return result;`,
    },
    complexity: "Usually O(n log n) — dominated by the sort that sets up the sweep.",
    mistakes: [
      "Assuming greedy works without a proof or counterexample check.",
      "Sorting on the wrong key (intervals: sort by end, not start).",
    ],
    variations: [
      "Jump game / jump game II (farthest reach).",
      "Interval scheduling & partition labels.",
      "Gas station, valid parenthesis string.",
    ],
    prerequisites: ["greedy", "sorting"],
    relatedPatterns: ["merge-intervals", "one-d-dp"],
    practiceIds: ["lc-jump-game", "lc-jump-game-ii", "lc-gas-station", "lc-partition-labels", "lc-non-overlapping", "lc-valid-parenthesis-string"],
    companyTags: ["Amazon", "Google"],
    recognition: [
      {
        id: "r1",
        prompt: "A greedy algorithm is only correct when:",
        choices: [
          { id: "a", text: "The input is small" },
          { id: "b", text: "A locally optimal choice is always part of a global optimum" },
          { id: "c", text: "It's written recursively" },
          { id: "d", text: "The array is sorted" },
        ],
        correctId: "b",
        explanation: "That's the greedy-choice property; without it, greedy can miss the optimum and you need DP.",
      },
    ],
  },
  {
    slug: "one-d-dp",
    order: 16,
    title: "1-D Dynamic Programming",
    summary: "State, transition, base case — over a single dimension.",
    difficulty: "hard",
    estMinutes: 34,
    published: true,
    recognitionSignals: [
      "'How many ways', 'min/max cost', or 'is it possible' over a sequence.",
      "The answer at position i depends on a few earlier positions.",
      "A naive recursion recomputes the same subproblems.",
    ],
    intuition:
      "Define dp[i] in one sentence, write the transition from smaller indices, set the base case, and fill the table in order. Cache turns exponential recursion into linear work.",
    visualModel:
      "Climbing stairs where each step's count is the sum of the two below it — compute once, reuse forever.",
    template: {
      language: "cpp",
      code: `vector<int> dp(n + 1);
dp[0] = base0;                       // base case(s)
for (int i = 1; i <= n; i++) {
  dp[i] = combine(dp[i - 1], dp[i - 2], a[i]);  // transition
}
return dp[n];`,
    },
    complexity: "O(n · transitions) time; often reducible to O(1) space with rolling variables.",
    mistakes: [
      "A vague state you can't state in one sentence — the transition will be buggy.",
      "Wrong iteration order or missing base cases.",
    ],
    variations: [
      "Climbing stairs, house robber (linear & circular).",
      "Coin change, word break, decode ways.",
      "Longest increasing subsequence, max product subarray.",
    ],
    prerequisites: ["dp"],
    relatedPatterns: ["grid-dp", "greedy-choice"],
    practiceIds: ["lc-climbing-stairs", "lc-house-robber", "lc-coin-change", "lc-longest-increasing-subsequence", "lc-word-break", "lc-partition-equal-subset"],
    companyTags: ["Amazon", "Google", "Meta"],
    recognition: [
      {
        id: "r1",
        prompt: "For House Robber, dp[i] represents:",
        choices: [
          { id: "a", text: "The value of house i" },
          { id: "b", text: "The max money robbable from houses 0..i" },
          { id: "c", text: "The number of houses" },
          { id: "d", text: "Whether house i is robbed" },
        ],
        correctId: "b",
        explanation: "State = best achievable up to i, with transition max(dp[i-1], dp[i-2] + nums[i]).",
      },
    ],
  },
  {
    slug: "grid-dp",
    order: 17,
    title: "Grid & Subsequence DP",
    summary: "Two-dimensional tables for grids and string pairs.",
    difficulty: "hard",
    estMinutes: 36,
    published: true,
    recognitionSignals: [
      "Paths through a grid, or comparisons between two strings.",
      "The answer at (i, j) depends on neighboring cells (up/left/diagonal).",
      "LCS, edit distance, knapsack-by-amount shapes.",
    ],
    intuition:
      "Define dp[i][j] over prefixes of two dimensions. Each cell combines its up, left, and/or diagonal neighbors. Fill row by row so dependencies are ready.",
    visualModel:
      "A spreadsheet where every cell's formula reads the cells above and to its left.",
    template: {
      language: "cpp",
      code: `vector<vector<int>> dp(m + 1, vector<int>(k + 1, 0));
for (int i = 1; i <= m; i++)
  for (int j = 1; j <= k; j++)
    dp[i][j] = (s1[i-1] == s2[j-1])
      ? dp[i-1][j-1] + 1                        // match
      : max(dp[i-1][j], dp[i][j-1]);            // skip one side
return dp[m][k];`,
    },
    complexity: "O(m·k) time and space (often reducible to O(min(m,k)) space).",
    mistakes: [
      "Off-by-one between 1-indexed dp and 0-indexed strings.",
      "Forgetting to initialize the first row/column base cases.",
    ],
    variations: [
      "Unique paths / minimum path sum (grids).",
      "Longest common subsequence, edit distance (strings).",
      "Coin change II, target sum (knapsack shapes).",
    ],
    prerequisites: ["dp"],
    relatedPatterns: ["one-d-dp"],
    practiceIds: ["lc-unique-paths", "lc-min-path-sum", "lc-longest-common-subsequence", "lc-coin-change-ii", "lc-edit-distance"],
    companyTags: ["Amazon", "Google", "Microsoft"],
    recognition: [
      {
        id: "r1",
        prompt: "Longest Common Subsequence of two strings is naturally a:",
        choices: [
          { id: "a", text: "1-D DP" },
          { id: "b", text: "2-D DP over prefixes of both strings" },
          { id: "c", text: "Greedy scan" },
          { id: "d", text: "Binary search" },
        ],
        correctId: "b",
        explanation: "dp[i][j] over the first i and j characters captures the overlapping subproblems.",
      },
    ],
  },
  {
    slug: "bitmasking",
    order: 18,
    title: "Bitmasking & Subset Enumeration",
    summary: "Use the bits of an integer to represent a set.",
    difficulty: "hard",
    estMinutes: 30,
    published: true,
    recognitionSignals: [
      "Small n (≤ ~20) and you must consider every subset.",
      "Toggling membership, parity, or XOR tricks.",
      "State that's a set of on/off flags.",
    ],
    intuition:
      "An integer's bits are a compact set. Iterate masks 0..2ⁿ−1 to enumerate subsets; use bit ops for membership, and XOR to cancel pairs.",
    visualModel:
      "A row of light switches encoded as one number — each bit is a switch that's on or off.",
    template: {
      language: "cpp",
      code: `// Enumerate every subset of n items.
for (int mask = 0; mask < (1 << n); mask++) {
  for (int i = 0; i < n; i++)
    if (mask & (1 << i)) { /* item i is in this subset */ }
}
// Handy: mask & -mask (lowest set bit),
//        __builtin_popcount(mask) (count of set bits)`,
    },
    complexity: "O(2ⁿ · n) to enumerate subsets; O(n) for XOR/parity tricks.",
    mistakes: [
      "Shifting by a large k without 1LL (overflow of a 32-bit literal).",
      "Confusing set/clear/toggle bit operations.",
    ],
    variations: [
      "Single number family (XOR to cancel pairs).",
      "Counting bits, reverse bits.",
      "Bitmask DP over subsets (small n).",
    ],
    prerequisites: ["cp-toolkit"],
    relatedPatterns: ["backtracking"],
    practiceIds: ["lc-single-number", "lc-number-of-1-bits", "lc-counting-bits", "lc-reverse-bits", "lc-single-number-ii", "lc-sum-of-two-integers"],
    companyTags: ["Amazon", "Apple", "Google"],
    recognition: [
      {
        id: "r1",
        prompt: "Every element appears twice except one. The O(1)-space trick is:",
        choices: [
          { id: "a", text: "Sort and scan" },
          { id: "b", text: "XOR all values together" },
          { id: "c", text: "A hash map" },
          { id: "d", text: "Binary search" },
        ],
        correctId: "b",
        explanation: "XOR cancels equal pairs, leaving only the unique value.",
      },
    ],
  },
  {
    slug: "union-find",
    order: 19,
    title: "Union-Find Connectivity",
    summary: "Merge groups and query 'same set?' in near-constant time.",
    difficulty: "hard",
    estMinutes: 32,
    published: true,
    recognitionSignals: [
      "Dynamic connectivity: merge groups, then ask if two items connect.",
      "Counting connected components as edges are added.",
      "Grouping by a shared attribute (emails, rows/columns).",
    ],
    intuition:
      "Each element points to a representative. find() follows pointers (with path compression); union() links two roots (by rank/size). Both become nearly O(1) amortized.",
    visualModel:
      "Merging clubs: everyone eventually points to one club president, so 'same club?' is one lookup.",
    template: {
      language: "cpp",
      code: `int find(int x) {
  return p[x] == x ? x : p[x] = find(p[x]);  // path compression
}
void unite(int a, int b) {
  a = find(a); b = find(b);
  if (a == b) return;
  if (rank[a] < rank[b]) swap(a, b);         // union by rank
  p[b] = a;
  if (rank[a] == rank[b]) rank[a]++;
}`,
    },
    complexity: "O(α(n)) per operation — effectively constant.",
    mistakes: [
      "Skipping path compression or union by rank (degrades toward O(n)).",
      "Comparing raw parents instead of roots via find().",
    ],
    variations: [
      "Count components / provinces.",
      "Redundant connection (first edge that closes a cycle).",
      "Accounts merge, most stones removed.",
    ],
    prerequisites: ["advanced", "graphs"],
    relatedPatterns: ["graph-traversal"],
    practiceIds: ["lc-number-of-provinces", "lc-redundant-connection", "lc-accounts-merge", "lc-most-stones-removed"],
    companyTags: ["Amazon", "Google"],
    recognition: [
      {
        id: "r1",
        prompt: "You add edges one by one and must find the first that creates a cycle. Best structure?",
        choices: [
          { id: "a", text: "Union-Find" },
          { id: "b", text: "A heap" },
          { id: "c", text: "Binary search" },
          { id: "d", text: "A trie" },
        ],
        correctId: "a",
        explanation: "If both endpoints already share a root, that edge closes a cycle.",
      },
    ],
  },
  {
    slug: "mixed-recognition",
    order: 20,
    title: "Mixed-Pattern Recognition & Contest Strategy",
    summary: "The meta-skill: pick the right tool under pressure.",
    difficulty: "hard",
    estMinutes: 30,
    published: true,
    recognitionSignals: [
      "A problem that doesn't announce its pattern.",
      "Multiple techniques could plausibly apply.",
      "Contest conditions where choosing fast matters.",
    ],
    intuition:
      "Run a mental checklist against the input shape and the question. The constraints (n size, sorted?, contiguous?, counting?) usually point to exactly one family.",
    visualModel:
      "A decision flowchart: each question about the input prunes the toolbox until one technique remains.",
    template: {
      language: "cpp",
      code: `// No single template — this is the routing logic:
// 1. Sorted input / pair with a target?   -> two pointers / binary search
// 2. Contiguous subarray or substring?     -> sliding window / prefix sums
// 3. "How many ways" or "min/max cost"?    -> dynamic programming
// 4. Generate all configurations?          -> backtracking
// 5. Connectivity / grouping / grids?      -> BFS / DFS / union-find
// 6. Next greater / smaller?               -> monotonic stack
// 7. k best / running extreme?             -> heap`,
    },
    complexity: "Varies — the goal is to reach the right O() fast, not to memorize one.",
    mistakes: [
      "Forcing a familiar pattern instead of reading the constraints.",
      "Ignoring n's size, which usually reveals the intended complexity.",
    ],
    variations: [
      "Matrix manipulation (rotate, spiral, set zeroes).",
      "Number theory & simulation (pow, plus one, roman numerals).",
      "Multi-technique combinations under contest time.",
    ],
    prerequisites: ["dp", "graphs"],
    relatedPatterns: ["two-pointers", "sliding-window", "one-d-dp", "graph-traversal"],
    practiceIds: ["lc-plus-one", "lc-roman-to-integer", "lc-rotate-image", "lc-spiral-matrix", "lc-set-matrix-zeroes", "lc-powx-n"],
    companyTags: ["Google", "Amazon", "Microsoft"],
    recognition: [
      {
        id: "r1",
        prompt: "The single strongest hint for which pattern a problem needs is usually:",
        choices: [
          { id: "a", text: "The problem's title" },
          { id: "b", text: "The input shape and constraints (n, sorted, contiguous, counting)" },
          { id: "c", text: "The company that asked it" },
          { id: "d", text: "The difficulty label" },
        ],
        correctId: "b",
        explanation: "Constraints reveal the intended complexity and the structure the solution must exploit.",
      },
    ],
  },
];
