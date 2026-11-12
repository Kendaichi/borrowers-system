# Handoff — Borrower's Slip System

## 2026-11-12 — Milestone 1: boilerplate
- **What**: Scaffolded the Next.js (App Router, TS) + Tailwind + Supabase app end-to-end as a
  running, authenticated skeleton. Features are stubbed, not implemented.
- **Delivered**:
  - Dev 1: project + config, `lib/supabase/{client,server,middleware,env}.ts`, `middleware.ts`
    (auth guard), `app/login`, `app/actions.ts` (add/return/undo stubbed; `signOut` real), shared
    contracts `lib/{types,config,status}.ts` with a status self-test (`npm run test:status`),
    `supabase/schema.sql` (table + RLS + updated_at trigger).
  - Dev 2: `app/page.tsx` dashboard, `components/borrowings-table.tsx`,
    `components/add-borrowing-form.tsx` — wired to mock data + stub actions.
  - Dev 3: `app/layout.tsx`, `app/globals.css` (+ print rules), `components/stats-strip.tsx`,
    `app/print/page.tsx` (static slip + Save-as-PDF), `README.md`, this file, `.claude/*`.
- **Verified**: `npm install` ✓. `npm run build` ✓ green (routes /, /login, /print + middleware;
  Next 15.5). `npm run test:status` ✓ self-test passes. Runs in preview mode without Supabase creds.
  (Fixed one TS error: annotated the Supabase `setAll` cookie callback params in
  `lib/supabase/{server,middleware}.ts`.)
- **Gotchas**:
  - App runs in **preview mode** (auth bypassed, mock data) until `.env.local` has real Supabase
    values. `isSupabaseConfigured` (lib/supabase/env.ts) is the switch.
  - Server actions `addBorrowing` / `markReturned` / `markUnreturned` return
    `{ ok: false, error: "Not implemented yet (Milestone 2)." }` by design.
  - Must disable public sign-ups and create the custodian account in the Supabase dashboard.

## 2026-11-12 — Glassmorphism design pass
- **What**: Applied a glassmorphism look across all screens (login, dashboard, stats, table, add
  form). Gradient backdrop + reusable `.glass` / `.glass-strong` / `.glass-input` utilities in
  `app/globals.css`; token palette as CSS vars; **Plus Jakarta Sans** via `next/font/google`.
  Status cells became colored badges. Print view still strips glass to plain paper.
- **Files**: `app/globals.css`, `app/layout.tsx` (font), `app/page.tsx`, `app/login/page.tsx`,
  `components/{stats-strip,borrowings-table,add-borrowing-form}.tsx`; docs in `.claude/{decisions,stack}.md`.
- **Verified**: `npm run build` ✓ green (Google font fetch succeeds at build).
- **Gotchas**: `next build` now needs network to fetch the font. Backdrop-blur is unsupported on
  very old browsers — degrades to a translucent panel (still readable).

## Next (Milestone 2)
Real action logic + validation, Supabase query in `page.tsx`, search + Out/Returned/All tabs,
overdue highlighting, live counts, live/filterable print slip, end-to-end tests.
