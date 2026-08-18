"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, Dices, Code2, ListOrdered, Sparkles, SlidersHorizontal, Workflow } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithms";
import { useVisualizer } from "@/hooks/use-visualizer";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { makeSampleArray } from "@/lib/utils";
import type { FlowchartSpec } from "@/lib/schema";
import { VisualizerCanvas } from "./visualizer-canvas";
import { VisualizerControls } from "./visualizer-controls";
import { CodeTrace } from "./code-trace";
import { StepTrace } from "./step-trace";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const MIN_LEN = 4;
const MAX_LEN = 14;
const MAX_VALUE = 99;

interface Props {
  algorithmId: string;
  algorithmOptions?: string[];
  initialInput?: number[];
  allowCustomInput?: boolean;
  flowchart?: FlowchartSpec;
  codeLineToNode?: Record<number, string>;
  onReachEnd?: () => void;
  className?: string;
}

export function AlgorithmVisualizer({
  algorithmId,
  algorithmOptions,
  initialInput,
  allowCustomInput = true,
  flowchart,
  codeLineToNode,
  onReachEnd,
  className,
}: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const [algoId, setAlgoId] = useState(algorithmId);
  const algo = getAlgorithm(algoId)!;

  const [input, setInput] = useState<number[]>(
    () => initialInput ?? makeSampleArray(9, 7)
  );
  const [target, setTarget] = useState<number | undefined>(() =>
    algo.usesTarget ? algo.defaultTarget?.(input) : undefined
  );

  const [raw, setRaw] = useState(input.join(", "));
  const [error, setError] = useState<string | null>(null);

  const frames = useMemo(() => algo.run(input, target), [algo, input, target]);
  const maxValue = useMemo(() => Math.max(...input, 1), [input]);
  const c = useVisualizer(frames);

  // Fire onReachEnd once per frame set when the trace completes.
  const reachedEnd = useRef(false);
  useEffect(() => {
    reachedEnd.current = false;
  }, [frames]);
  useEffect(() => {
    if (c.isLast && c.total > 1 && !reachedEnd.current) {
      reachedEnd.current = true;
      onReachEnd?.();
    }
  }, [c.isLast, c.total, onReachEnd]);

  // Keyboard shortcuts, scoped to when this visualizer is hovered or focused.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const engaged = el.matches(":hover") || el.contains(document.activeElement);
      if (!engaged) return;
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

  function switchAlgo(id: string) {
    const next = getAlgorithm(id)!;
    setAlgoId(id);
    setTarget(next.usesTarget ? next.defaultTarget?.(input) : undefined);
    setError(null);
  }

  function applyCustom() {
    const parsed = raw
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map(Number);
    if (parsed.some((x) => !Number.isFinite(x))) {
      setError("Use whole numbers separated by commas, e.g. 7, 3, 9, 1.");
      return;
    }
    if (parsed.length < MIN_LEN || parsed.length > MAX_LEN) {
      setError(`Enter between ${MIN_LEN} and ${MAX_LEN} values so the animation stays readable.`);
      return;
    }
    if (parsed.some((x) => x < 1 || x > MAX_VALUE)) {
      setError(`Each value must be between 1 and ${MAX_VALUE}.`);
      return;
    }
    const clean = parsed.map((x) => Math.round(x));
    setInput(clean);
    if (algo.usesTarget) setTarget(algo.defaultTarget?.(clean));
    setError(null);
  }

  function randomize() {
    const size = 7 + Math.floor(Math.random() * 6);
    const next = makeSampleArray(size, Math.floor(Math.random() * 9999));
    setInput(next);
    setRaw(next.join(", "));
    if (algo.usesTarget) setTarget(algo.defaultTarget?.(next));
    setError(null);
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "not-prose flex flex-col gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/50 p-4 shadow-2xl sm:p-5",
        className
      )}
    >
      {/* Header: algorithm + complexity */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-primary/15 text-primary-soft">
            <Sparkles className="size-4.5" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold leading-tight">{algo.name}</p>
            <p className="font-mono text-[11px] text-faint">
              time {algo.complexity.time} · space {algo.complexity.space}
            </p>
          </div>
        </div>
        {algorithmOptions && algorithmOptions.length > 1 && (
          <div className="flex flex-wrap items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1">
            {algorithmOptions.map((id) => {
              const a = getAlgorithm(id);
              if (!a) return null;
              return (
                <button
                  key={id}
                  onClick={() => switchAlgo(id)}
                  aria-pressed={id === algoId}
                  className={cn(
                    "rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors",
                    id === algoId ? "bg-primary/20 text-primary-soft" : "text-muted hover:text-foreground"
                  )}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Canvas */}
      <VisualizerCanvas frame={c.frame} maxValue={maxValue} reducedMotion={reducedMotion} />

      {/* Narration (announced to screen readers) */}
      <div
        className="min-h-[2.75rem] rounded-[var(--radius-md)] border border-border bg-surface-2/60 px-4 py-2.5 text-sm text-foreground"
        aria-live="polite"
      >
        <span className="mr-2 font-mono text-xs text-secondary">step {c.index}</span>
        {c.frame?.narration}
      </div>

      {/* Controls */}
      <VisualizerControls c={c} />

      {/* Tabs: code / text trace / input */}
      <Tabs defaultValue="code" className="mt-1">
        <TabsList>
          <TabsTrigger value="code">
            <Code2 className="size-3.5" /> Code
          </TabsTrigger>
          <TabsTrigger value="trace">
            <ListOrdered className="size-3.5" /> Text trace
          </TabsTrigger>
          {allowCustomInput && (
            <TabsTrigger value="input">
              <SlidersHorizontal className="size-3.5" /> Input
            </TabsTrigger>
          )}
          {flowchart && (
            <TabsTrigger value="flow">
              <Workflow className="size-3.5" /> Flowchart
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="code" className="mt-3">
          <CodeTrace code={algo.code} activeLine={c.frame?.codeLine ?? 0} className="max-h-64" />
        </TabsContent>

        <TabsContent value="trace" className="mt-3">
          <StepTrace frames={frames} index={c.index} onSeek={c.seek} />
        </TabsContent>

        {allowCustomInput && (
          <TabsContent value="input" className="mt-3">
            <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3">
              <label className="text-xs font-medium text-muted" htmlFor="custom-input">
                Custom array ({MIN_LEN}–{MAX_LEN} values, 1–{MAX_VALUE})
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  id="custom-input"
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCustom()}
                  className="min-w-[220px] flex-1 rounded-[var(--radius-sm)] border border-border-strong bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:border-primary"
                  placeholder="7, 3, 9, 1, 5"
                />
                {algo.usesTarget && (
                  <input
                    aria-label="Search target"
                    type="number"
                    value={target ?? ""}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="w-24 rounded-[var(--radius-sm)] border border-border-strong bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:border-primary"
                    placeholder="target"
                  />
                )}
                <Button variant="secondary" size="sm" onClick={applyCustom}>
                  Apply
                </Button>
                <Button variant="outline" size="sm" onClick={randomize}>
                  <Dices className="size-4" /> Randomize
                </Button>
              </div>
              {error && (
                <p className="flex items-center gap-1.5 text-xs text-danger" role="alert">
                  <AlertCircle className="size-3.5" /> {error}
                </p>
              )}
              {algo.requiresSorted && (
                <Badge tone="accent" className="w-fit">
                  Input is sorted automatically — binary search needs order.
                </Badge>
              )}
            </div>
          </TabsContent>
        )}

        {flowchart && (
          <TabsContent value="flow" className="mt-3">
            <AlgorithmFlowchart
              spec={flowchart}
              activeNodeId={codeLineToNode?.[c.frame?.codeLine ?? 0] ?? null}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
