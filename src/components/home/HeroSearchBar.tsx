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
  const [zip, setZip] = React.useState("");
  const [animatedText, setAnimatedText] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<Set<string>>(new Set(["All"]));
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Typewriter effect — only when dropdown closed and no query typed
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

  // When a chip is clicked, update query text in the input (Thumbtack style)
  function toggleCategory(cat: string) {
    if (cat === "All") {
      setSelectedCategories(new Set(["All"]));
      setQuery("");
      return;
    }

    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.delete("All");

      if (next.has(cat)) {
        next.delete(cat);
        if (next.size === 0) {
          setQuery("");
          return new Set(["All"]);
        }
      } else {
        next.add(cat);
      }

      // If all individual categories selected, collapse to "All"
      const individualCategories = CATEGORY_CHIPS.filter((c) => c !== "All");
      if (individualCategories.every((c) => next.has(c))) {
        setQuery("");
        return new Set(["All"]);
      }

      // Update the text input with selected categories
      const text = Array.from(next).join(", ");
      setQuery(text);

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

    if (zip.trim()) {
      params.set("zip", zip.trim());
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
              ? "border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.15)]"
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

          {/* Main search input */}
          <div className="relative flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // If user manually types, reset chip selection
                setSelectedCategories(new Set(["All"]));
              }}
              onFocus={() => setIsOpen(true)}
              onClick={() => setIsOpen(true)}
              placeholder={isOpen ? "Search for a professional..." : ""}
              className="w-full bg-transparent py-3.5 pl-3 pr-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:outline-none"
              style={{ outline: "none" }}
            />

            {/* Animated typewriter placeholder */}
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

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--border)] flex-shrink-0" />

          {/* Zip code input */}
          <div className="relative flex items-center">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="ml-3 text-slate-500 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              value={zip}
              onChange={(e) => {
                // Only allow digits, max 5
                const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                setZip(val);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Zip code"
              className="w-20 bg-transparent py-3.5 pl-2 pr-1 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:outline-none focus-visible:outline-none"
              style={{ outline: "none" }}
              inputMode="numeric"
            />
          </div>

          {/* Small round search button */}
          <button
            type="button"
            onClick={handleSearch}
            className="mr-1.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] active:scale-[0.95]"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </form>

      {/* Chips dropdown — liquid glass border container */}
      {isOpen && (
        <div className="mt-3 animate-in rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {/* Label */}
          <div className="text-center text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-3">
            What are you looking for?
          </div>

          {/* Category chips */}
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
                        : "bg-[var(--bg-elevated)] border border-[var(--border)] text-slate-400 hover:border-[var(--border-hover)] hover:text-slate-200"
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
      )}
    </div>
  );
}
