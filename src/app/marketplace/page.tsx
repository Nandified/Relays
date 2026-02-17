"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mockPros, serviceCategories } from "@/lib/mock-data";
import { type UnclaimedProfessional } from "@/lib/types";
import { ExpandableProCard } from "@/components/marketplace/ExpandableProCard";
import { ExpandableLicensedCard } from "@/components/marketplace/ExpandableLicensedCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FilterChips } from "@/components/marketplace/FilterChips";

type SortOption = "rating" | "reviews" | "response" | "newest";

const LICENSE_PAGE_SIZE = 25;

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategories = searchParams.get("categories") ?? "";
  const initialZip = searchParams.get("zip") ?? "";

  const [query, setQuery] = React.useState(initialQuery);
  const [zip, setZip] = React.useState(initialZip);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(() => {
    if (initialCategories) {
      const cats = initialCategories.split(",").map((c) => c.trim()).filter(Boolean);
      if (cats.length >= 1) return cats[0];
    }
    return null;
  });
  // Expanded card tracking
  const [mobileExpandedId, setMobileExpandedId] = React.useState<string | null>(null);

  // Granular filter state
  const [sortBy, setSortBy] = React.useState<SortOption>("rating");
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [acceptingOnly, setAcceptingOnly] = React.useState(false);

  // License data state
  const [licensedData, setLicensedData] = React.useState<UnclaimedProfessional[]>([]);
  const [licensedTotal, setLicensedTotal] = React.useState(0);
  const [licensedLoading, setLicensedLoading] = React.useState(false);
  const [licensedOffset, setLicensedOffset] = React.useState(0);
  const [licensedHasMore, setLicensedHasMore] = React.useState(true);

  // Refs
  const licenseFetchRef = React.useRef<AbortController | null>(null);

  // Multi-category support from URL
  const urlCategories = React.useMemo(() => {
    if (!initialCategories) return null;
    const cats = initialCategories.split(",").map((c) => c.trim()).filter(Boolean);
    return cats.length > 0 ? cats : null;
  }, [initialCategories]);

  // Sync if URL changes
  React.useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (q) setQuery(q);

    const cats = searchParams.get("categories") ?? "";
    if (cats) {
      const parsed = cats.split(",").map((c) => c.trim()).filter(Boolean);
      if (parsed.length >= 1) {
        setCategoryFilter(parsed[0]);
      }
    }

    const z = searchParams.get("zip") ?? "";
    if (z) setZip(z);
  }, [searchParams]);

  // Fetch license data with debounce
  const fetchLicensed = React.useCallback(async (reset: boolean = false) => {
    // Abort previous request
    if (licenseFetchRef.current) {
      licenseFetchRef.current.abort();
    }

    const controller = new AbortController();
    licenseFetchRef.current = controller;

    const offset = reset ? 0 : licensedOffset;
    setLicensedLoading(true);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (categoryFilter && categoryFilter !== "All") params.set("category", categoryFilter);
      if (zip.trim()) params.set("zip", zip.trim());
      params.set("limit", String(LICENSE_PAGE_SIZE));
      params.set("offset", String(offset));

      const res = await fetch(`/api/professionals?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const result = await res.json();

      if (reset) {
        setLicensedData(result.data);
      } else {
        setLicensedData((prev) => [...prev, ...result.data]);
      }

      setLicensedTotal(result.total);
      setLicensedOffset(offset + result.data.length);
      setLicensedHasMore(offset + result.data.length < result.total);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("[marketplace] Failed to fetch license data:", err);
    } finally {
      setLicensedLoading(false);
    }
  }, [query, categoryFilter, zip, licensedOffset]);

  // Total professional count (fetch once on mount for display)
  const [totalProfessionals, setTotalProfessionals] = React.useState(0);
  React.useEffect(() => {
    fetch("/api/professionals?limit=0").then(r => r.json()).then(d => setTotalProfessionals(d.total)).catch(() => {});
  }, []);

  // Whether user has an active search or filter (not just browsing empty)
  const hasActiveFilter = !!(query.trim() || (categoryFilter && categoryFilter !== "All") || zip.trim());

  // Initial fetch + refetch on filter changes (debounced)
  // Only fetch license data when user has searched/filtered
  React.useEffect(() => {
    if (!hasActiveFilter) {
      // Clear license data when no active search — show just demo pros
      setLicensedData([]);
      setLicensedTotal(0);
      setLicensedOffset(0);
      setLicensedHasMore(false);
      return;
    }

    const timeout = setTimeout(() => {
      setLicensedOffset(0);
      setLicensedHasMore(true);
      fetchLicensed(true);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryFilter, zip, hasActiveFilter]);

  const filteredPros = React.useMemo(() => {
    let results = [...mockPros];

    if (urlCategories && urlCategories.length > 1) {
      results = results.filter((p) =>
        p.categories.some((c) => urlCategories.includes(c))
      );
    } else if (categoryFilter) {
      results = results.filter((p) => p.categories.includes(categoryFilter as never));
    }

    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter((p) =>
        [p.name, p.companyName, ...p.categories, ...p.serviceAreas]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (verifiedOnly) {
      results = results.filter((p) => p.verified);
    }
    if (acceptingOnly) {
      results = results.filter((p) => p.availability === "accepting");
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case "rating": return b.rating - a.rating;
        case "reviews": return b.reviewCount - a.reviewCount;
        case "response": return (a.responseTimeMinutes ?? 9999) - (b.responseTimeMinutes ?? 9999);
        case "newest": return b.id.localeCompare(a.id);
        default: return 0;
      }
    });

    return results;
  }, [query, categoryFilter, urlCategories, sortBy, verifiedOnly, acceptingOnly]);

  // Handlers
  const handleSearchSelectLicensed = React.useCallback((professional: UnclaimedProfessional) => {
    router.push(`/pros/${professional.slug}`);
  }, [router]);

  const handleMobileToggle = React.useCallback((id: string) => {
    setMobileExpandedId((prev) => prev === id ? null : id);
  }, []);

  // Active filter labels
  const activeFilterLabels = React.useMemo(() => {
    const labels: string[] = [];
    if (urlCategories && urlCategories.length > 1) {
      labels.push(...urlCategories);
    } else if (categoryFilter) {
      labels.push(categoryFilter);
    }
    return labels;
  }, [categoryFilter, urlCategories]);

  // Loading shimmer for licensed professional cards
  const LicensedLoadingShimmer = () => (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/60 p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="h-[52px] w-[52px] rounded-2xl bg-black/5 dark:bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-black/5 dark:bg-white/5" />
              <div className="h-3 w-56 rounded bg-black/[0.03] dark:bg-white/[0.03]" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-black/[0.03] dark:bg-white/[0.03]" />
                <div className="h-5 w-20 rounded-full bg-black/[0.03] dark:bg-white/[0.03]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const hasAnyResults = filteredPros.length > 0 || licensedData.length > 0;

  return (
    <main className="mx-auto max-w-6xl overflow-x-hidden px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Find Your Professional
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg">
          Browse verified professionals for every step of your home journey.
        </p>
      </div>

      {/* Search */}
      <div className="mb-3 sm:mb-5 max-w-2xl mx-auto sm:mx-0">
        <SearchBar
          value={query}
          onChange={setQuery}
          zip={zip}
          onZipChange={setZip}
        />
      </div>

      {/* Filters */}
      <div className="mb-3 sm:mb-5">
        <FilterChips
          categories={[...serviceCategories]}
          selected={categoryFilter}
          selectedCategories={urlCategories && urlCategories.length > 1 ? urlCategories : undefined}
          onSelect={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          verifiedOnly={verifiedOnly}
          onVerifiedToggle={() => setVerifiedOnly((v) => !v)}
          acceptingOnly={acceptingOnly}
          onAcceptingToggle={() => setAcceptingOnly((v) => !v)}
        />
      </div>

      {/* Results count */}
      <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-500">
        <span>
          {hasActiveFilter ? (
            <>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {(filteredPros.length + licensedTotal).toLocaleString()}
              </span>
              {" "}result{(filteredPros.length + licensedTotal) !== 1 ? "s" : ""}
              {zip.trim() ? ` near ${zip.trim()}` : ""}
            </>
          ) : (
            <>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {filteredPros.length}
              </span>
              {" "}featured professional{filteredPros.length !== 1 ? "s" : ""}
            </>
          )}
        </span>
        {activeFilterLabels.length > 0 && (
          <span>
            · Filtered by:{" "}
            {activeFilterLabels.map((label, i) => (
              <span key={label}>
                <span className="text-blue-600 dark:text-blue-400/80">{label}</span>
                {i < activeFilterLabels.length - 1 && ", "}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* Two-column: cards left, sidebar right (desktop) */}
      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
        {/* Card list */}
        <div className="min-w-0">
          <div className="flex flex-col gap-1.5">
            {/* Relays pros */}
            {filteredPros.length > 0 ? (
              filteredPros.map((pro) => (
                <ExpandableProCard
                  key={pro.id}
                  pro={pro}
                  expanded={mobileExpandedId === pro.id}
                  onToggle={() => handleMobileToggle(pro.id)}
                />
              ))
            ) : !hasAnyResults && !licensedLoading ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">No results found</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-500">Try a different search or clear filters</div>
              </div>
            ) : null}

            {/* Licensed professional cards */}
            {licensedData.map((prof) => (
              <ExpandableLicensedCard
                key={prof.id}
                professional={prof}
                expanded={mobileExpandedId === prof.id}
                onToggle={() => handleMobileToggle(prof.id)}
              />
            ))}

            {/* Licensed professional data loading */}
            {licensedLoading && <LicensedLoadingShimmer />}

            {/* Show more button */}
            {licensedHasMore && !licensedLoading && (
              <div className="py-4 text-center">
                <button
                  onClick={() => fetchLicensed(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] dark:border-white/[0.1] bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-lg px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.08] hover:border-black/[0.15] dark:border-white/[0.15] hover:text-slate-900 dark:hover:text-slate-100 transition-all"
                >
                  Show more results
                  <span className="text-xs text-slate-600 dark:text-slate-500">
                    ({licensedData.length} of {licensedTotal.toLocaleString()})
                  </span>
                </button>
              </div>
            )}

            {/* Browse prompt when no search is active */}
            {!hasActiveFilter && !licensedLoading && (
              <div className="mt-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] p-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Search by name or filter by category to browse{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {totalProfessionals > 0 ? `${totalProfessionals.toLocaleString()}` : "thousands of"}
                  </span>{" "}
                  licensed professionals in Illinois
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — hidden on mobile, sticky on desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            {/* How It Works */}
            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-lg p-5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">How Relays Works</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">1</div>
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Browse professionals</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-500 mt-0.5">Find verified realtors, lenders, attorneys, and more.</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">2</div>
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Build your team</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-500 mt-0.5">Add pros to your home journey. One place, all your people.</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">3</div>
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Get connected</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-500 mt-0.5">Request bookings and communicate directly.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro CTA */}
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-sm font-semibold text-emerald-400">Are you a professional?</h3>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-500 leading-relaxed mb-3">
                Claim your free profile to appear in search results, receive referrals, and grow your business.
              </p>
              <a
                href="/pro/onboarding"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Get started free
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Quick tip */}
            <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">💡</span>
                <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Quick Tip</h3>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-500 leading-relaxed">
                Look for professionals with the <span className="text-emerald-400 font-medium">✓ Verified</span> badge — they&apos;ve submitted their credentials for review.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function MarketplacePage() {
  return (
    <React.Suspense fallback={
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <div className="h-8 w-48 rounded-xl bg-[var(--bg-card)] animate-pulse" />
          <div className="mt-2 h-4 w-80 rounded-lg bg-[var(--bg-card)] animate-pulse" />
        </div>
        <div className="mb-4 h-12 rounded-3xl bg-[var(--bg-card)] animate-pulse max-w-2xl" />
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-[var(--bg-card)] animate-pulse" />
          ))}
        </div>
      </main>
    }>
      <MarketplaceContent />
    </React.Suspense>
  );
}
