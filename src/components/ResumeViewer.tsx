"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

export function ResumeViewer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    async function render() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const bytes = new Uint8Array(
          await (await fetch(site.resumeFile)).arrayBuffer(),
        );
        const pdf = await pdfjs.getDocument({
          data: bytes,
          useWasm: false,
          useWorkerFetch: false,
          isOffscreenCanvasSupported: false,
        }).promise;

        if (!host || cancelled) return;
        host.replaceChildren();

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const base = page.getViewport({ scale: 1 });
          const width = Math.min(host.clientWidth || 800, 900);
          const viewport = page.getViewport({ scale: width / base.width });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "mb-8 w-full bg-white";
          await page.render({ canvasContext: context, viewport, canvas }).promise;
          if (cancelled) return;
          host.appendChild(canvas);
        }
        setStatus("ready");
      } catch (error) {
        console.error("Resume render failed", error);
        setStatus("error");
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {status === "loading" ? (
        <p className="eyebrow mb-6">Loading resume…</p>
      ) : null}
      {status === "error" ? (
        <p className="mb-6 text-sm text-brass">
          The preview could not be rendered.{" "}
          <a href={site.resumeFile} className="link-line text-ink">
            Open the PDF file
          </a>
          .
        </p>
      ) : null}
      <div ref={hostRef} className="mx-auto max-w-[900px]" />
    </div>
  );
}
