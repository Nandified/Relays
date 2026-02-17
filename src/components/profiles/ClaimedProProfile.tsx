"use client";

import Link from "next/link";
import Image from "next/image";
import { type Pro } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";
import { ProIntroVideoPlayer } from "@/components/video/ProIntroVideoPlayer";
import { ProReviewsSection } from "@/components/reviews/ProReviewsSection";
import { getReviewsForPro, getReviewStatsForPro } from "@/lib/mock-reviews";

const badgeVariantMap: Record<string, "success" | "accent" | "warning"> = {
  licensed: "success",
  insured: "success",
  "fast-response": "accent",
  partner: "accent",
  "top-rated": "warning",
};

export function ClaimedProProfile({ pro }: { pro: Pro }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Marketplace
      </Link>

      <Card padding="lg" className="shadow-[var(--shadow-elevated)] glow-hover">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image src={pro.headshotUrl} alt={pro.name} width={80} height={80} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{pro.name}</h1>
                  {pro.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-500">{pro.companyName}</p>
              </div>
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                <Image src={pro.companyLogoUrl} alt={pro.companyName} width={48} height={48} />
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="16" height="16" fill={star <= Math.round(pro.rating) ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
                    <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{pro.rating.toFixed(1)}</span>
              <span className="text-sm text-slate-600 dark:text-slate-500">({pro.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

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

        {/* Intro Video — shown ABOVE About per v19 spec */}
        {pro.introVideoUrl ? (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Intro Video</h2>
            <ProIntroVideoPlayer videoUrl={pro.introVideoUrl} proName={pro.name} />
          </div>
        ) : (
          <div className="mt-6">
            <div className="aspect-video rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border)] shadow-sm flex items-center justify-center">
                  <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-500">Intro video coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Social links */}
        {pro.socialLinks && Object.values(pro.socialLinks).some(Boolean) && (
          <div className="mt-5 flex items-center gap-3">
            {pro.socialLinks.instagram && (
              <a href={`https://instagram.com/${pro.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-500 hover:text-pink-400 transition-colors" title="Instagram">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
            {pro.socialLinks.linkedin && (
              <a href={`https://linkedin.com/in/${pro.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-500 hover:text-blue-500 dark:text-blue-400 transition-colors" title="LinkedIn">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
            {pro.socialLinks.facebook && (
              <a href={`https://facebook.com/${pro.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-500 hover:text-blue-500 transition-colors" title="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
            {pro.socialLinks.tiktok && (
              <a href={`https://tiktok.com/@${pro.socialLinks.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" title="TikTok">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            )}
            {pro.socialLinks.youtube && (
              <a href={`https://youtube.com/@${pro.socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-500 hover:text-red-500 transition-colors" title="YouTube">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">About</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{pro.bio}</p>
        </div>

        {/* Specialties */}
        {pro.specialties && pro.specialties.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Specialties</h2>
            <div className="flex flex-wrap gap-1.5">
              {pro.specialties.map((s) => (
                <Badge key={s} variant="accent">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {!pro.verified && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-amber-400">Not yet verified</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">This professional hasn&apos;t submitted their credentials yet.</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Services</h2>
          <div className="flex flex-wrap gap-2">
            {pro.categories.map((cat) => (
              <Badge key={cat} variant="outline">{cat}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Service Areas</h2>
          <div className="flex flex-wrap gap-2">
            {pro.serviceAreas.map((area, i) => (
              <span key={area}>
                <span className="text-sm text-slate-600 dark:text-slate-400">{area}</span>
                {i < pro.serviceAreas.length - 1 && <span className="text-slate-500 dark:text-slate-500 ml-2">•</span>}
              </span>
            ))}
          </div>
        </div>

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
              <Link
                href={`/book/${pro.slug}`}
                onClick={(e) => { e.preventDefault(); begin(); }}
              >
                <Button variant="secondary" size="lg" className="w-full">
                  Request Booking
                </Button>
              </Link>
            )}
          </SoftWallGate>
        </div>
      </Card>

      {/* Reviews Section */}
      <div className="mt-6">
        <ProReviewsSection
          reviews={getReviewsForPro(pro.id)}
          stats={getReviewStatsForPro(pro.id)}
          proSlug={pro.slug}
        />
      </div>
    </main>
  );
}
