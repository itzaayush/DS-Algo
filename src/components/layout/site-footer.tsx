import Link from "next/link";
import { Logo } from "./logo";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-surface/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">
            A visual, pattern-led path from zero to hero in data structures, algorithms, and
            competitive programming.
          </p>
          <p className="mt-4 font-mono text-xs text-faint">
            Practice links point to LeetCode &amp; Codeforces. Company tags are community-curated and
            informational — not an official hiring forecast.
          </p>
        </div>
        <nav aria-label="Learn">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">Learn</h2>
          <ul className="space-y-2">
            {PRIMARY_NAV.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-sm text-muted transition-colors hover:text-foreground">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Account">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">You</h2>
          <ul className="space-y-2">
            {SECONDARY_NAV.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="text-sm text-muted transition-colors hover:text-foreground">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-faint sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} AlgoQuest. A personal-first learning project.</p>
          <p className="font-mono">Built with Next.js · React · Three.js</p>
        </div>
      </div>
    </footer>
  );
}
