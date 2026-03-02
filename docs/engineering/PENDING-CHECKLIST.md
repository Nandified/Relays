# Relays — Pending Build Checklist (Trello/Notion Style)

**Canonical authed route:** `/app` (keep `/dashboard` as alias redirect → `/app`)

---

## LIST 0 — Decisions / Setup (Blockers)
- [ ] Confirm soft-wall rules (exact triggers)
  - Browse is public
  - Auth required for: Add to Team, Request Booking / Submit request, Save/Contact
- [ ] Set canonical authed route = `/app`
- [ ] Add redirects/aliases
  - [ ] `/dashboard` → `/app`
  - [ ] (Optional) any legacy routes you want to keep

**Exit criteria:** no ambiguity on auth gates + route map.

---

## LIST 1 — MVP‑1 Public Acquisition Loop (Must ship)
### Home (`/`)
- [ ] Hero CTAs + search (already present — verify polish)
- [ ] Homepage search → marketplace state transfer (query, zip, category)
- [ ] “How it works” section (3 steps)
- [ ] Footer + standard links (pricing, support, terms, privacy)

### Marketplace (`/marketplace`)
- [ ] Search supports: name / company / profession + zip (looks implemented — validate)
- [ ] Filters/chips: category + Verified Only + Accepting Clients (validate behavior)
- [ ] Mobile UX: inline expand card details (per feedback) (validate/finish)
- [ ] “View Full Profile” always works + preserves back link

### Pro profile (public) (`/pros/[slug]`)
- [ ] Ensure licensed/unclaimed profiles resolve reliably (UUID public_id path)
- [ ] Soft CTA: “Are you [Name]? Claim this profile →”
- [ ] Hide sensitive license IDs from consumer view (per spec)

**Exit criteria:** A new visitor can browse + search + open profiles and hit a clear soft-wall when trying to take action.

---

## LIST 2 — MVP‑2 Consumer Request Flow + `/app` (Core product)
### Auth (minimal but real)
- [ ] Magic link + OAuth verified end-to-end
- [ ] Post-auth redirect works (back to intended action)

### Theme (system default + manual override)
- [ ] Add settings control to set theme: **System / Light / Dark**
  - Toggle remains quick light↔dark override
  - Settings allows returning to **System** (persisted)

### Request intake (soft-walled)
- [ ] `/request` or `/requests/new` (pick one canonical)
- [ ] Stepper: category → location → details → confirm
- [ ] Confirmation page + next steps

### Consumer app area (`/app`)
- [ ] `/app` landing = “What’s pending / what’s next” (Hard Rule #3)
- [ ] `/app/requests` list (real data)
- [ ] `/app/requests/[id]` detail + status timeline (real data)
- [ ] Ability to “Add to Team” (requires auth; persists)

**Exit criteria:** A signed-in consumer can submit a request, see it in `/app`, and track progress.

---

## LIST 3 — MVP‑3 Pro Claim + Pro Onboarding (Supply-side unlock)
### Claim flow (from `CLAIM-FLOW.md`)
- [ ] `/api/claim` endpoint (server-side verification)
- [ ] Claim UI flow (multi-step)
- [ ] Primary verification: license number matches profile
- [ ] Optional secondary ID fields by category (MLS/NMLS/ARDC/etc)
- [ ] Rate limiting + audit log (`claim_attempts`)
- [ ] Post-claim: pro can edit profile + gets verified badge

### Pro onboarding + pro area
- [ ] `/pro/onboarding` flow (currently redirects to login — finish)
- [ ] `/pro/profile` editor (bio, photo, service areas, booking link, etc.)
- [ ] `/pro/requests` inbox (at least shell + demo if matching not built)

**Exit criteria:** A real professional can claim, edit, and become a first-class profile.

---

## LIST 4 — Monetization + Share Links (Pricing must map to reality)
- [ ] Implement “Curated groups (share links)” creation + limits per tier
- [ ] Share page route(s) (`/u/...` or whatever we standardize)
- [ ] Tier gating (Free=1, Pro=3, Pro+=30/seat, etc. per `docs/PRICING.md`)
- [ ] Upgrade flow stub (Stripe later; for now gating + UI is fine)

**Exit criteria:** The thing you sell (share links) exists and is limitable.

---

## LIST 5 — Operationalization (Post‑MVP)
- [ ] Matching (manual → rules)
- [ ] Messaging
- [ ] Scheduling (date-first rule)
- [ ] Payments
- [ ] Reviews end-to-end
- [ ] Admin dispute tools for claims

---

## Confirmations
1) For consumer request intake, canonical route: `/request` or `/requests/new`?
2) For pro area, canonical route: `/pro/...` or `/app/pro/...`?
