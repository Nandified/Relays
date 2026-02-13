"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { type UnclaimedProfessional } from "@/lib/types";

interface ExpandableIdfprCardProps {
  professional: UnclaimedProfessional;
  expanded: boolean;
  onToggle: () => void;
}

function getInitials(name: string): string {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_COLORS = [
  "from-blue-600/30 to-blue-500/10 text-blue-300",
  "from-violet-600/30 to-violet-500/10 text-violet-300",
  "from-emerald-600/30 to-emerald-500/10 text-emerald-300",
  "from-amber-600/30 to-amber-500/10 text-amber-300",
  "from-rose-600/30 to-rose-500/10 text-rose-300",
  "from-cyan-600/30 to-cyan-500/10 text-cyan-300",
  "from-fuchsia-600/30 to-fuchsia-500/10 text-fuchsia-300",
  "from-lime-600/30 to-lime-500/10 text-lime-300",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/* Tiny inline Google "G" logo */
function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export function ExpandableIdfprCard({ professional, expanded, onToggle }: ExpandableIdfprCardProps) {
  const initials = getInitials(professional.name);
  const colorClass = avatarColor(professional.name);
  const hasRating = typeof professional.rating === "number" && !Number.isNaN(professional.rating);

  return (
    <button className="w-full min-w-0 text-left" onClick={onToggle}>
      <Card
        hover
        selected={expanded}
        padding="none"
        className="overflow-hidden p-3 sm:p-4 transition-all"
      >
        {/* Card header — always visible */}
        <div className="flex items-start gap-3">
          {professional.photoUrl ? (
            <img
              src={professional.photoUrl}
              alt={professional.name}
              className="h-[44px] w-[44px] flex-shrink-0 rounded-xl border border-[var(--border)] object-cover"
            />
          ) : (
            <div className={`flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br ${colorClass} text-sm font-semibold`}>
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100">{professional.name}</div>
                <div className="truncate text-xs text-slate-500">
                  {professional.officeName || (professional.company !== professional.name ? professional.company : "")}
                  {professional.city ? (professional.officeName || (professional.company !== professional.name) ? `, ${professional.city}` : professional.city) : ""}
                </div>
              </div>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline">{professional.category}</Badge>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              {hasRating && (
                <>
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                    </svg>
                    {professional.rating!.toFixed(1)}
                  </span>
                  {professional.reviewCount && <span>{professional.reviewCount} reviews</span>}
                  <GoogleG className="opacity-60" />
                </>
              )}
              {professional.city && <span>{professional.city}, {professional.state}</span>}
            </div>
          </div>
        </div>

        {/* Expandable content — matches demo pro layout */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              {/* Rating with Google attribution */}
              {hasRating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} width="14" height="14" fill={star <= Math.round(professional.rating!) ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
                        <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-300">{professional.rating!.toFixed(1)}</span>
                  {professional.reviewCount && (
                    <span className="text-xs text-slate-500">({professional.reviewCount} reviews)</span>
                  )}
                  <GoogleG className="opacity-50" />
                </div>
              )}

              {/* Bio placeholder */}
              <p className="mt-3 text-sm text-slate-500 italic leading-relaxed">
                This professional hasn&apos;t added a bio yet.
              </p>

              {/* Category badge + location */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="outline">{professional.category}</Badge>
                {professional.county && (
                  <Badge variant="default">{professional.county} County</Badge>
                )}
              </div>

              {/* Service areas */}
              <div className="mt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-400">Service areas: </span>
                {[professional.city, professional.county ? `${professional.county} County` : null].filter(Boolean).join(", ") || "Not listed"}
              </div>

              {/* Contact (if enriched) */}
              {(professional.phone || professional.website) && (
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  {professional.phone && (
                    <span className="flex items-center gap-1.5">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-50">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      {professional.phone}
                    </span>
                  )}
                  {professional.website && (
                    <span className="flex items-center gap-1.5 text-blue-400/70">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-50">
                        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      </svg>
                      {professional.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </span>
                  )}
                </div>
              )}

              {/* CTAs — matches demo pro layout */}
              <div className="mt-4 pb-1 grid gap-2" onClick={(e) => e.stopPropagation()}>
                <Link href={`/pros/${professional.slug}`}>
                  <Button variant="secondary" className="w-full">View Full Profile</Button>
                </Link>
              </div>

              {/* Subtle claim link */}
              <div className="pt-2 pb-1" onClick={(e) => e.stopPropagation()}>
                <a href="/pro/onboarding" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
                  Are you {professional.name.split(" ")[0]}? <span className="underline underline-offset-2">Claim this profile</span> →
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
