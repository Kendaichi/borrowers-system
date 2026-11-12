# Architecture

## Topology
```
          Browser (custodian)
                │  cookies (Supabase session)
                ▼
     ┌─────────────────────────┐
     │  Next.js (App Router)    │
     │                          │
     │  middleware.ts ──────────┼──► guard: no session → /login
     │  app/login (client) ─────┼──► supabase-js signInWithPassword
     │  app/page   (server) ────┼──► read rows (M2) + getUser
     │  app/print  (client) ────┼──► window.print()
     │  app/actions.ts (server) ┼──► insert/update (M2)
     └───────────┬──────────────┘
                 │  @supabase/ssr (anon key + session)
                 ▼
        Supabase Postgres + Auth
        table public.borrowings (RLS: authenticated only)
```

## Notes
- **Auth boundary** = `middleware.ts` (redirects unauthenticated) + RLS on the table (data boundary).
  No service-role key anywhere client- or server-side.
- **Preview mode**: if env vars are unset, `isSupabaseConfigured` is false; middleware passes through
  and pages use mock data. Lets the UI run with no backend.
- **Server Actions** carry all writes; the client never talks to Postgres except via supabase-js
  under the user's session.
- Overdue is **derived at read time** (`lib/status.ts`), never stored.
