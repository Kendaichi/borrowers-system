-- Borrower's Slip — database schema.
-- Run once in the Supabase SQL editor (Dashboard -> SQL -> New query).

create table if not exists public.borrowings (
  id            uuid primary key default gen_random_uuid(),
  borrower_name text not null,
  item          text not null,
  date_borrowed date not null default current_date,
  date_returned date,                           -- null = still out
  recorded_by   uuid references auth.users default auth.uid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Keep updated_at honest.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists borrowings_set_updated_at on public.borrowings;
create trigger borrowings_set_updated_at
  before update on public.borrowings
  for each row execute function public.set_updated_at();

-- Row Level Security: only authenticated users (the single custodian, since
-- public sign-ups are disabled) may read/write. No anonymous access.
alter table public.borrowings enable row level security;

drop policy if exists "custodian_all" on public.borrowings;
create policy "custodian_all" on public.borrowings
  for all
  to authenticated
  using (true)
  with check (true);

-- IMPORTANT (do in the dashboard, not here):
--   1. Authentication -> Providers -> Email: turn OFF "Allow new users to sign up".
--   2. Authentication -> Users -> Add user: create the one custodian account.
