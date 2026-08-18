import { baseRoles, snapshot, type Cell, type CellRole, type Frame } from "./types";

export const linearSearchCode = `int linearSearch(vector<int>& a, int target) {
  for (int i = 0; i < (int)a.size(); i++) {
    if (a[i] == target) return i;
  }
  return -1;
}`;

export const binarySearchCode = `int binarySearch(vector<int>& a, int target) {
  int low = 0, high = (int)a.size() - 1;
  while (low <= high) {
    int mid = (low + high) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`;

function toCells(input: number[]): Cell[] {
  return input.map((value, i) => ({ id: i, value }));
}

/* ------------------------------ Linear search ----------------------------- */

export function linearSearch(input: number[], target = input[Math.floor(input.length * 0.7)]): Frame[] {
  const cells = toCells(input);
  const n = cells.length;
  const frames: Frame[] = [];
  const counters = { comparisons: 0 };

  frames.push(snapshot(cells, baseRoles(n, n), [], `Scan left to right looking for ${target}.`, 1, counters));

  for (let i = 0; i < n; i++) {
    counters.comparisons++;
    const roles: CellRole[] = cells.map((_, k) => (k < i ? "discarded" : "default"));
    roles[i] = "active";
    frames.push(snapshot(cells, roles, [{ name: "i", index: i, tone: "secondary" }], `Check index ${i}: is ${cells[i].value} === ${target}?`, 3, counters));
    if (cells[i].value === target) {
      const found: CellRole[] = cells.map((_, k) => (k < i ? "discarded" : "default"));
      found[i] = "found";
      frames.push(snapshot(cells, found, [{ name: "i", index: i, tone: "primary" }], `Found ${target} at index ${i}. Linear search touched ${i + 1} of ${n} cells.`, 3, counters, true));
      return frames;
    }
  }

  frames.push(snapshot(cells, cells.map(() => "discarded") as CellRole[], [], `${target} is not in the array. Returned -1.`, 5, counters, true));
  return frames;
}

/* ------------------------------ Binary search ----------------------------- */

export function binarySearch(input: number[], target?: number): Frame[] {
  // Binary search is only meaningful on sorted data — sort defensively.
  const sorted = [...input].sort((a, b) => a - b);
  const cells = toCells(sorted);
  const n = cells.length;
  const t = target ?? cells[Math.floor(n * 0.65)].value;
  const frames: Frame[] = [];
  const counters = { comparisons: 0 };

  let low = 0;
  let high = n - 1;

  frames.push(
    snapshot(cells, baseRoles(n, n === 0 ? 0 : n).map(() => "default") as CellRole[], [
      { name: "low", index: 0, tone: "secondary" },
      { name: "high", index: n - 1, tone: "danger" },
    ], `Sorted input lets us halve the search space each step. Target = ${t}.`, 2, counters)
  );

  while (low <= high) {
    const mid = (low + high) >> 1;
    counters.comparisons++;
    const roles: CellRole[] = cells.map((_, k) => (k < low || k > high ? "discarded" : "default"));
    roles[mid] = "active";
    frames.push(
      snapshot(cells, roles, [
        { name: "low", index: low, tone: "secondary" },
        { name: "mid", index: mid, tone: "primary" },
        { name: "high", index: high, tone: "danger" },
      ], `Look at mid index ${mid} (value ${cells[mid].value}). Compare with ${t}.`, 4, counters)
    );

    if (cells[mid].value === t) {
      const found: CellRole[] = cells.map((_, k) => (k < low || k > high ? "discarded" : "default"));
      found[mid] = "found";
      frames.push(
        snapshot(cells, found, [{ name: "mid", index: mid, tone: "primary" }], `Match! Found ${t} at index ${mid} in ${counters.comparisons} comparisons.`, 5, counters, true)
      );
      return frames;
    }

    if (cells[mid].value < t) {
      low = mid + 1;
      const roles2: CellRole[] = cells.map((_, k) => (k < low || k > high ? "discarded" : "default"));
      frames.push(
        snapshot(cells, roles2, [
          { name: "low", index: low, tone: "secondary" },
          { name: "high", index: high, tone: "danger" },
        ], `${cells[mid].value} < ${t} → discard the left half, search right.`, 6, counters)
      );
    } else {
      high = mid - 1;
      const roles2: CellRole[] = cells.map((_, k) => (k < low || k > high ? "discarded" : "default"));
      frames.push(
        snapshot(cells, roles2, [
          { name: "low", index: low, tone: "secondary" },
          { name: "high", index: Math.max(high, 0), tone: "danger" },
        ], `${cells[mid].value} > ${t} → discard the right half, search left.`, 7, counters)
      );
    }
  }

  frames.push(snapshot(cells, cells.map(() => "discarded") as CellRole[], [], `${t} is not present. low crossed high, so we return -1.`, 9, counters, true));
  return frames;
}
