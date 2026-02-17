"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { ROLE_META } from "@/lib/rbac";
import type { Journey, OrgRole } from "@/lib/types";
import {
  mockOrganizations,
  getOrgJourneys,
  getOrgMembers,
  MOCK_CURRENT_USER,
} from "@/lib/mock-org-data";

/* ── Stage Badge ──────────────────────────────────────────────── */

function StageBadge({ journey }: { journey: Journey }) {
  const filledCount = journey.roles.filter((r) => r.status === "filled").length;
  const total = journey.roles.length;

  if (journey.status === "completed") {
    return <Badge variant="success">Completed</Badge>;
  }
  if (filledCount === total) {
    return <Badge variant="success">All Roles Filled</Badge>;
  }
  if (filledCount >= 3) {
    return <Badge variant="accent">In Progress ({filledCount}/{total})</Badge>;
  }
  return <Badge variant="warning">Early Stage ({filledCount}/{total})</Badge>;
}

/* ── Role Dots ────────────────────────────────────────────────── */

function RoleDots({ journey }: { journey: Journey }) {
  return (
    <div className="flex items-center gap-1">
      {journey.roles.map((role, i) => (
        <div
          key={i}
          title={`${role.category}: ${role.status}`}
          className={`h-2 w-2 rounded-full ${
            role.status === "filled"
              ? "bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.4)]"
              : role.status === "recommended"
              ? "bg-blue-400 shadow-[0_0_4px_rgba(59,130,246,0.3)]"
              : "bg-black/5 dark:bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

/* ── Journey Detail Slide-Over ────────────────────────────────── */

function JourneyDetail({ journey, onClose, userRole }: { journey: Journey; onClose: () => void; userRole: OrgRole }) {
  const isReadOnly = userRole === "manager" || userRole === "assistant";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-lg animate-in bg-[var(--bg-card)] border-l border-[var(--border)] shadow-[var(--shadow-elevated)] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{journey.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{journey.address}</p>
            </div>
            <button onClick={onClose} className="rounded-full p-1 text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {isReadOnly && (
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 px-3 py-2 flex items-center gap-2">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-amber-400 shrink-0"><path d="M12 9v2m0 4h.01" /></svg>
              <span className="text-xs text-amber-300">Read-only view — {ROLE_META[userRole].label} access</span>
            </div>
          )}

          {/* Client Info */}
          <Card>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Client</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-800 dark:text-slate-200">{journey.client.name}</span>
                <Badge variant={journey.property.type === "buying" ? "accent" : "warning"}>{journey.property.type}</Badge>
              </div>
              <p className="text-xs text-slate-500">{journey.client.email}</p>
              <p className="text-xs text-slate-500">{journey.client.phone}</p>
            </div>
          </Card>

          {/* Journey Roles */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Service Team</h3>
            <div className="space-y-2">
              {journey.roles.map((role, i) => (
                <div key={i} className={`rounded-xl border p-3 ${
                  role.status === "filled"
                    ? "border-emerald-500/15 bg-emerald-500/5"
                    : role.status === "recommended"
                    ? "border-blue-500/15 bg-blue-500/5"
                    : "border-[var(--border)] bg-black/[0.02] dark:bg-white/[0.02]"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{role.category}</span>
                    <Badge variant={role.status === "filled" ? "success" : role.status === "recommended" ? "accent" : "default"}>
                      {role.status}
                    </Badge>
                  </div>
                  {role.assignedProId && (
                    <p className="text-xs text-slate-500 mt-1">Assigned: {role.assignedProId}</p>
                  )}
                  {role.recommendedProIds.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">{role.recommendedProIds.length} recommended</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <Card>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Created</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">{new Date(journey.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Next Step</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">{journey.nextStep}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Agent</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">{journey.owner}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function OrgJourneysPage() {
  const org = mockOrganizations[0];
  const allJourneys = getOrgJourneys(org.id);
  const members = getOrgMembers(org.id);
  const agents = members.filter((m) => ["agent", "manager", "admin"].includes(m.role));
  const currentRole = MOCK_CURRENT_USER.role;

  const [selectedJourney, setSelectedJourney] = React.useState<Journey | null>(null);
  const [filterAgent, setFilterAgent] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = allJourneys.filter((j) => {
    if (filterAgent !== "all" && j.createdByProId !== filterAgent) return false;
    if (filterStatus !== "all" && j.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!j.title.toLowerCase().includes(q) && !j.client.name.toLowerCase().includes(q) && !j.address.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const activeCount = allJourneys.filter((j) => j.status === "active").length;
  const completedCount = allJourneys.filter((j) => j.status === "completed").length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Journeys</h1>
          <p className="text-sm text-slate-500 mt-1">
            {allJourneys.length} total · {activeCount} active · {completedCount} completed
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-sm">
          <Input placeholder="Search journeys..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select
          options={[
            { value: "all", label: "All Agents" },
            ...agents.map((a) => ({ value: a.userId, label: a.name })),
          ]}
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="w-44"
        />
        <Select
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-36"
        />
      </div>

      {/* Journeys Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Property</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Agent</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Roles</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((journey) => (
                <tr
                  key={journey.id}
                  onClick={() => setSelectedJourney(journey)}
                  className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-white transition-colors truncate">{journey.title}</p>
                      <p className="text-xs text-slate-500 truncate">{journey.address}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{journey.client.name}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{journey.owner}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StageBadge journey={journey} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <RoleDots journey={journey} />
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-xs text-slate-500 tabular-nums">
                      {new Date(journey.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                    No journeys match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Journey Detail Slide-Over */}
      {selectedJourney && (
        <JourneyDetail
          journey={selectedJourney}
          onClose={() => setSelectedJourney(null)}
          userRole={currentRole}
        />
      )}
    </div>
  );
}
