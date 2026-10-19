import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { projects } from "@/content/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project?.title ?? "Project" };
}

export default function ProjectPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <p className="eyebrow mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          Loading project…
        </p>
      }
    >
      <ProjectDetail params={params} />
    </Suspense>
  );
}

async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <Link href="/projects" className="eyebrow link-line">
        ← All projects
      </Link>
      <p className="eyebrow mt-10">
        {project.domain} — {project.year}
      </p>
      <h1 className="font-display mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] md:text-7xl">
        {project.title}
      </h1>
      <p className="mt-6 text-brass">{project.client}</p>

      <div className="mt-16 grid gap-12 border-t border-line pt-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow">Impact</p>
          <ul className="mt-6 space-y-4">
            {project.impact.map((item) => (
              <li key={item} className="border-b border-line pb-4 text-sm">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="border border-line px-2 py-1 text-[11px] uppercase tracking-wider text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-muted md:col-span-8">
          {project.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="border border-dashed border-line-strong bg-bg-2 p-6 text-sm text-ink">
            Extended case materials — research, roadmaps, and interface work —
            will be published in the{" "}
            <Link href="/portfolio" className="link-line text-accent">
              portfolio
            </Link>{" "}
            as they are cleared.
          </p>
        </div>
      </div>

      <div className="mt-24 flex items-end justify-between border-t border-line pt-10">
        <div>
          <p className="eyebrow">Next</p>
          <Link href={`/projects/${next.slug}`} className="font-display mt-2 block text-3xl hover:text-accent">
            {next.title}
          </Link>
        </div>
      </div>
    </article>
  );
}
