"use client";

import { motion } from "motion/react";
import { Check, Lock, Play, Sparkles } from "lucide-react";
import { GAME_LEVELS } from "@/content/adventure";
import { getLesson } from "@/content/lessons";
import { useProgress } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function WorldMap({ onEnter }: { onEnter: (id: string) => void }) {
  const hydrated = useHydrated();
  const lessons = useProgress((s) => s.lessons);
  const games = useProgress((s) => s.games);

  const completed = new Set(
    Object.entries(lessons)
      .filter(([, v]) => v.state === "completed")
      .map(([k]) => k)
  );

  let currentAssigned = false;
  const nodes = GAME_LEVELS.map((lvl) => {
    const unlocked = lvl.playable && (lvl.requiredLesson === null || completed.has(lvl.requiredLesson));
    const done = games[lvl.id]?.state === "completed";
    let status: "completed" | "current" | "available" | "locked";
    if (!hydrated) status = lvl.playable && lvl.requiredLesson === null ? "available" : "locked";
    else if (done) status = "completed";
    else if (!unlocked) status = "locked";
    else if (!currentAssigned) {
      status = "current";
      currentAssigned = true;
    } else status = "available";
    return { ...lvl, status, unlocked };
  });

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface/40 p-6 sm:p-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-40" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />

      <div className="relative">
        <div className="mb-8 flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-success" /> Completed</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-primary" /> Current</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-surface-3 ring-1 ring-border-strong" /> Available</span>
          <span className="flex items-center gap-1.5"><Lock className="size-3 text-faint" /> Locked</span>
        </div>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {nodes.map((n, i) => {
            const clickable = n.status !== "locked" && n.playable;
            return (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => clickable && onEnter(n.id)}
                  disabled={!clickable}
                  className={cn(
                    "group flex h-full w-full flex-col items-start rounded-[var(--radius-lg)] border p-5 text-left transition-all",
                    n.status === "current" && "border-primary/50 bg-primary/8 ring-1 ring-primary/30",
                    n.status === "completed" && "border-success/40 bg-success/8",
                    n.status === "available" && "border-border bg-surface/60 hover:-translate-y-0.5 hover:border-primary/40",
                    n.status === "locked" && "cursor-not-allowed border-border bg-surface/40 opacity-70"
                  )}
                >
                  <div
                    className={cn(
                      "relative grid size-14 place-items-center rounded-full border-2",
                      n.status === "completed" && "border-success bg-success/15 text-success",
                      n.status === "current" && "border-primary bg-primary/15 text-primary-soft",
                      n.status === "available" && "border-border-strong bg-surface-2 text-foreground",
                      n.status === "locked" && "border-border bg-surface-2 text-faint"
                    )}
                    style={n.status === "available" ? { color: n.color } : undefined}
                  >
                    {n.status === "completed" ? (
                      <Check className="size-6" />
                    ) : n.status === "locked" ? (
                      <Lock className="size-5" />
                    ) : (
                      <span className="font-display text-lg font-bold">{i + 1}</span>
                    )}
                    {n.status === "current" && (
                      <span className="absolute -inset-1 -z-10 animate-pulse-glow rounded-full bg-primary/40" aria-hidden />
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-semibold">{n.title}</h3>
                  <p className="mt-1 text-sm text-muted">{n.blurb}</p>

                  <div className="mt-4 w-full">
                    {n.status === "locked" ? (
                      !n.playable ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-faint">
                          <Sparkles className="size-3.5" /> Coming soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-accent">
                          <Lock className="size-3.5" /> Finish {getLesson(n.requiredLesson ?? "")?.title ?? "the required lesson"}
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft">
                        <Play className="size-3.5" /> {n.status === "completed" ? "Replay" : "Enter"} level
                      </span>
                    )}
                  </div>
                </button>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
