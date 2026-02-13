"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { mockPros, serviceCategories } from "@/lib/mock-data";
import { getAllPlaces, type PlacesResult } from "@/lib/google-places";
import { type Pro } from "@/lib/types";
import { ProCard } from "@/components/marketplace/ProCard";
import { ProPreviewPanel } from "@/components/marketplace/ProPreviewPanel";
import { GooglePlacesCard } from "@/components/marketplace/GooglePlacesCard";
import { GooglePlacesPreview } from "@/components/marketplace/GooglePlacesPreview";
import { ExpandableProCard } from "@/components/marketplace/ExpandableProCard";
import { ExpandableGooglePlacesCard } from "@/components/marketplace/ExpandableGooglePlacesCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FilterChips } from "@/components/marketplace/FilterChips";

type SelectedItem =
  | { type: "pro"; slug: string }
  | { type: "places"; placeId: string };

type SortOption = "rating" | "reviews" | "response" | "newest";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategories = searchParams.get("categories") ?? "";
  const initialPlaceId = searchParams.get("placeId") ?? "";
  const initialZip = searchParams.get("zip") ?? "";

  const [query, setQuery] = React.useState(initialQuery);
  const [zip, setZip] = React.useState(initialZip);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(() => {
    if (initialCategories) {
      const cats = initialCategories.split(",").map((c) => c.trim()).filter(Boolean);
      if (cats.length === 1) return cats[0];
      // For multiple categories, we handle via urlCategories
      if (cats.length > 1) return cats[0];
    }
    return null;
  });
  const [selected, setSelected] = React.useState<SelectedItem>(() => {
    if (initialPlaceId) {
      return { type: "places", placeId: initialPlaceId };
    }
    return { type: "pro", slug: mockPros[0]?.slug ?? "" };
  });
  const [highlightedPlaceId, setHighlightedPlaceId] = React.useState<string | null>(initialPlaceId || null);

  // Mobile expanded card tracking
  const [mobileExpandedId, setMobileExpandedId] = React.useState<string | null>(null);

  // Granular filter state
  const [sortBy, setSortBy] = React.useState<SortOption>("rating");
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [acceptingOnly, setAcceptingOnly] = React.useState(false);

  // Refs for scrolling to Google Places cards
  const placeCardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // Google Places data
  const placesData = React.useMemo(() => getAllPlaces(), []);

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

    const placeId = searchParams.get("placeId") ?? "";
    if (placeId) {
      setSelected({ type: "places", placeId });
      setHighlightedPlaceId(placeId);
    }
  }, [searchParams]);

  const filteredPros = React.useMemo(() => {
    let results = [...mockPros];

    // Multi-category filtering from URL
    if (urlCategories && urlCategories.length > 1) {
      results = results.filter((p) =>
        p.categories.some((c) => urlCategories.includes(c))
      );
    } else if (categoryFilter) {
      results = results.filter((p) => p.categories.includes(categoryFilter as never));
    }

    // Text search
    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter((p) =>
        [p.name, p.companyName, ...p.categories, ...p.serviceAreas]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    // Verified filter
    if (verifiedOnly) {
      results = results.filter((p) => p.verified);
    }

    // Accepting clients filter
    if (acceptingOnly) {
      results = results.filter((p) => p.availability === "accepting");
    }

    // Sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "response":
          return (a.responseTimeMinutes ?? 9999) - (b.responseTimeMinutes ?? 9999);
        case "newest":
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return results;
  }, [query, categoryFilter, urlCategories, sortBy, verifiedOnly, acceptingOnly]);

  const filteredPlaces = React.useMemo(() => {
    let results = placesData;

    // Multi-category filtering
    if (urlCategories && urlCategories.length > 1) {
      results = results.filter((p) =>
        p.categories.some((c) => urlCategories.some((cat) => c.toLowerCase().includes(cat.toLowerCase())))
      );
    } else if (categoryFilter) {
      results = results.filter((p) =>
        p.categories.some((c) => c.toLowerCase().includes(categoryFilter.toLowerCase()))
      );
    }

    const q = query.trim().toLowerCase();
    if (q) {
      results = results.filter((p) =>
        [p.name, p.address, ...p.categories]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return results;
  }, [query, categoryFilter, urlCategories, placesData]);

  // Find the selected pro or place
  const selectedPro = selected.type === "pro"
    ? (filteredPros.find((p) => p.slug === selected.slug) ?? filteredPros[0] ?? null)
    : null;
  const selectedPlace = selected.type === "places"
    ? (filteredPlaces.find((p) => p.placeId === (selected as { type: "places"; placeId: string }).placeId) ?? null)
    : null;

  // Auto-select first pro if current selection not found
  React.useEffect(() => {
    if (selected.type === "pro" && filteredPros.length > 0 && !filteredPros.find(p => p.slug === (selected as { type: "pro"; slug: string }).slug)) {
      setSelected({ type: "pro", slug: filteredPros[0].slug });
    }
  }, [filteredPros, selected]);

  // Scroll to and highlight placeId from URL
  React.useEffect(() => {
    if (!highlightedPlaceId) return;

    const timeout = setTimeout(() => {
      const el = placeCardRefs.current[highlightedPlaceId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const clearTimeout2 = setTimeout(() => {
        setHighlightedPlaceId(null);
      }, 2000);

      return () => clearTimeout(clearTimeout2);
    }, 400);

    return () => clearTimeout(timeout);
  }, [highlightedPlaceId]);

  // Handle suggestion selection from search bar
  const handleSearchSelectPro = React.useCallback((pro: Pro) => {
    setSelected({ type: "pro", slug: pro.slug });
    setMobileExpandedId(pro.id);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }, []);

  const handleSearchSelectPlace = React.useCallback((place: PlacesResult) => {
    setSelected({ type: "places", placeId: place.placeId });
    setHighlightedPlaceId(place.placeId);
    setMobileExpandedId(place.placeId);
  }, []);

  // Mobile toggle handler
  const handleMobileToggle = React.useCallback((id: string) => {
    setMobileExpandedId((prev) => prev === id ? null : id);
  }, []);

  // Build active filter label
  const activeFilterLabels = React.useMemo(() => {
    const labels: string[] = [];
    if (urlCategories && urlCategories.length > 1) {
      labels.push(...urlCategories);
    } else if (categoryFilter) {
      labels.push(categoryFilter);
    }
    return labels;
  }, [categoryFilter, urlCategories]);

  return (
    <main className="mx-auto max-w-6xl overflow-x-hidden px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 text-center sm:text-left">
        <h1 className="text-xl sm:text-3xl font-bold text-slate-100">
          Find Your Professional
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-lg">
          Browse verified professionals for every step of your home journey.
        </p>
      </div>

      {/* Search */}
      <div className="mb-3 sm:mb-5 max-w-2xl mx-auto sm:mx-0">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSelectPro={handleSearchSelectPro}
          onSelectPlace={handleSearchSelectPlace}
          categoryFilter={categoryFilter}
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
      <div className="mb-2 sm:mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-500">
        <span>
          <span className="font-medium text-slate-300">{filteredPros.length}</span>
          {" "}professional{filteredPros.length !== 1 ? "s" : ""} on Relays
        </span>
        {filteredPlaces.length > 0 && (
          <span>
            · <span className="font-medium text-slate-300">{filteredPlaces.length}</span> more from Google
          </span>
        )}
        {activeFilterLabels.length > 0 && (
          <span>
            · Filtered by:{" "}
            {activeFilterLabels.map((label, i) => (
              <span key={label}>
                <span className="text-blue-400/80">{label}</span>
                {i < activeFilterLabels.length - 1 && ", "}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* Mobile: flat list (no grid) */}
      <div className="lg:hidden">
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
          ) : filteredPlaces.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
              <div className="text-sm font-medium text-slate-300">No results found</div>
              <div className="mt-1 text-xs text-slate-500">Try a different search or clear filters</div>
            </div>
          ) : null}

          {/* No Relays pros but Google results exist */}
          {filteredPros.length === 0 && filteredPlaces.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 px-5 py-4 text-center">
              <p className="text-sm text-slate-400">No Relays professionals match your search.</p>
              <p className="mt-1 text-xs text-slate-500">Here are some we found nearby:</p>
            </div>
          )}

          {/* Google Places divider */}
          {filteredPlaces.length > 0 && filteredPros.length > 0 && (
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 whitespace-nowrap">
                <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-60">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                More professionals nearby
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] via-[var(--border)] to-transparent" />
            </div>
          )}

          {/* Google Places cards */}
          {filteredPlaces.map((place) => (
            <ExpandableGooglePlacesCard
              key={place.placeId}
              place={place}
              expanded={mobileExpandedId === place.placeId}
              onToggle={() => handleMobileToggle(place.placeId)}
            />
          ))}
        </div>
      </div>

      {/* Desktop: two-column grid with preview panel */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_380px] gap-4">
        <section className="min-w-0 space-y-2">
          {filteredPros.length > 0 ? (
            filteredPros.map((pro) => (
              <ProCard
                key={pro.id}
                pro={pro}
                selected={selected.type === "pro" && (selected as { type: "pro"; slug: string }).slug === pro.slug}
                onSelect={() => setSelected({ type: "pro", slug: pro.slug })}
              />
            ))
          ) : filteredPlaces.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
              <div className="text-sm font-medium text-slate-300">No results found</div>
              <div className="mt-1 text-xs text-slate-500">Try a different search or clear filters</div>
            </div>
          ) : null}

          {filteredPros.length === 0 && filteredPlaces.length > 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/60 px-5 py-4 text-center">
              <p className="text-sm text-slate-400">No Relays professionals match your search.</p>
              <p className="mt-1 text-xs text-slate-500">Here are some we found nearby:</p>
            </div>
          )}

          {filteredPlaces.length > 0 && filteredPros.length > 0 && (
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 whitespace-nowrap">
                <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-60">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                More professionals nearby
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] via-[var(--border)] to-transparent" />
            </div>
          )}

          {filteredPlaces.map((place) => (
            <GooglePlacesCard
              key={place.placeId}
              place={place}
              selected={selected.type === "places" && (selected as { type: "places"; placeId: string }).placeId === place.placeId}
              onSelect={() => setSelected({ type: "places", placeId: place.placeId })}
            />
          ))}
        </section>

        <aside>
          <div className="sticky top-20">
            {selectedPro && <ProPreviewPanel pro={selectedPro} />}
            {selectedPlace && <GooglePlacesPreview place={selectedPlace} />}
            {!selectedPro && !selectedPlace && filteredPros.length === 0 && filteredPlaces.length > 0 && (
              <GooglePlacesPreview place={filteredPlaces[0]} />
            )}
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
