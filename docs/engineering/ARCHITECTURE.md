# Relays Web — Architecture (Baseline)

> **Strict scope:** Webapp-first. Build the public acquisition loop + request flow first (soft wall). Avoid premature dashboards, CRM, and heavy back office.

## Stack
- **Next.js** (App Router) + **TypeScript**
- **Tailwind** for styling (match vibe + hard rules)
- Data/auth deliberately **stubbed early**; choose provider once flows are locked.

## Source of Truth (must stay aligned)
- `../sources/RELAYS-DESIGN-HARD-RULES.md`
- `../sources/Relays-Research-Pack-FULL-v19.md`
- `../design/moodboard.html`
- `../design/vibes/`

## Routing (initial)
Public:
- `/` Home
- `/marketplace` Marketplace browse/search
- `/pros/[slug]` Pro profile
- `/request` Request intake (soft-wall before submit)
- `/login` `/signup`

Authed (consumer-first):
- `/app` Consumer dashboard landing
- `/app/requests` My requests list
- `/app/requests/[id]` Request detail (status timeline)

Later (pro):
- `/pro` Pro dashboard landing
- `/pro/requests` Incoming requests
- `/pro/profile` Manage public profile

## App structure (proposed)
```
src/
  app/
    (public)/
      page.tsx
      marketplace/page.tsx
      pros/[slug]/page.tsx
      request/page.tsx
      login/page.tsx
      signup/page.tsx
    (app)/
      app/page.tsx
      app/requests/page.tsx
      app/requests/[id]/page.tsx
  components/
    ui/            # reusable primitives
    marketplace/
    request/
    timeline/
  lib/
    routes.ts
    constants.ts
    types.ts
    mock-data.ts   # until DB is chosen
```

## Data model (MVP stubs)
- **Pro**: id, slug, name, company, services[], areas[], heroImage, verified?, rating?
- **Request**: id, userId, category, addressOrArea, notes, photos[], status, createdAt
- **User**: id, role (consumer|pro), name, email

## “Don’t modify shit” guardrails
- Each phase gets its own checklist (see `BUILD-CHECKLIST.md`).
- No refactors unless:
  1) it reduces complexity immediately, and
  2) it doesn’t change UI/behavior, and
  3) we agree explicitly.
- Before changing any UI patterns, re-check HARD RULES.
