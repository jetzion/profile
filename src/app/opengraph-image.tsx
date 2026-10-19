import { site } from "@/content/site";
import { ogSize, renderOg } from "@/lib/og";

export const alt = `${site.name}, ${site.title}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: site.kicker, title: site.name, subtitle: site.headline });
}
