import { NextRequest, NextResponse } from "next/server";
import { searchAllProfessionals } from "@/lib/professional-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const city = searchParams.get("city") ?? undefined;
  const zip = searchParams.get("zip") ?? undefined;
  const county = searchParams.get("county") ?? undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 50;
  const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!, 10) : 0;

  const result = searchAllProfessionals({ q, category, city, zip, county, limit, offset });

  return NextResponse.json(result);
}
