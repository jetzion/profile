# Bugs

Test run: 2026-10-18. Lint, type check, production build, route checks, chat API
checks, and browser checks (Playwright + Chrome) against dev and production builds.

## Open

None.

## Known limitation

The Twin now uses the free model `nvidia/nemotron-3-super-120b-a12b:free`, because
the OpenRouter account has $0 credits (`total_credits: 0`, free tier), and every
paid-model request returned 402. Free models are capped at 50 requests per day
(shared by all visitors) and can be rate-limited upstream. To go back to a paid
model, add credits and set `TWIN_MODEL` in `src/lib/twin.ts`.

## Fixed

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
