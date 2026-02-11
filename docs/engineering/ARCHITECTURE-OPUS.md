# Relays Web — Architecture Proposal (Opus)

> **Author:** Clawd (Claude Opus) · **Date:** 2026-02-11  
> **Status:** PROPOSAL — requires Frank's approval before any code changes  
> **Scope:** MVP-first webapp architecture. Deliberately ignores mobile-native, CRM back-office, payments, and messaging until the public acquisition loop is proven.

---

## Table of Contents

0. [Design Constraints (DO NOT CHANGE)](#0-design-constraints-do-not-change)
1. [Guiding Principles](#1-guiding-principles)
2. [Folder Structure](#2-folder-structure)
3. [Route Map](#3-route-map)
4. [Component Conventions](#4-component-conventions)
5. [Design Tokens](#5-design-tokens)
6. [Data Model Stubs](#6-data-model-stubs)
7. [API Boundaries](#7-api-boundaries)
8. [Auth & Wall Strategy](#8-auth--wall-strategy)
9. [Scope Creep Guardrails](#9-scope-creep-guardrails)
10. [Phasing Contract](#10-phasing-contract)
11. [vs. Typical Next.js App](#11-vs-typical-nextjs-app)

---

## 0. Design Constraints (DO NOT CHANGE)

These are derived directly from `RELAYS-DESIGN-HARD-RULES.md` and Frank's decisions in `Relays-Research-Pack-FULL-v19.md`. **No PR, commit, or design exploration may violate them.**

| # | Hard Rule | Source | What It Means for Code |
|---|-----------|--------|------------------------|
| HR-0 | **Option B — Apple-ish consumer vibe (v2)** is the locked visual direction. Thumbtack + Airbnb + Zillow reference for web. | Hard Rules §0 | Every component must use the token system in §5 below. No Material UI, no Stripe-dark, no Shadcn defaults without reskinning. |
| HR-1 | **Home = OS for pending items**, not a closing-date tracker. | Hard Rules §3 | Home screen always leads with "what's pending → what's next → who owns it." Never gate Home usefulness behind a closing date. |
| HR-2 | **Marketplace = Thumbtack-like.** Desktop: results list + sticky preview panel. Search-first by service. | Hard Rules §4 | `/marketplace` page is a two-column layout. Left: scrollable results. Right: sticky selected-profile panel. Primary input: service search, not company/individual toggle. |
| HR-3 | **Branding required.** Every pro/company card must support company logo + headshot. | Hard Rules §5 | `ProCard` and `ProProfile` components always render image slots. No "initials-only" fallback as the designed state — use embedded demo art per HR-4. |
| HR-4 | **Screens must look populated.** Use demo images; never ship blank tiles. | Hard Rules §6 | Ship a `/public/demo/` directory with placeholder headshots, logos, gallery images. Mock data always includes image URLs. |
| HR-5 | **8pt spacing, calm neutrals + single strong accent, soft cards, subtle shadows.** | Hard Rules §7 | Tailwind config enforces 8pt base. One accent color (`--accent: #3B82F6`). Card radii 14–16px. Box shadows use the design-token values, not Tailwind defaults. |
| HR-6 | **Scheduling = date first → time windows.** Inspections: 2h holds. Trades: 30–60m. | Hard Rules §8 | When we build scheduling (Phase 4+), the stepper is always Date → Time. Never a single datetime picker. |
| HR-7 | **Replace, don't iterate endlessly.** When Frank dislikes a pattern, scrap it and try a new shape. | Hard Rules §9 | Every UI revision commit message must state: what changed, what feedback it addresses, what needs validation. |
| HR-8 | **Conflict precedence:** Frank's latest message > Hard Rules > Apple-ish v2 system > everything else. | Hard Rules §10 | If this document conflicts with a newer Frank message, Frank wins. |
| HR-9 | **Public browse is free; account + journey required to act.** | Research Pack §19 | Soft wall triggers at: submit request, add-to-team, contact pro, request booking. |
| HR-10 | **Curated Groups are internal.** Never label them to clients in v1. | Research Pack §6.4, §20 | No "Zillow group" or "Facebook group" text in any consumer-facing UI. |

---

## 1. Guiding Principles

1. **Ship the funnel first.** The only thing that matters in Phase 1 is: stranger lands → browses marketplace → finds a pro → hits the auth wall → creates account → submits a request. Every engineering decision optimizes for this loop.

2. **Static until proven dynamic.** Default to static/ISR pages. Only add client-side interactivity when the UX literally can't work without it (search autocomplete, modals, form steppers).

3. **Stubs over integrations.** Auth, database, payments, messaging — all stubbed behind interfaces from day one. We pick providers *after* the UI flows are locked. This prevents vendor lock-in and premature optimization.

4. **One accent, one typeface, one token file.** Design consistency is enforced by a single token source (`globals.css` + Tailwind theme). No per-component color overrides.

5. **Mock data is real data's shape.** Every mock object matches the eventual API contract exactly. When we swap mocks for a real backend, zero component changes required.

---

## 2. Folder Structure

```
src/
├── app/                          # Next.js App Router (routes only)
│   ├── (public)/                 # Route group: no auth required
│   │   ├── page.tsx              # Home (/)
│   │   ├── marketplace/
│   │   │   └── page.tsx          # /marketplace
│   │   ├── pros/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # /pros/:slug
│   │   ├── login/
│   │   │   └── page.tsx          # /login
│   │   └── signup/
│   │       └── page.tsx          # /signup
│   ├── (app)/                    # Route group: auth required (consumer)
│   │   ├── layout.tsx            # App shell (sidebar/nav)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # /dashboard (home = pending items OS)
│   │   ├── team/
│   │   │   └── page.tsx          # /team (my Dream Team roster)
│   │   └── requests/
│   │       ├── page.tsx          # /requests (list)
│   │       └── [id]/
│   │           └── page.tsx      # /requests/:id (detail + timeline)
│   ├── (pro)/                    # Route group: auth required (pro role)
│   │   ├── layout.tsx            # Pro shell
│   │   ├── dashboard/
│   │   │   └── page.tsx          # /pro/dashboard
│   │   ├── requests/
│   │   │   ├── page.tsx          # /pro/requests (incoming)
│   │   │   └── [id]/
│   │   │       └── page.tsx      # /pro/requests/:id
│   │   └── profile/
│   │       └── page.tsx          # /pro/profile (editor)
│   ├── layout.tsx                # Root layout (fonts, globals, providers)
│   ├── not-found.tsx             # 404
│   └── globals.css               # Design tokens + Tailwind base
│
├── components/
│   ├── ui/                       # Primitives (Button, Card, Input, Badge, Avatar, Modal)
│   ├── layout/                   # Header, Footer, Sidebar, MobileNav
│   ├── marketplace/              # SearchBar, ProCard, ProPreviewPanel, FilterBar
│   ├── pro-profile/              # ProfileHeader, ServiceList, VideoEmbed, ReviewSummary
│   ├── request/                  # RequestStepper, RequestCard, StatusTimeline
│   └── home/                     # PendingItems, NextActionCTA, TeamRoster
│
├── lib/
│   ├── types.ts                  # Shared TypeScript types (data model)
│   ├── constants.ts              # App-wide constants (routes, labels, enums)
│   ├── routes.ts                 # Typed route helper: routes.pros.detail(slug)
│   ├── mock-data.ts              # Mock objects (shape = future API response)
│   ├── utils.ts                  # Pure utility functions
│   ├── auth/
│   │   ├── provider.tsx          # Auth context provider (stubbed)
│   │   ├── guard.tsx             # Route guard component
│   │   └── types.ts              # User, Session types
│   └── api/
│       ├── client.ts             # Fetch wrapper (base URL, headers, error handling)
│       ├── pros.ts               # getPros(), getProBySlug() — calls mock-data for now
│       ├── requests.ts           # createRequest(), getRequests(), etc.
│       └── users.ts              # getCurrentUser(), etc.
│
└── public/
    ├── demo/                     # Placeholder images (headshots, logos, galleries)
    │   ├── headshots/
    │   ├── logos/
    │   └── gallery/
    ├── icons/                    # App icons, favicon
    └── og/                       # Open Graph images
```

### Key decisions

- **Route groups `(public)`, `(app)`, `(pro)`** share the URL space but have separate layouts and auth behavior. No `/app` prefix in URLs — consumers see `/dashboard`, `/requests`, etc.
- **`components/` is flat by domain**, not nested by route. A component used in two routes lives in the domain it belongs to (`marketplace/ProCard`), not duplicated.
- **`lib/api/` is the only place that touches data.** Components never fetch directly. This makes the mock→real swap a single-directory change.
- **No `hooks/` directory yet.** Add it when we have 3+ custom hooks. Until then, colocate.
- **No `services/`, `stores/`, `contexts/` directories yet.** YAGNI. Auth context is the only state that's global; it lives in `lib/auth/`.

---

## 3. Route Map

### Phase 1 — Public Acquisition Loop

| Route | Page | Auth | Notes |
|-------|------|------|-------|
| `/` | Home / Landing | Public | Hero + how-it-works + CTA to marketplace |
| `/marketplace` | Marketplace browse | Public | Search + filter + results + sticky preview panel (HR-2) |
| `/pros/[slug]` | Pro profile | Public | Full profile; CTA triggers soft wall (HR-9) |
| `/login` | Login | Public | Magic link / Google OAuth (stub) |
| `/signup` | Sign up | Public | Role selection (consumer vs pro) |

### Phase 2 — Consumer Dashboard

| Route | Page | Auth | Notes |
|-------|------|------|-------|
| `/dashboard` | Pending items OS | Consumer | What's pending, what's next, who owns it (HR-1) |
| `/team` | My Dream Team | Consumer | Roster of added pros |
| `/requests` | My requests | Consumer | List view |
| `/requests/[id]` | Request detail | Consumer | Status timeline + docs |

### Phase 3 — Pro Dashboard

| Route | Page | Auth | Notes |
|-------|------|------|-------|
| `/pro/dashboard` | Pro home | Pro | Incoming leads, pending actions |
| `/pro/requests` | Incoming requests | Pro | Accept/decline queue |
| `/pro/requests/[id]` | Request detail | Pro | Respond, update status |
| `/pro/profile` | Profile editor | Pro | Edit public profile (HR-3, HR-4) |

### Phase 4+ — Deferred

| Route | Notes | Phase |
|-------|-------|-------|
| `/pro/calendar` | Availability + scheduling (HR-6) | 4 |
| `/pro/groups` | Curated Group management (HR-10) | 4 |
| `/admin/*` | Org/brokerage dashboards (Research Pack §25) | 5+ |
| `/u/[username]` | Public share links (Research Pack §20) | 4 |
| `/u/[username]/[group]` | Group-specific share link | 4 |

---

## 4. Component Conventions

### Naming
- **PascalCase** for components: `ProCard.tsx`, `SearchBar.tsx`
- **One component per file.** If it needs sub-components, make a directory: `ProCard/index.tsx`, `ProCard/ProCardSkeleton.tsx`
- **No `index.tsx` barrels** at the `components/` root. Import from `@/components/marketplace/ProCard` explicitly.

### File anatomy
```tsx
// components/marketplace/ProCard.tsx

import { type Pro } from "@/lib/types";
// ^ Types first

import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
// ^ Internal imports, grouped

interface ProCardProps {
  pro: Pro;
  onClick?: (slug: string) => void;
  selected?: boolean;
}
// ^ Props interface, always named {Component}Props, always above component

export function ProCard({ pro, onClick, selected }: ProCardProps) {
  return (
    <Card selected={selected} onClick={() => onClick?.(pro.slug)}>
      {/* HR-3: Always render headshot + company logo slots */}
      <Avatar src={pro.headshotUrl} alt={pro.name} />
      {/* ... */}
    </Card>
  );
}
// ^ Named export. No default exports (enables tree shaking + refactor safety).
```

### Rules

1. **Server Components by default.** Only add `"use client"` when the component needs interactivity (onClick handlers, useState, useEffect). Search autocomplete, modals, and form steppers are client components. Everything else is server.

2. **No prop drilling beyond 2 levels.** If data needs to go deeper, either restructure the component tree or use a context (but only `AuthContext` exists in Phase 1–3).

3. **Every component that renders a pro must include image slots** (HR-3). Use `Avatar` with a required `src` prop (falls back to demo art, never to initials).

4. **Loading and empty states are mandatory.** Every page-level component ships with a `loading.tsx` (Next.js convention) and handles the empty-data case explicitly (HR-4: never blank tiles).

5. **No component may import from `lib/mock-data.ts` directly.** Always go through `lib/api/*` so the swap to real APIs is transparent.

---

## 5. Design Tokens

Derived from `moodboard.html` and the Apple-ish v7 vibe (the latest iteration). Enforced via `globals.css` + Tailwind theme extension.

```css
/* globals.css — canonical token source */
@import "tailwindcss";

:root {
  /* Palette — HR-5: calm neutrals + single strong accent */
  --color-bg:          #FFFFFF;
  --color-bg-subtle:   #F5F7FB;
  --color-bg-page:     #F8FAFC;
  --color-text:        #0F172A;
  --color-text-muted:  #6B7280;
  --color-accent:      #3B82F6;    /* Single accent — blue */
  --color-accent-hover:#2563EB;
  --color-success:     #00A86B;
  --color-border:      #E5E7EB;
  --color-card:        #FFFFFF;

  /* Shadows — HR-5: subtle */
  --shadow-card:       0 2px 8px rgba(15, 23, 42, 0.06);
  --shadow-card-hover: 0 8px 24px rgba(15, 23, 42, 0.10);
  --shadow-panel:      0 12px 30px rgba(2, 6, 23, 0.08);

  /* Radii — HR-5: soft cards */
  --radius-sm:  8px;
  --radius-md:  14px;
  --radius-lg:  16px;
  --radius-xl:  22px;
  --radius-full:9999px;

  /* Spacing — HR-5: 8pt rhythm */
  --space-unit: 8px;

  /* Typography */
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: var(--font-geist-mono);
}
```

**Tailwind enforcement:** Extend the Tailwind theme to reference these tokens. Do **not** use arbitrary Tailwind color values (`bg-[#3B82F6]`) — always use semantic names (`bg-accent`).

---

## 6. Data Model Stubs

All types live in `lib/types.ts`. These shapes are the contract between mock data and future API responses. **Do not add fields speculatively — only add what's needed for the current phase.**

```typescript
// lib/types.ts

// === Phase 1 ===

export interface Pro {
  id: string;
  slug: string;                    // URL-safe unique handle
  name: string;
  company: string | null;
  headshotUrl: string;             // HR-3: required, never null
  companyLogoUrl: string | null;   // HR-3: nullable for solo pros
  services: ServiceCategory[];
  serviceAreas: string[];          // zip codes or city names
  bio: string;
  videoUrl: string | null;         // optional intro video
  rating: number | null;           // Google rating (1–5)
  reviewCount: number;
  verified: boolean;               // license/insurance verified
  badges: Badge[];
}

export type ServiceCategory =
  | "lender"
  | "home-inspector"
  | "insurance"
  | "attorney"
  | "title-company"
  | "contractor"
  | "mover"
  | "realtor";

export interface Badge {
  type: "licensed" | "insured" | "fast-response" | "partner";
  label: string;
}

// === Phase 2 ===

export interface User {
  id: string;
  role: "consumer" | "pro";
  name: string;
  email: string;
  avatarUrl: string | null;
}

export type RequestStatus =
  | "draft"
  | "submitted"
  | "matched"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface ServiceRequest {
  id: string;
  userId: string;
  category: ServiceCategory;
  addressOrArea: string;
  notes: string;
  photoUrls: string[];
  status: RequestStatus;
  assignedProId: string | null;
  createdAt: string;               // ISO 8601
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  requestId: string;
  type: "created" | "matched" | "status-change" | "message" | "doc-uploaded";
  description: string;
  actor: "system" | "consumer" | "pro";
  timestamp: string;               // ISO 8601
}

// === Phase 3 ===

export interface ProProfile extends Pro {
  availability: "accepting" | "busy" | "paused";
  responseTimeMinutes: number | null;
}

// === Phase 4+ (DO NOT IMPLEMENT YET) ===
// Journey, CuratedGroup, Organization, Booking, ScheduleSlot
// Defined here as comments only to show future direction.
// DO NOT create interfaces for these until the phase begins.
```

---

## 7. API Boundaries

### Layering

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Component   │────▶│  lib/api/*   │────▶│  Data Source  │
│  (UI only)   │     │  (contract)  │     │  (swappable) │
└─────────────┘     └──────────────┘     └──────────────┘
                     getPros()            mock-data.ts (Phase 1)
                     getProBySlug()       Supabase? (Phase 2+)
                     createRequest()      Custom API? (Phase 3+)
```

### Phase 1 contracts (mock implementations)

```typescript
// lib/api/pros.ts
export async function getPros(filters?: {
  service?: ServiceCategory;
  area?: string;
  query?: string;
}): Promise<Pro[]>;

export async function getProBySlug(slug: string): Promise<Pro | null>;

// lib/api/requests.ts  (Phase 2)
export async function createRequest(data: Omit<ServiceRequest, "id" | "status" | "createdAt" | "updatedAt">): Promise<ServiceRequest>;

export async function getRequests(userId: string): Promise<ServiceRequest[]>;

export async function getRequestById(id: string): Promise<ServiceRequest | null>;

export async function getTimeline(requestId: string): Promise<TimelineEvent[]>;
```

### Rules

1. **`lib/api/*` is the ONLY import path for data.** Components, pages, and server functions call these — never `mock-data.ts` directly.
2. **All functions return Promises** even when backed by synchronous mocks. This ensures zero refactoring when real async sources replace them.
3. **No Next.js Route Handlers (`app/api/`)** until Phase 3+. Phase 1–2 pages use server components calling `lib/api/*` directly (which returns mock data). Adding a REST/tRPC layer before we need client-side mutations is premature.
4. **When we add a real backend**, only files inside `lib/api/` change. The interface signatures stay identical.

---

## 8. Auth & Wall Strategy

### Wall type: **Soft Wall**

Users can browse everything publicly. Auth is required only at the moment of *action*:

| Action | Wall? | Trigger |
|--------|-------|---------|
| Browse marketplace | ❌ Free | — |
| View pro profile | ❌ Free | — |
| Watch intro video | ❌ Free | — |
| Add pro to team | ✅ Auth | Redirect to `/signup` with `?next=` return URL |
| Contact pro | ✅ Auth | Same |
| Submit request | ✅ Auth | Same |
| Request booking | ✅ Auth | Same |

### Implementation (Phase 1: stubbed)

```tsx
// lib/auth/guard.tsx
"use client";

import { useAuth } from "@/lib/auth/provider";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

/**
 * Wrap any CTA that requires auth. If user is not logged in,
 * redirect to signup with a return URL. If logged in, execute action.
 */
export function useAuthGate() {
  const { user } = useAuth();
  const router = useRouter();

  return function gate(action: () => void) {
    if (!user) {
      router.push(routes.signup({ next: window.location.pathname }));
      return;
    }
    action();
  };
}
```

### Auth provider (Phase 1: stub, Phase 2: real)

Phase 1 ships a `AuthProvider` that always returns `user: null` (public) or a hardcoded mock user (for testing authed flows). The interface matches what a real provider (Supabase Auth, Clerk, NextAuth) would expose:

```typescript
// lib/auth/types.ts
export interface AuthContext {
  user: User | null;
  loading: boolean;
  signIn: (method: "magic-link" | "google") => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Provider choice deferred intentionally.** We pick auth provider after Phase 1 flows are locked and we know deployment constraints. The stub is complete enough to build and test all UI states.

---

## 9. Scope Creep Guardrails

These are process rules. Violating them requires explicit approval from Frank.

### G-1: Phase Gate
No work on Phase N+1 until Phase N is **visually complete, deployed, and reviewed by Frank.** "Visually complete" means: all routes in the phase render with mock data, match the Apple-ish v2 vibe, and pass the Hard Rules checklist.

### G-2: No Backend Until Phase 3
Phases 1–2 run entirely on mock data. No database, no ORM, no migrations, no Docker, no environment variables beyond `NEXT_PUBLIC_*`. If you're writing a `.env` file in Phase 1, stop.

### G-3: No New Dependencies Without Justification
Every `npm install` must answer: *"What specific Phase 1–2 UI need does this serve, and why can't Tailwind/native/hand-rolled solve it?"* Exceptions pre-approved:
- `clsx` or `tailwind-merge` (className composition)
- A single icon library (Lucide recommended)
- Auth SDK (Phase 2 only, when provider is chosen)

Everything else requires discussion.

### G-4: No Premature Abstraction
- No `<DataTable>` component until we have 3+ tables.
- No `useForm` hook/library until we have 3+ forms.
- No global state management until `AuthContext` is insufficient.
- No custom hooks directory until we have 3+ hooks.
- Build the concrete thing. Extract the pattern on the third occurrence.

### G-5: No Admin/Org/Brokerage UI
Research Pack §25 describes a rich org layer. It is explicitly Phase 5+. No routes, components, types, or mock data for orgs/brokerages until we get there. Not even "just the types."

### G-6: Every Commit Tells a Story (HR-7)
Commit messages follow: `phase(scope): what changed — what feedback it addresses`
```
phase1(marketplace): two-column layout with sticky preview — addresses HR-2 Thumbtack requirement
phase1(pro-profile): add video embed slot — optional per HR, uses placeholder
```

### G-7: Hard Rules Checklist Before Merge
Before any PR merges, the author checks:
- [ ] Does this violate any HR-0 through HR-10? (Check §0 of this doc)
- [ ] Are all image slots populated with demo art? (HR-4)
- [ ] Is spacing on 8pt grid? (HR-5)
- [ ] Is only the approved accent color used? (HR-5)

---

## 10. Phasing Contract

| Phase | What Ships | Inputs | Auth? | Data Source | Estimated Scope |
|-------|-----------|--------|-------|-------------|-----------------|
| **1** | Public acquisition funnel: Home → Marketplace → Pro Profile → (wall) | Mock pros, mock images | Stub only (wall redirects to `/signup` placeholder) | `mock-data.ts` | 4 routes, ~12 components |
| **2** | Consumer request flow + dashboard | Phase 1 + mock requests, mock timeline | Real auth provider chosen + wired | `mock-data.ts` still | 3 new routes, ~8 components |
| **3** | Pro dashboard + profile editor | Phase 2 + pro flows | Pro role added to auth | First real backend (Supabase or equivalent) | 3 new routes, ~10 components |
| **4** | Scheduling, share links, curated groups | Phase 3 + calendar | Existing auth | Real backend | Variable |
| **5+** | Org/brokerage, admin, payments, messaging | Everything | RBAC | Real backend | Large |

**Rule:** Each phase is a branch. Merge to `main` only when the phase is complete and approved.

---

## 11. vs. Typical Next.js App

| Aspect | Typical Next.js App | Relays (This Proposal) | Why |
|--------|-------------------|----------------------|-----|
| **`app/api/` routes** | Created immediately for forms, auth, CRUD | **None until Phase 3.** Server components call `lib/api/*` which returns mocks. | Avoids building a backend before the UI is proven. API routes are an attractive nuisance — they tempt you into "real" backend work when you should be iterating on UX. |
| **Auth** | Wired on day 1 (NextAuth, Clerk) | **Stubbed behind an interface.** Provider chosen Phase 2. | Auth provider choice is load-bearing and irreversible. Deciding it before UX flows are locked leads to building around the auth SDK's opinions instead of the product's needs. |
| **State management** | Zustand/Jotai/Redux from start | **None.** Only `AuthContext` until proven insufficient. | Server components eliminate 80% of client state. The remaining 20% (search input, modal open/closed) is local `useState`. |
| **Component library** | Shadcn/ui, Radix, Headless UI installed immediately | **Hand-rolled primitives** matching the Apple-ish token system. Consider Radix *primitives* (not Shadcn's opinionated styling) if accessibility demands it in Phase 2. | Shadcn's default aesthetic fights the Apple-ish vibe. Reskinning Shadcn is more work than building 6 primitives (Button, Card, Input, Badge, Avatar, Modal) from Tailwind. |
| **Data fetching** | tRPC, React Query, SWR from the start | **Plain `async` functions** in `lib/api/*`. No caching layer. | Mock data is synchronous and in-memory. Adding a caching/fetching layer over mocks is pure overhead. When real APIs arrive (Phase 3), we evaluate React Query vs. Next.js built-in caching. |
| **Database/ORM** | Prisma/Drizzle schema on day 1 | **No database until Phase 3.** Types in `lib/types.ts` *are* the schema contract. | The data model will change as UX is tested. Encoding it in migrations too early creates friction against product iteration. |
| **File structure** | Feature-based folders (`features/auth/`, `features/marketplace/`) | **Domain-based components + route-group pages.** Components grouped by product domain; pages grouped by auth boundary. | Feature folders create import spaghetti when features share components (and they always do in a marketplace). Domain grouping is flatter and more honest about dependencies. |
| **Exports** | Default exports everywhere | **Named exports only.** No `export default`. | Named exports enable IDE rename-refactoring across the codebase and make unused-export detection trivial. |
| **Testing** | Vitest + Testing Library + Playwright from day 1 | **None in Phase 1.** Add Playwright for critical paths in Phase 2 (auth wall, request submission). Unit tests when logic functions exist. | Phase 1 is 100% presentational with mock data. The highest-value test is "does it match the vibe?" — which is a human review, not an assertion. Automated tests earn their keep when there's logic to protect. |
| **Environment variables** | `.env.local` with 15 secrets | **Zero `.env` files until Phase 2.** No secrets needed when everything is mocked. | Every env var is a deployment dependency. Zero env vars = `git clone && npm run dev` works instantly for any reviewer. |
| **Deployment** | Vercel + preview deployments | **Same.** Vercel is already connected. | ✅ Aligned. This is one of the few "typical" decisions that's correct from day 1. |

---

## Appendix: Checklist for Phase 1 Kickoff

Before writing any Phase 1 component code:

- [ ] Replace the default `page.tsx` and `layout.tsx` boilerplate
- [ ] Populate `globals.css` with the token system from §5
- [ ] Create `lib/types.ts` with Phase 1 types only
- [ ] Create `lib/mock-data.ts` with 6–10 demo pros