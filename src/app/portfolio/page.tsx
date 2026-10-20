import type { Metadata } from "next";
import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { SectionHeading } from "@/components/SectionHeading";
import { caseStudies } from "@/content/site";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading index="04" title="Portfolio" kicker="Case studies" />
      <p className="max-w-2xl text-lg text-muted">
        How the work actually went: the problem, the calls I made, and what
        came out the other side.
      </p>

      <div className="mt-16 space-y-20">
        {caseStudies.map((study, i) => (
          <article
            key={study.slug}
            className="grid gap-8 border-t border-line pt-10 md:grid-cols-12"
          >
            <div className="md:col-span-4">
              <p className="eyebrow">Case study {String(i + 1).padStart(2, "0")}</p>
              <p className="mt-6 text-sm tracking-wide text-brass">{study.client}</p>
              <h2 className="font-display mt-2 text-3xl font-semibold leading-tight">
                {study.title}
              </h2>
              <Link
                href={`/projects/${study.slug}`}
                className="link-line mt-6 inline-block text-sm text-muted hover:text-ink"
              >
                Project brief →
              </Link>
            </div>
            <div className="md:col-span-8">
              <Markdown>{study.body}</Markdown>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
