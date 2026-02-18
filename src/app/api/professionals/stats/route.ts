import { NextResponse } from "next/server";
import { getProfessionalStats } from "@/lib/professional-data";
import { getLicensedStats } from "@/lib/license-data";
import { getGoogleProfessionalStats } from "@/lib/google-places-data";

export async function GET() {
  const stats = getProfessionalStats();

  // Build/version tag to confirm which commit is live on relays-psi.
  const buildTag = "37543af";

  // Source-level stats help diagnose missing bundled data on Vercel.
  const licensed = getLicensedStats();
  const google = getGoogleProfessionalStats();

  return NextResponse.json({
    ...stats,
    buildTag,
    sources: {
      licensed,
      google,
    },
  });
}
