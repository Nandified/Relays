"use client";

import * as React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  zip?: string;
  onZipChange?: (zip: string) => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by name, company, or profession...",
  zip = "",
  onZipChange,
}: SearchBarProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const geoAttempted = React.useRef(false);
  const [focused, setFocused] = React.useState(false);

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

  return (
    <div ref={containerRef} className="relative group">
      {/* Liquid Glass glow backdrop */}
      <div
        className={`absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-indigo-500/20 blur-xl transition-opacity duration-500 rounded-[28px] ${
          focused ? "opacity-100" : "opacity-40"
        }`}
      />

      {/* Liquid Glass search pill */}
      <div
        className={`
          relative rounded-[22px]
          border transition-all duration-300
          ${focused
            ? "border-white/[0.18] shadow-[0_0_30px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]"
            : "border-white/[0.1] shadow-[0_0_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]"
          }
          bg-white/[0.04] backdrop-blur-2xl
        `}
      >
        {/* Inner glass highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none rounded-t-[22px]" />

        <div className="relative flex items-center">
          {/* Search icon */}
          <div className={`flex items-center pl-4 transition-colors duration-200 ${focused ? "text-blue-400/80" : "text-slate-500"}`}>
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
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent py-3.5 pl-3 pr-2 text-[16px] sm:text-sm text-slate-100 placeholder:text-slate-500/80 outline-none focus:outline-none focus-visible:outline-none"
            style={{ outline: "none" }}
          />

          {/* Clear button (when there's text) */}
          {value.trim() && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 hover:text-slate-300 hover:bg-white/[0.08] transition-all mr-1"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Glass divider */}
          <div className="h-6 w-px bg-white/[0.1] flex-shrink-0" />

          {/* Zip code field */}
          <div className="flex items-center">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-3 text-slate-500/80 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              value={zip}
              onChange={(e) => onZipChange?.(e.target.value.replace(/\D/g, "").slice(0, 5))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="Zip code"
              className="w-20 bg-transparent py-3.5 pl-2 pr-3 text-[16px] sm:text-sm text-slate-100 placeholder:text-slate-500/80 outline-none focus:outline-none focus-visible:outline-none"
              style={{ outline: "none" }}
              inputMode="numeric"
              enterKeyHint="done"
            />

            {/* Clear zip button */}
            {zip.trim() && (
              <button
                type="button"
                onClick={() => onZipChange?.("")}
                className="flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:text-slate-300 hover:bg-white/[0.08] transition-all mr-2"
              >
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
