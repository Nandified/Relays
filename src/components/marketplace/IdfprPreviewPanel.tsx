"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { type UnclaimedProfessional } from "@/lib/types";

const categoryEmoji: Record<string, string> = {
  Realtor: "🏠",
  "Mortgage Lender": "🏦",
  Attorney: "⚖️",
  "Home Inspector": "🔍",
  "Insurance Agent": "🛡️",
};

export function IdfprPreviewPanel({ professional }: { professional: UnclaimedProfessional }) {
  const emoji = categoryEmoji[professional.category] ?? "📋";

  return (
    <Card padding="lg" glow className="border-dashed">
      {/* IDFPR Licensed banner */}
      <div className="mb-4 rounded-xl bg-violet-500/8 border border-violet-500/15 px-3 py-2.5">
        <div className="flex items-start gap-2">
          <svg width="16" height="16" fill="none" stroke="#8b5cf6" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-xs font-medium text-violet-400">IDFPR Licensed Professional</p>
            <p className="text-[11px] text-violet-400/70 mt-0.5">
              This professional hasn&apos;t claimed their Relays profile yet. License data from the Illinois DFPR.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] text-2xl opacity-60">
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold text-slate-100 opacity-80">{professional.name}</div>
          <div className="truncate text-sm text-slate-500">
            {professional.company !== professional.name ? professional.company : ""} {professional.city}, {professional.state}
          </div>
        </div>
      </div>

      {/* Rating (if enriched) */}
      {professional.rating && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} width="14" height="14" fill={star <= Math.round(professional.rating!) ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
                <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-medium text-slate-300">{professional.rating.toFixed(1)}</span>
          {professional.reviewCount && (
            <span className="text-xs text-slate-500">({professional.reviewCount} reviews)</span>
          )}
        </div>
      )}

      {/* Categories & badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="outline" className="opacity-70">{professional.category}</Badge>
        <Badge variant="default" className="opacity-60">
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-0.5">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          IDFPR Licensed
        </Badge>
        <Badge variant="warning" className="opacity-80">Unclaimed</Badge>
        {professional.disciplined && (
          <Badge variant="danger" className="opacity-80">Disciplined</Badge>
        )}
      </div>

      {/* License details */}
      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">License Details</h4>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="font-medium text-slate-400">Type</span>
            <span className="text-slate-300 text-right max-w-[60%]">{professional.licenseType}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-400">License #</span>
            <span className="text-slate-300 font-mono">{professional.licenseNumber}</span>
          </div>
          {professional.county && (
            <div className="flex justify-between">
              <span className="font-medium text-slate-400">County</span>
              <span className="text-slate-300">{professional.county}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium text-slate-400">Licensed Since</span>
            <span className="text-slate-300">{professional.licensedSince}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-400">Expires</span>
            <span className="text-slate-300">{professional.expires}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-400">Location</span>
            <span className="text-slate-300">{professional.city}, {professional.state} {professional.zip}</span>
          </div>
        </div>
      </div>

      {/* Contact info (if enriched) */}
      {(professional.phone || professional.email || professional.website) && (
        <div className="mt-3 space-y-1">
          {professional.phone && (
            <div className="text-xs text-slate-500">
              <span className="font-medium text-slate-400">Phone: </span>
              {professional.phone}
            </div>
          )}
          {professional.email && (
            <div className="text-xs text-slate-500">
              <span className="font-medium text-slate-400">Email: </span>
              {professional.email}
            </div>
          )}
          {professional.website && (
            <div className="text-xs text-slate-500">
              <span className="font-medium text-slate-400">Website: </span>
              <span className="text-blue-400/60">{professional.website.replace("https://", "")}</span>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="mt-4 grid gap-2">
        <Button variant="secondary" className="w-full">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Claim This Profile
        </Button>
        <p className="text-center text-[11px] text-slate-600">
          Is this you? Claim your free Relays profile to get referrals.
        </p>
      </div>
    </Card>
  );
}
