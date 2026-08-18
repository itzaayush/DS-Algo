export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3 text-muted">
        <span className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden />
        Loading…
      </div>
      <div className="mt-8 space-y-4">
        <div className="h-9 w-2/3 animate-pulse rounded-[var(--radius-md)] bg-surface-2" />
        <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-surface-2" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-surface-2" />
          ))}
        </div>
      </div>
    </div>
  );
}
