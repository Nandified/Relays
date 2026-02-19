#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

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
        fields.push(current);
        current = "";
      } else current += ch;
    }
  }
  fields.push(current);
  return fields.map((s) => s.trim());
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

function baseSlugForProfessional(p) {
  return slugify(`${p.name} ${p.city}`.trim()) || slugify(p.name) || `professional-${p.license_number}`;
}

function rowToRecord(row, { idPrefix, defaultState }) {
  const licenseNumber = (row.license_number ?? "").trim();
  if (!licenseNumber) return null;

  const licenseType = (row.type ?? row.license_type ?? "").toUpperCase().trim();
  const category = LICENSE_TYPE_TO_CATEGORY[licenseType] || null;
  if (!category) return null;

  const name = (row.name ?? row.full_name ?? "").trim();
  const city = (row.city ?? "").trim();
  const slugBase = baseSlugForProfessional({ name, city, license_number: licenseNumber });

  return {
    id: `${idPrefix}${licenseNumber}`,
    slug: `${slugBase}-${licenseNumber}`,
    name,
    category,
    license_number: licenseNumber,
    license_type: (row.type ?? row.license_type ?? "").trim(),
    company: (row.company ?? "").trim() || null,
    office_name: null,
    city: city || null,
    state: (row.state ?? defaultState).trim() || defaultState,
    zip: (row.zip ?? "").trim() || null,
    county: (row.county ?? "").trim() || null,
    licensed_since: (row.licensed_since ?? "").trim() || null,
    expires: (row.expires ?? "").trim() || null,
    disciplined: (row.disciplined ?? "").toUpperCase() === "Y",
    phone: null,
    email: null,
    website: null,
    rating: null,
    review_count: null,
    photo_url: null,
    source: "license",
  };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function upsertWithRetry(sb, batch, attempt = 1) {
  try {
    const { error } = await sb.from("licensed_professionals").upsert(batch, { onConflict: "id" });
    if (!error) return;

    // Retry on rate limits / transient issues
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

async function upsertInBatches(sb, rows, { batchSize, progressPath }) {
  let startIndex = 0;
  if (fs.existsSync(progressPath)) {
    try {
      const v = JSON.parse(fs.readFileSync(progressPath, "utf-8"));
      if (typeof v.nextIndex === "number") startIndex = v.nextIndex;
    } catch {}
  }

  let done = startIndex;
  const total = rows.length;

  for (let i = startIndex; i < total; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await upsertWithRetry(sb, batch);

    done = Math.min(i + batch.length, total);
    fs.writeFileSync(progressPath, JSON.stringify({ nextIndex: done, total }, null, 2));

    if (done % (batchSize * 10) === 0 || done === total) {
      process.stdout.write(`\rUpserted ${done.toLocaleString()} / ${total.toLocaleString()}...`);
    }
  }

  process.stdout.write("\n");
}

async function main() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

  const cwd = process.cwd();

  const sources = [];
  // Illinois
  sources.push({ filePath: path.join(cwd, "data", "idfpr", "real_estate_broker.csv"), idPrefix: "idfpr_", defaultState: "IL" });
  sources.push({ filePath: path.join(cwd, "data", "idfpr", "home_inspector.csv"), idPrefix: "idfpr_", defaultState: "IL" });

  // Extra states (normalized)
  const extra = [
    { dir: "texas", file: "normalized_brokers.csv", idPrefix: "trec_", defaultState: "TX" },
    { dir: "california", file: "normalized_brokers.csv", idPrefix: "dre_", defaultState: "CA" },
    { dir: "florida", file: "normalized_brokers.csv", idPrefix: "dbpr_", defaultState: "FL" },
    { dir: "new_york", file: "normalized_brokers.csv", idPrefix: "nydos_", defaultState: "NY" },
    { dir: "arizona", file: "normalized_brokers.csv", idPrefix: "adre_", defaultState: "AZ" },
    { dir: "colorado", file: "normalized_brokers.csv", idPrefix: "dora_", defaultState: "CO" },
    { dir: "connecticut", file: "normalized_brokers.csv", idPrefix: "ctdcp_", defaultState: "CT" },
    { dir: "utah", file: "normalized_brokers.csv", idPrefix: "utah_", defaultState: "UT" },
    { dir: "ut", file: "normalized_brokers.csv", idPrefix: "ut_", defaultState: "UT" },
    { dir: "nv", file: "normalized_brokers.csv", idPrefix: "nv_", defaultState: "NV" },
    { dir: "de", file: "normalized_brokers.csv", idPrefix: "de_", defaultState: "DE" },
    { dir: "or", file: "normalized_brokers.csv", idPrefix: "or_", defaultState: "OR" },
    { dir: "wv", file: "normalized_brokers.csv", idPrefix: "wv_", defaultState: "WV" },
  ];

  for (const e of extra) {
    sources.push({ filePath: path.join(cwd, "data", e.dir, e.file), idPrefix: e.idPrefix, defaultState: e.defaultState });
  }

  const records = [];
  const seen = new Set();

  for (const src of sources) {
    const rows = parseCSVFile(src.filePath);
    if (rows.length === 0) continue;
    for (const row of rows) {
      const rec = rowToRecord(row, src);
      if (rec && !seen.has(rec.id)) {
        seen.add(rec.id);
        records.push(rec);
      }
    }
  }

  console.log(`Prepared ${records.length.toLocaleString()} licensed professionals for import.`);

  // Smaller batches + resumable progress to survive network blips.
  const progressPath = path.join("/tmp", "supabase_licensed_import_progress.json");
  await upsertInBatches(sb, records, { batchSize: 200, progressPath });

  console.log("Done.");
  console.log(`Progress file: ${progressPath}`);
}

main().catch((err) => {
  console.error("\nImport failed:", err);
  process.exit(1);
});
