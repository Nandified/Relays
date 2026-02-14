import { NextRequest, NextResponse } from "next/server";
import { getProfessionalBySlug } from "@/lib/professional-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const professional = getProfessionalBySlug(slug);

  if (!professional) {
    return NextResponse.json({ error: "Professional not found" }, { status: 404 });
  }

  return NextResponse.json(professional);
}
