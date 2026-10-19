import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TwinChat } from "@/components/TwinChat";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Digital Twin",
};

export default function TwinPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <SectionHeading index="05" title="Digital Twin" kicker="Ask Jack" />
      <p className="mb-10 max-w-2xl text-lg text-muted">
        A conversational stand-in, trained on Jack’s public career record. Use
        it to probe the résumé, not to replace a conversation with the person.{" "}
        <Link href="/fit" className="link-line text-ink">
          Hiring? Check my fit for your role →
        </Link>
      </p>
      <Suspense fallback={<div className="min-h-[70vh] border border-line bg-bg-2" />}>
        <TwinChat />
      </Suspense>
    </div>
  );
}
