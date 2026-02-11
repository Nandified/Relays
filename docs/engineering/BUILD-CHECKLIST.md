# Relays Web — Build Checklist (Strict Order)

## Phase 0 — Foundation
- [x] Repo created and push working
- [x] Vercel connected and deploying from `main`
- [x] Sources-of-truth mirrored into repo under `/docs`
- [ ] Decide wall strategy (default: **soft wall**)
- [ ] Decide initial wedge (default: **consumer-first**)

## Phase 1 — Public acquisition loop (MVP-1)
### 1.1 Home
- [ ] Home page hero + CTAs
- [ ] How-it-works (3 steps)
- [ ] Footer

### 1.2 Marketplace (public)
- [ ] Marketplace page layout
- [ ] Search bar (zip/city + service)
- [ ] Filters (minimal)
- [ ] Result cards + empty/loading states

### 1.3 Pro profile (public)
- [ ] `/pros/[slug]` page
- [ ] Services + coverage
- [ ] Primary CTA: Start request

### 1.4 Soft wall trigger
- [ ] Allow browse public
- [ ] Require auth at: submit request / save pro / contact pro

## Phase 2 — Consumer request flow + dashboard (MVP-2)
- [ ] Request intake stepper
- [ ] Confirmation page
- [ ] Consumer dashboard shell `/app`
- [ ] Requests list
- [ ] Request detail + status timeline

## Phase 3 — Pro onboarding + pro dashboard (MVP-3)
- [ ] Pro role selection + onboarding
- [ ] Pro profile editor
- [ ] Incoming requests list + detail
- [ ] Accept/decline + status updates

## Phase 4 — Operationalization
- [ ] Matching (manual → rules)
- [ ] Messaging
- [ ] Scheduling
- [ ] Payments
- [ ] Reviews
