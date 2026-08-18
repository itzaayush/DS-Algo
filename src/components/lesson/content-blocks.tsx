import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { ContentBlock } from "@/lib/schema";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

const calloutStyles = {
  info: { cls: "border-secondary/30 bg-secondary/10", icon: Info, iconCls: "text-secondary" },
  success: { cls: "border-success/30 bg-success/10", icon: CheckCircle2, iconCls: "text-success" },
  warning: { cls: "border-accent/30 bg-accent/10", icon: AlertTriangle, iconCls: "text-accent" },
  danger: { cls: "border-danger/30 bg-danger/10", icon: XCircle, iconCls: "text-danger" },
} as const;

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h3 key={i} className="font-display text-xl font-semibold text-foreground">
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="text-[15px] leading-7 text-foreground/85">
                {block.text}
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={i} className="ml-5 list-decimal space-y-1.5 text-[15px] text-foreground/85 marker:text-primary-soft">
                {block.items.map((it, j) => (
                  <li key={j} className="pl-1">{it}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="space-y-1.5 text-[15px] text-foreground/85">
                {block.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          case "callout": {
            const s = calloutStyles[block.tone];
            const Icon = s.icon;
            return (
              <div key={i} className={cn("flex gap-3 rounded-[var(--radius-lg)] border p-4", s.cls)}>
                <Icon className={cn("mt-0.5 size-5 shrink-0", s.iconCls)} />
                <div>
                  <p className="font-semibold text-foreground">{block.title}</p>
                  <p className="mt-1 text-sm text-foreground/80">{block.text}</p>
                </div>
              </div>
            );
          }
          case "code":
            return <CodeBlock key={i} code={block.code} lang={block.language} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
