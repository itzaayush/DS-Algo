"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { AlgorithmVisualizer } from "@/components/visualizer/algorithm-visualizer";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" />
        <div className="absolute left-1/2 top-[-10%] size-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[8%] top-[30%] size-[26rem] rounded-full bg-secondary/15 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-soft"
          >
            <Sparkles className="size-3.5" />
            Visual DSA · Patterns · Competitive Programming
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Go from{" "}
            <span className="relative whitespace-nowrap text-primary-soft">
              stuck at arrays
              <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none">
                <path d="M2 9 Q 150 -2 298 7" stroke="var(--color-accent)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            to solving with patterns.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-lg text-muted"
          >
            AlgoQuest replaces dry lectures with interactive algorithm traces, animated flowcharts,
            and a 3D adventure. Watch every step, control the pace, and practice with purpose.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.19, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start learning <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/learn">Explore the curriculum</Link>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-4"
          >
            {[
              { k: "15", v: "Fundamentals modules" },
              { k: "20", v: "Problem patterns" },
              { k: "3D", v: "Adventure levels" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl font-bold text-foreground">{s.k}</dt>
                <dd className="text-xs text-muted">{s.v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Live, playable demo — a real algorithm interaction, not a screenshot. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-3 flex items-center gap-2 text-sm text-muted">
            <span className="grid size-6 place-items-center rounded-full bg-accent/20 text-accent">
              <Play className="size-3" />
            </span>
            Try it now — press play or drag the scrubber
          </div>
          <AlgorithmVisualizer
            algorithmId="bubble-sort"
            algorithmOptions={["bubble-sort", "selection-sort", "insertion-sort"]}
            initialInput={[5, 2, 8, 1, 9, 3, 7, 4]}
          />
        </motion.div>
      </div>
    </section>
  );
}
