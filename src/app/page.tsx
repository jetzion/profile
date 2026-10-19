import Image from "next/image";
import Link from "next/link";
import { HeroAsk } from "@/components/HeroAsk";
import { SectionHeading } from "@/components/SectionHeading";
import { about, projects, site, stats } from "@/content/site";

export default function Home() {
  const featured = projects.slice(0, 4);

  return (
    <div>
      <section className="relative border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-frame opacity-30" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-accent" />
            <p className="eyebrow">{site.kicker}</p>
          </div>
          <div className="mt-8 flex items-center gap-5 md:gap-10">
            <div className="w-24 shrink-0 overflow-hidden border border-b-[3px] border-line border-b-brass bg-bg-2 pt-3 md:w-40 lg:w-48 lg:pt-5">
              <Image
                src="/Jack.png"
                alt={`Portrait of ${site.name}`}
                width={746}
                height={983}
                sizes="(min-width: 1024px) 192px, (min-width: 768px) 160px, 96px"
                fetchPriority="high"
                className="w-full"
              />
            </div>
            <h1 className="font-display text-[clamp(3.4rem,11vw,7.6rem)] font-semibold leading-[0.84] tracking-[-0.06em]">
              <span className="block">Jack</span>
              <span className="block">Etzion</span>
            </h1>
          </div>
          <div className="mt-10 grid gap-8 border-t border-line pt-8 lg:grid-cols-12">
            <p className="font-display text-2xl font-medium text-brass lg:col-span-4 lg:text-3xl">
              {site.title}
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-muted lg:col-span-8 lg:text-lg">
              {site.headline} {site.subhead}
            </p>
          </div>
          <HeroAsk />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="bg-accent px-6 py-3 text-sm font-medium tracking-wide text-bg transition-transform hover:-translate-y-0.5"
            >
              View selected work
            </Link>
            <Link
              href="/about"
              className="border border-line-strong px-6 py-3 text-sm tracking-wide hover:border-accent"
            >
              About Jack
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="px-6 py-3 text-sm tracking-wide text-muted hover:text-ink"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>

      <div className="marquee overflow-hidden border-b border-line bg-bg-2 py-5">
        <div className="marquee-track gap-12 pr-12 text-[15px] leading-none tracking-normal text-ink sm:text-base">
          {[...about.skills, ...about.skills].map((skill, i) => (
            <span key={`${skill}-${i}`} className="flex shrink-0 items-center gap-12">
              {skill}
              <span className="text-accent" aria-hidden>
                /
              </span>
            </span>
          ))}
        </div>
      </div>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0 bg-bg px-5 py-8 md:px-8">
              <p className="font-display text-3xl font-semibold md:text-4xl">{stat.value}</p>
              <p className="mt-3 text-sm leading-snug text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading index="01" title="About" kicker="The brief" />
        <div className="grid gap-12 md:grid-cols-12">
          <p className="font-display text-3xl leading-tight md:col-span-5 md:text-4xl">
            {about.lead}
          </p>
          <div className="space-y-5 text-base leading-relaxed text-muted md:col-span-7">
            {about.paragraphs.slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
            <Link href="/about" className="link-line mt-4 inline-block text-ink">
              Full biography →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg-2">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <SectionHeading index="02" title="Selected work" kicker="Projects" />
          <div className="grid gap-px bg-line md:grid-cols-2">
            {featured.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group bg-bg-2 p-8 transition-colors hover:bg-bg hover:shadow-[inset_3px_0_0_0_var(--accent)]"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow">
                    0{i + 1} — {project.domain}
                  </span>
                  <span className="text-xs text-faint">{project.year}</span>
                </div>
                <h3 className="font-display mt-8 text-3xl font-semibold group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                  {project.blurb}
                </p>
                <p className="mt-8 text-xs tracking-[0.16em] uppercase text-brass">
                  {project.client}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/projects" className="link-line text-ink">
              All projects →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading index="03" title="Career arc" kicker="Journey" />
        <p className="max-w-2xl text-lg text-muted">
          From imaging kiosks and national retail to Fortune 500 IoT, then into
          clinical AI and autism-care systems. The roles changed. The pattern
          did not: find the real constraint, build the product around it, grow
          the business.
        </p>
        <Link href="/journey" className="link-line mt-8 inline-block text-ink">
          Walk the timeline →
        </Link>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
          <div>
            <p className="eyebrow">Next</p>
            <h2 className="font-display mt-3 text-4xl font-semibold md:text-6xl">
              Let’s build the
              <br />
              next one.
            </h2>
          </div>
          <div className="flex flex-col gap-3 text-sm md:items-end">
            <a href={`mailto:${site.email}`} className="bg-accent px-6 py-3 text-bg">
              {site.email}
            </a>
            <Link href="/twin" className="text-muted hover:text-ink">
              Ask the Digital Twin
            </Link>
            <Link href="/fit" className="text-muted hover:text-ink">
              Does Jack fit your role?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
