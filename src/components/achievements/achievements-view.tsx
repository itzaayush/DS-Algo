"use client";

import { motion } from "motion/react";
import { Lock, HelpCircle } from "lucide-react";
import { ACHIEVEMENTS } from "@/content/achievements";
import { useProgress } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

const toneRing = {
  primary: "border-primary/40 bg-primary/10 text-primary-soft",
  secondary: "border-secondary/40 bg-secondary/10 text-secondary",
  accent: "border-accent/40 bg-accent/10 text-accent",
  success: "border-success/40 bg-success/10 text-success",
} as const;

export function AchievementsView() {
  const hydrated = useHydrated();
  const achievements = useProgress((s) => s.achievements);

  const earnedCount = hydrated ? Object.keys(achievements).length : 0;
  const totalPoints = ACHIEVEMENTS.filter((a) => hydrated && achievements[a.key]).reduce((s, a) => s + a.points, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <span className="rounded-[var(--radius-md)] border border-border bg-surface px-3 py-1.5 text-sm">
          <span className="font-display text-lg font-bold text-foreground">{earnedCount}</span>
          <span className="text-muted"> / {ACHIEVEMENTS.length} earned</span>
        </span>
        <span className="rounded-[var(--radius-md)] border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm text-accent">
          {totalPoints} achievement points
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a, i) => {
          const earned = hydrated && Boolean(achievements[a.key]);
          const secret = a.hidden && !earned;
          const date = earned ? new Date(achievements[a.key]).toLocaleDateString() : null;
          return (
            <motion.div
              key={a.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className={cn(
                "flex gap-4 rounded-[var(--radius-lg)] border p-4 transition-colors",
                earned ? "border-border bg-surface/60" : "border-border bg-surface/30 opacity-80"
              )}
            >
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-[var(--radius-lg)] border",
                  earned ? toneRing[a.tone] : "border-border bg-surface-2 text-faint"
                )}
              >
                {secret ? <HelpCircle className="size-6" /> : earned ? <a.icon className="size-6" /> : <Lock className="size-5" />}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold">{secret ? "Secret achievement" : a.title}</h3>
                  <span className="ml-auto shrink-0 font-mono text-xs text-faint">+{a.points}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted">
                  {secret ? "Keep exploring to reveal this one." : a.description}
                </p>
                {date && <p className="mt-1 text-xs text-success">Earned {date}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
