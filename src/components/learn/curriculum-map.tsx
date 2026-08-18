"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, Lock, Play, Clock, Sparkles, ArrowRight } from "lucide-react";
import { useProgress } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  computeModuleViews,
  blockingPrerequisite,
  recommendedNextLesson,
  type ModuleView,
} from "@/lib/content";
import { getLesson } from "@/content/lessons";
import { getModuleIcon } from "@/lib/module-icons";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

const diffTone = { intro: "muted", easy: "success", medium: "accent", hard: "danger" } as const;

function firstLessonSlug(m: ModuleView) {
  return m.lessonSlugs.find((s) => getLesson(s));
}

export function CurriculumMap() {
  const hydrated = useHydrated();
  const lessons = useProgress((s) => s.lessons);

  const completed = new Set(
    Object.entries(lessons)
      .filter(([, v]) => v.state === "completed")
      .map(([k]) => k)
  );
  const views = computeModuleViews(completed);
  const nextLesson = recommendedNextLesson(completed);

  return (
    <div className="space-y-8">
      {/* Recommended next */}
      {hydrated && nextLesson && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-4 rounded-[var(--radius-xl)] border border-primary/30 bg-gradient-to-br from-primary/15 to-surface p-5 sm:flex-row sm:items-center"
        >
          <span className="grid size-12 place-items-center rounded-[var(--radius-lg)] bg-primary/20 text-primary-soft">
            <Sparkles className="size-6" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Recommended next</p>
            <p className="font-display text-lg font-semibold">{nextLesson.title}</p>
          </div>
          <Link
            href={`/learn/${nextLesson.slug}`}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-soft"
          >
            Continue <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      )}

      {/* Timeline */}
      <ol className="relative ml-3 space-y-4 border-l border-border pl-7">
        {views.map((m, i) => {
          const Icon = getModuleIcon(m.icon);
          const slug = firstLessonSlug(m);
          const locked = hydrated && m.status === "locked";
          const completedModule = hydrated && m.status === "completed";
          const current = hydrated && m.status === "current";
          const blocker = locked ? blockingPrerequisite(m, completed) : null;
          const clickable = !locked && Boolean(slug);

          const nodeColor = !hydrated
            ? "bg-surface-3 border-border-strong"
            : completedModule
              ? "bg-success border-success text-background"
              : current
                ? "bg-primary border-primary text-primary-foreground"
                : locked
                  ? "bg-surface-2 border-border text-faint"
                  : "bg-surface-3 border-border-strong text-muted";

          const cardClass = cn(
            "group block rounded-[var(--radius-lg)] border bg-surface/50 p-5 transition-all",
            current && "border-primary/40 ring-1 ring-primary/30",
            clickable && "hover:-translate-y-0.5 hover:border-primary/40",
            locked && "opacity-70"
          );

          const inner = (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-faint">Module {m.order}</span>
                <Badge tone={diffTone[m.difficulty]}>{m.difficulty}</Badge>
                {current && <Badge tone="primary">Current</Badge>}
                {completedModule && <Badge tone="success">Completed</Badge>}
                {hydrated && !m.authored && !locked && <Badge tone="muted">In production</Badge>}
                <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted">
                  <Clock className="size-3.5" /> {m.estMinutes} min
                </span>
              </div>

              <h3 className="mt-2 font-display text-lg font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted">{m.summary}</p>

              {hydrated && m.authored && m.totalAuthored > 0 && (
                <div className="mt-3 flex items-center gap-3">
                  <ProgressBar value={(m.completedLessons / m.totalAuthored) * 100} className="max-w-xs" />
                  <span className="font-mono text-xs text-faint">
                    {m.completedLessons}/{m.totalAuthored}
                  </span>
                </div>
              )}

              {locked && blocker ? (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-accent">
                  <Lock className="size-3.5" /> Complete <span className="font-medium">{blocker.title}</span> to unlock this module.
                </p>
              ) : clickable ? (
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft">
                  <Play className="size-3.5" /> {completedModule ? "Review" : current ? "Continue" : "Start"} module
                </span>
              ) : (
                hydrated && !m.authored && !locked && (
                  <p className="mt-3 text-sm text-muted">Lessons for this module are being produced.</p>
                )
              )}

              {m.companyTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.companyTags.map((t) => (
                    <span key={t} className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted">{t}</span>
                  ))}
                </div>
              )}
            </>
          );

          return (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="relative"
            >
              <span
                className={cn(
                  "absolute -left-[42px] grid size-8 place-items-center rounded-full border-2",
                  nodeColor
                )}
                aria-hidden
              >
                {completedModule ? <Check className="size-4" /> : locked ? <Lock className="size-3.5" /> : <Icon className="size-4" />}
              </span>

              {clickable && slug ? (
                <Link href={`/learn/${slug}`} className={cardClass}>
                  {inner}
                </Link>
              ) : (
                <div className={cardClass}>{inner}</div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
