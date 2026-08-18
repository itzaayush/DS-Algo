import { baseRoles, snapshot, type Cell, type CellRole, type Frame } from "./types";

/* Reference implementations shown next to the trace (1-based line indexing). */

export const bubbleSortCode = `vector<int> bubbleSort(vector<int> a) {
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
  return a;
}`;

export const selectionSortCode = `vector<int> selectionSort(vector<int> a) {
  int n = a.size();
  for (int i = 0; i < n - 1; i++) {
    int mn = i;
    for (int j = i + 1; j < n; j++) {
      if (a[j] < a[mn]) mn = j;
    }
    if (mn != i) swap(a[i], a[mn]);
  }
  return a;
}`;

export const insertionSortCode = `vector<int> insertionSort(vector<int> a) {
  for (int i = 1; i < (int)a.size(); i++) {
    int j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      swap(a[j - 1], a[j]);
      j--;
    }
  }
  return a;
}`;

function toCells(input: number[]): Cell[] {
  return input.map((value, i) => ({ id: i, value }));
}

/* --------------------------------- Bubble --------------------------------- */

export function bubbleSort(input: number[]): Frame[] {
  const cells = toCells(input);
  const n = cells.length;
  const frames: Frame[] = [];
  const counters = { comparisons: 0, swaps: 0 };
  let sortedFrom = n;

  frames.push(
    snapshot(cells, baseRoles(n, sortedFrom), [], "Bubble the largest value to the end on every pass.", 3, counters)
  );

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      counters.comparisons++;
      const roles = baseRoles(n, sortedFrom);
      roles[j] = "compare";
      roles[j + 1] = "compare";
      const a = cells[j].value;
      const b = cells[j + 1].value;
      frames.push(
        snapshot(
          cells,
          roles,
          [{ name: "j", index: j, tone: "secondary" }, { name: "j+1", index: j + 1, tone: "secondary" }],
          `Compare ${a} and ${b}${a > b ? " → out of order" : " → already ordered"}.`,
          6,
          counters
        )
      );
      if (a > b) {
        [cells[j], cells[j + 1]] = [cells[j + 1], cells[j]];
        counters.swaps++;
        swapped = true;
        const rs = baseRoles(n, sortedFrom);
        rs[j] = "swap";
        rs[j + 1] = "swap";
        frames.push(
          snapshot(
            cells,
            rs,
            [{ name: "j", index: j, tone: "danger" }, { name: "j+1", index: j + 1, tone: "danger" }],
            `Swap so ${b} comes before ${a}.`,
            7,
            counters
          )
        );
      }
    }
    sortedFrom = n - 1 - i;
    frames.push(
      snapshot(cells, baseRoles(n, sortedFrom), [], `Position ${sortedFrom} locked in — largest of the pass is placed.`, 11, counters)
    );
    if (!swapped) break;
  }

  frames.push(snapshot(cells, Array(n).fill("sorted") as CellRole[], [], "Sorted! Every value is in its final place.", 13, counters, true));
  return frames;
}

/* -------------------------------- Selection ------------------------------- */

export function selectionSort(input: number[]): Frame[] {
  const cells = toCells(input);
  const n = cells.length;
  const frames: Frame[] = [];
  const counters = { comparisons: 0, swaps: 0 };

  frames.push(snapshot(cells, baseRoles(n, n), [], "Select the smallest remaining value and place it next.", 3, counters));

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    const startRoles = baseRoles(n, i);
    startRoles[min] = "min";
    frames.push(
      snapshot(cells, startRoles, [{ name: "i", index: i, tone: "primary" }, { name: "min", index: min, tone: "accent" }], `Assume position ${i} holds the minimum for now.`, 4, counters)
    );
    for (let j = i + 1; j < n; j++) {
      counters.comparisons++;
      const roles = baseRoles(n, i);
      roles[min] = "min";
      roles[j] = "compare";
      frames.push(
        snapshot(cells, roles, [{ name: "min", index: min, tone: "accent" }, { name: "j", index: j, tone: "secondary" }], `Is ${cells[j].value} < current min ${cells[min].value}?`, 6, counters)
      );
      if (cells[j].value < cells[min].value) {
        min = j;
        const r2 = baseRoles(n, i);
        r2[min] = "min";
        frames.push(snapshot(cells, r2, [{ name: "min", index: min, tone: "accent" }], `Yes — new minimum is ${cells[min].value}.`, 6, counters));
      }
    }
    if (min !== i) {
      [cells[i], cells[min]] = [cells[min], cells[i]];
      counters.swaps++;
      const r3 = baseRoles(n, i);
      r3[i] = "swap";
      r3[min] = "swap";
      frames.push(snapshot(cells, r3, [], `Swap the minimum into position ${i}.`, 8, counters));
    }
    frames.push(snapshot(cells, baseRoles(n, i + 1), [], `Position ${i} is finalized.`, 3, counters));
  }

  frames.push(snapshot(cells, Array(n).fill("sorted") as CellRole[], [], "Sorted! The prefix grew until everything was placed.", 10, counters, true));
  return frames;
}

/* -------------------------------- Insertion ------------------------------- */

export function insertionSort(input: number[]): Frame[] {
  const cells = toCells(input);
  const n = cells.length;
  const frames: Frame[] = [];
  const counters = { comparisons: 0, swaps: 0 };

  frames.push(snapshot(cells, baseRoles(n, 1), [], "Grow a sorted prefix by inserting each new value into place.", 2, counters));

  for (let i = 1; i < n; i++) {
    let j = i;
    const pick = baseRoles(n, i);
    pick[i] = "key";
    frames.push(snapshot(cells, pick, [{ name: "i", index: i, tone: "primary" }], `Take ${cells[i].value} and slide it left while it's smaller.`, 3, counters));
    while (j > 0 && cells[j - 1].value > cells[j].value) {
      counters.comparisons++;
      const roles = baseRoles(n, i);
      roles[j] = "key";
      roles[j - 1] = "compare";
      frames.push(snapshot(cells, roles, [{ name: "j", index: j, tone: "secondary" }], `${cells[j - 1].value} > ${cells[j].value} → shift right.`, 4, counters));
      [cells[j - 1], cells[j]] = [cells[j], cells[j - 1]];
      counters.swaps++;
      j--;
    }
    if (j > 0) counters.comparisons++;
    frames.push(snapshot(cells, baseRoles(n, i + 1), [], `Inserted. The first ${i + 1} values are sorted.`, 7, counters));
  }

  frames.push(snapshot(cells, Array(n).fill("sorted") as CellRole[], [], "Sorted! Each value found its slot in the growing prefix.", 9, counters, true));
  return frames;
}
