import type { Metadata } from "next";
import { Suspense } from "react";
import { Dumbbell } from "lucide-react";
import { PracticeSurface } from "@/components/practice/practice-surface";

export const metadata: Metadata = {
  title: "Practice",
  description: "Curated LeetCode and Codeforces problems, organized by pattern and difficulty for interview prep.",
};

export default function PracticePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
          <Dumbbell className="size-3.5" /> Practice library
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Practice with purpose
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Train pattern by pattern — easy to hard — the way strong candidates prepare. Every problem
          links to its canonical LeetCode or Codeforces page and tracks your status across devices.
        </p>
      </header>

      <Suspense fallback={<div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-surface-2" />}>
        <PracticeSurface />
      </Suspense>
    </div>
  );
}
