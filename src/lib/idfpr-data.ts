/**
 * IDFPR Data Loading Module
 *
 * Reads CSV files from /data/idfpr/ and provides search/filter/pagination
 * over Illinois licensed professionals (brokers, inspectors, etc.).
 *
 * Data is parsed once on first request and cached in memory.
 * ~70K records ≈ 30-50MB — acceptable for server-side caching.
 */

import * as fs from "fs";
import * as path from "path";
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

/* ── Map CSV row → UnclaimedProfessional ─────────────────────── */

function rowToProfessional(row: Record<string, string>): UnclaimedProfessional | null {
  const licenseType = (row.type ?? "").toUpperCase().trim();

  // Skip business entities and unsupported types
  if (row.is_business === "True") return null;
  if (SKIP_LICENSE_TYPES.has(licenseType)) return null;

  const category = LICENSE_TYPE_TO_CATEGORY[licenseType];
  if (!category) return null;

  const licenseNumber = (row.license_number ?? "").trim();
  if (!licenseNumber) return null;

  return {
    id: `idfpr_${licenseNumber}`,
    name: (row.name ?? "").trim(),
    licenseNumber,
    licenseType: row.type ?? "",
    company: (row.company ?? "").trim(),
    city: (row.city ?? "").trim(),
    state: (row.state ?? "IL").trim(),
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

/* ── In-memory cache ─────────────────────────────────────────── */

let cachedProfessionals: UnclaimedProfessional[] | null = null;
let lastLoadTime: Date | null = null;

function getDataDir(): string {
  return path.join(process.cwd(), "data", "idfpr");
}

function loadAllProfessionals(): UnclaimedProfessional[] {
  if (cachedProfessionals) return cachedProfessionals;

  const dataDir = getDataDir();
  const files = [
    "real_estate_broker.csv",
    "home_inspector.csv",
    // Appraiser CSV is loaded but rows are skipped via LICENSE_TYPE mapping
    "real_estate_appraiser.csv",
    // Brokerage CSV — business entities are skipped
    "real_estate_brokerage.csv",
  ];

  const all: UnclaimedProfessional[] = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const rows = parseCSVFile(filePath);
    for (const row of rows) {
      const prof = rowToProfessional(row);
      if (prof) all.push(prof);
    }
  }

  cachedProfessionals = all;
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
 * Search/filter/paginate IDFPR professionals.
 */
export function searchProfessionals(params: ProfessionalSearchParams): ProfessionalSearchResult {
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

  // Zip filter
  if (params.zip) {
    filtered = filtered.filter((p) => p.zip.startsWith(params.zip!));
  }

  // County filter
  if (params.county) {
    const county = params.county.toLowerCase();
    filtered = filtered.filter((p) => p.county.toLowerCase().includes(county));
  }

  // Text search (name, company, city)
  if (params.q) {
    const terms = params.q.toLowerCase().split(/\s+/).filter(Boolean);
    filtered = filtered.filter((p) => {
      const searchable = `${p.name} ${p.company} ${p.city} ${p.county} ${p.licenseNumber}`.toLowerCase();
      return terms.every((term) => searchable.includes(term));
    });
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
export function getProfessionalById(id: string): UnclaimedProfessional | null {
  const all = loadAllProfessionals();
  return all.find((p) => p.id === id) ?? null;
}

/**
 * Get aggregate stats across all loaded data.
 */
export function getProfessionalStats(): {
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
  lastLoadTime = null;

  // Parse and count valid rows
  const rows = parseCSVFile(filePath);
  let count = 0;
  for (const row of rows) {
    if (rowToProfessional(row)) count++;
  }

  return count;
}

/**
 * Force reload all data (useful after import).
 */
export function reloadData(): void {
  cachedProfessionals = null;
  lastLoadTime = null;
  loadAllProfessionals();
}

/**
 * Get all professionals (for search suggestions, etc.).
 * Returns the full cached array — don't mutate.
 */
export function getAllProfessionals(): UnclaimedProfessional[] {
  return loadAllProfessionals();
}
