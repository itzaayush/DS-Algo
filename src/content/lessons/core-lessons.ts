import type { Lesson } from "@/lib/schema";

export const complexityIntuition: Lesson = {
  slug: "complexity-intuition",
  moduleId: "foundations",
  order: 1,
  title: "Big-O without the fear",
  subtitle: "Count the work, ignore the constants — compare algorithms at a glance.",
  estMinutes: 20,
  difficulty: "intro",
  lastReviewed: "2026-07-24",
  published: true,
  hook: "Two programs solve the same problem. One finishes instantly on a million items; the other never returns. Big-O is the language that tells them apart before you ever hit run.",
  objectives: [
    "Estimate an algorithm's running time by counting its dominant operations.",
    "Drop constants and lower-order terms to name the growth class.",
    "Recognize O(1), O(log n), O(n), O(n log n), and O(n²) on sight.",
  ],
  analogy: {
    emoji: "🍜",
    title: "Cooking for a crowd",
    body: "If a recipe takes one minute per guest, feeding twice as many takes twice as long — that's linear. If every guest must greet every other guest, doubling the crowd quadruples the handshakes — that's quadratic. Big-O captures how the work scales, not the exact minutes.",
  },
  concept: [
    { type: "p", text: "Big-O describes how the number of steps grows as the input size n grows. We care about the trend for large n, so we keep only the fastest-growing term and throw away constant factors: 3n + 5 becomes O(n), and 2n² + 100n becomes O(n²)." },
    { type: "heading", text: "The classes you'll meet constantly" },
    {
      type: "list",
      ordered: false,
      items: [
        "O(1) constant — array indexing, hash lookup. Size doesn't matter.",
        "O(log n) logarithmic — binary search. Halving each step.",
        "O(n) linear — one pass over the data.",
        "O(n log n) — the best comparison sorts.",
        "O(n²) quadratic — nested loops over the same data. Fine for n=1000, deadly for n=1,000,000.",
      ],
    },
    { type: "callout", tone: "warning", title: "Measure the worst case", text: "Big-O usually describes the worst input. An algorithm that's fast on lucky inputs but O(n²) in the worst case can still time out on the adversarial test the judge picks." },
    { type: "p", text: "Watch the visualizer below: linear search touches one cell per step, so its comparison counter climbs in step with n. That counter IS the O(n) you're learning to see." },
  ],
  visualizer: { algorithmId: "linear-search", initialInput: [8, 3, 5, 9, 2, 7, 4, 6, 1] },
  pseudocode: `// O(n): one pass
for i in 0..n-1: touch(a[i])

// O(n^2): every pair
for i in 0..n-1:
    for j in 0..n-1:
        touch(a[i], a[j])`,
  implementation: {
    language: "cpp",
    code: `// O(n) — a single sweep.
long long sumAll(vector<int>& a) {
  long long total = 0;
  for (int x : a) total += x;      // n additions
  return total;
}

// O(n^2) — every pair. Doubling n quadruples the work.
int countPairs(vector<int>& a, int target) {
  int c = 0;
  for (int i = 0; i < (int)a.size(); i++)
    for (int j = i + 1; j < (int)a.size(); j++)
      if (a[i] + a[j] == target) c++;
  return c;
}`,
  },
  complexity: {
    summary: "Keep the dominant term. Constants and slower terms vanish for large n.",
    rows: [
      { label: "Index / hash lookup", time: "O(1)", space: "O(1)", note: "Independent of n." },
      { label: "Binary search", time: "O(log n)", space: "O(1)", note: "Halving." },
      { label: "Single loop", time: "O(n)", space: "O(1)", note: "One pass." },
      { label: "Efficient sort", time: "O(n log n)", space: "O(n)", note: "Merge / heap sort." },
      { label: "Nested loop", time: "O(n²)", space: "O(1)", note: "Every pair." },
    ],
  },
  mistakes: [
    { title: "Keeping constants", body: "O(2n) and O(n) are the same class. Simplify — the constant doesn't change how it scales." },
    { title: "Confusing time and space", body: "An O(n) time algorithm can still use O(n) or O(1) extra memory. State both when they matter." },
    { title: "Ignoring hidden costs", body: "Sorting inside a loop, or string concatenation in a loop, can secretly add a factor of n or log n." },
  ],
  recap: [
    "Big-O measures how work grows with n; drop constants and lower terms.",
    "Nested loops over the same data are the classic O(n²) trap.",
    "Always reason about the worst case the judge could throw at you.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Simplify the running time 4n² + 20n + 7.",
      choices: [
        { id: "a", text: "O(n)" },
        { id: "b", text: "O(n²)" },
        { id: "c", text: "O(4n²)" },
        { id: "d", text: "O(n log n)" },
      ],
      correctId: "b",
      explanation: "Keep the fastest-growing term and drop constants: 4n² + 20n + 7 → O(n²).",
      concept: "Simplifying Big-O",
    },
    {
      id: "q2",
      prompt: "A nested loop where both loops run n times is:",
      choices: [
        { id: "a", text: "O(n)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n²)" },
        { id: "d", text: "O(1)" },
      ],
      correctId: "c",
      explanation: "n iterations × n iterations = n² total steps.",
      concept: "Nested loops",
    },
    {
      id: "q3",
      prompt: "Which grows slowest as n gets large?",
      choices: [
        { id: "a", text: "O(n)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n log n)" },
        { id: "d", text: "O(n²)" },
      ],
      correctId: "b",
      explanation: "Logarithmic growth is far slower than linear or quadratic — log₂(1e9) ≈ 30.",
      concept: "Comparing classes",
    },
  ],
  practiceIds: ["lc-two-sum", "lc-binary-search", "lc-contains-duplicate"],
  companyTags: ["Google", "Meta", "Amazon"],
};

export const recursionIntro: Lesson = {
  slug: "recursion-intro",
  moduleId: "recursion",
  order: 1,
  title: "Recursion & backtracking foundations",
  subtitle: "Solve a big problem by trusting a smaller copy of yourself.",
  estMinutes: 26,
  difficulty: "medium",
  lastReviewed: "2026-07-24",
  published: true,
  hook: "Recursion feels like magic until it clicks — then it becomes the cleanest way to explore trees, permutations, and every 'try all options' problem in competitive programming.",
  objectives: [
    "Write a recursive function with a correct base case and recursive step.",
    "Trace the call stack to see why order of returns matters.",
    "Apply the choose → explore → un-choose backtracking template.",
  ],
  analogy: {
    emoji: "🪆",
    title: "Russian nesting dolls",
    body: "To open the biggest doll you open a slightly smaller one, and so on, until the tiniest doll that can't be opened — the base case. Each doll trusts that opening the one inside 'just works'. That trust is the leap recursion asks you to take.",
  },
  concept: [
    { type: "p", text: "A recursive function calls itself on a smaller input. It needs two things: a base case that stops the recursion, and a recursive case that makes progress toward the base case. Miss either and you get infinite recursion (a stack overflow)." },
    { type: "code", language: "cpp", code: "// Factorial: n! = n * (n-1)!\nlong long fact(int n) {\n  if (n <= 1) return 1;      // base case\n  return n * fact(n - 1);    // recursive step\n}" },
    { type: "heading", text: "Backtracking: try, recurse, undo" },
    { type: "p", text: "Backtracking explores a decision tree. At each step you make a choice, recurse to explore its consequences, then undo the choice so you can try the next one. This generates subsets, permutations, and solves puzzles like N-Queens and Sudoku." },
    { type: "callout", tone: "info", title: "Prune early", text: "The power of backtracking is stopping a branch the moment it can't lead to a valid answer. Good pruning turns an impossible 2ⁿ search into something that finishes." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "call fact(n)", x: 165, y: 0 },
      { id: "d1", kind: "decision", label: "n ≤ 1 ?", x: 160, y: 110 },
      { id: "base", kind: "end", label: "return 1", x: 410, y: 124 },
      { id: "rec", kind: "process", label: "return n · fact(n−1)", x: 120, y: 240 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "base", label: "yes", sourceHandle: "yes" },
      { id: "e3", from: "d1", to: "rec", label: "no" },
    ],
  },
  conceptVisualizer: { conceptId: "recursion", codeLineToNode: { "1": "start", "2": "base", "3": "rec" } },
  pseudocode: `backtrack(state):
    if state is a complete solution: record it; return
    for each choice from state:
        if choice is valid:
            apply(choice)          // choose
            backtrack(next state)  // explore
            undo(choice)           // un-choose`,
  implementation: {
    language: "cpp",
    code: `// Generate every subset of a — the backtracking skeleton.
void dfs(vector<int>& a, int i, vector<int>& cur,
         vector<vector<int>>& out) {
  if (i == (int)a.size()) { out.push_back(cur); return; }
  // choice 1: skip a[i]
  dfs(a, i + 1, cur, out);
  // choice 2: take a[i]
  cur.push_back(a[i]);
  dfs(a, i + 1, cur, out);
  cur.pop_back();               // undo
}`,
  },
  complexity: {
    summary: "Recursion cost = (work per call) × (number of calls). Backtracking often explores exponentially many states.",
    rows: [
      { label: "Factorial / linear recursion", time: "O(n)", space: "O(n)", note: "Call stack depth n." },
      { label: "Subsets", time: "O(2ⁿ)", space: "O(n)", note: "Two choices per element." },
      { label: "Permutations", time: "O(n·n!)", space: "O(n)", note: "All orderings." },
    ],
  },
  mistakes: [
    { title: "Missing or wrong base case", body: "Without a reachable base case the recursion never stops and the stack overflows." },
    { title: "Forgetting to undo", body: "In backtracking, not un-choosing corrupts the state for sibling branches." },
    { title: "Deep recursion limits", body: "Very deep recursion can overflow the stack; convert to iteration or increase limits when needed." },
  ],
  recap: [
    "Every recursion needs a base case and progress toward it.",
    "The call stack unwinds in reverse — returns happen deepest-first.",
    "Backtracking = choose, explore, un-choose, with early pruning.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What happens if a recursive function has no reachable base case?",
      choices: [
        { id: "a", text: "It returns 0." },
        { id: "b", text: "It recurses forever and overflows the stack." },
        { id: "c", text: "The compiler rejects it." },
        { id: "d", text: "It runs in O(1)." },
      ],
      correctId: "b",
      explanation: "Without a base case the calls never stop, exhausting the call stack.",
      concept: "Base case",
    },
    {
      id: "q2",
      prompt: "In backtracking, why do we 'undo' a choice after recursing?",
      choices: [
        { id: "a", text: "To free memory immediately." },
        { id: "b", text: "So sibling branches start from a clean state." },
        { id: "c", text: "It's optional and just style." },
        { id: "d", text: "To make it iterative." },
      ],
      correctId: "b",
      explanation: "Undoing restores the shared state so the next choice explores correctly.",
      concept: "Backtracking",
    },
  ],
  practiceIds: ["lc-subsets", "lc-permutations", "lc-combination-sum"],
  companyTags: ["Google", "Meta"],
};

export const linkedListsIntro: Lesson = {
  slug: "linked-lists-intro",
  moduleId: "linked-lists",
  order: 1,
  title: "Linked lists & pointer safety",
  subtitle: "Nodes chained by pointers — reversal, cycles, and never losing your place.",
  estMinutes: 24,
  difficulty: "medium",
  lastReviewed: "2026-07-24",
  published: true,
  hook: "Arrays store neighbors side by side; linked lists connect them with arrows. Master the arrows and pointer problems — a favorite interview topic — stop being scary.",
  objectives: [
    "Describe how a singly linked list stores and links nodes.",
    "Reverse a linked list by re-pointing each node.",
    "Detect a cycle with fast and slow pointers.",
  ],
  analogy: {
    emoji: "🚂",
    title: "A train of cars",
    body: "Each car (node) holds cargo (the value) and a coupling to the next car (the next pointer). To insert a car mid-train you just re-hook two couplings — no need to shuffle every car like you would in an array.",
  },
  concept: [
    { type: "p", text: "A node holds a value and a pointer to the next node. The list is just a pointer to the first node (the head). Because there's no contiguous block, inserting or deleting is O(1) once you're at the spot — but reaching index k costs O(k) because you must walk the pointers." },
    { type: "code", language: "cpp", code: "struct Node {\n  int val;\n  Node* next;\n  Node(int v) : val(v), next(nullptr) {}\n};" },
    { type: "heading", text: "The golden rule: don't lose the rest of the list" },
    { type: "p", text: "When you re-point a node's next, you can orphan everything after it. The fix is a temporary pointer that remembers the next node before you overwrite the link. Reversal is the canonical example." },
    { type: "callout", tone: "warning", title: "Guard against null", text: "Always check node && node->next before dereferencing node->next->next. Most linked-list bugs are null-pointer dereferences at the ends." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "prev = null", x: 165, y: 0 },
      { id: "d1", kind: "decision", label: "head != null ?", x: 150, y: 110 },
      { id: "proc", kind: "process", label: "flip arrow; advance", x: 120, y: 240 },
      { id: "end", kind: "end", label: "return prev", x: 430, y: 124 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "proc", label: "yes" },
      { id: "e3", from: "proc", to: "d1", label: "loop", sourceHandle: "loop" },
      { id: "e4", from: "d1", to: "end", label: "no", sourceHandle: "yes" },
    ],
  },
  conceptVisualizer: { conceptId: "linked-list", codeLineToNode: { "2": "start", "5": "proc", "9": "end" } },
  pseudocode: `reverse(head):
    prev = null
    while head != null:
        nxt = head.next   // remember the rest
        head.next = prev  // flip the arrow
        prev = head       // advance prev
        head = nxt        // advance head
    return prev`,
  implementation: {
    language: "cpp",
    code: `Node* reverse(Node* head) {
  Node* prev = nullptr;
  while (head) {
    Node* nxt = head->next;  // remember the rest
    head->next = prev;       // flip the arrow
    prev = head;             // advance prev
    head = nxt;              // advance head
  }
  return prev;               // new head
}

// Floyd's cycle detection: fast laps slow inside a loop.
bool hasCycle(Node* head) {
  Node *slow = head, *fast = head;
  while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true;
  }
  return false;
}`,
  },
  complexity: {
    summary: "Sequential access is the tradeoff for O(1) splicing.",
    rows: [
      { label: "Access k-th node", time: "O(k)", space: "O(1)", note: "Walk the pointers." },
      { label: "Insert / delete at a known node", time: "O(1)", space: "O(1)", note: "Re-hook couplings." },
      { label: "Reverse", time: "O(n)", space: "O(1)", note: "One pass, three pointers." },
      { label: "Cycle detection", time: "O(n)", space: "O(1)", note: "Fast & slow pointers." },
    ],
  },
  mistakes: [
    { title: "Losing the tail", body: "Overwriting next before saving it orphans the rest of the list. Stash it in a temp first." },
    { title: "Null dereference at the end", body: "Check fast && fast->next before advancing two steps." },
    { title: "Forgetting to return the new head", body: "After reversal the head is the old tail (prev), not the original head." },
  ],
  recap: [
    "A linked list is a chain of value+next nodes reached from the head.",
    "Reversal flips each arrow using a saved 'next' pointer.",
    "Fast/slow pointers detect cycles in O(1) space.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Reaching the k-th node of a singly linked list costs:",
      choices: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log k)" },
        { id: "c", text: "O(k)" },
        { id: "d", text: "O(n²)" },
      ],
      correctId: "c",
      explanation: "There's no random access — you walk k pointers from the head.",
      concept: "Sequential access",
    },
    {
      id: "q2",
      prompt: "Floyd's algorithm detects a cycle when:",
      choices: [
        { id: "a", text: "The list runs out of memory." },
        { id: "b", text: "The fast and slow pointers meet." },
        { id: "c", text: "A value repeats." },
        { id: "d", text: "The head is null." },
      ],
      correctId: "b",
      explanation: "Inside a loop the faster pointer eventually laps and meets the slower one.",
      concept: "Cycle detection",
    },
  ],
  practiceIds: ["lc-reverse-linked-list", "lc-linked-list-cycle", "lc-merge-two-lists"],
  companyTags: ["Amazon", "Microsoft", "Meta"],
};

export const stacksQueuesIntro: Lesson = {
  slug: "stacks-queues-intro",
  moduleId: "stacks-queues",
  order: 1,
  title: "Stacks, queues & deques",
  subtitle: "LIFO, FIFO, and the monotonic trick that powers 'next greater element'.",
  estMinutes: 24,
  difficulty: "medium",
  lastReviewed: "2026-07-24",
  published: true,
  hook: "Two containers, two disciplines: a stack remembers the most recent thing, a queue remembers the oldest. Choosing the right one turns messy problems into three-line solutions.",
  objectives: [
    "Contrast LIFO (stack) and FIFO (queue) access.",
    "Use a stack to match brackets and evaluate expressions.",
    "Recognize when a monotonic stack solves a 'next greater' problem.",
  ],
  analogy: {
    emoji: "🍽️",
    title: "Plates vs. a ticket line",
    body: "A stack of plates: you take the top one you just placed (last in, first out). A ticket queue: the person who arrived first is served first (first in, first out). Same items, opposite fairness rules.",
  },
  concept: [
    { type: "p", text: "A stack supports push and pop at one end — last in, first out. A queue supports enqueue at the back and dequeue at the front — first in, first out. A deque allows both ends. In C++ these are std::stack, std::queue, and std::deque." },
    { type: "heading", text: "Stacks match nesting" },
    { type: "p", text: "Whenever structure nests — brackets, HTML tags, function calls — a stack is the natural fit: push an opener, and on a closer check that the top matches." },
    { type: "heading", text: "Monotonic stack" },
    { type: "p", text: "A monotonic stack keeps its elements sorted. By popping smaller elements as you scan, you answer 'what's the next greater element?' for every position in a single O(n) pass — a pattern that shows up constantly in contests." },
    { type: "callout", tone: "info", title: "Queues drive BFS", text: "Breadth-first search visits nodes in the order they're discovered — exactly FIFO. Every graph BFS you'll write is a queue in disguise." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "next char c", x: 175, y: 0 },
      { id: "d1", kind: "decision", label: "c is opener ?", x: 165, y: 100 },
      { id: "push", kind: "process", label: "push c", x: 430, y: 100 },
      { id: "d2", kind: "decision", label: "top matches c ?", x: 150, y: 230 },
      { id: "pop", kind: "process", label: "pop top", x: 430, y: 230 },
      { id: "invalid", kind: "end", label: "return false", x: 150, y: 360 },
      { id: "end", kind: "end", label: "stack empty → valid", x: 430, y: 360 },
    ],
    edges: [
      { id: "e1", from: "start", to: "d1" },
      { id: "e2", from: "d1", to: "push", label: "yes", sourceHandle: "yes" },
      { id: "e3", from: "d1", to: "d2", label: "no" },
      { id: "e4", from: "d2", to: "pop", label: "yes", sourceHandle: "yes" },
      { id: "e5", from: "d2", to: "invalid", label: "no" },
      { id: "e6", from: "push", to: "start", label: "loop", sourceHandle: "loop" },
      { id: "e7", from: "pop", to: "start", label: "loop", sourceHandle: "loop" },
    ],
  },
  conceptVisualizer: { conceptId: "stack", codeLineToNode: { "4": "push", "6": "invalid", "7": "pop", "9": "end" } },
  pseudocode: `validParentheses(s):
    stack = []
    for ch in s:
        if ch is an opener: push(ch)
        else:
            if stack empty or top doesn't match ch: return false
            pop()
    return stack is empty`,
  implementation: {
    language: "cpp",
    code: `bool validParentheses(string s) {
  stack<char> st;
  unordered_map<char,char> match = {{')','('},{']','['},{'}','{'}};
  for (char c : s) {
    if (c=='('||c=='['||c=='{') st.push(c);
    else {
      if (st.empty() || st.top() != match[c]) return false;
      st.pop();
    }
  }
  return st.empty();
}

// Monotonic stack: next greater element for each index.
vector<int> nextGreater(vector<int>& a) {
  int n = a.size();
  vector<int> res(n, -1);
  stack<int> st;                 // holds indices, values decreasing
  for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.top()] < a[i]) {
      res[st.top()] = a[i]; st.pop();
    }
    st.push(i);
  }
  return res;
}`,
  },
  complexity: {
    summary: "Stack and queue operations are O(1); a monotonic stack scan is O(n) amortized.",
    rows: [
      { label: "push / pop / peek", time: "O(1)", space: "O(1)", note: "Amortized." },
      { label: "enqueue / dequeue", time: "O(1)", space: "O(1)", note: "Deque-backed." },
      { label: "Bracket matching", time: "O(n)", space: "O(n)", note: "Stack of openers." },
      { label: "Monotonic stack scan", time: "O(n)", space: "O(n)", note: "Each index pushed/popped once." },
    ],
  },
  mistakes: [
    { title: "Popping an empty stack", body: "Always check empty() before top()/pop() or you'll hit undefined behavior." },
    { title: "Wrong container for the job", body: "Using a stack where order should be FIFO (or vice versa) silently produces wrong answers." },
    { title: "Storing values instead of indices", body: "Monotonic-stack problems usually need indices so you can fill results by position." },
  ],
  recap: [
    "Stack = LIFO, queue = FIFO, deque = both ends.",
    "Stacks match nested structure like brackets and calls.",
    "A monotonic stack answers next-greater queries in O(n).",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which structure serves items in the order they arrived?",
      choices: [
        { id: "a", text: "Stack (LIFO)" },
        { id: "b", text: "Queue (FIFO)" },
        { id: "c", text: "A hash map" },
        { id: "d", text: "A binary heap" },
      ],
      correctId: "b",
      explanation: "A queue is first-in, first-out — oldest served first.",
      concept: "FIFO vs LIFO",
    },
    {
      id: "q2",
      prompt: "A monotonic stack lets you compute the next greater element in:",
      choices: [
        { id: "a", text: "O(n²)" },
        { id: "b", text: "O(n log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(1)" },
      ],
      correctId: "c",
      explanation: "Each index is pushed and popped at most once, so the whole scan is linear.",
      concept: "Monotonic stack",
    },
  ],
  practiceIds: ["lc-valid-parentheses", "lc-min-stack", "lc-daily-temperatures"],
  companyTags: ["Amazon", "Google", "Microsoft"],
};

export const hashingIntro: Lesson = {
  slug: "hashing-intro",
  moduleId: "hashing",
  order: 1,
  title: "Hashing: the O(1) lookup",
  subtitle: "Sets and maps that answer 'have I seen this?' instantly.",
  estMinutes: 22,
  difficulty: "medium",
  lastReviewed: "2026-07-24",
  published: true,
  hook: "The single most useful trick in interviews: trade a little memory for a hash map and watch O(n²) brute forces collapse into O(n).",
  objectives: [
    "Explain how a hash map achieves average O(1) insert and lookup.",
    "Use a frequency map and a seen-set to avoid nested loops.",
    "Apply the complement trick to solve Two Sum in one pass.",
  ],
  analogy: {
    emoji: "🗄️",
    title: "A coat check",
    body: "You hand over a coat and get a numbered tag. Later you present the tag and the attendant walks straight to that slot — no searching the whole rack. The hash function is what turns your coat into a slot number.",
  },
  concept: [
    { type: "p", text: "A hash map turns a key into an array index via a hash function, so lookups and inserts are O(1) on average. Collisions (two keys landing in the same slot) are handled internally. In C++ you'll reach for unordered_map and unordered_set." },
    { type: "heading", text: "Count once, answer instantly" },
    { type: "code", language: "cpp", code: "// Two Sum in one pass with the complement trick.\nvector<int> twoSum(vector<int>& a, int target) {\n  unordered_map<int,int> seen;   // value -> index\n  for (int i = 0; i < (int)a.size(); i++) {\n    int need = target - a[i];\n    if (seen.count(need)) return {seen[need], i};\n    seen[a[i]] = i;\n  }\n  return {};\n}" },
    { type: "callout", tone: "warning", title: "Average, not worst", text: "Hash operations are O(1) on average but can degrade with pathological inputs. For contest safety with adversarial hacks, a sorted map (O(log n)) is sometimes the safer choice." },
  ],
  flowchart: {
    nodes: [
      { id: "start", kind: "start", label: "insert(key)", x: 165, y: 0 },
      { id: "hash", kind: "process", label: "b = key % SIZE", x: 155, y: 110 },
      { id: "d1", kind: "decision", label: "bucket b empty ?", x: 150, y: 220 },
      { id: "put", kind: "process", label: "place in bucket b", x: 430, y: 234 },
      { id: "chain", kind: "process", label: "chain after existing", x: 120, y: 350 },
    ],
    edges: [
      { id: "e1", from: "start", to: "hash" },
      { id: "e2", from: "hash", to: "d1" },
      { id: "e3", from: "d1", to: "put", label: "yes", sourceHandle: "yes" },
      { id: "e4", from: "d1", to: "chain", label: "no (collision)" },
    ],
  },
  conceptVisualizer: { conceptId: "hashing", codeLineToNode: { "1": "start", "3": "d1" } },
  pseudocode: `hasDuplicate(a):
    seen = empty set
    for x in a:
        if x in seen: return true
        add x to seen
    return false`,
  implementation: {
    language: "cpp",
    code: `// Group anagrams by their sorted-letter signature.
vector<vector<string>> groupAnagrams(vector<string>& words) {
  unordered_map<string, vector<string>> groups;
  for (string w : words) {
    string key = w;
    sort(key.begin(), key.end());   // signature
    groups[key].push_back(w);
  }
  vector<vector<string>> out;
  for (auto& [k, v] : groups) out.push_back(v);
  return out;
}`,
  },
  complexity: {
    summary: "Average O(1) per operation; the space you spend buys the speed.",
    rows: [
      { label: "Insert / lookup / erase", time: "O(1) avg", space: "O(n)", note: "Worst case O(n)." },
      { label: "Frequency count", time: "O(n)", space: "O(n)", note: "One pass." },
      { label: "Two Sum (hashing)", time: "O(n)", space: "O(n)", note: "vs O(n²) brute force." },
    ],
  },
  mistakes: [
    { title: "Hashing a mutable key", body: "Changing a key after inserting it corrupts the map. Keys must be stable." },
    { title: "Assuming ordered iteration", body: "unordered_map has no meaningful order. Use map if you need sorted keys." },
    { title: "Ignoring worst-case hacks", body: "In contests, adversaries can force collisions; randomize your hash or use a tree map when it matters." },
  ],
  recap: [
    "Hash maps give average O(1) insert and lookup.",
    "A seen-set or frequency map removes a nested loop.",
    "The complement trick solves Two Sum in a single pass.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What's the average time to look up a key in a hash map?",
      choices: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n log n)" },
      ],
      correctId: "a",
      explanation: "Hashing computes the slot directly, giving average constant-time access.",
      concept: "Hash lookup",
    },
    {
      id: "q2",
      prompt: "The complement trick in Two Sum stores, for each value x, and checks for:",
      choices: [
        { id: "a", text: "x squared" },
        { id: "b", text: "target − x" },
        { id: "c", text: "x + 1" },
        { id: "d", text: "the index only" },
      ],
      correctId: "b",
      explanation: "If target − x was seen earlier, that value plus x hits the target.",
      concept: "Complement trick",
    },
  ],
  practiceIds: ["lc-two-sum", "lc-contains-duplicate", "lc-valid-anagram", "lc-group-anagrams"],
  companyTags: ["Meta", "Amazon", "Google"],
};
