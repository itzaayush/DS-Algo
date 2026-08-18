import type { ConceptModule } from "./types";
import {
  buildRecursion,
  buildLinkedList,
  buildStack,
  buildHashing,
  buildBits,
  buildTree,
  buildHeap,
  recursionCode,
  linkedListCode,
  stackCode,
  hashingCode,
  bitsCode,
  treeCode,
  heapCode,
} from "./generators";
import {
  buildGraph,
  buildUnionFind,
  buildDp,
  buildGreedy,
  graphCode,
  unionFindCode,
  dpCode,
  greedyCode,
} from "./generators2";

const cpp = (id: string, name: string, code: string, build: () => ReturnType<typeof buildRecursion>): ConceptModule => ({
  id,
  name,
  code,
  language: "cpp",
  build,
});

export const CONCEPTS: Record<string, ConceptModule> = {
  recursion: cpp("recursion", "Recursion — the call stack", recursionCode, buildRecursion),
  "linked-list": cpp("linked-list", "Reversing a linked list", linkedListCode, buildLinkedList),
  stack: cpp("stack", "Matching brackets with a stack", stackCode, buildStack),
  hashing: cpp("hashing", "Hashing into buckets", hashingCode, buildHashing),
  bits: cpp("bits", "XOR to find the unique number", bitsCode, buildBits),
  tree: cpp("tree", "In-order traversal of a BST", treeCode, buildTree),
  heap: cpp("heap", "Sift-up in a min-heap", heapCode, buildHeap),
  graph: cpp("graph", "Breadth-first search", graphCode, buildGraph),
  "union-find": cpp("union-find", "Union-Find connectivity", unionFindCode, buildUnionFind),
  dp: cpp("dp", "Climbing stairs (1-D DP)", dpCode, buildDp),
  greedy: cpp("greedy", "Interval scheduling", greedyCode, buildGreedy),
};

export function getConcept(id: string): ConceptModule | undefined {
  return CONCEPTS[id];
}
