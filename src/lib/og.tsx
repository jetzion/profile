import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

const [syne, geist] = await Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/Syne-Bold.ttf")),
  readFile(join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf")),
]);

const photoDataUrl = `data:image/png;base64,${await readFile(join(process.cwd(), "public", site.photo), "base64")}`;

/** Branded 1200x630 share card in the site's dark palette, optionally with the portrait. */
export async function renderOg({
  eyebrow,
  title,
  subtitle,
  photo = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  photo?: boolean;
}) {
  const photoSrc = photo ? photoDataUrl : null;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#070706",
          backgroundImage:
            "linear-gradient(to right, rgba(244,240,230,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,240,230,0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          color: "#f4f0e6",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, background: "#d6ff4a" }} />
          <div style={{ fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: "#c4a574" }}>
            {eyebrow}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          {photoSrc ? (
            <div
              style={{
                display: "flex",
                paddingTop: 12,
                background: "#10100e",
                border: "1px solid rgba(244,240,230,0.18)",
                borderBottom: "4px solid #c4a574",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc} width={210} height={277} alt="" />
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>
            <div
              style={{
                fontFamily: "Syne",
                fontSize: title.length > 28 ? 76 : 112,
                lineHeight: 0.95,
                letterSpacing: -4,
                maxWidth: 1000,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.35, color: "#aaa497", maxWidth: 940 }}>
              {subtitle}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(244,240,230,0.18)",
            paddingTop: 28,
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>
            {site.name} · {site.title}
          </div>
          <div style={{ display: "flex", color: "#d6ff4a" }}>Ask my Digital Twin →</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Syne", data: syne, weight: 700, style: "normal" },
        { name: "Geist", data: geist, weight: 400, style: "normal" },
      ],
    },
  );
}

/** Square "JE" monogram used for the favicon and Apple touch icon. */
export async function renderMonogram(px: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070706",
          color: "#d6ff4a",
          fontFamily: "Syne",
          fontSize: px * 0.5,
          letterSpacing: -px * 0.03,
        }}
      >
        {site.initials}
      </div>
    ),
    { width: px, height: px, fonts: [{ name: "Syne", data: syne, weight: 700, style: "normal" }] },
  );
}
