"use client";

import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, BookOpen, Trophy } from "lucide-react";
import type { PracticeItem } from "@/lib/schema";
import { PATTERN_CATALOG, getPattern } from "@/content/patterns";
import { PRACTICE_ITEMS } from "@/content/practice";
import { useProgress } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { PracticeCard } from "./practice-card";
import { cn } from "@/lib/utils";

interface Group {
  slug: string;
  order: number;
  title: string;
  summary: string;
  difficulty: string;
  easy: PracticeItem[];
  medium: PracticeItem[];
  hard: PracticeItem[];
  all: PracticeItem[];
}

// Precompute pattern → difficulty tiers once (stable, module scope).
const GROUPS: Group[] = PATTERN_CATALOG.map((p) => {
  const items = PRACTICE_ITEMS.filter((x) => x.pattern === p.slug);
  const easy = items.filter((x) => x.difficulty === "easy" || x.difficulty === "intro");
  const medium = items.filter((x) => x.difficulty === "medium");
  const hard = items.filter((x) => x.difficulty === "hard");
  return { ...p, easy, medium, hard, all: [...easy, ...medium, ...hard] };
}).filter((g) => g.all.length > 0);

const TOTAL = GROUPS.reduce((s, g) => s + g.all.length, 0);

function Tier({ label, items, tone }: { label: string; items: PracticeItem[]; tone: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={cn("size-2.5 rounded-full", tone)} />
        <span className="text-sm font-semibold">{label}</span>
        <span className="font-mono text-xs text-faint">{items.length}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <PracticeCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function PatternPractice() {
  const hydrated = useHydrated();
  const practice = useProgress((s) => s.practice);

  const solvedIn = (items: PracticeItem[]) =>
    hydrated ? items.filter((i) => practice[i.id] === "solved").length : 0;

  const totalSolved = hydrated
    ? PRACTICE_ITEMS.filter((i) => practice[i.id] === "solved").length
    : 0;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/40 p-4">
        <span className="grid size-11 place-items-center rounded-[var(--radius-lg)] bg-primary/15 text-primary-soft">
          <Trophy className="size-5" />
        </span>
        <div className="flex-1">
          <p className="font-display font-semibold">Pattern mastery ladder</p>
          <p className="text-sm text-muted">
            Work each pattern from easy to hard. Clearing a pattern end-to-end is how you become
            interview-ready — not by grinding random problems.
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold tabular-nums">
            {totalSolved}
            <span className="text-base text-faint">/{TOTAL}</span>
          </p>
          <p className="text-xs text-muted">solved</p>
        </div>
      </div>

      <Accordion.Root type="multiple" className="space-y-3">
        {GROUPS.map((g) => {
          const authored = Boolean(getPattern(g.slug));
          const solved = solvedIn(g.all);
          const pct = g.all.length ? (solved / g.all.length) * 100 : 0;
          return (
            <Accordion.Item
              key={g.slug}
              value={g.slug}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface/50"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-surface-2">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] bg-surface-2 font-display text-sm font-bold text-primary-soft">
                    {String(g.order).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-semibold">{g.title}</h3>
                      {hydrated && solved === g.all.length && g.all.length > 0 && (
                        <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                          Cleared
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted">{g.summary}</p>
                    <div className="mt-1.5 flex items-center gap-3 font-mono text-[11px] text-faint">
                      {g.easy.length > 0 && <span className="text-success">{g.easy.length} easy</span>}
                      {g.medium.length > 0 && <span className="text-accent">{g.medium.length} med</span>}
                      {g.hard.length > 0 && <span className="text-danger">{g.hard.length} hard</span>}
                    </div>
                  </div>
                  <div className="hidden w-32 shrink-0 sm:block">
                    <div className="mb-1 flex justify-between font-mono text-[11px] text-faint">
                      <span>{hydrated ? solved : 0}/{g.all.length}</span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500" style={{ width: `${hydrated ? pct : 0}%` }} />
                    </div>
                  </div>
                  <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none">
                <div className="space-y-5 border-t border-border p-4">
                  {authored && (
                    <Link
                      href={`/patterns/${g.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft hover:underline"
                    >
                      <BookOpen className="size-4" /> Study the {g.title} pattern first
                    </Link>
                  )}
                  <Tier label="Easy" items={g.easy} tone="bg-success" />
                  <Tier label="Medium" items={g.medium} tone="bg-accent" />
                  <Tier label="Hard" items={g.hard} tone="bg-danger" />
                </div>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </div>
  );
}
