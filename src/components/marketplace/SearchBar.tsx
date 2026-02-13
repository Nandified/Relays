"use client";

import * as React from "react";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { type Pro } from "@/lib/types";
import { type PlacesResult } from "@/lib/google-places";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelectPro?: (pro: Pro) => void;
  onSelectPlace?: (place: PlacesResult) => void;
  categoryFilter?: string | null;
  zip?: string;
  onZipChange?: (zip: string) => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by name, company, or profession...",
  onSelectPro,
  onSelectPlace,
  categoryFilter,
  zip = "",
  onZipChange,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const geoAttempted = React.useRef(false);

  const showSuggestions = isFocused && value.trim().length > 0 && (!!onSelectPro || !!onSelectPlace);

  // Category filter as array for SearchSuggestions
  const categories = React.useMemo(() => {
    if (!categoryFilter) return undefined;
    return [categoryFilter];
  }, [categoryFilter]);

  // Auto-detect zip from geolocation
  React.useEffect(() => {
    if (geoAttempted.current || !onZipChange) return;
    geoAttempted.current = true;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!res.ok) return;
          const data = await res.json();
          if (data.postcode && /^\d{5}/.test(data.postcode)) {
            onZipChange(data.postcode.slice(0, 5));
          }
        } catch { /* silent */ }
      },
      () => {},
      { timeout: 5000, maximumAge: 300000 }
    );
  }, [onZipChange]);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  React.useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsFocused(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Glow backdrop */}
      <div
        className={`absolute -inset-1.5 bg-gradient-to-r from-blue-500/15 via-blue-400/8 to-indigo-500/15 blur-xl transition-opacity duration-500 rounded-[28px] ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Search bar pill */}
      <div className="relative rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)]/90 backdrop-blur-md shadow-[var(--shadow-card)] transition-all duration-300 focus-within:border-[var(--accent)]/30 focus-within:shadow-[var(--glow-accent)]">
        <div className="flex items-center">
          {/* Search icon */}
          <div className="flex items-center pl-4 text-slate-500">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          {/* Main search input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onClick={() => setIsFocused(true)}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent py-3.5 pl-3 pr-2 text-[16px] sm:text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:outline-none"
            style={{ outline: "none" }}
          />

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--border)] flex-shrink-0" />

          {/* Zip code field */}
          <div className="flex items-center">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-3 text-slate-500 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              value={zip}
              onChange={(e) => onZipChange?.(e.target.value.replace(/\D/g, "").slice(0, 5))}
              onFocus={() => setIsFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="Zip code"
              className="w-20 bg-transparent py-3.5 pl-2 pr-3 text-[16px] sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:outline-none"
              style={{ outline: "none" }}
              inputMode="numeric"
              enterKeyHint="done"
            />
          </div>
        </div>
      </div>

      {/* Live search suggestions dropdown */}
      {showSuggestions && (
        <SearchSuggestions
          query={value}
          categories={categories}
          onSelectPro={(pro) => {
            onSelectPro?.(pro);
            setIsFocused(false);
          }}
          onSelectPlace={(place) => {
            onSelectPlace?.(place);
            setIsFocused(false);
          }}
          visible={showSuggestions}
          className="absolute left-0 right-0 top-full mt-2 z-50"
        />
      )}
    </div>
  );
}
