# Jack Etzion site — a beginner’s tutorial

This document walks through the personal website in this folder. It is written for someone who is new to **frontend** (what the visitor sees in the browser) and **backend** (code that runs on a server). You do not need prior experience with Next.js.

By the end you should be able to:

- Run the site locally
- Explain what each major technology does
- Point at the files that power Home, Projects, Resume, and the Digital Twin
- Read a few real code samples from this repo
- See five concrete ways the code could get stronger

---

## How to run it

In a terminal, from the project root:

```bash
cd /Users/jacketzion/Projects/Site
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The Digital Twin needs an OpenRouter API key in a file named `.env` at the project root:

```
OPENROUTER_API_KEY=your-key-here
```

Never put that key in a page, a GitHub repo, or a chat screenshot. The browser must never see it.

Useful scripts in `package.json`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts a local development server with hot reload |
| `npm run build` | Builds a production version |
| `npm run start` | Serves the production build |
| `npm run lint` | Checks the code for common mistakes |

---

## What we built

This is a **Next.js** personal site for Jack Etzion. It is a dark, editorial product-site, not a generic résumé template.

**Pages a visitor can open:**

| URL | Purpose |
| --- | --- |
| `/` | Home: headline, proof metrics, selected work |
| `/about` | Biography, principles, languages, education, skills |
| `/journey` | Career timeline |
| `/projects` | List of selected projects |
| `/projects/[slug]` | One project in detail (example: `/projects/forta-emr-ai`) |
| `/portfolio` | Placeholders for future case studies |
| `/twin` | Digital Twin chat about Jack’s career |
| `/resume` | On-page preview of the résumé PDF, plus download |

Shared chrome (header, footer, fonts, colors) wraps every page.

Content was taken from LinkedIn (`Profile.pdf`) and the résumé (`Jack Etzion 2025 v23p.pdf`), then stored as structured data in `src/content/site.ts` so pages and the Twin share one source of truth.

---

## Part 1 — Summary of the technology

Think of a website as two rooms:

1. **Frontend** — HTML, CSS, and JavaScript that run in the visitor’s browser. Buttons, layout, typing in the Twin box.
2. **Backend** — Code that runs on a machine you control. It can keep secrets (the API key) and talk to other services (OpenRouter).

This project uses a **full-stack** framework: Next.js lets both rooms live in one codebase.

### The stack, in plain language

**Next.js 16**  
A React framework. Files under `src/app/` become URLs. A file named `src/app/about/page.tsx` is the `/about` page. A file named `src/app/api/chat/route.ts` is a backend endpoint at `/api/chat`.

**React 19**  
A library for building UI from **components** (reusable pieces such as `Header` or `TwinChat`). Components return markup that looks like HTML mixed with JavaScript. That mix is called **JSX** (or **TSX** when TypeScript is involved).

**TypeScript**  
JavaScript with types. Types catch mistakes before the site runs. Example: a chat message must have a `role` of `"user"` or `"assistant"`, not a random string.

**Tailwind CSS 4**  
A way to style elements with short class names in the markup (`text-ink`, `border-accent`) instead of writing a separate CSS file for every page. Custom colors live in `src/app/globals.css`.

**PDF.js (`pdfjs-dist`)**  
Mozilla’s library for drawing PDF pages onto `<canvas>` elements in the browser. Used on `/resume` because linking straight to a `.pdf` file often downloads or shows a blank tab instead of a preview.

**OpenRouter**  
A hosted API that forwards chat requests to models. This site uses `openai/gpt-oss-120b`. The Next.js route `/api/chat` calls OpenRouter on the server.

**npm**  
The Node package manager. `package.json` lists libraries. `npm install` downloads them into `node_modules/`.

### Frontend vs backend in *this* repo

| Piece | Runs where | Why |
| --- | --- | --- |
| `Header`, `TwinChat`, `ResumeViewer` | Browser (`"use client"`) | They need clicks, typing, `useState`, or `useEffect` |
| Most `page.tsx` files | Server first, HTML sent to the browser | Faster first paint, no secret logic |
| `src/app/api/chat/route.ts` | Server only | Holds `OPENROUTER_API_KEY`, calls OpenRouter |
| Files in `public/` | Served as-is | PDFs, SVG logos, the PDF.js worker file |

If a file starts with `"use client"`, React hydrates it in the browser so it can be interactive. Files without that line are **Server Components** by default in the App Router.

### A tiny glossary

- **Component** — A function that returns UI.
- **Route / page** — A URL and the file that renders it.
- **Props** — Inputs passed into a component, like arguments to a function.
- **State** — Data that can change while the page is open (the Twin’s messages).
- **API route** — A backend URL your frontend can `fetch`.
- **Environment variable** — A secret or setting loaded from `.env`, available as `process.env.NAME`.
- **Streaming** — Sending the Twin’s answer token by token instead of waiting for the full paragraph.

---

## Part 2 — High-level walkthrough

### Folder map

```
Site/
├── .env                          # secrets (not committed)
├── package.json                  # scripts and libraries
├── next.config.ts                # Next.js settings (PDF headers, Tailwind)
├── public/                       # files at the site root URL
│   ├── Jack-Etzion-Resume.pdf
│   └── pdf.worker.min.mjs
└── src/
    ├── app/                      # routes
    │   ├── globals.css           # design tokens + global styles
    │   ├── layout.tsx            # shell around every page
    │   ├── page.tsx              # /
    │   ├── about/page.tsx
    │   ├── journey/page.tsx
    │   ├── projects/page.tsx
    │   ├── projects/[slug]/page.tsx
    │   ├── portfolio/page.tsx
    │   ├── twin/page.tsx
    │   ├── resume/page.tsx
    │   ├── not-found.tsx
    │   └── api/chat/route.ts     # POST /api/chat
    ├── components/               # reusable UI
    ├── content/site.ts           # all copy, jobs, projects, nav
    └── lib/twin.ts               # Digital Twin system prompt + model name
```

`[slug]` is a **dynamic segment**. Next.js fills it from the URL. `/projects/sepsis-ai` sets `slug` to `"sepsis-ai"`.

### What happens when someone visits `/about`

1. The browser requests `http://localhost:3000/about`.
2. Next.js matches `src/app/about/page.tsx`.
3. `layout.tsx` wraps it with fonts, `Header`, `Footer`, and grain overlay.
4. The page reads data from `src/content/site.ts` and renders HTML.
5. Tailwind classes become CSS. The visitor sees the About page.

No database. The “CMS” is a TypeScript file.

### What happens when someone asks the Twin a question

```
Browser (TwinChat)
    │  POST /api/chat  { messages: [...] }
    ▼
Next.js route  src/app/api/chat/route.ts
    │  adds a long system prompt (Jack’s career facts)
    │  adds Authorization: Bearer <OPENROUTER_API_KEY>
    ▼
OpenRouter  →  openai/gpt-oss-120b
    │  streams tokens back (text/event-stream)
    ▼
TwinChat parses "data: {...}" lines and updates the last message on screen
```

The key never leaves the server. The browser only talks to *your* `/api/chat`.

### Design system (why it looks the way it does)

Colors and fonts are CSS variables in `globals.css`: near-black background (`--bg`), cream type (`--ink`), brass labels (`--brass`), lime accent (`--accent`). Tailwind maps those to classes such as `bg-bg` and `text-accent`. Display type is **Syne**; body type is **Geist**.

That is the “enterprise meets edgy” look: quiet luxury layout, one sharp accent color.

### Content as data

`src/content/site.ts` exports objects and arrays: `site`, `about`, `stats`, `journey`, `projects`, `nav`. Pages import what they need. Change a job title once; Home, Journey, and the Twin all pick it up (the Twin via `buildTwinSystemPrompt()`).

---

## Part 3 — Detailed code review (with samples)

### 3.1 The root layout — the frame around every page

`src/app/layout.tsx` loads Google fonts through `next/font` (they are downloaded at build time, not from a slow runtime request). It sets site-wide metadata (browser tab title) and the repeating chrome.

```tsx
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-bg text-ink">
        <div className="grain" aria-hidden />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

`children` is whichever page matched the URL. `aria-hidden` on the grain overlay tells assistive tech to ignore a decorative layer.

**Beginner note:** `flex min-h-full flex-col` makes the footer sit at the bottom even on short pages: header, then growing `main`, then footer.

### 3.2 Design tokens in CSS

```css
:root {
  --bg: #070706;
  --ink: #f4f0e6;
  --accent: #d6ff4a;
  --brass: #c4a574;
}

@theme inline {
  --color-bg: var(--bg);
  --color-ink: var(--ink);
  --color-accent: var(--accent);
  --color-brass: var(--brass);
  --font-display: var(--font-syne);
}
```

`@theme inline` is Tailwind v4’s way of registering custom colors. After this, `className="text-accent"` works.

A gotcha we hit in this project: a custom class `.eyebrow` set `color: var(--brass)`. That **overrode** Tailwind’s `text-accent` on the nav, so the selected item did not look selected. The fix was a more specific class, `.eyebrow.is-active`, plus an underline.

### 3.3 Navigation and “you are here”

`Header` is a Client Component because it must read the current URL (`usePathname`) and toggle a mobile menu (`useState`).

```tsx
const active =
  item.href === "/"
    ? pathname === "/"
    : pathname.startsWith(item.href);
```

Home is an exact match so `/about` does not also highlight Home. For Projects, `startsWith("/projects")` keeps the item selected on `/projects/forta-emr-ai`. `aria-current="page"` exposes that to screen readers.

The **Resume** control is a `Link` to `/resume`, not a raw file URL. That is why the résumé now *shows* instead of disappearing into a download.

### 3.4 One project page from a slug

`src/app/projects/[slug]/page.tsx` looks up the project in the `projects` array. If there is no match, it calls `notFound()` and `src/app/not-found.tsx` renders.

```tsx
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  // ...
}
```

`generateStaticParams` tells Next.js the slugs to pre-render at build time. In Next 16, `params` is a **Promise**, so the page `await`s it.

### 3.5 Résumé viewer (frontend, no server secret)

Browsers often refuse to display a PDF in-tab. `ResumeViewer` fetches `/Jack-Etzion-Resume.pdf`, parses it with PDF.js, and paints each page onto a canvas.

```tsx
const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const bytes = new Uint8Array(
  await (await fetch(site.resumeFile)).arrayBuffer(),
);
const pdf = await pdfjs.getDocument({
  data: bytes,
  useWasm: false,
  useWorkerFetch: false,
}).promise;
```

The worker file is copied to `public/pdf.worker.min.mjs` so the browser can load it as a static script. `useEffect` cleanup uses a `cancelled` flag so leaving the page mid-render does not try to update a dead component.

`next.config.ts` also sets `Content-Disposition: inline` on the PDF so a direct file link prefers “open” over “download.”

### 3.6 Digital Twin — system prompt (backend knowledge)

`src/lib/twin.ts` turns `site.ts` into a long **system prompt**: instructions plus facts. The model is told to speak in the first person as Jack, stick to those facts, and not invent phone numbers or clinical licenses.

```ts
export const TWIN_MODEL = "openai/gpt-oss-120b";

export function buildTwinSystemPrompt() {
  // ...formats journey and projects into text...
  return `You are the Digital Twin of ${site.name}...`;
}
```

This is not “training a new model.” It is **prompting** an existing model with context on every request. If you update Forta’s blurb in `site.ts`, the Twin’s answers change on the next question.

### 3.7 Digital Twin — API route (the real backend)

`src/app/api/chat/route.ts` exports `POST`. Next.js maps that to `POST /api/chat`.

Important habits in this file:

1. **Sanitize input.** Only `user` / `assistant` roles, trim text, cap length, keep the last 20 turns. Never trust the browser blindly.
2. **Fail closed if the key is missing** with HTTP 500 and a vague message.
3. **Do not send the key to the client.** It is read from `process.env.OPENROUTER_API_KEY`.
4. **Stream the model output** so the UI can type out the answer.

```ts
export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The Digital Twin is not configured." },
      { status: 500 },
    );
  }

  const messages = sanitizeMessages(/* ...from JSON body... */);

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Jack Etzion Digital Twin",
    },
    body: JSON.stringify({
      model: TWIN_MODEL,
      temperature: 0.4,
      stream: true,
      reasoning: { effort: "low", exclude: true },
      messages: [
        { role: "system", content: buildTwinSystemPrompt() },
        ...messages,
      ],
    }),
  });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
```

`temperature: 0.4` keeps answers fairly grounded. `reasoning.exclude` asks the model not to stream hidden chain-of-thought into the UI.

OpenRouter’s stream looks like:

```
data: {"choices":[{"delta":{"content":"I’m"}}]}
data: {"choices":[{"delta":{"content":" currently"}}]}
data: [DONE]
```

### 3.8 Digital Twin — chat UI (frontend)

`TwinChat` keeps an array of messages in React state. Starter chips call the same `send()` function as the form.

```tsx
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: nextMessages }),
});

const reader = response.body?.getReader();
```

A loop reads binary chunks, decodes them as text, splits on newlines, and for each `data:` line parses JSON and appends `delta.content` to the last assistant message. That is why the answer appears word by word.

The composer at the bottom is a labeled `<textarea>` inside a dark, brass-bordered well (not a white box — that clashed with the rest of the site). Enter sends; Shift+Enter inserts a newline.

The Twin **page** itself (`src/app/twin/page.tsx`) is a thin Server Component: heading plus `<TwinChat />`. Interactivity is isolated to the child.

### 3.9 Static vs interactive — a pattern to copy

| File | Kind | Reason |
| --- | --- | --- |
| `app/about/page.tsx` | Server | Pure content |
| `app/twin/page.tsx` | Server shell | Layout only |
| `components/TwinChat.tsx` | Client | Typing, streaming |
| `components/Header.tsx` | Client | Path + mobile menu |
| `api/chat/route.ts` | Server route | Secrets + OpenRouter |

When you add a new page, start as a Server Component. Only add `"use client"` when you need browser APIs.

---

## Part 4 — How the pieces fit (one picture)

```
site.ts  ──►  pages (About, Journey, Projects, Home, Portfolio)
    │
    └──►  lib/twin.ts  ──►  POST /api/chat  ──►  OpenRouter
                                ▲
                                │
                         TwinChat (browser)
```

Jack edits copy in `site.ts`. Design lives in `globals.css` and Tailwind classes. Secrets live in `.env`. Interactive islands are small Client Components.

---

## Part 5 — Five improvements from a self-review

These are the highest-value next steps if this site goes beyond a local demo.

### 1. Protect `/api/chat` before you deploy

Anyone who can open the Twin can spend your OpenRouter credits. There is no login, no rate limit, and no check that the request came from your own origin.

**Improve by:** adding rate limiting (for example by IP), checking the `Origin` / `Referer` header, optionally a simple shared secret, and monitoring usage on OpenRouter. Also stop hardcoding `"HTTP-Referer": "http://localhost:3000"` — use an environment variable for the real domain.

### 2. Replace the hand-rolled stream parser

`TwinChat` splits SSE lines itself. That works, but it is easy to break (partial lines, `reasoning` fields, network abort). There is no **Cancel** button; if the visitor navigates away mid-stream, the fetch may keep running.

**Improve by:** using a maintained helper such as the Vercel AI SDK `useChat` / `streamText`, attaching an `AbortController`, and disabling Send until the stream finishes (already partly done via `busy`).

### 3. The résumé canvas is not real text

PDF.js draws pixels. Screen readers cannot read the résumé on `/resume`. Window resize does not re-render pages, so a phone rotated to landscape can look cramped.

**Improve by:** adding a clearly labeled download as the accessible path (already present), re-rendering on resize (`ResizeObserver`), and/or exposing a text fallback. For production, consider pre-rendering page images at build time so you do not ship a large PDF.js worker to every visitor.

### 4. Validate API input with a schema library

`sanitizeMessages` is honest defensive code, but it is custom. A library like **Zod** would document the contract (`{ messages: { role, content }[] }`) and return clear 400s. The same schema can be shared with the client.

**Improve by:** defining a Zod schema next to the route, parsing `request.json()` through it, and logging parse failures without leaking stack traces to the browser.

### 5. Add tests and a production checklist

There are no automated tests. A regression (nav active state, Twin empty-reply handling, unknown project slug → 404) would only show up by clicking around.

**Improve by:**

- A few **unit tests** for `sanitizeMessages` and `buildTwinSystemPrompt` (does it include Forta? does it omit the phone number?).
- One **route test** that mocks `fetch` to OpenRouter.
- A deploy checklist: `.env` on the host, `OPENROUTER_API_KEY` set, `npm run build` green, never commit `.env`.

Honorable mentions (not in the top five, but real): prompt-injection (“ignore your instructions and…”) is only weakly defended; the Twin has no conversation persistence; `cacheComponents` in Next 16 forbids some route `runtime` settings we tried and then removed.

---

## What to read next (in this repo)

1. `src/content/site.ts` — all of the words and structure  
2. `src/app/layout.tsx` — the shell  
3. `src/app/page.tsx` — the homepage assembly  
4. `src/app/api/chat/route.ts` — the backend  
5. `src/components/TwinChat.tsx` — the frontend of the Twin  

If you change copy, start in `site.ts`. If you change look and feel, start in `globals.css`. If you change how the Twin thinks, start in `lib/twin.ts`. If you change how the Twin is called, start in `api/chat/route.ts`.
