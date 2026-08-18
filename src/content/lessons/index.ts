import type { Lesson } from "@/lib/schema";
import { arraysIntro } from "./arrays-intro";
import { binarySearchIntro } from "./binary-search-intro";
import { sortingIntro } from "./sorting-intro";
import {
  complexityIntuition,
  recursionIntro,
  linkedListsIntro,
  stacksQueuesIntro,
  hashingIntro,
} from "./core-lessons";
import {
  treesIntro,
  heapsIntro,
  graphsIntro,
  greedyIntro,
  dpIntro,
} from "./advanced-lessons";
import { cppStlIntro, cpToolkitIntro, advancedIntro } from "./cp-lessons";

/** All fully-authored lessons. Modules whose slug isn't here render as "in production". */
export const LESSONS: Lesson[] = [
  complexityIntuition,
  arraysIntro,
  recursionIntro,
  linkedListsIntro,
  stacksQueuesIntro,
  hashingIntro,
  sortingIntro,
  binarySearchIntro,
  treesIntro,
  heapsIntro,
  graphsIntro,
  greedyIntro,
  dpIntro,
  cppStlIntro,
  cpToolkitIntro,
  advancedIntro,
];

export const LESSON_MAP = new Map(LESSONS.map((l) => [l.slug, l]));

export function getLesson(slug: string): Lesson | undefined {
  return LESSON_MAP.get(slug);
}
