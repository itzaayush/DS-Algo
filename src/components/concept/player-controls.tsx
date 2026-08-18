"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { StepController } from "@/hooks/use-step-player";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SPEEDS = [0.5, 1, 1.5, 2, 3];

export function PlayerControls<T>({
  c,
  counters,
}: {
  c: StepController<T>;
  counters?: Record<string, number>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted tabular-nums">
          {String(c.index).padStart(2, "0")}
          <span className="text-faint">/{String(Math.max(c.total - 1, 0)).padStart(2, "0")}</span>
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(c.total - 1, 0)}
          value={c.index}
          onChange={(e) => c.seek(Number(e.target.value))}
          aria-label="Scrub step"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-3 accent-primary [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Tooltip content="Restart">
            <Button variant="subtle" size="icon" onClick={c.restart} aria-label="Restart">
              <RotateCcw className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Previous step">
            <Button variant="subtle" size="icon" onClick={c.prev} disabled={c.isFirst} aria-label="Previous step">
              <SkipBack className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip content={c.playing ? "Pause" : "Play"}>
            <Button size="icon" onClick={c.toggle} aria-label={c.playing ? "Pause" : "Play"} className="size-11">
              {c.playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </Button>
          </Tooltip>
          <Tooltip content="Next step">
            <Button variant="subtle" size="icon" onClick={c.next} disabled={c.isLast} aria-label="Next step">
              <SkipForward className="size-4" />
            </Button>
          </Tooltip>
        </div>

        <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1" role="group" aria-label="Playback speed">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => c.setSpeed(s)}
              aria-pressed={c.speed === s}
              className={cn(
                "rounded-[var(--radius-sm)] px-2 py-1 font-mono text-xs transition-colors",
                c.speed === s ? "bg-primary/20 text-primary-soft" : "text-muted hover:text-foreground"
              )}
            >
              {s}×
            </button>
          ))}
        </div>

        {counters && (
          <div className="flex items-center gap-2 font-mono text-xs">
            {Object.entries(counters).map(([k, v]) => (
              <span key={k} className="rounded-[var(--radius-sm)] border border-border bg-surface px-2 py-1 text-muted">
                {k}: <span className="text-foreground tabular-nums">{v}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
