"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useProgress } from "@/store/progress-store";
import { getAchievement } from "@/content/achievements";
import { cn } from "@/lib/utils";

export function AchievementToaster() {
  const lastAwarded = useProgress((s) => s.lastAwarded);
  const clear = useProgress((s) => s.clearLastAwarded);
  const sound = useProgress((s) => s.settings.sound);

  const def = lastAwarded ? getAchievement(lastAwarded.key) : null;

  useEffect(() => {
    if (!lastAwarded) return;
    if (sound) {
      // Tiny synthesized chime — no asset needed.
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        [660, 880, 1320].forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = f;
          o.type = "triangle";
          o.connect(g);
          g.connect(ctx.destination);
          const t = ctx.currentTime + i * 0.09;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
          o.start(t);
          o.stop(t + 0.24);
        });
      } catch {
        /* audio not available — silent */
      }
    }
    const timeout = setTimeout(clear, 5000);
    return () => clearTimeout(timeout);
  }, [lastAwarded, sound, clear]);

  const tone = def?.tone ?? "primary";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {def && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-[var(--radius-lg)] border bg-surface-2/95 px-4 py-3 shadow-2xl backdrop-blur",
              tone === "primary" && "border-primary/40",
              tone === "secondary" && "border-secondary/40",
              tone === "accent" && "border-accent/40",
              tone === "success" && "border-success/40"
            )}
          >
            <span
              className={cn(
                "grid size-11 place-items-center rounded-[var(--radius-md)]",
                tone === "primary" && "bg-primary/20 text-primary-soft",
                tone === "secondary" && "bg-secondary/20 text-secondary",
                tone === "accent" && "bg-accent/20 text-accent",
                tone === "success" && "bg-success/20 text-success"
              )}
            >
              <def.icon className="size-6" />
            </span>
            <div className="pr-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Achievement unlocked · +{def.points} XP
              </p>
              <p className="font-display font-semibold text-foreground">{def.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
