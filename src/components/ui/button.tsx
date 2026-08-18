import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "subtle";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(124,92,255,0.4),0_10px_30px_-12px_rgba(124,92,255,0.8)] hover:bg-primary-soft",
  secondary: "bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary/25",
  outline: "border border-border-strong bg-surface/40 text-foreground hover:bg-surface-2 hover:border-primary/50",
  ghost: "text-muted hover:text-foreground hover:bg-surface-2",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
  subtle: "bg-surface-2 text-foreground hover:bg-surface-3",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
}: { variant?: Variant; size?: Size } = {}) {
  return cn(base, variants[variant], sizes[size]);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
