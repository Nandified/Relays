import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const sb = createServerSupabaseClient();
    const { data, error } = await sb
      .from("licensed_professionals")
      .select(
        "id,slug,name,license_number,license_type,company,office_name,city,state,zip,county,licensed_since,expires,disciplined,category,claimed,claimed_by_pro_id,phone,email,website,rating,review_count,photo_url"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Professional not found" }, { status: 404 });

    // Map to API contract
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
      claimed: !!data.claimed,
      claimedByProId: data.claimed_by_pro_id ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      website: data.website ?? null,
      rating: data.rating ?? null,
      reviewCount: data.review_count ?? null,
      photoUrl: data.photo_url ?? null,
    };

    return NextResponse.json(professional);
  } catch (err: any) {
    console.error("[/api/professionals/[id]] error:", err?.message ?? err);
    return NextResponse.json({ error: "Professional not found" }, { status: 404 });
  }
}
