# Relays — Feature Shipping Plan (Design-First)

**Design north star:** Option B “Apple‑ish consumer vibe (v2)”
- Source of truth: `Relays/docs/sources/RELAYS-DESIGN-HARD-RULES.md`

**Canonical authed route:** `/app`
- Pending checklist: `Relays/docs/engineering/PENDING-CHECKLIST.md`

> Rule: **Do a full-page audit on the deployed app before shipping code.**
> This plan assumes we start each sprint with a UI pass and keep visuals consistent.

---

## 0) Pre-flight: Full-page audit (required before code)

### 0.1 Create an “As-Is” page inventory
Capture:
- Route
- Screenshot (desktop + mobile)
- Notes: what feels off vs hard rules (spacing, typography, shadows, chips, empty states)
- Notes: broken links / 404s / auth redirects

Suggested audit set (start here):
- Public: `/`, `/marketplace`, `/pros/[slug]`, `/pricing`, `/real-estate-pro`, `/login`, `/signup`, `/about`, `/contact`, `/help`
- Consumer demo/authed-ish: `/requests`, `/requests/[id]`, `/documents`, `/team`, `/settings`, `/notifications`, `/messages`
- Pro/authed: `/pro/onboarding`, `/pro/dashboard`, `/pro/profile`, `/pro/groups`, `/pro/requests`, `/pro/verification`
- Org: `/org/*`
- Developers: `/developers/*`
- Admin: `/admin/*`

### 0.2 Make a “Design Consistency Checklist” (fast)
- 8pt spacing rhythm
- One accent color, calm neutrals
- Card radius + border + shadow consistent
- Chip/button styles consistent
- Empty/loading states present and on-brand
- Next/Image remote hosts OK (no broken avatars)
- **Theme parity:** dark + light mode must both look intentional
- **System support:** respect OS setting via `prefers-color-scheme` (default to system; user can override)

**Exit:** we know exactly what the current UI looks like and what must stay consistent.

---

## 1) Sprint A — Foundations + Route Canonicalization (no new features)
Goal: remove confusion and prevent rework.

- [ ] Implement `/dashboard` → `/app` alias redirect
- [ ] Decide canonical request route: recommend `/request` (alias `/requests/new`)
- [ ] Decide canonical pro area: recommend `/pro/...` (keep separate from consumer)
- [ ] Confirm soft-wall trigger points + ensure UI uses them consistently
- [ ] Add **Theme setting**: System / Light / Dark (persisted) so users can return to System after toggling

**Exit:** route map is stable; auth gates are predictable.

---

## 2) Sprint B — MVP-1 polish to match the mood (public acquisition loop)
Goal: make the public experience feel “done” and on-vibe.

- [ ] Home: ensure search UX + marketplace handoff is flawless
- [ ] Marketplace:
  - [ ] Validate filters behavior
  - [ ] Mobile: inline expansion behavior (no bottom preview pain)
  - [ ] Empty + loading states
- [ ] Pro profile:
  - [ ] Unclaimed profile template matches claimed profile layout
  - [ ] “Claim this profile” CTA styling is subtle + trustworthy

**Exit:** a new visitor can browse/search/profiles and it feels consistent with Option B.

---

## 3) Sprint C — MVP-2 consumer flow (real request intake + `/app`)
Goal: make Relays feel like an OS for pending items.

- [ ] `/request` stepper (category → location → details → confirm)
- [ ] Confirmation page with single clear “next” CTA
- [ ] `/app` landing (Hard Rule #3): pending items + next action
- [ ] `/app/requests` + `/app/requests/[id]` (real data)
- [ ] “Add to Team” persists (requires auth)

**Exit:** consumer can create a request and track it in `/app`.

---

## 4) Sprint D — MVP-3 pro claim + onboarding (supply-side unlock)
Goal: convert marketplace inventory into real owned profiles.

- [ ] Build `/api/claim` (license-number verification)
- [ ] Claim UI (multi-step)
- [ ] Optional IDs (MLS/NMLS/ARDC/etc)
- [ ] Post-claim profile editor (`/pro/profile`)
- [ ] `/pro/onboarding` finished end-to-end

**Exit:** a real pro can claim + edit + become verified.

---

## 5) Sprint E — Monetization: curated groups/share links
Goal: implement what pricing actually sells.

- [ ] Create/manage curated groups (share links)
- [ ] Public share pages (`/u/[username]/[groupSlug]`)
- [ ] Tier limits per `Relays/docs/PRICING.md`

**Exit:** share links exist and are limitable by plan.

---

## Working agreements (to keep us fast)
- **No visual drift**: before any new UI component, check hard rules.
- **Small PRs**: ship changes in slices that are reviewable.
- **No refactors unless they reduce complexity immediately** (per architecture guardrails).
