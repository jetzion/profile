import type { MetadataRoute } from "next";
import { projects, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/journey", "/projects", "/twin", "/fit", "/resume"];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}`, priority: path ? 0.8 : 1 })),
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, priority: 0.6 })),
  ];
}
