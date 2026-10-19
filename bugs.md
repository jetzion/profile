# Bugs

Test run: 2026-10-19. Lint, type check, production build, route checks, chat and
fit API checks, and browser checks (Playwright + Chromium) against the production build.

## Open

None.

## Known limitations

- The Twin runs on `anthropic/claude-haiku-5.5` (about $0.0007 per chat, $0.002 per
  fit analysis) with the free Nemotron model as OpenRouter fallback. The account had
  $9.80 credit on 2026-10-19. Fallback routing could not be forced in a test, since
  OpenRouter rejects invalid model IDs before routing.
- `next dev` sometimes serves stale modules or CSS after edits (seen with
  `src/lib/twin.ts` and `globals.css`). Restart the dev server, or verify on
  `next build && next start`.
- `site.url` (`https://etzion.us`) is assumed; it drives canonical OG URLs and the sitemap.

## Fixed

- **Role-fit answers were cut off.** Haiku's hidden reasoning counted against
  `max_tokens` (1288 of 2048), so `finish_reason` was `length`. `/api/fit` now
  allows 4096. Chat replies use no reasoning tokens and finish normally at 1024.
- **Printed fit report was washed out and had no bullets.** Print tokens now set dark
  ink on white, and `print-color-adjust: exact` keeps the accent bullets.

0. **Chat did not respond (402, no credits).** Switched `TWIN_MODEL` to the free
   Nemotron model. Retested: the API streams replies, and in the browser the
   starter prompt and a follow-up both get grounded answers.

1. **Production build failed.** `ResumeViewer.tsx` imported `pdfjs-dist/build/pdf.mjs`,
   which has no types. Now it imports `pdfjs-dist` (same file, typed). Build passes.
2. **Chat requests reserved ~115k output tokens.** Added `max_tokens: 1024` in
   `src/app/api/chat/route.ts`. Verified OpenRouter now sees 1024.
3. **Project pages logged an "encountered URL data" error.** `params` is now awaited
   inside `<Suspense>`, per the Next.js Cache Components docs. No more errors.
   Trade-off (accepted): an unknown slug such as `/projects/zzz` returns 200 with a
   `noindex` tag and the not-found page, rather than a 404 status.
4. **Lint failed on the vendored pdf.js worker.** `public/pdf.worker.min.mjs` is
   now in the ignores in `eslint.config.mjs`. Lint is clean.
5. **Resume render errors were swallowed.** `ResumeViewer.tsx` now logs them with
   `console.error`.

## Verified working

- `npm run lint`, `tsc`, and `npm run build` pass.
- All pages return 200, unknown top-level routes return 404, and there are no
  broken internal links.
- The resume viewer renders both pages, and the mobile menu navigates.
- No browser console errors on any page.
- Chat API input validation returns 400 for bad input and 405 for GET.
