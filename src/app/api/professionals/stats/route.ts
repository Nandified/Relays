import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const sb = createServerSupabaseClient();

    const { count, error } = await sb
      .from("licensed_professionals")
      .select("id", { count: "exact", head: true });

    if (error) throw error;

    return NextResponse.json({
      total: count ?? 0,
      byCategory: {},
      lastLoaded: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[/api/professionals/stats] error:", err?.message ?? err);
    return NextResponse.json({
      total: 0,
      byCategory: {},
      lastLoaded: new Date().toISOString(),
    });
  }
}
