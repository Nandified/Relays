"use client";

import * as React from "react";
import { mockPros } from "@/lib/mock-data";
import { ProCard } from "@/components/marketplace/ProCard";
import { ProPreviewPanel } from "@/components/marketplace/ProPreviewPanel";

export default function MarketplacePage() {
  const [query, setQuery] = React.useState("");
  const [selectedSlug, setSelectedSlug] = React.useState(mockPros[0]?.slug ?? "");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockPros;
    return mockPros.filter((p) =>
      [p.name, p.companyName, p.categories.join(" ")].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  const selected = filtered.find((p) => p.slug === selectedSlug) ?? filtered[0];

  React.useEffect(() => {
    if (selected && selected.slug !== selectedSlug) setSelectedSlug(selected.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">Marketplace</div>
        <div className="mt-1 text-sm text-slate-600">
          Search by the service you need. Browse is public — actions prompt account.
        </div>
      </div>

      <div className="mb-4">
        <input
          className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What service do you need? (inspection, lender, insurance…)"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {filtered.map((pro) => (
            <ProCard
              key={pro.id}
              pro={pro}
              selected={pro.slug === selectedSlug}
              onSelect={() => setSelectedSlug(pro.slug)}
            />
          ))}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600">
              No results yet — try a different service.
            </div>
          ) : null}
        </section>

        <aside className="md:sticky md:top-24 md:h-fit">
          {selected ? <ProPreviewPanel pro={selected} /> : null}
        </aside>
      </div>
    </main>
  );
}
