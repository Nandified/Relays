# Relays — Lint Warnings Backlog (Cleanup Later)

Purpose: capture remaining ESLint warnings so we can clean them up later without derailing feature shipping.

> Status as of 2026-03-02: lint has **0 errors**; warnings remain.

---

## Remaining warning buckets

### 1) Org reports
- `src/app/org/reports/compliance/page.tsx`
  - `OrgAuditAction` defined but never used
  - `members` assigned but never used
- `src/app/org/reports/referrals/page.tsx`
  - `OrgReferralData` defined but never used

### 2) Pro pages (demo/mock)
- `src/app/pro/bookings/page.tsx`
  - `pro` assigned but never used
- `src/app/pro/dashboard/page.tsx`
  - `accepted` assigned but never used
- `src/app/pro/journeys/page.tsx`
  - `journeys` assigned but never used
  - `createdBy` assigned but never used
- `src/app/pro/onboarding/page.tsx`
  - `claimPlace` defined but never used
  - `claimedPlace` assigned but never used
- `src/app/pro/reviews/page.tsx`
  - `ProServiceCategory` defined but never used
  - `Badge` defined but never used
- `src/app/pro/settings/integrations/page.tsx`
  - `APIKey` defined but never used

### 3) Components (demo/mock)
- `src/components/claim-profile-modal.tsx`
  - `ProfessionalIdType` defined but never used
  - `ProServiceCategory` defined but never used
- `src/components/journey-documents.tsx`
  - `Badge` defined but never used
  - `Card` defined but never used
  - `DocCategory` defined but never used
- `src/components/journey/PostCloseBanner.tsx`
  - `Button` defined but never used
- `src/components/reviews/ConsumerReviewHistory.tsx`
  - `Button` defined but never used
- `src/components/reviews/PostServiceFollowUps.tsx`
  - `Journey` defined but never used
- `src/components/reviews/ReviewPromptCard.tsx`
  - `useState` defined but never used
  - `StarRating` defined but never used

### 4) SearchSuggestions hook dependency warnings
- `src/components/search/SearchSuggestions.tsx`
  - missing dependencies in effects (`fetchLimit`, `onSelectPlace`, `scoreLicensed`, etc.)

### 5) <img> warnings (performance)
- `src/components/marketplace/ExpandableLicensedCard.tsx`
- `src/components/marketplace/LicensedPreviewPanel.tsx`
- `src/components/marketplace/LicensedProfessionalCard.tsx`

Suggested fix later: replace `<img>` with `next/image` where appropriate.

### 6) Misc
- `src/components/marketplace/SoftWallGate.tsx`
  - unused eslint-disable directive
- `src/lib/google-places.ts`
  - `_location` defined but never used
- `src/lib/marketplace/MarketplaceProfile.ts`
  - `_badges` defined but never used
- `src/lib/mock-data.ts`
  - unused exported types in one-line mega import
- `src/lib/mock-verification-data.ts`
  - `VerificationOCR` defined but never used
- `src/lib/outreach.ts`
  - unused eslint-disable directives
- `src/lib/verification-service.ts`
  - `professionalId` defined but never used
- `src/lib/webhook-service.ts`
  - `_secret`, `_endpoint`, `payload` unused

---

## Policy
- Do not let this backlog block feature shipping.
- Fix warnings opportunistically when touching the relevant file for feature work.
- Prefer small, safe PRs.
