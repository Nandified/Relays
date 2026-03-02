# Relays — UI Audit (As-Is)

Purpose: capture the current deployed UI across **all pages** so we can ship features without visual drift.

Rules:
- Audit **dark + light** modes.
- Default theme should follow **system** (`prefers-color-scheme`).
- Note any inconsistencies vs Option B (Apple‑ish v2) hard rules.

## How to record each page
For each route, capture:
- Route
- Screenshot (desktop + mobile)
- Mode: dark / light
- Notes:
  - design inconsistencies (spacing, typography, shadows, chips)
  - broken states (loading/empty)
  - broken links / auth redirects / 404

## Page inventory
### Public / Marketing
- [ ] `/`
- [ ] `/marketplace`
- [ ] `/pricing`
- [ ] `/real-estate-pro`
- [ ] `/about`
- [ ] `/contact`
- [ ] `/help`
- [ ] `/login`
- [ ] `/signup`

### Profiles
- [ ] `/pros/<known-slug>` (claimed demo)
- [ ] `/pros/<public_id>` (licensed/unclaimed)

### Consumer / App-ish
- [ ] `/requests`
- [ ] `/requests/<id>`
- [ ] `/documents`
- [ ] `/team`
- [ ] `/settings`
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
