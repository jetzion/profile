@AGENTS.md

# Jack Etzion personal site

Portfolio and resume site for Jack Etzion (Product Leader), with an AI "Digital
Twin" chat that answers questions about his career in the first person.

## Stack

- Next.js 16.4 (App Router, Turbopack, `cacheComponents`, `partialPrefetching`)
- React 19.3, TypeScript (strict), path alias `@/*` -> `src/*`
- Tailwind CSS v4 via `@tailwindcss/turbopack` (no `tailwind.config`; theme lives in `globals.css`)
- `pdfjs-dist` for the in-page resume viewer, `react-markdown` for Twin replies
- OpenRouter chat completions API for the Digital Twin and role-fit check
- `next/og` `ImageResponse` for share cards and icons
- npm (`package-lock.json`); ESLint 9 flat config with `eslint-config-next`

Next.js 16 differs from older versions. Check `node_modules/next/dist/docs/`
before using an API you are unsure of (see `AGENTS.md`).

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint
npx tsc --noEmit
```

`.env` (gitignored) must define `OPENROUTER_API_KEY` for the Twin.

`next dev` sometimes keeps serving stale modules or CSS after edits. If a change
does not show up, restart the dev server. For final verification use
`npm run build && npx next start -p 3001`.

## Layout

```
src/
  content/site.ts        Single source of truth for all copy and data:
                         site (incl. site.url for OG/sitemap), about, stats,
                         journey, education, projects, portfolioSlots,
                         twinStarters, nav
  lib/twin.ts            Twin + role-fit system prompts from site.ts; TWIN_MODELS
  lib/openrouter.ts      streamCompletion(): shared OpenRouter SSE proxy
  lib/stream.ts          streamTwin(): client-side SSE reader
  lib/og.tsx             Share card + "JE" monogram renderers (fonts in src/assets/fonts)
  app/
    layout.tsx           Fonts (Geist, Geist Mono, Syne), Header/Footer, theme init script
    globals.css          Color tokens, light theme, Tailwind @theme, utility classes
    page.tsx             Home
    about/ journey/ projects/ projects/[slug]/ portfolio/ resume/ twin/
    not-found.tsx
    fit/                 Role-fit page: paste a job description, print to PDF
    api/chat/route.ts    POST: validates messages, streams OpenRouter SSE back
    api/fit/route.ts     POST { jd }: role-fit analysis stream
    opengraph-image.tsx, icon.tsx, apple-icon.tsx, sitemap.ts, robots.ts
  components/            Header, Footer, ThemeToggle, SectionHeading, Markdown,
                         ResumeViewer (client, pdf.js), TwinChat, HeroAsk, FitCheck
public/
  Jack-Etzion-v25p.pdf   Served inline (header set in next.config.ts)
  pdf.worker.min.mjs     Vendored pdf.js worker (ignored by ESLint)
```

Root-level `Jack Etzion 2025 v23p.pdf` and `Profile.pdf` are source documents
(resume, LinkedIn export) that `site.ts` content was derived from.

## Key behavior

- **Content changes go in `src/content/site.ts`.** Pages and the Twin system
  prompt both read from it, so editing it updates the site and the Twin together.
- **Digital Twin**: `TwinChat` posts `{ messages }` to `/api/chat`. The route keeps
  the last 20 user/assistant turns (each <= 4000 chars), prepends the system
  prompt, and proxies the OpenRouter stream (`max_tokens: 1024`, `temperature: 0.4`).
  Errors: 400 bad input, 500 missing key, 502 upstream failure.
- **Twin model**: `TWIN_MODELS` in `src/lib/twin.ts`: Claude Haiku 5.5 first, free
  Nemotron as OpenRouter fallback. Replies render as Markdown.
- **Entry points**: the home hero `HeroAsk` and project "Go deeper" links open
  `/twin?q=...`, which auto-asks (TwinChat sits in `<Suspense>` for `useSearchParams`).
- **Role fit**: `/fit` streams a fixed-section Markdown report (`max_tokens: 4096`,
  since reasoning tokens count). Print CSS in `globals.css` makes it a clean PDF.
- **Portfolio**: hidden from nav, `noindex`, disallowed in robots until real case
  studies exist.
- **Theming**: dark is default. `data-theme` on `<html>` switches to light;
  `ThemeToggle` persists it in `localStorage`, and an inline script in
  `layout.tsx` applies it before paint. Use the token utilities (`bg-bg`,
  `bg-bg-2`, `text-ink`, `text-muted`, `text-faint`, `border-line`,
  `text-accent`, `text-brass`) and the `light:` variant, not raw colors.
  Dark tokens are tuned for contrast on `--bg`: `muted` ~8:1, `faint` ~5:1 (keep
  >= 4.5:1). `src/lib/og.tsx` hard-codes the dark palette; keep it in sync.
- **Project pages**: `params` is awaited inside `<Suspense>` (Cache Components
  requirement). Unknown slugs render the not-found page with status 200 (accepted
  trade-off).

## Conventions

- Server components by default; `"use client"` only for interactive pieces.
- Shared CSS classes: `eyebrow`, `font-display`, `link-line`, `grid-frame`,
  `grain`, `marquee`. Page containers use `mx-auto max-w-6xl px-5 md:px-8`.
- Pages export `metadata` with a short `title`; layout applies the
  `%s — Jack Etzion` template.
- Twin persona rules (first person, facts only, no phone number, no clinician
  claims) live in the system prompt in `src/lib/twin.ts`.

## Docs in repo

- `bugs.md`: latest test run, known limitations, fixed issues. Update it after
  verification passes.
- `tutorial.md`: beginner walkthrough of the codebase.
- `README.md`: short run and edit instructions.
