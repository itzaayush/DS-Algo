"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Lightweight C++/JS highlighter for the live trace (our own trusted strings).
function highlight(line: string) {
  let s = escapeHtml(line);
  s = s.replace(/(\/\/.*$)/g, '<span class="text-faint italic">$1</span>');
  s = s.replace(
    /\b(for|while|if|else|return|break|continue|do|switch|case|function|const|let|var|new|of|in)\b/g,
    '<span class="text-primary-soft">$1</span>'
  );
  s = s.replace(
    /\b(int|bool|void|auto|long|char|double|float|vector|string|unordered_set|unordered_map|set|map|pair|size_t|true|false|null|nullptr)\b/g,
    '<span class="text-secondary">$1</span>'
  );
  s = s.replace(/\b(\d+)\b/g, '<span class="text-accent">$1</span>');
  return s;
}

interface Props {
  code: string;
  activeLine: number;
  className?: string;
}

export function CodeTrace({ code, activeLine, className }: Props) {
  const lines = code.split("\n");
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeLine]);

  return (
    <div
      className={cn(
        "overflow-auto rounded-[var(--radius-md)] border border-border bg-[#0a0e17] font-mono text-[13px] leading-relaxed",
        className
      )}
    >
      <pre className="min-w-max">
        <code>
          {lines.map((line, i) => {
            const lineNo = i + 1;
            const active = lineNo === activeLine;
            return (
              <div
                key={i}
                ref={active ? activeRef : undefined}
                className={cn(
                  "flex gap-3 px-3 transition-colors",
                  active
                    ? "border-l-2 border-secondary bg-secondary/10"
                    : "border-l-2 border-transparent"
                )}
                aria-current={active ? "step" : undefined}
              >
                <span className="select-none text-right text-faint" style={{ minWidth: "2ch" }}>
                  {lineNo}
                </span>
                <span
                  className={active ? "text-foreground" : "text-muted"}
                  dangerouslySetInnerHTML={{ __html: highlight(line) || "&nbsp;" }}
                />
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
