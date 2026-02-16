import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Attempt Supabase session refresh + route protection.
  // Returns null when Supabase is not configured → pass through (mock mode).
  const supabaseResponse = await updateSession(request);
  if (supabaseResponse) return supabaseResponse;

  // Mock mode: pass everything through — no server-side auth enforcement.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
