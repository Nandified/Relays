import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProBySlug } from "@/lib/mock-data";
import { getProfessionalBySlug } from "@/lib/professional-data";
import { type UnclaimedProfessional } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ClaimedProProfile } from "@/components/profiles/ClaimedProProfile";
import { UnclaimedClaimButton } from "@/components/profiles/UnclaimedClaimButton";

export default async function ProProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1) Claimed Relays pros (mock/real members)
  const claimed = getProBySlug(slug);
  if (claimed) {
    return <ClaimedProProfile pro={claimed} />;
  }

  // 2) Unclaimed license database professionals
  const unclaimed = getProfessionalBySlug(slug);
  if (unclaimed) {
    return <UnclaimedProfileTemplate professional={unclaimed} />;
  }

  notFound();
}

/* ── Unclaimed profile — same layout as claimed, with placeholders ── */

function UnclaimedProfileTemplate({ professional }: { professional: UnclaimedProfessional }) {
  const initials = getInitials(professional.name);

  const showRating =
    typeof professional.rating === "number" &&
    !Number.isNaN(professional.rating) &&
    typeof professional.reviewCount === "number";

  const googlePlaceId = (professional as { googlePlaceId?: string | null }).googlePlaceId ?? null;
  const googleMapsUrl = googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`
    : null;

  const serviceAreaParts = [
    professional.city,
    professional.county ? `${professional.county} County` : null,
  ].filter(Boolean) as string[];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Marketplace
      </Link>

      {/* Main profile card — matches claimed pro layout */}
      <Card padding="lg" className="shadow-[var(--shadow-elevated)] glow-hover">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            {professional.photoUrl ? (
              <Image
                src={professional.photoUrl}
                alt={professional.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-2xl font-bold text-slate-700 dark:text-slate-300">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{professional.name}</h1>
                <p className="text-sm text-slate-600 dark:text-slate-500">
                  {professional.officeName || professional.company || "Independent professional"}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              {showRating ? (
                <>
                  <Stars rating={professional.rating ?? 0} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{(professional.rating ?? 0).toFixed(1)}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-500">({professional.reviewCount} reviews)</span>
                  <GoogleG className="opacity-60" />
                </>
              ) : (
                <span className="text-sm text-slate-600 dark:text-slate-500">No reviews yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Category badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">{professional.category}</Badge>
          {professional.city && (
            <Badge variant="default">
              📍 {professional.city}, {professional.state}
            </Badge>
          )}
        </div>

        {/* About */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">About</h2>
          <p className="text-sm text-slate-600 dark:text-slate-500 italic leading-relaxed">This professional hasn&apos;t added a bio yet.</p>
        </div>

        {/* Services */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Services</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{professional.category}</Badge>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Service Areas</h2>
          {serviceAreaParts.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {serviceAreaParts.map((area, i) => (
                <span key={area}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{area}</span>
                  {i < serviceAreaParts.length - 1 && <span className="text-slate-500 dark:text-slate-500 ml-2">•</span>}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-500">Service areas not listed.</p>
          )}
        </div>

        {/* Contact — inline if available */}
        {(professional.phone || professional.website) && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Contact</h2>
            <div className="space-y-2">
              {professional.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-600 dark:text-slate-500">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <a href={`tel:${professional.phone}`} className="text-blue-400 hover:underline">{professional.phone}</a>
                </div>
              )}
              {professional.website && (
                <div className="flex items-center gap-3 text-sm">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-600 dark:text-slate-500">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                  <a href={professional.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{professional.website}</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subtle claim — only visible to pros who recognize themselves */}
        <div className="mt-8 pt-4 border-t border-[var(--border)]">
          <UnclaimedClaimButton professional={professional} />
        </div>
      </Card>

      {/* Reviews card — matches claimed layout */}
      <Card padding="lg" className="mt-6">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Reviews</h2>
        {showRating ? (
          <div className="flex items-center gap-2">
            <Stars rating={professional.rating ?? 0} size={14} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{(professional.rating ?? 0).toFixed(1)}</span>
            <span className="text-sm text-slate-600 dark:text-slate-500">({professional.reviewCount} reviews)</span>

            {googleMapsUrl ? (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <GoogleG className="opacity-60" />
                <span>Google Reviews</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-500">
                <GoogleG className="opacity-60" />
                <span>Google Reviews</span>
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-500">No reviews yet</p>
        )}
      </Card>
    </main>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */

/* Tiny inline Google "G" logo */
function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" className={className} aria-label="Google reviews">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function getInitials(name: string): string {
  return name.split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} fill={star <= Math.round(rating) ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
          <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
        </svg>
      ))}
    </div>
  );
}
