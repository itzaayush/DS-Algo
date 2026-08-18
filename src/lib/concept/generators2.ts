import type { CellState, ConceptStep, Scene, SceneEdge } from "./types";

const st = (
  scene: Scene,
  narration: string,
  codeLine: number,
  counters?: Record<string, number>,
  done?: boolean
): ConceptStep => ({ scene, narration, codeLine, counters, done });

/* ============================== Graph BFS ================================ */

export const graphCode = `void bfs(int src) {
  queue<int> q; q.push(src);
  seen[src] = true;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u])
      if (!seen[v]) { seen[v] = true; q.push(v); }
  }
}`;

const GRAPH_NODES = [
  { id: "0", label: "0", x: 50, y: 8 },
  { id: "1", label: "1", x: 24, y: 28 },
  { id: "2", label: "2", x: 74, y: 28 },
  { id: "3", label: "3", x: 46, y: 46 },
  { id: "4", label: "4", x: 88, y: 48 },
  { id: "5", label: "5", x: 62, y: 62 },
];
const GRAPH_EDGES: SceneEdge[] = [
  { id: "e01", from: "0", to: "1" },
  { id: "e02", from: "0", to: "2" },
  { id: "e13", from: "1", to: "3" },
  { id: "e23", from: "2", to: "3" },
  { id: "e24", from: "2", to: "4" },
  { id: "e35", from: "3", to: "5" },
];
const ADJ: Record<string, string[]> = { "0": ["1", "2"], "1": ["0", "3"], "2": ["0", "3", "4"], "3": ["1", "2", "5"], "4": ["2"], "5": ["3"] };

const edgeId = (a: string, b: string) => GRAPH_EDGES.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a))?.id;

export function buildGraph(): ConceptStep[] {
  const steps: ConceptStep[] = [];
  const seen = new Set<string>();
  const processed = new Set<string>();
  let queue: string[] = [];

  const scene = (active: string | null, activeEdges: string[]): Scene => ({
    kind: "nodes",
    height: 68,
    nodes: GRAPH_NODES.map((n) => ({
      ...n,
      state: (n.id === active ? "active" : processed.has(n.id) ? "visited" : seen.has(n.id) ? "target" : "default") as CellState,
    })),
    edges: GRAPH_EDGES.map((e) => ({ ...e, state: activeEdges.includes(e.id) ? "active" : "default" })),
    aux: { label: "queue (FIFO)", items: queue.map((v) => ({ id: v, label: v, state: "target" as CellState })) },
  });

  queue = ["0"];
  seen.add("0");
  steps.push(st(scene(null, []), "Enqueue the source node 0 and mark it seen.", 3));

  while (queue.length) {
    const u = queue.shift()!;
    const activeEdges: string[] = [];
    for (const v of ADJ[u]) {
      if (!seen.has(v)) {
        seen.add(v);
        queue.push(v);
        const id = edgeId(u, v);
        if (id) activeEdges.push(id);
      }
    }
    processed.add(u);
    const enq = ADJ[u].filter((v) => activeEdges.includes(edgeId(u, v) ?? ""));
    const last = queue.length === 0;
    steps.push(
      st(
        scene(u, activeEdges),
        last
          ? `Dequeue ${u}. Queue is empty — BFS done. Visit order: 0, 1, 2, 3, 4, 5.`
          : enq.length
            ? `Dequeue ${u}. Its unseen neighbors ${enq.join(", ")} get marked and enqueued.`
            : `Dequeue ${u}. All neighbors already seen — nothing to enqueue.`,
        7,
        { visited: processed.size },
        last
      )
    );
  }
  return steps;
}

/* ============================== Union-Find =============================== */

export const unionFindCode = `int find(int x) {
  return p[x] == x ? x : p[x] = find(p[x]);
}
void unite(int a, int b) {
  p[find(a)] = find(b);
}`;

export function buildUnionFind(): ConceptStep[] {
  const n = 6;
  const p = Array.from({ length: n }, (_, i) => i);
  const xs = [10, 26, 42, 58, 74, 90];
  const find = (x: number): number => (p[x] === x ? x : (p[x] = find(p[x])));

  const scene = (active: number[], hint: number[]): Scene => {
    const edges: SceneEdge[] = [];
    for (let i = 0; i < n; i++) if (p[i] !== i) edges.push({ id: `u${i}`, from: `${i}`, to: `${p[i]}`, directed: true, state: "tree" });
    return {
      kind: "nodes",
      height: 40,
      nodes: Array.from({ length: n }, (_, i) => ({
        id: `${i}`,
        label: `${i}`,
        x: xs[i],
        y: 22,
        state: (active.includes(i) ? "active" : hint.includes(i) ? "target" : "default") as CellState,
      })),
      edges,
    };
  };

  const steps: ConceptStep[] = [];
  steps.push(st(scene([], []), "Every element starts as its own set (points to itself).", 1));

  const doUnite = (a: number, b: number, text: string) => {
    p[find(a)] = find(b);
    steps.push(st(scene([a, b], []), text, 5, { sets: new Set(Array.from({ length: n }, (_, i) => find(i))).size }));
  };
  doUnite(0, 1, "unite(0, 1): link 0's root under 1's root. Now {0, 1} are one set.");
  doUnite(2, 3, "unite(2, 3): link them. Now {2, 3} form another set.");
  doUnite(1, 3, "unite(1, 3): roots are 1 and 3 → merge, joining {0,1} with {2,3}.");
  steps.push(
    st(scene([], [0, 4]), `find(0) walks to root 3; find(4) is 4. Different roots → 0 and 4 are NOT connected.`, 2, { sets: new Set(Array.from({ length: n }, (_, i) => find(i))).size }, true)
  );
  return steps;
}

/* ========================= DP (climbing stairs) ========================== */

export const dpCode = `dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++)
  dp[i] = dp[i - 1] + dp[i - 2];
return dp[n];`;

export function buildDp(): ConceptStep[] {
  const n = 5;
  const dp = [1, 1, 2, 3, 5, 8];
  const steps: ConceptStep[] = [];

  const scene = (filled: number, cur: number, sources: number[]): Scene => ({
    kind: "grid",
    title: "dp[i] = ways to reach step i",
    rows: 1,
    cols: n + 1,
    colLabels: Array.from({ length: n + 1 }, (_, i) => `i=${i}`),
    cells: Array.from({ length: filled }, (_, i) => ({
      r: 0,
      c: i,
      label: String(dp[i]),
      state: (i === cur ? "current" : sources.includes(i) ? "compare" : "done") as CellState,
    })),
  });

  steps.push(st(scene(1, 0, []), "Base case: there's 1 way to stand on step 0.", 1));
  steps.push(st(scene(2, 1, []), "Base case: 1 way to reach step 1.", 1));
  for (let i = 2; i <= n; i++) {
    steps.push(
      st(
        scene(i + 1, i, [i - 1, i - 2]),
        `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}.`,
        i === n ? 4 : 3,
        { answer: dp[i] },
        i === n
      )
    );
  }
  return steps;
}

/* ====================== Greedy (interval scheduling) ===================== */

export const greedyCode = `sort(iv.begin(), iv.end(), byEnd);
int count = 0, last = INT_MIN;
for (auto& x : iv)
  if (x.start >= last) {   // no overlap
    count++;
    last = x.end;
  }`;

export function buildGreedy(): ConceptStep[] {
  // Already sorted by end time.
  const iv = [
    { id: "a", s: 0, e: 2 },
    { id: "b", s: 1, e: 3 },
    { id: "c", s: 3, e: 5 },
    { id: "d", s: 4, e: 6 },
    { id: "e", s: 5, e: 7 },
  ];
  const K = 12;
  const state: Record<string, CellState> = {};
  const steps: ConceptStep[] = [];

  const scene = (): Scene => ({
    kind: "timeline",
    rows: iv.length,
    items: iv.map((x, i) => ({
      id: x.id,
      label: `[${x.s},${x.e}]`,
      start: x.s * K,
      end: x.e * K,
      row: i,
      state: state[x.id] ?? "default",
    })),
  });

  steps.push(st(scene(), "Sort meetings by end time, then greedily keep the earliest-finishing ones.", 1));
  let last = -Infinity;
  let count = 0;
  for (const x of iv) {
    if (x.s >= last) {
      const prev = last;
      state[x.id] = "done";
      last = x.e;
      count++;
      steps.push(st(scene(), `[${x.s},${x.e}] starts at ${x.s} ≥ previous end ${isFinite(prev) ? prev : "−∞"} → pick it. last = ${x.e}.`, 4, { picked: count }));
    } else {
      state[x.id] = "muted";
      steps.push(st(scene(), `[${x.s},${x.e}] starts at ${x.s} < last end ${last} → overlaps, skip it.`, 3, { picked: count }));
    }
  }
  steps[steps.length - 1] = { ...steps[steps.length - 1], narration: `Done — ${count} non-overlapping meetings selected (green).`, done: true };
  return steps;
}
