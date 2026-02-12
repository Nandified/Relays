"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

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
  const [animatedText, setAnimatedText] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<Set<string>>(new Set(["All"]));
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Typewriter effect — only when dropdown closed and no query
  React.useEffect(() => {
    if (isOpen || query.length > 0) return;

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
  }, [isOpen, query]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);

      if (cat === "All") {
        return new Set(["All"]);
      }

      next.delete("All");

      if (next.has(cat)) {
        next.delete(cat);
        if (next.size === 0) return new Set(["All"]);
      } else {
        next.add(cat);
      }

      const individualCategories = CATEGORY_CHIPS.filter((c) => c !== "All");
      if (individualCategories.every((c) => next.has(c))) {
        return new Set(["All"]);
      }

      return next;
    });
  }

  function handleSearch() {
    const params = new URLSearchParams();
    const q = query.trim();

    if (q) {
      params.set("q", q);
    }

    if (!selectedCategories.has("All")) {
      params.set("categories", Array.from(selectedCategories).join(","));
    }

    const qs = params.toString();
    router.push(`/marketplace${qs ? `?${qs}` : ""}`);
    setIsOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch();
  }

  const showAnimatedPlaceholder = !isOpen && query.length === 0;

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-lg">
      {/* Glow backdrop */}
      <div
        className={`absolute -inset-1.5 rounded-[28px] bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-indigo-500/20 blur-xl transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-50"
        }`}
      />

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center rounded-full border bg-[var(--bg-card)]/90 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.08)] transition-all duration-300 ${
            isOpen
              ? "border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.15)] rounded-[22px]"
              : "border-[var(--border)]"
          }`}
        >
          {/* Search icon */}
          <div className="flex items-center pl-4 text-slate-500">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          {/* Input + animated placeholder */}
          <div className="relative flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onClick={() => setIsOpen(true)}
              placeholder={isOpen ? "Search for a professional..." : ""}
              className="w-full bg-transparent py-3.5 pl-3 pr-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            />

            {/* Animated placeholder overlay */}
            {showAnimatedPlaceholder && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center pl-3 text-sm text-slate-500"
                aria-hidden="true"
              >
                <span>Search for a </span>
                <span className="ml-1 text-blue-400/80">{animatedText}</span>
                <span className="ml-[1px] inline-block h-4 w-[2px] animate-blink bg-blue-400/60" />
              </div>
            )}
          </div>

          {/* Compact search icon button */}
          <button
            type="button"
            onClick={() => isOpen ? handleSearch() : setIsOpen(true)}
            className="mr-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] active:scale-[0.95]"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </form>

      {/* Category chips — appear below search bar, no boxy panel */}
      {isOpen && (
        <div className="mt-3 animate-in">
          {/* Chips row */}
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
                    chip-stagger-enter
                    ${
                      isSelected
                        ? "bg-[var(--accent)] text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                        : "bg-[var(--bg-card)]/80 backdrop-blur-sm border border-[var(--border)] text-slate-400 hover:border-[var(--border-hover)] hover:text-slate-200"
                    }
                  `}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Compact search button */}
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.25)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] active:scale-[0.97]"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
