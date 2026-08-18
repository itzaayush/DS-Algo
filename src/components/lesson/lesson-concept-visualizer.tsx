"use client";

import { ConceptVisualizer } from "@/components/concept/concept-visualizer";
import type { FlowchartSpec } from "@/lib/schema";
import { useProgress } from "@/store/progress-store";

interface Props {
  conceptId: string;
  flowchart?: FlowchartSpec;
  codeLineToNode?: Record<string, string>;
}

export function LessonConceptVisualizer(props: Props) {
  const award = useProgress((s) => s.awardAchievement);
  return <ConceptVisualizer {...props} onReachEnd={() => award("visualizer-explorer")} />;
}
