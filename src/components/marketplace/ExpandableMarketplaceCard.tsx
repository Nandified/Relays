"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { SoftWallGate } from "@/components/marketplace/SoftWallGate";
import { avatarGradientClass, getInitials } from "@/components/marketplace/avatarUtils";
import { type MarketplaceProfile } from "@/lib/marketplace/MarketplaceProfile";

interface ExpandableMarketplaceCardProps {
  profile: MarketplaceProfile;
  expanded: boolean;
  onToggle: () => void;
}

function getVideoEmbed(url: string): { kind: "file" | "iframe"; src: string } {
  const fileRe = /\.(mp4|webm|ogg)(\?.*)?$/i;
  if (fileRe.test(url)) return { kind: "file", src: url };

  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    // YouTube
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` };
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${v}?rel=0` };

      const parts = u.pathname.split("/").filter(Boolean);
      // /shorts/:id
      if (parts[0] === "shorts" && parts[1]) {
        return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${parts[1]}?rel=0` };
      }
      // /embed/:id already
      if (parts[0] === "embed" && parts[1]) {
        return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${parts[1]}?rel=0` };
      }
    }

    // Vimeo
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return { kind: "iframe", src: `https://player.vimeo.com/video/${id}` };
    }
  } catch {
    // ignore
  }

  return { kind: "iframe", src: url };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="14"
          height="14"
          fill={star <= Math.round(rating) ? "#f59e0b" : "#334155"}
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
        </svg>
      ))}
    </div>
  );
}

/* Tiny inline Google "G" logo */
function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function ExpandableMarketplaceCard({ profile, expanded, onToggle }: ExpandableMarketplaceCardProps) {
  const [videoOpen, setVideoOpen] = React.useState(false);
  const contentId = `marketplace-card-${profile.uid}`;

  const initials = getInitials(profile.name);
  const gradientClass = avatarGradientClass(profile.name);
  const hasRating = typeof profile.rating === "number" && !Number.isNaN(profile.rating);

  function openVideo(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setVideoOpen(true);
  }

  return (
    <>
      <Card
        hover
        selected={expanded}
        padding="none"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.currentTarget !== e.target) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full min-w-0 overflow-hidden p-3 sm:p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        {/* Card header — always visible */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            {profile.avatarUrl ? (
              <Avatar src={profile.avatarUrl} alt={profile.name} width={72} height={96} rounded="md" />
            ) : (
              <div
                className={`flex h-[96px] w-[72px] flex-shrink-0 items-center justify-center rounded-md border border-black/[0.08] dark:border-white/[0.08] bg-gradient-to-br ${gradientClass} text-sm font-bold tracking-tight text-slate-900 dark:text-slate-50`}
              >
                {initials}
              </div>
            )}

            {profile.introVideoUrl && (
              <button
                type="button"
                onClick={openVideo}
                aria-label={`Play ${profile.name}'s intro video`}
                className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white shadow-md ring-2 ring-[var(--bg-card)] hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-95">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Intro
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.name}</div>
                {profile.subtitle && (
                  <div className="truncate text-xs text-slate-600 dark:text-slate-400">{profile.subtitle}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {profile.companyLogoUrl && (
                  <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                    <Image
                      src={profile.companyLogoUrl}
                      alt={profile.subtitle ?? profile.name}
                      width={36}
                      height={36}
                    />
                  </div>
                )}
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
              {profile.categories.slice(0, 2).map((c) => (
                <Badge key={c} variant="outline">
                  {c}
                </Badge>
              ))}
              {profile.verified && <Badge variant="success">✓ Verified</Badge>}
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              {hasRating && (
                <>
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                    </svg>
                    {profile.rating!.toFixed(1)}
                  </span>
                  {profile.reviewCount != null && (
                    <span className="flex items-center gap-1">
                      {profile.reviewCount} reviews
                      {profile.ratingSource === "google" && <GoogleG className="opacity-60" />}
                    </span>
                  )}
                </>
              )}
              {profile.primaryLocationLabel && <span>{profile.primaryLocationLabel}</span>}
            </div>
          </div>
        </div>

        {/* Expandable content — CSS grid animation (no JS height) */}
        <div
          id={contentId}
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              {/* Rating */}
              {hasRating && (
                <div className="flex items-center gap-2">
                  <Stars rating={profile.rating!} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{profile.rating!.toFixed(1)}</span>
                  {profile.reviewCount != null && (
                    <span className="text-xs text-slate-600 dark:text-slate-400">({profile.reviewCount} reviews)</span>
                  )}
                  {profile.ratingSource === "google" && <GoogleG className="opacity-50" />}
                </div>
              )}

              {/* Blurb */}
              {profile.blurb ? (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{profile.blurb}</p>
              ) : (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                  This professional hasn&apos;t added a bio yet.
                </p>
              )}

              {/* Categories & badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.categories.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))}
                {profile.accentBadges.slice(0, 2).map((label) => (
                  <Badge key={label} variant="accent">
                    {label}
                  </Badge>
                ))}
                {profile.defaultBadges.map((label) => (
                  <Badge key={label} variant="default">
                    {label}
                  </Badge>
                ))}
                {profile.verified && <Badge variant="success">✓ Verified</Badge>}
              </div>

              {/* Service areas */}
              {profile.serviceAreasLabel && (
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-400">Service areas: </span>
                  {profile.serviceAreasLabel}
                </div>
              )}

              {/* Contact */}
              {(profile.phone || profile.website) && (
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
                  {profile.phone && (
                    <span className="flex items-center gap-1.5">
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="opacity-50"
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      {profile.phone}
                    </span>
                  )}
                  {profile.website && (
                    <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400/70">
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="opacity-50"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      </svg>
                      {profile.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </span>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="mt-4 pb-1 grid gap-2" onClick={(e) => e.stopPropagation()}>
                <Link href={profile.profileHref}>
                  <Button variant="secondary" className="w-full">
                    View Full Profile
                  </Button>
                </Link>

                {profile.kind === "claimed" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <SoftWallGate action="add_to_team" context={{ proSlug: profile.slug, from: "marketplace" }}>
                      {(_authed, begin) => (
                        <Button className="w-full" onClick={begin}>
                          Add to Team
                        </Button>
                      )}
                    </SoftWallGate>
                    <SoftWallGate action="request_booking" context={{ proSlug: profile.slug, from: "marketplace" }}>
                      {(_authed, begin) => (
                        <Button variant="secondary" className="w-full" onClick={begin}>
                          Book
                        </Button>
                      )}
                    </SoftWallGate>
                  </div>
                ) : null}
              </div>

              {/* Claim link */}
              {profile.kind === "licensed" && profile.claimHref && (
                <div className="pt-2 pb-1" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={profile.claimHref}
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    Are you {profile.name.split(" ")[0]}?{" "}
                    <span className="underline underline-offset-2">Claim this profile</span> →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {profile.introVideoUrl && videoOpen && (
        <Modal
          open
          onClose={() => setVideoOpen(false)}
          title={`${profile.name} — Intro video`}
          size="lg"
        >
          <div className="space-y-3">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
              {(() => {
                const video = getVideoEmbed(profile.introVideoUrl!);
                if (video.kind === "file") {
                  return <video controls className="h-full w-full" src={video.src} />;
                }
                return (
                  <iframe
                    title={`${profile.name} intro video`}
                    className="h-full w-full"
                    src={video.src}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                );
              })()}
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400">Press Escape to close.</div>
          </div>
        </Modal>
      )}
    </>
  );
}
