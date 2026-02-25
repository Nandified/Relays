-- Relays: add opaque public_id for clean, fast profile URLs (avoid exposing license numbers)

-- Ensure uuid generator is available
create extension if not exists pgcrypto;

alter table if exists public.licensed_professionals
  add column if not exists public_id uuid;

-- Default for new rows
alter table public.licensed_professionals
  alter column public_id set default gen_random_uuid();

-- Backfill existing rows (safe; can be re-run). This may take time on 1M+ rows.
update public.licensed_professionals
set public_id = gen_random_uuid()
where public_id is null;

-- Helper RPC for incremental backfills (if needed)
create or replace function public.relays_backfill_public_id(batch_size int default 5000)
returns int
language plpgsql
security definer
as $$
declare
  n int;
begin
  with todo as (
    select id
    from public.licensed_professionals
    where public_id is null
    limit batch_size
  )
  update public.licensed_professionals lp
  set public_id = gen_random_uuid()
  from todo
  where lp.id = todo.id;

  get diagnostics n = row_count;
  return n;
end;
$$;

-- Uniqueness + fast lookup
create unique index if not exists idx_lp_public_id_unique
  on public.licensed_professionals (public_id);
