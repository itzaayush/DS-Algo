"use client";

import { AlgorithmVisualizer } from "@/components/visualizer/algorithm-visualizer";
import type { FlowchartSpec } from "@/lib/schema";
import { useProgress } from "@/store/progress-store";

interface Props {
  algorithmId: string;
  algorithmOptions?: string[];
  initialInput?: number[];
  flowchart?: FlowchartSpec;
  codeLineToNode?: Record<string, string>;
}

/** Client wrapper so we can award the trace achievement (server can't pass handlers). */
export function LessonVisualizer(props: Props) {
  const award = useProgress((s) => s.awardAchievement);
  return (
    <AlgorithmVisualizer
      {...props}
      codeLineToNode={props.codeLineToNode as Record<number, string> | undefined}
      onReachEnd={() => award("visualizer-explorer")}
    />
  );
}
