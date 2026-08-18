import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Resume learning, track your streak, level, and progress.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your dashboard</h1>
        <p className="mt-2 text-muted">One glance at your momentum — and one click to keep it going.</p>
      </header>
      <DashboardView />
    </div>
  );
}
