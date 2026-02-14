/**
 * Unified professional data access layer.
 *
 * Combines:
 * - IDFPR licensed individuals (src/lib/idfpr-data.ts)
 * - Google Places (Outscraper) listings (src/lib/google-places-data.ts)
 */

import { type ProServiceCategory, type UnclaimedProfessional } from "@/lib/types";
import {
  searchProfessionals as searchIdfprProfessionals,
  getProfessionalById as getIdfprProfessionalById,
  getProfessionalBySlug as getIdfprProfessionalBySlug,
  getProfessionalStats as getIdfprStats,
  getAllProfessionals as getAllIdfprProfessionals,
} from "@/lib/idfpr-data";
import {
  searchGoogleProfessionals,
  getGoogleProfessionalById,
  getGoogleProfessionalBySlug,
  getGoogleProfessionalStats,
  getAllGoogleProfessionals,
} from "@/lib/google-places-data";

export interface ProfessionalSearchParams {
  q?: string;
  category?: ProServiceCategory | string;
  city?: string;
  zip?: string;
  county?: string;
  limit?: number;
  offset?: number;
}

export interface ProfessionalSearchResult {
  data: UnclaimedProfessional[];
  total: number;
  limit: number;
  offset: number;
}

function mergeStats(
  a: { total: number; byCategory: Record<string, number> },
  b: { total: number; byCategory: Record<string, number> }
): { total: number; byCategory: Record<string, number> } {
  const byCategory: Record<string, number> = { ...a.byCategory };
  for (const [k, v] of Object.entries(b.byCategory)) {
    byCategory[k] = (byCategory[k] ?? 0) + v;
  }
  return { total: a.total + b.total, byCategory };
}

/**
 * Search/filter/paginate across ALL professionals (IDFPR + Google Places).
 *
 * Note: We implement global pagination by searching each source with
 * an expanded window and then slicing.
 */
export function searchAllProfessionals(params: ProfessionalSearchParams): ProfessionalSearchResult {
  const limit = Math.min(params.limit ?? 50, 200);
  const offset = params.offset ?? 0;

  // For global pagination, fetch enough from each source to satisfy offset+limit.
  const window = offset + limit;

  const idfpr = searchIdfprProfessionals({ ...params, limit: window, offset: 0 });
  const google = searchGoogleProfessionals({ ...params, limit: window, offset: 0 });

  // Merge results.
  let merged = [...idfpr.data, ...google.data];

  // Prefer higher-quality results first when browsing (rating/photos), then name.
  merged.sort((a, b) => {
    const ar = typeof a.rating === "number" ? a.rating : -1;
    const br = typeof b.rating === "number" ? b.rating : -1;
    if (br !== ar) return br - ar;

    const ac = typeof a.reviewCount === "number" ? a.reviewCount : -1;
    const bc = typeof b.reviewCount === "number" ? b.reviewCount : -1;
    if (bc !== ac) return bc - ac;

    const ap = a.photoUrl ? 1 : 0;
    const bp = b.photoUrl ? 1 : 0;
    if (bp !== ap) return bp - ap;

    return a.name.localeCompare(b.name);
  });

  const total = idfpr.total + google.total;

  return {
    data: merged.slice(offset, offset + limit),
    total,
    limit,
    offset,
  };
}

export function getProfessionalById(id: string): UnclaimedProfessional | null {
  // IDFPR IDs are prefixed (idfpr_); Google uses place_id.
  const fromIdfpr = getIdfprProfessionalById(id);
  if (fromIdfpr) return fromIdfpr;
  return getGoogleProfessionalById(id);
}

export function getProfessionalBySlug(slug: string): UnclaimedProfessional | null {
  const fromIdfpr = getIdfprProfessionalBySlug(slug);
  if (fromIdfpr) return fromIdfpr;
  return getGoogleProfessionalBySlug(slug);
}

export function getProfessionalStats(): {
  total: number;
  byCategory: Record<string, number>;
  lastLoaded: string | null;
} {
  const a = getIdfprStats();
  const b = getGoogleProfessionalStats();
  const merged = mergeStats(a, b);

  return {
    total: merged.total,
    byCategory: merged.byCategory,
    // Keep the most recent of the two.
    lastLoaded: [a.lastLoaded, b.lastLoaded].filter(Boolean).sort().slice(-1)[0] ?? null,
  };
}

export function getAllProfessionals(): UnclaimedProfessional[] {
  return [...getAllIdfprProfessionals(), ...getAllGoogleProfessionals()];
}
