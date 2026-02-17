"use client";

import * as React from "react";

type SortOption = "rating" | "reviews" | "response" | "newest";

interface FilterChipsProps {
  categories: string[];
  selected: string | null;
  selectedCategories?: string[];
  onSelect: (category: string | null) => void;
  sortBy?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  verifiedOnly?: boolean;
  onVerifiedToggle?: () => void;
  acceptingOnly?: boolean;
  onAcceptingToggle?: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "rating", label: "Rating" },
  { value: "reviews", label: "Reviews" },
  { value: "response", label: "Response Time" },
  { value: "newest", label: "Newest" },
];

export function FilterChips({
  categories,
  selected,
  selectedCategories,
  onSelect,
  sortBy = "rating",
  onSortChange,
  verifiedOnly = false,
  onVerifiedToggle,
  acceptingOnly = false,
  onAcceptingToggle,
}: FilterChipsProps) {
  const isActive = (cat: string) => {
    if (selectedCategories && selectedCategories.length > 0) {
      return selectedCategories.includes(cat);
    }
    return selected === cat;
  };

  return (
    <div className="space-y-3">
      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelect(null)}
          className={`
            flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all
            ${selected === null && (!selectedCategories || selectedCategories.length === 0)
              ? "bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]"
              : "bg-[var(--bg-card)] border border-[var(--border)] text-slate-600 dark:text-slate-400 hover:border-[var(--border-hover)] hover:text-slate-700 dark:hover:text-slate-300"
            }
          `}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(selected === cat ? null : cat)}
            className={`
              flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all whitespace-nowrap
              ${isActive(cat)
                ? "bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "bg-[var(--bg-card)] border border-[var(--border)] text-slate-600 dark:text-slate-400 hover:border-[var(--border-hover)] hover:text-slate-700 dark:hover:text-slate-300"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary filters row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort dropdown */}
        {onSortChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Sort:</span>
            <div className="flex gap-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className={`
                    rounded-full px-2.5 py-1 text-[11px] font-medium transition-all whitespace-nowrap
                    ${sortBy === opt.value
                      ? "bg-black/5 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-black/10 dark:border-white/15"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        {onSortChange && (onVerifiedToggle || onAcceptingToggle) && (
          <div className="h-4 w-px bg-[var(--border)] hidden sm:block" />
        )}

        {/* Toggle filters */}
        {onVerifiedToggle && (
          <button
            onClick={onVerifiedToggle}
            className={`
              flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all whitespace-nowrap
              ${verifiedOnly
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5"
              }
            `}
          >
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Verified Only
          </button>
        )}

        {onAcceptingToggle && (
          <button
            onClick={onAcceptingToggle}
            className={`
              flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all whitespace-nowrap
              ${acceptingOnly
                ? "bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/20"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5"
              }
            `}
          >
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${acceptingOnly ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-600"}`} />
            Accepting Clients
          </button>
        )}
      </div>
    </div>
  );
}
