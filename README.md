# Borrower's Slip System

A web app that replaces the paper **Borrower's Slip** used by the **Office of the School Property
Custodian** at Dulong Bayan Elementary School. The custodian records borrowed equipment, marks
returns, sees what's still out (and overdue), searches, and prints/exports a filled slip.

> **Status: Milestone 1 — boilerplate.** The app runs, authenticates, and renders all screens, but
> the add / return / search / live-data features are stubbed. See [Roadmap](#roadmap).

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
  page.tsx              # dashboard: stats + add form + table (protected)
  login/page.tsx        # custodian email/password login
  print/page.tsx        # printable slip (Save as PDF)
  actions.ts            # server actions (add/return stubbed in M1; signOut real)
components/
  stats-strip.tsx       # Total / Out / Overdue / Returned tiles
  borrowings-table.tsx  # the slip table
  add-borrowing-form.tsx
lib/
  types.ts, config.ts, status.ts   # shared contracts
  mock.ts                          # placeholder rows (M1)
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
| `/print` | Printable slip + export | **Joe** (joeburmon) | `app/print/page.tsx` |
| `/login` | Authentication | shared / rotates | `app/login/page.tsx` |

Rules that keep it non-blocking:

- Own your `app/<route>/` folder, its colocated components, and (in Milestone 2) its own server
  actions at `app/<route>/actions.ts` — no shared `app/actions.ts` to collide on. _(M1 keeps the
  stubs in `app/actions.ts`; split them per route when you implement them.)_
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

**Milestone 2 (features):** real add / mark-returned / undo with validation, in-memory search +
Out/Returned/All tabs, overdue highlighting, live dashboard counts, live + filterable print slip,
end-to-end tests.
