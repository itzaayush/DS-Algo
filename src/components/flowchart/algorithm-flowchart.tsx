"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import type { FlowchartSpec } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface FlowNodeData extends Record<string, unknown> {
  label: string;
  kind: "start" | "process" | "decision" | "io" | "end";
  active?: boolean;
}

const kindStyles: Record<FlowNodeData["kind"], string> = {
  start: "rounded-full border-success/60 bg-success/15 text-success",
  end: "rounded-full border-danger/60 bg-danger/15 text-danger",
  process: "rounded-[var(--radius-md)] border-border-strong bg-surface-2 text-foreground",
  decision: "border-accent/60 bg-accent/12 text-accent",
  io: "border-secondary/60 bg-secondary/12 text-secondary",
};

function FlowNodeView({ data }: NodeProps) {
  const d = data as FlowNodeData;
  const isDecision = d.kind === "decision";
  return (
    <div
      className={cn(
        "relative grid min-h-11 min-w-36 place-items-center border-2 px-4 py-2 text-center text-xs font-medium shadow-lg transition-all",
        kindStyles[d.kind],
        d.kind === "io" && "[clip-path:polygon(12%_0,100%_0,88%_100%,0_100%)]",
        d.active && "ring-2 ring-secondary ring-offset-2 ring-offset-background scale-105 shadow-[0_0_28px_-6px_var(--color-secondary)]"
      )}
      style={isDecision ? { minWidth: 150, minHeight: 84 } : undefined}
    >
      {isDecision && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 m-auto rotate-45 rounded-[10px] border-2 border-accent/60 bg-accent/12",
            d.active && "border-secondary"
          )}
          style={{ width: 84, height: 84 }}
        />
      )}
      <span className="relative z-10 max-w-[8.5rem] leading-tight">{d.label}</span>
      <Handle type="target" position={Position.Top} className="!size-2 !border-none !bg-border-strong" />
      <Handle type="source" position={Position.Bottom} className="!size-2 !border-none !bg-border-strong" />
      <Handle id="yes" type="source" position={Position.Right} className="!size-2 !border-none !bg-accent" />
      <Handle id="loop-in" type="target" position={Position.Left} className="!size-2 !border-none !bg-border-strong" />
    </div>
  );
}

const nodeTypes = { flow: FlowNodeView };

interface Props {
  spec: FlowchartSpec;
  activeNodeId?: string | null;
  className?: string;
}

export function AlgorithmFlowchart({ spec, activeNodeId, className }: Props) {
  const nodes: Node[] = useMemo(
    () =>
      spec.nodes.map((n) => ({
        id: n.id,
        type: "flow",
        position: { x: n.x, y: n.y },
        data: { label: n.label, kind: n.kind, active: n.id === activeNodeId },
        draggable: false,
      })),
    [spec, activeNodeId]
  );

  const edges: Edge[] = useMemo(
    () =>
      spec.edges.map((e) => ({
        id: e.id,
        source: e.from,
        target: e.to,
        sourceHandle: e.sourceHandle === "yes" ? "yes" : undefined,
        targetHandle: e.sourceHandle === "loop" ? "loop-in" : undefined,
        label: e.label,
        type: "smoothstep",
        animated: e.from === activeNodeId,
        labelBgStyle: { fill: "#161d2e" },
        labelStyle: { fill: "#9aa6bf", fontSize: 11, fontFamily: "var(--font-mono)" },
        style: {
          stroke: e.from === activeNodeId ? "var(--color-secondary)" : "var(--color-border-strong)",
          strokeWidth: e.from === activeNodeId ? 2.5 : 1.5,
        },
      })),
    [spec, activeNodeId]
  );

  return (
    <div className={cn("relative", className)}>
      <div className="h-[420px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[#0a0e17]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          minZoom={0.4}
          maxZoom={1.6}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#26314d" />
          <Controls showInteractive={false} className="!border-border !bg-surface-2 [&_button]:!border-border [&_button]:!bg-surface-2 [&_button]:!fill-muted" />
        </ReactFlow>
      </div>

      {/* Structured text fallback (GH-008) */}
      <details className="mt-2 rounded-[var(--radius-md)] border border-border bg-surface/60 p-3 text-sm">
        <summary className="cursor-pointer text-muted hover:text-foreground">Text description of this flowchart</summary>
        <ol className="mt-2 space-y-1 pl-5 text-muted [list-style:decimal]">
          {spec.nodes.map((n) => {
            const outs = spec.edges.filter((e) => e.from === n.id);
            return (
              <li key={n.id} className={n.id === activeNodeId ? "text-secondary" : undefined}>
                <span className="font-medium text-foreground">{n.label}</span>
                {outs.length > 0 && (
                  <span>
                    {" → "}
                    {outs
                      .map((e) => {
                        const to = spec.nodes.find((x) => x.id === e.to);
                        return `${e.label ? `${e.label}: ` : ""}${to?.label ?? e.to}`;
                      })
                      .join("; ")}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}
