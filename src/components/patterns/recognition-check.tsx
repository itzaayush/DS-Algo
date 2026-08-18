"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
import type { QuizQuestion } from "@/lib/schema";
import { cn } from "@/lib/utils";

/** Lightweight "choose the approach, then reveal why" check (PRD GH-011). */
export function RecognitionCheck({ questions }: { questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => {
        const chosen = picked[q.id];
        const revealed = Boolean(chosen);
        return (
          <div key={q.id} className="rounded-[var(--radius-lg)] border border-secondary/25 bg-secondary/5 p-5">
            <p className="flex items-start gap-2 font-medium">
              <Eye className="mt-0.5 size-4 shrink-0 text-secondary" />
              <span>
                <span className="mr-1 font-mono text-xs text-faint">{qi + 1}.</span>
                {q.prompt}
              </span>
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={q.prompt}>
              {q.choices.map((choice) => {
                const isChosen = chosen === choice.id;
                const isCorrect = choice.id === q.correctId;
                const showCorrect = revealed && isCorrect;
                const showWrong = revealed && isChosen && !isCorrect;
                return (
                  <button
                    key={choice.id}
                    role="radio"
                    aria-checked={isChosen}
                    disabled={revealed}
                    onClick={() => setPicked((p) => ({ ...p, [q.id]: choice.id }))}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[var(--radius-md)] border px-3 py-2 text-left text-sm transition-colors",
                      !revealed && "border-border hover:border-secondary/50 hover:bg-surface-2",
                      showCorrect && "border-success/60 bg-success/10",
                      showWrong && "border-danger/60 bg-danger/10",
                      revealed && !showCorrect && !showWrong && "border-border opacity-60"
                    )}
                  >
                    <span className="grid size-5 shrink-0 place-items-center">
                      {showCorrect && <CheckCircle2 className="size-4 text-success" />}
                      {showWrong && <XCircle className="size-4 text-danger" />}
                    </span>
                    {choice.text}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <p
                className={cn(
                  "mt-3 rounded-[var(--radius-md)] border px-3 py-2 text-sm",
                  chosen === q.correctId ? "border-success/30 bg-success/10" : "border-accent/30 bg-accent/10"
                )}
              >
                <span className="font-semibold">{chosen === q.correctId ? "Exactly. " : "Reconsider. "}</span>
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
