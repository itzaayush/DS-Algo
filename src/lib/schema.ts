import { z } from "zod";

/* ---------------------------------------------------------------------------
   Content schema (Zod) — single source of truth for lessons, patterns, and
   practice items. Types are inferred from these schemas so the content data
   files are checked at compile time; `validateContent()` (see lib/content.ts)
   can additionally parse them in CI per PRD FR-025 / GH-026.
--------------------------------------------------------------------------- */

export const difficultySchema = z.enum(["intro", "easy", "medium", "hard"]);
export type Difficulty = z.infer<typeof difficultySchema>;

export const trackSchema = z.enum(["fundamentals", "patterns"]);

/* Rich content blocks used inside a lesson's concept section. */
export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string() }),
  z.object({ type: z.literal("heading"), text: z.string() }),
  z.object({ type: z.literal("list"), ordered: z.boolean().default(false), items: z.array(z.string()) }),
  z.object({
    type: z.literal("callout"),
    tone: z.enum(["info", "success", "warning", "danger"]),
    title: z.string(),
    text: z.string(),
  }),
  z.object({ type: z.literal("code"), language: z.string().default("javascript"), code: z.string() }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const quizQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  choices: z.array(z.object({ id: z.string(), text: z.string() })).min(2),
  correctId: z.string(),
  explanation: z.string(),
  concept: z.string().optional(),
});
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const flowNodeSchema = z.object({
  id: z.string(),
  kind: z.enum(["start", "process", "decision", "io", "end"]),
  label: z.string(),
  x: z.number(),
  y: z.number(),
});
export const flowEdgeSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
  /** Optional named source handle: "yes" branches leave a decision to the side. */
  sourceHandle: z.enum(["yes", "loop"]).optional(),
});
export const flowchartSchema = z.object({
  nodes: z.array(flowNodeSchema),
  edges: z.array(flowEdgeSchema),
});
export type FlowchartSpec = z.infer<typeof flowchartSchema>;

export const complexityRowSchema = z.object({
  label: z.string(),
  time: z.string(),
  space: z.string(),
  note: z.string().optional(),
});

export const lessonSchema = z.object({
  slug: z.string(),
  moduleId: z.string(),
  order: z.number(),
  title: z.string(),
  subtitle: z.string(),
  estMinutes: z.number(),
  difficulty: difficultySchema,
  lastReviewed: z.string(),
  published: z.boolean().default(true),
  hook: z.string(),
  objectives: z.array(z.string()).min(1),
  analogy: z.object({ emoji: z.string(), title: z.string(), body: z.string() }),
  concept: z.array(contentBlockSchema).min(1),
  visualizer: z
    .object({
      algorithmId: z.string(),
      algorithmOptions: z.array(z.string()).optional(),
      initialInput: z.array(z.number()).optional(),
      /** Maps a highlighted code line → flowchart node id for the synced tab. */
      codeLineToNode: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  /** Data-structure concept animation (recursion, trees, graphs, DP, ...). */
  conceptVisualizer: z
    .object({
      conceptId: z.string(),
      codeLineToNode: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  flowchart: flowchartSchema.optional(),
  pseudocode: z.string(),
  implementation: z.object({ language: z.string(), code: z.string() }),
  complexity: z.object({ rows: z.array(complexityRowSchema), summary: z.string() }),
  mistakes: z.array(z.object({ title: z.string(), body: z.string() })),
  recap: z.array(z.string()).min(1),
  quiz: z.array(quizQuestionSchema),
  practiceIds: z.array(z.string()),
  companyTags: z.array(z.string()),
});
export type Lesson = z.infer<typeof lessonSchema>;

export const moduleSchema = z.object({
  id: z.string(),
  track: trackSchema,
  order: z.number(),
  title: z.string(),
  summary: z.string(),
  icon: z.string(),
  difficulty: difficultySchema,
  estMinutes: z.number(),
  prerequisites: z.array(z.string()),
  companyTags: z.array(z.string()),
  lessonSlugs: z.array(z.string()),
});
export type Module = z.infer<typeof moduleSchema>;

export const patternSchema = z.object({
  slug: z.string(),
  order: z.number(),
  title: z.string(),
  summary: z.string(),
  difficulty: difficultySchema,
  estMinutes: z.number(),
  published: z.boolean().default(true),
  recognitionSignals: z.array(z.string()),
  intuition: z.string(),
  visualModel: z.string(),
  template: z.object({ language: z.string(), code: z.string() }),
  complexity: z.string(),
  mistakes: z.array(z.string()),
  variations: z.array(z.string()),
  prerequisites: z.array(z.string()),
  relatedPatterns: z.array(z.string()),
  practiceIds: z.array(z.string()),
  companyTags: z.array(z.string()),
  visualizer: z.object({ algorithmId: z.string() }).optional(),
  /** Interactive "spot the pattern" checks shown before the template. */
  recognition: z.array(quizQuestionSchema).optional(),
});
export type Pattern = z.infer<typeof patternSchema>;

export const practiceItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  platform: z.enum(["leetcode", "codeforces"]),
  url: z.string().url(),
  difficulty: difficultySchema,
  topic: z.string(),
  pattern: z.string().optional(),
  estMinutes: z.number(),
  hint: z.string(),
  companyTags: z.array(z.string()),
  freshness: z.string(),
});
export type PracticeItem = z.infer<typeof practiceItemSchema>;
