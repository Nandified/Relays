-- Relays: helper functions + expression indexes for fast de-dupe/merge
-- Goal: safely merge Google-only rows into canonical license rows (no duplicates)

-- 1) Normalize website host
create or replace function public.relays_norm_host(url text)
returns text
language sql
immutable
as $$
  select nullif(
    regexp_replace(
      lower(
        regexp_replace(coalesce(url,''), '^https?://', '', 'i')
      ),
      '^www\\.',
      ''
    ),
    ''
  );
$$;

-- 2) Normalize phone digits (last 10)
create or replace function public.relays_norm_phone(p text)
returns text
language sql
immutable
as $$
  select nullif(
    right(regexp_replace(coalesce(p,''), '\\D', '', 'g'), 10),
    ''
  );
$$;

-- 3) Expression indexes (make matching fast at 1M+ rows)
create index if not exists idx_lp_website_host
  on public.licensed_professionals (public.relays_norm_host(website));

create index if not exists idx_lp_phone_digits
  on public.licensed_professionals (public.relays_norm_phone(phone));

-- Helpful composite indexes to keep joins selective
create index if not exists idx_lp_source_host
  on public.licensed_professionals (source, public.relays_norm_host(website));

create index if not exists idx_lp_source_phone
  on public.licensed_professionals (source, public.relays_norm_phone(phone));
