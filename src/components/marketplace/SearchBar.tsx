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
}

export function SearchBar({
  value,
  onChange,
  placeholder = "What service do you need?",
  onSelectPro,
  onSelectPlace,
  categoryFilter,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const showSuggestions = isFocused && value.trim().length > 0 && (!!onSelectPro || !!onSelectPlace);

  // Category filter as array for SearchSuggestions
  const categories = React.useMemo(() => {
    if (!categoryFilter) return undefined;
    return [categoryFilter];
  }, [categoryFilter]);

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
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onClick={() => setIsFocused(true)}
        placeholder={placeholder}
        className="w-full rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3.5 pl-11 text-sm text-slate-200 placeholder:text-slate-500 outline-none shadow-[var(--shadow-card)] transition-all focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] focus:shadow-[var(--glow-accent)]"
      />

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
          className="absolute left-0 right-0 top-full mt-2"
        />
      )}
    </div>
  );
}
