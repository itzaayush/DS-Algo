import { snapshot, type Cell, type CellRole, type Frame } from "./types";

export const twoPointerSumCode = `int twoSum(vector<int>& a, int target) {
  int lo = 0, hi = a.size() - 1;
  while (lo < hi) {
    int sum = a[lo] + a[hi];
    if (sum == target) return lo;
    if (sum < target) lo++;
    else hi--;
  }
  return -1;
}`;

export const slidingWindowCode = `int longestUnique(vector<int>& a) {
  unordered_set<int> win;
  int left = 0, best = 0;
  for (int right = 0; right < a.size(); right++) {
    while (win.count(a[right])) {
      win.erase(a[left++]);
    }
    win.insert(a[right]);
    best = max(best, right - left + 1);
  }
  return best;
}`;

function toCells(input: number[]): Cell[] {
  return input.map((value, i) => ({ id: i, value }));
}

/* --------------------------- Two pointers (sorted) -------------------------- */

export function twoPointerSum(input: number[], target?: number): Frame[] {
  const sorted = [...input].sort((a, b) => a - b);
  const cells = toCells(sorted);
  const n = cells.length;
  // Default to a pair that actually exists so learners see a success path.
  const t = target ?? (n >= 2 ? cells[1].value + cells[n - 2].value : cells[0].value);
  const frames: Frame[] = [];
  const counters = { checks: 0 };

  let lo = 0;
  let hi = n - 1;

  const roleFor = (l: number, h: number, extra?: (r: CellRole[]) => void): CellRole[] => {
    const r: CellRole[] = cells.map((_, k) => (k < l || k > h ? "discarded" : "default"));
    extra?.(r);
    return r;
  };

  frames.push(
    snapshot(
      cells,
      roleFor(lo, hi),
      [
        { name: "lo", index: lo, tone: "secondary" },
        { name: "hi", index: hi, tone: "danger" },
      ],
      `Sorted array. Find two values that sum to ${t}. Start pointers at both ends.`,
      2,
      counters
    )
  );

  while (lo < hi) {
    counters.checks++;
    const sum = cells[lo].value + cells[hi].value;
    frames.push(
      snapshot(
        cells,
        roleFor(lo, hi, (r) => {
          r[lo] = "compare";
          r[hi] = "compare";
        }),
        [
          { name: "lo", index: lo, tone: "secondary" },
          { name: "hi", index: hi, tone: "danger" },
        ],
        `${cells[lo].value} + ${cells[hi].value} = ${sum}. Compare with ${t}.`,
        4,
        counters
      )
    );

    if (sum === t) {
      frames.push(
        snapshot(
          cells,
          roleFor(lo, hi, (r) => {
            r[lo] = "found";
            r[hi] = "found";
          }),
          [
            { name: "lo", index: lo, tone: "primary" },
            { name: "hi", index: hi, tone: "primary" },
          ],
          `Found it! ${cells[lo].value} + ${cells[hi].value} = ${t}.`,
          5,
          counters,
          true
        )
      );
      return frames;
    }

    if (sum < t) {
      lo++;
      frames.push(
        snapshot(cells, roleFor(lo, hi), [
          { name: "lo", index: lo, tone: "secondary" },
          { name: "hi", index: hi, tone: "danger" },
        ], `Sum ${sum} < ${t} → need bigger. Move lo right.`, 6, counters)
      );
    } else {
      hi--;
      frames.push(
        snapshot(cells, roleFor(lo, hi), [
          { name: "lo", index: lo, tone: "secondary" },
          { name: "hi", index: Math.max(hi, 0), tone: "danger" },
        ], `Sum ${sum} > ${t} → need smaller. Move hi left.`, 7, counters)
      );
    }
  }

  frames.push(snapshot(cells, cells.map(() => "discarded") as CellRole[], [], `Pointers met — no pair sums to ${t}.`, 9, counters, true));
  return frames;
}

/* ----------------------------- Sliding window ------------------------------ */

export function slidingWindow(input: number[]): Frame[] {
  const cells = toCells(input);
  const n = cells.length;
  const frames: Frame[] = [];
  const counters = { windowLen: 0, best: 0 };
  const inWindow = new Set<number>();
  let left = 0;
  let best = 0;

  const roles = (l: number, r: number, active: number): CellRole[] =>
    cells.map((_, k) => {
      if (k === active) return "active";
      if (k >= l && k <= r) return "window";
      if (k < l) return "visited";
      return "default";
    });

  frames.push(
    snapshot(cells, cells.map(() => "default") as CellRole[], [{ name: "L", index: 0, tone: "secondary" }, { name: "R", index: 0, tone: "primary" }], "Find the longest run of distinct values with a growing window.", 3, counters)
  );

  for (let right = 0; right < n; right++) {
    // Shrink while the incoming value is already inside the window.
    while (inWindow.has(cells[right].value)) {
      frames.push(
        snapshot(cells, roles(left, right - 1, right), [
          { name: "L", index: left, tone: "secondary" },
          { name: "R", index: right, tone: "primary" },
        ], `${cells[right].value} already in window → shrink from the left.`, 5, counters)
      );
      inWindow.delete(cells[left].value);
      left++;
    }
    inWindow.add(cells[right].value);
    const len = right - left + 1;
    best = Math.max(best, len);
    counters.windowLen = len;
    counters.best = best;
    frames.push(
      snapshot(cells, roles(left, right, right), [
        { name: "L", index: left, tone: "secondary" },
        { name: "R", index: right, tone: "primary" },
      ], `Window [${left}..${right}] all distinct — length ${len}, best so far ${best}.`, 9, counters)
    );
  }

  frames.push(snapshot(cells, cells.map((_, k) => (k < left ? "visited" : "window")) as CellRole[], [], `Longest window of distinct values has length ${best}.`, 11, counters, true));
  return frames;
}
