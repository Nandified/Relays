# Relays — Context, Layout, and Data History (Ongoing)

> **Purpose of this doc**
> - A living “memory” of how the Relays repo is structured, what data files mean, and how the enrichment pipelines work.
> - Update this file whenever we change the data model, add scripts, change sources, or fix a recurring bug.
>
> **Last updated:** 2026-02-25

---

## 0) What Relays is (current)

Relays is a Next.js app (Vercel) with a Supabase-backed “marketplace” of professionals (licensed + enriched). The core idea is:

- **One canonical dataset** in Supabase: `public.licensed_professionals`
- **Enrichment** (ratings/reviews/photo/website/etc) from **Outscraper / Google Places** applied onto the canonical rows
- UI reads from Supabase for search + profile pages (to avoid bundling large local datasets).

---

## 1) Repo layout (high level)

At repo root (`/Relays`):

- `src/` — Next.js application code
- `scripts/` — data import/enrichment scripts
- `data/` — raw datasets + intermediate artifacts (kept out of prod bundles)
- `supabase/` — migrations
- `docs/` — project documentation (design/engineering/sources + this file)
- `next.config.ts` — Next config (notably, allowed remote image hosts)

Key directories under `data/`:

- `data/idfpr/` — Illinois (IDFPR) license datasets and enrichment artifacts
- `data/outscraper/` — Outscraper Google Places results + targeted search artifacts
- `data/homes_com/` — Homes.com scraping/enrichment experiments (Scrape.do bypass)
- Many other state folders (`data/california`, `data/texas`, etc.) with normalized broker datasets

---

## 2) Canonical database table (Supabase)

Canonical table: `public.licensed_professionals`

Defined in:
- `scripts/supabase/schema.sql`

Columns used by the app today:
- `id` (text, primary key)
- `slug` (text, unique) — legacy DB slug; UI generates a “pretty slug” (name-city-state)
- `name` (text, not null)
- `category` (text, not null)
- license fields: `license_number`, `license_type`
- org/location: `company`, `office_name`, `city`, `state`, `zip`, `county`
- enrichment: `phone`, `email`, `website`, `rating`, `review_count`, `photo_url`
- `source` (text) — e.g. `license` (default)

Indexes:
- trigram indexes on `name/company/city` for fast search
- `zip`, `category`, `state`

---

## 3) The enrichment model (what we mean by “no duplicates”)

**Goal:** keep one row per real professional in `licensed_professionals`, and **apply enrichment onto that row**.

Practical dedupe rules we’ve used / should keep using:

- If a person exists in a **state license dataset** (ex: IDFPR), that row is **canonical**.
- Outscraper/Google results should be used to **enrich** canonical rows (photo/rating/etc) instead of creating duplicate “Google-only” rows.
- Only create “Google-only” rows when we truly have a professional who is not represented in the license sources (this is optional / product decision).

Important: multiple Outscraper lists can contain duplicates across categories or queries. Google “identity” should be treated as:

- Primary key: `place_id` (stable)
- Secondary: normalized `name + phone + website` (fallback)

---

## 4) Outscraper enrichment artifacts (IDFPR -> Google)

File:
- `data/idfpr/idfpr_outscraper_enrichment.json`

Shape:
- `{ byLicenseNumber: { [licenseNumber]: { rating, reviewCount, photoUrl, website, phone, email, officeName, googlePlaceId } } }`

Notes:
- In our current enrichment file, about ~5k licensed rows have `photoUrl` populated.
- Photo URLs commonly come from:
  - `lh3.googleusercontent.com` (Google-hosted place photo)
  - `streetviewpixels-pa.googleapis.com` (street view thumbnail)

---

## 5) Scripts (import + enrichment)

### 5.1 Import licensed dataset into Supabase

- `scripts/supabase/import_licensed.mjs`
  - Imports licensed professionals into `public.licensed_professionals`.
  - Uses batching / retry/backoff.

### 5.2 Apply Outscraper enrichment onto existing Supabase rows

- `scripts/supabase/apply_outscraper_enrichment.mjs`
  - Input: `data/idfpr/idfpr_outscraper_enrichment.json`
  - Updates ONLY rows that already exist (UPDATE not UPSERT) to avoid inserting incomplete rows.
  - Writes: `office_name, phone, email, website, rating, review_count, photo_url, google_place_id`
  - Row id convention for IL: `idfpr_<licenseNumber>`
  - Safety: if `google_place_id` would violate uniqueness (already used), it applies enrichment but skips setting `google_place_id`.

### 5.3 Merge Outscraper Google listings (enrich + optionally include Google-only)

- `scripts/supabase/merge_outscraper_google_listings.mjs`
  - Added 2026-02-25.
  - Implements Frank’s rule: **keep all profiles, but no duplicates**.
  - De-dupes incoming lists by `place_id`.
  - Matches existing Supabase rows (in order):
    1) `google_place_id`
    2) website host
    3) phone
  - If matched: **UPDATE** canonical row (enrich fields + set `google_place_id`).
  - If not matched: **INSERT** a Google-only row with `id=google_<place_id>`, `source='google'`, and `google_place_id=<place_id>`.

Schema support:
- Migration: `supabase/migrations/20260225103000_add_google_place_id.sql`
- Canonical schema: `scripts/supabase/schema.sql` includes `google_place_id` + a partial unique index.

---

## 6) Images / headshots: why they break

The UI uses `next/image` for avatars.

Next.js blocks remote images unless the host is allow-listed in `next.config.ts`.

As of 2026-02-25 we expanded `images.remotePatterns` to include:
- `lh3.googleusercontent.com`
- `lh4.googleusercontent.com`
- `lh5.googleusercontent.com`
- `lh6.googleusercontent.com`
- `streetviewpixels-pa.googleapis.com`

Symptom when misconfigured:
- Images silently fail → UI falls back to initials.

---

## 7) Marketplace search & profiles (Supabase-driven)

Key endpoints/pages:

- `src/app/api/professionals/route.ts`
  - Searches `licensed_professionals` in Supabase
  - Avoids COUNT(*) for performance
  - Uses pretty slug for UI output

- `src/app/pros/[slug]/page.tsx`
  - Resolves claimed profiles (local) first
  - Otherwise loads unclaimed from Supabase

---

## 8) Outscraper targeted search (broker search)

Location:
- `data/outscraper/targeted_search_*`

Status helper:
- `data/outscraper/check_targeted_search.sh`

Notes (operational):
- Process can be “paused” via `targeted_search.paused`
- If Outscraper balance is $0, the job may crash/restart until topped up

---

## 9) Homes.com enrichment (Scrape.do)

Location:
- `data/homes_com/**`

Notes:
- Scrape.do can bypass Homes.com Akamai blocks (DataImpulse alone does not)
- Token must be passed via env var; do not commit it
- JSONL hygiene: newline-in-string corruption has been observed; use cleaned file when needed

---

## 10) Recent repo history (git log excerpts)

Recent commits (last ~30 as of 2026-02-25):
- 2026-02-24 Ops: allow pausing outscraper targeted search
- 2026-02-24 Unify marketplace card rendering
- 2026-02-24 UI: apply larger portrait avatar styling to licensed cards
- 2026-02-24 Perf: make zip-only search fast
- 2026-02-21 data: auto-sync enrichment (5159 Google matches)
- 2026-02-18 Add script to apply Outscraper enrichment to Supabase
- 2026-02-18 Fix Vercel bundle size: remove local data imports; use Supabase for pro pages

---

## 11) TODO / Next decisions (keep updated)

- ✅ We chose Option B: include Google-only rows **but dedupe/merge** into canonical license rows when confidently matched.
- Add fast matching helpers in DB:
  - Migration: `supabase/migrations/20260225114000_add_dedupe_helpers.sql`
  - Adds `relays_norm_host(url)` + `relays_norm_phone(p)` and indexes for scalable merges.
- Implement a cleanup/merge pass in SQL (preferred) or via script.
- Periodically audit `photo_url` domains so Next image config stays aligned.
