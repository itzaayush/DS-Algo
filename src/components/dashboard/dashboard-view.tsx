"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpenCheck,
  Flame,
  Gamepad2,
  Sparkles,
  Swords,
  Trophy,
  Target,
} from "lucide-react";
import {
  useProgress,
  selectXp,
  selectLevel,
  selectCompletedLessonCount,
} from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { computeModuleViews, recommendedNextLesson } from "@/lib/content";
import { getAchievement, ACHIEVEMENTS } from "@/content/achievements";
import { GAME_LEVELS } from "@/content/adventure";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

function Ring({ pct, label, sub }: { pct: number; label: string; sub: string }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <svg width="108" height="108" viewBox="0 0 108 108" className="-rotate-90">
        <circle cx="54" cy="54" r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth="8" />
        <motion.circle
          cx="54"
          cy="54"
          r={r}
          fill="none"
          stroke="url(#ring-g)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * Math.min(pct, 100)) / 100 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="ring-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <p className="font-display text-3xl font-bold leading-none">{label}</p>
        <p className="mt-1 text-sm text-muted">{sub}</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label, tone }: { icon: typeof Flame; value: number | string; label: string; tone: string }) {
  return (
    <Card className="p-4">
      <span className={`inline-grid size-9 place-items-center rounded-[var(--radius-md)] ${tone}`}>
        <Icon className="size-4.5" />
      </span>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </Card>
  );
}

export function DashboardView() {
  const hydrated = useHydrated();
  const state = useProgress((s) => s);

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-surface-2" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-surface-2" />
          ))}
        </div>
      </div>
    );
  }

  const xp = selectXp(state);
  const { level, pct } = selectLevel(xp);
  const completedLessons = selectCompletedLessonCount(state);
  const completed = new Set(
    Object.entries(state.lessons).filter(([, v]) => v.state === "completed").map(([k]) => k)
  );
  const modules = computeModuleViews(completed);
  const completedModules = modules.filter((m) => m.status === "completed").length;
  const solved = Object.values(state.practice).filter((p) => p === "solved").length;
  const gamesDone = Object.values(state.games).filter((g) => g.state === "completed").length;
  const earned = Object.keys(state.achievements);
  const next = recommendedNextLesson(completed);
  const recentAchievements = earned
    .map((k) => ({ k, at: state.achievements[k] }))
    .sort((a, b) => b.at - a.at)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Resume hero */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-secondary/10 p-6">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {next ? "Pick up where you left off" : "You're all caught up"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">
              {next ? next.title : "Explore the Pattern Lab next"}
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              {next ? next.subtitle : "You've completed the authored lessons — dive into patterns or the Adventure."}
            </p>
            <Link
              href={next ? `/learn/${next.slug}` : "/patterns"}
              className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-soft"
            >
              {next ? "Resume lesson" : "Open Pattern Lab"} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <Card className="flex flex-col justify-center p-6">
          <Ring pct={pct} label={`Lv ${level}`} sub={`${xp} XP · ${pct}% to next level`} />
          <div className="mt-4">
            <ProgressBar value={pct} />
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 text-accent">
              <Flame className="size-4" /> {state.currentStreak} day streak
            </span>
            <span className="text-faint">best {state.longestStreak}</span>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={BookOpenCheck} value={completedLessons} label="Lessons completed" tone="bg-primary/15 text-primary-soft" />
        <Stat icon={Target} value={completedModules} label="Modules mastered" tone="bg-secondary/15 text-secondary" />
        <Stat icon={Swords} value={solved} label="Problems solved" tone="bg-accent/15 text-accent" />
        <Stat icon={Gamepad2} value={gamesDone} label="Levels cleared" tone="bg-success/15 text-success" />
      </div>

      {/* Achievements + shortcuts */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display font-semibold">
              <Trophy className="size-5 text-accent" /> Achievements
            </h3>
            <Link href="/achievements" className="text-sm text-primary-soft hover:underline">
              View all ({earned.length}/{ACHIEVEMENTS.length})
            </Link>
          </div>
          {recentAchievements.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {recentAchievements.map(({ k }) => {
                const def = getAchievement(k);
                if (!def) return null;
                return (
                  <li key={k} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface/50 px-3 py-2">
                    <span className="grid size-8 place-items-center rounded-[var(--radius-sm)] bg-accent/15 text-accent">
                      <def.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{def.title}</p>
                      <p className="text-xs text-faint">{def.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">Complete a lesson to earn your first achievement.</p>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-display font-semibold">
            <Sparkles className="size-5 text-primary-soft" /> Jump back in
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { href: "/learn", label: "Curriculum", icon: BookOpenCheck },
              { href: "/patterns", label: "Pattern Lab", icon: Target },
              { href: "/practice", label: "Practice", icon: Swords },
              { href: "/adventure", label: "Adventure", icon: Gamepad2 },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface/50 px-3 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-surface-2"
              >
                <l.icon className="size-4 text-primary-soft" /> {l.label}
              </Link>
            ))}
          </div>
          {state.bookmarks.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">Recent bookmarks</p>
              <ul className="space-y-1.5">
                {state.bookmarks.slice(0, 3).map((b) => (
                  <li key={b.id}>
                    <Link href={b.href} className="flex items-center justify-between rounded-[var(--radius-sm)] px-2 py-1 text-sm text-muted hover:bg-surface-2 hover:text-foreground">
                      <span className="truncate">{b.label}</span>
                      <span className="ml-2 shrink-0 text-[10px] uppercase text-faint">{b.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
