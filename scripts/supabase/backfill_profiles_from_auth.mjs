/*
  Backfill public.profiles rows for existing auth.users.

  Usage:
    node --env-file .env.local scripts/supabase/backfill_profiles_from_auth.mjs
*/

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function listAllUsers() {
  let page = 1;
  const perPage = 200;
  const all = [];
  while (true) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    all.push(...users);
    if (users.length < perPage) break;
    page += 1;
  }
  return all;
}

function pickRole(u) {
  const meta = u.user_metadata ?? {};
  return meta.role ?? "consumer";
}

function pickName(u) {
  const meta = u.user_metadata ?? {};
  const email = u.email ?? "";
  return meta.display_name ?? meta.full_name ?? meta.name ?? (email.includes("@")==true ? email.split("@")[0] : "");
}

async function main() {
  console.log("Backfilling profiles from auth.users...");
  const users = await listAllUsers();
  console.log(`- Users found: ${users.length}`);

  let created = 0;
  let skipped = 0;

  for (const u of users) {
    if (!u.id || !u.email) continue;

    const { data: existing, error: e1 } = await sb.from("profiles").select("id").eq("id", u.id).maybeSingle();
    if (e1) throw e1;

    if (existing?.id) {
      skipped += 1;
      continue;
    }

    const row = {
      id: u.id,
      email: u.email,
      role: pickRole(u),
      display_name: pickName(u),
      avatar_url: (u.user_metadata ?? {}).avatar_url ?? null,
    };

    const { error: e2 } = await sb.from("profiles").insert(row);
    if (e2) throw e2;
    created += 1;
  }

  console.log(`- Profiles created: ${created}`);
  console.log(`- Profiles already existed: ${skipped}`);
  console.log("Done.");
}

main().catch((e) => {
  console.error("backfill_profiles_from_auth failed:", e?.message ?? e);
  process.exit(1);
});
