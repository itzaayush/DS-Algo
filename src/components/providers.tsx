"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useProgress } from "@/store/progress-store";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { AchievementToaster } from "@/components/achievement-toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const highContrast = useProgress((s) => s.settings.highContrast);
  const recordActivity = useProgress((s) => s.recordActivity);

  // Reflect settings on <html> for global CSS hooks.
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? "high" : "normal";
  }, [highContrast]);

  // Count today's visit toward the learning streak.
  useEffect(() => {
    recordActivity();
  }, [recordActivity]);

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <Tooltip.Provider delayDuration={200} skipDelayDuration={300}>
        {children}
        <AchievementToaster />
      </Tooltip.Provider>
    </MotionConfig>
  );
}
