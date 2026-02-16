-- ============================================================================
-- Relays — Initial Database Schema
-- Run this migration when connecting a real Supabase project.
-- ============================================================================

-- ── Enable required extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enum types ──────────────────────────────────────────────────────────────
create type user_role as enum ('consumer', 'pro', 'admin');

create type pro_service_category as enum (
  'Home Inspector',
  'Mortgage Lender',
  'Insurance Agent',
  'Attorney',
  'Realtor'
);

create type journey_status as enum ('active', 'pending', 'completed');
create type journey_role_status as enum ('needed', 'recommended', 'filled');
create type verification_status as enum ('pending', 'approved', 'rejected');

-- ── Profiles ────────────────────────────────────────────────────────────────
-- Extends auth.users with app-specific data.
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  role          user_role not null default 'consumer',
  display_name  text,
  avatar_url    text,
  phone         text,
  onboarding_complete boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, role, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'consumer'),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Journeys ────────────────────────────────────────────────────────────────
-- The core data model — a home-buying journey with 5 service roles.
create table journeys (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  address         text not null,
  property_type   text not null default 'buying',  -- 'buying' | 'selling'
  created_by      uuid not null references profiles(id) on delete cascade,
  client_name     text,
  client_email    text,
  client_phone    text,
  status          journey_status not null default 'active',
  share_slug      text unique,
  pending_action  text,
  next_step       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Journey Roles ───────────────────────────────────────────────────────────
-- Each journey has up to 5 service roles (Realtor, Mortgage Lender, etc.)
create table journey_roles (
  id                uuid primary key default uuid_generate_v4(),
  journey_id        uuid not null references journeys(id) on delete cascade,
  category          pro_service_category not null,
  status            journey_role_status not null default 'needed',
  assigned_pro_id   uuid references profiles(id) on delete set null,
  recommended_pro_ids uuid[] default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  unique (journey_id, category)
);

-- ── Verifications ───────────────────────────────────────────────────────────
-- License / identity verification for professionals.
create table verifications (
  id              uuid primary key default uuid_generate_v4(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  license_number  text,
  license_type    text,
  state           text,  -- US state code
  status          verification_status not null default 'pending',
  verified_at     timestamptz,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Teams ───────────────────────────────────────────────────────────────────
-- A consumer's team of professionals.
create table teams (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  name        text,
  created_at  timestamptz not null default now()
);

-- ── Team Members ────────────────────────────────────────────────────────────
create table team_members (
  id          uuid primary key default uuid_generate_v4(),
  team_id     uuid not null references teams(id) on delete cascade,
  pro_id      uuid not null references profiles(id) on delete cascade,
  role        pro_service_category not null,
  added_at    timestamptz not null default now(),

  unique (team_id, pro_id, role)
);

-- ── Indexes ─────────────────────────────────────────────────────────────────
create index idx_profiles_role on profiles(role);
create index idx_journeys_created_by on journeys(created_by);
create index idx_journeys_share_slug on journeys(share_slug);
create index idx_journey_roles_journey on journey_roles(journey_id);
create index idx_verifications_profile on verifications(profile_id);
create index idx_team_members_team on team_members(team_id);
create index idx_team_members_pro on team_members(pro_id);

-- ── Updated-at trigger ──────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles for each row execute function set_updated_at();
create trigger journeys_updated_at
  before update on journeys for each row execute function set_updated_at();
create trigger journey_roles_updated_at
  before update on journey_roles for each row execute function set_updated_at();
create trigger verifications_updated_at
  before update on verifications for each row execute function set_updated_at();


-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
-- These are sketched out — refine when connecting a real project.

alter table profiles enable row level security;
alter table journeys enable row level security;
alter table journey_roles enable row level security;
alter table verifications enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;

-- ── Profiles ──
-- Users can read any profile (public marketplace), but only edit their own.
create policy "Profiles: public read"
  on profiles for select using (true);

create policy "Profiles: owner update"
  on profiles for update using (auth.uid() = id);

-- Inserts handled by trigger (security definer)

-- ── Journeys ──
-- Owners can CRUD their journeys; pros assigned to roles can read.
create policy "Journeys: owner full access"
  on journeys for all using (auth.uid() = created_by);

-- TODO: add policy for assigned pros to read journeys they're part of

-- ── Journey Roles ──
create policy "Journey roles: journey owner"
  on journey_roles for all using (
    exists (select 1 from journeys where journeys.id = journey_roles.journey_id and journeys.created_by = auth.uid())
  );

-- ── Verifications ──
create policy "Verifications: own records"
  on verifications for select using (auth.uid() = profile_id);

create policy "Verifications: admin manage"
  on verifications for all using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
  );

-- ── Teams ──
create policy "Teams: owner"
  on teams for all using (auth.uid() = owner_id);

-- ── Team Members ──
create policy "Team members: team owner"
  on team_members for all using (
    exists (select 1 from teams where teams.id = team_members.team_id and teams.owner_id = auth.uid())
  );

-- Pro can read their own membership
create policy "Team members: pro read own"
  on team_members for select using (auth.uid() = pro_id);
