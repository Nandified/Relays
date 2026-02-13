"use client";

import { Card } from "@/components/ui/Card";
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
        {professional.photoUrl ? (
          <img
            src={professional.photoUrl}
            alt={professional.name}
            className="h-14 w-14 rounded-2xl border border-[var(--border)] object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] text-2xl opacity-60">
            {emoji}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold text-slate-100 opacity-80">{professional.name}</div>
          <div className="truncate text-sm text-slate-500">
            {professional.officeName || (professional.company !== professional.name ? professional.company : "")} {professional.city}, {professional.state}
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
      </div>

      {/* Location & service area */}
      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Service Area</h4>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0 opacity-60">
            <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
          </svg>
          <span className="text-slate-300">
            {professional.city}, {professional.state} {professional.zip}
            {professional.county ? ` · ${professional.county} County` : ""}
          </span>
        </div>
      </div>

      {/* Contact info (if enriched) */}
      {(professional.phone || professional.email || professional.website) && (
        <div className="mt-3 space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contact</h4>
          {professional.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0 opacity-60">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="text-slate-300">{professional.phone}</span>
            </div>
          )}
          {professional.website && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0 opacity-60">
                <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <a href={professional.website} target="_blank" rel="noopener noreferrer" className="text-blue-400/80 hover:text-blue-400 truncate">
                {professional.website.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Subtle claim link */}
      <div className="mt-5 pt-3 border-t border-[var(--border)]">
        <a href="/pro/onboarding" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
          Are you {professional.name.split(" ")[0]}? <span className="underline underline-offset-2">Claim this profile</span> →
        </a>
      </div>
    </Card>
  );
}
