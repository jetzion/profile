import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { portfolioSlots, projects, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading index="04" title="Portfolio" kicker="Archive" />
      <p className="max-w-2xl text-lg text-muted">
        This is the public shelf for deeper work: case studies, decks, and
        product artifacts. It is intentionally unfinished. Links below are
        live project briefs; the numbered bays are reserved for future pieces.
      </p>

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        {portfolioSlots.map((slot) => (
          <div
            key={slot.code}
            className="relative min-h-[240px] border border-dashed border-line-strong p-8"
          >
            <p className="eyebrow">{slot.code}</p>
            <h2 className="font-display mt-6 text-3xl font-semibold">{slot.title}</h2>
            <p className="mt-4 max-w-sm text-sm text-muted">{slot.note}</p>
            <p className="absolute bottom-8 right-8 text-[11px] tracking-[0.2em] uppercase text-faint">
              Coming soon
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <p className="eyebrow">Currently linked</p>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="flex items-center justify-between py-4 hover:text-accent"
              >
                <span>{project.title}</span>
                <span className="text-xs text-faint">{project.client}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-16 text-sm text-muted">
        To contribute a public case study later, drop files into this archive
        or write to{" "}
        <a href={`mailto:${site.email}`} className="link-line text-ink">
          {site.email}
        </a>
        .
      </p>
    </div>
  );
}
