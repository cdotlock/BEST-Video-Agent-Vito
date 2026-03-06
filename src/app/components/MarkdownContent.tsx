"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 list-disc pl-5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal pl-5 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
          h1: ({ children }) => <h1 className="mb-3 font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[18px] font-semibold text-[var(--af-text)]">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-3 font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[16px] font-semibold text-[var(--af-text)]">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--af-muted)]">{children}</h3>,
          blockquote: ({ children }) => <blockquote className="mb-3 rounded-r-2xl border-l-[3px] border-[var(--af-accent)] bg-[rgba(201,139,91,0.08)] px-3 py-2 text-[var(--af-muted)]">{children}</blockquote>,
          code: ({ className, children }) => {
            const text = String(children);
            const isBlock = (typeof className === "string" && className.includes("language-"))
              || text.includes("\n");
            if (!isBlock) {
              return <code className="rounded-full bg-[rgba(47,107,95,0.08)] px-2 py-0.5 text-[11px] text-[var(--af-text)]">{children}</code>;
            }
            return <code className="block overflow-x-auto rounded-[18px] bg-[#2a2621] p-3 text-[11px] text-[#f7f1ea]">{children}</code>;
          },
          pre: ({ children }) => <pre className="mb-3 overflow-x-auto last:mb-0">{children}</pre>,
          table: ({ children }) => <table className="mb-3 w-full border-collapse overflow-hidden rounded-2xl text-[11px] last:mb-0">{children}</table>,
          th: ({ children }) => <th className="border border-[var(--af-border)] bg-[rgba(47,107,95,0.08)] px-2 py-1.5 text-left text-[var(--af-text)]">{children}</th>,
          td: ({ children }) => <td className="border border-[var(--af-border)] px-2 py-1.5 align-top text-[var(--af-muted)]">{children}</td>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-[var(--af-brand)] underline decoration-[rgba(47,107,95,0.35)] underline-offset-4">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
