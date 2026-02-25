"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { avatarGradientClass, getInitials } from "@/components/marketplace/avatarUtils";
import { type UnclaimedProfessional } from "@/lib/types";

export function LicensedProfessionalCard({
  professional,
  selected,
  onSelect,
}: {
  professional: UnclaimedProfessional;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const initials = getInitials(professional.name);
  const gradientClass = avatarGradientClass(professional.name);

  return (
    <button className="w-full text-left" onClick={onSelect}>
      <Card hover selected={selected} padding="none" className="p-4 transition-all">
        <div className="flex items-start gap-3">
          {/* Avatar — photo if enriched, else initials */}
          {professional.photoUrl ? (
            <img
              src={professional.photoUrl}
              alt={professional.name}
              className="h-[65px] w-[52px] flex-shrink-0 rounded-2xl border border-[var(--border)] object-cover"
            />
          ) : (
            <div
              className={`flex h-[65px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-gradient-to-br ${gradientClass} text-base font-bold tracking-tight text-slate-900 dark:text-slate-50`}
            >
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{professional.name}</div>
                <div className="truncate text-xs text-slate-600 dark:text-slate-400">
                  {professional.officeName || (professional.company !== professional.name ? professional.company : "")}
                  {professional.city ? (professional.officeName || (professional.company !== professional.name) ? `, ${professional.city}` : professional.city) : ""}
                  {professional.state ? `, ${professional.state}` : ""}
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="opacity-70">{professional.category}</Badge>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
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
