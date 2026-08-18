"use client";

import { useState } from "react";
import { Boxes, LayoutList } from "lucide-react";
import { PracticeExplorer } from "./practice-explorer";
import { PatternPractice } from "./pattern-practice";
import { cn } from "@/lib/utils";

export function PracticeSurface() {
  const [view, setView] = useState<"pattern" | "all">("pattern");

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1" role="tablist" aria-label="Practice view">
        <button
          role="tab"
          aria-selected={view === "pattern"}
          onClick={() => setView("pattern")}
          className={cn(
            "inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-3.5 py-1.5 text-sm font-medium transition-colors",
            view === "pattern" ? "bg-primary/20 text-primary-soft" : "text-muted hover:text-foreground"
          )}
        >
          <Boxes className="size-4" /> By pattern
        </button>
        <button
          role="tab"
          aria-selected={view === "all"}
          onClick={() => setView("all")}
          className={cn(
            "inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-3.5 py-1.5 text-sm font-medium transition-colors",
            view === "all" ? "bg-primary/20 text-primary-soft" : "text-muted hover:text-foreground"
          )}
        >
          <LayoutList className="size-4" /> All problems
        </button>
      </div>

      {view === "pattern" ? <PatternPractice /> : <PracticeExplorer />}
    </div>
  );
}
