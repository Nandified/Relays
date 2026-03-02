# Relays — UI Audit (As-Is)

Purpose: capture the current deployed UI across **all pages** so we can ship features without visual drift.

Rules:
- Audit **dark + light** modes.
- Default theme should follow **system** (`prefers-color-scheme`).
- Note any inconsistencies vs Option B (Apple‑ish v2) hard rules.

**Deployed:** https://relays-psi.vercel.app
**Audit date:** 2026-03-02

---

## Summary (ranked)

### P0 — Breaks flow / must-fix
- **Canonical consumer authed route `/app` is 404** (currently missing on deploy).
- **Auth surface mismatch:** `/dashboard` is the authed landing (redirects to login), but `/settings`, `/requests`, etc appear accessible without auth (verify intended).
- **Theme/system edge case:** if a user previously set dark mode, then clears localStorage, the `<html class="dark">` can persist until a reload that explicitly sets theme. Recommend: on ThemeProvider init, always apply resolved theme even when `localStorage.theme` is missing (and/or explicitly write `"system"` on first run).

### P1 — Noticeable inconsistencies
- Settings is extremely content-heavy (demo content) and may not match expected auth gating.
- Multiple internal areas (org/admin/pro) exist and should be audited for visual consistency once authed.

### P2 — Polish
- Continue auditing remaining routes with screenshots and note any spacing/typography/card/chip inconsistencies.

---

## Theme verification notes
- Setting `localStorage.theme = "system"` correctly follows `prefers-color-scheme` and updates the root `dark` class.
- Manual toggle persists (writes `localStorage.theme = light|dark`).

---

## How to record each page
For each route, capture:
- Route
- Screenshot (desktop + mobile)
- Mode: dark / light
- Notes:
  - design inconsistencies (spacing, typography, shadows, chips)
  - broken states (loading/empty)
  - broken links / auth redirects / 404

---

## Page inventory

### Public / Marketing
- [x] `/`
  - Notes: looks on-vibe (Option B). Header toggle works.
- [x] `/marketplace`
  - Notes: core browse/search present.
- [x] `/pricing`
- [x] `/real-estate-pro`
- [ ] `/about`
- [ ] `/contact`
- [ ] `/help`
- [x] `/login` (shows magic link + Google/Apple)
- [x] `/signup`

### Profiles
- [x] `/pros/<known-slug>` (claimed demo)
  - Example tested: `/pros/lisa-hartwell-realtor?back=%2Fmarketplace`
- [ ] `/pros/<public_id>` (licensed/unclaimed)

### Consumer / App-ish
- [x] `/requests`
  - Notes: currently accessible without auth; likely demo.
- [x] `/requests/<id>`
- [x] `/documents`
- [ ] `/team`
- [x] `/settings`
  - Notes: Theme System/Light/Dark selector present; appears accessible without auth.
- [ ] `/notifications`
- [ ] `/messages`
- [ ] `/messages/<conversationId>`
- [ ] `/journey/<id>`
- [ ] `/review/<proSlug>`
- [ ] `/book/<proSlug>`

### Pro
- [ ] `/pro/onboarding`
- [ ] `/pro/dashboard`
- [ ] `/pro/profile`
- [ ] `/pro/groups`
- [ ] `/pro/groups/<id>`
- [ ] `/pro/requests`
- [ ] `/pro/requests/<id>`
- [ ] `/pro/journeys`
- [ ] `/pro/bookings`
- [ ] `/pro/reviews`
- [ ] `/pro/settings`
- [ ] `/pro/verification`

### Org
- [ ] `/org`
- [ ] `/org/members`
- [ ] `/org/journeys`
- [ ] `/org/reports/*` (compliance/operations/quotas/referrals)

### Developers
- [ ] `/developers/events`

### Admin
- [ ] `/admin`
- [ ] `/admin/pros`
- [ ] `/admin/categories`
- [ ] `/admin/verification`
- [ ] `/admin/metrics`
- [ ] `/admin/team`
- [ ] `/admin/data-import`

---

## Known 404s / redirects (as observed)
- `/app` → 404
- `/dashboard` → redirects to `/login?redirect=/dashboard`
- `/admin` → redirects to `/login?redirect=/admin`
- `/pro/dashboard` → redirects to `/login?redirect=/pro/dashboard`
