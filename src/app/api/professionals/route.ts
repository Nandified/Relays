import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const q = (sp.get("q") ?? "").trim();
  const category = (sp.get("category") ?? "").trim();
  const zip = (sp.get("zip") ?? "").trim();
  const limit = Math.min(parseInt(sp.get("limit") ?? "50", 10) || 50, 200);
  const offset = parseInt(sp.get("offset") ?? "0", 10) || 0;

  const debug = sp.get("debug") === "1";

  try {
    const sb = createServerSupabaseClient();

    let query = sb
      .from("licensed_professionals")
      .select(
        "id,slug,name,license_number,license_type,company,office_name,city,state,zip,county,licensed_since,expires,disciplined,category,phone,email,website,rating,review_count,photo_url",
        { count: "exact" }
      );

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    // If user provides a zip, keep results local (even during name search).
    // This prevents cases like "Fernando" matching "San Fernando, CA" when user is in IL.
    if (zip) {
      query = query.like("zip", `${zip}%`);
    }

    if (q) {
      // Search primarily by name (and secondarily by license number/company).
      // Avoid city matching in suggestions ("San Fernando") which feels wrong.
      const escaped = q.replace(/,/g, " ").trim();
      query = query.or(
        `name.ilike.%${escaped}%,license_number.ilike.%${escaped}%,company.ilike.%${escaped}%`
      );

      // Prefer starts-with matches for snappier, more intuitive results.
      // (PostgREST can't easily do CASE ordering without a SQL function; we approximate by ordering name asc.)
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
      claimed: false,
      claimedByProId: null,
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

    if (debug) {
      return NextResponse.json({
        data: [],
        total: 0,
        limit,
        offset,
        debug: {
          message: err?.message ?? String(err),
          name: err?.name ?? null,
        },
      });
    }

    return NextResponse.json({ data: [], total: 0, limit, offset });
  }
}
