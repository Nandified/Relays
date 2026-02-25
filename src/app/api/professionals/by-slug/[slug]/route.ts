import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

function deSlugify(s: string): string {
  return (s ?? "").replace(/-/g, " ").trim();
}

function parsePrettySlug(slug: string): { name?: string; city?: string; state?: string } | null {
  const parts = (slug ?? "").toLowerCase().split("-").filter(Boolean);
  if (parts.length < 3) return null;
  const state = parts[parts.length - 1];
  const city = parts[parts.length - 2];
  const name = parts.slice(0, -2).join(" ");
  if (!state || state.length !== 2) return null;
  return { name: deSlugify(name), city: deSlugify(city), state: state.toUpperCase() };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const sb = createServerSupabaseClient();

    const selectCols =
      "id,slug,name,license_number,license_type,company,office_name,city,state,zip,county,licensed_since,expires,disciplined,category,phone,email,website,rating,review_count,photo_url,google_place_id";

    // 1) FAST PATH: allow lookups by DB id (idfpr_..., google_...)
    const { data: byId, error: eId } = await sb
      .from("licensed_professionals")
      .select(selectCols)
      .eq("id", slug)
      .limit(1);
    if (eId) throw eId;

    let data = (byId ?? [])[0] ?? null;

    // 2) Try DB slug match (legacy)
    if (!data) {
      const { data: rows, error } = await sb
        .from("licensed_professionals")
        .select(selectCols)
        .or(`slug.eq.${slug},slug.ilike.${slug}-%`)
        .limit(5);

      if (error) throw error;

      data = (rows ?? [])[0] ?? null;
    }

    // 3) Try pretty slug (name-city-state)
    if (!data) {
      const parsed = parsePrettySlug(slug);
      if (parsed?.name && parsed?.city && parsed?.state) {
        const { data: rows2, error: error2 } = await sb
          .from("licensed_professionals")
          .select(
            selectCols
          )
          .ilike("name", `%${parsed.name}%`)
          .ilike("city", `%${parsed.city}%`)
          .eq("state", parsed.state)
          .limit(5);
        if (error2) throw error2;
        data = (rows2 ?? [])[0] ?? null;
      }
    }

    if (!data) return NextResponse.json({ error: "Professional not found" }, { status: 404 });

    const professional = {
      id: data.id,
      slug: data.slug,
      name: data.name,
      licenseNumber: data.license_number ?? "",
      licenseType: data.license_type ?? "",
      company: data.company ?? "",
      officeName: data.office_name ?? null,
      city: data.city ?? "",
      state: data.state ?? "",
      zip: data.zip ?? "",
      county: data.county ?? "",
      licensedSince: data.licensed_since ?? "",
      expires: data.expires ?? "",
      disciplined: !!data.disciplined,
      category: data.category,
      claimed: false,
      claimedByProId: null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      website: data.website ?? null,
      rating: data.rating ?? null,
      reviewCount: data.review_count ?? null,
      photoUrl: data.photo_url ?? null,
    };

    return NextResponse.json(professional);
  } catch (err: any) {
    console.error("[/api/professionals/by-slug] error:", err?.message ?? err);
    return NextResponse.json({ error: "Professional not found" }, { status: 404 });
  }
}
