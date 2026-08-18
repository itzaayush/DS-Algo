"use client";

import { motion } from "motion/react";
import type { SortGame } from "@/hooks/use-sort-game";
import { cn } from "@/lib/utils";

export function SortTowers2D({ game, color }: { game: SortGame; color: string }) {
  const max = Math.max(...game.values, 1);
  return (
    <div className="flex h-full min-h-[340px] w-full items-end justify-center gap-2 rounded-[var(--radius-lg)] border border-border bg-[radial-gradient(120%_120%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_10%,transparent),transparent)] bg-surface/40 p-4 sm:gap-3 sm:p-6">
      {game.values.map((v, i) => {
        const selected = game.selected === i;
        const hint = game.hintPair?.includes(i);
        const sorted = game.isSorted;
        const heightPct = (v / max) * 100;
        return (
          <button
            key={i}
            onClick={() => game.select(i)}
            aria-label={`Tower ${i + 1}, height ${v}${selected ? ", selected" : ""}`}
            aria-pressed={selected}
            className="group flex h-full flex-1 flex-col items-center justify-end"
            style={{ maxWidth: 72 }}
          >
            <span className="mb-1 font-mono text-xs font-semibold text-foreground/90">{v}</span>
            <motion.span
              layout
              animate={{ height: `${Math.max(heightPct, 6)}%` }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={cn(
                "w-full rounded-t-[var(--radius-sm)] border border-b-2 transition-colors",
                sorted
                  ? "border-success bg-gradient-to-b from-success/70 to-success/20"
                  : selected
                    ? "border-white bg-gradient-to-b from-white/80 to-white/20"
                    : hint
                      ? "border-accent bg-gradient-to-b from-accent/60 to-accent/15"
                      : "border-border-strong bg-gradient-to-b from-surface-3 to-surface-2 group-hover:from-primary/40 group-hover:to-primary/10"
              )}
              style={!sorted && !selected && !hint ? { borderColor: color } : undefined}
            />
            <span className="mt-1 font-mono text-[10px] text-faint">{i}</span>
          </button>
        );
      })}
    </div>
  );
}
