import { projects, site } from "@/content/site";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `Project by ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  return renderOg({
    eyebrow: `${project.client} · ${project.domain}`,
    title: project.title,
    subtitle: project.impact.join("  ·  "),
  });
}
