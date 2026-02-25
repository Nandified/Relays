import { type Pro, type ProBadge, type ProServiceCategory, type UnclaimedProfessional } from "@/lib/types";

export type MarketplaceProfileKind = "claimed" | "licensed";
export type MarketplaceRatingSource = "relays" | "google";

export interface MarketplaceProfile {
  /**
   * Stable unique id for UI state (prevents collisions across sources).
   * Example: `claimed:pro_1` or `licensed:123456`.
   */
  uid: string;
  kind: MarketplaceProfileKind;

  /** Underlying source id (e.g. Pro.id or UnclaimedProfessional.id) */
  id: string;
  slug: string;

  name: string;
  subtitle: string | null;

  avatarUrl: string | null;
  companyLogoUrl: string | null;

  categories: ProServiceCategory[];
  verified: boolean;

  /** Extra badges rendered next to categories in the expanded area. */
  accentBadges: string[];
  defaultBadges: string[];

  rating: number | null;
  reviewCount: number | null;
  ratingSource: MarketplaceRatingSource | null;

  primaryLocationLabel: string | null;

  blurb: string | null;
  serviceAreasLabel: string | null;

  phone: string | null;
  website: string | null;

  introVideoUrl: string | null;

  claimHref: string | null;
  profileHref: string;
}

function getLicensedSubtitle(p: UnclaimedProfessional): string | null {
  const company = p.officeName || (p.company !== p.name ? p.company : "");
  const location = p.city ? p.city : "";

  const parts = [company, location].map((v) => v?.trim()).filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function proBadgesToBlurb(_badges: ProBadge[]): string | null {
  // We keep badges separate for UI; no-op hook in case we want a fallback later.
  return null;
}

export function claimedProToMarketplaceProfile(pro: Pro): MarketplaceProfile {
  return {
    uid: `claimed:${pro.id}`,
    kind: "claimed",

    id: pro.id,
    slug: pro.slug,

    name: pro.name,
    subtitle: pro.companyName,

    avatarUrl: pro.headshotUrl,
    companyLogoUrl: pro.companyLogoUrl,

    categories: pro.categories,
    verified: pro.verified,

    accentBadges: pro.badges.map((b) => b.label),
    defaultBadges: [],

    rating: pro.rating,
    reviewCount: pro.reviewCount,
    ratingSource: "relays",

    primaryLocationLabel: pro.serviceAreas?.[0] ?? null,

    blurb: pro.blurb || proBadgesToBlurb(pro.badges),
    serviceAreasLabel: (pro.serviceAreas ?? []).join(", ") || null,

    phone: null,
    website: null,

    introVideoUrl: pro.introVideoUrl ?? null,

    claimHref: null,
    profileHref: `/pros/${pro.slug}`,
  };
}

export function unclaimedProfessionalToMarketplaceProfile(
  professional: UnclaimedProfessional
): MarketplaceProfile {
  const cityState = professional.city
    ? [professional.city, professional.state].filter(Boolean).join(", ")
    : null;

  const serviceAreas = [
    professional.city,
    professional.county ? `${professional.county} County` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    uid: `licensed:${professional.id}`,
    kind: "licensed",

    id: professional.id,
    slug: professional.slug,

    name: professional.name,
    subtitle: getLicensedSubtitle(professional),

    avatarUrl: professional.photoUrl,
    companyLogoUrl: null,

    categories: [professional.category],
    verified: false,

    accentBadges: [],
    defaultBadges: professional.county ? [`${professional.county} County`] : [],

    rating: professional.rating,
    reviewCount: professional.reviewCount,
    ratingSource: professional.rating != null ? "google" : null,

    primaryLocationLabel: cityState,

    blurb: null,
    serviceAreasLabel: serviceAreas || "Not listed",

    phone: professional.phone,
    website: professional.website,

    introVideoUrl: null,

    claimHref: "/pro/onboarding",
    // Prefer opaque publicId (fast + does not leak license number). Fallback to id during migration.
    profileHref: `/pros/${professional.publicId ?? professional.id}`,
  };
}
