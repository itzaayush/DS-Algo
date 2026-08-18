import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import { Adventure } from "@/components/adventure/adventure";

export const metadata: Metadata = {
  title: "Adventure",
  description: "A Three.js concept game where completing lessons unlocks 3D challenges. Full 2D fallback included.",
};

export default function AdventurePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <Gamepad2 className="size-3.5" /> Three.js Adventure
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Learn it, then play it
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Each world reinforces a concept you've studied. Click a tower to pick it up, click another
          to swap — bring the heights into ascending order to clear the level. Prefer no 3D? Every
          level has a 2D version with the same completion credit.
        </p>
      </header>

      <Adventure />
    </div>
  );
}
