"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@/store/progress-store";

/**
 * Returns true once the persisted store has rehydrated from localStorage.
 * Use this to gate rendering of progress-dependent UI and avoid SSR/client
 * hydration mismatches.
 */
export function useHydrated() {
  const hasHydrated = useProgress((s) => s._hasHydrated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && hasHydrated;
}
