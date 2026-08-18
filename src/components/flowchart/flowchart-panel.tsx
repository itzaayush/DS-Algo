"use client";

import dynamic from "next/dynamic";
import type { FlowchartSpec } from "@/lib/schema";

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

export function FlowchartPanel({ spec }: { spec: FlowchartSpec }) {
  return <AlgorithmFlowchart spec={spec} />;
}
