import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading index="03" title="Projects" kicker="Selected" />
      <p className="mb-16 max-w-2xl text-lg text-muted">
        Work that moved a metric, a market, or a clinical workflow.
      </p>
      <div className="flex flex-col">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group grid gap-6 border-t border-line py-10 md:grid-cols-12"
          >
            <div className="md:col-span-4">
              <p className="eyebrow">
                {String(i + 1).padStart(2, "0")} / {project.domain}
              </p>
              <p className="mt-3 text-sm text-faint">{project.year}</p>
              <p className="mt-1 text-sm text-brass">{project.client}</p>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-display text-3xl font-semibold group-hover:text-accent md:text-4xl">
                {project.title}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                {project.blurb}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[11px] tracking-[0.16em] uppercase text-faint">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
