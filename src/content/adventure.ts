export interface GameLevel {
  id: string;
  title: string;
  world: string;
  concept: string;
  /** Lesson slug that must be completed to unlock. null = always available. */
  requiredLesson: string | null;
  values: number[];
  blurb: string;
  playable: boolean;
  /** Position on the 3D hub map. */
  pos: [number, number, number];
  color: string;
}

export const GAME_LEVELS: GameLevel[] = [
  {
    id: "array-ascent",
    title: "Array Ascent",
    world: "Arrays",
    concept: "Order the towers ascending",
    requiredLesson: null,
    values: [3, 1, 4, 2, 5],
    blurb: "Swap the crystal towers until their heights climb from left to right.",
    playable: true,
    pos: [-3.2, 0, 0.5],
    color: "#22d3ee",
  },
  {
    id: "sorting-summit",
    title: "Sorting Summit",
    world: "Sorting",
    concept: "Sort a longer ridge",
    requiredLesson: "sorting-intro",
    values: [6, 2, 8, 3, 7, 1, 5],
    blurb: "A taller challenge — seven towers to bring into order. Fewer swaps earns a higher score.",
    playable: true,
    pos: [-0.6, 0.4, -1.2],
    color: "#7c5cff",
  },
  {
    id: "search-spire",
    title: "Search Spire",
    world: "Binary Search",
    concept: "Halve the tower field",
    requiredLesson: "binary-search-intro",
    values: [4, 8, 15, 16, 23, 42, 55],
    blurb: "Coming soon: pinpoint the target by discarding half the spires each guess.",
    playable: false,
    pos: [2.2, 0.1, 0.2],
    color: "#34d399",
  },
  {
    id: "graph-grove",
    title: "Graph Grove",
    world: "Graphs",
    concept: "Route through the nodes",
    requiredLesson: null,
    values: [],
    blurb: "Coming soon: trace BFS and DFS paths through a glowing node forest.",
    playable: false,
    pos: [4.4, -0.2, -1.4],
    color: "#fbbf24",
  },
];

export function getGameLevel(id: string) {
  return GAME_LEVELS.find((l) => l.id === id);
}
