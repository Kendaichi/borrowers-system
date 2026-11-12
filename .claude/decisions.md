# Decisions
> Mark entries "inferred" if reconstructed from code rather than recorded at the time.

## Product
- **No digital signatures** — the paper slip has two signature columns; the system drops them. The
  logged-in custodian plus `created_at`/`updated_at` timestamps are the record of who logged a loan
  and return. Rejected: signature pad (canvas→image) and typed-name confirmation — extra build and
  storage for little gain given a single trusted operator. *(Confirmed with user.)*
- **Overdue = days outstanding, not a due date** — the slip has no due-date field, so overdue is
  derived: out for more than `OVERDUE_DAYS` (default 14, in `lib/config.ts`). Upgrade path: add a
  nullable `due_date` column if the school ever needs per-loan terms.
- **PDF via browser print** — `/print` renders the slip and uses `window.print()` ("Save as PDF").
  Rejected a PDF library: no dependency needed, and the browser dialog is familiar to staff.

## Design
- **Glassmorphism** — frosted translucent panels over a colorful gradient backdrop. Implemented as
  reusable CSS utilities (`.glass`, `.glass-strong`, `.glass-input`) in `app/globals.css` so panels
  stay consistent and components change only their className. Token palette: primary `#1856FF`,
  secondary `#3A344E`, success `#07CA6B`, warning `#E89558`, danger `#EA2143`, text `#141414`. Font:
  **Plus Jakarta Sans** via `next/font/google`. *(User requested the glass look.)*
  - Accessibility: dark text sits on light (≥55% opaque) glass to hold WCAG AA contrast; status
    badges use named Tailwind colors (not var-alpha) for guaranteed contrast; always-visible
    `:focus-visible` ring in the primary color.
  - Print: `@media print` strips the glass (plain white + black borders) so slips print on paper.

## Auth / access
- **Single custodian account** — Supabase Auth with public sign-ups disabled; one account created in
  the dashboard. RLS policy grants the `authenticated` role full access (no `anon`). Rejected
  per-user accounts/roles as unnecessary for one operator. *(Confirmed with user.)*
- **Anon key + session only; no service-role key** — all writes go through Server Actions under the
  user's session, bounded by RLS. Keeps secrets out of the app entirely.

## Delivery
- **Milestone 1 = boilerplate only** — running authenticated skeleton with stubbed actions and mock
  data, so three developers can build features in parallel against stable contracts in Milestone 2.
- **Three-developer split with non-overlapping file ownership** — see `CLAUDE.md` Rules.
- **Preview mode** (inferred/implementation) — `isSupabaseConfigured` lets the app boot and render
  with mock data before real Supabase credentials exist, so UI work isn't blocked on backend setup.
