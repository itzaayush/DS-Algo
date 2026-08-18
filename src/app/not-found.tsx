import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-lg place-items-center px-4 py-24 text-center sm:px-6">
      <span className="grid size-16 place-items-center rounded-full bg-primary/15 text-primary-soft">
        <Compass className="size-8" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">Off the map</h1>
      <p className="mt-2 text-muted">
        This page doesn't exist — or the content moved. Let's get you back to a known checkpoint.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-soft"
        >
          <Home className="size-4" /> Home
        </Link>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2"
        >
          Browse the curriculum
        </Link>
      </div>
    </div>
  );
}
