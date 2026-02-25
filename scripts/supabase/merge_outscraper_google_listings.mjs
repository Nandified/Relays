#!/usr/bin/env node
/**
 * Merge Outscraper Google Places listings into Supabase `licensed_professionals`
 * with aggressive de-dupe.
 *
 * Goal (per Frank):
 * - Keep ALL profiles we have, but NO duplicates.
 * - Enrich the main licensed list when we can.
 * - Also include Google-only profiles when we can't match them to a licensed row.
 *
 * Strategy:
 * 1) Load Outscraper JSON arrays from data/outscraper/*_results.json
 * 2) De-dupe the incoming set by google_place_id (place_id)
 * 3) Build match candidates against existing Supabase rows:
 *    - First: match by google_place_id (exact)
 *    - Second: match by normalized website host (if present)
 *    - Third: match by normalized phone (if present)
 *    - Fallback: insert as Google-only row.
 *
 * IMPORTANT:
 * - We never create a *second* row for a Google Place ID if it's already linked.
 * - When we match an existing row, we UPDATE enrichment fields and set google_place_id.
 * - When we insert a new Google-only row, we use id = `google_<placeId>`.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/supabase/merge_outscraper_google_listings.mjs
 *
 * Optional:
 *   --limit 0        (default 0 = no limit)
 *   --batch 500      (10..2000)
 *   --concurrency 25 (1..50)
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function arg(name, def) {
  const i = process.argv.indexOf(name);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v ?? def;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function toNumber(x) {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string") {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function safeTrim(x) {
  return typeof x === "string" ? x.trim() : "";
}

function normPhone(p) {
  const s = safeTrim(p);
  if (!s) return "";
  const digits = s.replace(/\D+/g, "");
  // normalize US numbers: keep last 10 digits
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function normHost(url) {
  const s = safeTrim(url);
  if (!s) return "";
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    const host = (u.hostname || "").toLowerCase();
    return host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function looksPersonishName(name) {
  const n = name.trim();
  if (!n) return false;
  if (/\b(inc|llc|ltd|co|company|corp|corporation|pllc|pc)\b/i.test(n)) return false;
  if (/[|@/]/.test(n)) return false;
  const words = n.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 4) return false;
  if (!/^[A-Za-z\s.'-]+$/.test(n)) return false;
  return true;
}

function cleanedDisplayName(original) {
  const raw = (original ?? "").trim();
  if (!raw) return raw;
  const primary = raw.split(/\s*[|]|\s+[-–—]\s+|\s+at\s+|\s+@\s+/i)[0]?.trim() ?? raw;
  if (looksPersonishName(primary)) return primary;
  return raw;
}

const OUTSCRAPER_FILES = [
  { file: "il_mortgage_lender_results.json", category: "Mortgage Lender" },
  { file: "il_real_estate_attorney_results.json", category: "Attorney" },
  { file: "il_homeowners_insurance_agent_results.json", category: "Insurance Agent" },
  { file: "il_home_inspector_results.json", category: "Home Inspector" },
  // Realtors from Google:
  { file: "il_real_estate_agent_results.json", category: "Realtor" },
  // targeted_search_results.json is a separate artifact; skip unless we explicitly want it.
];

function readJsonArray(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function updateWithRetry(sb, id, patch, attempt = 1) {
  try {
    const { error } = await sb.from("licensed_professionals").update(patch).eq("id", id);
    if (!error) return;

    const msg = String(error.message || "");
    const retryable = error.code === "429" || /timeout|temporar|rate|socket|fetch failed/i.test(msg);
    if (!retryable || attempt >= 8) throw error;

    const backoff = Math.min(30000, 500 * 2 ** attempt);
    await sleep(backoff);
    return updateWithRetry(sb, id, patch, attempt + 1);
  } catch (err) {
    const msg = String(err?.message || err);
    const retryable = /socket|fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|other side closed/i.test(msg);
    if (!retryable || attempt >= 8) throw err;
    const backoff = Math.min(30000, 500 * 2 ** attempt);
    await sleep(backoff);
    return updateWithRetry(sb, id, patch, attempt + 1);
  }
}

async function upsertWithRetry(sb, row, attempt = 1) {
  try {
    const { error } = await sb.from("licensed_professionals").upsert(row, { onConflict: "id" });
    if (!error) return;

    const msg = String(error.message || "");
    const retryable = error.code === "429" || /timeout|temporar|rate|socket|fetch failed/i.test(msg);
    if (!retryable || attempt >= 8) throw error;

    const backoff = Math.min(30000, 500 * 2 ** attempt);
    await sleep(backoff);
    return upsertWithRetry(sb, row, attempt + 1);
  } catch (err) {
    const msg = String(err?.message || err);
    const retryable = /socket|fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|other side closed/i.test(msg);
    if (!retryable || attempt >= 8) throw err;
    const backoff = Math.min(30000, 500 * 2 ** attempt);
    await sleep(backoff);
    return upsertWithRetry(sb, row, attempt + 1);
  }
}

async function runWithConcurrency(items, fn, concurrency) {
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx]);
    }
  }
  const n = Math.min(concurrency, items.length || 1);
  await Promise.all(Array.from({ length: n }, () => worker()));
}

async function main() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

  const limit = parseInt(arg("--limit", "0"), 10) || 0;
  const batchSize = Math.min(Math.max(parseInt(arg("--batch", "500"), 10) || 500, 10), 2000);
  const concurrency = Math.min(Math.max(parseInt(arg("--concurrency", "25"), 10) || 25, 1), 50);

  const outscraperDir = path.join(process.cwd(), "data", "outscraper");

  // 1) Load + normalize incoming
  const incomingByPlaceId = new Map();

  for (const { file, category } of OUTSCRAPER_FILES) {
    const places = readJsonArray(path.join(outscraperDir, file));
    for (const place of places) {
      const placeId = safeTrim(place.place_id);
      if (!placeId) continue;
      if (incomingByPlaceId.has(placeId)) continue; // de-dupe across files

      const nameRaw = safeTrim(place.name);
      const name = cleanedDisplayName(nameRaw) || nameRaw || "Unknown";
      const website = safeTrim(place.website || place.site) || null;
      const phone = safeTrim(place.phone) || null;

      incomingByPlaceId.set(placeId, {
        placeId,
        category,
        name,
        company: nameRaw || name,
        city: safeTrim(place.city) || "",
        state: (safeTrim(place.state_code || place.state || "IL") || "IL").slice(0, 2).toUpperCase(),
        zip: safeTrim(place.postal_code) || "",
        county: safeTrim(place.county) || "",
        phone,
        website,
        rating: toNumber(place.rating),
        review_count: toNumber(place.reviews),
        photo_url: safeTrim(place.photo || place.logo) || null,
        normHost: website ? normHost(website) : "",
        normPhone: phone ? normPhone(phone) : "",
      });
    }
  }

  let incoming = Array.from(incomingByPlaceId.values());
  if (limit > 0) incoming = incoming.slice(0, limit);

  console.log(`Incoming unique Google place_ids: ${incoming.length.toLocaleString()}`);

  // 2) Build indexes of existing rows (lightweight)
  // We only fetch fields needed for matching.
  // NOTE: This is a lot of rows at scale; if it becomes too large, we can page.
  const { data: existing, error: exErr } = await sb
    .from("licensed_professionals")
    .select("id,google_place_id,website,phone")
    .limit(200000);
  if (exErr) throw exErr;

  const byPlaceId = new Map();
  const byHost = new Map();
  const byPhone = new Map();

  for (const r of existing ?? []) {
    const gp = safeTrim(r.google_place_id);
    if (gp) byPlaceId.set(gp, r.id);

    const host = normHost(r.website);
    if (host && !byHost.has(host)) byHost.set(host, r.id);

    const ph = normPhone(r.phone);
    if (ph && !byPhone.has(ph)) byPhone.set(ph, r.id);
  }

  // 3) Decide actions
  const toUpdate = []; // { id, patch }
  const toInsert = []; // full row

  for (const p of incoming) {
    const placeId = p.placeId;

    // Match order:
    const existingId =
      byPlaceId.get(placeId) ||
      (p.normHost ? byHost.get(p.normHost) : null) ||
      (p.normPhone ? byPhone.get(p.normPhone) : null) ||
      null;

    if (existingId) {
      toUpdate.push({
        id: existingId,
        patch: {
          // Enrichment fields (only overwrite when incoming is non-null)
          google_place_id: placeId,
          website: p.website ?? undefined,
          phone: p.phone ?? undefined,
          rating: typeof p.rating === "number" ? p.rating : undefined,
          review_count: typeof p.review_count === "number" ? p.review_count : undefined,
          photo_url: p.photo_url ?? undefined,
          office_name: undefined,
        },
      });
      continue;
    }

    // Insert as Google-only row
    toInsert.push({
      id: `google_${placeId}`,
      slug: `google-${placeId}`,
      name: p.name,
      category: p.category,
      license_number: null,
      license_type: null,
      company: p.company,
      office_name: null,
      city: p.city,
      state: p.state,
      zip: p.zip,
      county: p.county,
      licensed_since: "",
      expires: "",
      disciplined: false,
      phone: p.phone,
      email: null,
      website: p.website,
      rating: p.rating,
      review_count: p.review_count,
      photo_url: p.photo_url,
      google_place_id: placeId,
      source: "google",
    });
  }

  console.log(`Matched existing rows to enrich: ${toUpdate.length.toLocaleString()}`);
  console.log(`Google-only inserts: ${toInsert.length.toLocaleString()}`);

  // 4) Apply updates/inserts
  let doneU = 0;
  for (let i = 0; i < toUpdate.length; i += batchSize) {
    const slice = toUpdate.slice(i, i + batchSize);
    await runWithConcurrency(
      slice,
      async ({ id, patch }) => {
        // Remove undefined keys so we don't overwrite with NULL.
        const cleaned = {};
        for (const [k, v] of Object.entries(patch)) {
          if (v !== undefined) cleaned[k] = v;
        }
        await updateWithRetry(sb, id, cleaned);
      },
      concurrency
    );
    doneU = Math.min(i + slice.length, toUpdate.length);
    process.stdout.write(`\rUpdated ${doneU.toLocaleString()} / ${toUpdate.length.toLocaleString()}...`);
  }
  process.stdout.write("\n");

  let doneI = 0;
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const slice = toInsert.slice(i, i + batchSize);
    await runWithConcurrency(slice, async (row) => upsertWithRetry(sb, row), concurrency);
    doneI = Math.min(i + slice.length, toInsert.length);
    process.stdout.write(`\rInserted ${doneI.toLocaleString()} / ${toInsert.length.toLocaleString()}...`);
  }
  process.stdout.write("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
