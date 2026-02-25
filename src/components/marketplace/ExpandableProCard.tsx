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
            <Avatar src={pro.headshotUrl} alt={pro.name} width={56} height={70} rounded="lg" />

            {pro.introVideoUrl && (
              <div className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md ring-2 ring-[var(--bg-card)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-95">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Video
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{pro.name}</div>
                <div className="truncate text-xs text-slate-600 dark:text-slate-400">{pro.companyName}</div>
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
                  className={`text-slate-600 dark:text-slate-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
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

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
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
              {pro.introVideoUrl && (
                <a
                  href={pro.introVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block mb-4"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Watch ${pro.name}'s intro video`}
                >
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={pro.headshotUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 560px"
                      className="object-cover opacity-80 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow ring-1 ring-black/10">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white leading-tight">Intro video</div>
                        <div className="text-xs text-white/80 leading-tight">Watch now</div>
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 rounded-full bg-blue-600/90 px-2 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15">
                      VIDEO
                    </div>
                  </div>
                </a>
              )}

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
                <span className="text-xs text-slate-600 dark:text-slate-400">({pro.reviewCount} reviews)</span>
              </div>

              {/* Blurb */}
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{pro.blurb}</p>

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
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-400">Service areas: </span>
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
