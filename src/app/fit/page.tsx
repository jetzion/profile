import type { Metadata } from "next";
import { FitCheck } from "@/components/FitCheck";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Role fit",
  description: "Paste a job description and get an honest, evidence-backed fit analysis.",
};

export default function FitPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24 print:max-w-none print:p-0">
      <div className="print:hidden">
        <SectionHeading index="06" title="Does Jack fit this role?" kicker="For recruiters" />
        <p className="mb-10 max-w-2xl text-lg text-muted">
          Paste a job description. The Digital Twin maps each requirement to evidence
          from my record, rates the match, and names the gaps plainly. Save the result
          as a one-page PDF for your hiring team.
        </p>
      </div>
      <FitCheck />
    </div>
  );
}
