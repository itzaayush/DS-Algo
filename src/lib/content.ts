import { MODULES, getModule } from "@/content/curriculum";
import { LESSONS, LESSON_MAP, getLesson } from "@/content/lessons";
import { PRACTICE_ITEMS } from "@/content/practice";
import { PATTERNS } from "@/content/patterns";
import {
  lessonSchema,
  moduleSchema,
  patternSchema,
  practiceItemSchema,
} from "@/lib/schema";
import type { Module } from "@/lib/schema";

export type ModuleStatus = "completed" | "current" | "available" | "locked";

export function isModuleAuthored(m: Module): boolean {
  return m.lessonSlugs.some((s) => LESSON_MAP.has(s));
}

export function moduleAuthoredLessons(m: Module) {
  return m.lessonSlugs.map((s) => getLesson(s)).filter((l): l is NonNullable<typeof l> => Boolean(l));
}

export function isModuleComplete(m: Module, completed: Set<string>): boolean {
  const authored = m.lessonSlugs.filter((s) => LESSON_MAP.has(s));
  return authored.length > 0 && authored.every((s) => completed.has(s));
}

/** In-production prerequisites (no authored lessons yet) never block progress. */
export function isModuleUnlocked(m: Module, completed: Set<string>): boolean {
  return m.prerequisites.every((pid) => {
    const pm = getModule(pid);
    if (!pm || !isModuleAuthored(pm)) return true;
    return isModuleComplete(pm, completed);
  });
}

/** The first prerequisite that is authored but not yet complete (for lock messaging). */
export function blockingPrerequisite(m: Module, completed: Set<string>): Module | null {
  for (const pid of m.prerequisites) {
    const pm = getModule(pid);
    if (pm && isModuleAuthored(pm) && !isModuleComplete(pm, completed)) return pm;
  }
  return null;
}

export interface ModuleView extends Module {
  status: ModuleStatus;
  authored: boolean;
  completedLessons: number;
  totalAuthored: number;
}

/** Compute display status for every module, marking the first available one "current". */
export function computeModuleViews(completed: Set<string>): ModuleView[] {
  let currentAssigned = false;
  return [...MODULES]
    .sort((a, b) => a.order - b.order)
    .map((m) => {
      const authored = isModuleAuthored(m);
      const authoredLessons = m.lessonSlugs.filter((s) => LESSON_MAP.has(s));
      const done = authoredLessons.filter((s) => completed.has(s)).length;
      let status: ModuleStatus;
      if (isModuleComplete(m, completed)) status = "completed";
      else if (!isModuleUnlocked(m, completed)) status = "locked";
      else if (authored && !currentAssigned) {
        status = "current";
        currentAssigned = true;
      } else status = "available";
      return {
        ...m,
        status,
        authored,
        completedLessons: done,
        totalAuthored: authoredLessons.length,
      };
    });
}

/** Recommended next lesson: first authored, unlocked, incomplete lesson in order. */
export function recommendedNextLesson(completed: Set<string>) {
  for (const m of [...MODULES].sort((a, b) => a.order - b.order)) {
    if (!isModuleUnlocked(m, completed)) continue;
    for (const slug of m.lessonSlugs) {
      const lesson = getLesson(slug);
      if (lesson && !completed.has(slug)) return lesson;
    }
  }
  return null;
}

export function lessonModule(slug: string) {
  const lesson = getLesson(slug);
  return lesson ? getModule(lesson.moduleId) : undefined;
}

/** Authored lessons in curriculum order. */
export function orderedAuthoredLessons() {
  const result: NonNullable<ReturnType<typeof getLesson>>[] = [];
  for (const m of [...MODULES].sort((a, b) => a.order - b.order)) {
    for (const slug of m.lessonSlugs) {
      const l = getLesson(slug);
      if (l) result.push(l);
    }
  }
  return result;
}

/** The next authored lesson after a given slug, or null at the end. */
export function nextLessonAfter(slug: string) {
  const ordered = orderedAuthoredLessons();
  const idx = ordered.findIndex((l) => l.slug === slug);
  return idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;
}

/**
 * Parse all content against the Zod schemas. Intended for a CI/test step
 * (PRD FR-025 / GH-026). Throws with a helpful message on the first failure.
 */
export function validateContent() {
  for (const m of MODULES) moduleSchema.parse(m);
  for (const l of LESSONS) lessonSchema.parse(l);
  for (const p of PATTERNS) patternSchema.parse(p);
  for (const p of PRACTICE_ITEMS) practiceItemSchema.parse(p);

  // Referential integrity: lesson practice ids and module lesson slugs must resolve.
  const practiceIds = new Set(PRACTICE_ITEMS.map((p) => p.id));
  for (const l of LESSONS) {
    for (const pid of l.practiceIds) {
      if (!practiceIds.has(pid)) throw new Error(`Lesson ${l.slug} references missing practice ${pid}`);
    }
    if (!getModule(l.moduleId)) throw new Error(`Lesson ${l.slug} references missing module ${l.moduleId}`);
  }
  return { modules: MODULES.length, lessons: LESSONS.length, patterns: PATTERNS.length, practice: PRACTICE_ITEMS.length };
}
