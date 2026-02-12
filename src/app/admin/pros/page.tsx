"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { mockPros, serviceCategories } from "@/lib/mock-data";
import { getAllPlaces, type PlacesResult } from "@/lib/google-places";
import { type Pro } from "@/lib/types";

type ProListItem =
  | { type: "relays"; pro: Pro }
  | { type: "places"; place: PlacesResult };

export default function AdminProsPage() {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [sourceFilter, setSourceFilter] = React.useState<string>("all");
  const [selectedItem, setSelectedItem] = React.useState<ProListItem | null>(null);

  const placesData = React.useMemo(() => getAllPlaces(), []);

  // Combine all sources
  const allItems: ProListItem[] = React.useMemo(() => {
    const relays: ProListItem[] = mockPros.map(pro => ({ type: "relays" as const, pro }));
    const places: ProListItem[] = placesData.map(place => ({ type: "places" as const, place }));
    return [...relays, ...places];
  }, [placesData]);

  const filtered = React.useMemo(() => {
    let items = allItems;

    // Source filter
    if (sourceFilter === "relays") items = items.filter(i => i.type === "relays");
    if (sourceFilter === "google") items = items.filter(i => i.type === "places");

    // Category filter
    if (categoryFilter !== "all") {
      items = items.filter(i => {
        const cats = i.type === "relays" ? i.pro.categories : i.place.categories;
        return cats.some(c => c === categoryFilter);
      });
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(i => {
        if (i.type === "relays") {
          return [i.pro.name, i.pro.companyName, ...i.pro.categories, ...i.pro.serviceAreas]
            .join(" ").toLowerCase().includes(q);
        }
        return [i.place.name, i.place.address, ...i.place.categories]
          .join(" ").toLowerCase().includes(q);
      });
    }

    return items;
  }, [allItems, search, categoryFilter, sourceFilter]);

  const sourceTabs = [
    { id: "all", label: "All", count: allItems.length },
    { id: "relays", label: "Relays", count: allItems.filter(i => i.type === "relays").length },
    { id: "google", label: "Google Places", count: allItems.filter(i => i.type === "places").length },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Pro Management</h1>
        <p className="mt-1 text-sm text-slate-400">
          View and manage all professionals — both Relays-registered and Google Places sourced.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        <Tabs tabs={sourceTabs} activeId={sourceFilter} onChange={setSourceFilter} />

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by name, company, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
          >
            <option value="all">All Categories</option>
            {serviceCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-slate-500">
        {filtered.length} professional{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_140px_120px_100px_90px] gap-3 items-center border-b border-[var(--border)] bg-white/[0.02] px-4 py-2.5">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Professional</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Category</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Source</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Rating</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Status</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((item) => {
            const name = item.type === "relays" ? item.pro.name : item.place.name;
            const company = item.type === "relays" ? item.pro.companyName : item.place.address;
            const categories = item.type === "relays" ? item.pro.categories : item.place.categories;
            const rating = item.type === "relays" ? item.pro.rating : item.place.rating;
            const reviewCount = item.type === "relays" ? item.pro.reviewCount : item.place.reviewCount;
            const verified = item.type === "relays" ? item.pro.verified : false;
            const claimed = item.type === "places" ? item.place.claimed : true;
            const key = item.type === "relays" ? item.pro.id : item.place.placeId;

            return (
              <button
                key={key}
                className="w-full text-left px-4 py-3 hover:bg-white/[0.02] transition-colors"
                onClick={() => setSelectedItem(item)}
              >
                <div className="sm:grid sm:grid-cols-[1fr_140px_120px_100px_90px] gap-3 items-center">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
                      item.type === "relays" ? "bg-violet-500/10 text-violet-400 border border-violet-500/10" : "bg-slate-500/10 text-slate-400 border border-slate-500/10"
                    }`}>
                      {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-200 truncate">{name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{company}</div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mt-2 sm:mt-0">
                    <Badge variant="outline" className="text-[10px]">{categories[0]}</Badge>
                  </div>

                  {/* Source */}
                  <div className="mt-1 sm:mt-0">
                    {item.type === "relays" ? (
                      <Badge variant="accent" className="text-[10px]">Relays</Badge>
                    ) : (
                      <Badge variant="default" className="text-[10px]">
                        <svg width="8" height="8" viewBox="0 0 24 24" className="mr-0.5">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        </svg>
                        Google
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mt-1 sm:mt-0 flex items-center gap-1 text-xs text-slate-400">
                    <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                    </svg>
                    {rating.toFixed(1)} ({reviewCount})
                  </div>

                  {/* Status */}
                  <div className="mt-1 sm:mt-0">
                    {verified && <Badge variant="success">Verified</Badge>}
                    {!verified && item.type === "relays" && <Badge variant="default">Unverified</Badge>}
                    {!claimed && item.type === "places" && <Badge variant="warning">Unclaimed</Badge>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            No professionals match your filters.
          </div>
        )}
      </Card>

      {/* Detail modal */}
      <Modal
        open={selectedItem !== null}
        title={selectedItem?.type === "relays" ? selectedItem.pro.name : selectedItem?.place.name ?? ""}
        onClose={() => setSelectedItem(null)}
      >
        {selectedItem && (
          <div className="space-y-4">
            {selectedItem.type === "relays" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Company</div>
                    <div className="text-sm text-slate-200">{selectedItem.pro.companyName}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Category</div>
                    <div className="text-sm text-slate-200">{selectedItem.pro.categories.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Rating</div>
                    <div className="text-sm text-slate-200">{selectedItem.pro.rating.toFixed(1)} ({selectedItem.pro.reviewCount} reviews)</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Status</div>
                    <div className="text-sm">
                      {selectedItem.pro.verified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="default">Unverified</Badge>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Service Areas</div>
                    <div className="text-sm text-slate-200">{selectedItem.pro.serviceAreas.join(", ")}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{selectedItem.pro.blurb}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">Verify</Button>
                  <Button size="sm" variant="secondary">Edit</Button>
                  <Button size="sm" variant="danger">Suspend</Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Address</div>
                    <div className="text-sm text-slate-200">{selectedItem.place.address}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Category</div>
                    <div className="text-sm text-slate-200">{selectedItem.place.categories.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Rating</div>
                    <div className="text-sm text-slate-200">{selectedItem.place.rating.toFixed(1)} ({selectedItem.place.reviewCount} reviews)</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Phone</div>
                    <div className="text-sm text-slate-200">{selectedItem.place.phone ?? "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Email</div>
                    <div className="text-sm text-slate-200">{selectedItem.place.email ?? "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-slate-500 uppercase">Claimed</div>
                    <div className="text-sm">
                      <Badge variant={selectedItem.place.claimed ? "success" : "warning"}>
                        {selectedItem.place.claimed ? "Claimed" : "Unclaimed"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">Send Outreach Email</Button>
                  <Button size="sm" variant="secondary">View on Google</Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
