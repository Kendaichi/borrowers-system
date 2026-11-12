# Data model

One table. Source of truth: `supabase/schema.sql`. TS mirror: `lib/types.ts` (`Borrowing`).

## `public.borrowings`
| column        | type          | notes                                             |
|---------------|---------------|---------------------------------------------------|
| id            | uuid PK       | `gen_random_uuid()`                               |
| borrower_name | text not null | "NAME TEACHER/STAFF" column                        |
| item          | text not null | "ITEM/EQUIPMENT BORROWED"                          |
| date_borrowed | date not null | default `current_date`                            |
| date_returned | date null     | **null = still out**                              |
| recorded_by   | uuid null     | → `auth.users`, default `auth.uid()`              |
| created_at    | timestamptz   | default `now()`                                   |
| updated_at    | timestamptz   | default `now()`, bumped by trigger `set_updated_at` |

## Derived (not stored)
- **Status** (`lib/status.ts`): `returned` if `date_returned` set; else `overdue` if days-out >
  `OVERDUE_DAYS` (14); else `out`.

## Security
- RLS enabled; policy `custodian_all` → `authenticated` role, full access. No `anon` access.
- Single-account model (public sign-ups disabled), so "authenticated" ≈ "the custodian".

## Not modeled (by decision)
- **Signatures** — dropped; custodian login + timestamps are the record. See `decisions.md`.
- **Due dates** — none on the paper slip; overdue is a day-threshold. Add a `due_date` column only
  if per-loan terms are needed.
