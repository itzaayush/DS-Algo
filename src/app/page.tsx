import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Gamepad2,
  ListChecks,
  MousePointerClick,
  Workflow,
  Target,
  Trophy,
} from "lucide-react";
import { HomeHero } from "@/components/home/hero";
import { Reveal } from "@/components/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MODULES } from "@/content/curriculum";
import { PATTERN_CATALOG } from "@/content/patterns";
import { getModuleIcon } from "@/lib/module-icons";

const FEATURES = [
  { icon: MousePointerClick, title: "Interactive traces", body: "Play, pause, step, and scrub every algorithm. Code, data, and narration stay perfectly in sync.", tone: "primary" as const },
  { icon: Workflow, title: "Animated flowcharts", body: "Watch control flow light up node by node — with zoom, pan, and a text fallback for everyone.", tone: "secondary" as const },
  { icon: Target, title: "Pattern Lab", body: "Learn to recognize the 20 reusable patterns behind thousands of problems, not memorize solutions.", tone: "primary" as const },
  { icon: Gamepad2, title: "3D Adventure", body: "Reinforce each concept in a Three.js world where finishing a lesson unlocks the next challenge.", tone: "accent" as const },
  { icon: ListChecks, title: "Practice with purpose", body: "Curated LeetCode & Codeforces links tied to the exact pattern you just learned.", tone: "secondary" as const },
  { icon: Trophy, title: "Progress that's earned", body: "Levels, streaks, and achievements reward understanding — never passive scrolling.", tone: "accent" as const },
];

const LOOP = [
  { n: "01", t: "Orient", d: "See the goal, prerequisites, and what unlocks next." },
  { n: "02", t: "Experience", d: "Meet a real-world problem before any definition." },
  { n: "03", t: "Watch & control", d: "Drive the animation; replay the tricky steps." },
  { n: "04", t: "Build the model", d: "Plain language, code, and complexity connect the dots." },
  { n: "05", t: "Check", d: "Quizzes correct misconceptions, not punish them." },
  { n: "06", t: "Practice & earn", d: "Curated problems, then achievements and a game level." },
];

export default function Home() {
  const previewModules = MODULES.slice(0, 8);
  return (
    <div className="flex flex-col">
      <HomeHero />

      {/* Feature grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Learning you can <span className="text-primary-soft">see move</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Every concept ships with a visual behavior first, terminology second. Here is what that
            looks like across the platform.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <Card className="h-full p-5 transition-colors hover:border-border-strong">
                <span
                  className={`inline-grid size-11 place-items-center rounded-[var(--radius-md)] ${
                    f.tone === "primary"
                      ? "bg-primary/15 text-primary-soft"
                      : f.tone === "secondary"
                        ? "bg-secondary/15 text-secondary"
                        : "bg-accent/15 text-accent"
                  }`}
                >
                  <f.icon className="size-5.5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Learning loop */}
      <section className="border-y border-border/60 bg-surface/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <Reveal>
            <Badge tone="primary" className="mb-3">
              The lesson loop
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Six moves, every single lesson.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOOP.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05}>
                <div className="flex gap-4 rounded-[var(--radius-lg)] border border-border bg-surface/50 p-5">
                  <span className="font-display text-2xl font-bold text-primary/40">{s.n}</span>
                  <div>
                    <h3 className="font-semibold">{s.t}</h3>
                    <p className="mt-1 text-sm text-muted">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum preview */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                A guided path, arrays to advanced.
              </h2>
              <p className="mt-3 max-w-2xl text-muted">
                Fifteen prerequisite-aware modules. You always know exactly what to learn next.
              </p>
            </div>
            <Link href="/learn" className="inline-flex items-center gap-1 text-sm font-medium text-primary-soft hover:underline">
              See full curriculum <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {previewModules.map((m, i) => {
            const Icon = getModuleIcon(m.icon);
            return (
              <Reveal key={m.id} delay={i * 0.04}>
                <Link href="/learn" className="group block h-full">
                  <Card className="h-full p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40">
                    <div className="flex items-center gap-2">
                      <span className="grid size-9 place-items-center rounded-[var(--radius-md)] bg-surface-2 text-primary-soft">
                        <Icon className="size-4.5" />
                      </span>
                      <span className="font-mono text-xs text-faint">Module {m.order}</span>
                    </div>
                    <h3 className="mt-3 font-semibold leading-tight">{m.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{m.summary}</p>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Adventure teaser */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-gradient-to-br from-primary/20 via-surface to-secondary/15 p-8 sm:p-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
            <div className="relative max-w-2xl">
              <Badge tone="accent" className="mb-4">
                <Gamepad2 className="size-3.5" /> Three.js Adventure
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Turn studying into a level-by-level quest.
              </h2>
              <p className="mt-3 text-muted">
                Each world maps to a module. Solve concept challenges in 3D — reorder towers, route
                paths, balance trees — and unlock the next level. Full 2D fallback for every device.
              </p>
              <Link
                href="/adventure"
                className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-soft"
              >
                Enter the Adventure <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Accessibility band */}
      <section className="border-t border-border/60 bg-surface/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 py-12 sm:flex-row sm:items-center sm:px-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-success/15 text-success">
            <Accessibility className="size-6" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold">Accessibility is a core mode, not an afterthought.</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted">
              Keyboard control, reduced-motion, captions and transcripts, text traces for every
              visualizer, and a non-WebGL path through the entire game. Targeting WCAG 2.2 AA.
            </p>
          </div>
          <Link href="/patterns" className="ml-auto hidden shrink-0 items-center gap-1 text-sm font-medium text-primary-soft hover:underline sm:inline-flex">
            {PATTERN_CATALOG.length} patterns waiting <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
