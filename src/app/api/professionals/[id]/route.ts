import { NextRequest, NextResponse } from "next/server";
import { getProfessionalById } from "@/lib/professional-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const professional = getProfessionalById(id);

  if (!professional) {
    return NextResponse.json({ error: "Professional not found" }, { status: 404 });
  }

  return NextResponse.json(professional);
}
