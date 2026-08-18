/**
 * Concept-visualizer engine — a generalized, deterministic step model for the
 * data-structure lessons (recursion, linked lists, trees, heaps, graphs, DP,
 * hashing, greedy, union-find, bits). Each concept is a pure generator that
 * returns ConceptStep[]; the player steps through them with the same controls
 * the array visualizers use.
 */

export type CellState =
  | "default"
  | "active" // currently being processed
  | "visited" // already handled
  | "current" // the focus of this step
  | "done" // finalized / in result
  | "compare" // being compared
  | "target" // the goal
  | "muted"; // dimmed / discarded

export interface SceneNode {
  id: string;
  label: string;
  x: number; // 0..100 viewBox units
  y: number; // 0..100 viewBox units
  state: CellState;
  sub?: string; // small caption under the node
}

export interface SceneEdge {
  id: string;
  from: string; // node id
  to: string; // node id
  state?: "default" | "active" | "tree" | "muted";
  label?: string;
  directed?: boolean;
  /** curvature for back/self edges: 0 straight, +/- bends */
  curve?: number;
}

export interface SceneLabel {
  text: string; // pointer/name e.g. "i", "slow", "root"
  nodeId: string;
  tone?: "primary" | "secondary" | "accent" | "danger";
  place?: "above" | "below";
}

export interface StackBox {
  id: string;
  label: string;
  state?: CellState;
}

export interface GridCell {
  r: number;
  c: number;
  label: string;
  state?: CellState;
}

export interface TimelineItem {
  id: string;
  label: string;
  start: number; // 0..100
  end: number; // 0..100
  row: number;
  state?: CellState;
}

export interface AuxPanel {
  label: string; // e.g. "queue", "visited", "call stack"
  items: { id: string; label: string; state?: CellState }[];
  orientation?: "horizontal" | "vertical";
}

export type Scene =
  | { kind: "nodes"; nodes: SceneNode[]; edges: SceneEdge[]; labels?: SceneLabel[]; aux?: AuxPanel; height?: number }
  | { kind: "stack"; title: string; boxes: StackBox[]; orientation?: "vertical" | "horizontal"; aux?: AuxPanel }
  | { kind: "grid"; rows: number; cols: number; cells: GridCell[]; rowLabels?: string[]; colLabels?: string[]; title?: string; aux?: AuxPanel }
  | { kind: "timeline"; items: TimelineItem[]; rows: number; aux?: AuxPanel }
  | { kind: "bits"; bits: { value: number; state?: CellState }[]; caption?: string; aux?: AuxPanel };

export interface ConceptStep {
  narration: string;
  codeLine: number;
  counters?: Record<string, number>;
  scene: Scene;
  done?: boolean;
}

export interface ConceptModule {
  id: string;
  name: string;
  code: string;
  language: string;
  build: () => ConceptStep[];
}
