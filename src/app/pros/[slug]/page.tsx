import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProBySlug } from "@/lib/mock-data";
import { getProfessionalBySlug } from "@/lib/idfpr-data";
import { type UnclaimedProfessional } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";

export default function ProProfilePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // 1) Claimed Relays pros
  const claimed = getProBySlug(slug);
  if (claimed) {
    const badgeVariantMap: Record<string, "success" | "accent" | "warning"> = {
      licensed: "success",
      insured: "success",
      "fast-response": "accent",
      partner: "accent",
      "top-rated": "warning",
    };

    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 mb-6">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Marketplace
        </Link>

        <Card padding="lg" className="shadow-[var(--shadow-elevated)] glow-hover">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)]">
              <Image src={claimed.headshotUrl} alt={claimed.name} width={80} height={80} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-100">{claimed.name}</h1>
                    {claimed.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{claimed.companyName}</p>
                </div>
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                  <Image src={claimed.companyLogoUrl} alt={claimed.companyName} width={48} height={48} />
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="16"
                      height="16"
                      fill={star <= Math.round(claimed.rating) ? "#f59e0b" : "#334155"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-300">{claimed.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-500">({claimed.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {claimed.badges.map((badge) => (
              <Badge key={badge.label} variant={badgeVariantMap[badge.type] ?? "default"}>
                {badge.type === "licensed" || badge.type === "insured" ? "✓ " : ""}
                {badge.label}
              </Badge>
            ))}
            {claimed.responseTimeMinutes && (
              <Badge variant="accent">
                ⚡ Responds in ~
                {claimed.responseTimeMinutes < 60
                  ? `${claimed.responseTimeMinutes}min`
                  : `${Math.round(claimed.responseTimeMinutes / 60)}hr`}
              </Badge>
            )}
          </div>

          {claimed.videoUrl === null && (
            <div className="mt-6">
              <div className="aspect-video rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/5 border border-[var(--border)] shadow-sm flex items-center justify-center">
                    <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Intro video coming soon</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">About</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{claimed.bio}</p>
          </div>

          {!claimed.verified && (
            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-400">Not yet verified</div>
                  <div className="text-xs text-slate-400 mt-0.5">This professional hasn&apos;t submitted their credentials yet.</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">Services</h2>
            <div className="flex flex-wrap gap-2">
              {claimed.categories.map((cat) => (
                <Badge key={cat} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">Service Areas</h2>
            <div className="flex flex-wrap gap-2">
              {claimed.serviceAreas
                .map((area) => (
                  <span key={area} className="text-sm text-slate-400">
                    {area}
                  </span>
                ))
                .reduce((acc: React.ReactNode[], el, i) => {
                  if (i > 0) acc.push(<span key={`sep-${i}`} className="text-slate-600">•</span>);
                  acc.push(el);
                  return acc;
                }, [])}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <SoftWallGate action="add_to_team" context={{ proSlug: claimed.slug, from: "profile" }}>
              {(_authed, begin) => (
                <Button size="lg" className="w-full" onClick={begin}>
                  Add to My Team
                </Button>
              )}
            </SoftWallGate>
            <SoftWallGate action="request_booking" context={{ proSlug: claimed.slug, from: "profile" }}>
              {(_authed, begin) => (
                <Link
                  href={`/book/${claimed.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    begin();
                  }}
                >
                  <Button variant="secondary" size="lg" className="w-full">
                    Request Booking
                  </Button>
                </Link>
              )}
            </SoftWallGate>
          </div>
        </Card>

        <Card padding="lg" className="mt-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Reviews</h2>
          <div className="space-y-4">
            {[
              {
                name: "Michael T.",
                rating: 5,
                text: "Thorough inspection and great communication. Highly recommend!",
                date: "2 weeks ago",
              },
              {
                name: "Sarah K.",
                rating: 5,
                text: "Very professional and detailed. Explained everything clearly.",
                date: "1 month ago",
              },
              {
                name: "David R.",
                rating: 4,
                text: "Good work overall. Report was comprehensive and delivered on time.",
                date: "2 months ago",
              },
            ].map((review) => (
              <div key={review.name} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/5 border border-[var(--border)] flex items-center justify-center text-xs font-medium text-slate-500">
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">{review.name}</div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} width="10" height="10" fill={s <= review.rating ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
                            <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-600">{review.date}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{review.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    );
  }

  // 2) Unclaimed IDFPR professionals
  const unclaimed = getProfessionalBySlug(slug);
  if (unclaimed) {
    return <UnclaimedProfileTemplate professional={unclaimed} />;
  }

  notFound();
}

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
                Are you {professional.name.split(" ")[0]}? Claim this profile →
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
              <Badge key={a} variant="outline">
                {a}
              </Badge>
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
                <a href={`tel:${professional.phone}`} className="text-blue-400 hover:underline">
                  {professional.phone}
                </a>
              </div>
            )}
            {professional.website && (
              <div className="flex items-center gap-3 text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-500">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                <a href={professional.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  {professional.website}
                </a>
              </div>
            )}
          </div>
        </Card>
      )}
    </main>
  );
}

function getInitials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
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
