"use client";

import { Bookmark } from "lucide-react";
import { useProgress, type Bookmark as BookmarkType } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

type Props = Omit<BookmarkType, "createdAt"> & { className?: string };

export function BookmarkButton({ id, type, label, href, className }: Props) {
  const hydrated = useHydrated();
  const active = useProgress((s) => s.bookmarks.some((b) => b.id === id));
  const toggle = useProgress((s) => s.toggleBookmark);
  const award = useProgress((s) => s.awardAchievement);

  const on = hydrated && active;

  return (
    <button
      onClick={() => {
        toggle({ id, type, label, href });
        award("first-bookmark");
      }}
      aria-pressed={on}
      aria-label={on ? `Remove bookmark: ${label}` : `Bookmark: ${label}`}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] border transition-colors",
        on
          ? "border-accent/40 bg-accent/15 text-accent"
          : "border-border bg-surface text-muted hover:text-foreground",
        className
      )}
    >
      <Bookmark className={cn("size-4", on && "fill-current")} />
    </button>
  );
}
