"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { mockAdminProList, type AdminProListItem } from "@/lib/mock-admin-data";

const SERVICE_CATEGORIES = ["Realtor", "Mortgage Lender", "Attorney", "Home Inspector", "Insurance Agent"];
const PAGE_SIZE = 10;

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminProsPage() {
  const [pros, setPros] = React.useState(mockAdminProList);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = React.useState<string>("all");
  const [claimedFilter, setClaimedFilter] = React.useState<string>("all");
  const [selectedPro, setSelectedPro] = React.useState<AdminProListItem | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortField, setSortField] = React.useState<string>("name");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  // Filter
  const filtered = React.useMemo(() => {
    let items = pros;

    if (categoryFilter !== "all") {
      items = items.filter(p => p.category === categoryFilter);
    }
    if (verifiedFilter === "verified") items = items.filter(p => p.verified);
    if (verifiedFilter === "unverified") items = items.filter(p => !p.verified);
    if (claimedFilter === "claimed") items = items.filter(p => p.claimed);
    if (claimedFilter === "unclaimed") items = items.filter(p => !p.claimed);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(p =>
        [p.name, p.companyName, p.city, p.category, p.email].join(" ").toLowerCase().includes(q)
      );
    }

    // Sort
    items = [...items].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "rating") cmp = a.rating - b.rating;
      else if (sortField === "joined") cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });

    return items;
  }, [pros, search, categoryFilter, verifiedFilter, claimedFilter, sortField, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  React.useEffect(() => { setCurrentPage(1); }, [search, categoryFilter, verifiedFilter, claimedFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map(p => p.id)));
    }
  };

  const handleBulkVerify = () => {
    setPros(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, verified: true } : p));
    setSelectedIds(new Set());
  };

  const handleBulkSuspend = () => {
    setPros(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, status: "suspended" as const } : p));
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    const csv = ["Name,Category,City,State,Verified,Claimed,Email"]
      .concat(filtered.map(p => `${p.name},${p.category},${p.city},${p.state},${p.verified},${p.claimed},${p.email}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relays-pros-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const statusTabs = [
    { id: "all", label: "All Pros", count: pros.length },
    { id: "claimed", label: "Claimed", count: pros.filter(p => p.claimed).length },
    { id: "unclaimed", label: "Unclaimed", count: pros.filter(p => !p.claimed).length },
  ];

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <svg width="10" height="10" viewBox="0 0 10 10" className="text-slate-700"><path d="M5 2L8 5H2z M5 8L2 5H8z" fill="currentColor" /></svg>;
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" className="text-violet-400">
        {sortDir === "asc" ? <path d="M5 2L8 5H2z" fill="currentColor" /> : <path d="M5 8L2 5H8z" fill="currentColor" />}
      </svg>
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pro Management</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage all professionals across the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleExport}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1.5">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      {/* Claimed/unclaimed tabs */}
      <div className="mb-4">
        <Tabs tabs={statusTabs} activeId={claimedFilter === "all" ? "all" : claimedFilter} onChange={(id) => setClaimedFilter(id === "all" ? "all" : id)} />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name, company, city, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-violet-500/50 transition-colors"
        >
          <option value="all">All Categories</option>
          {SERVICE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-violet-500/50 transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-4 py-2.5 animate-in">
          <span className="text-sm font-medium text-violet-300">{selectedIds.size} selected</span>
          <div className="h-4 w-px bg-violet-500/20" />
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.2)]" onClick={handleBulkVerify}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><path d="M20 6L9 17l-5-5" /></svg>
            Verify All
          </Button>
          <Button size="sm" variant="danger" onClick={handleBulkSuspend}>
            Suspend
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {filtered.length} professional{filtered.length !== 1 ? "s" : ""}
          {totalPages > 1 && <span className="text-slate-500 dark:text-slate-600"> · Page {currentPage} of {totalPages}</span>}
        </span>
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="hidden lg:grid lg:grid-cols-[40px_1fr_130px_100px_80px_90px_90px_80px] gap-3 items-center border-b border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5 min-w-[800px]">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedIds.size === paginated.length && paginated.length > 0}
                onChange={toggleSelectAll}
                className="h-3.5 w-3.5 rounded border-[var(--border)] bg-transparent accent-violet-500"
              />
            </div>
            <button onClick={() => handleSort("name")} className="flex items-center gap-1 text-[11px] font-medium text-slate-500 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Professional <SortIcon field="name" />
            </button>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Category</div>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Location</div>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Status</div>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Verified</div>
            <button onClick={() => handleSort("rating")} className="flex items-center gap-1 text-[11px] font-medium text-slate-500 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Rating <SortIcon field="rating" />
            </button>
            <button onClick={() => handleSort("joined")} className="flex items-center gap-1 text-[11px] font-medium text-slate-500 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Joined <SortIcon field="joined" />
            </button>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[var(--border)] min-w-[800px]">
            {paginated.map((pro) => (
              <div
                key={pro.id}
                className={`group lg:grid lg:grid-cols-[40px_1fr_130px_100px_80px_90px_90px_80px] gap-3 items-center px-4 py-3 transition-all duration-200 cursor-pointer ${
                  selectedIds.has(pro.id) ? "bg-violet-500/[0.06]" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                }`}
                onClick={() => setSelectedPro(pro)}
              >
                {/* Checkbox */}
                <div className="hidden lg:flex items-center" onClick={(e) => { e.stopPropagation(); toggleSelect(pro.id); }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(pro.id)}
                    onChange={() => toggleSelect(pro.id)}
                    className="h-3.5 w-3.5 rounded border-[var(--border)] bg-transparent accent-violet-500"
                  />
                </div>

                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold border transition-transform group-hover:scale-105 ${
                    pro.claimed
                      ? "bg-violet-500/10 text-violet-400 border-violet-500/10"
                      : "bg-slate-300 dark:bg-slate-400 dark:bg-slate-500/10 text-slate-500 border-slate-300 dark:border-slate-500/10"
                  }`}>
                    {pro.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">{pro.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{pro.companyName}</div>
                  </div>
                </div>

                {/* Category */}
                <div className="mt-2 lg:mt-0">
                  <Badge variant="outline" className="text-[10px]">{pro.category}</Badge>
                </div>

                {/* Location */}
                <div className="mt-1 lg:mt-0 text-xs text-slate-500 dark:text-slate-400">
                  {pro.city}, {pro.state}
                </div>

                {/* Status */}
                <div className="mt-1 lg:mt-0">
                  {pro.claimed ? (
                    <Badge variant="success" className="text-[10px]">Claimed</Badge>
                  ) : (
                    <Badge variant="default" className="text-[10px]">Unclaimed</Badge>
                  )}
                </div>

                {/* Verified */}
                <div className="mt-1 lg:mt-0">
                  {pro.verified ? (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                      <span className="text-xs text-emerald-400">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="text-xs text-slate-500">No</span>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="mt-1 lg:mt-0">
                  {pro.rating > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                        <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                      </svg>
                      <span className="tabular-nums">{pro.rating.toFixed(1)}</span>
                      <span className="text-slate-500 dark:text-slate-600">({pro.reviewCount})</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-600">—</span>
                  )}
                </div>

                {/* Joined */}
                <div className="mt-1 lg:mt-0 text-[11px] text-slate-500">
                  {formatDate(pro.joinedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] text-slate-500 dark:text-slate-600">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No professionals found</p>
            <p className="text-xs text-slate-500 dark:text-slate-600 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 bg-black/[0.01] dark:bg-white/[0.01]">
            <Button
              size="sm"
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ← Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-7 min-w-[28px] rounded-lg text-xs font-medium transition-all ${
                    page === currentPage
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next →
            </Button>
          </div>
        )}
      </Card>

      {/* Detail Panel */}
      <Modal
        open={selectedPro !== null}
        title={selectedPro?.name ?? ""}
        onClose={() => setSelectedPro(null)}
      >
        {selectedPro && (
          <div className="space-y-5">
            {/* Avatar + status row */}
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold border ${
                selectedPro.claimed
                  ? "bg-violet-500/10 text-violet-400 border-violet-500/10"
                  : "bg-slate-300 dark:bg-slate-400 dark:bg-slate-500/10 text-slate-500 border-slate-300 dark:border-slate-500/10"
              }`}>
                {selectedPro.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{selectedPro.name}</div>
                <div className="text-xs text-slate-500">{selectedPro.companyName}</div>
              </div>
            </div>

            {/* Status badges row */}
            <div className="flex flex-wrap gap-2">
              {selectedPro.claimed ? <Badge variant="success">Claimed</Badge> : <Badge variant="default">Unclaimed</Badge>}
              {selectedPro.verified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Unverified</Badge>}
              {selectedPro.status === "suspended" && <Badge variant="danger">Suspended</Badge>}
              <Badge variant="outline">{selectedPro.category}</Badge>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Location" value={`${selectedPro.city}, ${selectedPro.state}`} />
              <InfoField label="Email" value={selectedPro.email || "—"} />
              <InfoField label="Phone" value={selectedPro.phone || "—"} />
              <InfoField label="Joined" value={formatDate(selectedPro.joinedAt)} />
              <InfoField label="Rating" value={selectedPro.rating > 0 ? `${selectedPro.rating.toFixed(1)} (${selectedPro.reviewCount} reviews)` : "No reviews"} />
              <InfoField label="Category" value={selectedPro.category} />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
              {!selectedPro.verified && (
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  onClick={() => {
                    setPros(prev => prev.map(p => p.id === selectedPro.id ? { ...p, verified: true } : p));
                    setSelectedPro({ ...selectedPro, verified: true });
                  }}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1"><path d="M20 6L9 17l-5-5" /></svg>
                  Verify
                </Button>
              )}
              <Button size="sm" variant="secondary">Edit Profile</Button>
              {selectedPro.status !== "suspended" ? (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    setPros(prev => prev.map(p => p.id === selectedPro.id ? { ...p, status: "suspended" as const } : p));
                    setSelectedPro({ ...selectedPro, status: "suspended" });
                  }}
                >
                  Suspend
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => {
                    setPros(prev => prev.map(p => p.id === selectedPro.id ? { ...p, status: "active" as const } : p));
                    setSelectedPro({ ...selectedPro, status: "active" });
                  }}
                >
                  Reinstate
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">{value}</div>
    </div>
  );
}
