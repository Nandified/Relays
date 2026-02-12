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

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_AFTER_TYPING = 1800;
const PAUSE_AFTER_DELETING = 400;

export function HeroSearchBar() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [animatedText, setAnimatedText] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Typewriter effect
  React.useEffect(() => {
    if (isFocused || query.length > 0) return;

    let currentIndex = 0;
    let currentChar = 0;
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    function tick() {
      const currentWord = PLACEHOLDER_SERVICES[currentIndex];

      if (!isDeleting) {
        // Typing
        currentChar++;
        setAnimatedText(currentWord.slice(0, currentChar));

        if (currentChar === currentWord.length) {
          // Finished typing — pause, then start deleting
          isDeleting = true;
          timeout = setTimeout(tick, PAUSE_AFTER_TYPING);
        } else {
          timeout = setTimeout(tick, TYPING_SPEED);
        }
      } else {
        // Deleting
        currentChar--;
        setAnimatedText(currentWord.slice(0, currentChar));

        if (currentChar === 0) {
          // Finished deleting — move to next word
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
  }, [isFocused, query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/marketplace?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/marketplace");
    }
  }

  const showAnimatedPlaceholder = !isFocused && query.length === 0;

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-xl">
      {/* Glow backdrop */}
      <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-indigo-500/20 blur-xl opacity-60 transition-opacity duration-500 group-focus-within:opacity-100" />

      <div className="relative flex items-center rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)]/90 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.08)] transition-all duration-300 focus-within:border-blue-500/40 focus-within:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
        {/* Search icon */}
        <div className="flex items-center pl-5 text-slate-500">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="transition-colors duration-200"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Input + animated placeholder */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? "Search for a service or professional..." : ""}
            className="w-full bg-transparent py-4 pl-3 pr-4 text-base text-slate-100 placeholder:text-slate-500 outline-none"
          />

          {/* Animated placeholder overlay */}
          {showAnimatedPlaceholder && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center pl-3 text-base text-slate-500"
              aria-hidden="true"
            >
              <span>Search for a </span>
              <span className="ml-1 text-blue-400/80">{animatedText}</span>
              <span className="ml-[1px] inline-block h-5 w-[2px] animate-blink bg-blue-400/60" />
            </div>
          )}
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="mr-2 flex items-center justify-center rounded-[18px] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] active:scale-[0.97]"
        >
          Search
        </button>
      </div>
    </form>
  );
}
