"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProBySlug } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";

export default function ProProfilePage() {
  const params = useParams<{ slug: string }>();
  const pro = getProBySlug(params.slug);

  if (!pro) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Professional not found</h1>
        <p className="mt-2 text-sm text-slate-600">This profile doesn&apos;t exist or has been removed.</p>
        <Link href="/marketplace" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
          ← Back to Marketplace
        </Link>
      </main>
    );
  }

  const badgeVariantMap: Record<string, "success" | "accent" | "warning"> = {
    licensed: "success",
    insured: "success",
    "fast-response": "accent",
    partner: "accent",
    "top-rated": "warning",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* Back link */}
      <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Marketplace
      </Link>

      {/* Profile header card */}
      <Card padding="lg" className="shadow-[var(--shadow-elevated)]">
        <div className="flex items-start gap-4">
          {/* Headshot */}
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-slate-50">
            <Image src={pro.headshotUrl} alt={pro.name} width={80} height={80} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{pro.name}</h1>
                <p className="text-sm text-slate-500">{pro.companyName}</p>
              </div>
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
                <Image src={pro.companyLogoUrl} alt={pro.companyName} width={48} height={48} />
              </div>
            </div>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="16" height="16" fill={star <= Math.round(pro.rating) ? "#f59e0b" : "#e5e7eb"} viewBox="0 0 20 20">
                    <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700">{pro.rating.toFixed(1)}</span>
              <span className="text-sm text-slate-500">({pro.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {pro.badges.map((badge) => (
            <Badge key={badge.label} variant={badgeVariantMap[badge.type] ?? "default"}>
              {badge.type === "licensed" || badge.type === "insured" ? "✓ " : ""}
              {badge.label}
            </Badge>
          ))}
          {pro.responseTimeMinutes && (
            <Badge variant="accent">
              ⚡ Responds in ~{pro.responseTimeMinutes < 60 ? `${pro.responseTimeMinutes}min` : `${Math.round(pro.responseTimeMinutes / 60)}hr`}
            </Badge>
          )}
        </div>

        {/* Bio */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-2">About</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{pro.bio}</p>
        </div>

        {/* Video placeholder */}
        {pro.videoUrl === null && (
          <div className="mt-6">
            <div className="aspect-video rounded-2xl bg-slate-100 border border-[var(--border)] flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <svg width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <p className="mt-2 text-xs text-slate-400">Intro video coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-2">Services</h2>
          <div className="flex flex-wrap gap-2">
            {pro.categories.map((cat) => (
              <Badge key={cat} variant="outline">{cat}</Badge>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-2">Service Areas</h2>
          <div className="flex flex-wrap gap-2">
            {pro.serviceAreas.map((area) => (
              <span key={area} className="text-sm text-slate-600">{area}</span>
            )).reduce((acc: React.ReactNode[], el, i) => {
              if (i > 0) acc.push(<span key={`sep-${i}`} className="text-slate-300">•</span>);
              acc.push(el);
              return acc;
            }, [])}
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <SoftWallGate action="add_to_team" context={{ proSlug: pro.slug, from: "profile" }}>
            {(_authed, begin) => (
              <Button size="lg" className="w-full" onClick={begin}>
                Add to My Team
              </Button>
            )}
          </SoftWallGate>
          <SoftWallGate action="request_booking" context={{ proSlug: pro.slug, from: "profile" }}>
            {(_authed, begin) => (
              <Link href={`/book/${pro.slug}`} onClick={(e) => { e.preventDefault(); begin(); }}>
                <Button variant="secondary" size="lg" className="w-full">
                  Request Booking
                </Button>
              </Link>
            )}
          </SoftWallGate>
        </div>
      </Card>

      {/* Reviews placeholder */}
      <Card padding="lg" className="mt-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Reviews</h2>
        <div className="space-y-4">
          {[
            { name: "Michael T.", rating: 5, text: "Thorough inspection and great communication. Highly recommend!", date: "2 weeks ago" },
            { name: "Sarah K.", rating: 5, text: "Very professional and detailed. Explained everything clearly.", date: "1 month ago" },
            { name: "David R.", rating: 4, text: "Good work overall. Report was comprehensive and delivered on time.", date: "2 months ago" },
          ].map((review) => (
            <div key={review.name} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
                    {review.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{review.name}</div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} width="10" height="10" fill={s <= review.rating ? "#f59e0b" : "#e5e7eb"} viewBox="0 0 20 20">
                          <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{review.date}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{review.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
