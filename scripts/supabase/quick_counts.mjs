#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function main() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const sources = ["license", "google"]; // keep small/explicit
  const counts = {};
  for (const s of sources) {
    const { count, error } = await sb
      .from("licensed_professionals")
      .select("id", { count: "exact", head: true })
      .eq("source", s);
    if (error) throw error;
    counts[s] = count ?? 0;
  }
  console.log("counts_by_source", counts);

  const { count: withGp, error: e2 } = await sb
    .from("licensed_professionals")
    .select("id", { count: "exact", head: true })
    .not("google_place_id", "is", null);
  if (e2) throw e2;
  console.log("with_google_place_id", withGp);

  const { count: total, error: e3 } = await sb
    .from("licensed_professionals")
    .select("id", { count: "exact", head: true });
  if (e3) throw e3;
  console.log("total_rows", total);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
