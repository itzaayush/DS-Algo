"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { PartyPopper, ArrowRight } from "lucide-react";
import type { QuizQuestion } from "@/lib/schema";
import { Quiz } from "./quiz";
import { useProgress, selectXp, selectLevel } from "@/store/progress-store";

interface Props {
  slug: string;
  moduleId: string;
  questions: QuizQuestion[];
  nextHref: string;
  nextLabel: string;
}

export function LessonQuiz({ slug, moduleId, questions, nextHref, nextLabel }: Props) {
  const [done, setDone] = useState(false);
  const completeLesson = useProgress((s) => s.completeLesson);
  const award = useProgress((s) => s.awardAchievement);
  const recordActivity = useProgress((s) => s.recordActivity);

  function handlePass(scorePct: number) {
    completeLesson(slug, scorePct);
    recordActivity();
    award("first-lesson");
    if (scorePct === 100) award("mastery-ace");
    if (moduleId === "arrays") award("arrays-complete");
    // Level-based achievement, computed from fresh state.
    const level = selectLevel(selectXp(useProgress.getState())).level;
    if (level >= 5) award("level-5");
    setDone(true);
  }

  return (
    <div className="space-y-5">
      <Quiz questions={questions} onPass={handlePass} />

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-success/40 bg-success/10 p-5 sm:flex-row sm:items-center"
        >
          <span className="grid size-12 place-items-center rounded-[var(--radius-lg)] bg-success/20 text-success">
            <PartyPopper className="size-6" />
          </span>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold">Lesson complete — progress saved.</p>
            <p className="text-sm text-muted">
              Your streak, XP, and any unlocked achievements just updated. Keep the momentum going.
            </p>
          </div>
          <Link
            href={nextHref}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-soft"
          >
            {nextLabel} <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
