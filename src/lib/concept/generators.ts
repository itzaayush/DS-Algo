import type { CellState, ConceptStep, Scene, SceneEdge } from "./types";

const st = (
  scene: Scene,
  narration: string,
  codeLine: number,
  counters?: Record<string, number>,
  done?: boolean
): ConceptStep => ({ scene, narration, codeLine, counters, done });

/* ============================ Recursion (call stack) ====================== */

export const recursionCode = `long long fact(int n) {
  if (n <= 1) return 1;      // base case
  return n * fact(n - 1);    // recursive step
}`;

export function buildRecursion(): ConceptStep[] {
  const steps: ConceptStep[] = [];
  const frames: { n: number; label: string }[] = [];
  const scene = (): Scene => ({
    kind: "stack",
    title: "call stack (grows down)",
    boxes: frames.map((f, i) => ({
      id: `f${f.n}`,
      label: f.label,
      state: (i === frames.length - 1 ? "current" : "default") as CellState,
    })),
  });

  for (let n = 4; n >= 1; n--) {
    frames.push({ n, label: `fact(${n})` });
    steps.push(
      n === 1
        ? st(scene(), "fact(1) hits the base case: n ≤ 1, so it will return 1.", 2)
        : st(scene(), `Call fact(${n}). It can't finish until fact(${n - 1}) returns, so we push a new frame and recurse deeper.`, 3)
    );
  }

  const returns = [
    { n: 1, text: "fact(1) = 1 (base case). Return 1 and pop its frame." },
    { n: 2, text: "fact(2) = 2 · 1 = 2. Return and pop." },
    { n: 3, text: "fact(3) = 3 · 2 = 6. Return and pop." },
    { n: 4, text: "fact(4) = 4 · 6 = 24. The stack is empty — final answer 24." },
  ];
  const vals: Record<number, number> = { 1: 1, 2: 2, 3: 6, 4: 24 };
  for (const r of returns) {
    frames.pop();
    steps.push(st(scene(), r.text, r.n === 1 ? 2 : 3, { result: vals[r.n] }, frames.length === 0));
  }
  return steps;
}

/* ========================== Linked list reversal ========================= */

export const linkedListCode = `Node* reverse(Node* head) {
  Node* prev = nullptr;
  while (head) {
    Node* nxt = head->next;
    head->next = prev;   // flip the arrow
    prev = head;
    head = nxt;
  }
  return prev;
}`;

export function buildLinkedList(): ConceptStep[] {
  const vals = [1, 2, 3, 4];
  const xs = [14, 36, 58, 80];
  const y = 26;

  const scene = (k: number): Scene => {
    // k = number of nodes already reversed; prev = k-1, curr = k
    const edges: SceneEdge[] = [];
    for (let i = 1; i < k; i++) edges.push({ id: `b${i}`, from: `n${i}`, to: `n${i - 1}`, directed: true, state: "tree" });
    for (let i = k; i < vals.length - 1; i++) edges.push({ id: `f${i}`, from: `n${i}`, to: `n${i + 1}`, directed: true });
    return {
      kind: "nodes",
      height: 46,
      nodes: vals.map((v, i) => ({
        id: `n${i}`,
        label: String(v),
        x: xs[i],
        y,
        state: (i === k ? "current" : i < k ? "done" : "default") as CellState,
      })),
      edges,
      labels: [
        ...(k - 1 >= 0 ? [{ text: "prev", nodeId: `n${k - 1}`, tone: "secondary" as const }] : []),
        ...(k < vals.length ? [{ text: "curr", nodeId: `n${k}`, tone: "primary" as const }] : []),
      ],
    };
  };

  const steps: ConceptStep[] = [];
  steps.push(st(scene(0), "Start with prev = null and curr = head (1). Arrows point forward.", 2));
  for (let k = 0; k < vals.length; k++) {
    const nextK = k + 1;
    steps.push(
      st(
        scene(nextK),
        nextK < vals.length
          ? `Save curr.next, then flip node ${vals[k]}'s arrow to point back at prev. Advance prev and curr.`
          : `Flip the last arrow. curr is now null — the list is fully reversed. New head is ${vals[vals.length - 1]}.`,
        nextK < vals.length ? 5 : 9,
        undefined,
        nextK >= vals.length
      )
    );
  }
  return steps;
}

/* ======================= Stack (valid parentheses) ======================= */

export const stackCode = `bool valid(string s) {
  stack<char> st;
  for (char c : s) {
    if (isOpen(c)) st.push(c);
    else if (st.empty() || !matches(st.top(), c))
      return false;
    else st.pop();
  }
  return st.empty();
}`;

export function buildStack(): ConceptStep[] {
  const s = "([])";
  const chars = s.split("");
  const stack: string[] = [];
  const steps: ConceptStep[] = [];

  const scene = (cur: number): Scene => ({
    kind: "stack",
    title: "stack (top on top)",
    boxes: stack.map((ch, i) => ({ id: `s${i}${ch}`, label: ch, state: (i === stack.length - 1 ? "current" : "default") as CellState })),
    aux: {
      label: "input",
      items: chars.map((ch, i) => ({ id: `c${i}`, label: ch, state: (i < cur ? "done" : i === cur ? "active" : "default") as CellState })),
    },
  });

  const isOpen = (c: string) => c === "(" || c === "[" || c === "{";
  const matches = (o: string, c: string) => (o === "(" && c === ")") || (o === "[" && c === "]") || (o === "{" && c === "}");

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (isOpen(c)) {
      stack.push(c);
      steps.push(st(scene(i), `'${c}' is an opener → push it onto the stack.`, 4));
    } else {
      const ok = stack.length && matches(stack[stack.length - 1], c);
      if (ok) {
        stack.pop();
        steps.push(st(scene(i), `'${c}' closes the top opener → pop the match.`, 7));
      } else {
        steps.push(st(scene(i), `'${c}' has no matching opener → invalid.`, 6, undefined, true));
        return steps;
      }
    }
  }
  steps.push(st(scene(chars.length), "End of string and the stack is empty → the brackets are valid. ✅", 9, undefined, true));
  return steps;
}

/* ============================= Hashing (buckets) ========================= */

export const hashingCode = `void insert(int key) {
  int b = key % SIZE;         // hash to a bucket
  table[b].push_back(key);    // chain on collision
}`;

export function buildHashing(): ConceptStep[] {
  const SIZE = 5;
  const keys = [12, 7, 5, 18, 22];
  const buckets: number[][] = Array.from({ length: SIZE }, () => []);
  const steps: ConceptStep[] = [];

  const scene = (activeBucket: number, justKey: number | null): Scene => {
    const cells = [];
    for (let b = 0; b < SIZE; b++) {
      for (let s2 = 0; s2 < buckets[b].length; s2++) {
        const key = buckets[b][s2];
        cells.push({
          r: b,
          c: s2,
          label: String(key),
          state: (key === justKey ? "current" : "done") as CellState,
        });
      }
    }
    return {
      kind: "grid",
      title: `hash(key) = key % ${SIZE}`,
      rows: SIZE,
      cols: 3,
      rowLabels: Array.from({ length: SIZE }, (_, i) => `b${i}`),
      cells,
    };
  };

  steps.push(st(scene(-1, null), `A hash table with ${SIZE} buckets. We'll insert ${keys.join(", ")}.`, 1));
  for (const key of keys) {
    const b = key % SIZE;
    const collision = buckets[b].length > 0;
    buckets[b].push(key);
    steps.push(
      st(
        scene(b, key),
        `${key} % ${SIZE} = ${b} → bucket ${b}${collision ? " (collision — chain it after the existing entry)" : ""}.`,
        3,
        undefined,
        key === keys[keys.length - 1]
      )
    );
  }
  return steps;
}

/* ============================ Bits (single number) ======================= */

export const bitsCode = `int singleNumber(vector<int>& a) {
  int x = 0;
  for (int v : a) x ^= v;   // pairs cancel out
  return x;
}`;

export function buildBits(): ConceptStep[] {
  const arr = [4, 1, 2, 1, 2];
  const WIDTH = 4;
  const toBits = (n: number) => Array.from({ length: WIDTH }, (_, i) => (n >> (WIDTH - 1 - i)) & 1);

  const steps: ConceptStep[] = [];
  let acc = 0;
  let prev = toBits(0);

  const scene = (bits: number[], cur: number): Scene => ({
    kind: "bits",
    caption: `x = ${acc} (binary ${bits.join("")})`,
    bits: bits.map((v, i) => ({ value: v, state: (v !== prev[i] ? "current" : v === 1 ? "active" : "default") as CellState })),
    aux: {
      label: "array",
      items: arr.map((v, i) => ({ id: `a${i}`, label: String(v), state: (i < cur ? "done" : i === cur ? "active" : "default") as CellState })),
    },
  });

  steps.push(st(scene(toBits(0), -1), "Start the accumulator x at 0. XOR cancels any value with itself.", 2));
  for (let i = 0; i < arr.length; i++) {
    prev = toBits(acc);
    acc ^= arr[i];
    steps.push(
      st(scene(toBits(acc), i), `x ^= ${arr[i]} → x = ${acc}. Equal values cancel to 0.`, 3, undefined, i === arr.length - 1)
    );
  }
  steps[steps.length - 1].narration = `Every duplicate cancelled — x = ${acc}, the unique number. ✅`;
  steps[steps.length - 1].codeLine = 4;
  return steps;
}

/* ============================ Tree (in-order BST) ======================== */

export const treeCode = `void inorder(TreeNode* node, vector<int>& out) {
  if (!node) return;
  inorder(node->left, out);
  out.push_back(node->val);   // visit
  inorder(node->right, out);
}`;

const TREE_NODES = [
  { id: "5", label: "5", x: 50, y: 10 },
  { id: "3", label: "3", x: 28, y: 30 },
  { id: "8", label: "8", x: 72, y: 30 },
  { id: "1", label: "1", x: 16, y: 50 },
  { id: "4", label: "4", x: 40, y: 50 },
  { id: "9", label: "9", x: 84, y: 50 },
];
const TREE_EDGES: SceneEdge[] = [
  { id: "e1", from: "5", to: "3" },
  { id: "e2", from: "5", to: "8" },
  { id: "e3", from: "3", to: "1" },
  { id: "e4", from: "3", to: "4" },
  { id: "e5", from: "8", to: "9" },
];

export function buildTree(): ConceptStep[] {
  const treeScene = (currentId: string, emitted: string[]): Scene => {
    const em = new Set(emitted);
    return {
      kind: "nodes",
      height: 62,
      nodes: TREE_NODES.map((n) => ({
        ...n,
        state: (n.id === currentId ? "active" : em.has(n.id) ? "done" : "default") as CellState,
      })),
      edges: TREE_EDGES,
      aux: { label: "output", items: emitted.map((v) => ({ id: v, label: v, state: "done" as CellState })) },
    };
  };

  const seq: { cur: string; emit: string[]; text: string; line: number }[] = [
    { cur: "5", emit: [], text: "In-order = left, node, right. From root 5, recurse left first.", line: 3 },
    { cur: "3", emit: [], text: "At 3, recurse left again toward the smallest value.", line: 3 },
    { cur: "1", emit: ["1"], text: "1 has no left child → visit it. Output: 1.", line: 4 },
    { cur: "3", emit: ["1", "3"], text: "Back at 3 → visit it. Output: 1, 3.", line: 4 },
    { cur: "4", emit: ["1", "3", "4"], text: "3's right child 4 → visit. Output: 1, 3, 4.", line: 4 },
    { cur: "5", emit: ["1", "3", "4", "5"], text: "Left subtree done → visit root 5. Output: 1, 3, 4, 5.", line: 4 },
    { cur: "8", emit: ["1", "3", "4", "5", "8"], text: "Into the right subtree; 8 has no left → visit 8.", line: 4 },
    { cur: "9", emit: ["1", "3", "4", "5", "8", "9"], text: "Finally 9. In-order of a BST comes out sorted! ✅", line: 4 },
  ];
  return seq.map((s, i) => st(treeScene(s.cur, s.emit), s.text, s.line, undefined, i === seq.length - 1));
}

/* ============================= Heap (sift-up) ============================ */

export const heapCode = `void push(vector<int>& h, int v) {
  h.push_back(v);
  int i = h.size() - 1;
  while (i > 0 && h[(i-1)/2] > h[i]) {
    swap(h[(i-1)/2], h[i]);
    i = (i - 1) / 2;
  }
}`;

const HEAP_POS = [
  { x: 50, y: 10 },
  { x: 30, y: 32 },
  { x: 70, y: 32 },
  { x: 18, y: 54 },
  { x: 42, y: 54 },
  { x: 82, y: 54 },
];
const HEAP_EDGES: SceneEdge[] = [
  { id: "h01", from: "i0", to: "i1" },
  { id: "h02", from: "i0", to: "i2" },
  { id: "h13", from: "i1", to: "i3" },
  { id: "h14", from: "i1", to: "i4" },
  { id: "h25", from: "i2", to: "i5" },
];

export function buildHeap(): ConceptStep[] {
  const heapScene = (vals: number[], cur: number, cmp: number[], activeEdge?: string): Scene => ({
    kind: "nodes",
    height: 66,
    nodes: vals.map((v, i) => ({
      id: `i${i}`,
      label: String(v),
      x: HEAP_POS[i].x,
      y: HEAP_POS[i].y,
      sub: `[${i}]`,
      state: (i === cur ? "current" : cmp.includes(i) ? "compare" : "default") as CellState,
    })),
    edges: HEAP_EDGES.map((e) => ({ ...e, state: e.id === activeEdge ? "active" : "default" })),
  });

  const steps: ConceptStep[] = [];
  steps.push(st(heapScene([2, 3, 8, 5, 4, 1], 5, [], "h25"), "Insert 1: append it at the next free slot, index 5 (a min-heap keeps the smallest on top).", 2));
  steps.push(st(heapScene([2, 3, 8, 5, 4, 1], 5, [2], "h25"), "Compare 1 with its parent 8 (index 2). 1 < 8, so the heap order is violated → swap.", 4));
  steps.push(st(heapScene([2, 3, 1, 5, 4, 8], 2, [0], "h02"), "Now 1 sits at index 2. Compare with parent 2 (index 0). 1 < 2 → swap again.", 5));
  steps.push(st(heapScene([1, 3, 2, 5, 4, 8], 0, []), "1 reached the root — every parent ≤ its children again. Sift-up done. ✅", 8, undefined, true));
  return steps;
}
