"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mockPros, serviceCategories } from "@/lib/mock-data";
import { getAllPlaces, type PlacesResult } from "@/lib/google-places";
import { type Pro, type UnclaimedProfessional } from "@/lib/types";
import { ProCard } from "@/components/marketplace/ProCard";
import { ProPreviewPanel } from "@/components/marketplace/ProPreviewPanel";
import { GooglePlacesCard } from "@/components/marketplace/GooglePlacesCard";
import { GooglePlacesPreview } from "@/components/marketplace/GooglePlacesPreview";
import { IdfprCard } from "@/components/marketplace/IdfprCard";
import { IdfprPreviewPanel } from "@/components/marketplace/IdfprPreviewPanel";
import { ExpandableProCard } from "@/components/marketplace/ExpandableProCard";
import { ExpandableGooglePlacesCard } from "@/components/marketplace/ExpandableGooglePlacesCard";
import { ExpandableIdfprCard } from "@/components/marketplace/ExpandableIdfprCard";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FilterChips } from "@/components/marketplace/FilterChips";

type SelectedItem =
  | { type: "pro"; slug: string }
  | { type: "places"; placeId: string }
  | { type: "idfpr"; id: string };

type SortOption = "rating" | "reviews" | "response" | "newest";

const IDFPR_PAGE_SIZE = 50;

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategories = searchParams.get("categories") ?? "";
  const initialPlaceId = searchParams.get("placeId") ?? "";
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

  // IDFPR data state
  const [idfprData, setIdfprData] = React.useState<UnclaimedProfessional[]>([]);
  const [idfprTotal, setIdfprTotal] = React.useState(0);
  const [idfprLoading, setIdfprLoading] = React.useState(false);
  const [idfprOffset, setIdfprOffset] = React.useState(0);
  const [idfprHasMore, setIdfprHasMore] = React.useState(true);

  // Refs for scrolling
  const placeCardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
  const idfprFetchRef = React.useRef<AbortController | null>(null);

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

  // Fetch IDFPR data with debounce
  const fetchIdfpr = React.useCallback(async (reset: boolean = false) => {
    // Abort previous request
    if (idfprFetchRef.current) {
      idfprFetchRef.current.abort();
    }

    const controller = new AbortController();
    idfprFetchRef.current = controller;

    const offset = reset ? 0 : idfprOffset;
    setIdfprLoading(true);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (categoryFilter && categoryFilter !== "All") params.set("category", categoryFilter);
      if (zip.trim()) params.set("zip", zip.trim());
      params.set("limit", String(IDFPR_PAGE_SIZE));
      params.set("offset", String(offset));

      const res = await fetch(`/api/professionals?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const result = await res.json();

      if (reset) {
        setIdfprData(result.data);
      } else {
        setIdfprData((prev) => [...prev, ...result.data]);
      }

      setIdfprTotal(result.total);
      setIdfprOffset(offset + result.data.length);
      setIdfprHasMore(offset + result.data.length < result.total);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("[marketplace] Failed to fetch IDFPR data:", err);
    } finally {
      setIdfprLoading(false);
    }
  }, [query, categoryFilter, zip, idfprOffset]);

  // Initial fetch + refetch on filter changes (debounced)
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIdfprOffset(0);
      setIdfprHasMore(true);
      fetchIdfpr(true);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, categoryFilter, zip]);

  // Infinite scroll observer
  React.useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && idfprHasMore && !idfprLoading) {
          fetchIdfpr(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [idfprHasMore, idfprLoading, fetchIdfpr]);

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

  const filteredPlaces = React.useMemo(() => {
    let results = placesData;

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
        [p.name, p.address, ...p.categories].join(" ").toLowerCase().includes(q)
      );
    }

    return results;
  }, [query, categoryFilter, urlCategories, placesData]);

  // Find selected items
  const selectedPro = selected.type === "pro"
    ? (filteredPros.find((p) => p.slug === (selected as { type: "pro"; slug: string }).slug) ?? filteredPros[0] ?? null)
    : null;
  const selectedPlace = selected.type === "places"
    ? (filteredPlaces.find((p) => p.placeId === (selected as { type: "places"; placeId: string }).placeId) ?? null)
    : null;
  const selectedIdfpr = selected.type === "idfpr"
    ? (idfprData.find((p) => p.id === (selected as { type: "idfpr"; id: string }).id) ?? null)
    : null;

  // Auto-select first pro if current selection not found
  React.useEffect(() => {
    if (selected.type === "pro" && filteredPros.length > 0 && !filteredPros.find(p => p.slug === (selected as { type: "pro"; slug: string }).slug)) {
      setSelected({ type: "pro", slug: filteredPros[0].slug });
    }
  }, [filteredPros, selected]);

  // Scroll to highlighted place
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

  // Handlers
  const handleSearchSelectPro = React.useCallback((pro: Pro) => {
    setSelected({ type: "pro", slug: pro.slug });
    setMobileExpandedId(pro.id);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }, []);

  const handleSearchSelectIdfpr = React.useCallback((professional: UnclaimedProfessional) => {
    router.push(`/pros/${professional.slug}`);
  }, [router]);

  const handleSearchSelectPlace = React.useCallback((place: PlacesResult) => {
    setSelected({ type: "places", placeId: place.placeId });
    setHighlightedPlaceId(place.placeId);
    setMobileExpandedId(place.placeId);
  }, []);

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

  // Section divider component
  const SectionDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 whitespace-nowrap">
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-60">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] via-[var(--border)] to-transparent" />
    </div>
  );

  // Loading shimmer for IDFPR cards
  const IdfprLoadingShimmer = () => (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-card)]/60 p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="h-[52px] w-[52px] rounded-2xl bg-white/5" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-white/5" />
              <div className="h-3 w-56 rounded bg-white/[0.03]" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-white/[0.03]" />
                <div className="h-5 w-20 rounded-full bg-white/[0.03]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const hasAnyResults = filteredPros.length > 0 || idfprData.length > 0 || filteredPlaces.length > 0;

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
          onSelectIdfpr={handleSearchSelectIdfpr}
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
          <span className="font-medium text-slate-300">
            {(filteredPros.length + idfprTotal + filteredPlaces.length).toLocaleString()}
          </span>
          {" "}professional{(filteredPros.length + idfprTotal + filteredPlaces.length) !== 1 ? "s" : ""}
          {zip.trim() ? ` near ${zip.trim()}` : ""}
        </span>
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

      {/* Mobile: flat list */}
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
          ) : !hasAnyResults && !idfprLoading ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
              <div className="text-sm font-medium text-slate-300">No results found</div>
              <div className="mt-1 text-xs text-slate-500">Try a different search or clear filters</div>
            </div>
          ) : null}

          {/* IDFPR divider */}
          {idfprData.length > 0 && <SectionDivider label="Licensed professionals" />}

          {/* IDFPR cards */}
          {idfprData.map((prof) => (
            <ExpandableIdfprCard
              key={prof.id}
              professional={prof}
              expanded={mobileExpandedId === prof.id}
              onToggle={() => handleMobileToggle(prof.id)}
            />
          ))}

          {/* IDFPR loading */}
          {idfprLoading && <IdfprLoadingShimmer />}

          {/* Google Places divider */}
          {filteredPlaces.length > 0 && (filteredPros.length > 0 || idfprData.length > 0) && <SectionDivider label="More professionals nearby" />}

          {/* Google Places cards */}
          {filteredPlaces.map((place) => (
            <ExpandableGooglePlacesCard
              key={place.placeId}
              place={place}
              expanded={mobileExpandedId === place.placeId}
              onToggle={() => handleMobileToggle(place.placeId)}
            />
          ))}

          {/* Infinite scroll trigger */}
          {idfprHasMore && <div ref={loadMoreRef} className="h-4" />}
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
          ) : !hasAnyResults && !idfprLoading ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
              <div className="text-sm font-medium text-slate-300">No results found</div>
              <div className="mt-1 text-xs text-slate-500">Try a different search or clear filters</div>
            </div>
          ) : null}

          {/* IDFPR divider */}
          {idfprData.length > 0 && <SectionDivider label="Licensed professionals" />}

          {/* IDFPR cards */}
          {idfprData.map((prof) => (
            <IdfprCard
              key={prof.id}
              professional={prof}
              selected={selected.type === "idfpr" && (selected as { type: "idfpr"; id: string }).id === prof.id}
              onSelect={() => setSelected({ type: "idfpr", id: prof.id })}
            />
          ))}

          {/* IDFPR loading */}
          {idfprLoading && <IdfprLoadingShimmer />}

          {/* Google Places divider */}
          {filteredPlaces.length > 0 && (filteredPros.length > 0 || idfprData.length > 0) && <SectionDivider label="More professionals nearby" />}

          {/* Google Places cards */}
          {filteredPlaces.map((place) => (
            <GooglePlacesCard
              key={place.placeId}
              place={place}
              selected={selected.type === "places" && (selected as { type: "places"; placeId: string }).placeId === place.placeId}
              onSelect={() => setSelected({ type: "places", placeId: place.placeId })}
            />
          ))}

          {/* Infinite scroll trigger */}
          {idfprHasMore && <div ref={loadMoreRef} className="h-4" />}
        </section>

        <aside>
          <div className="sticky top-20">
            {selectedPro && <ProPreviewPanel pro={selectedPro} />}
            {selectedPlace && <GooglePlacesPreview place={selectedPlace} />}
            {selectedIdfpr && <IdfprPreviewPanel professional={selectedIdfpr} />}
            {!selectedPro && !selectedPlace && !selectedIdfpr && idfprData.length > 0 && (
              <IdfprPreviewPanel professional={idfprData[0]} />
            )}
            {!selectedPro && !selectedPlace && !selectedIdfpr && idfprData.length === 0 && filteredPlaces.length > 0 && (
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
