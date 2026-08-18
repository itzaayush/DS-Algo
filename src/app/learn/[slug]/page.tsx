import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CalendarCheck,
  Target,
  Lightbulb,
  AlertTriangle,
  ListChecks,
  ChevronRight,
} from "lucide-react";
import { getLesson, LESSONS } from "@/content/lessons";
import { getModule } from "@/content/curriculum";
import { getPracticeItem } from "@/content/practice";
import { nextLessonAfter } from "@/lib/content";
import type { PracticeItem } from "@/lib/schema";
import { ContentBlocks } from "@/components/lesson/content-blocks";
import { CodeBlock } from "@/components/code-block";
import { LessonVisualizer } from "@/components/lesson/lesson-visualizer";
import { LessonConceptVisualizer } from "@/components/lesson/lesson-concept-visualizer";
import { FlowchartPanel } from "@/components/flowchart/flowchart-panel";
import { LessonQuiz } from "@/components/lesson/lesson-quiz";
import { LessonTracker } from "@/components/lesson/lesson-tracker";
import { PracticeCard } from "@/components/practice/practice-card";
import { BookmarkButton } from "@/components/bookmark-button";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson not found" };
  return { title: lesson.title, description: lesson.subtitle };
}

const diffTone = { intro: "muted", easy: "success", medium: "accent", hard: "danger" } as const;

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const mod = getModule(lesson.moduleId);
  const next = nextLessonAfter(slug);
  const practice = lesson.practiceIds
    .map(getPracticeItem)
    .filter((p): p is PracticeItem => Boolean(p));

  const syncedFlowchart = Boolean(
    lesson.flowchart && lesson.visualizer?.codeLineToNode && !lesson.visualizer?.algorithmOptions
  );
  const conceptSynced = Boolean(lesson.flowchart && lesson.conceptVisualizer?.codeLineToNode);
  const hasAnyViz = Boolean(lesson.visualizer || lesson.conceptVisualizer);
  const showStandaloneFlowchart = Boolean(lesson.flowchart && !syncedFlowchart && !conceptSynced);

  const toc = [
    { id: "overview", label: "Overview" },
    { id: "concept", label: "The idea" },
    hasAnyViz ? { id: "visualize", label: "Watch it run" } : null,
    showStandaloneFlowchart ? { id: "flowchart", label: "Flowchart" } : null,
    { id: "code", label: "Pseudocode & code" },
    { id: "complexity", label: "Complexity" },
    { id: "mistakes", label: "Common mistakes" },
    { id: "recap", label: "Recap" },
    { id: "quiz", label: "Mastery quiz" },
    practice.length ? { id: "practice", label: "Practice" } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <LessonTracker slug={slug} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/learn" className="hover:text-foreground">Learn</Link>
        <ChevronRight className="size-3.5 text-faint" />
        <Link href="/learn" className="hover:text-foreground">{mod?.title}</Link>
      </nav>

      {/* Header */}
      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">Module {mod?.order}</Badge>
            <Badge tone={diffTone[lesson.difficulty]}>{lesson.difficulty}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Clock className="size-3.5" /> {lesson.estMinutes} min
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <CalendarCheck className="size-3.5" /> reviewed {lesson.lastReviewed}
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-2 text-lg text-muted">{lesson.subtitle}</p>
        </div>
        <BookmarkButton id={`lesson:${lesson.slug}`} type="lesson" label={lesson.title} href={`/learn/${lesson.slug}`} />
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
        {/* Main column */}
        <div className="min-w-0 space-y-12">
          {/* Overview */}
          <section id="overview" className="scroll-mt-24 space-y-5">
            <div className="rounded-[var(--radius-lg)] border border-primary/25 bg-primary/8 p-5">
              <p className="text-[15px] leading-7 text-foreground/90">{lesson.hook}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface/50 p-5">
                <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-muted">
                  <Target className="size-4 text-primary-soft" /> You'll be able to
                </h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {lesson.objectives.map((o, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="text-foreground/85">{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-accent/25 bg-accent/8 p-5">
                <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-accent">
                  <span className="text-lg leading-none">{lesson.analogy.emoji}</span> {lesson.analogy.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-foreground/85">{lesson.analogy.body}</p>
              </div>
            </div>
          </section>

          {/* Concept */}
          <section id="concept" className="scroll-mt-24">
            <h2 className="mb-5 font-display text-2xl font-bold">The idea</h2>
            <ContentBlocks blocks={lesson.concept} />
          </section>

          {/* Visualizer */}
          {lesson.visualizer && (
            <section id="visualize" className="scroll-mt-24">
              <h2 className="mb-2 font-display text-2xl font-bold">Watch it run</h2>
              <p className="mb-5 text-muted">
                Drive the trace yourself. Code, data, narration{syncedFlowchart ? ", and the flowchart" : ""} stay in sync.
              </p>
              <LessonVisualizer
                algorithmId={lesson.visualizer.algorithmId}
                algorithmOptions={lesson.visualizer.algorithmOptions}
                initialInput={lesson.visualizer.initialInput}
                flowchart={syncedFlowchart ? lesson.flowchart : undefined}
                codeLineToNode={lesson.visualizer.codeLineToNode}
              />
            </section>
          )}

          {/* Concept visualizer */}
          {lesson.conceptVisualizer && (
            <section id="visualize" className="scroll-mt-24">
              <h2 className="mb-2 font-display text-2xl font-bold">Watch it run</h2>
              <p className="mb-5 text-muted">
                Step through the animation. Code, narration{conceptSynced ? ", and the flowchart" : ""} stay in sync.
              </p>
              <LessonConceptVisualizer
                conceptId={lesson.conceptVisualizer.conceptId}
                flowchart={conceptSynced ? lesson.flowchart : undefined}
                codeLineToNode={lesson.conceptVisualizer.codeLineToNode}
              />
            </section>
          )}

          {/* Standalone flowchart */}
          {showStandaloneFlowchart && lesson.flowchart && (
            <section id="flowchart" className="scroll-mt-24">
              <h2 className="mb-2 font-display text-2xl font-bold">Control flow</h2>
              <p className="mb-5 text-muted">Zoom, pan, and fit the diagram. A text description sits below it.</p>
              <FlowchartPanel spec={lesson.flowchart} />
            </section>
          )}

          {/* Code */}
          <section id="code" className="scroll-mt-24 space-y-6">
            <div>
              <h2 className="mb-3 font-display text-2xl font-bold">Pseudocode</h2>
              <CodeBlock code={lesson.pseudocode} lang="text" />
            </div>
            <div>
              <h2 className="mb-3 font-display text-2xl font-bold">
                {lesson.implementation.language === "cpp" ? "C++ implementation" : "Implementation"}
              </h2>
              <CodeBlock code={lesson.implementation.code} lang={lesson.implementation.language} />
            </div>
          </section>

          {/* Complexity */}
          <section id="complexity" className="scroll-mt-24">
            <h2 className="mb-2 font-display text-2xl font-bold">Complexity</h2>
            <p className="mb-4 text-muted">{lesson.complexity.summary}</p>
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Operation</th>
                    <th className="px-4 py-2.5 font-medium">Time</th>
                    <th className="px-4 py-2.5 font-medium">Space</th>
                    <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lesson.complexity.rows.map((r, i) => (
                    <tr key={i} className="bg-surface/40">
                      <td className="px-4 py-2.5 text-foreground/90">{r.label}</td>
                      <td className="px-4 py-2.5 font-mono text-primary-soft">{r.time}</td>
                      <td className="px-4 py-2.5 font-mono text-secondary">{r.space}</td>
                      <td className="hidden px-4 py-2.5 text-muted sm:table-cell">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mistakes */}
          <section id="mistakes" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold">
              <AlertTriangle className="size-6 text-accent" /> Common mistakes
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {lesson.mistakes.map((m, i) => (
                <div key={i} className="rounded-[var(--radius-lg)] border border-border bg-surface/50 p-4">
                  <p className="font-semibold text-foreground">{m.title}</p>
                  <p className="mt-1 text-sm text-muted">{m.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recap */}
          <section id="recap" className="scroll-mt-24">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold">
              <ListChecks className="size-6 text-success" /> Recap
            </h2>
            <ul className="space-y-2">
              {lesson.recap.map((r, i) => (
                <li key={i} className="flex gap-3 rounded-[var(--radius-md)] border border-border bg-surface/40 px-4 py-2.5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/20 text-xs text-success">✓</span>
                  <span className="text-sm text-foreground/85">{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quiz */}
          <section id="quiz" className="scroll-mt-24">
            <h2 className="mb-2 font-display text-2xl font-bold">Mastery quiz</h2>
            <p className="mb-5 text-muted">Score 80% or more to complete the lesson. Unlimited retries — feedback explains every answer.</p>
            <LessonQuiz
              slug={lesson.slug}
              moduleId={lesson.moduleId}
              questions={lesson.quiz}
              nextHref={next ? `/learn/${next.slug}` : "/learn"}
              nextLabel={next ? `Next: ${next.title}` : "Back to curriculum"}
            />
          </section>

          {/* Practice */}
          {practice.length > 0 && (
            <section id="practice" className="scroll-mt-24">
              <h2 className="mb-2 flex items-center gap-2 font-display text-2xl font-bold">
                <Lightbulb className="size-6 text-accent" /> Practice with purpose
              </h2>
              <p className="mb-5 text-muted">Curated problems that reinforce exactly this concept. Opens in a new tab.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {practice.map((p) => (
                  <PracticeCard key={p.id} item={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky ToC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">On this page</p>
              <nav aria-label="Lesson sections">
                <ul className="space-y-1 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="block rounded-[var(--radius-sm)] px-2 py-1 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            {lesson.companyTags.length > 0 && (
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Seen at</p>
                <div className="flex flex-wrap gap-1.5">
                  {lesson.companyTags.map((t) => (
                    <span key={t} className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted">{t}</span>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-faint">Community-curated · informational only.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
