-- Speed up marketplace search (ILIKE/contains) on licensed_professionals
-- This avoids full table scans as the dataset grows.

create extension if not exists pg_trgm;

-- Primary: name search
create index if not exists licensed_professionals_name_trgm_idx
on public.licensed_professionals using gin (name gin_trgm_ops);

-- Secondary fields referenced by the API's OR search
create index if not exists licensed_professionals_company_trgm_idx
on public.licensed_professionals using gin (company gin_trgm_ops);

create index if not exists licensed_professionals_license_number_trgm_idx
on public.licensed_professionals using gin (license_number gin_trgm_ops);

-- Zip prefix matching (zip LIKE '606%')
create index if not exists licensed_professionals_zip_idx
on public.licensed_professionals (zip);
