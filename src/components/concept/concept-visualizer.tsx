"use client";

import { useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { Code2, ListOrdered, Sparkles, Workflow } from "lucide-react";
import { getConcept } from "@/lib/concept/registry";
import { useStepPlayer } from "@/hooks/use-step-player";
import type { FlowchartSpec } from "@/lib/schema";
import { SceneView } from "./concept-scenes";
import { PlayerControls } from "./player-controls";
import { CodeTrace } from "@/components/visualizer/code-trace";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const AlgorithmFlowchart = dynamic(
  () => import("@/components/flowchart/algorithm-flowchart").then((m) => m.AlgorithmFlowchart),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[420px] w-full place-items-center rounded-[var(--radius-lg)] border border-border bg-[#0a0e17] text-sm text-muted">
        Loading flowchart…
      </div>
    ),
  }
);

interface Props {
  conceptId: string;
  flowchart?: FlowchartSpec;
  codeLineToNode?: Record<string, string>;
  onReachEnd?: () => void;
  className?: string;
}

export function ConceptVisualizer({ conceptId, flowchart, codeLineToNode, onReachEnd, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mod = getConcept(conceptId);
  const steps = useMemo(() => (mod ? mod.build() : []), [mod]);
  const c = useStepPlayer(steps);

  const reached = useRef(false);
  useEffect(() => {
    reached.current = false;
  }, [steps]);
  useEffect(() => {
    if (c.isLast && c.total > 1 && !reached.current) {
      reached.current = true;
      onReachEnd?.();
    }
  }, [c.isLast, c.total, onReachEnd]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!(el.matches(":hover") || el.contains(document.activeElement))) return;
      if (e.code === "Space") {
        e.preventDefault();
        c.toggle();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        c.next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        c.prev();
      } else if (e.key === "Home") {
        c.restart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [c]);

  if (!mod) return null;
  const step = c.step;

  return (
    <div
      ref={containerRef}
      className={cn(
        "not-prose flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/50 p-4 shadow-2xl sm:p-5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-primary/15 text-primary-soft">
          <Sparkles className="size-4.5" />
        </span>
        <p className="font-display text-sm font-semibold">{mod.name}</p>
      </div>

      <SceneView scene={step.scene} />

      <div className="min-h-[2.75rem] rounded-[var(--radius-md)] border border-border bg-surface-2/60 px-4 py-2.5 text-sm text-foreground" aria-live="polite">
        <span className="mr-2 font-mono text-xs text-secondary">step {c.index}</span>
        {step.narration}
      </div>

      <PlayerControls c={c} counters={step.counters} />

      <Tabs defaultValue="code" className="mt-1">
        <TabsList>
          <TabsTrigger value="code">
            <Code2 className="size-3.5" /> Code
          </TabsTrigger>
          <TabsTrigger value="trace">
            <ListOrdered className="size-3.5" /> Text trace
          </TabsTrigger>
          {flowchart && (
            <TabsTrigger value="flow">
              <Workflow className="size-3.5" /> Flowchart
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="code" className="mt-3">
          <CodeTrace code={mod.code} activeLine={step.codeLine} className="max-h-64" />
        </TabsContent>

        <TabsContent value="trace" className="mt-3">
          <ol className="max-h-72 space-y-1 overflow-auto pr-1" aria-label="Step-by-step text trace">
            {steps.map((s, i) => (
              <li key={i}>
                <button
                  onClick={() => c.seek(i)}
                  aria-current={i === c.index ? "step" : undefined}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left text-sm transition-colors",
                    i === c.index ? "bg-primary/15 text-foreground ring-1 ring-primary/40" : "text-muted hover:bg-surface-2 hover:text-foreground"
                  )}
                >
                  <span className="mt-0.5 font-mono text-[10px] text-faint tabular-nums">{String(i).padStart(2, "0")}</span>
                  <span>{s.narration}</span>
                </button>
              </li>
            ))}
          </ol>
        </TabsContent>

        {flowchart && (
          <TabsContent value="flow" className="mt-3">
            <AlgorithmFlowchart spec={flowchart} activeNodeId={codeLineToNode?.[String(step.codeLine)] ?? null} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
