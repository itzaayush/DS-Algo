import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Target } from "lucide-react";
import { PATTERN_CATALOG, getPattern } from "@/content/patterns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pattern Lab",
  description: "Learn to recognize and apply the 20 reusable problem-solving patterns.",
};

const diffTone = { intro: "muted", easy: "success", medium: "accent", hard: "danger" } as const;

export default function PatternsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-soft">
          <Target className="size-3.5" /> Pattern Lab
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Recognize the pattern, solve the family
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Most problems are variations on a small set of ideas. Learn each pattern's recognition
          signals, intuition, and reusable template — then practice a laddered set of problems.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PATTERN_CATALOG.map((p) => {
          const authored = Boolean(getPattern(p.slug));
          const card = (
            <Card
              className={`flex h-full flex-col p-5 transition-all ${
                authored ? "hover:-translate-y-0.5 hover:border-primary/40" : "opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-faint">Pattern {String(p.order).padStart(2, "0")}</span>
                <Badge tone={diffTone[p.difficulty]}>{p.difficulty}</Badge>
              </div>
              <h2 className="mt-3 font-display text-lg font-semibold leading-tight">{p.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted">{p.summary}</p>
              <div className="mt-4">
                {authored ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft">
                    Open pattern <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-faint">
                    <Lock className="size-3.5" /> In production
                  </span>
                )}
              </div>
            </Card>
          );

          return authored ? (
            <Link key={p.slug} href={`/patterns/${p.slug}`} className="group block h-full">
              {card}
            </Link>
          ) : (
            <div key={p.slug} className="group block h-full">
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}
