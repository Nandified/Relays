"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { type PlacesResult, claimPlace } from "@/lib/google-places";

export function ClaimProfileBanner({
  place,
  onClaim,
  onSkip,
}: {
  place: PlacesResult;
  onClaim: () => void;
  onSkip: () => void;
}) {
  const [claiming, setClaiming] = React.useState(false);

  const handleClaim = () => {
    setClaiming(true);
    // Mock claim — in production, would link Google Places listing to pro's Relays profile
    claimPlace(place.placeId);
    setTimeout(() => {
      setClaiming(false);
      onClaim();
    }, 800);
  };

  return (
    <Card padding="lg" className="border-[var(--accent)]/30 shadow-[var(--glow-accent)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/10">
          <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">We found your business on Google</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            It looks like your business already has a presence online. Claim it to import your details and start receiving referrals.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{place.name}</div>
            <div className="truncate text-xs text-slate-600 dark:text-slate-500 mt-0.5">{place.address}</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-500">
            <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
              <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
            </svg>
            {place.rating.toFixed(1)} ({place.reviewCount})
          </div>
        </div>
        <div className="mt-2 flex gap-1">
          {place.categories.map((c) => (
            <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1" onClick={handleClaim} disabled={claiming}>
          {claiming ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Claiming...
            </>
          ) : (
            "Claim This Profile"
          )}
        </Button>
        <Button variant="ghost" onClick={onSkip}>
          Not my business
        </Button>
      </div>
    </Card>
  );
}
