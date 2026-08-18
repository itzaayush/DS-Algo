"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Boxes,
  LayoutGrid,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Trophy,
} from "lucide-react";
import type { GameLevel } from "@/content/adventure";
import { useSortGame } from "@/hooks/use-sort-game";
import { useProgress } from "@/store/progress-store";
import { SortTowers2D } from "./sort-towers-2d";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SortTowers3D = dynamic(() => import("./sort-towers-3d").then((m) => m.SortTowers3D), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[340px] place-items-center rounded-[var(--radius-lg)] border border-border bg-[#080b12] text-sm text-muted">
      Loading 3D scene…
    </div>
  ),
});

export function LevelView({
  level,
  webglOk,
  reducedMotion,
  onExit,
}: {
  level: GameLevel;
  webglOk: boolean;
  reducedMotion: boolean;
  onExit: () => void;
}) {
  const game = useSortGame(level.values);
  const [mode, setMode] = useState<"3d" | "2d">(webglOk ? "3d" : "2d");
  const [paused, setPaused] = useState(false);
  const recorded = useRef(false);

  const completeGameLevel = useProgress((s) => s.completeGameLevel);
  const award = useProgress((s) => s.awardAchievement);
  const recordActivity = useProgress((s) => s.recordActivity);

  useEffect(() => {
    if (game.isSorted && !recorded.current) {
      recorded.current = true;
      completeGameLevel(level.id, game.score);
      award("first-game");
      recordActivity();
    }
    if (!game.isSorted) recorded.current = false;
  }, [game.isSorted, game.score, level.id, completeGameLevel, award, recordActivity]);

  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-surface/40 p-4 shadow-2xl sm:p-5">
      {/* HUD */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="subtle" size="sm" onClick={onExit}>
            <ArrowLeft className="size-4" /> Map
          </Button>
          <div>
            <p className="font-display text-sm font-semibold leading-tight">{level.title}</p>
            <p className="font-mono text-[11px] text-faint">{level.world} · make heights ascend →</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1 text-muted">
            moves <span className="text-foreground tabular-nums">{game.moves}</span>
          </span>
          {game.isSorted && (
            <span className="rounded-[var(--radius-sm)] border border-success/40 bg-success/10 px-2 py-1 text-success">
              score <span className="tabular-nums">{game.score}</span>
            </span>
          )}
        </div>
      </div>

      {/* Stage */}
      <div className="relative h-[52vh] min-h-[360px] w-full">
        {mode === "3d" && webglOk ? (
          <SortTowers3D game={game} color={level.color} reducedMotion={reducedMotion} />
        ) : (
          <SortTowers2D game={game} color={level.color} />
        )}

        {/* Pause overlay */}
        <AnimatePresence>
          {paused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 grid place-items-center rounded-[var(--radius-lg)] bg-background/75 backdrop-blur-sm"
            >
              <div className="text-center">
                <p className="font-display text-xl font-semibold">Paused</p>
                <div className="mt-4 flex items-center gap-2">
                  <Button onClick={() => setPaused(false)}>
                    <Play className="size-4" /> Resume
                  </Button>
                  <Button variant="outline" onClick={onExit}>
                    Exit to map
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay */}
        <AnimatePresence>
          {game.isSorted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-x-0 bottom-0 z-20 m-3 flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-success/40 bg-surface-2/95 p-4 backdrop-blur sm:flex-row sm:items-center"
            >
              <span className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-success/20 text-success">
                <Trophy className="size-6" />
              </span>
              <div className="flex-1">
                <p className="font-display font-semibold">Level complete — {game.score} points!</p>
                <p className="text-sm text-muted">Solved in {game.moves} moves. Progress saved.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={game.shuffle}>
                  <Shuffle className="size-4" /> Play again
                </Button>
                <Button size="sm" onClick={onExit}>
                  Back to map
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button variant="subtle" size="sm" onClick={() => setPaused((p) => !p)}>
            <Pause className="size-4" /> Pause
          </Button>
          <Button variant="subtle" size="sm" onClick={() => game.reset()}>
            <RotateCcw className="size-4" /> Restart
          </Button>
          <Button variant="subtle" size="sm" onClick={game.shuffle}>
            <Shuffle className="size-4" /> Shuffle
          </Button>
          <Button variant="subtle" size="sm" onClick={game.hint}>
            <Lightbulb className="size-4" /> Hint
          </Button>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
          <button
            onClick={() => webglOk && setMode("3d")}
            disabled={!webglOk}
            aria-pressed={mode === "3d"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-40",
              mode === "3d" ? "bg-primary/20 text-primary-soft" : "text-muted hover:text-foreground"
            )}
          >
            <Boxes className="size-3.5" /> 3D
          </button>
          <button
            onClick={() => setMode("2d")}
            aria-pressed={mode === "2d"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors",
              mode === "2d" ? "bg-primary/20 text-primary-soft" : "text-muted hover:text-foreground"
            )}
          >
            <LayoutGrid className="size-3.5" /> 2D
          </button>
        </div>
      </div>

      {!webglOk && (
        <p className="mt-2 text-xs text-accent">
          WebGL isn't available here, so we've loaded the 2D version — it grants the same completion credit.
        </p>
      )}
    </div>
  );
}
