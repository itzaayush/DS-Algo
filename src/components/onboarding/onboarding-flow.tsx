"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowLeft, Check, Sparkles, Rocket } from "lucide-react";
import { useProgress, type LearningPath, type Pace } from "@/store/progress-store";
import { ALL_COMPANY_TAGS } from "@/content/practice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Goal = LearningPath["goal"];
type Exp = LearningPath["experience"];

const GOALS: { v: Goal; label: string; desc: string }[] = [
  { v: "interview", label: "Ace interviews", desc: "Company-tagged practice and patterns." },
  { v: "contests", label: "Competitive programming", desc: "Speed, math, and contest strategy." },
  { v: "fundamentals", label: "Master fundamentals", desc: "A solid, sequential foundation." },
  { v: "explore", label: "Just explore", desc: "Follow curiosity, no pressure." },
];

const EXP: { v: Exp; label: string; desc: string }[] = [
  { v: "new", label: "New to DSA", desc: "I know basic syntax, not much more." },
  { v: "some", label: "Some experience", desc: "I've done arrays and a few problems." },
  { v: "returning", label: "Returning", desc: "I've studied before and want a refresher." },
];

const PACES: { v: Pace; label: string }[] = [
  { v: "relaxed", label: "Relaxed" },
  { v: "steady", label: "Steady" },
  { v: "intense", label: "Intense" },
];

function OptionCard({ selected, title, desc, onClick }: { selected: boolean; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius-lg)] border p-4 text-left transition-all",
        selected ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30" : "border-border bg-surface/50 hover:border-primary/40"
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong"
        )}
      >
        {selected && <Check className="size-3.5" />}
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-muted">{desc}</span>
      </span>
    </button>
  );
}

export function OnboardingFlow() {
  const setPath = useProgress((s) => s.setPath);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [exp, setExp] = useState<Exp | null>(null);
  const [minutes, setMinutes] = useState(180);
  const [pace, setPace] = useState<Pace>("steady");
  const [companies, setCompanies] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const startLesson = exp === "returning" ? "sorting-intro" : "arrays-intro";
  const startModule = exp === "returning" ? "sorting" : "arrays";
  const reason =
    exp === "returning"
      ? "You've seen the basics, so we'll jump to sorting and searching to rebuild momentum fast."
      : exp === "some"
        ? "You know arrays exist — we'll make them click for good before layering on patterns."
        : "We'll start with the mental models and complexity intuition that make everything else easier.";

  const steps = ["Goal", "Experience", "Schedule", "Companies", "Plan"];
  const canNext = (step === 0 && goal) || (step === 1 && exp) || step === 2 || step === 3 || step === 4;

  function finish() {
    setPath({ goal: goal!, experience: exp!, weeklyMinutes: minutes, pace, companies, startModule });
    setDone(true);
    setStep(4);
  }

  function toggleCompany(c: string) {
    setCompanies((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  return (
    <div>
      {/* Progress dots */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full text-xs font-medium transition-colors",
                i < step || done ? "bg-success/20 text-success" : i === step ? "bg-primary text-primary-foreground" : "bg-surface-2 text-faint"
              )}
            >
              {i < step || (done && i < 4) ? <Check className="size-3.5" /> : i + 1}
            </span>
            {i < steps.length - 1 && <span className={cn("h-px w-6", i < step ? "bg-success/50" : "bg-border")} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold">What brings you here?</h2>
              <p className="mt-1 text-muted">This shapes what we emphasize — you can change it later.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {GOALS.map((g) => (
                  <OptionCard key={g.v} selected={goal === g.v} title={g.label} desc={g.desc} onClick={() => setGoal(g.v)} />
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section>
              <h2 className="font-display text-2xl font-bold">Where are you starting from?</h2>
              <p className="mt-1 text-muted">Honest answers get you a better starting point.</p>
              <div className="mt-6 grid gap-3">
                {EXP.map((e) => (
                  <OptionCard key={e.v} selected={exp === e.v} title={e.label} desc={e.desc} onClick={() => setExp(e.v)} />
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="font-display text-2xl font-bold">How much time per week?</h2>
              <p className="mt-1 text-muted">A realistic target beats an ambitious one you'll drop.</p>
              <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-surface/50 p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted">Weekly study time</span>
                  <span className="font-display text-2xl font-bold text-primary-soft">
                    {Math.floor(minutes / 60)}h {minutes % 60 ? `${minutes % 60}m` : ""}
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={600}
                  step={30}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  aria-label="Weekly study minutes"
                  className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-3 accent-primary"
                />
                <div className="mt-6">
                  <p className="mb-2 text-sm text-muted">Preferred pace</p>
                  <div className="flex gap-2">
                    {PACES.map((p) => (
                      <button
                        key={p.v}
                        onClick={() => setPace(p.v)}
                        aria-pressed={pace === p.v}
                        className={cn(
                          "flex-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors",
                          pace === p.v ? "border-primary/50 bg-primary/15 text-primary-soft" : "border-border text-muted hover:text-foreground"
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="font-display text-2xl font-bold">Any target companies?</h2>
              <p className="mt-1 text-muted">Optional — we'll surface matching practice. Tags are informational only.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {ALL_COMPANY_TAGS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCompany(c)}
                    aria-pressed={companies.includes(c)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      companies.includes(c) ? "border-primary/50 bg-primary/15 text-primary-soft" : "border-border text-muted hover:text-foreground"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="text-center">
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary-soft"
              >
                <Rocket className="size-8" />
              </motion.span>
              <h2 className="mt-4 font-display text-2xl font-bold">Your path is ready</h2>
              <p className="mx-auto mt-2 max-w-md text-muted">{reason}</p>
              <div className="mx-auto mt-6 max-w-sm rounded-[var(--radius-lg)] border border-primary/30 bg-primary/8 p-5 text-left">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Start here</p>
                <p className="mt-1 font-display text-lg font-semibold">
                  {startModule === "sorting" ? "Sorting: order from chaos" : "Arrays: the contiguous shelf"}
                </p>
                <Link
                  href={`/learn/${startLesson}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-soft"
                >
                  Begin first lesson <ArrowRight className="size-4" />
                </Link>
                <Link href="/dashboard" className="mt-2 block text-center text-sm text-muted hover:text-foreground">
                  Go to dashboard
                </Link>
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      {step < 4 && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          <div className="flex items-center gap-3">
            <Link href="/learn" className="text-sm text-muted hover:text-foreground">
              Skip — start from the beginning
            </Link>
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={!goal || !exp}>
                <Sparkles className="size-4" /> Build my path
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
