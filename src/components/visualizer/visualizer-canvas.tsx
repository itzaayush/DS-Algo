"use client";

import { motion } from "motion/react";
import type { CellRole, Frame } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

const roleBar: Record<CellRole, string> = {
  default: "from-surface-3 to-surface-2 border-border-strong",
  compare: "from-compare/40 to-compare/10 border-compare",
  swap: "from-swap/50 to-swap/15 border-swap",
  sorted: "from-sorted/45 to-sorted/10 border-sorted",
  pivot: "from-pivot/50 to-pivot/15 border-pivot",
  pointer: "from-secondary/45 to-secondary/10 border-secondary",
  visited: "from-visited/35 to-visited/10 border-visited",
  active: "from-secondary/55 to-secondary/15 border-secondary",
  min: "from-accent/45 to-accent/10 border-accent",
  key: "from-primary/55 to-primary/15 border-primary",
  window: "from-primary/35 to-primary/10 border-primary",
  found: "from-success/70 to-success/20 border-success",
  discarded: "from-surface to-surface border-border opacity-35",
};

const pointerTone: Record<NonNullable<Frame["pointers"][number]["tone"]>, string> = {
  primary: "bg-primary/20 text-primary-soft border-primary/40",
  secondary: "bg-secondary/20 text-secondary border-secondary/40",
  accent: "bg-accent/20 text-accent border-accent/40",
  danger: "bg-danger/20 text-danger border-danger/40",
};

interface Props {
  frame: Frame;
  maxValue: number;
  reducedMotion?: boolean;
}

export function VisualizerCanvas({ frame, maxValue, reducedMotion }: Props) {
  const n = frame.cells.length;
  const cols = { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` };

  const ariaSummary = `Step: ${frame.narration} Values in order: ${frame.cells
    .map((c) => c.value)
    .join(", ")}.`;

  return (
    <div
      className="relative w-full rounded-[var(--radius-lg)] border border-border bg-[radial-gradient(120%_120%_at_50%_-20%,color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent)] bg-surface/40 p-4 sm:p-6"
      role="img"
      aria-label={ariaSummary}
    >
      {/* Pointer rail */}
      <div className="grid gap-1.5 pb-2" style={cols} aria-hidden>
        {Array.from({ length: n }).map((_, pos) => {
          const here = frame.pointers.filter((p) => p.index === pos);
          return (
            <div key={pos} className="flex min-h-6 flex-col items-center justify-end gap-0.5">
              {here.map((p) => (
                <motion.span
                  key={p.name}
                  layout={!reducedMotion}
                  className={cn(
                    "rounded-[var(--radius-xs)] border px-1.5 py-0.5 font-mono text-[10px] leading-none",
                    pointerTone[p.tone ?? "primary"]
                  )}
                >
                  {p.name}
                </motion.span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bars */}
      <div className="grid items-end gap-1.5 sm:gap-2" style={{ ...cols, height: "min(46vh, 340px)" }}>
        {frame.cells.map((cell, pos) => {
          const role = frame.roles[pos] ?? "default";
          const heightPct = maxValue > 0 ? (cell.value / maxValue) * 100 : 0;
          const emphatic = role === "found" || role === "swap" || role === "active";
          return (
            <motion.div
              key={cell.id}
              layout={!reducedMotion}
              transition={{ type: "spring", stiffness: 500, damping: 34 }}
              className="flex h-full flex-col items-center justify-end"
            >
              <motion.div
                className={cn(
                  "relative w-full rounded-t-[var(--radius-sm)] border border-b-2 bg-gradient-to-b shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]",
                  roleBar[role]
                )}
                style={{ height: `${Math.max(heightPct, 4)}%` }}
                animate={
                  reducedMotion
                    ? undefined
                    : { scale: emphatic ? 1.04 : 1, y: emphatic ? -2 : 0 }
                }
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                <span className="pointer-events-none absolute inset-x-0 top-1.5 mx-auto block text-center font-mono text-[11px] font-semibold text-foreground/90">
                  {cell.value}
                </span>
              </motion.div>
              <span className="mt-1 font-mono text-[10px] text-faint">{pos}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
