"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { type Pro, type UnclaimedProfessional } from "@/lib/types";
import { type PlacesResult } from "@/lib/google-places";

const PLACEHOLDER_SERVICES = [
  "Realtor",
  "Lender",
  "Attorney",
  "Home Inspector",
  "Insurance Agent",
];

const CATEGORY_CHIPS = [
  "All",
  "Realtor",
  "Mortgage Lender",
  "Attorney",
  "Home Inspector",
  "Insurance Agent",
];

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_AFTER_TYPING = 1800;
const PAUSE_AFTER_DELETING = 400;

export function HeroSearchBar() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [animatedText, setAnimatedText] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<Set<string>>(new Set(["All"]));
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const geoAttempted = React.useRef(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const hasSelectedPros = !selectedCategories.has("All") && selectedCategories.size > 0;
  // Show pills if user has interacted with chips at all (even if back to "All")
  const showPills = hasInteracted;

  // Show suggestions when user has typed text AND the bar is open
  const showSuggestions = isOpen && query.trim().length > 0;
  // Show chip dropdown only when open, no typed text, and no pills selected
  const showChipDropdown = isOpen && query.trim().length === 0;

  // Categories array for the search suggestions
  const activeCategoryArray = React.useMemo(() => {
    if (selectedCategories.has("All") || selectedCategories.size === 0) return [];
    return Array.from(selectedCategories).filter((c) => c !== "All");
  }, [selectedCategories]);

  // Auto-detect zip from geolocation
  React.useEffect(() => {
    if (geoAttempted.current) return;
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
            setZip(data.postcode.slice(0, 5));
          }
        } catch { /* silent */ }
      },
      () => {},
      { timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  // Typewriter effect
  React.useEffect(() => {
    if (isOpen || query.length > 0 || showPills) return;

    let currentIndex = 0;
    let currentChar = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    function tick() {
      const currentWord = PLACEHOLDER_SERVICES[currentIndex];
      if (!isDeleting) {
        currentChar++;
        setAnimatedText(currentWord.slice(0, currentChar));
        if (currentChar === currentWord.length) {
          isDeleting = true;
          timeout = setTimeout(tick, PAUSE_AFTER_TYPING);
        } else {
          timeout = setTimeout(tick, TYPING_SPEED);
        }
      } else {
        currentChar--;
        setAnimatedText(currentWord.slice(0, currentChar));
        if (currentChar === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % PLACEHOLDER_SERVICES.length;
          timeout = setTimeout(tick, PAUSE_AFTER_DELETING);
        } else {
          timeout = setTimeout(tick, DELETING_SPEED);
        }
      }
    }

    timeout = setTimeout(tick, PAUSE_AFTER_DELETING);
    return () => clearTimeout(timeout);
  }, [isOpen, query, showPills]);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  React.useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function toggleCategory(cat: string) {
    setHasInteracted(true);

    if (cat === "All") {
      const allIndividual = CATEGORY_CHIPS.filter((c) => c !== "All");
      const hasAllIndividuals = allIndividual.every((c) => selectedCategories.has(c));

      if (hasInteracted && selectedCategories.has("All") && hasAllIndividuals) {
        // User already has all selected + interacted — clicking again clears (change your mind)
        setSelectedCategories(new Set(["All"]));
        setHasInteracted(false);
        return;
      }

      // Select All + show all individual categories as pills
      setSelectedCategories(new Set(["All", ...allIndividual]));
      return;
    }

    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.delete("All");

      if (next.has(cat)) {
        next.delete(cat);
        if (next.size === 0) {
          return new Set(["All"]);
        }
      } else {
        next.add(cat);
      }

      // If all individual categories are now selected, also highlight "All"
      const individualCategories = CATEGORY_CHIPS.filter((c) => c !== "All");
      if (individualCategories.every((c) => next.has(c))) {
        next.add("All");
      }

      return next;
    });
  }

  function removeCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.delete(cat);
      next.delete("All"); // If removing one, it's no longer "All"
      if (next.size === 0) {
        setHasInteracted(false);
        return new Set(["All"]);
      }
      return next;
    });
  }

  function handleSearch() {
    const params = new URLSearchParams();
    const q = query.trim();
    if (q) params.set("q", q);
    if (!selectedCategories.has("All") && selectedCategories.size > 0) {
      params.set("categories", Array.from(selectedCategories).join(","));
    }
    if (zip.trim()) params.set("zip", zip.trim());
    const qs = params.toString();
    router.push(`/marketplace${qs ? `?${qs}` : ""}`);
    setIsOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch();
  }

  function handleSelectPro(pro: Pro) {
    setIsOpen(false);
    router.push(`/pros/${pro.slug}`);
  }

  function handleSelectPlace(place: PlacesResult) {
    setIsOpen(false);
    router.push(`/marketplace?placeId=${place.placeId}`);
  }

  function handleSelectLicensed(professional: UnclaimedProfessional) {
    setIsOpen(false);
    router.push(`/pros/${professional.slug}`);
  }

  function handleSeeAll(q: string) {
    setIsOpen(false);
    const params = new URLSearchParams();
    params.set("q", q);
    if (!selectedCategories.has("All") && selectedCategories.size > 0) {
      params.set("categories", Array.from(selectedCategories).join(","));
    }
    router.push(`/marketplace?${params.toString()}`);
  }

  const showAnimatedPlaceholder = !isOpen && query.length === 0 && !showPills;

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-lg">
      {/* Glow backdrop */}
      <div
        className={`absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-indigo-500/20 blur-xl transition-opacity duration-500 rounded-[28px] ${
          isOpen ? "opacity-100" : "opacity-50"
        }`}
      />

      {/* Search bar — solid pill */}
      <div className="relative rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)]/90 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.08)] transition-shadow duration-300">
        <form onSubmit={handleSubmit} className="flex items-center">
          {/* Search icon */}
          <div className="flex items-center pl-4 text-slate-600 dark:text-slate-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          {/* Main search input */}
          <div className="relative flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // If user types manually, reset chip selection
                if (hasSelectedPros) {
                  setSelectedCategories(new Set(["All"]));
                  setHasInteracted(false);
                }
              }}
              onFocus={() => setIsOpen(true)}
              onClick={() => setIsOpen(true)}
              placeholder={isOpen || showPills ? "Search for a professional..." : ""}
              className="w-full bg-transparent py-3.5 pl-3 pr-2 text-[16px] sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none focus:outline-none focus-visible:outline-none"
              style={{ outline: "none" }}
            />

            {/* Animated typewriter */}
            {showAnimatedPlaceholder && (
              <div className="pointer-events-none absolute inset-0 flex items-center pl-3 text-[16px] sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap overflow-hidden" aria-hidden="true">
                <span className="hidden sm:inline">Search for a </span>
                <span className="sm:hidden">Find a </span>
                <span className="ml-1 text-blue-500 dark:text-blue-400/80">{animatedText}</span>
                <span className="ml-[1px] inline-block h-4 w-[2px] animate-blink bg-blue-400/60" />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--border)] flex-shrink-0" />

          {/* Zip code */}
          <div className="flex items-center">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-3 text-slate-600 dark:text-slate-400 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              onFocus={() => setIsOpen(true)}
              placeholder="Zip code"
              className="w-20 bg-transparent py-3.5 pl-2 pr-1 text-[16px] sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none focus:outline-none focus-visible:outline-none"
              style={{ outline: "none" }}
              inputMode="numeric"
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            aria-label="Search"
            className="mr-1.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] active:scale-[0.95]"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Selected category tags — wrapping pills below the input row */}
        {showPills && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-3 -mt-1">
            {Array.from(selectedCategories).filter((c) => c !== "All").map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/25 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-300"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => removeCategory(cat)}
                  className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown — chip selector (when no text typed) */}
      {showChipDropdown && (
        <div
          className="sm:absolute sm:left-0 sm:right-0 sm:top-full relative z-50 mt-2 rounded-2xl border border-black/[0.12] dark:border-white/[0.12] bg-black/[0.05] dark:bg-white/[0.05] backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden"
          style={{ animation: "dropdownFadeIn 0.15s ease-out" }}
        >
          {/* Top glass highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          <div className="relative px-4 pt-3 pb-4">
            <div className="text-center text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
              What are you looking for?
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORY_CHIPS.map((cat, i) => {
                const isSelected = selectedCategories.has(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`
                      rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200
                      ${
                        isSelected
                          ? "bg-[var(--accent)] text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                          : "bg-black/[0.06] dark:bg-white/[0.06] border border-black/[0.1] dark:border-white/[0.1] text-slate-600 dark:text-slate-400 hover:border-black/[0.2] dark:border-white/[0.2] hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/[0.1] dark:hover:bg-white/[0.1]"
                      }
                    `}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Dropdown — live search suggestions (when text is typed) */}
      {showSuggestions && (
        <SearchSuggestions
          query={query}
          zip={zip}
          categories={activeCategoryArray.length > 0 ? activeCategoryArray : undefined}
          onSelectPro={handleSelectPro}
          onSelectPlace={handleSelectPlace}
          onSelectLicensed={handleSelectLicensed}
          onSeeAll={handleSeeAll}
          visible={showSuggestions}
          className="sm:absolute sm:left-0 sm:right-0 sm:top-full relative mt-2"
        />
      )}
    </div>
  );
}
