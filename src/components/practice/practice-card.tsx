"use client";

import { ExternalLink, Lightbulb } from "lucide-react";
import type { PracticeItem, Difficulty } from "@/lib/schema";
import { useProgress, type PracticeState } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/bookmark-button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const diffTone: Record<Difficulty, Parameters<typeof Badge>[0]["tone"]> = {
  intro: "muted",
  easy: "success",
  medium: "accent",
  hard: "danger",
};

const STATUS: { value: PracticeState; label: string }[] = [
  { value: "not-started", label: "Not started" },
  { value: "attempted", label: "Attempted" },
  { value: "solved", label: "Solved" },
  { value: "revisit", label: "Revisit" },
];

const statusColor: Record<PracticeState, string> = {
  "not-started": "border-border text-muted",
  attempted: "border-accent/40 text-accent",
  solved: "border-success/40 text-success",
  revisit: "border-secondary/40 text-secondary",
};

export function PracticeCard({ item }: { item: PracticeItem }) {
  const hydrated = useHydrated();
  const status = useProgress((s) => s.practice[item.id] ?? "not-started");
  const setStatus = useProgress((s) => s.setPracticeStatus);
  const award = useProgress((s) => s.awardAchievement);

  function onChange(next: PracticeState) {
    setStatus(item.id, next);
    if (next === "solved") award("first-solve");
  }

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={item.platform === "leetcode" ? "accent" : "secondary"}>
              {item.platform === "leetcode" ? "LeetCode" : "Codeforces"}
            </Badge>
            <Badge tone={diffTone[item.difficulty]}>{item.difficulty}</Badge>
          </div>
          <h3 className="mt-2 truncate font-semibold text-foreground">{item.title}</h3>
          <p className="mt-0.5 font-mono text-xs text-faint">
            {item.topic}
            {item.pattern ? ` · ${item.pattern}` : ""} · ~{item.estMinutes} min
          </p>
        </div>
        <BookmarkButton
          id={`practice:${item.id}`}
          type="practice"
          label={item.title}
          href="/practice"
        />
      </div>

      {/* Spoiler-free hint */}
      <details className="group rounded-[var(--radius-md)] border border-border bg-surface/50 px-3 py-2">
        <summary className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-foreground">
          <Lightbulb className="size-4 text-accent" /> Show a spoiler-free hint
        </summary>
        <p className="mt-2 text-sm text-foreground/80">{item.hint}</p>
      </details>

      {/* Company tags */}
      {item.companyTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Tooltip content={`Community-curated · updated ${item.freshness}. Informational, not an official hiring forecast.`}>
            <span className="cursor-help text-xs text-faint underline decoration-dotted">tags</span>
          </Tooltip>
          {item.companyTags.map((t) => (
            <span key={t} className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2">
        {/* Status */}
        <label className="sr-only" htmlFor={`status-${item.id}`}>
          Practice status for {item.title}
        </label>
        <select
          id={`status-${item.id}`}
          value={hydrated ? status : "not-started"}
          onChange={(e) => onChange(e.target.value as PracticeState)}
          className={cn(
            "rounded-[var(--radius-sm)] border bg-surface px-2.5 py-1.5 text-sm outline-none focus-visible:border-primary",
            statusColor[hydrated ? status : "not-started"]
          )}
        >
          {STATUS.map((s) => (
            <option key={s.value} value={s.value} className="bg-surface text-foreground">
              {s.label}
            </option>
          ))}
        </select>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-surface-2 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-3"
        >
          Open on {item.platform === "leetcode" ? "LeetCode" : "Codeforces"}
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}
