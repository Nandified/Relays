/**
 * State license database loading module.
 *
 * Loads and normalizes professionals from one or more state license sources.
 *
 * Notes:
 * - The Illinois source data lives in /data/idfpr/ (directory name kept as-is).
 * - Additional states are loaded from state-specific normalized CSVs.
 *
 * Data is parsed once on first request and cached in memory.
 */

import * as fs from "fs";
import * as path from "path";
import generatedLicensed from "@/lib/generated/licensed-professionals.json";
import { type ProServiceCategory, type UnclaimedProfessional } from "@/lib/types";

/* ── License type → category mapping ──────────────────────────── */

const LICENSE_TYPE_TO_CATEGORY: Record<string, ProServiceCategory> = {
  "LICENSED REAL ESTATE BROKER": "Realtor",
  "LICENSED REAL ESTATE MANAGING BROKER": "Realtor",
  "LICENSED HOME INSPECTOR": "Home Inspector",
};

// Types to skip (no matching ProServiceCategory)
const SKIP_LICENSE_TYPES = new Set([
  "CERTIFIED RESIDENTIAL REAL ESTATE APPRAISER",
  "CERTIFIED GENERAL REAL ESTATE APPRAISER",
  "ASSOCIATE REAL ESTATE TRAINEE APPRAISER",
  "LICENSED REAL ESTATE BROKER CORPORATION",
  "LICENSED REAL ESTATE BROKER PARTNERSHIP",
  "LICENSED REAL ESTATE BROKER LLC",
]);

/* ── CSV parsing ──────────────────────────────────────────────── */

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSVFile(filePath: string): Record<string, string>[] {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = fields[j] ?? "";
    }
    rows.push(row);
  }

  return rows;
}

/* ── Slugs ──────────────────────────────────────────────────── */

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function baseSlugForProfessional(p: { name: string; city: string }): string {
  // Spec: name + city (e.g., "jill-l-clark-naperville")
  return slugify(`${p.name} ${p.city}`.trim());
}

/* ── Map CSV row → UnclaimedProfessional ─────────────────────── */

type RowToProfessionalOptions = {
  idPrefix: string;
  defaultState: string;
};

function rowToProfessional(row: Record<string, string>, opts: RowToProfessionalOptions): UnclaimedProfessional | null {
  // We support two normalized CSV shapes:
  // A) "license" shape: name, license_number, type, ... (used by IL/TX/CA/FL/NY/AZ/CO/CT)
  // B) "directory" shape: full_name, license_number, license_type, status, ... (used by NV/DE/UT/OR/WV)

  const isDirectoryShape = typeof row.full_name === "string" && row.full_name.trim().length > 0;

  const licenseNumber = (row.license_number ?? "").trim();
  if (!licenseNumber) return null;

  if (!isDirectoryShape) {
    const licenseType = (row.type ?? "").toUpperCase().trim();

    // Skip business entities and unsupported types
    if (row.is_business === "True") return null;
    if (SKIP_LICENSE_TYPES.has(licenseType)) return null;

    const category = LICENSE_TYPE_TO_CATEGORY[licenseType];
    if (!category) return null;

    return {
      id: `${opts.idPrefix}${licenseNumber}`,
      slug: "", // assigned during load (needs global collision detection)
      name: (row.name ?? "").trim(),
      licenseNumber,
      licenseType: row.type ?? "",
      company: (row.company ?? "").trim(),
      officeName: null,
      city: (row.city ?? "").trim(),
      state: (row.state ?? opts.defaultState).trim(),
      zip: (row.zip ?? "").trim(),
      county: (row.county ?? "").trim(),
      licensedSince: (row.licensed_since ?? "").trim(),
      expires: (row.expires ?? "").trim(),
      disciplined: (row.disciplined ?? "").toUpperCase() === "Y",
      category,
      claimed: false,
      claimedByProId: null,
      phone: null,
      email: null,
      website: null,
      rating: null,
      reviewCount: null,
      photoUrl: null,
    };
  }

  // Directory shape → only Realtor-like records for now.
  // license_type examples: Broker, Salesperson, Associate Broker, etc.
  const lt = (row.license_type ?? "").toLowerCase();
  const status = (row.status ?? "").toLowerCase();

  // Only load active records by default.
  if (status && !status.includes("active")) return null;

  const isRealtorish = /(broker|sales|realtor|agent)/i.test(lt);
  if (!isRealtorish) return null;

  return {
    id: `${opts.idPrefix}${licenseNumber}`,
    slug: "",
    name: (row.full_name ?? row.name ?? "").trim(),
    licenseNumber,
    licenseType: (row.license_type ?? "").trim(),
    company: (row.company ?? "").trim(),
    officeName: null,
    city: (row.city ?? "").trim(),
    state: (row.state ?? opts.defaultState).trim(),
    zip: (row.zip ?? "").trim(),
    county: (row.county ?? "").trim(),
    licensedSince: (row.licensed_since ?? "").trim(),
    expires: (row.expires ?? "").trim(),
    disciplined: false,
    category: "Realtor",
    claimed: false,
    claimedByProId: null,
    phone: (row.phone ?? "").trim() || null,
    email: (row.email ?? "").trim() || null,
    website: null,
    rating: null,
    reviewCount: null,
    photoUrl: null,
  };
}

/* ── Enrichment loading (Outscraper / DBA office name) ───────── */

type LicenseEnrichmentLookupFile = {
  generatedAt?: string;
  byLicenseNumber?: Record<
    string,
    {
      phone?: string | null;
      email?: string | null;
      website?: string | null;
      rating?: number | null;
      reviewCount?: number | null;
      photoUrl?: string | null;
      officeName?: string | null;
      googlePlaceId?: string | null;
    }
  >;
};

let cachedEnrichmentByLicense: Map<string, NonNullable<LicenseEnrichmentLookupFile["byLicenseNumber"]>[string]> | null = null;

function getEnrichmentPath(): string {
  return path.join(process.cwd(), "data", "idfpr", "idfpr_outscraper_enrichment.json");
}

function loadEnrichmentByLicense(): Map<string, NonNullable<LicenseEnrichmentLookupFile["byLicenseNumber"]>[string]> {
  if (cachedEnrichmentByLicense) return cachedEnrichmentByLicense;

  const filePath = getEnrichmentPath();
  if (!fs.existsSync(filePath)) {
    cachedEnrichmentByLicense = new Map();
    return cachedEnrichmentByLicense;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8")) as LicenseEnrichmentLookupFile;
    const obj = parsed.byLicenseNumber ?? {};
    cachedEnrichmentByLicense = new Map(Object.entries(obj));
  } catch {
    cachedEnrichmentByLicense = new Map();
  }

  return cachedEnrichmentByLicense;
}

/* ── In-memory cache ─────────────────────────────────────────── */

let cachedProfessionals: UnclaimedProfessional[] | null = null;
let cachedProfessionalsBySlug: Map<string, UnclaimedProfessional> | null = null;
let lastLoadTime: Date | null = null;

function getDataDir(): string {
  return path.join(process.cwd(), "data", "idfpr");
}

function loadAllProfessionals(): UnclaimedProfessional[] {
  if (cachedProfessionals && cachedProfessionalsBySlug) return cachedProfessionals;

  // Prefer the build-generated bundled index (works on Vercel serverless).
  // This file is created during `npm run build`.
  if (Array.isArray(generatedLicensed) && generatedLicensed.length > 0) {
    const all = generatedLicensed as unknown as UnclaimedProfessional[];
    const bySlug = new Map<string, UnclaimedProfessional>();
    for (const p of all) bySlug.set(p.slug, p);
    cachedProfessionals = all;
    cachedProfessionalsBySlug = bySlug;
    lastLoadTime = new Date();
    return all;
  }

  const ilDataDir = getDataDir();
  const ilFiles = [
    "real_estate_broker.csv",
    "home_inspector.csv",
    // Appraiser CSV is loaded but rows are skipped via LICENSE_TYPE mapping
    "real_estate_appraiser.csv",
    // Brokerage CSV — business entities are skipped
    "real_estate_brokerage.csv",
  ];

  // Additional normalized (license-format) CSVs from other states.
  const extraStateFiles: Array<{ filePath: string; idPrefix: string; defaultState: string }> = [
    // License-shape normalized CSVs
    {
      filePath: path.join(process.cwd(), "data", "texas", "normalized_brokers.csv"),
      idPrefix: "trec_",
      defaultState: "TX",
    },
    {
      filePath: path.join(process.cwd(), "data", "california", "normalized_brokers.csv"),
      idPrefix: "dre_",
      defaultState: "CA",
    },
    {
      filePath: path.join(process.cwd(), "data", "florida", "normalized_brokers.csv"),
      idPrefix: "dbpr_",
      defaultState: "FL",
    },
    {
      filePath: path.join(process.cwd(), "data", "new_york", "normalized_brokers.csv"),
      idPrefix: "nydos_",
      defaultState: "NY",
    },
    {
      filePath: path.join(process.cwd(), "data", "arizona", "normalized_brokers.csv"),
      idPrefix: "adre_",
      defaultState: "AZ",
    },
    {
      filePath: path.join(process.cwd(), "data", "colorado", "normalized_brokers.csv"),
      idPrefix: "dora_",
      defaultState: "CO",
    },
    {
      filePath: path.join(process.cwd(), "data", "connecticut", "normalized_brokers.csv"),
      idPrefix: "ctdcp_",
      defaultState: "CT",
    },

    // Directory-shape normalized CSVs
    {
      filePath: path.join(process.cwd(), "data", "utah", "normalized_brokers.csv"),
      idPrefix: "utah_",
      defaultState: "UT",
    },
    {
      filePath: path.join(process.cwd(), "data", "ut", "normalized_brokers.csv"),
      idPrefix: "ut_",
      defaultState: "UT",
    },
    {
      filePath: path.join(process.cwd(), "data", "nv", "normalized_brokers.csv"),
      idPrefix: "nv_",
      defaultState: "NV",
    },
    {
      filePath: path.join(process.cwd(), "data", "de", "normalized_brokers.csv"),
      idPrefix: "de_",
      defaultState: "DE",
    },
    {
      filePath: path.join(process.cwd(), "data", "or", "normalized_brokers.csv"),
      idPrefix: "or_",
      defaultState: "OR",
    },
    {
      filePath: path.join(process.cwd(), "data", "wv", "normalized_brokers.csv"),
      idPrefix: "wv_",
      defaultState: "WV",
    },
  ];

  const all: UnclaimedProfessional[] = [];
  const slugs = new Set<string>();
  const bySlug = new Map<string, UnclaimedProfessional>();
  const seenIds = new Set<string>(); // dedup across all sources (state-prefixed)

  // 1) Illinois license data (keep existing loading behavior)
  for (const file of ilFiles) {
    const filePath = path.join(ilDataDir, file);
    const rows = parseCSVFile(filePath);
    for (const row of rows) {
      const prof = rowToProfessional(row, { idPrefix: "idfpr_", defaultState: "IL" });
      if (!prof) continue;

      // Skip duplicates — same license number across Illinois source CSV files
      if (seenIds.has(prof.id)) continue;
      seenIds.add(prof.id);

      const baseSlug = baseSlugForProfessional(prof);
      // If we can't make a useful slug (missing data), fall back to license number.
      const candidate = baseSlug || `professional-${prof.licenseNumber}`;
      const finalSlug = slugs.has(candidate) ? `${candidate}-${prof.licenseNumber}` : candidate;

      prof.slug = finalSlug;
      slugs.add(finalSlug);
      bySlug.set(finalSlug, prof);
      all.push(prof);
    }
  }

  // 2) Extra states (normalized CSV)
  for (const src of extraStateFiles) {
    const rows = parseCSVFile(src.filePath);
    for (const row of rows) {
      const prof = rowToProfessional(row, { idPrefix: src.idPrefix, defaultState: src.defaultState });
      if (!prof) continue;

      // Skip duplicates within/among sources (state-prefixed)
      if (seenIds.has(prof.id)) continue;
      seenIds.add(prof.id);

      const baseSlug = baseSlugForProfessional(prof);
      const candidate = baseSlug || `professional-${prof.licenseNumber}`;
      const finalSlug = slugs.has(candidate) ? `${candidate}-${prof.licenseNumber}` : candidate;

      prof.slug = finalSlug;
      slugs.add(finalSlug);
      bySlug.set(finalSlug, prof);
      all.push(prof);
    }
  }

  // Apply enrichment lookup (phone/website/rating + officeName) — Illinois only
  const enrich = loadEnrichmentByLicense();
  if (enrich.size) {
    for (const p of all) {
      if (!p.id.startsWith("idfpr_")) continue;
      const e = enrich.get(p.licenseNumber);
      if (!e) continue;
      p.phone = e.phone ?? p.phone;
      p.email = e.email ?? p.email;
      p.website = e.website ?? p.website;
      p.rating = e.rating ?? p.rating;
      p.reviewCount = e.reviewCount ?? p.reviewCount;
      p.photoUrl = e.photoUrl ?? p.photoUrl;
      p.officeName = e.officeName ?? p.officeName;
    }
  }

  cachedProfessionals = all;
  cachedProfessionalsBySlug = bySlug;
  lastLoadTime = new Date();
  return all;
}

/* ── Public API ──────────────────────────────────────────────── */

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

/**
 * Search/filter/paginate licensed professionals.
 */
export function searchLicensedProfessionals(params: ProfessionalSearchParams): ProfessionalSearchResult {
  const all = loadAllProfessionals();
  let filtered = all;

  // Category filter
  if (params.category && params.category !== "All") {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  // City filter
  if (params.city) {
    const city = params.city.toLowerCase();
    filtered = filtered.filter((p) => p.city.toLowerCase().includes(city));
  }

  // Zip filter — skip when the query contains a name (letters)
  // so "Antonio Jaime" + zip 60609 still finds Antonio everywhere.
  // Zip only narrows results when browsing without a name search.
  const queryHasName = params.q ? /[a-zA-Z]{2,}/.test(params.q) : false;
  if (params.zip && !queryHasName) {
    filtered = filtered.filter((p) => p.zip.startsWith(params.zip!));
  }

  // County filter
  if (params.county) {
    const county = params.county.toLowerCase();
    filtered = filtered.filter((p) => p.county.toLowerCase().includes(county));
  }

  // Text search (name, company, city) with relevance scoring
  let scored: { p: UnclaimedProfessional; score: number }[] | null = null;

  if (params.q) {
    const qLower = params.q.toLowerCase().trim();
    const terms = qLower.split(/\s+/).filter(Boolean);

    scored = [];
    for (const p of filtered) {
      const nameLower = p.name.toLowerCase();
      const searchable = `${p.name} ${p.company} ${p.city} ${p.county} ${p.licenseNumber}`.toLowerCase();

      // Must match all terms
      if (!terms.every((term) => searchable.includes(term))) continue;

      // Relevance scoring: higher = better match
      let score = 0;

      // Exact full-name match (highest priority)
      if (nameLower === qLower) {
        score += 100;
      }
      // Name starts with query
      else if (nameLower.startsWith(qLower)) {
        score += 80;
      }
      // All search terms appear in name (vs. other fields)
      else if (terms.every((t) => nameLower.includes(t))) {
        score += 60;
      }
      // Partial name match — count how many terms hit the name
      else {
        const nameHits = terms.filter((t) => nameLower.includes(t)).length;
        score += (nameHits / terms.length) * 40;
      }

      // Bonus: has photo/rating (enriched profiles are higher quality)
      if (p.photoUrl) score += 3;
      if (p.rating) score += 2;

      scored.push({ p, score });
    }

    // Sort by relevance score descending, then name alphabetically for ties
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

/**
 * Get a single professional by ID.
 */
export function getLicensedProfessionalById(id: string): UnclaimedProfessional | null {
  const all = loadAllProfessionals();
  return all.find((p) => p.id === id) ?? null;
}

/**
 * Get a single professional by slug.
 */
export function getLicensedProfessionalBySlug(slug: string): UnclaimedProfessional | null {
  loadAllProfessionals();
  return cachedProfessionalsBySlug?.get(slug) ?? null;
}

/**
 * Get aggregate stats across all loaded data.
 */
export function getLicensedStats(): {
  total: number;
  byCategory: Record<string, number>;
  lastLoaded: string | null;
} {
  const all = loadAllProfessionals();
  const byCategory: Record<string, number> = {};

  for (const p of all) {
    byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
  }

  return {
    total: all.length,
    byCategory,
    lastLoaded: lastLoadTime?.toISOString() ?? null,
  };
}

/**
 * Import new CSV data (for admin upload).
 * Writes file to disk and invalidates cache.
 */
export function importCSV(filename: string, csvContent: string): number {
  const dataDir = getDataDir();

  // Ensure directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, csvContent, "utf-8");

  // Invalidate cache so next read picks up new data
  cachedProfessionals = null;
  cachedProfessionalsBySlug = null;
  lastLoadTime = null;
  cachedEnrichmentByLicense = null;

  // Parse and count valid rows
  const rows = parseCSVFile(filePath);
  let count = 0;
  for (const row of rows) {
    if (rowToProfessional(row, { idPrefix: "idfpr_", defaultState: "IL" })) count++;
  }

  return count;
}

/**
 * Force reload all data (useful after import).
 */
export function reloadData(): void {
  cachedProfessionals = null;
  cachedProfessionalsBySlug = null;
  lastLoadTime = null;
  cachedEnrichmentByLicense = null;
  loadAllProfessionals();
}

/**
 * Get all professionals (for search suggestions, etc.).
 * Returns the full cached array — don't mutate.
 */
export function getAllLicensedProfessionals(): UnclaimedProfessional[] {
  return loadAllProfessionals();
}
