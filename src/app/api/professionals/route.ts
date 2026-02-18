import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const q = (sp.get("q") ?? "").trim();
  const category = (sp.get("category") ?? "").trim();
  const zip = (sp.get("zip") ?? "").trim();
  const limit = Math.min(parseInt(sp.get("limit") ?? "50", 10) || 50, 200);
  const offset = parseInt(sp.get("offset") ?? "0", 10) || 0;

  try {
    const sb = createServerSupabaseClient();

    let query = sb
      .from("licensed_professionals")
      .select(
        "id,slug,name,license_number,license_type,company,office_name,city,state,zip,county,licensed_since,expires,disciplined,category,claimed,claimed_by_pro_id,phone,email,website,rating,review_count,photo_url",
        { count: "exact" }
      );

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    // Zip narrowing only if query doesn't look like a name (same behavior as before)
    const queryHasName = q ? /[a-zA-Z]{2,}/.test(q) : false;
    if (zip && !queryHasName) {
      query = query.like("zip", `${zip}%`);
    }

    if (q) {
      // Search across name/company/city/license
      // Note: Supabase OR syntax
      const escaped = q.replace(/,/g, " ").trim();
      query = query.or(
        `name.ilike.%${escaped}%,company.ilike.%${escaped}%,city.ilike.%${escaped}%,license_number.ilike.%${escaped}%`
      );
    }

    query = query.order("name", { ascending: true }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    // Map DB fields to API contract expected by UI
    const mapped = (data ?? []).map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      licenseNumber: p.license_number ?? "",
      licenseType: p.license_type ?? "",
      company: p.company ?? "",
      officeName: p.office_name ?? null,
      city: p.city ?? "",
      state: p.state ?? "",
      zip: p.zip ?? "",
      county: p.county ?? "",
      licensedSince: p.licensed_since ?? "",
      expires: p.expires ?? "",
      disciplined: !!p.disciplined,
      category: p.category,
      claimed: !!p.claimed,
      claimedByProId: p.claimed_by_pro_id ?? null,
      phone: p.phone ?? null,
      email: p.email ?? null,
      website: p.website ?? null,
      rating: p.rating ?? null,
      reviewCount: p.review_count ?? null,
      photoUrl: p.photo_url ?? null,
    }));

    return NextResponse.json({
      data: mapped,
      total: count ?? mapped.length,
      limit,
      offset,
    });
  } catch (err: any) {
    // Fail soft in production UI; log for Vercel
    console.error("[/api/professionals] error:", err?.message ?? err);
    return NextResponse.json({ data: [], total: 0, limit, offset });
  }
}
