import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Accessibility preferences and control over your learning data.",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
        <p className="mt-2 text-muted">Tune the experience to how you learn, and stay in control of your data.</p>
      </header>
      <SettingsView />
    </div>
  );
}
