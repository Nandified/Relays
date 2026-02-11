# Relays (Real Estate launch) — Market Research + Launch Plan (Living Draft)

Owner: Frank (FRJ)
Prepared by: Clawd
Date: 2026-02-10

## Change Log (in-file track record)

- 🟦 2026-02-11 10:30 CT — Added visual identity requirements: pro headshots/thumbnails + company logos (real estate expects branding); make UI feel alive.
- 🟦 2026-02-10 16:29 CT — Org Admin powers: allow journey owner reassignment + agent account deletion/deactivation with guided data transfer (org-owned data only) + audit logging.
- 🟦 2026-02-10 16:24 CT — Added Org/Brokerage layer: tiered bundles + add-on seats; RBAC privacy rules (solo private, team lead control, brokerage oversight); dashboards + quota tracking; step-in model for admin/TC/assistants.
- 🟦 2026-02-10 15:57 CT — Added Artifact Index links under MASTER CHANGELOG sheet to prevent losing key docs/sheets.
- 🟦 2026-02-10 15:35 CT — UX correction: video is optional (not required); consumer flow is search → view profile → add to team → request booking; clarified video placement on pro profile header with bio/socials.
- 🟦 2026-02-10 15:32 CT — Added Relays Events Catalog (v0.1) for webhooks + Zapier/Make.
- 🟦 2026-02-10 15:29 CT — Added integrations principle: build Relays webhooks + Zapier/Make-first for long-tail CRM compatibility.
- 🟦 2026-02-10 13:12 CT — Cross-referenced all previous versions; restored missing public profile/UX/privacy details into FULL doc.
- 🟨 2026-02-09 17:44 CT — Added: multi-professional entry/contributions; deal roster/team; Homeworke express estimate → contractor Top 3; Realtor team roles; optional 15–30s intro video. Added: “curated-first, marketplace-second” guardrails and notifications/auth requirements.
- 🟦 2026-02-09 17:44 CT — Updated: highlighting system to be visible in Markdown via colored squares + timestamps (replaces HTML highlight).
- 🟩 2026-02-09 17:44 CT — Added concept: Curated Groups (multiple partner sets per pro) selectable per lead/journey.
- 🟦 2026-02-09 17:58 CT — Decision: Curated Groups are **internal** (lead-source/language routing) and **not disclosed** to clients. Added: simple Group UX requirements + placement/ordering importance.
- 🟨 2026-02-09 17:58 CT — Added: Title Companies as an optional role (esp. seller-side); include Top 3 options logic where applicable.
- 🟦 2026-02-10 12:25 CT — Decision: Brand = **Relays**; domain secured: RelaysApp.com. Group selection manual-first (pills) with optional defaults.
- 🟦 2026-02-10 12:48 CT — Decision: Shareable link tiering for groups: Tier1=3 share links; Mid=30; Top=unlimited; Custom tier. Video can be global default or group-specific variants.
- 🟦 2026-02-10 12:55 CT — Approved: Marketplace is open/searchable for browsing profiles/videos; **account + journey required** to add-to-team/contact/book.
- 🟦 2026-02-10 12:55 CT — Added: **Pros Free Tier** for marketplace presence (free account).
- 🟦 2026-02-10 13:02 CT — Decision: Free-tier pro leads delivered as **Request to Connect** (accept before details are shared).
- 🟦 2026-02-10 12:48 CT — Decision: Marketplace supports consumer “Dream Team” building as core value (especially for users without a Realtor yet).
- 🟦 2026-02-10 12:39–12:48 CT — Decision: Curated Groups are internal routing (lead source/language/scenario); not disclosed to clients; switching groups is logged.
- 🟨 2026-02-10 12:48 CT — Added: Share links map to groups (e.g., /zillow, /facebook, /spanish). Default group used if no context.

Legend used throughout: 🟨 NEW · 🟦 UPDATE · 🟩 NEW CONCEPT


🟦 UPDATE (2026-02-10) Artifact linking
- The **MASTER CHANGELOG** sheet now includes an **ARTIFACT INDEX** section with direct links to all canonical files/sheets.

---

## 0) Executive summary
You’re building a **referral operating system** for professionals. The wedge is Real Estate, but the platform expands to any industry where:
- a “trusted shortlist” matters,
- timing/moments matter,
- compliance/disclosure matters,
- and the buyer/client wants a frictionless way to choose + **book**.

**Winning thesis:** Be *narrow in the moment* and *broad in capability*.
- Narrow: the app always knows the next “referral moment” and produces a compliant **Top 3** recommendation in one tap.
- Broad: profiles, verification, booking orchestration, checklists, docs, post-service follow‑ups, and cross-sell hooks.

## 1) What exists today (closest competitors / substitutes)
### 1.1 Closest overlaps
**HomeKeepr** (closest in spirit)
- Strength: agent+homeowner retention platform; vendor/service pro network; “stay connected” post-transaction.
- Weakness / gap vs your vision: not explicitly built around **moment-based referral triggers + compliance Top 3 + booking + doc workflows**.

**HomeBinder**
- Strength: homeowner “binder” (docs, appliances, maintenance, recalls) + “Home Pros” recommendations; partner ecosystem.
- Weakness / gap: less agent-first workflow; the “referral moment” engine isn’t the hero; not built as a universal professional referral OS.

### 1.2 Adjacent
**Referrals.io**
- Agent-to-agent referrals: agreements, tracking, alerts.
- Not the “agent recommends vendors/pros to client during transaction” problem.

**Homebot**
- Engagement via home finance insights; nurtures clients and drives transactions.
- Not a referral moment + booking + docs engine.

### 1.3 Substitutes
- Manual vendor lists (PDF/Google Doc/Notion)
- Consumer marketplaces (Yelp/Thumbtack/Angi)
- Brokerage intranets / Facebook groups

**Conclusion:** yes, “pieces” exist; the exact product spine you described (moments + Top 3 compliance + booking + docs + Places growth loops) is still a gap.

## 2) The wedge: “Referral Moments + Top 3 compliant lists”
You win by being the default way a Realtor does referrals correctly.

### The core loop (agent)
1) Start client journey (name, address, stage).
2) App shows the **next moment** (what to do now).
3) Agent taps “Send Top 3 …” → client gets a clean share page.
4) Client books / requests booking.
5) Agent gets status + next moment.

### The core loop (client)
- Receives a clean shortlist with trust cues.
- Requests booking with minimal friction.
- Sees checklist + docs + timeline.

### The core loop (pro)
- Gets invited/claimed profile.
- Connects calendar.
- Accepts/declines/suggests times.
- Uploads docs (inspection report, etc.).

## 3) MVP journey moments (Real Estate v1)
P0 moments (launch):
- Pre-approval → Lender (Top 3)
- Offer accepted → Home Inspector (Top 3)
- Under contract → Insurance agent (Top 3)
- Attorney (market-dependent)
- Closing scheduled → mover/utilities (optional)
- Post-close → handyman/contractors + Homeworke hook

🟨 NEW (2026-02-09) **Core “team” roles to support inside a journey (home buying needs):**
- Realtor (primary owner once claimed)
- Lender
- Home Inspector
- Attorney
- Insurance Agent
- Contractors (via Homeworke)
- 🟨 NEW (2026-02-09) **Title Company** (optional; often seller-side / closing selection)

## 4) Product requirements: what makes it “stupid easy”
### 4.1 One-tap compliant Top 3
- Every “moment” category requires **3** recommendations (default to satisfy your compliance story where applicable).
- Each recommendation card shows:
  - name, photo/logo
  - rating (Google) + # of reviews
  - license/insurance badges (if provided)
  - service area + hours
  - CTA: call / text / website / **request booking**

### 4.2 Referral triggers
- Stage-based reminders (“Inspection window is now”)
- Event-based reminders (offer accepted, contract signed)
- Optional: calendar integration (closing date) to time prompts

### 4.3 Tracking + proof
- Log: what was recommended, when, to whom
- Client interaction signals (viewed/clicked/requested booking)
- This becomes the “return to app” habit.

## 5) Booking orchestration (value pillar)
**Problem today:** phone tag.

**Design goal:** book the referral partner with the least friction.

### 5.1 Recommended v1 booking model: tentative holds + pro confirmation
- Client/agent selects **2–3 preferred time windows**.
- Pro can:
  - Accept one option
  - Suggest a different time
  - Request a call first
- Once accepted:
  - Create calendar event(s)
  - Send confirmation + reminders + reschedule link

### 5.2 Calendar/CRM integrations (tiered)
Tier 1 (MVP): Google Calendar (busy/free + create/update events) + manual accept/decline.
Tier 2: Outlook; buffer rules; service area; multi-staff routing.
Tier 3: CRM/job systems (FUB/HubSpot; ServiceTitan/Jobber/Housecall Pro, etc.).

## 6) Contextual Networks + ownership + multi-professional referrals
### 6.1 Contextual Networks (anti rabbit-hole) — hard rule
A client experience always runs inside a **journey context** created/owned by a primary professional.
- Client sees **only** the providers relevant to that moment in that journey.
- Client does **not** see the provider’s partner graph (their other preferred realtors, etc.).

### 6.2 🟦 UPDATE (2026-02-09) Ownership rule
- Whoever invited/connected the client initially “runs” the journey context.
- If/when a Realtor is added/claimed, Realtor becomes the **primary owner** for the remainder of the transaction, while preserving attribution of who initiated.

### 6.3 Curated-first, marketplace-second
Default:
- Show **Curated Top 3** prominently.
- Provide a small escape hatch: “Need more options?” → shows broader results.
- Client can request to add a new pro; agent approves before it becomes “recommended.”

### 6.4 🟩 NEW CONCEPT (2026-02-09) Curated Groups (multiple partner sets)
Motivation: pros route leads by source/scenario/language; placement/order matters and often determines selection.

Concept:
- Any pro can create multiple **Groups** (e.g., Core, Zillow, Facebook, Spanish-only, Investor, Luxury, etc.).
- A journey is associated to exactly one active Group per role (default = Core).
- Switching a Group changes the curated Top 3 lists used.

🟦 UPDATE (2026-02-09) **Client disclosure policy:**
- Curated Groups are **internal routing** (respecting lead source + scenario).
- **Do not show “groups” labels to the client** in v1.
- Client simply sees the curated Top 3 + deal roster.

🟨 NEW (2026-02-09) **Group UX requirements (must be simple):**
- Create Group fast (name + optional tags: lead source, language, scenario)
- Easy to add/remove pros
- Simple ordering (placement matters)
- Ability to set default Group per lead source/language rules
- Audit log: group used + who changed it + when

### 6.5 🟨 NEW (2026-02-09) Multi-professional entry + recommendations
We support multiple professional accounts participating in a journey.
- Lender/inspector/etc. can recommend other roles (e.g., lender recommends top 3 Realtors).
- Journey displays the selected “team” as the deal roster.

### 6.6 Relationship trust tags (contextual)
Client-safe trust cues without exposing graphs:
- “FRJ Partner” badge
- “Worked together: X transactions” (this pro ↔ this pro)
- Response-time/acceptance-rate badges

## 7) Notifications + communication (non-negotiable)
The OS must drive behavior with proactive messaging to all parties.

### Channels (all platforms)
- Email + SMS (web + native)
- Push notifications (native iOS/Android)

### Triggers
- moment/stage triggers
- booking triggers
- document triggers

## 8) Identity / accounts (non-negotiable)
All versions require an account.

Frictionless sign-up options (v1):
- Magic link and/or one-time code (SMS)
- Continue with Google (Apple/FB later)

## 9) Entry points
Primary wedge: Realtor-led.
Secondary: consumer-led start (no Realtor yet) → invite/claim Realtor.

## 10) Monetization + Homeworke lead funnel
Recommended v1: SaaS for agents/teams/brokerages.

Homeworke integration:
- Inspection report → express estimate → recommend Top 3 contractors

## 11) Realtor team roles inside the journey
- Transaction Coordinator
- Assistant
- Additional agents

## 12) Professional intro video (15–30s)
Optional short intro video shown on profile.



## 19) Marketplace (open discovery) + “Dream Team” builder
🟦 UPDATE (2026-02-10)
- Relays has an **open, searchable marketplace** of professional profiles (public preview).
- Users can create an account and build their own **Dream Team** (Realtor/Lender/etc.) even if they don’t have a pro yet.

**Gating rule (approved):**
- Public can browse/search profiles and watch intro videos.
- To **add to team**, **contact**, or **request booking** → user must create an account and operate inside a journey/team context.

Why this matters:
- top-of-funnel acquisition (users find Relays first)
- preserves context + audit trail
- avoids turning into Yelp while still being useful



### Public profile contents (what anyone can see)
🟦 UPDATE (2026-02-10)
A public marketplace profile should include:
- pro identity + branding (name, company, logo/headshot)
- service area + specialties
- reputation signals (Google rating + review count)
- verified signals when available (license/insurance badges)
- optional 15–30s intro video

**Private by default:** curated partner lists, internal groups, and partner graphs are not exposed publicly.

### UX principle (granny-simple)
🟦 UPDATE (2026-02-10)
Primary consumer flow must be: **search → view profile → add to team → request booking**. (Video is optional.)
- big CTAs, minimal steps
- defer profile completion


🟦 UPDATE (2026-02-10) Video placement/role
- Video is **never required**.
- If provided, show it on the professional profile header (under/next to headshot) alongside: short bio, service area/specialties, social links, and other marketing details.
- Treat video as an optional trust/marketing enhancer, not a step in the funnel.


## 20) Curated Groups — share links, tiering, and defaults
🟦 UPDATE (2026-02-10)
- Group selection is **manual-first** via fast **pills** (Core | Zillow | Facebook | Spanish | +New).
- Optional: suggest a default group (language/lead source), but user can switch in one click.
- Switching a group is logged.

**Share links (monetizable):**
- Tier 1: **3 shareable links**
- Mid tier: **30 shareable links**
- Top tier: **unlimited**
- Custom tier

Each share link maps to one group, e.g.:
- relaysapp.com/u/frank → Default group
- relaysapp.com/u/frank/zillow → Zillow group
- relaysapp.com/u/frank/spanish → Spanish group

**Client disclosure:** groups are internal routing; do not label “Facebook/Zillow group” to clients in v1.

## 21) Privacy model (marketplace vs private groups)
🟦 UPDATE (2026-02-10)
- Marketplace profiles are public (preview).
- Curated groups and partner rosters shared inside journeys are private unless explicitly shared via a share link or invite.
- Future: add privacy controls per share link (unlisted vs public preview) if needed.

## 22) Pros Free Tier (supply strategy)
🟦 UPDATE (2026-02-10)
Pros can create a free account to:
- appear in marketplace search
- publish a profile + optional intro video
- receive basic inbound lead notifications

**Lead delivery (free tier):**
- Leads arrive as **Request to Connect**; pro must accept before exchanging details.

(Primary monetization can still be agent/team SaaS; free pro tier increases supply + completeness.)




## 23) Integrations strategy (webhooks + Zapier-first)
🟦 UPDATE (2026-02-10)
To connect to “all the popular CRMs” without building 50 brittle native integrations up front, Relays should be built with:
- **Inbound webhooks** (to receive events like: contact created/updated, tag applied, stage changed)
- **Outbound webhooks** (to send events like: journey created, booking requested, booking confirmed, doc uploaded)
- A Zapier/automation-friendly model (Zapier + Make), so agents can connect long-tail tools.

Implementation notes:
- Use stable object IDs (journey_id, person_id, pro_id)
- Support signed webhooks (HMAC) + replay protection
- Provide a simple event catalog (Relays Events) + mapping UI

Why:
- maximizes compatibility across CRMs (Follow Up Boss, kvCORE, HubSpot, etc.)
- lets teams self-serve niche workflows




## 24) Relays Events Catalog (v0.1)
🟦 UPDATE (2026-02-10)
Relays should expose a stable event model for webhooks + Zapier/Make.

Principles:
- events are versioned (e.g., `journey.created.v1`)
- signed webhooks (HMAC) + replay protection
- idempotency keys for actions
- privacy-safe payloads (avoid leaking sensitive data)

Core outbound events (examples):
- `person.created`, `person.updated`
- `journey.created`, `journey.owner_changed`, `journey.address_set`
- `pro.added_to_journey`, `curated_group.changed`
- `referral.sent`, `booking.requested/accepted/declined`
- `doc.requested`, `doc.uploaded`
- `connect.requested/accepted` (free-tier pro leads)

Core inbound actions (examples):
- `person.upsert`
- `journey.create`
- `tag.applied` → can map to `curated_group.selected` or journey stage

(Full row-by-row catalog lives in the Integration API Landscape sheet.)




## 25) Brokerage / Office / Team (Organization layer)
🟦 UPDATE (2026-02-10)
Relays needs an **Organization (Org)** layer above individual professionals to support brokerages, lender branches, and small teams.

### 25.1 Pricing model (decision) — Tiered bundles + add-on seats
**Decision:** Option 3 — **Tiered bundles**, with the ability to add seats inside a tier (so they don’t have to jump tiers prematurely).
- Example tiers (placeholder; final pricing later):
  - Team (up to N seats)
  - Office (up to N seats)
  - Enterprise
- Add-on: additional seats at a per-seat price within the tier.

### 25.2 Control vs privacy (real estate reality)
Real estate is **possessive** about lender/agent relationships and client data. Adoption depends on respecting that.

**Brokerage value they’ll pay for:**
- visibility into **who agents are referring to** (partner quotas/marketing agreements)
- visibility into **pipeline stage** of journeys
- visibility into activity volume (journeys created, referrals sent, booking requests)

**Brokerage should NOT:**
- rewrite an agent’s partner lists by default
- hijack client contexts without permission

### 25.3 Role-based access model (RBAC) — what you decided
**Org roles:**
- Admin (brokerage/office admin)
- Manager/Broker (oversight)
- Agent
- Transaction Coordinator (shared or per-team)
- Assistant

**Visibility rules (decision):**
- **Solo agent paid account:** 100% private to the solo agent, except their invited TCs/assistants.
- **Team paid account:** 100% controlled by the **team lead**, who can oversee their agents similar to an admin.
- **Brokerage/Org account:** brokerage wants control; provide **oversight dashboards** and journey visibility, but limit major changes.

**Permissions (recommended structure):**
- **Admin / TC / Assistant:** can view everything needed to step in (journeys, docs, booking status, messages).
- **Broker/Manager:** read-only visibility into referral routing + stages + metrics; limited intervention tools.
- **Agent:** full control of their own journeys within org policy guardrails.

### 25.4 Suggested dashboards (brokerage/team)
- Referral routing report: by agent → by partner → counts + stage distribution
- Quota tracking: partner agreement targets vs actual
- Operations: overdue milestones, pending bookings, missing docs
- Compliance/audit export: what was recommended, when, and disclosure shown

### 25.5 Intervention model (when someone steps in)

🟦 UPDATE (2026-02-10) Admin powers (office-level)
Because the office is paying, Org Admin should be able to:
- **Reassign journey ownership** (e.g., agent leaves firm)
- **Deactivate/delete an agent account** at any time

Data transfer policy (recommended):
- Offer a guided transfer to another agent/admin (journeys, client contacts within org, audit logs).
- Respect data boundaries: only transfer data that belongs to the Org workspace; exclude private personal workspaces.
- Every reassignment/deletion is logged with: who/when/reason.

To prevent abuse while still enabling help:
- default: managers have **read-only**
- escalation: agent can grant "step-in" privileges for a journey (or org policy can allow admin/TC auto step-in)
- every step-in action is logged




🟦 UPDATE (2026-02-11) Visual identity requirements (real estate)
- Every professional profile must support **company logo** display (brokerage/lender/insurance brands matter).
- Use **photo thumbnails** (not blank boxes) in roster tiles and marketplace cards to make the app feel “alive.”
  - Realtor/Lender: headshot + optional company logo
  - Companies: logo as primary + optional team headshots


## Appendix A: naming shortlist
- RelayPro
- ProRelay
- WarmIntro
- HandOff
- TrustLoop
- Shortlist
- ProPath
- Vouch