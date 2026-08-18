import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Eye, Lightbulb, Puzzle, AlertTriangle, Shuffle, ChevronRight } from "lucide-react";
import { PATTERNS, getPattern } from "@/content/patterns";
import { getModule } from "@/content/curriculum";
import { getPracticeItem } from "@/content/practice";
import type { PracticeItem } from "@/lib/schema";
import { CodeBlock } from "@/components/code-block";
import { LessonVisualizer } from "@/components/lesson/lesson-visualizer";
import { RecognitionCheck } from "@/components/patterns/recognition-check";
import { PracticeCard } from "@/components/practice/practice-card";
import { BookmarkButton } from "@/components/bookmark-button";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPattern(slug);
  if (!p) return { title: "Pattern not found" };
  return { title: p.title, description: p.summary };
}

const diffTone = { intro: "muted", easy: "success", medium: "accent", hard: "danger" } as const;

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pattern = getPattern(slug);
  if (!pattern) notFound();

  const practice = pattern.practiceIds
    .map(getPracticeItem)
    .filter((p): p is PracticeItem => Boolean(p));

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/patterns" className="hover:text-foreground">Pattern Lab</Link>
        <ChevronRight className="size-3.5 text-faint" />
        <span className="text-foreground">{pattern.title}</span>
      </nav>

      <header className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">Pattern {String(pattern.order).padStart(2, "0")}</Badge>
            <Badge tone={diffTone[pattern.difficulty]}>{pattern.difficulty}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Clock className="size-3.5" /> {pattern.estMinutes} min
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{pattern.title}</h1>
          <p className="mt-2 text-lg text-muted">{pattern.summary}</p>
        </div>
        <BookmarkButton id={`pattern:${pattern.slug}`} type="pattern" label={pattern.title} href={`/patterns/${pattern.slug}`} />
      </header>

      <div className="mt-10 space-y-10">
        {/* Recognition signals — think before code */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
            <Eye className="size-5 text-secondary" /> How to recognize it
          </h2>
          <div className="rounded-[var(--radius-lg)] border border-secondary/25 bg-secondary/8 p-5">
            <p className="mb-3 text-sm text-muted">Reach for this pattern when you notice:</p>
            <ul className="space-y-2">
              {pattern.recognitionSignals.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-foreground/90">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary/20 font-mono text-[11px] text-secondary">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Intuition + visual model */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
            <Lightbulb className="size-5 text-accent" /> Intuition
          </h2>
          <p className="text-[15px] leading-7 text-foreground/85">{pattern.intuition}</p>
          <div className="mt-4 rounded-[var(--radius-lg)] border border-border bg-surface/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-faint">Visual model</p>
            <p className="mt-2 text-[15px] leading-7 text-foreground/85">{pattern.visualModel}</p>
          </div>
          {pattern.visualizer && (
            <div className="mt-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
                <Puzzle className="size-5 text-primary-soft" /> Watch the pattern in motion
              </h3>
              <LessonVisualizer algorithmId={pattern.visualizer.algorithmId} />
            </div>
          )}
        </section>

        {/* Recognition check — decide before you see the code (GH-011) */}
        {pattern.recognition && pattern.recognition.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
              <Eye className="size-5 text-secondary" /> Spot the pattern
            </h2>
            <p className="mb-4 text-sm text-muted">Commit to an approach before the template is revealed.</p>
            <RecognitionCheck questions={pattern.recognition} />
          </section>
        )}

        {/* Template — hidden until the learner has thought about it */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
            <Puzzle className="size-5 text-primary-soft" /> The reusable template
          </h2>
          <details className="group rounded-[var(--radius-lg)] border border-border bg-surface/50 p-1">
            <summary className="cursor-pointer rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
              Try to sketch it yourself first — then reveal the template
            </summary>
            <div className="p-3 pt-1">
              <CodeBlock code={pattern.template.code} lang={pattern.template.language} />
              <p className="mt-3 font-mono text-xs text-faint">Complexity: {pattern.complexity}</p>
            </div>
          </details>
        </section>

        {/* Mistakes + variations */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <AlertTriangle className="size-5 text-danger" /> Failure modes
            </h2>
            <ul className="space-y-2">
              {pattern.mistakes.map((m, i) => (
                <li key={i} className="rounded-[var(--radius-md)] border border-border bg-surface/40 px-3 py-2 text-sm text-foreground/85">{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <Shuffle className="size-5 text-secondary" /> Variations
            </h2>
            <ul className="space-y-2">
              {pattern.variations.map((v, i) => (
                <li key={i} className="rounded-[var(--radius-md)] border border-border bg-surface/40 px-3 py-2 text-sm text-foreground/85">{v}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Links */}
        <section className="flex flex-wrap gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Prerequisites</p>
            <div className="flex flex-wrap gap-1.5">
              {pattern.prerequisites.map((pid) => {
                const m = getModule(pid);
                return (
                  <Link key={pid} href="/learn" className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted transition-colors hover:text-foreground">
                    {m?.title ?? pid}
                  </Link>
                );
              })}
            </div>
          </div>
          {pattern.relatedPatterns.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Related patterns</p>
              <div className="flex flex-wrap gap-1.5">
                {pattern.relatedPatterns.map((rp) => {
                  const authored = Boolean(getPattern(rp));
                  return authored ? (
                    <Link key={rp} href={`/patterns/${rp}`} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary-soft transition-colors hover:bg-primary/20">
                      {getPattern(rp)?.title}
                    </Link>
                  ) : (
                    <span key={rp} className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-faint">{rp}</span>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Practice ladder */}
        {practice.length > 0 && (
          <section>
            <h2 className="mb-2 font-display text-xl font-bold">Practice ladder</h2>
            <p className="mb-5 text-sm text-muted">Work these in order — from recognizing the pattern to applying it under pressure.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {practice.map((p) => (
                <PracticeCard key={p.id} item={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
