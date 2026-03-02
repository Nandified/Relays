/*
  Seed canonical access accounts + org membership for Relays.

  Usage:
    node --env-file .env.local scripts/supabase/seed_access_accounts.mjs

  Notes:
  - Uses SUPABASE_SERVICE_ROLE_KEY (never log it).
  - Creates users if missing, confirms email, sets a temporary password.
  - Ensures profiles.role is correct (DB-backed).
  - Creates one org + memberships.
*/

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const ACCOUNTS = [
  {
    email: "Rocha.Fernando@ymail.com",
    role: "pro",
    label: "Individual Pro",
    tempPassword: "RelaysTemp!2026-Pro",
  },
  {
    email: "Jr.rocha.Fernando@gmail.com",
    role: "pro",
    label: "Office/Team Owner",
    tempPassword: "RelaysTemp!2026-Office",
  },
  {
    email: "leads@TheFRJgroup.com",
    role: "admin",
    label: "Admin",
    tempPassword: "RelaysTemp!2026-Admin",
  },
  {
    email: "clawdboulder@gmail.com",
    role: "consumer",
    label: "Home Buyer/Seller",
    tempPassword: "RelaysTemp!2026-Consumer",
  },
];

async function findUserByEmail(email) {
  // Supabase doesn't have a direct getByEmail, so list and filter.
  // For small user counts this is fine.
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    const found = users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (users.length < perPage) return null;
    page += 1;
  }
}

async function profilesTableExists() {
  // Cheap existence check: select 1 row.
  const { error } = await sb.from("profiles").select("id").limit(1);
  return !error;
}

async function ensureUser({ email, role, tempPassword }) {
  const hasProfiles = await profilesTableExists();

  const existing = await findUserByEmail(email);
  if (existing) {
    // Ensure email confirmed + password set
    await sb.auth.admin.updateUserById(existing.id, {
      email_confirm: true,
      password: tempPassword,
      user_metadata: {
        ...(existing.user_metadata ?? {}),
        role, // stored for convenience; DB role is source of truth when available
      },
    });

    if (hasProfiles) {
      const { error: upErr } = await sb.from("profiles").update({ role }).eq("id", existing.id);
      if (upErr) throw upErr;
    }

    return { id: existing.id, created: false, hasProfiles };
  }

  const { data, error } = await sb.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { role },
  });
  if (error) throw error;
  const user = data?.user;
  if (!user?.id) throw new Error(`Failed to create user for ${email}`);

  if (hasProfiles) {
    const { error: upErr } = await sb.from("profiles").update({ role }).eq("id", user.id);
    if (upErr) throw upErr;
  }

  return { id: user.id, created: true, hasProfiles };
}

async function ensureOrg({ name, slug }) {
  const { data: existing, error: e1 } = await sb
    .from("orgs")
    .select("id,name,slug")
    .eq("slug", slug)
    .maybeSingle();
  if (e1) throw e1;
  if (existing?.id) return existing;

  const { data, error } = await sb
    .from("orgs")
    .insert({ name, slug })
    .select("id,name,slug")
    .single();
  if (error) throw error;
  return data;
}

async function ensureMembership({ orgId, userId, memberRole }) {
  const { data: existing, error: e1 } = await sb
    .from("org_memberships")
    .select("id,org_id,user_id,member_role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .maybeSingle();
  if (e1) throw e1;
  if (existing?.id) {
    if (existing.member_role !== memberRole) {
      const { error: e2 } = await sb
        .from("org_memberships")
        .update({ member_role: memberRole })
        .eq("id", existing.id);
      if (e2) throw e2;
    }
    return;
  }

  const { error } = await sb
    .from("org_memberships")
    .insert({ org_id: orgId, user_id: userId, member_role: memberRole });
  if (error) throw error;
}

async function main() {
  console.log("Seeding access accounts (no secrets logged)...");

  const createdUsers = {};

  for (const acct of ACCOUNTS) {
    const res = await ensureUser(acct);
    createdUsers[acct.email] = res.id;
    console.log(`- ${acct.label}: ${acct.email} (${res.created ? "created" : "updated"})`);
  }

  // Create org and memberships (only if org tables exist)
  const { error: orgsErr } = await sb.from("orgs").select("id").limit(1);
  const orgTablesExist = !orgsErr;

  if (orgTablesExist) {
    const org = await ensureOrg({ name: "The FRJ Group", slug: "the-frj-group" });
    console.log(`- Org ensured: ${org.name} (${org.slug})`);

    // Office owner
    await ensureMembership({
      orgId: org.id,
      userId: createdUsers["Jr.rocha.Fernando@gmail.com"],
      memberRole: "owner",
    });

    // Admin can also be org admin if desired (optional). We'll add as admin.
    await ensureMembership({
      orgId: org.id,
      userId: createdUsers["leads@TheFRJgroup.com"],
      memberRole: "admin",
    });
  } else {
    console.log("- Org tables not found in Supabase. Apply migrations, then re-run this script to create org + memberships.");
  }

  console.log("Done.");
  console.log("Temporary passwords were set. You can switch to magic-link-only any time.");
}

main().catch((e) => {
  console.error("seed_access_accounts failed:", e?.message ?? e);
  process.exit(1);
});
