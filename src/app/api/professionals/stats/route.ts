import { NextResponse } from "next/server";
import { getProfessionalStats } from "@/lib/idfpr-data";

export async function GET() {
  const stats = getProfessionalStats();
  return NextResponse.json(stats);
}
