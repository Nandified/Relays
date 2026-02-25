-- Add google_place_id to licensed_professionals so we can de-dupe + link Google listings to canonical rows
-- (used for enrichment + avoiding duplicates)

alter table if exists public.licensed_professionals
  add column if not exists google_place_id text;

-- Not strictly unique globally (a bad import could violate), but in practice Place IDs should be unique.
-- Use a partial unique index to allow NULLs.
create unique index if not exists idx_lp_google_place_id_unique
  on public.licensed_professionals (google_place_id)
  where google_place_id is not null;
