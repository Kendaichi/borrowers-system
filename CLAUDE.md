# Borrower's Slip System — school property borrowing tracker

## Overview
Replaces the paper "Borrower's Slip" for Dulong Bayan Elementary School's Office of the School
Property Custodian. A single custodian logs borrowed equipment, marks returns, and prints slips.
Next.js (App Router) + Supabase (Postgres + Auth).

## Stack (high level)
- **Backend**: Supabase Postgres; RLS; Auth (email/password, single account). Mutations via Next.js
  Server Actions using the anon key + session (no service-role key).
- **Frontend**: Next.js App Router + TypeScript + Tailwind. No component/form libraries.
- **Other**: PDF export = browser print-to-PDF (`window.print()`), no library.

## Structure
- `app/` — routes: `page.tsx` (dashboard), `login/`, `print/`, `actions.ts` (server actions).
- `components/` — `stats-strip`, `borrowings-table`, `add-borrowing-form`.
- `lib/` — `types.ts`, `config.ts`, `status.ts` (shared contracts), `mock.ts`, `supabase/*`.
- `middleware.ts` — session refresh + auth guard. `supabase/schema.sql` — DB + RLS.

## Current Focus (as of 2026-11)
- **Milestone 1 (boilerplate) — done.** Running authenticated skeleton; add/return/search stubbed.
  See `handoff.md`.
- **Milestone 2 (next): features.** Real action logic, search + Out/Returned/All tabs, overdue
  highlight, live counts, live/filterable print slip, tests.

## Rules
- **Single custodian only.** Public sign-ups must stay OFF in Supabase; one account, created in the
  dashboard. RLS policy `custodian_all` grants the `authenticated` role full access — never open the
  table to `anon`.
- **No service-role key** in the browser or server actions. Anon key + session only.
- **No signatures** (a deliberate product decision — see `.claude/decisions.md`). Don't re-add the
  signature columns; the custodian login + timestamps are the record of truth.
- **Overdue is derived**, not stored: out longer than `OVERDUE_DAYS` (lib/config.ts, default 14).
  The slip has no due date. If you add one, update `deriveStatus` + its self-test.
- **Preview mode**: when Supabase env vars are unset, auth is bypassed and mock data is shown. Keep
  `isSupabaseConfigured` guards so the app still boots without credentials.
- **Team (per-page ownership):** `/` list + mark-returned (+ `borrowings-table`, `stats-strip`) =
  **Kendaichi**; `/borrowings/new` add form (+ `add-borrowing-form`) = **Angelo Galope**
  (angelogalope); `/print` slip = **Joe** (joeburmon); `/login` auth = shared/rotates.
- **Ownership rule:** own your `app/<route>/` folder + its components + (M2) its own
  `app/<route>/actions.ts`. **Shared base, coordinate changes:** `lib/*`, `middleware.ts`,
  `app/layout.tsx`, `app/globals.css`, `supabase/schema.sql`. Don't edit another route's folder.
- **Commits: Conventional Commits** — `feat: / fix: / docs: / chore: / refactor: / test: / style:`,
  with `!` for breaking (e.g. `feat!:`). Format `type(scope): imperative summary`.

## Session End
- After every change, append a dated entry to `handoff.md` (newest-first).
- Update `.claude/decisions.md` for any architectural call.
- Update `.claude/data-model.md` if entities/relationships change.
- New Supabase changes go in `supabase/schema.sql`; keep it runnable top-to-bottom (idempotent).

> Setup blueprint this project follows: `claude_setup.md`.
