import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "Get started",
  description: "A short onboarding to recommend your starting point.",
};

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <OnboardingFlow />
    </div>
  );
}
