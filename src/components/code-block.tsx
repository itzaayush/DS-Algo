import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";

interface Props {
  code: string;
  lang?: string;
  className?: string;
}

/** Server-rendered syntax highlighting (Shiki). Zero client JS. */
export async function CodeBlock({ code, lang = "javascript", className }: Props) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark-default",
    transformers: [
      {
        pre(node) {
          node.properties.class = cn(
            "overflow-auto rounded-[var(--radius-md)] border border-border !bg-[#0a0e17] p-4 text-[13px] leading-relaxed",
            className
          );
        },
      },
    ],
  });

  return <div className="not-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
