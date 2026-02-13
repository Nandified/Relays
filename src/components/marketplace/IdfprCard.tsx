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

export function IdfprCard({
  professional,
  selected,
  onSelect,
}: {
  professional: UnclaimedProfessional;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const emoji = categoryEmoji[professional.category] ?? "📋";

  return (
    <button className="w-full text-left" onClick={onSelect}>
      <Card hover selected={selected} padding="none" className={`p-4 transition-all border-dashed`}>
        <div className="flex items-start gap-3">
          {/* Avatar — show photo if enriched, else emoji fallback */}
          {professional.photoUrl ? (
            <img
              src={professional.photoUrl}
              alt={professional.name}
              className="h-[52px] w-[52px] flex-shrink-0 rounded-2xl border border-[var(--border)] object-cover"
            />
          ) : (
            <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] text-lg opacity-60">
              {emoji}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100 opacity-80">{professional.name}</div>
                <div className="truncate text-xs text-slate-500">
                  {(professional.officeName || (professional.company !== professional.name ? professional.company : professional.city))}
                  {professional.state ? `, ${professional.state}` : ""}
                </div>
              </div>
              {/* IDFPR badge */}
              <div className="flex-shrink-0">
                <Badge variant="default" className="text-[10px] opacity-70">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-0.5">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  IDFPR
                </Badge>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="opacity-70">{professional.category}</Badge>
              {!professional.claimed && (
                <Badge variant="warning" className="opacity-80">Unclaimed</Badge>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              {professional.city && (
                <span>{professional.city}, {professional.state}</span>
              )}
              {professional.county && (
                <span>· {professional.county} Co.</span>
              )}
              {professional.rating && (
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                    <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                  </svg>
                  {professional.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
