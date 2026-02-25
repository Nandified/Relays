#!/usr/bin/env node
/**
 * Import/merge Outscraper Google Places results into Supabase `licensed_professionals`.
 *
 * Why:
 * - Our UI is now driven by Supabase search (fast + scalable).
 * - The ~9k Google-enriched (Outscraper) profiles were previously file-based only.
 * - This script makes them part of the same "big file" (the table) as the license pros.
 *
 * Input dir:   data/outscraper/*.json (arrays)
 * Output:      upsert into public.licensed_professionals (source='google')
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/supabase/import_outscraper_google_listings.mjs
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
  // Note: Realtors are coming from state license sources (IDFPR), so we don't import a realtor google set here.
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

async function upsertManyWithConcurrency(sb, rows, concurrency = 25) {
  let i = 0;

  async function upsertOneWithRetry(row, attempt = 1) {
    try {
      const { error } = await sb.from("licensed_professionals").upsert(row, { onConflict: "id" });
      if (!error) return;

      const msg = String(error.message || "");
      const retryable = error.code === "429" || /timeout|temporar|rate|socket|fetch failed/i.test(msg);
      if (!retryable || attempt >= 8) throw error;

      const backoff = Math.min(30000, 500 * 2 ** attempt);
      await sleep(backoff);
      return upsertOneWithRetry(row, attempt + 1);
    } catch (err) {
      const msg = String(err?.message || err);
      const retryable = /socket|fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|other side closed/i.test(msg);
      if (!retryable || attempt >= 8) throw err;
      const backoff = Math.min(30000, 500 * 2 ** attempt);
      await sleep(backoff);
      return upsertOneWithRetry(row, attempt + 1);
    }
  }

  async function worker() {
    while (i < rows.length) {
      const idx = i++;
      await upsertOneWithRetry(rows[idx]);
    }
  }

  const n = Math.min(concurrency, rows.length || 1);
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

  let all = [];
  for (const { file, category } of OUTSCRAPER_FILES) {
    const places = readJsonArray(path.join(outscraperDir, file));
    for (const place of places) {
      const placeId = safeTrim(place.place_id);
      if (!placeId) continue;

      const nameRaw = safeTrim(place.name);
      const name = cleanedDisplayName(nameRaw) || nameRaw || "Unknown";

      const row = {
        id: `google_${placeId}`,
        // Keep DB slug unique/stable; UI will use pretty slugs, but we can still resolve by fields.
        slug: `google-${placeId}`,
        name,
        category,
        license_number: null,
        license_type: null,
        company: nameRaw || name,
        office_name: null,
        city: safeTrim(place.city) || "",
        state: (safeTrim(place.state_code || place.state || "IL") || "IL").slice(0, 2).toUpperCase(),
        zip: safeTrim(place.postal_code) || "",
        county: safeTrim(place.county) || "",
        licensed_since: "",
        expires: "",
        disciplined: false,
        phone: safeTrim(place.phone) || null,
        email: null,
        website: safeTrim(place.website || place.site) || null,
        rating: toNumber(place.rating),
        review_count: toNumber(place.reviews),
        photo_url: safeTrim(place.photo || place.logo) || null,
        source: "google",
      };

      all.push(row);
    }
  }

  // De-dupe by id
  const seen = new Set();
  all = all.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  const total = limit > 0 ? Math.min(limit, all.length) : all.length;
  console.log(`Loaded Google listings from Outscraper: ${all.length.toLocaleString()}`);
  console.log(`Upserting: ${total.toLocaleString()} (batch=${batchSize}, concurrency=${concurrency})`);

  let done = 0;
  for (let i = 0; i < total; i += batchSize) {
    const slice = all.slice(i, i + batchSize);
    await upsertManyWithConcurrency(sb, slice, concurrency);
    done = Math.min(i + slice.length, total);
    process.stdout.write(`\rUpserted ${done.toLocaleString()} / ${total.toLocaleString()}...`);
  }

  process.stdout.write("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
