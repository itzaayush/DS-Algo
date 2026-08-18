"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, BookOpen, Target, Dumbbell, Sparkles, Trash2 } from "lucide-react";
import { useProgress, type Bookmark as BookmarkT } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

const typeMeta: Record<BookmarkT["type"], { icon: typeof BookOpen; label: string }> = {
  lesson: { icon: BookOpen, label: "Lessons" },
  pattern: { icon: Target, label: "Patterns" },
  practice: { icon: Dumbbell, label: "Practice" },
  visualization: { icon: Sparkles, label: "Visualizations" },
};

const FILTERS = ["all", "lesson", "pattern", "practice", "visualization"] as const;

export function BookmarksView() {
  const hydrated = useHydrated();
  const bookmarks = useProgress((s) => s.bookmarks);
  const toggle = useProgress((s) => s.toggleBookmark);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-surface-2" />;
  }

  const filtered = filter === "all" ? bookmarks : bookmarks.filter((b) => b.type === filter);

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-border bg-surface/40 p-12 text-center">
        <Bookmark className="mx-auto size-8 text-faint" />
        <p className="mt-3 font-medium">No bookmarks yet</p>
        <p className="mt-1 text-sm text-muted">
          Tap the bookmark icon on any lesson, pattern, or practice problem to save it here.
        </p>
        <Link href="/learn" className="mt-4 inline-block text-sm font-medium text-primary-soft hover:underline">
          Browse the curriculum →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f ? "bg-primary/20 text-primary-soft" : "text-muted hover:text-foreground"
            )}
          >
            {f === "all" ? "All" : typeMeta[f].label}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {filtered.map((b) => {
            const meta = typeMeta[b.type];
            return (
              <motion.li
                key={b.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface/50 p-3"
              >
                <span className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-surface-2 text-primary-soft">
                  <meta.icon className="size-4" />
                </span>
                <Link href={b.href} className="min-w-0 flex-1">
                  <p className="truncate font-medium hover:text-primary-soft">{b.label}</p>
                  <p className="text-xs capitalize text-faint">{b.type}</p>
                </Link>
                <button
                  onClick={() => toggle(b)}
                  aria-label={`Remove bookmark ${b.label}`}
                  className="grid size-8 place-items-center rounded-[var(--radius-md)] text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
