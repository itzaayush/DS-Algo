import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0..100
  className?: string;
  barClassName?: string;
  label?: string;
}

export function ProgressBar({ value, className, barClassName, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-3", className)}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500 ease-out",
          barClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
