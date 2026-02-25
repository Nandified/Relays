#!/usr/bin/env node
/**
 * Cleanup pass: merge Google-only rows into canonical license rows when we can confidently match,
 * then delete the Google-only row to remove duplicates.
 *
 * Why:
 * - We inserted ~16k google-only rows (source='google').
 * - We want "all profiles, no duplicates" AND prefer canonical license rows when possible.
 *
 * Matching (conservative):
 * - Only consider matching google -> license when we get EXACTLY ONE candidate by:
 *   1) website host match (license.website ILIKE %host%)
 *   2) phone digits match (license.phone ILIKE %digits%)
 * - If multiple candidates or none: skip (avoid bad merges).
 *
 * Merge behavior:
 * - Update license row:
 *   - set google_place_id (takes ownership)
 *   - copy enrichment fields from google row ONLY when license field is null/empty.
 * - Delete google row if we successfully updated the license row.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/supabase/cleanup_google_duplicates.mjs
 *
 * Optional:
 *   --limit 0        (default 0 = no limit)
 *   --batch 200      (10..1000)
 *   --concurrency 10 (1..30)
 */

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

function safeTrim(x) {
  return typeof x === "string" ? x.trim() : "";
}

function normPhone(p) {
  const s = safeTrim(p);
  if (!s) return "";
  const digits = s.replace(/\D+/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function normHost(url) {
  const s = safeTrim(url);
  if (!s) return "";
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    return (u.hostname || "").toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function nonEmpty(x) {
  return typeof x === "string" ? x.trim() !== "" : x !== null && x !== undefined;
}

function coalescePatch(licenseRow, googleRow) {
  const patch = {};

  // google_place_id: always set (we only do this when we plan to delete google row)
  patch.google_place_id = googleRow.google_place_id;

  // Only fill missing fields
  if (!nonEmpty(licenseRow.website) && nonEmpty(googleRow.website)) patch.website = googleRow.website;
  if (!nonEmpty(licenseRow.phone) && nonEmpty(googleRow.phone)) patch.phone = googleRow.phone;
  if (licenseRow.rating == null && googleRow.rating != null) patch.rating = googleRow.rating;
  if (licenseRow.review_count == null && googleRow.review_count != null) patch.review_count = googleRow.review_count;
  if (!nonEmpty(licenseRow.photo_url) && nonEmpty(googleRow.photo_url)) patch.photo_url = googleRow.photo_url;

  return patch;
}

async function main() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const limit = parseInt(arg("--limit", "0"), 10) || 0;
  const batchSize = Math.min(Math.max(parseInt(arg("--batch", "200"), 10) || 200, 10), 1000);
  const concurrency = Math.min(Math.max(parseInt(arg("--concurrency", "10"), 10) || 10, 1), 30);

  // Pull google rows in pages.
  let offset = 0;
  let processed = 0;
  let merged = 0;
  let skipped = 0;

  async function handleOne(g) {
    const host = normHost(g.website);
    const phone10 = normPhone(g.phone);

    let candidates = [];

    if (host) {
      const { data, error } = await sb
        .from("licensed_professionals")
        .select("id,website,phone,rating,review_count,photo_url,google_place_id")
        .eq("source", "license")
        .ilike("website", `%${host}%`)
        .limit(3);
      if (error) throw error;
      candidates = candidates.concat(data ?? []);
    }

    if (phone10) {
      const { data, error } = await sb
        .from("licensed_professionals")
        .select("id,website,phone,rating,review_count,photo_url,google_place_id")
        .eq("source", "license")
        .ilike("phone", `%${phone10}%`)
        .limit(3);
      if (error) throw error;
      candidates = candidates.concat(data ?? []);
    }

    // If no candidates from host/phone, try strict name+city+category.
    if (candidates.length === 0) {
      const name = safeTrim(g.name);
      const city = safeTrim(g.city);
      const category = safeTrim(g.category);
      if (name && city && category) {
        const { data, error } = await sb
          .from("licensed_professionals")
          .select("id,website,phone,rating,review_count,photo_url,google_place_id")
          .eq("source", "license")
          .eq("category", category)
          .ilike("city", city)
          .ilike("name", name)
          .limit(2);
        if (error) throw error;
        candidates = candidates.concat(data ?? []);
      }
    }

    // De-dupe candidates by id
    const byId = new Map();
    for (const c of candidates) byId.set(c.id, c);
    const uniq = Array.from(byId.values());

    if (uniq.length !== 1) {
      skipped++;
      return;
    }

    const lic = uniq[0];

    // If license row already has a different google_place_id, skip (avoid overwriting linkage)
    const existingGp = safeTrim(lic.google_place_id);
    if (existingGp && existingGp !== g.google_place_id) {
      skipped++;
      return;
    }

    const patch = coalescePatch(lic, g);

    // If patch would only set google_place_id and nothing else, still OK (it moves ownership)
    const { error: uErr } = await sb.from("licensed_professionals").update(patch).eq("id", lic.id);
    if (uErr) {
      // If uniqueness violation, skip
      skipped++;
      return;
    }

    // delete google row
    const { error: dErr } = await sb.from("licensed_professionals").delete().eq("id", g.id);
    if (dErr) {
      // If delete failed, we leave it; but we already linked license.
      skipped++;
      return;
    }

    merged++;
  }

  while (true) {
    const pageEnd = offset + batchSize - 1;

    const { data: googleRows, error } = await sb
      .from("licensed_professionals")
      .select("id,google_place_id,name,city,state,category,website,phone,rating,review_count,photo_url")
      .eq("source", "google")
      .range(offset, pageEnd);
    if (error) throw error;

    const rows = googleRows ?? [];
    if (rows.length === 0) break;

    const slice = limit > 0 ? rows.slice(0, Math.max(0, limit - processed)) : rows;
    if (slice.length === 0) break;

    let i = 0;
    async function worker() {
      while (i < slice.length) {
        const idx = i++;
        await handleOne(slice[idx]);
        processed++;
        if (processed % 200 === 0) {
          process.stdout.write(`\rprocessed=${processed} merged=${merged} skipped=${skipped}`);
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, slice.length) }, () => worker()));

    process.stdout.write(`\rprocessed=${processed} merged=${merged} skipped=${skipped}`);

    if (limit > 0 && processed >= limit) break;

    offset += batchSize;
  }

  process.stdout.write(`\nDone. processed=${processed} merged=${merged} skipped=${skipped}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
