"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/store/progress-store";

/**
 * Combines the OS `prefers-reduced-motion` signal with the in-app persisted
 * setting. Either one enables reduced motion (never overrides the OS toward
 * more motion). Safe during SSR — defaults to `false`.
 */
export function usePrefersReducedMotion() {
  const appSetting = useProgress((s) => s.settings.reducedMotion);
  const [osReduced, setOsReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setOsReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setOsReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return osReduced || appSetting;
}
