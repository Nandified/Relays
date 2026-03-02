# Applying Supabase migrations (manual)

This Supabase project currently does **not** have the `profiles` / `orgs` tables applied.

## What to do

1) Open Supabase SQL Editor for the project.
2) Run migrations in order:
   1. `supabase/migrations/001_initial_schema.sql`
   2. `supabase/migrations/20260224094700_add_trgm_indexes_for_search.sql`
   3. `supabase/migrations/20260225103000_add_google_place_id.sql`
   4. `supabase/migrations/20260225114000_add_dedupe_helpers.sql`
   5. `supabase/migrations/20260225133000_add_public_id.sql`
   6. `supabase/migrations/20260302143500_add_orgs_and_memberships.sql`

3) After applying, re-run:

```bash
cd /Users/Clawdbot/clawd/Relays
node --env-file .env.local scripts/supabase/seed_access_accounts.mjs
```

That second run will:
- set DB-backed roles in `profiles.role`
- create the org `the-frj-group`
- create org memberships (owner/admin)

## Notes
- Auth users were already created for the requested emails.
- Magic link sign-in will work once Supabase email provider is configured (SMTP or built-in).
