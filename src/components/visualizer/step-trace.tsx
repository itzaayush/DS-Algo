"use client";

import { useEffect, useRef } from "react";
import type { Frame } from "@/lib/algorithms/types";
import { cn } from "@/lib/utils";

interface Props {
  frames: Frame[];
  index: number;
  onSeek: (i: number) => void;
}

/** Text-based equivalent of the visual trace (accessibility + skim view). */
export function StepTrace({ frames, index, onSeek }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [index]);

  return (
    <ol className="max-h-72 space-y-1 overflow-auto pr-1" aria-label="Step-by-step text trace">
      {frames.map((f, i) => {
        const active = i === index;
        return (
          <li key={i}>
            <button
              ref={active ? activeRef : undefined}
              onClick={() => onSeek(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex w-full items-start gap-2 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left text-sm transition-colors",
                active
                  ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <span className="mt-0.5 font-mono text-[10px] text-faint tabular-nums">{String(i).padStart(2, "0")}</span>
              <span>{f.narration}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
