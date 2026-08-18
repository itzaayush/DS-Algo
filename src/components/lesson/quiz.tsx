"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import type { QuizQuestion } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PASS_THRESHOLD = 0.8;

export function Quiz({
  questions,
  onPass,
}: {
  questions: QuizQuestion[];
  onPass?: (scorePct: number) => void;
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [notified, setNotified] = useState(false);

  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === questions.length;
  const correctCount = useMemo(
    () => questions.filter((q) => selected[q.id] === q.correctId).length,
    [questions, selected]
  );
  const scorePct = Math.round((correctCount / questions.length) * 100);
  const passed = allAnswered && scorePct >= PASS_THRESHOLD * 100;

  function pick(qid: string, choiceId: string) {
    if (selected[qid]) return; // lock once answered
    setSelected((s) => ({ ...s, [qid]: choiceId }));
  }

  function reset() {
    setSelected({});
    setNotified(false);
  }

  useEffect(() => {
    if (passed && !notified) {
      setNotified(true);
      onPass?.(scorePct);
    }
  }, [passed, notified, scorePct, onPass]);

  const reviewConcepts = questions
    .filter((q) => selected[q.id] && selected[q.id] !== q.correctId)
    .map((q) => q.concept)
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const chosen = selected[q.id];
        const revealed = Boolean(chosen);
        return (
          <fieldset key={q.id} className="rounded-[var(--radius-lg)] border border-border bg-surface/50 p-5">
            <legend className="sr-only">Question {qi + 1}</legend>
            <p className="flex gap-2 font-medium">
              <span className="font-mono text-sm text-faint">{qi + 1}.</span>
              {q.prompt}
            </p>
            <div className="mt-3 space-y-2" role="radiogroup" aria-label={q.prompt}>
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
                    onClick={() => pick(q.id, choice.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[var(--radius-md)] border px-4 py-2.5 text-left text-sm transition-colors",
                      !revealed && "border-border hover:border-primary/50 hover:bg-surface-2",
                      showCorrect && "border-success/60 bg-success/10 text-foreground",
                      showWrong && "border-danger/60 bg-danger/10 text-foreground",
                      revealed && !showCorrect && !showWrong && "border-border opacity-60"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full border",
                        showCorrect && "border-success bg-success/20 text-success",
                        showWrong && "border-danger bg-danger/20 text-danger",
                        !revealed && "border-border-strong"
                      )}
                    >
                      {showCorrect && <CheckCircle2 className="size-3.5" />}
                      {showWrong && <XCircle className="size-3.5" />}
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
                  chosen === q.correctId
                    ? "border-success/30 bg-success/10 text-foreground/85"
                    : "border-accent/30 bg-accent/10 text-foreground/85"
                )}
              >
                <span className="font-semibold">
                  {chosen === q.correctId ? "Correct. " : "Not quite. "}
                </span>
                {q.explanation}
              </p>
            )}
          </fieldset>
        );
      })}

      {/* Results */}
      {allAnswered && (
        <div
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            passed ? "border-success/40 bg-success/10" : "border-accent/40 bg-accent/10"
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-11 place-items-center rounded-[var(--radius-md)]",
                passed ? "bg-success/20 text-success" : "bg-accent/20 text-accent"
              )}
            >
              <Trophy className="size-6" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">
                {passed ? "Mastery reached!" : "Almost there"}
              </p>
              <p className="text-sm text-muted">
                You scored {scorePct}% — {passed ? "above" : "below"} the {PASS_THRESHOLD * 100}% gate.
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={reset}>
              <RotateCcw className="size-4" /> Retry
            </Button>
          </div>
          {!passed && reviewConcepts.length > 0 && (
            <p className="mt-3 text-sm text-foreground/80">
              Review these concepts, then try again: <span className="font-medium">{[...new Set(reviewConcepts)].join(", ")}</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
