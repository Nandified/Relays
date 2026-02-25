import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

function slugify(s: string): string {
  return (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function prettyProSlug(p: { name?: string | null; city?: string | null; state?: string | null }): string {
  const name = slugify(p.name ?? "");
  const city = slugify(p.city ?? "");
  const state = slugify(p.state ?? "");
  if (name && city && state) return `${name}-${city}-${state}`;
  if (name && state) return `${name}-${state}`;
  return name || "";
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const q = (sp.get("q") ?? "").trim();
  const category = (sp.get("category") ?? "").trim();
  const zip = (sp.get("zip") ?? "").trim();
  const limit = Math.min(parseInt(sp.get("limit") ?? "50", 10) || 50, 200);
  const offset = parseInt(sp.get("offset") ?? "0", 10) || 0;

  // We intentionally avoid COUNT(*) for typeahead/search because it is slow at scale.
  // Instead, we fetch one extra row to determine hasMore.
  const pageEnd = offset + limit; // inclusive end for range() (fetches limit+1 rows)

  const debug = sp.get("debug") === "1";

  try {
    const sb = createServerSupabaseClient();

    // NOTE: no COUNT(*) here — it kills perceived performance for search-as-you-type.
    let query = sb
      .from("licensed_professionals")
      .select(
        "id,public_id,slug,name,license_number,license_type,company,office_name,city,state,zip,county,licensed_since,expires,disciplined,category,phone,email,website,rating,review_count,photo_url"
      );

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const escaped = q ? q.replace(/,/g, " ").trim() : "";

    // Build a base query builder function so we can optionally prefer local zip matches
    // WITHOUT locking out results for name searches.
    const build = (useZip: boolean) => {
      let qb = sb
        .from("licensed_professionals")
        .select(
          "id,public_id,slug,name,license_number,license_type,company,office_name,city,state,zip,county,licensed_since,expires,disciplined,category,phone,email,website,rating,review_count,photo_url"
        );

      if (category && category !== "All") {
        qb = qb.eq("category", category);
      }

      if (useZip && zip) {
        const z = zip.trim();
        // If we have a full 5-digit zip, use equality (fast, index-friendly).
        // For partial zips, keep prefix matching.
        if (/^\d{5}$/.test(z)) {
          qb = qb.eq("zip", z);
        } else {
          qb = qb.like("zip", `${z}%`);
        }
      }

      if (q) {
        // Search primarily by name (and secondarily by license number/company).
        // Avoid city matching in suggestions ("San Fernando") which feels wrong.
        qb = qb.or(`name.ilike.%${escaped}%,license_number.ilike.%${escaped}%,company.ilike.%${escaped}%`);
      }

      return qb.order("name", { ascending: true });
    };

    let data: any[] = [];
    let hasMore = false;
    let total: number | null = null; // we avoid COUNT(*) by default; reserved for future

    if (q && zip) {
      // Prefer local matches first, but fall back to global results to avoid empty searches.
      const { data: d1, error: e1 } = await build(true).range(offset, pageEnd);
      if (e1) throw e1;
      data = d1 ?? [];

      // If local results are insufficient, merge in global results.
      if (data.length < limit + 1) {
        const { data: d2, error: e2 } = await build(false).range(offset, pageEnd);
        if (e2) throw e2;

        // Merge + de-dupe by id
        const seen = new Set((data ?? []).map((r: any) => r.id));
        for (const r of d2 ?? []) {
          if (!seen.has(r.id)) {
            data.push(r);
            seen.add(r.id);
          }
          if (data.length >= limit + 1) break;
        }
      }

      hasMore = data.length > limit;
      data = data.slice(0, limit);
    } else {
      const { data: d, error } = await build(!!zip).range(offset, pageEnd);
      if (error) throw error;
      data = d ?? [];

      hasMore = data.length > limit;
      data = data.slice(0, limit);
    }

    // Map DB fields to API contract expected by UI
    const mapped = (data ?? []).map((p: any) => ({
      id: p.id,
      publicId: p.public_id ?? null,
      // Use a nicer SEO/share slug (no license #). We still resolve legacy DB slugs server-side.
      slug: prettyProSlug(p),
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

    return NextResponse.json(
      {
        data: mapped,
        // total is intentionally omitted/nullable to keep search fast at scale.
        total,
        hasMore,
        limit,
        offset,
      },
      {
        headers: {
          // Cache at the edge to make typeahead feel instant.
          // Response is not user-specific.
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: any) {
    // Fail soft in production UI; log for Vercel
    console.error("[/api/professionals] error:", err?.message ?? err);

    if (debug) {
      return NextResponse.json({
        data: [],
        total: 0,
        hasMore: false,
        limit,
        offset,
        debug: {
          message: err?.message ?? String(err),
          name: err?.name ?? null,
        },
      });
    }

    return NextResponse.json({ data: [], total: 0, hasMore: false, limit, offset });
  }
}
