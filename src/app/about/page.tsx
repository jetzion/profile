import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { about, education, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading index="01" title="About me" kicker="Biography" />

      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="border border-line bg-bg-2 p-8">
            <Image
              src={site.photo}
              alt={`Portrait of ${site.name}`}
              width={746}
              height={983}
              sizes="160px"
              className="w-40 border border-b-[3px] border-line border-b-brass bg-bg pt-3"
            />
            <p className="mt-8 text-sm text-muted">{site.location}</p>
            <p className="mt-1 text-sm">{site.title}</p>
            <div className="mt-8 space-y-1 text-sm">
              <a href={`mailto:${site.email}`} className="link-line block">
                {site.email}
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="link-line block"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-muted md:col-span-8">
          <p className="font-display text-3xl leading-tight text-ink">{about.lead}</p>
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-24 grid gap-px bg-line md:grid-cols-3">
        {about.principles.map((item) => (
          <div key={item.title} className="bg-bg p-8">
            <p className="eyebrow">Principle</p>
            <h3 className="font-display mt-4 text-2xl font-semibold">{item.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-24 grid gap-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">Languages</p>
          <ul className="mt-6 space-y-3">
            {about.languages.map((lang) => (
              <li key={lang.name} className="flex justify-between border-b border-line pb-3">
                <span>{lang.name}</span>
                <span className="text-muted">{lang.level}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Education</p>
          <ul className="mt-6 space-y-3">
            {education.map((ed) => (
              <li key={ed.school} className="border-b border-line pb-3">
                <p>{ed.school}</p>
                <p className="text-sm text-muted">{ed.focus}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-24">
        <p className="eyebrow">Certifications</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {about.certifications.map((c) => (
            <span
              key={c}
              className="border border-line px-3 py-2 text-xs tracking-wide text-muted"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <p className="eyebrow">Operating stack</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {about.skills.map((skill) => (
            <span
              key={skill}
              className="bg-bg-2 px-3 py-2 text-xs tracking-[0.12em] uppercase text-ink"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
