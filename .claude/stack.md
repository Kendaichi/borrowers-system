# Stack

See `package.json` for exact resolved versions. Declared ranges:

## App
- `next` ^15 — App Router, Server Components + Server Actions.
- `react` / `react-dom` ^19.
- `@supabase/supabase-js` ^2 — auth + data client.
- `@supabase/ssr` ^0.5 — cookie-based server/browser/middleware Supabase clients.

## Dev / build
- `typescript` ^5, `@types/node` ^22, `@types/react` ^19, `@types/react-dom` ^19.
- `tailwindcss` ^3.4 + `postcss` ^8 + `autoprefixer` ^10.
- `tsx` ^4 — runs the `lib/status.ts` self-test (`npm run test:status`).

## Design
- **Glassmorphism** — gradient backdrop + frosted panels. Utilities `.glass` / `.glass-strong` /
  `.glass-input` live in `app/globals.css`; palette tokens are CSS vars (`--primary` …). See
  `decisions.md › Design`.
- `Plus Jakarta Sans` via `next/font/google` (self-hosted at build; no runtime CDN). Needs network
  during `next build`.

## Deliberately NOT included
- No UI/component library (shadcn, MUI…), no form library (react-hook-form), no PDF library.
  Tailwind + native inputs + `window.print()` cover Milestone 1/2 needs. Add only if a real need
  appears.
