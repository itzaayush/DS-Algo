import type { Metadata } from "next";
import { AchievementsView } from "@/components/achievements/achievements-view";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Badges earned for meaningful learning milestones.",
};

export default function AchievementsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Achievements</h1>
        <p className="mt-2 text-muted">
          Rewards for real progress — completing lessons, solving problems, keeping a streak. Cosmetic
          only; they never gate your learning.
        </p>
      </header>
      <AchievementsView />
    </div>
  );
}
