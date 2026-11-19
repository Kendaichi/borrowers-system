# Handoff — Borrower's Slip System

## 2026-11-19 - Live data wired into dashboard + print (merged to `develop`)
- **Dashboard list** (Kendaichi, PR #6 `fix/list-not-fetching-supabase-data`, `507099d`):
  `app/page.tsx` now selects from `borrowings` (newest first) when configured; mock only in preview.
  Fixes "an added borrower didn't show" - the list had been hardcoded to mock rows. Supersedes an
  earlier throwaway edit on `feat/auth`; this is the canonical version, on the owner's branch.
- **Print slip** (Joe, PR #5 `feat/add-print-and-export`, `673e1e6` + `5d91677`): print/export now
  render live data; extracted `app/print/print-view.tsx`, slimmed `page.tsx`, updated
  `export-slip.ts`, removed the preview-mode message.
- **Verified**: both merged to `develop`; not re-tested in this session.

## 2026-11-19 - Auth went live (Frank; local `.env.local` + Supabase dashboard)
- **What**: real auth now works end-to-end (login, session guard, sign-out) against the live
  Supabase project; the app is out of preview mode. A config fix, not a code change.
- **Root cause of "auth was bypassed"**: `.env.local` exposed the browser key as
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, but the code reads `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (`lib/supabase/env.ts`). So `SUPABASE_ANON_KEY` resolved to `""`, `isSupabaseConfigured` was
  `false`, and the app stayed in preview mode (auth bypassed, mock data). **Fix**: renamed the var
  to `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The value is the new `sb_publishable_` key (browser-safe;
  supabase-js forwards it as `apikey`). `.env.local` is gitignored, so the `sb_secret_` key in it is
  not committed and is not read by any app code.
- **Custodian account**: created in the Supabase dashboard (Authentication -> Users), email
  confirmed. Login + sign-out loop verified against the real project.
- **Verified**: login succeeds; session persists; sign-out returns to `/login` (user-confirmed in
  the running app).
- **Still open / TODO**:
  - **Disable public sign-ups**: Authentication -> Providers -> Email -> turn OFF "Allow new users
    to sign up" (single-custodian rule). Dashboard toggle, not yet done.
  - `markReturned` / `markUnreturned` still stubbed in `app/actions.ts` ("Not implemented yet").

## 2026-11-19 - Fix: dev server 500s (bad dependency bump)
- **What**: `npm run dev` returned 500 on every route. `globals.css` failed with "trying to use
  `tailwindcss` directly as a PostCSS plugin." Root cause was commit `3510361` ("chore: update
  dependencies"), which bumped **tailwindcss ^3.4.0 -> ^4.3.5** (v4 is a PostCSS-incompatible
  rewrite), **next ^15 -> ^16.4.6** (deprecates `middleware.ts`), and **downgraded exceljs ^4.4.0
  -> ^3.4.0** (PR2's export code targets the v4 API).
- **Fix**: `git revert` of `3510361` (revert commit `05e9d50`) restored the documented stack
  (next ^15.0.0, tailwindcss ^3.4.0, exceljs ^4.4.0), then `npm install`. No app-code/config
  changes: `postcss.config.mjs`, `tailwind.config.ts`, and `globals.css` were already correct for
  v3. Also discarded a stray uncommitted `tsconfig.json` edit (`jsx: react-jsx` back to `preserve`,
  required by Next) and removed an `AGENTS.md` file the Next 16 run auto-generated.
- **Verified**: `npm run dev` ok: `/`, `/login`, `/print`, `/borrowings/new` all return 200 (were
  500). Installed: tailwindcss 3.4.19, next 15.5.29, exceljs 4.4.0.
- **Gotcha**: don't re-bump Tailwind to v4 or Next to v16 as a casual `npm update`. Both are real
  migrations (PostCSS plugin + CSS-first config for v4; `middleware.ts` to `proxy.ts` for Next 16).
  Do them deliberately or not at all.

## 2026-11-18 - Print slip: Excel export (Joe, merged via PR #1)
- **What**: Added "Export to Excel" to the print slip, next to the existing Print / Save-as-PDF.
  It builds an `.xlsx` of the blank borrower's slip (school header + the 4 columns + 15 blank rows)
  and downloads it client-side.
- **Delivered** (commits `1bc880b` + `5c86dee`, merged `bdb3033`):
  - `app/print/export-slip.ts` - builds the workbook with `exceljs` and triggers the download.
    `exceljs` is lazy-loaded via `await import("exceljs")`, so it stays out of the main bundle.
  - `app/print/print-slip.ts` - extracted shared `BLANK_ROWS` / `COLUMNS`, now used by both the
    printed page and the export (kills the duplication).
  - `app/print/page.tsx` - Export button with loading/disabled state + `role="alert"` error text.
  - `package.json` - added `exceljs` ^4.4.0.
- **Verified**: `/print` renders (200). NOT click-through tested for the actual file download.
- **Gotchas**: the export is a BLANK slip (no live rows), matching the static M1 print page. When M2
  wires live data into print, do the same for the export. Requires `exceljs` v4 (`^4.4.0`): a
  downgrade breaks `workbook.xlsx.writeBuffer()` (see the 2026-11-19 entry).

## 2026-11-18 - add-borrowing action (Angelo, merged via PR #2)
- Real `addBorrowing` server action in `app/borrowings/new/actions.ts` (trim + ISO-date validation
  + Supabase insert + `revalidatePath` + redirect) and submit-state UX in
  `components/add-borrowing-form.tsx`. Form imports the action from the route folder, not
  `app/actions.ts`.
- **Review blockers, all resolved before merge**: `handleSubmit` reset moved to `finally` so a
  returned error no longer sticks on "Adding..." (`c1cdea1`); `actions.tsx` renamed to `.ts`, no JSX
  (`711e63a`); orphaned `addBorrowing` stub removed from `app/actions.ts` (`1095db9`). Merged in
  `57c6fce` (PR #2).

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
Done: add-borrowing (PR #2), auth live, dashboard reads Supabase (PR #6), print/export live data
(PR #5). Remaining: `markReturned` / `markUnreturned` logic + validation, search + Out/Returned/All
tabs, overdue highlighting, live counts, filterable print slip, end-to-end tests.
