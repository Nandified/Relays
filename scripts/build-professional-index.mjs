#!/usr/bin/env node

/**
 * Build-time generator: compiles large CSV-based licensed professional datasets
 * into a compact JSON module that WILL be bundled into the serverless output.
 *
 * This avoids relying on fs reads in Vercel serverless runtimes.
 */

import fs from "fs";
import path from "path";

const cwd = process.cwd();
const dataDir = path.join(cwd, "data", "idfpr");
const outDir = path.join(cwd, "src", "lib", "generated");
const outFile = path.join(outDir, "licensed-professionals.json");

function slugify(input) {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        fields.push(current.trim());
        current = "";
      } else current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSVFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const row = {};
    for (let j = 0; j < headers.length; j++) row[headers[j]] = fields[j] ?? "";
    rows.push(row);
  }
  return rows;
}

const LICENSE_TYPE_TO_CATEGORY = {
  "LICENSED REAL ESTATE BROKER": "Realtor",
  "LICENSED REAL ESTATE MANAGING BROKER": "Realtor",
  "LICENSED HOME INSPECTOR": "Home Inspector",
};

const SKIP_LICENSE_TYPES = new Set([
  "CERTIFIED RESIDENTIAL REAL ESTATE APPRAISER",
  "CERTIFIED GENERAL REAL ESTATE APPRAISER",
  "ASSOCIATE REAL ESTATE TRAINEE APPRAISER",
  "LICENSED REAL ESTATE BROKER CORPORATION",
  "LICENSED REAL ESTATE BROKER PARTNERSHIP",
  "LICENSED REAL ESTATE BROKER LLC",
  "LICENSED REAL ESTATE BROKER LLC",
]);

function rowToProfessional(row, { idPrefix, defaultState }) {
  const isDirectoryShape = typeof row.full_name === "string" && row.full_name.trim().length > 0;
  const licenseNumber = (row.license_number ?? "").trim();
  if (!licenseNumber) return null;

  if (!isDirectoryShape) {
    const licenseType = (row.type ?? "").toUpperCase().trim();
    if (row.is_business === "True") return null;
    if (SKIP_LICENSE_TYPES.has(licenseType)) return null;

    const category = LICENSE_TYPE_TO_CATEGORY[licenseType];
    if (!category) return null;

    return {
      id: `${idPrefix}${licenseNumber}`,
      slug: "",
      name: (row.name ?? "").trim(),
      licenseNumber,
      licenseType: row.type ?? "",
      company: (row.company ?? "").trim(),
      officeName: null,
      city: (row.city ?? "").trim(),
      state: (row.state ?? defaultState).trim(),
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

  const lt = (row.license_type ?? "").toLowerCase();
  const status = (row.status ?? "").toLowerCase();
  if (status && !status.includes("active")) return null;
  if (!/(broker|sales|realtor|agent)/i.test(lt)) return null;

  return {
    id: `${idPrefix}${licenseNumber}`,
    slug: "",
    name: (row.full_name ?? row.name ?? "").trim(),
    licenseNumber,
    licenseType: (row.license_type ?? "").trim(),
    company: (row.company ?? "").trim(),
    officeName: null,
    city: (row.city ?? "").trim(),
    state: (row.state ?? defaultState).trim(),
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

function baseSlugForProfessional(p) {
  return slugify(`${p.name} ${p.city}`.trim());
}

function loadEnrichmentByLicense() {
  const enrichPath = path.join(dataDir, "idfpr_outscraper_enrichment.json");
  if (!fs.existsSync(enrichPath)) return new Map();
  try {
    const parsed = JSON.parse(fs.readFileSync(enrichPath, "utf-8"));
    return new Map(Object.entries(parsed.byLicenseNumber ?? {}));
  } catch {
    return new Map();
  }
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main() {
  if (!fs.existsSync(dataDir)) {
    console.warn(`[build-professional-index] data dir missing: ${dataDir}`);
    ensureDir(outDir);
    fs.writeFileSync(outFile, JSON.stringify([], null, 2));
    return;
  }

  const ilFiles = [
    "real_estate_broker.csv",
    "home_inspector.csv",
    "real_estate_appraiser.csv",
    "real_estate_brokerage.csv",
  ];

  const all = [];
  const slugs = new Set();
  const seenIds = new Set();

  for (const file of ilFiles) {
    const fp = path.join(dataDir, file);
    const rows = parseCSVFile(fp);
    for (const row of rows) {
      const prof = rowToProfessional(row, { idPrefix: "idfpr_", defaultState: "IL" });
      if (!prof) continue;
      if (seenIds.has(prof.id)) continue;
      seenIds.add(prof.id);

      const baseSlug = baseSlugForProfessional(prof);
      const candidate = baseSlug || `professional-${prof.licenseNumber}`;
      const finalSlug = slugs.has(candidate) ? `${candidate}-${prof.licenseNumber}` : candidate;
      prof.slug = finalSlug;
      slugs.add(finalSlug);

      all.push(prof);
    }
  }

  // Enrich IL only
  const enrich = loadEnrichmentByLicense();
  if (enrich.size) {
    for (const p of all) {
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

  ensureDir(outDir);
  // Keep the bundle small: only fields needed for search + listing UX.
  const compact = all.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    licenseNumber: p.licenseNumber,
    licenseType: p.licenseType,
    company: p.company,
    officeName: p.officeName,
    city: p.city,
    state: p.state,
    zip: p.zip,
    county: p.county,
    licensedSince: p.licensedSince,
    expires: p.expires,
    disciplined: p.disciplined,
    category: p.category,
    claimed: false,
    claimedByProId: null,
    phone: p.phone,
    email: p.email,
    website: p.website,
    rating: p.rating,
    reviewCount: p.reviewCount,
    photoUrl: p.photoUrl,
  }));

  fs.writeFileSync(outFile, JSON.stringify(compact));
  console.log(`[build-professional-index] wrote ${compact.length.toLocaleString()} to ${path.relative(cwd, outFile)}`);
}

main();
