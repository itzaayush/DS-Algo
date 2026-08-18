"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Info } from "lucide-react";
import { PRACTICE_ITEMS, ALL_COMPANY_TAGS, ALL_PRACTICE_TOPICS } from "@/content/practice";
import { useProgress, type PracticeState } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { PracticeCard } from "./practice-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Platform = "all" | "leetcode" | "codeforces";
type Diff = "all" | "intro" | "easy" | "medium" | "hard";

function Pills<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-[var(--radius-md)] border border-border bg-surface p-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          aria-pressed={value === o.v}
          className={cn(
            "rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors",
            value === o.v ? "bg-primary/20 text-primary-soft" : "text-muted hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PracticeExplorer() {
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const practiceStatus = useProgress((s) => s.practice);

  const [q, setQ] = useState(params.get("q") ?? "");
  const [platform, setPlatform] = useState<Platform>((params.get("platform") as Platform) ?? "all");
  const [diff, setDiff] = useState<Diff>((params.get("diff") as Diff) ?? "all");
  const [topic, setTopic] = useState(params.get("topic") ?? "all");
  const [company, setCompany] = useState(params.get("company") ?? "all");
  const [status, setStatus] = useState<PracticeState | "all">((params.get("status") as PracticeState) ?? "all");

  // Reflect filters in the URL (shareable, back-button friendly).
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (platform !== "all") p.set("platform", platform);
    if (diff !== "all") p.set("diff", diff);
    if (topic !== "all") p.set("topic", topic);
    if (company !== "all") p.set("company", company);
    if (status !== "all") p.set("status", status);
    const qs = p.toString();
    router.replace(qs ? `/practice?${qs}` : "/practice", { scroll: false });
  }, [q, platform, diff, topic, company, status, router]);

  const filtered = useMemo(() => {
    return PRACTICE_ITEMS.filter((item) => {
      if (platform !== "all" && item.platform !== platform) return false;
      if (diff !== "all" && item.difficulty !== diff) return false;
      if (topic !== "all" && item.topic !== topic) return false;
      if (company !== "all" && !item.companyTags.includes(company)) return false;
      if (hydrated && status !== "all" && (practiceStatus[item.id] ?? "not-started") !== status) return false;
      if (q) {
        const hay = `${item.title} ${item.topic} ${item.pattern ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [platform, diff, topic, company, status, q, hydrated, practiceStatus]);

  const anyFilter = q || platform !== "all" || diff !== "all" || topic !== "all" || company !== "all" || status !== "all";

  function reset() {
    setQ("");
    setPlatform("all");
    setDiff("all");
    setTopic("all");
    setCompany("all");
    setStatus("all");
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-3 rounded-[var(--radius-xl)] border border-border bg-surface/40 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search problems, topics, patterns…"
            aria-label="Search practice problems"
            className="w-full rounded-[var(--radius-md)] border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus-visible:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pills<Platform>
            label="Platform"
            value={platform}
            onChange={setPlatform}
            options={[
              { v: "all", label: "All" },
              { v: "leetcode", label: "LeetCode" },
              { v: "codeforces", label: "Codeforces" },
            ]}
          />
          <Pills<Diff>
            label="Difficulty"
            value={diff}
            onChange={setDiff}
            options={[
              { v: "all", label: "Any" },
              { v: "intro", label: "Intro" },
              { v: "easy", label: "Easy" },
              { v: "medium", label: "Medium" },
              { v: "hard", label: "Hard" },
            ]}
          />
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Topic"
            className="rounded-[var(--radius-md)] border border-border bg-surface px-3 py-1.5 text-xs text-foreground outline-none focus-visible:border-primary"
          >
            <option value="all">All topics</option>
            {ALL_PRACTICE_TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            aria-label="Company tag"
            className="rounded-[var(--radius-md)] border border-border bg-surface px-3 py-1.5 text-xs text-foreground outline-none focus-visible:border-primary"
          >
            <option value="all">All companies</option>
            {ALL_COMPANY_TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PracticeState | "all")}
            aria-label="Status"
            className="rounded-[var(--radius-md)] border border-border bg-surface px-3 py-1.5 text-xs text-foreground outline-none focus-visible:border-primary"
          >
            <option value="all">Any status</option>
            <option value="not-started">Not started</option>
            <option value="attempted">Attempted</option>
            <option value="solved">Solved</option>
            <option value="revisit">Revisit</option>
          </select>
          {anyFilter && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <X className="size-4" /> Clear
            </Button>
          )}
        </div>
        {company !== "all" && (
          <p className="flex items-center gap-1.5 text-xs text-faint">
            <Info className="size-3.5" /> Company tags are community-curated and informational — not an official hiring forecast.
          </p>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{filtered.length} problem{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface/40 p-10 text-center">
          <p className="font-medium">No problems match those filters.</p>
          <p className="mt-1 text-sm text-muted">Try removing a filter or searching a broader term.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={reset}>Reset all filters</Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PracticeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
