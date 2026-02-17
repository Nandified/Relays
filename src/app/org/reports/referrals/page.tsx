"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { mockOrganizations, getReferralData, getOrgMembers } from "@/lib/mock-org-data";
import type { OrgReferralData, ProServiceCategory } from "@/lib/types";

/* ── Bar Chart (CSS-only, no deps) ────────────────────────────── */

function HorizontalBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-600 dark:text-slate-400 w-28 truncate shrink-0">{label}</span>
      <div className="flex-1 h-6 rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden relative">
        <div
          className={`h-full rounded-lg transition-all duration-700 ease-out ${color}`}
          style={{ width: `${width}%` }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
          {value}
        </span>
      </div>
    </div>
  );
}

/* ── Category Color Map ───────────────────────────────────────── */

function getCategoryColor(cat: ProServiceCategory): string {
  const map: Record<string, string> = {
    "Mortgage Lender": "bg-blue-500/70",
    "Attorney": "bg-purple-500/70",
    "Home Inspector": "bg-emerald-500/70",
    "Insurance Agent": "bg-amber-500/70",
    "Realtor": "bg-cyan-500/70",
  };
  return map[cat] ?? "bg-slate-300 dark:bg-slate-500/70";
}

function getCategoryBadge(cat: ProServiceCategory) {
  const map: Record<string, "accent" | "success" | "warning" | "default"> = {
    "Mortgage Lender": "accent",
    "Attorney": "default",
    "Home Inspector": "success",
    "Insurance Agent": "warning",
    "Realtor": "accent",
  };
  return map[cat] ?? "default";
}

/* ── Conversion Rate Badge ────────────────────────────────────── */

function ConversionBadge({ rate }: { rate: number }) {
  const pct = Math.round(rate * 100);
  const variant = pct >= 80 ? "success" : pct >= 60 ? "warning" : "danger";
  return <Badge variant={variant}>{pct}%</Badge>;
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function ReferralRoutingReport() {
  const org = mockOrganizations[0];
  const referrals = getReferralData(org.id);
  const members = getOrgMembers(org.id);
  const agents = members.filter((m) => ["agent", "manager"].includes(m.role));

  const [filterAgent, setFilterAgent] = React.useState("all");
  const [filterCategory, setFilterCategory] = React.useState("all");

  const filtered = referrals.filter((r) => {
    if (filterAgent !== "all" && r.agentId !== filterAgent) return false;
    if (filterCategory !== "all" && r.partnerCategory !== filterCategory) return false;
    return true;
  });

  // Stats
  const totalReferrals = filtered.reduce((sum, r) => sum + r.referralCount, 0);
  const avgConversion = filtered.length > 0
    ? filtered.reduce((sum, r) => sum + r.conversionRate, 0) / filtered.length
    : 0;

  // Top partners by referral count
  const partnerTotals = new Map<string, { name: string; count: number; category: ProServiceCategory }>();
  for (const r of filtered) {
    const existing = partnerTotals.get(r.partnerId);
    if (existing) {
      existing.count += r.referralCount;
    } else {
      partnerTotals.set(r.partnerId, { name: r.partnerName, count: r.referralCount, category: r.partnerCategory });
    }
  }
  const topPartners = Array.from(partnerTotals.values()).sort((a, b) => b.count - a.count);
  const maxPartnerCount = topPartners[0]?.count ?? 0;

  // Per-agent breakdown
  const agentTotals = new Map<string, { name: string; count: number; partners: number }>();
  for (const r of filtered) {
    const existing = agentTotals.get(r.agentId);
    if (existing) {
      existing.count += r.referralCount;
      existing.partners++;
    } else {
      agentTotals.set(r.agentId, { name: r.agentName, count: r.referralCount, partners: 1 });
    }
  }
  const agentBreakdown = Array.from(agentTotals.values()).sort((a, b) => b.count - a.count);
  const maxAgentCount = agentBreakdown[0]?.count ?? 0;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Referral Routing</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track who refers whom and conversion rates</p>
        </div>
        <Button variant="secondary">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mr-1.5">
            <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Referrals</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">{totalReferrals}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Avg Conversion</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">{Math.round(avgConversion * 100)}%</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Unique Partners</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">{partnerTotals.size}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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
            { value: "all", label: "All Categories" },
            { value: "Mortgage Lender", label: "Mortgage Lender" },
            { value: "Attorney", label: "Attorney" },
            { value: "Home Inspector", label: "Home Inspector" },
            { value: "Insurance Agent", label: "Insurance Agent" },
          ]}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-44"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Partners Chart */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Top Referral Partners</h3>
          <div className="space-y-3">
            {topPartners.map((p) => (
              <HorizontalBar
                key={p.name}
                value={p.count}
                max={maxPartnerCount}
                label={p.name}
                color={getCategoryColor(p.category)}
              />
            ))}
            {topPartners.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-6">No data</p>
            )}
          </div>
        </Card>

        {/* Per-Agent Breakdown */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">Referrals by Agent</h3>
          <div className="space-y-3">
            {agentBreakdown.map((a) => (
              <HorizontalBar
                key={a.name}
                value={a.count}
                max={maxAgentCount}
                label={a.name}
                color="bg-blue-500/70"
              />
            ))}
            {agentBreakdown.length === 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-6">No data</p>
            )}
          </div>
        </Card>
      </div>

      {/* Detail Table */}
      <Card padding="none">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Referral Detail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Agent</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Partner</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Count</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Conversion</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Last Referral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered
                .sort((a, b) => b.referralCount - a.referralCount)
                .map((ref) => (
                <tr key={ref.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{ref.agentName}</td>
                  <td className="px-4 py-3 text-sm text-slate-800 dark:text-slate-200 font-medium">{ref.partnerName}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant={getCategoryBadge(ref.partnerCategory)}>{ref.partnerCategory}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{ref.referralCount}</span>
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <ConversionBadge rate={ref.conversionRate} />
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                      {new Date(ref.lastReferralAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-600 dark:text-slate-400">
                    No referral data for selected filters
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
