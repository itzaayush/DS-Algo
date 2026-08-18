import type { Metadata } from "next";
import { CurriculumMap } from "@/components/learn/curriculum-map";

export const metadata: Metadata = {
  title: "Learn — Fundamentals track",
  description: "A sequential, prerequisite-aware DSA curriculum from complexity to advanced structures.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-sm text-secondary">Fundamentals track</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Your path from zero to hero
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Fifteen modules, each unlocking the next. Complete a module's lessons and pass its mastery
          check to open what comes after — you'll never wonder what to study next.
        </p>
      </header>
      <CurriculumMap />
    </div>
  );
}
