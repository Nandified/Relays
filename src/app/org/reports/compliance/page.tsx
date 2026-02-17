"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import type { OrgAuditAction } from "@/lib/types";
import { mockOrganizations, getAuditLogs, getOrgMembers } from "@/lib/mock-org-data";

/* ── Action label + variant map ───────────────────────────────── */

const ACTION_INFO: Record<string, { label: string; variant: "accent" | "success" | "warning" | "default" | "danger"; icon: string }> = {
  member_invited: { label: "Member Invited", variant: "accent", icon: "📧" },
  member_joined: { label: "Member Joined", variant: "success", icon: "✅" },
  member_deactivated: { label: "Member Deactivated", variant: "danger", icon: "🚫" },
  role_changed: { label: "Role Changed", variant: "warning", icon: "🔄" },
  journey_created: { label: "Journey Created", variant: "success", icon: "🏠" },
  journey_reassigned: { label: "Journey Reassigned", variant: "warning", icon: "↪️" },
  journey_updated: { label: "Journey Updated", variant: "accent", icon: "📝" },
  partner_recommended: { label: "Partner Recommended", variant: "accent", icon: "🤝" },
  partner_approved: { label: "Partner Approved", variant: "success", icon: "✓" },
  verification_submitted: { label: "Verification Submitted", variant: "warning", icon: "🛡" },
  settings_updated: { label: "Settings Updated", variant: "default", icon: "⚙" },
  step_in_granted: { label: "Step-In Granted", variant: "warning", icon: "🔓" },
  step_in_used: { label: "Step-In Used", variant: "accent", icon: "👤" },
  report_exported: { label: "Report Exported", variant: "default", icon: "📊" },
};

/* ── Page ──────────────────────────────────────────────────────── */

export default function ComplianceAuditPage() {
  const org = mockOrganizations[0];
  const allLogs = getAuditLogs(org.id);
  const members = getOrgMembers(org.id);
  const uniqueActors = [...new Set(allLogs.map((l) => l.performedByName))];

  const [filterAgent, setFilterAgent] = React.useState("all");
  const [filterAction, setFilterAction] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = allLogs.filter((log) => {
    if (filterAgent !== "all" && log.performedByName !== filterAgent) return false;
    if (filterAction !== "all" && log.action !== filterAction) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !log.details.toLowerCase().includes(q) &&
        !log.performedByName.toLowerCase().includes(q) &&
        !(log.targetUserName?.toLowerCase().includes(q)) &&
        !(log.targetJourneyTitle?.toLowerCase().includes(q))
      ) return false;
    }
    return true;
  });

  // Action type counts for summary
  const actionCounts = new Map<string, number>();
  for (const log of allLogs) {
    actionCounts.set(log.action, (actionCounts.get(log.action) ?? 0) + 1);
  }

  const handleExport = () => {
    // Mock export — just show alert
    alert("CSV export would download here. (Mock)");
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Compliance & Audit Trail</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Full audit trail for RESPA compliance monitoring · {allLogs.length} entries
          </p>
        </div>
        <Button variant="secondary" onClick={handleExport}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mr-1.5">
            <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to CSV
        </Button>
      </div>

      {/* RESPA Notice */}
      <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4 flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-300">RESPA Compliance Trail</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Every partner recommendation, referral routing, and disclosure is logged with immutable timestamps.
            Export this data to demonstrate compliance with RESPA requirements.
          </p>
        </div>
      </div>

      {/* Action Type Summary */}
      <div className="flex flex-wrap gap-2">
        {Array.from(actionCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([action, count]) => {
            const info = ACTION_INFO[action] ?? { label: action, variant: "default" as const, icon: "•" };
            return (
              <button
                key={action}
                onClick={() => setFilterAction(filterAction === action ? "all" : action)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                  filterAction === action
                    ? "bg-blue-500/12 text-blue-700 dark:text-blue-300 border-blue-500/20"
                    : "bg-black/[0.03] dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border-[var(--border)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span>{info.icon}</span>
                <span>{info.label}</span>
                <span className="text-slate-500 dark:text-slate-400 tabular-nums">{count}</span>
              </button>
            );
          })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-sm">
          <Input placeholder="Search audit trail..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select
          options={[
            { value: "all", label: "All Members" },
            ...uniqueActors.map((a) => ({ value: a, label: a })),
          ]}
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="w-44"
        />
      </div>

      {/* Audit Log Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider w-40">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Performed By</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Journey</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((log) => {
                const info = ACTION_INFO[log.action] ?? { label: log.action, variant: "default" as const, icon: "•" };
                return (
                  <tr key={log.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-600 dark:text-slate-400 tabular-nums whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {new Date(log.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
                          {log.performedByName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-slate-800 dark:text-slate-200 truncate">{log.performedByName}</p>
                          {log.targetUserName && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">→ {log.targetUserName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={info.variant}>
                        {info.icon} {info.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {log.targetJourneyTitle ? (
                        <span className="text-xs text-slate-600 dark:text-slate-400">{log.targetJourneyTitle}</span>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">{log.details}</p>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-600 dark:text-slate-400">
                    No audit entries match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
