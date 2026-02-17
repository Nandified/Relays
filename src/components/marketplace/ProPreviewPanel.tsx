"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { type Pro } from "@/lib/types";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";

export function ProPreviewPanel({ pro }: { pro: Pro }) {
  return (
    <Card padding="lg" glow>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          <Image src={pro.headshotUrl} alt={pro.name} width={56} height={56} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{pro.name}</div>
          <div className="truncate text-sm text-slate-600 dark:text-slate-400">{pro.companyName}</div>
        </div>
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          <Image src={pro.companyLogoUrl} alt={pro.companyName} width={40} height={40} />
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} width="14" height="14" fill={star <= Math.round(pro.rating) ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
              <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pro.rating.toFixed(1)}</span>
        <span className="text-xs text-slate-600 dark:text-slate-400">({pro.reviewCount} reviews)</span>
      </div>

      {/* Blurb */}
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{pro.blurb}</p>

      {/* Categories & badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {pro.categories.map((c) => (
          <Badge key={c} variant="outline">{c}</Badge>
        ))}
        {pro.badges.slice(0, 2).map((b) => (
          <Badge key={b.label} variant="accent">{b.label}</Badge>
        ))}
        {pro.verified && (
          <Badge variant="success">✓ Verified</Badge>
        )}
      </div>

      {/* Service areas */}
      <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
        <span className="font-medium text-slate-600 dark:text-slate-400">Service areas: </span>
        {pro.serviceAreas.join(", ")}
      </div>

      {/* CTAs */}
      <div className="mt-4 grid gap-2">
        <Link href={`/pros/${pro.slug}`}>
          <Button variant="secondary" className="w-full">View Full Profile</Button>
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <SoftWallGate action="add_to_team" context={{ proSlug: pro.slug, from: "marketplace" }}>
            {(_authed, begin) => (
              <Button className="w-full" onClick={begin}>
                Add to Team
              </Button>
            )}
          </SoftWallGate>
          <SoftWallGate action="request_booking" context={{ proSlug: pro.slug, from: "marketplace" }}>
            {(_authed, begin) => (
              <Button variant="secondary" className="w-full" onClick={begin}>
                Book
              </Button>
            )}
          </SoftWallGate>
        </div>
      </div>
    </Card>
  );
}
