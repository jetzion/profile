"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { twinStarters } from "@/content/site";

/** Hero input that hands a question to the Digital Twin page. */
export function HeroAsk() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHint((i) => (i + 1) % twinStarters.length), 3200);
    return () => clearInterval(id);
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = question.trim() || twinStarters[hint];
    router.push(`/twin?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-3xl">
      <label htmlFor="hero-ask" className="eyebrow flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        Ask my Digital Twin
      </label>
      <div className="mt-3 flex border border-brass/50 bg-(--input-bg) shadow-[inset_3px_0_0_0_var(--brass)] transition-colors focus-within:border-accent focus-within:shadow-[inset_3px_0_0_0_var(--accent)]">
        <input
          id="hero-ask"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={twinStarters[hint]}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-5 py-4 text-base text-ink caret-accent outline-none placeholder:text-muted md:text-lg"
        />
        <button
          type="submit"
          className="bg-accent px-6 text-sm font-medium tracking-wide text-bg transition-opacity hover:opacity-90"
        >
          Ask
        </button>
      </div>
      <p className="mt-2 text-xs text-faint">
        Answers in first person, grounded in my résumé and project record.
      </p>
    </form>
  );
}
