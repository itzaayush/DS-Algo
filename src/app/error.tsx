"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where Sentry.captureException(error) would go.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto grid max-w-lg place-items-center px-4 py-24 text-center sm:px-6">
      <span className="grid size-16 place-items-center rounded-full bg-danger/15 text-danger">
        <TriangleAlert className="size-8" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Something broke</h1>
      <p className="mt-2 text-muted">
        A part of this page failed to load. Your progress is safe — try again, and the lesson text and
        code remain available even if a visual asset failed.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-soft"
      >
        <RotateCcw className="size-4" /> Try again
      </button>
    </div>
  );
}
