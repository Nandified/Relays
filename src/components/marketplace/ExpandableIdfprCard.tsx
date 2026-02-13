"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { type UnclaimedProfessional } from "@/lib/types";

interface ExpandableIdfprCardProps {
  professional: UnclaimedProfessional;
  expanded: boolean;
  onToggle: () => void;
}

const categoryEmoji: Record<string, string> = {
  Realtor: "🏠",
  "Mortgage Lender": "🏦",
  Attorney: "⚖️",
  "Home Inspector": "🔍",
  "Insurance Agent": "🛡️",
};

export function ExpandableIdfprCard({ professional, expanded, onToggle }: ExpandableIdfprCardProps) {
  const emoji = categoryEmoji[professional.category] ?? "📋";

  return (
    <button className="w-full min-w-0 text-left" onClick={onToggle}>
      <Card
        hover
        selected={expanded}
        padding="none"
        className="overflow-hidden p-3 sm:p-4 transition-all border-dashed"
      >
        {/* Card header — always visible */}
        <div className="flex items-start gap-3">
          <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] text-lg opacity-60">
            {emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100 opacity-80">{professional.name}</div>
                <div className="truncate text-xs text-slate-500">
                  {(professional.officeName || (professional.company !== professional.name ? professional.company : professional.city))}
                  {professional.state ? `, ${professional.state}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[10px] opacity-70">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-0.5">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  IDFPR
                </Badge>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className={`text-slate-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              <Badge variant="outline" className="opacity-70">{professional.category}</Badge>
              <Badge variant="default" className="text-[10px] opacity-60">
                #{professional.licenseNumber}
              </Badge>
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

        {/* Expandable content */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              {/* Unclaimed banner */}
              <div className="mb-3 rounded-xl bg-violet-500/8 border border-violet-500/15 px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <svg width="16" height="16" fill="none" stroke="#8b5cf6" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-violet-400">IDFPR Licensed Professional</p>
                    <p className="text-[11px] text-violet-400/70 mt-0.5">
                      License data from the Illinois Department of Financial and Professional Regulation.
                    </p>
                  </div>
                </div>
              </div>

              {/* License details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">License:</span>
                  <Badge variant="outline" className="text-[10px]">{professional.licenseType}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium text-slate-400">License #: </span>
                    <span className="text-slate-500">{professional.licenseNumber}</span>
                  </div>
                  {professional.county && (
                    <div>
                      <span className="font-medium text-slate-400">County: </span>
                      <span className="text-slate-500">{professional.county}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-slate-400">Licensed since: </span>
                    <span className="text-slate-500">{professional.licensedSince}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-400">Expires: </span>
                    <span className="text-slate-500">{professional.expires}</span>
                  </div>
                </div>
              </div>

              {/* Enrichment data (if available) */}
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

              {/* Badges row */}
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

              {/* CTA */}
              <div className="mt-4 pb-1 grid gap-2" onClick={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
