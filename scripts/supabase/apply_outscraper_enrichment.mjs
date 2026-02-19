#!/usr/bin/env node

/**
 * Apply previously-generated Outscraper enrichment (ratings/reviews/photo/etc)
 * to the Supabase `licensed_professionals` table.
 *
 * Input: data/idfpr/idfpr_outscraper_enrichment.json
 * Shape: { byLicenseNumber: { [licenseNumber]: { rating, reviewCount, photoUrl, website, ... } } }
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/supabase/apply_outscraper_enrichment.mjs
 *
 * Optional:
 *   --limit 5000
 *   --batch 500
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

async function upsertWithRetry(sb, batch, attempt = 1) {
  try {
    const { error } = await sb.from("licensed_professionals").upsert(batch, { onConflict: "id" });
    if (!error) return;

    const msg = String(error.message || "");
    const retryable = error.code === "429" || /timeout|temporar|rate|socket|fetch failed/i.test(msg);
    if (!retryable || attempt >= 8) throw error;

    const backoff = Math.min(30000, 500 * 2 ** attempt);
    await sleep(backoff);
    return upsertWithRetry(sb, batch, attempt + 1);
  } catch (err) {
    const msg = String(err?.message || err);
    const retryable = /socket|fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|other side closed/i.test(msg);
    if (!retryable || attempt >= 8) throw err;
    const backoff = Math.min(30000, 500 * 2 ** attempt);
    await sleep(backoff);
    return upsertWithRetry(sb, batch, attempt + 1);
  }
}

async function main() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

  const limit = parseInt(arg("--limit", "0"), 10) || 0;
  const batchSize = Math.min(Math.max(parseInt(arg("--batch", "500"), 10) || 500, 50), 2000);

  const enrichmentPath = path.join(process.cwd(), "data", "idfpr", "idfpr_outscraper_enrichment.json");
  if (!fs.existsSync(enrichmentPath)) {
    throw new Error(`Missing enrichment file: ${enrichmentPath}`);
  }

  const parsed = JSON.parse(fs.readFileSync(enrichmentPath, "utf-8"));
  const byLicenseNumber = parsed?.byLicenseNumber ?? {};
  const licenseNumbers = Object.keys(byLicenseNumber);
  const total = limit > 0 ? Math.min(limit, licenseNumbers.length) : licenseNumbers.length;

  console.log(`Loaded enrichment licenses: ${licenseNumbers.length.toLocaleString()}`);
  console.log(`Applying: ${total.toLocaleString()} (batch=${batchSize})`);

  let done = 0;
  for (let i = 0; i < total; i += batchSize) {
    const slice = licenseNumbers.slice(i, i + batchSize);

    const batch = slice.map((ln) => {
      const e = byLicenseNumber[ln] || {};
      return {
        // IL rows are idfpr_<licenseNumber> in our import.
        id: `idfpr_${ln}`,
        office_name: e.officeName ?? null,
        phone: e.phone ?? null,
        email: e.email ?? null,
        website: e.website ?? null,
        rating: typeof e.rating === "number" ? e.rating : null,
        review_count: typeof e.reviewCount === "number" ? e.reviewCount : null,
        photo_url: e.photoUrl ?? null,
      };
    });

    // IMPORTANT: Only update rows that already exist in Supabase.
    // If we upsert an id that doesn't exist, Postgres will try to INSERT and fail the NOT NULL constraints (e.g., name).
    const ids = batch.map((r) => r.id);
    const { data: existing, error: existErr } = await sb
      .from("licensed_professionals")
      .select("id")
      .in("id", ids);
    if (existErr) throw existErr;

    const existingIds = new Set((existing ?? []).map((r) => r.id));
    const toUpdate = batch.filter((r) => existingIds.has(r.id));
    const skipped = batch.length - toUpdate.length;

    if (toUpdate.length > 0) {
      await upsertWithRetry(sb, toUpdate);
    }

    done = Math.min(i + slice.length, total);
    if (skipped > 0) {
      process.stdout.write(`\rUpdated ${done.toLocaleString()} / ${total.toLocaleString()}... (skipped ${skipped})`);
    } else if (done % (batchSize * 5) === 0 || done === total) {
      process.stdout.write(`\rUpdated ${done.toLocaleString()} / ${total.toLocaleString()}...`);
    }
  }

  process.stdout.write("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
