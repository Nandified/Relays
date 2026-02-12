"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type PlacesResult } from "@/lib/google-places";

export function GooglePlacesCard({
  place,
  selected,
  onSelect,
}: {
  place: PlacesResult;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button className="w-full text-left" onClick={onSelect}>
      <Card hover selected={selected} padding="none" className={`p-4 transition-all ${!place.claimed ? "border-dashed" : ""}`}>
        <div className="flex items-start gap-3">
          {/* Placeholder avatar for unclaimed */}
          <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] text-lg opacity-60">
            {place.categories[0] === "Realtor" && "🏠"}
            {place.categories[0] === "Mortgage Lender" && "🏦"}
            {place.categories[0] === "Attorney" && "⚖️"}
            {place.categories[0] === "Home Inspector" && "🔍"}
            {place.categories[0] === "Insurance Agent" && "🛡️"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100 opacity-80">{place.name}</div>
                <div className="truncate text-xs text-slate-500">{place.address}</div>
              </div>
              {/* Google badge */}
              <div className="flex-shrink-0">
                <Badge variant="default" className="text-[10px] opacity-70">
                  <svg width="10" height="10" viewBox="0 0 24 24" className="mr-0.5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Badge>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {place.categories.slice(0, 2).map((c) => (
                <Badge key={c} variant="outline" className="opacity-70">{c}</Badge>
              ))}
              {!place.claimed && (
                <Badge variant="warning" className="opacity-80">Unclaimed</Badge>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                  <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                </svg>
                {place.rating.toFixed(1)}
              </span>
              <span>{place.reviewCount} reviews</span>
              {place.phone && <span>{place.phone}</span>}
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}
