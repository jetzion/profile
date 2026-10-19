"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { nav, site } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center px-5 py-4 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-lg font-semibold tracking-tight">
            {site.initials}
          </span>
          <span className="hidden text-xs tracking-wide text-muted sm:inline">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`eyebrow relative transition-colors ${
                  active
                    ? "is-active underline decoration-accent decoration-2 underline-offset-8"
                    : "hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />
          <Link
            href={site.resumeHref}
            className={`hidden border px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase transition-colors sm:inline ${
              pathname === site.resumeHref
                ? "border-accent bg-accent text-bg"
                : "border-line-strong text-ink hover:border-accent hover:bg-accent hover:text-bg"
            }`}
          >
            Resume
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border border-line lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-bg px-5 py-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`font-display text-3xl font-semibold ${
                    active ? "text-accent" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href={site.resumeHref} className="eyebrow mt-4 text-accent">
              Resume
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
