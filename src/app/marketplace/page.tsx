"use client";

import * as React from "react";
import { mockPros, serviceCategories } from "@/lib/mock-data";
import { ProCard } from "@/components/marketplace/ProCard";
import { ProPreviewPanel } from "@/components/marketplace/ProPreviewPanel";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FilterChips } from "@/components/marketplace/FilterChips";

export default function MarketplacePage() {
  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = React.useState(mockPros[0]?.slug ?? "");

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
        <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
        <p className="mt-1 text-sm text-slate-600">
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
            <div className="rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
              <div className="text-sm font-medium text-slate-700">No results found</div>
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
