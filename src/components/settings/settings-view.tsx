"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Accessibility,
  Contrast,
  Download,
  Gauge,
  Volume2,
  Wifi,
  TriangleAlert,
} from "lucide-react";
import { useProgress } from "@/store/progress-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function Row({
  icon: Icon,
  title,
  desc,
  checked,
  onChange,
  id,
}: {
  icon: typeof Gauge;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <label htmlFor={id} className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-surface-2 text-primary-soft">
          <Icon className="size-4.5" />
        </span>
        <span>
          <span className="block font-medium">{title}</span>
          <span className="block text-sm text-muted">{desc}</span>
        </span>
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function SettingsView() {
  const hydrated = useHydrated();
  const settings = useProgress((s) => s.settings);
  const update = useProgress((s) => s.updateSettings);
  const resetProgress = useProgress((s) => s.resetProgress);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function exportData() {
    // Drop action functions; keep only serializable progress data.
    const data = JSON.stringify(
      useProgress.getState(),
      (_k, v) => (typeof v === "function" ? undefined : v),
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "algoquest-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const s = hydrated ? settings : { reducedMotion: false, highContrast: false, sound: true, lowBandwidth: false };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Accessibility className="size-5 text-success" /> Accessibility & motion
        </h2>
        <div className="mt-2 divide-y divide-border">
          <Row
            id="reduced-motion"
            icon={Gauge}
            title="Reduce motion"
            desc="Replace camera flights, particles, and large transitions with instant changes."
            checked={s.reducedMotion}
            onChange={(v) => update({ reducedMotion: v })}
          />
          <Row
            id="high-contrast"
            icon={Contrast}
            title="High contrast"
            desc="Increase contrast for text and interface elements."
            checked={s.highContrast}
            onChange={(v) => update({ highContrast: v })}
          />
          <Row
            id="sound"
            icon={Volume2}
            title="Sound effects"
            desc="Play a short chime when you unlock an achievement."
            checked={s.sound}
            onChange={(v) => update({ sound: v })}
          />
          <Row
            id="low-bandwidth"
            icon={Wifi}
            title="Low-bandwidth mode"
            desc="Prefer transcripts, poster images, and lighter media."
            checked={s.lowBandwidth}
            onChange={(v) => update({ lowBandwidth: v })}
          />
        </div>
        <p className="mt-3 text-xs text-faint">
          Motion also follows your operating system's reduce-motion setting automatically.
        </p>
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Download className="size-5 text-secondary" /> Your data
        </h2>
        <p className="mt-1 text-sm text-muted">
          Your progress lives on this device (and would sync to your account in the full product). You
          own it — export or reset anytime.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="size-4" /> Export progress (JSON)
          </Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            <TriangleAlert className="size-4" /> Reset progress
          </Button>
        </div>
      </Card>

      {/* Reset confirmation */}
      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-2xl">
            <Dialog.Title className="flex items-center gap-2 font-display text-lg font-semibold">
              <TriangleAlert className="size-5 text-danger" /> Reset all progress?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted">
              This clears completed lessons, quiz mastery, practice status, bookmarks, achievements,
              and game progress. Your accessibility settings and learning path are kept. This can't be
              undone here.
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button
                variant="danger"
                onClick={() => {
                  resetProgress();
                  setConfirmOpen(false);
                }}
              >
                Yes, reset everything
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
