#!/usr/bin/env node
/**
 * Incremental backfill for `public_id` via SQL RPC (safe to run repeatedly).
 *
 * Requires the migration that defines:
 *   public.relays_backfill_public_id(batch_size int)
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/supabase/backfill_public_id.mjs --batch 5000
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const sb = createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });

  const batchSize = Math.min(Math.max(parseInt(arg("--batch", "5000"), 10) || 5000, 100), 50000);

  let total = 0;
  while (true) {
    const { data, error } = await sb.rpc("relays_backfill_public_id", { batch_size: batchSize });
    if (error) throw error;
    const n = typeof data === "number" ? data : 0;
    total += n;
    process.stdout.write(`\rbackfilled ${total.toLocaleString()} rows... (last batch ${n})`);
    if (n === 0) break;
    await sleep(250);
  }

  process.stdout.write("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
