-- Relays cleanup merge pass (Google-only -> License canonical)
-- Run AFTER:
--  - google_place_id column exists (migration 20260225103000_add_google_place_id.sql)
--  - helper functions + indexes exist (migration 20260225114000_add_dedupe_helpers.sql)
--
-- This is conservative:
--  - merges only when the match is UNIQUE on the license side
--  - never overwrites an existing different google_place_id
--  - fills only missing fields on the license row

begin;

-- Pass 1: match by website host (unique host among license rows)
with
  google as (
    select
      id as google_id,
      google_place_id,
      website,
      phone,
      rating,
      review_count,
      photo_url,
      public.relays_norm_host(website) as host
    from public.licensed_professionals
    where source = 'google'
      and google_place_id is not null
  ),
  license_unique_host as (
    select
      public.relays_norm_host(website) as host,
      min(id) as license_id,
      count(*) as n
    from public.licensed_professionals
    where source = 'license'
      and website is not null
    group by 1
    having count(*) = 1
  ),
  matches as (
    select g.google_id, l.license_id, g.google_place_id
    from google g
    join license_unique_host l on l.host = g.host
    where g.host is not null
  ),
  updated as (
    update public.licensed_professionals lp
    set
      google_place_id = coalesce(lp.google_place_id, g.google_place_id),
      website = coalesce(nullif(lp.website,''), g.website),
      phone = coalesce(nullif(lp.phone,''), g.phone),
      rating = coalesce(lp.rating, g.rating),
      review_count = coalesce(lp.review_count, g.review_count),
      photo_url = coalesce(nullif(lp.photo_url,''), g.photo_url)
    from matches m
    join public.licensed_professionals g on g.id = m.google_id
    where lp.id = m.license_id
      and (lp.google_place_id is null or lp.google_place_id = m.google_place_id)
    returning m.google_id
  )
delete from public.licensed_professionals
where id in (select google_id from updated);

-- Pass 2: match by phone digits (unique phone among license rows)
with
  google as (
    select
      id as google_id,
      google_place_id,
      website,
      phone,
      rating,
      review_count,
      photo_url,
      public.relays_norm_phone(phone) as phone10
    from public.licensed_professionals
    where source = 'google'
      and google_place_id is not null
  ),
  license_unique_phone as (
    select
      public.relays_norm_phone(phone) as phone10,
      min(id) as license_id,
      count(*) as n
    from public.licensed_professionals
    where source = 'license'
      and phone is not null
    group by 1
    having count(*) = 1
  ),
  matches as (
    select g.google_id, l.license_id, g.google_place_id
    from google g
    join license_unique_phone l on l.phone10 = g.phone10
    where g.phone10 is not null
  ),
  updated as (
    update public.licensed_professionals lp
    set
      google_place_id = coalesce(lp.google_place_id, g.google_place_id),
      website = coalesce(nullif(lp.website,''), g.website),
      phone = coalesce(nullif(lp.phone,''), g.phone),
      rating = coalesce(lp.rating, g.rating),
      review_count = coalesce(lp.review_count, g.review_count),
      photo_url = coalesce(nullif(lp.photo_url,''), g.photo_url)
    from matches m
    join public.licensed_professionals g on g.id = m.google_id
    where lp.id = m.license_id
      and (lp.google_place_id is null or lp.google_place_id = m.google_place_id)
    returning m.google_id
  )
delete from public.licensed_professionals
where id in (select google_id from updated);

commit;

-- Optional: report remaining google rows
-- select count(*) from public.licensed_professionals where source='google';
