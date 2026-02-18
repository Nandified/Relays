-- Licensed Professionals (state license databases)
create table if not exists public.licensed_professionals (
  id text primary key,
  slug text unique,
  name text not null,
  category text not null,
  license_number text,
  license_type text,
  company text,
  office_name text,
  city text,
  state text,
  zip text,
  county text,
  licensed_since text,
  expires text,
  disciplined boolean default false,
  phone text,
  email text,
  website text,
  rating numeric,
  review_count int,
  photo_url text,
  source text not null default 'license'
);

create index if not exists idx_lp_name_trgm on public.licensed_professionals using gin (name gin_trgm_ops);
create index if not exists idx_lp_company_trgm on public.licensed_professionals using gin (company gin_trgm_ops);
create index if not exists idx_lp_city_trgm on public.licensed_professionals using gin (city gin_trgm_ops);
create index if not exists idx_lp_zip on public.licensed_professionals (zip);
create index if not exists idx_lp_category on public.licensed_professionals (category);
create index if not exists idx_lp_state on public.licensed_professionals (state);

-- Enable pg_trgm if not already
create extension if not exists pg_trgm;
