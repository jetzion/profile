import ReactMarkdown from "react-markdown";

/** Render model output as Markdown styled with the site tokens. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-ink md:text-base">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h3 className="font-display mt-6 text-2xl font-semibold">{children}</h3>,
          h2: ({ children }) => <h3 className="font-display mt-6 text-xl font-semibold">{children}</h3>,
          h3: ({ children }) => <h4 className="eyebrow mt-6">{children}</h4>,
          ul: ({ children }) => <ul className="space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="space-y-2">{children}</ol>,
          li: ({ children }) => (
            <li className="flex gap-3">
              <span className="mt-2.5 h-1 w-1 shrink-0 bg-accent" />
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} className="link-line text-accent">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
