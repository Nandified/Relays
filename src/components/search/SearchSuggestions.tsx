"use client";

import * as React from "react";
import Image from "next/image";
import { mockPros } from "@/lib/mock-data";
import { searchPlacesByText, type PlacesResult } from "@/lib/google-places";
import { type Pro, type UnclaimedProfessional } from "@/lib/types";

/* ── Types ─────────────────────────────────────────────────────── */

interface SearchSuggestionsProps {
  query: string;
  categories?: string[];
  onSelectPro: (pro: Pro) => void;
  onSelectPlace: (place: PlacesResult) => void;
  onSelectLicensed?: (professional: UnclaimedProfessional) => void;
  onSeeAll?: (query: string) => void;
  visible: boolean;
  className?: string;
  maxResults?: number;
}

/* ── Category emoji map ────────────────────────────────────────── */

const categoryEmoji: Record<string, string> = {
  Realtor: "🏠",
  "Mortgage Lender": "🏦",
  Attorney: "⚖️",
  "Home Inspector": "🔍",
  "Insurance Agent": "🛡️",
};

/* ── Shimmer loading state ─────────────────────────────────────── */

function ShimmerRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
      <div className="h-9 w-9 rounded-xl bg-black/[0.06] dark:bg-white/[0.06] flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="h-3.5 w-32 rounded bg-black/[0.06] dark:bg-white/[0.06]" />
        <div className="h-2.5 w-48 rounded bg-black/[0.04] dark:bg-white/[0.04]" />
      </div>
    </div>
  );
}

/* ── Component ─────────────────────────────────────────────────── */

export function SearchSuggestions({
  query,
  categories,
  onSelectPro,
  onSelectPlace,
  onSelectLicensed,
  onSeeAll,
  visible,
  className = "",
  maxResults = 4,
}: SearchSuggestionsProps) {
  const [matchedPros, setMatchedPros] = React.useState<Pro[]>([]);
  const [matchedLicensed, setMatchedLicensed] = React.useState<UnclaimedProfessional[]>([]);
  const [matchedPlaces, setMatchedPlaces] = React.useState<PlacesResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);
  const licenseAbortRef = React.useRef<AbortController | null>(null);

  // Total items for keyboard nav
  const totalItems = matchedPros.length + matchedLicensed.length + matchedPlaces.length + (onSeeAll && query.trim() ? 1 : 0);

  // Debounced search
  React.useEffect(() => {
    if (!visible || !query.trim()) {
      setMatchedPros([]);
      setMatchedLicensed([]);
      setMatchedPlaces([]);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (licenseAbortRef.current) licenseAbortRef.current.abort();

    debounceRef.current = setTimeout(async () => {
      const q = query.trim().toLowerCase();

      // Search Relays pros (client-side)
      let proResults = mockPros.filter((p) => {
        const searchable = [p.name, p.companyName, ...p.categories, ...p.serviceAreas]
          .join(" ")
          .toLowerCase();
        return searchable.includes(q);
      });

      // Category filter
      if (categories && categories.length > 0 && !categories.includes("All")) {
        proResults = proResults.filter((p) =>
          p.categories.some((c) =>
            categories.some((cat) => c.toLowerCase().includes(cat.toLowerCase()))
          )
        );
      }

      // Search licensed professionals (API)
      const licenseController = new AbortController();
      licenseAbortRef.current = licenseController;
      let licenseResults: UnclaimedProfessional[] = [];
      try {
        const params = new URLSearchParams({ q: query.trim(), limit: String(maxResults) });
        if (categories && categories.length > 0 && !categories.includes("All")) {
          params.set("category", categories[0]);
        }
        const res = await fetch(`/api/professionals?${params.toString()}`, {
          signal: licenseController.signal,
        });
        if (res.ok) {
          const data = await res.json();
          licenseResults = data.data ?? [];
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }

      // Search Google Places
      let placeResults = await searchPlacesByText(query);

      // Category filter for places
      if (categories && categories.length > 0 && !categories.includes("All")) {
        placeResults = placeResults.filter((p) =>
          p.categories.some((c) =>
            categories.some((cat) => c.toLowerCase().includes(cat.toLowerCase()))
          )
        );
      }

      setMatchedPros(proResults.slice(0, maxResults));
      setMatchedLicensed(licenseResults.slice(0, maxResults));
      setMatchedPlaces(placeResults.slice(0, maxResults));
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (licenseAbortRef.current) licenseAbortRef.current.abort();
    };
  }, [query, categories, visible, maxResults]);

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!visible || totalItems === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        if (activeIndex < matchedPros.length) {
          onSelectPro(matchedPros[activeIndex]);
        } else if (activeIndex < matchedPros.length + matchedLicensed.length) {
          const prof = matchedLicensed[activeIndex - matchedPros.length];
          if (onSelectLicensed) onSelectLicensed(prof);
        } else if (activeIndex < matchedPros.length + matchedLicensed.length + matchedPlaces.length) {
          onSelectPlace(matchedPlaces[activeIndex - matchedPros.length - matchedLicensed.length]);
        } else if (onSeeAll) {
          onSeeAll(query);
        }
      } else if (e.key === "Escape") {
        // Parent handles closing
      }
    },
    [visible, totalItems, activeIndex, matchedPros, matchedLicensed, matchedPlaces, onSelectPro, onSelectLicensed, onSelectPlace, onSeeAll, query]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Scroll active item into view
  React.useEffect(() => {
    if (activeIndex < 0 || !containerRef.current) return;
    const items = containerRef.current.querySelectorAll("[data-suggestion-item]");
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!visible || !query.trim()) return null;

  const hasResults = matchedPros.length > 0 || matchedLicensed.length > 0 || matchedPlaces.length > 0;
  const showNoResults = !loading && !hasResults;

  return (
    <div
      ref={containerRef}
      className={`
        rounded-2xl border border-black/[0.12] dark:border-white/[0.12] bg-black/[0.05] dark:bg-white/[0.05] backdrop-blur-2xl
        shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]
        overflow-hidden z-50
        ${className}
      `}
      style={{ animation: "dropdownFadeIn 0.15s ease-out" }}
    >
      {/* Top glass highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      <div className="relative max-h-[360px] overflow-y-auto">
        {/* Loading state */}
        {loading && (
          <div className="py-2">
            <ShimmerRow />
            <ShimmerRow />
            <ShimmerRow />
          </div>
        )}

        {/* No results */}
        {showNoResults && (
          <div className="px-4 py-6 text-center">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">No professionals found</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-600">Try different terms or browse all categories</div>
          </div>
        )}

        {/* Relays pros section */}
        {!loading && matchedPros.length > 0 && (
          <div className="py-1.5">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              On Relays
            </div>
            {matchedPros.map((pro, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={pro.id}
                  data-suggestion-item
                  onClick={() => onSelectPro(pro)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                    ${isActive ? "bg-black/[0.08] dark:bg-white/[0.08]" : "hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"}
                  `}
                >
                  {/* Avatar */}
                  <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
                    <Image src={pro.headshotUrl} alt={pro.name} width={36} height={36} className="object-cover" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{pro.name}</span>
                      {pro.verified && (
                        <span className="flex-shrink-0 text-[10px] text-emerald-400">✓</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="truncate">{pro.companyName}</span>
                      <span className="flex-shrink-0">·</span>
                      <span className="flex-shrink-0">{pro.categories[0]}</span>
                    </div>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 flex-shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    <svg width="11" height="11" fill="#f59e0b" viewBox="0 0 20 20">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                    </svg>
                    {pro.rating.toFixed(1)}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Licensed professionals section */}
        {!loading && matchedLicensed.length > 0 && (
          <div className="py-1.5">
            {/* Divider if pros section exists */}
            {matchedPros.length > 0 && (
              <div className="mx-3 mb-1.5 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
            )}
            <div className="px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Licensed Professionals
              </span>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-40">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            {matchedLicensed.map((prof, i) => {
              const globalIndex = matchedPros.length + i;
              const isActive = activeIndex === globalIndex;
              const initials = prof.name
                .split(/[\s,]+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase() ?? "")
                .join("");
              return (
                <button
                  key={prof.id}
                  data-suggestion-item
                  onClick={() => onSelectLicensed?.(prof)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                    ${isActive ? "bg-black/[0.08] dark:bg-white/[0.08]" : "hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"}
                  `}
                >
                  {/* Initials avatar */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {initials}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">{prof.name}</span>
                      <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 px-1.5 py-0 text-[9px] font-medium text-emerald-400/80">
                        Licensed
                      </span>
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {prof.category}
                      {prof.officeName ? ` · ${prof.officeName}` : ""}
                      {prof.city ? ` · ${prof.city}, ${prof.state}` : ""}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Google Places section */}
        {!loading && matchedPlaces.length > 0 && (
          <div className="py-1.5">
            {/* Divider if previous sections exist */}
            {(matchedPros.length > 0 || matchedLicensed.length > 0) && (
              <div className="mx-3 mb-1.5 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
            )}
            <div className="px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {matchedPros.length === 0 && matchedLicensed.length === 0 ? "Not on Relays yet — invite them!" : "More from Google"}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-50">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            {matchedPlaces.map((place, i) => {
              const globalIndex = matchedPros.length + matchedLicensed.length + i;
              const isActive = activeIndex === globalIndex;
              const emoji = categoryEmoji[place.categories[0]] ?? "📍";
              return (
                <button
                  key={place.placeId}
                  data-suggestion-item
                  onClick={() => onSelectPlace(place)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                    ${isActive ? "bg-black/[0.08] dark:bg-white/[0.08]" : "hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"}
                  `}
                >
                  {/* Emoji avatar */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-base opacity-60">
                    {emoji}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300 opacity-90">{place.name}</span>
                      <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 border border-amber-500/15 px-1.5 py-0 text-[9px] font-medium text-amber-400/80">
                        Unclaimed
                      </span>
                    </div>
                    <div className="truncate text-xs text-slate-500">{place.address}</div>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 flex-shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    <svg width="11" height="11" fill="#f59e0b" viewBox="0 0 20 20">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                    </svg>
                    {place.rating.toFixed(1)}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* See all results */}
        {!loading && hasResults && onSeeAll && query.trim() && (
          <>
            <div className="mx-3 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
            <button
              data-suggestion-item
              onClick={() => onSeeAll(query)}
              className={`
                w-full px-3 py-2.5 text-center text-xs font-medium transition-colors
                ${activeIndex === matchedPros.length + matchedLicensed.length + matchedPlaces.length
                  ? "bg-black/[0.08] dark:bg-white/[0.08] text-blue-400"
                  : "text-slate-500 hover:text-blue-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"}
              `}
            >
              Browse all professionals →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
