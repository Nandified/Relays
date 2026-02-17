"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { type PlacesResult } from "@/lib/google-places";
import { sendClaimEmail, logProfileView } from "@/lib/outreach";

export function GooglePlacesPreview({ place }: { place: PlacesResult }) {
  const [inviteSent, setInviteSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  // Log view for outreach tracking
  React.useEffect(() => {
    logProfileView(place);
  }, [place]);

  const handleInvite = async () => {
    if (!place.email || inviteSent) return;
    setSending(true);
    await sendClaimEmail(place.placeId, place.email, place.name);
    setSending(false);
    setInviteSent(true);
  };

  return (
    <Card padding="lg" glow className="border-dashed">
      {/* Unclaimed banner */}
      <div className="mb-4 rounded-xl bg-amber-500/8 border border-amber-500/15 px-3 py-2.5">
        <div className="flex items-start gap-2">
          <svg width="16" height="16" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0">
            <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs font-medium text-amber-400">Unclaimed Profile</p>
            <p className="text-[11px] text-amber-400/70 mt-0.5">
              This professional hasn&apos;t claimed their Relays profile yet. Information shown is from public listings.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] text-2xl opacity-60">
          {place.categories[0] === "Realtor" && "🏠"}
          {place.categories[0] === "Mortgage Lender" && "🏦"}
          {place.categories[0] === "Attorney" && "⚖️"}
          {place.categories[0] === "Home Inspector" && "🔍"}
          {place.categories[0] === "Insurance Agent" && "🛡️"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold text-slate-900 dark:text-slate-100 opacity-80">{place.name}</div>
          <div className="truncate text-sm text-slate-500">{place.address}</div>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} width="14" height="14" fill={star <= Math.round(place.rating) ? "#f59e0b" : "#334155"} viewBox="0 0 20 20">
              <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{place.rating.toFixed(1)}</span>
        <span className="text-xs text-slate-500">({place.reviewCount} reviews)</span>
      </div>

      {/* Categories & Google badge */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {place.categories.map((c) => (
          <Badge key={c} variant="outline" className="opacity-70">{c}</Badge>
        ))}
        <Badge variant="default" className="opacity-60">
          <svg width="10" height="10" viewBox="0 0 24 24" className="mr-0.5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          via Google
        </Badge>
        <Badge variant="warning" className="opacity-80">Unclaimed</Badge>
      </div>

      {/* Contact info */}
      <div className="mt-3 space-y-1">
        {place.phone && (
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-500 dark:text-slate-400">Phone: </span>
            {place.phone}
          </div>
        )}
        {place.website && (
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-500 dark:text-slate-400">Website: </span>
            <span className="text-blue-400/60">{place.website.replace("https://", "")}</span>
          </div>
        )}
      </div>

      {/* CTAs — no Book / Add to Team for unclaimed */}
      <div className="mt-4 grid gap-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleInvite}
          disabled={inviteSent || sending}
        >
          {sending ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending invite...
            </>
          ) : inviteSent ? (
            <>
              <svg width="16" height="16" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Invite Sent
            </>
          ) : (
            <>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Invite to Relays
            </>
          )}
        </Button>
        <p className="text-center text-[11px] text-slate-500 dark:text-slate-600">
          Know this business? Help them claim their free Relays profile.
        </p>
      </div>
    </Card>
  );
}
