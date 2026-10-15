import type { Metadata } from "next";
import { ResumeViewer } from "@/components/ResumeViewer";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Resume",
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="mb-10 flex flex-col gap-6 border-b border-line pb-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">00 — PDF</p>
          <h1 className="font-display mt-2 text-4xl font-semibold md:text-5xl">Resume</h1>
        </div>
        <a
          href={site.resumeFile}
          download="Jack-Etzion-Resume.pdf"
          className="shrink-0 border border-line-strong px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Download PDF
        </a>
      </div>
      <ResumeViewer />
    </div>
  );
}
