"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";
import { type Pro } from "@/lib/types";

interface ExpandableProCardProps {
  pro: Pro;
  expanded: boolean;
  onToggle: () => void;
}

export function ExpandableProCard({ pro, expanded, onToggle }: ExpandableProCardProps) {
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
          <div className="relative flex-shrink-0">
            <Avatar src={pro.headshotUrl} alt={pro.name} size={44} rounded="xl" />
            {pro.introVideoUrl && (
              <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/90 border-2 border-[var(--bg-card)] shadow-sm">
                <svg width="8" height="8" fill="white" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{pro.name}</div>
                <div className="truncate text-xs text-slate-500">{pro.companyName}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                  <Image src={pro.companyLogoUrl} alt={pro.companyName} width={36} height={36} />
                </div>
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
              {pro.categories.slice(0, 2).map((c) => (
                <Badge key={c} variant="outline">{c}</Badge>
              ))}
              {pro.verified && (
                <Badge variant="success">✓ Verified</Badge>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                  <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                </svg>
                {pro.rating.toFixed(1)}
              </span>
              <span>{pro.reviewCount} reviews</span>
              <span>{pro.serviceAreas[0]}</span>
            </div>
          </div>
        </div>

        {/* Expandable content — CSS grid animation (no JS height) */}
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              {/* Full star rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="14" height="14" fill={star <= Math.round(pro.rating) ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pro.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-500">({pro.reviewCount} reviews)</span>
              </div>

              {/* Blurb */}
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{pro.blurb}</p>

              {/* All categories & badges */}
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
              <div className="mt-3 text-xs text-slate-500">
                <span className="font-medium text-slate-500 dark:text-slate-400">Service areas: </span>
                {pro.serviceAreas.join(", ")}
              </div>

              {/* CTAs */}
              <div className="mt-4 pb-1 grid gap-2" onClick={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
