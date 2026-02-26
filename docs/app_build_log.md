# Relays — App Build Log

This is the running log of product/engineering changes made in the Relays app repo.

---

## 2026-02-26 — Search + Profile Performance + Homepage UX

### Goals
- Make homepage + marketplace search feel fast and consistent.
- Avoid leaking license identifiers in URLs.
- Speed up professional profile page loads.
- Remove Google Places suggestions from homepage typeahead (DB-only).
- Fix homepage dropdown layering (not hidden behind the logo strip/banner).

### Key changes

#### 1) Faster profile page loads: use `public_id` in URLs
- Updated navigation from search results to prefer `/pros/<publicId>` (UUID) when available.
- Benefit: profile page can resolve with a single fast query (`eq(public_id, ...)`) rather than multiple fallback lookups.
- Commits:
  - `141ee70` — Use publicId in pro profile links for faster loads

#### 2) Homepage dropdown stacking (z-index)
- Issue: homepage typeahead dropdown was rendering behind the logo strip/banner section.
- Fix: adjust stacking context so the hero section sits above the logo strip; raise dropdown z-index when active.
- Commits:
  - `c797a89` — Fix homepage search dropdown z-index over hero banner
  - `d2b81ec` — Fix homepage search dropdown stacking above logo strip

#### 3) Homepage search should be DB-only (no “More from Google”)
- Removed Google Places suggestions from homepage typeahead; keep suggestions to Relays DB sources:
  - "On Relays" (curated/claimed pros)
  - "Licensed Professionals" (licensed_professionals)
- Commits:
  - `730f00c` — Remove Google Places suggestions from homepage search
  - `95cd163` — Homepage search: DB-only suggestions + marketplace-style avatars/ratings

#### 4) Homepage typeahead UI: avatar + rating alignment
- Iterated to match Marketplace styling (4:5-ish portrait tile, subtle rounding, photo if enriched else gradient initials).
- Added an extra info row (office/company) to balance the row.
- Commits:
  - `738ef11` — Match homepage typeahead avatar size/radius to Marketplace
  - `90e9f10` — Homepage typeahead: less-rounded slightly smaller avatars + extra info line

#### 5) Typeahead relevance improvements (big-tech ranking behavior)
- Problem: alphabetical `ILIKE` results + small limit can surface odd matches and miss many better ones.
- Fixes:
  - Client-side: fetch more (25) then re-rank to prefer name matches.
  - Server-side (typeahead-only): new `typeahead=1` parameter makes API prefer `name ILIKE '<q>%` (prefix) first, then fills remainder with normal contains search.
- Commits:
  - `567352c` — Typeahead: fetch more + re-rank to prefer name matches
  - `020700e` — Typeahead: server-side name prefix preference (typeahead=1)

### Supabase-related context (what supports this)
- Trigram indexes for fast `ILIKE` search on `licensed_professionals`:
  - `supabase/migrations/20260224094700_add_trgm_indexes_for_search.sql`
- Opaque `public_id` + unique index + backfill RPC:
  - `supabase/migrations/20260225133000_add_public_id.sql`
  - `scripts/supabase/backfill_public_id.mjs`
  - `scripts/supabase/ensure_backfill_public_id.sh`

---
