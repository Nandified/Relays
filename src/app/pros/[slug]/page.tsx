import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProBySlug } from "@/lib/mock-data";
import { getProfessionalBySlug } from "@/lib/idfpr-data";
import { type UnclaimedProfessional } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ClaimedProProfile } from "@/components/profiles/ClaimedProProfile";

export default async function ProProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1) Claimed Relays pros (mock/real members)
  const claimed = getProBySlug(slug);
  if (claimed) {
    return <ClaimedProProfile pro={claimed} />;
  }

  // 2) Unclaimed IDFPR professionals
  const unclaimed = getProfessionalBySlug(slug);
  if (unclaimed) {
    return <UnclaimedProfileTemplate professional={unclaimed} />;
  }

  notFound();
}

/* ── Unclaimed profile (consumer-friendly) ─────────────────────── */

function UnclaimedProfileTemplate({ professional }: { professional: UnclaimedProfessional }) {
  const initials = getInitials(professional.name);
  const location = [professional.city, professional.state].filter(Boolean).join(", ");

  const showRating =
    typeof professional.rating === "number" &&
    !Number.isNaN(professional.rating) &&
    typeof professional.reviewCount === "number";

  const serviceAreaParts = [
    [professional.city, professional.state].filter(Boolean).join(", "),
    professional.county ? `${professional.county} County` : null,
  ].filter(Boolean) as string[];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        ← Back to browsing
      </Link>

      <Card padding="lg" className="shadow-[var(--shadow-elevated)] glow-hover">
        <div className="flex items-start gap-4">
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
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-2xl font-bold text-slate-300">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-xl sm:text-2xl font-bold text-slate-100">{professional.name}</h1>
                <p className="mt-1 text-sm text-slate-500">
                  {professional.officeName || professional.company || "Independent professional"}
                </p>
              </div>

              <Link
                href="/pro/onboarding"
                className="text-xs text-slate-500 hover:text-slate-300 underline decoration-slate-700 hover:decoration-slate-500 underline-offset-4 whitespace-nowrap"
              >
                Are you {professional.name.split(" ")[0]}? Claim →
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="accent">{professional.category}</Badge>
              {location && <span className="text-xs text-slate-500">{location}</span>}
            </div>

            <div className="mt-3">
              {showRating ? (
                <div className="flex items-center gap-2">
                  <Stars rating={professional.rating ?? 0} />
                  <span className="text-sm font-semibold text-slate-300">{(professional.rating ?? 0).toFixed(1)}</span>
                  <span className="text-sm text-slate-500">({professional.reviewCount} reviews)</span>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No reviews yet</div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card padding="lg" className="mt-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-2">About</h2>
        <p className="text-sm text-slate-500 italic leading-relaxed">This professional hasn&apos;t added a bio yet.</p>
      </Card>

      <Card padding="lg" className="mt-4">
        <h2 className="text-sm font-semibold text-slate-200 mb-2">Service areas</h2>
        {serviceAreaParts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {serviceAreaParts.map((a) => (
              <Badge key={a} variant="outline">{a}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Service areas not listed.</p>
        )}
      </Card>

      <Card padding="lg" className="mt-4">
        <h2 className="text-sm font-semibold text-slate-200 mb-2">Reviews</h2>
        {showRating ? (
          <div className="flex items-center gap-2">
            <Stars rating={professional.rating ?? 0} size={14} />
            <span className="text-sm font-semibold text-slate-300">{(professional.rating ?? 0).toFixed(1)}</span>
            <span className="text-sm text-slate-500">({professional.reviewCount} reviews)</span>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No reviews yet</p>
        )}
      </Card>

      {(professional.phone || professional.website) && (
        <Card padding="lg" className="mt-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Contact</h2>
          <div className="space-y-3">
            {professional.phone && (
              <div className="flex items-center gap-3 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <a href={`tel:${professional.phone}`} className="text-blue-400 hover:underline">{professional.phone}</a>
              </div>
            )}
            {professional.website && (
              <div className="flex items-center gap-3 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                <a href={professional.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{professional.website}</a>
              </div>
            )}
          </div>
        </Card>
      )}
    </main>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */

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
