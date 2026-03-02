-- ==========================================================================
-- Relays — Orgs + memberships (scalable access control)
-- 2026-03-02
-- ==========================================================================

-- ── Enum types ─────────────────────────────────────────────────────────────
do $$ begin
  create type org_member_role as enum ('owner', 'admin', 'member');
exception
  when duplicate_object then null;
end $$;

-- ── Orgs ───────────────────────────────────────────────────────────────────
create table if not exists orgs (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Org memberships ────────────────────────────────────────────────────────
create table if not exists org_memberships (
  id           uuid primary key default uuid_generate_v4(),
  org_id       uuid not null references orgs(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  member_role  org_member_role not null default 'member',
  created_at   timestamptz not null default now(),

  unique (org_id, user_id)
);

create index if not exists org_memberships_user_id_idx on org_memberships(user_id);
create index if not exists org_memberships_org_id_idx on org_memberships(org_id);

-- ── Row Level Security (RLS) ───────────────────────────────────────────────
-- Note: policies are intentionally simple for now; we can tighten/expand later.

alter table orgs enable row level security;
alter table org_memberships enable row level security;

-- Orgs: members can read the org
create policy if not exists "orgs_select_if_member"
  on orgs for select
  using (
    exists (
      select 1
      from org_memberships m
      where m.org_id = orgs.id
        and m.user_id = auth.uid()
    )
  );

-- Orgs: owners/admins can update org
create policy if not exists "orgs_update_if_org_admin"
  on orgs for update
  using (
    exists (
      select 1
      from org_memberships m
      where m.org_id = orgs.id
        and m.user_id = auth.uid()
        and m.member_role in ('owner','admin')
    )
  );

-- Orgs: owners/admins can insert orgs (optional). For now: any authed user can create.
create policy if not exists "orgs_insert_authed"
  on orgs for insert
  with check (auth.uid() is not null);

-- Memberships: user can see their own memberships; org admins can see memberships in their org
create policy if not exists "org_memberships_select"
  on org_memberships for select
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from org_memberships m
      where m.org_id = org_memberships.org_id
        and m.user_id = auth.uid()
        and m.member_role in ('owner','admin')
    )
  );

-- Memberships: org owners/admins can manage memberships in their org
create policy if not exists "org_memberships_insert_if_org_admin"
  on org_memberships for insert
  with check (
    exists (
      select 1
      from org_memberships m
      where m.org_id = org_memberships.org_id
        and m.user_id = auth.uid()
        and m.member_role in ('owner','admin')
    )
  );

create policy if not exists "org_memberships_update_if_org_admin"
  on org_memberships for update
  using (
    exists (
      select 1
      from org_memberships m
      where m.org_id = org_memberships.org_id
        and m.user_id = auth.uid()
        and m.member_role in ('owner','admin')
    )
  );

create policy if not exists "org_memberships_delete_if_org_admin"
  on org_memberships for delete
  using (
    exists (
      select 1
      from org_memberships m
      where m.org_id = org_memberships.org_id
        and m.user_id = auth.uid()
        and m.member_role in ('owner','admin')
    )
  );
