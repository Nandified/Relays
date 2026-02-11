# Relays — Design Hard Rules (Source of Truth)

**Status:** ACTIVE (do not deviate unless Frank explicitly changes it)

## 0) Chosen Direction (Lock)
- **Primary visual direction:** **Option B — Apple‑ish consumer vibe (v2)**
- **Reference targets (authoritative):**
  - **Web app:** Thumbtack + Airbnb + Zillow
  - **Mobile app:** Airbnb + Uber
- This is the *north star* for UI look/feel.
- Other vibes (Stripe/Zillow) are optional explorations only; they must **not** replace or dilute Option B.

## 1) What We’re Producing (Scope)
We are producing **design direction + screen comps** that communicate product feel.
- Prioritize: layout, hierarchy, components, states, and UX patterns.
- De‑prioritize: implementation details, frameworks, backend assumptions.

## 2) No “Coding Mode” Outputs
Hard rule: **Do not turn this into a code project.**
- Avoid long CSS/HTML dumps as the main deliverable.
- Preferred deliverables:
  - **PNG screenshots** of the screens
  - **Short rationale bullets** (what changed + why)
  - Optional: a single HTML demo only when needed for quick visual iteration

## 3) Home Screen Philosophy (Operational OS)
Hard rule: The product is an **OS for pending items**, not a closing-date tracker.
- Do **not** require a closing date to make the Home screen useful.
- Home must emphasize:
  1) **What’s pending** (inspection needed, insurance needed, attorney review, appraisal, title, etc.)
  2) **What’s next** (single primary CTA)
  3) Ownership/assignment (who’s responsible)

## 4) Marketplace Philosophy (Thumbtack-like on Web)
Hard rule: **Web marketplace should feel Thumbtack-like.**
- Desktop web: **results list + sticky profile/preview panel**
- Search-first: user types the **service** needed.
- Companies/Individuals are **filters**, not default modes.

## 5) Real Estate Branding Requirements
Hard rule: Real estate pros need branding.
- Every pro/company profile must support:
  - **Company logo** display (brokerage/lender/insurance/etc.)
  - **Headshots / thumbnails** throughout (to make the app feel alive)

## 6) “Alive” Content Requirement
Hard rule: screens must look populated.
- Use **demo images** (headshots + galleries) so tiles are not blank.
- If remote images don’t reliably render in preview:
  - Use **embedded demo art** (simple avatars/tiles) or bundled images.

## 7) Component System (Apple‑ish)
Hard rule: stay consistent with Apple‑ish v2 system.
- 8pt spacing rhythm
- Calm neutrals + single strong accent
- Soft cards, subtle borders/shadows
- Clear, friendly hierarchy (low anxiety)

## 8) Scheduling UX Rules (Date First)
Hard rule: scheduling flow is:
1) **Pick date**
2) **Show time windows**
- Holds:
  - **Inspections: 2h window holds**
  - **Trades: 30–60m holds**

## 9) Feedback Loop / Change Control
Hard rule: When Frank dislikes a pattern, we **replace it**, not iterate endlessly on the same shape.
- Each revision should include:
  - What you changed
  - What user feedback it addresses
  - What we still need to validate

## 10) If There’s a Conflict
When unsure, follow this precedence:
1) Frank’s latest message
2) This hard-rules file
3) Apple‑ish v2 vibe system
4) Everything else
