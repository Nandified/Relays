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
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FilterChips } from "@/components/marketplace/FilterChips";

type SelectedItem =
  | { type: "pro"; slug: string }
  | { type: "places"; placeId: string };

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategories = searchParams.get("categories") ?? "";
  const initialPlaceId = searchParams.get("placeId") ?? "";

  const [query, setQuery] = React.useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(() => {
    if (initialCategories) {
      const cats = initialCategories.split(",").map((c) => c.trim()).filter(Boolean);
      if (cats.length >= 1) return cats[0];
    }
    return null;
  });
  const [selected, setSelected] = React.useState<SelectedItem>(() => {
    // If placeId in URL, select that place immediately
    if (initialPlaceId) {
      return { type: "places", placeId: initialPlaceId };
    }
    return { type: "pro", slug: mockPros[0]?.slug ?? "" };
  });
  const [highlightedPlaceId, setHighlightedPlaceId] = React.useState<string | null>(initialPlaceId || null);

  // Refs for scrolling to Google Places cards
  const placeCardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // Google Places data
  const placesData = React.useMemo(() => getAllPlaces(), []);

  // Additional categories from URL (for multi-category filtering)
  const urlCategories = React.useMemo(() => {
    if (!initialCategories) return null;
    const cats = initialCategories.split(",").map((c) => c.trim()).filter(Boolean);
    return cats.length > 0 ? cats : null;
  }, [initialCategories]);

  // Sync if URL changes (e.g. user navigates from homepage search)
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

    const placeId = searchParams.get("placeId") ?? "";
    if (placeId) {
      setSelected({ type: "places", placeId });
      setHighlightedPlaceId(placeId);
    }
  }, [searchParams]);

  const filteredPros = React.useMemo(() => {
    let results = mockPros;

    if (urlCategories && urlCategories.length > 1 && categoryFilter === urlCategories[0]) {
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

    return results;
  }, [query, categoryFilter, urlCategories]);

  const filteredPlaces = React.useMemo(() => {
    let results = placesData;

    if (categoryFilter) {
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
  }, [query, categoryFilter, placesData]);

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

    // Small delay to let cards render
    const timeout = setTimeout(() => {
      const el = placeCardRefs.current[highlightedPlaceId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Clear highlight after animation
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
    // Scroll to the pro card area
    window.scrollTo({ top: 300, behavior: "smooth" });
  }, []);

  const handleSearchSelectPlace = React.useCallback((place: PlacesResult) => {
    setSelected({ type: "places", placeId: place.placeId });
    setHighlightedPlaceId(place.placeId);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Marketplace</h1>
        <p className="mt-1 text-sm text-slate-400">
          Find verified professionals for your home journey. Browse freely — actions require an account.
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSelectPro={handleSearchSelectPro}
          onSelectPlace={handleSearchSelectPlace}
          categoryFilter={categoryFilter}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterChips
          categories={[...serviceCategories]}
          selected={categoryFilter}
          onSelect={setCategoryFilter}
        />
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-slate-500">
        {filteredPros.length} professional{filteredPros.length !== 1 ? "s" : ""} on Relays
        {filteredPlaces.length > 0 && (
          <span> · {filteredPlaces.length} more found nearby</span>
        )}
      </div>

      {/* Two-column layout (Thumbtack-style) */}
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Results list */}
        <section className="space-y-3">
          {/* Relays pros */}
          {filteredPros.map((pro) => (
            <ProCard
              key={pro.id}
              pro={pro}
              selected={selected.type === "pro" && (selected as { type: "pro"; slug: string }).slug === pro.slug}
              onSelect={() => setSelected({ type: "pro", slug: pro.slug })}
            />
          ))}
          {filteredPros.length === 0 && filteredPlaces.length === 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
              <div className="text-sm font-medium text-slate-300">No results found</div>
              <div className="mt-1 text-xs text-slate-500">Try a different search or clear filters</div>
            </div>
          )}

          {/* Google Places divider & results */}
          {filteredPlaces.length > 0 && (
            <>
              <div className="flex items-center gap-3 py-3">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  More professionals in your area
                </span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              {filteredPlaces.map((place) => (
                <div
                  key={place.placeId}
                  ref={(el) => { placeCardRefs.current[place.placeId] = el; }}
                  className={highlightedPlaceId === place.placeId ? "animate-highlight-pulse rounded-2xl" : ""}
                >
                  <GooglePlacesCard
                    place={place}
                    selected={selected.type === "places" && (selected as { type: "places"; placeId: string }).placeId === place.placeId}
                    onSelect={() => setSelected({ type: "places", placeId: place.placeId })}
                  />
                </div>
              ))}
            </>
          )}
        </section>

        {/* Sticky preview panel (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            {selectedPro && <ProPreviewPanel pro={selectedPro} />}
            {selectedPlace && <GooglePlacesPreview place={selectedPlace} />}
            {!selectedPro && !selectedPlace && filteredPros.length === 0 && filteredPlaces.length > 0 && (
              <GooglePlacesPreview place={filteredPlaces[0]} />
            )}
          </div>
        </aside>
      </div>

      {/* Mobile: show preview panel below results */}
      <div className="mt-6 lg:hidden">
        {selectedPro && <ProPreviewPanel pro={selectedPro} />}
        {selectedPlace && <GooglePlacesPreview place={selectedPlace} />}
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
      </main>
    }>
      <MarketplaceContent />
    </React.Suspense>
  );
}
