import * as React from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "danger"
  | "muted";

const tones: Record<Tone, string> = {
  default: "bg-surface-2 text-foreground border-border",
  primary: "bg-primary/15 text-primary-soft border-primary/30",
  secondary: "bg-secondary/15 text-secondary border-secondary/30",
  accent: "bg-accent/15 text-accent border-accent/30",
  success: "bg-success/15 text-success border-success/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  muted: "bg-surface text-muted border-border",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
