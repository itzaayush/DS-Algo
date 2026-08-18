"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "motion/react";
import { Flame, Menu, X } from "lucide-react";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/lib/nav";
import { Logo } from "./logo";
import { useProgress, selectXp, selectLevel } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

function LevelPill() {
  const hydrated = useHydrated();
  const xp = useProgress(selectXp);
  const streak = useProgress((s) => s.currentStreak);
  const { level, pct } = selectLevel(xp);

  if (!hydrated) {
    return <div className="h-9 w-28 animate-pulse rounded-full bg-surface-2" aria-hidden />;
  }

  return (
    <div className="flex items-center gap-2">
      {streak > 0 && (
        <span className="hidden items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent sm:inline-flex">
          <Flame className="size-3.5" /> {streak}
        </span>
      )}
      <div className="relative flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
        <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          {level}
        </span>
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-3">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="AlgoQuest home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-[var(--radius-md)] bg-surface-2"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LevelPill />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                className="grid size-10 place-items-center rounded-[var(--radius-md)] border border-border bg-surface text-muted hover:text-foreground lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col gap-1 border-l border-border bg-surface p-4 shadow-2xl">
                <div className="mb-2 flex items-center justify-between">
                  <Logo />
                  <Dialog.Close asChild>
                    <button className="grid size-9 place-items-center rounded-[var(--radius-md)] text-muted hover:text-foreground" aria-label="Close menu">
                      <X className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                {[...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm transition-colors",
                        active ? "bg-primary/15 text-primary-soft" : "text-muted hover:bg-surface-2 hover:text-foreground"
                      )}
                    >
                      <item.icon className="size-4.5" />
                      <span>
                        <span className="block font-medium">{item.label}</span>
                        <span className="block text-xs text-faint">{item.description}</span>
                      </span>
                    </Link>
                  );
                })}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
