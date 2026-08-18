import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative inline-grid size-8 place-items-center">
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden fill="none">
          <defs>
            <linearGradient id="aq-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7c5cff" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <rect x="3" y="17" width="5" height="11" rx="1.5" fill="url(#aq-g)" opacity="0.55" />
          <rect x="10.5" y="11" width="5" height="17" rx="1.5" fill="url(#aq-g)" opacity="0.8" />
          <rect x="18" y="6" width="5" height="22" rx="1.5" fill="url(#aq-g)" />
          <circle cx="26" cy="7" r="3" fill="#fbbf24" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Algo<span className="text-primary-soft">Quest</span>
      </span>
    </span>
  );
}
