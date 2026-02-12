"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { mockPros, serviceCategories } from "@/lib/mock-data";
import { ProCard } from "@/components/marketplace/ProCard";
import { ProPreviewPanel } from "@/components/marketplace/ProPreviewPanel";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FilterChips } from "@/components/marketplace/FilterChips";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = React.useState(mockPros[0]?.slug ?? "");

  // Sync if URL changes (e.g. user navigates from homepage search)
  React.useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = React.useMemo(() => {
    let results = mockPros;

    if (categoryFilter) {
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
  }, [query, categoryFilter]);

  const selected = filtered.find((p) => p.slug === selectedSlug) ?? filtered[0] ?? null;

  React.useEffect(() => {
    if (filtered.length > 0 && !filtered.find(p => p.slug === selectedSlug)) {
      setSelectedSlug(filtered[0].slug);
    }
  }, [filtered, selectedSlug]);

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
        <SearchBar value={query} onChange={setQuery} />
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
        {filtered.length} professional{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Two-column layout (Thumbtack-style) */}
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Results list */}
        <section className="space-y-3">
          {filtered.map((pro) => (
            <ProCard
              key={pro.id}
              pro={pro}
              selected={pro.slug === selectedSlug}
              onSelect={() => setSelectedSlug(pro.slug)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
              <div className="text-sm font-medium text-slate-300">No results found</div>
              <div className="mt-1 text-xs text-slate-500">Try a different search or clear filters</div>
            </div>
          )}
        </section>

        {/* Sticky preview panel (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            {selected ? <ProPreviewPanel pro={selected} /> : null}
          </div>
        </aside>
      </div>

      {/* Mobile: show preview panel below results */}
      {selected && (
        <div className="mt-6 lg:hidden">
          <ProPreviewPanel pro={selected} />
        </div>
      )}
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
