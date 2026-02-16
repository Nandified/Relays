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
const STATES = ["IL"];

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
  const [bulkAction, setBulkAction] = React.useState<string | null>(null);

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

    return items;
  }, [pros, search, categoryFilter, verifiedFilter, claimedFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(p => p.id)));
    }
  };

  const handleBulkVerify = () => {
    setPros(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, verified: true } : p));
    setSelectedIds(new Set());
    setBulkAction(null);
  };

  const handleBulkSuspend = () => {
    setPros(prev => prev.map(p => selectedIds.has(p.id) ? { ...p, status: "suspended" as const } : p));
    setSelectedIds(new Set());
    setBulkAction(null);
  };

  const handleExport = () => {
    // Mock export
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

  const statusTabs = [
    { id: "all", label: "All Pros", count: pros.length },
    { id: "claimed", label: "Claimed", count: pros.filter(p => p.claimed).length },
    { id: "unclaimed", label: "Unclaimed", count: pros.filter(p => !p.claimed).length },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Pro Management</h1>
          <p className="mt-1 text-sm text-slate-400">
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
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-violet-500/50"
        >
          <option value="all">All Categories</option>
          {SERVICE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-violet-500/50"
        >
          <option value="all">All Statuses</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-4 py-2.5">
          <span className="text-sm font-medium text-violet-300">{selectedIds.size} selected</span>
          <div className="h-4 w-px bg-violet-500/20" />
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={handleBulkVerify}>
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
      <div className="mb-3 text-sm text-slate-500">
        {filtered.length} professional{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        {/* Table header */}
        <div className="hidden lg:grid lg:grid-cols-[40px_1fr_130px_100px_80px_90px_90px_70px] gap-3 items-center border-b border-[var(--border)] bg-white/[0.02] px-4 py-2.5">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedIds.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll}
              className="h-3.5 w-3.5 rounded border-[var(--border)] bg-transparent accent-violet-500"
            />
          </div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Professional</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Category</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Location</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Status</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Verified</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Rating</div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Joined</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--border)]">
          {filtered.map((pro) => (
            <div
              key={pro.id}
              className={`lg:grid lg:grid-cols-[40px_1fr_130px_100px_80px_90px_90px_70px] gap-3 items-center px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                selectedIds.has(pro.id) ? "bg-violet-500/5" : ""
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
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold border ${
                  pro.claimed
                    ? "bg-violet-500/10 text-violet-400 border-violet-500/10"
                    : "bg-slate-500/10 text-slate-500 border-slate-500/10"
                }`}>
                  {pro.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-200 truncate">{pro.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{pro.companyName}</div>
                </div>
              </div>

              {/* Category */}
              <div className="mt-2 lg:mt-0">
                <Badge variant="outline" className="text-[10px]">{pro.category}</Badge>
              </div>

              {/* Location */}
              <div className="mt-1 lg:mt-0 text-xs text-slate-400">
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
                    <div className="h-2 w-2 rounded-full bg-slate-600" />
                    <span className="text-xs text-slate-500">No</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="mt-1 lg:mt-0">
                {pro.rating > 0 ? (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 20 20">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.49L10 13.63 5.06 16.1 6 10.61l-4-3.9 5.61-.87z" />
                    </svg>
                    <span className="tabular-nums">{pro.rating.toFixed(1)}</span>
                    <span className="text-slate-600">({pro.reviewCount})</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-600">—</span>
                )}
              </div>

              {/* Joined */}
              <div className="mt-1 lg:mt-0 text-[11px] text-slate-500">
                {formatDate(pro.joinedAt)}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-slate-500">
            No professionals match your filters.
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
            {/* Status badges row */}
            <div className="flex flex-wrap gap-2">
              {selectedPro.claimed ? <Badge variant="success">Claimed</Badge> : <Badge variant="default">Unclaimed</Badge>}
              {selectedPro.verified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Unverified</Badge>}
              {selectedPro.status === "suspended" && <Badge variant="danger">Suspended</Badge>}
              <Badge variant="outline">{selectedPro.category}</Badge>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Company" value={selectedPro.companyName} />
              <InfoField label="Category" value={selectedPro.category} />
              <InfoField label="Location" value={`${selectedPro.city}, ${selectedPro.state}`} />
              <InfoField label="Email" value={selectedPro.email || "—"} />
              <InfoField label="Phone" value={selectedPro.phone || "—"} />
              <InfoField label="Joined" value={formatDate(selectedPro.joinedAt)} />
              <InfoField label="Rating" value={selectedPro.rating > 0 ? `${selectedPro.rating.toFixed(1)} (${selectedPro.reviewCount} reviews)` : "No reviews"} />
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
      <div className="mt-0.5 text-sm text-slate-200">{value}</div>
    </div>
  );
}
