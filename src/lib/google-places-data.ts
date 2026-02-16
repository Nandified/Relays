/**
 * Google Places (Outscraper) Data Loading Module
 *
 * Reads pre-scraped Outscraper JSON files from /data/outscraper and exposes
 * the same search/filter/pagination API shape as src/lib/license-data.ts.
 */

import * as fs from "fs";
import * as path from "path";
import { type ProServiceCategory, type UnclaimedProfessional } from "@/lib/types";
// Intentionally no dependency on the state license loader here.

type OutscraperPlace = {
  name?: string;
  city?: string;
  state?: string;
  state_code?: string;
  postal_code?: string;
  county?: string;
  phone?: string;
  website?: string;
  site?: string;
  rating?: number | string;
  reviews?: number | string;
  photo?: string;
  logo?: string;
  place_id?: string;
  address?: string;
  street?: string;
  type?: string;
  category?: string;
};

function toNumber(x: unknown): number | null {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string") {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function safeTrim(x: unknown): string {
  return typeof x === "string" ? x.trim() : "";
}

// (no slug helper needed for Google records — slug == place_id)

function looksPersonishName(name: string): boolean {
  const n = name.trim();
  if (!n) return false;
  if (/\b(inc|llc|ltd|co|company|corp|corporation|pllc|pc)\b/i.test(n)) return false;
  if (/[|@/]/.test(n)) return false;
  const words = n.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 4) return false;
  // Must contain at least one space and be mostly letters.
  if (!/^[A-Za-z\s.'-]+$/.test(n)) return false;
  return true;
}

function cleanedDisplayName(original: string): string {
  const raw = original.trim();
  if (!raw) return raw;

  // Prefer the left side of separators for person-like names.
  const primary = raw.split(/\s*[|]|\s+[-–—]\s+|\s+at\s+|\s+@\s+/i)[0]?.trim() ?? raw;

  // If it already looks like a personal name, return the cleaned primary.
  if (looksPersonishName(primary)) return primary;

  // Otherwise, do minimal cleanup: remove trailing location fragments like " - Chicago".
  return raw.replace(/\s+[-–—]\s+(Chicago|Naperville|Aurora|Joliet|Rockford|Peoria)\b/i, "").trim();
}

const OUTSCRAPER_FILES: Array<{ file: string; category: ProServiceCategory }> = [
  { file: "il_mortgage_lender_results.json", category: "Mortgage Lender" },
  { file: "il_real_estate_attorney_results.json", category: "Attorney" },
  { file: "il_homeowners_insurance_agent_results.json", category: "Insurance Agent" },
  { file: "il_home_inspector_results.json", category: "Home Inspector" },
];

function getOutscraperDir(): string {
  return path.join(process.cwd(), "data", "outscraper");
}

function readJsonArray<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

let cachedGooglePros: UnclaimedProfessional[] | null = null;
let cachedGoogleProsById: Map<string, UnclaimedProfessional> | null = null;
let cachedGoogleProsBySlug: Map<string, UnclaimedProfessional> | null = null;
let lastLoadTime: Date | null = null;

function loadAllGoogleProfessionals(): UnclaimedProfessional[] {
  if (cachedGooglePros && cachedGoogleProsById && cachedGoogleProsBySlug) return cachedGooglePros;

  // Dedup inspectors that are already represented in the state license database.
  // We use googlePlaceId values stored in the license enrichment lookup file.
  const licenseGooglePlaceIds = new Set<string>();
  try {
    const enrichmentPath = path.join(process.cwd(), "data", "idfpr", "idfpr_outscraper_enrichment.json");
    if (fs.existsSync(enrichmentPath)) {
      const parsed = JSON.parse(fs.readFileSync(enrichmentPath, "utf-8")) as {
        byLicenseNumber?: Record<string, { googlePlaceId?: string | null }>;
      };
      for (const v of Object.values(parsed.byLicenseNumber ?? {})) {
        const gp = typeof v.googlePlaceId === "string" ? v.googlePlaceId.trim() : "";
        if (gp) licenseGooglePlaceIds.add(gp);
      }
    }
  } catch {
    // ignore
  }

  const all: UnclaimedProfessional[] = [];
  const byId = new Map<string, UnclaimedProfessional>();
  const bySlug = new Map<string, UnclaimedProfessional>();

  const outscraperDir = getOutscraperDir();

  for (const { file, category } of OUTSCRAPER_FILES) {
    const filePath = path.join(outscraperDir, file);
    const places = readJsonArray<OutscraperPlace>(filePath);

    for (const place of places) {
      const placeId = safeTrim(place.place_id);
      if (!placeId) continue;

      // Dedupe against license-enriched professionals (same Google Place).
      if (licenseGooglePlaceIds.has(placeId)) continue;

      // De-dupe within Google set.
      if (byId.has(placeId)) continue;

      const name = cleanedDisplayName(safeTrim(place.name));
      const city = safeTrim(place.city);
      const state = safeTrim(place.state_code || place.state || "IL") || "IL";
      const zip = safeTrim(place.postal_code);
      const county = safeTrim(place.county);
      const phone = safeTrim(place.phone) || null;
      const website = safeTrim(place.website || place.site) || null;
      const rating = toNumber(place.rating);
      const reviewCount = toNumber(place.reviews);
      const photoUrl = safeTrim(place.photo || place.logo) || null;

      const prof: UnclaimedProfessional = {
        id: placeId,
        slug: placeId, // requirement: place_id as slug
        name: name || safeTrim(place.name) || "Unknown",
        licenseNumber: "",
        licenseType: "",
        company: safeTrim(place.name) || name || "",
        officeName: null,
        city,
        state: state.length === 2 ? state : "IL",
        zip,
        county,
        licensedSince: "",
        expires: "",
        disciplined: false,
        category,
        claimed: false,
        claimedByProId: null,
        phone,
        email: null,
        website,
        rating,
        reviewCount,
        photoUrl,
      };

      // Attach source metadata (not shown to consumers, but useful for internal routing).
      (prof as any).source = "google";
      (prof as any).googlePlaceId = placeId;

      byId.set(placeId, prof);
      bySlug.set(prof.slug, prof);
      all.push(prof);
    }
  }

  cachedGooglePros = all;
  cachedGoogleProsById = byId;
  cachedGoogleProsBySlug = bySlug;
  lastLoadTime = new Date();
  return all;
}

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

export function searchGoogleProfessionals(params: ProfessionalSearchParams): ProfessionalSearchResult {
  const all = loadAllGoogleProfessionals();
  let filtered = all;

  // Category filter
  if (params.category && params.category !== "All") {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  if (params.city) {
    const city = params.city.toLowerCase();
    filtered = filtered.filter((p) => p.city.toLowerCase().includes(city));
  }

  const queryHasName = params.q ? /[a-zA-Z]{2,}/.test(params.q) : false;
  if (params.zip && !queryHasName) {
    filtered = filtered.filter((p) => p.zip.startsWith(params.zip!));
  }

  if (params.county) {
    const county = params.county.toLowerCase();
    filtered = filtered.filter((p) => p.county.toLowerCase().includes(county));
  }

  if (params.q) {
    const qLower = params.q.toLowerCase().trim();
    const terms = qLower.split(/\s+/).filter(Boolean);

    const scored: { p: UnclaimedProfessional; score: number }[] = [];
    for (const p of filtered) {
      const nameLower = p.name.toLowerCase();
      const searchable = `${p.name} ${p.company} ${p.city} ${p.county} ${p.zip}`.toLowerCase();
      if (!terms.every((term) => searchable.includes(term))) continue;

      let score = 0;
      if (nameLower === qLower) score += 100;
      else if (nameLower.startsWith(qLower)) score += 80;
      else if (terms.every((t) => nameLower.includes(t))) score += 60;
      else {
        const nameHits = terms.filter((t) => nameLower.includes(t)).length;
        score += (nameHits / terms.length) * 40;
      }

      if (p.photoUrl) score += 3;
      if (p.rating) score += 2;
      scored.push({ p, score });
    }

    scored.sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name));
    filtered = scored.map((s) => s.p);
  }

  const total = filtered.length;
  const limit = Math.min(params.limit ?? 50, 200);
  const offset = params.offset ?? 0;

  return {
    data: filtered.slice(offset, offset + limit),
    total,
    limit,
    offset,
  };
}

export function getGoogleProfessionalById(id: string): UnclaimedProfessional | null {
  loadAllGoogleProfessionals();
  return cachedGoogleProsById?.get(id) ?? null;
}

export function getGoogleProfessionalBySlug(slug: string): UnclaimedProfessional | null {
  loadAllGoogleProfessionals();
  return cachedGoogleProsBySlug?.get(slug) ?? null;
}

export function getGoogleProfessionalStats(): {
  total: number;
  byCategory: Record<string, number>;
  lastLoaded: string | null;
} {
  const all = loadAllGoogleProfessionals();
  const byCategory: Record<string, number> = {};
  for (const p of all) byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;

  return {
    total: all.length,
    byCategory,
    lastLoaded: lastLoadTime?.toISOString() ?? null,
  };
}

export function reloadGoogleData(): void {
  cachedGooglePros = null;
  cachedGoogleProsById = null;
  cachedGoogleProsBySlug = null;
  lastLoadTime = null;
  loadAllGoogleProfessionals();
}

export function getAllGoogleProfessionals(): UnclaimedProfessional[] {
  return loadAllGoogleProfessionals();
}
