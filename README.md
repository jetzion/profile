# Jack Etzion — personal site

Portfolio and resume site with an AI Digital Twin that answers questions about
Jack's career in the first person, and a role-fit check for recruiters.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

`.env` must define `OPENROUTER_API_KEY`.

## Edit content

All copy and career data live in `src/content/site.ts`. Pages, share images, and
the Twin's system prompt all read from it.

See `CLAUDE.md` for architecture and `tutorial.md` for a walkthrough.
