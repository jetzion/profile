import { site } from "@/content/site";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `Does ${site.name} fit your role?`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "For recruiters",
    title: "Does Jack fit your role?",
    subtitle: "Paste a job description. Get an honest, evidence-backed fit analysis in seconds.",
  });
}
