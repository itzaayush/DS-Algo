"use client";

import { motion } from "motion/react";
import type { CellState, Scene, AuxPanel } from "@/lib/concept/types";
import { cn } from "@/lib/utils";

/* ---- Shared palettes ---- */

const NODE: Record<CellState, { fill: string; stroke: string }> = {
  default: { fill: "color-mix(in oklab, var(--color-surface-3) 92%, transparent)", stroke: "var(--color-border-strong)" },
  active: { fill: "color-mix(in oklab, var(--color-secondary) 32%, transparent)", stroke: "var(--color-secondary)" },
  visited: { fill: "color-mix(in oklab, var(--color-visited) 26%, transparent)", stroke: "var(--color-visited)" },
  current: { fill: "color-mix(in oklab, var(--color-primary) 40%, transparent)", stroke: "var(--color-primary)" },
  done: { fill: "color-mix(in oklab, var(--color-success) 34%, transparent)", stroke: "var(--color-success)" },
  compare: { fill: "color-mix(in oklab, var(--color-compare) 30%, transparent)", stroke: "var(--color-compare)" },
  target: { fill: "color-mix(in oklab, var(--color-accent) 30%, transparent)", stroke: "var(--color-accent)" },
  muted: { fill: "var(--color-surface)", stroke: "var(--color-border)" },
};

const BOX: Record<CellState, string> = {
  default: "border-border-strong bg-surface-3 text-foreground",
  active: "border-secondary bg-secondary/25 text-foreground",
  visited: "border-visited bg-visited/20 text-foreground",
  current: "border-primary bg-primary/30 text-foreground",
  done: "border-success bg-success/25 text-foreground",
  compare: "border-compare bg-compare/25 text-foreground",
  target: "border-accent bg-accent/25 text-foreground",
  muted: "border-border bg-surface text-faint opacity-50",
};

const edgeStroke = (s?: string) =>
  s === "active" ? "var(--color-secondary)" : s === "tree" ? "var(--color-success)" : s === "muted" ? "var(--color-border)" : "var(--color-border-strong)";

const labelTone: Record<string, string> = {
  primary: "fill-[color:var(--color-primary-soft)]",
  secondary: "fill-[color:var(--color-secondary)]",
  accent: "fill-[color:var(--color-accent)]",
  danger: "fill-[color:var(--color-danger)]",
};

function AuxPanelView({ aux }: { aux: AuxPanel }) {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface/60 px-3 py-2">
      <span className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-faint">{aux.label}</span>
      <div className={cn("flex flex-wrap gap-1.5", aux.orientation === "vertical" && "flex-col")}>
        {aux.items.length === 0 && <span className="text-xs text-faint">empty</span>}
        {aux.items.map((it) => (
          <motion.span
            key={it.id}
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn("grid h-7 min-w-7 place-items-center rounded-[var(--radius-sm)] border px-2 font-mono text-xs", BOX[it.state ?? "default"])}
          >
            {it.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Node scene ------------------------------- */

function NodeScene({ scene }: { scene: Extract<Scene, { kind: "nodes" }> }) {
  const h = scene.height ?? 60;
  const nodeById = new Map(scene.nodes.map((n) => [n.id, n]));
  return (
    <div>
      <svg viewBox={`0 0 100 ${h}`} className="w-full" style={{ aspectRatio: `100 / ${h}` }} role="img">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-border-strong)" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--color-secondary)" />
          </marker>
        </defs>

        {scene.edges.map((e) => {
          const a = nodeById.get(e.from);
          const b = nodeById.get(e.to);
          if (!a || !b) return null;
          const active = e.state === "active";
          const curve = e.curve ?? 0;
          const mx = (a.x + b.x) / 2 + curve;
          const my = (a.y + b.y) / 2 - Math.abs(curve) * 0.6;
          const d = curve ? `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}` : `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
          return (
            <motion.path
              key={e.id}
              d={d}
              fill="none"
              animate={{ stroke: edgeStroke(e.state) }}
              strokeWidth={active ? 0.9 : 0.5}
              markerEnd={e.directed ? (active ? "url(#arrow-active)" : "url(#arrow)") : undefined}
              opacity={e.state === "muted" ? 0.4 : 1}
            />
          );
        })}

        {scene.nodes.map((n) => {
          const c = NODE[n.state];
          return (
            <g key={n.id}>
              <motion.circle
                animate={{ cx: n.x, cy: n.y, fill: c.fill, stroke: c.stroke }}
                r={4.6}
                strokeWidth={0.55}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              />
              <motion.text
                animate={{ x: n.x, y: n.y + 1.4 }}
                textAnchor="middle"
                className="fill-[color:var(--color-foreground)] font-mono"
                style={{ fontSize: 3.4, fontWeight: 600 }}
              >
                {n.label}
              </motion.text>
              {n.sub && (
                <motion.text animate={{ x: n.x, y: n.y + 8.5 }} textAnchor="middle" className="fill-[color:var(--color-faint)]" style={{ fontSize: 2.6 }}>
                  {n.sub}
                </motion.text>
              )}
            </g>
          );
        })}

        {scene.labels?.map((l) => {
          const n = nodeById.get(l.nodeId);
          if (!n) return null;
          const dy = l.place === "below" ? 9 : -6.5;
          return (
            <motion.text
              key={l.text + l.nodeId}
              animate={{ x: n.x, y: n.y + dy }}
              textAnchor="middle"
              className={cn("font-mono", labelTone[l.tone ?? "primary"])}
              style={{ fontSize: 3, fontWeight: 700 }}
            >
              {l.text}
            </motion.text>
          );
        })}
      </svg>
      {scene.aux && <AuxPanelView aux={scene.aux} />}
    </div>
  );
}

/* ------------------------------ Stack scene ------------------------------- */

function StackScene({ scene }: { scene: Extract<Scene, { kind: "stack" }> }) {
  const horizontal = scene.orientation === "horizontal";
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-wide text-faint">{scene.title}</span>
      <div
        className={cn(
          "flex gap-1.5 rounded-[var(--radius-md)] border border-dashed border-border bg-surface/40 p-3",
          horizontal ? "min-h-16 flex-row items-center" : "min-h-[220px] flex-col-reverse items-center justify-start"
        )}
      >
        {scene.boxes.length === 0 && <span className="m-auto text-xs text-faint">empty</span>}
        {scene.boxes.map((b) => (
          <motion.div
            key={b.id}
            layout
            initial={{ opacity: 0, y: horizontal ? 0 : -14, x: horizontal ? 14 : 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={cn("grid h-11 min-w-[3rem] place-items-center rounded-[var(--radius-sm)] border-2 px-3 font-mono text-sm font-semibold", BOX[b.state ?? "default"])}
          >
            {b.label}
          </motion.div>
        ))}
      </div>
      {scene.aux && <AuxPanelView aux={scene.aux} />}
    </div>
  );
}

/* ------------------------------- Grid scene ------------------------------- */

function GridScene({ scene }: { scene: Extract<Scene, { kind: "grid" }> }) {
  const cellAt = new Map(scene.cells.map((c) => [`${c.r}:${c.c}`, c]));
  return (
    <div className="flex flex-col items-center gap-2 overflow-x-auto">
      {scene.title && <span className="font-mono text-[11px] uppercase tracking-wide text-faint">{scene.title}</span>}
      <div className="inline-block">
        {scene.colLabels && (
          <div className="flex pl-[var(--rl)]" style={{ ["--rl" as string]: scene.rowLabels ? "2rem" : "0" }}>
            {scene.colLabels.map((cl, i) => (
              <div key={i} className="grid h-6 w-11 place-items-center font-mono text-[10px] text-faint">{cl}</div>
            ))}
          </div>
        )}
        {Array.from({ length: scene.rows }).map((_, r) => (
          <div key={r} className="flex items-center">
            {scene.rowLabels && <div className="grid h-11 w-8 place-items-center font-mono text-[10px] text-faint">{scene.rowLabels[r]}</div>}
            {Array.from({ length: scene.cols }).map((_, c) => {
              const cell = cellAt.get(`${r}:${c}`);
              return (
                <motion.div
                  key={c}
                  animate={{ scale: cell?.state === "current" ? 1.06 : 1 }}
                  className={cn("m-0.5 grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] border-2 font-mono text-sm", BOX[cell?.state ?? "default"])}
                >
                  {cell?.label ?? ""}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      {scene.aux && <AuxPanelView aux={scene.aux} />}
    </div>
  );
}

/* ----------------------------- Timeline scene ----------------------------- */

function TimelineScene({ scene }: { scene: Extract<Scene, { kind: "timeline" }> }) {
  const rowH = 34;
  return (
    <div className="flex flex-col gap-2">
      <div className="relative rounded-[var(--radius-md)] border border-border bg-surface/40 p-3" style={{ height: scene.rows * rowH + 24 }}>
        {scene.items.map((it) => (
          <motion.div
            key={it.id}
            layout
            animate={{ opacity: it.state === "muted" ? 0.4 : 1 }}
            className={cn("absolute grid place-items-center rounded-[var(--radius-sm)] border-2 font-mono text-xs font-semibold", BOX[it.state ?? "default"])}
            style={{
              left: `calc(${it.start}% )`,
              width: `${Math.max(it.end - it.start, 4)}%`,
              top: 12 + it.row * rowH,
              height: rowH - 8,
            }}
          >
            {it.label}
          </motion.div>
        ))}
      </div>
      {scene.aux && <AuxPanelView aux={scene.aux} />}
    </div>
  );
}

/* ------------------------------- Bit scene -------------------------------- */

function BitScene({ scene }: { scene: Extract<Scene, { kind: "bits" }> }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        {scene.bits.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ scale: b.state === "current" ? 1.12 : 1 }}
              className={cn("grid size-11 place-items-center rounded-[var(--radius-sm)] border-2 font-mono text-lg font-bold", BOX[b.state ?? "default"])}
            >
              {b.value}
            </motion.div>
            <span className="font-mono text-[10px] text-faint">{scene.bits.length - 1 - i}</span>
          </div>
        ))}
      </div>
      {scene.caption && <p className="font-mono text-xs text-muted">{scene.caption}</p>}
      {scene.aux && <AuxPanelView aux={scene.aux} />}
    </div>
  );
}

/* ------------------------------ Scene switch ------------------------------ */

export function SceneView({ scene }: { scene: Scene }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-[radial-gradient(120%_120%_at_50%_-20%,color-mix(in_oklab,var(--color-primary)_9%,transparent),transparent)] bg-surface/40 p-4 sm:p-6">
      {scene.kind === "nodes" && <NodeScene scene={scene} />}
      {scene.kind === "stack" && <StackScene scene={scene} />}
      {scene.kind === "grid" && <GridScene scene={scene} />}
      {scene.kind === "timeline" && <TimelineScene scene={scene} />}
      {scene.kind === "bits" && <BitScene scene={scene} />}
    </div>
  );
}
