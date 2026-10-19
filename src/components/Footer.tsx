import Link from "next/link";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="print:hidden mt-auto border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-2xl font-semibold">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            {site.title}. {site.location}.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="link-line w-fit">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <a href={`mailto:${site.email}`} className="link-line w-fit">
            {site.email}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="link-line w-fit"
          >
            LinkedIn
          </a>
          <Link href={site.resumeHref} className="link-line w-fit">
            Resume
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-[11px] tracking-[0.14em] uppercase text-faint md:px-8">
          <span>© 2026 {site.name}</span>
          <span>Enterprise, with an edge</span>
        </div>
      </div>
    </footer>
  );
}
