import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { education, journey } from "@/content/site";

export const metadata: Metadata = {
  title: "Career journey",
};

export default function JourneyPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading index="02" title="Career journey" kicker="Timeline" />
      <p className="mb-16 max-w-2xl text-lg text-muted">
        A long arc from hardware-plus-software product houses to enterprise
        digital transformation, then into AI-native healthcare. Each chapter
        compounded the last: markets, products, and the people who have to live
        with both.
      </p>

      <ol className="relative">
        {journey.map((role, i) => (
          <li
            key={role.id}
            className="grid gap-6 border-t border-line py-12 md:grid-cols-12"
          >
            <div className="md:col-span-4">
              <p className="eyebrow">
                {String(i + 1).padStart(2, "0")} — {role.period}
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold">{role.company}</h2>
              <p className="mt-2 text-brass">{role.role}</p>
              <p className="mt-2 text-sm text-faint">{role.location}</p>
              {role.aka ? (
                <p className="mt-1 text-xs text-faint">{role.aka}</p>
              ) : null}
            </div>
            <div className="md:col-span-8">
              <p className="text-base leading-relaxed text-ink">{role.summary}</p>
              <ul className="mt-6 space-y-3">
                {role.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t border-line pt-12">
        <p className="eyebrow">Education</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {education.map((ed) => (
            <div key={ed.school} className="border border-line p-6">
              <p className="font-medium">{ed.school}</p>
              <p className="mt-2 text-sm text-muted">{ed.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
