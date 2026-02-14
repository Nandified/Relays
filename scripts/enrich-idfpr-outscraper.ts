/**
 * Enrich IDFPR licensed professionals with Outscraper Google Maps results.
 *
 * Output: data/idfpr/idfpr_outscraper_enrichment.json
 * (lookup keyed by licenseNumber)
 *
 * Run:
 *   node --experimental-strip-types scripts/enrich-idfpr-outscraper.ts
 */

import * as fs from "fs";
import * as path from "path";

type IdfprPersonRaw = {
  first_name?: string;
  middle?: string;
  last_name?: string;
  license_number: string;
  businessdba?: string;
  city?: string;
  state?: string;
  zip?: string;
};

type OutscraperPlace = {
  name?: string;
  city?: string;
  phone?: string;
  website?: string;
  site?: string;
  rating?: number | string;
  reviews?: number | string;
  photo?: string;
  logo?: string;
  place_id?: string;
  postal_code?: string;
};

export type ProfessionalEnrichment = {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  photoUrl?: string | null;
  officeName?: string | null;
  googlePlaceId?: string | null;
};

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJsonPretty(filePath: string, data: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function normCity(s: string): string {
  return s
    .toLowerCase()
    .replace(/\bst\.?\b/g, "saint")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normName(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\b(inc|llc|l\.?l\.?c\.?|ltd|corp|corporation|co|company)\b/g, " ")
    .replace(/\b(realtor|realtors|real\s+estate|properties|property|team|group|brokerage|broker|agent|agents)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  const n = normName(s);
  if (!n) return [];
  return n.split(" ").filter(Boolean);
}

function bigrams(s: string): string[] {
  const x = s.replace(/\s+/g, " ").trim();
  if (x.length < 2) return x ? [x] : [];
  const out: string[] = [];
  for (let i = 0; i < x.length - 1; i++) out.push(x.slice(i, i + 2));
  return out;
}

// Sørensen–Dice coefficient over character bigrams
function diceSimilarity(a: string, b: string): number {
  const na = normName(a);
  const nb = normName(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const A = bigrams(na);
  const B = bigrams(nb);
  const counts = new Map<string, number>();
  for (const g of A) counts.set(g, (counts.get(g) ?? 0) + 1);
  let intersection = 0;
  for (const g of B) {
    const c = counts.get(g) ?? 0;
    if (c > 0) {
      intersection++;
      counts.set(g, c - 1);
    }
  }
  return (2 * intersection) / (A.length + B.length);
}

function lastNameFromFullName(full: string): string {
  const t = tokenize(full);
  return t.length ? t[t.length - 1] : "";
}

function extractPersonishName(listingName: string): string {
  // Prefer the left side of "|" / dash separators; also split common "at" patterns.
  const raw = listingName.trim();
  const parts = raw.split(/\s*[|]|\s+[-–—]\s+|\s+at\s+|\s+@\s+/i);
  return (parts[0] ?? raw).trim();
}

function looksLikeOfficeName(name: string, personName: string): boolean {
  const sim = diceSimilarity(name, personName);
  if (sim < 0.72) return true;
  if (/[|]|\s+[-–—]\s+/.test(name)) return true;
  const n = name.toLowerCase();
  if (/re\/?max|kw\b|keller\s+williams|coldwell|compass|sotheby|century\s*21|@properties|berkshire/.test(n)) return true;
  return false;
}

function isMeaningfulOfficeName(candidate: string | undefined, personName: string): string | null {
  const c = (candidate ?? "").trim();
  if (!c) return null;
  const sim = diceSimilarity(c, personName);
  if (sim > 0.9) return null;
  if (c.length < 3) return null;
  return c;
}

function toNumber(x: unknown): number | null {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string") {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

type PersonIndexRow = {
  licenseNumber: string;
  personName: string;
  city: string;
  normCity: string;
  lastName: string;
  businessdba?: string;
};

function indexPeopleByCity(people: IdfprPersonRaw[]): {
  cityIndex: Map<string, PersonIndexRow[]>;
  licenseToPerson: Map<string, PersonIndexRow>;
} {
  const cityIndex = new Map<string, PersonIndexRow[]>();
  const licenseToPerson = new Map<string, PersonIndexRow>();

  for (const b of people) {
    const licenseNumber = (b.license_number ?? "").trim();
    if (!licenseNumber) continue;

    const personName = [b.first_name, b.middle, b.last_name].filter(Boolean).join(" ").trim();
    const city = (b.city ?? "").trim();

    const row: PersonIndexRow = {
      licenseNumber,
      personName: personName || "",
      city,
      normCity: normCity(city),
      lastName: lastNameFromFullName(personName || ""),
      businessdba: b.businessdba,
    };

    const key = row.normCity;
    if (!key) continue;
    if (!cityIndex.has(key)) cityIndex.set(key, []);
    cityIndex.get(key)!.push(row);
    licenseToPerson.set(licenseNumber, row);
  }

  return { cityIndex, licenseToPerson };
}

function applyOutscraperMatches(opts: {
  places: OutscraperPlace[];
  cityIndex: Map<string, PersonIndexRow[]>;
  enrichmentByLicense: Record<string, ProfessionalEnrichment>;
  matchCounts: { matched: number; ambiguous: number };
}) {
  for (const place of opts.places) {
    const listingName = (place.name ?? "").trim();
    const city = (place.city ?? "").trim();
    if (!listingName || !city) continue;

    const key = normCity(city);
    const candidates = opts.cityIndex.get(key) ?? [];
    if (candidates.length === 0) continue;

    const personish = extractPersonishName(listingName);

    let best: { row: PersonIndexRow; score: number } | null = null;
    let secondBestScore = 0;

    for (const row of candidates) {
      if (!row.personName) continue;

      const ln = row.lastName;
      if (
        ln &&
        normName(listingName).includes(ln) === false &&
        normName(personish).includes(ln) === false
      ) {
        continue;
      }

      const s1 = diceSimilarity(row.personName, listingName);
      const s2 = diceSimilarity(row.personName, personish);
      const score = Math.max(s1, s2);

      if (!best || score > best.score) {
        secondBestScore = best?.score ?? 0;
        best = { row, score };
      } else if (score > secondBestScore) {
        secondBestScore = score;
      }
    }

    if (!best) continue;

    if (best.score < 0.84) continue;
    if (secondBestScore && best.score - secondBestScore < 0.04) {
      opts.matchCounts.ambiguous++;
      continue;
    }

    const licenseNumber = best.row.licenseNumber;
    const existing = opts.enrichmentByLicense[licenseNumber] ?? {};

    const website = (place.website ?? place.site ?? "").trim() || null;
    const rating = toNumber(place.rating);
    const reviewCount = toNumber(place.reviews);
    const photoUrl = (place.photo ?? place.logo ?? "").trim() || null;

    const officeFromDba = isMeaningfulOfficeName(best.row.businessdba, best.row.personName);
    const officeFromGoogle = looksLikeOfficeName(listingName, best.row.personName) ? listingName : null;
    const officeName = officeFromDba ?? officeFromGoogle ?? null;

    opts.enrichmentByLicense[licenseNumber] = {
      ...existing,
      phone: (place.phone ?? "").trim() || existing.phone || null,
      email: existing.email ?? null,
      website: website ?? existing.website ?? null,
      rating: rating ?? existing.rating ?? null,
      reviewCount: reviewCount ?? existing.reviewCount ?? null,
      photoUrl: photoUrl ?? existing.photoUrl ?? null,
      officeName: officeName ?? existing.officeName ?? null,
      googlePlaceId: (place.place_id ?? "").trim() || existing.googlePlaceId || null,
    };

    opts.matchCounts.matched++;
  }
}

function main() {
  const repoRoot = process.cwd();

  const brokersRawPath = path.join(repoRoot, "data", "idfpr", "real_estate_broker_raw.json");
  const inspectorsRawPath = path.join(repoRoot, "data", "idfpr", "home_inspector_raw.json");

  const outscraperAgentsPath = path.join(repoRoot, "data", "outscraper", "il_real_estate_agent_results.json");
  const outscraperInspectorsPath = path.join(repoRoot, "data", "outscraper", "il_home_inspector_results.json");

  const outputPath = path.join(repoRoot, "data", "idfpr", "idfpr_outscraper_enrichment.json");

  const brokers = readJson<IdfprPersonRaw[]>(brokersRawPath);
  const inspectors = readJson<IdfprPersonRaw[]>(inspectorsRawPath);

  const placesAgents = readJson<OutscraperPlace[]>(outscraperAgentsPath);
  const placesInspectors = readJson<OutscraperPlace[]>(outscraperInspectorsPath);

  const brokerIndex = indexPeopleByCity(brokers);
  const inspectorIndex = indexPeopleByCity(inspectors);

  const enrichmentByLicense: Record<string, ProfessionalEnrichment> = {};

  const matchCounts = {
    matched: 0,
    ambiguous: 0,
  };

  applyOutscraperMatches({
    places: placesAgents,
    cityIndex: brokerIndex.cityIndex,
    enrichmentByLicense,
    matchCounts,
  });

  applyOutscraperMatches({
    places: placesInspectors,
    cityIndex: inspectorIndex.cityIndex,
    enrichmentByLicense,
    matchCounts,
  });

  // Also write officeName for anyone who has a meaningful businessdba, even if not matched in Outscraper.
  let dbaOnly = 0;
  for (const [licenseNumber, row] of new Map([...brokerIndex.licenseToPerson, ...inspectorIndex.licenseToPerson]).entries()) {
    const officeFromDba = isMeaningfulOfficeName(row.businessdba, row.personName);
    if (!officeFromDba) continue;
    if (!enrichmentByLicense[licenseNumber]) {
      enrichmentByLicense[licenseNumber] = {
        phone: null,
        email: null,
        website: null,
        rating: null,
        reviewCount: null,
        photoUrl: null,
        officeName: officeFromDba,
        googlePlaceId: null,
      };
      dbaOnly++;
    } else if (!enrichmentByLicense[licenseNumber].officeName) {
      enrichmentByLicense[licenseNumber].officeName = officeFromDba;
    }
  }

  writeJsonPretty(outputPath, {
    generatedAt: new Date().toISOString(),
    matchedOutscraperPlaces: matchCounts.matched,
    ambiguousOutscraperPlaces: matchCounts.ambiguous,
    dbaOnly,
    byLicenseNumber: enrichmentByLicense,
  });

  // eslint-disable-next-line no-console
  console.log(
    `[enrich-idfpr-outscraper] wrote ${Object.keys(enrichmentByLicense).length} enrichments → ${path.relative(
      repoRoot,
      outputPath
    )} (matched=${matchCounts.matched}, ambiguous=${matchCounts.ambiguous}, dbaOnly=${dbaOnly})`
  );
}

main();
