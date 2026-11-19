# Borrower's Slip System

A web app that replaces the paper **Borrower's Slip** used by the **Office of the School Property
Custodian** at Dulong Bayan Elementary School. The custodian records borrowed equipment, marks
returns, sees what's still out (and overdue), searches, and prints/exports a filled slip.

> **Status: Milestone 2 (in progress).** Auth, add-borrowing, the live dashboard list, and
> print/export live data all work against Supabase. Still stubbed: mark-returned / undo, search,
> Out/Returned/All tabs, and overdue highlighting. See [Roadmap](#roadmap).

## Stack

- **Next.js** (App Router, TypeScript) + **Tailwind CSS**
- **Supabase** — Postgres + Auth (`@supabase/ssr` for cookie-based sessions)
- Mutations via **Server Actions**. Auth uses the anon key + Row Level Security (no service-role key).
- PDF export via the browser's print-to-PDF (no extra dependency).

## Prerequisites

- Node.js 20+ and npm
- A free [Supabase](https://supabase.com) project

## Setup

```bash
npm install
```

1. **Create the database.** In the Supabase dashboard → **SQL** → paste and run
   [`supabase/schema.sql`](supabase/schema.sql).
2. **Lock down auth.** Dashboard → **Authentication → Providers → Email** → turn **off** "Allow new
   users to sign up". Then **Authentication → Users → Add user** to create the single custodian
   account.
3. **Configure env.** Copy `.env.example` to `.env.local` and fill in from **Project Settings → API**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

   > Until both are set, the app runs in **preview mode**: auth is bypassed and the dashboard shows
   > mock data, so you can develop the UI without a backend.

## Run

```bash
npm run dev          # http://localhost:3000
npm run build        # production build
npm run test:status  # assert-based self-test for the overdue/status logic
```

## Project structure

```
app/
  layout.tsx            # app shell + <head>
  globals.css           # theme + print (@media print) styles
  page.tsx              # dashboard: stats + table, reads Supabase (protected)
  login/page.tsx        # custodian email/password login
  borrowings/new/
    page.tsx            # add-borrowing form page
    actions.ts          # addBorrowing server action (validate + insert)
  print/
    page.tsx            # printable slip (Save as PDF) + Export to Excel
    print-view.tsx      # slip rows rendered from live data
    print-slip.ts       # shared BLANK_ROWS / COLUMNS
    export-slip.ts      # .xlsx export (exceljs, lazy-loaded)
  actions.ts            # shared actions: markReturned/markUnreturned (stubbed), signOut
components/
  stats-strip.tsx       # Total / Out / Overdue / Returned tiles
  borrowings-table.tsx  # the slip table
  add-borrowing-form.tsx
lib/
  types.ts, config.ts, status.ts   # shared contracts
  mock.ts                          # placeholder rows (preview mode)
  supabase/{client,server,middleware,env}.ts
middleware.ts           # session refresh + auth guard
supabase/schema.sql     # run once in Supabase
```

## Developer delegation — per page

The shared foundation (`lib/*`, `middleware.ts`, auth, global styles) is built in Milestone 1 and is
treated as a **frozen base**. Feature work is then split **per route**, so each developer owns a page
end-to-end and no one waits on another.

| Route | Area | Owner | Owns |
|-------|------|-------|------|
| `/` | Borrowings list, stats, mark-returned | **Kendaichi** | `app/page.tsx`, `components/borrowings-table.tsx`, `components/stats-strip.tsx` |
| `/borrowings/new` | Add-borrowing form | **Angelo Galope** (angelogalope) | `app/borrowings/new/page.tsx`, `components/add-borrowing-form.tsx` |
| `/print` | Printable slip + export | **Joe** (joeburmon) | `app/print/*` (`page.tsx`, `print-view.tsx`, `print-slip.ts`, `export-slip.ts`) |
| `/login` | Authentication | shared / rotates | `app/login/page.tsx` |

Rules that keep it non-blocking:

- Own your `app/<route>/` folder, its colocated components, and (in Milestone 2) its own server
  actions at `app/<route>/actions.ts` - no shared `app/actions.ts` to collide on. _(add-borrowing
  now lives in `app/borrowings/new/actions.ts`; mark-returned / undo stay in the shared
  `app/actions.ts` until implemented.)_
- **Shared base — coordinate changes (rare):** `lib/*`, `middleware.ts`, `app/layout.tsx`,
  `app/globals.css`. The DB schema + `lib/{types,status,config}` are stable contracts.
- Query `public.borrowings` directly through `lib/supabase/server` from your own page.

## Commit messages — Conventional Commits

```
feat:  a new feature              feat!: breaking feature change (or a `BREAKING CHANGE:` footer)
fix:   a bug fix                  fix!:  breaking fix
docs:  documentation only         refactor: code change, no behavior change
chore: tooling / deps / config    test:  tests only       style: formatting only
```

Format: `type(optional-scope): short imperative summary`
— e.g. `feat(table): add Out/Returned tabs`, `fix(auth): redirect loop on expired session`.

## Roadmap

**Milestone 2 (features).** Done: real add-borrowing with validation, live auth, dashboard reads
Supabase, print/export live data. Remaining: mark-returned / undo, in-memory search +
Out/Returned/All tabs, overdue highlighting, filterable print slip, end-to-end tests.
