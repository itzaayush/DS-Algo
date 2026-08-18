"use client";

import { useEffect } from "react";
import { useProgress } from "@/store/progress-store";

/** Marks a lesson as in-progress on view and counts activity toward the streak. */
export function LessonTracker({ slug }: { slug: string }) {
  const setLessonProgress = useProgress((s) => s.setLessonProgress);
  const recordActivity = useProgress((s) => s.recordActivity);

  useEffect(() => {
    const current = useProgress.getState().lessons[slug];
    if (current?.state !== "completed") {
      setLessonProgress(slug, { state: "in-progress", percent: Math.max(current?.percent ?? 0, 15) });
    }
    recordActivity();
  }, [slug, setLessonProgress, recordActivity]);

  return null;
}
